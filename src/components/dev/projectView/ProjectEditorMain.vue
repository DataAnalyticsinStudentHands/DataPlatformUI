/**
 * src/components/dev/projectView/ProjectEditorMain.vue
 *
 * Main orchestrator component for project creation/editing.
 * Implements a three-step flow: Select Template → Fill Form → Preview & Submit
 */

<template>
  <div class="project-editor">
    <!-- Editor Header -->
    <div class="editor-header">
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
      <!-- Step 1: Template Selection -->
      <div v-show="currentStep === 1" class="step-content">
        <ProjectTemplateSelector
          v-model="selectedTemplate"
          @select="handleTemplateSelect"
        />

        <div class="step-actions centered">
          <v-btn
            color="#c8102e"
            size="large"
            :disabled="!selectedTemplate"
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
              <ProjectFormContainer
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

            <!-- <v-btn
              variant="text"
              color="#666"
              @click="toggleSampleData"
            >
              <v-icon start>{{ useSampleDataInPreview ? 'mdi-file-document' : 'mdi-file-document-outline' }}</v-icon>
              {{ useSampleDataInPreview ? $t('Using Sample Data') : $t('Use Sample Data') }}
            </v-btn> -->
          </div>

          <div class="actions-right">
            <v-btn
              color="#c8102e"
              size="large"
              :disabled="!isFormValid"
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
        <div class="final-preview-container">
          <ProjectPreview
            ref="finalPreviewRef"
            :project="projectData"
            :use-sample-data="false"
          />
        </div>

        <!-- Validation Summary -->
        <div v-if="validationErrors.length > 0" class="validation-summary">
          <v-alert type="warning" variant="tonal" class="mb-4">
            <template v-slot:title>
              {{ $t('Please fix the following issues:') }}
            </template>
            <ul class="error-list">
              <li v-for="error in validationErrors" :key="error.field">
                {{ error.message }}
              </li>
            </ul>
          </v-alert>
        </div>

        <!-- Final Actions -->
        <div class="step-actions">
          <div class="actions-left">
            <v-btn
              variant="outlined"
              @click="goBack"
            >
              <v-icon start>mdi-pencil</v-icon>
              {{ $t('Edit') }}
            </v-btn>
          </div>

          <div class="actions-right">
            <v-btn
              variant="outlined"
              color="#666"
              class="mr-3"
              @click="saveDraft"
              :loading="isSavingDraft"
            >
              <v-icon start>mdi-content-save-outline</v-icon>
              {{ $t('Save Draft') }}
            </v-btn>

            <v-btn
              color="#c8102e"
              size="large"
              :disabled="validationErrors.length > 0"
              :loading="isSubmitting"
              @click="submitProject"
            >
              <v-icon start>mdi-check-circle</v-icon>
              {{ isEditing ? $t('Update Project') : $t('Publish Project') }}
            </v-btn>
          </div>
        </div>
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
import ProjectTemplateSelector from './ProjectTemplateSelector.vue';
import { ProjectFormContainer } from './forms';
import ProjectPreview from './ProjectPreview.vue';
import { 
  TEMPLATE_TYPES, 
  createEmptyProject,
  validateProject,
  cloneProject
} from './types/projectTypes.js';

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
const selectedTemplate = ref('');
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

// Computed
const isEditing = computed(() => !!props.projectId || !!props.initialProject);

const steps = computed(() => [
  'Select Template',
  'Fill Details',
  'Preview & Submit'
]);

const stepDescriptions = computed(() => [
  'Choose the layout that best fits your project',
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

// Methods
function handleTemplateSelect(templateId) {
  selectedTemplate.value = templateId;
}

function proceedToForm() {
  if (!selectedTemplate.value) return;
  
  // Initialize project data based on template
  if (!projectData.value || projectData.value.templateType !== selectedTemplate.value) {
    projectData.value = createEmptyProject(selectedTemplate.value);
  }
  
  currentStep.value = 2;
}

function proceedToPreview() {
  showValidation.value = true;
  validationErrors.value = validateProject(projectData.value);
  
  if (validationErrors.value.length === 0) {
    currentStep.value = 3;
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

function toggleSampleData() {
  useSampleDataInPreview.value = !useSampleDataInPreview.value;
}

function handleValidationChange(isValid, errors) {
  isFormValid.value = isValid;
  if (showValidation.value) {
    validationErrors.value = errors || [];
  }
}

function handleFullscreenChange(isFullscreen) {
  // Could add additional handling here
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
      template: selectedTemplate.value,
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
      selectedTemplate.value = parsed.template;
      projectData.value = parsed.data;
      currentStep.value = Math.min(parsed.step || 1, 2); // Don't auto-advance to preview
      return true;
    }
  } catch (error) {
    console.error('Failed to load draft:', error);
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

// Lifecycle
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Load initial project or draft
  if (props.initialProject) {
    projectData.value = cloneProject(props.initialProject);
    selectedTemplate.value = projectData.value.templateType;
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

.actions-left,
.actions-right {
  display: flex;
  align-items: center;
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
  display: flex;
  flex-direction: column;
}

.preview-panel > * {
  flex: 1;
  min-height: 0;
}

/* Preview Step */
.preview-step {
  max-width: 1400px;
  margin: 0 auto;
}

.final-preview-container {
  height: calc(100vh - 280px);
  min-height: 600px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.validation-summary {
  margin-bottom: 16px;
}

.error-list {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.error-list li {
  margin-bottom: 4px;
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