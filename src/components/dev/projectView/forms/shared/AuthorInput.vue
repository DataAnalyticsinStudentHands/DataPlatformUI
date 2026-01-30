/**
 * src/components/dev/projectView/forms/shared/AuthorInput.vue
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
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="handleFileChange"
        />
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
          density="comfortable"
          :rules="nameRules"
          :counter="100"
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
          density="comfortable"
          :rules="roleRules"
          :counter="100"
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
          density="comfortable"
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
import { ref, computed } from 'vue';
import AvatarCropperDialog from './AvatarCropperDialog.vue';

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

const emit = defineEmits(['update:modelValue', 'remove']);

const fileInput = ref(null);
const showCropperDialog = ref(false);
const pendingImageFile = ref(null);

// Validation rules
const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length <= 100) || 'Name must be 100 characters or less'
];

const roleRules = [
  v => !!v || 'Role is required',
  v => (v && v.length <= 100) || 'Role must be 100 characters or less'
];

// Computed avatar preview URL
const avatarPreviewUrl = computed(() => {
  if (props.modelValue.avatarFile) {
    return URL.createObjectURL(props.modelValue.avatarFile);
  }
  return props.modelValue.avatarUrl || '';
});

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

// Handle file selection - opens cropper dialog
function handleFileChange(event) {
  const file = event.target.files?.[0];
  if (file) {
    pendingImageFile.value = file;
    showCropperDialog.value = true;
  }
  // Reset the input so the same file can be selected again
  if (fileInput.value) {
    fileInput.value.value = '';
  }
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