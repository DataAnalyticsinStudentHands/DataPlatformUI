/**
 * src/components/studentSide/projectView/forms/shared/PartnersInput.vue
 *
 * Partners entry component with acronym, full name, and color picker.
 * Supports adding/removing partner organizations.
 */

<template>
  <div class="partners-input-container">
    <!-- Partners List -->
    <div v-if="modelValue.length > 0" class="partners-list">
      <div
        v-for="(partner, index) in modelValue"
        :key="partner.id"
        class="partner-item"
      >
        <div class="partner-fields">
          <v-row dense>
            <!-- Acronym -->
            <v-col cols="12" sm="3">
              <v-text-field
                :model-value="partner.acronym"
                @update:model-value="updatePartner(index, 'acronym', $event)"
                :label="$t('Acronym') + ' *'"
                :placeholder="$t('e.g., EPA')"
                variant="outlined"
                :counter="20"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="#666">mdi-alphabetical</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Full Name -->
            <v-col cols="12" sm="6">
              <v-text-field
                :model-value="partner.name"
                @update:model-value="updatePartner(index, 'name', $event)"
                :label="$t('Organization Name') + ' *'"
                :placeholder="$t('Full organization name')"
                variant="outlined"
                :counter="150"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="#666">mdi-office-building-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- Color Picker -->
            <v-col cols="12" sm="3">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="partner.color"
                    :label="$t('Color')"
                    variant="outlined"
                    readonly
                  >
                    <template v-slot:prepend-inner>
                      <div
                        class="color-swatch"
                        :style="{ backgroundColor: partner.color }"
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
                        :class="{ active: partner.color === preset.value }"
                        :style="{ backgroundColor: preset.value }"
                        :title="preset.name"
                        @click="updatePartner(index, 'color', preset.value)"
                      >
                        <v-icon v-if="partner.color === preset.value" size="16" color="white">
                          mdi-check
                        </v-icon>
                      </button>
                    </div>
                    <v-text-field
                      :model-value="partner.color"
                      @update:model-value="updatePartner(index, 'color', $event)"
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

        <v-btn
          icon
          variant="text"
          size="small"
          color="error"
          class="remove-btn"
          @click="removePartner(index)"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <v-icon size="32" color="#ccc" class="mb-2">mdi-office-building-outline</v-icon>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ $t('No partners added yet') }}</p>
    </div>

    <!-- Add Button -->
    <v-btn
      v-if="modelValue.length < maxPartners"
      variant="outlined"
      color="#c8102e"
      class="add-partner-btn mt-3"
      @click="addPartner"
    >
      <v-icon start>mdi-plus</v-icon>
      {{ $t('Add Partner') }}
    </v-btn>

  </div>
</template>

<script setup>
import { PARTNER_COLOR_PRESETS, createEmptyPartner } from '../../types/projectTypes.js';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  maxPartners: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['update:modelValue']);

const colorPresets = PARTNER_COLOR_PRESETS;

// Update a single partner field
function updatePartner(index, field, value) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:modelValue', updated);
}

// Add a new partner
function addPartner() {
  if (props.modelValue.length >= props.maxPartners) return;

  // Cycle through preset colors
  const colorIndex = props.modelValue.length % colorPresets.length;
  const newPartner = createEmptyPartner({ color: colorPresets[colorIndex].value });

  emit('update:modelValue', [...props.modelValue, newPartner]);
}

// Remove a partner
function removePartner(index) {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
}
</script>

<style scoped>
.partners-input-container {
  width: 100%;
}

.partners-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.partner-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
}

.partner-fields {
  flex: 1;
  min-width: 0;
}

.remove-btn {
  flex-shrink: 0;
  margin-top: 4px;
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

.add-partner-btn {
  text-transform: none;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 600px) {
  .partner-item {
    flex-wrap: wrap;
  }

  .partner-fields {
    width: 100%;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .partner-item {
    position: relative;
    padding-right: 40px;
  }
}
</style>