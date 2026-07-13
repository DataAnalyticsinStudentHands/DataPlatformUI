# Design Plan — Claude Skills for a DataPlatformUI Sibling App

> **Goal:** Produce a set of `.claude/skills/<skill>/SKILL.md` files that capture the shared code philosophy and infrastructure of `DataPlatformUI`, written generically enough to be dropped into a sibling Vue 3 app with a different domain purpose.
>
> **How this plan is used:** Each of the 7 skills below will be implemented in its **own Claude Code session** by another agent (or set of agents). This document is the single source of truth those sessions read first. It tells them what to write, what NOT to write, where to look in the source repo, and how their skill relates to the others.

---

## 1. Why this plan exists

The user has a working Vue 3 frontend (`DataPlatformUI`) and is starting a sibling Vue 3 app that should reuse the same architecture and code philosophy but serve a different domain. Rather than re-deriving conventions from scratch in the new repo, the user wants a curated set of Claude skills that codify the shared patterns so any future agent working in either repo applies them consistently.

Skills must be **transferable infrastructure**, not DataPlatformUI-specific. The new app does not have "students," "instructors," or "project view editors" — so skills that name those domains are wrong. Skills should describe the **shape** of the pattern (e.g., "multi-step editor with debounced auto-save") and use DataPlatformUI only as a referenceable example.

User-confirmed parameters for this design:
- **Generalize patterns** (no DataPlatformUI-specific domain names in skill bodies)
- **Coarse granularity** (~5–7 skills, bundling related concerns)
- **Include gap skills** (testing and type-safety, even though absent in DataPlatformUI today)

---

## 2. Shared conventions every skill session must follow

These rules apply to **every** skill file written from this plan. Treat them as hard requirements.

### 2.1 File location and format
- Path: `.claude/skills/<skill-name>/SKILL.md` (kebab-case directory matching the skill name from this plan)
- Frontmatter (YAML) at the top:
  ```yaml
  ---
  name: <skill-name>
  description: One-line trigger statement — when Claude should invoke this skill. Be specific about the situations.
  ---
  ```
- The `description` is read by the harness to decide when to load the skill — it should name concrete triggers ("when adding an axios service module," "when wiring a route guard"), not vague topics ("about state").

### 2.2 Style
- Length target: **400–800 lines** per skill. Below 400 means it's probably under-developed; above 800 means it's probably bloated or covering too much.
- Tone: imperative and pattern-focused. "Do X because Y. Avoid Z because W." Not tutorial. Not reference-doc dry.
- Code samples: small, illustrative, Vue 3 `<script setup>` style. Show the shape, not a runnable example.
- **No DataPlatformUI domain names** in the skill body. Refer to "the source repo" or "the reference implementation" if you need to cite something concrete; never "the project view editor," "students," or "instructors." (Generic concepts like "the user" or "an authenticated user" are fine.)
- Cross-reference sibling skills by name in plain prose ("see `api-services-and-auth` for service-layer conventions"). Don't invent file paths to other skills.

### 2.3 Structure inside each SKILL.md
Each skill should have these sections, in this order:

1. **When to use this skill** — concrete trigger list (3–8 bullets). Mirrors the frontmatter `description` but expanded.
2. **Core philosophy** — 3–6 short paragraphs on the principles that drive the patterns. Why these choices, not just what.
3. **Patterns** — the meat of the file. Each pattern gets a `### Pattern: <name>` heading, a "when," a "how," and an "anti-pattern to avoid" note. 5–10 patterns per skill.
4. **Decision rubrics** — when there are competing options (mixin vs. composable, PUT vs. PATCH, store vs. prop), give a short decision rule.
5. **Interactions with other skills** — 3–6 bullets naming which other skills in this set this one connects to, and how.
6. **Source-repo anchors** *(optional, last section)* — a short list of files in `DataPlatformUI` the agent can read to see a working example, prefixed with `(reference only — patterns are generalized in this skill)`.

