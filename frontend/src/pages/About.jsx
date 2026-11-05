import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Sparkles, Trees } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
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

export default function About() {
  const [heroRef, heroInView] = useInView(0.08);
  const [philRef, philInView] = useInView();
  const [valuesRef, valuesInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  const values = [
    {
      icon: ShieldCheck,
      title: 'Altitude mindful pacing',
      body: 'We never rush ascents. High altitude circuits have built-in physiological acclimatization windows, pulse oximetry checks, and emergency oxygen canisters.',
    },
    {
      icon: Users,
      title: 'Direct native custodians',
      body: 'Native mountain chauffeurs and certified naturalists. Over 75% of your travel investment goes directly into local village homestays and community suppliers.',
    },
    {
      icon: Sparkles,
      title: 'Transparent accommodation',
      body: 'Honest 3-star, 4-star, and 5-star tiers. If a pristine high pass cannot ecologically support a luxury concrete hotel, we provide high-grade boutique eco-glamping instead.',
    },
  ];

  return (
    <div className="bg-cream pb-20">

      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-beige to-cream">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80"
            alt="Uttarakhand mountain ranges"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          ref={heroRef}
          className={`relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            Our story &amp; ethos
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-soil leading-tight">
            Mountains are not conquered. They are experienced with humility.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-soil/70 max-w-3xl mx-auto leading-relaxed">
            Mountain &amp; Memories was founded on a simple conviction: the greatest Himalayan journeys are slow, private, and rooted in deep respect for fragile mountain cultures.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div
          ref={philRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center transition-all duration-700 ease-out ${philInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div>
            <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-4">
              Guiding philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-soil leading-tight mb-4">
              Travel that nourishes both the wanderer and the valley.
            </h2>
            <div className="space-y-3.5 text-soil/75 text-sm leading-relaxed">
              <p>
                In the rush to commercialize mountain tourism, too many trips become frantic races between photo points. Guests return exhausted, having spent eight hours a day inside noisy shared buses, leaving behind litter and taking little genuine connection home.
              </p>
              <p>
                We wanted a completely different travel agency. One that balances aspirational beauty with mindful pacing. We plan days with time to sit beneath centuries-old apricot trees, listen to temple bells in Tabo, drink salty butter tea with Changpa nomads, and watch the evening light paint Mt. Nanda Devi in shades of molten bronze.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button to="/packages" variant="primary" size="md">
                Browse curated journeys
              </Button>
              <Button to="/customize-trip" variant="secondary" size="md">
                Plan a custom departure
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-bark/20 shadow-nature bg-cream p-2">
              <img
                src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
                alt="Ancient Spiti monastery on mountain cliff"
                className="w-full aspect-[4/5] object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-sage/90 p-3 rounded-xl border border-bark/20 shadow-nature-sm max-w-xs hidden sm:block backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-pine font-medium text-xs">
                <Trees className="w-4 h-4 text-pine" />
                <span>Zero single-use plastic</span>
              </div>
              <p className="text-xs text-soil/80 mt-1 leading-relaxed">
                We supply insulated stainless flasks &amp; spring refill stations on all voyages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-beige py-16 md:py-20 border-y border-bark/20">
        <div
          ref={valuesRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <SectionHeading
            tag="Our pillars"
            title="How we craft every itinerary"
            subtitle="Four core standards that protect your comfort, safety, and cultural authenticity."
            align="center"
          />

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 transition-all duration-700 ease-out ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {values.map((v, index) => (
              <div
                key={index}
                className="bg-cream rounded-2xl border border-bark/20 shadow-nature p-6 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-sage/20 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-pine" />
                </div>
                <h3 className="font-serif text-lg font-bold text-soil mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-soil/70 leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div
          ref={ctaRef}
          className={`bg-pine rounded-2xl p-8 sm:p-14 shadow-nature-lg transition-all duration-700 ease-out ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-cream/20 text-cream border border-cream/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            Ready to begin?
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-cream mb-3">
            Let us plan your Himalayan journey together.
          </h3>
          <p className="text-cream/75 text-sm max-w-xl mx-auto mb-7">
            Connect with our trip planners to tailor routes, dates, and stay categories suited exactly to your party.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button to="/customize-trip" variant="gold" size="md">
              Customize your trip
            </Button>
            <Button to="/contact" variant="outlineWhite" size="md">
              Contact our team
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
