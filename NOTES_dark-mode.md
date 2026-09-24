# Dark mode: implementation notes

**Branch:** `feature/dark-mode`. **Base:** `43c07af` (`true_main`). **Plan:** `Design_Plan_Dark_Mode.md`.
**Status (2026-09-24):** the implementation run is complete, and every gate G1–G7 passes. Dark mode is
**not released**: `DARK_MODE_RELEASED` in `src/theme/initialTheme.js` is `false`, so the toggle only
renders in dev builds. Nothing has been pushed, and there is no PR.

**Next steps:**

1. Do the per-role human QA in §6 below, in both themes.
2. Then set `DARK_MODE_RELEASED = true`.
3. Open one PR against **`true_main`** (not `main`).

Merging to `true_main` deploys to envtest through the pending `frontend-deployment-action` workflow. CI builds
on Linux, so import paths must match filename case exactly.

**How to see dark mode now:**

- In a dev build (`npm run dev`), use the sun/moon button in the app bar.
- In any build, set `localStorage['dp-theme']` to `dark` in DevTools and reload.

The first visit is always light (`FOLLOW_OS_WHEN_UNSET = false`).

**What "verified" means here.**

- Rendered checks (G7) cover only the 12 signed-out route states: the 8 auth pages, `/project/x` and
  `/dev/projectPreview` steps 1–2 plus its fullscreen view.
- Every page behind a login was checked by static gates and by code-reading auditors, **not by rendering**.
  Those pages still need the human pass.

---

## 1. Commits

| Commit | Phase | Content |
|---|---|---|
| `5684acc` | 0 | §6.5 deletions (38 dead files, 8 prototypes, 3 barrels, 7 assets), barrel lines, prototype routes and `publicPaths`, router comment cleanup |
| `d012e78` | 1 | `themes.js`, `initialTheme.js`, `useColorScheme.js`, `main.js` wiring, pre-paint script and style, toggle, gradient, drawer, forced-light route and component providers, `es.json` |
| `c5b212b` | 2 | 91 theme keys from a scan-driven inventory, Tailwind gray remap, global `index.css` fixes, `.styled-error-text` and `.error-text` cleanup, dashboard pastels |
| `afd61fb` `f35f1ff` `845afa5` `ff25566` `f2568d4` `8de37db` | 4 | AST codemods for props, classes and CSS (about 1,740 replacements), by folder. `custom-red` removed from Tailwind in the last one |
| `6d1da69` `7523b93` `8694b00` `6559ae5` `07ec52f` `fec4b25` | 5 | The six shared stylesheets (§6.2) under `src/styles/`, each proven to compile identically |
| `88fcef8` `f92d734` `ac9758c` `b05073f` | 5 | Per-file sweep: Basic pages, auth, shared dialogs, student and editor files |
| `e60e451` `7bec6ca` | 6 | Fixes from the dark-legibility audit, and overlay strength on two original primary buttons |

G1 (build) and G2 (ESLint) ran on each phase's final tree before that phase was committed. Phases 4 and 5 were
then split into group commits, and those intermediate commits were **not** built individually. The edits are
file-local, and the Tailwind `custom-red` removal sits in the last Phase 4 commit.

## 2. Gate results

The final full run (G1–G7) was at `e60e451`. After `7bec6ca` (two `class` attributes on buttons that G7 does
not render), G1, G2, G3, G5 and G6 were re-run and pass. G0 was taken at `d894915` before any edit.

| Gate | Result | Key numbers |
|---|---|---|
| G0 baselines | Taken | Baseline build (served by G7 on port 4174). ESLint 400 errors in 88 files; recomputed after Phase 0 to 307 in 61 at `5684acc`. Legacy-color inventory: 3,122 hits in 101 files (P1 1,228, P2 86, P3 214, P4 643, P5 42, P6 368, P8 4, P9 537), K1 23, K2 4, K3 9. Vuetify default themes dumped. |
| G1 build | PASS | `npm run build` exits 0. 1 chunk-size warning (allowed). 0 emitted assets named after deleted components; 0 of 58 §6.5 paths left. |
| G2 ESLint | PASS | 307 errors in 61 files against the post-Phase-0 baseline: no file increased, 0 fatal or parse errors. The 3 new JS modules have 0 errors. |
| G3 theme contract | PASS 14/14 | 112 custom keys. Light built-ins equal Vuetify's defaults except `primary` and `primary-darken-1`. No `surface-variant`. `on-background` equals `on-surface`. Storage policy and pre-paint `#0A0A0A` match. 8 informational warnings for keys outside the §6.3 role table (§3). |
| G4 token contrast | PASS 89/89 | Group minimums: on-X vs X 5.88, medium emphasis 5.67, text 4.76, icon 4.02, tw-gray 4.83. The full table is Appendix C. |
| G5 legacy colors | PASS | 0 hit rows in 0 files after K1–K3. 0 allowlist entries over their maximum. Global styles clean. P7 and P8 at 0. K1 24, no file above its `43c07af` count except the planned App.vue toggle (Appendix B). |
| G6 must-not | PASS | Must-not 10/10 clean over 153 live files and the built CSS. Must-exist 12/12: `es.json` keys, the toggle in `v-app-bar` behind the release gate, three forced-light routes, every component-level wrapper including the Teleport, and the `main.js` theme config. |
| G7 browser | PASS | 36 route states: 12 routes × new-light, new-dark and baseline-light. Light parity: 1,747 elements compared, **0 diffs**, 134 differences all on §6.3's accepted list. Probes (toast, Tailwind gray, emphasis) pass. Console clean. Dark contrast sampler: 0 hard failures, 8 listed (below). |

The G7 sampler's listed items (not failures):

- In the editor's section numbers, white on `#6366F1` (`accent`) is 4.47:1, the same in both themes.
- Inside the stay-light ProjectTemplate:
  - "Click to enlarge" (`#6366F1` on white) is 4.47:1;
  - "No PDF uploaded" (`#A0AEC0` on `#F8F8F8`) is 2.12:1.

  Both are unchanged light-mode values.

**Where the evidence lives.** Session scratchpad, a temp directory that may be cleaned up:
`C:\Users\periksson.AUTOSOL\AppData\Local\Temp\claude\c--Users-periksson-AUTOSOL-Documents-DP-DataPlatformUI\a4a8d25e-bba9-453f-9f31-e7380f98450a\scratchpad\dm\`

- `gates\` holds the gate scripts (G1–G7, `check-files.mjs`, `restore.mjs`). Each runs as `node <script>`.
- `reports\` holds every gate's JSON, `g4-contrast.md` and `keys-extra.json`.
- `screenshots\` holds 36 PNGs: light and dark for the new build, and light for the baseline.
- `baseline\` is the pre-change build.
- `phase2\KEY-MAP.md` is the value → replacement map every agent used.

## 3. Deviations from the plan, with reasons

**Process**

- **G0 HEAD.** `HEAD` was `d894915`, one commit past the plan commit `7f1771e`. That commit only touched
  `.claude/settings.local.json` and `CHW_Stories_Dark_Mode_context.md`, so the source tree was `43c07af` plus
  the plan. It was treated as a pass, and the run plan approved that. `git fetch` showed `origin/true_main`
  still at `43c07af`.
- **Phase 0 ran twice.** It was applied once too early, while the gate-tooling agents were still running,
  reverted about 8 minutes later with the undo recipe, then redone. Only one tooling review overlapped the
  edit, and it was repeated on a clean tree.
- **Every editing agent owned a disjoint set of files.** Only the orchestrator built, staged and committed.
  Agents requested new keys, and the orchestrator added them to `themes.js`.

**Theme and infrastructure (Phase 1)**

- **The `.dp-force-light` rule is split in two.**
  - The color rule is written `.v-theme-provider.dp-force-light`, with two classes. Otherwise Vuetify's
    `.v-theme-provider { color: rgb(on-background) }` wins and forced-light text becomes full `#000`.
  - `min-height` stays on `.dp-force-light`.
  - The mailer cards override it with `min-height: auto`, so bilingual cards keep their own height.
