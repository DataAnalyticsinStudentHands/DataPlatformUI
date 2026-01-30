/**
 * src/components/dev/projectView/forms/shared/FileUploader.vue
 *
 * File upload component for posters and images.
 * Supports PDF and image file types with drag-and-drop.
 */

<template>
  <div class="file-uploader-container">
    <!-- Title Field -->
    <v-text-field
      v-if="showTitleField"
      :model-value="posterTitle"
      @update:model-value="$emit('update:posterTitle', $event)"
      :label="$t('Section Title')"
      :placeholder="titlePlaceholder"
      variant="outlined"
      density="comfortable"
      class="mb-4"
    >
      <template v-slot:prepend-inner>
        <v-icon size="20" color="#666">mdi-format-title</v-icon>
      </template>
    </v-text-field>

    <!-- Upload Area -->
    <div
      class="upload-area"
      :class="{ 
        'dragging': isDragging, 
        'has-file': hasFile,
        'error': showError 
      }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <!-- Preview Mode -->
      <div v-if="hasFile" class="file-preview">
        <!-- PDF Preview -->
        <div v-if="fileType === 'pdf'" class="pdf-preview">
          <v-icon size="48" color="#c8102e">mdi-file-pdf-box</v-icon>
          <p class="file-name">{{ fileName }}</p>
        </div>

        <!-- Image Preview -->
        <div v-else-if="previewUrl" class="image-preview">
          <img :src="previewUrl" :alt="fileName" />
        </div>

        <!-- File Info -->
        <div class="file-info">
          <v-chip size="small" color="#c8102e" variant="tonal">
            {{ fileType.toUpperCase() }}
          </v-chip>
          <span class="file-size">{{ formattedFileSize }}</span>
        </div>

        <!-- Actions -->
        <div class="file-actions">
          <v-btn
            size="small"
            variant="outlined"
            color="#c8102e"
            @click.stop="triggerFileInput"
          >
            <v-icon start size="16">mdi-swap-horizontal</v-icon>
            {{ $t('Change') }}
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            color="error"
            @click.stop="removeFile"
          >
            <v-icon start size="16">mdi-delete</v-icon>
            {{ $t('Remove') }}
          </v-btn>
        </div>
      </div>

      <!-- Upload Prompt -->
      <div v-else class="upload-prompt">
        <v-icon size="48" :color="isDragging ? '#c8102e' : '#999'">
          {{ acceptPdf ? 'mdi-file-upload-outline' : 'mdi-image-plus' }}
        </v-icon>
        <p class="upload-title">
          {{ isDragging ? $t('Drop file here') : $t('Click or drag to upload') }}
        </p>
        <p class="upload-hint">
          {{ acceptHint }}
        </p>
        <v-btn
          size="small"
          variant="tonal"
          color="#c8102e"
          class="mt-2"
          @click.stop="triggerFileInput"
        >
          <v-icon start size="16">mdi-folder-open</v-icon>
          {{ $t('Browse Files') }}
        </v-btn>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="error-message text-caption mt-2">
      <v-icon size="14" color="error" class="mr-1">mdi-alert-circle</v-icon>
      {{ errorMessage }}
    </p>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      :accept="acceptTypes"
      hidden
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [File, null],
    default: null
  },
  existingUrl: {
    type: String,
    default: ''
  },
  posterTitle: {
    type: String,
    default: ''
  },
  showTitleField: {
    type: Boolean,
    default: true
  },
  titlePlaceholder: {
    type: String,
    default: 'e.g., Research Poster'
  },
  acceptPdf: {
    type: Boolean,
    default: true
  },
  acceptImages: {
    type: Boolean,
    default: true
  },
  maxSizeMb: {
    type: Number,
    default: 10
  },
  showError: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'update:posterTitle', 'remove']);

const fileInput = ref(null);
const isDragging = ref(false);
const errorMessage = ref('');

// Computed accept types
const acceptTypes = computed(() => {
  const types = [];
  if (props.acceptPdf) types.push('application/pdf');
  if (props.acceptImages) types.push('image/jpeg', 'image/png', 'image/gif', 'image/webp');
  return types.join(',');
});

