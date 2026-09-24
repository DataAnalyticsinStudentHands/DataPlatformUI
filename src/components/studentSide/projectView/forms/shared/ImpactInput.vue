/**
 * src/components/studentSide/projectView/forms/shared/ImpactInput.vue
 *
 * Impact items entry component with MDI icon picker, label, and description.
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
        <!-- Icon Selector -->
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <button
              type="button"
              v-bind="props"
              class="icon-selector"
            >
              <v-icon size="24" class="text-high-emphasis">{{ resolveIcon(item.icon) }}</v-icon>
              <v-icon size="12" class="edit-icon">mdi-pencil</v-icon>
            </button>
          </template>
          <v-card class="icon-picker-card">
            <v-card-text class="pa-3">
              <p class="text-caption font-weight-medium mb-2">{{ $t('Select Icon') }}</p>
              <div class="icon-grid">
                <button
                  v-for="iconName in iconPresets"
                  :key="iconName"
                  type="button"
                  class="icon-btn"
                  :class="{ active: item.icon === iconName }"
                  @click="updateItem(index, 'icon', iconName)"
                >
                  <v-icon size="20">{{ iconName }}</v-icon>
                </button>
              </div>
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
                :counter="50"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" class="text-medium-emphasis">mdi-label-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Description -->
            <v-col cols="12" sm="8">
              <v-text-field
                :model-value="item.text"
                @update:model-value="updateItem(index, 'text', $event)"
                :label="$t('Description') + ' *'"
                :placeholder="$t('Describe the impact')"
                variant="outlined"
                :counter="200"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" class="text-medium-emphasis">mdi-text</v-icon>
                </template>
              </v-text-field>
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
      <v-icon size="32" class="mb-2 text-disabled">mdi-lightning-bolt-outline</v-icon>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('No impact items added yet') }}</p>
    </div>

    <!-- Add Button -->
    <v-btn
      v-if="modelValue.length < maxItems"
      variant="outlined"
      color="brand-fg"
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

const iconPresets = IMPACT_ICON_PRESETS;
const DEFAULT_ICON = 'mdi-target';

// Resolve icon - fallback to default if empty or not an MDI icon
function resolveIcon(icon) {
  return icon && icon.startsWith('mdi-') ? icon : DEFAULT_ICON;
}

// Update a single item field
function updateItem(index, field, value) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:modelValue', updated);
}

// Add a new impact item
function addItem() {
  if (props.modelValue.length >= props.maxItems) return;
  
  // Cycle through icon presets
  const iconIndex = props.modelValue.length % iconPresets.length;
  const newItem = createEmptyImpactItem({ icon: iconPresets[iconIndex] });
  
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
  background: rgb(var(--v-theme-panel));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  padding: 12px;
}

.icon-selector {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.icon-selector:hover {
  border-color: rgb(var(--v-theme-brand-fg));
  background: rgb(var(--v-theme-tint-error-hover));
}

.edit-icon {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 50%;
  padding: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.icon-selector:hover .edit-icon {
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

.icon-picker-card {
  min-width: 280px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.icon-btn:hover {
  background: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

.icon-btn.active {
  background: rgba(var(--v-theme-primary), .08);
  border-color: rgb(var(--v-theme-brand-fg));
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: rgb(var(--v-theme-panel));
  border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
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