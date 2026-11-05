import React, { useState } from 'react';
import { ChevronDown, Utensils, Home } from 'lucide-react';

export default function ItineraryDay({ item, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { day, title, description, meals, stay } = item;

  return (
    <div className="rounded-2xl overflow-hidden bg-white/85 backdrop-blur-sm border border-bark/15 shadow-nature-sm hover:border-bark/30 transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-beige/30 transition-colors duration-200 cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-pine text-cream font-serif font-bold text-sm flex items-center justify-center shadow-nature-sm flex-shrink-0">
            D{day}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-fern">
              Day 0{day}
            </div>
            <h4 className="font-serif font-bold text-base sm:text-lg text-soil mt-0.5">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-soil/60 hidden sm:inline-block">
            {isOpen ? 'Close' : 'Details'}
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
            isOpen ? 'bg-pine text-cream rotate-180' : 'bg-beige/60 text-soil hover:bg-beige'
          }`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-3 border-t border-bark/15 text-sm text-soil/80 space-y-3.5 bg-beige/20 animate-fadeIn">
          <p className="leading-relaxed font-sans">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-bark/10 text-xs">
            {meals && (
              <div className="inline-flex items-center gap-1.5 bg-cream/90 border border-bark/20 rounded-full px-3 py-1 text-soil font-medium shadow-sm">
                <Utensils className="w-3.5 h-3.5 text-fern" />
                <span>{meals}</span>
              </div>
            )}
            {stay && (
              <div className="inline-flex items-center gap-1.5 bg-cream/90 border border-bark/20 rounded-full px-3 py-1 text-soil font-medium shadow-sm">
                <Home className="w-3.5 h-3.5 text-fern" />
                <span>Stay: {stay}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
