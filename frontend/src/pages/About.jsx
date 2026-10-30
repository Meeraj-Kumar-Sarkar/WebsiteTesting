import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, Sparkles, Mountain, Users, Trees, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';

export default function About() {
  return (
    <div className="bg-[#dad7cd] pb-20">
      
      {/* Editorial Hero */}
      <section className="relative py-14 sm:py-20 bg-[#344e41] text-white border-b-2 border-[#344e41] overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80"
            alt="Uttarakhand mountain ranges"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <span>// OUR STORY &amp; ETHOS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-tight">
            MOUNTAINS ARE NOT CONQUERED. THEY ARE EXPERIENCED WITH HUMILITY.
          </h1>
          <p className="mt-4 text-xs sm:text-base text-[#dad7cd] max-w-3xl mx-auto font-medium leading-relaxed">
            Mountain &amp; Memories was founded on a simple conviction: the greatest Himalayan journeys are slow, private, and rooted in deep respect for fragile mountain cultures.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase font-bold px-2 py-0.5 bg-[#a3b18a] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] text-[#344e41] mb-3">
              <span>// GUIDING PHILOSOPHY</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black uppercase text-[#344e41] leading-tight mb-4">
              TRAVEL THAT NOURISHES BOTH THE WANDERER AND THE VALLEY.
            </h2>
            <div className="space-y-3.5 text-[#344e41]/90 text-xs sm:text-sm leading-relaxed font-medium">
              <p>
                In the rush to commercialize mountain tourism, too many trips become frantic races between photo points. Guests return exhausted, having spent eight hours a day inside noisy shared buses, leaving behind litter and taking little genuine connection home.
              </p>
              <p>
                We wanted a completely different travel agency. One that balances aspirational beauty with mindful pacing. We plan days with time to sit beneath centuries-old apricot trees, listen to temple bells in Tabo, drink salty butter tea with Changpa nomads, and watch the evening light paint Mt. Nanda Devi in shades of molten bronze.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button to="/packages" variant="primary" size="md">
                Browse Curated Journeys
              </Button>
              <Button to="/customize-trip" variant="secondary" size="md">
                Plan a Custom Departure
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-none overflow-hidden border-2 border-[#344e41] shadow-[5px_5px_0px_0px_#344e41] bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
                alt="Ancient Spiti monastery on mountain cliff"
                className="w-full aspect-[4/5] object-cover border border-[#344e41]"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#a3b18a] p-3 border-2 border-[#344e41] shadow-[3px_3px_0px_#344e41] max-w-xs hidden sm:block">
              <div className="flex items-center gap-1.5 text-[#344e41] font-mono font-bold text-xs uppercase">
                <Trees className="w-4 h-4 text-[#344e41]" />
                <span>Zero Single-Use Plastic</span>
              </div>
              <p className="font-mono text-[10px] text-[#344e41]/90 mt-1">
                We supply insulated stainless flasks &amp; spring refill stations on all voyages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-16 md:py-20 border-y-2 border-[#344e41]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Our Pillars"
            title="HOW WE CRAFT EVERY ITINERARY"
            subtitle="Four core standards that protect your comfort, safety, and cultural authenticity."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#dad7cd]/40 p-6 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-black uppercase text-[#344e41] mb-2">
                Altitude Mindful Pacing
              </h3>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                We never rush ascents. High altitude circuits have built-in physiological acclimatization windows, pulse oximetry checks, and emergency oxygen canisters.
              </p>
            </div>

            <div className="bg-[#dad7cd]/40 p-6 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-black uppercase text-[#344e41] mb-2">
                Direct Native Custodians
              </h3>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                Native mountain chauffeurs and certified naturalists. Over 75% of your travel investment goes directly into local village homestays and community suppliers.
              </p>
            </div>

            <div className="bg-[#dad7cd]/40 p-6 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
              <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white flex items-center justify-center mb-4 shadow-[2px_2px_0px_#344e41]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-lg font-black uppercase text-[#344e41] mb-2">
                Transparent Accommodation
              </h3>
              <p className="text-xs sm:text-sm text-[#344e41]/85 leading-relaxed font-medium">
                Honest 3-star, 4-star, and 5-star tiers. If a pristine high pass cannot ecologically support a luxury concrete hotel, we provide high-grade boutique eco-glamping instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Callout */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-[#344e41] rounded-none p-6 sm:p-12 text-white border-2 border-[#344e41] shadow-[6px_6px_0px_0px_#344e41]">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-[#dad7cd] font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3">
            <span>// READY TO BEGIN?</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-black uppercase text-white mb-3">
            LET US PLAN YOUR HIMALAYAN JOURNEY TOGETHER.
          </h3>
          <p className="text-[#dad7cd] text-xs sm:text-sm max-w-xl mx-auto mb-6 font-medium">
            Connect with our trip planners to tailor routes, dates, and stay categories suited exactly to your party.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button to="/customize-trip" variant="gold" size="md">
              Customize Your Trip
            </Button>
            <Button to="/contact" variant="outlineWhite" size="md">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