### 2.4 Things every skill should explicitly NOT do
- Don't describe the build/dev/deploy setup (that's skill #6's job).
- Don't describe testing setup unless the skill is #7.
- Don't include long lists of npm packages — name the package only when it materially shapes the pattern.
- Don't write "Step 1, Step 2, Step 3" tutorials. The audience is an agent reasoning from patterns, not a human following instructions.

### 2.5 Generalization safety check
Before finalizing the skill, run a find for these strings — if any hit, revise:
- `student`, `instructor`, `project view`, `project-view`, `projectView`, `Clowder`, `SharePoint`, `featured project`, `experience registration`, `KPI`, `entry form`, `exit form`, `goal-setting`
- Brand color `#c8102e` (mention "a single brand color" instead)
- Specific URLs / endpoint paths from the source repo (talk about "the auth endpoint" not "/userdata/login")

---

## 3. Reference codebase: where the patterns live

Every session will start with read-only exploration of `DataPlatformUI` to ground its skill in real code. To save each session re-discovering the same files, here is the authoritative map of where each pattern lives in the source repo. **Cite these paths in the "Source-repo anchors" section** of your skill, not in the body.

| Pattern area | Files |
|---|---|
| App bootstrap | [src/main.js](src/main.js), [src/App.vue](src/App.vue) |
| Routing & guards | [src/router/index.js](src/router/index.js) (long file — has `requireAuth`, `isPublicPath`, route definitions) |
| Pinia stores | [src/stored/loggedInUser.js](src/stored/loggedInUser.js), [src/stored/studentViews.js](src/stored/studentViews.js), [src/stored/instructorViews.js](src/stored/instructorViews.js) |
| Composables | [src/composables/useNotificationPolling.js](src/composables/useNotificationPolling.js), [src/composables/useAdaptiveLayout.js](src/composables/useAdaptiveLayout.js) |
| Mixins | [src/mixins/handleErrorMixin.js](src/mixins/handleErrorMixin.js) |
| Auth & JWT | [src/auth/tokenRefresh.js](src/auth/tokenRefresh.js), [src/auth/jwtVerifier.js](src/auth/jwtVerifier.js) |
| Service layer | [src/components/studentSide/projectView/services/projectViewFormService.js](src/components/studentSide/projectView/services/projectViewFormService.js), [src/components/instructorSide/featuredProjects/services/featuredProjectsService.js](src/components/instructorSide/featuredProjects/services/featuredProjectsService.js) |
| Multi-step editor & section registry | [src/components/studentSide/projectView/ProjectEditorMain.vue](src/components/studentSide/projectView/ProjectEditorMain.vue), [src/components/studentSide/projectView/types/sectionTypes.js](src/components/studentSide/projectView/types/sectionTypes.js), [src/components/studentSide/projectView/SectionConfigurator.vue](src/components/studentSide/projectView/SectionConfigurator.vue), [src/components/studentSide/projectView/ProjectForm.vue](src/components/studentSide/projectView/ProjectForm.vue) |
| File upload & validation | [src/utils/fileValidation.js](src/utils/fileValidation.js), [src/components/studentSide/projectView/FileUploader.vue](src/components/studentSide/projectView/FileUploader.vue) |
| Image cropping | [src/components/reusable/AvatarCropperDialog.vue](src/components/reusable/AvatarCropperDialog.vue), [src/components/reusable/IconCropperDialog.vue](src/components/reusable/IconCropperDialog.vue) |
| Styling | [src/index.css](src/index.css), [tailwind.config.js](tailwind.config.js) |
| Build & env | [vite.config.js](vite.config.js), [package.json](package.json), `.env` files |
| Reusable UI components | [src/components/reusable/](src/components/reusable/) |
| i18n | i18n init in [src/main.js](src/main.js), locale files referenced from there |

If a session needs to find a pattern that isn't in this table, it should use `Glob`/`Grep` rather than the `Explore` agent — these files are small and the table covers the architecturally meaningful ones.

---

## 4. The 7 skills — per-session briefs

Each subsection below is a **self-contained brief** for one Claude Code session. Spinning up a session to write skill #N should require nothing more than this plan plus read-only access to the source repo.

---

