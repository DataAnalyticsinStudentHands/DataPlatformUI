/**
 * src/components/studentSide/projectView/PreviewSubmitStep.vue
 *
 * Preview & Submit step component for project creation.
 * Shows a full-screen preview with a floating submission panel.
 * Matches the styling of indProjectPage_engaged_data.vue.
 */

<template>
  <div class="preview-submit-container">
    <!-- Preview Area -->
    <div class="preview-area" ref="previewArea" :class="{ 'fullscreen': isFullscreen }">
      <!-- Fullscreen Toggle Button -->
      <button
        class="fullscreen-toggle-btn"
        @click="toggleFullscreen"
        :title="isFullscreen ? $t('Exit Fullscreen') : $t('Fullscreen')"
      >
        <svg v-if="!isFullscreen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      </button>

      <!-- Project Template Preview -->
      <div class="template-preview-wrapper" :key="previewKey">
        <ProjectTemplate v-if="previewProject" :project="previewProject" />
        <div v-else class="empty-preview">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <p class="empty-title">{{ $t('No Preview Available') }}</p>
          <p class="empty-subtitle">{{ $t('Project data is loading...') }}</p>
        </div>
      </div>
    </div>

    <!-- Floating Submission Panel -->
    <Transition name="slide-panel">
      <div v-if="!isFullscreen" class="submission-panel">
        <!-- Panel Header -->
        <div class="panel-header">
          <div class="panel-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <h3 class="panel-title">{{ $t('Ready to Publish?') }}</h3>
            <p class="panel-subtitle">{{ $t('Review your project before publishing') }}</p>
          </div>
        </div>

        <!-- Validation Status -->
        <div class="validation-section">
          <div v-if="validationErrors.length === 0" class="validation-status success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{{ $t('All checks passed') }}</span>
          </div>
          <div v-else class="validation-status warning">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ validationErrors.length }} {{ $t('issue(s) to fix') }}</span>
          </div>

          <!-- Error List -->
          <Transition name="expand">
            <div v-if="validationErrors.length > 0 && showErrors" class="error-list">
              <div
                v-for="(error, index) in validationErrors"
                :key="error.field"
                class="error-item"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span>{{ error.message }}</span>
              </div>
            </div>
          </Transition>

          <button
            v-if="validationErrors.length > 0"
            class="toggle-errors-btn"
            @click="showErrors = !showErrors"
          >
            {{ showErrors ? $t('Hide details') : $t('Show details') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'rotated': showErrors }">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <!-- Project Summary -->
        <div class="summary-section">
          <h4 class="section-title">{{ $t('Project Summary') }}</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">{{ authorCount }}</div>
              <div class="summary-label">{{ authorCount === 1 ? $t('Author') : $t('Authors') }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ sectionCount }}</div>
              <div class="summary-label">{{ $t('Sections') }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ tagCount }}</div>
              <div class="summary-label">{{ $t('Tags') }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ findingCount }}</div>
              <div class="summary-label">{{ $t('Findings') }}</div>
            </div>
          </div>
        </div>

        <!-- Privacy Notice -->
        <div class="privacy-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p>{{ $t('Your project will be accessible via a secure, shareable link.') }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="panel-actions">
          <button class="btn btn-secondary" @click="$emit('edit')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            {{ $t('Edit') }}
          </button>
          <button
            class="btn btn-outline"
            @click="$emit('save-draft')"
            :disabled="isSaving"
          >
            <svg v-if="!isSaving" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <svg v-else class="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ $t('Save Draft') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="validationErrors.length > 0 || isSubmitting"
            @click="$emit('submit')"
          >
            <svg v-if="!isSubmitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13"/>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
            <svg v-else class="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ isEditing ? $t('Update Project') : $t('Publish Project') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ProjectTemplate } from './templates';
import formService from './services/projectViewFormService.js';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  validationErrors: {
    type: Array,
    default: () => [],
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'save-draft', 'submit', 'fullscreen-change']);

// Refs
const previewArea = ref(null);
const previewKey = ref(0);

// State
const isFullscreen = ref(false);
const showErrors = ref(true);

// Get poster with full URL for preview
const posterWithPreviewUrl = computed(() => {
  const poster = props.project?.poster;
  if (!poster) return null;

  if (poster.url) {
    return {
      ...poster,
      url: formService.buildFileUrl(poster.url)
    };
  }

  return poster;
});

