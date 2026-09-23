# Dark Mode Plan — DataPlatformUI

**Date:** 2026-09-23 (feasibility audit 2026-09-18; pre-flight review 2026-09-23)
**Baseline:** `true_main` @ `43c07af`. Implementation branch: `feature/dark-mode`.
**Status:** Pre-flight reviewed. **All decisions are settled (§9).** Ready for an unattended
implementation run that follows Appendix A (rules for the run) and Appendix B (gates).
**Scope:** Frontend only. No backend or NGINX changes.
**Dark palette source:** CHW Stories. Repo root
`C:\Users\periksson.AUTOSOL\Documents\Engaged Data\New_CHW_App`, frontend in
`CHWStories/frontend` (§5).

> **Implementation session: read in this order.** §9 (decisions) → Appendix A (rules for the
> run) → §5 (what to port) → §6.3 (replacement rules) → §7 (forced light) → §8 (phases) →
> Appendix B (gates). Line numbers are at `43c07af`; find code by its content, because
> earlier edits shift lines.

---

## 1. Summary

- **Dark mode is feasible.**
  - Vuetify's theme system has never been configured: `src/main.js:45-55` calls
    `createVuetify` with no `theme`.
  - CHW uses the same stack, so its **dark palette** and its **theme-switching code** carry
    over.
  - CHW's light theme does **not** carry over. DP keeps its own light look (§5.2).
- **Roughly half the UI flips automatically:** every Vuetify component that uses default
  colors.
- **The other half is hard-coded color:**
  - 1,790 hex values in 97 live files;
  - 330 `color="#c8102e"` props in 50 files;
  - about 300 `rgb()`/`rgba()` literals, plus named colors and Tailwind hue classes (§4).
- **The sweep is repetitive rather than bespoke.**
  - About 15 values account for most of it.
  - Three copy-pasted layout groups are truly shared (§6.2).
  - Text and border greys map onto Vuetify's built-in emphasis levels.
- **Find-and-replace by value alone breaks things.** Every replacement is keyed on the
  (CSS property, value) pair (§6.3).
- **It can't ship half-finished.** A release constant keeps the toggle out of production
  builds until per-role QA passes. First visits are light and dark is opt-in, so nobody sees
  dark mode before then (§7).
- **Effort:** an unattended implementation run, then 2–3 days of human per-role QA (§10b).

---

## 2. How this was measured

- **Feasibility audit (2026-09-18).**
  - All 166 `.vue` files under `src/` were read in full.
  - Reachability was traced from `main.js` through `router/index.js`, `App.vue` and every
    import: 128 live files, 38 dead.
  - Claims were checked against the source and `node_modules` (Vuetify 3.9.0, vue3-toastify
    0.2.8).
- **Pre-flight review (2026-09-23).** 17 read-only agents re-checked the plan, and every
  finding rated medium or higher went to a second agent that tried to disprove it.
  - The counts reproduced exactly.
  - The dead-file list was confirmed with an AST import walk.
  - Vuetify's theme mechanics were confirmed in its source, both 3.9.0 (DP) and 3.12.6
    (CHW).
  - CHW's shipped code and its git history were read.
- Counts are taken at `43c07af` over the 128 routed files, excluding §6.5's dead list, unless
  marked otherwise.
  - They **include** the 8 prototypes that Phase 0 deletes, so after Phase 0 expect somewhat
    fewer. For example: hex 1,443 in 89 files, `color="primary"` 23 in 9, `rgba(200,16,46,a)`
    57 in 24, white backgrounds 58 in 32, `#c8102e` 449.
  - Counts are descriptive; no gate depends on them.

---

## 3. What flips automatically

With a Vuetify dark theme active:

- **Page background and default text color.** `v-app` paints them and `v-main` shows
  through.
- **Default-colored Vuetify components:** `v-card`, `v-sheet`, `v-list`, `v-table` /
  `v-data-table`, `v-expansion-panels`, `v-tabs`, `v-stepper`, `v-dialog`, `v-menu`,
  `v-tooltip`, `v-snackbar`. Teleported Vuetify overlays carry the theme class too.
- **Vuetify form fields.** `src/index.css:89-125` already forces the underlying native inputs
  transparent.
- **Props and classes that name a theme color:** `color="error|primary|success|warning"`,
  `text-medium-emphasis` (172 live uses), `text-disabled`.
- **MDI icons** (they use `currentColor`), native date pickers, native `<select>` popups, and
  default scrollbars. Vuetify writes `color-scheme: dark` on `:root` while dark.
  - Exception: 6 files style `::-webkit-scrollbar` with light tracks. Those don't flip (§4).
- **Native checkboxes and radios do not flip.** `@tailwindcss/forms` runs in base mode and
  paints them white (§4).

Vuetify facts the port relies on (installed **3.9.0**; `package.json` says `^3.7.2`):

- **`:root` carries the active theme's variables.**
  - It gets every `--v-theme-*` color and every theme variable (`--v-border-color`, the
    emphasis opacities, …) for the active theme.
  - Each `.v-theme--<name>` class carries its theme's full set. See
    `node_modules/vuetify/lib/composables/theme.js:227-254`.
- **The theme stylesheet is injected during `app.use(vuetify)`** (`main.js:85`), before the
  awaited `initializeStore()`. The variables therefore exist while the app waits on the
  network.
- **Theme API.**
  - `theme.change()`, `theme.toggle()`, `theme.cycle()` and `defaultTheme: 'system'` exist.
    `change('system')` is rejected in 3.9.
  - Assigning `theme.global.name.value` still works, but logs a deprecation warning in dev.

---

## 4. What doesn't flip