### Skill 1 — `frontend-architecture`

**One-line description (for frontmatter):**
Use when scaffolding the Vue 3 app, wiring plugins, structuring directories, or adding routes/route guards.

**When to invoke this skill:**
- Setting up `main.js` and plugin registration order
- Adding or restructuring top-level directories under `src/`
- Defining or modifying vue-router routes, guards, or lazy-loading patterns
- Deciding "where does this new file go?" at the project-layout level

**What this skill must cover:**
- Vue 3 + Vite stack with rationale (why these, not Nuxt / not Create-Vue)
- App bootstrap order in `main.js`: Vuetify → Pinia → Router → i18n → axios defaults → toastify, then **await user-store hydration** before `app.mount()`
- The **deferred mount** pattern — why it exists (auth-state ready on first render) and when to use it
- Project layout: `src/components/<domain>/`, colocated `services/` subdirs near consumers, top-level `src/composables/`, `src/utils/`, `src/stored/`, `src/auth/`, `src/mixins/`, `src/router/`, `src/i18n/`
- vue-router conventions: lazy-loaded route components (`() => import(...)`), nested auth wrapper for login/register children, global `router.beforeEach` for redirect-when-authenticated logic
- Public-path detection (`isPublicPath`, `isPublicDataPath`) — pattern for routes that bypass auth redirect
- Path aliases (`@` → `./src`)
- Decision rubric: new directory vs. nest in existing domain; when a component graduates from a domain folder to `reusable/`

**What this skill must NOT cover (defer to another skill):**
- Pinia store internals → `state-and-composables`
- Axios setup details → `api-services-and-auth`
- Vite config knobs → `build-dev-and-deployment`
- Vuetify/Tailwind styling → `ui-design-system-and-feedback`

**Generalization notes:**
- The source repo uses `src/stored/` (note: not the conventional `src/stores/`). Mention this is a deliberate naming choice in the source repo and the sibling app may choose either; recommend whichever the team picks should be applied consistently.
- The `/platform/` base path is source-app-specific — describe as "an optional non-root base path if the app is mounted as a sub-app behind a reverse proxy."

**Source-repo anchors to cite:**
- [src/main.js](src/main.js)
- [src/router/index.js](src/router/index.js)
- [vite.config.js](vite.config.js)

**Cross-references to add at the end:**
- `state-and-composables` — for what to do *inside* `initializeStore()`
- `api-services-and-auth` — for the axios `withCredentials` defaults set in `main.js`
- `build-dev-and-deployment` — for the Vite-side concerns

---

### Skill 2 — `state-and-composables`

**One-line description (for frontmatter):**
Use when designing Pinia stores, deciding what to persist, building composables, or choosing between store / composable / props for shared logic.

**When to invoke this skill:**
- Adding a new Pinia store or splitting an existing one
- Persisting state across reloads (and deciding what *not* to persist)
- Writing a `useXxx` composable
- Refactoring duplicated cross-component reactive logic
- Choosing between a mixin and a composable

**What this skill must cover:**
- Pinia store conventions: state / getters / actions split, `<script setup>`-style or options-style stores
- `pinia-plugin-persistedstate` setup: per-store opt-in, picking specific paths to persist
- **Store-type separation**: domain/user-state stores (e.g. logged-in user) vs. view-state stores (sorting, filters, pagination, tab selection). Why splitting them prevents view resets from nuking auth.
- `initializeStore()` pattern: hydrate user state from an authenticated endpoint at boot, with a `_skipRefreshCheck` flag-equivalent to avoid auth-refresh loops
- Pinia plugin to inject services (e.g., a `$router` reference) into all stores; mark injected non-reactive things as raw
- Composables for cross-component reactive logic (polling intervals, `ResizeObserver`-based adaptive layout, etc.). Convention: `useXxx` named export, returns reactive refs + functions, cleans up in `onUnmounted`.
- Mixins for global injections like an error-handler method available via `this.handleError(...)`. Used sparingly; mostly when you want it injected into all Options-API components without import.
- Decision rubric: **store** for state shared across unrelated routes; **composable** for behavior shared across components that each instantiate their own copy; **props** for parent-child state.

