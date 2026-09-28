/**
 * @file vite.config.ts
 * Vite configuration for VV Studio website.
 *
 * Configures:
 * - React 19 + React Compiler presets via `@vitejs/plugin-react` and `@rolldown/plugin-babel`
 * - Tailwind CSS v4 via `@tailwindcss/vite`
 * - Static Site Generation (SSG) via `vite-prerender-plugin` (invoking `src/prerender.tsx`)
 * - Dual pre-compression: Gzip via `vite-plugin-compression` + Brotli via custom `brotliStatic`
 * - Event loop unblocking & socket cleanup via `eventLoopCleanup`
 * - Granular vendor chunk splitting via `rollupOptions.output.manualChunks`
 */

import path from 'path';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';
import http from 'node:http';
import https from 'node:https';
import { MessagePort } from 'node:worker_threads';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

// CRITICAL EVENT-LOOP UNBLOCK FIX:
// React 18/19 scheduler keeps a Node MessagePort open, causing Vite SSG
// builds to hang indefinitely after prerendering finishes.
if (MessagePort && MessagePort.prototype) {
  const origOn = Object.getOwnPropertyDescriptor(MessagePort.prototype, 'onmessage');
  if (origOn && origOn.set) {
    Object.defineProperty(MessagePort.prototype, 'onmessage', {
      set(fn) {
        origOn.set!.call(this, fn);
        const port = this as MessagePort & { unref?: () => void };
        if (fn && typeof port.unref === 'function') {
          port.unref();
        }
      },
      get() {
        return origOn.get?.call(this);
      },
      configurable: true,
      enumerable: true,
    });
  }
}

/**
 * Vite plugin that releases active event-loop handles to prevent build hangs.
 *
 * @summary Build completion and event-loop cleanup plugin.
 * @returns Vite Plugin instance for the build lifecycle.
 *
 * @why During SSG prerendering, live API queries made by `axios` keep keep-alive TCP
 *      sockets alive in Node's globalAgent pool. Without destroying these sockets and unreffing
 *      lingering handles, the Node/Bun event loop never drains, causing `vite build` to hang.
 * @when Runs exclusively during `vite build` inside the `closeBundle` hook after all assets are emitted.
 */
function eventLoopCleanup(): Plugin {
  return {
    name: 'event-loop-cleanup',
    apply: 'build',
    closeBundle() {
      // 1. Terminate all pooled HTTP/HTTPS keep-alive connections
      http.globalAgent.destroy();
      https.globalAgent.destroy();

      // 2. Unref or destroy any remaining active handles (sockets, message ports, timers)
      // @ts-expect-error internal node handle inspector
      const handles = process._getActiveHandles?.() ?? [];
      for (const h of handles) {
        if (typeof h?.destroy === 'function') {
          h.destroy();
        } else if (typeof h?.unref === 'function') {
          h.unref();
        }
      }

      // 3. Gracefully exit the build process so subsequent scripts (sitemap generator) run
      setTimeout(() => {
        process.exit(0);
      }, 100);
    },
  };
}

/**
 * Pre-compresses emitted static text assets with Brotli at maximum compression quality (level 11).
 *
 * @summary Brotli static pre-compression build plugin.
 * @param threshold - Minimum file size in bytes to qualify for compression (defaults to 1024 bytes).
 * @returns Vite Plugin instance.
 *
 * @why Static web hosts (Nginx, Cloudflare, Apache) can serve pre-compressed `.br` files directly,
 *      achieving 15-25% smaller payload sizes than standard Gzip with zero on-the-fly CPU cost.
 *      Zero extra dependencies — uses native `node:zlib`.
 * @when Runs during `vite build` inside the `closeBundle` hook, walking through the output `dist` directory.
 */
function brotliStatic(threshold = 1024): Plugin {
  const filter = /\.(js|css|html|svg|json)$/i;
  return {
    name: 'brotli-static',
    apply: 'build',
    closeBundle() {
      const walk = (dir: string): void => {
        for (const entry of readdirSync(dir)) {
          const full = join(dir, entry);
          if (statSync(full).isDirectory()) {
            walk(full);
            continue;
          }
          if (!filter.test(full) || full.endsWith('.br')) continue;
          const size = statSync(full).size;
          if (size < threshold) continue;
          const compressed = brotliCompressSync(readFileSync(full), {
            params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
          });
          writeFileSync(`${full}.br`, compressed);
          console.log(
            `brotli: ${full} ${(size / 1024).toFixed(1)}kB → ${(compressed.length / 1024).toFixed(1)}kB`,
          );
        }
      };
      walk('dist');
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    // Simple SSG: prerenders every route (incl. live /blog/:slug) with
    // per-route head + JSON-LD. See src/prerender.tsx (live API, best-effort).
    vitePrerenderPlugin({
      prerenderScript: path.resolve(import.meta.dirname, 'src/prerender.tsx'),
      renderTarget: '#root',
    }),
    // Pre-compressed bytes for hosts that serve them (gzip + brotli).
    // @ts-expect-error vite-plugin-compression ships CJS-style types; default import is callable at runtime
    compression({ algorithm: 'gzip', threshold: 1024 }),
    brotliStatic(),
    eventLoopCleanup(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        /**
         * Custom code-splitting strategy to keep the critical-path entry chunk lean.
         *
         * @summary Manual chunk divider.
         * @param id - Module path identifier.
         * @returns Chunk name or undefined for default bundling.
         *
         * @why Prevents heavy vendor libraries (motion, lenis, icons, router) from bloating
         *      the initial page load bundle, dramatically improving First Contentful Paint (FCP).
         * @when Evaluated during bundle chunk generation.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          const p = id.replace(/\\/g, '/');
          if (/motion|framer-motion/.test(p)) return 'motion';
          if (/\/lenis\//.test(p)) return 'lenis';
          if (/lucide-react|@radix-ui|radix-ui|@base-ui/.test(p)) return 'ui-vendor';
          if (/react-router/.test(p)) return 'router';
          if (/\/react\/|\/react-dom\/|\/scheduler\//.test(p)) return 'react';
          // NOTE: no manual chunk for @tanstack/react-query/axios — forcing
          // them into their own chunk duplicates the React CJS runtime into
          // it (mixed CJS/ESM interop), which the entry then statically
          // imports. Default code-splitting keeps a single React copy and
          // folds query/axios into the lazy chunks that use them.
          return undefined;
        },
      },
    },
  },
});
