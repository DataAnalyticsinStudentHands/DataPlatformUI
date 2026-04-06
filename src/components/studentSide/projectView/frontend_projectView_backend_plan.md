Plan: Backend Integration for Project View Forms (v2)
=====================================================

Summary
-------
Connect the frontend project view editor to the backend REST API by creating an API service module with field mapping, replacing localStorage with API calls, and wiring up file uploads.

> **v2 changes** are marked with ⚡ throughout.

---

Field Mapping (Frontend ↔ Backend)
----------------------------------

### Renamed Fields

| Frontend | Backend | Notes |
|---|---|---|
| `id` | `_id` | All sub-documents (authors, tags, findings, partners, milestones, impactItems) |
| `milestones` | `timeline` | Array field name |
| `poster.type` | `poster.fileType` | Poster type enum (`'pdf'` \| `'image'`) |
| `poster.file` | *(not sent)* | Upload endpoint only |
| `authors[].avatarFile` | *(not sent)* | Upload endpoint only |
| `metadata.status` | `status` | Top-level in backend |
| `metadata.createdAt` | `createdAt` | Top-level in backend |
| `metadata.updatedAt` | `updatedAt` | Top-level in backend |
| `metadata.createdBy` | `userID` | Top-level in backend |

### ⚡ Pass-Through Fields (same name both sides)

These fields exist in the backend schema and pass through without renaming. The plan must ensure `toBackendFormat` / `fromBackendFormat` include them all:

| Field | Type | Notes |
|---|---|---|
| `title` | String (max 200) | Required for publish |
| `description` | String (max 1000) | Required for publish |
| `label` | `{ icon: String, text: String(50) }` | `label.text` required for publish |
| `enabledSections` | `String[]` | Enum: `'findings'`, `'partners'`, `'poster'`, `'timeline'`, `'impact'` |
| `timelineLayout` | String | ⚡ Enum: `'vertical'` \| `'horizontal'`, default `'vertical'` |
| `conclusion` | `{ text: String(1000), attribution: String(100) }` | `conclusion.text` required for publish |
| `footer` | `{ icon: String, message: String, variant: String }` | ⚡ `variant` enum: `'info'`, `'notice'`, `'success'`, `'warning'`, default `'info'` |

### ⚡ Sub-Document Fields (inside arrays)

These sub-fields must survive the `id ↔ _id` mapping without being dropped:

**authors[]**
`_id`, `name` (max 100), `role` (max 100), `quote` (max 500), `avatarUrl`

**tags[]**
`_id`, `text` (max 50), `color`

**findings[]**
`_id`, `stat` (max 50), `description` (max 200), `color`

**partners[]**
`_id`, `acronym` (max 20), `name` (max 150), `color`

**timeline[] (frontend: milestones[])**
`_id`, `title` (max 100), `description` (max 200), `color`, `dateType` (`'single'` | `'range'`), `dateStart` (YYYY-MM-DD), `dateEnd` (YYYY-MM-DD — only when `dateType` is `'range'`)

**impactItems[]**
`_id`, `icon` (MDI icon name, max 50), `label` (max 50), `text` (max 200)

### ⚡ Read-Only / Server-Managed Fields

These are returned by the backend but must **never** be sent in PATCH/PUT payloads:

| Field | Notes |
|---|---|
| `authors[].avatarUrl` | Managed by avatar upload endpoints |
| `poster.url` | Managed by poster upload endpoint |
| `poster.fileType` | Set by poster upload endpoint from MIME type |
| `submittedAt` | Set by backend when status → `'published'` |
| `projectID` | Set on creation, immutable |
| `userID` | Set on creation |
| `organizationID` | Set on creation |

---

⚡ Status Transition Rules
--------------------------

The backend PATCH handler enforces strict status transitions. The service layer should guard against invalid calls:

| Current Status | Allowed Transitions |
|---|---|
| `draft` | → `published` |
| `published` | → `revoked`, → `draft` |
| `revoked` | → `published`, → `draft` |

Publishing triggers full content validation (see below). Transitioning to `draft` or `revoked` does not.

---

⚡ Publish Validation Rules (Client-Side Pre-Validation)
---------------------------------------------------------

The backend enforces these on `status: 'published'`. Mirror them in the frontend to show inline errors before the API call:

**Always required:**
- `title` — non-empty, ≤ 200 chars
- `description` — non-empty, ≤ 1000 chars
- `label.text` — non-empty, ≤ 50 chars
- `authors` — 1–6 items, each must have `name` and `role`
- `tags` — 1–10 items, each must have `text`
- `conclusion.text` — non-empty, ≤ 1000 chars

