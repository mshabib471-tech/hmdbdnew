/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hmdbd-dark': '#0f0f13',
        'hmdbd-surface': '#1a1a24',
        'hmdbd-surface-variant': '#232330',
        'hmdbd-orange': '#F97316',
        'hmdbd-orange-light': '#FF9B54',
      }
    },
  },
  plugins: [],
}
