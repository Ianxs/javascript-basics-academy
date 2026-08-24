/* ==========================================================================
   INTERACTIVE QUIZ ENGINE
   Renders topic questions, grades answers, reveals explanations, and awards XP
   ========================================================================== */

const QuizEngine = {
  render(topicId, container) {
    if (!container) return;

    const quizData = QUIZZES_DATA[topicId];
    if (!quizData) {
      container.innerHTML = `<p style="color: var(--text-dim);">No quiz available for this topic yet.</p>`;
      return;
    }

    const state = StorageManager.getState();
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
          ${quizData.questions.map((q, qIndex) => `
            <div class="quiz-question-item" id="q-item-${q.id}">
              <div class="quiz-question-header">
                <span class="question-number-badge">Q${qIndex + 1}</span>
                <span class="question-text">${q.question}</span>
              </div>

              ${q.codeSnippet ? `
                <pre class="question-code-snippet"><code>${this.escapeHtml(q.codeSnippet)}</code></pre>
              ` : ''}

              <div class="quiz-options-grid">
                ${q.options.map((opt, optIndex) => `
                  <label class="quiz-option-label" id="label-${q.id}-${optIndex}">
                    <input
                      type="radio"
                      name="question-${q.id}"
                      value="${optIndex}"
                      class="quiz-option-input"
                      required
                    >
                    <span>${this.escapeHtml(opt)}</span>
                  </label>
                `).join("")}
              </div>

              <!-- Explanation box revealed after submit -->
              <div class="question-explanation" id="exp-${q.id}"></div>
            </div>
          `).join("")}

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

    this.bindEvents(topicId, quizData);
  },

  bindEvents(topicId, quizData) {
    const form = document.getElementById(`quiz-form-${topicId}`);
    const retakeBtn = document.getElementById(`btn-retake-${topicId}`);
    const submitBtn = document.getElementById(`btn-submit-${topicId}`);

    if (!form) return;

    // Highlight selected options on click
    form.querySelectorAll(".quiz-option-label").forEach(label => {
      label.addEventListener("click", () => {
        const radio = label.querySelector("input[type='radio']");
        const name = radio.name;
        form.querySelectorAll(`input[name='${name}']`).forEach(r => {
          r.closest(".quiz-option-label").classList.remove("selected");
        });
        label.classList.add("selected");
      });
    });

    // Form Submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let correctCount = 0;
      const totalQuestions = quizData.questions.length;

      quizData.questions.forEach((q) => {
        const selectedRadio = form.querySelector(`input[name="question-${q.id}"]:checked`);
        const explanationEl = document.getElementById(`exp-${q.id}`);
        const userChoice = selectedRadio ? parseInt(selectedRadio.value, 10) : -1;

        // Reset label styling
        q.options.forEach((_, optIndex) => {
          const optLabel = document.getElementById(`label-${q.id}-${optIndex}`);
          optLabel.classList.remove("correct", "incorrect");
        });

        // Always highlight the correct answer in green
        const correctLabel = document.getElementById(`label-${q.id}-${q.correctIndex}`);
        if (correctLabel) correctLabel.classList.add("correct");

        if (userChoice === q.correctIndex) {
          correctCount++;
          if (explanationEl) {
            explanationEl.className = "question-explanation visible correct-exp";
            explanationEl.innerHTML = `<strong>✅ Correct!</strong> ${q.explanation}`;
          }
        } else {
          if (userChoice !== -1) {
            const wrongLabel = document.getElementById(`label-${q.id}-${userChoice}`);
            if (wrongLabel) wrongLabel.classList.add("incorrect");
          }
          if (explanationEl) {
            explanationEl.className = "question-explanation visible incorrect-exp";
            explanationEl.innerHTML = `<strong>❌ Not quite.</strong> ${q.explanation}`;
          }
        }

        // Disable all inputs after grading
        form.querySelectorAll(`input[name="question-${q.id}"]`).forEach(r => r.disabled = true);
      });

      // Calculate score percentage
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);

      // Save to Storage
      StorageManager.saveQuizScore(topicId, scorePercent);
      StorageManager.markTopicCompleted(topicId);

      // Update Gamification & Badges
      const topicBadgeMap = {
        variables: "var_master",
        datatypes: "type_detective",
        functions: "func_wizard",
        arrays: "array_ace",
        objects: "object_overlord"
      };

      if (topicBadgeMap[topicId]) {
        GamificationEngine.checkBadge(topicBadgeMap[topicId]);
      }

      if (scorePercent === 100) {
        GamificationEngine.checkBadge("perfect_score");
        GamificationEngine.awardXP(100, `Perfect Score (${correctCount}/${totalQuestions})!`);
      } else {
        GamificationEngine.awardXP(50, `Quiz Completed (${correctCount}/${totalQuestions})`);
      }

      // Update UI
      GamificationEngine.updateHeaderUI();
      if (typeof Navigation !== "undefined") {
        Navigation.updateSidebarTopicStatus();
      }

      // Hide submit, show retake
      submitBtn.style.display = "none";
      retakeBtn.style.display = "inline-flex";
    });

    // Retake Button
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        this.render(topicId, document.getElementById(`quiz-section-wrapper-${topicId}`));
      });
    }
  },

  escapeHtml(str) {
    if (typeof str !== "string") str = String(str);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
