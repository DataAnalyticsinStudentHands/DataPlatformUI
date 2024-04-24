// src/plugins/i18n.js
import { createI18n } from 'vue-i18n';
// Import Latin American Spanish translation file
import esTranslation from '@/assets/i18n/es.json';

export const i18n = createI18n({
  locale: 'en', // Set the initial locale to English
  messages: {
    es: esTranslation, // Spanish translations
  },
  missingWarn: false,
  silentFallbackWarn: true,
  silentTranslationWarn: true, // Suppress warnings for missing translations
  fallbackLocale: 'en',
});
