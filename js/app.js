/* ==========================================================================
   APPLICATION ENTRY POINT & BOOTSTRAP
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 JS Basics Academy Initializing...");

  // 1. Initialize Gamification & Streaks
  GamificationEngine.init();

  // 2. Initialize Navigation & Render first topic
  Navigation.init();

  // 3. Welcome Toast for first-time visitors
  const state = StorageManager.getState();
  if (state.xp === 0) {
    setTimeout(() => {
      GamificationEngine.showToast("👋 Welcome to JS Academy! Start with Topic 1: Variables.", "xp");
    }, 800);
  }

  console.log("✅ JS Basics Academy Ready!");
});
