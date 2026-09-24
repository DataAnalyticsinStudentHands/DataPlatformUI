/**
 * src/composables/useColorScheme.js
 *
 * Component-facing theme API: `isDark` for templates and `toggle()` for the app-bar button.
 * JS port of CHW Stories' src/composables/useColorScheme.ts (Design_Plan_Dark_Mode.md §5.2 item 3).
 *
 * toggle() stores the choice under STORAGE_KEY, which also ends OS-follow mode when
 * FOLLOW_OS_WHEN_UNSET is on. The initial theme is resolved in src/theme/initialTheme.js before
 * the app mounts; call this composable from setup() only.
 */

import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { STORAGE_KEY, PREPAINT_CLASS } from '@/theme/initialTheme';

export function useColorScheme() {
  const theme = useTheme();

  const currentTheme = computed(() => (theme.global.name.value === 'dark' ? 'dark' : 'light'));
  const isDark = computed(() => currentTheme.value === 'dark');

  function toggle() {
    const next = isDark.value ? 'light' : 'dark';
    // theme.change(), never an assignment to theme.global.name.value (deprecated since Vuetify 3.9).
    theme.change(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the toggle still works for this page load.
    }
    // The pre-paint class would otherwise keep painting <html> dark after switching to light.
    document.documentElement.classList.remove(PREPAINT_CLASS);
  }

  return { isDark, currentTheme, toggle };
}
