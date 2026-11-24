/** @type {import('tailwindcss').Config} */
import defaultColors from 'tailwindcss/colors';
import { ACCENTS, DARK_BASE } from './theme.palettes.js';

/**
 * ─── Theme engine ────────────────────────────────────────────────────────────
 * Every colour utility (bg-*, text-*, border-*) resolves to a CSS variable with
 * the light-mode colour as the fallback. Dark mode (html.dark) re-defines only
 * the variables that need to change, so existing markup such as
 * `bg-white text-slate-900 border-slate-200` adapts automatically.
 *
 * Background, text and border utilities use *separate* variables so that e.g.
 * `text-emerald-700` can be lightened in dark mode while `bg-emerald-700`
 * (a button hover) keeps its solid colour.
 *
 * `brand-*` is the user-selectable accent colour (Settings → Appearance).
 */

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const PALETTES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green',
  'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
];

// ── colour helpers ──────────────────────────────────────────────────────────
const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const triplet = (hex) => hexToRgb(hex).join(' ');
const mix = (fg, bg, t) => {
  const a = hexToRgb(fg);
  const b = hexToRgb(bg);
  return a.map((v, i) => Math.round(b[i] * (1 - t) + v * t)).join(' ');
};

// gray is unified with slate for a consistent neutral tone across pages
const source = (p) => (p === 'gray' ? defaultColors.slate : defaultColors[p]);

// ── dark-mode transforms ───────────────────────────────────────────────────
const SLATE_DARK = {
  bg: { 50: '#161d2b', 100: '#1b2333', 200: '#252e40', 300: '#334056', 400: '#475569', 700: '#3b475c', 800: '#2c3648', 900: '#222b3b', 950: '#0b1019' },
  tx: { 500: '#8b97aa', 600: '#a7b2c3', 700: '#c4cdd9', 800: '#dde3eb', 900: '#eef2f7', 950: '#f8fafc' },
  bd: { 50: '#1a2232', 100: '#1e2737', 200: '#273143', 300: '#334057', 400: '#4a586e' },
};

function darkValue(kind, palette, shade) {
  if (palette === 'slate' || palette === 'gray') {
    const v = SLATE_DARK[kind][shade];
    return v ? triplet(v) : null;
  }
  const c = source(palette);
  const card = DARK_BASE.surface;
  if (kind === 'bg') {
    const t = { 50: 0.12, 100: 0.18, 200: 0.27, 300: 0.4 }[shade];
    return t ? mix(c[500], card, t) : null;
  }
  if (kind === 'tx') {
    const map = { 600: 400, 700: 300, 800: 200, 900: 100, 950: 50 }[shade];
    return map ? triplet(c[map]) : null;
  }
  if (kind === 'bd') {
    const t = { 50: 0.14, 100: 0.2, 200: 0.28, 300: 0.4 }[shade];
    return t ? mix(c[500], card, t) : null;
  }
  return null;
}

// ── build palettes for each utility kind ──────────────────────────────────
const KIND_PREFIX = { bg: 'bg', tx: 'tx', bd: 'bd' };
function buildKind(kind) {
  const out = {};
  for (const p of PALETTES) {
    out[p] = {};
    for (const s of SHADES) {
      const light = source(p)[s];
      const hasDark = darkValue(kind, p, s) !== null;
      out[p][s] = hasDark
        ? `rgb(var(--${KIND_PREFIX[kind]}-${p}-${s}, ${triplet(light)}) / <alpha-value>)`
        : light;
    }
  }
  out.brand = {};
  for (const s of SHADES) out.brand[s] = `rgb(var(--${kind}-brand-${s}) / <alpha-value>)`;
  return out;
}

