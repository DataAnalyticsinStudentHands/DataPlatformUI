/**
 * src/components/dev/projectView/ProjectEditorMain.vue
 *
 * Main orchestrator component for project creation/editing.
 * Implements a three-step flow: Configure Sections → Fill Form → Preview & Submit
 */

<template>
  <div class="project-editor">
    <!-- Editor Header (hidden in fullscreen mode) -->
    <div v-show="!isPreviewFullscreen" class="editor-header">
      <div class="header-content">
        <div class="header-title-section">
          <v-btn
            icon
            variant="text"
            size="small"
            @click="goBack"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h1 class="editor-title">
              {{ isEditing ? $t('Edit Project Page') : $t('Create Project Page') }}
            </h1>
            <p class="editor-subtitle">
              {{ stepDescriptions[currentStep - 1] }}
            </p>
          </div>
        </div>

        <!-- Auto-save Indicator -->
        <div v-if="currentStep === 2" class="autosave-indicator">
          <v-icon
            size="16"
            :color="saveStatus === 'saved' ? '#16a34a' : '#666'"
            class="mr-1"
          >
            {{ saveStatusIcon }}
          </v-icon>
          <span :class="saveStatusClass">{{ saveStatusText }}</span>
        </div>
      </div>

      <!-- Stepper -->
      <div class="stepper-container">
        <div class="stepper">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step"
            :class="{
              'active': currentStep === index + 1,
              'completed': currentStep > index + 1,
              'clickable': index + 1 < currentStep
            }"
            @click="goToStep(index + 1)"
          >
            <div class="step-indicator">
              <v-icon v-if="currentStep > index + 1" size="16" color="white">
                mdi-check
              </v-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ step }}</span>
          </div>
          <div class="step-connector" :style="connectorStyle"></div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="editor-content">
      <!-- Step 1: Section Configuration -->
      <div v-show="currentStep === 1" class="step-content">
        <SectionConfigurator
          v-model="enabledSections"
          :sections-with-data="sectionsWithData"
        />

        <div class="step-actions centered">
          <v-btn
            variant="outlined"
            color="#666"
            size="large"
            @click="emit('cancel')"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="#c8102e"
            size="large"
            @click="proceedToForm"
          >
            {{ $t('Continue') }}
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Step 2: Form Entry with Live Preview -->
      <div v-show="currentStep === 2" class="step-content form-step">
        <div class="form-preview-layout" :class="{ 'preview-hidden': !showPreview }">
          <!-- Form Panel -->
          <div class="form-panel">
            <v-card class="form-card" elevation="0">
              <ProjectForm
                ref="formRef"
                v-model="projectData"
                :form-id="formId"
                :show-validation="showValidation"
                @validation-change="handleValidationChange"
                @remove-avatar="handleRemoveAvatar"
              />
            </v-card>
          </div>

          <!-- Preview Panel (toggleable) -->
          <div v-if="showPreview" class="preview-panel">
            <ProjectPreview
              ref="previewRef"
              :project="projectData"
              :use-sample-data="useSampleDataInPreview"
              @fullscreen-change="handleFullscreenChange"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="step-actions">
          <div class="actions-left">
            <v-btn
              variant="outlined"
              @click="goBack"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              {{ $t('Back') }}
            </v-btn>
          </div>

          <div class="actions-center">
            <v-btn
              variant="text"
              :color="showPreview ? '#c8102e' : '#666'"
              @click="togglePreview"
            >
              <v-icon start>{{ showPreview ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              {{ showPreview ? $t('Hide Preview') : $t('Show Preview') }}
            </v-btn>
          </div>

          <div class="actions-right">
            <v-btn
              color="#c8102e"
              size="large"
              @click="proceedToPreview"
            >
              {{ $t('Preview') }}
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Step 3: Final Preview & Submit -->
      <div v-show="currentStep === 3" class="step-content preview-step">
        <PreviewSubmitStep
          ref="finalPreviewRef"
          :project="projectData"
          :validation-errors="validationErrors"
          :is-editing="isEditing"
          :is-saving="isSavingDraft"
          :is-submitting="isSubmitting"
          @edit="goBack"
          @save-draft="saveDraft"
          @submit="submitProject"
          @fullscreen-change="handleFullscreenChange"
        />
      </div>
    </div>

    <!-- Unsaved Changes Dialog -->
    <v-dialog v-model="showUnsavedDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{ $t('Unsaved Changes') }}
        </v-card-title>
        <v-card-text>
          {{ $t('You have unsaved changes. Are you sure you want to leave?') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showUnsavedDialog = false">
            {{ $t('Cancel') }}
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { toast } from 'vue3-toastify';
import SectionConfigurator from './SectionConfigurator.vue';
import ProjectForm from './forms/ProjectForm.vue';
import ProjectPreview from './ProjectPreview.vue';
import PreviewSubmitStep from './PreviewSubmitStep.vue';
import formService from './services/projectViewFormService.js';
import {
  createEmptyProject,
  validateProject,
  cloneProject,
  migrateProject,
  initializeSectionData,
  sectionHasData
} from './types/projectTypes.js';
import { DEFAULT_ENABLED_SECTIONS, getOptionalSections } from './types/sectionTypes.js';

const props = defineProps({
  // Existing project data for editing mode
  initialProject: {
    type: Object,
    default: null
  },
  // Project ID for editing
  projectId: {
    type: String,
    default: ''
  },
  // Backend form document _id (from parent page)
  formId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['save', 'submit', 'cancel']);

// Refs
const formRef = ref(null);
const previewRef = ref(null);
const finalPreviewRef = ref(null);

// State
const currentStep = ref(1);
const enabledSections = ref([...DEFAULT_ENABLED_SECTIONS]);
const projectData = ref(null);
const showPreview = ref(true);
const useSampleDataInPreview = ref(true);
const showValidation = ref(false);
const isFormValid = ref(false);
const validationErrors = ref([]);
const hasUnsavedChanges = ref(false);
const showUnsavedDialog = ref(false);
const pendingNavigation = ref(null);

// Loading states
const saveStatus = ref('idle'); // 'idle', 'saving', 'saved', 'error'
const isSavingDraft = ref(false);
const isSubmitting = ref(false);

// Fullscreen state (from preview component)
const isPreviewFullscreen = ref(false);

// Computed
const isEditing = computed(() => !!props.projectId || !!props.initialProject);

const sectionsWithData = computed(() => {
  if (!projectData.value) return [];
  return getOptionalSections()
    .map(s => s.id)
    .filter(id => sectionHasData(projectData.value, id));
});

const steps = computed(() => [
  'Configure',
  'Fill Details',
  'Preview & Submit'
]);

const stepDescriptions = computed(() => [
  'Choose which sections to include in your project page',
  'Enter your project information',
  'Review and publish your project page'
]);

const connectorStyle = computed(() => {
  const progress = ((currentStep.value - 1) / (steps.value.length - 1)) * 100;
  return {
    width: `${progress}%`
  };
});

const saveStatusIcon = computed(() => {
  switch (saveStatus.value) {
    case 'saving': return 'mdi-loading mdi-spin';
    case 'saved': return 'mdi-check-circle';
    case 'error': return 'mdi-alert-circle';
    default: return 'mdi-circle-outline';
  }
});

const saveStatusText = computed(() => {
  switch (saveStatus.value) {
    case 'saving': return 'Saving...';
    case 'saved': return 'All changes saved';
    case 'error': return 'Save failed';
    default: return 'Draft';
  }
});

const saveStatusClass = computed(() => ({
  'text-success': saveStatus.value === 'saved',
  'text-error': saveStatus.value === 'error',
  'text-medium-emphasis': saveStatus.value === 'idle'
}));

// Human-readable validation summary for display
const validationSummary = computed(() => {
  const summary = [];
  const fieldLabels = {
    'title': 'Project Title',
    'description': 'Project Description',
    'label.text': 'Category Label',
    'conclusion.text': 'Conclusion',
    'authors': 'Authors',
    'tags': 'Tags',
    'findings': 'Key Findings',
    'milestones': 'Timeline Milestones',
    'impactItems': 'Impact Items',
    'poster.title': 'Poster Title',
    'poster.file': 'Poster / Diagram',
  };

  for (const error of validationErrors.value) {
    // Handle array item errors (e.g., authors[0].name)
    const match = error.field.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
    if (match) {
      const [, arrayName, index, fieldName] = match;
      const itemNum = parseInt(index) + 1;
      const arrayLabel = fieldLabels[arrayName] || arrayName;
      const readableField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      summary.push(`${arrayLabel} #${itemNum}: ${readableField} is required`);
    } else {
      // Simple field error
      const label = fieldLabels[error.field] || error.field;
      if (error.message.includes('at least')) {
        summary.push(`${label}: Add ${error.message.split('at least ')[1]}`);
      } else {
        summary.push(`${label}: ${error.message}`);
      }
    }
  }

  return summary;
});

// Methods
function proceedToForm() {
  // Initialize project data with selected sections
  if (!projectData.value) {
    projectData.value = createEmptyProject('', enabledSections.value);
  } else {
    // Update enabled sections
    projectData.value.enabledSections = [...enabledSections.value];
  }

  // Initialize data for each enabled section
  enabledSections.value.forEach(sectionId => {
    projectData.value = initializeSectionData(projectData.value, sectionId);
  });

  currentStep.value = 2;
}

function proceedToPreview() {
  showValidation.value = true;
  validationErrors.value = validateProject(projectData.value);

  if (validationErrors.value.length === 0) {
    currentStep.value = 3;
  } else {
    // Show toast with validation errors
    const errorList = validationSummary.value.slice(0, 5);
    const moreCount = validationSummary.value.length - 5;
    let message = errorList.map(e => `• ${e}`).join('\n');
    if (moreCount > 0) {
      message += `\n• +${moreCount} more...`;
    }

    toast.error(message, {
      position: 'top-right',
      toastClassName: 'Toastify__toast--delete',
      multiple: false
    });
  }
}

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value--;
  } else {
    emit('cancel');
  }
}

function goToStep(step) {
  if (step < currentStep.value) {
    currentStep.value = step;
  }
}

function togglePreview() {
  showPreview.value = !showPreview.value;
}

function handleValidationChange(isValid, errors) {
  isFormValid.value = isValid;
  // Always track errors for the validation summary display
  validationErrors.value = errors || [];
}

function handleFullscreenChange(isFullscreen) {
  isPreviewFullscreen.value = isFullscreen;
}

async function handleRemoveAvatar(authorId) {
  if (!props.formId || !authorId) return;
  try {
    await formService.deleteAvatar(props.formId, authorId);
  } catch (err) {
    console.error('Failed to delete avatar:', err);
    toast.error('Failed to remove avatar. Please try again.', {
      position: 'top-right',
      toastClassName: 'Toastify__toast--delete'
    });
  }
}

// Auto-save functionality
let autoSaveTimeout = null;
let isAutoSaving = false;

function scheduleAutoSave() {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  hasUnsavedChanges.value = true;
  saveStatus.value = 'idle';

  autoSaveTimeout = setTimeout(async () => {
    await autoSave();
  }, 2000);
}

async function autoSave() {
  if (!projectData.value || !props.formId || isAutoSaving) return;

  isAutoSaving = true;
  try {
    saveStatus.value = 'saving';

    // 1. Handle pending avatar file uploads
    if (projectData.value.authors) {
      for (const author of projectData.value.authors) {
        if (author.avatarFile instanceof File) {
          // Need the backend _id for this author
          const authorBackendId = author.id;
          try {
            const uploadResponse = await formService.uploadAvatar(
              props.formId,
              authorBackendId,
              author.avatarFile
            );
            // Sync full form state from response
            const synced = formService.fromBackendFormat(uploadResponse);
            syncAuthorAvatars(synced);
            author.avatarFile = null;
          } catch (uploadErr) {
            console.error('Avatar upload failed for author:', author.id, uploadErr);
          }
        }
      }
    }

    // 2. PATCH content fields (without file objects and server-managed fields)
    // Note: Poster file selection is handled immediately by ClowderFileSelector,
    // not deferred to auto-save.
    const response = await formService.update(props.formId, projectData.value);

    // 3. Sync backend-generated _id values back into local state
    const synced = formService.fromBackendFormat(response);
    syncBackendIds(synced);

    saveStatus.value = 'saved';
    hasUnsavedChanges.value = false;
  } catch (error) {
    console.error('Auto-save failed:', error);
    saveStatus.value = 'error';
  } finally {
    isAutoSaving = false;
  }
}

/**
 * Sync avatar URLs from a backend response into local project data
 * without overwriting local edits to other fields.
 */
function syncAuthorAvatars(synced) {
  if (!synced.authors || !projectData.value.authors) return;
  for (const syncedAuthor of synced.authors) {
    const local = projectData.value.authors.find(a => a.id === syncedAuthor.id);
    if (local && syncedAuthor.avatarUrl) {
      local.avatarUrl = syncedAuthor.avatarUrl;
    }
  }
}

/**
 * Sync backend-generated _id values back into local state.
 * This ensures new items (created without an _id) get their server-assigned IDs.
 */
function syncBackendIds(synced) {
  if (!projectData.value || !synced) return;

  // Sync array item IDs by index (backend preserves order)
  const arrayFields = [
    { local: 'authors', remote: 'authors' },
    { local: 'tags', remote: 'tags' },
    { local: 'findings', remote: 'findings' },
    { local: 'partners', remote: 'partners' },
    { local: 'milestones', remote: 'milestones' },
    { local: 'impactItems', remote: 'impactItems' },
  ];

  for (const { local, remote } of arrayFields) {
    const localArr = projectData.value[local];
    const remoteArr = synced[remote];
    if (localArr && remoteArr) {
      for (let i = 0; i < Math.min(localArr.length, remoteArr.length); i++) {
        if (remoteArr[i].id && localArr[i].id !== remoteArr[i].id) {
          localArr[i].id = remoteArr[i].id;
        }
      }
    }
  }
}

/**
 * Called by parent to sync full form state from a backend response.
 */
function syncFromBackend(synced) {
  if (!synced || !projectData.value) return;
  syncBackendIds(synced);
  syncAuthorAvatars(synced);
  if (synced.poster && projectData.value.poster) {
    if (synced.poster.url) projectData.value.poster.url = synced.poster.url;
    if (synced.poster.type) projectData.value.poster.type = synced.poster.type;
    if (synced.poster.clowderFileId) projectData.value.poster.clowderFileId = synced.poster.clowderFileId;
    if (synced.poster.clowderFileName) projectData.value.poster.clowderFileName = synced.poster.clowderFileName;
  }
  if (synced.metadata) {
    projectData.value.metadata = { ...projectData.value.metadata, ...synced.metadata };
  }
  isSubmitting.value = false;
}

/**
 * Called by parent to reset submitting state on error.
 */
function resetSubmitting() {
  isSubmitting.value = false;
}

async function saveDraft() {
  isSavingDraft.value = true;
  try {
    await autoSave();
    emit('save', cloneProject(projectData.value));
  } finally {
    isSavingDraft.value = false;
  }
}

async function submitProject() {
  if (isSubmitting.value) return; // Prevent double-click

  showValidation.value = true;
  validationErrors.value = validateProject(projectData.value);

  if (validationErrors.value.length > 0) {
    const errorList = validationSummary.value.slice(0, 5);
    const moreCount = validationSummary.value.length - 5;
    let message = errorList.map(e => `• ${e}`).join('\n');
    if (moreCount > 0) {
      message += `\n• +${moreCount} more...`;
    }
    toast.error(message, {
      position: 'top-right',
      toastClassName: 'Toastify__toast--delete',
      multiple: false
    });
    return;
  }

  // Cancel any pending auto-save to avoid racing with publish
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }

  isSubmitting.value = true;
  // Note: isSubmitting is reset by parent after publish completes via syncFromBackend,
  // or on error. Emit carries the data to parent's handleSubmit.
  emit('submit', cloneProject(projectData.value));
}

// Unsaved changes warning
function confirmLeave() {
  showUnsavedDialog.value = false;
  if (pendingNavigation.value) {
    pendingNavigation.value();
    pendingNavigation.value = null;
  }
}

function handleBeforeUnload(e) {
  if (hasUnsavedChanges.value) {
    e.preventDefault();
    e.returnValue = '';
  }
}

// Watch for changes to trigger auto-save
watch(projectData, () => {
  if (currentStep.value === 2) {
    scheduleAutoSave();
  }
}, { deep: true });

// Sync enabledSections with projectData when on form step
watch(enabledSections, (newVal) => {
  if (projectData.value && currentStep.value >= 2) {
    projectData.value.enabledSections = [...newVal];
  }
}, { deep: true });

// Lifecycle
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Load initial project from API response (passed by parent page)
  if (props.initialProject) {
    let migratedProject = migrateProject(cloneProject(props.initialProject));

    // Initialize section data for all enabled sections so optional sections
    // (e.g. poster) have their default data structures even when the backend
    // returned null for them.
    const sections = migratedProject.enabledSections || [];
    sections.forEach(sectionId => {
      migratedProject = initializeSectionData(migratedProject, sectionId);
    });

    projectData.value = migratedProject;
    enabledSections.value = sections;

    // Determine starting step: form with content → Step 2, empty → Step 1
    const hasContent = migratedProject.title || migratedProject.description ||
      (migratedProject.authors && migratedProject.authors.some(a => a.name));
    currentStep.value = hasContent ? 2 : 1;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
});

// Expose for parent components
defineExpose({
  saveDraft,
  submitProject,
  syncFromBackend,
  resetSubmitting,
  hasUnsavedChanges: () => hasUnsavedChanges.value
});
</script>

<style scoped>
.project-editor {
  min-height: 100vh;
  background: #f5f5f5;
}

.editor-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto 16px;
}

