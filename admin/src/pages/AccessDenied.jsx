import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="card p-8 sm:p-12 text-center max-w-xl mx-auto mt-10 animate-pop-in">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
        <ShieldOff className="w-7 h-7" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-slate-900">You don't have access to this page</h2>
      <p className="mt-2 text-sm text-slate-500">
        This area belongs to a workspace you are not a member of. Ask a Master administrator if you need access.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <ArrowLeft className="w-4 h-4" /> Back to my workspace
      </Link>
    </div>
  );
}
