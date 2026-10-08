import { useEffect, useRef, useState } from "react";

/**
 * Native IntersectionObserver visibility hook — zero-dependency
 * replacement for heavy animation/in-view libraries on below-fold media.
 *
 * Observes once: flips to `true` on first intersection, then disconnects.
 * Falls back to visible when IntersectionObserver is unavailable (SSR/old browsers).
 */
export function useNativeInView<T extends HTMLElement = HTMLElement>(
  rootMargin = "250px",
) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isInView || typeof window === "undefined") return;

    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isInView, rootMargin]);

  return { ref, isInView };
}
