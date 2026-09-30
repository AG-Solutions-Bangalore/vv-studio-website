import React, { Suspense, useEffect, useState } from 'react';

const SmoothScroll = React.lazy(() =>
  import('./SmoothScroll').then((m) => ({ default: m.SmoothScroll })),
);

/**
 * Deferred smooth-scroll shell for the critical path: renders nothing until
 * the SmoothScroll runtime (and its `lenis` chunk) loads after idle.
 */
export function DeferredSmoothScroll() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for the browser to finish initial paint and hydration
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => setReady(true));
    } else {
      setTimeout(() => setReady(true), 100);
    }
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <SmoothScroll />
    </Suspense>
  );
}
