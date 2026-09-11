import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('NEXORA Studio caught an unhandled error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    if (window.confirm('Reset local workspace data to clean defaults? Current unsaved work will be cleared.')) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error(e);
      }
      window.location.reload();
    }
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          id="nexora-error-boundary-screen" 
          className="min-h-screen bg-[#0B0F17] text-slate-100 flex items-center justify-center p-6 font-sans select-none"
        >
          <div className="bg-[#111726] border border-white/10 rounded-2xl max-w-lg w-full p-8 shadow-2xl text-center space-y-6">
            {/* Friendly Icon */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            {/* User Friendly Message */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Something went wrong
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                NEXORA encountered an unexpected issue while rendering this view. Your local data remains safe on your device.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                id="btn-error-reload"
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                id="btn-error-reset-safe"
                onClick={this.handleResetStorage}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 font-medium text-xs border border-white/[0.08] transition-colors cursor-pointer"
              >
                Restore Safe Defaults
              </button>
            </div>

            {/* Developer Details Accordion */}
            <div className="border-t border-white/[0.08] pt-4 text-left">
              <button
                onClick={this.toggleDetails}
                className="flex items-center justify-between w-full text-[11px] text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
              >
                <span>Diagnostic Information (Technical)</span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 rounded-lg bg-[#070A10] border border-white/[0.06] overflow-x-auto text-[10px] font-mono text-slate-400 max-h-48">
                  <div className="text-rose-400 font-semibold mb-1">
                    {this.state.error?.toString()}
                  </div>
                  <pre className="whitespace-pre-wrap leading-tight text-slate-400">
                    {this.state.errorInfo?.componentStack || 'No stack available'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
