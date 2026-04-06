/**
 * src/components/studentSide/projectView/forms/shared/AuthorInput.vue
 *
 * Reusable author entry component with name, role, quote, and avatar upload.
 * Supports single author or array item mode with optional remove button.
 */

<template>
  <div class="author-input-card" :class="{ 'removable': showRemove }">
    <!-- Header with index and remove button -->
    <div v-if="showHeader" class="author-header">
      <div class="author-index">
        <v-icon size="18" color="#c8102e">mdi-account</v-icon>
        <span class="font-weight-medium">{{ headerLabel }}</span>
      </div>
      <v-btn
        v-if="showRemove"
        icon
        variant="text"
        size="small"
        color="error"
        @click="$emit('remove')"
        :disabled="removeDisabled"
      >
        <v-icon size="20">mdi-close</v-icon>
      </v-btn>
    </div>

    <div class="author-content">
      <!-- Avatar Preview & Upload -->
      <div class="avatar-section">
        <div class="avatar-preview">
          <img
            v-if="avatarPreviewUrl"
            :src="avatarPreviewUrl"
            :alt="modelValue.name || 'Author avatar'"
          />
          <div v-else class="avatar-placeholder">
            <span v-if="modelValue.name">{{ getInitials(modelValue.name) }}</span>
            <v-icon v-else size="32" color="#999">mdi-account</v-icon>
          </div>
        </div>
        <v-btn
          size="small"
          variant="outlined"
          color="#c8102e"
          class="upload-btn"
          @click="triggerFileInput"
        >
          <v-icon start size="16">mdi-camera</v-icon>
          {{ avatarPreviewUrl ? 'Change' : 'Upload' }}
        </v-btn>
        <v-btn
          v-if="avatarPreviewUrl"
          size="small"
          variant="text"
          color="#666"
          class="remove-avatar-btn"
          @click="removeAvatar"
        >
          <v-icon start size="14">mdi-delete-outline</v-icon>
          Remove
        </v-btn>
        <input
          ref="fileInput"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          hidden
          @change="handleFileChange"
        />
        <p v-if="avatarError" class="avatar-error text-caption mt-1">
          {{ avatarError }}
        </p>
      </div>

      <!-- Avatar Cropper Dialog -->
      <AvatarCropperDialog
        v-model="showCropperDialog"
        :image-file="pendingImageFile"
        @cropped="handleCroppedImage"
        @cancel="handleCropperCancel"
      />

      <!-- Form Fields -->
      <div class="fields-section">
        <v-text-field
          :model-value="modelValue.name"
          @update:model-value="updateField('name', $event)"
          :label="$t('Name') + ' *'"
          :placeholder="$t('Full name')"
          variant="outlined"
          :rules="nameRules"
          :counter="150"
          class="mb-3"
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-account-outline</v-icon>
          </template>
        </v-text-field>

        <v-text-field
          :model-value="modelValue.role"
          @update:model-value="updateField('role', $event)"
          :label="$t('Role/Title') + ' *'"
          :placeholder="$t('e.g., 2023 Pharis Fellow, Lead Developer')"
          variant="outlined"
          :rules="roleRules"
          :counter="150"
          class="mb-3"
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-briefcase-outline</v-icon>
          </template>
        </v-text-field>

        <v-textarea
          :model-value="modelValue.quote"
          @update:model-value="updateField('quote', $event)"
          :label="$t('Testimonial Quote')"
          :placeholder="$t('Share what you learned or how this project impacted you...')"
          variant="outlined"
          :counter="500"
          rows="3"
          auto-grow
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-format-quote-close</v-icon>
          </template>
        </v-textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';
import AvatarCropperDialog from './AvatarCropperDialog.vue';
import { buildFileUrl } from '../../services/projectViewFormService.js';
import {
  UPLOAD_CONSTRAINTS,
  validateFileSize,
  validateFileExtension,
  validateImageSignature,
} from '@/utils/fileValidation';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      role: '',
      quote: '',
      avatarUrl: '',
      avatarFile: null
    })
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  headerLabel: {
    type: String,
    default: 'Author'
  },
  showRemove: {
    type: Boolean,
    default: false
  },
  removeDisabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'remove', 'remove-avatar']);

const fileInput = ref(null);
const showCropperDialog = ref(false);
const pendingImageFile = ref(null);
const avatarError = ref('');

// Validation rules
const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length <= 150) || 'Name must be 150 characters or less'
];

