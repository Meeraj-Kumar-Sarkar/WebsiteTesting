import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Settings, ShieldCheck, QrCode, AlertTriangle, Save } from 'lucide-react';

export default function SystemSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/system-settings');
      setSettings(res || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      await api.patch('/reports/system-settings', settings);
      setFeedback('System configuration and UPI settings successfully updated.');
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-700 font-bold mb-1">
          <Settings className="w-4 h-4 text-brand-600" />
          Master Configuration
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          System & Financial Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure demonstration UPI QR parameters, billing identity, payment expiry, and legal notices.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* UPI QR Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Demonstration UPI QR Configuration</h2>
              <p className="text-xs text-slate-500">Used for customer payment requests and invoice QR generation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Company UPI VPA / ID
              </label>
              <input
                type="text"
                required
                value={settings.upiId || ''}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="mountainmemories@bank"
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Merchant / Business Name
              </label>
              <input
                type="text"
                required
                value={settings.upiName || ''}
                onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                placeholder="Mountain and Memories Travel LLP"
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Legal Identity & Tax */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Billing & Registered Entity Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={settings.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={settings.gstNumber || ''}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Registered Address</label>
            <textarea
              rows={2}
              value={settings.registeredAddress || ''}
              onChange={(e) => setSettings({ ...settings, registeredAddress: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Temporary Privacy Notice Placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold">Temporary Media Notice Placeholder (TBD-10)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Current provisional notice displayed to customers prior to full legal review.
          </p>
          <input
            type="text"
            value={settings.privacyNotice || 'We store, alter, archive your data.'}
            onChange={(e) => setSettings({ ...settings, privacyNotice: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-xs font-mono bg-slate-50"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
