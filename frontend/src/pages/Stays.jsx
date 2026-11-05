import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Star,
  MapPin,
  Check,
  Search,
  Filter,
  RotateCcw,
  Phone,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { scoutedDestinations, propertyTiers, scoutedProperties } from '../data/scoutedProperties';
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

export default function Stays() {
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Enquiry Modal state
  const [enquiryProperty, setEnquiryProperty] = useState(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [heroRef, heroInView] = useInView(0.08);
  const [gridRef, gridInView] = useInView(0.08);

  const filteredProperties = useMemo(() => {
    return scoutedProperties.filter((item) => {
      // Destination filter
      if (selectedDestination !== 'all' && item.destinationId !== selectedDestination) {
        return false;
      }
      // Tier filter
      if (selectedTier !== 'all' && item.tier !== selectedTier) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDest = item.destinationName.toLowerCase().includes(query);
        const matchesTagline = item.tagline.toLowerCase().includes(query);
        const matchesAmenity = item.amenities.some((a) => a.toLowerCase().includes(query));
        if (!matchesName && !matchesDest && !matchesTagline && !matchesAmenity) {
          return false;
        }
      }
      return true;
    });
  }, [selectedDestination, selectedTier, searchQuery]);

  const handleResetFilters = () => {
    setSelectedDestination('all');
    setSelectedTier('all');
    setSearchQuery('');
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (contactName && contactPhone) {
      setEnquirySuccess(true);
    }
  };

  const closeModal = () => {
    setEnquiryProperty(null);
    setEnquirySuccess(false);
    setContactName('');
    setContactPhone('');
  };

  const getTierBadgeStyle = (tier) => {
    switch (tier) {
      case '3-star':
        return 'bg-beige text-soil border-bark/25';
      case '4-star':
        return 'bg-sage/40 text-pine border-sage/40';
      case '4-star-premium':
        return 'bg-fern text-cream border-fern';
      case '5-star':
        return 'bg-pine text-cream border-pine';
      default:
        return 'bg-beige text-soil border-bark/25';
    }
  };

  return (
    <div className="bg-cream pb-24">

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-beige to-cream py-14 px-4 sm:px-6 lg:px-8 mb-10 border-b border-bark/20">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            <Building2 className="w-3 h-3 inline mr-1" />
            48 scouted mountain stays
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soil">
            Curated stays directory
          </h1>
          <p className="mt-4 text-sm text-soil/70 max-w-3xl mx-auto leading-relaxed">
            Every stay across our journeys is vetted personally. Explore scouted <strong>3 Star</strong>, <strong>4 Star</strong>, <strong>4 Star Premium</strong>, and <strong>5 Star</strong> properties across 12 iconic Himalayan hubs—from Shimla to high-altitude glamping in Spiti.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mountain Hospitality Notice */}
        <div className="mb-6 p-4 bg-beige rounded-2xl border border-bark/20 shadow-nature-sm flex items-start gap-3 text-sm text-soil/70">
          <Info className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-soil font-medium">Note on high-altitude tiers:</strong> In remote zones (Chandrataal Lake, Tabo, Nako, Chitkul), conventional concrete hotel chains are ecologically prohibited. In these regions, our ratings represent high-grade boutique mud retreats, heated pine chalets, and all-weather geodesic stargazing domes with attached western washrooms and medical oxygen.
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-cream rounded-2xl p-5 border border-bark/20 shadow-nature mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-bark/15">
            <div className="flex items-center gap-2 text-soil font-medium text-sm">
              <Filter className="w-4 h-4 text-sage" />
              <span>Filter properties</span>
              <span className="text-xs text-soil/50 ml-1">
                ({filteredProperties.length} of {scoutedProperties.length} stays shown)
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-pine hover:text-fern transition-colors self-start md:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                Search by name or amenity
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. heated, dome, riverside..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-xs font-bold text-soil/50 hover:text-soil"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                Destination hub (12 locations)
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40 cursor-pointer"
              >
                <option value="all">All 12 Himalayan hubs</option>
                {scoutedDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Selector */}
            <div>
              <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                Accommodation tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40 cursor-pointer"
              >
                <option value="all">All quality tiers</option>
                {propertyTiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Property Cards Grid */}
        {filteredProperties.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProperties.map((prop, index) => (
              <div
                key={prop.id}
                className={`group bg-cream rounded-2xl border border-bark/20 shadow-nature hover:shadow-nature-md transition-all duration-700 ease-out flex flex-col justify-between ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-beige">
                    <img
                      src={prop.coverImage}
                      alt={prop.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getTierBadgeStyle(prop.tier)}`}>
                        {prop.tierLabel}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-cream/90 text-soil border border-bark/20 shadow-nature-sm backdrop-blur-sm">
                        <Star className="w-3 h-3 text-sage fill-sage" />
                        {prop.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-cream font-medium">
                      <span className="flex items-center gap-1 bg-pine/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-cream/20">
                        <MapPin className="w-3 h-3 text-sage" />
                        {prop.destinationName}
                      </span>
                      <span className="bg-pine/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-cream/20 text-sage">
                        {prop.pricePerNight}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-soil group-hover:text-pine transition-colors">
                      {prop.name}
                    </h3>
                    <p className="text-xs font-medium text-pine tracking-wide mt-0.5 mb-2 line-clamp-1">
                      {prop.tagline}
                    </p>
                    <p className="text-sm text-soil/70 leading-relaxed line-clamp-3 mb-3">
                      {prop.overview}
                    </p>

                    {/* Amenities Badges */}
                    <div className="pt-3 border-t border-bark/15 mb-3">
                      <span className="text-xs font-medium text-soil/50 uppercase block mb-1.5">
                        Amenities &amp; features:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prop.amenities.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-beige text-soil/70 border border-bark/20 rounded-full text-xs flex items-center gap-1"
                          >
                            <Check className="w-2.5 h-2.5 text-fern" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Best For Tag */}
                    <div className="p-2.5 bg-sage/10 rounded-xl border border-sage/20 text-xs text-soil/70">
                      <strong className="text-pine">Best for:</strong> {prop.bestFor}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setEnquiryProperty(prop)}
                    className="flex-1 py-2 px-3 text-xs font-medium bg-beige text-soil border border-bark/25 rounded-2xl hover:bg-sage/20 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-nature-sm"
                  >
                    <Phone className="w-3 h-3 text-pine" />
                    <span>Enquire</span>
                  </button>

                  <Link
                    to={`/customize-trip?stay=${encodeURIComponent(prop.name)}&destination=${prop.destinationId}`}
                    className="flex-1 py-2 px-3 text-xs font-medium bg-pine text-cream rounded-2xl hover:bg-fern transition-colors flex items-center justify-center gap-1 shadow-nature-sm"
                  >
                    <span>Include</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-cream rounded-2xl p-8 sm:p-12 text-center border border-bark/20 shadow-nature max-w-lg mx-auto my-10">
            <div className="w-12 h-12 rounded-xl bg-sage/20 mx-auto flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-pine" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-soil">
              No matching properties found
            </h3>
            <p className="text-sm text-soil/70 mt-2 mb-6">
              Try adjusting your destination or tier filter to view more properties.
            </p>
            <Button onClick={handleResetFilters} variant="secondary" size="sm" icon={RotateCcw}>
              Reset all filters
            </Button>
          </div>
        )}

      </div>

      {/* QUICK ENQUIRY MODAL */}
      {enquiryProperty && (
        <div
          className="fixed inset-0 z-50 bg-soil/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-cream rounded-2xl max-w-lg w-full p-6 border border-bark/20 shadow-nature-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {enquirySuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-fern flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-cream" />
                </div>
                <h4 className="font-serif font-bold text-2xl text-soil">Enquiry logged!</h4>
                <p className="text-sm text-soil/70 mt-2 leading-relaxed">
                  Thank you, <strong>{contactName}</strong>. Your enquiry for <em>{enquiryProperty.name}</em> ({enquiryProperty.destinationName}) has been noted in this frontend demonstration prototype.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Button onClick={closeModal} variant="primary" size="sm">
                    Close window
                  </Button>
                  <Button
                    to={`/customize-trip?stay=${encodeURIComponent(enquiryProperty.name)}`}
                    variant="secondary"
                    size="sm"
                  >
                    Build full itinerary
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-bark/15">
                  <div>
                    <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium px-2 py-0.5 mb-1">
                      {enquiryProperty.tierLabel} &bull; {enquiryProperty.destinationName}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-soil mt-0.5">
                      {enquiryProperty.name}
                    </h3>
                    <p className="text-xs text-soil/60 mt-0.5">
                      Estimated demo rates: {enquiryProperty.pricePerNight} / night
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="p-1.5 rounded-lg text-soil/50 hover:bg-beige hover:text-soil transition-colors cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleModalSubmit} className="space-y-3 pt-4">
                  <div>
                    <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                      Your name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita Kapoor"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-soil/60 uppercase tracking-wider mb-1">
                      Phone / WhatsApp number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-beige/60 border border-bark/25 rounded-xl text-soil focus:bg-cream focus:outline-none focus:ring-2 focus:ring-sage/40"
                    />
                  </div>

                  <div className="p-3 bg-sage/10 rounded-xl border border-sage/20 text-sm text-soil/70 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-fern flex-shrink-0 mt-0.5" />
                    <span>
                      Our specialists confirm availability, room heating, and road conditions before reserving any Himalayan property.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-3 py-1.5 text-sm font-medium text-soil/60 hover:text-soil cursor-pointer"
                    >
                      Cancel
                    </button>
                    <Button type="submit" variant="primary" size="sm">
                      Submit stay enquiry
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
