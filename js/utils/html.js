/* ==========================================================================
   HTML UTILITIES
   Shared helpers (previously duplicated in 3 separate files).
   ========================================================================== */

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

/** Converts `inline code` markers inside a sentence into styled spans. */
export function formatInlineCode(str) {
  return escapeHtml(str).replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');
}
