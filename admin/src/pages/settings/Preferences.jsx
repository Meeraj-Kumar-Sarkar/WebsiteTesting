import React from 'react';
import { usePreferences } from '../../context/PreferencesContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast, useConfirm } from '../../context/FeedbackContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { ACCENTS } from '../../../theme.palettes.js';
import {
  SlidersHorizontal,
  Sun,
  Moon,
  Laptop,
  Paintbrush,
  Layers,
  Type,
  Bell,
  Clock,
  Layout,
  ShieldAlert,
  RotateCcw,
  Check,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function Preferences() {
  const { prefs, setPref, resetPrefs, resolvedTheme } = usePreferences();
  const { user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Reset all preferences?',
      message: 'This will restore all portal appearance and display settings to their default values.',
      confirmText: 'Reset to Defaults',
      tone: 'danger'
    });
    if (ok) {
      resetPrefs();
      toast.success('All preferences reset to factory defaults.');
    }
  };

  const handleToggle = (key) => {
    setPref(key, !prefs[key]);
    toast.success('Preference updated');
  };

  const permittedWorkspaces = ['auto', ...(user?.departments?.includes('MASTER') ? ['MASTER', 'SALES', 'FINANCE', 'MARKETING'] : (user?.departments || []))];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">
      <PageHeader
        eyebrow="Personal Customization"
        title="Admin Portal Preferences"
        description="Fine-tune your workspace appearance, density, theme modes, and notification behaviors according to your workflow."
        icon={SlidersHorizontal}
        actions={
          <button
            onClick={handleReset}
            className="btn-secondary text-xs sm:text-sm text-slate-600 hover:text-rose-600 hover:border-rose-300"
          >
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </button>
        }
      />

      {/* ─── 1. Theme & Appearance ────────────────────────────────────────────── */}
      <section className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Color Theme & Mode</h2>
            <p className="text-xs sm:text-sm text-slate-500">Choose between light, dark, or automated operating system sync.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Crisp & clear high-contrast alpine white' },
            { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep slate & obsidian for low light strain' },
            { id: 'system', label: 'System Sync', icon: Laptop, desc: 'Auto-adapts to your device settings' }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = prefs.theme === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setPref('theme', mode.id);
                  toast.success(`Theme mode set to ${mode.label}`);
                }}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 shadow-soft ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                </div>
                <div className="font-semibold text-sm text-slate-900">{mode.label}</div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">{mode.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Accent Color Palette Selector */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-brand-600" /> Accent Brand Palette
              </label>
              <p className="text-xs text-slate-500">Applies to primary buttons, highlights, active nav items, and focus rings.</p>
            </div>
            <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200 capitalize">
              {ACCENTS[prefs.accent]?.label || prefs.accent}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
            {Object.entries(ACCENTS).map(([key, item]) => {
              const isSelected = prefs.accent === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setPref('accent', key);
                    toast.success(`Accent color switched to ${item.label}`);
                  }}
                  className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition ${
                    isSelected
                      ? 'border-slate-800 bg-slate-50 shadow-sm ring-2 ring-slate-800/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center text-white"
                    style={{ backgroundColor: item[500] }}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 2. Density & Typography ──────────────────────────────────────────── */}
      <section className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Layout Density & Typography</h2>
            <p className="text-xs sm:text-sm text-slate-500">Adjust spatial comfort for high-volume data tables and reading preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Density */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800 block">Table & View Density</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'comfortable', label: 'Comfortable', desc: 'Standard breathing room' },
                { id: 'compact', label: 'Compact', desc: 'High density for large screens' }
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setPref('density', d.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    prefs.density === d.id
                      ? 'border-brand-500 bg-brand-50/50 font-semibold text-brand-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold">{d.label}</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Scale */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800 block">Base Font Scale</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sm', label: 'Small (14.5px)' },
                { id: 'md', label: 'Standard (16px)' },
                { id: 'lg', label: 'Large (17px)' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPref('fontScale', s.id)}
                  className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition ${
                    prefs.fontScale === s.id
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800 block">Primary Typeface</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'inter', label: 'Inter', sub: 'Tech-focused' },
                { id: 'manrope', label: 'Manrope', sub: 'Modern clean' },
                { id: 'system', label: 'System', sub: 'Native UI' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPref('font', f.id)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    prefs.font === f.id
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-slate-400">{f.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Width */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800 block">Workspace Canvas Width</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'contained', label: 'Standard (7xl)' },
                { id: 'wide', label: 'Wide (2K)' },
                { id: 'full', label: 'Full Bleed' }
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setPref('contentWidth', w.id)}
                  className={`py-2.5 px-2 rounded-xl border text-center text-xs font-semibold transition ${
                    prefs.contentWidth === w.id
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Motion Preference */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">Reduce Interface Animations</div>
            <p className="text-xs text-slate-500">Minimizes page transitions and bouncy effects for performance or motion sensitivity.</p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('reduceMotion')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              prefs.reduceMotion ? 'bg-brand-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                prefs.reduceMotion ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* ─── 3. Regional Formats & Workspace Defaults ─────────────────────────── */}
      <section className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Regional Formats & Defaults</h2>
            <p className="text-xs sm:text-sm text-slate-500">Configure default department on launch and standard date/time presentations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Default Workspace on Login</label>
            <select
              value={prefs.defaultWorkspace || 'auto'}
              onChange={(e) => {
                setPref('defaultWorkspace', e.target.value);
                toast.success('Default workspace updated');
              }}
              className="input text-xs"
            >
              <option value="auto">Auto (Smart fallback)</option>
              {permittedWorkspaces.filter(w => w !== 'auto').map(dept => (
                <option key={dept} value={dept}>{dept} Department</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Date Display Format</label>
            <select
              value={prefs.dateFormat}
              onChange={(e) => {
                setPref('dateFormat', e.target.value);
                toast.success('Date formatting updated');
              }}
              className="input text-xs"
            >
              <option value="en-IN">DD/MM/YYYY (India - en-IN)</option>
              <option value="en-GB">DD/MM/YYYY (UK / Europe - en-GB)</option>
              <option value="en-US">MM/DD/YYYY (US - en-US)</option>
              <option value="ja-JP">YYYY/MM/DD (ISO - ja-JP)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Time Notation</label>
            <select
              value={prefs.timeFormat}
              onChange={(e) => {
                setPref('timeFormat', e.target.value);
                toast.success('Time notation updated');
              }}
              className="input text-xs"
            >
              <option value="12h">12-Hour (02:30 PM)</option>
              <option value="24h">24-Hour (14:30)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ─── 4. Notifications & Operational Safety ────────────────────────────── */}
      <section className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Notifications & Safety</h2>
            <p className="text-xs sm:text-sm text-slate-500">Configure polling frequency and destructive confirmation safeguards.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="text-sm font-semibold text-slate-800">Notification Polling Frequency</div>
              <p className="text-xs text-slate-500">How often the portal fetches incoming trip enquiries, payment receipts, and approvals.</p>
            </div>
            <select
              value={prefs.notificationInterval}
              onChange={(e) => {
                setPref('notificationInterval', Number(e.target.value));
                toast.success('Polling interval updated');
              }}
              className="input text-xs w-36"
            >
              <option value="15">Every 15s (Live)</option>
              <option value="30">Every 30s (Default)</option>
              <option value="60">Every 1 minute</option>
              <option value="0">Manual only</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="text-sm font-semibold text-slate-800">Destructive Action Confirmations</div>
              <p className="text-xs text-slate-500">Prompt a verification modal before approving refunds, rejecting payments, or deleting content.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('confirmDestructive')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                prefs.confirmDestructive !== false ? 'bg-brand-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  prefs.confirmDestructive !== false ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-semibold text-slate-800">Audio Chimes for Incoming Alerts</div>
              <p className="text-xs text-slate-500">Plays a subtle notification tone when a high-priority enquiry or approval lands.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('notificationSound')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                prefs.notificationSound ? 'bg-brand-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  prefs.notificationSound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
