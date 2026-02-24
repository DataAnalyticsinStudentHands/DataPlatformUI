/**
 * src/components/dev/projectView/components/ProjectHeroSingle.vue
 *
 * Hero header component for single-author projects (Research template).
 * Displays project label, title, description, and a single author card with testimonial.
 */

<template>
  <header class="hero">
    <div class="hero-content">
      <div class="hero-left">
        <!-- Label -->
        <div class="hero-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>{{ label.text }}</span>
        </div>

        <!-- Title -->
        <h1>{{ title }}</h1>

        <!-- Description -->
        <p class="hero-description">{{ description }}</p>
      </div>

      <!-- Author Card -->
      <div class="hero-author">
        <img
          v-if="authorAvatarSrc"
          class="author-avatar"
          :src="authorAvatarSrc"
          :alt="`${author.name} headshot`"
        />
        <div class="author-details">
          <div class="author-info">
            <span class="author-name">{{ author.name }}</span>
            <span class="author-role">{{ author.role }}</span>
          </div>
          <blockquote v-if="author.quote" class="author-quote">
            {{ author.quote }}
          </blockquote>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { buildFileUrl } from '../services/projectViewFormService.js';

const props = defineProps({
  label: {
    type: Object,
    required: true,
    default: () => ({ icon: 'layers', text: '' }),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      role: '',
      quote: '',
      avatarUrl: '',
    }),
  },
});

// Track blob URL for avatar display.
// Persists after auto-save clears avatarFile (same pattern as poster in ProjectPreview).
const avatarObjectUrl = ref('');

watch(
  () => props.author.avatarFile,
  (newFile) => {
    if (newFile instanceof File) {
      if (avatarObjectUrl.value) URL.revokeObjectURL(avatarObjectUrl.value);
      avatarObjectUrl.value = URL.createObjectURL(newFile);
    }
  },
  { immediate: true }
);

// Fetch from backend when no blob URL exists (page reload scenario).
watch(
  () => props.author.avatarUrl,
  async (url) => {
    if (avatarObjectUrl.value || !url) return;
    try {
      const { data } = await axios.get(buildFileUrl(url), { responseType: 'blob' });
      avatarObjectUrl.value = URL.createObjectURL(data);
    } catch { /* placeholder shown */ }
  },
  { immediate: true }
);

// Clear blob URL when avatar is removed (both file and URL cleared).
watch(
  () => [props.author.avatarFile, props.author.avatarUrl],
  ([file, url]) => {
    if (!file && !url && avatarObjectUrl.value) {
      URL.revokeObjectURL(avatarObjectUrl.value);
      avatarObjectUrl.value = '';
    }
  }
);

onBeforeUnmount(() => {
  if (avatarObjectUrl.value) URL.revokeObjectURL(avatarObjectUrl.value);
});

const authorAvatarSrc = computed(() => avatarObjectUrl.value || '');
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 18px 24px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 8px;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 55%;
  height: 100%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%);
}

.hero-content {
  display: flex;
  align-items: stretch;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.hero-left {
  flex: 1;
  min-width: 0;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #a5b4fc;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px !important;
}

.hero h1 {
  color: white;
  font-size: 20px !important;
  font-weight: 700;
  margin: 0 0 6px 0 !important;
  padding: 0 !important;
  letter-spacing: -0.3px !important;
  line-height: 1.25 !important;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.hero-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px !important;
  line-height: 1.4 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.hero-author {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 360px;
  max-width: 500px;
  flex: 1;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  color: white;
  font-size: 14px !important;
  font-weight: 600;
  line-height: 1.3 !important;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.author-role {
  color: #a5b4fc;
  font-size: 11px;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.author-quote {
  font-size: 11px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  line-height: 1.45 !important;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    gap: 20px;
  }

  .hero-author {
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 20px 24px;
  }

  .hero h1 {
    font-size: 22px !important;
  }

  .hero-author {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-details {
    align-items: center;
  }

  .author-info {
    align-items: center;
  }
}
</style>