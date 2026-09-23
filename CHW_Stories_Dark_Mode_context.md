# Answer: how CHWStories defines dark mode

## Context
Another repo's session asked "How is the dark mode in your other app defined?"
with options Vuetify theme object / CSS variables / Tailwind dark: variants /
mixed. This is research only - no changes to this repo.

## Answer to pick: **Vuetify theme object** (option 1)

Vuetify is the single source of truth; the other two mechanisms hang off it.

- **Theme definition** - `createVuetify({ theme: { defaultTheme, themes: { light, dark } } })`
  in `CHWStories/frontend/src/main.ts:63-106`. Dark colors: background `#0A0A0A`,
  surface `#171717`, surface-variant `#262626`, on-background/on-surface `#FAFAFA`,
  error `#EF4444`, warning `#F59E0B`, info `#3B82F6`, success `#22C55E`,
  primary = `brand.primaryColor`. Light theme is also explicit.
- **Initial theme (no flash)** - `src/theme/initialTheme.ts`: `resolveInitialTheme()`
  reads `localStorage['app-theme']`, falls back to OS `prefers-color-scheme`; called
  before `createVuetify`. `attachOsListener()` wired after `app.mount()` follows OS
  changes only until the user toggles.
- **Toggle** - `src/composables/useColorScheme.ts` wraps `useTheme()`, exposes
  `isDark`, `currentTheme`, `toggle()` (writes localStorage). Used by the sun/moon
  button in `src/components/layout/AppBar.vue`.
- **Tailwind bridge** - `tailwind.config.js`: `darkMode: ['selector', '.v-theme--dark']`,
  so `dark:` follows Vuetify, not the OS. Only 1 `dark:` class in the whole app
  (`RegisterPage.vue:162`).
- **CSS variables** - not hand-rolled; custom CSS reads Vuetify's generated
  `--v-theme-*` vars (`rgb(var(--v-theme-surface))`) and scopes overrides under
  `.v-theme--dark` (dark toasts, tooltip, autofill in `src/index.css`).

## Files to port to the other app
1. `theme` block from `src/main.ts` (+ the `resolveInitialTheme` / `attachOsListener` calls)
2. `src/theme/initialTheme.ts` (copy as-is)
3. `src/composables/useColorScheme.ts` (copy as-is)
4. `darkMode` line in `tailwind.config.js` (if the other app uses Tailwind)
5. Optional: dark blocks in `src/index.css`; conventions in `Design_Plan_Dark_Mode.md` §3.1, §6, §7

## Verification
None needed here - read-only investigation.
