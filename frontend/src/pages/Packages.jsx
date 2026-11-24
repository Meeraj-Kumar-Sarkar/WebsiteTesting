import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Mountain,
  Compass,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  Check,
  Star,
  Layers,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { frontendApi } from '../api/client';
import { getPackagesForStay } from '../data/demoData';
import PackageCard from '../components/packages/PackageCard';
import Button from '../components/common/Button';

const COLLAGE_SPANS = [
  'lg:col-span-5 lg:row-span-2',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-3 lg:row-span-1',
  'lg:col-span-3 lg:row-span-2',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-5 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-5 lg:row-span-1',
];

function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = searchParams.get('view') === 'all-packages' || searchParams.get('destination')
    ? 'packages'
    : 'collage';

  const [viewMode, setViewMode] = useState(initialView);
  const [stays, setStays] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected stay modal state
  const [selectedStay, setSelectedStay] = useState(null);
  const [showLinkedPackages, setShowLinkedPackages] = useState(false);

  // Simple filter for "All Packages" tab
  const [regionFilter, setRegionFilter] = useState(searchParams.get('destination') || 'all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([frontendApi.getStays(), frontendApi.getPackages()])
      .then(([stayData, pkgData]) => {
        if (!mounted) return;
        setStays(Array.isArray(stayData) ? stayData : []);
        setPackages(Array.isArray(pkgData) ? pkgData : []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Close modal on Escape
  useEffect(() => {
    if (!selectedStay) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedStay]);

  const openStay = (stay) => {
    setSelectedStay(stay);
    setShowLinkedPackages(false);
  };

  const closeModal = () => {
    setSelectedStay(null);
    setShowLinkedPackages(false);
  };

  const linkedPackages = useMemo(
    () => (selectedStay ? getPackagesForStay(selectedStay, packages) : []),
    [selectedStay, packages]
  );

  const regions = useMemo(() => {
    const set = new Set();
    packages.forEach((p) => {
      if (p.states) set.add(p.states);
    });
    return Array.from(set);
  }, [packages]);

  const filteredPackages = useMemo(() => {
    if (regionFilter === 'all') return packages;
    const needle = regionFilter.toLowerCase();
    return packages.filter((p) => {
      const text = `${p.states || ''} ${p.destinationName || ''} ${(p.destinations || []).join(' ')}`.toLowerCase();
      return text.includes(needle.replace(/-/g, ' ')) || text.includes(needle);
    });
  }, [packages, regionFilter]);

  const switchMode = (mode) => {
    setViewMode(mode);
    if (mode === 'packages') {
      setSearchParams({ view: 'all-packages' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-soil pb-24">
      {/* Editorial Header — Philosophy of Unknown Wonder */}
      <section className="page-hero pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="section-label mb-4">
                <Eye className="w-3 h-3" />
                Sanctuaries &amp; Expeditions
              </span>
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.04]">
                Places without signs.
                <span className="block text-gradient">Journeys without crowds.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-soil/80 leading-relaxed max-w-xl">
                Every frame below is a real Himalayan sanctuary we have personally scouted.
                Hover to glimpse where it hides — step inside to uncover its story and the expeditions that lead there.
              </p>
            </div>

            {/* Unified Stays Collage / All Packages Liquid-Glass Switcher */}
            <div className="inline-flex items-center p-1.5 rounded-xl bg-[#05140b]/65 backdrop-blur-2xl border border-white/15 shadow-nature self-start lg:self-end">
              <button
                type="button"
                onClick={() => switchMode('collage')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'collage'
                    ? 'bg-sage text-[#06150a] shadow-nature-sm'
                    : 'text-soil/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sanctuary Collage
              </button>
              <button
                type="button"
                onClick={() => switchMode('packages')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'packages'
                    ? 'bg-sage text-[#06150a] shadow-nature-sm'
                    : 'text-soil/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                All Packages ({packages.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 auto-rows-[240px] gap-4">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`rounded-2xl shimmer border border-white/10 ${COLLAGE_SPANS[n] || 'lg:col-span-4'}`}
              />
            ))}
          </div>
        ) : viewMode === 'collage' ? (
          <>
            {/* Whisper prompt */}
            <div className="flex items-center justify-between mb-6 text-xs uppercase tracking-[0.18em] text-soil/70">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                {stays.length} Hidden Himalayan Sanctuaries
              </span>
              <span className="hidden sm:inline text-soil/60">
                Hover for coordinates · Click to uncover
              </span>
            </div>

            {/* Asymmetric Editorial Photo Collage — Pure Visual Intrigue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 auto-rows-[240px] sm:auto-rows-[250px] gap-4">
              {stays.map((stay, idx) => {
                const spanClass = stay.collageSpan || COLLAGE_SPANS[idx % COLLAGE_SPANS.length];
                const locationLabel = stay.location || `${stay.destinationName}${stay.district ? `, ${stay.district}` : ''}`;

                return (
                  <button
                    key={stay.id}
                    type="button"
                    onClick={() => openStay(stay)}
                    aria-label={`Uncover sanctuary in ${locationLabel}`}
                    className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-[#05120a] shadow-nature text-left focus:outline-none focus:ring-2 focus:ring-sage/70 transition-all duration-500 hover:border-sage/55 hover:shadow-nature-xl ${spanClass}`}
                  >
                    {/* Pure atmospheric photograph — no clutter at rest */}
                    <img
                      src={stay.coverImage}
                      alt={locationLabel}
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover brightness-[0.84] contrast-[1.06] saturate-[0.92] transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-100 group-hover:saturate-105"
                    />

                    {/* Subtle moody rest vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030c07]/75 via-[#030c07]/15 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-500" />

                    {/* Faint specular glass rim */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]" />

                    {/* Hover-only Location Whisper */}
                    <div className="absolute inset-x-0 bottom-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 transition-all duration-350 ease-out">
                      <div className="flex items-end justify-between gap-3 px-4 py-3 rounded-xl bg-[#04120a]/72 backdrop-blur-xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-white font-bold text-base sm:text-lg leading-tight truncate">
                            <MapPin className="w-4 h-4 text-sage shrink-0" />
                            <span className="truncate">{locationLabel}</span>
                          </div>
                          {stay.altitude && (
                            <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage/90">
                              <span>{stay.altitude}</span>
                              {stay.district && (
                                <>
                                  <span className="opacity-40">·</span>
                                  <span className="text-soil/75 truncate">{stay.district}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-sage">
                          Uncover <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subtle transition prompt to browse all packages directly */}
            <div className="mt-14 glass-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage">
                  Prefer to browse by route?
                </span>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-white">
                  Explore all {packages.length} curated Himalayan expeditions
                </h2>
                <p className="mt-1.5 text-sm text-soil/80 max-w-xl">
                  Every expedition pairs our scouted sanctuaries with private 4x4 transit, acclimatised pacing, and vetted mountain leads.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button onClick={() => switchMode('packages')} variant="sage" size="md" icon={Compass}>
                  View All Packages
                </Button>
                <Button to="/customize-trip" variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
                  Custom Route
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* ALL PACKAGES VIEW inside the same unified tab */
          <div className="space-y-8">
            <div className="glass-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRegionFilter('all')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    regionFilter === 'all'
                      ? 'bg-sage text-[#06150a]'
                      : 'bg-white/[0.06] text-soil/85 border border-white/15 hover:bg-white/10'
                  }`}
                >
                  All Regions ({packages.length})
                </button>
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setRegionFilter(region)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      regionFilter === region
                        ? 'bg-sage text-[#06150a]'
                        : 'bg-white/[0.06] text-soil/85 border border-white/15 hover:bg-white/10'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => switchMode('collage')}
                className="text-xs font-bold uppercase tracking-wider text-sage hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Back to Sanctuary Collage
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── SANCTUARY REVEAL MODAL (Tempered Liquid Glass) ─── */}
      {selectedStay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#020a05]/80 backdrop-blur-md animate-fade-in"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sanctuary-modal-title"
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#071a0f]/90 backdrop-blur-2xl border border-white/20 shadow-[0_36px_90px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.24)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close sanctuary details"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#041008]/75 backdrop-blur-xl border border-white/25 text-white hover:bg-sage hover:text-[#06150a] hover:border-sage transition-all flex items-center justify-center shadow-nature"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Image Header */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedStay.coverImage}
                alt={selectedStay.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071a0f] via-[#071a0f]/35 to-transparent" />

              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#041008]/75 backdrop-blur-md text-sage border border-sage/40">
                  {selectedStay.tierLabel || 'Scouted Sanctuary'}
                </span>
                {selectedStay.altitude && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#041008]/75 backdrop-blur-md text-white border border-white/20">
                    <Mountain className="w-3 h-3 text-sage" />
                    {selectedStay.altitude}
                  </span>
                )}
              </div>

              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-sage mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedStay.location || selectedStay.destinationName}</span>
                  {selectedStay.district && <span className="text-white/60">· {selectedStay.district}</span>}
                </div>
                <h2 id="sanctuary-modal-title" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {selectedStay.name}
                </h2>
              </div>
            </div>

            {/* Sanctuary Story & Details */}
            <div className="p-6 sm:p-8 space-y-6">
              {selectedStay.tagline && (
                <p className="text-lg sm:text-xl text-sage/95 font-medium italic leading-snug">
                  “{selectedStay.tagline}”
                </p>
              )}

              <p className="text-base text-soil/90 leading-relaxed">
                {selectedStay.overview}
              </p>

              {/* Quick Meta Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.05] border border-white/12">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage">Indicative Stay</div>
                  <div className="mt-1 text-lg font-bold text-white">{selectedStay.pricePerNight || 'Included in Expedition'}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.05] border border-white/12">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage">Guest Rating</div>
                  <div className="mt-1 flex items-center gap-1.5 text-lg font-bold text-white">
                    <Star className="w-4 h-4 text-sage fill-sage" />
                    {selectedStay.rating || '4.9'} / 5
                    {selectedStay.reviewsCount ? (
                      <span className="text-xs font-normal text-soil/70">({selectedStay.reviewsCount} stays)</span>
                    ) : null}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.05] border border-white/12">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage">Best Suited For</div>
                  <div className="mt-1 text-sm font-medium text-white leading-snug">
                    {selectedStay.bestFor || 'Private slow-travel mountain expeditions'}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {Array.isArray(selectedStay.amenities) && selectedStay.amenities.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-soil/70 mb-3">
                    Sanctuary Craft &amp; Provisions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStay.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] border border-white/15 text-soil/90"
                      >
                        <Check className="w-3.5 h-3.5 text-sage" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Psychological Bridge: Interested? Reveal Packages Covering This Stay */}
              <div className="pt-6 border-t border-white/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-sage">
                      Drawn to this sanctuary?
                    </div>
                    <p className="text-sm text-soil/80 mt-0.5">
                      Discover the private expeditions that include nights at {selectedStay.name}.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLinkedPackages((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-sage text-[#06150a] text-xs font-bold uppercase tracking-wider hover:bg-[#a6e645] transition-all shadow-nature-sm"
                    >
                      <Layers className="w-4 h-4" />
                      {showLinkedPackages
                        ? 'Hide Matching Packages'
                        : `See Packages Covering This Stay (${linkedPackages.length})`}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          showLinkedPackages ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <Link
                      to={`/customize-trip?stay=${encodeURIComponent(selectedStay.name)}`}
                      onClick={closeModal}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/[0.08] border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-pine/60 hover:border-sage/50 transition-all"
                    >
                      Custom Trip Here
                    </Link>
                  </div>
                </div>

                {/* Revealed Linked Packages */}
                {showLinkedPackages && (
                  <div className="mt-6 space-y-4 animate-fade-up">
                    {linkedPackages.map((pkg) => {
                      const pkgSlug = pkg.slug || pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          className="rounded-xl overflow-hidden bg-white/[0.06] border border-white/18 hover:border-sage/50 transition-all grid grid-cols-1 sm:grid-cols-12"
                        >
                          <div className="sm:col-span-4 relative h-44 sm:h-auto">
                            <img
                              src={pkg.coverImage}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#041008]/75 via-transparent to-transparent" />
                            <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#041008]/80 text-white border border-white/20">
                              <Clock className="w-3 h-3 text-sage" />
                              {pkg.duration}
                            </span>
                          </div>

                          <div className="sm:col-span-8 p-5 flex flex-col justify-between gap-4">
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sage">
                                  {pkg.tripType || 'Curated Expedition'} · {pkg.states}
                                </span>
                                <span className="text-sm font-bold text-white">
                                  From {formatInr(pkg.startingPrice ?? pkg.basePrice)}
                                  <span className="text-xs font-normal text-soil/70"> / person</span>
                                </span>
                              </div>
                              <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
                              <p className="mt-1.5 text-sm text-soil/80 leading-relaxed">
                                {pkg.shortDescription || pkg.shortOverview}
                              </p>

                              {Array.isArray(pkg.destinations) && pkg.destinations.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {pkg.destinations.slice(0, 6).map((stop) => (
                                    <span
                                      key={stop}
                                      className="text-[11px] px-2 py-0.5 rounded bg-white/[0.07] border border-white/10 text-soil/85"
                                    >
                                      {stop}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                              <span className="text-xs text-sage font-semibold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Includes {selectedStay.name}
                              </span>
                              <Link
                                to={`/packages/${pkgSlug}`}
                                onClick={closeModal}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pine text-white text-xs font-bold uppercase tracking-wider hover:bg-fern transition-colors shadow-nature-sm"
                              >
                                Full Expedition Details
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
