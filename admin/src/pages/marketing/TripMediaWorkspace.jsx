import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';

const VISIBILITY_LABELS = {
  PRIVATE: { label: 'Private', next: 'CUSTOMER_DELIVERY', nextLabel: '→ Customer Delivery', color: 'bg-gray-100 text-gray-700' },
  CUSTOMER_DELIVERY: { label: 'Customer', next: 'PUBLIC_GALLERY', nextLabel: '→ Public Gallery', color: 'bg-blue-100 text-blue-700' },
  PUBLIC_GALLERY: { label: 'Public', next: 'PRIVATE', nextLabel: '→ Make Private', color: 'bg-green-100 text-green-700' },
};

export default function TripMediaWorkspace() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Upload form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ url: '', category: 'ORIGINAL', caption: '' });
  const [uploading, setUploading] = useState(false);

  // Share archive
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharing, setSharing] = useState(false);

  const isMaster = user?.departments?.includes('MASTER');

  // Load trips
  useEffect(() => {
    api.get('/trips')
      .then((res) => {
        const all = res.data || [];
        const mine = isMaster
          ? all
          : all.filter((t) => t.assignedMediaEmpIds?.includes(user?.id));
        setTrips(mine);
        if (mine.length > 0) setSelectedTrip(mine[0]);
      })
      .catch(console.error)
      .finally(() => setLoadingTrips(false));
  }, [user, isMaster]);

  // Load media for selected trip
  const loadMedia = useCallback(() => {
    if (!selectedTrip) return;
    setLoadingMedia(true);
    api.get(`/media/trips/${selectedTrip.id}`)
      .then((res) => setMedia(res.data || []))
      .catch(() => setMedia([]))
      .finally(() => setLoadingMedia(false));
  }, [selectedTrip]);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    setUploading(true);
    try {
      await api.post(`/media/trips/${selectedTrip.id}/upload`, {
        ...uploadForm,
        type: 'IMAGE',
      });
      setUploadForm({ url: '', category: 'ORIGINAL', caption: '' });
      setShowUploadModal(false);
      loadMedia();
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleVisibilityChange = async (assetId, nextVisibility) => {
    try {
      await api.patch(`/media/${assetId}/visibility`, { visibility: nextVisibility });
      loadMedia();
    } catch (err) {
      alert(err.message || 'Failed to update visibility');
    }
  };

  const handleShareArchive = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    setSharing(true);
    try {
      await api.post(`/media/trips/${selectedTrip.id}/share-archive`, {
        customerEmail: shareEmail,
      });
      alert('Archive shared successfully! (Email stub — check console)');
      setShowShareModal(false);
      setShareEmail('');
    } catch (err) {
      alert(err.message || 'Failed to share archive');
    } finally {
      setSharing(false);
    }
  };

  const categoryCounts = {
    ORIGINAL: media.filter((m) => m.category === 'ORIGINAL').length,
    EDITED: media.filter((m) => m.category === 'EDITED').length,
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* ── Left Panel: Trip List ── */}
      <aside className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Assigned Trips
          </h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {loadingTrips ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : trips.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              No trips assigned
            </div>
          ) : (
            trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-brand-50 transition-colors ${
                  selectedTrip?.id === trip.id
                    ? 'bg-brand-50 border-l-4 border-l-brand-600'
                    : ''
                }`}
              >
                <div className="font-medium text-gray-900 text-sm truncate">
                  {trip.destination}
                </div>
                <div className="text-xs text-gray-400 mt-0.5 font-mono">{trip.id}</div>
                <div className="mt-1">
                  <Badge status={trip.status} />
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ── Right Panel: Media Grid ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {!selectedTrip ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-3">🏔️</div>
              <p>Select a trip from the left panel</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">{selectedTrip.destination}</h1>
                <p className="text-sm text-gray-500 font-mono">{selectedTrip.id}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>📸 {categoryCounts.ORIGINAL} originals</span>
                  <span>✨ {categoryCounts.EDITED} edited</span>
                  <span>🌐 {media.filter((m) => m.visibility === 'PUBLIC_GALLERY').length} public</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                >
                  📦 Share Archive
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors"
                >
                  + Upload Media
                </button>
              </div>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-xl p-4">
              {loadingMedia ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : media.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <div className="text-4xl mb-2">📂</div>
                  <p>No media uploaded yet</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="mt-3 text-brand-600 hover:underline text-sm"
                  >
                    Upload the first asset
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {media.map((asset) => {
                    const vis = VISIBILITY_LABELS[asset.visibility] || VISIBILITY_LABELS.PRIVATE;
                    return (
                      <div
                        key={asset.id}
                        className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex flex-col"
                      >
                        {/* Preview */}
                        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                          {asset.url ? (
                            <img
                              src={asset.url}
                              alt={asset.caption || asset.id}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <span className="text-3xl">🖼️</span>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-2 flex-1 flex flex-col gap-1">
                          <p className="text-xs text-gray-700 truncate">{asset.caption || '—'}</p>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded font-medium self-start ${vis.color}`}
                          >
                            {vis.label}
                          </span>
                          <span className="text-xs text-gray-400">{asset.category}</span>
                          <button
                            onClick={() => handleVisibilityChange(asset.id, vis.next)}
                            className="mt-auto text-xs text-brand-600 hover:text-brand-800 hover:underline text-left"
                          >
                            {vis.nextLabel}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Upload Modal ── */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Media Asset"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={uploadForm.url}
              onChange={(e) => setUploadForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter a direct image or video URL (file upload not required for demo)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={uploadForm.category}
              onChange={(e) => setUploadForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ORIGINAL">Original (raw)</option>
              <option value="EDITED">Edited / Post-processed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <input
              type="text"
              value={uploadForm.caption}
              onChange={(e) => setUploadForm((p) => ({ ...p, caption: e.target.value }))}
              placeholder="e.g. Sunset at Chandratal Lake"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Share Archive Modal ── */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Customer Archive"
      >
        <form onSubmit={handleShareArchive} className="space-y-4">
          <p className="text-sm text-gray-600">
            Send a curated archive of{' '}
            <strong>CUSTOMER_DELIVERY</strong> assets for{' '}
            <strong>{selectedTrip?.destination}</strong> to the customer's email.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            📌 Demo mode: no actual email is sent. Archive link is logged to console.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sharing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {sharing ? 'Sharing…' : 'Share Archive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
