import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  Info,
  Eye,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { scoutedDestinations, propertyTiers } from '../data/scoutedProperties';
import Button from '../components/common/Button';
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
  }, [threshold]);
  return [ref, inView];
}

const popularAmenityTags = [
  { id: 'all', label: 'All Highlights' },
  { id: 'oxygen', label: 'Oxygen Support', match: ['oxygen'] },
  { id: 'heating', label: 'Underfloor / Radiator Heat', match: ['heating', 'radiator', 'bukhari'] },
  { id: 'pool', label: 'Heated Pool / Spa', match: ['pool', 'spa', 'whirlpool'] },
  { id: 'stargazing', label: 'Stargazing / Domes', match: ['stargazing', 'skylight', 'terrace'] },
  { id: 'monastery', label: 'Monastery / Valley View', match: ['monastery', 'valley view', 'views'] },
  { id: 'heritage', label: 'Heritage / Artisanal', match: ['heritage', 'colonial', 'artisanal', 'mud'] }
];

export default function Stays() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDestination, setSelectedDestination] = useState(
    searchParams.get('destination') || 'all'
  );
  const [selectedTier, setSelectedTier] = useState(
    searchParams.get('tier') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [selectedAmenityTag, setSelectedAmenityTag] = useState('all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');

  // Modals state
  const [detailProperty, setDetailProperty] = useState(null);
  const [enquiryProperty, setEnquiryProperty] = useState(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    dates: '',
    guests: '2 Guests',
    notes: ''
  });

  useEffect(() => {
    setLoading(true);
    frontendApi.getStays()
      .then((res) => setStays(Array.isArray(res) ? res : []))
      .catch(() => setStays([]))
      .finally(() => setLoading(false));
  }, []);

  const [heroRef, heroInView] = useInView(0.08);
  const [gridRef, gridInView] = useInView(0.05);

  const destinationMap = useMemo(() => {
    return Object.fromEntries(scoutedDestinations.map((d) => [d.id, d]));
  }, []);

  const updateUrlParams = (newParams) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([key, val]) => {
        if (!val || val === 'all') {
          updated.delete(key);
        } else {
          updated.set(key, val);
        }
      });
      return updated;
    });
  };

  const handleDestinationChange = (val) => {
    setSelectedDestination(val);
    updateUrlParams({ destination: val });
  };

  const handleTierChange = (val) => {
    setSelectedTier(val);
    updateUrlParams({ tier: val });
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    updateUrlParams({ search: val });
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    updateUrlParams({ sort: val });
  };

  const handleResetFilters = () => {
    setSelectedDestination('all');
    setSelectedTier('all');
    setSearchQuery('');
    setSelectedAmenityTag('all');
    setSortBy('recommended');
    setSearchParams({});
  };

  const parseMinPrice = (priceStr) => {
    if (!priceStr) return 0;
    const match = priceStr.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const filteredProperties = useMemo(() => {
    const list = stays.filter((item) => {
      if (selectedDestination !== 'all' && item.destinationId !== selectedDestination) {
        return false;
      }
      if (selectedTier !== 'all' && item.tier !== selectedTier) {
        return false;
      }
      if (selectedAmenityTag !== 'all') {
        const tagObj = popularAmenityTags.find((t) => t.id === selectedAmenityTag);
        if (tagObj && tagObj.match) {
          const hasMatch = tagObj.match.some((keyword) =>
            (item.amenities || []).some((a) => a.toLowerCase().includes(keyword)) ||
            (item.tagline || '').toLowerCase().includes(keyword) ||
            (item.overview || '').toLowerCase().includes(keyword)
          );
          if (!hasMatch) return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = (item.name || '').toLowerCase().includes(query);
        const matchesDest = (item.destinationName || '').toLowerCase().includes(query);
        const matchesTagline = (item.tagline || '').toLowerCase().includes(query);
        const matchesAmenity = (item.amenities || []).some((a) => a.toLowerCase().includes(query));
        const matchesBestFor = (item.bestFor || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDest && !matchesTagline && !matchesAmenity && !matchesBestFor) {
          return false;
        }
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'reviews-desc') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'price-asc') return parseMinPrice(a.pricePerNight) - parseMinPrice(b.pricePerNight);
      if (sortBy === 'price-desc') return parseMinPrice(b.pricePerNight) - parseMinPrice(a.pricePerNight);
      return 0;
    });
  }, [stays, selectedDestination, selectedTier, selectedAmenityTag, searchQuery, sortBy]);

  const handleOpenDetail = (prop) => setDetailProperty(prop);
  const handleCloseDetail = () => setDetailProperty(null);

  const handleOpenEnquiry = (prop) => {
    setEnquiryProperty(prop);
    setEnquirySuccess(false);
    setSubmitError('');
  };

  const handleCloseEnquiry = () => {
    setEnquiryProperty(null);
    setEnquirySuccess(false);
    setSubmitError('');
    setEnquiryForm({
      name: '',
      phone: '',
      email: '',
      dates: '',
      guests: '2 Guests',
      notes: ''
    });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone || !enquiryProperty) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await frontendApi.submitEnquiry({
        source: 'WEBSITE',
        customerName: enquiryForm.name,
        phone: enquiryForm.phone,
        whatsappNumber: enquiryForm.phone,
        email: enquiryForm.email,
        selectedPackage: `Stay Enquiry: ${enquiryProperty.name} (${enquiryProperty.destinationName})`,
        travelDates: enquiryForm.dates || 'Flexible',
        travellers: enquiryForm.guests,
        message: `Stay Property Enquiry: ${enquiryProperty.name} (${enquiryProperty.tierLabel}, ${enquiryProperty.pricePerNight}). ${enquiryForm.notes || ''}`.trim()
      });
      setEnquirySuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit stay enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTierBadgeStyle = (tier) => {
    switch (tier) {
      case '3-star':
        return 'bg-beige/70 text-soil border-bark/20';
      case '4-star':
        return 'bg-sage/25 text-pine border-sage/40';
      case '4-star-premium':
        return 'bg-fern/20 text-fern border-fern/30 font-semibold';
      case '5-star':
        return 'bg-pine text-cream border-pine shadow-sm font-semibold';
      default:
        return 'bg-beige/70 text-soil border-bark/20';
    }
  };

  return (
    <div className="bg-cream pb-24 min-h-screen">

      {/* Header Banner */}
      <div className="relative bg-gradient-to-b from-beige/60 via-beige/30 to-cream py-14 sm:py-18 px-4 sm:px-6 lg:px-8 mb-8 border-b border-bark/15">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-700 ease-out ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1.5 mb-4 shadow-sm">
            <Building2 className="w-3.5 h-3.5" />
            Scouted Mountain Stays &bull; Himalayan Hubs
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-soil tracking-tight">
            Curated Stays Directory
          </h1>

          <p className="mt-4 text-sm sm:text-base text-soil/75 max-w-3xl mx-auto leading-relaxed font-sans">
            Every stay across our journeys is vetted personally. Explore certified <strong>3 Star Heritage</strong>, <strong>4 Star Boutique</strong>, <strong>4 Star Premium</strong>, and <strong>5 Star Ultra-Luxury</strong> properties across iconic mountain hubs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* High-Altitude Hospitality Notice */}
        <div className="mb-8 p-4.5 bg-beige/40 rounded-2xl border border-bark/15 shadow-nature-sm flex items-start gap-3.5 text-xs sm:text-sm text-soil/80 leading-relaxed">
          <div className="w-8 h-8 rounded-xl bg-sage/20 text-pine flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-pine" />
          </div>
          <div>
            <strong className="text-soil font-semibold">Note on High-Altitude Tiers:</strong> In ecologically sensitive remote zones (Chandrataal Lake, Tabo, Nako, Chitkul), conventional concrete hotel chains are prohibited. In these locations, our ratings represent high-grade boutique mud retreats, heated cedar chalets, and all-weather geodesic stargazing domes with attached western washrooms and certified medical oxygen on standby.
          </div>
        </div>

        {/* Quality Tier Filter Tabs */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleTierChange('all')}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              selectedTier === 'all'
                ? 'bg-pine text-cream border-pine shadow-nature-sm'
                : 'bg-cream border-bark/15 text-soil hover:bg-beige/40'
            }`}
          >
            <div className="text-xs uppercase font-bold tracking-wider opacity-80">All Tiers</div>
            <div className="font-serif font-bold text-base sm:text-lg mt-0.5">{stays.length} Properties</div>
            <div className="text-[11px] opacity-75 mt-0.5">Complete Collection</div>
          </button>

          {propertyTiers.map((t) => {
            const isSelected = selectedTier === t.id;
            const count = stays.filter((p) => p.tier === t.id).length;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTierChange(t.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-pine text-cream border-pine shadow-nature-sm'
                    : 'bg-cream border-bark/15 text-soil hover:bg-beige/40'
                }`}
              >
                <div className="text-xs uppercase font-bold tracking-wider opacity-80">{t.label}</div>
                <div className="font-serif font-bold text-base sm:text-lg mt-0.5">{count} Stays</div>
                <div className="text-[11px] opacity-75 mt-0.5 line-clamp-1">{t.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Search, Filter & Sort Control Bar */}
        <div className="bg-cream/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-bark/15 shadow-nature-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-bark/15">
            <div className="flex items-center gap-2.5 text-soil font-semibold text-sm">
              <div className="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center">
                <Filter className="w-3.5 h-3.5 text-pine" />
              </div>
              <span className="font-serif text-base">Filter Curated Properties</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sage/20 text-pine font-medium">
                {filteredProperties.length} of {stays.length} available
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-soil/70 hover:text-pine transition-colors self-start md:self-auto cursor-pointer px-3 py-1.5 rounded-full bg-beige/50 hover:bg-beige"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-soil/80 mb-1.5">
                Search Name / Amenity
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-soil/50" />
                <input
                  type="text"
                  placeholder="e.g. heated, dome, riverside..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-xs font-medium bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2.5 top-2.5 text-xs text-soil/50 hover:text-soil"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-soil/80 mb-1.5">
                Destination Hub
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all cursor-pointer"
              >
                <option value="all">All Himalayan Hubs</option>
                {scoutedDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.district} &bull; {d.altitude})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-soil/80 mb-1.5">
                Quality Tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => handleTierChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all cursor-pointer"
              >
                <option value="all">All Quality Tiers</option>
                {propertyTiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} &mdash; {t.badge}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-soil/80 mb-1.5">
                Sort Properties
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium bg-beige/40 hover:bg-beige/60 border border-bark/15 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none focus:ring-2 focus:ring-pine/20 focus:border-pine transition-all cursor-pointer"
              >
                <option value="recommended">Curated / Recommended</option>
                <option value="rating-desc">Highest Rating</option>
                <option value="reviews-desc">Most Reviews</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-bark/10 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-soil/60 font-medium shrink-0 flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-fern" /> Highlights:
            </span>
            {popularAmenityTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedAmenityTag(tag.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedAmenityTag === tag.id
                    ? 'bg-sage/40 text-pine border border-sage font-semibold'
                    : 'bg-beige/40 hover:bg-beige/70 text-soil/75 border border-bark/10'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="py-16 text-center text-sm text-soil/60">
            Loading scouted stays...
          </div>
        ) : filteredProperties.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          >
            {filteredProperties.map((prop, index) => {
              const destMeta = destinationMap[prop.destinationId];
              return (
                <div
                  key={prop.id}
                  className={`group bg-cream/90 backdrop-blur-md rounded-xl border border-bark/25 shadow-nature-sm hover:shadow-nature-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${Math.min(index * 40, 400)}ms` }}
                >
                  <div>
                    <div
                      className="relative aspect-[16/10] overflow-hidden bg-beige cursor-pointer"
                      onClick={() => handleOpenDetail(prop)}
                    >
                      {prop.coverImage && (
                        <img
                          src={prop.coverImage}
                          alt={prop.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-soil/50 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className={`px-2.5 py-1 text-[11px] rounded-full border backdrop-blur-sm ${getTierBadgeStyle(prop.tier)}`}>
                          {prop.tierLabel}
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-cream/95 text-soil border border-bark/15 shadow-sm backdrop-blur-sm">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{prop.rating}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-cream font-medium">
                        <span className="flex items-center gap-1.5 bg-soil/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-cream/20">
                          <MapPin className="w-3 h-3 text-sage" />
                          <span>{prop.destinationName}</span>
                          {(prop.altitude || destMeta?.altitude) && (
                            <span className="text-[10px] text-sage opacity-90">&bull; {prop.altitude || destMeta.altitude}</span>
                          )}
                        </span>
                        <span className="bg-soil/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-cream/20 text-cream font-semibold">
                          {prop.pricePerNight}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3
                        onClick={() => handleOpenDetail(prop)}
                        className="font-serif text-lg sm:text-xl font-bold text-soil group-hover:text-pine transition-colors cursor-pointer"
                      >
                        {prop.name}
                      </h3>
                      {prop.tagline && (
                        <p className="text-xs font-medium text-fern mt-1 mb-2 line-clamp-1 italic">
                          {prop.tagline}
                        </p>
                      )}
                      <p className="text-xs text-soil/75 leading-relaxed line-clamp-2 mb-3 font-sans">
                        {prop.overview}
                      </p>

                      {prop.amenities && prop.amenities.length > 0 && (
                        <div className="pt-3 border-t border-bark/10 mb-3">
                          <div className="flex flex-wrap gap-1.5">
                            {prop.amenities.slice(0, 3).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-beige/50 text-soil/80 border border-bark/15 rounded-full text-[11px] flex items-center gap-1 font-medium"
                              >
                                <Check className="w-2.5 h-2.5 text-fern" />
                                <span className="truncate max-w-[150px]">{amenity}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {prop.bestFor && (
                        <div className="p-2.5 bg-beige/30 rounded-xl border border-bark/10 text-[11px] text-soil/75 leading-snug">
                          <strong className="text-pine font-semibold">Best for:</strong> {prop.bestFor}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2 border-t border-bark/10 mt-3 pt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(prop)}
                      className="p-2 rounded-xl bg-beige/50 text-soil hover:bg-beige transition-colors text-xs font-medium flex items-center justify-center cursor-pointer"
                      title="View Stay Details"
                    >
                      <Eye className="w-4 h-4 text-soil/70" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(prop)}
                      className="flex-1 py-2 px-3 text-xs font-semibold bg-cream text-soil border border-bark/20 rounded-xl hover:bg-beige/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 text-pine" />
                      <span>Enquire</span>
                    </button>

                    <Link
                      to={`/customize-trip?stay=${encodeURIComponent(prop.name)}&destination=${prop.destinationId}`}
                      className="flex-1 py-2 px-3 text-xs font-semibold bg-pine text-cream rounded-xl hover:bg-fern transition-colors flex items-center justify-center gap-1 shadow-nature-sm"
                    >
                      <span>Include</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-cream rounded-3xl p-8 sm:p-14 text-center border border-bark/15 shadow-nature-sm max-w-lg mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-sage/20 mx-auto flex items-center justify-center mb-4 text-pine">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-soil">
              No matching properties found
            </h3>
            <p className="text-xs sm:text-sm text-soil/70 mt-2 mb-6 leading-relaxed">
              {stays.length === 0
                ? 'Scouted stay properties added in the catalogue will appear here.'
                : "We couldn't find any properties matching your current filters."}
            </p>
            <div className="flex items-center justify-center gap-3">
              {stays.length > 0 && (
                <Button onClick={handleResetFilters} variant="secondary" size="sm" icon={RotateCcw}>
                  Reset all filters
                </Button>
              )}
              <Button to="/customize-trip" variant="primary" size="sm">
                Request Custom Stay
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* STAY DETAILS MODAL */}
      {detailProperty && (
        <div
          className="fixed inset-0 z-50 bg-soil/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={handleCloseDetail}
        >
          <div
            className="bg-cream rounded-3xl max-w-2xl w-full border border-bark/20 shadow-float overflow-hidden relative my-auto animate-scaleIn max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-beige">
              {detailProperty.coverImage && (
                <img
                  src={detailProperty.coverImage}
                  alt={detailProperty.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-soil/80 via-soil/20 to-transparent" />

              <button
                type="button"
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream/90 hover:bg-cream text-soil flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getTierBadgeStyle(detailProperty.tier)}`}>
                  {detailProperty.tierLabel}
                </span>
              </div>

              <div className="absolute bottom-4 left-5 right-5 text-cream">
                <div className="flex items-center gap-2 text-xs font-medium text-sage mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{detailProperty.destinationName}</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
                  {detailProperty.name}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-7 overflow-y-auto space-y-5 text-soil font-sans">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-bark/15">
                <div>
                  <div className="text-xs text-soil/60 uppercase font-semibold">Tariff Estimate</div>
                  <div className="font-serif text-2xl font-bold text-pine">
                    {detailProperty.pricePerNight}
                    <span className="text-xs text-soil/60 font-sans font-normal"> / room per night</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-beige/50 px-3 py-1.5 rounded-full border border-bark/15 text-xs font-semibold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{detailProperty.rating}</span>
                </div>
              </div>

              <div>
                {detailProperty.tagline && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-fern mb-1">
                    {detailProperty.tagline}
                  </p>
                )}
                <p className="text-sm text-soil/80 leading-relaxed font-sans">
                  {detailProperty.overview}
                </p>
              </div>

              {detailProperty.amenities && detailProperty.amenities.length > 0 && (
                <div>
                  <h4 className="font-serif font-bold text-base text-soil mb-3">
                    Verified Property Amenities &amp; Features:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {detailProperty.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-beige/30 rounded-xl border border-bark/10 flex items-center gap-2 text-xs text-soil/85"
                      >
                        <CheckCircle2 className="w-4 h-4 text-fern shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-bark/15 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleCloseDetail();
                    handleOpenEnquiry(detailProperty);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-cream border border-bark/20 text-soil hover:bg-beige/60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-pine" />
                  <span>Enquire For Stay</span>
                </button>

                <Link
                  to={`/customize-trip?stay=${encodeURIComponent(detailProperty.name)}&destination=${detailProperty.destinationId}`}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-pine text-cream hover:bg-fern transition-colors flex items-center justify-center gap-2 shadow-nature-sm text-center"
                >
                  <span>Build Custom Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ENQUIRY MODAL */}
      {enquiryProperty && (
        <div
          className="fixed inset-0 z-50 bg-soil/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={handleCloseEnquiry}
        >
          <div
            className="bg-cream rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-bark/20 shadow-float relative my-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {enquirySuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-fern flex items-center justify-center mx-auto mb-4 shadow-nature-sm text-cream">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-serif font-bold text-2xl text-soil">Enquiry Logged!</h4>
                <p className="text-xs sm:text-sm text-soil/75 mt-2.5 leading-relaxed font-sans max-w-md mx-auto">
                  Thank you, <strong>{enquiryForm.name}</strong>. Your enquiry for <em>{enquiryProperty.name}</em> ({enquiryProperty.destinationName}) has been received by our Sales team.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  <Button onClick={handleCloseEnquiry} variant="secondary" size="sm">
                    Close Window
                  </Button>
                  <Button
                    to={`/customize-trip?stay=${encodeURIComponent(enquiryProperty.name)}&destination=${enquiryProperty.destinationId}`}
                    variant="primary"
                    size="sm"
                  >
                    Customize Full Trip
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-bark/15 mb-5">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-pine block">
                      Direct Stay Reservation Enquiry
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-soil mt-0.5">
                      {enquiryProperty.name}
                    </h3>
                    <p className="text-xs text-soil/60 mt-0.5">
                      {enquiryProperty.destinationName} &bull; {enquiryProperty.tierLabel} &bull; {enquiryProperty.pricePerNight}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseEnquiry}
                    className="w-8 h-8 rounded-full bg-beige/70 hover:bg-beige text-soil flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {submitError && (
                  <p className="text-xs text-red-500 mb-3">{submitError}</p>
                )}

                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-soil/80 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Rohan Kapoor"
                      className="w-full px-3.5 py-2.5 text-xs bg-beige/50 border border-bark/20 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-soil/80 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs bg-beige/50 border border-bark/20 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-soil/80 mb-1">Email</label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-beige/50 border border-bark/20 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-soil/80 mb-1">Preferred Dates</label>
                      <input
                        type="date"
                        value={enquiryForm.dates}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, dates: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-beige/50 border border-bark/20 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-soil/80 mb-1">Guests</label>
                      <select
                        value={enquiryForm.guests}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, guests: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-beige/50 border border-bark/20 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none"
                      >
                        <option value="1 Guest">1 Guest</option>
                        <option value="2 Guests">2 Guests</option>
                        <option value="3-4 Guests">3-4 Guests</option>
                        <option value="5+ Guests">5+ Guests</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-soil/80 mb-1">Special Requests</label>
                    <textarea
                      rows={2}
                      value={enquiryForm.notes}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                      placeholder="Room view preference, meal plan, or transport needs..."
                      className="w-full px-3.5 py-2.5 text-xs bg-beige/50 border border-bark/20 rounded-xl text-soil focus:bg-[#102c18] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button type="button" onClick={handleCloseEnquiry} variant="secondary" size="sm">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting} variant="primary" size="sm">
                      {submitting ? 'Submitting...' : 'Submit Stay Enquiry'}
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
