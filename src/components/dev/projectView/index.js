/**
 * src/components/dev/projectView/index.js
 *
 * Main barrel export file for the projectView module.
 * Provides single import point for all project view components.
 */

// Main editor components
export { default as ProjectEditorMain } from './ProjectEditorMain.vue';
export { default as ProjectTemplateSelector } from './ProjectTemplateSelector.vue';
export { default as ProjectPreview } from './ProjectPreview.vue';

// Re-export templates
export * from './templates';

// Re-export forms
export * from './forms';

// Re-export components
export * from './components';

// Re-export pages
export * from './pages';

// Re-export types and utilities
export * from './types/projectTypes.js';