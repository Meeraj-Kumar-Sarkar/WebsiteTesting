import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Mountain, Clock, Calendar } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import DestinationCard from '../components/destinations/DestinationCard';
import { destinations } from '../data/destinations';

export default function Destinations() {
  return (
    <div className="bg-[#dad7cd] pb-20">
      
      {/* Page Header */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <span>// REGIONS WE SPECIALIZE IN</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            STATES &amp; DESTINATIONS WE COVER
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#dad7cd] max-w-2xl mx-auto font-medium leading-relaxed">
            From the high alpine meadows and bugyals of Uttarakhand to the cold desert passes of Spiti and Ladakh.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-none border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#344e41] transition-none flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#dad7cd] border-b-2 border-[#344e41]">
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#344e41]/30" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-[#344e41] px-1.5 py-0.5 border border-white">
                    {dest.state}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase mt-1">
                    {dest.name}
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#588157] mb-2">
                    // {dest.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed mb-4 font-medium">
                    {dest.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-1.5 mb-4 pt-3 border-t-2 border-[#dad7cd]">
                    <span className="font-mono text-xs font-bold uppercase text-[#344e41] block mb-1">
                      Key Highlights:
                    </span>
                    {dest.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-[#344e41]/90">
                        <span className="w-1.5 h-1.5 bg-[#588157] flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#dad7cd]/40 border-2 border-[#344e41] font-mono text-xs text-[#344e41] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#588157]" />
                      <span>{dest.idealDuration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-[#588157]" />
                      <span>{dest.altitude}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t-2 border-[#344e41]">
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="font-mono text-xs font-bold text-[#344e41] hover:text-[#588157] flex items-center gap-1 underline underline-offset-2"
                  >
                    <span>Read Region Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/packages?destination=${dest.slug}`}
                    className="px-3 py-1.5 rounded-none font-mono text-xs font-bold uppercase bg-[#3a5a40] hover:bg-[#344e41] text-white border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-none"
                  >
                    Explore Packages
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
