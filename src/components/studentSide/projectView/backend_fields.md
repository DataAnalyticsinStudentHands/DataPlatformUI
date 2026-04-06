

## Core Project Fields

**Basic Information (mandatory)**
- `title` — String, max 200 chars, required
- `description` — String, max 1000 chars, required
- `label.icon` — String (e.g., 'layers', 'code')
- `label.text` — String, max 50 chars, required (e.g., "Pharis Fellowship")

**Enabled Sections Configuration**
- `enabledSections` — Array of strings (e.g., `['findings', 'partners', 'poster', 'timeline', 'impact']`)

**Metadata**
- `createdAt` — Date
- `updatedAt` — Date
- `createdBy` — Reference to User ID
- `status` — String enum: `'draft'` | `'published'`
- `id` — Auto-generated project identifier (used in shareable URLs)

---

## Authors (mandatory, 1–6)

Each author object:
- `id` — String (internal identifier)
- `name` — String, max 100 chars, required
- `role` — String, max 100 chars, required
- `quote` — String, max 500 chars, optional
- `avatarUrl` — String (stored URL after upload)
- **`avatarFile`** — **FILE UPLOAD**: Image file (cropped to 256×256 JPEG via AvatarCropperDialog)

---

## Tags (mandatory, 1–10)

Each tag object:
- `id` — String
- `text` — String, max 50 chars, required
- `color` — String, hex format (e.g., `#4338ca`)

---

## Findings / Key Achievements (optional section, 1–3)

Each finding object:
- `id` — String
- `stat` — String, max 50 chars, required (e.g., "350%", "7+")
- `description` — String, max 200 chars, required
- `color` — String, hex format

---

## Conclusion (mandatory, part of findings display)

- `conclusion.text` — String, max 1000 chars, required
- `conclusion.attribution` — String, max 100 chars, optional (e.g., "— Carlos Mendieta")

---

## Partners (optional section, 0–10)

Each partner object:
- `id` — String
- `acronym` — String, max 20 chars, required (e.g., "EPA")
- `name` — String, max 150 chars, required
- `color` — String, hex format

---

## Timeline / Milestones (optional section, 2–10 when enabled)

**Timeline configuration:**
- `timelineLayout` — String enum: `'vertical'` | `'horizontal'`, default `'vertical'`
  - `vertical` — List-style timeline in the sidebar column
  - `horizontal` — Bar-style timeline with a central line, dots, and alternating top/bottom labels. When a poster/diagram is present, renders full-width below the content grid; otherwise renders inline in the sidebar.

Each milestone object:
- `id` — String
- `title` — String, max 100 chars, required
- `description` — String, max 200 chars, required
- `color` — String, hex format
- `dateType` — String enum: `'single'` | `'range'`
- `dateStart` — String (ISO date `YYYY-MM-DD`), optional
- `dateEnd` — String (ISO date `YYYY-MM-DD`), optional (only used when dateType is `'range'`)

---

## Impact Items (optional section, 2–6 when enabled)

Each impact item object:
- `id` — String
- `icon` — String, max 50 chars (MDI icon name, e.g., "mdi-school-outline", "mdi-target")
- `label` — String, max 50 chars, required
- `text` — String, max 200 chars, required

---

## Poster / Diagram (optional section)

- `poster.type` — String enum: `'pdf'` | `'image'`
- `poster.title` — String, max 100 chars, required when enabled
- `poster.url` — String (stored URL after upload)
- **`poster.file`** — **FILE UPLOAD**: PDF (up to 10MB) or image (JPEG, PNG, GIF, WebP up to 10MB)

---

## Footer (mandatory, auto-generated)

- `footer.icon` — String (emoji, e.g., "ℹ️")
- `footer.message` — String
- `footer.variant` — String enum: `'info'` | `'notice'` | `'success'` | `'warning'`

---

## Summary of File Uploads (2 upload paths)

| Upload | Source Component | Accepted Types | Max Size | Processing |
|---|---|---|---|---|
| Author avatar(s) | `AvatarCropperDialog.vue` | image/* | Cropped to 256×256 JPEG/PNG | Circular crop, output as File blob |
| Poster/diagram | `FileUploader.vue` | PDF, JPEG, PNG, GIF, WebP | 10MB | Stored as-is |

Up to **6 avatar files** (one per author) + **1 poster file** = max 7 file uploads per project.

---

## Access & Routing Needs

From `ProjectViewPage.vue` and `ProjectEditorPage.vue`:
- **Public read** — Fetch project by ID via shareable URL (no auth required)
- **Owner write** — Create, edit, save draft, publish (requires student auth)
- **Draft persistence** — Currently using localStorage, needs to move to MongoDB
- **Access revocation** — Frontend has a "revoked" state, so the model needs a way to toggle public visibility

---
