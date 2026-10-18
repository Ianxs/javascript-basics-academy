/* ==========================================================================
   GAMIFICATION SERVICE SINGLETON
   Patterns: Module Singleton · Observer/Listener for EventBus
   --------------------------------------------------------------------------
   Manages XP awards, badge evaluations, streak checks, and header UI sync.
   ========================================================================== */

import EventBus, { EVENTS } from "../core/event-bus.js";
import stateManager from "./state-manager.js";
import BadgeFactory, { BADGES_CATALOG } from "../factories/badge-factory.js";
import { showToast } from "../factories/toast-factory.js";
import config from "../core/config.js";

class GamificationService {
  #totalTopics = 7; // Variables, Data Types, Functions, Arrays, Objects, Factories, Singletons

  init({ totalTopics = 7 } = {}) {
    this.#totalTopics = totalTopics;
    stateManager.checkAndUpdateStreak();
    this.updateHeaderUI();
    this.setupBadgesModal();

    // Re-render header automatically whenever state changes
    EventBus.on(EVENTS.STATE_CHANGED, () => this.updateHeaderUI());
    EventBus.on(EVENTS.STATE_RESET, () => this.updateHeaderUI());
  }

  setTotalTopics(count) {
    this.#totalTopics = count;
    this.updateHeaderUI();
  }

  updateHeaderUI() {
    const state = stateManager.getState();

    // XP
    const xpEl = document.getElementById("header-xp-count");
    if (xpEl) xpEl.textContent = `${state.xp} XP`;

    // Streak
    const streakEl = document.getElementById("header-streak-count");
    if (streakEl) streakEl.textContent = `${state.streak} Day${state.streak > 1 ? "s" : ""}`;

    // Overall Progress
    const completedCount = state.completedTopics.length;
    const progressPercent = Math.min(100, Math.round((completedCount / this.#totalTopics) * 100));

    const progressFill = document.getElementById("header-progress-fill");
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const progressText = document.getElementById("header-progress-text");
    if (progressText) {
      progressText.textContent = `${progressPercent}% Complete (${completedCount}/${this.#totalTopics})`;
    }
  }

  awardXP(amount, reason = "Great Job!") {
    stateManager.addXP(amount);
    showToast(`+${amount} XP: ${reason}`, "xp");
  }

  checkBadge(badgeId) {
    const wasNewlyUnlocked = stateManager.unlockBadge(badgeId);
    if (wasNewlyUnlocked) {
      const badge = BadgeFactory.getBadge(badgeId);
      if (badge) {
        showToast(`🏆 Badge Unlocked: ${badge.name}!`, "badge");
        this.awardXP(config.XP.BADGE_BONUS, `Badge Bonus (${badge.name})`);
      }
      this.checkCourseCompletion();
    }
  }

  checkCourseCompletion() {
    const state = stateManager.getState();
    if (state.completedTopics.length >= this.#totalTopics) {
      this.checkBadge("course_champion");
    }
  }

  setupBadgesModal() {
    const badgesBtn = document.getElementById("header-badges-btn");
    const modal = document.getElementById("badges-modal");
    const closeBtn = document.getElementById("badges-modal-close");

    if (badgesBtn && modal) {
      badgesBtn.addEventListener("click", () => {
        this.renderBadgesGrid();
        modal.classList.add("active");
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }
  }

  renderBadgesGrid() {
    const grid = document.getElementById("badges-modal-grid");
    if (!grid) return;

    const state = stateManager.getState();
    grid.innerHTML = BadgeFactory.getAllBadges().map(badge => {
      const isUnlocked = state.unlockedBadges.includes(badge.id);
      return BadgeFactory.createBadgeCardHtml(badge, isUnlocked);
    }).join("");
  }
}

const gamificationService = new GamificationService();
export default gamificationService;
