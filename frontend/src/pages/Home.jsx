import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, ArrowRight, ArrowDown, Shield, Layers, MapPin,
  Leaf, Users, Star, Mountain, Clock, ChevronRight, Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import DestinationGrid from '../components/destinations/DestinationGrid';
import PackageCard from '../components/packages/PackageCard';
import GalleryGrid from '../components/gallery/GalleryGrid';
import BlogCard from '../components/blog/BlogCard';
import CustomizeTripForm from '../components/forms/CustomizeTripForm';

import { destinations } from '../data/destinations';
import { packages } from '../data/packages';
import { galleryItems } from '../data/gallery';
import { blogPosts } from '../data/blogPosts';
import { scoutedProperties } from '../data/scoutedProperties';

/* ── Scroll-reveal hook ─────────────────────────────────── */
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

/* ── Animated counter ───────────────────────────────────── */
function Counter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Floating info card ─────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════*/
export default function Home() {
  const featuredPackages = packages.filter((p) => p.featured).slice(0, 3);
  const previewGallery   = galleryItems.slice(0, 6);
  const recentPosts      = blogPosts.slice(0, 3);
  const highlightedStays = scoutedProperties.filter((p) =>
    ['shimla-5star', 'kaza-3star', 'chandrataal-4star-premium', 'sissu-4star-premium'].includes(p.id)
  );

  /* Section refs */
  const [whyRef,   whyIn]   = useInView();
  const [destRef,  destIn]  = useInView();
  const [pkgRef,   pkgIn]   = useInView();
  const [stayRef,  stayIn]  = useInView();
  const [galRef,   galIn]   = useInView();
  const [blogRef,  blogIn]  = useInView();
  const [formRef,  formIn]  = useInView();

  return (
    <div className="bg-beige text-soil">

      {/* ══════════════════════════════════════════════════
          HERO — template-inspired split layout
      ═══════════════════════════════════════════════════*/}
      <section className="relative overflow-hidden bg-beige min-h-[calc(100vh-4rem)] flex flex-col">

        {/* Subtle background gradient blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-fern/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main two-column hero */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 pt-10 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">

          {/* ── LEFT: Text content ───────────────────── */}
          <div className="animate-slide-left space-y-7 order-2 lg:order-1">

            {/* Badge pill */}
            <span className="section-label animate-fade-in">
              <Leaf className="w-3 h-3" />
              Thoughtful Himalayan Journeys
            </span>

            {/* Headline — large & bold like template */}
            <div className="space-y-1">
              <h1 className="font-serif font-black text-5xl sm:text-6xl xl:text-7xl text-soil leading-[1.05] tracking-tight">
                Your mountains,
              </h1>
              <h1 className="font-serif font-black text-5xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-gradient">
                your memories.
              </h1>
            </div>

            {/* Description */}
            <p className="text-soil/65 text-base sm:text-lg leading-relaxed max-w-md" style={{ animationDelay: '0.2s' }}>
              We curate private road journeys through the Himalayas — planned around your pace, with verified local guides, handpicked stays, and zero cookie-cutter itineraries.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-soil text-cream text-sm font-semibold rounded-full hover:bg-pine transition-all duration-200 shadow-nature-md hover:shadow-nature-lg hover:-translate-y-0.5"
              >
                <span className="w-6 h-6 rounded-full bg-cream/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </span>
                Explore Packages
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-soil text-sm font-semibold rounded-full hover:bg-beige/80 transition-colors"
              >
                Explore Routes
              </Link>
            </div>

            {/* Season widget — analogous to temperature card in template */}
            <div
              className="inline-block bg-cream rounded-2xl p-5 shadow-nature border border-bark/10 mt-2 animate-scale-in"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] font-semibold text-soil/40 uppercase tracking-widest">Ideal Trekking Season</span>
                <ArrowRight className="w-3.5 h-3.5 text-sage -rotate-45" />
              </div>
              {/* Circular season indicator */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#dad7cd" strokeWidth="6" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#588157" strokeWidth="6"
                      strokeDasharray="130" strokeDashoffset="40" strokeLinecap="round" />
                  </svg>
                  <Mountain className="w-5 h-5 text-pine" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-soil">May – Oct</div>
                  <div className="text-xs text-soil/50 mt-0.5">Peak season · 6 months</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-soil/50 border-t border-bark/10 pt-3">
                <span className="flex items-center gap-1"><span>🌸</span> Spring</span>
                <span className="flex items-center gap-1"><span>☀️</span> Summer</span>
                <span className="flex items-center gap-1"><span>🍂</span> Autumn</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Blob image + floating cards ──── */}
          <div className="relative order-1 lg:order-2 animate-slide-right flex justify-center lg:justify-end">

            {/* Mountain photo in organic blob */}
            <div className="relative w-full max-w-lg xl:max-w-xl">
              <div
                className="relative overflow-hidden shadow-nature-xl"
                style={{ borderRadius: '3rem 8rem 3rem 3rem' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=85"
                  alt="Himalayan mountain peaks"
                  className="w-full aspect-[5/4] object-cover"
                  loading="eager"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tl from-pine/40 via-transparent to-transparent" />

                {/* Route dashed line SVG overlay */}
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
                  {/* Map markers */}
                  <circle cx="60" cy="340" r="5" fill="#a3b18a" />
                  <circle cx="200" cy="220" r="5" fill="#a3b18a" />
                  <circle cx="280" cy="120" r="5" fill="#a3b18a" />
                  <circle cx="340" cy="60" r="6" fill="#f97316" />
                </svg>

                {/* Social proof inside image — bottom right */}
                <div className="absolute bottom-5 right-5 flex items-center gap-3 glass-card px-3 py-2.5">
                  <div className="avatar-stack">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                    ].map((src, i) => (
                      <img key={i} src={src} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ))}
                  </div>
                  <div>
                    <div className="text-lg font-black text-soil font-serif leading-none">
                      <Counter target={2500} suffix="+" />
                    </div>
                    <div className="text-[10px] text-soil/60 leading-tight">Happy travellers</div>
                  </div>
                </div>
              </div>

              {/* ── Floating cards ──────────────────── */}

              {/* Card 1: Risk / Altitude tag (top right) */}
              <FloatCard className="-top-4 -right-4 lg:-right-8" delay="0.3s">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/90 flex items-center justify-center">
                    <Mountain className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] text-soil/50 font-medium uppercase tracking-wide">Altitude Range</div>
                    <div className="text-sm font-bold text-soil">1,500 – 5,400m</div>
                  </div>
                </div>
              </FloatCard>

              {/* Card 2: Curated stays (middle right) */}
              <FloatCard className="top-1/2 -translate-y-1/2 -right-4 lg:-right-10" delay="0.6s">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-fern flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-cream" />
                  </div>
                  <div>
                    <div className="text-[9px] text-soil/50 font-medium uppercase tracking-wide">Curated Stays</div>
                    <div className="text-sm font-bold text-pine">48 Properties</div>
                  </div>
                </div>
              </FloatCard>

              {/* Card 3: Best match — bottom left */}
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

        {/* ── Bottom feature pills strip (like template) ─── */}
        <div className="border-t border-bark/10 bg-cream/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { icon: MapPin,   label: 'Regional Guides',    to: '/destinations' },
                { icon: Compass,  label: 'Tour Packages',      to: '/packages'     },
                { icon: Star,     label: 'Scouted Stays (48)', to: '/stays'        },
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

      {/* ══════════════════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════════════════*/}
      <section id="why-us" className="py-20 md:py-28 bg-cream" ref={whyRef}>
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
              { icon: Compass,      title: 'Personalised Routes',  body: 'No cookie-cutter buses. Every itinerary calibrated around your pace, altitude tolerance, and interests.' },
              { icon: MapPin,       title: 'Rooted Guides',        body: 'Native Himalayan drivers who know every curve, seasonal blossom, and hidden tea house.' },
              { icon: Layers,       title: 'Clear Stay Tiers',     body: '3-star homestays, 4-star boutique eco-resorts, or 5-star glamping — zero hidden fees.' },
              { icon: Shield,       title: 'On-Trip Support',      body: 'Dedicated trip managers, emergency oxygen kits, and active weather tracking throughout.' },
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

          {/* Stats row */}
          <div
            className={`mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-pine rounded-3xl reveal ${whyIn ? 'reveal-visible' : 'reveal-hidden'}`}
            style={{ transitionDelay: '450ms' }}
          >
            {[
              { n: 2500, suffix: '+', label: 'Happy Travellers' },
              { n: 48,   suffix: '',  label: 'Curated Stays'    },
              { n: 12,   suffix: '',  label: 'Himalayan Regions' },
              { n: 100,  suffix: '%', label: 'Private Groups'   },
            ].map(({ n, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black font-serif text-cream">
                  <Counter target={n} suffix={suffix} />
                </div>
                <div className="text-xs text-cream/60 mt-1 font-medium uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DESTINATIONS
      ═══════════════════════════════════════════════════*/}
      <section className="py-20 md:py-28 bg-beige" ref={destRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 reveal ${destIn ? 'reveal-visible' : 'reveal-hidden'}`}>
            <SectionHeading
              tag="Himalayan States"
              title="Four extraordinary regions"
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

      {/* ══════════════════════════════════════════════════
          FEATURED PACKAGES
      ═══════════════════════════════════════════════════*/}
      <section className="py-20 md:py-28 bg-cream" ref={pkgRef}>
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
              All {packages.length} Packages
            </Button>
          </div>

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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SCOUTED STAYS — card grid
      ═══════════════════════════════════════════════════*/}
      <section className="py-20 md:py-28 bg-beige" ref={stayRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 reveal ${stayIn ? 'reveal-visible' : 'reveal-hidden'}`}>
            <SectionHeading
              tag="Vetted Accommodations"
              title="Scouted Himalayan stays"
              subtitle="Heritage colonial hotels, pine lodges, and high-altitude glamping domes across 12 locations."
              align="left"
              className="mb-0 max-w-xl"
            />
            <Button to="/stays" variant="primary" size="md" className="mt-4 md:mt-0 self-start shrink-0" icon={ArrowRight} iconPosition="right">
              All 48 Properties
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlightedStays.map((stay, i) => (
              <div
                key={stay.id}
                className={`card-premium overflow-hidden group reveal ${stayIn ? 'reveal-visible' : 'reveal-hidden'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={stay.coverImage} alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
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

      {/* ══════════════════════════════════════════════════
          GALLERY
      ═══════════════════════════════════════════════════*/}
      <section className="py-20 md:py-28 bg-cream" ref={galRef}>
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

      {/* ══════════════════════════════════════════════════
          BLOG
      ═══════════════════════════════════════════════════*/}
      <section className="py-20 md:py-28 bg-beige" ref={blogRef}>
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

      {/* ══════════════════════════════════════════════════
          CUSTOMIZE TRIP FORM
      ═══════════════════════════════════════════════════*/}
      <section id="customizer" className="py-20 md:py-28 bg-pine" ref={formRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className={`text-center max-w-2xl mx-auto mb-10 reveal ${formIn ? 'reveal-visible' : 'reveal-hidden'}`}>
            <span className="section-label !bg-sage/20 !text-cream !border-sage/30 mb-4">
              <Compass className="w-3 h-3" />
              Bespoke Itinerary Builder
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream leading-snug mt-4">
              Design a trip unique to you
            </h2>
            <p className="mt-4 text-cream/65 leading-relaxed">
              Don't see a fixed package that fits your timeline? Tell us your dates, group size, and style — we'll craft a bespoke blueprint.
            </p>
          </div>

          <div
            className={`bg-cream rounded-3xl p-5 sm:p-8 shadow-nature-xl max-w-3xl mx-auto reveal ${formIn ? 'reveal-visible' : 'reveal-hidden'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <CustomizeTripForm />
          </div>
        </div>
      </section>

    </div>
  );
}
