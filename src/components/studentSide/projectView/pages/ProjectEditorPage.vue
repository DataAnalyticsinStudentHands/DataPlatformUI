/**
 * src/components/studentSide/projectView/pages/ProjectEditorPage.vue
 *
 * Page wrapper for the project editor.
 * Handles loading existing projects for editing and saving to API.
 * Protected route requiring student authentication.
 */

<template>
  <div class="project-editor-page">
    <!-- Loading State (when editing existing project) -->
    <div v-if="isLoadingProject" class="loading-container">
      <v-progress-circular
        indeterminate
        color="#c8102e"
        size="64"
        width="4"
      />
      <p class="loading-text">{{ $t('Loading project...') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="error-container">
      <v-icon size="80" color="#dc2626" class="mb-4">mdi-alert-circle-outline</v-icon>
      <h1 class="error-title">{{ $t('Failed to Load Project') }}</h1>
      <p class="error-message">{{ loadError }}</p>
      <div class="error-actions">
        <v-btn
          variant="outlined"
          color="#666"
          class="mr-3"
          @click="goBack"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          {{ $t('Go Back') }}
        </v-btn>
        <v-btn
          color="#c8102e"
          variant="flat"
          @click="createNew"
        >
          <v-icon start>mdi-plus</v-icon>
          {{ $t('Create New Project') }}
        </v-btn>
      </div>
    </div>

    <!-- Editor Component -->
    <ProjectEditorMain
      v-else
      ref="editorRef"
      :initial-project="existingProject"
      :project-id="projectId"
      :form-id="formId"
      @save="handleSave"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <!-- Save Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card>
        <v-card-text class="text-center py-8">
          <v-icon size="64" color="#16a34a" class="mb-4">mdi-check-circle</v-icon>
          <h2 class="text-h5 font-weight-bold mb-2">
            {{ isEditing ? $t('Project Updated!') : $t('Project Published!') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            {{ $t('Your project page is now live and can be shared with others.') }}
          </p>
        </v-card-text>
        <v-card-actions class="justify-center pb-6">
          <v-btn
            variant="outlined"
            color="#666"
            class="mr-3"
            @click="viewProject"
          >
            <v-icon start>mdi-eye</v-icon>
            {{ $t('View Project') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            variant="flat"
            @click="copyShareLink"
          >
            <v-icon start>mdi-share-variant</v-icon>
            {{ linkCopied ? $t('Copied!') : $t('Copy Link') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorSnackbar"
      :timeout="5000"
      color="error"
    >
      {{ saveError }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showErrorSnackbar = false">
          {{ $t('Close') }}
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Unsaved Changes Warning -->
    <v-dialog v-model="showLeaveDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{ $t('Unsaved Changes') }}
        </v-card-title>
        <v-card-text>
          {{ $t('You have unsaved changes. Are you sure you want to leave? Your draft has been auto-saved.') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showLeaveDialog = false">
            {{ $t('Stay') }}
          </v-btn>
          <v-btn color="error" variant="flat" @click="confirmLeave">
            {{ $t('Leave') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { toast } from 'vue3-toastify';
import ProjectEditorMain from '../ProjectEditorMain.vue';
import formService from '../services/projectViewFormService.js';
import { mergeWithDefaults } from '../types/projectTypes.js';

const route = useRoute();
const router = useRouter();

// Refs
const editorRef = ref(null);

// State
const existingProject = ref(null);
const formId = ref(null);
const isLoadingProject = ref(false);
const loadError = ref(null);
const saveError = ref(null);
const showSuccessDialog = ref(false);
const showErrorSnackbar = ref(false);
const showLeaveDialog = ref(false);
const pendingNavigation = ref(null);
const confirmedLeave = ref(false);
const savedProjectId = ref(null);
const linkCopied = ref(false);

// Computed
const projectId = computed(() => route.params.projectId || '');
const isEditing = computed(() => !!projectId.value);

// ============================================================================
// FILE UPLOAD HELPER
// ============================================================================

/**
 * Upload all pending files (author avatars + poster) for a saved form.
 * 
 * Must be called AFTER the form document is saved so that:
 *   1. The form exists in the DB (required by upload endpoints)
 *   2. Authors have backend-assigned _id values (needed for avatar endpoint URL)
 * 
 * Uses `syncedData` (the response from save/create) which has real backend IDs,
 * cross-referenced with `originalData` (the editor state) which has pending File objects.
 * 
 * @param {string} currentFormId — The saved form's _id
 * @param {Object} originalData — The editor's form data (has avatarFile / poster.file)
 * @param {Object} syncedData — The fromBackendFormat() result (has real author IDs)
 * @returns {Promise<Object>} syncedData with uploaded URLs merged in
 */
async function uploadPendingFiles(currentFormId, originalData, syncedData) {
  const uploadErrors = [];

  // 1. Upload pending author avatars
  //    Match by index — author order is preserved through save
  if (Array.isArray(originalData.authors) && Array.isArray(syncedData.authors)) {
    for (let i = 0; i < originalData.authors.length; i++) {
      const original = originalData.authors[i];
      const synced = syncedData.authors[i];

      // Check if this author has a pending file AND has a real backend ID
      if (original?.avatarFile instanceof File && synced?.id) {
        try {
          const updatedForm = await formService.uploadAvatar(
            currentFormId,
            synced.id,        // Use backend-assigned ID from synced response
            original.avatarFile
          );

          // Find this author in the returned form to get the new avatarUrl
          const updatedAuthor = formService.fromBackendFormat(updatedForm)?.authors?.[i];
          if (updatedAuthor?.avatarUrl) {
            syncedData.authors[i].avatarUrl = updatedAuthor.avatarUrl;
          }

          // Clear the pending file reference
          original.avatarFile = null;
        } catch (err) {
          console.error(`Failed to upload avatar for author ${synced.id}:`, err);
          uploadErrors.push(`Avatar upload failed for ${original.name || 'author'}`);
        }
      }
    }
  }

  // Note: Poster file selection is handled immediately by ClowderFileSelector,
  // not deferred to the save flow.

  // Show warning toast if some uploads failed (non-blocking)
  if (uploadErrors.length > 0) {
    console.warn('Some file uploads failed:', uploadErrors);
    toast.warning(`Some files could not be uploaded: ${uploadErrors.join(', ')}. You can try again.`);
  }

  return syncedData;
}

// ============================================================================
// LOAD / SAVE / PUBLISH
// ============================================================================

// Load existing project or create new form via API
async function loadExistingProject() {
  if (!projectId.value) return;

  try {
    isLoadingProject.value = true;
    loadError.value = null;

    // Try to fetch existing form for this project
    const result = await formService.getByProject(projectId.value);

    if (result.formFound) {
      // Existing form found — load it
      formId.value = result.data._id;
      const frontendData = formService.fromBackendFormat(result.data);
      existingProject.value = mergeWithDefaults(frontendData);
    } else {
      // No form exists — create a new draft
      const created = await formService.create(projectId.value);
      formId.value = created._id;
      const frontendData = formService.fromBackendFormat(created);
      existingProject.value = mergeWithDefaults(frontendData);
    }
  } catch (err) {
    console.error('Failed to load project:', err);
    loadError.value = 'Failed to load project. Please try again.';
  } finally {
    isLoadingProject.value = false;
  }
}

// Handle save (draft) — called from EditorMain
async function handleSave(projectData) {
  if (!formId.value) return;

  try {
    // 1. Save the form document (text fields, structure)
    const response = await formService.update(formId.value, projectData);
    let synced = formService.fromBackendFormat(response);
    savedProjectId.value = formId.value;

    // 2. Upload any pending files using backend-assigned IDs from response
    synced = await uploadPendingFiles(formId.value, projectData, synced);

    // 3. Sync everything back to editor (IDs + file URLs)
    if (editorRef.value?.syncFromBackend) {
      editorRef.value.syncFromBackend(synced);
    }
  } catch (err) {
    console.error('Failed to save draft:', err);
    saveError.value = 'Failed to save draft. Please try again.';
    showErrorSnackbar.value = true;
  }
}

// Handle submit (publish) — called from EditorMain step 3
async function handleSubmit(projectData) {
  if (!formId.value) return;

  try {
    // 1. Save as draft first to persist any unsaved changes + get real IDs
    const saveResponse = await formService.update(formId.value, projectData);
    let synced = formService.fromBackendFormat(saveResponse);

    // 2. Upload pending files BEFORE publishing
    //    (poster.url must exist in DB for publish validation to pass)
    synced = await uploadPendingFiles(formId.value, projectData, synced);

    // 3. Now publish — the form doc already has file URLs from uploads
    //    Skip publish() if already published (backend rejects published→published)
    const currentStatus = synced.metadata?.status;
    let publishResponse;
    if (currentStatus === 'published') {
      publishResponse = await formService.update(formId.value, synced);
    } else {
      publishResponse = await formService.publish(formId.value, synced);
    }
    savedProjectId.value = formId.value;
    showSuccessDialog.value = true;

    // 4. Sync published state back to editor
    const finalSynced = formService.fromBackendFormat(publishResponse);
    if (editorRef.value?.syncFromBackend) {
      editorRef.value.syncFromBackend(finalSynced);
    }
  } catch (err) {
    console.error('Failed to publish project:', err);
    const message = err.response?.data?.message || 'Failed to publish project. Please try again.';
    saveError.value = message;
    showErrorSnackbar.value = true;
    // Reset submitting state so user can retry
    if (editorRef.value?.resetSubmitting) {
      editorRef.value.resetSubmitting();
    }
  }
}

// Handle cancel
function handleCancel() {
  if (editorRef.value?.hasUnsavedChanges?.()) {
    showLeaveDialog.value = true;
    pendingNavigation.value = () => goBack();
  } else {
    goBack();
  }
}

// Navigation helpers
function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/studentDashboard');
  }
}

function createNew() {
  router.push({ name: 'projectEditor' });
}

function viewProject() {
  showSuccessDialog.value = false;
  router.push({
    name: 'publicProjectView',
    params: { projectId: savedProjectId.value }
  });
}

async function copyShareLink() {
  const shareUrl = `${window.location.origin}/platform/project/${savedProjectId.value}`;

  try {
    await navigator.clipboard.writeText(shareUrl);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
}

function confirmLeave() {
  showLeaveDialog.value = false;
  confirmedLeave.value = true;
  if (pendingNavigation.value) {
    const destination = pendingNavigation.value;
    pendingNavigation.value = null;
    if (typeof destination === 'function') {
      destination();
    } else {
      router.push(destination);
    }
  }
}

// Route leave guard (use return-value API to avoid calling next() twice)
onBeforeRouteLeave((to) => {
  if (confirmedLeave.value) return;
  if (editorRef.value?.hasUnsavedChanges?.() && !showSuccessDialog.value) {
    showLeaveDialog.value = true;
    pendingNavigation.value = to.fullPath;
    return false;
  }
});

// Lifecycle
onMounted(() => {
  // Always load via API — for new projects, projectId comes from route
  if (projectId.value) {
    loadExistingProject();
  }
});

// Expose for testing
defineExpose({
  loadExistingProject,
  handleSave,
  handleSubmit
});
</script>

<style scoped>
.project-editor-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
}

.loading-text {
  font-size: 1rem;
  color: #666;
  margin-top: 8px;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  text-align: center;
}

.error-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.error-message {
  font-size: 1rem;
  color: #666;
  max-width: 400px;
  margin-bottom: 24px;
}

.error-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .error-title {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .v-btn {
    width: 100%;
    margin: 0 !important;
  }
}
</style>