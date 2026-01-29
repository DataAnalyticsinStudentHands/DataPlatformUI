/**
 * src/components/dev/projectView/ProjectTemplateSelector.vue
 *
 * Visual template picker component with preview cards.
 * Allows users to select between Research and Development templates.
 */

<template>
  <div class="template-selector">
    <!-- Header -->
    <div class="selector-header">
      <h2 class="selector-title">{{ $t('Choose Your Template') }}</h2>
      <p class="selector-subtitle">
        {{ $t('Select the layout that best fits your project type. You can always change this later.') }}
      </p>
    </div>

    <!-- Template Cards Grid -->
    <div class="templates-grid">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        :class="{ 
          'selected': modelValue === template.id,
          'hover-enabled': modelValue !== template.id
        }"
        @click="selectTemplate(template.id)"
      >
        <!-- Selection Indicator -->
        <div class="selection-badge" v-if="modelValue === template.id">
          <v-icon size="16" color="white">mdi-check</v-icon>
        </div>

        <!-- Template Preview Image -->
        <div class="template-preview">
          <div class="preview-placeholder" :class="template.id">
            <!-- Research Template Mini Preview -->
            <div v-if="template.id === 'research'" class="mini-preview research-mini">
              <div class="mini-header">
                <div class="mini-avatar"></div>
                <div class="mini-lines">
                  <div class="mini-line w-60"></div>
                  <div class="mini-line w-40"></div>
                </div>
              </div>
              <div class="mini-content">
                <div class="mini-sidebar">
                  <div class="mini-card"></div>
                  <div class="mini-card"></div>
                </div>
                <div class="mini-poster"></div>
              </div>
            </div>

            <!-- Development Template Mini Preview -->
            <div v-if="template.id === 'development'" class="mini-preview development-mini">
              <div class="mini-header">
                <div class="mini-avatars">
                  <div class="mini-avatar"></div>
                  <div class="mini-avatar overlap"></div>
                </div>
                <div class="mini-lines">
                  <div class="mini-line w-70"></div>
                  <div class="mini-line w-50"></div>
                </div>
              </div>
              <div class="mini-content">
                <div class="mini-sidebar">
                  <div class="mini-card small"></div>
                  <div class="mini-card small"></div>
                  <div class="mini-card small"></div>
                </div>
                <div class="mini-poster"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Template Info -->
        <div class="template-info">
          <div class="template-name-row">
            <v-icon 
              :color="modelValue === template.id ? '#c8102e' : '#666'"
              size="20"
              class="mr-2"
            >
              {{ template.id === 'research' ? 'mdi-flask-outline' : 'mdi-account-group-outline' }}
            </v-icon>
            <h3 class="template-name">{{ template.name }}</h3>
          </div>
          <p class="template-description">{{ template.description }}</p>

          <!-- Features List -->
          <div class="template-features">
            <div 
              v-for="(feature, index) in template.features" 
              :key="index"
              class="feature-item"
            >
              <v-icon size="14" color="#16a34a" class="mr-1">mdi-check-circle</v-icon>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Select Button -->
        <div class="template-action">
          <v-btn
            :color="modelValue === template.id ? '#c8102e' : '#666'"
            :variant="modelValue === template.id ? 'flat' : 'outlined'"
            block
            class="select-btn"
            @click.stop="selectTemplate(template.id)"
          >
            <v-icon start size="18">
              {{ modelValue === template.id ? 'mdi-check-circle' : 'mdi-cursor-pointer' }}
            </v-icon>
            {{ modelValue === template.id ? $t('Selected') : $t('Select Template') }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Help Text -->
    <div class="selector-help">
      <v-icon size="18" color="#666" class="mr-2">mdi-lightbulb-outline</v-icon>
      <span>
        {{ $t('Not sure which to choose?') }}
        <strong>{{ $t('Research') }}</strong> {{ $t('is ideal for individual projects with a single author.') }}
        <strong>{{ $t('Development') }}</strong> {{ $t('works best for collaborative projects with multiple contributors.') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getAllTemplates } from './types/projectTypes.js';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

// Get template information
const templates = computed(() => getAllTemplates());

// Select a template
function selectTemplate(templateId) {
  emit('update:modelValue', templateId);
  emit('select', templateId);
}
</script>

<style scoped>
.template-selector {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.selector-header {
  text-align: center;
  margin-bottom: 32px;
}

.selector-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.selector-subtitle {
  font-size: 1rem;
  color: #666;
  max-width: 500px;
  margin: 0 auto;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.template-card {
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.template-card.hover-enabled:hover {
  border-color: #c8102e50;
  box-shadow: 0 8px 24px rgba(200, 16, 46, 0.1);
  transform: translateY(-2px);
}

.template-card.selected {
  border-color: #c8102e;
  box-shadow: 0 8px 32px rgba(200, 16, 46, 0.15);
}

.selection-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: #c8102e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(200, 16, 46, 0.3);
}

.template-preview {
  background: linear-gradient(135deg, #f8f9fc 0%, #eef1f8 100%);
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.preview-placeholder {
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  overflow: hidden;
}

/* Mini Preview Styles */
.mini-preview {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.mini-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8102e 0%, #e85a4f 100%);
  flex-shrink: 0;
}

.mini-avatars {
  display: flex;
}

.mini-avatar.overlap {
  margin-left: -12px;
  background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
}

.mini-lines {
  flex: 1;
}

.mini-line {
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  margin-bottom: 6px;
}

.mini-line:last-child {
  margin-bottom: 0;
}

.mini-line.w-40 { width: 40%; }
.mini-line.w-50 { width: 50%; }
.mini-line.w-60 { width: 60%; }
.mini-line.w-70 { width: 70%; }

.mini-content {
  display: flex;
  gap: 10px;
  height: calc(100% - 60px);
}

.mini-sidebar {
  width: 35%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mini-card {
  flex: 1;
  background: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.mini-card.small {
  flex: none;
  height: 28%;
}

.mini-poster {
  flex: 1;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 4px;
  border: 1px solid #fecaca;
}

.development-mini .mini-poster {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}

.template-info {
  padding: 20px;
}

.template-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.template-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.template-description {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
}

.template-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #444;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 12px;
}

.template-action {
  padding: 0 20px 20px;
}

.select-btn {
  text-transform: none;
  font-weight: 600;
}

.selector-help {
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

.selector-help strong {
  color: #1a1a1a;
}

/* Responsive */
@media (max-width: 768px) {
  .template-selector {
    padding: 16px;
  }

  .templates-grid {
    grid-template-columns: 1fr;
  }

  .selector-title {
    font-size: 1.5rem;
  }
}
</style>