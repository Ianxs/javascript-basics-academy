/* ==========================================================================
   CONTENT RENDERER MODULE
   Dynamically builds topic lessons, analogy cards, pattern explorers, and mounts UI
   ========================================================================== */

import EditorComponent from "./editor-component.js";
import QuizEngine from "./quiz-engine.js";
import { escapeHtml } from "../utils/html.js";
import { showToast } from "../factories/toast-factory.js";

export default class ContentRenderer {
  static formatInlineCode(str) {
    if (!str) return "";
    return str.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');
  }

  static renderTopic(topic, container, allTopics = [], quizzesData = null) {
    if (!container) return;

    // Find current index for Prev / Next links
    const currentIndex = allTopics.findIndex(t => t.id === topic.id);
    const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex >= 0 && currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

    const hasPatterns = Array.isArray(topic.patternsList) && topic.patternsList.length > 0;

    container.innerHTML = `
      <article class="content-article animate-fade">
        <!-- Topic Header -->
        <header class="topic-header">
          <div class="topic-meta">
            <span class="badge-pill beginner">${escapeHtml(topic.badge)}</span>
            <span class="badge-pill analogy-badge">⏱️ ${escapeHtml(topic.estimatedTime)}</span>
          </div>
          <h1 class="topic-title">${topic.icon} ${escapeHtml(topic.title)}</h1>
          <p class="topic-description">${escapeHtml(topic.subtitle)}</p>
        </header>

        <!-- Plain English Definition Callout -->
        <div class="callout tip">
          <div class="callout-icon">💡</div>
          <div class="callout-body">
            <div class="callout-title">Plain-English Definition</div>
            <p>${escapeHtml(topic.definition)}</p>
          </div>
        </div>

        <!-- Real-World Analogy Showcase -->
        <section class="analogy-showcase">
          <div class="analogy-header">
            <div class="analogy-icon-wrapper">${topic.analogy.icon}</div>
            <div class="analogy-title-group">
              <h3>${escapeHtml(topic.analogy.title)}</h3>
              <p>${escapeHtml(topic.analogy.subtitle)}</p>
            </div>
          </div>
          <p class="analogy-content">${escapeHtml(topic.analogy.description)}</p>

          <div class="analogy-grid">
            ${topic.analogy.items.map(item => `
              <div class="analogy-item">
                <div class="analogy-item-title">
                  <span>📌</span> ${escapeHtml(item.label)}
                </div>
                <div class="analogy-item-desc">${escapeHtml(item.desc)}</div>
              </div>
            `).join("")}
          </div>
        </section>

        <!-- Conceptual Lesson Sections -->
        ${topic.sections.map(section => `
          <section class="lesson-section">
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
            <div class="concept-card">
              <div>${section.content}</div>

              ${section.table ? `
                <div class="table-wrapper">
                  <table class="styled-table">
                    <thead>
                      <tr>
                        ${section.table.headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}
                      </tr>
                    </thead>
                    <tbody>
                      ${section.table.rows.map(row => `
                        <tr>
                          ${row.map(cell => `<td>${cell}</td>`).join("")}
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              ` : ''}

              ${section.codeExample ? `
                <pre class="question-code-snippet"><code>${escapeHtml(section.codeExample)}</code></pre>
              ` : ''}
            </div>
          </section>
        `).join("")}

        <!-- Interactive Pattern Explorer (For Factories & Singletons) -->
        ${hasPatterns ? this.renderPatternExplorerHtml(topic) : ""}

