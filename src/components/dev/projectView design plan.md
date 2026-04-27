# Dynamic Project View Design Plan

## Overview

Transform two hardcoded project page templates into a reusable, data-driven system where students can select a template, fill out a form, and preview their project page.

---

## Phase 1: Data Model & Type Definitions

**Goal:** Define the data structures that will drive both templates.

### Files Needed for Context
- `src/components/dev/indProjectPage1.vue` (Template 1 - Single Author/PDF Poster)
- `src/components/dev/indProjectPage_engaged_data.vue` (Template 2 - Multi-Author/Timeline)

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dev/projectView/types/projectTypes.js` | Shared type definitions and default values for both templates |

### Data Structures to Define

**Template 1 (Research/Fellowship Style):**
```
- templateType: 'research'
- label: { icon, text }
- title
- description
- author: { name, role, quote, avatarUrl }
- tags: []
- keyFindings: [{ stat, description, variant }]
- conclusionText, conclusionAttribution
- partners: [{ acronym, name, color }]
- posterPdfUrl
- footerMessage
```

**Template 2 (Development/Team Style):**
```
- templateType: 'development'
- label: { icon, text }
- title
- description
- authors: [{ name, role, quote, avatarUrl }]
- tags: []
- keyAchievements: [{ stat, description, variant }]
- conclusionText, conclusionAttribution
- milestones: [{ title, description, color }]
- impactItems: [{ icon, label, text }]
- partners: [{ acronym, name, color }]
- posterImageUrl
- footerMessage
```

---

## Phase 2: Reusable Sub-Components

**Goal:** Extract repeated UI patterns from templates into shared components.

### Files Needed for Context
- `src/components/dev/indProjectPage1.vue`
- `src/components/dev/indProjectPage_engaged_data.vue`
- `src/components/dev/projectView/types/projectTypes.js` (from Phase 1)

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dev/projectView/components/ProjectHeroSingle.vue` | Hero header for single-author template |
| `src/components/dev/projectView/components/ProjectHeroMulti.vue` | Hero header for multi-author template |
| `src/components/dev/projectView/components/TagsCard.vue` | Reusable tags display |
| `src/components/dev/projectView/components/FindingsCard.vue` | Key findings/achievements grid with conclusion |
| `src/components/dev/projectView/components/PartnersCard.vue` | Partners grid display |
| `src/components/dev/projectView/components/TimelineCard.vue` | Development timeline (Template 2 only) |
| `src/components/dev/projectView/components/ImpactCard.vue` | Impact grid (Template 2 only) |
| `src/components/dev/projectView/components/PosterCardPdf.vue` | PDF poster embed with modal zoom |
| `src/components/dev/projectView/components/PosterCardImage.vue` | Image poster with modal zoom |
| `src/components/dev/projectView/components/FooterBanner.vue` | Footer information banner |
| `src/components/dev/projectView/components/ZoomModal.vue` | Shared zoom modal for poster viewing |

---

## Phase 3: Dynamic Template Renderers

**Goal:** Create the two template layouts that accept props instead of hardcoded data.

### Files Needed for Context
- `src/components/dev/indProjectPage1.vue`
- `src/components/dev/indProjectPage_engaged_data.vue`
- `src/components/dev/projectView/types/projectTypes.js`
- All components from Phase 2

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dev/projectView/templates/ResearchTemplate.vue` | Dynamic version of Template 1 (single author, PDF poster) |
| `src/components/dev/projectView/templates/DevelopmentTemplate.vue` | Dynamic version of Template 2 (multi-author, timeline, image poster) |

### Component Interface
Both templates will receive a single `project` prop containing all necessary data and render the appropriate layout.

---

## Phase 4: Form Components

**Goal:** Create input forms for each template type with validation.

### Files Needed for Context
- `src/components/dev/projectView/types/projectTypes.js`
- Existing form patterns from `src/components/studentSide/` (for styling consistency)

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dev/projectView/forms/ProjectFormResearch.vue` | Form for Template 1 data entry |
| `src/components/dev/projectView/forms/ProjectFormDevelopment.vue` | Form for Template 2 data entry |
| `src/components/dev/projectView/forms/shared/AuthorInput.vue` | Reusable author entry (name, role, quote, avatar upload) |
| `src/components/dev/projectView/forms/shared/TagsInput.vue` | Tag entry with add/remove |
| `src/components/dev/projectView/forms/shared/FindingsInput.vue` | Findings/achievements entry with variant selection |
| `src/components/dev/projectView/forms/shared/PartnersInput.vue` | Partners entry with color picker |
| `src/components/dev/projectView/forms/shared/MilestonesInput.vue` | Timeline milestones entry |
| `src/components/dev/projectView/forms/shared/ImpactInput.vue` | Impact items entry with emoji picker |
| `src/components/dev/projectView/forms/shared/FileUploader.vue` | Handles PDF/image uploads for posters and avatars |

