/**
 * src/theme/initialTheme.js
 *
 * Theme policy: which theme the app starts in, and the optional OS-preference listener.
 * JS port of CHW Stories' src/theme/initialTheme.ts with DP's policy
 * (Design_Plan_Dark_Mode.md §5.2 item 2, §5.3 items 4 and 6, §7).
 *
 * main.js calls resolveInitialTheme() synchronously before createVuetify(), so this module must not
 * depend on Vue, Vuetify or CSS. It touches window / localStorage only inside functions, so Node gate
 * scripts can import it. The component-facing API (isDark, toggle) is src/composables/useColorScheme.js.
 *
 * public/theme-init.js duplicates STORAGE_KEY and FOLLOW_OS_WHEN_UNSET for the pre-paint; change both
 * files together (gate G3 checks they match).
 */

// localStorage key holding the user's explicit choice ('light' or 'dark'). DP and CHW Stories share the
// eds.uh.edu origin and therefore localStorage; CHW uses 'app-theme', so DP keeps its own key.
export const STORAGE_KEY = 'dp-theme';

// What a visitor with nothing stored gets.
//   false: light, and the OS preference is ignored (first visits are light; dark is opt-in via the toggle).
//   true:  the OS prefers-color-scheme, and OS changes are followed until the user toggles once.
// Flip the copy in public/theme-init.js at the same time.
export const FOLLOW_OS_WHEN_UNSET = false;

// Release gate (§7).
//   false: App.vue shows the theme toggle only under the Vite dev server
//          (showThemeToggle = DARK_MODE_RELEASED || import.meta.env.DEV), so production users can't
//          reach dark mode.
//   true:  the toggle shows for everyone. Flip only after the per-role human QA signs off.
export const DARK_MODE_RELEASED = true;

// Class public/theme-init.js puts on <html> when the stored theme is dark; index.html's inline <style>
// paints it dark until Vuetify takes over. main.js removes it after mount, toggle() if still present.
export const PREPAINT_CLASS = 'dp-prepaint-dark';

const OS_DARK_QUERY = '(prefers-color-scheme: dark)';

/** The stored explicit choice, or null when nothing valid is stored or storage is blocked. */
export function readStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

/** The OS color-scheme preference; 'light' when it can't be read. */
export function getOsTheme() {
  try {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia(OS_DARK_QUERY).matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

/** A stored 'light' / 'dark' wins; otherwise the OS when FOLLOW_OS_WHEN_UNSET, else 'light'. */
export function resolveInitialTheme() {
  const stored = readStoredTheme();
  if (stored !== null) return stored;
  return FOLLOW_OS_WHEN_UNSET ? getOsTheme() : 'light';
}

let osListenerAttached = false;

/**
 * Follow OS color-scheme changes while nothing is stored, by calling apply('light' | 'dark').
 * A no-op unless FOLLOW_OS_WHEN_UNSET is true. Attaches at most once.
 */
export function attachOsListener(apply) {
  if (!FOLLOW_OS_WHEN_UNSET || osListenerAttached) return;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
  const mq = window.matchMedia(OS_DARK_QUERY);
  const onChange = (e) => {
    if (readStoredTheme() === null) apply(e.matches ? 'dark' : 'light');
  };
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
  else if (typeof mq.addListener === 'function') mq.addListener(onChange); // Safari before 14
  else return;
  osListenerAttached = true;
}
