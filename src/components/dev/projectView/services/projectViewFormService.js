/**
 * src/components/dev/projectView/services/projectViewFormService.js
 *
 * API service for project view forms.
 * Handles field mapping between frontend and backend formats,
 * CRUD operations, file uploads, and status transitions.
 */

import axios from 'axios';

const apiURL = import.meta.env.VITE_ROOT_API;
const BASE = `${apiURL}/studentSideData/project-view-forms`;

// =============================================================================
// FIELD MAPPING: Frontend ↔ Backend
// =============================================================================

/**
 * Check if an ID is a frontend-generated temporary ID.
 * generateId() produces: `${Date.now()}-${random}` e.g. "1770400089025-3mqjekw"
 * Backend IDs (MongoDB ObjectIds or numeric) won't match this pattern.
 */
function isFrontendGeneratedId(id) {
  return typeof id === 'string' && /^\d+-[a-z0-9]+$/.test(id);
}

/**
 * Map `id` → `_id` on a sub-document object.
 * Skips frontend-generated temporary IDs so the backend can assign real ones.
 * Passes through all other fields unchanged.
 */
function mapIdToBackend(item) {
  if (!item) return item;
  const { id, ...rest } = item;
  const mapped = { ...rest };
  // Only send _id for backend-assigned IDs, not frontend-generated temps
  if (id && !isFrontendGeneratedId(id)) {
    mapped._id = id;
  }
  return mapped;
}

/**
 * Map `_id` → `id` on a sub-document object.
 * Passes through all other fields unchanged.
 */
function mapIdToFrontend(item) {
  if (!item) return item;
  const { _id, ...rest } = item;
  const mapped = { ...rest };
  if (_id) mapped.id = _id;
  return mapped;
}

/**
 * Convert a full frontend project object to backend format for PUT/POST.
 * - `id` → `_id` on all sub-documents
 * - `milestones` → `timeline`
 * - `poster.type` → `poster.fileType`
 * - Strips `avatarFile` from authors, `poster.file` from poster
 * - Strips server-managed fields: `avatarUrl`, `poster.url`, `poster.fileType`
 * - Flattens `metadata` → top-level `status`
 * - Passes through: timelineLayout, footer, label, conclusion, enabledSections
 */
export function toBackendFormat(frontendProject) {
  const backend = {};

  // Pass-through top-level fields
  if (frontendProject.title !== undefined) backend.title = frontendProject.title;
  if (frontendProject.description !== undefined) backend.description = frontendProject.description;
  if (frontendProject.enabledSections !== undefined) backend.enabledSections = [...frontendProject.enabledSections];
  if (frontendProject.timelineLayout !== undefined) backend.timelineLayout = frontendProject.timelineLayout;

  // Label (pass through)
  if (frontendProject.label) {
    backend.label = { ...frontendProject.label };
  }

  // Conclusion (pass through)
  if (frontendProject.conclusion) {
    backend.conclusion = { ...frontendProject.conclusion };
  }

  // Footer (pass through)
  if (frontendProject.footer) {
    backend.footer = { ...frontendProject.footer };
  }

  // Authors: id → _id, strip avatarFile and avatarUrl (server-managed)
  if (frontendProject.authors) {
    backend.authors = frontendProject.authors.map(author => {
      const mapped = mapIdToBackend(author);
      delete mapped.avatarFile;
      delete mapped.avatarUrl;
      return mapped;
    });
  }

  // Tags: id → _id
  if (frontendProject.tags) {
    backend.tags = frontendProject.tags.map(mapIdToBackend);
  }

  // Findings: id → _id
  if (frontendProject.findings) {
    backend.findings = frontendProject.findings.map(mapIdToBackend);
  }

  // Partners: id → _id
  if (frontendProject.partners) {
    backend.partners = frontendProject.partners.map(mapIdToBackend);
  }

  // Milestones → timeline: id → _id
  if (frontendProject.milestones) {
    backend.timeline = frontendProject.milestones.map(mapIdToBackend);
  }

  // Impact items: id → _id
  if (frontendProject.impactItems) {
    backend.impactItems = frontendProject.impactItems.map(mapIdToBackend);
  }

  // Poster: type → fileType, strip file/url/fileType (server-managed)
  if (frontendProject.poster) {
    backend.poster = {
      title: frontendProject.poster.title || '',
    };
    // Don't send: file, url, fileType (all server-managed via upload endpoint)
  }

  // Note: status is NOT mapped here — it is set explicitly by
  // publish(), revoke(), and unpublish() to avoid invalid
  // same-status transitions (e.g. draft → draft) on auto-save.

  return backend;
}