const brandColor = {};
for (const s of SHADES) brandColor[s] = `rgb(var(--brand-${s}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: brandColor,
        gray: defaultColors.slate,
        sage: '#dad7cd',
        moss: '#588157',
        evergreen: '#344e41',
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      backgroundColor: {
        ...buildKind('bg'),
        white: 'rgb(var(--bg-white, 255 255 255) / <alpha-value>)',
      },
      textColor: buildKind('tx'),
      borderColor: buildKind('bd'),
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.08)',
        lift: '0 2px 4px rgb(15 23 42 / 0.04), 0 12px 32px -8px rgb(15 23 42 / 0.18)',
        glow: '0 0 0 1px rgb(var(--brand-500) / 0.25), 0 8px 24px -6px rgb(var(--brand-500) / 0.45)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'pop-in': {
          from: { opacity: 0, transform: 'translateY(6px) scale(0.98)' },
          to: { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        'slide-in-right': {
          from: { opacity: 0, transform: 'translateX(16px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
        'pop-in': 'pop-in 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [
    function themeVariables({ addBase }) {
      const dark = {};
      for (const kind of ['bg', 'tx', 'bd']) {
        for (const p of PALETTES) {
          for (const s of SHADES) {
            const v = darkValue(kind, p, s);
            if (v) dark[`--${kind}-${p}-${s}`] = v;
          }
        }
      }
      dark['--bg-white'] = triplet(DARK_BASE.surface);

      // Accent palettes: one selector per accent, light + dark variants
      const accentRules = {};
      for (const [name, scale] of Object.entries(ACCENTS)) {
        const lightVars = {};
        const darkVars = {};
        for (const s of SHADES) {
          lightVars[`--brand-${s}`] = triplet(scale[s]);
          lightVars[`--bg-brand-${s}`] = triplet(scale[s]);
          lightVars[`--tx-brand-${s}`] = triplet(scale[s]);
          lightVars[`--bd-brand-${s}`] = triplet(scale[s]);

          // dark: solid shades shift one step lighter, tints become translucent-looking mixes
          const bgTint = { 50: 0.12, 100: 0.18, 200: 0.27, 300: 0.4 }[s];
          const bdTint = { 50: 0.14, 100: 0.2, 200: 0.28, 300: 0.4 }[s];
          const bgShift = { 500: 400, 600: 500, 700: 600, 800: 700 }[s];
          const txShift = { 500: 400, 600: 400, 700: 300, 800: 200, 900: 100, 950: 50 }[s];
          darkVars[`--brand-${s}`] = triplet(scale[bgShift || s]);
          darkVars[`--bg-brand-${s}`] = bgTint ? mix(scale[500], DARK_BASE.surface, bgTint) : triplet(scale[bgShift || s]);
          darkVars[`--tx-brand-${s}`] = triplet(scale[txShift || s]);
          darkVars[`--bd-brand-${s}`] = bdTint ? mix(scale[500], DARK_BASE.surface, bdTint) : triplet(scale[s]);
        }
        // forest is the default accent (also applied when no data-accent is set)
        const lightSel = name === 'forest' ? `:root, [data-accent="forest"]` : `[data-accent="${name}"]`;
        const darkSel = name === 'forest' ? `.dark, .dark[data-accent="forest"]` : `.dark[data-accent="${name}"]`;
        accentRules[lightSel] = lightVars;
        accentRules[darkSel] = darkVars;
      }

      addBase({
        ':root': {
          '--canvas': '244 246 249',
          '--surface': '255 255 255',
          '--elevated': '255 255 255',
          '--line': '226 232 240',
          '--ink': '15 23 42',
          '--muted': '100 116 139',
          '--font-sans': 'Inter',
          colorScheme: 'light',
        },
        ...accentRules,
        '.dark': {
          ...dark,
          '--canvas': triplet(DARK_BASE.canvas),
          '--surface': triplet(DARK_BASE.surface),
          '--elevated': triplet(DARK_BASE.elevated),
          '--line': triplet(DARK_BASE.line),
          '--ink': '238 242 247',
          '--muted': '139 151 170',
          colorScheme: 'dark',
        },
      });
    },
  ],
};
