import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { Spinner } from '../../components/common/Loaders.jsx';
import { useToast } from '../../context/FeedbackContext.jsx';
import {
  Camera,
  Upload,
  Share2,
  Image,
  ExternalLink,
  Lock,
  Trash2
} from 'lucide-react';

const VISIBILITY_CONFIG = {
  PRIVATE: { label: 'Private Only', next: 'CUSTOMER_DELIVERY', nextLabel: 'Share to Customer Delivery', badgeClass: 'bg-slate-100 text-slate-700' },
  CUSTOMER_DELIVERY: { label: 'Customer Delivery', next: 'PUBLIC_GALLERY', nextLabel: 'Promote to Public Gallery', badgeClass: 'bg-blue-50 text-blue-700' },
  PUBLIC_GALLERY: { label: 'Public Gallery', next: 'PRIVATE', nextLabel: 'Revert to Private', badgeClass: 'bg-emerald-50 text-emerald-700' },
};

const GENERAL_GALLERY_TRIP = {
  id: 'GENERAL',
  tripId: 'GENERAL',
  customerName: 'Public & Brand Gallery',
  packageName: 'General Website Gallery Assets',
  travelDates: 'All Seasons',
  status: 'ACTIVE'
};

export default function TripMediaWorkspace() {
  const { user } = useAuth();
  const toast = useToast();

  const [trips, setTrips] = useState([GENERAL_GALLERY_TRIP]);
  const [selectedTrip, setSelectedTrip] = useState(GENERAL_GALLERY_TRIP);
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Upload form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    url: '',
    file: null,
    category: 'ORIGINAL',
    galleryCategory: 'landscapes',
    visibility: 'PUBLIC_GALLERY',
    caption: '',
    location: 'Himalayas',
    altitude: ''
  });
  const [uploading, setUploading] = useState(false);

  // Share archive
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharing, setSharing] = useState(false);

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Load trips
  useEffect(() => {
    api.get('/trips')
      .then((res) => {
        const all = Array.isArray(res) ? res : (res.data || []);
        const combined = [GENERAL_GALLERY_TRIP, ...all];
        setTrips(combined);
        setSelectedTrip(all[0] || GENERAL_GALLERY_TRIP);
      })
      .catch((err) => toast.error('Failed to load trips: ' + err.message))
      .finally(() => setLoadingTrips(false));
  }, []);

  // Load media for selected trip
  const loadMedia = useCallback(() => {
    if (!selectedTrip) return;
    setLoadingMedia(true);
    const endpoint = selectedTrip.tripId === 'GENERAL'
      ? '/media'
      : `/media/trips/${selectedTrip.id || selectedTrip.tripId}`;
    api.get(endpoint)
      .then((res) => {
        const items = Array.isArray(res) ? res : (res.data || []);
        setMedia(items);
      })
      .catch(() => setMedia([]))
      .finally(() => setLoadingMedia(false));
  }, [selectedTrip]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    setUploading(true);
    try {
      const targetTripId = selectedTrip.tripId || selectedTrip.id || 'GENERAL';
      if (uploadForm.file) {
        const fd = new FormData();
        fd.append('file', uploadForm.file);
        fd.append('category', uploadForm.category);
        fd.append('galleryCategory', uploadForm.galleryCategory);
        fd.append('visibility', uploadForm.visibility);
        fd.append('caption', uploadForm.caption);
        fd.append('location', uploadForm.location);
        fd.append('altitude', uploadForm.altitude);
        await api.post(`/media/trips/${targetTripId}/upload`, fd);
      } else {
        await api.post(`/media/trips/${targetTripId}/upload`, {
          url: uploadForm.url,
          category: uploadForm.category,
          galleryCategory: uploadForm.galleryCategory,
          visibility: uploadForm.visibility,
          caption: uploadForm.caption,
          location: uploadForm.location,
          altitude: uploadForm.altitude,
          type: 'IMAGE',
        });
      }
      toast.success('Media asset uploaded and registered.');
      setUploadForm({
        url: '',
        file: null,
        category: 'ORIGINAL',
        galleryCategory: 'landscapes',
        visibility: 'PUBLIC_GALLERY',
        caption: '',
        location: 'Himalayas',
        altitude: ''
      });
      setShowUploadModal(false);
      loadMedia();
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleVisibilityChange = async (asset, nextVisibility) => {
    try {
      await api.patch(`/media/${asset.id}/visibility`, { visibility: nextVisibility });
      toast.success(`Asset visibility updated to ${nextVisibility}`);
      loadMedia();
    } catch (err) {
      toast.error(err.message || 'Failed to update visibility');
    }
  };

  const handleDeleteAsset = async (asset) => {
    try {
      await api.delete(`/media/${asset.id}`);
      toast.success('Media asset deleted.');
      loadMedia();
    } catch (err) {
      toast.error(err.message || 'Failed to delete asset');
    }
  };

  const handleShareArchive = async (e) => {
    e.preventDefault();
    if (!selectedTrip || !shareEmail.trim()) return;
    setSharing(true);
    try {
      await api.post(`/media/trips/${selectedTrip.id || selectedTrip.tripId}/share-archive`, {
        customerEmail: shareEmail.trim(),
      });
      toast.success(`Archive package securely dispatched to ${shareEmail}!`);
      setShowShareModal(false);
      setShareEmail('');
    } catch (err) {
      toast.error(err.message || 'Failed to share archive');
    } finally {
      setSharing(false);
    }
  };

  const filteredMedia = categoryFilter === 'ALL'
    ? media
    : media.filter((m) => m.category === categoryFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Visual Storytelling & Delivery"
        title="Trip Media & Public Gallery Workspace"
        description="Upload expedition photography, manage customer archives, and publish images to the live website gallery."
        icon={Camera}
        actions={
          selectedTrip && (
            <div className="flex items-center gap-2">
              {selectedTrip.tripId !== 'GENERAL' && (
                <button
                  onClick={() => {
                    setShareEmail(selectedTrip.customerEmail || '');
                    setShowShareModal(true);
                  }}
                  className="btn-secondary text-xs"
                >
                  <Share2 className="w-4 h-4" /> Share Archive
                </button>
              )}
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary text-xs"
              >
                <Upload className="w-4 h-4" /> Upload Asset
              </button>
            </div>
          )
        }
      />

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Assigned Trips */}
        <div className="card p-4 space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Media Collections ({trips.length})
            </h2>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto">
            {loadingTrips ? (
              <div className="p-8 text-center"><Spinner className="w-6 h-6 mx-auto text-brand-600" /></div>
            ) : (
              trips.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrip(t)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedTrip?.id === t.id
                      ? 'bg-brand-50/70 border-brand-400 shadow-soft ring-1 ring-brand-400/30'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-brand-800">{t.tripId}</span>
                    <Badge status={t.status} size="sm" />
                  </div>
                  <div className="font-bold text-slate-900 truncate">{t.customerName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{t.packageName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{t.travelDates}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Media Gallery Grid */}
        <div className="lg:col-span-3 space-y-4">
          {selectedTrip && (
            <div className="card p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-brand-700">{selectedTrip.tripId}</span>
                    <h2 className="text-base font-bold text-slate-900">{selectedTrip.customerName}</h2>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedTrip.packageName} • {media.length} media assets recorded
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {['ALL', 'ORIGINAL', 'EDITED'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        categoryFilter === cat
                          ? 'bg-brand-600 text-white shadow-soft'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Assets' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {loadingMedia ? (
                <div className="p-16 flex flex-col items-center justify-center gap-3">
                  <Spinner className="w-8 h-8 text-brand-600" />
                  <p className="text-xs text-slate-500">Loading photographs...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <EmptyState
                  icon={Image}
                  title="No media assets found in this collection"
                  description="Upload photographs from your computer or via URL to share with clients or publish to the website gallery."
                  action={
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="btn-primary text-xs"
                    >
                      <Upload className="w-4 h-4" /> Upload First Photo
                    </button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredMedia.map((m) => {
                    const vis = VISIBILITY_CONFIG[m.visibility] || VISIBILITY_CONFIG.PRIVATE;
                    return (
                      <div
                        key={m.id}
                        className="group card overflow-hidden flex flex-col hover:shadow-lift transition-all"
                      >
                        <div className="relative aspect-video bg-slate-950 overflow-hidden">
                          <img
                            src={m.url}
                            alt={m.caption || m.filename}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-white font-mono">
                              {m.category}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${vis.badgeClass} backdrop-blur-md shadow-sm`}>
                              {vis.label}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                          <div>
                            <div className="font-semibold text-xs text-slate-900 truncate">
                              {m.caption || m.filename || 'Trip Photograph'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ID: {m.mediaId} • {m.location || 'Himalayas'}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <a
                                href={m.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-slate-500 hover:text-brand-600 inline-flex items-center gap-1 font-medium"
                              >
                                <ExternalLink className="w-3 h-3" /> View
                              </a>
                              <button
                                onClick={() => handleDeleteAsset(m)}
                                className="text-rose-500 hover:text-rose-700"
                                title="Delete asset"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleVisibilityChange(m, vis.next)}
                              className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                            >
                              {vis.nextLabel}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Media Modal */}
      {showUploadModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowUploadModal(false)}
          title="Upload Photograph"
          description={`Collection: ${selectedTrip?.tripId} (${selectedTrip?.customerName})`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="upload-media-form"
                disabled={uploading || (!uploadForm.file && !uploadForm.url)}
                className="btn-primary text-xs"
              >
                {uploading ? 'Uploading...' : 'Save Photograph'}
              </button>
            </>
          }
        >
          <form id="upload-media-form" onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upload Image File from Computer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Or Image URL
              </label>
              <input
                type="text"
                value={uploadForm.url}
                onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="input text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Stage</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="input text-xs"
                >
                  <option value="ORIGINAL">ORIGINAL</option>
                  <option value="EDITED">EDITED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gallery Theme</label>
                <select
                  value={uploadForm.galleryCategory}
                  onChange={(e) => setUploadForm({ ...uploadForm, galleryCategory: e.target.value })}
                  className="input text-xs"
                >
                  <option value="landscapes">Landscapes &amp; Peaks</option>
                  <option value="stays">Stays &amp; Camps</option>
                  <option value="trails">Trails &amp; Treks</option>
                  <option value="culture">Culture &amp; People</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Visibility</label>
                <select
                  value={uploadForm.visibility}
                  onChange={(e) => setUploadForm({ ...uploadForm, visibility: e.target.value })}
                  className="input text-xs"
                >
                  <option value="PUBLIC_GALLERY">PUBLIC_GALLERY (Live on Website)</option>
                  <option value="CUSTOMER_DELIVERY">CUSTOMER_DELIVERY</option>
                  <option value="PRIVATE">PRIVATE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caption / Title</label>
                <input
                  type="text"
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
                  placeholder="e.g. Sunset over Key Monastery"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={uploadForm.location}
                  onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                  placeholder="e.g. Spiti Valley, Himachal Pradesh"
                  className="input text-xs"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Share Archive Modal */}
      {showShareModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowShareModal(false)}
          title="Share Trip Archive Deliverable"
          description={`Generates a customer access token for ${selectedTrip?.customerName}.`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="share-archive-form"
                disabled={sharing || !shareEmail.trim()}
                className="btn-primary text-xs"
              >
                {sharing ? 'Sharing...' : 'Dispatch Archive Link'}
              </button>
            </>
          }
        >
          <form id="share-archive-form" onSubmit={handleShareArchive} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Recipient Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="customer@domain.com"
                className="input text-xs font-mono"
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-1">
              <strong>Customer Delivery Notice:</strong>
              <p>Only assets marked as <strong>CUSTOMER_DELIVERY</strong> or <strong>PUBLIC_GALLERY</strong> will be included in the download package.</p>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
