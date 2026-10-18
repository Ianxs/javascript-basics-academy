/* ==========================================================================
   QUIZ QUESTION FACTORY
   Patterns: Factory Method · Simple Factory · Factory with Strategy
   --------------------------------------------------------------------------
   Encapsulates rendering and grading of different question types
   (e.g., standard multiple-choice, code snippet prediction).
   ========================================================================== */

import { escapeHtml } from "../utils/html.js";

class StandardQuestionRenderer {
  render(question, index) {
    return `
      <div class="quiz-question-item" id="q-item-${question.id}">
        <div class="quiz-question-header">
          <span class="question-number-badge">Q${index + 1}</span>
          <span class="question-text">${escapeHtml(question.question)}</span>
        </div>

        ${question.codeSnippet ? `
          <pre class="question-code-snippet"><code>${escapeHtml(question.codeSnippet)}</code></pre>
        ` : ''}

        <div class="quiz-options-grid">
          ${question.options.map((opt, optIndex) => `
            <label class="quiz-option-label" id="label-${question.id}-${optIndex}">
              <input
                type="radio"
                name="question-${question.id}"
                value="${optIndex}"
                class="quiz-option-input"
                required
              >
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join("")}
        </div>

        <div class="question-explanation" id="exp-${question.id}"></div>
      </div>
    `;
  }
}

export default class QuizQuestionFactory {
  static #renderers = new Map([
    ["standard", new StandardQuestionRenderer()]
  ]);

  static createQuestionHtml(question, index) {
    const type = question.type || "standard";
    const renderer = this.#renderers.get(type) || this.#renderers.get("standard");
    return renderer.render(question, index);
  }
}
