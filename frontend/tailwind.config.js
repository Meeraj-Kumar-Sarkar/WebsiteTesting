/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core 5-color brutalist palette: https://coolors.co/palette/dad7cd-a3b18a-588157-3a5a40-344e41
        palette: {
          light: '#dad7cd',   // 1. Pale sage / stone neutral canvas
          sage: '#a3b18a',    // 2. Muted light sage green
          fern: '#588157',    // 3. Crisp vibrant fern green accent
          pine: '#3a5a40',    // 4. Strong hunter/pine green
          forest: '#344e41',  // 5. Deep ink forest green (darkest tone & borders)
        },
        // Mapped semantic color tokens to ensure entire application aligns with the 5-color palette:
        forest: {
          DEFAULT: '#344e41',
          50: '#f5f6f4',
          100: '#dad7cd',
          200: '#c2ccb5',
          300: '#a3b18a',
          400: '#588157',
          500: '#3a5a40',
          600: '#344e41',
          700: '#2b4237',
          800: '#23362d',
          900: '#1b2a23',
          950: '#121d18',
        },
        gold: {
          DEFAULT: '#588157',
          50: '#f4f6f3',
          100: '#dad7cd',
          200: '#c5ceba',
          300: '#a3b18a',
          400: '#7a9d77',
          500: '#588157',
          600: '#476d46',
          700: '#3a5a40',
          800: '#344e41',
          900: '#23352c',
        },
        ivory: {
          DEFAULT: '#dad7cd',
          50: '#f7f6f3',
          100: '#dad7cd',
          200: '#c8cfbf',
          300: '#a3b18a',
        },
        stone: {
          DEFAULT: '#dad7cd',
          50: '#f6f6f3',
          100: '#eceae3',
          200: '#dad7cd',
          300: '#c3cbba',
          400: '#a3b18a',
          500: '#588157',
        },
        charcoal: {
          DEFAULT: '#344e41',
          600: '#588157',
          700: '#3a5a40',
          800: '#344e41',
          900: '#24372e',
          950: '#18241e',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px #344e41',
        'brutal': '3px 3px 0px 0px #344e41',
        'brutal-lg': '5px 5px 0px 0px #344e41',
        'brutal-xl': '7px 7px 0px 0px #344e41',
        'soft': '2px 2px 0px 0px #344e41',
        'lift': '4px 4px 0px 0px #344e41',
      }
    },
  },
  plugins: [],
}
