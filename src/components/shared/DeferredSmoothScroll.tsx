import React, { Suspense, useEffect, useState } from 'react';

const SmoothScroll = React.lazy(() =>
  import('./SmoothScroll').then((m) => ({ default: m.SmoothScroll })),
);

/**
 * Deferred smooth-scroll shell for the critical path: renders nothing until
 * the user shows scroll intent. Lenis (~19KB + ~500ms bootup) does nothing
 * observable until the first scroll anyway, so loading it on idle only taxes
 * the load window (LCP/TBT) for zero benefit. Native scrolling + anchor
 * scrollIntoView cover everything until Lenis takes over.
 */
export function DeferredSmoothScroll() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onFirstIntent = () => setReady(true);
    const opts = { once: true, passive: true } as const;
    window.addEventListener("scroll", onFirstIntent, opts);
    window.addEventListener("wheel", onFirstIntent, opts);
    window.addEventListener("touchmove", onFirstIntent, opts);
    window.addEventListener("keydown", onFirstIntent, opts);
    return () => {
      window.removeEventListener("scroll", onFirstIntent);
      window.removeEventListener("wheel", onFirstIntent);
      window.removeEventListener("touchmove", onFirstIntent);
      window.removeEventListener("keydown", onFirstIntent);
    };
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <SmoothScroll />
    </Suspense>
  );
}
