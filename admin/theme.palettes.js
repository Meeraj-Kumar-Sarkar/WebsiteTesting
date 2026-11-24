/**
 * Shared colour definitions for the admin theme engine.
 * Imported by tailwind.config.js (to generate CSS variables) and by the
 * Settings page (to render accent swatches).
 */

export const DARK_BASE = {
  canvas: '#0b0f17', // page background
  surface: '#111723', // cards / panels (replaces bg-white in dark mode)
  elevated: '#161d2b', // popovers, menus
  line: '#232c3d', // default hairlines
};

export const ACCENTS = {
  forest: {
    label: 'Forest',
    50: '#f2f7f3', 100: '#e1ede3', 200: '#c3dbc8', 300: '#9bc1a3', 400: '#6c9f76',
    500: '#4b7f56', 600: '#3a6645', 700: '#305238', 800: '#28432f', 900: '#203627', 950: '#101e15',
  },
  ocean: {
    label: 'Ocean',
    50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee',
    500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344',
  },
  indigo: {
    label: 'Indigo',
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8',
    500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
  },
  violet: {
    label: 'Violet',
    50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
    500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065',
  },
  rose: {
    label: 'Rose',
    50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185',
    500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519',
  },
  amber: {
    label: 'Sunset',
    50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
    500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407',
  },
  graphite: {
    label: 'Graphite',
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
    500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617',
  },
};