### Form Sections for Template 1 (Research)
1. Basic Info (label, title, description)
2. Author Details (single author)
3. Tags
4. Key Findings (up to 3)
5. Conclusion
6. Partners
7. Poster Upload (PDF)

### Form Sections for Template 2 (Development)
1. Basic Info (label, title, description)
2. Team Members (multiple authors)
3. Tags
4. Key Achievements (up to 3)
5. Conclusion
6. Development Timeline
7. Impact Summary
8. Partners
9. Poster Upload (Image)

---

## Phase 5: Template Selection & Preview Flow

**Goal:** Create the main orchestration components for the complete user flow.

### Files Needed for Context
- `src/components/dev/projectView/types/projectTypes.js`
- `src/components/dev/projectView/templates/ResearchTemplate.vue`
- `src/components/dev/projectView/templates/DevelopmentTemplate.vue`
- `src/components/dev/projectView/forms/ProjectFormResearch.vue`
- `src/components/dev/projectView/forms/ProjectFormDevelopment.vue`

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dev/projectView/ProjectTemplateSelector.vue` | Visual template picker with thumbnails/descriptions |
| `src/components/dev/projectView/ProjectFormContainer.vue` | Wraps the appropriate form based on template selection |
| `src/components/dev/projectView/ProjectPreview.vue` | Live preview pane showing rendered template |
| `src/components/dev/projectView/ProjectEditorMain.vue` | Main orchestrator with stepper: Select → Fill → Preview |

### User Flow
```
1. Template Selection
   └─> Show both templates as cards with preview thumbnails
   └─> User clicks to select

2. Form Entry
   └─> Load appropriate form based on selection
   └─> Multi-step form with auto-save (following existing app patterns)
   └─> Side-by-side live preview (optional toggle)

3. Preview & Submit
   └─> Full-screen preview of rendered template
   └─> Edit button to return to form
   └─> Submit/Save button
```

---

## Phase 6: Router Integration & Page Components

**Goal:** Add routes and create page-level components.

### Files Needed for Context
- `src/router/index.js`
- `src/components/dev/projectView/ProjectEditorMain.vue`
- `src/components/dev/projectView/templates/ResearchTemplate.vue`
- `src/components/dev/projectView/templates/DevelopmentTemplate.vue`

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dev/projectView/pages/ProjectViewPage.vue` | Public view of a project (receives project ID, fetches data, renders template) |
| `src/components/dev/projectView/pages/ProjectEditorPage.vue` | Editor wrapper for creating/editing projects |

### Files to Update

| File | Changes |
|------|---------|
| `src/router/index.js` | Add routes for project editor and public project view |

### New Routes to Add
```javascript
// Project Editor (authenticated)
{
  path: "/projectEditor",
  name: "projectEditor",
  component: () => import("@/components/dev/projectView/pages/ProjectEditorPage.vue"),
  beforeEnter: requireStudentWithExperiences,
}

// Edit existing project
{
  path: "/projectEditor/:projectId",
  name: "projectEditorEdit",
  component: () => import("@/components/dev/projectView/pages/ProjectEditorPage.vue"),
  beforeEnter: requireStudentWithExperiences,
}

// Public project view
{
  path: "/project/:projectId",
  name: "publicProjectView",
  component: () => import("@/components/dev/projectView/pages/ProjectViewPage.vue"),
}

// Dev preview routes (for testing)
{
  path: "/dev/projectPreview",
  name: "devProjectPreview",
  component: () => import("@/components/dev/projectView/ProjectEditorMain.vue"),
}
```