| Category | Size (live) | Fix |
|---|---|---|
| Hex values in `<style>` blocks, templates and scripts | 1,790 in 97 files | §6.3 rules |
| `color="#c8102e"` props | 330 in 50 files | By effective variant → `primary` (fill) or `brand-fg` (foreground) (§6.3) |
| Other brand-red forms | about 30 `:color` ternaries (15 files), 4 helper functions, 1 `text-color`, 5 inline styles plus the App.vue gradient, 8 alpha-suffixed `#c8102eXX`, 61 `rgba(200,16,46,a)` (25 files) | §6.3 |
| `color="primary"` | 33 in 11 files | Same fill/foreground rule (§6.3) |
| `color="#666"` / `"#999"` / `"#ccc"` props | 108 in 34 files (97 `v-icon`, 11 text/outlined `v-btn`) | Emphasis classes |
| Vuetify named greys and palette names | 171 uses in 29 core files, including 14 `grey-darken-4` ternary branches and 3 static `grey-darken-4` props (near-black on dark), and `bg-color="grey-lighten-4"` (`inviteMembersDialog.vue:53`) | Palette mapping rows (§6.3) |
| Named colors | `text-black` (the studentExpReg dialog and pane titles; Basic-page validation spans), `color="black"` radios (`updateUserData.vue:61-62`), `bg-white` + `text-red-700` buttons (Basic pages), `darkred` (`studentEntryFormUpdate.vue:1354`) | §6.3 |
| Tailwind gray classes | `border-gray-300` 57, `divide-gray-300` 5, `bg-gray-50` 5, `text-gray-500` 9, `text-gray-700` 32, plus preflight's default border color | `tw-gray-*` keys through `tailwind.config.js` (§6.3) |
| Tailwind hue classes | 14 files: `text-red-700` dashboard and error headings, `text-green-800` / `text-red-800` (studentChecklist), `bg-orange-100` / `bg-green-100` banners (`sendNewCode`), `text-indigo-600` (Basic pages) | Per file (§6.3) |
| `rgb()` / `rgba()` literals | 297 in 65 files; 52 of the 61 near-white ones sit in stay-light or prototype files | Per file; shadows may stay |
| Inline `style="color / background …"` | about 188 | Per file |
| Colors set in `<script>` | about 119 (status maps, helper functions) | Per file. **Never** the student project colors (§6.3) |
| Pinned theme variables | `.styled-error-text` in `entryFormGradProf.vue:391` and `studentEntryFormUpdate.vue:1358`: unscoped blocks that copy about 60 `--v-theme-*` values as RGB triplets, which a hex search can't find | Delete; use `text-error` (§8 Phase 2) |
| Cross-file global classes | `studentDashboard.vue:96-119` (unscoped): `.light-green-bg` `#e6f7e9` and `.light-red-bg` `#ffe6e6` (used only by studentChecklist); `.light-grey-bg` and `.unclickable` are unused | Move to studentChecklist's scoped style, map to keys, delete the unused rest (§8 Phase 2) |
| Custom scrollbars | 6 files: `joinProjectDialog.vue:1048`, `instructorAddExperienceInstance.vue:1142-1160`, `instructorSpecificExperienceInstance.vue:848-885`, the three `DevManualMailer*Forms.vue` | Transparent track; thumb `rgba(var(--v-theme-on-surface), .3)` (`.5` on hover) |
| Native checkboxes and radios | `eventForm.vue` and `eventDetails.vue` (4 checkboxes each): white boxes from `@tailwindcss/forms`. `register.vue`'s 2 radios are painted by the file's own scoped rules (`register.vue:290-307`, specificity (0,2,1): white fill, black border; `#333` border and `gray` fill when checked) | One `index.css` rule for the checkboxes (§8 Phase 2). Convert register's radios in the per-file sweep (§6.3). |
| vue-multiselect | `defaultPages/updateClient.vue` (Basic role): white widget | About 10 lines under `.v-theme--dark .multiselect…` (§8 Phase 2) |
| Student tag chips | `TagsInput.vue:51-55`: the tonal chip uses the student's color as text; the default Indigo `#4338ca` is 2.1:1 on `#171717` | `:variant="isDark ? 'flat' : 'tonal'"` |
| User-uploaded images | `ClowderFileSelector.vue` `.image-preview` sits on a `#fafafa` panel; transparent PNGs vanish on dark | Fixed `background: #fafafa` (today's light look; allowlisted literal) |
| Toasts | 193 call sites in 62 files: 179 with the pastel classes, 14 with the library's white default | **No change** (§5.3) |
| CKEditor | Live mailer only | **No change**: stays light (§5.3, §6.1) |

---

## 5. Porting from CHW Stories

### 5.1 What CHW actually ships

- **Where to read CHW.**
  - Source of truth: CHW `main` in the working tree at `New_CHW_App` (commit `550830c`,
    clean). Read it only; never edit it.
  - Ignore CHW's `feature/dark-mode` branch, which is 42 commits behind.
  - Ignore the stale DP clone at `New_CHW_App/DataPlatformUI`; never open it.
  - `CHW_Stories_Dark_Mode_context.md` in this repo root is superseded by this section and
    has errors; don't use it.
- **Theme definition** (`CHWStories/frontend/src/main.ts:63-106`,
  `createVuetify({ theme: { defaultTheme, themes: { light, dark } } })`).
  - Dark: background `#0A0A0A`, surface `#171717`, surface-variant `#262626`,
    on-background / on-surface `#FAFAFA`, error `#EF4444`, warning `#F59E0B`, info
    `#3B82F6`, success `#22C55E`, primary `#c8102e`. (`brand.primaryColor` is `#c8102e` in
    both themes; CHW "does not invent a dark brand color".)
  - Light, explicit: background `#F8F9FA`, on-background / on-surface `#212121`,
    surface-variant `#FAFAFA`, primary `#c8102e`. **DP does not take the light block**
    (§5.2).
- **Initial theme.**
  - `src/theme/initialTheme.ts`: `resolveInitialTheme()` reads `localStorage['app-theme']`,
    else the OS preference.
  - `attachOsListener()` runs after mount and follows the OS only while no key is stored.
- **Toggle.**
  - `src/composables/useColorScheme.ts` exposes `isDark`, `currentTheme` and `toggle()`;
    `toggle()` writes localStorage.
  - It assigns `theme.global.name.value`, which is deprecated in Vuetify 3.9 and later. DP
    uses `theme.change()`.
- **App bar** (`src/components/layout/AppBar.vue`) **and sidebar**
  (`src/components/layout/AppSidebar.vue`).
  - The red gradient stays in both themes. An automated switch to `bg-surface` was reverted
    by the owner.
  - The gradient's grey stop is `#efecec` in light and `#262626` in dark.
  - The sun/moon toggle is forced white. The mobile hamburger is
    `isDark ? 'white' : '#262626'`.
  - The sidebar is `#c8102e` with white text in both themes.
- **Tailwind.** `darkMode: ['selector', '.v-theme--dark']`. The whole app has exactly one
  `dark:` class.
- **`src/index.css`.**
  - The dark toast rules `.v-theme--dark .Toastify__toast--*` (lines 73-119) **never
    match**.
    - vue3-toastify appends its container to `<body>`, and Vuetify (3.9 or 3.12) never puts
      a theme class on `<html>` or `<body>`.
    - CHW users therefore see the pastel light toasts in dark, which are legible (about
      7:1).
    - If the rules did match, the toasts would be see-through: their background is 16%
      alpha.
  - The `.v-tooltip` inverse-surface rule (121-145) and the autofill block (147-222) are
    **global**, applied in both themes.
    - The tooltip rule exists only because CHW repurposed `surface-variant` as a panel
      fill.
- **No flash protection.** CHW has no pre-paint code, and it installs Vuetify after its
  network `await`.
- **CHW's QA lesson** (`New_CHW_App/NOTES_dark-mode.md`).
  - Its automated loop passed every gate and still shipped:
    - unreadable tooltips;
    - an invisible login switch track;
    - faded light-mode borders;
    - dead toast CSS;
    - an app-bar change the owner reverted.
  - Visual and contrast judgment needs a human pass. Structural gates must be written as
    must-NOT checks (Appendix B).
- **CHW's conventions don't apply to DP where they conflict.** DP's §6.3 and §7 win over
  CHW's plan §3.1, §6 and §7:

  | Topic | CHW | DP |
  |---|---|---|
  | Panels and borders | Mapped to `surface-variant` | `panel` keys and `--v-border-color` |
  | Dark overrides | Prefers `dark:` pairs and `.v-theme--dark`-scoped CSS | Variables only; both CHW forms leak into forced-light regions |
  | Brand red | Mapped to `color="primary"` everywhere | `brand-fg` for foreground uses |
  | `theme=` props | Banned | Needs `v-theme-provider` for the stay-light regions |

### 5.2 What DP takes, exactly

**1. Theme module: `src/theme/themes.js`.**

- A plain module that `main.js` consumes, so Node gates can import it.
  - It may use only relative `.js` imports: no Vue, no CSS, and no `window` or `localStorage`
    at top level.
  - The same applies to `initialTheme.js`, which reads storage only inside its functions.
- At the top, two named constants:
  - `BRAND_RED = '#c8102e'`: fills, in both themes.
  - `BRAND_RED_ON_DARK = '#FF6B7F'`: the lighter red for red **text and icons** in dark
    only. Its comment says this is the one value to change to retune that shade.
- **`themes.dark.colors`:**
  - CHW's dark palette **without** `surface-variant`: `background '#0A0A0A'`,
    `surface '#171717'`, `'on-background' '#FAFAFA'`, `'on-surface' '#FAFAFA'`,
    `error '#EF4444'`, `warning '#F59E0B'`, `info '#3B82F6'`, `success '#22C55E'`.
  - `primary: BRAND_RED`, `'primary-darken-1': '#a00d24'`.
  - The app keys from §6.3, including `'brand-fg': BRAND_RED_ON_DARK`.
- **`themes.light.colors`:** only `primary: BRAND_RED`, `'primary-darken-1': '#a00d24'` and
  the app keys, including `'brand-fg': BRAND_RED`.
  - Everything else stays at Vuetify 3.9's defaults: white background and surface, auto
    `#000` on-colors, emphasis `.87` / `.60` / `.38`. That keeps §6.3's "identical" results.
  - For comparison, CHW's light block would make body text `#3e3e3e`, turn medium-emphasis
    text into `#7a7a7a` (4.29:1 on white, below AA) and repaint every page `#F8F9FA`.
- **Never set `surface-variant` or `on-surface-variant`** in either theme.
  - Vuetify paints tooltips, stepper avatars (the student entry/goal/exit form steppers),
    switch tracks, slider tracks, flat chips, badges and snackbars with that pair.
  - CHW's values without an `on-` pair give 1.11:1 in light and 1.39:1 in dark.
  - Vuetify's defaults are a matched inverse pair (dark: `#c8c8c8` with `#000` text).
- Keep `on-background` equal to `on-surface` in both themes. The emphasis classes read
  on-background, while the §6.3 CSS replacements read on-surface.
- **`src/main.js`.**
  - `createVuetify({ …, theme: { defaultTheme: resolveInitialTheme(), themes } })`.
  - Keep `app.use(vuetify)` **before** `await userStore.initializeStore()`. Don't mirror
    CHW's plugin order.
  - No top-level `await`: Vite's default es2020 target fails the build. Keep `initApp()`.

**2. Theme policy: `src/theme/initialTheme.js`** (a JS port of CHW's `initialTheme.ts`).

- `STORAGE_KEY = 'dp-theme'`. DP and CHW both run on `eds.uh.edu` and share localStorage;
  CHW uses `'app-theme'`.
- `FOLLOW_OS_WHEN_UNSET = false`: first visits are light, and the OS preference is ignored
  until this constant flips.
- `DARK_MODE_RELEASED = false`: the release gate (§7).
- `resolveInitialTheme()`: a stored `'light'` or `'dark'` wins. Otherwise
  `FOLLOW_OS_WHEN_UNSET ? osTheme : 'light'`.
- `attachOsListener(apply)`: a no-op unless `FOLLOW_OS_WHEN_UNSET` is true. It is wired in
  `initApp()` after `app.mount()`, with `apply = (t) => vuetify.theme.change(t)`.

**3. Toggle composable: `src/composables/useColorScheme.js`** (a JS port).

- `isDark` and `currentTheme` read `theme.global.name.value`; reading it is fine.
- `toggle()`:
  - calls `theme.change(next)`, never an assignment;
  - writes `localStorage[STORAGE_KEY]` inside `try/catch`;
  - removes the pre-paint class if it is still present.

**4. `tailwind.config.js`: the `darkMode` line.**

- Add only `darkMode: ['selector', '.v-theme--dark']`. It changes nothing today: DP has zero
  `dark:` classes.
- Don't take CHW's `forms({ strategy: 'class' })`: it strips base styles that DP's native
  inputs rely on.
- Don't take CHW's Tailwind `primary` color: it collides with Vuetify's `.text-primary` and
  `.bg-primary`.

**5. The autofill rules.** Take `CHWStories/frontend/src/index.css:194-222` into DP's
`src/index.css`.

- Prefix each selector with `.v-theme--dark ` so light mode stays byte-identical.
- Keep each pseudo-class family in its own rule, as CHW does. One unknown pseudo-class
  invalidates a whole selector list.

**6. Not ported:**

- CHW's light block and `surface-variant` values;
- the `.v-tooltip` rule;
- the toast block (`index.css:73-119`) and CHW's mobile toast-container rules;
- CHW's `main.ts` plugin order;
- any `theme.global.name.value =` assignment.

### 5.3 DP-specific decisions

**1. `primary` is UH red in both themes.**

- The 33 `color="primary"` uses in 11 files, 8 of them on FeaturedShowcase, go from blue to
  red in light mode. This is accepted.
- `primary-darken-1` = `#a00d24`, DP's existing red hover shade. White on it is 8.15:1. It
  also fixes `text-primary-darken-1` at `joinProjectDialog.vue:460`, which would otherwise
  stay Vuetify's default blue.
- Vuetify 3.9 has no component whose color defaults to `primary`, so only explicit uses
  change.

**2. Brand red has two roles.**

- **Fill** (a background behind white text) → `primary`: `#c8102e` in both themes. White on
  it is 5.88:1.
- **Foreground** → `brand-fg`: `BRAND_RED` in light, `BRAND_RED_ON_DARK` (`#FF6B7F`) in
  dark. Foreground means red text, icons, progress indicators, tonal/outlined/text/plain
  variants, tab sliders, switches, checkboxes and radios.
- Why the lighter red:

  | Background | `#c8102e` | `#FF6B7F` |
  |---|---|---|
  | `#0A0A0A` | 3.37 | 7.22 |
  | `#171717` | 3.05 | 6.54 |
  | `#262626` | 2.57 | 5.52 |

  Text needs 4.5:1 and icons 3:1.
- Every foreground red goes through `brand-fg` (`text-brand-fg`, `color="brand-fg"`,
  `rgb(var(--v-theme-brand-fg))`), so the dark shade lives only in `BRAND_RED_ON_DARK`.
  Gate P9 (Appendix B) enforces this.
- This departs deliberately from CHW, which keeps `#c8102e` for red text in dark.

**3. Content outside the app root.**

- **Toasts: no change.** Keep today's pastel classes in both themes; that is what CHW users
  actually see, and it is legible.
  - Don't port CHW's toast block.
  - Don't use vue3-toastify's `theme: 'auto' | 'dark'`: it reads the OS, not Vuetify.
  - Don't use `updateGlobalOptions()`: it drops DP's `style` option.
  - A real dark toast design (opaque theme keys, restyled close button) is a later change,
    shared with CHW.
- **CKEditor: no change.** The editor, its inline dropdowns and its body-level UI all stay
  on CKEditor's default light palette. The body-level UI means the link balloon, tooltips,
  the Insert-media dialog and the Alt+0 help dialog.
  - Don't add a `--ck-color-*` block. A `:root` block loses to CKEditor's own `:root` block
    and can't follow a forced-light region.
  - The editor card gets a light `v-theme-provider` (§6.1), because the editable area
    inherits its text color.
- **Teleports: there are 3.**
  - `ZoomModal.vue:9`: self-colored; don't sweep it.
  - `ProjectPreview.vue:86`, the fullscreen view: a light provider goes inside the Teleport
    (§7).
  - `dev/indProjectPage1-2.vue:174`: deleted with the prototypes.

**4. Preference storage.**

- `localStorage['dp-theme']`, standalone. It is not in the `loggedInUser` store: `logout()`
  calls `$reset()`, and the preference must work signed-out.
- It survives logout, because nothing calls `localStorage.clear()`.

**5. Toggle and app bar (`App.vue`).**

- **Toggle button.**
  - `<v-btn variant="text" color="white" :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" :aria-label="$t(isDark ? 'Switch to light mode' : 'Switch to dark mode')" @click="toggle">`.
  - Placed **after** the `<h1>` (App.vue ~263), which always sits on red. CHW's position,
    before the title, puts a white icon on the `#efecec` slice on 360–390px phones.
  - Rendered with `v-if="showThemeToggle"` (§7).
    - In App.vue's `<script>`, import `DARK_MODE_RELEASED` from `@/theme/initialTheme`.
    - `setup()` returns `showThemeToggle: DARK_MODE_RELEASED || import.meta.env.DEV`.
    - Never write `import.meta` in the template: Vue's template compiler rejects it.
- **Wiring.** App.vue is Options API with a `setup()` at 409-413; return `isDark` and
  `toggle` from `useColorScheme()` there.
- **i18n.**
  - DP uses flat English-sentence keys with only `src/assets/i18n/es.json`. English renders
    the key itself, and missing-key warnings are silenced (`src/plugins/i18n.js:12-21`).
  - Add `"Switch to dark mode": "Cambiar a modo oscuro"` and
    `"Switch to light mode": "Cambiar a modo claro"` to `es.json`.
  - Don't port CHW's nested keys: they would print raw.
- **Gradient** (App.vue:251).
  - Make it `linear-gradient(250deg, rgb(var(--v-theme-primary)) 70%, rgb(var(--v-theme-appbar-slice)) 50.6%)`,
    with a new key `appbar-slice` (`#EFECEC` light / `#262626` dark).
  - No `isDark` binding is needed.
  - The menu button (253-259) needs no color. It inherits the app bar's
    `rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))` (`VAppBar.css:4-7`):
    black at .87 on `#efecec`, `#FAFAFA` on `#262626`.
- **Drawer** (App.vue:15-246).
  - It stays `#c8102e` with white text in both themes. `color="#c8102e"` becomes
    `color="primary"`.
  - The `<hr>` at App.vue:210 uses Tailwind preflight's default border color. Once §6.3
    remaps that default, give the `<hr>` an explicit `border-color: #e5e7eb` so the drawer
    doesn't change.
  - The `#64B5F6` notification dot sits on red.
  - These chrome literals are allowlisted (Appendix B).
- **App chrome never becomes theme-following:** no `bg-surface` app bar or drawer.
- Optional: hide the toggle on forced-light routes (`/featured`, `/project/:id`).

**6. Pre-paint** (no white flash on reload in dark).

- **Why it can't be inline.** The production CSP is helmet's, in the DataPlatform Express
  backend: `script-src 'self'` without `'unsafe-inline'`, and that backend serves
  `/platform/index.html`.
  - An inline `<script>` in `index.html` is blocked in production, yet passes locally,
    because `npm run dev` and `serve` send no CSP.
  - The CSP in `NGINX_Security_0405.md` is only planned.
- **Script file.**
  - Create `public/theme-init.js`, loaded as a classic `<script src="/theme-init.js"></script>`,
    the first element in `<head>`, with no `type="module"`.
  - Vite rewrites the path to `/platform/theme-init.js`. Confirm that in `build/index.html`.
- **What it does.**
  - It reads `localStorage['dp-theme']` using the same policy as `resolveInitialTheme()`.
    The constants are duplicated with a comment, and G3 checks they match.
  - When the result is dark, it adds the class `dp-prepaint-dark` to `<html>`.
- **Paint rule.** A tiny inline `<style>` in `index.html` paints that class:
  `html.dp-prepaint-dark { background: #0A0A0A; color-scheme: dark; }`. Inline styles are
  allowed: `style-src` includes `'unsafe-inline'`.
- **Never set inline styles on `<html>`.** They would outrank Vuetify's `:root` rules after a
  toggle.
- **Cleanup.** Remove the class in `initApp()` right after `app.mount()`.
- **Network-wait coverage.** Add `html { background-color: rgb(var(--v-theme-background)); }`
  to `src/index.css`. It covers the network wait, since Vuetify's variables exist from
  `app.use(vuetify)` on.

---

## 6. Scope

### 6.1 What to convert and what not to

| Group | Files | Action |
|---|---|---|
| Dead code (not routed, or never rendered) | 38, plus orphans | Delete in Phase 0 (§6.5) |
| Unlinked dev prototypes (`/kpis`, `/public2`–`/public6`, `/publicGallery`, `/publicGallery2`) | 8 | Delete in Phase 0 with their routes, `publicPaths` entries and 7 assets (§6.5) |
| Legacy Basic-role pages (`components/defaultPages/*`) | 8 | Convert (see below) |
| Permanent stay-light regions | see below | Forced-light providers (§7) |
| Core live app | about 97 | The sweep |

The Basic-role pages are mostly covered by the Tailwind gray remap. What remains after it
follows the §6.3 Basic-page rows:

- about 22 `text-red-700` (text only);
- `bg-red-700` fills;
- the 4 `border bg-white text-red-700` buttons, which have their own exception;
- the indigo focus and checkbox classes;
- 2 orange/green banners;
- `text-black` validation spans;
- vue-multiselect.

**Permanent stay-light regions:**

- **Route level (`meta.forceLight`).**
  - `/project/:projectId` (name `publicProjectView`). It is a poster-style design with
    student-picked colors.
  - `/featured`.
  - `/publicProjects`. It is linked from `/featured` (`FeaturedShowcase.vue:791`) and
    reachable only when signed out.
- **Component level**, where a route flag can't reach because the surrounding page goes
  dark:
  - `ProjectTemplate` in the student editor preview, inside `/projectEditor`,
    `/projectEditor/:projectId` and `/dev/projectPreview`:
    - `ProjectPreview.vue:77-82`;
    - inside the fullscreen Teleport, around the whole `.fullscreen-overlay` div
      (`ProjectPreview.vue:87-117`);
    - `PreviewSubmitStep.vue:29`.
  - The mailer's email editor card(s) and email preview in
    `dev/instructorMailer/DevManualMailer{Entry,Goal,Exit}Forms.vue` (`.email-editor-card`,
    `.email-preview*`). Emails arrive on white.
- **`ZoomModal.vue`:** self-colored, with explicit colors and white behind posters. Leave it
  unchanged.
- **Keep `/dev/projectPreview`.** It is the only way to test the editor without a backend
  (Appendix B G7).
- **Convert, don't force light:** `FeaturedProjectsManager.vue` (route
  `instructorFeaturedProjects`), `ProjectEditorPage` and `ProjectEditorMain`. They paint a
  full-page `#f5f5f5` with uncolored text, and they are core pages.

### 6.2 Copy-pasted layouts: extract before the sweep

Paths are under `src/components/`.

| Layout | Files | What's actually shared |
|---|---|---|
| Manual-mailer form | `dev/instructorMailer/DevManualMailer{Entry,Goal,Exit}Forms.vue` | A **byte-identical** 414-line `<style scoped>` block (Entry 882-1295, Goal and Exit 954-1367; same md5), 43 hex and 2 `white` each. Keep `.editor-wrapper*`, `.email-editor-card` and `.email-preview*` light. |
| Instructor add/edit form | `instructorSide/instructorAddData/instructorAdd{Activity,Experience,Session,ExperienceInstance}.vue`, `instructorSide/instructorDataSpecifics/instructorSpecific{Activity,Experience,Session,ExperienceInstance}.vue` | `.section-number`, `.section-title`, `.section-subtitle`, `.form-actions`: identical in 8 of 8 files |
| Review page | `instructorSide/projects/editProject.vue`, `instructorSide/projects/viewProjectProposal.vue`, `instructorSide/instructorProgressMonitor/studentGoalFormViewer.vue` | The same form classes. `.sidebar-card` is only in editProject and studentGoalFormViewer; `.form-actions` only in editProject and viewProjectProposal. |
| Student project forms | `studentSide/projects/{editProject,editProjectProposal,projectProposal}.vue` | The same form classes, plus `.submit-btn` / `.got-it-btn`, which are also in both editProject files |
| Instructor list page | `instructorSide/instructorDataManagement/instructor{Activities,Experiences,Sessions}.vue`, `instructorSide/instructorStudentsList.vue` | Only `.toolbar-section`, `.search-menu-trigger:hover`, `.search-chips-container` and `.table-row:hover`. Content and table rules use per-file class names, so convert these 4 files individually. |
| Progress-monitor tab | `instructorSide/instructorProgressMonitor/{pendingStudents,studentsWithoutEntryForms,studentsWithoutExitForms,studentsWithoutGoalForms}.vue` | White content and toolbar, `:deep(th)`; `.footer-toolbar` is in 3 of 4 (missing from pendingStudents) |

**How to share the CSS:**

- Put it in `src/styles/<name>.css` and include it in each consumer with
  `<style scoped src="@/styles/<name>.css"></style>`.
- **Never import it from `main.js` or `index.css`.** These class names are also defined
  elsewhere with different bodies, and a global sheet would leak into those files:

  | Class | Other files defining it |
  |---|---|
  | `.section-title` | 25 |
  | `.page-header` | 19 |
  | `.section-subtitle` | 19 |
  | `.section-number` | 16 |
  | `.form-actions` | 13 |
  | `.submit-btn` | 12 |
  | `.toolbar-section` | 10 |
  | `.table-row` | 10 |

### 6.3 Replacement rules

**Principle.** Light mode stays identical, apart from the accepted changes listed at the end
of this section. Every hard-coded value becomes a theme-aware expression whose light result
equals today's value.

**Rule 0: key every replacement on (CSS property, value), never on the value alone.**

- `color:` values go to the emphasis rows. `background*` values go to the surface and panel
  rows. `border*` and `outline` values go to the border row.
- **White text on a brand-red or other always-dark fill stays white.**
  - There are 61 white-text rules in 26 core files; 39 of them paint the red fill themselves.
    Example: `studentSide/projects/editProject.vue:1334-1336`.
  - In CSS, `color: white` / `#fff` on such a fill becomes
    `color: rgb(var(--v-theme-on-primary))`. Vuetify computes `on-primary` = `#fff` for
    `#c8102e` in both themes, so light mode is identical and the gates pass.
  - Vuetify `color="white"` props on such fills stay literal: icons on red avatars, checkmarks
    on student color swatches, and the white count badge at `inviteMembersDialog.vue:270`.
    These are kept literals (K1 in Appendix B G5).
  - Never map white text to `on-surface` or `surface`. Gate G6 checks that no `color:`
    declaration references `--v-theme-surface`.
- **Deliberately dark surfaces stay literal** (allowlisted):
  - `AvatarCropperDialog.vue:222, :244` (`#1a1a1a` cropper backdrop);
  - `SectionConfigurator.vue:586` (hero gradient).
- **Values with special roles.** Rule 0 does not apply to these; use the replacements given.
  - **`#333` active-swatch rings** (`FindingsInput.vue:294`, `MilestonesInput.vue:490`,
    `PartnersInput.vue:252`, `TagsInput.vue:345`):
    - `border-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))`;
    - `box-shadow: 0 0 0 2px rgb(var(--v-theme-surface)), 0 0 0 4px rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))`.

    The ring becomes `#212121` in light (accepted).
  - **`#e0e0e0` / `#e8e8e8` 2px connector lines** (`projectProposal.vue:879, :956`,
    `ProjectEditorMain.vue:825`) →
    `background-color: rgba(var(--v-border-color), var(--v-border-opacity))`.
  - **`#ccc` / `#999` scrollbar thumbs** → the §4 custom-scrollbar rule.

**Values → replacements:**

| Old value (role) | Live uses | Replace with | Light result |
|---|---|---|---|
| `#666` (text, `color=` props) | 139 in 44 files | `text-medium-emphasis`; in CSS `rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))` | Identical |
| `#1a1a1a`, `#1a1a2e`, `#333` (text) | 43 / 36 / 30 | `text-high-emphasis`; in CSS with `--v-high-emphasis-opacity` | `#212121` (a shade lighter) |
| `#999`, `#ccc` (mostly empty-state icons) | 35 / 45 | `text-disabled`; `--v-disabled-opacity` | `#9e9e9e` |
| `#e0e0e0`, `#e8e8e8`, `#f0f0f0` (borders) | 65 / 88 / 26 | `rgba(var(--v-border-color), var(--v-border-opacity))` | `#e0e0e0`: identical; the others a shade darker |
| `#f8f9fa` (page background) | 20 files, plus `.scroll-area` at `admin/backup/collectionsForm.vue:135` | `rgb(var(--v-theme-page-bg))` | Identical |
| `#fafafa` (panels) | 110 | `rgb(var(--v-theme-panel))` | Identical |
| `#f5f5f5` (fills, full-page backgrounds) | about 29 | `rgb(var(--v-theme-panel-strong))` | Identical |
| `#f5f5f5` (`:hover` states) | 17 | `rgba(var(--v-theme-on-surface), var(--v-hover-opacity))` | Identical (0.04 on white) |
| `white` / `#fff` (backgrounds) | 86 in 39 files | `rgb(var(--v-theme-surface))` | Identical |
| `#fff8e1`, `#ffebee`, `#e8f5e9` (status tints) | 9 / 8 / 3 | `tint-warning` / `tint-error` / `tint-success` | Identical |
| `#e6f7e9`, `#ffe6e6` (studentDashboard globals) | 2 | `tint-success` / `tint-error` | Near-identical (accepted) |
| `#c8102e` | 455 (all kinds of use) | Fill → `primary`; foreground → `brand-fg` (see below) | Identical |
| `#a00d24` (red hover) | 27 in 6 files | `primary-darken-1` | Identical |
| `rgba(200,16,46,a)` | 61 in 25 files | `rgba(var(--v-theme-primary), a)` | Identical |
| `#c8102eXX` (alpha suffix) | 8 | `rgba(var(--v-theme-primary), a)`: `10`/`15`/`20`/`30`/`40`/`50` → `.06`/`.08`/`.13`/`.19`/`.25`/`.31` | Identical |
| `text-custom-red` | 43 in 12 files | `text-brand-fg` | Identical |
| `bg-custom-red text-white` (sign-in buttons) | 8 | `bg-primary`. Give `register.vue:140` a `primary-darken-1` hover, because `hover:bg-red-600` can't beat `.bg-primary !important`. | Identical |
| `slider-color="custom-red"`, `color="custom-red"` (`mainAuthWrap.vue:24, :42`) | 2 | `brand-fg` | Identical |
| `text-red-700` (headings, errors; text only) | about 30 | `text-brand-fg`. Not the 4 Basic-page outline buttons below. | `#b91c1c` → `#c8102e` (accepted) |
| `text-black`, `color="black"` | about 15 | `text-high-emphasis`, or drop the prop | `#000` → `#212121` (accepted) |
| Tailwind grays | see §4 | `tw-gray-*` keys through `tailwind.config.js` | Identical |

Remove the `custom-red` color from `tailwind.config.js` only at the end of Phase 4 (§8).

**Vuetify palette names.** P4/P5 flag every use; create the keys named here in Phase 2.

| Old | Replace with | Light result |
|---|---|---|
| `grey` / `text-grey` (text, icons; `#9E9E9E`) | `text-disabled`, or drop the prop | Identical |
| `grey` or `'#999'` as a chip `color`, a `:color` value or a helper's return value | New key `muted`: `#9E9E9E` light, `#A3A3A3` dark | Identical (`#999` → `#9e9e9e` is accepted) |
| `'#666'` as a `:color` value or a helper's return value. A class can't go in a `color` prop, and Vuetify generates no `text-on-surface` class. | New key `muted-strong`: `#666666` light, `#B6B6B6` dark (the dark medium-emphasis color on `#171717`) | Identical |
| `grey-lighten-1` (`#BDBDBD`, icons) | `text-disabled` | `#9e9e9e` (accepted) |
| `grey-darken-1` / `-2` (text, icons, text-variant buttons) and `text-grey-darken-1` / `-2` | `text-medium-emphasis`; drop the color prop | `#666` (accepted) |
| `grey-darken-1` flat fill behind white text (`instructorSide/projects/editProject.vue:596`) | New key: `#757575` in both themes | Identical |
| `grey-darken-4`: 14 ternary branches, the outlined button (`instructorSide/projects/editProject.vue:336`) and the icon (`studentSide/projects/editProject.vue:628`) | Remove the color | Same look |
| `grey-darken-4` flat Archive button (`studentSide/projects/editProject.vue:642`) | New key: `#212121` in both themes | Identical |
| `grey-darken-4` no-op class (`studentSide/projects/projectsMain.vue:192`) | Delete | Identical |
| `bg-grey-lighten-5` | `bg-panel` | Identical |
| `grey-lighten-4` (class, `bg-color`, card `color`) | `panel-strong` | Identical |
| `grey-lighten-3` / `-2` (avatar fills) | Built-in `surface-light` (`#EEEEEE` light / `#424242` dark) | lighten-3: identical. lighten-2: `#E0E0E0` → `#EEEEEE` (accepted). |
| `green` / `blue` | `success` / `info` | Identical |
| Other hue names: `orange`, `deep-orange(-darken-1)`, `amber-darken-2`, `red(-darken-1)`, `green-darken-2`, `blue-darken-2` / `-3`, `purple(-darken-1)` | One role-named key per distinct value. Light: the exact Material hex. Dark: per the missing-key role table below. | Identical |

**Basic and auth pages (Tailwind classes).**

| Old | Replace with | Light result |
|---|---|---|
| `bg-red-700 text-white` buttons | `bg-primary` | `#b91c1c` → `#c8102e` (accepted) |
| The 4 `border border-red-700 bg-white text-red-700` buttons (`eventDetails.vue:202`, `findClient.vue:65`, `findEvents.vue:53`, `updateClient.vue:380`) | `border bg-surface` only. The `text-red-700` row does **not** apply to them. | Identical. Today they render black text with a grey hairline, because Vuetify's `.bg-white` and `.border` are `!important`. |
| `focus:border-indigo-300` (57) | Delete | Identical: it never renders, because Vuetify's reset leaves native inputs borderless |
| `focus:ring-indigo-200` on text, email, password and date inputs, textareas, selects and the multiselect | Delete | Identical: `index.css:46-68` forces `box-shadow: none` on focus |
| `focus:ring-indigo-200` and `text-indigo-600` on the 8 checkboxes in `eventForm.vue` / `eventDetails.vue` | Keep (P6 exemption) | Identical; legible in both themes |
| Other hue text and borders (the studentChecklist blues; the orange/green banner text and borders) | New keys per the missing-key rule; light = the exact Tailwind value | Identical |

**register.vue radios** (`register.vue:290-307`, scoped):

- `white` → `rgb(var(--v-theme-surface))`;
- `black` → `rgb(var(--v-theme-on-surface))`;
- the `:checked` rule's `#333` border and `gray` fill → two new opaque keys, with light values
  of exactly `#333333` and `#808080` (missing-key rule).

All three are identical in light.

**New theme keys** (both themes; every key is opaque):

| Key | Light | Dark | Notes |
|---|---|---|---|
| `brand-fg` | `#C8102E` | `#FF6B7F` | `BRAND_RED` / `BRAND_RED_ON_DARK` constants |
| `primary` | `#C8102E` | `#C8102E` | Built-in key, changed |
| `primary-darken-1` | `#A00D24` | `#A00D24` | Built-in key, changed |
| `appbar-slice` | `#EFECEC` | `#262626` | The app-bar gradient's grey stop |
| `panel` | `#FAFAFA` | `#262626` | |
| `panel-strong` | `#F5F5F5` | `#262626` | |
| `page-bg` | `#F8F9FA` | `#0A0A0A` | |
| `tint-warning` | `#FFF8E1` | `#322716` | 12% `#F59E0B` over `#171717` |
| `tint-error` | `#FFEBEE` | `#311C1C` | 12% `#EF4444` over `#171717` |
| `tint-success` | `#E8F5E9` | `#182C20` | 12% `#22C55E` over `#171717` |
| `tw-gray-50` | `#F9FAFB` | `#262626` | |
| `tw-gray-200` | `#E5E7EB` | `#404040` | Preflight's default border |
| `tw-gray-300` | `#D1D5DB` | `#525252` | |
| `tw-gray-500` | `#6B7280` | `#A3A3A3` | 7.1:1 on `#171717` |
| `tw-gray-700` | `#374151` | `#D4D4D4` | 12.1:1 on `#171717` |

- The dark values come from CHW's palette or from the Tailwind neutral scale that CHW's
  palette is built on (`#0A0A0A` / `#171717` / `#262626` / `#FAFAFA` are neutral
  950/900/800/50).
- **If a file needs a key this table lacks** (the missing-key rule), add one. Its light value
  is the exact old literal. Its dark value depends on its role:

  | Role | Dark value |
  |---|---|
  | Text or icon | The Tailwind neutral or hue 300–400 shade that clears 4.5:1 on `#171717` (3:1 for icons) |
  | Neutral near-white background (every channel ≥ `F0`) | `#262626` |
  | Neutral light-grey background (a channel below `F0`) | `#404040` |
  | Pale tinted background | 12% of the matching dark status color (or that hue's Tailwind 500) over `#171717`, pre-composited like the `tint-*` keys |
  | Neutral border | `#404040` |
  | Hued border | That hue's Tailwind 800 |
  | Saturated fill behind white text | The same value in both themes |

  - Create shared keys in `themes.js` in Phase 2, before per-file subagents start.
  - Record every new key in `NOTES_dark-mode.md`. Never invent another hex.

**Key rules:**

- **Keys must be opaque.** Vuetify writes a key as `r,g,b` and drops alpha
  (`theme.js:123-125`), so a translucent key renders as a solid fill. Pre-composite tints,
  as in the table.
- **Never name a key after a Tailwind or Material color class** (`gray-300`, `custom-red`,
  `grey-lighten-4`).
  - Each key generates four rules:
    - `.bg-KEY { background-color: … !important; color: rgb(var(--v-theme-on-KEY)) !important }`;
    - `.text-KEY { color: … !important }`;
    - `.border-KEY` (sets `--v-border-color`);
    - `.on-KEY`.
  - These rules are appended last in `<head>`, so a same-named key overrides that
    Tailwind/Material class and forces an on-color. Hence the `tw-` prefix.
- **Tailwind colors that read theme keys use the comma form:**
  `'rgba(var(--v-theme-tw-gray-300), <alpha-value>)'`.
  - Never use `'rgb(var(--v-theme-x) / <alpha-value>)'`. Vuetify's variables are comma
    triplets (`255,255,255`), so that form is invalid at computed-value time and fails
    silently: backgrounds go transparent and text inherits.
  - Use string values: the forms plugin calls `.replace()` on colors, and function values
    throw at build time.
- **Tailwind config:**
  - `theme.extend.colors.gray = { 50: …, 200: …, 300: …, 500: …, 700: … }`, keeping the
    other shades at Tailwind's defaults.
  - `theme.extend.borderColor = { DEFAULT: 'rgb(var(--v-theme-tw-gray-200))' }`, with no
    alpha placeholder.
  - G6 checks that no literal `<alpha-value>` reaches the built CSS.
- **Never declare a custom property that references `--v-theme-*` only on `:root`.** It
  resolves once, at `:root`, and then doesn't follow forced-light regions. Either use
  `rgb(var(--v-theme-…))` directly in each declaration, or declare the alias on
  `:root, .v-theme--light, .v-theme--dark`.
- **No `dark:` classes and no `.v-theme--dark`-scoped CSS** anywhere that can render inside a
  forced-light region. They still match there, because the `v-app` root keeps
  `.v-theme--dark`.
  - Allowed exceptions, since they are never inside forced-light regions: the autofill block
    and the vue-multiselect overrides.

**Red props: classify by effective variant.** This applies to the 330 `color="#c8102e"`
props, the 33 `color="primary"` uses and the other red forms. Determine the variant in this
order:

1. the explicit `variant` attribute;
2. otherwise, the nearest defaulting ancestor: `v-card-actions`, `v-toolbar` and `v-app-bar`
   default to `text`; `v-btn-toggle` and `v-btn-group` pass down their own variant;
3. otherwise, the component default: `v-btn` elevated, `v-chip` tonal, `v-avatar` flat.

Then:

- **Fill → `primary`.**
  - `elevated` or `flat` on `v-btn`, `v-chip` or `v-avatar`.
  - The `color` of `v-toolbar`, `v-app-bar` and `v-navigation-drawer`.
  - `v-date-picker` (7 uses; header and selected day). Accept today's outline.
- **Foreground → `brand-fg`.**
  - The `text`, `outlined`, `tonal` and `plain` variants.
  - `v-icon`, `v-progress-circular` / `-linear`, `v-tabs` / `slider-color`, `v-checkbox`,
    `v-switch`, `v-radio`, `v-slider`, and outlined `v-btn-toggle`.
- **Counts at `43c07af`.**
  - About 256 foreground and about 61 fills.
  - The foreground count includes 13 `v-btn`s with no variant inside `v-card-actions`. They
    render as red text, not fills.
  - None of the 330 props sits on a wrapper component.
- **`inviteMembersDialog.vue:271`.** `text-color="#c8102e"` on a white badge becomes
  `primary`, so it stays `#c8102e`; the badge stays white.
- **`:color` ternaries** (about 30 in 15 files; 7 also bind `:variant` flat/outlined).
  - Convert both branches.
  - `grey-darken-4` → undefined. `'grey'` / `'#999'` → `'muted'`. `'#666'` →
    `'muted-strong'` (see the palette table).
- **Helper functions returning colors:** `getChipColor`, `getStatusColor` (×2) and
  `getFileIconColor` (`ClowderFileSelector.vue:367-371`, which also returns `'#666'` and
  `'#2563eb'`).
- **Search patterns.**
  - Use the bounded regex `#c8102e(?![0-9a-fA-F])`, and handle `#c8102eXX` separately.
  - A substring replace yields CSS like `rgb(var(--v-theme-primary))20`, which silently
    fails to apply.
  - All tracked text files are CRLF in the working tree (`core.autocrlf=true`; blobs are LF).
    Match `\r?\n`.

**Never touch: these are data, not styling.**

- **`src/components/studentSide/projectView/types/projectTypes.js`.** Its student color
  presets are copied into project records and used as data:
  - compared by string equality (`TagsInput.vue:84`, and in the Findings, Milestones and
    Partners inputs);
  - parsed as hex (`TagsCard.vue:62-66`, `FindingsCard.vue:161-167`, `TimelineCard.vue:87`);
  - validated by `/^#[0-9A-Fa-f]{6}$/` (`projectTypes.js:831, 850, 869, 885`).

  A rewritten preset fails validation and blocks project submission.
- **The ProjectTemplate cards' color logic** (FindingsCard, TagsCard, TimelineCard,
  PartnersCard). They are stay-light anyway.
- **Hex placeholders:** `placeholder="#000000"` at `TagsInput.vue:101`,
  `FindingsInput.vue:117`, `MilestonesInput.vue:103` and `PartnersInput.vue:99`.
- **Where colors may change.** Replace colors only inside CSS declarations and Vuetify color
  props or classes. Never inside JS data objects, regexes or placeholders.

**Accepted light-mode changes.** This is the complete list. Everything else must look the
same, and G7 derives its expected differences from this list.

- **`primary`** goes from blue to red: `#1867C0` → `#c8102e` (33 uses). `primary-darken-1`:
  `#1F5592` → `#a00d24`.
- **Dark text** `#1a1a1a` / `#1a1a2e` / `#333` → `#212121`; so do the `#333` swatch rings and
  `text-black` / `color="black"` (`#000`).
- **Borders and lines** `#e8e8e8` / `#f0f0f0` / `#ddd` / `#ccc` → `#e0e0e0`, including the
  `#e8e8e8` connector line.
- **Light grey text and icons** `#999` / `#ccc` / `grey-lighten-1` `#BDBDBD` → `#9e9e9e`.
- **`grey-darken-1` / `-2`** (`#757575` / `#616161`) text and icons → `#666`.
- **`grey-lighten-2` avatar fills** `#E0E0E0` → `#EEEEEE`.
- **Reds:**
  - `text-red-700` and `bg-red-700` `#b91c1c` → `#c8102e`;
  - the `color="red darken-2"` dialog buttons `#F44336` → `#c8102e` (§8 Phase 4);
  - `darkred` error text → `#B00020`;
  - register.vue's sign-in hover `#dc2626` → `#a00d24`.
- **studentDashboard pastels** `#e6f7e9` / `#ffe6e6` → `#e8f5e9` / `#ffebee`.
- **Custom scrollbars** in the 6 files: the `#f1f1f1` / `#f5f5f5` track becomes transparent,
  and the `#ccc` / `#888` thumb becomes on-surface at .3 (.5 on hover).
- **The 4 `.styled-error-text` messages** take `text-caption`'s font size and line height.

**Resolved spike.**

- Keys named after Vuetify's color pack do override it: the theme stylesheet is appended
  last in `<head>` with the same specificity and `!important`.
- There is no `@layer` anywhere. The semantic replacements above avoid the question anyway.

### 6.4 Biggest single files

All are moderate: 30–45 minutes each for a human. Paths are under `src/components/`.

- `studentSide/projectView/SectionConfigurator.vue`: a hand-drawn layout wireframe. Keep its
  hero gradient.
- `instructorSide/projects/editProject.vue`.
- `studentSide/projectView/PreviewSubmitStep.vue`: no Vuetify components, and hand-rolled
  buttons with light hover states.
- `studentSide/studentDash/studentChecklist.vue`. Handle it **together with**
  `studentSide/studentDash/studentDashboard.vue:96-119`:
  - the pastel fills are global classes in the dashboard's unscoped block, and
    studentChecklist's own `<style>` is empty. §8 Phase 2 moves them into studentChecklist's
    scoped style;
  - line 141's `class="'text-green-800'"` is broken (§11).
- `dev/instructorMailer/DevManualMailerEntryForms.vue`, plus its two twins (§6.2).
- `studentSide/studentDash/studentExpReg.vue`: `text-black` dialog and pane titles,
  `color="secondary"`, the Vuetify 2 `dark` prop.
- `studentSide/projects/editProject.vue`.
- `instructorSide/instructorAddData/instructorAddExperienceInstance.vue`.
- `instructorSide/featuredProjects/FeaturedProjectsManager.vue`: a full-page `#f5f5f5` with
  an uncolored `<h1>`.
- `studentSide/projectView/ProjectEditorMain.vue` and `ProjectEditorPage.vue`: full-page
  `#f5f5f5`.

### 6.5 Dead files and cleanup (Phase 0)

Paths are under `src/components/`. All 38 files were confirmed unreachable by an AST import
walk. Deleting them is build-safe **only if the barrel lines below go in the same commit.**

- **Monoliths replaced by folders:** `studentSide/exitForm.vue`,
  `studentSide/studentEntryForm.vue`, `studentSide/goalSettingForm.vue`,
  `studentSide/exitFormsAvailable.vue`, `studentSide/studentEntryForm/errorIndicator.vue`.
- **Old mailer** (its route is commented out): all 8 files under
  `instructorSide/instructorMailer/`.
- **Automatic side of the dev mailer:** `dev/instructorMailer/DevAutomaticMailer{Main,EntryForms,GoalForms}.vue`,
  plus the orphaned `dev/instructorMailer/mockData.js`.
- **Dev leftovers:**
  - `dev/map.vue`, `dev/map2.vue`, `dev/public2.vue`;
  - the whole `dev/speechToText/` folder (`SpeechToTextDemo.vue`, `speechToTextService.js`);
  - all 7 files under `dev/storyCollectorForm/`.
- **projectView files that are only barrel-exported** (note the `studentSide/` prefix):
  - `studentSide/projectView/ProjectTemplateSelector.vue`;
  - `studentSide/projectView/forms/ProjectForm{Container,Development,Research}.vue`;
  - `studentSide/projectView/templates/{ProjectTemplateRenderer,ResearchTemplate,DevelopmentTemplate}.vue`;
  - `studentSide/projectView/forms/shared/{FileUploader,IconCropperDialog}.vue`.

  In the **same commit**, or the build breaks:
  - delete `studentSide/projectView/templates/index.js:11-14` (the "Legacy templates" comment
    and 3 exports);
  - delete `studentSide/projectView/forms/shared/index.js:9` and `:15`;
  - delete the three dead barrels `studentSide/projectView/index.js`,
    `studentSide/projectView/forms/index.js` and `studentSide/projectView/pages/index.js`.
    Only the first imports the other two, and nothing imports it.
- **Other:** `instructorSide/instructorAdminPanel/newTest.vue` (0 bytes) and
  `reusable/inviteMembersDialog - search students working.vue` (quote the path; it contains
  spaces).
- **The 8 prototypes (decision 10):**
  - Files:
    - `dev/kpis.vue`;
    - `dev/indProjectPage1.vue`, `dev/indProjectPage2.vue`, `dev/indProjectPage1-2.vue`,
      `dev/indProjectPage2-2.vue`, `dev/indProjectPage_engaged_data.vue`;
    - `dev/publicGallery.vue`, `dev/publicGallery2.vue`.
  - Their routes in `src/router/index.js`: 644-658 (`/publicGallery`, `/publicGallery2`,
    `/kpis`) and 697-721 (`/public2`–`/public6`). Keep `/public1` (a redirect to
    `/featured`, 694) and `/publicProjects` (640).
  - Their `publicPaths` entries: 1006-1012 (`"/public2"`–`"/public6"` with the `// Carlos`
    and `// Phil Navya` comments) and 1015-1016 (`"/publicGallery2"`, `"/publicGallery"`).
  - The 7 assets only they use, all in `src/assets/`: `carlos_headshot.jpg`,
    `carlos_headshot-320w.jpg`, `carlos_headshot-640w.jpg`, `carlos_URD_poster.pdf`,
    `philip_headshot.jpg`, `navya_headshot.jpg`, `sample_architecture.png`.
  - Keep `/dev/projectPreview` and `DanPersona.svg` (the App.vue drawer avatar).
  - Optionally fix the comment at `PreviewSubmitStep.vue:6`, which mentions
    `indProjectPage_engaged_data.vue`.
- **Router comments that point at deleted files** (`src/router/index.js`). Remove:
  - 547-561 (old mailer);
  - 783-789 (story collector);
  - 791-797 (speech-to-text);
  - the 181-line merge-debris block 799-979, which duplicates live routes;
  - 1018-1019 (a commented `publicPaths` entry).
- **Already verified:**
  - no npm dependency becomes unused;
  - no live file imports anything from the deleted set;
  - Tailwind's output loses only 4 utilities that only deleted files use (`.mt-12`,
    `.overline`, `.drop-shadow`, `.ease-out`), so no remaining file is affected.