**Conditional (only when section is in `enabledSections`):**

| Section | Rule |
|---|---|
| `findings` | 1–3 items; each needs `stat` + `description` |
| `partners` | 0–10 items; each needs `acronym` + `name` |
| `timeline` | 2–10 items; each needs `title` + `description`; `dateType`/`dateStart`/`dateEnd` validated if present |
| `impact` | 2–6 items; each needs `label` + `text` |
| `poster` | `poster.title` required + `poster.url` must exist (file uploaded) |

---

Files to Create
----------------

### 1. `src/components/dev/projectView/services/projectViewFormService.js`

API service module containing:

**Field mapping functions:**

- `toBackendFormat(frontendProject)` — converts frontend field names to backend:
  - `id` → `_id` on all sub-documents
  - `milestones` → `timeline`
  - `poster.type` → `poster.fileType`
  - Strips `avatarFile` from authors, `poster.file` from poster
  - ⚡ Strips `avatarUrl` from authors, `poster.url` and `poster.fileType` from poster (server-managed)
  - Flattens `metadata` → top-level `status`
  - ⚡ Passes through: `timelineLayout`, `footer`, `label`, `conclusion`, `enabledSections`
  - ⚡ Passes through sub-doc fields: `color` on tags/findings/partners/milestones, `dateType`/`dateStart`/`dateEnd` on milestones, `icon` on impactItems/label/footer

- `fromBackendFormat(backendForm)` — converts backend field names to frontend:
  - `_id` → `id` on all sub-documents
  - `timeline` → `milestones`
  - `poster.fileType` → `poster.type`
  - Nests `status`/`createdAt`/`updatedAt`/`userID` into `metadata`
  - Adds `avatarFile: null` on authors, `poster.file: null`
  - ⚡ Preserves `avatarUrl` on authors, `poster.url` on poster (for display)
  - ⚡ Preserves `timelineLayout`, `footer`, `label`, `conclusion`
  - ⚡ Preserves all sub-doc `color` fields and milestone date fields

- `toBackendPatchFields(fields)` — converts a partial set of fields for PATCH:
  - Same mapping but only for provided fields
  - ⚡ Always strips server-managed file fields (`avatarUrl`, `poster.url`, `poster.fileType`)

**CRUD methods** (using global axios + `VITE_ROOT_API` + `/studentSideData/project-view-forms`):

- `create(projectID, formData?)` — POST `/`
- `getByProject(projectID)` — GET `/by-project/:projectID`
- `update(formID, frontendFields)` — PATCH `/:formID` (converts fields, strips file-managed fields)
- `replace(formID, frontendFields)` — PUT `/:formID` (full replacement)
- `remove(formID)` — DELETE `/:formID`

**Status transitions:**

- `publish(formID, frontendFields?)` — PATCH with `status: 'published'`
  - ⚡ Run client-side publish validation first; abort with errors if invalid
- `revoke(formID)` — PATCH with `status: 'revoked'`
- `unpublish(formID)` — PATCH with `status: 'draft'`

**File uploads:**

- `uploadAvatar(formID, authorID, imageFile)` — POST multipart to `/:formID/authors/:authorID/avatar`
  - ⚡ Response includes full `projectViewForm` — sync local state from it
- `deleteAvatar(formID, authorID)` — DELETE `/:formID/authors/:authorID/avatar`
  - ⚡ Response includes full `projectViewForm`
- `uploadPoster(formID, file, title?)` — POST multipart to `/:formID/poster`
  - ⚡ `title` sent as text field in same multipart request
  - ⚡ Response includes full `projectViewForm` — sync `poster.url` and `poster.fileType` from it
- `deletePoster(formID)` — DELETE `/:formID/poster`
  - ⚡ Response includes full `projectViewForm`

**Public + Utility:**

- `getPublic(formID)` — GET `/public/:formID`
  - ⚡ Note: response excludes `userID` and `organizationID`
- `buildFileUrl(relativePath)` — constructs full URL:
  `${VITE_ROOT_API}/studentSideData/project-view-forms/files/${relativePath}`

---

Files to Modify
----------------

### 2. `src/components/dev/projectView/pages/ProjectEditorPage.vue`

Changes:

