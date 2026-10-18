/* ==========================================================================
   STATE MANAGER SINGLETON
   Patterns: State Manager Singleton · Module Singleton · (uses) Storage Factory
   --------------------------------------------------------------------------
   Single source of truth for learner progress (replaces the old
   StorageManager).
   - Keeps state in memory, so reads no longer re-parse localStorage each time.
   - Always persists to the "local" strategy (guest mode + resilience).
   - When a user is logged in, ALSO persists to the "backend" strategy
     (PostgreSQL), which becomes the persistent source of truth.
   - Emits EVENTS.STATE_CHANGED so UI modules can re-render themselves.
   ========================================================================== */

import EventBus, { EVENTS } from "../core/event-bus.js";
import Logger from "../core/logger.js";
import StorageFactory from "../storage/storage-factory.js";
import {
  createDefaultState, normalizeState, mergeStates, levelForXp, today
} from "../storage/progress-state.js";

class StateManager {
  #state;
  #local = StorageFactory.create("local");
  #remote = null; // BackendStorageStrategy while logged in, otherwise null
  #log = Logger.getInstance();

  constructor() {
    const saved = this.#local.load();
    this.#state = normalizeState(saved);
    if (!saved) this.#local.save(this.#state);
  }

  /** Returns a copy, so callers can't accidentally mutate shared state. */
  getState() {
    return structuredClone(this.#state);
  }

  get isSyncingToBackend() {
    return this.#remote !== null;
  }

  // ---------------------------------------------------------------- writes
  #commit(nextState, { syncRemote = true } = {}) {
    this.#state = nextState;
    this.#local.save(nextState);
    if (syncRemote && this.#remote) this.#remote.save(nextState);
    EventBus.emit(EVENTS.STATE_CHANGED, this.getState());
  }

  #update(mutator) {
    const next = this.getState();
    mutator(next);
    this.#commit(next);
    return this.getState();
  }

  addXP(amount) {
    return this.#update((s) => {
      s.xp = Math.max(0, s.xp + amount);
      s.level = levelForXp(s.xp);
    });
  }

  markTopicCompleted(topicId) {
    if (this.#state.completedTopics.includes(topicId)) return this.getState();
    return this.#update((s) => { s.completedTopics.push(topicId); });
  }

  saveQuizScore(topicId, scorePercentage) {
    return this.#update((s) => { s.quizScores[topicId] = scorePercentage; });
  }

  /** @returns {boolean} true only when the badge was newly unlocked */
  unlockBadge(badgeId) {
    if (this.#state.unlockedBadges.includes(badgeId)) return false;
    this.#update((s) => { s.unlockedBadges.push(badgeId); });
    return true;
  }

  setHasRunCode() {
    if (this.#state.hasRunCode) return this.getState();
    return this.#update((s) => { s.hasRunCode = true; });
  }

  checkAndUpdateStreak() {
    const current = today();
    if (this.#state.lastActiveDate === current) return this.#state.streak;

    const diffDays = Math.round(
      (new Date(current) - new Date(this.#state.lastActiveDate)) / 86_400_000
    );
    return this.#update((s) => {
      if (diffDays === 1) s.streak += 1;
      else if (diffDays > 1) s.streak = 1; // missed a day -> streak resets
      s.lastActiveDate = current;
    }).streak;
  }

  /** Guests: clears localStorage. Logged-in users: also clears PostgreSQL rows. */
  async reset() {
    const fresh = createDefaultState();
    this.#local.clear();
    if (this.#remote) {
      try {
        await this.#remote.clear();
      } catch (err) {
        this.#log.warn("Backend reset failed:", err.message);
      }
    }
    this.#commit(fresh, { syncRemote: false });
    EventBus.emit(EVENTS.STATE_RESET, this.getState());
  }

  resetAllProgress() {
    return this.reset();
  }

  updateXP(amount) {
    return this.addXP(amount);
  }

  // ------------------------------------------------------ backend syncing
  /**
   * Called after login/register/session restore:
   * read local -> read PostgreSQL -> merge -> save to both -> notify UI.
   * Local progress is never deleted during this process.
   */
  async connectBackend() {
    this.#remote = StorageFactory.create("backend");
    try {
      const remoteState = await this.#remote.load();
      const merged = mergeStates(this.#state, remoteState);
      this.#commit(merged, { syncRemote: false });
      await this.#remote.saveNow(merged);
      this.#log.debug("Local and PostgreSQL progress merged.");
    } catch (err) {
      this.#log.warn("Could not load PostgreSQL progress; keeping local progress:", err.message);
    }
  }

  /** Called on logout: stop syncing, keep local data for guest mode. */
  disconnectBackend() {
    this.#remote?.cancelPending();
    this.#remote = null;
  }
}

const stateManager = new StateManager();
export default stateManager;