- **Proof (G1):** `npm run build` passes, and no emitted asset is named after a deleted
  component. Today `DevelopmentTemplate-*.css` still ships through the barrel.
- Everything stays restorable from `43c07af`.

---

## 7. Rollout and forced light

**Release gate.**

- `DARK_MODE_RELEASED` in `src/theme/initialTheme.js` stays `false` until the per-role human
  QA signs off.
- The toggle renders only when `showThemeToggle` is true. App.vue's `setup()` computes it as
  `DARK_MODE_RELEASED || import.meta.env.DEV` (§5.3 item 5).
- With a light first visit (`FOLLOW_OS_WHEN_UNSET = false`) and a DP-only key, no user
  reaches dark mode before release. Hiding the toggle alone would not have been enough under
  CHW's follow-the-OS policy.
- The whole sweep must still be complete before release. Forced light is **not** a way to
  stage unconverted pages.

**Forced light: only for the permanent stay-light regions (§6.1).**

- **Route level.**
  - Add `meta: { forceLight: true }` to the three routes. The router has no `meta` today;
    auth uses `beforeEnter` guards and a `publicPaths` array.
  - In App.vue, compute
    `forceLight = this.$route.matched.some(r => r.meta && r.meta.forceLight)`.
  - Render
    `<v-theme-provider v-if="forceLight" theme="light" with-background class="dp-force-light"><router-view /></v-theme-provider><router-view v-else />`
    in `v-main` (App.vue:267-269).
  - Drive it from **route meta only, never from `isDark`**: toggling would remount the page
    and lose unsaved form state.
