import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns true once the component is mounted/hydrated on the client.
 * Uses React 18/19's useSyncExternalStore to avoid hydration mismatches
 * and prevent cascading render / set-state-in-effect ESLint warnings.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
