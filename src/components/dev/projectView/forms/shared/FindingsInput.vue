/**
 * src/components/dev/projectView/forms/shared/FindingsInput.vue
 *
 * Findings/achievements entry component with color picker.
 * Manages an array of findings with stat, description, and color.
 * Uses consistent color picker pattern with presets and custom hex input.
 */

<template>
  <div class="findings-input-container">
    <!-- Findings List -->
    <div class="findings-list">
      <div
        v-for="(finding, index) in normalizedFindings"
        :key="finding.id"
        class="finding-item"
        :style="{ borderLeftColor: finding.color }"
      >
        <div class="finding-header">
          <div class="finding-index">
            <span>{{ headerLabel }} {{ index + 1 }}</span>
          </div>
          <v-btn
            v-if="modelValue.length > minItems"
            icon
            variant="text"
            size="small"
            color="error"
            @click="removeFinding(index)"
          >
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="finding-fields">
          <v-row>
            <!-- Statistic -->
            <v-col cols="12" sm="4">
              <v-text-field
                :model-value="finding.stat"
                @update:model-value="updateFinding(index, 'stat', $event)"
                :label="$t('Statistic') + ' *'"
                :placeholder="$t('e.g., 350%, 7+, RBAC')"
                variant="outlined"
                density="comfortable"
                :counter="50"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="#666">mdi-pound</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Description -->
            <v-col cols="12" sm="5">
              <v-text-field
                :model-value="finding.description"
                @update:model-value="updateFinding(index, 'description', $event)"
                :label="$t('Description') + ' *'"
                :placeholder="$t('Brief explanation')"
                variant="outlined"
                density="comfortable"
                :counter="200"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="#666">mdi-text</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Color Picker -->
            <v-col cols="12" sm="3">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="finding.color"
                    :label="$t('Color')"
                    variant="outlined"
                    density="compact"
                    readonly
                  >
                    <template v-slot:prepend-inner>
                      <div
                        class="color-swatch"
                        :style="{ backgroundColor: finding.color }"
                      ></div>
                    </template>
                    <template v-slot:append-inner>
                      <v-icon size="18">mdi-chevron-down</v-icon>
                    </template>
                  </v-text-field>
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
                        :class="{ active: finding.color === preset.value }"
                        :style="{ backgroundColor: preset.value }"
                        :title="preset.name"
                        @click="updateFinding(index, 'color', preset.value)"
                      >
                        <v-icon v-if="finding.color === preset.value" size="16" color="white">
                          mdi-check
                        </v-icon>
                      </button>
                    </div>
                    <v-text-field
                      :model-value="finding.color"
                      @update:model-value="updateFinding(index, 'color', $event)"
                      label="Custom hex"
                      variant="outlined"
                      density="compact"
                      class="mt-3"
                      placeholder="#000000"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <!-- Add Button -->
    <v-btn
      v-if="modelValue.length < maxItems"
      variant="outlined"
      color="#c8102e"
      class="add-finding-btn mt-3"
      @click="addFinding"
    >
      <v-icon start>mdi-plus</v-icon>
      {{ $t('Add') }} {{ headerLabel }}
    </v-btn>

    <!-- Max Items Notice -->
    <p v-else class="text-caption text-medium-emphasis mt-2">
      <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>
      {{ $t('Maximum') }} {{ maxItems }} {{ headerLabel.toLowerCase() }}s {{ $t('allowed') }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FINDING_COLOR_PRESETS, createEmptyFinding } from '../../types/projectTypes.js';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  headerLabel: {
    type: String,
    default: 'Finding'
  },
  minItems: {
    type: Number,
    default: 1
  },
  maxItems: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['update:modelValue']);

const colorPresets = FINDING_COLOR_PRESETS;
const defaultColor = FINDING_COLOR_PRESETS[0].value;

// Ensure all findings have a valid color (fallback to first preset if missing)
const normalizedFindings = computed(() => {
  return props.modelValue.map((finding, index) => {
    if (finding.color) {
      return finding;
    }
    // Assign cycling color if missing
    const colorIndex = index % colorPresets.length;
    return {
      ...finding,
      color: colorPresets[colorIndex].value
    };
  });
});

// Get the actual color for a finding (with fallback)
function getFindingColor(index) {
  return normalizedFindings.value[index]?.color || defaultColor;
}

// Update a single finding field
function updateFinding(index, field, value) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:modelValue', updated);
}

// Add a new finding
function addFinding() {
  if (props.modelValue.length >= props.maxItems) return;

  // Cycle through preset colors
  const colorIndex = props.modelValue.length % colorPresets.length;
  const newFinding = createEmptyFinding({ color: colorPresets[colorIndex].value });
  emit('update:modelValue', [...props.modelValue, newFinding]);
}

// Remove a finding
function removeFinding(index) {
  if (props.modelValue.length <= props.minItems) return;
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
}
</script>

<style scoped>
.findings-input-container {
  width: 100%;
}

.findings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.finding-item {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #e8e8e8;
  transition: border-color 0.2s ease;
}

.finding-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.finding-index {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.finding-fields {
  margin: 0 -8px;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
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

.add-finding-btn {
  text-transform: none;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 600px) {
  .finding-item {
    padding: 12px;
  }
}
</style>
