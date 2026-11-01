/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6f4',
          100: '#e5eae5',
          200: '#cbd7cb',
          300: '#a3b18b',
          400: '#588157',
          500: '#3a5a40',
          600: '#344e41',
          700: '#283d33',
          800: '#1e2d26',
          900: '#141e19',
        },
        sage: '#dad7cd',
        moss: '#588157',
        evergreen: '#344e41',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
