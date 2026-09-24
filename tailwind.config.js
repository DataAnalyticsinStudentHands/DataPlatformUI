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
        'custom-red': '#c8102e', // removed at the end of Phase 4 (Design_Plan_Dark_Mode.md section 8)
        // Gray shades the app uses read the theme's tw-gray-* keys (src/theme/themes.js), so they follow
        // light/dark. Comma form and string values only: Vuetify's variables are "r,g,b" triplets, and the
        // forms plugin calls .replace() on these. Other gray shades stay at Tailwind's defaults.
        gray: {
          50: 'rgba(var(--v-theme-tw-gray-50), <alpha-value>)',
          200: 'rgba(var(--v-theme-tw-gray-200), <alpha-value>)',
          300: 'rgba(var(--v-theme-tw-gray-300), <alpha-value>)',
          500: 'rgba(var(--v-theme-tw-gray-500), <alpha-value>)',
          700: 'rgba(var(--v-theme-tw-gray-700), <alpha-value>)',
        },
      },
      // Preflight's default border color (Tailwind gray-200), from the theme; no alpha placeholder
      borderColor: {
        DEFAULT: 'rgb(var(--v-theme-tw-gray-200))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
