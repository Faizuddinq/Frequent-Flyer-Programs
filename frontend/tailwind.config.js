/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffe8d0',
          100: '#ffd1a1',
          200: '#ffba72',
          300: '#ffa94d',
          400: '#ff9429',
          500: '#ff7f11',
          600: '#e66900',
          700: '#cc5500',
          800: '#b34100',
          900: '#992d00',
        },
        background: '#fdfdfb',
        surface: '#ffffff',
      },
    },
  },
  plugins: [],
};