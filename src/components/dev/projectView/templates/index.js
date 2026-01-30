/**
 * src/components/dev/projectView/templates/index.js
 *
 * Barrel export file for project view templates.
 * Provides a single import point for all template layouts.
 */

// Unified template (new)
export { default as ProjectTemplate } from './ProjectTemplate.vue';

// Legacy templates (kept for backwards compatibility, will be deprecated)
export { default as ResearchTemplate } from './ResearchTemplate.vue';
export { default as DevelopmentTemplate } from './DevelopmentTemplate.vue';
export { default as ProjectTemplateRenderer } from './ProjectTemplateRenderer.vue';
