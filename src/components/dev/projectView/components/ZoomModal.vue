/**
 * src/components/dev/projectView/components/ZoomModal.vue
 *
 * Shared zoom modal component for viewing posters (PDF or Image) in full screen.
 * Supports zoom in/out controls and click-outside-to-close behavior.
 */

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <div class="modal-controls">
              <button 
                class="zoom-btn" 
                @click="zoomOut" 
                :disabled="zoomLevel <= minZoom"
                aria-label="Zoom out"
              >
                −
              </button>
              <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
              <button 
                class="zoom-btn" 
                @click="zoomIn" 
                :disabled="zoomLevel >= maxZoom"
                aria-label="Zoom in"
              >
                +
              </button>
              <button class="close-btn" @click="close" aria-label="Close modal">
                ✕
              </button>
            </div>
          </div>
          <div class="modal-body" ref="modalBody">
            <div 
              class="content-container" 
              :style="{ 
                transform: `scale(${zoomLevel})`, 
                transformOrigin: 'top left' 
              }"
            >
              <!-- PDF Content -->
              <iframe
                v-if="type === 'pdf'"
                :src="src + '#toolbar=0&navpanes=0'"
                class="poster-pdf"
                frameborder="0"
              ></iframe>

              <!-- Image Content -->
              <img
                v-else
                :src="src"
                :alt="title"
                class="poster-image"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Preview',
  },
  src: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'image',
    validator: (value) => ['pdf', 'image'].includes(value),
  },
  minZoom: {
    type: Number,
    default: 0.5,
  },
  maxZoom: {
    type: Number,
    default: 3,
  },
  zoomStep: {
    type: Number,
    default: 0.25,
  },
});

const emit = defineEmits(['update:modelValue']);

const zoomLevel = ref(1);
const modalBody = ref(null);

// Reset zoom when modal opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    zoomLevel.value = 1;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

function close() {
  emit('update:modelValue', false);
}

function zoomIn() {
  if (zoomLevel.value < props.maxZoom) {
    zoomLevel.value = Math.min(zoomLevel.value + props.zoomStep, props.maxZoom);
  }
}

function zoomOut() {
  if (zoomLevel.value > props.minZoom) {
    zoomLevel.value = Math.max(zoomLevel.value - props.zoomStep, props.minZoom);
  }
}

// Keyboard controls
function handleKeydown(e) {
  if (!props.modelValue) return;
  
  if (e.key === 'Escape') {
    close();
  } else if (e.key === '+' || e.key === '=') {
    zoomIn();
  } else if (e.key === '-') {
    zoomOut();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.modal-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn,
.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  min-width: 28px;
}

.zoom-btn:hover:not(:disabled),
.close-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-level {
  min-width: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #555;
}

.modal-body {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  padding: 16px;
  background: #2a2a3a;
}

.content-container {
  width: 100%;
  transition: transform 0.2s ease;
}

.poster-pdf {
  width: 100%;
  min-height: 900px;
  border: none;
  background: white;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

.poster-image {
  width: 100%;
  max-width: 100%;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  background: white;
}

/* Transition animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
}
</style>