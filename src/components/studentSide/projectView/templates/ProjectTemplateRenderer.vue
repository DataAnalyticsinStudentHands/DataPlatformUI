/**
 * src/components/studentSide/projectView/templates/ProjectTemplateRenderer.vue
 *
 * Dynamic template renderer that automatically selects and renders
 * the appropriate template based on project.templateType.
 * 
 * Usage:
 *   <ProjectTemplateRenderer :project="projectData" />
 */

<template>
  <component 
    :is="templateComponent" 
    :project="project"
  />
</template>

<script setup>
import { computed } from 'vue';
import { TEMPLATE_TYPES } from '../types/projectTypes.js';
import ResearchTemplate from './ResearchTemplate.vue';
import DevelopmentTemplate from './DevelopmentTemplate.vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const templateComponent = computed(() => {
  switch (props.project.templateType) {
    case TEMPLATE_TYPES.DEVELOPMENT:
      return DevelopmentTemplate;
    case TEMPLATE_TYPES.RESEARCH:
    default:
      return ResearchTemplate;
  }
});
</script>