- **`with-background` is mandatory.** Without it VThemeProvider renders no element, and plain
  elements inside get no light variables.
- **Define a global `.dp-force-light` class in `index.css`:**

  ```css
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
  min-height: 100%;
  ```

  - The provider otherwise sets full-opacity `#000` text: a light-mode change.
  - `v-main` carries App.vue's `.main-content` (445-449: `height: 100vh; overflow-y: auto;
    padding-bottom: 5vh`). Its 5vh padding sits outside the provider and would show as a dark
    strip. On forced routes:
    - bind `:class="{ 'pb-0': forceLight }"` on `v-main`. Vuetify's `.pb-0` is `!important`.
    - give the route-level provider the extra class `dp-force-light--route`, defined as
      `{ padding-bottom: 5vh; }`.
  - `FeaturedShowcase.vue` and `publicProjects.vue` set no `min-height` of their own.
- **Component level.** Use the same provider and class:
  - around `ProjectTemplate` at `ProjectPreview.vue:77-82`;
  - as the **first child inside the Teleport** (`ProjectPreview.vue:86`), because teleported
    content escapes outer providers:
    - wrap the whole `.fullscreen-overlay` div (87-117);
    - move that div's `v-if="isFullscreen"` onto the provider;
  - at `PreviewSubmitStep.vue:29`:
    - move `v-if="previewProject"` from `ProjectTemplate` onto the provider;
    - keep the `v-else` empty-state div as the provider's next sibling;
  - around the mailer's editor card(s) and preview. Put the provider on the card element
    itself so the parent's scoped styles keep working.
- **What works inside forced light:**
  - Vuetify redefines every `--v-theme-*` and `--v-*` variable, so direct
    `rgb(var(--v-theme-…))` renders light.
  - `dark:` classes, `.v-theme--dark`-scoped CSS and `:root`-only aliases do **not** (§6.3).
  - Vuetify overlays opened inside a provider (v-dialog, v-menu, v-tooltip, v-snackbar) take
    its theme class on their teleported root.
  - Body-level non-Vuetify UI (toasts, CKEditor balloons) follows the global theme. Both
    stay unthemed, so that's fine.

**Merging.**

- Keep every phase on `feature/dark-mode`, and merge to `true_main` once, after the human
  QA.
- A pending workflow on `origin/frontend-deployment-action` would deploy every `true_main`
  push to envtest once it is merged.
- PR base: **`true_main`**. `main` is 282 commits behind.
- CI builds on Linux: import paths must match filename case exactly.

---

## 8. Phases

| Phase | Work |
|---|---|
| 0 | §6.5 deletions, barrel lines, prototype routes, `publicPaths` entries, assets, router comment cleanup. Gate G1. |
| 1 | Infrastructure (§5.2, §5.3): see below. |
| 2 | Keys and global fixes: see below. |
| 3 | Decisions: **done** (§9). |
| 4 | Scripted replaces (§6.3): see below. |
| 5 | Shared layouts (§6.2, `<style scoped src>`), then the per-file sweep: §6.3 rules, §6.4 big files, student tag chips, custom scrollbars. |
| 6 | Gates G1–G7. `NOTES_dark-mode.md` with the per-role human QA checklist (84 live `v-dialog`s in 30 files, not 99). |

**Phase 1: infrastructure (§5.2, §5.3, §7).**

- Create `themes.js` with **every key in the §6.3 key table, in both themes**. The Phase 1
  gradient already uses `appbar-slice`, and an undefined key would make the app bar
  transparent.
- Create `initialTheme.js` and `useColorScheme.js`, and wire `main.js`. In `initApp()`, after
  `app.mount()`, call `attachOsListener(…)` and remove the `dp-prepaint-dark` class.
- Add the `darkMode` line.
- Add `public/theme-init.js`, plus the `index.html` script tag and inline style.
- Add to `index.css`: the `html` background rule, `.dp-force-light` and
  `.dp-force-light--route` (§7).
- App.vue:
  - the toggle, with `v-if="showThemeToggle"` returned from `setup()`;
  - the gradient key;
  - drawer `color="primary"` and the `<hr>` color;
  - the `forceLight` provider and the `pb-0` binding on `v-main`;
  - delete the unused `#_container` rule (no element has that id).
