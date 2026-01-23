/**
 * src/components/dev/projectView/components/PosterCardPdf.vue
 *
 * PDF poster embed card with click-to-zoom functionality.
 * Embeds a PDF preview and opens ZoomModal on click.
 * Used in the Research template.
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

    <!-- PDF Preview -->
    <div class="poster-embed-wrapper">
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl + '#page=1&zoom=page-fit&toolbar=0&navpanes=0'"
        class="poster-embed"
        frameborder="0"
        @click.stop
      ></iframe>
      <div v-else class="poster-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <p>No PDF uploaded</p>
      </div>
    </div>

    <!-- Zoom Modal -->
    <ZoomModal
      v-model="isModalOpen"
      :title="title"
      :src="pdfUrl"
      type="pdf"
    />
  </article>
</template>

<script setup>
import { ref } from 'vue';
import ZoomModal from './ZoomModal.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Research Poster',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
});

const isModalOpen = ref(false);

function openModal() {
  if (props.pdfUrl) {
    isModalOpen.value = true;
  }
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
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  flex: 1;
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
  margin-bottom: 12px;
  flex-shrink: 0;
}

.poster-card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.expand-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6366f1;
  font-size: 12px;
  font-weight: 500;
}

.expand-icon {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.poster-card:hover .expand-icon {
  transform: scale(1.1);
}

.poster-embed-wrapper {
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  position: relative;
}

.poster-embed {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}

/* Placeholder */
.poster-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
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
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .poster-card {
    min-height: 300px;
  }
}
</style>