/**
 * Convert a backend form response to frontend format.
 * - `_id` → `id` on all sub-documents
 * - `timeline` → `milestones`
 * - `poster.fileType` → `poster.type`
 * - Nests `status`/`createdAt`/`updatedAt`/`userID` into `metadata`
 * - Adds `avatarFile: null` on authors, `poster.file: null`
 * - Preserves `avatarUrl`, `poster.url` for display
 */
export function fromBackendFormat(backendForm) {
  const frontend = {};

  // Top-level ID
  if (backendForm._id) frontend.id = backendForm._id;

  // Pass-through top-level fields
  if (backendForm.title !== undefined) frontend.title = backendForm.title;
  if (backendForm.description !== undefined) frontend.description = backendForm.description;
  if (backendForm.enabledSections !== undefined) frontend.enabledSections = [...backendForm.enabledSections];
  if (backendForm.timelineLayout !== undefined) frontend.timelineLayout = backendForm.timelineLayout;

  // Label (pass through)
  if (backendForm.label) {
    frontend.label = { ...backendForm.label };
  }

  // Conclusion (pass through)
  if (backendForm.conclusion) {
    frontend.conclusion = { ...backendForm.conclusion };
  }

  // Footer (pass through)
  if (backendForm.footer) {
    frontend.footer = { ...backendForm.footer };
  }

  // Authors: _id → id, add avatarFile: null, preserve avatarUrl
  if (backendForm.authors) {
    frontend.authors = backendForm.authors.map(author => {
      const mapped = mapIdToFrontend(author);
      mapped.avatarFile = null;
      // avatarUrl is preserved from backend for display
      return mapped;
    });
  }

  // Tags: _id → id
  if (backendForm.tags) {
    frontend.tags = backendForm.tags.map(mapIdToFrontend);
  }

  // Findings: _id → id
  if (backendForm.findings) {
    frontend.findings = backendForm.findings.map(mapIdToFrontend);
  }

  // Partners: _id → id
  if (backendForm.partners) {
    frontend.partners = backendForm.partners.map(mapIdToFrontend);
  }

  // Timeline → milestones: _id → id
  if (backendForm.timeline) {
    frontend.milestones = backendForm.timeline.map(mapIdToFrontend);
  }

  // Impact items: _id → id
  if (backendForm.impactItems) {
    frontend.impactItems = backendForm.impactItems.map(mapIdToFrontend);
  }

  // Poster: fileType → type, add file: null, preserve url
  if (backendForm.poster) {
    frontend.poster = {
      type: backendForm.poster.fileType || 'pdf',
      url: backendForm.poster.url || '',
      title: backendForm.poster.title || '',
      file: null,
    };
  } else {
    frontend.poster = null;
  }

  // Nest metadata from top-level fields
  frontend.metadata = {
    status: backendForm.status || 'draft',
    createdAt: backendForm.createdAt || '',
    updatedAt: backendForm.updatedAt || '',
    createdBy: backendForm.userID || '',
  };

  return frontend;
}

/**
 * Convert a partial set of frontend fields for PATCH.
 * Same mapping as toBackendFormat but only for provided fields.
 * Always strips server-managed file fields.
 */
export function toBackendPatchFields(fields) {
  // Use the same mapping; toBackendFormat only maps defined fields
  return toBackendFormat(fields);
}

// =============================================================================
// CRUD METHODS
// =============================================================================

/**
 * Create a new project view form for a project.
 * @param {string} projectID - The parent project's ID
 * @param {Object} [formData] - Optional initial form data (frontend format)
 * @returns {Promise<Object>} Created form in backend format
 */
export async function create(projectID, formData) {
  const payload = { projectID };
  if (formData) {
    Object.assign(payload, toBackendFormat(formData));
  }
  const response = await axios.post(BASE, payload);
  return response.data.projectViewForm || response.data;
}

/**
 * Get a project view form by its parent project ID.
 * @param {string} projectID
 * @returns {Promise<{formFound: boolean, data: Object|null}>}
 */
export async function getByProject(projectID) {
  try {
    const response = await axios.get(`${BASE}/by-project/${projectID}`);
    return { formFound: true, data: response.data.projectViewForm || response.data };
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return { formFound: false, data: null };
    }
    throw err;
  }
}

/**
 * Update (PATCH) a project view form.
 * @param {string} formID
 * @param {Object} frontendFields - Partial frontend fields to update
 * @returns {Promise<Object>} Updated form in backend format
 */
export async function update(formID, frontendFields) {
  const payload = toBackendPatchFields(frontendFields);
  const response = await axios.patch(`${BASE}/${formID}`, payload);
  return response.data.projectViewForm || response.data;
}

/**
 * Full replacement (PUT) of a project view form.
 * @param {string} formID
 * @param {Object} frontendFields - Full frontend project data
 * @returns {Promise<Object>} Updated form in backend format
 */
