/* ==========================================================================
   CODE EDITOR COMPONENT
   ========================================================================== */

import CodeRunner from "./code-runner.js";

export default class EditorComponent {
  static create(topic, container) {
    if (!container) return;

    container.innerHTML = `
      <div class="code-runner-container" id="editor-${topic.id}">
        <div class="editor-toolbar">
          <div class="editor-title-group">
            <div class="window-dots">
              <span class="window-dot red"></span>
              <span class="window-dot yellow"></span>
              <span class="window-dot green"></span>
            </div>
            <span class="editor-filename">
              <span>📄</span> ${topic.id}_practice.js
            </span>
          </div>

          <div class="editor-actions">
            <span class="editor-shortcut-hint">Ctrl + Enter to run</span>
            <button class="btn btn-secondary btn-sm" id="btn-copy-${topic.id}" title="Copy Code">
              📋 Copy
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-reset-${topic.id}" title="Reset to Starter Code">
              🔄 Reset
            </button>
            <button class="btn btn-primary btn-sm" id="btn-run-${topic.id}">
              ▶ Run Code
            </button>
          </div>
        </div>

        <div class="editor-workspace">
          <div class="editor-pane-code">
            <div class="line-numbers" id="lines-${topic.id}">1</div>
            <textarea
              class="code-textarea"
              id="textarea-${topic.id}"
              spellcheck="false"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
            >${topic.starterCode}</textarea>
          </div>

          <div class="editor-pane-output">
            <div class="output-header">
              <span>Terminal Console Output</span>
              <button class="clear-output-btn" id="btn-clear-${topic.id}">Clear</button>
            </div>
            <div class="output-console" id="console-${topic.id}">
              <div class="console-empty">Click "▶ Run Code" or press Ctrl+Enter to test this code!</div>
            </div>
          </div>
        </div>

        <div class="editor-status-bar">
          <div class="status-indicator">
            <span class="status-dot" id="status-dot-${topic.id}"></span>
            <span id="status-text-${topic.id}">Ready</span>
          </div>
          <div>JavaScript (ES6+) Sandbox</div>
        </div>
      </div>
    `;

    this.#bindEvents(topic);
  }

  static #bindEvents(topic) {
    const textarea = document.getElementById(`textarea-${topic.id}`);
    const lineNumbers = document.getElementById(`lines-${topic.id}`);
    const consoleOutput = document.getElementById(`console-${topic.id}`);
    const statusDot = document.getElementById(`status-dot-${topic.id}`);
    const runBtn = document.getElementById(`btn-run-${topic.id}`);
    const resetBtn = document.getElementById(`btn-reset-${topic.id}`);
    const copyBtn = document.getElementById(`btn-copy-${topic.id}`);
    const clearBtn = document.getElementById(`btn-clear-${topic.id}`);

    if (!textarea || !lineNumbers) return;

    const updateLineNumbers = () => {
      const lineCount = textarea.value.split("\n").length;
      lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => i + 1).join("<br>");
    };

    updateLineNumbers();

    textarea.addEventListener("input", updateLineNumbers);
    textarea.addEventListener("scroll", () => {
      lineNumbers.scrollTop = textarea.scrollTop;
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + "  " + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateLineNumbers();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    });

    const runCode = () => {
      CodeRunner.execute(textarea.value, consoleOutput, statusDot);
    };

    runBtn?.addEventListener("click", runCode);

    resetBtn?.addEventListener("click", () => {
      textarea.value = topic.starterCode;
      updateLineNumbers();
      consoleOutput.innerHTML = `<div class="console-empty">Code reset to initial state.</div>`;
    });

    copyBtn?.addEventListener("click", () => {
      navigator.clipboard.writeText(textarea.value).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "✅ Copied!";
        setTimeout(() => copyBtn.innerHTML = originalText, 1500);
      });
    });

    clearBtn?.addEventListener("click", () => {
      consoleOutput.innerHTML = `<div class="console-empty">Console cleared.</div>`;
    });
  }
}
