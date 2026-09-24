/** @type {import('tailwindcss').Config} */
module.exports = {
  // dark: variants key off Vuetify's theme class (none are used; see Design_Plan_Dark_Mode.md section 6.3)
  darkMode: ['selector', '.v-theme--dark'],
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