- **Extra rules keep light mode unchanged:**
  - `.main-content--force-light { color-scheme: light }` keeps the scrollbar light beside forced-light pages
    in dark.
  - The teleported fullscreen preview keeps full-opacity text, which is what it inherited from `<body>`
    before.
  - The PreviewSubmitStep provider paints transparent, so `.preview-area` still shows in the step-3 gutters.
- **The toggle has `class="ml-n6"`**, which only affects spacing and only renders in dev builds. Hiding the
  toggle on forced-light routes (optional in §5.3) was **not** done.
- **`--v-theme-overlay-multiplier` is pinned to 1 in several places.** `color="primary"` adds Vuetify's
  `.bg-primary`, and for a dark fill that class doubles hover and active overlays in light mode compared with
  the old inline hex colors. The pin covers:
  - the drawer (`.sidebar`, Phase 1);
  - the converted fills `.bg-primary`, `.bg-checklist-frame-fill`, `.bg-archive-fill` and
    `.bg-archive-fill-strong` (a global rule in `index.css`, Phase 4);
  - the sign-in buttons.

  Fills that were already `color="primary"` at `43c07af` keep Vuetify's own multiplier: FeaturedShowcase's
  buttons through `.dp-force-light--route .bg-primary`, and "Run Backup Now" and "Generate Report" through the
  `dp-overlay-native` class.
- **`public/theme-init.js` has two small differences.** It uses optional `catch` binding. `attachOsListener`
  has an `addListener` fallback, which is only reachable if `FOLLOW_OS_WHEN_UNSET` becomes true.

**Theme keys (112 custom, Appendix A)**

- **Where the keys come from:**
  - 13 from the §6.3 key table;
  - 89 from the Phase 2 inventory, verified twice;
  - 10 added during review: `native-check-fill`, `on-muted`, `native-field-fill`, `native-input-edge`,
    `error-fill`, `error-fg`, `info-fg`, `raised-fill`, `remove-fill` and `on-remove-fill`.