export async function replace(formID, frontendFields) {
  const payload = toBackendFormat(frontendFields);
  const response = await axios.put(`${BASE}/${formID}`, payload);
  return response.data.projectViewForm || response.data;
}

/**
 * Delete a project view form.
 * Note: Published forms cannot be deleted — must be revoked first.
 * @param {string} formID
 * @returns {Promise<Object>}
 */
export async function remove(formID) {
  const response = await axios.delete(`${BASE}/${formID}`);
  return response.data.projectViewForm || response.data;
}

// =============================================================================
// STATUS TRANSITIONS
// =============================================================================

/**
 * Publish a project view form.
 * Optionally updates fields before publishing.
 * @param {string} formID
 * @param {Object} [frontendFields] - Optional fields to update before publishing
 * @returns {Promise<Object>} Updated form in backend format
 */
export async function publish(formID, frontendFields) {
  const payload = frontendFields ? toBackendPatchFields(frontendFields) : {};
  payload.status = 'published';
  const response = await axios.patch(`${BASE}/${formID}`, payload);
  return response.data.projectViewForm || response.data;
}

/**
 * Revoke a published project view form.
 * @param {string} formID
 * @returns {Promise<Object>}
 */
export async function revoke(formID) {
  const response = await axios.patch(`${BASE}/${formID}`, { status: 'revoked' });
  return response.data.projectViewForm || response.data;
}

/**
 * Unpublish (set back to draft) a project view form.
 * @param {string} formID
 * @returns {Promise<Object>}
 */
export async function unpublish(formID) {
  const response = await axios.patch(`${BASE}/${formID}`, { status: 'draft' });
  return response.data.projectViewForm || response.data;
}

// =============================================================================
// FILE UPLOADS
// =============================================================================

/**
 * Upload an avatar image for an author.
 * Response includes the full projectViewForm — caller should sync local state.
 * @param {string} formID
 * @param {string} authorID - The author's backend _id
 * @param {File} imageFile
 * @returns {Promise<Object>} Full updated form in backend format
 */
export async function uploadAvatar(formID, authorID, imageFile) {
  const formData = new FormData();
  formData.append('avatar', imageFile);

  const response = await axios.post(
    `${BASE}/${formID}/authors/${authorID}/avatar`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.projectViewForm || response.data;
}

/**
 * Delete an author's avatar.
 * Response includes the full projectViewForm.
 * @param {string} formID
 * @param {string} authorID
 * @returns {Promise<Object>}
 */
export async function deleteAvatar(formID, authorID) {
  const response = await axios.delete(`${BASE}/${formID}/authors/${authorID}/avatar`);
  return response.data.projectViewForm || response.data;
}

/**
 * Upload a poster file (PDF or image).
 * Title is sent as a text field in the same multipart request.
 * Response includes the full projectViewForm.
 * @param {string} formID
 * @param {File} file
 * @param {string} [title]
 * @returns {Promise<Object>}
 */
export async function uploadPoster(formID, file, title) {
  const formData = new FormData();
  formData.append('poster', file);
  if (title) {
    formData.append('title', title);
  }

  const response = await axios.post(
    `${BASE}/${formID}/poster`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.projectViewForm || response.data;
}

/**
 * Delete the poster from a form.
 * Response includes the full projectViewForm.
 * @param {string} formID
 * @returns {Promise<Object>}
 */
export async function deletePoster(formID) {
  const response = await axios.delete(`${BASE}/${formID}/poster`);
  return response.data.projectViewForm || response.data;
}

// =============================================================================
// PUBLIC + UTILITY
// =============================================================================

/**
 * Get a published form for public viewing (no auth required).
 * Response excludes userID and organizationID.
 * @param {string} formID
 * @returns {Promise<Object>}
 */
export async function getPublic(formID) {
  const response = await axios.get(`${BASE}/public/${formID}`);
  return response.data;
}

/**
 * Build a full URL for a file stored by the backend.
 * @param {string} relativePath - e.g. "avatars/abc123.jpg"
 * @returns {string} Full URL
 */
export function buildFileUrl(relativePath) {
  if (!relativePath) return '';
  // If it's already an absolute URL, return as-is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  return `${BASE}/files/${relativePath}`;
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  // Field mapping
  toBackendFormat,
  fromBackendFormat,
  toBackendPatchFields,

  // CRUD
  create,
  getByProject,
  update,
  replace,
  remove,

  // Status transitions
  publish,
  revoke,
  unpublish,

  // File uploads
  uploadAvatar,
  deleteAvatar,
  uploadPoster,
  deletePoster,

  // Public + utility
  getPublic,
  buildFileUrl,
};