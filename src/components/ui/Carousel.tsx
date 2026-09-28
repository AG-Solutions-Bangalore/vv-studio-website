import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CarouselHandle {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollToPage: (page: number) => void;
}

export interface CarouselState {
  canPrev: boolean;
  canNext: boolean;
  page: number;
  pages: number;
}

interface CarouselProps {
  children: React.ReactNode;
  /** Width of each slide, e.g. "basis-[85%] sm:basis-[calc(50%-12px)]" */
  slideClassName?: string;
  trackClassName?: string;
  ariaLabel?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  /** Wrap around at the ends instead of stopping (infinite feel). */
  loop?: boolean;
  showDots?: boolean;
  onStateChange?: (state: CarouselState) => void;
  className?: string;
}

const EPS = 4;
const INITIAL_STATE: CarouselState = { canPrev: false, canNext: false, page: 0, pages: 1 };

function statesEqual(a: CarouselState, b: CarouselState) {
  return a.canPrev === b.canPrev && a.canNext === b.canNext && a.page === b.page && a.pages === b.pages;
}

interface CarouselLayout {
  /** Exact scroll targets — slide starts plus the end, merged when too close. */
  positions: number[];
}

/** Page stops: advance ~one viewport of slides at a time, always landing on a slide start. */
function getLayout(el: HTMLElement): CarouselLayout {
  const kids = Array.from(el.children) as HTMLElement[];
  const W = el.clientWidth;
  const maxScroll = Math.max(0, el.scrollWidth - W);
  if (kids.length === 0 || W === 0 || maxScroll <= EPS) return { positions: [0] };
  const starts = kids.map((k) => k.offsetLeft);
  const pitch = kids.length > 1 ? Math.max(1, starts[1] - starts[0]) : W;
  const spv = Math.max(1, Math.round(W / pitch)); // slides per view
  const positions = [0];
  let idx = 0;
  while (idx + spv < kids.length) {
    idx += spv;
    positions.push(Math.min(starts[idx], maxScroll));
  }
  const last = positions[positions.length - 1];
  if (last < maxScroll - EPS) {
    // Merge when the tail is a sliver, otherwise append the true end.
    if (maxScroll - last < W * 0.3) positions[positions.length - 1] = maxScroll;
    else positions.push(maxScroll);
  }
  return { positions };
}

function activePage(el: HTMLElement, positions: number[]): number {
  let page = 0;
  let best = Infinity;
  positions.forEach((p, i) => {
    const d = Math.abs(p - el.scrollLeft);
    if (d < best) {
      best = d;
      page = i;
    }
  });
  return page;
}

export const Carousel = forwardRef<CarouselHandle, CarouselProps>(function Carousel(
  {
    children,
    slideClassName,
    trackClassName,
    ariaLabel = 'Carousel',
    autoplay = false,
    autoplayDelay = 4000,
    loop = false,
    showDots = true,
    onStateChange,
    className,
  },
  ref
) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [navTick, setNavTick] = useState(0);
  const [state, setState] = useState<CarouselState>(INITIAL_STATE);
  const slideCount = React.Children.count(children);

  const pauseAuto = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resumeAuto = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el || el.clientWidth === 0) return;
    const { positions } = getLayout(el);
    const page = activePage(el, positions);
    const multi = positions.length > 1;
    const next: CarouselState = {
      // In loop mode the ends wrap, so arrows stay enabled.
      canPrev: loop ? multi : page > 0,
      canNext: loop ? multi : page < positions.length - 1,
      page,
      pages: positions.length,
    };
    setState((prev) => (statesEqual(prev, next) ? prev : next));
  }, [loop]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  useEffect(() => {
    measure();
    const el = viewportRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    const t = window.setTimeout(measure, 600);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.clearTimeout(t);
    };
  }, [measure, slideCount]);

  const goTo = useCallback((page: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const { positions } = getLayout(el);
    const target = positions[Math.max(0, Math.min(positions.length - 1, page))] ?? 0;
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const el = viewportRef.current;
      if (!el) return;
      const { positions } = getLayout(el);
      const page = activePage(el, positions);
      const nextPage = page + dir;
      // In loop mode wrap around the ends (infinite feel).
      if (loop) {
        if (nextPage < 0) {
          goTo(positions.length - 1);
          return;
        }
        if (nextPage > positions.length - 1) {
          goTo(0);
          return;
        }
      }
      goTo(nextPage);
    },
    [goTo, loop]
  );

  const scrollPrev = useCallback(() => {
    setNavTick((n) => n + 1);
    step(-1);
  }, [step]);
  const scrollNext = useCallback(() => {
    setNavTick((n) => n + 1);
    step(1);
  }, [step]);
  const scrollToPage = useCallback(
    (page: number) => {
      setNavTick((n) => n + 1);
      goTo(page);
    },
    [goTo]
  );

  useImperativeHandle(ref, () => ({ scrollPrev, scrollNext, scrollToPage }), [scrollPrev, scrollNext, scrollToPage]);

  // Autoplay: advance a full page, rewind to start at the end. Paused on hover/touch.
  useEffect(() => {
    if (!autoplay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      const el = viewportRef.current;
      if (!el || pausedRef.current || document.hidden) return;
      const { positions } = getLayout(el);
      const page = activePage(el, positions);
      goTo(page >= positions.length - 1 ? 0 : page + 1);
    }, autoplayDelay);
    return () => window.clearInterval(id);
  }, [autoplay, autoplayDelay, goTo, navTick]);

  return (
    <div className={className}>
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onPointerEnter={pauseAuto}
        onPointerLeave={resumeAuto}
        onPointerDown={pauseAuto}
        onPointerUp={resumeAuto}
        onPointerCancel={resumeAuto}
        className={cn(
          'relative flex overflow-x-auto no-scrollbar snap-x snap-mandatory overscroll-x-contain focus:outline-none',
          trackClassName ?? 'gap-3 sm:gap-4'
        )}
      >
        {React.Children.map(children, (child, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            className={cn('snap-start shrink-0 min-w-0', slideClassName)}
          >
            {child}
          </div>
        ))}
      </div>

      {showDots && state.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          {Array.from({ length: state.pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i)}
              aria-label={`Go to slide ${i + 1} of ${state.pages}`}
              className="w-5 h-4 flex items-center justify-center cursor-pointer"
            >
              <span
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === state.page ? 'w-4 bg-[#D91A8A]' : 'w-2 bg-[#E8DCE5] hover:bg-[#F06AB9]'
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
}

export const CarouselControls: React.FC<CarouselControlsProps> = ({
  onPrev,
  onNext,
  canPrev,
  canNext,
  className,
}) => {
  const btn =
    'w-9 h-9 rounded-full border border-[#E8DCE5] bg-white text-[#A80086] flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-[#FDEAF4] hover:border-[#F06AB9] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-white disabled:hover:border-[#E8DCE5] cursor-pointer';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button type="button" onClick={onPrev} disabled={!canPrev} aria-label="Previous slides" className={btn}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label="Next slides" className={btn}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
