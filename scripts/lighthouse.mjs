#!/usr/bin/env node
/**
 * @file scripts/lighthouse.mjs
 * Automated Lighthouse audit runner with auto-starting preview server support.
 *
 * Runs Google Lighthouse against the built application in headless Chrome, testing
 * mobile, desktop, or both form-factors. If no preview server is running at the target
 * URL, it automatically spawns `vite preview`, waits for health-check readiness, executes
 * the audits, outputs human-readable console scorecards, saves HTML/JSON reports to
 * `lighthouse-reports/`, and shuts down the preview server cleanly.
 *
 * Usage:
 *   node scripts/lighthouse.mjs [--url=http://127.0.0.1:4173/] [--form-factor=mobile|desktop|both] [--threshold=85]
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Parses CLI command-line arguments into typed test configuration.
 *
 * @summary CLI argument parser for Lighthouse audits.
 * @param argv - Array of command-line argument strings (e.g. `process.argv.slice(2)`).
 * @returns Config object with `url`, `formFactor`, and `threshold` score.
 *
 * @why Enables flexible CI/CD testing configurations with custom URLs and score cutoffs.
 * @when Executed at the very start of the script.
 */
function parseArgs(argv) {
  const out = { url: 'http://127.0.0.1:4173/', formFactor: 'both', threshold: 85 };
  for (const a of argv) {
    if (a.startsWith('--url=')) out.url = a.slice('--url='.length);
    else if (a.startsWith('--form-factor=')) out.formFactor = a.slice('--form-factor='.length);
    else if (a === '--mobile') out.formFactor = 'mobile';
    else if (a === '--desktop') out.formFactor = 'desktop';
    else if (a.startsWith('--threshold=')) out.threshold = Number(a.slice('--threshold='.length)) || 85;
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/lighthouse.mjs [--url=...] [--form-factor=mobile|desktop|both] [--threshold=85]');
      process.exit(0);
    }
  }
  if (!['mobile', 'desktop', 'both'].includes(out.formFactor)) out.formFactor = 'both';
  return out;
}

/**
 * Checks if the target URL is actively accepting HTTP requests.
 *
 * @summary Target URL reachability probe.
 * @param url - URL to probe.
 * @returns Promise resolving to `true` if server responds, `false` otherwise.
 *
 * @why Determines whether `vite preview` needs to be spawned automatically or if an existing instance can be reused.
 * @when Called before launching Chrome.
 */
async function isReachable(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return true;
  } catch {
    return false;
  }
}

/**
 * Polls the target URL every second until it becomes reachable or times out.
 *
 * @summary Readiness poller for local preview server.
 * @param url - Target URL.
 * @param timeoutMs - Maximum duration to wait before timing out (defaults to 30,000ms).
 * @returns Promise resolving to `true` if server responded before timeout, `false` otherwise.
 *
 * @why Child process spawns are asynchronous; Lighthouse will crash if Chrome attempts to navigate before the port binds.
 * @when Called after spawning `vite preview`.
 */
async function waitForUrl(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isReachable(url)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return await isReachable(url);
}

/**
 * Generates an ASCII visual progress bar for a 0.0–1.0 score.
 *
 * @summary Console visual score meter.
 * @param score - Score number between 0.0 and 1.0.
 * @returns 20-character block meter string (e.g. `████████████████░░░░`).
 *
 * @why Provides immediate visual feedback in CLI logs and CI pipelines.
 * @when Called when printing Lighthouse category scores.
 */
function bar(score) {
  const filled = Math.round(score * 20);
  return '█'.repeat(filled) + '░'.repeat(20 - filled);
}

/**
 * Formats a metric audit record into a human-readable display string.
 *
 * @summary Metric display formatter.
 * @param audits - Lighthouse audit result dictionary.
 * @param id - Specific audit identifier (e.g. `first-contentful-paint`).
 * @returns String representation of the metric value (e.g. `0.8 s` or `12 ms`).
 *
 * @why Different audits store numbers in milliseconds, seconds, or unitless ratios; displayValue formats them properly.
 * @when Called when printing the Core Web Vitals breakdown in terminal output.
 */
function fmtAudit(audits, id) {
  const a = audits[id];
  if (!a) return 'n/a';
  return a.displayValue ?? (a.numericValue != null ? String(Math.round(a.numericValue)) : 'n/a');
}

/**
 * Executes a single Lighthouse audit run in headless Chrome for a specific form factor.
 *
 * @summary Single form-factor Lighthouse test runner.
 * @param url - Target URL to audit.
 * @param formFactor - 'mobile' or 'desktop'.
 * @param outDir - Directory path where HTML and JSON reports will be saved.
 * @returns The parsed Lighthouse Result (LHR) object.
 *
 * @why Runs isolated tests with tailored screen emulation and device metrics for mobile vs desktop.
 * @when Called for each specified form-factor.
 */