**What this skill must NOT cover:**
- Auth-store specifics (token expiry tracking, RBAC) → `api-services-and-auth`
- Form-state stores → `forms-files-and-editors`

**Generalization notes:**
- Mention `pinia-plugin-persistedstate` by name (it materially shapes the pattern); other named packages should be omitted.

**Source-repo anchors to cite:**
- [src/stored/loggedInUser.js](src/stored/loggedInUser.js)
- [src/stored/studentViews.js](src/stored/studentViews.js)
- [src/composables/useNotificationPolling.js](src/composables/useNotificationPolling.js)
- [src/composables/useAdaptiveLayout.js](src/composables/useAdaptiveLayout.js)
- [src/mixins/handleErrorMixin.js](src/mixins/handleErrorMixin.js)

**Cross-references:**
- `frontend-architecture` — for where stores/composables live in the project layout
- `api-services-and-auth` — for the auth-store half of the user state
- `ui-design-system-and-feedback` — for the polling-toast composable interaction

---

### Skill 3 — `api-services-and-auth`

**One-line description (for frontmatter):**
Use when adding/modifying an axios call, writing or extending a service module, debugging auth, wiring a new role/route guard, or changing the token-refresh flow.

**When to invoke this skill:**
- Adding a new API endpoint consumer
- Creating a new service module under a feature
- Wiring or debugging auth (login, logout, token refresh, 401 handling)
- Adding a new role to the RBAC scheme or a new `requireAuth([...])` guard
- Mapping frontend↔backend field-name differences

**What this skill must cover:**
- **Axios global config**: `withCredentials: true` (HttpOnly cookie auth), base URL from `import.meta.env.VITE_ROOT_API`, global token-header pattern (legacy — describe as a fallback only; cookie auth is primary)
- **Service-layer convention**: one module per feature, colocated near consumers in a `services/` subdirectory, exporting plain async functions that wrap axios calls and unwrap response shapes (e.g., `{ project: {...} }` → just the inner object)
- **Field-mapping pattern**: bidirectional `toBackendFormat()` / `fromBackendFormat()` with `id ↔ _id`, temporary-id detection via regex (e.g., `^\d+-[a-z0-9]+$`), stripping of server-managed fields (URLs, timestamps, createdBy) on outbound requests
- **Auth flow**: HttpOnly session cookie + JWT, client-side JWT verification (RS256 with a base64-encoded public key in env), expiry tracking as a Unix-epoch `tokenExp` value on the user store
- **Token-refresh pattern** (the hard one — describe in detail):
  - Proactive refresh ~5 minutes before expiry via a scheduled timer
  - Response interceptor retries once on 401 after a forced refresh
  - **Singleton in-flight refresh promise** to prevent concurrent refreshes from a burst of parallel requests
  - A flag (e.g., `_skipRefreshCheck`) attached to the refresh endpoint's own request so it doesn't recursively try to refresh itself
- **Logout**: best-effort POST to the logout endpoint, then clear persisted Pinia keys (`pinia-loggedInUser`), reset stores, redirect
- **RBAC**: `requireAuth([roles])` higher-order guard factory, role hierarchies (e.g., admin > instructor > student equivalents), conditional rendering helpers, role-based menu/redirect logic
- **Error handling at the service boundary**: when to throw, when to return shaped `{ ok: false, error }`, when to let axios errors bubble to a global handler
- HTTP-verb conventions: PUT for full replacement, PATCH for partial, POST for creates, DELETE for deletes; status-transition endpoints as PATCH with `{ status: '...' }`
- Decision rubric: putting an endpoint in a per-feature service file vs. a global one (default to per-feature, colocated)

**What this skill must NOT cover:**
- `FormData` / file-upload payload construction → `forms-files-and-editors`
- Toast styling on errors → `ui-design-system-and-feedback`

