/**
 * src/components/studentSide/projectView/forms/index.js
 *
 * Barrel export file for project view form components.
 */

// Unified form (new)
export { default as ProjectForm } from './ProjectForm.vue';

// Legacy forms (kept for backwards compatibility, will be deprecated)
export { default as ProjectFormResearch } from './ProjectFormResearch.vue';
export { default as ProjectFormDevelopment } from './ProjectFormDevelopment.vue';
export { default as ProjectFormContainer } from './ProjectFormContainer.vue';

// Re-export shared components for convenience
export * from './shared';
