/**
 * src/components/dev/projectView/forms/shared/MilestonesInput.vue
 *
 * Timeline milestones entry component with title, description, and color.
 * Used for Development template timeline display.
 */

<template>
  <div class="milestones-input-container">
    <!-- Milestones List -->
    <div v-if="modelValue.length > 0" class="milestones-list">
      <div
        v-for="(milestone, index) in modelValue"
        :key="milestone.id"
        class="milestone-item"
      >
        <div class="milestone-marker" :style="{ backgroundColor: milestone.color }">
          {{ index + 1 }}
        </div>

        <div class="milestone-fields">
          <v-row dense>
            <!-- Title -->
            <v-col cols="12" sm="5">
              <v-text-field
                :model-value="milestone.title"
                @update:model-value="updateMilestone(index, 'title', $event)"
                :label="$t('Milestone Title') + ' *'"
                :placeholder="$t('e.g., JWT Authentication')"
                variant="outlined"
                density="compact"
                :counter="100"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="18" color="#666">mdi-flag-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Description -->
            <v-col cols="12" sm="5">
              <v-text-field
                :model-value="milestone.description"
                @update:model-value="updateMilestone(index, 'description', $event)"
                :label="$t('Description') + ' *'"
                :placeholder="$t('Brief description')"
                variant="outlined"
                density="compact"
                :counter="200"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="18" color="#666">mdi-text</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Color -->
            <v-col cols="12" sm="2">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="milestone.color"
                    :label="$t('Color')"
                    variant="outlined"
                    density="compact"
                    readonly
                    hide-details
                  >
                    <template v-slot:prepend-inner>
                      <div 
                        class="color-dot" 
                        :style="{ backgroundColor: milestone.color }"
                      ></div>
                    </template>
                  </v-text-field>
                </template>
                <v-card class="color-picker-card">
                  <v-card-text class="pa-3">
                    <div class="color-presets">
                      <button
                        v-for="preset in colorPresets"
                        :key="preset.value"
                        type="button"
                        class="color-preset-btn"
                        :class="{ active: milestone.color === preset.value }"
                        :style="{ backgroundColor: preset.value }"
                        :title="preset.name"
                        @click="updateMilestone(index, 'color', preset.value)"
                      >
                        <v-icon v-if="milestone.color === preset.value" size="14" color="white">
                          mdi-check
                        </v-icon>
                      </button>
                    </div>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </div>

        <v-btn
          icon
          variant="text"
          size="small"
          color="error"
          class="remove-btn"
          @click="removeMilestone(index)"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Reorder hint -->
      <p class="text-caption text-medium-emphasis mt-2">
        <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>
        {{ $t('Milestones will display in the order shown above') }}
      </p>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <v-icon size="32" color="#ccc" class="mb-2">mdi-timeline-outline</v-icon>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('No milestones added yet') }}</p>
      <p class="text-caption text-medium-emphasis">{{ $t('Add milestones to show your project timeline') }}</p>
    </div>

    <!-- Add Button -->
    <v-btn
      v-if="modelValue.length < maxMilestones"
      variant="outlined"
      color="#c8102e"
      class="add-milestone-btn mt-3"
      @click="addMilestone"
    >
      <v-icon start>mdi-plus</v-icon>
      {{ $t('Add Milestone') }}
    </v-btn>
  </div>
</template>

<script setup>
import { MILESTONE_COLOR_PRESETS, createEmptyMilestone } from '../../types/projectTypes.js';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  maxMilestones: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['update:modelValue']);

const colorPresets = MILESTONE_COLOR_PRESETS;

// Update a single milestone field
function updateMilestone(index, field, value) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:modelValue', updated);
}

// Add a new milestone
function addMilestone() {
  if (props.modelValue.length >= props.maxMilestones) return;
  
  // Cycle through preset colors
  const colorIndex = props.modelValue.length % colorPresets.length;
  const newMilestone = createEmptyMilestone({ color: colorPresets[colorIndex].value });
  
  emit('update:modelValue', [...props.modelValue, newMilestone]);
}

// Remove a milestone
function removeMilestone(index) {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
}
</script>

<style scoped>
.milestones-input-container {
  width: 100%;
}

.milestones-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.milestone-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
}

.milestone-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 4px;
}

.milestone-fields {
  flex: 1;
  min-width: 0;
}

.remove-btn {
  flex-shrink: 0;
  margin-top: 4px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.color-picker-card {
  min-width: 200px;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.color-preset-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
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
  border-color: white;
  box-shadow: 0 0 0 2px #333;
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

.add-milestone-btn {
  text-transform: none;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 600px) {
  .milestone-item {
    flex-wrap: wrap;
    position: relative;
    padding-right: 40px;
  }

  .milestone-fields {
    width: 100%;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>