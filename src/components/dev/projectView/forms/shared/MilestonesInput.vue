/**
 * src/components/dev/projectView/forms/shared/MilestonesInput.vue
 *
 * Timeline milestones entry component with title, description, color, and date picker.
 * Supports single date or date range per milestone using Vuetify date pickers.
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
          <!-- Row 1: Title, Description, Color -->
          <v-row dense>
            <v-col cols="12" sm="5">
              <v-text-field
                :model-value="milestone.title"
                @update:model-value="updateMilestone(index, 'title', $event)"
                :label="$t('Milestone Title') + ' *'"
                :placeholder="$t('e.g., JWT Authentication')"
                variant="outlined"
                :counter="150"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="#666">mdi-flag-outline</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field
                :model-value="milestone.description"
                @update:model-value="updateMilestone(index, 'description', $event)"
                :label="$t('Description') + ' *'"
                :placeholder="$t('Brief description')"
                variant="outlined"
                :counter="200"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="#666">mdi-text</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="2">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="milestone.color"
                    :label="$t('Color')"
                    variant="outlined"
                    readonly
                    hide-details
                  >
                    <template v-slot:prepend-inner>
                      <div
                        class="color-swatch"
                        :style="{ backgroundColor: milestone.color }"
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
                        :class="{ active: milestone.color === preset.value }"
                        :style="{ backgroundColor: preset.value }"
                        :title="preset.name"
                        @click="updateMilestone(index, 'color', preset.value)"
                      >
                        <v-icon v-if="milestone.color === preset.value" size="16" color="white">
                          mdi-check
                        </v-icon>
                      </button>
                    </div>
                    <v-text-field
                      :model-value="milestone.color"
                      @update:model-value="updateMilestone(index, 'color', $event)"
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

          <!-- Row 2: Date Type Toggle -->
          <v-row dense class="mt-n1">
            <v-col cols="12" class="d-flex align-center">
              <v-btn-toggle
                :model-value="milestone.dateType || 'single'"
                @update:model-value="handleDateTypeChange(index, $event)"
                mandatory
                density="compact"
                color="#c8102e"
                variant="outlined"
                class="date-type-toggle"
              >
                <v-btn value="single" size="small">
                  <v-icon start size="14">mdi-calendar</v-icon>
                  {{ $t('Date') }}
                </v-btn>
                <v-btn value="range" size="small">
                  <v-icon start size="14">mdi-calendar-range</v-icon>
                  {{ $t('Range') }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <!-- Row 3: Date Picker(s) -->
          <v-row dense>
            <!-- Start / Single Date -->
            <v-col cols="12" :sm="(milestone.dateType || 'single') === 'range' ? 6 : 12">
              <v-menu
                :close-on-content-click="false"
                :model-value="openMenus[`${index}-start`] || false"
                @update:model-value="setMenuOpen(index, 'start', $event)"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="formatDate(milestone.dateStart)"
                    :label="(milestone.dateType || 'single') === 'range' ? $t('Start Date') : $t('Date')"
                    :placeholder="$t('Select date')"
                    variant="outlined"
                    readonly
                    hide-details
                    clearable
                    @click:clear.stop="updateMilestone(index, 'dateStart', null)"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  :model-value="parseDate(milestone.dateStart)"
                  @update:model-value="(val) => handleDateSelect(index, 'dateStart', val)"
                  color="#c8102e"
                  show-adjacent-months
                />
              </v-menu>
            </v-col>

            <!-- End Date (only for range) -->
            <v-col
              v-if="(milestone.dateType || 'single') === 'range'"
              cols="12"
              sm="6"
            >
              <v-menu
                :close-on-content-click="false"
                :model-value="openMenus[`${index}-end`] || false"
                @update:model-value="setMenuOpen(index, 'end', $event)"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="formatDate(milestone.dateEnd)"
                    :label="$t('End Date')"
                    :placeholder="$t('Select date')"
                    variant="outlined"
                    readonly
                    hide-details
                    clearable
                    @click:clear.stop="updateMilestone(index, 'dateEnd', null)"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon size="20" color="#666">mdi-calendar-arrow-right</v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  :model-value="parseDate(milestone.dateEnd)"
                  @update:model-value="(val) => handleDateSelect(index, 'dateEnd', val)"
                  color="#c8102e"
                  :min="milestone.dateStart ? parseDate(milestone.dateStart) : undefined"
                  show-adjacent-months
                />
              </v-menu>
            </v-col>
          </v-row>

          <!-- Date summary display -->
          <div v-if="milestone.dateStart" class="date-summary">
            <v-icon size="14" color="#666" class="mr-1">mdi-clock-outline</v-icon>
            <span>{{ getDateSummary(milestone) }}</span>
          </div>
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
import { reactive } from 'vue';
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
  },
  minMilestones: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue']);

const colorPresets = MILESTONE_COLOR_PRESETS;

// Track which date picker menus are open
const openMenus = reactive({});

function setMenuOpen(index, field, value) {
  openMenus[`${index}-${field}`] = value;
}

// ========================
// Date helpers
// ========================

/**
 * Parse an ISO date string (YYYY-MM-DD) into a Date object for v-date-picker
 */
function parseDate(isoString) {
  if (!isoString) return undefined;
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format an ISO date string for display (e.g., "Jan 15, 2023")
 */
function formatDate(isoString) {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Convert a Date object from v-date-picker to ISO string (YYYY-MM-DD)
 */
function dateToIso(dateValue) {
  if (!dateValue) return null;
  // v-date-picker may return Date object, array, or string depending on Vuetify version
  const d = Array.isArray(dateValue) ? dateValue[0] : dateValue;
  if (d instanceof Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  if (typeof d === 'string') return d;
  return null;
}

/**
 * Get a human-readable date summary for a milestone
 */
function getDateSummary(milestone) {
  if (!milestone.dateStart) return '';
  const start = formatDate(milestone.dateStart);
  if (milestone.dateType === 'range' && milestone.dateEnd) {
    return `${start} — ${formatDate(milestone.dateEnd)}`;
  }
  return start;
}

// ========================
// Milestone CRUD
// ========================

function updateMilestone(index, field, value) {
  const updated = [...props.modelValue];
  updated[index] = { ...updated[index], [field]: value };
  emit('update:modelValue', updated);
}

function handleDateTypeChange(index, newType) {
  if (!newType) return;
  const updated = [...props.modelValue];
  updated[index] = {
    ...updated[index],
    dateType: newType,
    // Clear end date when switching to single
    dateEnd: newType === 'single' ? null : updated[index].dateEnd
  };
  emit('update:modelValue', updated);
}

function handleDateSelect(index, field, dateValue) {
  const iso = dateToIso(dateValue);
  updateMilestone(index, field, iso);
  // Close the menu after selection
  const menuKey = field === 'dateStart' ? 'start' : 'end';
  setMenuOpen(index, menuKey, false);
}

function addMilestone() {
  if (props.modelValue.length >= props.maxMilestones) return;
  const colorIndex = props.modelValue.length % colorPresets.length;
  const newMilestone = createEmptyMilestone({ color: colorPresets[colorIndex].value });
  emit('update:modelValue', [...props.modelValue, newMilestone]);
}

function removeMilestone(index) {
  if (props.modelValue.length <= props.minMilestones) return;
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

/* Date Type Toggle */
.date-type-toggle {
  border-radius: 6px;
}

.date-type-toggle .v-btn {
  text-transform: none;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0;
}

/* Date Summary */
.date-summary {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #666;
  padding: 4px 0 0 0;
  margin-top: -4px;
}

/* Color Picker */
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

  .date-type-toggle {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>