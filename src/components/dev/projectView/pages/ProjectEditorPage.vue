/**
 * src/components/dev/projectView/pages/ProjectEditorPage.vue
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
      @save="handleSave"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <!-- Save Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="400" persistent>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import ProjectEditorMain from '../ProjectEditorMain.vue';
import { 
  SAMPLE_RESEARCH_PROJECT, 
  SAMPLE_DEVELOPMENT_PROJECT,
  cloneProject 
} from '../types/projectTypes.js';

const route = useRoute();
const router = useRouter();

// Refs
const editorRef = ref(null);

// State
const existingProject = ref(null);
const isLoadingProject = ref(false);
const loadError = ref(null);
const saveError = ref(null);
const showSuccessDialog = ref(false);
const showErrorSnackbar = ref(false);
const showLeaveDialog = ref(false);
const pendingNavigation = ref(null);
const savedProjectId = ref(null);
const linkCopied = ref(false);

// Computed
const projectId = computed(() => route.params.projectId || '');
const isEditing = computed(() => !!projectId.value);

// Load existing project for editing
async function loadExistingProject() {
  if (!projectId.value) {
    return;
  }

  try {
    isLoadingProject.value = true;
    loadError.value = null;

    // TODO: Replace with actual API call
    // const response = await projectViewApi.getProject(projectId.value);
    // existingProject.value = response.data;

    // For development: Load sample data
    await new Promise(resolve => setTimeout(resolve, 500));

    if (projectId.value === 'sample-research' || projectId.value.includes('research')) {
      existingProject.value = cloneProject(SAMPLE_RESEARCH_PROJECT);
    } else if (projectId.value === 'sample-development' || projectId.value.includes('dev')) {
      existingProject.value = cloneProject(SAMPLE_DEVELOPMENT_PROJECT);
    } else {
      // Try localStorage
      const draft = localStorage.getItem('projectDraft');
      if (draft) {
        const parsed = JSON.parse(draft);
        existingProject.value = parsed.data;
      } else {
        loadError.value = 'Project not found or you do not have permission to edit it.';
      }
    }
  } catch (err) {
    console.error('Failed to load project:', err);
    loadError.value = 'Failed to load project. Please try again.';
  } finally {
    isLoadingProject.value = false;
  }
}

// Handle save (draft)
async function handleSave(projectData) {
  try {
    // TODO: Replace with actual API call
    // const response = await projectViewApi.saveDraft(projectData);
    // savedProjectId.value = response.data.id;

    console.log('Saving draft:', projectData);
    
    // For development: Save to localStorage
    localStorage.setItem('projectDraft', JSON.stringify({
      data: projectData,
      timestamp: new Date().toISOString()
    }));

    savedProjectId.value = projectData.id;
  } catch (err) {
    console.error('Failed to save draft:', err);
    saveError.value = 'Failed to save draft. Please try again.';
    showErrorSnackbar.value = true;
  }
}

// Handle submit (publish)
async function handleSubmit(projectData) {
  try {
    // TODO: Replace with actual API call
    // const response = await projectViewApi.publishProject(projectData);
    // savedProjectId.value = response.data.id;

    console.log('Publishing project:', projectData);

    // For development: Save to localStorage
    localStorage.setItem(`project_${projectData.id}`, JSON.stringify(projectData));
    localStorage.removeItem('projectDraft');

    savedProjectId.value = projectData.id;
    showSuccessDialog.value = true;
  } catch (err) {
    console.error('Failed to publish project:', err);
    saveError.value = 'Failed to publish project. Please try again.';
    showErrorSnackbar.value = true;
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
  // Clear any existing draft and reload without projectId
  localStorage.removeItem('projectDraft');
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
  if (pendingNavigation.value) {
    pendingNavigation.value();
    pendingNavigation.value = null;
  }
}

// Route leave guard
onBeforeRouteLeave((to, from, next) => {
  if (editorRef.value?.hasUnsavedChanges?.() && !showSuccessDialog.value) {
    showLeaveDialog.value = true;
    pendingNavigation.value = () => next();
    next(false);
  } else {
    next();
  }
});

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
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