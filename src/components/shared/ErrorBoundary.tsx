import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Route-level error boundary: a failed lazy chunk must never blank-screen
 * the app. Shows a lightweight retry UI instead (zero heavy deps).
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // Chunk-load failures are transient (new deploy) — reload usually fixes.
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen bg-[#FCFCFC] flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-2xl text-[#2D0A2E]">
              Something went wrong
            </p>
            <p className="text-sm text-[#766A73] max-w-sm">
              This page couldn&apos;t be loaded. Please try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#D91A8A] hover:bg-[#A80086] text-white text-sm font-semibold px-6 py-2.5 transition-colors cursor-pointer"
            >
              Reload page
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
