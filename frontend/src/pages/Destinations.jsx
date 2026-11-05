import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mountain, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import { destinations } from '../data/destinations';

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

export default function Destinations() {
  const [heroRef, heroInView] = useInView(0.08);
  const [gridRef, gridInView] = useInView(0.08);

  return (
    <div className="bg-cream pb-20">

      {/* Page Header */}
      <div className="bg-gradient-to-b from-beige to-cream py-14 px-4 sm:px-6 lg:px-8 mb-10 border-b border-bark/20">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            Regions we specialize in
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soil">
            States &amp; destinations we cover
          </h1>
          <p className="mt-4 text-sm text-soil/70 max-w-2xl mx-auto leading-relaxed">
            From the high alpine meadows and bugyals of Uttarakhand to the cold desert passes of Spiti and Ladakh.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              className={`bg-cream rounded-2xl border border-bark/20 shadow-nature hover:shadow-nature-md transition-all duration-700 ease-out flex flex-col justify-between ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-beige">
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-cream">
                  <span className="inline-block rounded-full bg-cream/20 backdrop-blur-sm border border-cream/30 text-xs font-medium px-3 py-0.5 mb-1">
                    {dest.state}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                    {dest.name}
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-pine tracking-wide mb-2">
                    {dest.tagline}
                  </p>
                  <p className="text-sm text-soil/75 leading-relaxed mb-4">
                    {dest.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-1.5 mb-4 pt-3 border-t border-bark/15">
                    <span className="text-xs font-medium text-soil block mb-1">
                      Key highlights:
                    </span>
                    {dest.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-soil/70">
                        <span className="w-1.5 h-1.5 bg-sage rounded-full flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-beige/60 rounded-xl border border-bark/15 text-sm text-soil/75 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sage" />
                      <span>{dest.idealDuration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-sage" />
                      <span>{dest.altitude}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-bark/15">
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="text-sm font-medium text-pine hover:text-fern flex items-center gap-1 transition-colors"
                  >
                    <span>Read region guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/packages?destination=${dest.slug}`}
                    className="px-4 py-2 rounded-2xl text-xs font-medium bg-pine text-cream hover:bg-fern transition-colors shadow-nature-sm"
                  >
                    Explore packages
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
