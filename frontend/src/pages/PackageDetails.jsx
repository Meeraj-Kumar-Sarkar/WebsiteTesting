import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Phone,
  Compass,
  ArrowLeft,
  Calendar,
  Share2,
  ShieldCheck,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { packages } from '../data/packages';
import AccommodationSelector from '../components/packages/AccommodationSelector';
import ItineraryDay from '../components/packages/ItineraryDay';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function PackageDetails() {
  const { slug } = useParams();
  const pkg = packages.find((p) => p.slug === slug);

  // Selected Accommodation Tier state (defaults to 3-star or first available)
  const [selectedTier, setSelectedTier] = useState('3-star');
  const [activeFaq, setActiveFaq] = useState(null);
  const [showEnquirySuccess, setShowEnquirySuccess] = useState(false);

  // Inline Quick Enquiry form state
  const [quickEnquiry, setQuickEnquiry] = useState({
    name: '',
    phone: '',
    email: '',
    dates: '',
    travellers: '2 Travellers',
    notes: ''
  });

  if (!pkg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center font-mono">
        <h2 className="font-serif text-3xl font-black uppercase text-[#344e41]">Package Not Found</h2>
        <p className="text-xs text-[#344e41]/80 mt-2 mb-5">The tour package you requested does not exist or has been relocated.</p>
        <Button to="/packages" variant="primary">
          View All Packages
        </Button>
      </div>
    );
  }

  const currentOption = pkg.accommodationOptions.find((opt) => opt.tier === selectedTier) || pkg.accommodationOptions[0];
  const activePrice = currentOption?.available ? currentOption.pricePerPerson : pkg.startingPrice;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(activePrice);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickEnquiry.name && quickEnquiry.phone) {
      setShowEnquirySuccess(true);
    }
  };

  const packageFaqs = [
    {
      q: "Can the itinerary be altered or extended?",
      a: "Yes. All our departures are private. You can add extra rest days in quiet hamlets, adjust the pace for children or senior travelers, or modify arrival and departure hubs."
    },
    {
      q: "What vehicles are utilized for this mountain route?",
      a: "We deploy sanitized, private high-clearance Toyota Innova, Crysta, or 4x4 Mahindra Scorpios driven by certified local Himalayan drivers experienced with steep mountain passes."
    },
    {
      q: "Are meal choices flexible for dietary requirements?",
      a: "Yes. We accommodate pure vegetarian, vegan, Jain, and gluten-sensitive requests. Stays serve wholesome, freshly cooked regional and North Indian meals."
    }
  ];

  return (
    <div className="bg-[#dad7cd] pb-24">
      
      {/* 1. Large Destination Hero */}
      <section className="relative min-h-[50vh] sm:min-h-[58vh] flex items-end justify-start overflow-hidden border-b-2 border-[#344e41] bg-[#344e41]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={pkg.heroImage || pkg.coverImage}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-white w-full">
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#a3b18a] hover:text-white mb-3 underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Packages
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono">
            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-[#588157] text-white border border-white">
              {pkg.tripType}
            </span>
            {pkg.label && (
              <span className="px-2 py-0.5 text-xs font-bold uppercase bg-[#3a5a40] text-white border border-white">
                {pkg.label}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            {pkg.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-[#dad7cd]">
            <span className="flex items-center gap-1.5 bg-[#344e41] px-2 py-0.5 border border-white">
              <Clock className="w-3.5 h-3.5 text-[#a3b18a]" />
              {pkg.duration}
            </span>
            <span className="flex items-center gap-1.5 bg-[#344e41] px-2 py-0.5 border border-white">
              <MapPin className="w-3.5 h-3.5 text-[#a3b18a]" />
              {pkg.destinationName}
            </span>
            <span className="flex items-center gap-1.5 bg-[#3a5a40] px-2 py-0.5 border border-white text-white font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% PRIVATE
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview */}
            <div className="bg-white rounded-none p-6 sm:p-8 border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41]">
              <span className="font-mono text-xs font-bold uppercase text-[#588157] block mb-1">
                // TRIP OVERVIEW
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black uppercase text-[#344e41] mb-3">
                ABOUT THIS JOURNEY
              </h2>
              <p className="text-[#344e41]/85 text-xs sm:text-sm leading-relaxed mb-5 font-medium">
                {pkg.overview}
              </p>

              {/* Highlights List */}
              <div className="pt-4 border-t-2 border-[#dad7cd]">
                <h3 className="font-mono font-bold text-xs uppercase text-[#344e41] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#588157]" />
                  <span>Key Journey Highlights:</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-[#344e41]">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#588157] mt-1.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Accommodation Tier Interactive Selector */}
            <div className="border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41]">
              <AccommodationSelector
                options={pkg.accommodationOptions}
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
              />
            </div>

            {/* Day by Day Itinerary */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono text-xs font-bold uppercase text-[#588157] block">
                    // ITINERARY BREAKDOWN
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-black uppercase text-[#344e41]">
                    DAY-BY-DAY ROUTE
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#344e41]/60 hidden sm:inline">
                  Click any day to expand
                </span>
              </div>

              <div className="space-y-2.5">
                {pkg.itinerary.map((dayItem, index) => (
                  <ItineraryDay
                    key={dayItem.day}
                    item={dayItem}
                    defaultOpen={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Inclusions and Exclusions Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Inclusions */}
              <div className="bg-white rounded-none p-5 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
                <h4 className="font-mono font-bold text-sm text-[#344e41] mb-3 flex items-center gap-1.5 pb-2 border-b-2 border-[#344e41] uppercase">
                  <Check className="w-4 h-4 text-[#588157]" />
                  <span>What is Included</span>
                </h4>
                <ul className="space-y-2 font-mono text-xs text-[#344e41]/90">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#588157] flex-shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-none p-5 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41]">
                <h4 className="font-mono font-bold text-sm text-[#344e41] mb-3 flex items-center gap-1.5 pb-2 border-b-2 border-[#344e41] uppercase">
                  <X className="w-4 h-4 text-red-600" />
                  <span>What is Not Included</span>
                </h4>
                <ul className="space-y-2 font-mono text-xs text-[#344e41]/90">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Important Notes */}
            {pkg.importantNotes && (
              <div className="p-5 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] font-mono">
                <h4 className="font-bold text-xs text-[#344e41] uppercase mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#588157]" />
                  <span>Important Mountain &amp; Altitude Notes</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[#344e41]/85">
                  {pkg.importantNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#588157] mt-1 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs Accordion */}
            <div className="bg-white rounded-none p-6 sm:p-8 border-2 border-[#344e41] shadow-[4px_4px_0px_0px_#344e41]">
              <h3 className="font-serif text-2xl font-black uppercase text-[#344e41] mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#588157]" />
                <span>Frequently Asked Questions</span>
              </h3>
              <div className="space-y-2.5 font-mono">
                {packageFaqs.map((faq, idx) => (
                  <div key={idx} className="border-2 border-[#344e41] bg-[#dad7cd]/20">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full p-3 text-left font-bold text-xs uppercase text-[#344e41] hover:bg-[#dad7cd]/50 flex items-center justify-between cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === idx && (
                      <div className="p-3 text-xs text-[#344e41]/90 leading-relaxed border-t-2 border-[#344e41] bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking / Quick Enquiry Card */}
          <div className="lg:col-span-4 font-mono">
            <div className="sticky top-20 bg-white rounded-none p-5 border-2 border-[#344e41] shadow-[5px_5px_0px_0px_#344e41] space-y-4">
              
              {/* Price Banner */}
              <div className="pb-3 border-b-2 border-[#344e41]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#344e41]/60">
                    Starting From
                  </span>
                  <span className="text-[10px] font-bold text-white bg-[#3a5a40] px-1.5 py-0.5 border border-[#344e41]">
                    {selectedTier} Tier
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#3a5a40]">
                    {formattedPrice}
                  </span>
                  <span className="text-[10px] text-[#344e41]/60">/ person (demo)</span>
                </div>
                <p className="text-[10px] text-[#344e41]/60 mt-0.5">
                  * Private vehicle &amp; accommodation included.
                </p>
              </div>

              {/* Quick Inquiry Form */}
              {showEnquirySuccess ? (
                <div className="p-4 bg-[#dad7cd]/50 border-2 border-[#344e41] text-center">
                  <div className="w-8 h-8 border-2 border-[#344e41] bg-[#588157] text-white mx-auto flex items-center justify-center mb-2 shadow-[1px_1px_0px_#344e41]">
                    <Check className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm uppercase text-[#344e41]">Enquiry Received!</h4>
                  <p className="text-xs text-[#344e41]/80 mt-1 leading-relaxed">
                    Thank you, <strong>{quickEnquiry.name}</strong>. Recorded for <em>{pkg.name}</em> in this prototype.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowEnquirySuccess(false)}
                    className="mt-2 text-xs font-bold text-[#3a5a40] underline cursor-pointer"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-3">
                  <div className="font-bold text-xs uppercase text-[#344e41]">
                    Quick Booking Enquiry
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={quickEnquiry.name}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number *"
                      value={quickEnquiry.phone}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={quickEnquiry.dates}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, dates: e.target.value })}
                      className="w-full px-2 py-1.5 text-[11px] bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                    />
                    <select
                      value={quickEnquiry.travellers}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, travellers: e.target.value })}
                      className="w-full px-2 py-1.5 text-[11px] bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="1 Traveller">1 Solo</option>
                      <option value="2 Travellers">2 Adults</option>
                      <option value="3-4 Travellers">3-4 People</option>
                      <option value="5+ Travellers">5+ Group</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center text-xs"
                  >
                    Request Itinerary &amp; Dates
                  </Button>
                </form>
              )}

              {/* Direct WhatsApp Callout */}
              <div className="pt-3 border-t-2 border-[#344e41] flex flex-col gap-2 text-center text-xs">
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Mountain%20and%20Memories,%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold uppercase bg-[#dad7cd] hover:bg-[#a3b18a] text-[#344e41] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-none"
                >
                  <Phone className="w-3.5 h-3.5 text-[#344e41]" />
                  <span>WhatsApp Trip Specialist</span>
                </a>

                <Link
                  to={`/customize-trip?package=${pkg.slug}`}
                  className="text-xs font-bold text-[#3a5a40] underline hover:text-[#344e41] pt-1"
                >
                  Customize this itinerary &rarr;
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
