/* ==========================================================================
   TOAST FACTORY
   Patterns: Simple Factory · Factory with Configuration
   --------------------------------------------------------------------------
   One function builds every notification element. The visual variant is
   chosen from a configuration table instead of being hard-coded at call sites.
   ========================================================================== */

const TOAST_TYPES = {
  xp:    { className: "xp-toast",    icon: "✨" },
  badge: { className: "badge-toast", icon: "🏆" }
};

const TOAST_DURATION_MS = 3500;
const FADE_MS = 300;

export function createToast(message, type = "xp") {
  const { className, icon } = TOAST_TYPES[type] ?? TOAST_TYPES.xp;

  const toast = document.createElement("div");
  toast.className = `toast ${className}`;

  const iconEl = document.createElement("span");
  iconEl.style.fontSize = "1.2rem";
  iconEl.textContent = icon;

  const textEl = document.createElement("span");
  textEl.textContent = message; // textContent: never interpreted as HTML

  toast.append(iconEl, textEl);
  return toast;
}

/** Builds a toast, shows it, and removes it automatically. */
export function showToast(message, type = "xp") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = createToast(message, type);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`;
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), FADE_MS);
  }, TOAST_DURATION_MS);
}
