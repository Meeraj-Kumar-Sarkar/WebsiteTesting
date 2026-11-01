import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Package, Plus, Edit2, Eye, EyeOff, Layers, MapPin, Calendar, Check, DollarSign } from 'lucide-react';

export default function PackagesManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    duration: '',
    states: 'Himachal Pradesh',
    destinations: '',
    basePrice: '',
    maxCapacity: 12,
    coverImage: '',
    accommodationCategories: ['3_STAR', '4_STAR'],
    inclusions: '',
    exclusions: '',
    itineraries: [
      { day: 1, title: 'Arrival & Acclimatization', description: 'Scenic transfer and acclimatization rest.' }
    ]
  });

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/packages');
      setPackages(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleToggleStatus = async (pkg, nextStatus) => {
    try {
      await api.patch(`/packages/${pkg.id}/status`, { status: nextStatus });
      setFeedback(`Package ${pkg.name} status updated to ${nextStatus}.`);
      await loadPackages();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        destinations: formData.destinations.split(',').map(s => s.trim()).filter(Boolean),
        inclusions: formData.inclusions.split('\n').map(s => s.trim()).filter(Boolean),
        exclusions: formData.exclusions.split('\n').map(s => s.trim()).filter(Boolean),
        basePrice: parseFloat(formData.basePrice)
      };

      await api.post('/packages', payload);
      setFeedback('New tour package created successfully.');
      setShowModal(false);
      await loadPackages();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
            <Package className="w-4 h-4 text-brand-600" />
            Product Catalogue & Itineraries
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Tour Packages & Itineraries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Master catalogue of high-altitude Himalayan expeditions, accommodation tiers, and pricing rules.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Package
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-44 bg-slate-100 relative">
              <img
                src={pkg.coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800'}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge status={pkg.status} />
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono text-white font-bold">
                {pkg.duration}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400">{pkg.packageId}</div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">{pkg.name}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{pkg.shortDescription}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {pkg.destinations?.slice(0, 4).map(d => (
                    <span key={d} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      {d}
                    </span>
                  ))}
                  {pkg.destinations?.length > 4 && (
                    <span className="text-[10px] text-slate-400">+{pkg.destinations.length - 4} more</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting Price</div>
                  <div className="text-lg font-black text-slate-900">₹{pkg.basePrice?.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {pkg.status === 'PUBLISHED' ? (
                    <button
                      onClick={() => handleToggleStatus(pkg, 'DISABLED')}
                      title="Disable / Unpublish from website"
                      className="px-2.5 py-1 rounded border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Disable
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(pkg, 'PUBLISHED')}
                      title="Publish to customer website"
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Package Modal */}
      {showModal && (
        <Modal isOpen={true} onClose={() => setShowModal(false)} title="Create Tour Package" maxWidth="max-w-3xl">
          <form onSubmit={handleSavePackage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Spiti & Pin Valley Wildlife Trail"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="8 Days / 7 Nights"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Base Price (INR)</label>
                <input
                  type="number"
                  required
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="42000"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Max Capacity (Pax)</label>
                <input
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Short Description</label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary for catalogue..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Destinations (Comma separated)</label>
              <input
                type="text"
                value={formData.destinations}
                onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                placeholder="Shimla, Sangla, Chitkul, Kalpa, Kaza, Pin Valley"
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Inclusions (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.inclusions}
                  onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                  placeholder="4x4 Vehicle with driver&#10;Breakfast & Dinner&#10;Inner Line Permits"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Exclusions (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                  placeholder="Airfare&#10;Personal expenses"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold">
                Save Package
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
