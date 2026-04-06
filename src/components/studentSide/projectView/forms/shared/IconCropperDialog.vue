/**
 * src/components/studentSide/projectView/forms/shared/IconCropperDialog.vue
 *
 * Dialog component for cropping and positioning icon/logo images.
 * Uses vue-advanced-cropper with a square stencil for partner organization icons.
 */

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ $t('Position Icon') }}</span>
        <v-btn icon variant="text" @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="cropper-container">
        <p class="text-body-2 text-grey-darken-1 mb-4 text-center">
          {{ $t('Drag to reposition. Use scroll or buttons to zoom.') }}
        </p>

        <div class="cropper-wrapper">
          <Cropper
            v-if="imageSrc"
            ref="cropperRef"
            class="cropper"
            :src="imageSrc"
            :stencil-props="{
              aspectRatio: 1,
              previewClass: 'cropper-stencil-preview'
            }"
            :default-size="defaultSize"
            image-restriction="stencil"
            @ready="onCropperReady"
          />
          <div v-else class="cropper-placeholder">
            <v-icon size="48" color="grey">mdi-image-off</v-icon>
          </div>
        </div>

        <!-- Zoom Controls -->
        <div class="zoom-controls mt-4">
          <v-btn icon size="small" variant="outlined" @click="zoomOut" :disabled="!cropperReady">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-slider
            v-model="zoomLevel"
            :min="minZoom"
            :max="maxZoom"
            :step="0.1"
            hide-details
            class="mx-4 zoom-slider"
            color="#c8102e"
            :disabled="!cropperReady"
            @update:model-value="applyZoom"
          />
          <v-btn icon size="small" variant="outlined" @click="zoomIn" :disabled="!cropperReady">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

        <!-- Preview -->
        <div class="preview-section mt-4">
          <p class="text-caption text-grey-darken-1 text-center mb-2">{{ $t('Preview') }}</p>
          <div class="preview-icons">
            <div class="preview-icon large" :style="previewStyle"></div>
            <div class="preview-icon medium" :style="previewStyle"></div>
            <div class="preview-icon small" :style="previewStyle"></div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-btn variant="text" @click="cancel">
          {{ $t('Cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn color="#c8102e" variant="flat" @click="confirm" :disabled="!cropperReady">
          {{ $t('Apply') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  imageFile: {
    type: [File, Blob],
    default: null
  },
  imageUrl: {
    type: String,
    default: ''
  },
  outputSize: {
    type: Number,
    default: 128 // Output image size in pixels (smaller for icons)
  },
  outputType: {
    type: String,
    default: 'image/png' // PNG for better quality with logos
  },
  outputQuality: {
    type: Number,
    default: 0.95
  }
});

const emit = defineEmits(['update:modelValue', 'cropped', 'cancel']);

const cropperRef = ref(null);
const cropperReady = ref(false);
const zoomLevel = ref(1);
const lastAppliedZoom = ref(1);
const minZoom = ref(0.5);
const maxZoom = ref(3);
const previewUrl = ref('');

// Track object URL for cleanup
const objectUrl = ref('');

// Compute image source from file or URL
const imageSrc = computed(() => {
  // Revoke previous object URL to prevent memory leaks
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = '';
  }

  if (props.imageFile) {
    objectUrl.value = URL.createObjectURL(props.imageFile);
    return objectUrl.value;
  }
  return props.imageUrl || '';
});

// Cleanup on unmount
onBeforeUnmount(() => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
  }
});

// Preview style for the icon previews
const previewStyle = computed(() => {
  if (previewUrl.value) {
    return {
      backgroundImage: `url(${previewUrl.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  return {
    backgroundColor: '#e0e0e0'
  };
});

// Default size callback for initial crop area
function defaultSize({ imageSize }) {
  return {
    width: Math.min(imageSize.width, imageSize.height),
    height: Math.min(imageSize.width, imageSize.height)
  };
}

// When cropper is ready
function onCropperReady() {
  cropperReady.value = true;
  zoomLevel.value = 1;
  lastAppliedZoom.value = 1;
  updatePreview();
}

// Reset state when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    cropperReady.value = false;
    zoomLevel.value = 1;
    lastAppliedZoom.value = 1;
    previewUrl.value = '';
  }
});

// Update preview when cropper changes
function updatePreview() {
  if (!cropperRef.value) return;

  const { canvas } = cropperRef.value.getResult();
  if (canvas) {
    previewUrl.value = canvas.toDataURL(props.outputType, props.outputQuality);
  }
}

// Zoom functions
function zoomIn() {
  const newZoom = Math.min(zoomLevel.value + 0.2, maxZoom.value);
  applyZoom(newZoom);
}

function zoomOut() {
  const newZoom = Math.max(zoomLevel.value - 0.2, minZoom.value);
  applyZoom(newZoom);
}

function applyZoom(level) {
  if (cropperRef.value) {
    cropperRef.value.zoom(level / lastAppliedZoom.value);
    lastAppliedZoom.value = level;
    zoomLevel.value = level;
    updatePreview();
  }
}

// Cancel and close dialog
function cancel() {
  emit('update:modelValue', false);
  emit('cancel');
}

// Confirm and emit cropped image
async function confirm() {
  if (!cropperRef.value) return;

  const { canvas } = cropperRef.value.getResult();
  if (!canvas) return;

  // Create a new canvas with the desired output size
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = props.outputSize;
  outputCanvas.height = props.outputSize;
  const ctx = outputCanvas.getContext('2d');

  // Draw the cropped image scaled to output size
  ctx.drawImage(canvas, 0, 0, props.outputSize, props.outputSize);

  // Convert to blob
  outputCanvas.toBlob(
    (blob) => {
      if (blob) {
        // Create a File object from the blob
        const croppedFile = new File(
          [blob],
          `icon-${Date.now()}.${props.outputType === 'image/png' ? 'png' : 'jpg'}`,
          { type: props.outputType }
        );
        emit('cropped', croppedFile);
        emit('update:modelValue', false);
      }
    },
    props.outputType,
    props.outputQuality
  );
}
</script>

<style scoped>
.cropper-container {
  padding: 16px;
}

.cropper-wrapper {
  width: 100%;
  height: 280px;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.cropper {
  width: 100%;
  height: 100%;
}

.cropper-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
}

.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-slider {
  max-width: 200px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.preview-icon {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: #f5f5f5;
}

.preview-icon.large {
  width: 48px;
  height: 48px;
}

.preview-icon.medium {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.preview-icon.small {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

/* Override cropper styles for better visibility */
:deep(.vue-advanced-cropper__background) {
  background: #1a1a1a;
}

:deep(.vue-advanced-cropper__foreground) {
  background: rgba(0, 0, 0, 0.5);
}

/* Style the square stencil */
:deep(.vue-rectangle-stencil) {
  border: 2px solid #fff;
  border-radius: 8px;
}

:deep(.vue-simple-handler) {
  background: #c8102e;
  border: 2px solid #fff;
}

:deep(.vue-simple-line) {
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