- Add the `es.json` strings.
- Add route `meta` and the component-level providers, including the `v-if` moves in
  `ProjectPreview.vue` and `PreviewSubmitStep.vue`.

**Phase 2: keys and global fixes.**

- In `tailwind.config.js`: the gray mapping and the default border. Keep `custom-red` until
  the end of Phase 4.
- Add the palette, Basic-page and missing-key-rule keys (§6.3) to `themes.js` **before** any
  per-file subagent starts.
- Delete both `.styled-error-text` blocks; use `class="text-error text-caption"` at their 4
  usages.
- Replace all 10 `.error-text` copies with one global
  `.error-text { color: rgb(var(--v-theme-error)); }` or `text-error`:
  - 4 unscoped: `entryFormDemo`, `entryFormEnrolled`, `entryFormGradProf`,
    `studentEntryFormUpdate` (`darkred`);
  - 6 scoped with `rgb(176, 0, 32)`: `exitFormExp`, `goalFormAsp`, `goalFormCommRes`,
    `goalFormExp`, `goalFormGoals`, `goalFormGrowth`.
- Native checkboxes (`eventForm.vue`, `eventDetails.vue`):
  - `[type='checkbox'],[type='radio'] { background-color: rgb(var(--v-theme-surface)); }`;
  - `[type='checkbox']:focus,[type='radio']:focus { --tw-ring-offset-color: rgb(var(--v-theme-surface)); }`.
  - **Do not set `border-color`.** The forms plugin's border already reads `colors.gray.500`,
    which the remap themes. A later `border-color` would also beat the `border-gray-300`
    utility, which has the same specificity and comes earlier in `index.css`.
  - register.vue's radios are converted in the per-file sweep (§6.3).