- **Keys outside the §6.3 role table** (G3 warns about them, and they don't gate):
  - `native-check-fill` `#FFFFFF`/`#737373`: native checkboxes have no visible border, so the fill is their
    only edge. 3.78:1 on surface.
  - `native-input-edge` `#FFFFFF`/`#737373`: a 1px ring on the borderless register and sendNewCode inputs.
    White on their white card in light.
  - `on-muted` `#FFFFFF`/`#000000`: white on the dark `muted` fill was 2.52:1; black is 8.33:1.
  - `on-remove-fill` `#FFFFFF`/`#000000`: for the same reason, on studentExpReg's Remove button, which was
    `color="secondary"`.
- **Role choices that aren't obvious from the table:**
  - `brand-fg-strong` (the `#a00d24` icons) takes `BRAND_RED_ON_DARK` in dark, so the dark red lives in one
    constant.
  - `#EEF1F8` is classed as a pale tint (dark `#1B2432`).
  - The register radio keys use the icon role (3:1).
  - `muted` also carries the `.selection-remove` chip border.
  - Hued borders on non-Tailwind literals take the nearest Tailwind 800.
- **Error and info: the built-ins are unchanged.** Dark `error #EF4444` and `info #3B82F6` are locked by
  §5.2. Where they fell short, role keys take over:
  - `error-fill`, `#B00020` in both themes, for flat error buttons and the snackbar. White on dark error was
    3.76:1.
  - `error-fg`, `#B00020`/`#F87171`, for error text, icons, outlined Delete, Reject and Leave buttons, and
    tonal error alerts.
  - `info-fg`, `#2196F3`/`#60A5FA`, for tonal info alerts.
  - The global `.error-text` rule uses `error-fg` rather than the plan's `error`. It also sits on
    radio-group and checkbox roots, whose icons dropped to 2.90:1 in dark.
- **`raised-fill`** `#FFFFFF`/`#262626`: elevated stepper buttons were `#171717` on a `#171717` stepper.
- **Declined:** changing `archive-fill-strong`'s dark value. §6.3 fixes it at `#212121` in both themes, and its
  label is 16:1. It's a QA item instead.

**Global CSS (Phase 2)**

- **Native checkbox and radio fill** uses `native-check-fill`, not the plan's `surface`.
- **vue-multiselect (dark only):** selected rows that aren't highlighted use the `panel` fill, and the
  highlighted row's text is `on-success` on the library's green.
- **studentChecklist's moved `.list-item-no-padding`** is written `:where(…)`, so scoping doesn't raise its
  specificity above Vuetify's list indent.
- **Empty style blocks were removed:** the unscoped block in `entryFormGradProf.vue` and the scoped one in
  `exitFormExp.vue`.

**Components (Phases 4–6)**

- **inviteMembersDialog badge.** `text-color` was removed rather than set to `primary`. VBadge renders its
  background and text on one span, so the result is the same white badge.
- **studentExpReg.** `color="primary lighten-2"` (Vuetify 2 syntax that rendered as `bg-primary`) became
  `color="primary"`, with an identical render.
- **joinProjectDialog's title** moved from `text-primary-darken-1` to `text-brand-fg-strong`. Light is
  unchanged. In dark it no longer uses `#A00D24`, which was 2.2:1.
- **mainAuthWrap's EN/ES switch.** The old Tailwind `bg-custom-red` class lost to VSwitch's CSS, so the track
  was always `surface-variant`.
  - Vuetify's `!important` `bg-brand-fg` won instead and turned the track red.
  - The track is pinned back to `surface-variant`, and the thumb uses `surface`, so it shows on the dark
    track.
- **Disabled sign-in buttons** (login, updatePassword) are pinned to `surface` for the same reason.
  register.vue's sign-in hover is `primary-darken-1`, which is on the accepted list.
- **Read-only field labels.** The 38 identical inline `color: grey` styles in each of profilePage,
  instructorSpecificStudent and entryFormReview became one scoped `.field-label` rule reading
  `field-label-fg`.
- **`entryFormDemo`'s global `.btn-success`** was deleted: it was unused (key-map row `dead-btn-rules`).
- **The success notices in exitFormExp and goalFormExp** use `text-success`.
- **studentChecklist links** get a scoped `:hover` rule reading `link-hover-fg`.
- **SectionAddMenu's `sectionColors`** was converted to key names. It's a styling map read only by
  `getIconColor`, not persisted data (an orchestrator decision).
- **ClowderFileSelector's fallback.** The fallback icon keeps `#666` and its file name keeps
  `rgba(0,0,0,.87)`, because both sit on the plan's fixed light image backdrop (allowlisted).
- **Colors inside HTML comments.** Commented-out markup in instructorStudentsList was converted.
  `color="red"` inside an HTML comment at instructor `editProject.vue:149` was left alone.

**Shared stylesheets (Phase 5)**

- **Extraction scope.** Each sheet holds only rules that are byte-identical in every file that includes it.
  - Add/edit extracted all 16 identical rules.
  - Progress tabs extracted 18.
  - The list page is limited to the 4 rules §6.2 names.
  - Rules shared by only two files stay local.
- **Order of the included sheet.** `review-page.css` is included after the local block; the other sheets come
  before it. Each order was chosen so that the compiled scoped CSS matches the pre-change output rule for
  rule, in the same order.
- **The mailer block** was moved by a script that checks its md5 first, not by hand.
- **Comments** were added to the sheets and the include blocks. They're comments only.

**Gate tooling (scratchpad)**

- **G5** is stricter than Appendix B in places:
  - more color properties count for P3 and P4;
  - it follows helpers into bindings;
  - P7 and P8 are never allowlisted.

  Allowlist additions, each with a maximum:
  - `hero-wireframe` (10) and `cropper-mask` (2): marks drawn on deliberately dark surfaces;
  - `dialog-scrim` (2): VOverlay's own scrim is black in both themes;
  - `clowder-image-backdrop`, widened to `/image-preview|image-fallback/` (3), and `clowder-fallback-icon` (2);
  - `mailer-light`, extended to `src/styles/*.css`.
- **G6** requires *every* mailer `.email-editor-card` and `.email-preview` to be a provider or inside one.
- **G7** has 12 recorded implementation choices:
  - a third console-ignore rule, only for `/project/x`'s logged API refusal;
  - wrapper placement checks;
  - accepted-list pairs applied per Rule 0 role;
  - currentColor borders;
  - the teleport text rule;
  - painted-background comparison;
  - transition settling;
  - the wrapper-paint check;
  - gradient sampling;
  - hard-fail exemptions for disabled controls and forced-light wrappers;
  - stale-build refusal.

## 4. Unconverted items and intentional leftovers

**Unconverted: none.** No file was restored, G5 shows 0 hits, and a scan found 0 `custom-red` tokens before its
removal.

Intentionally left as they were:

- **`studentChecklist.vue:141` `class="'text-green-800'"`** (§11): the quotes make it a no-op. Fixing it would
  change light mode.
- **studentExpReg's Vuetify 2 leftovers:** `'grey lighten-1'` and `'grey darken-1'` class strings, and the
  boolean `outlined`. These are no-ops in Vuetify 3.
- **The stay-light files** (FeaturedShowcase, `dev/publicProjects`, ProjectViewPage, ProjectTemplate and its
  cards) are untouched.
  - Their 10 foreground `color="primary"` props now render UH red instead of Vuetify blue. That's the accepted
    `primary` change, and those pages are always light.
- **ProjectPreview's fullscreen close button** keeps `color="white"` inside the light provider (K1).
- **The unrelated issues in §11 are not addressed:** persistence config, the shared-origin `loggedInUser`
  collision, unused dependencies and assets, `jwtVerifier.js`, and CHW's own defects.
- **Kept literals (K1):** 24, listed per file in Appendix B. Counts may only fall.

## 5. Corrections to the plan's §10b

- **Native form controls draw no border in either theme.** This covers checkboxes, radios, text, date and
  select inputs on the Basic pages, and the register and sendNewCode inputs. Vuetify's reset
  `button, input, select, textarea { border-style: none }` outranks Tailwind's preflight, and the forms
  plugin never sets `border-style`.
  - So the §10b line about "checkbox borders `#525252`, about 2.3:1" does not apply.
  - In dark, controls are now visible through fills: `native-check-fill` `#737373` for checkboxes,
    `native-field-fill` `#262626` for fields (1.31:1 against the page), and a `native-input-edge` ring on the
    auth inputs.
  - In light nothing changed: the controls are still invisible white-on-white until focused, as they were
    before.
- **G7 covers 12 route states, not every page.** The dark sampler found no hard failures there. Everything
  behind a login was checked by static gates and code-reading auditors only.

## 6. Per-role human QA checklist (both themes)

Compare light mode against the baseline screenshots (`screenshots\baseline-light-*.png`), and check every item
in dark as well. Items marked **(CHW)** are where CHW's automated dark-mode run shipped defects.

**Signed out**

- [ ] The 8 auth pages: login, register, passResetRequest, passResetCode, passResetNewEntry,
      verifyAccWithCode, verifyAccWithEmailCode, sendNewCode.
- [ ] register: native radios (checked state: `radio-checked-*` keys; the white centre dot is 2.52:1 in
      dark) and the input edge ring.
- [ ] sendNewCode: the orange and green banners. Their Tailwind-800 left accents are dim in dark
      (1.8–2.5:1).
- [ ] **(CHW)** The EN/ES switch on login and register: the track is grey in both states, and the thumb is
      visible in dark.
- [ ] "Back to Login" and other default elevated buttons lose their container in dark (surface on surface).
      The label is readable. Decide whether that's acceptable.
- [ ] **(CHW)** The app bar gradient (red plus a `#262626` slice in dark), the menu button on the slice, and
      the toggle (dev build).
- [ ] `/featured` and `/project/:id` with real data stay light in dark mode.
- [ ] **(CHW)** Hard reload in dark: no white flash on normal pages. On `/featured`, `/project/:id` and
      `/publicProjects`, the canvas is dark until the light page renders (a reverse flash, by design).
- [ ] On the deployed build, check the Content-Security-Policy header in DevTools. `theme-init.js` must load
      (`script-src 'self'`).
- [ ] A first visit is light (no `dp-theme` stored).

**Temporary:** the `verifyAccWithCode` flow.

**Student**

- [ ] Dashboard heading; studentChecklist rows (success and error tints; link hover).
- [ ] The four entry-form variants: validation text reads `error-fg` (see the note at the end of this
      section).
- [ ] The goal and exit forms: stepper icons, and the Previous/Next/Submit buttons (`raised-fill` in dark).
- [ ] Profile (read-only field labels).
- [ ] Projects list, proposal and edit:
  - the Leave and Cancel confirm buttons (`error-fill`);
  - the outlined buttons on panels (`error-fg`);
  - the Archive dialog, where the flat Archive button is `#212121` on the `#171717` dialog (1.11:1 edge,
    16:1 label).
- [ ] The editor with real data:
  - ClowderFileSelector: the fixed light image backdrop, and the "Remove" text button;
  - AvatarCropperDialog;
  - ZoomModal;
  - the fullscreen preview (gutters beyond 1400px are dark in dark mode);
  - tag chips (flat in dark);
  - the × "remove section" icons, which are faint in dark (text-disabled × .6 opacity).
- [ ] Join and invite dialogs. The "Declined" caption in a processed row (opacity .7) is about 3.6:1 in
      dark.
- [ ] projectDocuments (file-type icon colors).
- [ ] `brand-fg` validation text after submitting.
- [ ] **(CHW)** Create and update toasts: pastel in both themes (unchanged by design).
- [ ] The theme preference survives logout and login.

**Instructor, Group Instructor, Group Admin**

- [ ] Dashboard, data products (default elevated download buttons blend into the surface in dark), the
      students list, and a specific student.
- [ ] The data-management console and every add and edit page:
  - Delete confirm (`error-fill`);
  - outlined Delete (`error-fg`);
  - tonal info alerts in the update-with-instances dialogs (`info-fg`).
- [ ] Progress monitor tabs (the Export to CSV button outline in dark); goal form viewer.
- [ ] Projects (Reject confirm and outlined Reject), featured projects manager, generate reports.
- [ ] **(CHW)** The mailer: CKEditor stays fully light.
  - Open the link balloon (Ctrl+K), the Insert-media dialog and a toolbar tooltip.
  - Check that the email preview stays light.
  - Open MailerSendDialog.
  - Recipient table: the selected-row tint is faint in dark (1.14:1).
  - The disabled Send button is white on white in light. That's pre-existing and unchanged.

**Org Admin:** all of the above, plus `/admin/backup`.

**Basic**

- [ ] The 8 legacy pages:
  - native field fills in dark (`#262626`; check they are findable);
  - red headings and errors (`brand-fg`);
  - required asterisks;
  - orange banners;
  - validation text.
- [ ] Native checkboxes in `eventForm` and `eventDetails` (`native-check-fill`; the checked indigo is 2.85:1
      in dark).
- [ ] vue-multiselect on `/updateclient/:id`.

**All roles**

- [ ] The `/error` heading.
- [ ] **(CHW)** The 84 live `v-dialog`s in 30 files, tooltips and menus. Tooltips use Vuetify's untouched
      `surface-variant` pair. Also teleported modals.
- [ ] Focus visibility: `index.css` removes input outlines.
- [ ] **(CHW)** Autofill a saved login in Chrome and in Firefox.
- [ ] Dark error and info text on `#262626` panels where the built-ins are still used (Vuetify's own
      field-validation messages): 4.02:1 and 4.11:1, the known CHW-palette shortfalls. Decide whether any spot
      needs `error-fg`.
- [ ] The accent section numbers in the editor: white on `#6366F1`, 4.47:1 in both themes.
- [ ] **(CHW)** Light-mode screenshot parity with the baseline.

**Testing tips**

- A current backend clone is at `C:\Users\periksson\Engaged Data DP Backend\DataPlatform`. `npm start` serves
  `:3000/backend`, which DP's `.env` expects. Check which database its `.env` `MONGO_URL` points at first.
- When switching between CHW and DP on the same origin or on `localhost:5173`, clear
  `localStorage['loggedInUser']` (§11).

**Note on the entry forms:** the validation text now reads `error-fg`. In light that's `#B00020`, the same as
before. In dark it's red-400 `#F87171` rather than `#EF4444`.

---

## Appendix A. Theme keys (generated from src/theme/themes.js)

`primary` and `primary-darken-1` are built-ins whose values changed (decision 1). Every other row is a new
key. "§6.3 table" rows come from the plan's key table. "Phase 2+" rows are recorded in the run's
`keys-extra.json`, with the literal each one replaces. The dark red foreground lives only in
`BRAND_RED_ON_DARK`, which is the one value to change to retune it.

| Key | Light | Dark | Source | Role |
|---|---|---|---|---|
| `primary` | #C8102E | #C8102E | §6.3 table | brand red fills: buttons, chips, avatars, app bar, drawer (was Vuetify blue #1867C0 in light) |
| `primary-darken-1` | #A00D24 | #A00D24 | §6.3 table | red hover shade; white on it is 8.15:1 |
| `brand-fg` | #C8102E | #FF6B7F | §6.3 table | red foreground: text, icons, progress, text/outlined/tonal variants, tabs, switches |
| `appbar-slice` | #EFECEC | #262626 | §6.3 table | the app-bar gradient's grey stop |
| `panel` | #FAFAFA | #262626 | §6.3 table | panel fills (#fafafa) |
| `panel-strong` | #F5F5F5 | #262626 | §6.3 table | stronger fills and full-page backgrounds |
| `page-bg` | #F8F9FA | #0A0A0A | §6.3 table | page background |
| `tint-warning` | #FFF8E1 | #322716 | §6.3 table | pale warning tint |
| `tint-error` | #FFEBEE | #311C1C | §6.3 table | pale error tint |
| `tint-success` | #E8F5E9 | #182C20 | §6.3 table | pale success tint |
| `tw-gray-50` | #F9FAFB | #262626 | §6.3 table | Tailwind gray-50 (read by tailwind.config.js) |
| `tw-gray-200` | #E5E7EB | #404040 | §6.3 table | Tailwind gray-200, preflight's default border |
| `tw-gray-300` | #D1D5DB | #525252 | §6.3 table | Tailwind gray-300 |
| `tw-gray-500` | #6B7280 | #A3A3A3 | §6.3 table | Tailwind gray-500 |
| `tw-gray-700` | #374151 | #D4D4D4 | §6.3 table | Tailwind gray-700 |
| `muted` | #9E9E9E | #A3A3A3 | Phase 2+ | 'grey' / '#999' as a chip color, :color value or helper return (§6.3 palette table) |
| `muted-strong` | #666666 | #B6B6B6 | Phase 2+ | '#666' / grey-darken-1/-2 :color values, helper returns |
| `archive-fill` | #757575 | #757575 | Phase 2+ | grey-darken-1 flat Archive button (instructor) |
| `archive-fill-strong` | #212121 | #212121 | Phase 2+ | grey-darken-4 flat Archive button (student) |
| `complete-fill` | #16A34A | #16A34A | Phase 2+ | project editor completed step and connector |
| `approve-fill` | #2E7D32 | #2E7D32 | Phase 2+ | .approve-btn |
| `approve-fill-hover` | #1B5E20 | #1B5E20 | Phase 2+ | .approve-btn:hover |
| `checklist-frame-fill` | #385F73 | #385F73 | Phase 2+ | studentChecklist / studentExpReg list frames |
| `accent-fill` | #6366F1 | #6366F1 | Phase 2+ | ProjectForm optional section number |
| `btn-save-hover-fill` | #A00B26 | #A00B26 | Phase 2+ | studentExpReg .btn-save:hover |
| `cta-gradient-end` | #A30D26 | #A30D26 | Phase 2+ | PreviewSubmitStep .btn-primary gradient end |
| `avatar-gradient-end` | #E85A4F | #E85A4F | Phase 2+ | AuthorInput avatar placeholder gradient end |
| `dialog-header-gradient-end` | #FF5252 | #FF5252 | Phase 2+ | projectsMain .dialog-header gradient end |
| `caution-fg` | #FF9800 | #FB923C | Phase 2+ | Material orange: restore / pending icons, chips, buttons |
| `proposed-fg` | #FF5722 | #FB923C | Phase 2+ | Material deep-orange: 'Proposed' status chips |
| `consent-fg` | #FFA000 | #FBBF24 | Phase 2+ | Material amber-darken-2: consent icons and chip |
| `notice-info-fg` | #1565C0 | #60A5FA | Phase 2+ | text-blue-darken-3 registration notice |
| `filetype-pdf-fg` | #E53935 | #F87171 | Phase 2+ | red-darken-1 PDF icon |
| `filetype-doc-fg` | #1976D2 | #60A5FA | Phase 2+ | blue-darken-2 Word icon |
| `filetype-sheet-fg` | #388E3C | #4ADE80 | Phase 2+ | green-darken-2 spreadsheet icon |
| `filetype-slides-fg` | #F4511E | #FB923C | Phase 2+ | deep-orange-darken-1 slides icon |
| `filetype-image-fg` | #8E24AA | #D8B4FE | Phase 2+ | purple-darken-1 image icon |
| `checklist-done-fg` | #166534 | #86EFAC | Phase 2+ | green-800 (text): studentChecklist done rows |
| `checklist-todo-fg` | #991B1B | #FCA5A5 | Phase 2+ | red-800 (text): studentChecklist to-do rows |
| `link-fg` | #2563EB | #60A5FA | Phase 2+ | blue-600 (text) links and blue icons |
| `link-hover-fg` | #1E40AF | #93C5FD | Phase 2+ | blue-800 (text, hover) links; privacy notice text |
| `link-soft-fg` | #3B82F6 | #60A5FA | Phase 2+ | blue-500 (text) router-link (studentChecklist) |
| `banner-caution-fg` | #C2410C | #FB923C | Phase 2+ | orange-700 (text) banner text |
| `banner-success-fg` | #15803D | #4ADE80 | Phase 2+ | green-700 (text) banner text (sendNewCode) |
| `required-fg` | #FF0000 | #F87171 | Phase 2+ | required-field asterisks (Basic pages) |
| `brand-fg-strong` | #A00D24 | #FF6B7F | Phase 2+ | dark-red consent shield icons |
| `complete-fg` | #16A34A | #4ADE80 | Phase 2+ | project editor completed / saved state |
| `section-partners-fg` | #059669 | #34D399 | Phase 2+ | SectionAddMenu partners icon |
| `section-impact-fg` | #EA580C | #FB923C | Phase 2+ | SectionAddMenu impact icon |
| `section-poster-fg` | #7C3AED | #A78BFA | Phase 2+ | SectionAddMenu poster icon |
| `hint-info-fg` | #0F5DB0 | #60A5FA | Phase 2+ | goalFormCommRes .info-text |
| `found-notice-fg` | #4A90E2 | #60A5FA | Phase 2+ | exit / goal form experience-found notice |
| `status-success-fg` | #2E7D32 | #4ADE80 | Phase 2+ | backupDashboard .status-success |
| `status-failed-fg` | #C62828 | #F87171 | Phase 2+ | backupDashboard .status-failed |
| `validation-error-fg` | #DC2626 | #F87171 | Phase 2+ | project editor validation warnings |
| `accent-fg` | #6366F1 | #818CF8 | Phase 2+ | project editor indigo accent |
| `accent-hover-fg` | #4F46E5 | #818CF8 | Phase 2+ | PreviewSubmitStep .toggle-errors-btn:hover |
| `alert-accent-fg` | #5C6BC0 | #818CF8 | Phase 2+ | joinProjectDialog alert title and icon |
| `status-banner-warning-fg` | #856404 | #FACC15 | Phase 2+ | editProjectProposal .status-banner text |
| `proposed-banner-fg` | #F57C00 | #FB923C | Phase 2+ | editProject .status-banner.proposed text |
| `tip-fg` | #444444 | #D4D4D4 | Phase 2+ | projectProposal tips |
| `label-strong-fg` | #4A5568 | #D4D4D4 | Phase 2+ | FeaturedProjectsManager / PreviewSubmitStep labels |
| `label-soft-fg` | #718096 | #A3A3A3 | Phase 2+ | the same files: secondary labels |
| `field-label-fg` | #808080 | #A3A3A3 | Phase 2+ | CSS named grey: read-only field labels |
| `hint-fg` | #888888 | #A3A3A3 | Phase 2+ | manual mailer translation hint |
| `radio-checked-border` | #333333 | #D4D4D4 | Phase 2+ | border |
| `radio-checked-fill` | #808080 | #A3A3A3 | Phase 2+ | fill |
| `panel-cool` | #F0F0F5 | #262626 | Phase 2+ | PreviewSubmitStep secondary button, summary items |
| `panel-preview` | #F4F5F7 | #262626 | Phase 2+ | layout and preview canvases |
| `panel-soft` | #F8F8F8 | #262626 | Phase 2+ | stats display, disabled poster block |
| `panel-cool-soft` | #F8F9FC | #262626 | Phase 2+ | section items, container gradient start |
| `panel-review` | #F9F9F9 | #262626 | Phase 2+ | exit / goal form review sections |
| `panel-optional` | #FAFBFC | #262626 | Phase 2+ | ProjectForm optional section |
| `quiet-fill` | #E0E0E0 | #404040 | Phase 2+ | wireframe bars; grey-lighten-2 button |
| `quiet-fill-soft` | #E8E8E8 | #404040 | Phase 2+ | number badges, step indicator, avatar preview |
| `quiet-fill-cool` | #E8E8EE | #404040 | Phase 2+ | secondary button hover; filled-slot border |
| `tint-caution` | #FFEDD5 | #322217 | Phase 2+ | orange-100 (bg) banners |
| `tint-success-strong` | #DCFCE7 | #182C20 | Phase 2+ | green-100 (bg) banner; panel icon gradient stop |
| `tint-success-soft` | #F0FDF4 | #182C20 | Phase 2+ | green-50 mandatory rows and hovers |
| `tint-error-soft` | #FEF2F2 | #311C1C | Phase 2+ | red-50 selected / optional section blocks |
| `tint-error-strong` | #FEE2E2 | #311C1C | Phase 2+ | red-100 poster block gradient end |
| `tint-error-hover` | #FFF5F5 | #311C1C | Phase 2+ | ImpactInput icon hover |
| `tint-warning-banner` | #FFF3CD | #322716 | Phase 2+ | editProjectProposal status banner |
| `tint-warning-soft` | #FFFBEB | #322716 | Phase 2+ | amber-50 configurator help |
| `tint-info-page` | #EEF1F8 | #1B2432 | Phase 2+ | PreviewSubmitStep container gradient end |
| `tint-info-soft` | #EFF6FF | #1B2432 | Phase 2+ | blue-50 privacy notice |
| `tint-info-hover` | #F0F4FF | #1B2432 | Phase 2+ | optional section hover |
| `tint-brand-soft` | #FCE4EC | #311D27 | Phase 2+ | manual mailer selected row, language badge |
| `banner-caution-border` | #F97316 | #9A3412 | Phase 2+ | orange-500 (border) banner accent |
| `banner-success-border` | #22C55E | #166534 | Phase 2+ | green-500 (border) banner accent |
| `success-soft-border` | #BBF7D0 | #166534 | Phase 2+ | green-200 panel icon, mandatory rows |
| `info-soft-border` | #BFDBFE | #1E40AF | Phase 2+ | blue-200 privacy notice |
| `accent-soft-border` | #C7D2FE | #3730A3 | Phase 2+ | indigo-200 summary item hover |
| `warning-soft-border` | #FDE68A | #92400E | Phase 2+ | amber-200 configurator help |
| `error-soft-border` | #FECACA | #991B1B | Phase 2+ | red-200 optional / poster blocks |
| `status-banner-warning-border` | #FFC107 | #92400E | Phase 2+ | editProjectProposal status banner |
| `warning-card-border` | #FFCC80 | #9A3412 | Phase 2+ | warning cards, proposed banner |
| `warning-header-border` | #FFE0B2 | #9A3412 | Phase 2+ | warning header bottom border |
| `alert-accent-border` | #5C6BC0 | #3730A3 | Phase 2+ | joinProjectDialog v-alert start border |
| `btn-outline-hover-border` | #C8C8D0 | #404040 | Phase 2+ | PreviewSubmitStep .btn-outline:hover |
| `btn-secondary-hover-border` | #D0D0D8 | #404040 | Phase 2+ | PreviewSubmitStep .btn-secondary:hover |
| `slot-empty-border` | #D4D4D8 | #404040 | Phase 2+ | FeaturedProjectsManager empty slot |
| `divider-faint` | #F5F5F5 | #404040 | Phase 2+ | projectProposal tip dividers |
| `divider-soft` | #EEEEEE | #404040 | Phase 2+ | MailerSendDialog failed-item divider |
| `native-check-fill` | #FFFFFF | #737373 | Phase 2+ | unchecked native checkbox/radio fill (forms plugin's white) |
| `on-muted` | #FFFFFF | #000000 | Phase 2+ | text on flat muted fills: Vuetify's computed value, pinned |
| `native-field-fill` | #FFFFFF | #262626 | Phase 2+ | native text/date/textarea fill on the Basic pages (the white page they sit on) |
| `native-input-edge` | #FFFFFF | #737373 | Phase 2+ | 1px ring on borderless native inputs: white on their white card |
| `error-fill` | #B00020 | #B00020 | Phase 2+ | = Vuetify's light error, so flat error buttons look the same |
| `error-fg` | #B00020 | #F87171 | Phase 2+ | = Vuetify's light error, for error text/icons and .error-text |
| `info-fg` | #2196F3 | #60A5FA | Phase 2+ | = Vuetify's light info |
| `raised-fill` | #FFFFFF | #262626 | Phase 2+ | = the surface Vuetify paints elevated buttons with today |
| `remove-fill` | #48A9A6 | #48A9A6 | Phase 2+ | = Vuetify's light secondary |
| `on-remove-fill` | #FFFFFF | #000000 | Phase 2+ | = Vuetify's computed on-color for #48A9A6, pinned |

## Appendix B. Kept white literals (K1) per file

These are white literals kept on brand-red fills, saturated fills or student swatches. Counts may only fall. The one increase is the App.vue theme toggle (§5.3 item 5).

| File | K1 now | K1 at 43c07af |
|---|---|---|
| src/App.vue | 1 | 0 |
| instructorSide/instructorProgressMonitor/studentGoalFormViewer.vue | 2 | 2 |
| public/FeaturedShowcase.vue | 10 | 10 |
| reusable/inviteMembersDialog.vue | 1 | 1 |
| reusable/joinProjectDialog.vue | 2 | 2 |
| studentSide/projectView/ProjectEditorMain.vue | 1 | 1 |
| studentSide/projectView/ProjectPreview.vue | 1 | 1 |
| studentSide/projectView/forms/shared/FindingsInput.vue | 1 | 1 |
| studentSide/projectView/forms/shared/MilestonesInput.vue | 1 | 1 |
| studentSide/projectView/forms/shared/PartnersInput.vue | 1 | 1 |
| studentSide/projectView/forms/shared/TagsInput.vue | 2 | 2 |
| studentSide/projects/projectsMain.vue | 1 | 1 |

## Appendix C. G4 token contrast (final run)

G4 PASS: 89/89 gated pairs meet their minimum; 2 text-vs-panel shortfall(s) for human QA

Source: `src/theme/themes.js`, through Vuetify's `createTheme({ themes }).computedThemes` (computed on-colors and merged emphasis opacities). Generated 2026-09-24T13:17:11.432Z.

Tints gated as on-X vs X: `tint-warning`, `tint-error`, `tint-success`, `tint-brand-soft`, `tint-caution`, `tint-error-hover`, `tint-error-soft`, `tint-error-strong`, `tint-info-hover`, `tint-info-page`, `tint-info-soft`, `tint-success-soft`, `tint-success-strong`, `tint-warning-banner`, `tint-warning-soft`.

| theme | pair | fg | bg | ratio | minimum | gated | pass |
|---|---|---|---|---|---|---|---|
| light | on-background vs background | `#000000` | `#FFFFFF` | 21.00:1 | 4.5 | yes | yes |
| light | on-surface vs surface | `#000000` | `#FFFFFF` | 21.00:1 | 4.5 | yes | yes |
| light | on-panel vs panel | `#000000` | `#FAFAFA` | 20.12:1 | 4.5 | yes | yes |
| light | on-panel-strong vs panel-strong | `#000000` | `#F5F5F5` | 19.26:1 | 4.5 | yes | yes |
| light | on-page-bg vs page-bg | `#000000` | `#F8F9FA` | 19.92:1 | 4.5 | yes | yes |
| light | on-primary vs primary | `#FFFFFF` | `#C8102E` | 5.88:1 | 4.5 | yes | yes |
| light | on-primary-darken-1 vs primary-darken-1 | `#FFFFFF` | `#A00D24` | 8.15:1 | 4.5 | yes | yes |
| light | on-tint-warning vs tint-warning | `#000000` | `#FFF8E1` | 19.77:1 | 4.5 | yes | yes |
| light | on-tint-error vs tint-error | `#000000` | `#FFEBEE` | 18.37:1 | 4.5 | yes | yes |
| light | on-tint-success vs tint-success | `#000000` | `#E8F5E9` | 18.67:1 | 4.5 | yes | yes |
| light | on-tint-brand-soft vs tint-brand-soft | `#000000` | `#FCE4EC` | 17.45:1 | 4.5 | yes | yes |
| light | on-tint-caution vs tint-caution | `#000000` | `#FFEDD5` | 18.33:1 | 4.5 | yes | yes |
| light | on-tint-error-hover vs tint-error-hover | `#000000` | `#FFF5F5` | 19.63:1 | 4.5 | yes | yes |
| light | on-tint-error-soft vs tint-error-soft | `#000000` | `#FEF2F2` | 19.20:1 | 4.5 | yes | yes |
| light | on-tint-error-strong vs tint-error-strong | `#000000` | `#FEE2E2` | 17.19:1 | 4.5 | yes | yes |
| light | on-tint-info-hover vs tint-info-hover | `#000000` | `#F0F4FF` | 19.09:1 | 4.5 | yes | yes |
| light | on-tint-info-page vs tint-info-page | `#000000` | `#EEF1F8` | 18.57:1 | 4.5 | yes | yes |
| light | on-tint-info-soft vs tint-info-soft | `#000000` | `#EFF6FF` | 19.30:1 | 4.5 | yes | yes |
| light | on-tint-success-soft vs tint-success-soft | `#000000` | `#F0FDF4` | 20.06:1 | 4.5 | yes | yes |
| light | on-tint-success-strong vs tint-success-strong | `#000000` | `#DCFCE7` | 19.12:1 | 4.5 | yes | yes |
| light | on-tint-warning-banner vs tint-warning-banner | `#000000` | `#FFF3CD` | 18.95:1 | 4.5 | yes | yes |
| light | on-tint-warning-soft vs tint-warning-soft | `#000000` | `#FFFBEB` | 20.25:1 | 4.5 | yes | yes |
| light | on-surface @ medium-emphasis-opacity on surface | `#000000 @ 0.6 = #666666` | `#FFFFFF` | 5.74:1 | 4.5 | yes | yes |
| light | on-surface @ medium-emphasis-opacity on background | `#000000 @ 0.6 = #666666` | `#FFFFFF` | 5.74:1 | 4.5 | yes | yes |
| light | on-surface @ medium-emphasis-opacity on panel | `#000000 @ 0.6 = #646464` | `#FAFAFA` | 5.67:1 | 4.5 | yes | yes |
| light | brand-fg text vs background | `#C8102E` | `#FFFFFF` | 5.88:1 | 4.5 | yes | yes |
| light | brand-fg text vs surface | `#C8102E` | `#FFFFFF` | 5.88:1 | 4.5 | yes | yes |
| light | brand-fg icon vs background | `#C8102E` | `#FFFFFF` | 5.88:1 | 3 | yes | yes |
| light | brand-fg icon vs surface | `#C8102E` | `#FFFFFF` | 5.88:1 | 3 | yes | yes |
| light | brand-fg icon vs panel | `#C8102E` | `#FAFAFA` | 5.64:1 | 3 | yes | yes |
| light | error text vs background | `#B00020` | `#FFFFFF` | 7.33:1 | 4.5 | yes | yes |
| light | error text vs surface | `#B00020` | `#FFFFFF` | 7.33:1 | 4.5 | yes | yes |
| light | error icon vs background | `#B00020` | `#FFFFFF` | 7.33:1 | 3 | yes | yes |
| light | error icon vs surface | `#B00020` | `#FFFFFF` | 7.33:1 | 3 | yes | yes |
| light | error icon vs panel | `#B00020` | `#FAFAFA` | 7.02:1 | 3 | yes | yes |
| light | tw-gray-500 vs surface | `#6B7280` | `#FFFFFF` | 4.83:1 | 4.5 | yes | yes |
| light | tw-gray-700 vs surface | `#374151` | `#FFFFFF` | 10.31:1 | 4.5 | yes | yes |
| dark | on-background vs background | `#FAFAFA` | `#0A0A0A` | 18.97:1 | 4.5 | yes | yes |
| dark | on-surface vs surface | `#FAFAFA` | `#171717` | 17.18:1 | 4.5 | yes | yes |
| dark | on-panel vs panel | `#FFFFFF` | `#262626` | 15.13:1 | 4.5 | yes | yes |
| dark | on-panel-strong vs panel-strong | `#FFFFFF` | `#262626` | 15.13:1 | 4.5 | yes | yes |
| dark | on-page-bg vs page-bg | `#FFFFFF` | `#0A0A0A` | 19.80:1 | 4.5 | yes | yes |
| dark | on-primary vs primary | `#FFFFFF` | `#C8102E` | 5.88:1 | 4.5 | yes | yes |
| dark | on-primary-darken-1 vs primary-darken-1 | `#FFFFFF` | `#A00D24` | 8.15:1 | 4.5 | yes | yes |
| dark | on-tint-warning vs tint-warning | `#FFFFFF` | `#322716` | 14.61:1 | 4.5 | yes | yes |
| dark | on-tint-error vs tint-error | `#FFFFFF` | `#311C1C` | 15.99:1 | 4.5 | yes | yes |
| dark | on-tint-success vs tint-success | `#FFFFFF` | `#182C20` | 14.79:1 | 4.5 | yes | yes |
| dark | on-tint-brand-soft vs tint-brand-soft | `#FFFFFF` | `#311D27` | 15.72:1 | 4.5 | yes | yes |
| dark | on-tint-caution vs tint-caution | `#FFFFFF` | `#322217` | 15.25:1 | 4.5 | yes | yes |
| dark | on-tint-error-hover vs tint-error-hover | `#FFFFFF` | `#311C1C` | 15.99:1 | 4.5 | yes | yes |
| dark | on-tint-error-soft vs tint-error-soft | `#FFFFFF` | `#311C1C` | 15.99:1 | 4.5 | yes | yes |
| dark | on-tint-error-strong vs tint-error-strong | `#FFFFFF` | `#311C1C` | 15.99:1 | 4.5 | yes | yes |
| dark | on-tint-info-hover vs tint-info-hover | `#FFFFFF` | `#1B2432` | 15.61:1 | 4.5 | yes | yes |
| dark | on-tint-info-page vs tint-info-page | `#FFFFFF` | `#1B2432` | 15.61:1 | 4.5 | yes | yes |
| dark | on-tint-info-soft vs tint-info-soft | `#FFFFFF` | `#1B2432` | 15.61:1 | 4.5 | yes | yes |
| dark | on-tint-success-soft vs tint-success-soft | `#FFFFFF` | `#182C20` | 14.79:1 | 4.5 | yes | yes |
| dark | on-tint-success-strong vs tint-success-strong | `#FFFFFF` | `#182C20` | 14.79:1 | 4.5 | yes | yes |
| dark | on-tint-warning-banner vs tint-warning-banner | `#FFFFFF` | `#322716` | 14.61:1 | 4.5 | yes | yes |
| dark | on-tint-warning-soft vs tint-warning-soft | `#FFFFFF` | `#322716` | 14.61:1 | 4.5 | yes | yes |
| dark | on-surface @ medium-emphasis-opacity on surface | `#FAFAFA @ 0.7 = #B6B6B6` | `#171717` | 8.83:1 | 4.5 | yes | yes |
| dark | on-surface @ medium-emphasis-opacity on background | `#FAFAFA @ 0.7 = #B2B2B2` | `#0A0A0A` | 9.34:1 | 4.5 | yes | yes |
| dark | on-surface @ medium-emphasis-opacity on panel | `#FAFAFA @ 0.7 = #BABABA` | `#262626` | 7.83:1 | 4.5 | yes | yes |
| dark | brand-fg text vs background | `#FF6B7F` | `#0A0A0A` | 7.22:1 | 4.5 | yes | yes |
| dark | brand-fg text vs surface | `#FF6B7F` | `#171717` | 6.54:1 | 4.5 | yes | yes |
| dark | brand-fg icon vs background | `#FF6B7F` | `#0A0A0A` | 7.22:1 | 3 | yes | yes |
| dark | brand-fg icon vs surface | `#FF6B7F` | `#171717` | 6.54:1 | 3 | yes | yes |
| dark | brand-fg icon vs panel | `#FF6B7F` | `#262626` | 5.52:1 | 3 | yes | yes |
| dark | error text vs background | `#EF4444` | `#0A0A0A` | 5.26:1 | 4.5 | yes | yes |
| dark | error text vs surface | `#EF4444` | `#171717` | 4.76:1 | 4.5 | yes | yes |
| dark | error icon vs background | `#EF4444` | `#0A0A0A` | 5.26:1 | 3 | yes | yes |
| dark | error icon vs surface | `#EF4444` | `#171717` | 4.76:1 | 3 | yes | yes |
| dark | error icon vs panel | `#EF4444` | `#262626` | 4.02:1 | 3 | yes | yes |
| dark | success text vs background | `#22C55E` | `#0A0A0A` | 8.69:1 | 4.5 | yes | yes |
| dark | success text vs surface | `#22C55E` | `#171717` | 7.87:1 | 4.5 | yes | yes |
| dark | success icon vs background | `#22C55E` | `#0A0A0A` | 8.69:1 | 3 | yes | yes |
| dark | success icon vs surface | `#22C55E` | `#171717` | 7.87:1 | 3 | yes | yes |
| dark | success icon vs panel | `#22C55E` | `#262626` | 6.64:1 | 3 | yes | yes |
| dark | warning text vs background | `#F59E0B` | `#0A0A0A` | 9.22:1 | 4.5 | yes | yes |
| dark | warning text vs surface | `#F59E0B` | `#171717` | 8.35:1 | 4.5 | yes | yes |
| dark | warning icon vs background | `#F59E0B` | `#0A0A0A` | 9.22:1 | 3 | yes | yes |
| dark | warning icon vs surface | `#F59E0B` | `#171717` | 8.35:1 | 3 | yes | yes |
| dark | warning icon vs panel | `#F59E0B` | `#262626` | 7.05:1 | 3 | yes | yes |
| dark | info text vs background | `#3B82F6` | `#0A0A0A` | 5.38:1 | 4.5 | yes | yes |
| dark | info text vs surface | `#3B82F6` | `#171717` | 4.87:1 | 4.5 | yes | yes |
| dark | info icon vs background | `#3B82F6` | `#0A0A0A` | 5.38:1 | 3 | yes | yes |
| dark | info icon vs surface | `#3B82F6` | `#171717` | 4.87:1 | 3 | yes | yes |
| dark | info icon vs panel | `#3B82F6` | `#262626` | 4.11:1 | 3 | yes | yes |
| dark | tw-gray-500 vs surface | `#A3A3A3` | `#171717` | 7.11:1 | 4.5 | yes | yes |
| dark | tw-gray-700 vs surface | `#D4D4D4` | `#171717` | 12.09:1 | 4.5 | yes | yes |
| light | brand-fg text vs panel | `#C8102E` | `#FAFAFA` | 5.64:1 | 4.5 | no | yes |
| light | error text vs panel | `#B00020` | `#FAFAFA` | 7.02:1 | 4.5 | no | yes |
| dark | brand-fg text vs panel | `#FF6B7F` | `#262626` | 5.52:1 | 4.5 | no | yes |
| dark | error text vs panel | `#EF4444` | `#262626` | 4.02:1 | 4.5 | no | no (QA) |
| dark | success text vs panel | `#22C55E` | `#262626` | 6.64:1 | 4.5 | no | yes |
| dark | warning text vs panel | `#F59E0B` | `#262626` | 7.05:1 | 4.5 | no | yes |
| dark | info text vs panel | `#3B82F6` | `#262626` | 4.11:1 | 4.5 | no | no (QA) |
| light | success text vs background | `#4CAF50` | `#FFFFFF` | 2.78:1 | 4.5 | no | no (QA) |
| light | success text vs surface | `#4CAF50` | `#FFFFFF` | 2.78:1 | 4.5 | no | no (QA) |
| light | success text vs panel | `#4CAF50` | `#FAFAFA` | 2.66:1 | 4.5 | no | no (QA) |
| light | success icon vs background | `#4CAF50` | `#FFFFFF` | 2.78:1 | 3 | no | no (QA) |
| light | success icon vs surface | `#4CAF50` | `#FFFFFF` | 2.78:1 | 3 | no | no (QA) |
| light | success icon vs panel | `#4CAF50` | `#FAFAFA` | 2.66:1 | 3 | no | no (QA) |
| light | warning text vs background | `#FB8C00` | `#FFFFFF` | 2.37:1 | 4.5 | no | no (QA) |
| light | warning text vs surface | `#FB8C00` | `#FFFFFF` | 2.37:1 | 4.5 | no | no (QA) |
| light | warning text vs panel | `#FB8C00` | `#FAFAFA` | 2.27:1 | 4.5 | no | no (QA) |
| light | warning icon vs background | `#FB8C00` | `#FFFFFF` | 2.37:1 | 3 | no | no (QA) |
| light | warning icon vs surface | `#FB8C00` | `#FFFFFF` | 2.37:1 | 3 | no | no (QA) |
| light | warning icon vs panel | `#FB8C00` | `#FAFAFA` | 2.27:1 | 3 | no | no (QA) |
| light | info text vs background | `#2196F3` | `#FFFFFF` | 3.12:1 | 4.5 | no | no (QA) |
| light | info text vs surface | `#2196F3` | `#FFFFFF` | 3.12:1 | 4.5 | no | no (QA) |
| light | info text vs panel | `#2196F3` | `#FAFAFA` | 2.99:1 | 4.5 | no | no (QA) |
| light | info icon vs background | `#2196F3` | `#FFFFFF` | 3.12:1 | 3 | no | yes |
| light | info icon vs surface | `#2196F3` | `#FFFFFF` | 3.12:1 | 3 | no | yes |
| light | info icon vs panel | `#2196F3` | `#FAFAFA` | 2.99:1 | 3 | no | no (QA) |
| dark | muted-strong text vs surface | `#B6B6B6` | `#171717` | 8.84:1 | 4.5 | no | yes |
| dark | muted text vs surface | `#A3A3A3` | `#171717` | 7.11:1 | 4.5 | no | yes |
| dark | caution-fg text vs surface | `#FB923C` | `#171717` | 7.92:1 | 4.5 | no | yes |
| dark | proposed-fg text vs surface | `#FB923C` | `#171717` | 7.92:1 | 4.5 | no | yes |
| dark | consent-fg text vs surface | `#FBBF24` | `#171717` | 10.74:1 | 4.5 | no | yes |
| dark | filetype-pdf-fg icon vs surface | `#F87171` | `#171717` | 6.48:1 | 3 | no | yes |
| dark | filetype-doc-fg icon vs surface | `#60A5FA` | `#171717` | 7.05:1 | 3 | no | yes |
| dark | filetype-sheet-fg icon vs surface | `#4ADE80` | `#171717` | 10.29:1 | 3 | no | yes |
| dark | filetype-slides-fg icon vs surface | `#FB923C` | `#171717` | 7.92:1 | 3 | no | yes |
| dark | filetype-image-fg icon vs surface | `#D8B4FE` | `#171717` | 10.14:1 | 3 | no | yes |
| dark | notice-info-fg text vs surface | `#60A5FA` | `#171717` | 7.05:1 | 4.5 | no | yes |
| dark | radio-checked-border text vs surface | `#D4D4D4` | `#171717` | 12.09:1 | 4.5 | no | yes |
| dark | radio-checked-border icon vs surface | `#D4D4D4` | `#171717` | 12.09:1 | 3 | no | yes |
| dark | radio-checked-fill text vs surface | `#A3A3A3` | `#171717` | 7.11:1 | 4.5 | no | yes |
| dark | radio-checked-fill icon vs surface | `#A3A3A3` | `#171717` | 7.11:1 | 3 | no | yes |
| dark | checklist-done-fg text vs surface | `#86EFAC` | `#171717` | 12.77:1 | 4.5 | no | yes |
| dark | checklist-todo-fg text vs surface | `#FCA5A5` | `#171717` | 9.45:1 | 4.5 | no | yes |
| dark | link-fg text vs surface | `#60A5FA` | `#171717` | 7.05:1 | 4.5 | no | yes |
| dark | link-hover-fg text vs surface | `#93C5FD` | `#171717` | 9.94:1 | 4.5 | no | yes |
| dark | link-soft-fg text vs surface | `#60A5FA` | `#171717` | 7.05:1 | 4.5 | no | yes |
| dark | banner-caution-fg text vs surface | `#FB923C` | `#171717` | 7.92:1 | 4.5 | no | yes |
| dark | banner-success-fg text vs surface | `#4ADE80` | `#171717` | 10.29:1 | 4.5 | no | yes |
| dark | required-fg text vs surface | `#F87171` | `#171717` | 6.48:1 | 4.5 | no | yes |
| dark | brand-fg-strong icon vs surface | `#FF6B7F` | `#171717` | 6.54:1 | 3 | no | yes |
| dark | complete-fg text vs surface | `#4ADE80` | `#171717` | 10.29:1 | 4.5 | no | yes |
| dark | section-partners-fg icon vs surface | `#34D399` | `#171717` | 9.33:1 | 3 | no | yes |
| dark | section-impact-fg icon vs surface | `#FB923C` | `#171717` | 7.92:1 | 3 | no | yes |
| dark | section-poster-fg icon vs surface | `#A78BFA` | `#171717` | 6.59:1 | 3 | no | yes |
| dark | hint-info-fg text vs surface | `#60A5FA` | `#171717` | 7.05:1 | 4.5 | no | yes |
| dark | found-notice-fg text vs surface | `#60A5FA` | `#171717` | 7.05:1 | 4.5 | no | yes |
| dark | status-success-fg text vs surface | `#4ADE80` | `#171717` | 10.29:1 | 4.5 | no | yes |
| dark | status-failed-fg text vs surface | `#F87171` | `#171717` | 6.48:1 | 4.5 | no | yes |
| dark | validation-error-fg text vs surface | `#F87171` | `#171717` | 6.48:1 | 4.5 | no | yes |
| dark | accent-fg text vs surface | `#818CF8` | `#171717` | 6.01:1 | 4.5 | no | yes |
| dark | accent-hover-fg text vs surface | `#818CF8` | `#171717` | 6.01:1 | 4.5 | no | yes |
| dark | alert-accent-fg text vs surface | `#818CF8` | `#171717` | 6.01:1 | 4.5 | no | yes |
| dark | status-banner-warning-fg text vs surface | `#FACC15` | `#171717` | 11.71:1 | 4.5 | no | yes |
| dark | proposed-banner-fg text vs surface | `#FB923C` | `#171717` | 7.92:1 | 4.5 | no | yes |
| dark | tip-fg text vs surface | `#D4D4D4` | `#171717` | 12.09:1 | 4.5 | no | yes |
| dark | label-strong-fg text vs surface | `#D4D4D4` | `#171717` | 12.09:1 | 4.5 | no | yes |
| dark | label-soft-fg text vs surface | `#A3A3A3` | `#171717` | 7.11:1 | 4.5 | no | yes |
| dark | field-label-fg text vs surface | `#A3A3A3` | `#171717` | 7.11:1 | 4.5 | no | yes |
| dark | hint-fg text vs surface | `#A3A3A3` | `#171717` | 7.11:1 | 4.5 | no | yes |
| dark | error-fg text vs surface | `#F87171` | `#171717` | 6.48:1 | 4.5 | no | yes |
| dark | error-fg icon vs surface | `#F87171` | `#171717` | 6.48:1 | 3 | no | yes |
| dark | info-fg text vs surface | `#60A5FA` | `#171717` | 7.05:1 | 4.5 | no | yes |
| dark | info-fg icon vs surface | `#60A5FA` | `#171717` | 7.05:1 | 3 | no | yes |

**Text vs panel, listed for human QA (not gated):**

- dark error text vs panel: `#EF4444` on `#262626` = 4.02:1 (known shortfall (Appendix B))
- dark info text vs panel: `#3B82F6` on `#262626` = 4.11:1 (known shortfall (Appendix B))

**Light success/warning/info (not gated):** Vuetify's defaults, kept by G3 and decision 8, unchanged from today (plan: 2.27–3.12:1). All pairs 2.27–3.12:1; as text on background/surface 2.37–3.12:1.

Extra text/icon keys (not gated; §6.3 missing-key rule, dark vs `#171717`): `muted-strong`, `muted`, `caution-fg`, `proposed-fg`, `consent-fg`, `filetype-pdf-fg`, `filetype-doc-fg`, `filetype-sheet-fg`, `filetype-slides-fg`, `filetype-image-fg`, `notice-info-fg`, `radio-checked-border`, `radio-checked-fill`, `checklist-done-fg`, `checklist-todo-fg`, `link-fg`, `link-hover-fg`, `link-soft-fg`, `banner-caution-fg`, `banner-success-fg`, `required-fg`, `brand-fg-strong`, `complete-fg`, `section-partners-fg`, `section-impact-fg`, `section-poster-fg`, `hint-info-fg`, `found-notice-fg`, `status-success-fg`, `status-failed-fg`, `validation-error-fg`, `accent-fg`, `accent-hover-fg`, `alert-accent-fg`, `status-banner-warning-fg`, `proposed-banner-fg`, `tip-fg`, `label-strong-fg`, `label-soft-fg`, `field-label-fg`, `hint-fg`, `error-fg`, `info-fg`. keys-extra.json: reports/keys-extra.json.

Opaque keys (§6.3): a gated pair that uses a translucent key fails here; G3's key-format check covers every key.

Never change a built-in color, a §9-locked value or a kept literal to pass G4 (Appendix B).
