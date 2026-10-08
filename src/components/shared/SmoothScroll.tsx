import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { setLenisInstance, getLenisInstance } from '@/lib/lenis';
import type { LenisLike } from '@/lib/lenis';
import { onIdle } from '@/lib/idle';
// Lenis CSS travels with this lazy chunk — never in the critical CSS bundle.
import 'lenis/dist/lenis.css';

/**
 * Smooth-scroll runtime. Loaded lazily via DeferredSmoothScroll and
 * initialized only once the main thread is idle, so `lenis` never blocks
 * first paint. Bypassed entirely for reduced-motion users and coarse
 * (touch) pointers, where native scrolling is the better experience.
 */
export function SmoothScroll() {
  const { pathname, hash } = useLocation();
  const isFirstMount = useRef(true);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cancelled = false;
    let rafId = 0;
    let lenis: LenisLike | null = null;

    const init = async () => {
      // Dynamic import keeps `lenis` in its own chunk, off first paint.
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      // Initialize Lenis with tuned inertia and easing for premium, lag-free feel
      const instance: LenisLike = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      lenis = instance;
      setLenisInstance(instance);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };

    const cancelIdle = onIdle(() => void init(), 2500);

    return () => {
      cancelled = true;
      cancelIdle();
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      setLenisInstance(null);
    };
  }, []);

  // Handle smooth route & hash scrolling with header offset.
  // Falls back to native scrolling until Lenis has initialized.
  // Crucial: Only scrolls to top when navigating to a NEW page (pathname changed).
  // Never resets scroll to 0 on initial mount or when deferred-mounted while the user is scrolling!
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevPathname.current = pathname;

      // Direct URL hash navigation on entry (e.g. vvstudio.in/#offers)
      if (hash) {
        const targetId = hash.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          const timer = setTimeout(() => {
            const current = getLenisInstance();
            if (current) {
              current.scrollTo(element, {
                offset: -75,
                duration: 1.2,
                immediate: false,
              });
            } else {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 120);
          return () => clearTimeout(timer);
        }
      }
      return;
    }

    const routeChanged = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        // Slight timeout allows layout to settle
        const timer = setTimeout(() => {
          const current = getLenisInstance();
          if (current) {
            current.scrollTo(element, {
              offset: -75, // offset for sticky luxury header
              duration: 1.2,
              immediate: false,
            });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 60);
        return () => clearTimeout(timer);
      }
    } else if (routeChanged) {
      // ONLY scroll to top when transitioning to a new route
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(0, {
          duration: 1.0,
          immediate: false,
        });
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, [pathname, hash]);

  return null;
}