- Replace `0 0 #0000` with `0 0 transparent` at `index.css:64-65`. It renders the same.
- Add the dark-scoped autofill block (§5.2 item 5).
- Add the vue-multiselect overrides.
- Give the ClowderFileSelector image preview a fixed `background: #fafafa`.
- studentDashboard pastels:
  - Move `.list-item-no-padding`, `.no-right-margin`, `.light-green-bg` and `.light-red-bg`
    from `studentDashboard.vue:96-119` into studentChecklist.vue's `<style>`, and make that
    block `scoped`. studentChecklist is their only consumer, and every use is in its own
    template.
  - Map the pastels to `tint-success` / `tint-error`.
  - Delete studentDashboard's whole unscoped block: `.light-grey-bg` and `.unclickable` have
    no users.
  - **Never add `scoped` to studentDashboard's block.** A parent's scoped rules reach only a
    child's root element, so the checklist rows would lose their colors.
- Delete the dead `.v-btn.icon:hover` rule (`index.css:165-167`; no `v-btn` has class
  `icon`).

**Phase 4: scripted replaces (§6.3).**

- Red props by effective variant.
- The other red forms.
- The 108 grey props → emphasis classes.
- `text-custom-red` / `bg-custom-red`, named black, and `grey-darken-4` ternaries.
- `color="red darken-2"` → `color="brand-fg"` (`entryFormMain.vue:255, 276`,
  `exitFormMain.vue:386, 407`, `goalFormMain.vue:368, 389`). These are red text buttons in
  dialog actions. The invalid space syntax renders today as Vuetify's `text-red`
  (`#F44336`).
- Remove the Vuetify 2 `dark` props (`studentExpReg.vue:185, 249`,
  `inviteMembersDialog.vue:12`, `joinProjectDialog.vue:16`).
- Last: remove `custom-red` from `tailwind.config.js`, in the same commit as the last
  `custom-red` replacement.
  - Do it only when a Node scan finds zero `custom-red` tokens under `src/`.
  - Otherwise keep it, and list the files under "Unconverted".

**After the run**, human per-role QA takes 2–3 days (§10b).

---

## 9. Decisions (settled 2026-09-23)

| # | Topic | Decision |
|---|---|---|
| 1 | Light-mode `primary` | UH red `#c8102e` in both themes, as in CHW. `primary-darken-1` = `#a00d24`. The 33 `color="primary"` uses change from blue to red in light mode (accepted). |
| 2 | Brand red on dark | Fills use `primary`; red text and icons use `brand-fg` (`#FF6B7F` in dark). That shade is defined once, in `BRAND_RED_ON_DARK`, and can be retuned there. |
| 3 | App chrome in dark | Stays red, as in CHW. The gradient's grey slice is `#262626` in dark; the toggle icon is white; the drawer is unchanged. Never theme-following chrome. |
| 4 | Pastel status headers and banners | Opaque `tint-*` keys: light values are the exact old hexes, dark values are pre-composited. |
| 5 | Stay-light list and dev prototypes | Stay light: `/project/:id`, `/featured`, `/publicProjects`, the editor's ProjectTemplate preview, and the mailer editor and preview. The 8 unlinked prototypes are deleted; `/dev/projectPreview` is kept. |
| 6 | First-time visitors | Light. Dark is opt-in via the toggle (`FOLLOW_OS_WHEN_UNSET = false`). |
| 7 | Student-picked project colors | The project page stays light, so no render-time rule is needed there. In the dark editor, the tag chips use `:variant="isDark ? 'flat' : 'tonal'"`. `projectTypes.js` is never touched. |
| 8 | Light theme | DP's current look (Vuetify defaults plus decision 1 and the new keys), not CHW's light block. |
| 9 | Preference key | `dp-theme`, separate from CHW's `app-theme`. |
| 10 | Toasts | No change: pastel in both themes. |
| 11 | CKEditor | No change: fully light. |
| 12 | CHW autofill fix | Ported, scoped under `.v-theme--dark`. |
| 13 | Run mode | Fully unattended, in accept-edits mode, with a pre-approved command list (Appendix A). Static gates plus a headless-browser tier (Appendix B). No push, no PR, and `DARK_MODE_RELEASED` stays `false`. |
| 14 | Branch `sandbox/exit_form_activities` | Test-only and never merged. Ignore it. |

---

## 10. Verification

### 10a. Automated (the run)

See Appendix B. The run's definition of done:

- all gates are green, or failures are logged;
- `NOTES_dark-mode.md` is written.

Never report something as "visually verified" without G7 evidence.

### 10b. Human QA after the run (both themes)

- **Signed out.**
  - The 8 auth pages, including register's native radios and `sendNewCode`'s banners.
  - The app-bar gradient and toggle.
  - `/featured` and `/project/:id` with real data (they stay light).
  - A hard reload in dark: no white flash. On the deployed build, check the
    Content-Security-Policy header in DevTools.
  - A first visit is light.
