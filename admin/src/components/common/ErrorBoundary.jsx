import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/** Catches render errors in a page so one broken screen doesn't blank the whole portal. */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[UI Error]', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="card p-8 sm:p-12 text-center max-w-xl mx-auto mt-10 animate-pop-in">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Something went wrong on this page</h2>
        <p className="mt-1 text-sm text-slate-500">{this.state.error?.message || 'An unexpected error occurred.'}</p>
        <button onClick={() => this.setState({ error: null })} className="btn-primary mt-6">
          <RotateCcw className="w-4 h-4" /> Try again
        </button>
      </div>
    );
  }
}
