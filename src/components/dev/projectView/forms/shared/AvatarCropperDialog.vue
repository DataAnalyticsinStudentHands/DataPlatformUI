/**
 * src/components/dev/projectView/forms/shared/AvatarCropperDialog.vue
 *
 * Dialog component for cropping and positioning avatar images.
 * Uses vue-advanced-cropper with a circular stencil.
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
        <span>{{ $t('Position Your Photo') }}</span>
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
            ref="cropperRef"
            class="cropper"
            :src="imageSrc"
            :stencil-component="CircleStencil"
            :stencil-props="{
              aspectRatio: 1,
              previewClass: 'cropper-stencil-preview'
            }"
            :default-size="defaultSize"
            image-restriction="stencil"
            @ready="onCropperReady"
          />
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
import { ref, computed, watch } from 'vue';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
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
    default: 256 // Output image size in pixels
  },
  outputType: {
    type: String,
    default: 'image/jpeg'
  },
  outputQuality: {
    type: Number,
    default: 0.9
  }
});

const emit = defineEmits(['update:modelValue', 'cropped', 'cancel']);

const cropperRef = ref(null);
const cropperReady = ref(false);
const zoomLevel = ref(1);
const lastAppliedZoom = ref(1);
const minZoom = ref(0.5);
const maxZoom = ref(3);

// Compute image source from file or URL
const imageSrc = computed(() => {
  if (props.imageFile) {
    return URL.createObjectURL(props.imageFile);
  }
  return props.imageUrl || '';
});

// Default size callback for initial crop area
function defaultSize({ imageSize, visibleArea }) {
  return {
    width: Math.min(imageSize.width, imageSize.height),
    height: Math.min(imageSize.width, imageSize.height)
  };
}

// When cropper is ready
function onCropperReady() {
  cropperReady.value = true;
  // Reset zoom level
  zoomLevel.value = 1;
  lastAppliedZoom.value = 1;
}

// Reset state when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    cropperReady.value = false;
    zoomLevel.value = 1;
    lastAppliedZoom.value = 1;
  }
});

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
          `avatar-${Date.now()}.${props.outputType === 'image/png' ? 'png' : 'jpg'}`,
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
  height: 300px;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.cropper {
  width: 100%;
  height: 100%;
}

.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-slider {
  max-width: 200px;
}

/* Override cropper styles for better visibility */
:deep(.vue-advanced-cropper__background) {
  background: #1a1a1a;
}

:deep(.vue-advanced-cropper__foreground) {
  background: rgba(0, 0, 0, 0.5);
}

/* Style the circle stencil */
:deep(.vue-circle-stencil) {
  border: 2px solid #fff;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

:deep(.vue-circle-stencil__preview) {
  border: 2px solid #c8102e;
}
</style>
