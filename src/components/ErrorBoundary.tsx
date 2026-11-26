import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected interface error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6 text-[#1E293B]">
          <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <h1 className="font-display text-lg font-bold">PyVerse Recovery</h1>
            </div>
            <p className="text-sm text-slate-600">
              Something went wrong while rendering this view: {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reload PyVerse
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
