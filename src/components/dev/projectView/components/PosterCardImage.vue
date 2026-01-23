/**
 * src/components/dev/projectView/components/PosterCardImage.vue
 *
 * Image poster card with click-to-zoom functionality.
 * Displays an image preview and opens ZoomModal on click.
 * Used in the Development template.
 */

<template>
  <article class="card poster-card" @click="openModal">
    <!-- Header -->
    <div class="poster-card-header">
      <h3>{{ title }}</h3>
      <div class="expand-hint">
        <span>Click to enlarge</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          class="expand-icon"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </div>
    </div>

    <!-- Image Preview -->
    <div class="poster-embed-wrapper">
      <img 
        v-if="imageUrl"
        :src="imageUrl" 
        class="poster-image"
        :alt="title"
        @error="handleImageError"
      />
      <div v-else class="poster-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <p>No image uploaded</p>
      </div>
    </div>

    <!-- Zoom Modal -->
    <ZoomModal
      v-model="isModalOpen"
      :title="title"
      :src="imageUrl"
      type="image"
    />
  </article>
</template>

<script setup>
import { ref } from 'vue';
import ZoomModal from './ZoomModal.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'System Architecture',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  aspectRatio: {
    type: String,
    default: '1336 / 759',
  },
});

const isModalOpen = ref(false);
const imageError = ref(false);

function openModal() {
  if (props.imageUrl && !imageError.value) {
    isModalOpen.value = true;
  }
}

function handleImageError() {
  imageError.value = true;
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.poster-card {
  padding: 14px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.poster-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.poster-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.poster-card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.expand-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6366f1;
  font-size: 11px;
  font-weight: 500;
}

.expand-icon {
  transition: transform 0.2s ease;
}

.poster-card:hover .expand-icon {
  transform: scale(1.1);
}

.poster-embed-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: v-bind(aspectRatio);
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Placeholder */
.poster-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 150px;
  color: #a0aec0;
  gap: 12px;
}

.poster-placeholder svg {
  opacity: 0.5;
}

.poster-placeholder p {
  margin: 0;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 1024px) {
  .poster-card {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .poster-card {
    min-height: 250px;
  }
}
</style>