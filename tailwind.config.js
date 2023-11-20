/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#c8102e',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
