/* ==========================================================================
   APPLICATION ENTRY POINT & BOOTSTRAP (ES Module)
   ========================================================================== */

import Logger from "./core/logger.js";
import stateManager from "./services/state-manager.js";
import AuthUI from "./ui/auth-ui.js";
import gamificationService from "./services/gamification-service.js";
import navigation from "./ui/navigation.js";
import { TOPICS_DATA } from "../data/topics.js";
import { QUIZZES_DATA } from "../data/quizzes.js";
import { showToast } from "./factories/toast-factory.js";

const logger = Logger.getInstance();

document.addEventListener("DOMContentLoaded", async () => {
  logger.info("🚀 JS Basics Academy Initializing (Modular Architecture)...");

  // 1. Initialize Authentication UI & Listeners
  AuthUI.init();

  // 2. Initialize Gamification & Streaks (7 topics)
  gamificationService.init({ totalTopics: TOPICS_DATA.length });

  // 3. Initialize Navigation & Render first topic
  navigation.init({ topics: TOPICS_DATA, quizzes: QUIZZES_DATA });

  // 4. Welcome Toast for first-time visitors
  const state = stateManager.getState();
  if (state.xp === 0) {
    setTimeout(() => {
      showToast("👋 Welcome to JS Academy! Start with Topic 1: Variables.", "xp");
    }, 800);
  }

  logger.info(`✅ JS Basics Academy Ready with ${TOPICS_DATA.length} curriculum topics & 40 Design Patterns!`);
});
