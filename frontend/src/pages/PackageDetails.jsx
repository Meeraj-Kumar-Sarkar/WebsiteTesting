import React, { useState, useRef, useEffect } from 'react';
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
  ShieldCheck,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { packages } from '../data/packages';
import AccommodationSelector from '../components/packages/AccommodationSelector';
import ItineraryDay from '../components/packages/ItineraryDay';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

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

  const [overviewRef, overviewInView] = useInView();
  const [itinRef, itinInView] = useInView();
  const [inclRef, inclInView] = useInView();
  const [faqRef, faqInView] = useInView();

  if (!pkg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-soil">Package not found</h2>
        <p className="text-sm text-soil/70 mt-2 mb-5">The tour package you requested does not exist or has been relocated.</p>
        <Button to="/packages" variant="primary">
          View all packages
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
    <div className="bg-cream pb-24">

      {/* Hero */}
      <section className="relative min-h-[50vh] sm:min-h-[58vh] flex items-end justify-start overflow-hidden bg-pine border-b border-bark/20">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={pkg.heroImage || pkg.coverImage}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-pine/30 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-white w-full">
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sage hover:text-cream mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All packages
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-sage/30 text-cream border border-sage/40 backdrop-blur-sm">
              {pkg.tripType}
            </span>
            {pkg.label && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-fern/40 text-cream border border-fern/50 backdrop-blur-sm">
                {pkg.label}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight">
            {pkg.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-cream/80">
            <span className="flex items-center gap-1.5 bg-cream/10 backdrop-blur-sm px-3 py-1 rounded-full border border-cream/20">
              <Clock className="w-3.5 h-3.5 text-sage" />
              {pkg.duration}
            </span>
            <span className="flex items-center gap-1.5 bg-cream/10 backdrop-blur-sm px-3 py-1 rounded-full border border-cream/20">
              <MapPin className="w-3.5 h-3.5 text-sage" />
              {pkg.destinationName}
            </span>
            <span className="flex items-center gap-1.5 bg-fern/30 backdrop-blur-sm px-3 py-1 rounded-full border border-fern/40 text-cream font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Private
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
            <div
              ref={overviewRef}
              className={`bg-cream rounded-2xl p-6 sm:p-8 border border-bark/20 shadow-nature transition-all duration-700 ease-out ${overviewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-3 py-0.5 mb-3">
                Trip overview
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-soil mb-4">
                About this journey
              </h2>
              <p className="text-soil/75 text-sm leading-relaxed mb-6">
                {pkg.overview}
              </p>

              {/* Highlights List */}
              <div className="pt-5 border-t border-bark/15">
                <h3 className="font-medium text-sm text-soil flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-sage" />
                  <span>Key journey highlights</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-soil/75">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-sage rounded-full mt-2 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Accommodation Tier Interactive Selector */}
            <div className="rounded-2xl overflow-hidden border border-bark/20 shadow-nature">
              <AccommodationSelector
                options={pkg.accommodationOptions}
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
              />
            </div>

            {/* Day by Day Itinerary */}
            <div ref={itinRef}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-3 py-0.5 mb-2">
                    Itinerary breakdown
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-soil">
                    Day-by-day route
                  </h3>
                </div>
                <span className="text-xs text-soil/50 hidden sm:inline">
                  Click any day to expand
                </span>
              </div>

              <div className={`space-y-2.5 transition-all duration-700 ease-out ${itinInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
            <div
              ref={inclRef}
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-700 ease-out ${inclInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {/* Inclusions */}
              <div className="bg-cream rounded-2xl p-5 border border-bark/20 shadow-nature">
                <h4 className="font-medium text-sm text-soil mb-3 flex items-center gap-1.5 pb-3 border-b border-bark/15">
                  <Check className="w-4 h-4 text-fern" />
                  <span>What is included</span>
                </h4>
                <ul className="space-y-2 text-sm text-soil/75">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-fern flex-shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-cream rounded-2xl p-5 border border-bark/20 shadow-nature">
                <h4 className="font-medium text-sm text-soil mb-3 flex items-center gap-1.5 pb-3 border-b border-bark/15">
                  <X className="w-4 h-4 text-red-400" />
                  <span>What is not included</span>
                </h4>
                <ul className="space-y-2 text-sm text-soil/75">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Notes */}
            {pkg.importantNotes && (
              <div className="p-5 bg-beige rounded-2xl border border-bark/20 shadow-nature-sm">
                <h4 className="font-medium text-sm text-soil mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-sage" />
                  <span>Important mountain &amp; altitude notes</span>
                </h4>
                <ul className="space-y-1.5 text-sm text-soil/70">
                  {pkg.importantNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-sage rounded-full mt-1.5 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs Accordion */}
            <div
              ref={faqRef}
              className={`bg-cream rounded-2xl p-6 sm:p-8 border border-bark/20 shadow-nature transition-all duration-700 ease-out ${faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <h3 className="font-serif text-2xl font-bold text-soil mb-5 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sage" />
                <span>Frequently asked questions</span>
              </h3>
              <div className="space-y-3">
                {packageFaqs.map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-bark/20 overflow-hidden bg-beige/40">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full p-4 text-left font-medium text-sm text-soil hover:bg-beige/70 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-soil/50 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === idx && (
                      <div className="px-4 pb-4 text-sm text-soil/70 leading-relaxed border-t border-bark/15 pt-3 bg-cream">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking / Quick Enquiry Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-cream rounded-2xl p-5 border border-bark/20 shadow-nature-lg space-y-4">

              {/* Price Banner */}
              <div className="pb-4 border-b border-bark/15">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-soil/50 uppercase tracking-wide font-medium">
                    Starting from
                  </span>
                  <span className="text-xs font-medium text-cream bg-pine px-2 py-0.5 rounded-full">
                    {selectedTier} tier
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-pine">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-soil/50">/ person (demo)</span>
                </div>
                <p className="text-xs text-soil/50 mt-1">
                  * Private vehicle &amp; accommodation included.
                </p>
              </div>

              {/* Quick Inquiry Form */}
              {showEnquirySuccess ? (
                <div className="p-4 bg-sage/10 rounded-xl border border-sage/30 text-center">
                  <div className="w-9 h-9 rounded-full bg-fern flex items-center justify-center mx-auto mb-2">
                    <Check className="w-4 h-4 text-cream" />
                  </div>
                  <h4 className="font-medium text-sm text-soil">Enquiry received!</h4>
                  <p className="text-xs text-soil/70 mt-1 leading-relaxed">
                    Thank you, <strong>{quickEnquiry.name}</strong>. Recorded for <em>{pkg.name}</em> in this prototype.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowEnquirySuccess(false)}
                    className="mt-2 text-xs font-medium text-pine underline cursor-pointer"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-3">
                  <div className="font-medium text-sm text-soil">
                    Quick booking enquiry
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your full name *"
                      value={quickEnquiry.name}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp number *"
                      value={quickEnquiry.phone}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={quickEnquiry.dates}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, dates: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none"
                    />
                    <select
                      value={quickEnquiry.travellers}
                      onChange={(e) => setQuickEnquiry({ ...quickEnquiry, travellers: e.target.value })}
                      className="w-full px-2 py-2 text-xs bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none cursor-pointer"
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
                    className="w-full justify-center text-sm"
                  >
                    Request itinerary &amp; dates
                  </Button>
                </form>
              )}

              {/* Direct WhatsApp Callout */}
              <div className="pt-3 border-t border-bark/15 flex flex-col gap-2 text-center text-xs">
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Mountain%20and%20Memories,%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-beige text-soil border border-bark/25 rounded-2xl hover:bg-sage/20 transition-colors shadow-nature-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-pine" />
                  <span>WhatsApp trip specialist</span>
                </a>

                <Link
                  to={`/customize-trip?package=${pkg.slug}`}
                  className="text-xs font-medium text-pine hover:text-fern transition-colors pt-1"
                >
                  Customize this itinerary →
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