**Generalization notes:**
- The source repo has both legacy `axios.defaults.headers['token']` and modern HttpOnly cookie auth — describe both, mark cookies as the recommended path for new apps, the header as a legacy/transition pattern.
- Role names from the source repo (Student, Instructor, Group Instructor, Group Admin, Org Admin, Basic) must NOT appear in the skill body. Use placeholders like "role A," "admin role," "end-user role."

**Source-repo anchors to cite:**
- [src/auth/tokenRefresh.js](src/auth/tokenRefresh.js)
- [src/auth/jwtVerifier.js](src/auth/jwtVerifier.js)
- [src/components/studentSide/projectView/services/projectViewFormService.js](src/components/studentSide/projectView/services/projectViewFormService.js) (cite as "a representative service module")
- Route guards in [src/router/index.js](src/router/index.js)

**Cross-references:**
- `frontend-architecture` — where axios defaults are set in bootstrap
- `state-and-composables` — for the user-store side of auth state
- `forms-files-and-editors` — for upload-flavored service calls
- `testing-and-type-safety` — for typed service responses & mocked-axios tests

---

### Skill 4 — `forms-files-and-editors`

**One-line description (for frontmatter):**
Use when building any form more complex than a single text field, designing a multi-step wizard, adding file uploads or image cropping, or designing a configurable "build-from-blocks" editor.

**When to invoke this skill:**
- Building or modifying a `v-form` with multiple fields and validation
- Designing a multi-step wizard / editor flow
- Adding debounced auto-save to a form
- Adding file uploads (avatars, posters, documents) — anything with `FormData`
- Adding image cropping
- Building a section/block-based document editor (anything where users compose a page from optional, ordered blocks)

