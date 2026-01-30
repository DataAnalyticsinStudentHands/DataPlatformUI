/**
 * src/components/dev/projectView/ProjectPreview.vue
 *
 * Live preview pane showing rendered template.
 * Renders the unified template with proper height for viewport-based layouts.
 */

<template>
  <div class="project-preview-container">
    <!-- Preview Header -->
    <div class="preview-header">
      <div class="preview-title-section">
        <v-icon size="20" color="#c8102e" class="mr-2">mdi-eye-outline</v-icon>
        <h3 class="preview-title">{{ $t('Live Preview') }}</h3>
        <v-chip
          v-if="sectionCount > 0"
          size="x-small"
          color="#6366f1"
          variant="tonal"
          class="ml-2"
        >
          {{ sectionCount }} {{ $t('sections') }}
        </v-chip>
      </div>

      <div class="preview-actions">
        <!-- Fullscreen Toggle -->
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              size="small"
              @click="toggleFullscreen"
            >
              <v-icon size="18">
                {{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ isFullscreen ? $t('Exit fullscreen') : $t('Fullscreen') }}</span>
        </v-tooltip>

        <!-- Refresh -->
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              size="small"
              @click="refreshPreview"
            >
              <v-icon size="18" :class="{ 'rotating': isRefreshing }">mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('Refresh preview') }}</span>
        </v-tooltip>
      </div>
    </div>

    <!-- Preview Content -->
    <div
      ref="contentRef"
      class="preview-content"
      :class="{ 'fullscreen': isFullscreen }"
    >
      <!-- Empty State -->
      <div v-if="!hasValidProject" class="empty-preview">
        <v-icon size="64" color="#ccc">mdi-file-document-outline</v-icon>
        <p class="empty-title">{{ $t('No Preview Available') }}</p>
        <p class="empty-subtitle">{{ $t('Fill out the form to see a live preview of your project page.') }}</p>
      </div>

      <!-- Direct Template Render - fills container height -->
      <div v-else class="template-wrapper">
        <ProjectTemplate
          :key="previewKey"
          :project="previewProject"
        />
      </div>

      <!-- Fullscreen Close Button -->
      <v-btn
        v-if="isFullscreen"
        icon
        variant="flat"
        color="white"
        class="fullscreen-close-btn"
        @click="toggleFullscreen"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ProjectTemplate } from './templates';
import { SAMPLE_PROJECT } from './types/projectTypes.js';

const props = defineProps({
  project: {
    type: Object,
    default: null
  },
  useSampleData: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['fullscreen-change']);

const contentRef = ref(null);
const isFullscreen = ref(false);
const isRefreshing = ref(false);
const previewKey = ref(0);

// Check if we have valid project data to preview
const hasValidProject = computed(() => {
  if (!props.project) return false;
  return props.project.title || props.project.description || props.useSampleData;
});

// Count enabled sections for display
const sectionCount = computed(() => {
  if (!props.project) return 0;
  // Mandatory sections (4) + enabled optional sections
  const optionalCount = (props.project.enabledSections || []).length;
  return 4 + optionalCount; // 4 mandatory: hero, tags, findings, footer
});

// Get preview project (use sample data to fill gaps if needed)
const previewProject = computed(() => {
  if (!props.project) {
    return SAMPLE_PROJECT;
  }

  if (props.useSampleData) {
    // Merge with sample data for preview
    return {
      ...SAMPLE_PROJECT,
      ...props.project,
      label: { ...SAMPLE_PROJECT.label, ...props.project.label },
      conclusion: { ...SAMPLE_PROJECT.conclusion, ...props.project.conclusion },
      poster: props.project.poster || SAMPLE_PROJECT.poster,
      footer: { ...SAMPLE_PROJECT.footer, ...props.project.footer },
      // Use project's enabled sections, not sample
      enabledSections: props.project.enabledSections || [],
    };
  }

  return props.project;
});

// Toggle fullscreen mode
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  emit('fullscreen-change', isFullscreen.value);

  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Refresh preview (force re-render)
function refreshPreview() {
  isRefreshing.value = true;
  previewKey.value++;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 500);
}

// Handle escape key for fullscreen
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

// Expose methods to parent
defineExpose({
  refresh: refreshPreview,
  toggleFullscreen
});
</script>

<style scoped>
.project-preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.preview-title-section {
  display: flex;
  align-items: center;
}

.preview-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.preview-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f4f5f7;
}

.preview-content.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 0;
  background: #f4f5f7;
}

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
  max-width: 300px;
}

/* Template wrapper - natural height, preview-content handles scrolling */
.template-wrapper {
  width: 100%;
}

/* Override template's viewport-filling behavior for preview context */
.template-wrapper :deep(.project-template) {
  min-height: auto;
}

/* Let content grid flow naturally */
.template-wrapper :deep(.content-grid) {
  overflow: visible;
}

/* Let columns show full content */
.template-wrapper :deep(.info-column),
.template-wrapper :deep(.poster-column) {
  overflow: visible;
}

/* ================================================
   PREVIEW-SPECIFIC HERO OVERRIDES
   Force compact "desktop" layout in preview context
   ================================================ */

/* Keep hero side-by-side layout, don't stack */
.template-wrapper :deep(.hero-content) {
  flex-direction: row !important;
  gap: 16px;
}

/* Reduce hero padding for preview */
.template-wrapper :deep(.hero) {
  padding: 16px 20px;
}

/* Compact title */
.template-wrapper :deep(.hero h1) {
  font-size: 18px;
  margin-bottom: 6px;
}

/* Compact label */
.template-wrapper :deep(.hero-label) {
  font-size: 9px;
  margin-bottom: 6px;
}

/* Compact description */
.template-wrapper :deep(.hero-description) {
  font-size: 11px;
  line-height: 1.4;
}

/* Compact authors container */
.template-wrapper :deep(.hero-authors) {
  min-width: 280px;
  gap: 8px;
  flex-direction: column !important;
}

/* Single author card (ProjectHeroSingle) */
.template-wrapper :deep(.hero-author) {
  min-width: 240px;
  padding: 12px 14px;
  gap: 12px;
}

/* Compact author cards */
.template-wrapper :deep(.author-card) {
  padding: 10px 12px;
  gap: 10px;
  border-radius: 8px;
}

/* Smaller avatars in preview */
.template-wrapper :deep(.author-avatar) {
  width: 56px;
  height: 56px;
  border-width: 2px;
}

/* Compact author text */
.template-wrapper :deep(.author-name) {
  font-size: 13px;
}

.template-wrapper :deep(.author-role) {
  font-size: 10px;
}

.template-wrapper :deep(.author-quote) {
  font-size: 10px;
  line-height: 1.35;
}

.template-wrapper :deep(.author-details) {
  gap: 3px;
}

.fullscreen-close-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Rotating animation for refresh icon */
.rotating {
  animation: rotate 0.5s linear;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
