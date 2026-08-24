/* ==========================================================================
   CONTENT RENDERER MODULE
   Dynamically builds topic lessons, analogy cards, tables, and nav buttons
   ========================================================================== */

const ContentRenderer = {
  renderTopic(topic, container) {
    if (!container) return;

    // Find current index for Prev / Next links
    const currentIndex = TOPICS_DATA.findIndex(t => t.id === topic.id);
    const prevTopic = currentIndex > 0 ? TOPICS_DATA[currentIndex - 1] : null;
    const nextTopic = currentIndex < TOPICS_DATA.length - 1 ? TOPICS_DATA[currentIndex + 1] : null;

    container.innerHTML = `
      <article class="content-article animate-fade">
        <!-- Topic Header -->
        <header class="topic-header">
          <div class="topic-meta">
            <span class="badge-pill beginner">${topic.badge}</span>
            <span class="badge-pill analogy-badge">⏱️ ${topic.estimatedTime}</span>
          </div>
          <h1 class="topic-title">${topic.icon} ${topic.title}</h1>
          <p class="topic-description">${topic.subtitle}</p>
        </header>

        <!-- Plain English Definition Callout -->
        <div class="callout tip">
          <div class="callout-icon">💡</div>
          <div class="callout-body">
            <div class="callout-title">Plain-English Definition</div>
            <p>${topic.definition}</p>
          </div>
        </div>

        <!-- Real-World Analogy Showcase -->
        <section class="analogy-showcase">
          <div class="analogy-header">
            <div class="analogy-icon-wrapper">${topic.analogy.icon}</div>
            <div class="analogy-title-group">
              <h3>${topic.analogy.title}</h3>
              <p>${topic.analogy.subtitle}</p>
            </div>
          </div>
          <p class="analogy-content">${topic.analogy.description}</p>

          <div class="analogy-grid">
            ${topic.analogy.items.map(item => `
              <div class="analogy-item">
                <div class="analogy-item-title">
                  <span>📌</span> ${this.escapeHtml(item.label)}
                </div>
                <div class="analogy-item-desc">${this.escapeHtml(item.desc)}</div>
              </div>
            `).join("")}
          </div>
        </section>

        <!-- Conceptual Lesson Sections -->
        ${topic.sections.map(section => `
          <section class="lesson-section">
            <h2 class="section-title">${section.title}</h2>
            <div class="concept-card">
              <div>${section.content}</div>

              ${section.table ? `
                <div class="table-wrapper">
                  <table class="styled-table">
                    <thead>
                      <tr>
                        ${section.table.headers.map(h => `<th>${this.escapeHtml(h)}</th>`).join("")}
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
                <pre class="question-code-snippet"><code>${this.escapeHtml(section.codeExample)}</code></pre>
              ` : ''}
            </div>
          </section>
        `).join("")}

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
        <section class="lesson-section">
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
              <span class="nav-topic-name">${prevTopic.icon} ${prevTopic.title}</span>
            </a>
          ` : `<div></div>`}

          ${nextTopic ? `
            <a href="#${nextTopic.id}" class="lesson-nav-btn next">
              <span class="nav-direction-label">Next Topic →</span>
              <span class="nav-topic-name">${nextTopic.icon} ${nextTopic.title}</span>
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
      QuizEngine.render(topic.id, quizWrapper);
    }
  },

  formatInlineCode(str) {
    return str.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');
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
