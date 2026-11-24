import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast, useConfirm } from '../../context/FeedbackContext';
import {
  Package,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  MapPin,
  Search,
  Trash2,
  Upload,
  Building2,
  Compass,
  Star
} from 'lucide-react';

const EMPTY_PACKAGE_FORM = {
  name: '',
  shortDescription: '',
  overview: '',
  duration: '',
  states: 'Himachal Pradesh',
  tripType: 'Adventure',
  label: '',
  featured: true,
  destinations: '',
  highlights: '',
  basePrice: '',
  maxCapacity: 12,
  coverImage: '',
  status: 'PUBLISHED',
  accommodationCategories: ['3_STAR', '4_STAR'],
  inclusions: '',
  exclusions: '',
  itineraries: [
    { day: 1, title: 'Arrival & Acclimatization', description: 'Scenic transfer and acclimatization rest.', meals: 'Dinner Included', stay: 'Mountain Lodge' }
  ]
};

const EMPTY_DEST_FORM = {
  name: '',
  state: '',
  tagline: '',
  description: '',
  bestTimeToVisit: 'May to October',
  altitude: '1,500m – 4,500m',
  temperatureRange: '5°C to 24°C',
  idealDuration: '6 to 9 Days',
  coverImage: '',
  highlights: ''
};

const EMPTY_STAY_FORM = {
  name: '',
  destinationName: '',
  altitude: '',
  tier: '4-star',
  tagline: '',
  pricePerNight: '',
  rating: 4.7,
  reviewsCount: 25,
  coverImage: '',
  overview: '',
  amenities: '',
  bestFor: ''
};