**What this skill must cover:**
- Vuetify `v-form` patterns: inline `:rules` validator arrays, named refs to call `validate()` programmatically
- Vuelidate for multi-field/cross-field validation — when to reach for it instead of Vuetify inline rules
- **Multi-step wizard architecture**: a step-state container (current step + per-step validity), navigation between steps, per-step validation gating "next," a terminal "preview & submit" step
- **Modular section/block editor** (generalized from the source repo's section system):
  - A **section registry** that defines available section types — each with metadata (order, layout zone, mandatory vs. optional, default config)
  - Helper functions to query the registry (by state, by zone, by display order)
  - Mandatory sections are always present and not toggleable; optional sections users enable/disable in a configurator step
  - Modular per-section form components that each own their input UI
- **Debounced auto-save**:
  - ~2-second debounce on input changes
  - Explicit status state machine: `idle` → `saving` → `saved` | `error`
  - Backend-ID reconciliation after the first save (frontend temp ID swapped for the real ID returned in the response)
  - Disable manual submit while saving
  - Save only on the form-fill step, not on configurator or preview steps
- **File upload pipeline**:
  - `FormData` multipart construction with the file plus any metadata
  - Per-endpoint size/type limits as a small declarative table
  - **Magic-number validation** (sniff the first bytes of the file) — not just file-extension or MIME-type, because both are user-controlled
  - Drag-and-drop component contract
  - Preview UI for images (inline `<img>`) and PDFs (embed or icon card)
  - File uploads deferred to the auto-save cycle (not a separate immediate upload), so the user's "save" point is consistent
- **Image cropping**: `vue-advanced-cropper` with circle stencil for avatars, rect stencil for posters, returning a `File` object that flows through the same upload pipeline
- Decision rubric: server-managed fields vs. client-editable fields (server-managed = never in the outbound payload)

**What this skill must NOT cover:**
- Service-layer wrapping of the uploads → `api-services-and-auth`
- Visual styling of file-upload UI → `ui-design-system-and-feedback`

**Generalization notes:**
- Don't name specific section types from the source repo (no "hero," "milestones," "poster," "findings" by name). Instead describe them by role: "a mandatory header section," "an optional timeline section," etc.
- The 2-second debounce duration is a sensible default — present it as the recommendation, not as a hard rule.

**Source-repo anchors to cite:**
- [src/components/studentSide/projectView/ProjectEditorMain.vue](src/components/studentSide/projectView/ProjectEditorMain.vue)
- [src/components/studentSide/projectView/types/sectionTypes.js](src/components/studentSide/projectView/types/sectionTypes.js)
- [src/components/studentSide/projectView/SectionConfigurator.vue](src/components/studentSide/projectView/SectionConfigurator.vue)
- [src/utils/fileValidation.js](src/utils/fileValidation.js)
- [src/components/reusable/AvatarCropperDialog.vue](src/components/reusable/AvatarCropperDialog.vue)

**Cross-references:**
- `api-services-and-auth` — for the service calls the auto-save invokes
- `state-and-composables` — for any cross-step state shared via a store
- `ui-design-system-and-feedback` — for dialogs hosting the cropper, toasts on save status

---

### Skill 5 — `ui-design-system-and-feedback`

**One-line description (for frontmatter):**
Use for any visual styling, theming, layout, dialog/modal, toast/notification, loading-state, or i18n decision.

**When to invoke this skill:**
- Styling a new component
- Adding a dialog or modal
- Showing a toast / notification
- Adding a loading state
- Theming or adjusting brand colors
- Adding a new locale or `$t()`-wrapped string

**What this skill must cover:**
- **Vuetify 3 + Tailwind hybrid usage**:
  - Tailwind for layout, spacing, utility classes
  - Vuetify for components (buttons, inputs, data tables, dialogs, navigation)
  - Scoped CSS overrides for Vuetify internals when Tailwind can't reach them (e.g., transparent input backgrounds)
  - Rule: don't replicate Vuetify components with Tailwind-only equivalents; don't replicate Tailwind layout with Vuetify's grid when not needed
- **Theming**: a single brand color configured through `vuetify.theme`, with semantic color names (`primary`, `error`, etc.) layered on top; gradient backgrounds and sidebar styling reference the theme color, not a hard-coded hex
- **Responsive layout**:
  - Vuetify `useDisplay()` for breakpoint checks in script
  - Tailwind responsive prefixes (`md:`, `lg:`) for class-level adjustments
  - `ResizeObserver`-based composable for adaptive layouts where breakpoint-only logic isn't enough (e.g., reflowing content based on actual element heights)
- **Dialogs & modals**: `v-dialog` patterns, sizing conventions, scrollable content, close-on-escape behavior, where reusable dialog components live (`src/components/reusable/`)
- **Reusable component library**: criteria for promoting a component to `reusable/` (used by ≥2 unrelated domains)
- **Toast notifications** via `vue3-toastify`:
  - Semantic CSS classes for action type — green for create, blue for update, red for delete (e.g. `Toastify__toast--create`, `Toastify__toast--update`, `Toastify__toast--delete`)
  - Standard call shape: `toast.error(msg, { position: 'top-right', toastClassName: 'Toastify__toast--delete' })`
  - When to use a toast vs. inline error message vs. a dialog
- **Loading-state UX**: boolean flags driving button `disabled` states, skeleton placeholders, when to use a spinner vs. a skeleton
- **i18n setup** with `vue-i18n`:
  - Locale files in a known location, fallback locale (English typical)
  - `$t('key')` in templates, `t()` from `useI18n()` in `<script setup>`
  - Convention: wrap user-facing strings in `$t()` from the start, even if only one locale is shipped initially

**What this skill must NOT cover:**
- The form-state behaviors driving the loading flags → `forms-files-and-editors`
- The error-handling logic that decides whether to fire an error toast → `api-services-and-auth`

**Generalization notes:**
- The source repo's brand color (`#c8102e`) must not appear. Describe as "a single brand color."
- The mixed Tailwind+Vuetify approach is opinionated — present it as the source repo's chosen pattern; the sibling app should follow it for consistency unless there's a strong reason not to.

**Source-repo anchors to cite:**
- [src/App.vue](src/App.vue)
- [src/index.css](src/index.css)
- [tailwind.config.js](tailwind.config.js)
- [src/components/reusable/](src/components/reusable/)
- i18n init block in [src/main.js](src/main.js)

**Cross-references:**
- `frontend-architecture` — for where reusable components live
- `state-and-composables` — for `useAdaptiveLayout`-style composables
- `forms-files-and-editors` — for cropper dialogs hosted by `v-dialog`

---

### Skill 6 — `build-dev-and-deployment`

**One-line description (for frontmatter):**
Use for Vite/env/config changes, dev-server setup, production builds, lint config, or deployment work.

**When to invoke this skill:**
- Changing `vite.config.js`
- Adding or modifying `.env` / `.env.production`
- Editing `package.json` scripts
- Setting up linting or formatting
- Configuring deployment (PM2, CI, hosting)

**What this skill must cover:**
- Vite config: `@vitejs/plugin-vue`, `vite-plugin-vuetify`, path aliases (`@` → `./src`), build output directory, **sourcemap policy off in prod**, optional base path for sub-app mounting
- `.env` conventions: `VITE_` prefix required to expose to the client, common variables (API base URL, public key for JWT verification, feature flags), `.env.production` overrides, never commit secrets
- Runtime env access via `import.meta.env.VITE_XXX`
- npm scripts: `dev` (Vite dev server), `build` (production build), `serve` (Vite preview)
- ESLint config: Vue 3 essential + recommended rules, Prettier integration
- **PM2 deployment** via `ecosystem.config.js`: pattern for serving the built static assets, log paths, restart policy
- **CI gap**: the source repo has no CI workflow. Recommend GitHub Actions for the sibling app: run lint, build, and (per skill 7) tests on every PR.
- Decision rubric: when an env var should be `VITE_`-prefixed (client-readable) vs. baked at build time vs. delivered via a runtime config endpoint (for things that vary per deploy without rebuilding)

**What this skill must NOT cover:**
- Test runner config → `testing-and-type-safety`
- The semantic content of env vars (like which auth endpoint URL) → `api-services-and-auth`

**Source-repo anchors to cite:**
- [vite.config.js](vite.config.js)
- [package.json](package.json)
- `ecosystem.config.js` if present
- `.eslintrc` if present

**Cross-references:**
- `frontend-architecture` — for the bootstrap that consumes these env vars
- `testing-and-type-safety` — for where in the npm-scripts pipeline tests live

---

### Skill 7 — `testing-and-type-safety` *(gap skill — new for sibling app)*

**One-line description (for frontmatter):**
Use when adding tests of any kind, setting up TypeScript or JSDoc type-checking, or making decisions about test coverage strategy.

**When to invoke this skill:**
- Adding a unit test for a component, composable, or service
- Setting up the test runner for the first time
- Writing an end-to-end test
- Migrating a file from JS to TS, or adding JSDoc type hints
- Designing the test coverage policy

**What this skill must cover:**
- **Why** the sibling app should have tests when the source repo does not: regression confidence on shared infrastructure (auth, auto-save, field mapping) where bugs are silent and expensive
- **Unit testing**:
  - Vitest as the runner, jsdom environment for component tests
  - `@vue/test-utils` for mounting components
  - Conventions: `*.spec.js` (or `.ts`) colocated with source, one describe-block per public function or component
  - Mocking axios at the boundary (intercept via `vi.mock`); never mock Pinia internals, just hydrate stores in the test setup
- **Service-layer tests** specifically: exercise the bidirectional field mappers from `api-services-and-auth` — these are the highest-leverage tests because they catch the silent serialization bugs
- **End-to-end testing**:
  - Pick **one** of Playwright (recommended) or Cypress; don't mix
  - Cover at minimum: the auth flow (login → authenticated route → logout), one multi-step editor end-to-end, one file-upload flow
  - Run e2e against a real (test) backend, not mocks — that's where mocked-unit tests fall down
- **Type safety options** — present as a choice:
  - **TypeScript migration** (recommended for the sibling app): `<script setup lang="ts">`, typed Pinia stores via the generic store API, typed axios response types, a shared `src/types/api.ts` module describing API contracts
  - **JSDoc + `// @ts-check`**: lower-cost alternative if TS migration is too heavy, gives editor IntelliSense without full migration
  - Either way: the **service layer is the highest-value place** to type, because it's the boundary where wire types meet UI types
- **Coverage philosophy**: target ~80%+ on services, composables, and validators; lighter on Vue components; snapshot tests used sparingly (they rot)
- **CI integration**: run unit tests on every PR, run e2e on main-branch merges, fail the build on lint errors
- Decision rubric: a bug bisects to a service file → write a unit test there. A bug bisects to a multi-component interaction → write an e2e. A bug bisects to a single component's rendering → consider whether a component test is worth the upkeep or whether the type system would have caught it.

**What this skill must NOT cover:**
- General CI/CD pipeline setup beyond the test job → `build-dev-and-deployment`

**Generalization notes:**
- No source-repo anchors — this is greenfield for the sibling app. The "Source-repo anchors" section may be omitted or replaced with "No reference implementation — this skill prescribes patterns for the sibling app to adopt."

**Cross-references:**
- `api-services-and-auth` — service-layer tests target field mappers and auth flow
- `forms-files-and-editors` — the auto-save state machine is a prime e2e candidate
- `build-dev-and-deployment` — where tests slot into the npm scripts and CI

---

## 5. Workflow for each skill-writing session

When the user opens a new session to write one of the 7 skills, the agent in that session should:

1. **Read this file end-to-end** (`Design_Plan_Skills.md`). It's the single source of truth.
2. **Read the source-repo anchors** for its skill listed in section 4, plus the relevant rows of the table in section 3. No `Explore` agent needed — the file list is already curated.
3. **Skim sibling skills** if any have already been written, to keep tone and structure consistent.
4. **Draft the SKILL.md** under `.claude/skills/<skill-name>/SKILL.md` following section 2's conventions.
5. **Run the generalization safety check** from section 2.5 — grep the draft for forbidden DataPlatformUI-specific terms.
6. **Self-review against this checklist**:
   - All "must cover" bullets addressed?
   - No "must NOT cover" topics leaked in?
   - 5–10 `### Pattern:` sections present?
   - Cross-references named correctly (matching the skill names in this plan)?
   - Length in the 400–800 line target?
7. **Present the draft to the user** for review before considering the session done.

If the agent finds a pattern in the source repo that doesn't fit any of the 7 skills, it should NOT add it to the skill it's writing — it should report it back to the user as a possible gap in this plan.

---

## 6. Cross-skill consistency check (run once all 7 are written)

After all skills exist, run these checks (a separate session can do this):

1. **Forbidden-term grep across all 7 SKILL.md files** — see section 2.5. Zero hits.
2. **Cross-reference resolution**: every skill name referenced in any skill's "Interactions with other skills" section must match a real skill name from this plan.
3. **Coverage map**: every row in section 3's table should be cited by at least one skill, and no row should be cited by more than two skills (more = ownership ambiguity).
4. **Frontmatter `description` quality**: each one names concrete triggers, not vague topics. If you couldn't decide whether to invoke the skill from the description alone, it's not specific enough.
5. **Length check**: each file is 400–800 lines. Outliers get a second look.
6. **No orphan patterns**: ask the user "are there any DataPlatformUI patterns you expected to see covered that aren't?" If yes, decide which skill to extend (preferred) or whether to add an 8th skill (avoid unless necessary).

---

## 7. Quick reference — the skill list

| # | Skill name | One-line scope |
|---|---|---|
| 1 | `frontend-architecture` | Stack, bootstrap, plugin order, routing/guards, project layout |
| 2 | `state-and-composables` | Pinia stores, persistence, composables, mixins, decision rules |
| 3 | `api-services-and-auth` | Axios, service layer, field mapping, auth, token refresh, RBAC |
| 4 | `forms-files-and-editors` | Forms, multi-step wizards, debounced auto-save, file uploads, cropping, section registry |
| 5 | `ui-design-system-and-feedback` | Vuetify+Tailwind hybrid, theming, dialogs, toasts, loading states, i18n |
| 6 | `build-dev-and-deployment` | Vite, env, npm scripts, lint, PM2, recommended CI |
| 7 | `testing-and-type-safety` *(gap)* | Vitest, Playwright/Cypress, TypeScript or JSDoc adoption |

End of design plan.
