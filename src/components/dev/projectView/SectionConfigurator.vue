/**
 * src/components/dev/projectView/SectionConfigurator.vue
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
            <v-icon size="18" color="#16a34a" class="mr-2">mdi-check-circle</v-icon>
            <span class="group-title">{{ $t('Default Sections') }}</span>
          </div>
          <div class="section-list mandatory">
            <div
              v-for="section in mandatorySections"
              :key="section.id"
              class="section-item mandatory"
            >
              <div class="section-icon">
                <v-icon size="20" color="#16a34a">{{ section.icon }}</v-icon>
              </div>
              <div class="section-info">
                <span class="section-name">{{ section.name }}</span>
                <span class="section-desc">{{ section.description }}</span>
              </div>
              <v-icon size="18" color="#16a34a" class="check-icon">mdi-check</v-icon>
            </div>
          </div>
        </div>

        <!-- Optional Sections -->
        <div class="section-group">
          <div class="group-header">
            <v-icon size="18" color="#c8102e" class="mr-2">mdi-plus-circle-outline</v-icon>
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
                  color="#c8102e"
                  @click.stop
                  @update:model-value="toggleSection(section.id)"
                />
              </div>
              <div class="section-icon" :class="{ 'active': isSelected(section.id) }">
                <v-icon size="20" :color="isSelected(section.id) ? '#c8102e' : '#666'">
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
                color="#c8102e"
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
            color="#666"
            @click="selectAll"
          >
            <v-icon start size="16">mdi-checkbox-multiple-marked</v-icon>
            {{ $t('Select All') }}
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            color="#666"
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
          <v-icon size="18" color="#c8102e" class="mr-2">mdi-eye-outline</v-icon>
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

                <!-- Findings (always) -->
                <div class="preview-block medium">
                  <div class="block-title">Key Findings</div>
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
                  <v-icon size="24" color="#c8102e">mdi-file-document-outline</v-icon>
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
          <v-icon size="16" color="#666" class="mr-2">mdi-information-outline</v-icon>
          <span>
            {{ selectedCount }} {{ $t('optional section(s) selected') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Help Text -->
    <div class="configurator-help">
      <v-icon size="18" color="#666" class="mr-2">mdi-lightbulb-outline</v-icon>
      <span>
        {{ $t("Don't worry about getting it perfect now. You can add or remove sections at any time while editing your project.") }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
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

// Toggle a section
function toggleSection(sectionId) {
  const current = [...selectedSections.value];
  const index = current.indexOf(sectionId);

  if (index >= 0) {
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
  selectedSections.value = [];
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
  color: #1a1a1a;
  margin-bottom: 8px;
}

.configurator-subtitle {
  font-size: 1rem;
  color: #666;
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
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.group-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
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
  background: #f8f9fc;
  transition: all 0.2s ease;
}

.section-item.mandatory {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.section-item.optional {
  cursor: pointer;
  border: 1px solid transparent;
}

.section-item.optional:hover {
  background: #f0f4ff;
  border-color: #c8102e30;
}

.section-item.optional.selected {
  background: #fef2f2;
  border-color: #c8102e50;
}

.section-checkbox {
  margin-right: 8px;
  margin-left: -8px;
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.section-icon.active {
  background: #fef2f2;
}

.section-info {
  flex: 1;
  min-width: 0;
}

.section-name {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.section-desc {
  display: block;
  font-size: 0.75rem;
  color: #666;
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
  background: white;
  border: 1px solid #e8e8e8;
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
  border-bottom: 1px solid #e8e8e8;
}

.preview-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.preview-container {
  flex: 1;
  background: #f4f5f7;
  border-radius: 8px;
  padding: 24px;
  overflow: hidden;
}

.layout-preview {
  background: white;
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
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.preview-block {
  background: #f5f5f5;
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
  background: #e0e0e0;
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
  color: #666;
}

.optional-block {
  background: #fef2f2;
  border: 1px dashed #fecaca;
}

.optional-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #c8102e;
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
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
}

.preview-block.poster.disabled {
  background: #f8f8f8;
  border: 1px dashed #ddd;
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
  border-top: 1px solid #e8e8e8;
  font-size: 0.8rem;
  color: #666;
}

/* Help Text */
.configurator-help {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #666;
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
