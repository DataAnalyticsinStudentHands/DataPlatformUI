/**
 * src/components/dev/projectView/forms/ProjectForm.vue
 *
 * Unified form component for project data entry.
 * Dynamically renders sections based on enabledSections.
 * Replaces the separate Research and Development forms.
 */

<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <!-- Section 1: Basic Information (mandatory) -->
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

    <!-- Section 2: Author(s) (mandatory) -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">2</div>
        <div>
          <h2 class="section-title">{{ $t('Author(s)') }}</h2>
          <p class="section-subtitle">{{ $t('Add project contributors with their testimonials') }}</p>
        </div>
      </div>

      <div class="section-content">
        <!-- Author Cards -->
        <div class="authors-list">
          <AuthorInput
            v-for="(author, index) in formData.authors"
            :key="author.id"
            :model-value="author"
            @update:model-value="updateAuthor(index, $event)"
            :show-header="formData.authors.length > 1"
            :header-label="$t('Author') + ' ' + (index + 1)"
            :show-remove="formData.authors.length > 1"
            :remove-disabled="formData.authors.length <= 1"
            @remove="removeAuthor(index)"
            @remove-avatar="handleRemoveAvatar(index)"
          />
        </div>

        <!-- Add Author Button -->
        <v-btn
          v-if="formData.authors.length < 6"
          variant="outlined"
          color="#6366f1"
          class="add-author-btn mt-4"
          @click="addAuthor"
        >
          <v-icon start size="20">mdi-plus</v-icon>
          {{ $t('Add Another Author') }}
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

    <!-- Section 3: Tags (mandatory) -->
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

    <!-- Section 4: Key Findings (mandatory) -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-number">4</div>
        <div>
          <h2 class="section-title">{{ $t('Key Findings') }}</h2>
          <p class="section-subtitle">{{ $t('Highlight 1-3 key statistics or findings') }}</p>
        </div>
      </div>

      <div class="section-content">
        <FindingsInput
          v-model="formData.findings"
          header-label="Finding"
          :min-items="1"
          :max-items="3"
          :default-variants="['data', 'success', 'purple']"
        />

        <v-divider class="my-6"></v-divider>

        <!-- Conclusion (part of findings section) -->
        <h3 class="subsection-title">{{ $t('Conclusion') }}</h3>

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
          :counter="100"
        >
          <template v-slot:prepend-inner>
            <v-icon size="20" color="#666">mdi-account-voice</v-icon>
          </template>
        </v-text-field>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- OPTIONAL SECTIONS (rendered based on enabled) -->
    <!-- ============================================== -->

    <!-- Partners (optional, order: 30) -->
    <template v-if="isSectionEnabled('partners')">
      <v-divider></v-divider>
      <div class="form-section optional">
        <div class="section-header">
          <div class="section-number optional">{{ getSectionNumber('partners') }}</div>
          <div class="section-header-content">
            <h2 class="section-title">{{ $t('Partner Organizations') }}</h2>
            <p class="section-subtitle">{{ $t('Add collaborating institutions or organizations') }}</p>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            color="#999"
            class="remove-section-btn"
            @click="removeSection('partners')"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="section-content">
          <PartnersInput
            v-model="formData.partners"
            :max-partners="10"
          />
        </div>
      </div>
    </template>

    <!-- Timeline (optional, order: 40) -->
    <template v-if="isSectionEnabled('timeline')">
      <v-divider></v-divider>
      <div class="form-section optional">
        <div class="section-header">
          <div class="section-number optional">{{ getSectionNumber('timeline') }}</div>
          <div class="section-header-content">
            <h2 class="section-title">{{ $t('Project Timeline') }}</h2>
            <p class="section-subtitle">{{ $t('Add key milestones in your project development') }}</p>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            color="#999"
            class="remove-section-btn"
            @click="removeSection('timeline')"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="section-content">
          <!-- Timeline Layout Toggle -->
          <div class="timeline-layout-toggle mb-4">
            <p class="text-caption font-weight-medium text-medium-emphasis mb-2">
              {{ $t('Timeline Layout') }}
            </p>
            <v-btn-toggle
              v-model="formData.timelineLayout"
              mandatory
              density="compact"
              color="#6366f1"
              variant="outlined"
              class="layout-toggle"
            >
              <v-btn :value="TIMELINE_LAYOUTS.VERTICAL" size="small">
                <v-icon start size="16">mdi-view-sequential-outline</v-icon>
                {{ $t('Vertical') }}
              </v-btn>
              <v-btn :value="TIMELINE_LAYOUTS.HORIZONTAL" size="small">
                <v-icon start size="16">mdi-view-column-outline</v-icon>
                {{ $t('Horizontal') }}
              </v-btn>
            </v-btn-toggle>
          </div>

          <MilestonesInput
            v-model="formData.milestones"
            :min-milestones="2"
            :max-milestones="10"
          />
        </div>
      </div>
    </template>

    <!-- Impact (optional, order: 50) -->
    <template v-if="isSectionEnabled('impact')">
      <v-divider></v-divider>
      <div class="form-section optional">
        <div class="section-header">
          <div class="section-number optional">{{ getSectionNumber('impact') }}</div>
          <div class="section-header-content">
            <h2 class="section-title">{{ $t('Impact Summary') }}</h2>
            <p class="section-subtitle">{{ $t('Describe how your project benefits different audiences') }}</p>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            color="#999"
            class="remove-section-btn"
            @click="removeSection('impact')"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="section-content">
          <ImpactInput
            v-model="formData.impactItems"
            :min-items="2"
            :max-items="6"
          />
        </div>
      </div>
    </template>

    <!-- Poster (optional, order: 60) -->
    <template v-if="isSectionEnabled('poster')">
      <v-divider></v-divider>
      <div class="form-section optional">
        <div class="section-header">
          <div class="section-number optional">{{ getSectionNumber('poster') }}</div>
          <div class="section-header-content">
            <h2 class="section-title">{{ $t('Poster / Diagram') }}</h2>
            <p class="section-subtitle">{{ $t('Select a research poster (PDF) or diagram (image) from Clowder') }}</p>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            color="#999"
            class="remove-section-btn"
            @click="removeSection('poster')"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="section-content">
          <ClowderFileSelector
            v-if="formData.poster"
            :form-id="formId"
            v-model:poster-title="formData.poster.title"
            :selected-file-id="formData.poster.clowderFileId"
            :existing-url="formData.poster.url"
            :existing-type="formData.poster.type"
            :existing-file-name="formData.poster.clowderFileName"
            :show-error="showValidation && !formData.poster.url"
            title-placeholder="e.g., Research Poster"
            @poster-selected="handlePosterSelected"
            @poster-removed="handlePosterRemoved"
          />
          <p
            v-if="showValidation && formData.poster && !formData.poster.url"
            class="poster-error text-caption mt-2"
          >
            <v-icon size="14" color="error" class="mr-1">mdi-alert-circle</v-icon>
            {{ $t('Please select a poster or diagram file from Clowder to continue') }}
          </p>
        </div>
      </div>
    </template>

    <!-- Add Section Button -->
    <div v-if="hasAvailableSections" class="add-section-container">
      <v-divider></v-divider>
      <div class="add-section-wrapper">
        <SectionAddMenu
          :available-sections="availableSections"
          @add="addSection"
        />
      </div>
    </div>

    <!-- Form Actions (hidden - parent handles submission) -->
    <slot name="actions"></slot>
  </v-form>
