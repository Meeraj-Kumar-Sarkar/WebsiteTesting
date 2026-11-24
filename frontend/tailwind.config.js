// Translucent glass colour whose opacity modifier scales the base alpha
// (e.g. bg-cream/50 → half of the base glass alpha) instead of going solid.
const glass = (r, g, b, base) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(${r} ${g} ${b} / ${base})`
    : `rgb(${r} ${g} ${b} / calc(${base} * ${opacityValue}))`;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:  '#edf5ee',
        beige:  '#091a0f',
        sage:   '#95d534',
        fern:   '#1b8343',
        pine:   '#00642a',
        bark:   '#045a07',
        soil:   '#103d0b',
        ivory:  '#edf5ee',
        obsidian: '#06120a',
        forest: {
          DEFAULT: '#00642a',
          50:  '#edf5ee', 100: '#d4ead7', 200: '#b2db9e',
          300: '#95d534', 400: '#1b8343', 500: '#00642a',
          600: '#045a07', 700: '#0d4a0c', 800: '#103d0b',
          900: '#091f0e', 950: '#051208',
        },
        gold: {
          DEFAULT: '#1b8343',
          300: '#95d534', 400: '#4fb23c', 500: '#1b8343',
          600: '#00642a', 700: '#045a07',
        },
      },
      /*
       * Liquid-glass design system
       * ─ Surfaces (cream / beige) are translucent frosted glass, never solid.
       * ─ One fill family: emerald #00642a → #1b8343 (hover). One accent: lime #95d534.
       * ─ Deep greens #103d0b / #045a07 live in the background atmosphere.
       */
      backgroundColor: {
        cream: glass(214, 240, 222, 0.085), // primary glass panel
        beige: glass(214, 240, 222, 0.05),  // secondary / inset glass
        soil:  glass(3, 12, 7, 0.72),       // smoked glass (chips on photos)
        pine:  'rgb(0 100 42 / <alpha-value>)',
        fern:  'rgb(27 131 67 / <alpha-value>)',
        bark:  'rgb(4 90 7 / <alpha-value>)',
        sage:  'rgb(149 213 52 / <alpha-value>)',
      },
      textColor: {
        soil:  'rgb(240 245 238 / <alpha-value>)', // primary copy
        cream: 'rgb(255 255 255 / <alpha-value>)',
        pine:  'rgb(149 213 52 / <alpha-value>)',  // accent
        sage:  'rgb(149 213 52 / <alpha-value>)',  // accent
        fern:  'rgb(206 236 160 / <alpha-value>)', // accent hover (soft lime)
        bark:  'rgb(214 228 212 / <alpha-value>)',
      },
      borderColor: {
        bark:  'rgb(255 255 255 / <alpha-value>)', // glass hairlines
        cream: 'rgb(255 255 255 / <alpha-value>)',
        sage:  'rgb(149 213 52 / <alpha-value>)',
        pine:  'rgb(149 213 52 / <alpha-value>)',
        fern:  'rgb(27 131 67 / <alpha-value>)',
        soil:  'rgb(3 12 7 / <alpha-value>)',
      },
      gradientColorStops: {
        beige: glass(214, 240, 222, 0.05),
        cream: glass(214, 240, 222, 0.03),
        soil:  'rgb(3 10 6 / <alpha-value>)',
        pine:  'rgb(0 100 42 / <alpha-value>)',
        fern:  'rgb(27 131 67 / <alpha-value>)',
        sage:  'rgb(149 213 52 / <alpha-value>)',
      },
      fontFamily: {
        sans:  ['"League Spartan"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"League Spartan"', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'nature':    '0 18px 40px -16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
        'nature-sm': '0 10px 24px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'nature-md': '0 24px 50px -18px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
        'nature-lg': '0 30px 70px -20px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        'nature-xl': '0 40px 90px -24px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        'float':     '0 20px 44px -16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        'glass':     '0 20px 44px -16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        'brutal-sm': '2px 2px 0px 0px #045a07',
        'brutal':    '3px 3px 0px 0px #045a07',
        'brutal-lg': '5px 5px 0px 0px #045a07',
      },
      borderRadius: {
        'organic': '0.875rem',
        'blob':    '1.25rem',
        'pill':    '999px',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-up':        'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':        'fadeIn 0.6s ease both',
        'slide-left':     'slideLeft 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right':    'slideRight 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':       'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'float':          'float 5s ease-in-out infinite',
        'float-slow':     'float 7s ease-in-out infinite',
        'float-fast':     'float 3.5s ease-in-out infinite',
        'pulse-soft':     'pulseSoft 2.5s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'spin-slow':      'spin 8s linear infinite',
        'bounce-soft':    'bounceSoft 2s ease-in-out infinite',
        'count-up':       'fadeUp 0.5s ease both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.65' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
