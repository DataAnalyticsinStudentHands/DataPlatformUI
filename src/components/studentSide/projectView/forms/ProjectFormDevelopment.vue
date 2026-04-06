/**
 * src/components/studentSide/projectView/forms/ProjectFormDevelopment.vue
 *
 * Form component for Development/Team template data entry.
 * Multi-author layout with timeline, impact, and image poster.
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
          :placeholder="$t('e.g., Engaged Data Science, Team Project')"
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
          :placeholder="$t('Describe your project goals, approach, and outcomes...')"
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

    <!-- Section 2: Team Members -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">2</div>
        <div class="flex-grow-1">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h2 class="section-title">{{ $t('Team Members') }}</h2>
              <p class="section-subtitle">{{ $t('Add your team members and their contributions') }}</p>
            </div>
            <v-chip size="small" color="#c8102e" variant="tonal">
              {{ formData.authors.length }} / 6
            </v-chip>
          </div>
        </div>
      </div>

      <div class="section-content">
        <div class="authors-list">
          <AuthorInput
            v-for="(author, index) in formData.authors"
            :key="author.id"
            v-model="formData.authors[index]"
            :header-label="$t('Team Member') + ' ' + (index + 1)"
            :show-remove="formData.authors.length > 1"
            :remove-disabled="formData.authors.length <= 1"
            @remove="removeAuthor(index)"
            class="mb-4"
          />
        </div>

        <v-btn
          v-if="formData.authors.length < 6"
          variant="outlined"
          color="#c8102e"
          class="add-author-btn"
          @click="addAuthor"
        >
          <v-icon start>mdi-account-plus</v-icon>
          {{ $t('Add Team Member') }}
        </v-btn>
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

    <!-- Section 4: Key Achievements -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">4</div>
        <div>
          <h2 class="section-title">{{ $t('Key Achievements') }}</h2>
          <p class="section-subtitle">{{ $t('Highlight 1-3 key accomplishments or metrics') }}</p>
        </div>
      </div>

      <div class="section-content">
        <FindingsInput
          v-model="formData.findings"
          header-label="Achievement"
          :min-items="1"
          :max-items="3"
          :default-variants="['success', 'data', 'purple']"
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
          <p class="section-subtitle">{{ $t('Summarize the project impact and outcomes') }}</p>
        </div>
      </div>

      <div class="section-content">
        <v-textarea
          v-model="formData.conclusion.text"
          :label="$t('Conclusion Text') + ' *'"
          :placeholder="$t('Summarize the key outcomes and impact of your project...')"
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
          :placeholder="$t('— Team Lead Name')"
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

    <!-- Section 6: Development Timeline -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">6</div>
        <div>
          <h2 class="section-title">{{ $t('Development Timeline') }}</h2>
          <p class="section-subtitle">{{ $t('Add key milestones from your project (optional)') }}</p>
        </div>
      </div>

      <div class="section-content">
        <MilestonesInput
          v-model="formData.milestones"
          :max-milestones="10"
        />
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 7: Impact Summary -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">7</div>
        <div>
          <h2 class="section-title">{{ $t('Impact Summary') }}</h2>
          <p class="section-subtitle">{{ $t('Describe impact on different stakeholder groups') }}</p>
        </div>
      </div>

      <div class="section-content">
        <ImpactInput
          v-model="formData.impactItems"
          :min-items="1"
          :max-items="6"
        />
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 8: Partners -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">8</div>
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

    <!-- Section 9: System Architecture / Poster -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">9</div>
        <div>
          <h2 class="section-title">{{ $t('System Architecture / Diagram') }}</h2>
          <p class="section-subtitle">{{ $t('Upload an architecture diagram or project image') }}</p>
        </div>
      </div>

      <div class="section-content">
        <FileUploader
          v-model="formData.poster.file"
          v-model:poster-title="formData.poster.title"
          :existing-url="formData.poster.url"
          :accept-pdf="false"
          :accept-images="true"
          :max-size-mb="10"
          title-placeholder="e.g., System Architecture"
          @remove="clearPosterUrl"
        />
      </div>
    </div>

    <!-- Form Actions (hidden - parent handles submission) -->
    <slot name="actions"></slot>
  </v-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { 
  AuthorInput, 
  TagsInput, 
  FindingsInput, 
  PartnersInput, 
  MilestonesInput,
  ImpactInput,
  FileUploader 
} from './shared';
import { 
  createEmptyDevelopmentProject, 
  createEmptyAuthor,
  validateDevelopmentProject,
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
    : createEmptyDevelopmentProject()
);

// Suggested tags for development projects
const suggestedTags = [
  'Full-Stack', 'Web Application', 'Mobile', 'API', 'Database',
  'Cloud', 'Security', 'UI/UX', 'Data Science', 'Machine Learning',
  'DevOps', 'Open Source', 'Educational Technology'
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
  const errors = validateDevelopmentProject(newVal);
  emit('validation-change', errors.length === 0, errors);
}, { deep: true });

// Add a new author
function addAuthor() {
  if (formData.value.authors.length >= 6) return;
  formData.value.authors.push(createEmptyAuthor());
}

// Remove an author
function removeAuthor(index) {
  if (formData.value.authors.length <= 1) return;
  formData.value.authors.splice(index, 1);
}

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

/* Authors List */
.authors-list {
  margin-bottom: 16px;
}

.add-author-btn {
  text-transform: none;
  font-weight: 500;
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