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
    <div className="bg-cream/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-bark/15 shadow-nature-sm mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-bark/15">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sage/20 text-pine flex items-center justify-center">
            <Filter className="w-4 h-4 text-pine" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-soil">Filter Journeys</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sage/20 text-pine font-medium">
                {totalResults} {totalResults === 1 ? 'journey' : 'journeys'}
              </span>
            </div>
            <p className="text-xs text-soil/60 font-sans">
              Curate departures by territory, duration, and style
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-soil/70 hover:text-pine transition-colors duration-200 self-start md:self-auto cursor-pointer px-3 py-1.5 rounded-full bg-beige/50 hover:bg-beige"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        
        {/* Destination / State Filter */}
        <div>
          <label className="block text-xs font-semibold text-soil/80 mb-1.5">
            Region / State
          </label>
          <select
            value={filters.destination}
            onChange={(e) => onFilterChange('destination', e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-medium text-soil bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all cursor-pointer shadow-sm"
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
          <label className="block text-xs font-semibold text-soil/80 mb-1.5">
            Trip Duration
          </label>
          <select
            value={filters.duration}
            onChange={(e) => onFilterChange('duration', e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-medium text-soil bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all cursor-pointer shadow-sm"
          >
            <option value="all">Any Duration</option>
            <option value="short">Short (5 - 6 Days)</option>
            <option value="medium">Medium (7 - 8 Days)</option>
            <option value="long">Long (9+ Days)</option>
          </select>
        </div>

        {/* Trip Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-soil/80 mb-1.5">
            Trip Style
          </label>
          <select
            value={filters.tripType}
            onChange={(e) => onFilterChange('tripType', e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-medium text-soil bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all cursor-pointer shadow-sm"
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
          <label className="block text-xs font-semibold text-soil/80 mb-1.5">
            Budget Tier
          </label>
          <select
            value={filters.budget}
            onChange={(e) => onFilterChange('budget', e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-medium text-soil bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all cursor-pointer shadow-sm"
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