- **Temporary.** The `verifyAccWithCode` flow.
- **Student.**
  - Dashboard heading; studentChecklist rows.
  - The four entry-form variants (error text); goal and exit forms (the stepper icons).
  - Profile; projects list, proposal and edit.
  - The editor with real data: ClowderFileSelector, AvatarCropperDialog, ZoomModal, the
    fullscreen preview, tag chips.
  - Join/invite dialogs; projectDocuments.
  - `brand-fg` validation text after submitting.
  - Create/update toasts.
  - The preference survives logout and login.
- **Instructor, Group Instructor, Group Admin.**
  - Dashboard, data products, students list, specific student.
  - The data-management console and every add/edit page.
  - Progress monitor; goal form viewer.
  - Projects; featured projects manager; generate reports.
  - The mailer, where CKEditor stays light: open the link balloon (Ctrl+K), the Insert-media
    dialog and a toolbar tooltip; check the email preview and MailerSendDialog.
- **Org Admin.** All of the above, plus `/admin/backup`.
- **Basic.**
  - The 8 legacy pages: gray remap, red errors, indigo focus borders, orange banners,
    validation text.
  - Native inputs, including the checkbox borders in dark: `tw-gray-300` `#525252` is about
    2.3:1 on `#171717`.
  - vue-multiselect on `/updateclient/:id`.
- **All roles.**
  - The `/error` heading.
  - The 84 dialogs, tooltips and menus.
  - Focus visibility: `index.css:45-68` removes input outlines.
  - Autofill a saved login in Chrome and Firefox.
  - Dark error and info text on `#262626` panels: 4.02:1 and 4.11:1, known shortfalls of
    CHW's palette. Decide whether any spot needs a change.
  - Light-mode screenshots match the "before" screenshots.
- **Testing tips.**
  - A current backend clone lives at
    `C:\Users\periksson\Engaged Data DP Backend\DataPlatform`. `npm start` serves
    `:3000/backend`, which DP's `.env` expects. Check which database its `.env` `MONGO_URL`
    targets first.
  - When switching between CHW and DP on the same origin, or on `localhost:5173`, clear
    `localStorage['loggedInUser']` (§11).

### 10c. CSS order (a fact for debugging)

- There is no `@layer` anywhere: not in Vuetify 3.9's CSS, not in its theme stylesheet, not
  in Tailwind 3's output.
- Order, the same in dev and build:
  1. CSS of the components App.vue auto-imports (VApp, VLayout, VNavigationDrawer,
     VAppBar/VToolbar, VBtn, VList, VListItem, VIcon, VTooltip/VOverlay, VMain), and
     vue3-toastify's CSS (through `mixins/handleErrorMixin.js:10`);
  2. Tailwind (`index.css`, `main.js:30`);
  3. `vuetify/styles` (`main.js:37`);
  4. MDI;
  5. the remaining component CSS (`main.js:41`);
  6. the theme stylesheet, appended to `<head>` at runtime in `app.use(vuetify)`;
  7. lazy route CSS.
- Consequences:
  - Theme `.bg-KEY` / `.text-KEY` classes (`!important`, last) beat Tailwind utilities and
    Vuetify's color pack.
  - Vuetify's own `!important` utilities (`.bg-white`, `.text-white`, `.border*`) beat
    same-named Tailwind classes.
  - Global overrides of Vuetify component CSS need `!important`, because `index.css` loads
    before `vuetify/styles`.

---

## 11. Unrelated issues found during the audits

- **Broken class binding.** `studentSide/studentDash/studentChecklist.vue:141` has
  `class="'text-green-800'"`. The quotes are part of the class name, so no class applies.
- **Leaking `.error-text` rules.** Four live student-form files put `.error-text` in an
  unscoped `<style>`, so the color that wins depends on which page loaded first (fixed in
  Phase 2). The four are `entryFormDemo`, `entryFormEnrolled`, `entryFormGradProf` and
  `studentEntryFormUpdate`.
- **Pinned theme variables.** `.styled-error-text` in `entryFormGradProf.vue` and
  `studentEntryFormUpdate.vue` is a pasted DevTools dump of an old Vuetify light theme,
  including a purple `primary` (fixed in Phase 2).
- **Global style leak from the dev prototypes.** The `dev/indProjectPage*.vue` files put
  `:global(html, body, #app)` / `:global(body)` rules in scoped styles. It is removed with
  the prototypes.
- **Misconfigured persistence.** pinia-plugin-persistedstate 4.2.0 ignores the `paths` /
  `enabled` options in `src/stored/loggedInUser.js:485` (v4 uses `pick`), so the whole
  store is persisted. `logout()` removes `pinia-loggedInUser`, a key v4 doesn't use.
- **Shared-origin collision with CHW** (a production bug, separate fix).
  - DP (`/platform/`) and CHW (`/stories/`) are both served from `eds.uh.edu`, and both
    persist a Pinia store under the localStorage key `loggedInUser`.
  - A CHW user opening DP's `/` or `/login` can hydrate CHW's state and hit a redirect loop
    that freezes the tab. DP's own Basic role already loops on `/` (`router/index.js`
    around 1111).
  - Fix: `persist: { key: 'dp-loggedInUser', pick: [...] }`, update the two `removeItem`
    calls, and refresh the student flags in `initializeStore()`.
- **`.claude/settings.local.json` is tracked** despite the global ignore, so permission
  approvals get swept into commits. Always stage explicit paths.
- **Stale DP clone inside CHW.** `New_CHW_App/DataPlatformUI` is at `e7e3029`, with an
  uncommitted May 14 EN/ES label edit to `mainAuthWrap.vue`.
- **For CHW's owner:**
  - CHW `index.css:73-119` (dark toasts) never applies;
  - `AdminBackup.vue:473` uses the undefined token `outline-variant`;
  - CHW's light-mode borders regressed from `#e0e0e0` to `#FAFAFA`;
  - CHW now installs Vuetify after its network `await`, which lengthens its reload flash.
- **Unused dependencies and assets.**
  - `vue-toastification` is installed but never imported.
  - `sweetalert` is imported in `register.vue` but never called.
  - About 32 MB of images and PDFs in `src/assets` aren't referenced anywhere. `URD_Poster.png`
    alone is 19 MB. The others are `URD_Poster.pdf`, `URD_Poster_card.png`,
    `URD_Poster_large.png`, `URD_Picture.jpg` / `.webp`, `carlos_URD_picture.JPEG`,
    `carlos_memo.pdf` and `Headshot.png`.
- **Unreachable module.** `src/auth/jwtVerifier.js`; the security plan owns it.

---

## Appendix A — Rules for the unattended implementation run

**Setup.** You run fully unattended in accept-edits mode.

- **Pre-approved commands:**
  - `node …`, `npm run …`, `npx vite …`;
  - `git status`, `diff`, `log`, `show`, `fetch`, `rev-parse`, `check-ignore`, `ls-tree`,
    `add`, `commit`, `rm`.
- Anything else pauses for a human who isn't there, so don't use it.
- Use the **Bash tool** for git, node and npm. The pre-approvals are Bash rules.

**Before any edit (G0):**

1. Confirm the directory is `C:\Users\periksson.AUTOSOL\Documents\DP\DataPlatformUI` and the
   branch is `feature/dark-mode`. Then check `HEAD`:
   - It should be the commit that added this plan, whose parent is `43c07af`.
   - If `HEAD` is still `43c07af` and `Design_Plan_Dark_Mode.md` is untracked, commit that
     file alone first (`git add Design_Plan_Dark_Mode.md`, then `git commit`), and continue.
   - If the directory, the branch or `HEAD` is anything else, write `NOTES_dark-mode.md` with
     the finding and stop without editing.
2. Run `git fetch`. If `origin/true_main` has moved past `43c07af`, do **not** merge. Continue
   on this base and note it in `NOTES_dark-mode.md`.
3. Take the G0 baselines (Appendix B) **before** the first `npm run build`. The build
   overwrites the only "before" bundle.

**Git:**

- Allowed: `git add <explicit paths>`, `git commit`, `git rm <paths>`, and the read-only
  commands.
- **Forbidden:** `checkout`, `switch`, `stash`, `reset`, `restore`, `rebase`, `merge`,
  `push`, `clean`, `add -A`, `add .`, `add *`, `commit -a`.
- Never stage `.claude/settings.local.json` or `CHW_Stories_Dark_Mode_context.md`.
- **To undo your own uncommitted change to a file,** run a scratchpad Node script with a
  constant `PATHS` list:
  - For text files: `fs.writeFileSync(p, execFileSync('git', ['show', 'HEAD:' + p]).toString('utf8').replace(/\r?\n/g, '\r\n'))`.
    Working-tree files are CRLF.
  - For binaries, write the Buffer unchanged.
  - For files that aren't in `HEAD`, `fs.rmSync` them.
  - Never rebuild a file from command output (Bash output is capped at 30,000 characters) or
    with shell redirection.

**Scope:**

- Edit only this repo, plus your session scratchpad.
- The CHW repo is **read-only**. Never open `New_CHW_App/DataPlatformUI`.
- No `npm install` and no new dependencies. The browser tier is zero-install.
- Never touch `projectTypes.js`, the ProjectTemplate cards' color logic, or hex placeholders
  (§6.3).

**Scripts:**

- Keep them in your session scratchpad.
- The user's global rule applies: **no command-line flags** in scripts you write. Settings
  are constants at the top of the file, and there are no prompts either, since nobody is
  there to answer.
- Do multi-pattern text checks in Node.
- Never use `grep -q` with a pattern containing `#`: grep.exe core-dumps. If a
  `grep.exe.stackdump` file appears, delete it with a Node one-liner
  (`require('fs').rmSync('grep.exe.stackdump', { force: true })`), and never stage it.
- Run ESLint from a Node script, passing `ESLINT_USE_FLAT_CONFIG=false` in the child
  process's environment, not as a shell prefix.

**Workflows and subagents:**

- Include this appendix in every prompt for a subagent that edits files.
- Never let two agents edit the same file.
- Don't use worktree isolation: worktrees lack `.env`, `node_modules` and the untracked
  files.

**Commits:**

- Commit per phase (0, 1, 2), then per shared layout or file group in Phases 4–5.
- Every commit must pass G1.

**Failures:**

- Never wait for input.
- **G1, G2 or G6 fails twice, caused by one file's uncommitted edit:**
  1. restore that file (the undo recipe above);
  2. log it in `NOTES_dark-mode.md` under "Unconverted";
  3. continue.
- **G3, G4, G5 or G7 fails:**
  1. fix the cause where the plan allows, such as converting a missed literal or correcting a
     `themes.js` value;
  2. if the same item still fails on the second attempt, record it in `NOTES_dark-mode.md`
     (gate, file:line or route, value) and continue.

  These gates never trigger a restore.
- **No gate failure ever justifies changing** a §9-locked value, a literal the plan says to
  keep, `projectTypes.js` or a hex placeholder.

**End state: `NOTES_dark-mode.md` in the repo root, committed.** It contains:

- the gate results table (G0–G7) and the contrast table (G4);
- the screenshot folder path;
- a list of every new key and its values;
- deviations from this plan, with reasons;
- unconverted items;
- the per-role human QA checklist (§10b), seeded with CHW's known failure points:
  - tooltips, the login EN/ES switch, toasts, autofill;
  - the menu button on the gradient, reload flash;
  - CKEditor balloons and dialogs, teleported modals;
  - light-mode screenshot parity.

`DARK_MODE_RELEASED` stays `false`. Don't push, and don't open a PR.

---

## Appendix B — Gates

**Loading modules in Node** (every gate script).

- Gate scripts are `.mjs` files in the scratchpad. Bare imports resolve relative to the
  scratchpad, so set `const req = createRequire('<repo>/package.json')`.
