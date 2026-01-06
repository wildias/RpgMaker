/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rpg-gold': '#D4AF37',
        'rpg-dark': '#1a1410',
        'rpg-brown': '#3d2817',
      },
      fontFamily: {
        'medieval': ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}
