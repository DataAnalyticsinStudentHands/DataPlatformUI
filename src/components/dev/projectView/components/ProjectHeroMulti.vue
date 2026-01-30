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
      </div>

      <!-- Authors Cards -->
      <div class="hero-authors">
        <div 
          v-for="author in authors" 
          :key="author.id" 
          class="author-card"
        >
          <img
            class="author-avatar"
            :src="getAvatarSrc(author)"
            :alt="`${author.name} headshot`"
            @error="(e) => handleImageError(e, author.id)"
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
import { ref } from 'vue';

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

const imageErrors = ref(new Set());

function getAvatarSrc(author) {
  // Check for uploaded file first (from cropper)
  if (author.avatarFile) {
    return URL.createObjectURL(author.avatarFile);
  }

  // Fall back to URL
  if (!imageErrors.value.has(author.id) && author.avatarUrl) {
    return author.avatarUrl;
  }

  // Return placeholder/default avatar
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90">
      <rect fill="#6366f1" width="90" height="90"/>
      <text x="45" y="50" font-family="Arial" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${author.name ? author.name.charAt(0).toUpperCase() : '?'}
      </text>
    </svg>
  `);
}

function handleImageError(event, authorId) {
  imageErrors.value.add(authorId);
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 28px 32px;
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
  gap: 24px;
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
  margin-bottom: 10px;
}

.hero h1 {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  letter-spacing: -0.3px;
  line-height: 1.25;
}

.hero-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.hero-authors {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;
  min-width: 420px;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 18px 22px;
}

.author-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
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
  font-size: 18px;
  font-weight: 600;
}

.author-role {
  color: #a5b4fc;
  font-size: 13px;
  font-weight: 500;
}

.author-quote {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.45;
  padding: 0;
  border: none;
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
    font-size: 20px;
  }

  .hero-authors {
    flex-direction: column;
  }
}
</style>