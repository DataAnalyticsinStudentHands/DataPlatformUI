/**
 * src/plugins/i18n.js
 * 
 * Vue i18n internationalization plugin configuration. Sets up language support with English
 * as the default locale and Spanish translations. Configured to suppress missing translation
 * warnings and fall back to English when translations are unavailable.
 */

import { createI18n } from 'vue-i18n';
import esTranslation from '@/assets/i18n/es.json';

export const i18n = createI18n({
  locale: 'en',
  messages: {
    es: esTranslation,
  },
  missingWarn: false,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  fallbackLocale: 'en',
});