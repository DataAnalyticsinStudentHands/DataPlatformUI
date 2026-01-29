/**
 * src/components/dev/projectView/ProjectPreview.vue
 *
 * Live preview pane showing rendered template.
 * Renders template directly with proper height for viewport-based template layouts.
 */

<template>
  <div class="project-preview-container">
    <!-- Preview Header -->
    <div class="preview-header">
      <div class="preview-title-section">
        <v-icon size="20" color="#c8102e" class="mr-2">mdi-eye-outline</v-icon>
        <h3 class="preview-title">{{ $t('Live Preview') }}</h3>
        <v-chip 
          v-if="project?.templateType"
          size="x-small" 
          color="#c8102e" 
          variant="tonal"
          class="ml-2"
        >
          {{ project.templateType === 'development' ? 'Team' : 'Research' }}
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
        <ProjectTemplateRenderer 
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
import { ProjectTemplateRenderer } from './templates';
import { 
  SAMPLE_RESEARCH_PROJECT, 
  SAMPLE_DEVELOPMENT_PROJECT,
  TEMPLATE_TYPES 
} from './types/projectTypes.js';

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

// Get preview project (use sample data to fill gaps if needed)
const previewProject = computed(() => {
  if (!props.project) {
    return props.project?.templateType === TEMPLATE_TYPES.DEVELOPMENT 
      ? SAMPLE_DEVELOPMENT_PROJECT 
      : SAMPLE_RESEARCH_PROJECT;
  }

  if (props.useSampleData) {
    // Merge with sample data for preview
    const sample = props.project.templateType === TEMPLATE_TYPES.DEVELOPMENT
      ? SAMPLE_DEVELOPMENT_PROJECT
      : SAMPLE_RESEARCH_PROJECT;
    
    return {
      ...sample,
      ...props.project,
      label: { ...sample.label, ...props.project.label },
      conclusion: { ...sample.conclusion, ...props.project.conclusion },
      poster: { ...sample.poster, ...props.project.poster },
      footer: { ...sample.footer, ...props.project.footer },
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
.template-wrapper :deep(.page) {
  height: auto;
  min-height: auto;
  overflow: visible;
}

/* Let content grid flow naturally */
.template-wrapper :deep(.content-grid) {
  overflow: visible;
}

/* Let left/right columns show full content */
.template-wrapper :deep(.left),
.template-wrapper :deep(.right) {
  overflow: visible;
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