async function runOne(url, formFactor, outDir) {
  // Defensive CJS/ESM interop for chrome-launcher
  const m = await import('chrome-launcher');
  const launcher = m.default ?? m;
  const lhMod = await import('lighthouse');
  const lighthouse = lhMod.default ?? lhMod;

  const chrome = await launcher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  try {
    const screenEmulation =
      formFactor === 'mobile'
        ? { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false }
        : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false };

    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'error',
        formFactor,
        screenEmulation,
      },
    );

    // result.report is an ARRAY when output is ["html","json"]: index 0→html, 1→json
    const reports = Array.isArray(result.report) ? result.report : [result.report];
    const html = reports[0];
    const jsonStr = reports[1];
    const lhr = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : (result.lhr ?? JSON.parse(reports[0]));

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `lighthouse-${formFactor}.html`), html);
    fs.writeFileSync(
      path.join(outDir, `lighthouse-${formFactor}.json`),
      typeof jsonStr === 'string' ? jsonStr : JSON.stringify(lhr, null, 2),
    );

    const cats = lhr.categories ?? {};
    const audits = lhr.audits ?? {};
    console.log(`\n===== Lighthouse (${formFactor}) : ${url} =====`);
    for (const key of ['performance', 'accessibility', 'best-practices', 'seo']) {
      const c = cats[key];
      if (!c) continue;
      const pct = Math.round((c.score ?? 0) * 100);
      console.log(`${key.padEnd(15)} ${String(pct).padStart(3)} ${bar(c.score ?? 0)}`);
    }
    console.log('--- metrics ---');
    console.log(`FCP : ${fmtAudit(audits, 'first-contentful-paint')}`);
    console.log(`LCP : ${fmtAudit(audits, 'largest-contentful-paint')}`);
    console.log(`TBT : ${fmtAudit(audits, 'total-blocking-time')}`);
    console.log(`CLS : ${fmtAudit(audits, 'cumulative-layout-shift')}`);
    console.log(`SI  : ${fmtAudit(audits, 'speed-index')}`);

    // Top insights: diagnostics / opportunities with biggest savings
    const opportunities = Object.values(audits)
      .filter((a) => a && a.details && a.details.type === 'opportunity' && (a.numericValue ?? 0) > 0)
      .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
      .slice(0, 5);
    if (opportunities.length) {
      console.log('--- top opportunities ---');
      for (const o of opportunities) {
        const savings = o.displayValue ? ` (est ${o.displayValue})` : '';
        console.log(`- ${o.id}${savings}: ${o.title ?? ''}`);
      }
    }
    const bootup = audits['bootup-time'];
    if (bootup?.details?.items?.length) {
      console.log('--- bootup-time (top 5) ---');
      for (const item of bootup.details.items.slice(0, 5)) {
        console.log(`- ${item.url ?? item.script ?? 'unknown'} : ${Math.round(item.total ?? item.scripting ?? 0)}ms`);
      }
    }
    const lcpBreakdown = audits['largest-contentful-paint-element'];
    if (lcpBreakdown?.displayValue) console.log(`LCP element: ${lcpBreakdown.displayValue}`);
    const cacheTtl = audits['uses-long-cache-ttl'];
    if (cacheTtl?.displayValue) console.log(`Cache TTL: ${cacheTtl.displayValue}`);
    else if (cacheTtl?.details?.summary) console.log(`Cache TTL: ${JSON.stringify(cacheTtl.details.summary)}`);

    return lhr;
  } finally {
    try {
      await chrome.kill();
    } catch {
      /* ignore — kill() may return undefined on some platforms */
    }
  }
}

/**
 * Main script orchestration entry point.
 *
 * @summary Lighthouse audit supervisor.
 *
 * @why Manages preview server lifecycle, executes audits, evaluates score thresholds, and outputs exit codes.
 * @when Executed via `npm run lighthouse` or `npm run perf`.
 */
async function main() {
  const { url, formFactor, threshold } = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(process.cwd(), 'lighthouse-reports');

  // Auto-start vite preview if the target URL is unreachable.
  let previewProc = null;
  if (!(await isReachable(url))) {
    const u = new URL(url);
    const port = u.port || '4173';
    const host = u.hostname || '127.0.0.1';
    console.log(`Target ${url} unreachable — starting vite preview on ${host}:${port} ...`);
    previewProc = spawn('npx', ['vite', 'preview', '--host', host, '--port', port, '--strictPort'], {
      shell: true,
      stdio: 'inherit',
    });
    const ok = await waitForUrl(url, 30000);
    if (!ok) {
      console.error(`vite preview did not become ready within 30s at ${url}`);
      try {
        previewProc.kill();
      } catch {}
      process.exit(1);
    }
    console.log(`vite preview ready at ${url}`);
  } else {
    console.log(`Target ${url} reachable — reusing existing server.`);
  }

  const factors = formFactor === 'both' ? ['mobile', 'desktop'] : [formFactor];
  let failed = false;
  try {
    for (const f of factors) {
      const lhr = await runOne(url, f, outDir);
      const cats = lhr.categories ?? {};
      for (const [key, c] of Object.entries(cats)) {
        const pct = Math.round(((c).score ?? 0) * 100);
        if (pct < threshold) {
          console.error(`FAIL: ${f} category "${key}" = ${pct} < threshold ${threshold}`);
          failed = true;
        }
      }
    }
  } finally {
    if (previewProc) {
      try {
        previewProc.kill();
      } catch {}
    }
  }

  console.log(`\nReports saved to ${outDir}/`);
  if (failed) {
    console.error(`One or more categories below threshold ${threshold}.`);
    process.exit(1);
  } else {
    console.log(`All categories >= threshold ${threshold}.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
