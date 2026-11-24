import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, ArrowRight, ArrowDown, Shield, Layers, MapPin,
  Leaf, Star, Mountain, Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import DestinationGrid from '../components/destinations/DestinationGrid';
import PackageCard from '../components/packages/PackageCard';
import GalleryGrid from '../components/gallery/GalleryGrid';
import BlogCard from '../components/blog/BlogCard';
import CustomizeTripForm from '../components/forms/CustomizeTripForm';
import { frontendApi } from '../api/client';

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

function FloatCard({ children, className = '', delay = '0s' }) {
  return (
    <div
      className={`float-card absolute animate-float ${className}`}
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [stays, setStays] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    frontendApi.getPackages().then(setPackages).catch(() => {});
    frontendApi.getDestinations().then(setDestinations).catch(() => {});
    frontendApi.getStays().then(setStays).catch(() => {});
    frontendApi.getPublicGallery().then(setGalleryItems).catch(() => {});
    frontendApi.getBlogs().then(setBlogPosts).catch(() => {});
  }, []);

  const featuredPackages = packages.slice(0, 3);
  const previewGallery   = galleryItems.slice(0, 6);
  const recentPosts      = blogPosts.slice(0, 3);
  const highlightedStays = stays.slice(0, 4);

  const [whyRef,   whyIn]   = useInView();
  const [destRef,  destIn]  = useInView();
  const [pkgRef,   pkgIn]   = useInView();
  const [stayRef,  stayIn]  = useInView();
  const [galRef,   galIn]   = useInView();
  const [blogRef,  blogIn]  = useInView();
  const [formRef,  formIn]  = useInView();

  return (
    <div className="bg-transparent text-soil">

      {/* HERO */}
      <section className="relative overflow-hidden bg-transparent min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pine/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-fern/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 pt-10 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">

          {/* LEFT: Text content */}
          <div className="animate-slide-left space-y-7 order-2 lg:order-1">
            <span className="section-label animate-fade-in">
              <Leaf className="w-3 h-3" />
              Private Himalayan Expeditions
            </span>

            <div className="space-y-1">
              <h1 className="font-sans font-extrabold text-5xl sm:text-6xl xl:text-7xl text-soil leading-[1.02] tracking-tight">
                Your mountains,
              </h1>
              <h1 className="font-sans font-extrabold text-5xl sm:text-6xl xl:text-7xl leading-[1.02] tracking-tight text-gradient">
                your memories.
              </h1>
            </div>

            <p className="text-soil/75 text-base sm:text-lg leading-relaxed max-w-md font-normal" style={{ animationDelay: '0.2s' }}>
              We architect private road expeditions through the Himalayas — built around your schedule, with vetted local leads, scouted stays, and uncompromising logistical precision.
            </p>

            <div className="flex flex-wrap items-center gap-3" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-sage text-[#06150a] text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#a6e645] transition-all duration-200 shadow-nature-md hover:shadow-nature-lg hover:-translate-y-0.5"
              >
                Explore Packages
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b2313]/80 backdrop-blur-md border border-bark/40 text-soil text-xs font-bold uppercase tracking-wider rounded-md hover:border-sage/55 hover:bg-pine/40 transition-all"
              >
                Explore Routes
              </Link>
            </div>

            <div
              className="inline-block glass-card p-5 mt-2 animate-scale-in"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-bold text-sage uppercase tracking-[0.16em]">Operational Season</span>
                <ArrowRight className="w-3.5 h-3.5 text-sage -rotate-45" />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(27,131,67,0.28)" strokeWidth="5" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#95d534" strokeWidth="5"
                      strokeDasharray="130" strokeDashoffset="40" strokeLinecap="round" />
                  </svg>
                  <Mountain className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-sans text-soil">May – Oct</div>
                  <div className="text-xs text-soil/60 mt-0.5">Peak window · 6 months</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mt-4 text-[11px] font-semibold uppercase tracking-wider text-soil/65 border-t border-bark/25 pt-3">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-sage" /> Spring</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-fern" /> Summer</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pine" /> Autumn</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial framed image + floating executive cards */}
          <div className="relative order-1 lg:order-2 animate-slide-right flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg xl:max-w-xl">
              <div
                className="relative overflow-hidden rounded-2xl border border-white/20 shadow-nature-xl"
              >
                <img
                  src={`${import.meta.env.BASE_URL}hero-himalaya.jpg`}
                  alt="Himalayan mountain peaks"
                  className="w-full aspect-[5/4] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-tl from-[#041209]/70 via-transparent to-transparent" />

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path
                    d="M 60 340 Q 150 280 200 220 Q 250 160 280 120 Q 310 80 340 60"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    opacity="0.6"
                    className="animate-dash"
                  />
                  <circle cx="60" cy="340" r="5" fill="#1b8343" />
                  <circle cx="200" cy="220" r="5" fill="#1b8343" />
                  <circle cx="280" cy="120" r="5" fill="#1b8343" />
                  <circle cx="340" cy="60" r="6" fill="#95d534" />
                </svg>
              </div>

              <FloatCard className="-top-4 -right-4 lg:-right-8" delay="0.3s">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-fern/90 flex items-center justify-center">
                    <Mountain className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] text-soil/50 font-medium uppercase tracking-wide">Altitude Range</div>
                    <div className="text-sm font-bold text-soil">1,500 – 5,400m</div>
                  </div>
                </div>
              </FloatCard>

              <FloatCard className="top-1/2 -translate-y-1/2 -right-4 lg:-right-10" delay="0.6s">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-fern flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-cream" />
                  </div>
                  <div>
                    <div className="text-[9px] text-soil/50 font-medium uppercase tracking-wide">Curated Stays</div>
                    <div className="text-sm font-bold text-pine">Verified Properties</div>
                  </div>
                </div>
              </FloatCard>

              <FloatCard className="bottom-16 -left-4 lg:-left-10" delay="0.9s">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pine flex items-center justify-center">
                    <Compass className="w-3.5 h-3.5 text-cream" />
                  </div>
                  <div>
                    <div className="text-[9px] text-soil/50 font-medium uppercase tracking-wide">Private Groups</div>
                    <div className="text-sm font-bold text-soil">100% Custom</div>
                  </div>
                </div>
              </FloatCard>
            </div>
          </div>
        </div>

        {/* Bottom feature pills strip */}
        <div className="border-t border-white/15 bg-[#05130b]/45 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { icon: MapPin,   label: 'Regional Guides',  to: '/destinations' },
                { icon: Compass,  label: 'Stays & Packages', to: '/packages'     },
                { icon: Star,     label: 'Travel Gallery',   to: '/gallery'      },
              ].map(({ icon: Icon, label, to }) => (
                <Link key={to} to={to} className="feature-pill">
                  <Icon className="w-3.5 h-3.5 pill-icon" />
                  {label}
                </Link>
              ))}
              <Link to="/customize-trip" className="feature-pill !bg-pine/10 !border-pine/20 !text-pine font-semibold hover:!bg-pine hover:!text-cream">
                <Sparkles className="w-3.5 h-3.5" />
                Plan Custom Trip →
              </Link>
            </div>
            <button
              onClick={() => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-8 h-8 rounded-full bg-beige border border-bark/20 flex items-center justify-center hover:bg-beige/80 transition-colors shadow-nature-sm animate-bounce-soft"
              aria-label="Scroll down"
            >
              <ArrowDown className="w-4 h-4 text-soil/60" />
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" className="py-20 md:py-28 bg-[#041008]/30 border-y border-white/10" ref={whyRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className={`reveal ${whyIn ? 'reveal-visible' : 'reveal-hidden'} text-center mb-14`}>
            <SectionHeading
              tag="Why Choose Us"
              title="The Mountain &amp; Memories difference"
              subtitle="Thoughtful hospitality crafted for the unique terrain and soul of the Himalayas."
              align="center"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Compass, title: 'Personalised Routes', body: 'No cookie-cutter buses. Every itinerary calibrated around your pace, altitude tolerance, and interests.' },
              { icon: MapPin,  title: 'Rooted Guides',       body: 'Native Himalayan drivers who know every curve, seasonal blossom, and hidden tea house.' },
              { icon: Layers,  title: 'Clear Stay Tiers',    body: '3-star homestays, 4-star boutique eco-resorts, or 5-star glamping — zero hidden fees.' },
              { icon: Shield,  title: 'On-Trip Support',     body: 'Dedicated trip managers, emergency oxygen kits, and active weather tracking throughout.' },
            ].map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className={`card-premium p-6 reveal ${whyIn ? 'reveal-visible' : 'reveal-hidden'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-11 h-11 rounded-2xl bg-sage/20 text-pine flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-soil mb-2">{title}</h3>
                <p className="text-sm text-soil/65 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      {destinations.length > 0 && (
        <section className="py-20 md:py-28 bg-transparent" ref={destRef}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 reveal ${destIn ? 'reveal-visible' : 'reveal-hidden'}`}>
              <SectionHeading
                tag="Himalayan States"
                title="Extraordinary regions"
                subtitle="From cedar valleys in Himachal to the sacred peaks of Garhwal and moonscapes of Ladakh."
                align="left"
                className="mb-0 max-w-xl"
              />
              <Link to="/destinations" className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-pine hover:text-fern transition-colors shrink-0">
                All Regional Guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className={`reveal ${destIn ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '150ms' }}>
              <DestinationGrid destinations={destinations} />
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PACKAGES */}
      <section className="py-20 md:py-28 bg-[#041008]/30 border-y border-white/10" ref={pkgRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 reveal ${pkgIn ? 'reveal-visible' : 'reveal-hidden'}`}>
            <SectionHeading
              tag="Curated Itineraries"
              title="Featured Himalayan journeys"
              subtitle="Signature expeditions thoughtfully paced for comfort, wonder, and deep regional connection."
              align="left"
              className="mb-0 max-w-xl"
            />
            <Button to="/packages" variant="secondary" size="md" className="mt-4 md:mt-0 self-start shrink-0" icon={ArrowRight} iconPosition="right">
              All Packages
            </Button>
          </div>

          {featuredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPackages.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className={`reveal ${pkgIn ? 'reveal-visible' : 'reveal-hidden'}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 bg-beige rounded-2xl border border-bark/20 text-center">
              <p className="text-sm text-soil/70 mb-4">Use our bespoke itinerary builder below to design your custom Himalayan journey.</p>
              <Button to="/customize-trip" variant="primary" size="sm" icon={Compass}>
                Customize Your Journey
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* SCOUTED STAYS */}
      {highlightedStays.length > 0 && (
        <section className="py-20 md:py-28 bg-transparent" ref={stayRef}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 reveal ${stayIn ? 'reveal-visible' : 'reveal-hidden'}`}>
              <SectionHeading
                tag="Vetted Accommodations"
                title="Scouted Himalayan stays"
                subtitle="Heritage colonial hotels, pine lodges, and high-altitude glamping domes."
                align="left"
                className="mb-0 max-w-xl"
              />
              <Button to="/stays" variant="primary" size="md" className="mt-4 md:mt-0 self-start shrink-0" icon={ArrowRight} iconPosition="right">
                All Properties
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {highlightedStays.map((stay, i) => (
                <div
                  key={stay.id}
                  className={`card-premium overflow-hidden group reveal ${stayIn ? 'reveal-visible' : 'reveal-hidden'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-beige">
                    {stay.coverImage && (
                      <img
                        src={stay.coverImage} alt={stay.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-soil/50 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 bg-cream/90 text-pine rounded-full border border-sage/30 uppercase tracking-wide">
                      {stay.tierLabel}
                    </span>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-cream font-medium">
                      <span className="flex items-center gap-1 bg-soil/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3 text-sage" />{stay.destinationName}
                      </span>
                      <span className="bg-soil/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-sage font-semibold">{stay.pricePerNight}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif font-bold text-base text-soil line-clamp-1 mb-1">{stay.name}</h4>
                    {stay.tagline && <p className="text-xs text-fern italic mb-2 line-clamp-1">{stay.tagline}</p>}
                    <p className="text-xs text-soil/65 line-clamp-2 leading-relaxed">{stay.overview}</p>
                    <div className="mt-3 pt-3 border-t border-bark/10 flex items-center justify-between">
                      <span className="text-xs text-soil/50">Rating: <strong className="text-soil">{stay.rating}/5</strong></span>
                      <Link to={`/customize-trip?stay=${encodeURIComponent(stay.name)}`} className="text-xs font-semibold text-pine hover:text-fern transition-colors">
                        Select →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {previewGallery.length > 0 && (
        <section className="py-20 md:py-28 bg-[#041008]/30 border-y border-white/10" ref={galRef}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 reveal ${galIn ? 'reveal-visible' : 'reveal-hidden'}`}>
              <SectionHeading
                tag="Visual Moments"
                title="Moments caught in high silence"
                subtitle="A glimpse into the landscapes, quiet stays, and ancient cultures awaiting you."
                align="left"
                className="mb-0 max-w-xl"
              />
              <Button to="/gallery" variant="secondary" size="md" className="mt-4 md:mt-0 self-start shrink-0" icon={ArrowRight} iconPosition="right">
                Full Gallery
              </Button>
            </div>
            <div className={`reveal ${galIn ? 'reveal-visible' : 'reveal-hidden'}`} style={{ transitionDelay: '150ms' }}>
              <GalleryGrid items={previewGallery} />
            </div>
          </div>
        </section>
      )}

      {/* BLOG */}
      {recentPosts.length > 0 && (
        <section className="py-20 md:py-28 bg-transparent" ref={blogRef}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 reveal ${blogIn ? 'reveal-visible' : 'reveal-hidden'}`}>
              <SectionHeading
                tag="Stories &amp; Guides"
                title="Stories from the mountain trail"
                subtitle="Altitude advice, cultural reflections, and responsible exploration guides."
                align="left"
                className="mb-0 max-w-xl"
              />
              <Link to="/blog" className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-pine hover:text-fern transition-colors shrink-0">
                All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post, i) => (
                <div
                  key={post.id}
                  className={`reveal ${blogIn ? 'reveal-visible' : 'reveal-hidden'}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CUSTOMIZE TRIP FORM */}
      <section id="customizer" className="py-20 md:py-28 bg-[#041008]/40 border-t border-white/10" ref={formRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className={`text-center max-w-2xl mx-auto mb-10 reveal ${formIn ? 'reveal-visible' : 'reveal-hidden'}`}>
            <span className="section-label mb-4">
              <Compass className="w-3 h-3" />
              Bespoke Itinerary Builder
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold text-white leading-snug mt-4">
              Design a trip unique to you
            </h2>
            <p className="mt-4 text-soil/80 leading-relaxed">
              Tell us your dates, group size, and style — we'll craft a bespoke blueprint.
            </p>
          </div>

          <div
            className={`glass-card p-5 sm:p-8 max-w-3xl mx-auto reveal ${formIn ? 'reveal-visible' : 'reveal-hidden'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <CustomizeTripForm />
          </div>
        </div>
      </section>

    </div>
  );
}
