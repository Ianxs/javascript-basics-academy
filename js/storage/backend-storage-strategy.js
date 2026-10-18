/* ==========================================================================
   BACKEND STORAGE STRATEGY (logged-in users -> FastAPI -> PostgreSQL)
   Implements the storage strategy interface: load() · save() · clear()
   plus saveNow() and cancelPending() for debounced writes.
   ========================================================================== */

import Logger from "../core/logger.js";

/** API (snake_case) -> app (camelCase) */
function fromApi(data) {
  return {
    xp: data.xp,
    level: data.level,
    streak: data.streak,
    lastActiveDate: data.last_active_date,
    hasRunCode: data.has_run_code,
    completedTopics: data.completed_topics,
    quizScores: data.quiz_scores,
    unlockedBadges: data.unlocked_badges
  };
}

/** app (camelCase) -> API (snake_case) */
function toApi(state) {
  return {
    xp: Number(state.xp) || 0,
    level: Number(state.level) || 1,
    streak: Number(state.streak) || 1,
    last_active_date: String(state.lastActiveDate),
    has_run_code: Boolean(state.hasRunCode),
    completed_topics: state.completedTopics,
    quiz_scores: state.quizScores,
    unlocked_badges: state.unlockedBadges
  };
}

export default class BackendStorageStrategy {
  #api;
  #debounceMs;
  #timer = null;
  #log = Logger.getInstance();

  constructor(apiClient, debounceMs) {
    this.#api = apiClient;
    this.#debounceMs = debounceMs;
  }

  get name() { return "backend"; }

  async load() {
    return fromApi(await this.#api.getProgress());
  }

  /** Debounced: rapid XP/badge updates are batched into one PUT request. */
  save(state) {
    this.cancelPending();
    this.#timer = setTimeout(() => this.saveNow(state), this.#debounceMs);
  }

  async saveNow(state) {
    this.cancelPending();
    try {
      await this.#api.updateProgress(toApi(state));
      this.#log.debug("Progress synced to PostgreSQL.");
    } catch (err) {
      this.#log.warn("Could not sync progress to PostgreSQL:", err.message);
    }
  }

  cancelPending() {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
  }

  async clear() {
    this.cancelPending(); // a queued PUT must not re-add data after a reset
    await this.#api.resetProgress();
    this.#log.debug("PostgreSQL progress reset.");
  }
}
