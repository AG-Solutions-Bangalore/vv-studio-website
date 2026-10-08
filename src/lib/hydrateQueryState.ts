import { hydrate as hydrateQueryClient } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

// NOTE: QueryClientProvider is intentionally NOT mounted in main.tsx. Every
// react-query consumer lives in a lazy chunk and mounts its own provider
// over the shared singleton client — so the query runtime never joins
// the critical-path bundle.
//
// This module is dynamically imported by main.tsx AFTER first paint (never
// statically imported), so @tanstack/react-query stays out of the entry
// chunk entirely (~100KB parsed off the critical path).
//
// SSG hydration: restores the embedded `#vv-query-state` cache BEFORE first
// render so the client tree matches the SSR HTML exactly.
export function restoreQueryState(): void {
  try {
    const stateEl = document.getElementById("vv-query-state");
    if (stateEl?.textContent) {
      hydrateQueryClient(queryClient, JSON.parse(stateEl.textContent));
    }
  } catch {
    // Corrupt state — fall through to fresh client-side fetching.
  }
}
