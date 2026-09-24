/**
 * src/theme/themes.js
 *
 * Vuetify theme definitions for light and dark mode (Design_Plan_Dark_Mode.md §5.2 item 1, §6.3).
 * main.js passes `themes` to createVuetify({ theme: { themes } }).
 *
 * Plain module on purpose: Node gate scripts import it directly, so it may only use relative .js
 * imports - no Vue, no CSS, no window / localStorage.
 *
 * Rules for every key (§6.3 "Key rules"):
 *   - opaque 6-digit hex only; Vuetify drops alpha, so pre-composite tints;
 *   - every custom key exists in both themes, and its light value is the exact literal it replaces;
 *   - never name a key after a Tailwind or Material color class (hence the tw- prefix);
 *   - never set surface-variant / on-surface-variant: Vuetify's defaults are a matched pair that
 *     tooltips, stepper avatars, switch tracks, chips, badges and snackbars rely on;
 *   - keep on-background equal to on-surface in each theme.
 *
 * Light sets only primary, primary-darken-1 and the app keys; everything else stays at Vuetify's
 * defaults so light mode looks the same as before dark mode existed.
 * To add a key: add it to BOTH the light and dark "App keys" sections below.
 */

// Brand red as a FILL (a background behind white text), in both themes. White on it is 5.88:1.
export const BRAND_RED = '#c8102e';

// Brand red as FOREGROUND (red text and icons) in dark mode only; light mode uses BRAND_RED.
// This is the one value to change to retune the dark-mode red text/icon shade.
export const BRAND_RED_ON_DARK = '#FF6B7F';

const light = {
  dark: false,
  colors: {
    // ---- Built-in keys (only these two change; the rest stay at Vuetify's light defaults)
    primary: BRAND_RED,              // brand red fills: buttons, chips, avatars, app bar, drawer
    'primary-darken-1': '#a00d24',   // red hover shade; white on it is 8.15:1

    // ---- App keys (§6.3 "New theme keys"); light value = the literal each one replaces
    'brand-fg': BRAND_RED,           // red foreground: text, icons, progress, text/outlined/tonal variants, tabs, switches
    'appbar-slice': '#EFECEC',       // the app-bar gradient's grey stop
    panel: '#FAFAFA',                // panel fills
    'panel-strong': '#F5F5F5',       // stronger fills and full-page backgrounds
    'page-bg': '#F8F9FA',            // page background
    'tint-warning': '#FFF8E1',       // pale warning tint
    'tint-error': '#FFEBEE',         // pale error tint
    'tint-success': '#E8F5E9',       // pale success tint
    'tw-gray-50': '#F9FAFB',         // Tailwind gray-50 (read by tailwind.config.js)
    'tw-gray-200': '#E5E7EB',        // Tailwind gray-200, preflight's default border
    'tw-gray-300': '#D1D5DB',        // Tailwind gray-300
    'tw-gray-500': '#6B7280',        // Tailwind gray-500
    'tw-gray-700': '#374151',        // Tailwind gray-700
  },
};

const dark = {
  dark: true,
  colors: {
    // ---- Built-in keys: CHW Stories' dark palette without surface-variant, plus brand red
    background: '#0A0A0A',           // page background (neutral-950); index.html's pre-paint style must match
    surface: '#171717',              // cards, sheets, menus (neutral-900)
    'on-background': '#FAFAFA',      // text on background (neutral-50); equal to on-surface
    'on-surface': '#FAFAFA',         // text on surface (neutral-50); equal to on-background
    error: '#EF4444',                // error (red-500)
    warning: '#F59E0B',              // warning (amber-500)
    info: '#3B82F6',                 // info (blue-500)
    success: '#22C55E',              // success (green-500)
    primary: BRAND_RED,              // brand red fills, same as light
    'primary-darken-1': '#a00d24',   // red hover shade, same as light

    // ---- App keys (§6.3 "New theme keys"); must match the light section key for key
    'brand-fg': BRAND_RED_ON_DARK,   // red foreground, lightened for contrast on dark surfaces
    'appbar-slice': '#262626',       // the app-bar gradient's grey stop (neutral-800)
    panel: '#262626',                // panel fills (neutral-800)
    'panel-strong': '#262626',       // stronger fills and full-page backgrounds (neutral-800)
    'page-bg': '#0A0A0A',            // page background, same as background
    'tint-warning': '#322716',       // 12% warning over surface, pre-composited
    'tint-error': '#311C1C',         // 12% error over surface, pre-composited
    'tint-success': '#182C20',       // 12% success over surface, pre-composited
    'tw-gray-50': '#262626',         // Tailwind gray-50 role (neutral-800)
    'tw-gray-200': '#404040',        // default border (neutral-700)
    'tw-gray-300': '#525252',        // Tailwind gray-300 role (neutral-600)
    'tw-gray-500': '#A3A3A3',        // Tailwind gray-500 role (neutral-400), 7.1:1 on surface
    'tw-gray-700': '#D4D4D4',        // Tailwind gray-700 role (neutral-300), 12.1:1 on surface
  },
};

export const themes = { light, dark };
