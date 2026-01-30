/**
 * src/components/dev/projectView/forms/shared/TagsInput.vue
 *
 * Tag entry component with add/remove functionality and color selection.
 * Supports Enter key to add and click to remove tags.
 * Each tag can have a custom color via preset or hex input.
 */

<template>
  <div class="tags-input-container">
    <!-- Input Field -->
    <v-text-field
      v-model="newTag"
      :label="label"
      :placeholder="placeholder"
      variant="outlined"
      :counter="maxTagLength"
      :error-messages="errorMessage"
      @keyup.enter="addTag"
      @keyup.,="addTag"
    >
      <template v-slot:prepend-inner>
        <v-icon size="20" color="#666">mdi-tag-outline</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-btn
          icon
          variant="text"
          size="small"
          color="#c8102e"
          :disabled="!canAddTag"
          @click="addTag"
        >
          <v-icon size="20">mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <!-- Helper Text -->
    <p class="helper-text text-caption text-medium-emphasis mb-3">
      {{ $t('Press Enter or click + to add a tag') }}
    </p>

    <!-- Tags Display -->
    <div class="tags-display">
      <div
        v-for="(tag, index) in modelValue"
        :key="tag.id"
        class="tag-item"
      >
        <v-chip
          closable
          :color="tag.color"
          variant="tonal"
          size="default"
          class="tag-chip"
          @click:close="removeTag(index)"
        >
          {{ tag.text }}
        </v-chip>

        <!-- Color Picker Menu -->
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <button
              v-bind="props"
              type="button"
              class="color-picker-btn"
              :style="{ backgroundColor: tag.color }"
              :title="$t('Change color')"
            >
              <v-icon size="12" color="white">mdi-palette</v-icon>
            </button>
          </template>
          <v-card class="color-picker-card">
            <v-card-text class="pa-3">
              <p class="text-caption font-weight-medium mb-2">{{ $t('Select Color') }}</p>
              <div class="color-presets">
                <button
                  v-for="preset in colorPresets"
                  :key="preset.value"
                  type="button"
                  class="color-preset-btn"
                  :class="{ active: tag.color === preset.value }"
                  :style="{ backgroundColor: preset.value }"
                  :title="preset.name"
                  @click="updateTagColor(index, preset.value)"
                >
                  <v-icon v-if="tag.color === preset.value" size="16" color="white">
                    mdi-check
                  </v-icon>
                </button>
              </div>
              <v-text-field
                :model-value="tag.color"
                @update:model-value="updateTagColor(index, $event)"
                label="Custom hex"
                variant="outlined"
                density="compact"
                class="mt-3"
                placeholder="#000000"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>

      <!-- Empty State -->
      <div v-if="modelValue.length === 0" class="empty-tags">
        <v-icon size="20" color="#ccc" class="mr-2">mdi-tag-off-outline</v-icon>
        <span class="text-medium-emphasis">{{ $t('No tags added yet') }}</span>
      </div>
    </div>

    <!-- Validation Message -->
    <p v-if="showValidation && modelValue.length < minTags" class="validation-error text-caption mt-2">
      <v-icon size="14" color="error" class="mr-1">mdi-alert-circle</v-icon>
      {{ $t('At least') }} {{ minTags }} {{ $t('tag(s) required') }}
    </p>

    <!-- Suggested Tags -->
    <div v-if="suggestions.length > 0 && showSuggestions" class="suggestions-section mt-3">
      <p class="text-caption text-medium-emphasis mb-2">{{ $t('Suggested tags:') }}</p>
      <div class="suggestions-list">
        <v-chip
          v-for="suggestion in availableSuggestions"
          :key="suggestion"
          size="small"
          variant="outlined"
          class="suggestion-chip"
          @click="addSuggestion(suggestion)"
        >
          <v-icon start size="14">mdi-plus</v-icon>
          {{ suggestion }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { TAG_COLOR_PRESETS, createEmptyTag } from '../../types/projectTypes.js';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  label: {
    type: String,
    default: 'Add Tag'
  },
  placeholder: {
    type: String,
    default: 'Enter a tag and press Enter'
  },
  maxTags: {
    type: Number,
    default: 10
  },
  minTags: {
    type: Number,
    default: 1
  },
  maxTagLength: {
    type: Number,
    default: 50
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  showSuggestions: {
    type: Boolean,
    default: true
  },
  showValidation: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const newTag = ref('');
const colorPresets = TAG_COLOR_PRESETS;

// Error message for input
const errorMessage = computed(() => {
  if (newTag.value.length > props.maxTagLength) {
    return `Tag must be ${props.maxTagLength} characters or less`;
  }
  if (props.modelValue.length >= props.maxTags) {
    return `Maximum ${props.maxTags} tags allowed`;
  }
  return '';
});

// Can add tag check
const canAddTag = computed(() => {
  const trimmed = newTag.value.trim();
  return trimmed.length > 0 &&
         trimmed.length <= props.maxTagLength &&
         props.modelValue.length < props.maxTags &&
         !props.modelValue.some(tag => tag.text === trimmed);
});

// Available suggestions (not already added)
const availableSuggestions = computed(() => {
  const existingTexts = props.modelValue.map(tag => tag.text);
  return props.suggestions.filter(s => !existingTexts.includes(s)).slice(0, 6);
});

// Add a new tag
function addTag() {
  const trimmed = newTag.value.trim();
  if (!canAddTag.value) return;

  // Cycle through preset colors for new tags
  const colorIndex = props.modelValue.length % colorPresets.length;
  const newTagObj = createEmptyTag({
    text: trimmed,
    color: colorPresets[colorIndex].value
  });

  emit('update:modelValue', [...props.modelValue, newTagObj]);
  newTag.value = '';
}

// Remove a tag by index
function removeTag(index) {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
}

// Update tag color
function updateTagColor(index, color) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], color };
  emit('update:modelValue', updated);
}

// Add a suggestion
function addSuggestion(suggestion) {
  if (props.modelValue.length >= props.maxTags) return;
  if (props.modelValue.some(tag => tag.text === suggestion)) return;

  // Cycle through preset colors
  const colorIndex = props.modelValue.length % colorPresets.length;
  const newTagObj = createEmptyTag({
    text: suggestion,
    color: colorPresets[colorIndex].value
  });

  emit('update:modelValue', [...props.modelValue, newTagObj]);
}
</script>

<style scoped>
.tags-input-container {
  width: 100%;
}

.helper-text {
  margin-top: -8px;
  padding-left: 12px;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.tag-chip {
  font-weight: 500;
}

/* Fix close button positioning within chips */
.tag-chip :deep(.v-chip__close) {
  margin-inline-start: 6px;
  margin-inline-end: 0;
}

.color-picker-btn {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.color-picker-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.color-picker-card {
  min-width: 220px;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.color-preset-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.color-preset-btn:hover {
  transform: scale(1.1);
}

.color-preset-btn.active {
  border-color: #333;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #333;
}

.empty-tags {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 8px;
}

.validation-error {
  color: #c8102e;
  display: flex;
  align-items: center;
}

.suggestions-section {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  background: #c8102e10;
  border-color: #c8102e;
  color: #c8102e;
}
</style>
