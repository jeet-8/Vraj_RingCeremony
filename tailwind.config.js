/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./event.config.js",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5E6CC',
          DEFAULT: '#D8A85E',
          deep: '#B38136',
          dark: '#7D5519',
          metallic: '#C89D56',
        },
        champagne: {
          100: '#FAF4EC',
          200: '#F4E7D5',
          300: '#EBD6B8',
          400: '#DFBE95',
          500: '#D2A46F',
        },
        rose: {
          light: '#FBF5F6',
          blush: '#F3E3E6',
          petal: '#EABEC7',
          mauve: '#B67B8C',
          dusty: '#8E5164',
          deep: '#5A2637',
        },
        royal: {
          bg: '#170E14',
          surface: '#24141E',
          card: '#2F1A28',
          text: '#FDF8F5',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cinzel"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        hindi: ['"Noto Serif Devanagari"', 'serif'],
        gujarati: ['"Noto Serif Gujarati"', 'serif'],
      },
      boxShadow: {
        'emboss': '2px 2px 5px rgba(0,0,0,0.25), -2px -2px 5px rgba(255,255,255,0.7)',
        'emboss-dark': '4px 4px 12px rgba(0,0,0,0.4), -2px -2px 8px rgba(230,195,146,0.15)',
        'gold-glow': '0 0 20px rgba(216,168,94,0.35)',
        'wax-seal': '0 8px 20px rgba(90,38,55,0.45), 0 2px 6px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'gold-foil': 'linear-gradient(135deg, #ECC880 0%, #FBE8A6 25%, #C29648 50%, #F5DE9B 75%, #B78330 100%)',
        'gold-sheen': 'linear-gradient(90deg, transparent 0%, rgba(255,235,180,0.5) 50%, transparent 100%)',
        'paper-grain': 'radial-gradient(ellipse at center, #FDFBF8 0%, #F5EDE4 100%)',
        'royal-gradient': 'linear-gradient(180deg, #1A0D15 0%, #2A1523 50%, #150911 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
