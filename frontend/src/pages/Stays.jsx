import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Star,
  MapPin,
  Check,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Phone,
  Compass,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { scoutedDestinations, propertyTiers, scoutedProperties } from '../data/scoutedProperties';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function Stays() {
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Enquiry Modal state
  const [enquiryProperty, setEnquiryProperty] = useState(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

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
        return 'bg-[#dad7cd] text-[#344e41] border-[#344e41]';
      case '4-star':
        return 'bg-[#a3b18a] text-[#344e41] border-[#344e41]';
      case '4-star-premium':
        return 'bg-[#588157] text-white border-[#344e41]';
      case '5-star':
        return 'bg-[#3a5a40] text-white border-[#344e41]';
      default:
        return 'bg-[#dad7cd] text-[#344e41] border-[#344e41]';
    }
  };

  return (
    <div className="bg-[#dad7cd] pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs font-bold uppercase text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <Building2 className="w-3.5 h-3.5" />
            <span>// 48 SCOUTED MOUNTAIN STAYS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            CURATED STAYS DIRECTORY
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#dad7cd] max-w-3xl mx-auto font-medium leading-relaxed">
            Every stay across our journeys is vetted personally. Explore scouted <strong>3 Star</strong>, <strong>4 Star</strong>, <strong>4 Star Premium</strong>, and <strong>5 Star</strong> properties across 12 iconic Himalayan hubs—from Shimla to high-altitude glamping in Spiti.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mountain Hospitality Notice */}
        <div className="mb-6 p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_#344e41] flex items-start gap-3 font-mono text-xs text-[#344e41]">
          <Info className="w-4 h-4 text-[#588157] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#344e41] uppercase">Note on High-Altitude Tiers:</strong> In remote zones (Chandrataal Lake, Tabo, Nako, Chitkul), conventional concrete hotel chains are ecologically prohibited. In these regions, our ratings represent high-grade boutique mud retreats, heated pine chalets, and all-weather geodesic stargazing domes with attached western washrooms and medical oxygen.
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-none p-4 sm:p-5 border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b-2 border-[#344e41]">
            <div className="flex items-center gap-2 text-[#344e41] font-mono font-bold text-sm">
              <Filter className="w-4 h-4 text-[#588157]" />
              <span className="uppercase">// FILTER PROPERTIES</span>
              <span className="text-xs font-mono font-normal text-[#344e41]/70 ml-2">
                ({filteredProperties.length} of {scoutedProperties.length} stays shown)
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-[#344e41] hover:text-[#588157] underline transition-none self-start md:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            {/* Search Input */}
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#344e41] mb-1">
                Search By Name or Amenity
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. heated, dome, riverside..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-2 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a5a40]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2.5 text-xs font-bold text-[#344e41]"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Destination Selector */}
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#344e41] mb-1">
                Destination Hub (12 Locations)
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-2.5 py-2 font-mono text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a5a40] cursor-pointer"
              >
                <option value="all">All 12 Himalayan Hubs</option>
                {scoutedDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Selector */}
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#344e41] mb-1">
                Accommodation Tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full px-2.5 py-2 font-mono text-xs font-bold bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3a5a40] cursor-pointer"
              >
                <option value="all">All Quality Tiers</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="group bg-white rounded-none border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#344e41] transition-none flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#dad7cd] border-b-2 border-[#344e41]">
                    <img
                      src={prop.coverImage}
                      alt={prop.name}
                      className="w-full h-full object-cover transition-none"
                      loading="lazy"
                    />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border-2 shadow-[1px_1px_0px_#344e41] ${getTierBadgeStyle(prop.tier)}`}>
                        {prop.tierLabel}
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-bold bg-white text-[#344e41] border-2 border-[#344e41] shadow-[1px_1px_0px_#344e41]">
                        <Star className="w-3 h-3 text-[#588157] fill-[#588157]" />
                        {prop.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[11px] text-white font-bold">
                      <span className="flex items-center gap-1 bg-[#344e41] border border-white px-1.5 py-0.5">
                        <MapPin className="w-3 h-3 text-[#a3b18a]" />
                        {prop.destinationName}
                      </span>
                      <span className="bg-[#344e41] border border-white px-1.5 py-0.5 text-[#a3b18a]">
                        {prop.pricePerNight}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-serif text-lg sm:text-xl font-black uppercase text-[#344e41] group-hover:text-[#3a5a40]">
                      {prop.name}
                    </h3>
                    <p className="font-mono text-xs font-bold text-[#588157] uppercase tracking-wide mt-0.5 mb-2 line-clamp-1">
                      // {prop.tagline}
                    </p>
                    <p className="text-xs text-[#344e41]/80 leading-relaxed line-clamp-3 mb-3 font-medium">
                      {prop.overview}
                    </p>

                    {/* Amenities Badges */}
                    <div className="pt-2.5 border-t-2 border-[#dad7cd] mb-3">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#344e41] block mb-1.5">
                        Amenities &amp; Features:
                      </span>
                      <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                        {prop.amenities.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-[#dad7cd]/50 text-[#344e41] border border-[#344e41] flex items-center gap-1 font-bold"
                          >
                            <Check className="w-2.5 h-2.5 text-[#588157]" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Best For Tag */}
                    <div className="p-2 bg-[#dad7cd]/40 border border-[#344e41] font-mono text-[10px] text-[#344e41]">
                      <strong>BEST FOR:</strong> {prop.bestFor}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t-2 border-[#344e41] flex items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setEnquiryProperty(prop)}
                    className="flex-1 py-1.5 px-2 font-mono text-xs font-bold uppercase bg-[#dad7cd] hover:bg-[#a3b18a] text-[#344e41] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-none flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3 h-3 text-[#344e41]" />
                    <span>Enquire</span>
                  </button>

                  <Link
                    to={`/customize-trip?stay=${encodeURIComponent(prop.name)}&destination=${prop.destinationId}`}
                    className="flex-1 py-1.5 px-2 font-mono text-xs font-bold uppercase bg-[#3a5a40] hover:bg-[#344e41] text-white border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-none flex items-center justify-center gap-1"
                  >
                    <span>Include</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-none p-8 sm:p-12 text-center border-2 border-[#344e41] max-w-lg mx-auto shadow-[4px_4px_0px_0px_#344e41] my-10">
            <Building2 className="w-10 h-10 text-[#344e41] mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-black uppercase text-[#344e41]">
              No Matching Properties Found
            </h3>
            <p className="font-mono text-xs text-[#344e41]/80 mt-2 mb-5">
              Try adjusting your destination or tier filter to view more properties.
            </p>
            <Button onClick={handleResetFilters} variant="secondary" size="sm" icon={RotateCcw}>
              Reset All Filters
            </Button>
          </div>
        )}

      </div>

      {/* QUICK ENQUIRY MODAL (Brutalist Boxed Modal) */}
      {enquiryProperty && (
        <div
          className="fixed inset-0 z-50 bg-[#344e41]/80 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-none max-w-lg w-full p-6 border-2 border-[#344e41] shadow-[6px_6px_0px_0px_#344e41] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {enquirySuccess ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 border-2 border-[#344e41] bg-[#588157] text-white mx-auto flex items-center justify-center mb-3 shadow-[2px_2px_0px_#344e41]">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-black text-2xl uppercase text-[#344e41]">Enquiry Logged!</h4>
                <p className="font-mono text-xs text-[#344e41]/80 mt-2 leading-relaxed">
                  Thank you, <strong>{contactName}</strong>. Your enquiry for <em>{enquiryProperty.name}</em> ({enquiryProperty.destinationName}) has been noted in this frontend demonstration prototype.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Button onClick={closeModal} variant="primary" size="sm">
                    Close Window
                  </Button>
                  <Button
                    to={`/customize-trip?stay=${encodeURIComponent(enquiryProperty.name)}`}
                    variant="secondary"
                    size="sm"
                  >
                    Build Full Itinerary
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-3 border-b-2 border-[#344e41]">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#588157] block">
                      // {enquiryProperty.tierLabel} &bull; {enquiryProperty.destinationName}
                    </span>
                    <h3 className="font-serif text-xl font-black uppercase text-[#344e41] mt-0.5">
                      {enquiryProperty.name}
                    </h3>
                    <p className="font-mono text-xs text-[#344e41]/70 mt-0.5">
                      Estimated Demo Rates: {enquiryProperty.pricePerNight} / night
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="p-1 font-bold text-lg text-[#344e41] hover:bg-[#dad7cd] cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleModalSubmit} className="space-y-3 pt-3">
                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase text-[#344e41] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita Kapoor"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-2.5 py-1.5 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-bold uppercase text-[#344e41] mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 font-mono text-xs bg-[#dad7cd]/40 border-2 border-[#344e41] rounded-none text-[#344e41] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 bg-[#dad7cd]/50 border border-[#344e41] font-mono text-[11px] text-[#344e41] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#588157] flex-shrink-0 mt-0.5" />
                    <span>
                      Our specialists confirm availability, room heating, and road conditions before reserving any Himalayan property.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#344e41] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                    <Button type="submit" variant="primary" size="sm">
                      Submit Stay Enquiry
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
