import React from 'react';

/**
 * Consistent page title block.
 *   <PageHeader title="Enquiries" description="…" icon={FileText} actions={<button…/>} />
 */
export default function PageHeader({ title, description, icon: Icon, actions, eyebrow }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 animate-fade-in">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="hidden sm:flex shrink-0 w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 mb-0.5">{eyebrow}</div>}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500 max-w-2xl">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
