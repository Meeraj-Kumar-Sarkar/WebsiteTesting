import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Compass, RotateCcw, Search, Sparkles } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import PackageCard from '../components/packages/PackageCard';
import PackageFilters from '../components/packages/PackageFilters';
import Button from '../components/common/Button';
import { packages } from '../data/packages';

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

  return (
    <div className="bg-[#dad7cd] pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <span>// CURATED ITINERARIES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            EXPLORE ALL TOUR PACKAGES
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#dad7cd] max-w-2xl mx-auto font-medium leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-none p-8 sm:p-12 text-center border-2 border-[#344e41] max-w-lg mx-auto shadow-[4px_4px_0px_0px_#344e41] my-10">
            <div className="w-12 h-12 border-2 border-[#344e41] bg-[#a3b18a] text-[#344e41] mx-auto flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
              <Search className="w-5 h-5 text-[#344e41]" />
            </div>
            <h3 className="font-serif text-2xl font-black uppercase text-[#344e41]">
              No Matching Journeys Found
            </h3>
            <p className="font-mono text-xs text-[#344e41]/80 mt-2 mb-5 leading-relaxed">
              We couldn't find a listed package matching your current criteria. Try resetting filters or customize a personal route.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={handleResetFilters} variant="secondary" size="sm" icon={RotateCcw}>
                Reset Filters
              </Button>
              <Button to="/customize-trip" variant="primary" size="sm" icon={Compass}>
                Customize Trip
              </Button>
            </div>
          </div>
        )}

        {/* Customization Promo Banner */}
        <div className="mt-14 bg-white rounded-none p-6 sm:p-8 border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-mono text-xs font-bold uppercase text-[#588157]">
              // NEED CUSTOM ADAPTATIONS?
            </span>
            <h3 className="font-serif text-2xl font-black uppercase text-[#344e41]">
              Looking for something completely tailored?
            </h3>
            <p className="text-xs sm:text-sm text-[#344e41]/85 font-medium">
              Change the pace, combine states, or add specialty camps. We craft customized departures with no obligation.
            </p>
          </div>
          <Button to="/customize-trip" variant="primary" size="md" className="whitespace-nowrap">
            Launch Trip Customizer
          </Button>
        </div>

      </div>

    </div>
  );
}
