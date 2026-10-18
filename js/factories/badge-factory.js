/* ==========================================================================
   BADGE FACTORY
   Patterns: Factory with Configuration · Factory with Object Mapping
   ========================================================================== */

import { escapeHtml } from "../utils/html.js";

export const BADGES_CATALOG = Object.freeze([
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
    id: "factory_pro",
    name: "Factory Fabricator",
    icon: "🏭",
    description: "Explored and tested all 20 Factory Pattern variations.",
    criteria: "Complete Topic 6 quiz."
  },
  {
    id: "singleton_sage",
    name: "Singleton Sage",
    icon: "🔒",
    description: "Conquered all 20 Singleton Pattern variations in JavaScript.",
    criteria: "Complete Topic 7 quiz."
  },
  {
    id: "perfect_score",
    name: "Quiz Prodigy",
    icon: "🎯",
    description: "Achieved a 100% perfect score on any topic quiz.",
    criteria: "Score 100% on any quiz."
  },
  {
    id: "course_champion",
    name: "JS Basics Master",
    icon: "👑",
    description: "Finished all curriculum topics, including Design Patterns!",
    criteria: "Complete all course topics."
  }
]);

const BADGE_MAP = new Map(BADGES_CATALOG.map((b) => [b.id, b]));

export default class BadgeFactory {
  static getBadge(badgeId) {
    return BADGE_MAP.get(badgeId) ?? null;
  }

  static getAllBadges() {
    return [...BADGES_CATALOG];
  }

  static createBadgeCardHtml(badge, isUnlocked) {
    return `
      <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon-circle">${badge.icon}</div>
        <div class="badge-name">${escapeHtml(badge.name)}</div>
        <div class="badge-desc">${escapeHtml(badge.description)}</div>
        <div class="badge-status-tag ${isUnlocked ? 'unlocked-tag' : 'locked-tag'}">
          ${isUnlocked ? '✅ Unlocked' : '🔒 Locked'}
        </div>
      </div>
    `;
  }
}
