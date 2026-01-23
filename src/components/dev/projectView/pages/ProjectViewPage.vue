/**
 * src/components/dev/projectView/pages/ProjectViewPage.vue
 *
 * Public view page for displaying a published project.
 * Fetches project data by ID and renders the appropriate template.
 * Accessible without authentication via shareable link.
 */

<template>
  <div class="project-view-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <v-progress-circular
        indeterminate
        color="#c8102e"
        size="64"
        width="4"
      />
      <p class="loading-text">{{ $t('Loading project...') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <v-icon size="80" color="#dc2626" class="mb-4">mdi-alert-circle-outline</v-icon>
      <h1 class="error-title">{{ $t('Project Not Found') }}</h1>
      <p class="error-message">{{ error }}</p>
      <v-btn
        color="#c8102e"
        variant="flat"
        class="mt-6"
        @click="goHome"
      >
        <v-icon start>mdi-home</v-icon>
        {{ $t('Go Home') }}
      </v-btn>
    </div>

    <!-- Project Content -->
    <div v-else-if="project" class="project-content">
      <!-- Optional: Back/Share Header for public view -->
      <div class="view-header" v-if="showHeader">
        <div class="header-content">
          <v-btn
            variant="text"
            color="#666"
            @click="goBack"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            {{ $t('Back') }}
          </v-btn>

          <div class="header-actions">
            <v-btn
              variant="outlined"
              color="#666"
              size="small"
              @click="copyShareLink"
            >
              <v-icon start size="18">mdi-share-variant</v-icon>
              {{ $t('Share') }}
            </v-btn>

            <v-btn
              v-if="canEdit"
              variant="outlined"
              color="#c8102e"
              size="small"
              @click="editProject"
            >
              <v-icon start size="18">mdi-pencil</v-icon>
              {{ $t('Edit') }}
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Render the appropriate template -->
      <ProjectTemplateRenderer :project="project" />

      <!-- Share Link Snackbar -->
      <v-snackbar
        v-model="showShareSnackbar"
        :timeout="3000"
        color="success"
      >
        {{ $t('Link copied to clipboard!') }}
        <template v-slot:actions>
          <v-btn variant="text" @click="showShareSnackbar = false">
            {{ $t('Close') }}
          </v-btn>
        </template>
      </v-snackbar>
    </div>

    <!-- Access Revoked State -->
    <div v-else class="revoked-container">
      <v-icon size="80" color="#666" class="mb-4">mdi-lock-outline</v-icon>
      <h1 class="revoked-title">{{ $t('Access Revoked') }}</h1>
      <p class="revoked-message">
        {{ $t('The owner has revoked public access to this project.') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProjectTemplateRenderer } from '../templates';
import { SAMPLE_RESEARCH_PROJECT, SAMPLE_DEVELOPMENT_PROJECT } from '../types/projectTypes.js';

// Props for optional configuration
const props = defineProps({
  // If true, shows back/share header
  showHeader: {
    type: Boolean,
    default: true
  },
  // If provided, use this project data instead of fetching
  projectData: {
    type: Object,
    default: null
  }
});

const route = useRoute();
const router = useRouter();

// State
const project = ref(null);
const isLoading = ref(true);
const error = ref(null);
const showShareSnackbar = ref(false);

// Get project ID from route params
const projectId = computed(() => route.params.projectId);

// Check if current user can edit this project
const canEdit = computed(() => {
  // TODO: Implement actual ownership check
  // For now, return false for public view
  return false;
});

// Fetch project data
async function fetchProject() {
  if (props.projectData) {
    // Use provided project data
    project.value = props.projectData;
    isLoading.value = false;
    return;
  }

  if (!projectId.value) {
    error.value = 'No project ID provided';
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;

    // TODO: Replace with actual API call
    // const response = await projectViewApi.getProject(projectId.value);
    // project.value = response.data;

    // For development: Load sample data based on ID pattern
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    if (projectId.value === 'sample-research' || projectId.value.includes('research')) {
      project.value = SAMPLE_RESEARCH_PROJECT;
    } else if (projectId.value === 'sample-development' || projectId.value.includes('dev')) {
      project.value = SAMPLE_DEVELOPMENT_PROJECT;
    } else {
      // Try to load from localStorage (for draft previews)
      const draft = localStorage.getItem('projectDraft');
      if (draft) {
        const parsed = JSON.parse(draft);
        project.value = parsed.data;
      } else {
        error.value = 'Project not found. It may have been deleted or the link is invalid.';
      }
    }
  } catch (err) {
    console.error('Failed to fetch project:', err);
    error.value = 'Failed to load project. Please try again later.';
  } finally {
    isLoading.value = false;
  }
}

// Navigation
function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}

function goHome() {
  router.push('/');
}

function editProject() {
  router.push({
    name: 'projectEditorEdit',
    params: { projectId: projectId.value }
  });
}

// Share functionality
async function copyShareLink() {
  const shareUrl = window.location.href;
  
  try {
    await navigator.clipboard.writeText(shareUrl);
    showShareSnackbar.value = true;
  } catch (err) {
    console.error('Failed to copy link:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showShareSnackbar.value = true;
  }
}

// Lifecycle
onMounted(() => {
  fetchProject();
});

// Expose for parent components
defineExpose({
  refresh: fetchProject
});
</script>

<style scoped>
.project-view-page {
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
}

/* Revoked State */
.revoked-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  text-align: center;
}

.revoked-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.revoked-message {
  font-size: 1rem;
  color: #666;
  max-width: 400px;
}

/* View Header */
.view-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 12px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Project Content */
.project-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .view-header {
    padding: 12px 16px;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .error-title,
  .revoked-title {
    font-size: 1.5rem;
  }
}
</style>