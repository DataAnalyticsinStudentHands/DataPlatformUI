/**
 * src/components/dev/projectView/forms/shared/ClowderFileSelector.vue
 *
 * Poster/diagram selector that lists files from the project's Clowder dataset.
 * Replaces the drag-and-drop FileUploader for the poster section.
 */

<template>
  <div class="clowder-file-selector">
    <!-- Title Field -->
    <v-text-field
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

    <!-- Selector Area -->
    <div
      class="selector-area"
      :class="{
        'has-file': hasSelection,
        'error': showError && !hasSelection
      }"
    >
      <!-- Selected File Preview -->
      <div v-if="hasSelection" class="file-preview">
        <!-- PDF Preview -->
        <div v-if="selectedType === 'pdf'" class="pdf-preview">
          <v-icon size="48" color="#c8102e">mdi-file-pdf-box</v-icon>
          <p class="file-name">{{ displayFileName }}</p>
        </div>

        <!-- Image Preview -->
        <div v-else class="image-preview">
          <img
            v-if="fullUrl"
            :src="fullUrl"
            :alt="displayFileName"
            @error="imageError = true"
          />
          <div v-if="imageError" class="image-fallback">
            <v-icon size="48" color="#666">mdi-image-outline</v-icon>
            <p class="file-name">{{ displayFileName }}</p>
          </div>
        </div>

        <!-- File Info -->
        <div class="file-info">
          <v-chip size="small" color="#c8102e" variant="tonal">
            {{ (selectedType || 'file').toUpperCase() }}
          </v-chip>
          <span v-if="displayFileName" class="file-name-label">{{ displayFileName }}</span>
        </div>

        <!-- Actions -->
        <div class="file-actions">
          <v-btn
            size="small"
            variant="outlined"
            color="#c8102e"
            @click="changeSelection"
          >
            <v-icon start size="16">mdi-swap-horizontal</v-icon>
            {{ $t('Change') }}
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            color="error"
            @click="removeSelection"
          >
            <v-icon start size="16">mdi-delete</v-icon>
            {{ $t('Remove') }}
          </v-btn>
        </div>
      </div>

      <!-- File Selector (no selection yet, or changing) -->
      <div v-else class="file-selector">
        <!-- Loading Files -->
        <div v-if="isLoadingFiles" class="selector-state">
          <v-progress-circular
            indeterminate
            color="#c8102e"
            size="40"
            width="3"
          />
          <p class="state-text">{{ $t('Loading files from Clowder...') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="selector-state">
          <v-icon size="40" color="#999">mdi-alert-circle-outline</v-icon>
          <p class="state-text">{{ loadError }}</p>
          <v-btn
            size="small"
            variant="tonal"
            color="#c8102e"
            class="mt-2"
            @click="fetchFiles"
          >
            <v-icon start size="16">mdi-refresh</v-icon>
            {{ $t('Retry') }}
          </v-btn>
        </div>

        <!-- No Compatible Files -->
        <div v-else-if="clowderFiles.length === 0" class="selector-state">
          <v-icon size="40" color="#999">mdi-file-hidden</v-icon>
          <p class="state-text">{{ $t('No poster-compatible files found in Clowder') }}</p>
          <p class="state-hint">{{ $t('Upload PDF or image files to your Clowder dataset first') }}</p>
        </div>

        <!-- File Dropdown -->
        <div v-else class="dropdown-container">
          <v-icon size="40" :color="pendingFile ? '#c8102e' : '#999'" class="mb-3">
            mdi-cloud-download-outline
          </v-icon>
          <p class="selector-title">{{ $t('Select a file from your Clowder dataset') }}</p>

          <v-select
            v-model="pendingFile"
            :items="clowderFiles"
            item-title="filename"
            item-value="id"
            return-object
            :label="$t('Choose a file')"
            :loading="isSelecting"
            :disabled="isSelecting"
            variant="outlined"
            density="comfortable"
            class="file-dropdown mt-3"
            hide-details
          >
            <template v-slot:item="{ item, props: itemProps }">
              <v-list-item v-bind="itemProps">
                <template v-slot:prepend>
                  <v-icon :color="getFileIconColor(item.raw)">
                    {{ getFileIcon(item.raw) }}
                  </v-icon>
                </template>
                <template v-slot:subtitle>
                  {{ formatContentType(item.raw.contentType) }} · {{ formatSize(item.raw.size) }}
                </template>
              </v-list-item>
            </template>

            <template v-slot:selection="{ item }">
              <v-icon size="18" :color="getFileIconColor(item.raw)" class="mr-2">
                {{ getFileIcon(item.raw) }}
              </v-icon>
              {{ item.raw.filename }}
            </template>

            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    icon
                    variant="text"
                    size="x-small"
                    :disabled="isSelecting"
                    @click.stop="fetchFiles"
                  >
                    <v-icon size="18">mdi-refresh</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('Refresh file list') }}</span>
              </v-tooltip>
            </template>
          </v-select>

          <v-btn
            color="#c8102e"
            variant="flat"
            size="small"
            class="mt-3"
            :loading="isSelecting"
            :disabled="!pendingFile || isSelecting"
            @click="confirmSelection"
          >
            <v-icon start size="16">mdi-check</v-icon>
            {{ $t('Select File') }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="selectionError" class="error-message text-caption mt-2">
      <v-icon size="14" color="error" class="mr-1">mdi-alert-circle</v-icon>
      {{ selectionError }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import formService from '../../services/projectViewFormService.js';

const props = defineProps({
  formId: {
    type: String,
    required: true
  },
  posterTitle: {
    type: String,
    default: ''
  },
  selectedFileId: {
    type: String,
    default: null
  },
  existingUrl: {
    type: String,
    default: ''
  },
  existingType: {
    type: String,
    default: 'pdf'
  },
  existingFileName: {
    type: String,
    default: ''
  },
  showError: {
    type: Boolean,
    default: false
  },
  titlePlaceholder: {
    type: String,
    default: 'e.g., Research Poster'
  }
});

const emit = defineEmits(['update:posterTitle', 'poster-selected', 'poster-removed']);

// State
const clowderFiles = ref([]);
const isLoadingFiles = ref(false);
const isSelecting = ref(false);
const loadError = ref('');
const selectionError = ref('');
const pendingFile = ref(null);
const imageError = ref(false);
const isChanging = ref(false);

// Computed
const hasSelection = computed(() => {
  return !isChanging.value && !!(props.existingUrl || props.selectedFileId);
});

const selectedType = computed(() => {
  return props.existingType || 'pdf';
});

const displayFileName = computed(() => {
  if (props.existingFileName) return props.existingFileName;
  // Try to extract from URL
  if (props.existingUrl) {
    const parts = props.existingUrl.split('/');
    return parts[parts.length - 1] || 'Selected file';
  }
  return 'Selected file';
});

const fullUrl = computed(() => {
  if (!props.existingUrl) return '';
  return formService.buildFileUrl(props.existingUrl);
});

// Fetch Clowder files
async function fetchFiles() {
  if (!props.formId) return;

  isLoadingFiles.value = true;
  loadError.value = '';
  selectionError.value = '';

  try {
    clowderFiles.value = await formService.getClowderFiles(props.formId);
  } catch (err) {
    if (err.response?.status === 404) {
      loadError.value = 'No Clowder dataset linked to this project. Upload files to Clowder first.';
    } else {
      loadError.value = 'Failed to load files from Clowder. Please try again.';
    }
  } finally {
    isLoadingFiles.value = false;
  }
}

// Confirm file selection — calls backend immediately
async function confirmSelection() {
  if (!pendingFile.value || !props.formId) return;

  isSelecting.value = true;
  selectionError.value = '';

  try {
    const response = await formService.selectPosterFromClowder(
      props.formId,
      pendingFile.value.id,
      props.posterTitle || undefined
    );

    const synced = formService.fromBackendFormat(response);

    emit('poster-selected', {
      url: synced.poster?.url || '',
      type: synced.poster?.type || 'pdf',
      clowderFileId: pendingFile.value.id,
      clowderFileName: pendingFile.value.filename,
    });

    isChanging.value = false;
    pendingFile.value = null;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to import file from Clowder.';
    selectionError.value = message;
    toast.error(message, {
      position: 'top-right',
      toastClassName: 'Toastify__toast--delete'
    });
  } finally {
    isSelecting.value = false;
  }
}

// Change selection — show dropdown again
function changeSelection() {
  isChanging.value = true;
  pendingFile.value = null;
  imageError.value = false;
  if (clowderFiles.value.length === 0) {
    fetchFiles();
  }
}

// Remove selection
function removeSelection() {
  isChanging.value = false;
  pendingFile.value = null;
  imageError.value = false;
  emit('poster-removed');
}

// Helper: file icon
function getFileIcon(file) {
  if (!file?.contentType) return 'mdi-file-outline';
  if (file.contentType === 'application/pdf') return 'mdi-file-pdf-box';
  if (file.contentType.startsWith('image/')) return 'mdi-file-image-outline';
  return 'mdi-file-outline';
}

// Helper: file icon color
function getFileIconColor(file) {
  if (!file?.contentType) return '#666';
  if (file.contentType === 'application/pdf') return '#c8102e';
  if (file.contentType.startsWith('image/')) return '#2563eb';
  return '#666';
}

// Helper: format content type for display
function formatContentType(contentType) {
  if (!contentType) return 'Unknown';
  const map = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/gif': 'GIF',
  };
  return map[contentType] || contentType;
}

// Helper: format file size
function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Fetch files on mount
onMounted(() => {
  if (props.formId && !hasSelection.value) {
    fetchFiles();
  }
});

// Re-fetch when formId changes
watch(() => props.formId, (newVal) => {
  if (newVal && !hasSelection.value) {
    fetchFiles();
  }
});
</script>

<style scoped>
.clowder-file-selector {
  width: 100%;
}

.selector-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;
  background: #fafafa;
}

.selector-area.has-file {
  border-style: solid;
  border-color: #e0e0e0;
  padding: 20px;
}

.selector-area.error {
  border-color: #c8102e;
}

/* States (loading, error, empty) */
.selector-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
}

.state-text {
  font-size: 0.875rem;
  color: #666;
  margin: 12px 0 0 0;
  max-width: 300px;
}

.state-hint {
  font-size: 0.8rem;
  color: #999;
  margin: 4px 0 0 0;
}

/* Dropdown container */
.dropdown-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selector-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.file-dropdown {
  max-width: 400px;
  width: 100%;
}

/* File preview */
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

.image-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name-label {
  font-size: 0.8rem;
  color: #666;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
