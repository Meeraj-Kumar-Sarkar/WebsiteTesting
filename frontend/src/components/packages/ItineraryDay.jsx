import React, { useState } from 'react';
import { ChevronDown, Utensils, Home } from 'lucide-react';

export default function ItineraryDay({ item, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { day, title, description, meals, stay } = item;

  return (
    <div className="border-2 border-[#344e41] rounded-none overflow-hidden bg-white shadow-[2px_2px_0px_#344e41] font-mono">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#dad7cd]/40 transition-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#344e41] text-[#dad7cd] font-bold text-xs flex items-center justify-center border-2 border-[#344e41] flex-shrink-0">
            D{day}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-[#588157]">
              // DAY 0{day}
            </div>
            <h4 className="font-serif font-black text-sm sm:text-base uppercase text-[#344e41]">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-[#344e41]/60 hidden sm:inline-block">
            {isOpen ? 'Close' : 'View'}
          </span>
          <div className={`w-6 h-6 border border-[#344e41] flex items-center justify-center transition-none ${isOpen ? 'bg-[#344e41] text-white' : 'bg-[#dad7cd] text-[#344e41]'}`}>
            <ChevronDown className={`w-3.5 h-3.5 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-3 border-t-2 border-[#344e41] text-xs text-[#344e41]/90 space-y-3 bg-[#dad7cd]/20">
          <p className="leading-relaxed font-sans font-medium text-xs sm:text-sm">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#344e41] text-[11px]">
            {meals && (
              <div className="flex items-center gap-1.5 bg-white border border-[#344e41] px-2 py-1 text-[#344e41]">
                <Utensils className="w-3 h-3 text-[#588157]" />
                <span>{meals}</span>
              </div>
            )}
            {stay && (
              <div className="flex items-center gap-1.5 bg-white border border-[#344e41] px-2 py-1 text-[#344e41]">
                <Home className="w-3 h-3 text-[#588157]" />
                <span>Stay: {stay}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
