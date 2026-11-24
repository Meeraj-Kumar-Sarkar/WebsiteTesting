import React from 'react';

export function Spinner({ className = 'w-5 h-5' }) {
  return <span className={`inline-block rounded-full border-2 border-brand-600 border-t-transparent animate-spin ${className}`} />;
}

export function FullScreenLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-2xl bg-brand-600 shadow-glow animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-white font-serif font-bold">M</div>
        </div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/** Skeleton shown while a lazily-loaded page chunk downloads. */
export function PageLoader() {
  return (
    <div className="space-y-6 animate-fade-in" aria-busy="true" aria-label="Loading page">
      <div className="space-y-2">
        <div className="skeleton h-7 w-64" />
        <div className="skeleton h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-7 w-20" />
          </div>
        ))}
      </div>
      <div className="card p-5 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
