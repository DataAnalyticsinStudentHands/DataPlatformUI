/**
 * src/components/studentSide/projectView/SectionConfigurator.vue
 *
 * Section configuration component for project creation.
 * Allows users to select which optional sections to include in their project.
 * Replaces the old template selector with a more flexible approach.
 */

<template>
  <div class="section-configurator">
    <!-- Header -->
    <div class="configurator-header">
      <h2 class="configurator-title">{{ $t('Configure Your Project Page') }}</h2>
      <p class="configurator-subtitle">
        {{ $t('Choose which sections to include. You can add or remove sections later while editing.') }}
      </p>
    </div>

    <!-- Two Column Layout -->
    <div class="configurator-content">
      <!-- Left: Section Selection -->
      <div class="sections-panel">
        <!-- Mandatory Sections -->
        <div class="section-group">
          <div class="group-header">
            <v-icon size="18" color="complete-fg" class="mr-2">mdi-check-circle</v-icon>
            <span class="group-title">{{ $t('Default Sections') }}</span>
          </div>
          <div class="section-list mandatory">
            <div
              v-for="section in mandatorySections"
              :key="section.id"
              class="section-item mandatory"
            >
              <div class="section-icon">
                <v-icon size="20" color="complete-fg">{{ section.icon }}</v-icon>
              </div>
              <div class="section-info">
                <span class="section-name">{{ section.name }}</span>
                <span class="section-desc">{{ section.description }}</span>
              </div>
              <v-icon size="18" color="complete-fg" class="check-icon">mdi-check</v-icon>
            </div>
          </div>
        </div>

        <!-- Optional Sections -->
        <div class="section-group">
          <div class="group-header">
            <v-icon size="18" color="brand-fg" class="mr-2">mdi-plus-circle-outline</v-icon>
            <span class="group-title">{{ $t('Add Optional Sections') }}</span>
          </div>
          <div class="section-list optional">
            <div
              v-for="section in optionalSections"
              :key="section.id"
              class="section-item optional"
              :class="{ 'selected': isSelected(section.id) }"
              @click="toggleSection(section.id)"
            >
              <div class="section-checkbox">
                <v-checkbox
                  :model-value="isSelected(section.id)"
                  hide-details
                  density="compact"
                  color="brand-fg"
                  @click.stop
                  @update:model-value="toggleSection(section.id)"
                />
              </div>
              <div class="section-icon" :class="{ 'active': isSelected(section.id) }">
                <v-icon size="20" :color="isSelected(section.id) ? 'brand-fg' : 'muted-strong'">
                  {{ section.icon }}
                </v-icon>
              </div>
              <div class="section-info">
                <span class="section-name">{{ section.name }}</span>
                <span class="section-desc">{{ section.description }}</span>
              </div>
              <v-chip
                v-if="isRecommended(section.id)"
                size="x-small"
                color="brand-fg"
                variant="tonal"
                class="recommended-badge"
              >
                {{ $t('Recommended') }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <v-btn
            variant="text"
            size="small"
            class="text-medium-emphasis"
            @click="selectAll"
          >
            <v-icon start size="16">mdi-checkbox-multiple-marked</v-icon>
            {{ $t('Select All') }}
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            class="text-medium-emphasis"
            @click="clearAll"
          >
            <v-icon start size="16">mdi-checkbox-multiple-blank-outline</v-icon>
            {{ $t('Clear All') }}
          </v-btn>
        </div>
      </div>

      <!-- Right: Layout Preview -->
      <div class="preview-panel">
        <div class="preview-header">
          <v-icon size="18" color="brand-fg" class="mr-2">mdi-eye-outline</v-icon>
          <span class="preview-title">{{ $t('Layout Preview') }}</span>
        </div>
        <div class="preview-container">
          <div class="layout-preview">
            <!-- Hero Zone -->
            <div class="preview-zone hero-zone">
              <div class="zone-label">{{ $t('Header') }}</div>
              <div class="preview-block hero-row">
                <!-- Project Overview (Title, Description, Label) - Left -->
                <div class="hero-left">
                  <div class="overview-label"></div>
                  <div class="block-lines">
                    <div class="line title w-70"></div>
                    <div class="line desc w-100"></div>
                    <div class="line desc w-80"></div>
                  </div>
                </div>

                <!-- Author(s) - Right -->
                <div class="hero-right">
                  <div class="block-avatar"></div>
                  <div class="block-lines">
                    <div class="line w-60"></div>
                    <div class="line w-40"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Grid -->
            <div class="preview-grid" :class="{ 'no-poster': !isPosterEnabled }">
              <!-- Sidebar -->
              <div class="preview-zone sidebar-zone">
                <div class="zone-label">{{ $t('Info Cards') }}</div>

                <!-- Tags (always) -->
                <div class="preview-block small">
                  <div class="block-title">Tags</div>
                </div>

                <!-- Optional sections in order -->
                <template v-for="section in enabledSidebarSections" :key="section.id">
                  <div class="preview-block small optional-block">
                    <div class="block-title">{{ section.name }}</div>
                    <v-icon size="12" class="optional-icon">mdi-plus</v-icon>
                  </div>
                </template>
              </div>

              <!-- Main (only show when poster is enabled) -->
              <div v-if="isPosterEnabled" class="preview-zone main-zone">
                <div class="zone-label">{{ $t('Main Content') }}</div>
                <div class="preview-block poster enabled">
                  <div class="block-title">{{ $t('Poster / Diagram') }}</div>
                  <v-icon size="24" color="brand-fg">mdi-file-document-outline</v-icon>
                </div>
              </div>
            </div>

            <!-- Footer Zone -->
            <div class="preview-zone footer-zone">
              <div class="zone-label">{{ $t('Footer') }}</div>
              <div class="preview-block footer">
                <div class="line w-80"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selection Summary -->
        <div class="selection-summary">
          <v-icon size="16" class="mr-2 text-medium-emphasis">mdi-information-outline</v-icon>
          <span>
            {{ selectedCount }} {{ $t('optional section(s) selected') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Help Text -->
    <div class="configurator-help">
      <v-icon size="18" class="mr-2 text-medium-emphasis">mdi-lightbulb-outline</v-icon>
      <span>
        {{ $t("Don't worry about getting it perfect now. You can add or remove sections at any time while editing your project.") }}
      </span>
    </div>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="450">
      <v-card>
        <v-card-title class="text-h6">
          {{ $t('Remove Section?') }}
        </v-card-title>
        <v-card-text>
          {{ confirmDialogMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="cancelAction">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn color="primary" variant="flat" @click="confirmAction">
            {{ $t('Remove') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
  getMandatorySections,
  getOptionalSections,
  RECOMMENDED_SECTIONS,
  ZONES
} from './types/sectionTypes.js';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  sectionsWithData: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

// Get section lists
const mandatorySections = computed(() =>
  getMandatorySections().filter(s => !s.autoGenerated)
);

const optionalSections = computed(() => getOptionalSections());

// Selected sections management
const selectedSections = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const selectedCount = computed(() => selectedSections.value.length);

// Check if a section is selected
function isSelected(sectionId) {
  return selectedSections.value.includes(sectionId);
}

// Check if a section is recommended
function isRecommended(sectionId) {
  return RECOMMENDED_SECTIONS.includes(sectionId);
}

// Confirmation dialog state
const showConfirmDialog = ref(false);
const pendingAction = ref(null);

function hasData(sectionId) {
  return props.sectionsWithData.includes(sectionId);
}

const confirmDialogMessage = computed(() => {
  if (!pendingAction.value) return '';
  if (pendingAction.value.type === 'toggle') {
    const section = optionalSections.value.find(s => s.id === pendingAction.value.sectionId);
    const name = section ? section.name : pendingAction.value.sectionId;
    return `The "${name}" section contains data you have entered. Removing it will hide this section, but your data will be preserved if you re-enable it later.`;
  }
  const names = pendingAction.value.sectionIds
    .map(id => optionalSections.value.find(s => s.id === id)?.name || id);
  return `The following sections contain data you have entered: ${names.join(', ')}. Removing them will hide these sections, but your data will be preserved if you re-enable them later.`;
});

// Toggle a section
function toggleSection(sectionId) {
  const current = [...selectedSections.value];
  const index = current.indexOf(sectionId);

  if (index >= 0) {
    if (hasData(sectionId)) {
      pendingAction.value = { type: 'toggle', sectionId };
      showConfirmDialog.value = true;
      return;
    }
    current.splice(index, 1);
  } else {
    current.push(sectionId);
  }

  selectedSections.value = current;
}

// Select all optional sections
function selectAll() {
  selectedSections.value = optionalSections.value.map(s => s.id);
}

// Clear all optional sections
function clearAll() {
  const sectionsToRemove = selectedSections.value.filter(id => hasData(id));
  if (sectionsToRemove.length > 0) {
    pendingAction.value = { type: 'clearAll', sectionIds: sectionsToRemove };
    showConfirmDialog.value = true;
    return;
  }
  selectedSections.value = [];
}

function confirmAction() {
  if (!pendingAction.value) return;

  if (pendingAction.value.type === 'toggle') {
    const current = [...selectedSections.value];
    const index = current.indexOf(pendingAction.value.sectionId);
    if (index >= 0) current.splice(index, 1);
    selectedSections.value = current;
  } else if (pendingAction.value.type === 'clearAll') {
    selectedSections.value = [];
  }

  showConfirmDialog.value = false;
  pendingAction.value = null;
}

function cancelAction() {
  showConfirmDialog.value = false;
  pendingAction.value = null;
}

// Get enabled sidebar sections for preview
const enabledSidebarSections = computed(() => {
  return optionalSections.value
    .filter(s => s.zone === ZONES.SIDEBAR && isSelected(s.id))
    .sort((a, b) => a.order - b.order);
});

// Check if poster is enabled
const isPosterEnabled = computed(() => isSelected('poster'));
</script>

<style scoped>
.section-configurator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.configurator-header {
  text-align: center;
  margin-bottom: 32px;
}

.configurator-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  margin-bottom: 8px;
}

.configurator-subtitle {
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  max-width: 500px;
  margin: 0 auto;
}

.configurator-content {
  display: grid;
  grid-template-columns: 1fr 560px;
  gap: 24px;
  margin-bottom: 24px;
}

/* Sections Panel */
.sections-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-group {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  padding: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.group-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.section-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgb(var(--v-theme-panel-cool-soft));
  transition: all 0.2s ease;
}

.section-item.mandatory {
  background: rgb(var(--v-theme-tint-success-soft));
  border: 1px solid rgb(var(--v-theme-success-soft-border));
}

.section-item.optional {
  cursor: pointer;
  border: 1px solid transparent;
}

.section-item.optional:hover {
  background: rgb(var(--v-theme-tint-info-hover));
  border-color: rgba(var(--v-theme-primary), .19);
}

.section-item.optional.selected {
  background: rgb(var(--v-theme-tint-error-soft));
  border-color: rgba(var(--v-theme-primary), .31);
}

.section-checkbox {
  margin-right: 8px;
  margin-left: -8px;
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.section-icon.active {
  background: rgb(var(--v-theme-tint-error-soft));
}

.section-info {
  flex: 1;
  min-width: 0;
}

.section-name {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  margin-bottom: 2px;
}

.section-desc {
  display: block;
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  margin-left: 8px;
}

.recommended-badge {
  margin-left: 8px;
  flex-shrink: 0;
}

.quick-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}

/* Preview Panel */
.preview-panel {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.preview-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.preview-container {
  flex: 1;
  background: rgb(var(--v-theme-panel-preview));
  border-radius: 8px;
  padding: 24px;
  overflow: hidden;
}

.layout-preview {
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.preview-zone {
  margin-bottom: 12px;
}

.preview-zone:last-child {
  margin-bottom: 0;
}

.zone-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.preview-block {
  background: rgb(var(--v-theme-panel-strong));
  border-radius: 4px;
  padding: 8px;
  position: relative;
}

.preview-block.hero-row {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 6px;
}

.hero-left {
  flex: 1;
}

.hero-left .overview-label {
  width: 50px;
  height: 10px;
  background: #a5b4fc;
  border-radius: 2px;
  margin-bottom: 8px;
}

.hero-left .line.title {
  height: 10px;
  background: rgba(255, 255, 255, 0.9);
  margin-bottom: 6px;
}

.hero-left .line.desc {
  height: 5px;
  background: rgba(255, 255, 255, 0.4);
}

.hero-right {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 12px;
  min-width: 120px;
}

.hero-right .block-lines .line {
  background: rgba(255, 255, 255, 0.6);
}

.hero-right .block-lines .line:last-child {
  background: rgba(255, 255, 255, 0.3);
}

.block-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.block-lines {
  flex: 1;
}

.line {
  height: 8px;
  background: rgb(var(--v-theme-quiet-fill));
  border-radius: 4px;
  margin-bottom: 6px;
}

.line:last-child {
  margin-bottom: 0;
}

.line.w-30 { width: 30%; }
.line.w-40 { width: 40%; }
.line.w-50 { width: 50%; }
.line.w-60 { width: 60%; }
.line.w-70 { width: 70%; }
.line.w-80 { width: 80%; }
.line.w-100 { width: 100%; }

.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.preview-grid.no-poster {
  grid-template-columns: 1fr;
}

.sidebar-zone {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-block.small {
  padding: 8px 10px;
}

.preview-block.medium {
  padding: 14px 10px;
}

.block-title {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.optional-block {
  background: rgb(var(--v-theme-tint-error-soft));
  border: 1px dashed rgb(var(--v-theme-error-soft-border));
}

.optional-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: rgb(var(--v-theme-brand-fg));
}

.preview-block.poster {
  height: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.preview-block.poster.enabled {
  background: linear-gradient(135deg, rgb(var(--v-theme-tint-error-soft)) 0%, rgb(var(--v-theme-tint-error-strong)) 100%);
  border: 1px solid rgb(var(--v-theme-error-soft-border));
}

.preview-block.poster.disabled {
  background: rgb(var(--v-theme-panel-soft));
  border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
}

.preview-block.footer {
  padding: 8px;
}

.selection-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

/* Help Text */
.configurator-help {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: rgb(var(--v-theme-tint-warning-soft));
  border: 1px solid rgb(var(--v-theme-warning-soft-border));
  border-radius: 8px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1024px) {
  .configurator-content {
    grid-template-columns: 1fr;
  }

  .preview-panel {
    order: -1;
  }
}

@media (max-width: 600px) {
  .section-configurator {
    padding: 16px;
  }

  .configurator-title {
    font-size: 1.5rem;
  }

  .section-item {
    padding: 10px 12px;
  }

  .section-desc {
    display: none;
  }
}
</style>
