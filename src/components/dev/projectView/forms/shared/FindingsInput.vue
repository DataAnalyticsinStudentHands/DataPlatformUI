/**
 * src/components/dev/projectView/forms/shared/FindingsInput.vue
 *
 * Findings/achievements entry component with variant color selection.
 * Manages an array of findings with stat, description, and color variant.
 */

<template>
  <div class="findings-input-container">
    <!-- Findings List -->
    <div class="findings-list">
      <div
        v-for="(finding, index) in modelValue"
        :key="finding.id"
        class="finding-item"
        :class="getVariantClass(finding.variant)"
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

            <!-- Variant Selection -->
            <v-col cols="12" sm="3">
              <v-select
                :model-value="finding.variant"
                @update:model-value="updateFinding(index, 'variant', $event)"
                :items="variantOptions"
                item-title="label"
                item-value="value"
                :label="$t('Color')"
                variant="outlined"
                density="comfortable"
              >
                <template v-slot:prepend-inner>
                  <div 
                    class="variant-dot" 
                    :style="{ backgroundColor: getVariantColor(finding.variant) }"
                  ></div>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <div 
                        class="variant-dot mr-3" 
                        :style="{ backgroundColor: getVariantColor(item.value) }"
                      ></div>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
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
import { FINDING_VARIANTS, createEmptyFinding } from '../../types/projectTypes.js';

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
  },
  defaultVariants: {
    type: Array,
    default: () => ['critical', 'data', 'warning']
  }
});

const emit = defineEmits(['update:modelValue']);

// Variant options for dropdown
const variantOptions = [
  { label: 'Red (Critical)', value: FINDING_VARIANTS.CRITICAL },
  { label: 'Blue (Data)', value: FINDING_VARIANTS.DATA },
  { label: 'Yellow (Warning)', value: FINDING_VARIANTS.WARNING },
  { label: 'Green (Success)', value: FINDING_VARIANTS.SUCCESS },
  { label: 'Purple (Technical)', value: FINDING_VARIANTS.PURPLE }
];

// Variant colors for display
const variantColors = {
  [FINDING_VARIANTS.CRITICAL]: '#b91c1c',
  [FINDING_VARIANTS.DATA]: '#1d4ed8',
  [FINDING_VARIANTS.WARNING]: '#b45309',
  [FINDING_VARIANTS.SUCCESS]: '#16a34a',
  [FINDING_VARIANTS.PURPLE]: '#7c3aed'
};

// Get variant color
function getVariantColor(variant) {
  return variantColors[variant] || variantColors[FINDING_VARIANTS.DATA];
}

// Get variant CSS class
function getVariantClass(variant) {
  return `variant-${variant}`;
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
  
  // Use default variant based on position
  const variantIndex = props.modelValue.length % props.defaultVariants.length;
  const variant = props.defaultVariants[variantIndex];
  
  const newFinding = createEmptyFinding({ variant });
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

/* Variant border colors */
.finding-item.variant-critical {
  border-left-color: #b91c1c;
}

.finding-item.variant-data {
  border-left-color: #1d4ed8;
}

.finding-item.variant-warning {
  border-left-color: #b45309;
}

.finding-item.variant-success {
  border-left-color: #16a34a;
}

.finding-item.variant-purple {
  border-left-color: #7c3aed;
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

.variant-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
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