import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Shield,
  HeartHandshake,
  MapPin,
  Sparkles,
  ChevronDown,
  Phone,
  Calendar,
  Layers,
  Award,
  Building2,
  Star
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

export default function Home() {
  const featuredPackages = packages.filter((p) => p.featured).slice(0, 3);
  const previewGallery = galleryItems.slice(0, 6);
  const recentPosts = blogPosts.slice(0, 3);
  const highlightedStays = scoutedProperties.filter((p) => 
    p.id === 'shimla-5star' || p.id === 'kaza-3star' || p.id === 'chandrataal-4star-premium' || p.id === 'sissu-4star-premium'
  );

  return (
    <div className="bg-[#dad7cd] text-[#344e41]">
      
      {/* SECTION 1: HERO (Brutalist High-Contrast & Instant Response) */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden border-b-2 border-[#344e41]">
        {/* Background Mountain Photo */}
        <div className="absolute inset-0 z-0 bg-[#344e41]">
          <img
            src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2100&q=85"
            alt="Majestic Himalayan snow peaks"
            className="w-full h-full object-cover opacity-35"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[#344e41]/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16 sm:py-24">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3a5a40] border-2 border-white text-[#dad7cd] font-mono text-xs font-bold uppercase tracking-widest mb-6 shadow-[2px_2px_0px_#ffffff]">
            <span>// THOUGHTFUL HIMALAYAN JOURNEYS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white uppercase">
            FIND YOUR OWN KIND OF <span className="underline decoration-[#588157] underline-offset-8">EXTRAORDINARY.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-[#dad7cd] max-w-2xl mx-auto font-medium leading-relaxed">
            Thoughtfully planned private journeys through the high mountains, made memorable by authentic local custodians and quiet sanctuaries.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              to="/packages"
              variant="gold"
              size="lg"
              className="w-full sm:w-auto shadow-[3px_3px_0px_#ffffff] text-white"
              icon={ArrowRight}
              iconPosition="right"
            >
              Explore Packages
            </Button>
            <Button
              to="/customize-trip"
              variant="outlineWhite"
              size="lg"
              className="w-full sm:w-auto"
              icon={Compass}
              iconPosition="left"
            >
              Customize Your Trip
            </Button>
          </div>

          {/* Key Trust Signals (Brutalist Stat Boxes) */}
          <div className="mt-12 pt-6 border-t-2 border-white/20 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-[#dad7cd]">
            <div className="bg-[#344e41]/80 border-2 border-white/30 p-2.5">
              <span className="text-base font-bold text-white block">100% PRIVATE</span>
              <span className="text-[10px] text-[#a3b18a]">Custom Departures</span>
            </div>
            <div className="bg-[#344e41]/80 border-2 border-white/30 p-2.5">
              <span className="text-base font-bold text-white block">HANDPICKED</span>
              <span className="text-[10px] text-[#a3b18a]">48 Curated Stays</span>
            </div>
            <div className="bg-[#344e41]/80 border-2 border-white/30 p-2.5">
              <span className="text-base font-bold text-white block">CERTIFIED</span>
              <span className="text-[10px] text-[#a3b18a]">Native Drivers</span>
            </div>
            <div className="bg-[#344e41]/80 border-2 border-white/30 p-2.5">
              <span className="text-base font-bold text-white block">CONSCIOUS</span>
              <span className="text-[10px] text-[#a3b18a]">Leave No Trace</span>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK NAVIGATION SHORTCUT BAR (Makes navigation significantly easier!) */}
      <section className="bg-[#a3b18a] border-b-2 border-[#344e41] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-[#344e41] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#344e41] inline-block"></span>
            QUICK NAV STATION:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/destinations"
              className="bg-white border-2 border-[#344e41] px-2.5 py-1 text-[#344e41] font-bold shadow-[2px_2px_0px_#344e41] hover:bg-[#dad7cd]"
            >
              [ 01 ] Regional Guides
            </Link>
            <Link
              to="/packages"
              className="bg-white border-2 border-[#344e41] px-2.5 py-1 text-[#344e41] font-bold shadow-[2px_2px_0px_#344e41] hover:bg-[#dad7cd]"
            >
              [ 02 ] Tour Packages
            </Link>
            <Link
              to="/stays"
              className="bg-white border-2 border-[#344e41] px-2.5 py-1 text-[#344e41] font-bold shadow-[2px_2px_0px_#344e41] hover:bg-[#dad7cd]"
            >
              [ 03 ] Scouted Stays (48)
            </Link>
            <Link
              to="/customize-trip"
              className="bg-[#3a5a40] text-white border-2 border-[#344e41] px-2.5 py-1 font-bold shadow-[2px_2px_0px_#344e41] hover:bg-[#344e41]"
            >
              [ 04 ] Plan Custom Trip &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT MOUNTAIN AND MEMORIES */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Image Side with Brutalist Border Framing */}
          <div className="lg:col-span-6 relative">
            <div className="relative border-2 border-[#344e41] bg-white p-2 shadow-[5px_5px_0px_0px_#344e41]">
              <img
                src="https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=85"
                alt="Traveller looking at Himalayan valley"
                className="w-full aspect-[4/3] sm:aspect-[4/5] object-cover border border-[#344e41]"
                loading="lazy"
              />
              <div className="mt-2 pt-2 border-t border-[#344e41] flex items-center justify-between font-mono text-[11px] text-[#344e41]">
                <span>FIG 1.0 // HIGH RIDGE STILLNESS</span>
                <span className="font-bold">ALT: 3,800M</span>
              </div>
            </div>

            {/* Brutalist Overlapping Label Box */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-60 bg-[#a3b18a] p-3 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <p className="font-serif text-sm font-black text-[#344e41] uppercase">
                Tirthan Riverside
              </p>
              <p className="font-mono text-[11px] text-[#344e41]/90 mt-0.5">
                Mornings begin with wood smoke &amp; cedar needles.
              </p>
            </div>
          </div>

          {/* Story Side */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold px-2 py-0.5 bg-[#a3b18a] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] text-[#344e41]">
              <span>// ABOUT MOUNTAIN &amp; MEMORIES</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#344e41] leading-tight uppercase">
              JOURNEYS BORN FROM DEEP REVERENCE FOR THE HIGH HILLS.
            </h2>

            <p className="text-sm sm:text-base text-[#344e41]/90 leading-relaxed font-medium">
              We believe mountains are not tourist checklists to rush through in a hurried weekend. They are living, breathing sanctuaries shaped by centuries of ancestral wisdom, wooden architecture, glacial streams, and silent passes.
            </p>

            <p className="text-sm sm:text-base text-[#344e41]/90 leading-relaxed font-medium">
              Mountain &amp; Memories curates bespoke road journeys, nature walks, and peaceful retreats across Himachal Pradesh, Uttarakhand, Ladakh, and Kashmir. By keeping groups private and partnering directly with regional hosts, we ensure your journey leaves both meaningful memories with you and genuine economic support for the valley.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button to="/about" variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                Our Story &amp; Philosophy
              </Button>
              <Button to="/packages" variant="secondary" size="md">
                Browse Itineraries
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: WHY MOUNTAIN AND MEMORIES (Brutalist Feature Grid) */}
      <section className="bg-white py-16 md:py-24 border-y-2 border-[#344e41]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeading
            tag="Why Choose Us"
            title="THE MOUNTAIN & MEMORIES DIFFERENCE"
            subtitle="Thoughtful hospitality designed specifically for the unique terrain and soul of the Himalayas."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#dad7cd]/40 p-6 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-black uppercase text-[#344e41] mb-2">
                Personalized Routes
              </h3>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                No cookie-cutter tour buses. Every itinerary is calibrated around your pace, altitude tolerance, and interests.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#dad7cd]/40 p-6 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-black uppercase text-[#344e41] mb-2">
                Rooted Guides
              </h3>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                Native Himalayan drivers and naturalists who know every curve, seasonal blossom, and hidden tea house.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#dad7cd]/40 p-6 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-black uppercase text-[#344e41] mb-2">
                Clear Stays Tiers
              </h3>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                Choose between authentic 3-star homestays, 4-star boutique eco-resorts, or 5-star retreats with zero hidden fees.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#dad7cd]/40 p-6 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-black uppercase text-[#344e41] mb-2">
                On-Trip Support
              </h3>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                Dedicated trip managers, emergency oxygen kits in high-altitude vehicles, and active weather tracking.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: STATES AND DESTINATIONS WE COVER */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#344e41]">
          <SectionHeading
            tag="Himalayan States"
            title="FOUR EXTRAORDINARY REGIONS"
            subtitle="From cedar valleys in Himachal to the sacred peaks of Garhwal and moonscapes of Ladakh."
            align="left"
            className="mb-0 max-w-2xl"
          />
          <Link
            to="/destinations"
            className="mt-4 md:mt-0 font-mono text-xs font-bold uppercase text-[#344e41] hover:text-[#588157] flex items-center gap-1.5 underline underline-offset-4"
          >
            <span>View All Regional Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <DestinationGrid destinations={destinations} />
      </section>

      {/* SECTION 5: FEATURED TOUR PACKAGES */}
      <section className="bg-white py-16 md:py-24 border-t-2 border-[#344e41]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#344e41]">
            <SectionHeading
              tag="Curated Itineraries"
              title="FEATURED HIMALAYAN JOURNEYS"
              subtitle="Signature expeditions thoughtfully paced for comfort, wonder, and deep regional connection."
              align="left"
              className="mb-0 max-w-2xl"
            />
            <Button
              to="/packages"
              variant="secondary"
              size="md"
              className="mt-4 md:mt-0 self-start md:self-auto"
              icon={ArrowRight}
              iconPosition="right"
            >
              View All {packages.length} Packages
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5B: SCOUTED STAYS & BOUTIQUE LODGES PREVIEW */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-2 border-[#344e41]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#344e41]">
          <SectionHeading
            tag="Vetted Accommodations"
            title="SCOUTED HIMALAYAN STAYS &amp; CHALETS"
            subtitle="From heritage colonial grand hotels and heated pine lodges to high-altitude geodesic stargazing domes across 12 locations."
            align="left"
            className="mb-0 max-w-2xl"
          />
          <Button
            to="/stays"
            variant="primary"
            size="md"
            className="mt-4 md:mt-0 self-start md:self-auto"
            icon={ArrowRight}
            iconPosition="right"
          >
            Explore All 48 Properties
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlightedStays.map((stay) => (
            <div
              key={stay.id}
              className="group bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#344e41] transition-none flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/11] overflow-hidden bg-[#dad7cd] border-b-2 border-[#344e41]">
                  <img
                    src={stay.coverImage}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-none"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase bg-white text-[#344e41] border border-[#344e41]">
                      {stay.tierLabel}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[11px] text-white font-bold">
                    <span className="flex items-center gap-1 bg-[#344e41] px-1.5 py-0.5 border border-white">
                      <MapPin className="w-3 h-3 text-[#a3b18a]" />
                      {stay.destinationName}
                    </span>
                    <span className="bg-[#344e41] px-1.5 py-0.5 border border-white text-[#a3b18a]">
                      {stay.pricePerNight}
                    </span>
                  </div>
                </div>

                <div className="p-3.5">
                  <h4 className="font-serif font-black text-base uppercase text-[#344e41] line-clamp-1">
                    {stay.name}
                  </h4>
                  <p className="font-mono text-[11px] font-bold text-[#588157] uppercase tracking-wide mt-0.5 mb-1.5 line-clamp-1">
                    // {stay.tagline}
                  </p>
                  <p className="text-xs text-[#344e41]/80 line-clamp-2 leading-relaxed">
                    {stay.overview}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 border-t-2 border-[#dad7cd] flex items-center justify-between mt-2 font-mono text-xs">
                <span className="text-[#344e41]/80 text-[11px]">
                  RATING: <strong>{stay.rating} / 5</strong>
                </span>
                <Link
                  to={`/customize-trip?stay=${encodeURIComponent(stay.name)}`}
                  className="font-bold text-[#3a5a40] underline hover:text-[#344e41]"
                >
                  Select &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: GALLERY PREVIEW */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-2 border-[#344e41]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#344e41]">
          <SectionHeading
            tag="Visual Moments"
            title="MOMENTS CAUGHT IN HIGH SILENCE"
            subtitle="A glimpse into the landscapes, quiet stays, and ancient cultures that await you."
            align="left"
            className="mb-0 max-w-2xl"
          />
          <Button
            to="/gallery"
            variant="secondary"
            size="md"
            className="mt-4 md:mt-0 self-start md:self-auto"
            icon={ArrowRight}
            iconPosition="right"
          >
            Open Full Gallery
          </Button>
        </div>

        <GalleryGrid items={previewGallery} />
      </section>

      {/* SECTION 7: BLOG AND TRAVEL STORIES */}
      <section className="bg-white py-16 md:py-24 border-t-2 border-[#344e41]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-[#344e41]">
            <SectionHeading
              tag="Stories &amp; Guides"
              title="STORIES FROM THE MOUNTAIN TRAIL"
              subtitle="Practical altitude advice, cultural reflections, and responsible exploration guides."
              align="left"
              className="mb-0 max-w-2xl"
            />
            <Link
              to="/blog"
              className="mt-4 md:mt-0 font-mono text-xs font-bold uppercase text-[#344e41] hover:text-[#588157] flex items-center gap-1.5 underline underline-offset-4"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: CUSTOMIZE YOUR TRIP */}
      <section id="customizer" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#344e41] text-white border-t-2 border-[#344e41]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3a5a40] border-2 border-[#dad7cd] font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3">
              <span>// BESPOKE ITINERARY BUILDER</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
              DESIGN A TRIP UNIQUE TO YOU
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#dad7cd] leading-relaxed font-medium">
              Do not see a fixed package that fits your timeline? Tell us your preferred dates, party size, and travel style. We will craft a bespoke blueprint for you.
            </p>
          </div>

          <div className="bg-[#dad7cd] p-4 sm:p-8 border-2 border-white shadow-[6px_6px_0px_#ffffff] text-[#344e41]">
            <CustomizeTripForm />
          </div>

        </div>
      </section>

    </div>
  );
}