const roleRules = [
  v => !!v || 'Role is required',
  v => (v && v.length <= 150) || 'Role must be 150 characters or less'
];

// Track blob URL for avatar display.
// Persists after auto-save clears avatarFile (same pattern as poster in ProjectPreview).
const avatarObjectUrl = ref('');

// When a File is set (from cropper), create a blob URL and keep it alive
// even after auto-save clears avatarFile to null.
watch(
  () => props.modelValue.avatarFile,
  (newFile) => {
    if (newFile instanceof File) {
      if (avatarObjectUrl.value) URL.revokeObjectURL(avatarObjectUrl.value);
      avatarObjectUrl.value = URL.createObjectURL(newFile);
    }
  },
  { immediate: true }
);

// Fetch avatar from backend for existing data (e.g. page reload).
// <img> tags can't send the auth token header, so we fetch via axios.
watch(
  () => props.modelValue.avatarUrl,
  async (url) => {
    if (avatarObjectUrl.value || !url) return;
    try {
      const { data } = await axios.get(buildFileUrl(url), { responseType: 'blob' });
      avatarObjectUrl.value = URL.createObjectURL(data);
    } catch { /* placeholder/initials shown */ }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (avatarObjectUrl.value) URL.revokeObjectURL(avatarObjectUrl.value);
});

const avatarPreviewUrl = computed(() => avatarObjectUrl.value);

// Get initials from name
function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Update a single field
function updateField(field, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
}

// Trigger file input click
function triggerFileInput() {
  fileInput.value?.click();
}

// Handle file selection — validate then open cropper dialog
async function handleFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  // Reset the input so the same file can be selected again
  if (fileInput.value) fileInput.value.value = '';

  avatarError.value = '';
  const { extensions, maxSizeMb } = UPLOAD_CONSTRAINTS.avatar;

  // Extension check
  const extResult = validateFileExtension(file, extensions);
  if (!extResult.valid) {
    avatarError.value = extResult.error;
    return;
  }

  // Size check
  const sizeResult = validateFileSize(file, maxSizeMb);
  if (!sizeResult.valid) {
    avatarError.value = sizeResult.error;
    return;
  }

  // Magic-number check
  const detected = await validateImageSignature(file);
  if (detected === null) {
    avatarError.value = 'File content does not match the expected image type. The file may be corrupted or renamed.';
    return;
  }

  pendingImageFile.value = file;
  showCropperDialog.value = true;
}

// Handle cropped image from dialog
function handleCroppedImage(croppedFile) {
  emit('update:modelValue', {
    ...props.modelValue,
    avatarFile: croppedFile,
    avatarUrl: '' // Clear URL when file is selected
  });
  pendingImageFile.value = null;
}

// Handle cropper cancel
function handleCropperCancel() {
  pendingImageFile.value = null;
}

// Remove avatar (clear local state + notify parent for backend deletion)
function removeAvatar() {
  const hadBackendAvatar = !!props.modelValue.avatarUrl;

  // Clear local blob URL
  if (avatarObjectUrl.value) {
    URL.revokeObjectURL(avatarObjectUrl.value);
    avatarObjectUrl.value = '';
  }

  // Clear avatar data on the model
  emit('update:modelValue', {
    ...props.modelValue,
    avatarFile: null,
    avatarUrl: ''
  });

  // Notify parent to call delete API (only if there was a backend-stored avatar)
  if (hadBackendAvatar) {
    emit('remove-avatar');
  }
}
</script>

<style scoped>
.author-input-card {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  transition: border-color 0.2s ease;
}

.author-input-card:hover {
  border-color: #c8102e40;
}

.author-input-card.removable {
  border-left: 3px solid #c8102e;
}

.author-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.author-index {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.author-content {
  display: flex;
  gap: 20px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #c8102e 0%, #e85a4f 100%);
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.upload-btn {
  text-transform: none;
  font-size: 0.75rem;
}

.remove-avatar-btn {
  text-transform: none;
  font-size: 0.7rem;
}

.avatar-error {
  color: #c8102e;
  text-align: center;
  max-width: 120px;
  word-wrap: break-word;
}

.fields-section {
  flex: 1;
  min-width: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .author-content {
    flex-direction: column;
    align-items: center;
  }

  .avatar-section {
    margin-bottom: 8px;
  }

  .fields-section {
    width: 100%;
  }
}
</style>