# Instructor Mailer Demo (Frontend-Only)

## Context
The instructor mailer system exists at `src/components/instructorSide/instructorMailer/` but has no working backend. We need a pure frontend demo at `src/components/dev/instructorMailer/` that simulates full functionality with mock data so it can be demonstrated without backend dependencies. It will be auth-protected and accessible via a card on the Instructor Dashboard.

## File Structure

```
src/components/dev/instructorMailer/
├── mockData.js                        ← Shared mock students, experiences, config
├── DevMailerMain.vue                  ← Root container (3 tabs: Overview, Manual, Automatic)
├── DevMailerOverview.vue              ← Simulated progress bar (no SSE, uses setInterval)
├── DevManualMailerMain.vue            ← Manual mailer sub-tab container (Entry / Goal)
├── DevManualMailerEntryForms.vue      ← Dual-table student picker + email compose
├── DevManualMailerGoalForms.vue       ← Experience selector + dual-table + email compose
├── DevAutomaticMailerMain.vue         ← Automatic mailer sub-tab container (Entry / Goal)
├── DevAutomaticMailerEntryForms.vue   ← Auto-mailer config form for entry forms
└── DevAutomaticMailerGoalForms.vue    ← Auto-mailer config form for goal forms
```

## Files to Modify

### 1. `src/components/dev/instructorMailer/mockData.js` (new)
Export mock data used across all demo components:
- `mockStudentsWithoutEntryForm` — ~8 students with `_id`, `firstName`, `lastName`, `email`, `languagePreference`
- `mockStudentsWithoutGoalForm` — ~6 students (similar shape)
- `mockExperienceInstances` — 3-4 experiences with `expInstanceID`, `sessionName`, `experienceCategory`, `experienceName`
- `mockAutoMailerConfig` — default config objects for entry/goal form auto-mailers (enabled, days, subjects, content)

### 2. `src/components/dev/instructorMailer/DevMailerMain.vue` (new)
- Copy structure from `src/components/instructorSide/instructorMailer/instructorMailerMain.vue`
- **Enable all 3 tabs**: Overview, Manual Mailer, Automatic Mailer
- Provide `setTab` via provide/inject (same pattern)
- Also provide a reactive `emailProgress` object `{ sent: 0, total: 0, active: false }` so child components can trigger the fake progress and Overview can display it

### 3. `src/components/dev/instructorMailer/DevMailerOverview.vue` (new)
- Same UI as `src/components/instructorSide/instructorMailer/instructorMailerOverview.vue` (progress bar + count)
- **No SSE** — instead, inject `emailProgress` from parent and use a `watch` + `setInterval` to animate the progress bar when `active` becomes true
- Simulate: increment `sent` by 1 every 200ms until `sent === total`, then set `active = false`

### 4. `src/components/dev/instructorMailer/DevManualMailerMain.vue` (new)
- Selection between Entry Forms and Goal Forms (same as original)

### 5. `src/components/dev/instructorMailer/DevManualMailerEntryForms.vue` (new)
- Copy UI from `src/components/instructorSide/instructorMailer/instructorManualMailer/instructorManualMailerEntryForms.vue`
- Replace `axios.get` for students with import from `mockData.js`
- Replace `axios.post` for sending with:
  1. Log payload to console
  2. Set `emailProgress.total` to recipient count, `emailProgress.sent = 0`, `emailProgress.active = true`
  3. Show success toast
  4. Call `setTab('overview')` to switch to Overview
- Keep: dual-table selection, search, CKEditor, multilingual toggle, validation, confirmation dialog
- Fix from original: properly define error handling (try/catch with toast.error)

### 6. `src/components/dev/instructorMailer/DevManualMailerGoalForms.vue` (new)
- Same as EntryForms but with experience selector
- Experience list loaded from `mockData.js` instead of API
- "Fetch Students" loads from `mockData.js` filtered by selected experience
- Same fake send behavior as EntryForms

### 7. `src/components/dev/instructorMailer/DevAutomaticMailerMain.vue` (new)
- Selection between Entry Forms and Goal Forms config

### 8. `src/components/dev/instructorMailer/DevAutomaticMailerEntryForms.vue` (new)
- Copy UI from `src/components/instructorSide/instructorMailer/instructorAutomaticMailer/instructorAutomaticMailerEntryForms.vue`
- Load initial config from `mockData.js` instead of GET
- "Apply" saves to a local reactive variable + shows success toast (no API call)
- Keep: CKEditor, multilingual toggle, enable/disable switch, day inputs, validation

### 9. `src/components/dev/instructorMailer/DevAutomaticMailerGoalForms.vue` (new)
- Same as EntryForms config but with `{{EXPERIENCE_NAME}}` placeholder support
- Load/save from local reactive state + mock data

### 10. `src/router/index.js` (modify)
Add route:
```js
{
  path: "/dev/instructorMailer",
  name: "devInstructorMailer",
  component: () => import("@/components/dev/instructorMailer/DevMailerMain.vue"),
  beforeEnter: requireAuth(["Instructor", "Group Instructor", "Group Admin", "Org Admin"]),
}
```

### 11. `src/components/instructorSide/instructorDash.vue` (modify)
- Uncomment the "Student Mailer" card (lines 36-42)
- Change its `@click` handler to navigate to `devInstructorMailer` instead of `instructorMailer`
- Update `navigateToMailer()` method: `this.$router.push({ name: 'devInstructorMailer' })`

## Key Design Decisions
- **Options API** — match the existing mailer components' style (not `<script setup>`)
- **Mock data in separate file** — keeps components clean, easy to swap for real API later
- **Shared progress state via provide/inject** — lets send actions trigger the Overview animation without SSE
- **CKEditor retained** — the demo should look and feel real; CKEditor is already a project dependency
- **Fixes from original baked in** — proper error handling, no missing methods, no stray typos

## Verification
1. Log in as an Instructor
2. On the Instructor Dashboard, click the "Student Mailer" card
3. Verify all 3 tabs render: Overview, Manual Mailer, Automatic Mailer
4. **Manual Mailer → Entry Forms**: students load from mock data, select students, move to recipients, compose email, toggle multilingual, send → toast + redirect to Overview → progress bar animates
5. **Manual Mailer → Goal Forms**: select experience, fetch students, same flow as Entry Forms
6. **Automatic Mailer → Entry Forms**: toggle enable, set days, compose, toggle multilingual, apply → toast
7. **Automatic Mailer → Goal Forms**: same as Entry Forms + experience name placeholder
8. Console shows logged payloads on send/apply actions
