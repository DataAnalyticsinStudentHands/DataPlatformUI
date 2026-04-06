<!-- /**
 * src/components/studentSide/projectView/forms/ProjectFormContainer.vue
 *
 * Dynamic form container that automatically selects and renders
 * the appropriate form based on project.templateType.
 * 
 * Usage:
 *   <ProjectFormContainer 
 *     v-model="projectData" 
 *     @submit="handleSubmit"
 *     @validation-change="handleValidation"
 *   />
 */ -->

<template>
  <component 
    :is="formComponent" 
    ref="formRef"
    v-model="internalValue"
    :show-validation="showValidation"
    @submit="$emit('submit', $event)"
    @validation-change="$emit('validation-change', $event)"
  >
    <template #actions>
      <slot name="actions"></slot>
    </template>
  </component>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { TEMPLATE_TYPES } from '../types/projectTypes.js';
import ProjectFormResearch from './ProjectFormResearch.vue';
import ProjectFormDevelopment from './ProjectFormDevelopment.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  showValidation: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'validation-change']);

const formRef = ref(null);

// Internal value for v-model
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// Select form component based on template type
const formComponent = computed(() => {
  switch (props.modelValue?.templateType) {
    case TEMPLATE_TYPES.DEVELOPMENT:
      return ProjectFormDevelopment;
    case TEMPLATE_TYPES.RESEARCH:
    default:
      return ProjectFormResearch;
  }
});

// Expose form methods to parent
defineExpose({
  validate: () => formRef.value?.validate(),
  getFormData: () => formRef.value?.getFormData()
});
</script>