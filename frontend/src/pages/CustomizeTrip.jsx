import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import CustomizeTripForm from '../components/forms/CustomizeTripForm';

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
  }, [threshold]);
  return [ref, inView];
}

export default function CustomizeTrip() {
  const [searchParams] = useSearchParams();
  const preselectedDestination = searchParams.get('destination') || '';
  const preselectedStay = searchParams.get('stay') || '';

  const [heroRef, heroInView] = useInView(0.08);
  const [gridRef, gridInView] = useInView(0.1);

  return (
    <div className="bg-cream pb-24 min-h-screen">
      
      {/* Header Banner */}
      <div className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden bg-gradient-to-b from-beige/60 via-beige/30 to-cream border-b border-bark/15">
        <div
          ref={heroRef}
          className={`max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage/20 border border-sage/30 text-xs font-semibold text-pine mb-4 shadow-sm">
            <Compass className="w-4 h-4 text-pine" />
            <span>Itinerary Architect</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-soil tracking-tight leading-tight">
            Customize Your Himalayan Journey
          </h1>

          <p className="mt-4 text-sm sm:text-base text-soil/75 max-w-2xl mx-auto leading-relaxed font-sans">
            Every traveler holds a unique cadence. Whether you wish for quiet riverside homestays with books, rigorous pass crossings, or luxury mountain glamping, let us calibrate a departure around you.
          </p>

          {preselectedStay && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pine text-cream text-xs font-medium shadow-nature-sm">
              <Sparkles className="w-3.5 h-3.5 text-sage" />
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

        {/* Reassurance Grid */}
        <div
          ref={gridRef}
          className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-4xl mx-auto transition-all duration-700 ease-out ${
            gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-bark/15 shadow-nature-sm hover:shadow-nature-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-sage/20 text-pine mx-auto flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-soil">Tailored Proposal</h4>
            <p className="text-xs text-soil/70 mt-1.5 leading-relaxed font-sans">
              Custom proposal includes day plans, stay recommendations, and private vehicle options.
            </p>
          </div>

          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-bark/15 shadow-nature-sm hover:shadow-nature-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-sage/20 text-pine mx-auto flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-soil">Transparent Tiers</h4>
            <p className="text-xs text-soil/70 mt-1.5 leading-relaxed font-sans">
              Choose between certified authentic homestays, boutique mountain lodges, and luxury retreats.
            </p>
          </div>

          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-bark/15 shadow-nature-sm hover:shadow-nature-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-sage/20 text-pine mx-auto flex items-center justify-center mb-4 shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-soil">100% Private</h4>
            <p className="text-xs text-soil/70 mt-1.5 leading-relaxed font-sans">
              No shared stranger groups. You travel only with your chosen companions and dedicated mountain driver.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