- **Vuetify:**
  `await import(pathToFileURL(req.resolve('vuetify/lib/composables/theme.js')))`.
- **Themes:** `await import(pathToFileURL('<repo>/src/theme/themes.js'))`.
- **Tailwind:** `tailwind.config.js` is CommonJS inside a `type: module` package, so don't
  `import()` it. Use
  `req('tailwindcss/resolveConfig')(req('tailwindcss/loadConfig')('<repo>/tailwind.config.js'))`.
- Read `public/theme-init.js` and `index.html` as text.
- In Bash, quote scratchpad paths and use forward slashes.

**G0: baselines, before any edit.** Save to the scratchpad:

- a baseline build: `npx vite build --outDir <scratchpad>/baseline --emptyOutDir`;
- ESLint per-file error counts;
- the legacy-color inventory (the G5 scanner run at `43c07af`);
- Vuetify's default themes: import `vuetify/lib/composables/theme.js` in Node and dump
  `createTheme(undefined).computedThemes.value`.

**G1: build.**

- `npm run build` exits 0. Size warnings are fine.
- After Phase 0, no file under `build/assets` is named after a deleted component.

**G2: ESLint.**

- Per-file error counts never increase against the G0 baseline, which is 400 errors in 88
  files. Recompute it after Phase 0.
- No fatal or parse errors. Ignore the exit code.

**G3: theme contract** (Node, importing `src/theme/themes.js`):

- Compare the light built-in colors and variables of `createTheme({ themes })` against
  `createTheme(undefined)`. Every one must be equal, except `primary` and `primary-darken-1`.
- `surface-variant` / `on-surface-variant` are absent from the raw `themes` export. Vuetify's
  computed themes always contain them, from its defaults.
- Every custom key exists in both themes.
- Each key's light value equals the literal it replaces (§6.3 table).
- `on-background` equals `on-surface` in each theme.
- `public/theme-init.js` uses the same storage key and policy constants as
  `initialTheme.js`.
- The `#0A0A0A` in `index.html` equals `themes.dark.colors.background`.

**G4: token contrast** (Node, print the table into the notes):

| Pair | Minimum |
|---|---|
| on-X vs X, for background, surface, panel, panel-strong, page-bg, primary, primary-darken-1 and the tints | 4.5 |
| Medium emphasis (on-surface at `--v-medium-emphasis-opacity`, composited on surface, background and panel) | 4.5 |
| `brand-fg` and error in both themes, plus dark success, warning and info, as text vs background and surface | 4.5 |
| The same colors as icons, vs background, surface and panel | 3 |
| `tw-gray-500` and `tw-gray-700` vs surface | 4.5 |

Print these pairs but don't gate them:

- The same colors as **text vs panel**. Dark error `#EF4444` (4.02:1) and info `#3B82F6`
  (4.11:1) on `#262626` are known shortfalls; list them for human QA.
- Every **light success, warning and info** pair. These are Vuetify's defaults, kept by G3 and
  decision 8, and at 2.27–3.12:1 they are unchanged from today.

**Never change a built-in color, a §9-locked value or a kept literal to pass G4.**

**G5: legacy-color scanner** (Node).

- Strip comments first.
- Scope: live `src/**/*.{vue,js,css}` and `index.html`.
- Patterns:
  - **P1:** hex, `/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/`.
  - **P2:** `/\b(?:rgba?|hsla?)\(\s*[\d.]/`, allowed only in `box-shadow`, `text-shadow` and
    `filter`.
  - **P3:** CSS named colors (except `transparent`, `currentColor`, `inherit`, `initial` and
    `unset`) in color, background, border, outline, fill, stroke and caret-color
    declarations.
  - **P4:** Vuetify literal color props (`color`, `bg-color`, `base-color`, `slider-color`,
    `track-color`, `thumb-color`, `icon-color`, `text-color`, `border-color`) with a hex,
    `white`/`black` or palette-name value, including quoted literals in `:color` bindings.
  - **P5:** Vuetify palette classes and props: `(bg|text|border)-<palette>(-(lighten|darken|accent)-\d)?`.
    - `<palette>` is `red|pink|purple|deep-purple|indigo|blue|light-blue|cyan|teal|green|light-green|lime|yellow|amber|orange|deep-orange|brown|blue-grey|grey`.
    - `text-white` passes.
  - **P6:** Tailwind color classes with any `hover:`/`focus:` prefix, plus `bg-white`,
    `bg-black`, `text-black` and `border-white`.
    - Grays pass only when the resolved `gray.<shade>` contains `var(--v-`. Load the config
      as described above.
    - Exempt: `focus:ring-indigo-200` and `text-indigo-600` on the 8 checkboxes in
      `eventForm.vue` / `eventDetails.vue` (§6.3).
  - **P7:** `dark:` variants: `/(?<![\w:-])dark:[\w\[!-]/`, matched only inside `class` and
    `:class` values. Zero allowed.
  - **P8:** in any `<v-…>` start tag, an attribute named exactly `dark` or `light` with no
    value, or `theme=` on anything other than `<v-theme-provider … with-background>`.
  - **P9:** `#c8102e`, `#a00d24`, `#FF6B7F` and `rgba(200,16,46,…)` appear only in
    `src/theme/themes.js` and in allowlisted files.
- **Kept literals.** The plan says to keep these, so they never count as hits:
  - **K1:** `color="white"` props, and any remaining white literal, on a brand-red fill,
    another saturated fill kept by §6.3, or a student-color swatch. This includes the white
    badge at `inviteMembersDialog.vue:270`. Count them per file at the end of Phase 5 and
    record the counts in `NOTES_dark-mode.md`; counts may only fall.
  - **K2:** the four `placeholder="#000000"`.
  - **K3:** the `.Toastify__toast--*` rules in `src/index.css`: 9 hex values (decision 10).
- **Pass** (end of Phase 5): every live file not on the allowlist has zero P1–P9 hits once
  K1–K3 are set aside, and every allowlisted file is at or below its recorded count.
- **Global pass:** unscoped `<style>` blocks in `.vue` files, plus `src/index.css`, have zero
  P1–P3 hits outside K1–K3 and allowlisted lines.
- **Allowlist.** Each entry is a file, a reason and a maximum count; counts may only fall.
  - `src/theme/themes.js`;
  - `index.html` (the pre-paint `<style>`, max 1) and `public/theme-init.js` (pre-paint);
  - `projectTypes.js` (data);
  - **the stay-light set:**
    - `components/public/FeaturedShowcase.vue`;
    - `components/dev/publicProjects.vue`;
    - `studentSide/projectView/pages/ProjectViewPage.vue`;
    - `studentSide/projectView/templates/ProjectTemplate.vue`;
    - `studentSide/projectView/components/{ProjectHeroSingle,ProjectHeroMulti,TagsCard,FindingsCard,PartnersCard,TimelineCard,ImpactCard,PosterCardPdf,PosterCardImage,FooterBanner,ZoomModal}.vue`;
    - the `.editor-wrapper*`, `.email-editor-card` and `.email-preview*` rules in the mailer
      stylesheet (§6.2);
  - App.vue's chrome literals, which sit on the always-red chrome: the drawer `<hr>`, the
    notification dot and the toggle's `color="white"`;
  - the deliberately dark surfaces in §6.3;
  - the ClowderFileSelector image backdrop.

**G6: must-NOT structural checks.** Each must have zero matches.

In `src` **and** the built CSS:

- `.v-theme--dark .Toastify`, `.v-theme--dark .ck`;
- `rgb(var(--v-` followed by `/`;
- a literal `<alpha-value>` (built CSS).

In `src` **only**, because Vuetify's own bundled CSS legitimately contains similar
declarations:

- a `<v-theme-provider>` without `with-background`;
- an assignment to `global.name.value`: `/global\.name\.value\s*=(?!=)/`;
- top-level `await` in `src/main.js`;
- any `git diff 43c07af` change to `projectTypes.js`;
- a `color:` declaration (the property exactly `color`) whose value references
  `--v-theme-surface`: `/(?<![\w-])color\s*:[^;{}]*var\(--v-theme-surface\)/`;
- pinned theme variables: `/--v-theme-(?!overlay-multiplier)[a-z0-9-]+\s*:\s*\d/`.

It must also hold that:

- `es.json` has both new keys;
- the toggle sits inside `v-app-bar`;
- each forced-light route and component-level wrapper exists.

**G7: browser tier.**

- A Node script drives Chrome DevTools Protocol (CDP) using Node 22's built-in WebSocket and
  fetch.
  - Browser:
    `C:/Users/periksson.AUTOSOL/.cache/puppeteer/chrome-headless-shell/win64-147.0.7727.57/chrome-headless-shell-win64/chrome-headless-shell.exe`.
  - Use a throwaway `--user-data-dir` in the scratchpad. **Never launch the system
    `chrome.exe`:** Windows hands it to the user's open browser.
- **The G7 script owns every process.**
  - It spawns `process.execPath` with `node_modules/vite/bin/vite.js preview --port 4173 --strictPort`
    for the new build.
  - It spawns the same with `preview --outDir <scratchpad>/baseline --port 4174 --strictPort`
    for the baseline.
  - It spawns the headless shell.
  - It polls `http://localhost:<port>/platform/` until it gets a 200, and kills all three in a
    `finally` block.
  - Don't use `run_in_background`, `kill` or `taskkill` for these.
- Routes, under `/platform/`, in light and dark on the new build and in light on the
  baseline:
  - `/login`, `/register`, `/passResetRequest`, `/passResetCode`, `/passResetNewEntry`;
  - `/verifyAccWithCode`, `/verifyAccWithEmailCode`, `/sendNewCode`;
  - `/project/x` (error state);
  - `/dev/projectPreview` steps 1–2, plus the fullscreen preview.
- Set the theme by writing `localStorage['dp-theme']` over CDP, then reloading.
- Assertions:
  - the `.v-application` theme class is correct;
  - the forced-light wrappers are present, including inside the Teleport;
  - the console has no errors beyond refused API connections and the `/orgdata/`
    unhandled rejection;
  - **injected probe elements:**
    - a body-level `Toastify__toast--create` keeps `rgb(212, 237, 218)` /
      `rgb(21, 87, 36)` in **both** themes (decision 10: toasts unchanged);
    - Tailwind `bg-gray-50` / `border-gray-300` probes follow the theme: light
      `rgb(249, 250, 251)` / `rgb(209, 213, 219)`, dark `rgb(38, 38, 38)` /
      `rgb(82, 82, 82)`;
    - `text-medium-emphasis` and `text-disabled` probes follow the theme;
    - Vuetify color-pack classes are literal by design and are not probed (P5 covers them);
  - **the light-mode diff** between the new and baseline builds is empty, apart from the
    expected differences below:
    - **What it compares:** `color`, `background-color`, and `border-*-color` where that
      border's computed width is non-zero.
    - **Pairing:** key each element by a structural path (tag, id where present, and position
      among same-tag siblings), not by class names. Skip the new
      `.v-theme-provider.dp-force-light` wrappers and drop them from their descendants'
      paths. Skip elements that aren't rendered or have opacity 0.
    - **How to compare:** use effective colors. Alpha-composite every translucent color over
      **white**, which is the basis of §6.3's light-result column. Round to 8-bit and allow
      ±2 per channel.
    - **Expected differences:**
      - `<html>` background `rgba(0, 0, 0, 0)` → `rgb(255, 255, 255)` (§5.3's network-wait
        rule);
      - every old → new pair in §6.3's accepted list;
      - the toggle button;
  - a dark text-contrast sampler lists anything under 4.5:1.
- Save screenshots to the scratchpad and record the folder in the notes.
- Role pages need a backend and stay a human check (§10b).
