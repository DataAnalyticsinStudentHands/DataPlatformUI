/**
 * src/components/dev/projectView/components/ProjectHeroMulti.vue
 *
 * Hero header component for multi-author projects (Development template).
 * Displays project label, title, description, and multiple author cards with testimonials.
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

        <!-- Inline Authors (all minimal: name + role only) -->
        <div v-if="minimal" class="hero-authors-inline">
          <span
            v-for="(author, index) in authors"
            :key="author.id"
            class="inline-author-item"
          >
            <span class="inline-author-name">{{ author.name }}</span>
            <span v-if="author.role" class="inline-author-separator">&mdash;</span>
            <span v-if="author.role" class="inline-author-role">{{ author.role }}</span>
            <span v-if="index < authors.length - 1" class="inline-author-divider">&bull;</span>
          </span>
        </div>
      </div>

      <!-- Authors Cards (full layout with avatar/quote) -->
      <div v-if="!minimal" class="hero-authors">
        <div
          v-for="author in authors"
          :key="author.id"
          class="author-card"
        >
          <img
            v-if="avatarBlobUrls[author.id]"
            class="author-avatar"
            :src="avatarBlobUrls[author.id]"
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
    </div>
  </header>
</template>

<script setup>
import { computed, ref, reactive, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { buildFileUrl } from '../services/projectViewFormService.js';
import { allAuthorsMinimal } from '../utils/authorUtils.js';

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
  authors: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const minimal = computed(() => allAuthorsMinimal(props.authors));

// Track blob URLs per author (persists after auto-save clears avatarFile).
const avatarBlobUrls = reactive({});

watch(
  () => props.authors,
  (authors) => {
    if (!authors) return;
    for (const author of authors) {
      if (author.avatarFile instanceof File) {
        if (avatarBlobUrls[author.id]) URL.revokeObjectURL(avatarBlobUrls[author.id]);
        avatarBlobUrls[author.id] = URL.createObjectURL(author.avatarFile);
      } else if (!author.avatarFile && !author.avatarUrl) {
        // No avatar — revoke any stale blob URL and ensure key exists as empty
        if (avatarBlobUrls[author.id]) URL.revokeObjectURL(avatarBlobUrls[author.id]);
        avatarBlobUrls[author.id] = '';
      } else if (!avatarBlobUrls[author.id] && author.avatarUrl) {
        fetchAvatar(author.id, author.avatarUrl);
      }
    }
  },
  { deep: true, immediate: true }
);

async function fetchAvatar(id, relativePath) {
  try {
    const { data } = await axios.get(buildFileUrl(relativePath), { responseType: 'blob' });
    avatarBlobUrls[id] = URL.createObjectURL(data);
  } catch { /* placeholder shown */ }
}

onBeforeUnmount(() => {
  Object.values(avatarBlobUrls).forEach(url => { if (url) URL.revokeObjectURL(url); });
});
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

.hero-authors {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 400px;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 0;
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
  font-weight: 500;
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

/* Inline authors (minimal layout) */
.hero-authors-inline {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.inline-author-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.inline-author-name {
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.inline-author-separator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

.inline-author-role {
  color: #a5b4fc;
  font-size: 11px;
  font-weight: 500;
}

.inline-author-divider {
  color: rgba(255, 255, 255, 0.3);
  margin: 0 4px;
  font-size: 10px;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    gap: 16px;
  }

  .hero-authors {
    min-width: 0;
    width: 100%;
    flex-direction: row;
  }

  .author-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 18px 20px;
  }

  .hero h1 {
    font-size: 20px !important;
  }

  .hero-authors {
    flex-direction: column;
  }
}
</style>