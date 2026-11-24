import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * User-level UI preferences for the admin portal. Persisted per-browser in
 * localStorage (`mm_prefs`) and applied to <html> as classes / data attributes.
 * The inline script in index.html applies the same values before first paint.
 */

const STORAGE_KEY = 'mm_prefs';

export const DEFAULT_PREFS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  accent: 'forest', // see theme.palettes.js
  density: 'comfortable', // 'comfortable' | 'compact'
  fontScale: 'md', // 'sm' | 'md' | 'lg'
  font: 'inter', // 'inter' | 'manrope' | 'system'
  sidebarCollapsed: false,
  contentWidth: 'contained', // 'contained' | 'wide' | 'full'
  reduceMotion: false,
  notificationInterval: 30, // seconds, 0 = off
  notificationSound: false,
  defaultWorkspace: 'auto', // 'auto' | department code
  dateFormat: 'en-IN', // locale used for dates
  timeFormat: '12h', // '12h' | '24h'
  confirmDestructive: true,
};

const FONT_SCALE = { sm: '14.5px', md: '16px', lg: '17px' };
const FONTS = { inter: 'Inter', manrope: 'Manrope', system: 'system-ui' };

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...DEFAULT_PREFS, ...saved };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  );

  // Follow OS theme changes when theme === 'system'
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme = prefs.theme === 'system' ? (systemDark ? 'dark' : 'light') : prefs.theme;

  // Apply to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.setAttribute('data-accent', prefs.accent);
    root.setAttribute('data-density', prefs.density);
    root.style.setProperty('--ui-scale', FONT_SCALE[prefs.fontScale] || FONT_SCALE.md);
    root.style.setProperty('--font-sans', FONTS[prefs.font] || FONTS.inter);
    if (prefs.reduceMotion) root.setAttribute('data-motion', 'reduced');
    else root.removeAttribute('data-motion');

    const meta = document.querySelectorAll('meta[name="theme-color"]');
    meta.forEach((m) => m.setAttribute('content', resolvedTheme === 'dark' ? '#0b0f17' : '#f4f6f9'));
  }, [prefs, resolvedTheme]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* storage full / disabled */
    }
  }, [prefs]);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setPrefs(loadPrefs());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setPref = useCallback((key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetPrefs = useCallback(() => setPrefs({ ...DEFAULT_PREFS }), []);

  const toggleTheme = useCallback(() => {
    setPrefs((prev) => {
      const current = prev.theme === 'system' ? (systemDark ? 'dark' : 'light') : prev.theme;
      return { ...prev, theme: current === 'dark' ? 'light' : 'dark' };
    });
  }, [systemDark]);

  /** Locale/format aware date helpers so pages render dates per preference. */
  const formatDate = useCallback(
    (value, opts = { day: '2-digit', month: 'short', year: 'numeric' }) => {
      if (!value) return '—';
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString(prefs.dateFormat, opts);
    },
    [prefs.dateFormat]
  );

  const formatTime = useCallback(
    (value) => {
      if (!value) return '—';
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleTimeString(prefs.dateFormat, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: prefs.timeFormat === '12h',
      });
    },
    [prefs.dateFormat, prefs.timeFormat]
  );

  const formatDateTime = useCallback(
    (value) => (value ? `${formatDate(value)}, ${formatTime(value)}` : '—'),
    [formatDate, formatTime]
  );

  const value = useMemo(
    () => ({ prefs, setPref, resetPrefs, resolvedTheme, toggleTheme, formatDate, formatTime, formatDateTime }),
    [prefs, setPref, resetPrefs, resolvedTheme, toggleTheme, formatDate, formatTime, formatDateTime]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider');
  return ctx;
}
