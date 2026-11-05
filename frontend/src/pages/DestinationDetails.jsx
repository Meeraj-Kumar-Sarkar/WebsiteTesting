import React, { useRef, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Clock, Calendar, Mountain, Thermometer, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { destinations } from '../data/destinations';
import { packages } from '../data/packages';
import PackageCard from '../components/packages/PackageCard';
import Button from '../components/common/Button';

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

export default function DestinationDetails() {
  const { slug } = useParams();
  const destination = destinations.find((d) => d.slug === slug);

  const [overviewRef, overviewInView] = useInView();
  const [spotsRef, spotsInView] = useInView();
  const [pkgsRef, pkgsInView] = useInView();

  if (!destination) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-soil">Destination not found</h2>
        <p className="text-sm text-soil/70 mt-2 mb-5">The Himalayan region you are seeking is not in our current coverage.</p>
        <Button to="/destinations" variant="primary">
          View all destinations
        </Button>
      </div>
    );
  }

  const matchingPackages = packages.filter((p) => p.destinationId === destination.id);

  return (
    <div className="bg-cream pb-20">

      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-end justify-start overflow-hidden bg-pine border-b border-bark/20">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={destination.heroImage || destination.coverImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-pine/30 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-cream w-full">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sage hover:text-cream mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All destinations
          </Link>

          <span className="text-xs font-medium text-sage/90 uppercase tracking-widest block mb-1">
            {destination.state}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight">
            {destination.name}
          </h1>
          <p className="mt-3 text-sm sm:text-lg text-cream/75 max-w-2xl">
            {destination.tagline}
          </p>
        </div>
      </section>

      {/* Quick Travel Facts Bar */}
      <div className="bg-beige border-b border-bark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: 'Best season', value: destination.bestTimeToVisit },
              { icon: Mountain, label: 'Altitude', value: destination.altitude },
              { icon: Thermometer, label: 'Temperature', value: destination.temperatureRange },
              { icon: Clock, label: 'Ideal pace', value: destination.idealDuration },
            ].map((fact, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-bark/15 shadow-nature-sm">
                <div className="w-9 h-9 rounded-lg bg-sage/20 flex items-center justify-center flex-shrink-0">
                  <fact.icon className="w-4 h-4 text-pine" />
                </div>
                <div>
                  <span className="block text-xs text-soil/50 uppercase font-medium tracking-wide">{fact.label}</span>
                  <span className="font-medium text-sm text-soil">{fact.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content & Itineraries */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">

            {/* Overview Section */}
            <div
              ref={overviewRef}
              className={`bg-cream rounded-2xl p-6 sm:p-8 border border-bark/20 shadow-nature transition-all duration-700 ease-out ${overviewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-3 py-0.5 mb-3">
                Regional overview
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soil mb-4">
                The character of {destination.name}
              </h2>
              <p className="text-soil/75 text-sm leading-relaxed">
                {destination.longDescription || destination.description}
              </p>
            </div>

            {/* Signature Spots */}
            <div ref={spotsRef}>
              <h3 className="font-serif text-2xl font-bold text-soil mb-5">
                Iconic valleys &amp; places in {destination.name}
              </h3>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 ease-out ${spotsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {destination.popularSpots.map((spot, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-cream rounded-2xl border border-bark/20 shadow-nature-sm transition-all duration-700 ease-out"
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <h4 className="font-serif font-bold text-sm text-soil mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-sage rounded-full flex-shrink-0" />
                      {spot.name}
                    </h4>
                    <p className="text-sm text-soil/70 leading-relaxed">
                      {spot.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Curated Packages */}
            <div ref={pkgsRef}>
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-bark/15">
                <div>
                  <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-3 py-0.5 mb-2">
                    Curated journeys
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-soil">
                    Tour packages in {destination.name}
                  </h3>
                </div>
                <Link
                  to={`/packages?destination=${destination.slug}`}
                  className="text-sm font-medium text-pine hover:text-fern transition-colors flex items-center gap-1"
                >
                  Filter this region →
                </Link>
              </div>

              {matchingPackages.length > 0 ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ease-out ${pkgsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {matchingPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-beige rounded-2xl border border-bark/20 shadow-nature-sm text-center">
                  <p className="text-sm text-soil/70 mb-4">No fixed packages listed for this specific filter yet.</p>
                  <Button to="/customize-trip" variant="primary" size="sm">
                    Customize a tailor-made trip
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Key Highlights Card */}
            <div className="bg-cream rounded-2xl p-5 border border-bark/20 shadow-nature">
              <h4 className="font-medium text-sm text-soil mb-4 pb-3 border-b border-bark/15 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sage" />
                <span>Trip highlights</span>
              </h4>
              <ul className="space-y-2 text-sm text-soil/75">
                {destination.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-sage rounded-full mt-1.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Travel Callout Box */}
            <div className="bg-pine rounded-2xl p-5 shadow-nature-lg">
              <span className="inline-block rounded-full bg-cream/20 text-cream/90 border border-cream/30 text-xs font-medium tracking-widest uppercase px-3 py-0.5 mb-3">
                Tailor-made
              </span>
              <h4 className="font-serif font-bold text-xl text-cream mb-2">
                Want a custom route for {destination.name}?
              </h4>
              <p className="text-sm text-cream/70 leading-relaxed mb-5">
                Combine secret side-valleys, select your preferred stay tier, or adapt the route for family pace.
              </p>
              <Button
                to={`/customize-trip?destination=${destination.slug}`}
                variant="gold"
                size="md"
                className="w-full justify-center text-sm"
              >
                Plan {destination.name} trip
              </Button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