// Get project with preview-ready poster
const previewProject = computed(() => {
  if (!props.project) return null;
  return {
    ...props.project,
    poster: posterWithPreviewUrl.value
  };
});

// Computed
const hasProject = computed(() => {
  return props.project !== null && props.project !== undefined;
});

const authorCount = computed(() => {
  return props.project?.authors?.length || 0;
});

const sectionCount = computed(() => {
  // Base sections (hero, tags, findings, footer) + optional enabled sections
  const optionalCount = props.project?.enabledSections?.length || 0;
  return 4 + optionalCount;
});

const tagCount = computed(() => {
  return props.project?.tags?.length || 0;
});

const findingCount = computed(() => {
  return props.project?.findings?.length || 0;
});

// Methods
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  emit('fullscreen-change', isFullscreen.value);

  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Keyboard handler for Escape
function handleKeydown(e) {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

// Expose methods
defineExpose({
  toggleFullscreen,
});
</script>

<style scoped>
.preview-submit-container {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  height: 100%;
  min-height: calc(100vh - 200px);
  background: linear-gradient(180deg, #f8f9fc 0%, #eef1f8 100%);
  border-radius: 12px;
  overflow: hidden;
}

/* Preview Area */
.preview-area {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f4f5f7;
  border-radius: 12px 0 0 12px;
}

.preview-area.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  border-radius: 0;
}

/* Template Preview Wrapper */
.template-preview-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Empty Preview State */
.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  padding: 40px;
  text-align: center;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #666;
  margin: 16px 0 8px;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #999;
  margin: 0;
}

/* Submission Panel */
.submission-panel {
  display: flex;
  flex-direction: column;
  background: white;
  border-left: 1px solid #e0e0e0;
  padding: 24px;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.panel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  color: #16a34a;
  flex-shrink: 0;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px 0;
}

.panel-subtitle {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

/* Validation Section */
.validation-section {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 20px;
}

.validation-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.validation-status.success {
  color: #16a34a;
}

.validation-status.warning {
  color: #dc2626;
}

.error-list {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.error-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #4a5568;
  padding: 6px 0;
}

.error-item svg {
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 1px;
}

.toggle-errors-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  padding: 0;
  background: none;
  border: none;
  color: #6366f1;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.toggle-errors-btn:hover {
  color: #4f46e5;
}

.toggle-errors-btn svg {
  transition: transform 0.2s ease;
}

.toggle-errors-btn svg.rotated {
  transform: rotate(180deg);
}

/* Summary Section */
.summary-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #718096;
  margin: 0 0 12px 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.summary-item {
  background: linear-gradient(135deg, #fafafa 0%, #f0f0f5 100%);
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #c7d2fe;
}

.summary-value {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 11px;
  color: #718096;
  font-weight: 500;
}

/* Privacy Notice */
.privacy-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.privacy-notice svg {
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 1px;
}

.privacy-notice p {
  font-size: 12px;
  color: #1e40af;
  margin: 0;
  line-height: 1.4;
}

/* Action Buttons */
.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #c8102e 0%, #a30d26 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(200, 16, 46, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 16, 46, 0.4);
}

.btn-secondary {
  background: #f0f0f5;
  color: #4a5568;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover:not(:disabled) {
  background: #e8e8ee;
  border-color: #d0d0d8;
}

.btn-outline {
  background: white;
  color: #1a1a2e;
  border: 1px solid #e0e0e0;
}

.btn-outline:hover:not(:disabled) {
  background: #fafafa;
  border-color: #c8c8d0;
}

/* Fullscreen Toggle Button */
.fullscreen-toggle-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a2e;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.fullscreen-toggle-btn:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.preview-area.fullscreen .fullscreen-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Animations */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinning {
  animation: rotate 1s linear infinite;
}

/* Transitions */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
}

/* Responsive */
@media (max-width: 1024px) {
  .preview-submit-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .preview-area {
    border-radius: 12px 12px 0 0;
    min-height: 60vh;
  }

  .submission-panel {
    border-left: none;
    border-top: 1px solid #e0e0e0;
    border-radius: 0 0 12px 12px;
    max-height: 40vh;
  }

  .panel-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .submission-panel {
    padding: 16px;
  }

  .summary-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .summary-item {
    padding: 10px 8px;
  }

  .summary-value {
    font-size: 18px;
  }
}
</style>
