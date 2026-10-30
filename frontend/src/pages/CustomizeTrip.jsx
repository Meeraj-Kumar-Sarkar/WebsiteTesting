import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import CustomizeTripForm from '../components/forms/CustomizeTripForm';

export default function CustomizeTrip() {
  const [searchParams] = useSearchParams();
  const preselectedDestination = searchParams.get('destination') || '';
  const preselectedStay = searchParams.get('stay') || '';

  return (
    <div className="bg-[#dad7cd] pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <Compass className="w-3.5 h-3.5" />
            <span>// ITINERARY ARCHITECT</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            CUSTOMIZE YOUR HIMALAYAN JOURNEY
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[#dad7cd] max-w-2xl mx-auto font-medium leading-relaxed">
            Every traveler holds a different cadence. Whether you wish for quiet riverside homestays with books, rigorous pass crossings, or luxury mountain glamping, let us calibrate a departure around you.
          </p>

          {preselectedStay && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold uppercase bg-[#588157] text-white border border-white">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Selected Scouted Stay: <strong>{preselectedStay}</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step-by-Step Form */}
        <CustomizeTripForm
          initialDestination={preselectedDestination}
          initialStay={preselectedStay}
        />

        {/* Reassurance Grid (Brutalist boxes) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-4xl mx-auto font-mono">
          <div className="p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
            <div className="w-8 h-8 border border-[#344e41] bg-[#a3b18a] text-[#344e41] mx-auto flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-black uppercase text-xs text-[#344e41]">Tailored Proposal</h4>
            <p className="text-[11px] text-[#344e41]/80 mt-1">
              Custom proposal includes day plans, stay recommendations, and vehicle options.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
            <div className="w-8 h-8 border border-[#344e41] bg-[#a3b18a] text-[#344e41] mx-auto flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-black uppercase text-xs text-[#344e41]">Transparent Tiers</h4>
            <p className="text-[11px] text-[#344e41]/80 mt-1">
              Choose between 3-star authentic homestays, 4-star boutique lodges, and luxury retreats.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
            <div className="w-8 h-8 border border-[#344e41] bg-[#a3b18a] text-[#344e41] mx-auto flex items-center justify-center mb-2">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h4 className="font-serif font-black uppercase text-xs text-[#344e41]">100% Private</h4>
            <p className="text-[11px] text-[#344e41]/80 mt-1">
              No shared stranger groups. You travel only with your chosen companions and driver.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
