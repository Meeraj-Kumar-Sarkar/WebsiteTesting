/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:  '#f5f0e8',
        beige:  '#dad7cd',
        sage:   '#a3b18a',
        fern:   '#588157',
        pine:   '#3a5a40',
        bark:   '#7c6145',
        soil:   '#5a4533',
        ivory:  '#f5f0e8',
        forest: {
          DEFAULT: '#344e41',
          50:  '#f5f6f4', 100: '#dad7cd', 200: '#c2ccb5',
          300: '#a3b18a', 400: '#588157', 500: '#3a5a40',
          600: '#344e41', 700: '#2b4237', 800: '#23362d',
          900: '#1b2a23', 950: '#121d18',
        },
        gold: {
          DEFAULT: '#588157',
          300: '#a3b18a', 400: '#7a9d77', 500: '#588157',
          600: '#476d46', 700: '#3a5a40',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:  ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'nature':    '0 4px 24px 0 rgba(90,69,51,0.09)',
        'nature-sm': '0 2px 10px 0 rgba(90,69,51,0.07)',
        'nature-md': '0 8px 32px 0 rgba(90,69,51,0.12)',
        'nature-lg': '0 20px 60px 0 rgba(90,69,51,0.16)',
        'nature-xl': '0 32px 80px 0 rgba(90,69,51,0.20)',
        'float':     '0 12px 36px 0 rgba(58,90,64,0.18)',
        'glass':     '0 8px 32px 0 rgba(58,90,64,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
        'brutal-sm': '2px 2px 0px 0px #344e41',
        'brutal':    '3px 3px 0px 0px #344e41',
        'brutal-lg': '5px 5px 0px 0px #344e41',
      },
      borderRadius: {
        'organic': '1.5rem 0.6rem 1.8rem 0.8rem',
        'blob':    '60% 40% 55% 45% / 45% 55% 45% 55%',
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
