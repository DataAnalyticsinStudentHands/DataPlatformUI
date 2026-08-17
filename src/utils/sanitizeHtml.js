/**
 * src/utils/sanitizeHtml.js
 *
 * Centralized HTML sanitization for v-html sinks (security item H2).
 * Wraps DOMPurify so every preview/render of user- or admin-authored HTML
 * goes through one configuration.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML (e.g. CKEditor output) for safe rendering via v-html.
 * Keeps standard formatting markup (headings, lists, tables, links) while
 * stripping scripts, event handlers, and other active content.
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

/**
 * Escape a plain-text value for interpolation into an HTML string.
 * Mirrors the backend's escaping of substituted placeholder values
 * (& < > " ') so previews match what recipients actually receive.
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