        <!-- Key Takeaways Callout -->
        <div class="callout analogy">
          <div class="callout-icon">⭐</div>
          <div class="callout-body">
            <div class="callout-title">Key Takeaways &amp; Golden Rules</div>
            <ul style="padding-left: 20px; margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
              ${topic.keyTakeaways.map(k => `<li>${this.formatInlineCode(k)}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Live Try-It-Yourself Code Runner Section -->
        <section class="lesson-section" id="section-playground-${topic.id}">
          <h2 class="section-title">💻 Try It Yourself: Live Code Playground</h2>
          <p style="color: var(--text-muted);">
            Test and modify the code below. Run it live in your browser to see how JavaScript computes values!
          </p>
          <div id="editor-wrapper-${topic.id}"></div>
        </section>

        <!-- Topic Mastery Quiz Section -->
        <div id="quiz-section-wrapper-${topic.id}"></div>

        <!-- Bottom Lesson Navigation (Previous / Next) -->
        <nav class="lesson-nav-bar" aria-label="Topic Navigation">
          ${prevTopic ? `
            <a href="#${prevTopic.id}" class="lesson-nav-btn prev">
              <span class="nav-direction-label">← Previous Topic</span>
              <span class="nav-topic-name">${prevTopic.icon} ${escapeHtml(prevTopic.title)}</span>
            </a>
          ` : `<div></div>`}

          ${nextTopic ? `
            <a href="#${nextTopic.id}" class="lesson-nav-btn next">
              <span class="nav-direction-label">Next Topic →</span>
              <span class="nav-topic-name">${nextTopic.icon} ${escapeHtml(nextTopic.title)}</span>
            </a>
          ` : `
            <a href="#variables" class="lesson-nav-btn next">
              <span class="nav-direction-label">Course Finished 👑</span>
              <span class="nav-topic-name">Review from Start →</span>
            </a>
          `}
        </nav>
      </article>
    `;

    // Mount Code Editor
    const editorWrapper = document.getElementById(`editor-wrapper-${topic.id}`);
    if (editorWrapper) {
      EditorComponent.create(topic, editorWrapper);
    }

    // Mount Quiz
    const quizWrapper = document.getElementById(`quiz-section-wrapper-${topic.id}`);
    if (quizWrapper) {
      QuizEngine.render(topic.id, quizWrapper, quizzesData);
    }

    // Initialize Pattern Explorer Event Handlers if present
    if (hasPatterns) {
      this.attachPatternExplorerEvents(topic);
    }
  }

  static renderPatternExplorerHtml(topic) {
    const patterns = topic.patternsList;
    const initial = patterns[0];

    return `
      <section class="lesson-section">
        <div class="pattern-explorer-container">
          <div class="pattern-explorer-header">
            <div>
              <div class="pattern-explorer-title">
                <span>🧩</span> 20 Variations of the ${escapeHtml(topic.title)}
              </div>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
                Click any variation below to inspect its mechanism, signature, and load its live runnable code!
              </p>
            </div>
            <span class="pattern-count-badge">${patterns.length} Variations</span>
          </div>

          <!-- 20 Pattern Chips Grid -->
          <div class="pattern-chips-grid" id="pattern-chips-grid-${topic.id}" role="tablist">
            ${patterns.map((p, idx) => `
              <button
                type="button"
                class="pattern-chip-btn ${idx === 0 ? 'active' : ''}"
                data-pattern-id="${p.id}"
                id="chip-${topic.id}-${p.id}"
                role="tab"
                title="${escapeHtml(p.name)}"
              >
                ${escapeHtml(p.name)}
              </button>
            `).join("")}
          </div>

          <!-- Active Pattern Detail Card -->
          <div class="pattern-detail-card" id="pattern-detail-${topic.id}">
            <div class="pattern-detail-header">
              <div class="pattern-detail-name" id="pattern-title-${topic.id}">
                ${escapeHtml(initial.name)}
              </div>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                id="btn-load-pattern-${topic.id}"
                title="Load this variation into the code editor below"
              >
                ▶ Load into Playground
              </button>
            </div>

            <p class="pattern-detail-desc" id="pattern-desc-${topic.id}">
              ${escapeHtml(initial.summary)}
            </p>

            <div class="pattern-detail-use" id="pattern-use-${topic.id}">
              <strong>💡 When to use:</strong> <span>${escapeHtml(initial.whenToUse)}</span>
            </div>

            <div class="pattern-code-preview-wrapper">
              <pre class="pattern-code-preview" id="pattern-code-${topic.id}">${escapeHtml(initial.code)}</pre>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  static attachPatternExplorerEvents(topic) {
    const patterns = topic.patternsList;
    let selectedPattern = patterns[0];

    const chips = document.querySelectorAll(`#pattern-chips-grid-${topic.id} .pattern-chip-btn`);
    const titleEl = document.getElementById(`pattern-title-${topic.id}`);
    const descEl = document.getElementById(`pattern-desc-${topic.id}`);
    const useEl = document.getElementById(`pattern-use-${topic.id}`);
    const codeEl = document.getElementById(`pattern-code-${topic.id}`);
    const loadBtn = document.getElementById(`btn-load-pattern-${topic.id}`);

    const updateView = (pattern) => {
      selectedPattern = pattern;
      if (titleEl) titleEl.textContent = pattern.name;
      if (descEl) descEl.textContent = pattern.summary;
      if (useEl) {
        useEl.innerHTML = `<strong>💡 When to use:</strong> <span>${escapeHtml(pattern.whenToUse)}</span>`;
      }
      if (codeEl) codeEl.textContent = pattern.code;
    };

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const found = patterns.find(p => p.id === chip.dataset.patternId);
        if (found) {
          updateView(found);
        }
      });
    });

    if (loadBtn) {
      loadBtn.addEventListener("click", () => {
        if (!selectedPattern) return;
        const textarea = document.getElementById(`textarea-${topic.id}`);
        if (textarea) {
          textarea.value = selectedPattern.code;
          // Trigger input event to recount line numbers
          textarea.dispatchEvent(new Event("input"));
          showToast(`Loaded ${selectedPattern.name} into playground!`, "xp");

          // Smoothly scroll down to the editor
          const playground = document.getElementById(`section-playground-${topic.id}`);
          if (playground) {
            playground.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    }
  }
}
