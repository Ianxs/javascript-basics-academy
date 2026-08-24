/* ==========================================================================
   LOCAL STORAGE STATE MANAGER
   Persists course progress, XP, completed quizzes, badges, and streaks
   ========================================================================== */

const STORAGE_KEY = "js_basics_academy_state_v1";

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  streak: 1,
  lastActiveDate: new Date().toISOString().split("T")[0],
  completedTopics: [],
  quizScores: {},       // { topicId: scorePercentage }
  unlockedBadges: [],
  hasRunCode: false
};

const StorageManager = {
  getState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveState(DEFAULT_STATE);
        return { ...DEFAULT_STATE };
      }
      return { ...DEFAULT_STATE, ...JSON.parse(data) };
    } catch (e) {
      console.warn("LocalStorage unavailable, using in-memory state:", e);
      return { ...DEFAULT_STATE };
    }
  },

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save to LocalStorage:", e);
    }
  },

  updateXP(amount) {
    const state = this.getState();
    state.xp = Math.max(0, state.xp + amount);
    state.level = Math.floor(state.xp / 150) + 1;
    this.saveState(state);
    return state;
  },

  markTopicCompleted(topicId) {
    const state = this.getState();
    if (!state.completedTopics.includes(topicId)) {
      state.completedTopics.push(topicId);
      this.saveState(state);
    }
    return state;
  },

  saveQuizScore(topicId, scorePercentage) {
    const state = this.getState();
    state.quizScores[topicId] = scorePercentage;
    this.saveState(state);
    return state;
  },

  unlockBadge(badgeId) {
    const state = this.getState();
    if (!state.unlockedBadges.includes(badgeId)) {
      state.unlockedBadges.push(badgeId);
      this.saveState(state);
      return true; // Newly unlocked!
    }
    return false;
  },

  setHasRunCode() {
    const state = this.getState();
    state.hasRunCode = true;
    this.saveState(state);
    return state;
  },

  checkAndUpdateStreak() {
    const state = this.getState();
    const today = new Date().toISOString().split("T")[0];
    
    if (state.lastActiveDate !== today) {
      const lastDate = new Date(state.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        state.streak += 1;
      } else if (diffDays > 1) {
        state.streak = 1; // Reset streak if missed days
      }
      state.lastActiveDate = today;
      this.saveState(state);
    }
    return state.streak;
  },

  resetAllProgress() {
    localStorage.removeItem(STORAGE_KEY);
    return { ...DEFAULT_STATE };
  }
};
