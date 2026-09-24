/*
 * public/theme-init.js
 *
 * Pre-paint (Design_Plan_Dark_Mode.md §5.3 item 6): runs before the page's CSS and the app bundle so a
 * reload in dark mode doesn't flash white. When the stored theme is dark it adds the class
 * 'dp-prepaint-dark' to <html>; index.html's inline <style> paints that class, and main.js removes it
 * once the app has mounted.
 *
 * Loaded from index.html as a classic <script src>, first in <head>. It must stay a separate file: the
 * production CSP (script-src 'self') blocks inline scripts. No import/export, and never set inline
 * styles on <html> (they would outrank Vuetify's :root rules after a toggle).
 *
 * Known behavior: a hard reload of a forced-light route (/featured, /project/:projectId, /publicProjects)
 * in dark paints dark until the route renders its light provider (after initializeStore() and any
 * beforeEnter fetch). The route is deliberately not checked here: app.use(vuetify) makes :root dark
 * before that wait anyway, so skipping the class would give light -> dark -> light instead.
 */
(function () {
  // keep in sync with src/theme/initialTheme.js — gate G3 checks they match
  var STORAGE_KEY = 'dp-theme';
  var FOLLOW_OS_WHEN_UNSET = false;
  var PREPAINT_CLASS = 'dp-prepaint-dark';

  // Same policy as resolveInitialTheme(): a stored 'light' / 'dark' wins; otherwise the OS when
  // FOLLOW_OS_WHEN_UNSET, else light. Blocked storage counts as nothing stored.
  var theme = null;
  try {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') theme = stored;
  } catch {
    theme = null;
  }

  if (theme === null) {
    theme = 'light';
    if (FOLLOW_OS_WHEN_UNSET) {
      try {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
      } catch {
        theme = 'light';
      }
    }
  }

  if (theme === 'dark') document.documentElement.classList.add(PREPAINT_CLASS);
})();
