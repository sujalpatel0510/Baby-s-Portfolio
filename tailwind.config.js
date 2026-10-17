/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdfa',
          100: '#fff8f1', // Official haX cream background
          200: '#f9eee1',
          300: '#f2dfca',
        },
        berry: {
          light: '#d46a8c',
          DEFAULT: '#a34063', // Official haX berry
          dark: '#6e2741',
        },
        earth: '#5c4033',
        midnight: {
          DEFAULT: '#0a0d18',
          deep: '#060810',
          card: '#12172b',
          border: '#242f55',
        },
        cloud: {
          light: '#f0f5ff',
          DEFAULT: '#e0ecff',
          fluff: '#d0e2ff',
        },
        rainbow: {
          pink: '#ff9ebb',
          peach: '#ffd1a4',
          yellow: '#ffeaa7',
          mint: '#a8e6cf',
          sky: '#a1c4fd',
          lilac: '#c2b6f7',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        bubbly: ['Fredoka', 'Quicksand', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatRev 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(1deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
}