// Accept hint text
const acceptHint = computed(() => {
  const formats = [];
  if (props.acceptPdf) formats.push('PDF');
  if (props.acceptImages) formats.push('JPG, PNG, GIF');
  return `${formats.join(', ')} · Max ${props.maxSizeMb}MB`;
});

// Check if has file (only consider File objects, not corrupted localStorage data)
const hasFile = computed(() => (props.modelValue instanceof File) || props.existingUrl);

// File name
const fileName = computed(() => {
  if (props.modelValue instanceof File) return props.modelValue.name;
  if (props.existingUrl) {
    const parts = props.existingUrl.split('/');
    return parts[parts.length - 1] || 'Uploaded file';
  }
  return '';
});

// File type
const fileType = computed(() => {
  if (props.modelValue instanceof File) {
    if (props.modelValue.type === 'application/pdf') return 'pdf';
    if (props.modelValue.type.startsWith('image/')) return 'image';
  }
  if (props.existingUrl) {
    if (props.existingUrl.toLowerCase().endsWith('.pdf')) return 'pdf';
    return 'image';
  }
  return 'unknown';
});

// Preview URL for images
const previewUrl = computed(() => {
  // Only create object URL for actual File/Blob objects (not corrupted localStorage data)
  if (props.modelValue && props.modelValue instanceof File && props.modelValue.type.startsWith('image/')) {
    return URL.createObjectURL(props.modelValue);
  }
  if (props.existingUrl && fileType.value === 'image') {
    return props.existingUrl;
  }
  return '';
});

// Formatted file size
const formattedFileSize = computed(() => {
  if (!(props.modelValue instanceof File)) return '';
  const bytes = props.modelValue.size;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
});

// Trigger file input click
function triggerFileInput() {
  fileInput.value?.click();
}

// Handle drag over
function onDragOver(e) {
  isDragging.value = true;
}

// Handle drag leave
function onDragLeave(e) {
  isDragging.value = false;
}

// Handle drop
function onDrop(e) {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    validateAndSetFile(files[0]);
  }
}

// Handle file input change
function handleFileChange(e) {
  const file = e.target.files?.[0];
  if (file) {
    validateAndSetFile(file);
  }
  // Reset input so same file can be selected again
  if (fileInput.value) fileInput.value.value = '';
}

// Validate and set file
function validateAndSetFile(file) {
  errorMessage.value = '';

  // Check file type
  const isPdf = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');

  if (props.acceptPdf && !props.acceptImages && !isPdf) {
    errorMessage.value = 'Please upload a PDF file';
    return;
  }

  if (!props.acceptPdf && props.acceptImages && !isImage) {
    errorMessage.value = 'Please upload an image file';
    return;
  }

  if (!isPdf && !isImage) {
    errorMessage.value = 'Invalid file type';
    return;
  }

  // Check file size
  const maxBytes = props.maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    errorMessage.value = `File size must be less than ${props.maxSizeMb}MB`;
    return;
  }

  emit('update:modelValue', file);
}

// Remove file
function removeFile() {
  emit('update:modelValue', null);
  emit('remove');
  errorMessage.value = '';
}
</script>

<style scoped>
.file-uploader-container {
  width: 100%;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #c8102e;
  background: #fff5f5;
}

.upload-area.dragging {
  border-color: #c8102e;
  background: #fff0f0;
  border-style: solid;
}

.upload-area.has-file {
  border-style: solid;
  border-color: #e0e0e0;
  cursor: default;
  padding: 20px;
}

.upload-area.error {
  border-color: #c8102e;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 12px 0 4px 0;
}

.upload-hint {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  min-width: 200px;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  margin: 8px 0 0 0;
  word-break: break-all;
  max-width: 300px;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-size {
  font-size: 0.75rem;
  color: #666;
}

.file-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.file-actions .v-btn {
  text-transform: none;
}

.error-message {
  color: #c8102e;
  display: flex;
  align-items: center;
}
</style>