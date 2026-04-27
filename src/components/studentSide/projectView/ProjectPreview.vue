/**
 * src/components/studentSide/projectView/ProjectPreview.vue
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

    <!-- Preview Content (inline when not fullscreen) -->
    <div
      v-if="!isFullscreen"
      ref="contentRef"
      class="preview-content"
    >
      <!-- Empty State -->
      <div v-if="!hasValidProject" class="empty-preview">
        <v-icon size="64" color="#ccc">mdi-file-document-outline</v-icon>
        <p class="empty-title">{{ $t('No Preview Available') }}</p>
        <p class="empty-subtitle">{{ $t('Fill out the form to see a live preview of your project page.') }}</p>
      </div>

      <!-- Direct Template Render - fills container height -->
      <div v-else class="template-wrapper" :class="{ 'has-poster': hasPoster }">
        <ProjectTemplate
          :key="previewKey"
          :project="previewProject"
        />
      </div>
    </div>

    <!-- Fullscreen Content (teleported to body to escape Vuetify layout) -->
    <Teleport to="body">
      <div
        v-if="isFullscreen"
        class="fullscreen-overlay"
      >
        <!-- Close Button -->
        <v-btn
          icon
          variant="elevated"
          color="white"
          class="fullscreen-close-btn"
          @click="toggleFullscreen"
        >
          <v-icon color="#333">mdi-close</v-icon>
        </v-btn>

        <!-- Fullscreen Template Content -->
        <div class="fullscreen-content">
          <div v-if="!hasValidProject" class="empty-preview">
            <v-icon size="64" color="#ccc">mdi-file-document-outline</v-icon>
            <p class="empty-title">{{ $t('No Preview Available') }}</p>
            <p class="empty-subtitle">{{ $t('Fill out the form to see a live preview of your project page.') }}</p>
          </div>

          <div v-else class="template-wrapper-fullscreen">
            <ProjectTemplate
              :key="previewKey + '-fullscreen'"
              :project="previewProject"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ProjectTemplate } from './templates';
import { SAMPLE_PROJECT } from './types/projectTypes.js';
import formService from './services/projectViewFormService.js';

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

// Check if poster section is enabled (for conditional horizontal scrolling)
const hasPoster = computed(() => {
  if (!props.project) return false;
  const enabledSections = props.project.enabledSections || [];
  return enabledSections.includes('poster') && props.project.poster;
});

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
      poster: posterWithPreviewUrl.value || SAMPLE_PROJECT.poster,
      footer: { ...SAMPLE_PROJECT.footer, ...props.project.footer },
      // Use project's enabled sections, not sample
      enabledSections: props.project.enabledSections || [],
    };
  }

  // Return project with the preview-enabled poster
  return {
    ...props.project,
    poster: posterWithPreviewUrl.value
  };
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
  overflow-y: auto;
  overflow-x: hidden;
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
  position: sticky;
  top: 0;
  z-index: 10;
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
  flex: 1 0 auto;
  min-height: 0;
  overflow-x: auto;
  background: #f4f5f7;
}

/* Fullscreen overlay - teleported to body, sits above everything */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background: #f4f5f7;
}

.fullscreen-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.template-wrapper-fullscreen {
  width: 100%;
  min-height: 100%;
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
/* Without poster: content resizes to fit without horizontal scrolling */
/* With poster: min-width ensures content displays at readable size with horizontal scroll */
.template-wrapper {
  width: 100%;
}

.template-wrapper.has-poster {
  min-width: 1000px;
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
.template-wrapper :deep(.info-column) {
  overflow: visible;
}

/* Make poster column more prominent in preview (closer to fullscreen appearance) */
.template-wrapper :deep(.poster-column) {
  overflow: visible;
  min-height: 600px;
}

/* Ensure poster card fills the column height */
.template-wrapper :deep(.poster-card) {
  min-height: 550px;
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

/* Ensure hero-left can shrink for text wrapping */
.template-wrapper :deep(.hero-left) {
  min-width: 0;
}

/* Reduce hero padding for preview */
.template-wrapper :deep(.hero) {
  padding: 16px 20px;
}

/* Compact title */
.template-wrapper :deep(.hero h1) {
  font-size: 18px;
  margin-bottom: 6px;
  overflow-wrap: break-word;
  word-wrap: break-word;
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
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Compact authors container */
.template-wrapper :deep(.hero-authors) {
  min-width: 280px;
  max-width: 320px; /* Constrain width to force text wrapping */
  gap: 8px;
  flex-direction: column !important;
}

/* Single author card (ProjectHeroSingle) */
.template-wrapper :deep(.hero-author) {
  min-width: 240px;
  max-width: 320px; /* Constrain width to force text wrapping */
  padding: 12px 14px;
  gap: 12px;
}

/* Compact author cards */
.template-wrapper :deep(.author-card) {
  padding: 10px 12px;
  gap: 10px;
  border-radius: 8px;
  min-width: 0; /* Allow flexbox child to shrink below content size */
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
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.template-wrapper :deep(.author-details) {
  gap: 3px;
  min-width: 0; /* Allow flexbox child to shrink below content size */
}

/* Ensure all author text wraps properly */
.template-wrapper :deep(.author-name),
.template-wrapper :deep(.author-role) {
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Inline author overrides for preview */
.template-wrapper :deep(.hero-author-inline),
.template-wrapper :deep(.hero-authors-inline) {
  margin-top: 8px;
  gap: 4px;
}

.template-wrapper :deep(.inline-author-name) {
  font-size: 11px;
}

.template-wrapper :deep(.inline-author-role) {
  font-size: 10px;
}

.fullscreen-close-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  border: 1px solid #e0e0e0;
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
