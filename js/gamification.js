/* ==========================================================================
   GAMIFICATION ENGINE
   Badges, XP System, Levels, Streaks, and Achievement Toasts
   ========================================================================== */

const BADGES_DEFINITIONS = [
  {
    id: "first_run",
    name: "First Spark",
    icon: "⚡",
    description: "Executed your very first live JavaScript code snippet.",
    criteria: "Run any code in the Try It Yourself editor."
  },
  {
    id: "var_master",
    name: "Variable Virtuoso",
    icon: "📦",
    description: "Completed the Variables topic and passed its quiz.",
    criteria: "Complete Topic 1 quiz."
  },
  {
    id: "type_detective",
    name: "Data Detective",
    icon: "🏷️",
    description: "Mastered Strings, Numbers, Booleans, Null, and Undefined.",
    criteria: "Complete Topic 2 quiz."
  },
  {
    id: "func_wizard",
    name: "Function Fanatic",
    icon: "🧙‍♂️",
    description: "Conquered parameters, return values, and function calls.",
    criteria: "Complete Topic 3 quiz."
  },
  {
    id: "array_ace",
    name: "Array Ace",
    icon: "📚",
    description: "Navigated 0-indexing, push, pop, and loops like a pro.",
    criteria: "Complete Topic 4 quiz."
  },
  {
    id: "object_overlord",
    name: "Object Overlord",
    icon: "📇",
    description: "Unlocked mastery over key-value pairs and dot notation.",
    criteria: "Complete Topic 5 quiz."
  },
  {
    id: "perfect_score",
    name: "Quiz Prodigy",
    icon: "🎯",
    description: "Achieved a 100% perfect score on any topic quiz.",
    criteria: "Score 4/4 on any quiz."
  },
  {
    id: "course_champion",
    name: "JS Basics Master",
    icon: "👑",
    description: "Finished all 5 JavaScript Basics curriculum topics!",
    criteria: "Complete all 5 course topics."
  }
];

const GamificationEngine = {
  init() {
    StorageManager.checkAndUpdateStreak();
    this.updateHeaderUI();
    this.setupBadgesModal();
  },

  updateHeaderUI() {
    const state = StorageManager.getState();
    
    // XP Display
    const xpEl = document.getElementById("header-xp-count");
    if (xpEl) xpEl.textContent = `${state.xp} XP`;

    // Streak Display
    const streakEl = document.getElementById("header-streak-count");
    if (streakEl) streakEl.textContent = `${state.streak} Day${state.streak > 1 ? 's' : ''}`;

    // Overall Course Progress
    const totalTopics = (typeof TOPICS_DATA !== "undefined") ? TOPICS_DATA.length : 5;
    const completedCount = state.completedTopics.length;
    const progressPercent = Math.min(100, Math.round((completedCount / totalTopics) * 100));

    const progressFill = document.getElementById("header-progress-fill");
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const progressText = document.getElementById("header-progress-text");
    if (progressText) progressText.textContent = `${progressPercent}% Complete (${completedCount}/${totalTopics})`;
  },

  awardXP(amount, reason = "Great Job!") {
    const state = StorageManager.updateXP(amount);
    this.updateHeaderUI();
    this.showToast(`+${amount} XP: ${reason}`, "xp");
  },

  checkBadge(badgeId) {
    const wasUnlocked = StorageManager.unlockBadge(badgeId);
    if (wasUnlocked) {
      const badge = BADGES_DEFINITIONS.find(b => b.id === badgeId);
      if (badge) {
        this.showToast(`🏆 Badge Unlocked: ${badge.name}!`, "badge");
        this.awardXP(50, `Badge Bonus (${badge.name})`);
      }
      this.checkCourseCompletionBadge();
    }
  },

  checkCourseCompletionBadge() {
    const state = StorageManager.getState();
    const totalTopics = (typeof TOPICS_DATA !== "undefined") ? TOPICS_DATA.length : 5;
    if (state.completedTopics.length >= totalTopics) {
      this.checkBadge("course_champion");
    }
  },

  showToast(message, type = "xp") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type === "badge" ? "badge-toast" : "xp-toast"}`;
    toast.innerHTML = `
      <span style="font-size: 1.2rem;">${type === "badge" ? "🏆" : "✨"}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

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
  },

  renderBadgesGrid() {
    const grid = document.getElementById("badges-modal-grid");
    if (!grid) return;

    const state = StorageManager.getState();
    grid.innerHTML = BADGES_DEFINITIONS.map(badge => {
      const isUnlocked = state.unlockedBadges.includes(badge.id);
      return `
        <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon-circle">${badge.icon}</div>
          <div class="badge-name">${badge.name}</div>
          <div class="badge-desc">${badge.description}</div>
          <div class="badge-status-tag ${isUnlocked ? 'unlocked-tag' : 'locked-tag'}">
            ${isUnlocked ? '✅ Unlocked' : '🔒 Locked'}
          </div>
        </div>
      `;
    }).join("");
  }
};