- Import `projectViewFormService` (aliased as `formService`)
- Add `formId` ref to track the backend form document `_id`
- Add `projectID` prop or computed from route (the parent project's ID)
- Pass `formId` as prop to `ProjectEditorMain`

Replace `loadExistingProject()`:
```
1. Call formService.getByProject(projectID)
2. If formFound → set formId, convert with fromBackendFormat(), set as existingProject
3. If not found → call formService.create(projectID) → set formId, convert, set as existingProject
4. Determine starting step: existing form with content → Step 2, fresh empty form → Step 1
```

Replace `handleSave(projectData)`:
```
1. Convert projectData with toBackendPatchFields()
2. Call formService.update(formId, fields)
3. ⚡ Update local state from fromBackendFormat(response) to sync server-generated IDs
```

Replace `handleSubmit(projectData)`:
```
1. ⚡ Run client-side publish validation; show errors inline if invalid
2. Convert projectData with toBackendPatchFields()
3. Call formService.publish(formId, fields)
4. Set savedProjectId from response
5. Show success dialog
```

Update `viewProject()` and `copyShareLink()`:
- Use the backend form `_id` for the public view URL
- Share link: `/platform/project/${formId}`

### 3. `src/components/dev/projectView/ProjectEditorMain.vue`

Changes:

- Accept `formId` prop (String)
- Import `projectViewFormService`

Replace `autoSave()`:
```
1. If no formId, skip (form not yet created)
2. Check for pending file uploads:
   a. For each author with avatarFile !== null:
      - Call formService.uploadAvatar(formId, author.id, author.avatarFile)
      - ⚡ On success: sync FULL form state from response (avatarUrl set by server)
      - Clear author.avatarFile
   b. If poster.file !== null:
      - Call formService.uploadPoster(formId, poster.file, poster.title)
      - ⚡ On success: sync FULL form state from response (poster.url/fileType set by server)
      - Clear poster.file
3. Prepare content fields (strip avatarFile, poster.file, avatarUrl, poster.url, poster.fileType)
4. Call formService.update(formId, contentFields)
5. Update saveStatus from result
6. ⚡ Sync backend-generated _id values back into local state using fromBackendFormat()
```

Replace `saveDraft()`:
- Call `autoSave()` then emit `'save'` event

Replace `submitProject()`:
- ⚡ Run client-side publish validation first
- Validate locally then emit `'submit'` to parent (parent calls `formService.publish`)

Remove localStorage operations:
- Remove `loadDraft()` function (parent handles loading via API)
- Remove `localStorage.setItem/getItem` calls
- Keep auto-save timer/debounce logic (just change the target from localStorage to API)

Handle `initialProject` change:
- When parent sets `initialProject` (after API fetch), load it and sync `enabledSections`
- Determine if form is "fresh" (empty content) → stay on Step 1, or has content → go to Step 2

### 4. `src/components/dev/projectView/pages/ProjectViewPage.vue`

Changes:

- Import `projectViewFormService`
- Replace sample data / localStorage fetch with `formService.getPublic(formID)`
- Convert response with `fromBackendFormat()`
- ⚡ Use `formService.buildFileUrl()` for avatar and poster URLs in the template data
- Handle 404 (not published) → show "not found" state
- Keep existing loading/error UI

---

⚡ Integration with Existing Endpoints
---------------------------------------

The backend already integrates project view form status into these existing endpoints. The frontend should consume these where applicable:

### Student Checklist (`GET /studentSideData/student-checklist`)

Response now includes:
```json
{
  "projectViewFormStatus": {
    "<projectID>": "draft" | "published" | "revoked"
  }
}
```
Use this to show form completion indicators on the student dashboard without extra API calls.

### Student Projects List (`GET /studentSideData/student/projects`)

Each project in the response now includes:
```json
{
  "projectViewForm": {
    "_id": "<formID>",
    "status": "draft",
    "submittedAt": null,
    "updatedAt": "2026-02-05T..."
  }
}
```
Use this to show view form status badges on the projects list and to get the `formID` for navigating to the editor without an extra `getByProject` call.

### Single Project (`GET /studentSideData/projects/:projectId`)

Same `projectViewForm` summary object included in the response.

### Clowder Metadata Sync

The backend automatically includes `project_view_status` and `project_view_published_date` in Clowder dataset metadata when syncing. No frontend action needed.

---

Lifecycle Flow
--------------

**New Project (no form exists)**
```
1. ProjectEditorPage.onMounted()
2. → formService.getByProject(projectID) → formFound: false
3. → formService.create(projectID) → returns empty draft form with _id
4. → formId = response._id, existingProject = fromBackendFormat(response)
5. → ProjectEditorMain starts at Step 1 (section configurator)
6. User selects sections → Step 2
7. Auto-save PATCHes content every 2 seconds
8. File uploads handled within auto-save cycle
9. User clicks Publish → client-side validation → formService.publish()
```

**Existing Project (form already exists)**
```
1. ProjectEditorPage.onMounted()
2. → formService.getByProject(projectID) → formFound: true
3. → formId = response._id, existingProject = fromBackendFormat(response)
4. → ProjectEditorMain starts at Step 2 (has content)
5. Auto-save PATCHes changes
6. User clicks Publish → client-side validation → formService.publish()
```

**Public View**
```
1. ProjectViewPage.onMounted()
2. → formService.getPublic(formID) → returns published form
3. → Convert with fromBackendFormat()
4. ⚡ → Build file URLs: formService.buildFileUrl(author.avatarUrl), formService.buildFileUrl(poster.url)
5. → Render via ProjectTemplate
```

---

Important Implementation Notes
-------------------------------

- **Auth pattern:** Use global axios import + `import.meta.env.VITE_ROOT_API`. The global axios already has token header set by `loggedInUser` store.

- **File fields exclusion:** Never send `avatarUrl`, `poster.url`, `poster.fileType` in PATCH/PUT payloads. These are managed exclusively by upload endpoints.

- **Array replacement:** When PATCHing array fields (authors, tags, etc.), always send the entire array. Backend replaces via `$set`.

- **Sub-document IDs:** Always include `_id` for existing sub-documents in updates. New items (no `_id`) get backend-generated IDs.

- **ID sync after save:** After any API response, use `fromBackendFormat()` to update local state. This ensures backend-generated `_id` values replace frontend-generated `id` values.

- ⚡ **Full form sync after file uploads:** Avatar and poster upload responses return the complete `projectViewForm`. Always sync local state from this to pick up server-set `avatarUrl`/`poster.url`/`poster.fileType` values.

- ⚡ **timelineLayout default:** If the frontend doesn't send `timelineLayout`, the backend defaults to `'vertical'`. Ensure the section configurator or timeline editor sets this field.

- ⚡ **footer.variant default:** Backend defaults to `'info'`. Frontend should initialize footer with `{ variant: 'info' }` for new forms.

- ⚡ **Milestone date validation:** When `dateType` is `'range'`, `dateEnd` must be ≥ `dateStart`. When `dateType` is `'single'`, `dateEnd` must not be set. Enforce this in the timeline editor UI.

- ⚡ **Delete restrictions:** Published forms cannot be deleted — must be revoked first. The backend returns 400 if you try.

- **No changes to input components:** `AuthorInput`, `FileUploader`, `AvatarCropperDialog`, etc. remain unchanged. File upload handling is intercepted at the `ProjectEditorMain` level during auto-save.

---

Verification
------------

1. **Create flow:** Navigate to editor for a project with no form → verify POST creates draft → verify form loads in Step 1
2. **Edit flow:** Navigate to editor for a project with existing form → verify GET loads form → starts at Step 2
3. **Auto-save:** Edit fields → verify PATCH is called after 2-second debounce → verify save indicator
4. **Avatar upload:** Crop avatar → verify upload endpoint called during auto-save → avatarUrl populated from response
5. **Poster upload:** Select poster file → verify upload during auto-save → poster URL populated from response
6. ⚡ **timelineLayout:** Toggle layout in editor → verify PATCH includes `timelineLayout` → verify public view uses correct layout
7. ⚡ **footer:** Set footer message/variant → verify PATCH includes `footer` → verify public view renders it
8. ⚡ **Milestone dates:** Add milestones with single/range dates → verify validation on range (dateEnd ≥ dateStart) → verify PATCH includes date fields
9. ⚡ **Publish validation:** Try publishing with missing required fields → verify client-side errors shown before API call
10. ⚡ **Status transitions:** Publish → Revoke → Re-publish → verify each transition succeeds; try invalid transition → verify error
11. **Public view:** Navigate to public URL → verify GET public endpoint → form renders correctly → file URLs resolve
12. ⚡ **Projects list integration:** Navigate to projects list → verify `projectViewForm` status badge renders from list response
13. ⚡ **Checklist integration:** Navigate to student checklist → verify `projectViewFormStatus` shows correct status
14. **Error handling:** Disconnect network → verify error indicator shown → reconnect → verify recovery