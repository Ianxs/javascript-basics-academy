/* ==========================================================================
   PROGRESS STATE SHAPE + MERGE RULES (pure functions, no side effects)
   ========================================================================== */

import config from "../core/config.js";

export const today = () => new Date().toISOString().split("T")[0];

export function createDefaultState() {
  return {
    xp: 0,
    level: 1,
    streak: 1,
    lastActiveDate: today(),
    completedTopics: [],
    quizScores: {},       // { [topicId]: scorePercentage }
    unlockedBadges: [],
    hasRunCode: false
  };
}

export const levelForXp = (xp) => Math.floor(xp / config.XP_PER_LEVEL) + 1;

/** Fills missing fields so older saved data never breaks the app. */
export function normalizeState(raw) {
  const base = createDefaultState();
  if (!raw || typeof raw !== "object") return base;
  return {
    ...base,
    ...raw,
    completedTopics: Array.isArray(raw.completedTopics) ? [...raw.completedTopics] : [],
    unlockedBadges: Array.isArray(raw.unlockedBadges) ? [...raw.unlockedBadges] : [],
    quizScores: raw.quizScores && typeof raw.quizScores === "object" ? { ...raw.quizScores } : {}
  };
}

/**
 * Merges guest (local) progress with account (remote) progress on login.
 * - Higher XP wins (level is recalculated from it)
 * - Higher score wins per quiz
 * - Completed topics / unlocked badges: union of both
 * - hasRunCode: true if either side is true
 * - Streak: taken from whichever side was active most recently; on a tie the
 *   longer streak wins. This avoids pairing a stale streak with a newer date.
 */
export function mergeStates(localState, remoteState) {
  const local = normalizeState(localState);
  if (!remoteState) return local;
  const remote = normalizeState(remoteState);

  const xp = Math.max(local.xp, remote.xp);

  const quizScores = { ...local.quizScores };
  for (const [quizId, score] of Object.entries(remote.quizScores)) {
    quizScores[quizId] = Math.max(Number(quizScores[quizId]) || 0, Number(score) || 0);
  }

  let streak;
  let lastActiveDate;
  if (local.lastActiveDate === remote.lastActiveDate) {
    streak = Math.max(local.streak, remote.streak);
    lastActiveDate = local.lastActiveDate;
  } else if (local.lastActiveDate > remote.lastActiveDate) {
    ({ streak, lastActiveDate } = local);
  } else {
    ({ streak, lastActiveDate } = remote);
  }

  return {
    xp,
    level: levelForXp(xp),
    streak,
    lastActiveDate,
    completedTopics: [...new Set([...local.completedTopics, ...remote.completedTopics])],
    quizScores,
    unlockedBadges: [...new Set([...local.unlockedBadges, ...remote.unlockedBadges])],
    hasRunCode: local.hasRunCode || remote.hasRunCode
  };
}
