import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { destinations } from '../../data/destinations';

export default function PackageFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) {
  return (
    <div className="bg-white rounded-none p-4 sm:p-5 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b-2 border-[#344e41]">
        <div className="flex items-center gap-2 text-[#344e41] font-mono font-bold text-sm">
          <Filter className="w-4 h-4 text-[#588157]" />
          <span className="uppercase">// FILTER PACKAGES</span>
          <span className="text-xs font-mono font-normal text-[#344e41]/70 ml-2">
            ({totalResults} {totalResults === 1 ? 'journey' : 'journeys'} available)
          </span>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-[#344e41] hover:text-[#588157] underline transition-none self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
        
        {/* Destination / State Filter */}
        <div>
          <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#344e41] mb-1">
            Region / State
          </label>
          <select
            value={filters.destination}
            onChange={(e) => onFilterChange('destination', e.target.value)}
            className="w-full px-2.5 py-2 font-mono text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a5a40] cursor-pointer"
          >
            <option value="all">All Himalayan Regions</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#344e41] mb-1">
            Trip Duration
          </label>
          <select
            value={filters.duration}
            onChange={(e) => onFilterChange('duration', e.target.value)}
            className="w-full px-2.5 py-2 font-mono text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a5a40] cursor-pointer"
          >
            <option value="all">Any Duration</option>
            <option value="short">Short (5 - 6 Days)</option>
            <option value="medium">Medium (7 - 8 Days)</option>
            <option value="long">Long (9+ Days)</option>
          </select>
        </div>

        {/* Trip Type Filter */}
        <div>
          <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#344e41] mb-1">
            Trip Style
          </label>
          <select
            value={filters.tripType}
            onChange={(e) => onFilterChange('tripType', e.target.value)}
            className="w-full px-2.5 py-2 font-mono text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a5a40] cursor-pointer"
          >
            <option value="all">All Trip Styles</option>
            <option value="Adventure">Adventure &amp; High Pass</option>
            <option value="Honeymoon">Romantic &amp; Honeymoon</option>
            <option value="Family">Family &amp; Relaxed</option>
            <option value="Leisure">Leisure &amp; Nature Retreat</option>
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#344e41] mb-1">
            Budget (Demo)
          </label>
          <select
            value={filters.budget}
            onChange={(e) => onFilterChange('budget', e.target.value)}
            className="w-full px-2.5 py-2 font-mono text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a5a40] cursor-pointer"
          >
            <option value="all">All Budget Tiers</option>
            <option value="under30">Under ₹30,000</option>
            <option value="30to40">₹30,000 - ₹40,000</option>
            <option value="above40">Above ₹40,000</option>
          </select>
        </div>

      </div>
    </div>
  );
}