</template>

<script setup>
import { ref, watch, computed, watchEffect } from 'vue';
import { AuthorInput, TagsInput, FindingsInput, PartnersInput, MilestonesInput, ImpactInput, ClowderFileSelector } from './shared';
import SectionAddMenu from '../SectionAddMenu.vue';
import {
  createEmptyProject,
  createEmptyAuthor,
  createEmptyPoster,
  validateProject,
  cloneProject,
  initializeSectionData,
  TIMELINE_LAYOUTS
} from '../types/projectTypes.js';
import {
  isSectionEnabled as checkSectionEnabled,
  getAvailableOptionalSections,
  getFormSectionNumber
} from '../types/sectionTypes.js';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  showValidation: {
    type: Boolean,
    default: false
  },
  formId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'validation-change', 'remove-avatar']);

const form = ref(null);

// Flag to prevent circular updates
let isInternalUpdate = false;

// Ensure all enabled sections have their data structures initialized
function ensureSectionData(project) {
  const sections = project.enabledSections || [];
  let result = project;
  for (const sectionId of sections) {
    result = initializeSectionData(result, sectionId);
  }
  return result;
}

// Initialize form data
const formData = ref(
  ensureSectionData(
    props.modelValue
      ? cloneProject(props.modelValue)
      : createEmptyProject()
  )
);

// Reactive guard: ensure poster data exists whenever the poster section is enabled.
// This covers all cases — initial mount, parent v-model sync, section toggling — regardless
// of watcher ordering or the isInternalUpdate flag.
watchEffect(() => {
  if (formData.value.enabledSections?.includes('poster') && !formData.value.poster) {
    formData.value.poster = createEmptyPoster('pdf');
  }
});

