import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { hydrate as hydrateQueryClient } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { SeoHost } from './seo/seo'
import { queryClient } from './lib/queryClient'

// NOTE: QueryClientProvider is intentionally NOT mounted here. Every
// react-query consumer lives in a lazy chunk and mounts its own provider
// over the shared singleton client — so the query runtime never joins
// the critical-path bundle.
//
// SSG hydration: when prerendered HTML exists, restore the embedded
// `#vv-query-state` cache BEFORE first render so the client tree matches
// the SSR HTML exactly (no hydration flash / mismatch).
try {
  const stateEl = document.getElementById('vv-query-state')
  if (stateEl?.textContent) {
    hydrateQueryClient(queryClient, JSON.parse(stateEl.textContent))
  }
} catch {
  // Corrupt state — fall through to fresh client-side fetching.
}

const rootEl = document.getElementById('root')!
const app = (
  <StrictMode>
    <HelmetProvider>
      <App />
      <SeoHost />
    </HelmetProvider>
  </StrictMode>
)

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
