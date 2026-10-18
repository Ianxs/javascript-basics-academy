/* ==========================================================================
   INTERACTIVE QUIZ ENGINE
   Uses Quiz Question Factory and connects to StateManager and GamificationService.
   ========================================================================== */

import QuizQuestionFactory from "../factories/quiz-factory.js";
import stateManager from "../services/state-manager.js";
import gamificationService from "../services/gamification-service.js";
import config from "../core/config.js";

const TOPIC_BADGE_MAP = {
  variables: "var_master",
  datatypes: "type_detective",
  functions: "func_wizard",
  arrays: "array_ace",
  objects: "object_overlord",
  factories: "factory_pro",
  singletons: "singleton_sage"
};

export default class QuizEngine {
  static render(topicId, container, quizzesData) {
    if (!container) return;

    const quizData = quizzesData ? quizzesData[topicId] : null;
    if (!quizData) {
      container.innerHTML = `<p style="color: var(--text-dim); margin-top: var(--space-md);">No quiz available for this topic yet.</p>`;
      return;
    }

    const state = stateManager.getState();
    const savedScore = state.quizScores[topicId];

    container.innerHTML = `
      <section class="quiz-section" id="quiz-container-${topicId}">
        <div class="quiz-header">
          <div class="quiz-title-group">
            <h3><span>📝</span> ${quizData.title}</h3>
            <p>Test your understanding to earn XP, unlock achievements, and mark this topic complete!</p>
          </div>
          ${savedScore !== undefined ? `
            <div class="quiz-score-badge">
              <span>🎯 Best Score:</span> <strong>${savedScore}%</strong>
            </div>
          ` : `
            <div class="quiz-score-badge">
              <span>⚡ Reward:</span> <strong>+${quizData.xpReward} XP</strong>
            </div>
          `}
        </div>

        <form id="quiz-form-${topicId}" class="quiz-questions-list">
          ${quizData.questions.map((q, idx) => QuizQuestionFactory.createQuestionHtml(q, idx)).join("")}

          <div class="quiz-actions">
            <button type="button" class="btn btn-secondary" id="btn-retake-${topicId}" style="display: none;">
              🔄 Retake Quiz
            </button>
            <button type="submit" class="btn btn-accent btn-lg" id="btn-submit-${topicId}">
              Submit Answers &amp; Check Score
            </button>
          </div>
        </form>
      </section>
    `;

    this.#bindEvents(topicId, quizData, quizzesData);
  }

  static #bindEvents(topicId, quizData, quizzesData) {
    const form = document.getElementById(`quiz-form-${topicId}`);
    const retakeBtn = document.getElementById(`btn-retake-${topicId}`);
    const submitBtn = document.getElementById(`btn-submit-${topicId}`);

    if (!form) return;

    form.querySelectorAll(".quiz-option-label").forEach(label => {
      label.addEventListener("click", () => {
        const radio = label.querySelector("input[type='radio']");
        const name = radio.name;
        form.querySelectorAll(`input[name='${name}']`).forEach(r => {
          r.closest(".quiz-option-label")?.classList.remove("selected");
        });
        label.classList.add("selected");
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let correctCount = 0;
      const totalQuestions = quizData.questions.length;

      quizData.questions.forEach((q) => {
        const selectedRadio = form.querySelector(`input[name="question-${q.id}"]:checked`);
        const explanationEl = document.getElementById(`exp-${q.id}`);
        const userChoice = selectedRadio ? parseInt(selectedRadio.value, 10) : -1;

        q.options.forEach((_, optIndex) => {
          const optLabel = document.getElementById(`label-${q.id}-${optIndex}`);
          optLabel?.classList.remove("correct", "incorrect");
        });

        const correctLabel = document.getElementById(`label-${q.id}-${q.correctIndex}`);
        correctLabel?.classList.add("correct");

        if (userChoice === q.correctIndex) {
          correctCount++;
          if (explanationEl) {
            explanationEl.className = "question-explanation visible correct-exp";
            explanationEl.innerHTML = `<strong>✅ Correct!</strong> ${q.explanation}`;
          }
        } else {
          if (userChoice !== -1) {
            const wrongLabel = document.getElementById(`label-${q.id}-${userChoice}`);
            wrongLabel?.classList.add("incorrect");
          }
          if (explanationEl) {
            explanationEl.className = "question-explanation visible incorrect-exp";
            explanationEl.innerHTML = `<strong>❌ Not quite.</strong> ${q.explanation}`;
          }
        }

        form.querySelectorAll(`input[name="question-${q.id}"]`).forEach(r => r.disabled = true);
      });

      const scorePercent = Math.round((correctCount / totalQuestions) * 100);

      // Save state
      stateManager.saveQuizScore(topicId, scorePercent);
      stateManager.markTopicCompleted(topicId);

      // Badge checks
      if (TOPIC_BADGE_MAP[topicId]) {
        gamificationService.checkBadge(TOPIC_BADGE_MAP[topicId]);
      }

      if (scorePercent === 100) {
        gamificationService.checkBadge("perfect_score");
        gamificationService.awardXP(config.XP.QUIZ_PERFECT, `Perfect Score (${correctCount}/${totalQuestions})!`);
      } else {
        gamificationService.awardXP(config.XP.QUIZ_COMPLETE, `Quiz Completed (${correctCount}/${totalQuestions})`);
      }

      submitBtn.style.display = "none";
      retakeBtn.style.display = "inline-flex";
    });

    retakeBtn?.addEventListener("click", () => {
      this.render(topicId, document.getElementById(`quiz-section-wrapper-${topicId}`), quizzesData);
    });
  }
}