---

## Phase 7: State Management & API Integration

**Goal:** Connect to backend for persistence.

### Files Needed for Context
- `src/components/dev/projectView/types/projectTypes.js`
- Existing API patterns from `src/api/` or similar
- Existing Pinia stores from `src/stored/`

### Files to Create

| File | Purpose |
|------|---------|
| `src/stored/projectViewStore.js` | Pinia store for project view state (draft data, selected template, etc.) |
| `src/api/projectViewApi.js` | API calls for saving/loading project view data |

### Files to Update

| File | Changes |
|------|---------|
| `src/stored/loggedInUser.js` | Add reference to user's project views if needed |

### API Endpoints Needed (Backend)
```
POST   /api/project-views           - Create new project view
GET    /api/project-views/:id       - Get project view by ID
PUT    /api/project-views/:id       - Update project view
DELETE /api/project-views/:id       - Delete project view
GET    /api/project-views/user/:id  - Get all project views for a user
POST   /api/project-views/upload    - Upload poster/avatar files
```

---

## Phase 8: Polish & Enhancements

**Goal:** Add finishing touches and UX improvements.

### Files Needed for Context
- All files from previous phases

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dev/projectView/components/TemplatePreviewThumbnail.vue` | Mini preview cards for template selection |
| `src/components/dev/projectView/components/FormProgressIndicator.vue` | Visual progress through form sections |
| `src/components/dev/projectView/components/AutoSaveIndicator.vue` | Shows save status |

### Files to Update

| File | Changes |
|------|---------|
| `src/components/dev/projectView/ProjectEditorMain.vue` | Add auto-save, keyboard shortcuts, better mobile responsiveness |
| `src/components/dev/projectView/ProjectPreview.vue` | Add export/print functionality |

### Enhancements
- Auto-save drafts to localStorage and/or API
- Form validation with helpful error messages
- Image cropping for avatars
- Color picker presets for partners
- Emoji picker for impact icons
- Print-friendly view option
- Share link generation

---

## Summary: File Structure

```
src/components/dev/projectView/
├── types/
│   └── projectTypes.js
├── components/
│   ├── ProjectHeroSingle.vue
│   ├── ProjectHeroMulti.vue
│   ├── TagsCard.vue
│   ├── FindingsCard.vue
│   ├── PartnersCard.vue
│   ├── TimelineCard.vue
│   ├── ImpactCard.vue
│   ├── PosterCardPdf.vue
│   ├── PosterCardImage.vue
│   ├── FooterBanner.vue
│   ├── ZoomModal.vue
│   ├── TemplatePreviewThumbnail.vue
│   ├── FormProgressIndicator.vue
│   └── AutoSaveIndicator.vue
├── templates/
│   ├── ResearchTemplate.vue
│   └── DevelopmentTemplate.vue
├── forms/
│   ├── ProjectFormResearch.vue
│   ├── ProjectFormDevelopment.vue
│   └── shared/
│       ├── AuthorInput.vue
│       ├── TagsInput.vue
│       ├── FindingsInput.vue
│       ├── PartnersInput.vue
│       ├── MilestonesInput.vue
│       ├── ImpactInput.vue
│       └── FileUploader.vue
├── pages/
│   ├── ProjectViewPage.vue
│   └── ProjectEditorPage.vue
├── ProjectTemplateSelector.vue
├── ProjectFormContainer.vue
├── ProjectPreview.vue
└── ProjectEditorMain.vue
```

---

## Implementation Order Recommendation

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Phase 1 | Small | None |
| Phase 2 | Medium | Phase 1 |
| Phase 3 | Medium | Phase 1, 2 |
| Phase 4 | Large | Phase 1 |
| Phase 5 | Medium | Phase 3, 4 |
| Phase 6 | Small | Phase 5 |
| Phase 7 | Medium | Phase 5, 6 |
| Phase 8 | Small | Phase 5, 6, 7 |

Total estimated files: **~30 new files**, **2 files to update**