export default function PackagesManagement() {
  const [activeTab, setActiveTab] = useState('PACKAGES'); // 'PACKAGES' | 'DESTINATIONS' | 'STAYS'
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Package Modal
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PACKAGE_FORM);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Destination Modal
  const [showDestModal, setShowDestModal] = useState(false);
  const [destForm, setDestForm] = useState(EMPTY_DEST_FORM);

  // Stay Modal
  const [showStayModal, setShowStayModal] = useState(false);
  const [stayForm, setStayForm] = useState(EMPTY_STAY_FORM);

  const toast = useToast();
  const confirm = useConfirm();

  const loadAll = async () => {
    try {
      setLoading(true);
      const [pkgRes, destRes, stayRes] = await Promise.all([
        api.get('/packages'),
        api.get('/public/destinations'),
        api.get('/public/stays')
      ]);
      setPackages(pkgRes || []);
      setDestinations(destRes || []);
      setStays(stayRes || []);
    } catch (e) {
      toast.error('Failed to load catalogue: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleFileUpload = async (file, onUrlReady) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/media/upload-file', fd);
      if (res.url) {
        onUrlReady(res.url);
        toast.success('Image uploaded successfully.');
      }
    } catch (err) {
      toast.error('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreatePackage = () => {
    setEditingPkg(null);
    setFormData(EMPTY_PACKAGE_FORM);
    setShowModal(true);
  };

  const openEditPackage = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      name: pkg.name || '',
      shortDescription: pkg.shortDescription || '',
      overview: pkg.overview || '',
      duration: pkg.duration || '',
      states: pkg.states || 'Himachal Pradesh',
      tripType: pkg.tripType || 'Adventure',
      label: pkg.label || '',
      featured: pkg.featured !== false,
      destinations: Array.isArray(pkg.destinations) ? pkg.destinations.join(', ') : '',
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : '',
      basePrice: pkg.basePrice || '',
      maxCapacity: pkg.maxCapacity || 12,
      coverImage: pkg.coverImage || '',
      status: pkg.status || 'PUBLISHED',
      accommodationCategories: pkg.accommodationCategories || ['3_STAR', '4_STAR'],
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : '',
      exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : '',
      itineraries: Array.isArray(pkg.itineraries) && pkg.itineraries.length > 0
        ? pkg.itineraries
        : [{ day: 1, title: 'Day 1', description: '', meals: 'Breakfast & Dinner', stay: '' }]
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (pkg) => {
    const isPublished = pkg.status === 'PUBLISHED' || pkg.status === 'ACTIVE';
    const nextStatus = isPublished ? 'DISABLED' : 'PUBLISHED';
    try {
      await api.patch(`/packages/${pkg.id}/status`, { status: nextStatus });
      toast.success(`Package "${pkg.name}" status updated to ${nextStatus}.`);
      await loadAll();
    } catch (err) {
      toast.error(`Error updating status: ${err.message}`);
    }
  };

  const handleDeletePackage = async (pkg) => {
    const ok = await confirm({
      title: `Delete "${pkg.name}"?`,
      message: 'This will permanently remove this tour package from the catalogue.',
      confirmText: 'Delete Package',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await api.delete(`/packages/${pkg.id}`);
      toast.success('Package deleted.');
      await loadAll();
    } catch (err) {
      toast.error(`Error deleting package: ${err.message}`);
    }
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const payload = {
        ...formData,
        destinations: formData.destinations.split(',').map((s) => s.trim()).filter(Boolean),
        highlights: formData.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
        inclusions: formData.inclusions.split('\n').map((s) => s.trim()).filter(Boolean),
        exclusions: formData.exclusions.split('\n').map((s) => s.trim()).filter(Boolean),
        basePrice: parseFloat(formData.basePrice),
        itineraries: formData.itineraries.map((it, idx) => ({ ...it, day: idx + 1 }))
      };

      if (editingPkg) {
        await api.patch(`/packages/${editingPkg.id}`, payload);
        toast.success('Tour package updated successfully.');
      } else {
        await api.post('/packages', payload);
        toast.success('New tour package created and published.');
      }
      setShowModal(false);
      await loadAll();
    } catch (err) {
      toast.error(`Error saving package: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/public/destinations', {
        ...destForm,
        highlights: destForm.highlights.split('\n').map(s => s.trim()).filter(Boolean)
      });
      toast.success('Destination guide created.');
      setShowDestModal(false);
      setDestForm(EMPTY_DEST_FORM);
      await loadAll();
    } catch (err) {
      toast.error('Failed to create destination: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteDestination = async (dest) => {
    try {
      await api.delete(`/public/destinations/${dest.id || dest.slug}`);
      toast.success('Destination removed.');
      await loadAll();
    } catch (err) {
      toast.error('Failed to delete destination: ' + err.message);
    }
  };

  const handleSaveStay = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/public/stays', {
        ...stayForm,
        amenities: stayForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
      });
      toast.success('Stay property added to directory.');
      setShowStayModal(false);
      setStayForm(EMPTY_STAY_FORM);
      await loadAll();
    } catch (err) {
      toast.error('Failed to add stay: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteStay = async (stay) => {
    try {
      await api.delete(`/public/stays/${stay.id}`);
      toast.success('Stay property removed.');
      await loadAll();
    } catch (err) {
      toast.error('Failed to remove stay: ' + err.message);
    }
  };

  const filteredPackages = packages.filter((p) =>
    !search ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.packageId?.toLowerCase().includes(search.toLowerCase()) ||
    p.states?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Product Catalogue & Public Website Content"
        title="Packages, Destinations & Stays"
        description="Manage tour packages, regional guides, and scouted stays synced directly with the public website."
        icon={Package}
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'PACKAGES' && (
              <button onClick={openCreatePackage} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Create Package
              </button>
            )}
            {activeTab === 'DESTINATIONS' && (
              <button onClick={() => setShowDestModal(true)} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Add Destination
              </button>
            )}
            {activeTab === 'STAYS' && (
              <button onClick={() => setShowStayModal(true)} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Add Stay Property
              </button>
            )}
          </div>
        }
      />

      {/* Tabs & Search */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'PACKAGES', label: `Packages (${packages.length})`, icon: Package },
            { id: 'DESTINATIONS', label: `Destinations (${destinations.length})`, icon: Compass },
            { id: 'STAYS', label: `Stays (${stays.length})`, icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'PACKAGES' && (
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packages by name, state, or ID..."
              className="input pl-9 text-xs"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Spinner className="w-8 h-8 text-brand-600" />
          <p className="text-xs text-slate-500">Loading catalogue...</p>
        </div>
      ) : activeTab === 'PACKAGES' ? (
        filteredPackages.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No packages found"
            description={search ? 'No packages match your search filter.' : 'Create your first tour package to publish it on the website.'}
            action={
              <button onClick={openCreatePackage} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Create First Package
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const isPublished = pkg.status === 'PUBLISHED' || pkg.status === 'ACTIVE';
              return (
                <div key={pkg.id} className="card overflow-hidden flex flex-col hover:shadow-lift transition-all group">
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {pkg.coverImage ? (
                      <img
                        src={pkg.coverImage}
                        alt={pkg.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        No Cover Image
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge status={pkg.status || 'PUBLISHED'} />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-white font-bold">
                      {pkg.duration}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-brand-700">{pkg.packageId}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {pkg.states}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">{pkg.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{pkg.shortDescription}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting Rate</span>
                        <span className="text-base font-black text-slate-900 tabular-nums">₹{pkg.basePrice?.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditPackage(pkg)}
                          className="btn-secondary py-1 px-2.5 text-xs"
                          title="Edit package"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(pkg)}
                          className={`btn-secondary py-1 px-2.5 text-xs ${
                            isPublished ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {isPublished ? <><EyeOff className="w-3.5 h-3.5" /> Disable</> : <><Eye className="w-3.5 h-3.5" /> Publish</>}
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg)}
                          className="btn-secondary py-1 px-2 text-xs text-rose-600 hover:bg-rose-50"
                          title="Delete package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : activeTab === 'DESTINATIONS' ? (
        destinations.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No destinations added yet"
            description="Add regional guides to showcase states and valleys on the public website."
            action={
              <button onClick={() => setShowDestModal(true)} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Add Destination
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((dest) => (
              <div key={dest.id} className="card p-5 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold">
                    {dest.state}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{dest.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{dest.description}</p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {dest.idealDuration} • {dest.altitude}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDestination(dest)}
                  className="btn-secondary py-1 px-2 text-xs text-rose-600 hover:bg-rose-50 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        stays.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No stay properties added yet"
            description="Add vetted hotels, homestays, and glamping domes to the public Stays directory."
            action={
              <button onClick={() => setShowStayModal(true)} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Add Stay Property
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map((stay) => (
              <div key={stay.id} className="card p-5 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {stay.tierLabel}
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {stay.rating}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{stay.name}</h3>
                  <div className="text-xs text-brand-700 font-medium">{stay.destinationName} • {stay.pricePerNight}</div>
                  <p className="text-xs text-slate-500 line-clamp-2">{stay.overview}</p>
                </div>
                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleDeleteStay(stay)}
                    className="btn-secondary py-1 px-2.5 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Create / Edit Package Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowModal(false)}
          title={editingPkg ? `Edit Package: ${editingPkg.name}` : 'Create New Tour Itinerary Package'}
          description="Design route stages, pricing, and day-by-day expedition plan."
          maxWidth="max-w-3xl"
          footer={
            <>
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" form="create-package-form" disabled={saveLoading} className="btn-primary text-xs">
                {saveLoading ? 'Saving...' : editingPkg ? 'Update Package' : 'Publish Package'}
              </button>
            </>
          }
        >
          <form id="create-package-form" onSubmit={handleSavePackage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Spiti Valley High-Pass Circuit"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration (Days / Nights) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 7 Days / 6 Nights"
                  className="input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Region / State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.states}
                  onChange={(e) => setFormData({ ...formData, states: e.target.value })}
                  placeholder="Himachal Pradesh"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trip Type</label>
                <select
                  value={formData.tripType}
                  onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                  className="input text-xs"
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Starting Price (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="38500"
                  className="input text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image (URL or File Upload)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://... or upload an image file"
                  className="input text-xs font-mono flex-1"
                />
                <label className="btn-secondary text-xs cursor-pointer shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingImage ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], (url) => setFormData((prev) => ({ ...prev, coverImage: url })))}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Route Waypoints (Comma separated)
              </label>
              <input
                type="text"
                value={formData.destinations}
                onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                placeholder="Shimla, Sangla, Kalpa, Nako, Tabo, Kaza, Chandratal"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary</label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary shown on package cards..."
                className="input resize-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Overview</label>
              <textarea
                rows={3}
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                placeholder="Full journey description shown on package details page..."
                className="input resize-none text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inclusions (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  placeholder="Private 4x4 SUV&#10;Boutique Stays&#10;Inner Line Permits"
                  className="input resize-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exclusions (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                  placeholder="Airfare&#10;Personal expenses"
                  className="input resize-none text-xs"
                />
              </div>
            </div>

            {/* Itinerary Builder */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase">Day-by-Day Itinerary ({formData.itineraries.length} Days)</label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      itineraries: [
                        ...formData.itineraries,
                        { day: formData.itineraries.length + 1, title: '', description: '', meals: 'Breakfast & Dinner', stay: '' }
                      ]
                    })
                  }
                  className="btn-secondary py-1 px-2.5 text-xs"
                >
                  + Add Day
                </button>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {formData.itineraries.map((dayItem, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-brand-700">Day {idx + 1}</span>
                      <input
                        type="text"
                        value={dayItem.title}
                        onChange={(e) => {
                          const next = [...formData.itineraries];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setFormData({ ...formData, itineraries: next });
                        }}
                        placeholder="Day title (e.g. Kalpa to Kaza)"
                        className="input text-xs flex-1"
                      />
                      {formData.itineraries.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              itineraries: formData.itineraries.filter((_, i) => i !== idx)
                            })
                          }
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={dayItem.description}
                      onChange={(e) => {
                        const next = [...formData.itineraries];
                        next[idx] = { ...next[idx], description: e.target.value };
                        setFormData({ ...formData, itineraries: next });
                      }}
                      placeholder="Day route & activities description..."
                      className="input resize-none text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Destination Modal */}
      {showDestModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowDestModal(false)}
          title="Add Regional Destination Guide"
          description="Publish a regional guide for the public website."
          footer={
            <>
              <button type="button" onClick={() => setShowDestModal(false)} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" form="dest-form" disabled={saveLoading} className="btn-primary text-xs">
                {saveLoading ? 'Saving...' : 'Save Destination'}
              </button>
            </>
          }
        >
          <form id="dest-form" onSubmit={handleSaveDestination} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Region Name *</label>
                <input
                  type="text"
                  required
                  value={destForm.name}
                  onChange={(e) => setDestForm({ ...destForm, name: e.target.value, state: e.target.value })}
                  placeholder="e.g. Himachal Pradesh"
                  className="input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ideal Duration</label>
                <input
                  type="text"
                  value={destForm.idealDuration}
                  onChange={(e) => setDestForm({ ...destForm, idealDuration: e.target.value })}
                  placeholder="6 to 10 Days"
                  className="input text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={destForm.tagline}
                onChange={(e) => setDestForm({ ...destForm, tagline: e.target.value })}
                placeholder="Valleys of Whispering Pines & High Passes"
                className="input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="text"
                value={destForm.coverImage}
                onChange={(e) => setDestForm({ ...destForm, coverImage: e.target.value })}
                placeholder="https://..."
                className="input text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={destForm.description}
                onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                className="input resize-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Highlights (One per line)</label>
              <textarea
                rows={3}
                value={destForm.highlights}
                onChange={(e) => setDestForm({ ...destForm, highlights: e.target.value })}
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Create Stay Modal */}
      {showStayModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowStayModal(false)}
          title="Add Scouted Stay Property"
          description="Add a verified accommodation property to the public Stays directory."
          footer={
            <>
              <button type="button" onClick={() => setShowStayModal(false)} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" form="stay-form" disabled={saveLoading} className="btn-primary text-xs">
                {saveLoading ? 'Saving...' : 'Save Stay Property'}
              </button>
            </>
          }
        >
          <form id="stay-form" onSubmit={handleSaveStay} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Name *</label>
                <input
                  type="text"
                  required
                  value={stayForm.name}
                  onChange={(e) => setStayForm({ ...stayForm, name: e.target.value })}
                  placeholder="e.g. Hotel Deyzor, Kaza"
                  className="input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Hub *</label>
                <input
                  type="text"
                  required
                  value={stayForm.destinationName}
                  onChange={(e) => setStayForm({ ...stayForm, destinationName: e.target.value })}
                  placeholder="e.g. Kaza"
                  className="input text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quality Tier</label>
                <select
                  value={stayForm.tier}
                  onChange={(e) => setStayForm({ ...stayForm, tier: e.target.value })}
                  className="input text-xs"
                >
                  <option value="3-star">3 Star Property</option>
                  <option value="4-star">4 Star Property</option>
                  <option value="4-star-premium">4 Star Premium</option>
                  <option value="5-star">5 Star Property</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Price Per Night</label>
                <input
                  type="text"
                  value={stayForm.pricePerNight}
                  onChange={(e) => setStayForm({ ...stayForm, pricePerNight: e.target.value })}
                  placeholder="₹4,500 – ₹6,500"
                  className="input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Altitude</label>
                <input
                  type="text"
                  value={stayForm.altitude}
                  onChange={(e) => setStayForm({ ...stayForm, altitude: e.target.value })}
                  placeholder="3,800 m"
                  className="input text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="text"
                value={stayForm.coverImage}
                onChange={(e) => setStayForm({ ...stayForm, coverImage: e.target.value })}
                placeholder="https://..."
                className="input text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Overview</label>
              <textarea
                rows={2}
                value={stayForm.overview}
                onChange={(e) => setStayForm({ ...stayForm, overview: e.target.value })}
                className="input resize-none text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities (Comma separated)</label>
              <input
                type="text"
                value={stayForm.amenities}
                onChange={(e) => setStayForm({ ...stayForm, amenities: e.target.value })}
                placeholder="Central Heating, Mountain Views, Organic Dining"
                className="input text-xs"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
