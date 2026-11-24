import React from 'react';

const COLOR_MAP = {
  brand: { icon: 'bg-brand-50 text-brand-700 border-brand-100', glow: 'bg-brand-500' },
  blue: { icon: 'bg-blue-50 text-blue-600 border-blue-100', glow: 'bg-blue-500' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600 border-emerald-100', glow: 'bg-emerald-500' },
  amber: { icon: 'bg-amber-50 text-amber-600 border-amber-100', glow: 'bg-amber-500' },
  purple: { icon: 'bg-purple-50 text-purple-600 border-purple-100', glow: 'bg-purple-500' },
  rose: { icon: 'bg-rose-50 text-rose-600 border-rose-100', glow: 'bg-rose-500' },
  indigo: { icon: 'bg-indigo-50 text-indigo-600 border-indigo-100', glow: 'bg-indigo-500' },
  cyan: { icon: 'bg-cyan-50 text-cyan-600 border-cyan-100', glow: 'bg-cyan-500' },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', badgeText, onClick, loading = false }) {
  const c = COLOR_MAP[color] || COLOR_MAP.brand;
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={`group relative overflow-hidden text-left w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-soft transition duration-200 ${
        onClick ? 'hover:-translate-y-0.5 hover:shadow-lift cursor-pointer' : 'hover:shadow-lift'
      }`}
    >
      {/* soft accent glow */}
      <span className={`pointer-events-none absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-[0.08] blur-2xl ${c.glow}`} />

      <div className="relative flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 leading-5">{title}</span>
        {Icon && (
          <div className={`shrink-0 p-2 rounded-xl border ${c.icon} transition group-hover:scale-105`}>
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
      </div>

      <div className="relative mt-2 flex items-baseline justify-between gap-2">
        {loading ? (
          <div className="skeleton h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums truncate">{value}</div>
        )}
        {badgeText && (
          <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{badgeText}</span>
        )}
      </div>

      {subtitle && <p className="relative mt-1 text-xs text-slate-500 font-medium truncate">{subtitle}</p>}
    </Wrapper>
  );
}
