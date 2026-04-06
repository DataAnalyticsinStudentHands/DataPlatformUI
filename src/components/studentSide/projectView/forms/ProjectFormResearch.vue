/**
 * src/components/studentSide/projectView/forms/ProjectFormResearch.vue
 *
 * Form component for Research/Fellowship template data entry.
 * Single author layout with PDF poster.
 * Follows existing instructor form styling patterns.
 */

<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <!-- Section 1: Basic Information -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">1</div>
        <div>
          <h2 class="section-title">{{ $t('Basic Information') }}</h2>
          <p class="section-subtitle">{{ $t('Project title, description, and category') }}</p>
        </div>
      </div>

      <div class="section-content">
        <!-- Category Label -->
        <v-text-field
          v-model="formData.label.text"
          :label="$t('Category Label') + ' *'"
          :placeholder="$t('e.g., Pharis Fellowship, Research Project')"
          variant="outlined"
          :rules="labelRules"
          :counter="50"
          class="mb-4"
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-label-outline</v-icon>
          </template>
        </v-text-field>

        <!-- Project Title -->
        <v-text-field
          v-model="formData.title"
          :label="$t('Project Title') + ' *'"
          :placeholder="$t('Enter a descriptive title for your project')"
          variant="outlined"
          :rules="titleRules"
          :counter="200"
          class="mb-4"
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-format-title</v-icon>
          </template>
        </v-text-field>

        <!-- Description -->
        <v-textarea
          v-model="formData.description"
          :label="$t('Project Description') + ' *'"
          :placeholder="$t('Describe your project goals, methodology, and significance...')"
          variant="outlined"
          :rules="descriptionRules"
          :counter="1000"
          rows="4"
          auto-grow
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-text</v-icon>
          </template>
        </v-textarea>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 2: Author Details -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">2</div>
        <div>
          <h2 class="section-title">{{ $t('Author Details') }}</h2>
          <p class="section-subtitle">{{ $t('Your name, role, and testimonial') }}</p>
        </div>
      </div>

      <div class="section-content">
        <AuthorInput
          v-model="formData.author"
          :show-header="false"
        />
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 3: Tags -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">3</div>
        <div>
          <h2 class="section-title">{{ $t('Project Tags') }}</h2>
          <p class="section-subtitle">{{ $t('Add keywords that describe your project') }}</p>
        </div>
      </div>

      <div class="section-content">
        <TagsInput
          v-model="formData.tags"
          :suggestions="suggestedTags"
          :min-tags="1"
          :max-tags="10"
          :show-validation="showValidation"
        />
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 4: Key Findings -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">4</div>
        <div>
          <h2 class="section-title">{{ $t('Key Findings') }}</h2>
          <p class="section-subtitle">{{ $t('Highlight 1-3 key statistics or findings from your research') }}</p>
        </div>
      </div>

      <div class="section-content">
        <FindingsInput
          v-model="formData.findings"
          header-label="Finding"
          :min-items="1"
          :max-items="3"
          :default-variants="['critical', 'data', 'warning']"
        />
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 5: Conclusion -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">5</div>
        <div>
          <h2 class="section-title">{{ $t('Conclusion') }}</h2>
          <p class="section-subtitle">{{ $t('Summarize your key takeaways') }}</p>
        </div>
      </div>

      <div class="section-content">
        <v-textarea
          v-model="formData.conclusion.text"
          :label="$t('Conclusion Text') + ' *'"
          :placeholder="$t('Summarize the key takeaways and impact of your project...')"
          variant="outlined"
          :rules="conclusionRules"
          :counter="1000"
          rows="4"
          auto-grow
          class="mb-4"
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-text-box-check-outline</v-icon>
          </template>
        </v-textarea>

        <v-text-field
          v-model="formData.conclusion.attribution"
          :label="$t('Attribution')"
          :placeholder="$t('— Your Name')"
          variant="outlined"
          :counter="150"
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-account-voice</v-icon>
          </template>
        </v-text-field>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 6: Partners -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">6</div>
        <div>
          <h2 class="section-title">{{ $t('Partner Organizations') }}</h2>
          <p class="section-subtitle">{{ $t('Add collaborating institutions or organizations (optional)') }}</p>
        </div>
      </div>

      <div class="section-content">
        <PartnersInput
          v-model="formData.partners"
          :max-partners="10"
        />
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 7: Research Poster -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">7</div>
        <div>
          <h2 class="section-title">{{ $t('Research Poster') }}</h2>
          <p class="section-subtitle">{{ $t('Upload your research poster (PDF recommended)') }}</p>
        </div>
      </div>

      <div class="section-content">
        <FileUploader
          v-model="formData.poster.file"
          v-model:poster-title="formData.poster.title"
          :existing-url="formData.poster.url"
          :accept-pdf="true"
          :accept-images="true"
          :max-size-mb="10"
          title-placeholder="e.g., Research Poster"
          @remove="clearPosterUrl"
        />
      </div>
    </div>

    <!-- Form Actions (hidden - parent handles submission) -->
    <slot name="actions"></slot>
  </v-form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { AuthorInput, TagsInput, FindingsInput, PartnersInput, FileUploader } from './shared';
import { 
  createEmptyResearchProject, 
  validateResearchProject,
  cloneProject 
} from '../types/projectTypes.js';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  showValidation: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'validation-change']);

const form = ref(null);

// Initialize form data
const formData = ref(
  props.modelValue 
    ? cloneProject(props.modelValue) 
    : createEmptyResearchProject()
);

// Suggested tags for research projects
const suggestedTags = [
  'Research', 'Data Analysis', 'Environmental', 'Social Impact',
  'Health', 'Education', 'Technology', 'Community', 'Policy'
];

// Validation rules
const labelRules = [
  v => !!v || 'Category label is required',
  v => (v && v.length <= 50) || 'Label must be 50 characters or less'
];

const titleRules = [
  v => !!v || 'Project title is required',
  v => (v && v.length >= 5) || 'Title must be at least 5 characters',
  v => (v && v.length <= 200) || 'Title must be 200 characters or less'
];

const descriptionRules = [
  v => !!v || 'Description is required',
  v => (v && v.length >= 20) || 'Description must be at least 20 characters',
  v => (v && v.length <= 1000) || 'Description must be 1000 characters or less'
];

const conclusionRules = [
  v => !!v || 'Conclusion is required',
  v => (v && v.length <= 1000) || 'Conclusion must be 1000 characters or less'
];

// Watch for external model changes
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.value = cloneProject(newVal);
  }
}, { deep: true });

// Emit changes to parent
watch(formData, (newVal) => {
  emit('update:modelValue', newVal);
  
  // Run validation and emit result
  const errors = validateResearchProject(newVal);
  emit('validation-change', errors.length === 0, errors);
}, { deep: true });

// Clear poster URL when file is removed
function clearPosterUrl() {
  formData.value.poster.url = '';
}

// Handle form submission
async function handleSubmit() {
  const { valid } = await form.value.validate();
  if (valid) {
    emit('submit', formData.value);
  }
}

// Expose validation method to parent
defineExpose({
  validate: () => form.value?.validate(),
  getFormData: () => formData.value
});
</script>

<style scoped>
/* Form Sections */
.form-section {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #c8102e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0;
}

.section-content {
  padding-left: 48px;
}

/* Responsive */
@media (max-width: 960px) {
  .form-section {
    padding: 24px 20px;
  }
  
  .section-content {
    padding-left: 0;
    margin-top: 16px;
  }
}
</style>