# Project View Form — Frontend API Documentation

> **Purpose:** This document provides everything a frontend developer (or AI model) needs to integrate with the Project View Form backend endpoints. It covers the data model, all REST endpoints with request/response examples, file upload patterns, validation rules, and the form lifecycle. No backend source code is required.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Data Model — Full Field Reference](#2-data-model--full-field-reference)
3. [Form Lifecycle & Status Transitions](#3-form-lifecycle--status-transitions)
4. [Authentication](#4-authentication)
5. [API Endpoints — Form CRUD](#5-api-endpoints--form-crud)
6. [API Endpoints — File Uploads](#6-api-endpoints--file-uploads)
7. [API Endpoints — Public Access](#7-api-endpoints--public-access)
8. [API Endpoints — Supporting Data](#8-api-endpoints--supporting-data)
9. [Validation Rules Reference](#9-validation-rules-reference)
10. [Error Response Reference](#10-error-response-reference)
11. [Axios Integration Patterns](#11-axios-integration-patterns)
12. [File Upload Implementation Guide](#12-file-upload-implementation-guide)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Vue.js)                                          │
│                                                             │
│  ProjectEditorPage.vue ──→ Create / Edit / Publish forms    │
│  ProjectViewPage.vue   ──→ Public read-only display         │
│  StudentProjects.vue   ──→ Lists projects w/ form status    │
│  StudentChecklist.vue  ──→ Shows form completion status     │
└─────────────┬───────────────────────────────────────────────┘
              │ Axios (JWT in Authorization header)
              ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: /backend/studentSideData/project-view-forms/...   │
│                                                             │
│  Form CRUD ──→ POST, GET, PATCH, PUT, DELETE                │
│  File Uploads ──→ Avatar (per author), Poster (per form)    │
│  Public Read ──→ GET /public/:formID (published only)       │
│  File Serving ──→ GET /files/:folder/:filename              │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│  MongoDB                 │    │  Local Disk Storage      │
│  Collection:             │    │  uploads/project-views/  │
│  projectViewFormData     │    │    avatars/              │
│                          │    │    posters/              │
└──────────────────────────┘    └──────────────────────────┘
```

**Base URL:** `/backend/studentSideData`

**One form per project.** The backend enforces a unique constraint on `projectID`. Attempting to create a second form for the same project returns the existing one.

---

## 2. Data Model — Full Field Reference

### 2.1 Complete Form Object

This is the shape of the `projectViewForm` object returned by all endpoints.

```json
{
  "_id": "0281738800000000",
  "projectID": "7121738000000000",
  "userID": "4561737000000000",
  "organizationID": ["org-001"],

  "title": "Clean Water Access Initiative",
  "description": "A community-driven project focused on improving water quality...",
  "label": {
    "icon": "layers",
    "text": "Pharis Fellowship"
  },

  "enabledSections": ["findings", "partners", "timeline"],

  "authors": [
    {
      "_id": "a101738800001111",
      "name": "Maria Santos",
      "role": "Project Lead",
      "quote": "This project changed my understanding of community health.",
      "avatarUrl": "avatars/1738800000-a1b2c3d4e5f67890.jpg"
    },
    {
      "_id": "a201738800002222",
      "name": "James Chen",
      "role": "Data Analyst",
      "quote": "",
      "avatarUrl": null
    }
  ],

  "tags": [
    { "_id": "t101738800001111", "text": "Water Quality", "color": "#4338ca" },
    { "_id": "t201738800002222", "text": "Community Health", "color": "#059669" }
  ],

  "findings": [
    {
      "_id": "f101738800001111",
      "stat": "350%",
      "description": "Increase in clean water access across target communities",
      "color": "#4338ca"
    }
  ],

  "conclusion": {
    "text": "Our findings demonstrate that community-led initiatives...",
    "attribution": "— Maria Santos, Project Lead"
  },

  "partners": [
    {
      "_id": "p101738800001111",
      "acronym": "EPA",
      "name": "Environmental Protection Agency",
      "color": "#059669"
    }
  ],

  "timeline": [
    {
      "_id": "m101738800001111",
      "title": "Project Kickoff",
      "description": "Initial community meetings and needs assessment",
      "color": "#4338ca"
    },
    {
      "_id": "m201738800002222",
      "title": "Data Collection",
      "description": "Water sampling across 12 neighborhoods",
      "color": "#059669"
    }
  ],

  "impactItems": [],

  "poster": {
    "fileType": "pdf",
    "title": "Research Poster — Spring 2025",
    "url": "posters/1738800000-d4e5f6a1b2c3d4e5.pdf"
  },

  "footer": {
    "icon": "ℹ️",
    "message": "This project is part of the Pharis Fellowship program.",
    "variant": "info"
  },

  "status": "draft",
  "submittedAt": null,
  "createdAt": "2025-02-01T10:00:00.000Z",
  "updatedAt": "2025-02-05T14:30:00.000Z"
}
```

### 2.2 Field-by-Field Specification

#### Core Fields

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `_id` | String | Auto | Generated by backend | Form document ID |
| `projectID` | String | Yes (create) | Must reference existing project | One form per project (unique) |
| `userID` | String | Auto | Set by backend from JWT | Creator of the form |
| `organizationID` | Array | Auto | Set by backend | Inherited from project |

#### Content Fields

| Field | Type | Required for Publish | Constraints | Notes |
|---|---|---|---|---|
| `title` | String | ✅ Yes | Max 200 chars, non-empty | Display title for the project view |
| `description` | String | ✅ Yes | Max 1000 chars, non-empty | Summary / elevator pitch |
| `label.icon` | String | No | — | Icon identifier (e.g., 'layers', 'code') |
| `label.text` | String | ✅ Yes | Max 50 chars, non-empty | Category label (e.g., "Pharis Fellowship") |
| `enabledSections` | Array\<String\> | No | Values: `'findings'`, `'partners'`, `'poster'`, `'timeline'`, `'impact'` | Controls which optional sections appear |

#### Authors (1–6 required for publish)

| Field | Type | Required for Publish | Constraints |
|---|---|---|---|
| `authors[].name` | String | ✅ Yes | Max 100 chars |
| `authors[].role` | String | ✅ Yes | Max 100 chars |
| `authors[].quote` | String | No | Max 500 chars |
| `authors[].avatarUrl` | String | No | Set by avatar upload endpoint, read-only in form PATCH/PUT |
| `authors[]._id` | String | Auto | Generated by backend on create. **Must be sent back on updates.** |

#### Tags (1–10 required for publish)

| Field | Type | Required for Publish | Constraints |
|---|---|---|---|
| `tags[].text` | String | ✅ Yes | Max 50 chars |
| `tags[].color` | String | No | Hex format (e.g., `#4338ca`) |
| `tags[]._id` | String | Auto | Generated by backend |

#### Findings (optional section; 1–3 when `enabledSections` includes `'findings'`)

| Field | Type | Required when enabled | Constraints |
|---|---|---|---|
| `findings[].stat` | String | ✅ Yes | Max 50 chars (e.g., "350%", "7+") |
| `findings[].description` | String | ✅ Yes | Max 200 chars |
| `findings[].color` | String | No | Hex format |

#### Conclusion (always required for publish)

| Field | Type | Required for Publish | Constraints |
|---|---|---|---|
| `conclusion.text` | String | ✅ Yes | Max 1000 chars |
| `conclusion.attribution` | String | No | Max 100 chars (e.g., "— Carlos Mendieta") |

#### Partners (optional section; 0–10 when `enabledSections` includes `'partners'`)

| Field | Type | Required when enabled | Constraints |
|---|---|---|---|
| `partners[].acronym` | String | ✅ Yes | Max 20 chars |
| `partners[].name` | String | ✅ Yes | Max 150 chars |
| `partners[].color` | String | No | Hex format |

#### Timeline (optional section; 2–10 when `enabledSections` includes `'timeline'`)

| Field | Type | Required when enabled | Constraints |
|---|---|---|---|
| `timeline[].title` | String | ✅ Yes | Max 100 chars |
| `timeline[].description` | String | ✅ Yes | Max 200 chars |
| `timeline[].color` | String | No | Hex format |

#### Impact Items (optional section; 2–6 when `enabledSections` includes `'impact'`)

| Field | Type | Required when enabled | Constraints |
|---|---|---|---|
| `impactItems[].icon` | String | No | Max 10 chars (emoji) |
| `impactItems[].label` | String | ✅ Yes | Max 50 chars |
| `impactItems[].text` | String | ✅ Yes | Max 200 chars |

#### Poster (optional section; required fields when `enabledSections` includes `'poster'`)

| Field | Type | Required when enabled | Constraints |
|---|---|---|---|
| `poster.fileType` | String | Auto | `'pdf'` or `'image'` — set by upload endpoint |
| `poster.title` | String | ✅ Yes | Max 100 chars |
| `poster.url` | String | ✅ Yes (file must be uploaded) | Set by poster upload endpoint, read-only in form PATCH/PUT |

#### Footer

| Field | Type | Required for Publish | Constraints |
|---|---|---|---|
| `footer.icon` | String | No | Emoji |
| `footer.message` | String | No | Free-form |
| `footer.variant` | String | No | Enum: `'info'`, `'notice'`, `'success'`, `'warning'`. Default: `'info'` |

#### Lifecycle Fields (read-only)

| Field | Type | Notes |
|---|---|---|
| `status` | String | `'draft'`, `'published'`, `'revoked'` |
| `submittedAt` | Date \| null | Set when status becomes `'published'` |
| `createdAt` | Date | Auto-managed by MongoDB |
| `updatedAt` | Date | Auto-managed by MongoDB |

---

## 3. Form Lifecycle & Status Transitions

```
                    ┌─────────┐
        Create ──→  │  draft  │
                    └────┬────┘
                         │ PATCH with status: 'published'
                         │ (full content validation enforced)
                         ▼
                    ┌───────────┐
                    │ published │ ←──── PATCH with status: 'published'
                    └─────┬─────┘       (from revoked)
                          │
            PATCH with    │    PATCH with
         status: 'draft'  │    status: 'revoked'
                ┌─────────┤
                │         │
                ▼         ▼
           ┌─────────┐  ┌─────────┐
           │  draft   │  │ revoked │
           └─────────┘  └─────────┘
```

**Valid transitions:**

| From | To | Notes |
|---|---|---|
| `draft` | `published` | Full content validation required |
| `published` | `revoked` | Hides from public view |
| `published` | `draft` | Unpublishes, allows editing |
| `revoked` | `published` | Re-publishes, full validation required |
| `revoked` | `draft` | Returns to editing |

**Deletion rules:**
- `draft` — can be deleted
- `revoked` — can be deleted
- `published` — **cannot be deleted** (must revoke first)

---

## 4. Authentication

All endpoints (except public read) require a JWT token in the `Authorization` header.

```js
// Axios default configuration
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/backend/studentSideData',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or your token source
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Role requirements:**
- **Students (STU):** Create, update, delete forms; upload files
- **Instructors (INS):** Read forms only
- **Any authenticated user (ANY):** Public read, file serving

---

## 5. API Endpoints — Form CRUD

### 5.1 Create Form (Draft)

```
POST /project-view-forms/
```

Creates a new project view form. If a form already exists for the project, returns the existing one.

**Request Body:**

```json
{
  "projectID": "7121738000000000",
  "title": "Clean Water Access Initiative",
  "description": "A community-driven project...",
  "label": { "icon": "layers", "text": "Pharis Fellowship" },
  "enabledSections": ["findings", "partners"],
  "authors": [
    { "name": "Maria Santos", "role": "Project Lead", "quote": "" }
  ],
  "tags": [
    { "text": "Water Quality", "color": "#4338ca" }
  ],
  "findings": [],
  "conclusion": { "text": "", "attribution": "" },
  "partners": [],
  "timeline": [],
  "impactItems": [],
  "poster": {},
  "footer": { "icon": "ℹ️", "message": "", "variant": "info" }
}
```

> **Note:** `projectID` is required. All other fields are optional for draft creation. The backend generates `_id` values for the form and all sub-document arrays (authors, tags, etc.).

**Responses:**

| Status | Condition | Body Shape |
|---|---|---|
| `201` | New form created | `{ message, projectViewForm }` |
| `200` | Existing form found (draft/revoked) | `{ message, projectViewForm, isExisting: true }` |
| `409` | Existing published form | `{ message, existingFormId }` |
| `400` | Invalid data / archived project | `{ message, errors? }` |
| `403` | Not a project member | `{ message }` |
| `404` | Project not found | `{ message }` |

**Axios example:**

```js
async function createProjectViewForm(projectID, formData = {}) {
  try {
    const response = await apiClient.post('/project-view-forms/', {
      projectID,
      ...formData
    });

    if (response.data.isExisting) {
      console.log('Existing form loaded:', response.data.projectViewForm._id);
    }

    return response.data.projectViewForm;
  } catch (error) {
    if (error.response?.status === 409) {
      // Published form already exists
      console.log('Published form exists:', error.response.data.existingFormId);
    }
    throw error;
  }
}
```

---

### 5.2 Get Form by Project

```
GET /project-view-forms/by-project/:projectID
```

Returns the project view form associated with a specific project.

**Responses:**

| Status | Condition | Body Shape |
|---|---|---|
| `200` | Form found | `{ message, formFound: true, projectViewForm }` |
| `404` | No form exists | `{ message, formFound: false }` |
| `404` | Project not found | `{ message }` |
| `403` | No permission | `{ message }` |

**Axios example:**

```js
async function getProjectViewForm(projectID) {
  const response = await apiClient.get(
    `/project-view-forms/by-project/${projectID}`
  );
  if (response.data.formFound) {
    return response.data.projectViewForm;
  }
  return null;
}
```

---

### 5.3 Update Form (Partial — Save Draft / Publish / Revoke)

```
PATCH /project-view-forms/:formID
```

Updates specific fields on the form. This is the primary endpoint for:
- **Saving draft progress** — send only the fields that changed
- **Publishing** — send `status: 'published'` (triggers full validation on merged data)
- **Revoking** — send `status: 'revoked'`
- **Unpublishing to draft** — send `status: 'draft'`

**Request Body (all fields optional):**

```json
{
  "title": "Updated Title",
  "description": "Updated description...",
  "label": { "icon": "code", "text": "Research Project" },
  "enabledSections": ["findings", "partners", "timeline"],
  "authors": [
    { "_id": "a101738800001111", "name": "Maria Santos", "role": "Project Lead", "quote": "..." },
    { "name": "New Author", "role": "Contributor" }
  ],
  "tags": [
    { "_id": "t101738800001111", "text": "Water Quality", "color": "#4338ca" }
  ],
  "findings": [ ... ],
  "conclusion": { "text": "...", "attribution": "..." },
  "partners": [ ... ],
  "timeline": [ ... ],
  "impactItems": [ ... ],
  "footer": { "icon": "ℹ️", "message": "...", "variant": "info" },
  "status": "published"
}
```

> **Critical:** When updating array fields (authors, tags, etc.), send the **entire array**. The backend replaces the full array via `$set`. Do not send partial arrays expecting merge behavior.

> **Critical:** For existing sub-documents (authors, tags, findings, etc.), always include the `_id` field in each object. If you omit `_id`, the backend generates a new one, which breaks avatar associations for authors.

> **Note:** `poster.url`, `poster.fileType`, and `authors[].avatarUrl` are managed exclusively by the file upload endpoints. Do **not** include them in PATCH/PUT payloads — the backend ignores changes to these via form CRUD endpoints because they are set by the upload endpoints that write to the form document directly. Sending stale values in a PATCH could overwrite freshly uploaded file references.

**Publishing behavior:**
When `status: 'published'` is included, the backend merges incoming fields with existing form data and validates the **merged result** against full publish requirements (see [§9 Validation Rules](#9-validation-rules-reference)). If validation fails, the update is rejected and the form remains in its current status.

**Responses:**

| Status | Condition | Body Shape |
|---|---|---|
| `200` | Updated successfully | `{ message, projectViewForm }` |
| `400` | Validation failed / invalid transition / archived project | `{ message, errors? }` |
| `403` | Not a project member | `{ message }` |
| `404` | Form or project not found | `{ message }` |

**Axios examples:**

```js
// Save draft progress (partial update)
async function saveDraft(formID, fields) {
  const response = await apiClient.patch(
    `/project-view-forms/${formID}`,
    fields
  );
  return response.data.projectViewForm;
}

// Publish the form
async function publishForm(formID, finalFields = {}) {
  const response = await apiClient.patch(
    `/project-view-forms/${formID}`,
    { ...finalFields, status: 'published' }
  );
  return response.data.projectViewForm;
}

// Revoke public access
async function revokeForm(formID) {
  const response = await apiClient.patch(
    `/project-view-forms/${formID}`,
    { status: 'revoked' }
  );
  return response.data.projectViewForm;
}

// Unpublish back to draft
async function unpublishForm(formID) {
  const response = await apiClient.patch(
    `/project-view-forms/${formID}`,
    { status: 'draft' }
  );
  return response.data.projectViewForm;
}
```

---

### 5.4 Replace Form (Full — Replace All Content)

```
PUT /project-view-forms/:formID
```

Replaces all form content fields at once. Used when you want to send the complete form state rather than a partial update. Missing fields default to empty values.

**Request Body:**

```json
{
  "title": "Complete Title",
  "description": "Complete description...",
  "label": { "icon": "layers", "text": "Fellowship" },
  "enabledSections": ["findings"],
  "authors": [ { "name": "...", "role": "..." } ],
  "tags": [ { "text": "...", "color": "..." } ],
  "findings": [ { "stat": "...", "description": "...", "color": "..." } ],
  "conclusion": { "text": "...", "attribution": "..." },
  "partners": [],
  "timeline": [],
  "impactItems": [],
  "poster": {},
  "footer": { "variant": "info" },
  "status": "published"
}
```

> **Warning:** Any field not included defaults to empty (`''`, `[]`, `{}`). This endpoint is a full replacement, not a merge. Use PATCH for partial updates.

**Responses:** Same as PATCH endpoint.

---

### 5.5 Delete Form

```
DELETE /project-view-forms/:formID
```

Deletes a form. **Only draft and revoked forms can be deleted.** Published forms must be revoked first.

The backend automatically cleans up all associated uploaded files (author avatars and poster) before deleting the form document.

**Responses:**

| Status | Condition | Body Shape |
|---|---|---|
| `200` | Deleted | `{ message }` |
| `400` | Form is published | `{ message }` |
| `403` | Not a project member | `{ message }` |
| `404` | Form or project not found | `{ message }` |

**Axios example:**

```js
async function deleteProjectViewForm(formID) {
  const response = await apiClient.delete(
    `/project-view-forms/${formID}`
  );
  return response.data;
}
```

---

## 6. API Endpoints — File Uploads

File uploads use `multipart/form-data` and are separate from the form CRUD endpoints. Each upload endpoint writes the file to disk and updates the corresponding field on the form document.

### 6.1 Upload Author Avatar

```
POST /project-view-forms/:formID/authors/:authorID/avatar
```

Uploads or replaces a single author's avatar image. If the author already has an avatar, the previous file is automatically deleted.

**Content-Type:** `multipart/form-data`
**Field name:** `avatar`
**Accepted types:** JPEG, PNG, WebP
**Max size:** 2 MB
**Recommended:** Pre-crop to 256×256 on the frontend before uploading

**Response (200):**

```json
{
  "message": "Avatar uploaded successfully.",
  "authorID": "a101738800001111",
  "avatarUrl": "avatars/1738800000-a1b2c3d4e5f67890.jpg",
  "projectViewForm": { /* full updated form object */ }
}
```

**Error responses:**

| Status | Condition |
|---|---|
| `400` | No file provided / invalid type / file too large |
| `403` | Not a project member |
| `404` | Form not found / author not found in form |

**Axios example:**

```js
async function uploadAuthorAvatar(formID, authorID, imageFile) {
  const formData = new FormData();
  formData.append('avatar', imageFile);

  const response = await apiClient.post(
    `/project-view-forms/${formID}/authors/${authorID}/avatar`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return response.data;
}
```

---

### 6.2 Delete Author Avatar

```
DELETE /project-view-forms/:formID/authors/:authorID/avatar
```

Removes an author's avatar image from storage and clears the `avatarUrl` field.

**Response (200):**

```json
{
  "message": "Avatar removed successfully.",
  "authorID": "a101738800001111",
  "projectViewForm": { /* full updated form object */ }
}
```

---

### 6.3 Upload Poster/Diagram

```
POST /project-view-forms/:formID/poster
```

Uploads or replaces the project poster/diagram file. The backend auto-detects `fileType` (`'pdf'` or `'image'`) from the MIME type. Optionally, you can include a `title` text field in the same multipart request.

**Content-Type:** `multipart/form-data`
**Field name:** `poster`
**Accepted types:** JPEG, PNG, WebP, GIF, PDF
**Max size:** 10 MB

**Optional text field:** `title` (can be included alongside the file in the multipart body)

**Response (200):**

```json
{
  "message": "Poster uploaded successfully.",
  "poster": {
    "fileType": "pdf",
    "title": "Research Poster — Spring 2025",
    "url": "posters/1738800000-d4e5f6a1b2c3d4e5.pdf"
  },
  "projectViewForm": { /* full updated form object */ }
}
```

**Axios example:**

```js
async function uploadPoster(formID, file, title = '') {
  const formData = new FormData();
  formData.append('poster', file);
  if (title) {
    formData.append('title', title);
  }

  const response = await apiClient.post(
    `/project-view-forms/${formID}/poster`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return response.data;
}
```

---

### 6.4 Delete Poster/Diagram

```
DELETE /project-view-forms/:formID/poster
```

Removes the poster file from storage. Clears `poster.url` and `poster.fileType` but **preserves `poster.title`** for re-upload convenience.

**Response (200):**

```json
{
  "message": "Poster removed successfully.",
  "projectViewForm": { /* full updated form object */ }
}
```

---

### 6.5 Serve Uploaded Files

```
GET /project-view-forms/files/:folder/:filename
```

Serves a previously uploaded file. Use this to construct `<img>` `src` or `<a>` `href` attributes.

**Allowed folders:** `avatars`, `posters`

**How to build the URL from form data:**

```js
// Given: author.avatarUrl = "avatars/1738800000-a1b2c3d4e5f67890.jpg"
const imageUrl = `/backend/studentSideData/project-view-forms/files/${author.avatarUrl}`;

// Given: form.poster.url = "posters/1738800000-d4e5f6a1b2c3.pdf"
const posterUrl = `/backend/studentSideData/project-view-forms/files/${form.poster.url}`;
```

> **Note:** This endpoint currently requires authentication (any valid JWT). For truly public (unauthenticated) display of published form assets, the backend will need a dedicated public static route in a future update.

---

## 7. API Endpoints — Public Access

### 7.1 Get Published Form (Public Read)

```
GET /project-view-forms/public/:formID
```

Returns a published form's content with sensitive ownership fields stripped. Only returns forms where `status === 'published'`.

**Response (200):**

```json
{
  "message": "Project view found.",
  "formFound": true,
  "projectViewForm": {
    "_id": "0281738800000000",
    "projectID": "7121738000000000",
    "title": "Clean Water Access Initiative",
    "description": "...",
    "label": { "icon": "layers", "text": "Pharis Fellowship" },
    "enabledSections": ["findings", "partners"],
    "authors": [ ... ],
    "tags": [ ... ],
    "findings": [ ... ],
    "conclusion": { ... },
    "partners": [ ... ],
    "timeline": [ ... ],
    "impactItems": [ ... ],
    "poster": { ... },
    "footer": { ... },
    "status": "published",
    "submittedAt": "2025-02-05T14:30:00.000Z",
    "updatedAt": "2025-02-05T14:30:00.000Z"
  }
}
```

**Excluded fields:** `userID`, `organizationID`, `createdAt` (only `updatedAt` and `submittedAt` are included).

**Response (404):**

```json
{
  "message": "Published project view not found.",
  "formFound": false
}
```

> **Current limitation:** Requires a valid JWT token (`authUser(['ANY'])`). True unauthenticated access is planned for a future update.

---

## 8. API Endpoints — Supporting Data

These endpoints are not part of the project view form router but return project view form status alongside other project data.

### 8.1 Student Projects List

```
GET /student/projects
```

Returns all projects for the authenticated student. Each project includes a `projectViewForm` summary if one exists.

**Relevant response fields:**

```json
{
  "projects": [
    {
      "_id": "7121738000000000",
      "projectName": "Clean Water Access",
      "projectViewForm": {
        "_id": "0281738800000000",
        "status": "draft",
        "submittedAt": null,
        "updatedAt": "2025-02-05T14:30:00.000Z"
      }
    },
    {
      "_id": "8231738000000000",
      "projectName": "Urban Garden",
      "projectViewForm": null
    }
  ]
}
```

Use `projectViewForm` to determine:
- `null` → No form created yet → show "Create Project View" button
- `status: 'draft'` → Form in progress → show "Continue Editing" button
- `status: 'published'` → Live → show "View" / "Edit" / "Revoke" options
- `status: 'revoked'` → Hidden → show "Re-publish" / "Edit" / "Delete" options

### 8.2 Single Project Detail

```
GET /projects/:projectId
```

Returns a single project with the same `projectViewForm` summary shape.

### 8.3 Student Checklist

```
GET /student-checklist
```

Returns form completion statuses. Includes `projectViewFormStatus` keyed by project ID.

```json
{
  "entryFormCompleted": true,
  "projectViewFormStatus": {
    "7121738000000000": "draft",
    "8231738000000000": "published"
  }
}
```

---

## 9. Validation Rules Reference

### 9.1 Draft Validation (Structure Only)

Applied on every create/update regardless of status. These are sanity checks:

- All array fields must be arrays if present
- `authors`: max 6
- `tags`: max 10
- `findings`: max 3
- `partners`: max 10
- `timeline`: max 10
- `impactItems`: max 6
- `enabledSections` values must be from: `['findings', 'partners', 'poster', 'timeline', 'impact']`

### 9.2 Publish Validation (Full Content)

Applied only when transitioning to `status: 'published'`. The backend validates the **merged** form data (existing + incoming updates).

**Always required:**

| Field | Rule |
|---|---|
| `title` | Non-empty string, ≤ 200 chars |
| `description` | Non-empty string, ≤ 1000 chars |
| `label.text` | Non-empty string, ≤ 50 chars |
| `authors` | 1–6 authors, each with non-empty `name` (≤ 100) and `role` (≤ 100) |
| `tags` | 1–10 tags, each with non-empty `text` (≤ 50) |
| `conclusion.text` | Non-empty string, ≤ 1000 chars |

**Conditional (only when section is in `enabledSections`):**

| Section | Rule |
|---|---|
| `findings` | 1–3 findings, each with `stat` (≤ 50) and `description` (≤ 200) |
| `partners` | 0–10 partners, each with `acronym` (≤ 20) and `name` (≤ 150) |
| `timeline` | 2–10 milestones, each with `title` (≤ 100) and `description` (≤ 200) |
| `impact` | 2–6 items, each with `label` (≤ 50) and `text` (≤ 200) |
| `poster` | `poster.title` non-empty (≤ 100) AND `poster.url` must exist (file uploaded) |

**Footer:** Only validates `variant` is one of `['info', 'notice', 'success', 'warning']` if present.

---

## 10. Error Response Reference

All error responses follow this shape:

```json
{
  "message": "Human-readable error description",
  "errors": ["Specific validation error 1", "Specific validation error 2"]
}
```

The `errors` array is only present for validation failures (400 responses on publish attempts).

| Status | Scenario |
|---|---|
| `400` | Invalid form data structure |
| `400` | Publish validation failed (includes `errors` array) |
| `400` | Invalid status transition (e.g., `draft` → `revoked`) |
| `400` | Cannot modify forms for archived projects |
| `400` | Cannot delete a published form |
| `400` | File too large / invalid file type |
| `400` | No file provided in upload request |
| `403` | User is not a project member |
| `404` | Form not found |
| `404` | Project not found |
| `404` | Author not found in form |
| `409` | Published form already exists for this project |

---

## 11. Axios Integration Patterns

### 11.1 Recommended Service Module Structure

```js
// services/projectViewFormService.js

import apiClient from '@/api/apiClient'; // Your configured axios instance

const BASE = '/project-view-forms';

export default {
  // ── Form CRUD ──

  async create(projectID, formData = {}) {
    const { data } = await apiClient.post(`${BASE}/`, { projectID, ...formData });
    return data; // { message, projectViewForm, isExisting? }
  },

  async getByProject(projectID) {
    const { data } = await apiClient.get(`${BASE}/by-project/${projectID}`);
    return data; // { message, formFound, projectViewForm? }
  },

  async update(formID, fields) {
    const { data } = await apiClient.patch(`${BASE}/${formID}`, fields);
    return data; // { message, projectViewForm }
  },

  async replace(formID, fullFormData) {
    const { data } = await apiClient.put(`${BASE}/${formID}`, fullFormData);
    return data; // { message, projectViewForm }
  },

  async remove(formID) {
    const { data } = await apiClient.delete(`${BASE}/${formID}`);
    return data; // { message }
  },

  // ── Status Transitions ──

  async publish(formID, fields = {}) {
    return this.update(formID, { ...fields, status: 'published' });
  },

  async revoke(formID) {
    return this.update(formID, { status: 'revoked' });
  },

  async unpublish(formID) {
    return this.update(formID, { status: 'draft' });
  },

  // ── File Uploads ──

  async uploadAvatar(formID, authorID, imageFile) {
    const fd = new FormData();
    fd.append('avatar', imageFile);
    const { data } = await apiClient.post(
      `${BASE}/${formID}/authors/${authorID}/avatar`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data; // { message, authorID, avatarUrl, projectViewForm }
  },

  async deleteAvatar(formID, authorID) {
    const { data } = await apiClient.delete(
      `${BASE}/${formID}/authors/${authorID}/avatar`
    );
    return data; // { message, authorID, projectViewForm }
  },

  async uploadPoster(formID, file, title = '') {
    const fd = new FormData();
    fd.append('poster', file);
    if (title) fd.append('title', title);
    const { data } = await apiClient.post(
      `${BASE}/${formID}/poster`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data; // { message, poster, projectViewForm }
  },

  async deletePoster(formID) {
    const { data } = await apiClient.delete(`${BASE}/${formID}/poster`);
    return data; // { message, projectViewForm }
  },

  // ── Public Read ──

  async getPublic(formID) {
    const { data } = await apiClient.get(`${BASE}/public/${formID}`);
    return data; // { message, formFound, projectViewForm? }
  },

  // ── Utility ──

  buildFileUrl(relativePath) {
    if (!relativePath) return null;
    return `/backend/studentSideData${BASE}/files/${relativePath}`;
  }
};
```

### 11.2 Auto-Save Pattern

```js
// In your editor component
import { debounce } from 'lodash';

// Create a debounced save function (saves 2 seconds after last change)
const debouncedSave = debounce(async (formID, fields) => {
  try {
    const result = await projectViewFormService.update(formID, fields);
    // Update local state with server response
    this.form = result.projectViewForm;
    this.lastSaved = new Date();
  } catch (error) {
    console.error('Auto-save failed:', error);
    this.saveError = error.response?.data?.message || 'Save failed';
  }
}, 2000);

// Call on every field change
function onFieldChange(fieldName, value) {
  this.form[fieldName] = value;  // Update local state immediately
  debouncedSave(this.form._id, { [fieldName]: value });
}
```

### 11.3 Create-or-Load Pattern

```js
// When entering the editor page for a project
async function initializeEditor(projectID) {
  // Step 1: Try to load existing form
  const getResult = await projectViewFormService.getByProject(projectID);

  if (getResult.formFound) {
    return getResult.projectViewForm;
  }

  // Step 2: No form exists — create a new draft
  const createResult = await projectViewFormService.create(projectID);
  return createResult.projectViewForm;
}
```

---

## 12. File Upload Implementation Guide

### 12.1 Avatar Upload Flow

```
User clicks author avatar area
        │
        ▼
AvatarCropperDialog opens
   (accepts image/*, crops to 256×256)
        │
        ▼
Cropped image returned as File/Blob
        │
        ▼
Frontend calls: uploadAvatar(formID, author._id, croppedBlob)
        │
        ▼
Backend saves file, updates author.avatarUrl in form document
        │
        ▼
Response includes full updated form → update local state
        │
        ▼
Display avatar using: buildFileUrl(author.avatarUrl)
```

**Important:** The `authorID` used in the upload URL must match the `_id` of the author in the form's `authors` array. This means:
1. Create the form first (or save the draft with the author added)
2. Read back the form to get the backend-generated `author._id`
3. Use that `_id` in the avatar upload URL

### 12.2 Poster Upload Flow

```
User selects file via FileUploader component
        │
        ▼
Validate client-side: type (PDF/image), size (≤ 10MB)
        │
        ▼
Frontend calls: uploadPoster(formID, file, posterTitle)
        │
        ▼
Backend saves file, sets poster.url, poster.fileType on form
        │
        ▼
Response includes full updated form → update local state
        │
        ▼
Display poster:
  - If fileType === 'image': <img :src="buildFileUrl(poster.url)">
  - If fileType === 'pdf': <iframe :src="buildFileUrl(poster.url)">
                           or a download link
```

### 12.3 File URL Construction

```js
// Helper to build full URL for display
function getFileDisplayUrl(relativePath) {
  if (!relativePath) return null;
  return `/backend/studentSideData/project-view-forms/files/${relativePath}`;
}

// Usage in templates:
// <img :src="getFileDisplayUrl(author.avatarUrl)" />
// <img :src="getFileDisplayUrl(form.poster.url)" v-if="form.poster?.fileType === 'image'" />
// <a :href="getFileDisplayUrl(form.poster.url)" v-if="form.poster?.fileType === 'pdf'">Download Poster</a>
```

### 12.4 Important Notes on File Fields vs. Form Fields

The form has **two categories of fields** that must be updated through **different endpoints**:

| Category | Fields | Update Via | Endpoint |
|---|---|---|---|
| **Content fields** | title, description, label, authors (name/role/quote), tags, findings, conclusion, partners, timeline, impactItems, footer, enabledSections | PATCH / PUT | `/project-view-forms/:formID` |
| **File fields** | `authors[].avatarUrl`, `poster.url`, `poster.fileType` | File upload/delete endpoints | `/.../:formID/authors/:authorID/avatar`, `/.../:formID/poster` |

**Do not** send `avatarUrl`, `poster.url`, or `poster.fileType` in PATCH/PUT request bodies. These fields are managed exclusively by the upload endpoints. Sending stale or manual values risks overwriting valid file references.

---

*Document version: 1.0 — Generated from backend implementation review, February 2026*