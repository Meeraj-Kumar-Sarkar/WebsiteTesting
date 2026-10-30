import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Clock, Calendar, Mountain, Thermometer, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { destinations } from '../data/destinations';
import { packages } from '../data/packages';
import PackageCard from '../components/packages/PackageCard';
import Button from '../components/common/Button';

export default function DestinationDetails() {
  const { slug } = useParams();
  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center font-mono">
        <h2 className="font-serif text-3xl font-black uppercase text-[#344e41]">Destination Not Found</h2>
        <p className="text-xs text-[#344e41]/80 mt-2 mb-5">The Himalayan region you are seeking is not in our current coverage.</p>
        <Button to="/destinations" variant="primary">
          View All Destinations
        </Button>
      </div>
    );
  }

  const matchingPackages = packages.filter((p) => p.destinationId === destination.id);

  return (
    <div className="bg-[#dad7cd] pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-end justify-start overflow-hidden border-b-2 border-[#344e41] bg-[#344e41]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={destination.heroImage || destination.coverImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-white w-full">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#a3b18a] hover:text-white mb-3 underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Destinations
          </Link>

          <span className="font-mono text-xs uppercase tracking-widest text-[#a3b18a] font-bold block mb-1">
            // {destination.state}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
            {destination.name}
          </h1>
          <p className="mt-2 text-sm sm:text-lg text-[#dad7cd] max-w-2xl font-medium">
            {destination.tagline}
          </p>
        </div>
      </section>

      {/* Quick Travel Facts Bar */}
      <div className="bg-white border-b-2 border-[#344e41]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs text-[#344e41]">
            <div className="flex items-center gap-2.5 p-2 bg-[#dad7cd]/40 border border-[#344e41]">
              <div className="w-8 h-8 border border-[#344e41] bg-[#588157] text-white flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[#344e41]/60 uppercase font-bold text-[9px]">Best Season</span>
                <span className="font-bold text-xs">{destination.bestTimeToVisit}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 bg-[#dad7cd]/40 border border-[#344e41]">
              <div className="w-8 h-8 border border-[#344e41] bg-[#588157] text-white flex items-center justify-center flex-shrink-0">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[#344e41]/60 uppercase font-bold text-[9px]">Altitude</span>
                <span className="font-bold text-xs">{destination.altitude}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 bg-[#dad7cd]/40 border border-[#344e41]">
              <div className="w-8 h-8 border border-[#344e41] bg-[#588157] text-white flex items-center justify-center flex-shrink-0">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[#344e41]/60 uppercase font-bold text-[9px]">Temperature</span>
                <span className="font-bold text-xs">{destination.temperatureRange}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 bg-[#dad7cd]/40 border border-[#344e41]">
              <div className="w-8 h-8 border border-[#344e41] bg-[#588157] text-white flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[#344e41]/60 uppercase font-bold text-[9px]">Pace</span>
                <span className="font-bold text-xs">{destination.idealDuration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Itineraries */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview Section */}
            <div className="bg-white rounded-none p-6 sm:p-8 border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41]">
              <span className="font-mono text-xs font-bold uppercase text-[#588157] block mb-1">
                // REGIONAL OVERVIEW
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase text-[#344e41] mb-3">
                THE CHARACTER OF {destination.name}
              </h2>
              <p className="text-[#344e41]/85 text-xs sm:text-sm leading-relaxed font-medium">
                {destination.longDescription || destination.description}
              </p>
            </div>

            {/* Signature Spots */}
            <div>
              <h3 className="font-serif text-2xl font-black uppercase text-[#344e41] mb-4">
                Iconic Valleys &amp; Places in {destination.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.popularSpots.map((spot, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-none border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
                    <h4 className="font-serif font-black text-sm uppercase text-[#344e41] mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#588157]"></span>
                      {spot.name}
                    </h4>
                    <p className="font-mono text-xs text-[#344e41]/80 leading-relaxed">
                      {spot.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Curated Packages */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#344e41]">
                <div>
                  <span className="font-mono text-xs font-bold uppercase text-[#588157] block">
                    // CURATED JOURNEYS
                  </span>
                  <h3 className="font-serif text-2xl font-black uppercase text-[#344e41]">
                    Tour Packages in {destination.name}
                  </h3>
                </div>
                <Link
                  to={`/packages?destination=${destination.slug}`}
                  className="font-mono text-xs font-bold text-[#3a5a40] underline hover:text-[#344e41]"
                >
                  Filter this region &rarr;
                </Link>
              </div>

              {matchingPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchingPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_#344e41] text-center font-mono">
                  <p className="text-xs text-[#344e41]/80 mb-4">No fixed packages listed for this specific filter yet.</p>
                  <Button to="/customize-trip" variant="primary" size="sm">
                    Customize a Tailor-Made Trip
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Key Highlights Card */}
            <div className="bg-white rounded-none p-5 border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41]">
              <h4 className="font-mono font-bold text-xs uppercase text-[#344e41] mb-3 pb-2 border-b-2 border-[#344e41] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#588157]" />
                <span>Trip Highlights</span>
              </h4>
              <ul className="space-y-2 font-mono text-xs text-[#344e41]/90">
                {destination.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#588157] mt-1.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Travel Callout Box */}
            <div className="bg-[#344e41] rounded-none p-5 text-white border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41] font-mono">
              <span className="text-xs uppercase tracking-widest text-[#a3b18a] font-bold block mb-1">
                // TAILOR-MADE
              </span>
              <h4 className="font-serif font-black text-xl uppercase text-white mb-2">
                Want a custom route for {destination.name}?
              </h4>
              <p className="text-xs text-[#dad7cd] leading-relaxed mb-4">
                Combine secret side-valleys, select your preferred stay tier, or adapt the route for family pace.
              </p>
              <Button
                to={`/customize-trip?destination=${destination.slug}`}
                variant="gold"
                size="md"
                className="w-full justify-center text-xs"
              >
                Plan {destination.name} Trip
              </Button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
