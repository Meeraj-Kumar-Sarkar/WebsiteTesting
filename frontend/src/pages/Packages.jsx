import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, RotateCcw, Search } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import PackageCard from '../components/packages/PackageCard';
import PackageFilters from '../components/packages/PackageFilters';
import Button from '../components/common/Button';
import { packages } from '../data/packages';

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || 'all',
    duration: 'all',
    tripType: 'all',
    budget: 'all',
  });

  // Sync if query param changes
  useEffect(() => {
    const destParam = searchParams.get('destination');
    if (destParam && destParam !== filters.destination) {
      setFilters((prev) => ({ ...prev, destination: destParam }));
    }
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'destination') {
        if (value === 'all') {
          searchParams.delete('destination');
        } else {
          searchParams.set('destination', value);
        }
        setSearchParams(searchParams);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      destination: 'all',
      duration: 'all',
      tripType: 'all',
      budget: 'all'
    });
    setSearchParams({});
  };

  // Filtered packages calculation
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Destination filter
      if (filters.destination !== 'all' && pkg.destinationId !== filters.destination) {
        return false;
      }

      // Duration filter
      if (filters.duration === 'short' && pkg.durationDays > 6) return false;
      if (filters.duration === 'medium' && (pkg.durationDays < 7 || pkg.durationDays > 8)) return false;
      if (filters.duration === 'long' && pkg.durationDays < 9) return false;

      // Trip Type filter
      if (filters.tripType !== 'all' && pkg.tripType !== filters.tripType) {
        return false;
      }

      // Budget filter
      if (filters.budget === 'under30' && pkg.startingPrice >= 30000) return false;
      if (filters.budget === '30to40' && (pkg.startingPrice < 30000 || pkg.startingPrice > 40000)) return false;
      if (filters.budget === 'above40' && pkg.startingPrice <= 40000) return false;

      return true;
    });
  }, [filters]);

  const [heroRef, heroInView] = useInView(0.08);
  const [gridRef, gridInView] = useInView(0.08);
  const [promoRef, promoInView] = useInView();

  return (
    <div className="bg-cream pb-20">

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-beige to-cream py-14 px-4 sm:px-6 lg:px-8 mb-10 border-b border-bark/20">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            Curated itineraries
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soil">
            Explore all tour packages
          </h1>
          <p className="mt-4 text-sm text-soil/70 max-w-2xl mx-auto leading-relaxed">
            Thoughtfully planned private departures with handpicked stays, transparent accommodation tiers, and certified mountain support.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Interactive Filters Panel */}
        <PackageFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredPackages.length}
        />

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`transition-all duration-700 ease-out ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-cream rounded-2xl p-8 sm:p-12 text-center border border-bark/20 shadow-nature max-w-lg mx-auto my-10">
            <div className="w-12 h-12 rounded-xl bg-sage/20 mx-auto flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-pine" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-soil">
              No matching journeys found
            </h3>
            <p className="text-sm text-soil/70 mt-2 mb-6 leading-relaxed">
              We couldn't find a listed package matching your current criteria. Try resetting filters or customize a personal route.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={handleResetFilters} variant="secondary" size="sm" icon={RotateCcw}>
                Reset filters
              </Button>
              <Button to="/customize-trip" variant="primary" size="sm" icon={Compass}>
                Customize trip
              </Button>
            </div>
          </div>
        )}

        {/* Customization Promo Banner */}
        <div
          ref={promoRef}
          className={`mt-14 bg-beige rounded-2xl p-6 sm:p-8 border border-bark/20 shadow-nature flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 ease-out ${promoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-3 py-0.5 mb-1">
              Need custom adaptations?
            </span>
            <h3 className="font-serif text-2xl font-bold text-soil">
              Looking for something completely tailored?
            </h3>
            <p className="text-sm text-soil/70">
              Change the pace, combine states, or add specialty camps. We craft customized departures with no obligation.
            </p>
          </div>
          <Button to="/customize-trip" variant="primary" size="md" className="whitespace-nowrap">
            Launch trip customizer
          </Button>
        </div>

      </div>

    </div>
  );
}
