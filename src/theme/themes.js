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

    // ---- Phase 2 keys (§6.3 palette table and missing-key rule); light = the exact literal replaced
    // Palette keys (§6.3 palette table): colors bound through props and helpers
    muted: '#9E9E9E',                           // 'grey' / '#999' chip colors, :color values, helper returns
    'muted-strong': '#666666',                  // '#666' / grey-darken-1/-2 :color values, helper returns
    // Saturated fills behind white text: the same value in both themes
    'archive-fill': '#757575',                  // grey-darken-1 flat Archive button (instructor)
    'archive-fill-strong': '#212121',           // grey-darken-4 flat Archive button (student)
    'complete-fill': '#16A34A',                 // project editor completed step and connector
    'approve-fill': '#2E7D32',                  // .approve-btn
    'approve-fill-hover': '#1B5E20',            // .approve-btn:hover
    'checklist-frame-fill': '#385F73',          // studentChecklist / studentExpReg list frames
    'accent-fill': '#6366F1',                   // ProjectForm optional section number
    'btn-save-hover-fill': '#A00B26',           // studentExpReg .btn-save:hover
    'cta-gradient-end': '#A30D26',              // PreviewSubmitStep .btn-primary gradient end
    'avatar-gradient-end': '#E85A4F',           // AuthorInput avatar placeholder gradient end
    'dialog-header-gradient-end': '#FF5252',    // projectsMain .dialog-header gradient end
    // Hued text and icons (Material / Tailwind hue names and literals)
    'caution-fg': '#FF9800',                    // Material orange: restore / pending icons, chips, buttons
    'proposed-fg': '#FF5722',                   // Material deep-orange: 'Proposed' status chips
    'consent-fg': '#FFA000',                    // Material amber-darken-2: consent icons and chip
    'notice-info-fg': '#1565C0',                // text-blue-darken-3 registration notice
    'filetype-pdf-fg': '#E53935',               // red-darken-1 PDF icon
    'filetype-doc-fg': '#1976D2',               // blue-darken-2 Word icon
    'filetype-sheet-fg': '#388E3C',             // green-darken-2 spreadsheet icon
    'filetype-slides-fg': '#F4511E',            // deep-orange-darken-1 slides icon
    'filetype-image-fg': '#8E24AA',             // purple-darken-1 image icon
    'checklist-done-fg': '#166534',             // green-800 (text): studentChecklist done rows
    'checklist-todo-fg': '#991B1B',             // red-800 (text): studentChecklist to-do rows
    'link-fg': '#2563EB',                       // blue-600 (text) links and blue icons
    'link-hover-fg': '#1E40AF',                 // blue-800 (text, hover) links; privacy notice text
    'link-soft-fg': '#3B82F6',                  // blue-500 (text) router-link (studentChecklist)
    'banner-caution-fg': '#C2410C',             // orange-700 (text) banner text
    'banner-success-fg': '#15803D',             // green-700 (text) banner text (sendNewCode)
    'required-fg': '#FF0000',                   // required-field asterisks (Basic pages)
    'brand-fg-strong': '#A00D24',               // dark-red consent shield icons
    'complete-fg': '#16A34A',                   // project editor completed / saved state
    'section-partners-fg': '#059669',           // SectionAddMenu partners icon
    'section-impact-fg': '#EA580C',             // SectionAddMenu impact icon
    'section-poster-fg': '#7C3AED',             // SectionAddMenu poster icon
    'hint-info-fg': '#0F5DB0',                  // goalFormCommRes .info-text
    'found-notice-fg': '#4A90E2',               // exit / goal form experience-found notice
    'status-success-fg': '#2E7D32',             // backupDashboard .status-success
    'status-failed-fg': '#C62828',              // backupDashboard .status-failed
    'validation-error-fg': '#DC2626',           // project editor validation warnings
    'accent-fg': '#6366F1',                     // project editor indigo accent
    'accent-hover-fg': '#4F46E5',               // PreviewSubmitStep .toggle-errors-btn:hover
    'alert-accent-fg': '#5C6BC0',               // joinProjectDialog alert title and icon
    'status-banner-warning-fg': '#856404',      // editProjectProposal .status-banner text
    'proposed-banner-fg': '#F57C00',            // editProject .status-banner.proposed text
    // Neutral text
    'tip-fg': '#444444',                        // projectProposal tips
    'label-strong-fg': '#4A5568',               // FeaturedProjectsManager / PreviewSubmitStep labels
    'label-soft-fg': '#718096',                 // the same files: secondary labels
    'field-label-fg': '#808080',                // CSS named grey: read-only field labels
    'hint-fg': '#888888',                       // manual mailer translation hint
    // register.vue native radios, :checked state
    'radio-checked-border': '#333333',          // border
    'radio-checked-fill': '#808080',            // fill
    // Neutral backgrounds
    'panel-cool': '#F0F0F5',                    // PreviewSubmitStep secondary button, summary items
    'panel-preview': '#F4F5F7',                 // layout and preview canvases
    'panel-soft': '#F8F8F8',                    // stats display, disabled poster block
    'panel-cool-soft': '#F8F9FC',               // section items, container gradient start
    'panel-review': '#F9F9F9',                  // exit / goal form review sections
    'panel-optional': '#FAFBFC',                // ProjectForm optional section
    'quiet-fill': '#E0E0E0',                    // wireframe bars; grey-lighten-2 button
    'quiet-fill-soft': '#E8E8E8',               // number badges, step indicator, avatar preview
    'quiet-fill-cool': '#E8E8EE',               // secondary button hover; filled-slot border
    // Pale tinted backgrounds
    'tint-caution': '#FFEDD5',                  // orange-100 (bg) banners
    'tint-success-strong': '#DCFCE7',           // green-100 (bg) banner; panel icon gradient stop
    'tint-success-soft': '#F0FDF4',             // green-50 mandatory rows and hovers
    'tint-error-soft': '#FEF2F2',               // red-50 selected / optional section blocks
    'tint-error-strong': '#FEE2E2',             // red-100 poster block gradient end
    'tint-error-hover': '#FFF5F5',              // ImpactInput icon hover
    'tint-warning-banner': '#FFF3CD',           // editProjectProposal status banner
    'tint-warning-soft': '#FFFBEB',             // amber-50 configurator help
    'tint-info-page': '#EEF1F8',                // PreviewSubmitStep container gradient end
    'tint-info-soft': '#EFF6FF',                // blue-50 privacy notice
    'tint-info-hover': '#F0F4FF',               // optional section hover
    'tint-brand-soft': '#FCE4EC',               // manual mailer selected row, language badge
    // Hued borders
    'banner-caution-border': '#F97316',         // orange-500 (border) banner accent
    'banner-success-border': '#22C55E',         // green-500 (border) banner accent
    'success-soft-border': '#BBF7D0',           // green-200 panel icon, mandatory rows
    'info-soft-border': '#BFDBFE',              // blue-200 privacy notice
    'accent-soft-border': '#C7D2FE',            // indigo-200 summary item hover
    'warning-soft-border': '#FDE68A',           // amber-200 configurator help
    'error-soft-border': '#FECACA',             // red-200 optional / poster blocks
    'status-banner-warning-border': '#FFC107',  // editProjectProposal status banner
    'warning-card-border': '#FFCC80',           // warning cards, proposed banner
    'warning-header-border': '#FFE0B2',         // warning header bottom border
    'alert-accent-border': '#5C6BC0',           // joinProjectDialog v-alert start border
    // Neutral borders
    'btn-outline-hover-border': '#C8C8D0',      // PreviewSubmitStep .btn-outline:hover
    'btn-secondary-hover-border': '#D0D0D8',    // PreviewSubmitStep .btn-secondary:hover
    'slot-empty-border': '#D4D4D8',             // FeaturedProjectsManager empty slot
    'divider-faint': '#F5F5F5',                 // projectProposal tip dividers
    'divider-soft': '#EEEEEE',                  // MailerSendDialog failed-item divider
    // Added by the orchestrator after the Phase 2 review (both recorded in reports/keys-extra.json)
    'native-check-fill': '#FFFFFF',             // unchecked native checkbox/radio fill (forms plugin's white)
    'on-muted': '#FFFFFF',                      // text on flat muted fills: Vuetify's computed value, pinned
    'native-field-fill': '#FFFFFF',             // native text/date/textarea fill on the Basic pages (the white page they sit on)
    'native-input-edge': '#FFFFFF',             // 1px ring on borderless native inputs: white on their white card
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

    // ---- Phase 2 keys (§6.3 palette table and missing-key rule); dark = the role table value
    // Palette keys (§6.3 palette table)
    muted: '#A3A3A3',                           // neutral-400
    'muted-strong': '#B6B6B6',                  // dark medium emphasis on surface
    // Saturated fills behind white text: the same value as light
    'archive-fill': '#757575',                  // same as light
    'archive-fill-strong': '#212121',           // same as light
    'complete-fill': '#16A34A',                 // same as light
    'approve-fill': '#2E7D32',                  // same as light
    'approve-fill-hover': '#1B5E20',            // same as light
    'checklist-frame-fill': '#385F73',          // same as light
    'accent-fill': '#6366F1',                   // same as light
    'btn-save-hover-fill': '#A00B26',           // same as light
    'cta-gradient-end': '#A30D26',              // same as light
    'avatar-gradient-end': '#E85A4F',           // same as light
    'dialog-header-gradient-end': '#FF5252',    // same as light
    // Hued text and icons: Tailwind 300-400 shades, >= 4.5:1 on surface (3:1 for icons)
    'caution-fg': '#FB923C',                    // orange-400
    'proposed-fg': '#FB923C',                   // orange-400
    'consent-fg': '#FBBF24',                    // amber-400
    'notice-info-fg': '#60A5FA',                // blue-400
    'filetype-pdf-fg': '#F87171',               // red-400
    'filetype-doc-fg': '#60A5FA',               // blue-400
    'filetype-sheet-fg': '#4ADE80',             // green-400
    'filetype-slides-fg': '#FB923C',            // orange-400
    'filetype-image-fg': '#D8B4FE',             // purple-300
    'checklist-done-fg': '#86EFAC',             // green-300
    'checklist-todo-fg': '#FCA5A5',             // red-300
    'link-fg': '#60A5FA',                       // blue-400
    'link-hover-fg': '#93C5FD',                 // blue-300
    'link-soft-fg': '#60A5FA',                  // blue-400
    'banner-caution-fg': '#FB923C',             // orange-400
    'banner-success-fg': '#4ADE80',             // green-400
    'required-fg': '#F87171',                   // red-400
    'brand-fg-strong': BRAND_RED_ON_DARK,       // red foreground, as brand-fg
    'complete-fg': '#4ADE80',                   // green-400
    'section-partners-fg': '#34D399',           // emerald-400
    'section-impact-fg': '#FB923C',             // orange-400
    'section-poster-fg': '#A78BFA',             // violet-400
    'hint-info-fg': '#60A5FA',                  // blue-400
    'found-notice-fg': '#60A5FA',               // blue-400
    'status-success-fg': '#4ADE80',             // green-400
    'status-failed-fg': '#F87171',              // red-400
    'validation-error-fg': '#F87171',           // red-400
    'accent-fg': '#818CF8',                     // indigo-400
    'accent-hover-fg': '#818CF8',               // indigo-400
    'alert-accent-fg': '#818CF8',               // indigo-400
    'status-banner-warning-fg': '#FACC15',      // yellow-400
    'proposed-banner-fg': '#FB923C',            // orange-400
    // Neutral text: Tailwind neutral 300-400
    'tip-fg': '#D4D4D4',                        // neutral-300
    'label-strong-fg': '#D4D4D4',               // neutral-300
    'label-soft-fg': '#A3A3A3',                 // neutral-400
    'field-label-fg': '#A3A3A3',                // neutral-400
    'hint-fg': '#A3A3A3',                       // neutral-400
    // register.vue native radios, :checked state (non-text UI, 3:1)
    'radio-checked-border': '#D4D4D4',          // neutral-300
    'radio-checked-fill': '#A3A3A3',            // neutral-400
    // Neutral backgrounds: near-white -> neutral-800, light grey -> neutral-700
    'panel-cool': '#262626',                    // neutral-800
    'panel-preview': '#262626',                 // neutral-800
    'panel-soft': '#262626',                    // neutral-800
    'panel-cool-soft': '#262626',               // neutral-800
    'panel-review': '#262626',                  // neutral-800
    'panel-optional': '#262626',                // neutral-800
    'quiet-fill': '#404040',                    // neutral-700
    'quiet-fill-soft': '#404040',               // neutral-700
    'quiet-fill-cool': '#404040',               // neutral-700
    // Pale tinted backgrounds: 12% of the hue over surface, pre-composited
    'tint-caution': '#322217',                  // 12% orange-500
    'tint-success-strong': '#182C20',           // as tint-success
    'tint-success-soft': '#182C20',             // as tint-success
    'tint-error-soft': '#311C1C',               // as tint-error
    'tint-error-strong': '#311C1C',             // as tint-error
    'tint-error-hover': '#311C1C',              // as tint-error
    'tint-warning-banner': '#322716',           // as tint-warning
    'tint-warning-soft': '#322716',             // as tint-warning
    'tint-info-page': '#1B2432',                // 12% info
    'tint-info-soft': '#1B2432',                // 12% info
    'tint-info-hover': '#1B2432',               // 12% info
    'tint-brand-soft': '#311D27',               // 12% pink-500
    // Hued borders: that hue's Tailwind 800
    'banner-caution-border': '#9A3412',         // orange-800
    'banner-success-border': '#166534',         // green-800
    'success-soft-border': '#166534',           // green-800
    'info-soft-border': '#1E40AF',              // blue-800
    'accent-soft-border': '#3730A3',            // indigo-800
    'warning-soft-border': '#92400E',           // amber-800
    'error-soft-border': '#991B1B',             // red-800
    'status-banner-warning-border': '#92400E',  // amber-800
    'warning-card-border': '#9A3412',           // orange-800
    'warning-header-border': '#9A3412',         // orange-800
    'alert-accent-border': '#3730A3',           // indigo-800
    // Neutral borders: neutral-700
    'btn-outline-hover-border': '#404040',      // neutral-700
    'btn-secondary-hover-border': '#404040',    // neutral-700
    'slot-empty-border': '#404040',             // neutral-700
    'divider-faint': '#404040',                 // neutral-700
    'divider-soft': '#404040',                  // neutral-700
    // Added by the orchestrator after the Phase 2 review (both recorded in reports/keys-extra.json)
    'native-check-fill': '#737373',             // neutral-500: 3.78:1 on surface, 4.18:1 on background (non-text 3:1)
    'on-muted': '#000000',                      // black on #A3A3A3 is 8.33:1 (white was 2.52:1)
    'native-field-fill': '#262626',             // native text/date/textarea fill on the Basic pages (neutral near-white row)
    'native-input-edge': '#737373',             // 1px ring on borderless native inputs (register, sendNewCode): 3:1 non-text
  },
};

export const themes = { light, dark };