.header-title-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.editor-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.autosave-indicator {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 16px;
}

.stepper-container {
  max-width: 600px;
  margin: 0 auto;
}

.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.step.clickable {
  cursor: pointer;
}

.step-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  background: #e8e8e8;
  color: #666;
  transition: all 0.3s ease;
}

.step.active .step-indicator {
  background: #c8102e;
  color: white;
  box-shadow: 0 0 0 4px rgba(200, 16, 46, 0.2);
}

.step.completed .step-indicator {
  background: #16a34a;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.step.active .step-label {
  color: #c8102e;
  font-weight: 600;
}

.step.completed .step-label {
  color: #16a34a;
}

.step-connector {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #e8e8e8;
  z-index: 0;
}

.step-connector::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #16a34a;
  transition: width 0.3s ease;
  width: inherit;
}

.editor-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  margin-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.step-actions.centered {
  justify-content: center;
}

.actions-left {
  display: flex;
  align-items: center;
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.actions-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Form Step Layout */
.form-step {
  display: flex;
  flex-direction: column;
}

.form-preview-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.form-preview-layout.preview-hidden {
  grid-template-columns: 1fr;
}

.form-panel {
  min-width: 0;
}

.form-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  background: white;
}

.preview-panel {
  position: sticky;
  top: 152px;
  height: calc(100vh - 240px);
  min-height: 400px;
  min-width: 0; /* Allow shrinking below content size */
  overflow: hidden; /* Contain horizontal scroll within preview */
  display: flex;
  flex-direction: column;
}

.preview-panel > * {
  flex: 1;
  min-height: 0;
}

/* Preview Step */
.preview-step {
  max-width: none;
  margin: 0;
  padding: 0;
  height: calc(100vh - 180px);
  min-height: 700px;
}

/* Responsive */
@media (max-width: 1024px) {
  .form-preview-layout {
    grid-template-columns: 1fr;
  }

  .preview-panel {
    display: none;
  }

  .form-preview-layout.preview-hidden .preview-panel {
    display: none;
  }

  .preview-step {
    height: auto;
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .editor-header {
    padding: 12px 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .editor-content {
    padding: 16px;
  }

  .step-actions {
    flex-direction: column;
    gap: 12px;
  }

  .actions-left,
  .actions-center,
  .actions-right {
    width: 100%;
    justify-content: center;
  }

  .step-label {
    display: none;
  }
}
</style>