// Suggested tags
const suggestedTags = [
  'Research', 'Data Analysis', 'Environmental', 'Social Impact',
  'Health', 'Education', 'Technology', 'Community', 'Policy',
  'Development', 'Software', 'Innovation'
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

// Section management
const enabledSections = computed(() => formData.value.enabledSections || []);

function isSectionEnabled(sectionId) {
  return checkSectionEnabled(sectionId, enabledSections.value);
}

function getSectionNumber(sectionId) {
  return getFormSectionNumber(sectionId, enabledSections.value);
}

// Available sections to add
const availableSections = computed(() => {
  return getAvailableOptionalSections(enabledSections.value);
});

const hasAvailableSections = computed(() => availableSections.value.length > 0);

// Author management
function addAuthor() {
  if (formData.value.authors.length < 6) {
    formData.value.authors.push(createEmptyAuthor());
  }
}

function removeAuthor(index) {
  if (formData.value.authors.length > 1) {
    formData.value.authors.splice(index, 1);
  }
}

function updateAuthor(index, updatedAuthor) {
  formData.value.authors[index] = updatedAuthor;
}

function handleRemoveAvatar(index) {
  const author = formData.value.authors[index];
  if (author?.id) {
    emit('remove-avatar', author.id);
  }
}

// Add a section
function addSection(sectionId) {
  if (!formData.value.enabledSections.includes(sectionId)) {
    formData.value.enabledSections.push(sectionId);
    // Initialize default data for the section
    const updated = initializeSectionData(formData.value, sectionId);
    Object.assign(formData.value, updated);
  }
}

// Remove a section
function removeSection(sectionId) {
  const index = formData.value.enabledSections.indexOf(sectionId);
  if (index >= 0) {
    formData.value.enabledSections.splice(index, 1);
    // Note: We keep the data in case they re-add the section
  }
}

// Handle poster selected from Clowder
function handlePosterSelected({ url, type, clowderFileId, clowderFileName }) {
  if (formData.value.poster) {
    formData.value.poster.url = url;
    formData.value.poster.type = type;
    formData.value.poster.clowderFileId = clowderFileId;
    formData.value.poster.clowderFileName = clowderFileName;
    formData.value.poster.file = null;
  }
}

// Handle poster removed
function handlePosterRemoved() {
  if (formData.value.poster) {
    formData.value.poster.url = '';
    formData.value.poster.type = 'pdf';
    formData.value.poster.clowderFileId = null;
    formData.value.poster.clowderFileName = null;
    formData.value.poster.file = null;
  }
}

// Watch for external model changes (from parent)
watch(() => props.modelValue, (newVal) => {
  // Skip if this update originated from within the form
  if (isInternalUpdate) {
    return;
  }
  if (newVal) {
    formData.value = ensureSectionData(cloneProject(newVal));
  }
}, { deep: true });

// Emit changes to parent
watch(formData, (newVal) => {
  // Mark as internal update to prevent circular loop
  isInternalUpdate = true;
  emit('update:modelValue', newVal);

  // Run validation and emit result
  const errors = validateProject(newVal);
  emit('validation-change', errors.length === 0, errors);

  // Reset flag after microtask to allow parent to process
  queueMicrotask(() => {
    isInternalUpdate = false;
  });
}, { deep: true });

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
  getFormData: () => formData.value,
  addSection,
  removeSection
});
</script>

<style scoped>
/* Form Sections */
.form-section {
  padding: 28px 32px;
}

.form-section.optional {
  background: #fafbfc;
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
}

.section-header-content {
  flex: 1;
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

.section-number.optional {
  background-color: #6366f1;
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

.subsection-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

/* Authors List */
.authors-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.add-author-btn {
  text-transform: none;
  font-weight: 600;
  border-style: dashed;
}

.remove-section-btn {
  margin-left: 8px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.remove-section-btn:hover {
  opacity: 1;
}

/* Add Section Container */
.add-section-container {
  padding: 0 32px 32px;
}

.add-section-wrapper {
  padding-top: 24px;
  display: flex;
  justify-content: center;
}

.poster-error {
  color: #c8102e;
  display: flex;
  align-items: center;
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

  .add-section-container {
    padding: 0 20px 24px;
  }
}

/* Timeline Layout Toggle */
.timeline-layout-toggle {
  padding: 0 0 4px;
}

.layout-toggle .v-btn {
  text-transform: none;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0;
}
</style>
