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
            v-if="currentStep > 1"
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
        />

        <div class="step-actions centered">
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
                :show-validation="showValidation"
                @validation-change="handleValidationChange"
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
import {
  createEmptyProject,
  validateProject,
  cloneProject,
  migrateProject,
  initializeSectionData
} from './types/projectTypes.js';
import { DEFAULT_ENABLED_SECTIONS } from './types/sectionTypes.js';

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

// Auto-save functionality
let autoSaveTimeout = null;

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
  if (!projectData.value) return;

  try {
    saveStatus.value = 'saving';
    // Save to localStorage for now
    localStorage.setItem('projectDraft', JSON.stringify({
      enabledSections: enabledSections.value,
      data: projectData.value,
      step: currentStep.value,
      timestamp: new Date().toISOString()
    }));

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    saveStatus.value = 'saved';
    hasUnsavedChanges.value = false;
  } catch (error) {
    console.error('Auto-save failed:', error);
    saveStatus.value = 'error';
  }
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
  showValidation.value = true;
  validationErrors.value = validateProject(projectData.value);

  if (validationErrors.value.length > 0) {
    return;
  }

  isSubmitting.value = true;
  try {
    // Clear draft on successful submit
    localStorage.removeItem('projectDraft');
    emit('submit', cloneProject(projectData.value));
  } finally {
    isSubmitting.value = false;
  }
}

// Load draft from localStorage
function loadDraft() {
  try {
    const draft = localStorage.getItem('projectDraft');
    if (draft) {
      const parsed = JSON.parse(draft);

      // Validate parsed data has expected structure
      if (!parsed.data || typeof parsed.data !== 'object') {
        console.warn('Invalid draft data structure, clearing localStorage');
        localStorage.removeItem('projectDraft');
        return false;
      }

      // Migrate if needed (handles old template-based format)
      const migratedData = migrateProject(parsed.data);

      // Clean up any non-serializable data that may have been corrupted
      // File objects become null/empty when JSON serialized
      if (migratedData.partners) {
        migratedData.partners = migratedData.partners.map(p => ({
          ...p,
          iconFile: null // File objects can't survive localStorage
        }));
      }
      if (migratedData.authors) {
        migratedData.authors = migratedData.authors.map(a => ({
          ...a,
          avatarFile: null // File objects can't survive localStorage
        }));
      }
      if (migratedData.poster) {
        migratedData.poster = { ...migratedData.poster, file: null };
      }

      enabledSections.value = parsed.enabledSections || migratedData.enabledSections || [];
      projectData.value = migratedData;
      currentStep.value = Math.min(parsed.step || 1, 2); // Don't auto-advance to preview
      return true;
    }
  } catch (error) {
    console.error('Failed to load draft, clearing localStorage:', error);
    // Clear corrupted localStorage data to prevent recurring errors
    localStorage.removeItem('projectDraft');
  }
  return false;
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

  // Load initial project or draft
  if (props.initialProject) {
    // Migrate old format if needed
    const migratedProject = migrateProject(cloneProject(props.initialProject));
    projectData.value = migratedProject;
    enabledSections.value = migratedProject.enabledSections || [];
    currentStep.value = 2;
  } else {
    loadDraft();
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
  top: 120px;
  height: calc(100vh - 200px);
  min-height: 600px;
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
