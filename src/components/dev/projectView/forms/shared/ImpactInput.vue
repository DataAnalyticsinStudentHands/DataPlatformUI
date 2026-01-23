/**
 * src/components/dev/projectView/forms/shared/ImpactInput.vue
 *
 * Impact items entry component with emoji picker, label, and description.
 * Used for Development template impact grid display.
 */

<template>
  <div class="impact-input-container">
    <!-- Impact Items List -->
    <div v-if="modelValue.length > 0" class="impact-list">
      <div
        v-for="(item, index) in modelValue"
        :key="item.id"
        class="impact-item"
      >
        <!-- Emoji Selector -->
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <button 
              type="button"
              v-bind="props" 
              class="emoji-selector"
            >
              <span class="emoji-display">{{ item.icon }}</span>
              <v-icon size="12" class="edit-icon">mdi-pencil</v-icon>
            </button>
          </template>
          <v-card class="emoji-picker-card">
            <v-card-text class="pa-3">
              <p class="text-caption font-weight-medium mb-2">{{ $t('Select Icon') }}</p>
              <div class="emoji-grid">
                <button
                  v-for="emoji in emojiPresets"
                  :key="emoji"
                  type="button"
                  class="emoji-btn"
                  :class="{ active: item.icon === emoji }"
                  @click="updateItem(index, 'icon', emoji)"
                >
                  {{ emoji }}
                </button>
              </div>
              <v-text-field
                :model-value="item.icon"
                @update:model-value="updateItem(index, 'icon', $event)"
                :label="$t('Custom emoji')"
                variant="outlined"
                density="compact"
                class="mt-3"
                :counter="10"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- Fields -->
        <div class="impact-fields">
          <v-row dense>
            <!-- Label -->
            <v-col cols="12" sm="4">
              <v-text-field
                :model-value="item.label"
                @update:model-value="updateItem(index, 'label', $event)"
                :label="$t('Label') + ' *'"
                :placeholder="$t('e.g., For Students')"
                variant="outlined"
                density="compact"
                :counter="50"
              ></v-text-field>
            </v-col>

            <!-- Description -->
            <v-col cols="12" sm="8">
              <v-text-field
                :model-value="item.text"
                @update:model-value="updateItem(index, 'text', $event)"
                :label="$t('Description') + ' *'"
                :placeholder="$t('Describe the impact')"
                variant="outlined"
                density="compact"
                :counter="200"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <v-btn
          v-if="modelValue.length > minItems"
          icon
          variant="text"
          size="small"
          color="error"
          class="remove-btn"
          @click="removeItem(index)"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <v-icon size="32" color="#ccc" class="mb-2">mdi-lightning-bolt-outline</v-icon>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('No impact items added yet') }}</p>
    </div>

    <!-- Add Button -->
    <v-btn
      v-if="modelValue.length < maxItems"
      variant="outlined"
      color="#c8102e"
      class="add-impact-btn mt-3"
      @click="addItem"
    >
      <v-icon start>mdi-plus</v-icon>
      {{ $t('Add Impact Item') }}
    </v-btn>
  </div>
</template>

<script setup>
import { IMPACT_ICON_PRESETS, createEmptyImpactItem } from '../../types/projectTypes.js';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  minItems: {
    type: Number,
    default: 1
  },
  maxItems: {
    type: Number,
    default: 6
  }
});

const emit = defineEmits(['update:modelValue']);

const emojiPresets = IMPACT_ICON_PRESETS;

// Update a single item field
function updateItem(index, field, value) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:modelValue', updated);
}

// Add a new impact item
function addItem() {
  if (props.modelValue.length >= props.maxItems) return;
  
  // Cycle through emoji presets
  const emojiIndex = props.modelValue.length % emojiPresets.length;
  const newItem = createEmptyImpactItem({ icon: emojiPresets[emojiIndex] });
  
  emit('update:modelValue', [...props.modelValue, newItem]);
}

// Remove an item
function removeItem(index) {
  if (props.modelValue.length <= props.minItems) return;
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
}
</script>

<style scoped>
.impact-input-container {
  width: 100%;
}

.impact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.impact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
}

.emoji-selector {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.emoji-selector:hover {
  border-color: #c8102e;
  background: #fff5f5;
}

.emoji-display {
  font-size: 24px;
  line-height: 1;
}

.edit-icon {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #c8102e;
  color: white;
  border-radius: 50%;
  padding: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.emoji-selector:hover .edit-icon {
  opacity: 1;
}

.impact-fields {
  flex: 1;
  min-width: 0;
}

.remove-btn {
  flex-shrink: 0;
  margin-top: 4px;
}

.emoji-picker-card {
  min-width: 260px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.emoji-btn {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.emoji-btn:hover {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.emoji-btn.active {
  background: #c8102e15;
  border-color: #c8102e;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: #fafafa;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  text-align: center;
}

.add-impact-btn {
  text-transform: none;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 600px) {
  .impact-item {
    flex-wrap: wrap;
    position: relative;
    padding-right: 40px;
  }

  .impact-fields {
    width: 100%;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>