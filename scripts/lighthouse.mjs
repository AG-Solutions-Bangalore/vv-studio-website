#!/usr/bin/env node
/**
 * Lighthouse audit runner — auto-starts `vite preview` if needed.
 *
 * Usage:
 *   node scripts/lighthouse.mjs [--url=http://127.0.0.1:4173/] [--form-factor=mobile|desktop|both] [--threshold=85]
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

function parseArgs(argv) {
  const out = { url: 'http://127.0.0.1:4173/', formFactor: 'both', threshold: 85 }
  for (const a of argv) {
    if (a.startsWith('--url=')) out.url = a.slice('--url='.length)
    else if (a.startsWith('--form-factor=')) out.formFactor = a.slice('--form-factor='.length)
    else if (a === '--mobile') out.formFactor = 'mobile'
    else if (a === '--desktop') out.formFactor = 'desktop'
    else if (a.startsWith('--threshold=')) out.threshold = Number(a.slice('--threshold='.length)) || 85
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/lighthouse.mjs [--url=...] [--form-factor=mobile|desktop|both] [--threshold=85]')
      process.exit(0)
    }
  }
  if (!['mobile', 'desktop', 'both'].includes(out.formFactor)) out.formFactor = 'both'
  return out
}

async function isReachable(url) {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2500)
    await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    return true
  } catch {
    return false
  }
}

async function waitForUrl(url, timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await isReachable(url)) return true
    await new Promise((r) => setTimeout(r, 1000))
  }
  return await isReachable(url)
}

function bar(score) {
  const filled = Math.round(score * 20)
  return '█'.repeat(filled) + '░'.repeat(20 - filled)
}

function fmtAudit(audits, id) {
  const a = audits[id]
  if (!a) return 'n/a'
  return a.displayValue ?? (a.numericValue != null ? String(Math.round(a.numericValue)) : 'n/a')
}

async function runOne(url, formFactor, outDir) {
  // Defensive CJS/ESM interop for chrome-launcher
  const m = await import('chrome-launcher')
  const launcher = m.default ?? m
  const lhMod = await import('lighthouse')
  const lighthouse = lhMod.default ?? lhMod

  const chrome = await launcher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  })

  try {
    const screenEmulation =
      formFactor === 'mobile'
        ? { mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false }
        : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }

    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'error',
        formFactor,
        screenEmulation,
      },
    )

    // result.report is an ARRAY when output is ["html","json"]: index 0→html, 1→json
    const reports = Array.isArray(result.report) ? result.report : [result.report]
    const html = reports[0]
    const jsonStr = reports[1]
    const lhr = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : (result.lhr ?? JSON.parse(reports[0]))

    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, `lighthouse-${formFactor}.html`), html)
    fs.writeFileSync(
      path.join(outDir, `lighthouse-${formFactor}.json`),
      typeof jsonStr === 'string' ? jsonStr : JSON.stringify(lhr, null, 2),
    )

    const cats = lhr.categories ?? {}
    const audits = lhr.audits ?? {}
    console.log(`\n===== Lighthouse (${formFactor}) : ${url} =====`)
    for (const key of ['performance', 'accessibility', 'best-practices', 'seo']) {
      const c = cats[key]
      if (!c) continue
      const pct = Math.round((c.score ?? 0) * 100)
      console.log(`${key.padEnd(15)} ${String(pct).padStart(3)} ${bar(c.score ?? 0)}`)
    }
    console.log('--- metrics ---')
    console.log(`FCP : ${fmtAudit(audits, 'first-contentful-paint')}`)
    console.log(`LCP : ${fmtAudit(audits, 'largest-contentful-paint')}`)
    console.log(`TBT : ${fmtAudit(audits, 'total-blocking-time')}`)
    console.log(`CLS : ${fmtAudit(audits, 'cumulative-layout-shift')}`)
    console.log(`SI  : ${fmtAudit(audits, 'speed-index')}`)
    // Top insights: diagnostics / opportunities with biggest savings
    const opportunities = Object.values(audits)
      .filter((a) => a && a.details && a.details.type === 'opportunity' && (a.numericValue ?? 0) > 0)
      .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
      .slice(0, 5)
    if (opportunities.length) {
      console.log('--- top opportunities ---')
      for (const o of opportunities) {
        const savings = o.displayValue ? ` (est ${o.displayValue})` : ''
        console.log(`- ${o.id}${savings}: ${o.title ?? ''}`)
      }
    }
    const bootup = audits['bootup-time']
    if (bootup?.details?.items?.length) {
      console.log('--- bootup-time (top 5) ---')
      for (const item of bootup.details.items.slice(0, 5)) {
        console.log(`- ${item.url ?? item.script ?? 'unknown'} : ${Math.round(item.total ?? item.scripting ?? 0)}ms`)
      }
    }
    const lcpBreakdown = audits['largest-contentful-paint-element']
    if (lcpBreakdown?.displayValue) console.log(`LCP element: ${lcpBreakdown.displayValue}`)
    const cacheTtl = audits['uses-long-cache-ttl']
    if (cacheTtl?.displayValue) console.log(`Cache TTL: ${cacheTtl.displayValue}`)
    else if (cacheTtl?.details?.summary) console.log(`Cache TTL: ${JSON.stringify(cacheTtl.details.summary)}`)

    return lhr
  } finally {
    try {
      await chrome.kill()
    } catch {
      /* ignore — kill() may return undefined on some platforms */
    }
  }
}

async function main() {
  const { url, formFactor, threshold } = parseArgs(process.argv.slice(2))
  const outDir = path.resolve(process.cwd(), 'lighthouse-reports')

  // Auto-start vite preview if the target URL is unreachable.
  let previewProc = null
  if (!(await isReachable(url))) {
    const u = new URL(url)
    const port = u.port || '4173'
    const host = u.hostname || '127.0.0.1'
    console.log(`Target ${url} unreachable — starting vite preview on ${host}:${port} ...`)
    previewProc = spawn('npx', ['vite', 'preview', '--host', host, '--port', port, '--strictPort'], {
      shell: true,
      stdio: 'inherit',
    })
    const ok = await waitForUrl(url, 30000)
    if (!ok) {
      console.error(`vite preview did not become ready within 30s at ${url}`)
      try {
        previewProc.kill()
      } catch {}
      process.exit(1)
    }
    console.log(`vite preview ready at ${url}`)
  } else {
    console.log(`Target ${url} reachable — reusing existing server.`)
  }

  const factors = formFactor === 'both' ? ['mobile', 'desktop'] : [formFactor]
  let failed = false
  try {
    for (const f of factors) {
      const lhr = await runOne(url, f, outDir)
      const cats = lhr.categories ?? {}
      for (const [key, c] of Object.entries(cats)) {
        const pct = Math.round(((c).score ?? 0) * 100)
        if (pct < threshold) {
          console.error(`FAIL: ${f} category "${key}" = ${pct} < threshold ${threshold}`)
          failed = true
        }
      }
    }
  } finally {
    if (previewProc) {
      try {
        previewProc.kill()
      } catch {}
    }
  }

  console.log(`\nReports saved to ${outDir}/`)
  if (failed) {
    console.error(`One or more categories below threshold ${threshold}.`)
    process.exit(1)
  } else {
    console.log(`All categories >= threshold ${threshold}.`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
