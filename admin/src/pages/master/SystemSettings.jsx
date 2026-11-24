import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import PageHeader from '../../components/common/PageHeader';
import { Spinner } from '../../components/common/Loaders';
import { useToast } from '../../context/FeedbackContext';
import { Settings, QrCode, AlertTriangle, Save, Building, Phone } from 'lucide-react';

export default function SystemSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/system-settings');
      setSettings(res || {});
    } catch (e) {
      toast.error('Failed to load system settings: ' + e.message);
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
    try {
      await api.patch('/reports/system-settings', settings);
      toast.success('System configuration and billing identities updated.');
    } catch (err) {
      toast.error(`Error saving settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3">
        <Spinner className="w-8 h-8 text-brand-600" />
        <p className="text-xs text-slate-500">Loading system configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      <PageHeader
        eyebrow="Master Configuration & Billing Identity"
        title="System & Financial Settings"
        description="Configure UPI payment parameters, billing identity, public contact information, tax registrations, and legal notices."
        icon={Settings}
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* UPI QR Settings */}
        <div className="card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">UPI QR &amp; Payment Configuration</h2>
              <p className="text-xs text-slate-500">Used for customer payment requests and printable invoice QR codes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company UPI VPA / ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings?.upiId || ''}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="mountainmemories@bank"
                className="input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Merchant / Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings?.upiName || ''}
                onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                placeholder="Mountain and Memories Travel LLP"
                className="input text-xs"
              />
            </div>
          </div>
        </div>

        {/* Legal Identity & Public Contact */}
        <div className="card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Billing &amp; Public Contact Details</h2>
              <p className="text-xs text-slate-500">Appears on invoices, tax receipts, and the public website contact &amp; footer sections.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={settings?.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={settings?.gstNumber || ''}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Public Support Phone / WhatsApp</label>
              <input
                type="text"
                value={settings?.supportPhone || ''}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Public Support Email</label>
              <input
                type="email"
                value={settings?.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                placeholder="contact@mountainandmemories.com"
                className="input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Business Address</label>
            <textarea
              rows={2}
              value={settings?.registeredAddress || ''}
              onChange={(e) => setSettings({ ...settings, registeredAddress: e.target.value })}
              className="input resize-none text-xs"
            />
          </div>
        </div>

        {/* Media Consent & Privacy Notice */}
        <div className="card p-6 sm:p-8 space-y-3 border-amber-200/80 bg-amber-50/30">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold">Media &amp; Data Privacy Notice</h2>
          </div>
          <p className="text-xs text-slate-500">
            Disclosure presented to customers upon booking for photography archival and data storage.
          </p>
          <input
            type="text"
            value={settings?.privacyNotice || ''}
            onChange={(e) => setSettings({ ...settings, privacyNotice: e.target.value })}
            className="input text-xs font-mono"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs flex items-center gap-2 px-6 py-2.5"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
