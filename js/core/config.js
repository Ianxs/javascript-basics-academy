/* ==========================================================================
   CONFIGURATION SINGLETON
   Patterns: Configuration Singleton · Module Singleton · Eager Singleton ·
             Object Literal Singleton
   --------------------------------------------------------------------------
   ES modules are evaluated exactly once per page, so every file that does
   `import config from "./core/config.js"` receives the SAME frozen object.
   It is created eagerly (at load time) because every part of the app needs it.
   ========================================================================== */

const config = Object.freeze({
  APP_NAME: "JS Basics Academy",
  API_BASE_URL: "http://localhost:8000",

  // localStorage keys
  STORAGE_KEY: "js_basics_academy_state_v1",
  TOKEN_KEY: "js_academy_auth_token",
  USER_KEY: "js_academy_auth_user",

  // Gameplay rules
  XP_PER_LEVEL: 150,
  XP: Object.freeze({
    TOPIC_VIEW: 10,
    FIRST_CODE_RUN: 25,
    QUIZ_COMPLETE: 50,
    QUIZ_PERFECT: 100,
    BADGE_BONUS: 50
  }),

  // Performance
  SYNC_DEBOUNCE_MS: 350,

  // Set to false to silence debug logs
  DEBUG: true
});

export default config;
