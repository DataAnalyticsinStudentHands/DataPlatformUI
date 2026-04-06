/**
 * src/components/studentSide/projectView/pages/ProjectViewPage.vue
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
      <!-- Render the appropriate template -->
      <ProjectTemplate :project="project" />
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
import { ProjectTemplate } from '../templates';
import formService from '../services/projectViewFormService.js';
import { mergeWithDefaults } from '../types/projectTypes.js';

// Props for optional configuration
const props = defineProps({
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

// Get project ID from route params (this is the form _id)
const projectId = computed(() => route.params.projectId);

/**
 * Build display-ready project data from backend response.
 * Converts avatar/poster relative paths to full URLs.
 */
function buildDisplayProject(frontendData) {
  const display = { ...frontendData };

  // Build full URLs for author avatars
  if (display.authors) {
    display.authors = display.authors.map(author => ({
      ...author,
      avatarUrl: formService.buildFileUrl(author.avatarUrl),
    }));
  }

  // Build full URL for poster
  if (display.poster && display.poster.url) {
    display.poster = {
      ...display.poster,
      url: formService.buildFileUrl(display.poster.url),
    };
  }

  return display;
}

// Fetch project data from public API
async function fetchProject() {
  if (props.projectData) {
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

    // 1. Fetch raw backend response
    const response = await formService.getPublic(projectId.value);
    console.log('[ProjectViewPage] Raw backend response:', JSON.stringify(response, null, 2));

    // 2. Convert backend field names to frontend format
    const frontendData = formService.fromBackendFormat(response);
    console.log('[ProjectViewPage] After fromBackendFormat:', JSON.stringify(frontendData, null, 2));

    // 3. Merge with defaults to fill any missing fields
    const merged = mergeWithDefaults(frontendData);
    console.log('[ProjectViewPage] After mergeWithDefaults:', {
      title: merged.title,
      authorsCount: merged.authors?.length,
      enabledSections: merged.enabledSections,
      hasMilestones: merged.milestones?.length,
      hasPoster: !!merged.poster,
      posterType: merged.poster?.type,
      posterUrl: merged.poster?.url,
    });

    // 4. Build display-ready URLs
    project.value = buildDisplayProject(merged);
    console.log('[ProjectViewPage] Final project assigned to template');
  } catch (err) {
    console.error('Failed to fetch project:', err);
    if (err.response && err.response.status === 404) {
      error.value = 'Project not found. It may have been deleted or the link is invalid.';
    } else {
      error.value = 'Failed to load project. Please try again later.';
    }
  } finally {
    isLoading.value = false;
  }
}

// Navigation
function goHome() {
  router.push('/');
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
  .error-title,
  .revoked-title {
    font-size: 1.5rem;
  }
}
</style>