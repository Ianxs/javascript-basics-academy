/* ==========================================================================
   SANDBOXED CODE EXECUTION RUNNER
   Safely captures console output, formats data types, and catches errors
   ========================================================================== */

const CodeRunner = {
  /**
   * Executes a string of JavaScript code within an isolated scope and
   * writes all logs and errors directly to the target output container.
   */
  execute(codeString, outputElement, statusIndicator) {
    if (!outputElement) return;

    // Reset console output
    outputElement.innerHTML = "";
    if (statusIndicator) {
      statusIndicator.className = "status-dot running";
    }

    const logs = [];

    // Formatter helper for different JavaScript data types
    const formatValue = (val) => {
      if (val === null) {
        return `<span class="console-null">null</span>`;
      }
      if (val === undefined) {
        return `<span class="console-undefined">undefined</span>`;
      }
      if (typeof val === "string") {
        return `<span class="console-string">"${this.escapeHtml(val)}"</span>`;
      }
      if (typeof val === "number") {
        return `<span class="console-number">${val}</span>`;
      }
      if (typeof val === "boolean") {
        return `<span class="console-boolean">${val}</span>`;
      }
      if (Array.isArray(val)) {
        const items = val.map(item => formatValue(item)).join(", ");
        return `<span class="console-object">[ ${items} ]</span>`;
      }
      if (typeof val === "object") {
        try {
          const formatted = JSON.stringify(val, null, 2);
          return `<span class="console-object">${this.escapeHtml(formatted)}</span>`;
        } catch (e) {
          return `<span class="console-object">[Object]</span>`;
        }
      }
      if (typeof val === "function") {
        return `<span class="console-log">[Function: ${val.name || 'anonymous'}]</span>`;
      }
      return `<span class="console-log">${this.escapeHtml(String(val))}</span>`;
    };

    // Custom console implementation
    const customConsole = {
      log: (...args) => {
        const formattedArgs = args.map(arg => formatValue(arg)).join(" ");
        logs.push({ type: "log", html: formattedArgs });
      },
      warn: (...args) => {
        const formattedArgs = args.map(arg => formatValue(arg)).join(" ");
        logs.push({ type: "warn", html: `⚠️ ${formattedArgs}` });
      },
      error: (...args) => {
        const formattedArgs = args.map(arg => formatValue(arg)).join(" ");
        logs.push({ type: "error", html: `❌ ${formattedArgs}` });
      },
      info: (...args) => {
        const formattedArgs = args.map(arg => formatValue(arg)).join(" ");
        logs.push({ type: "info", html: `ℹ️ ${formattedArgs}` });
      }
    };

    let hasError = false;

    try {
      // Execute the user code inside a Function sandbox with custom console
      const runner = new Function("console", `"use strict";\n${codeString}`);
      runner(customConsole);

      if (logs.length === 0) {
        outputElement.innerHTML = `
          <div class="console-empty">
            Code executed successfully (no console.log output produced).<br>
            <small style="color: var(--text-dim);">Tip: Add <code>console.log(variableName);</code> to see values here.</small>
          </div>
        `;
      } else {
        outputElement.innerHTML = logs.map(entry => `
          <div class="console-row ${entry.type === 'error' ? 'console-error' : ''}">
            <span class="console-prefix">&gt;</span>
            <div class="console-entry">${entry.html}</div>
          </div>
        `).join("");
      }

      if (statusIndicator) {
        statusIndicator.className = "status-dot";
      }

      // Gamification Hook: First code run XP
      const state = StorageManager.getState();
      if (!state.hasRunCode) {
        StorageManager.setHasRunCode();
        GamificationEngine.checkBadge("first_run");
        GamificationEngine.awardXP(25, "First Code Run");
      }

    } catch (err) {
      hasError = true;
      outputElement.innerHTML = `
        <div class="console-error">
          <strong>⛔ ${this.escapeHtml(err.name)}:</strong> ${this.escapeHtml(err.message)}
        </div>
      `;
      if (statusIndicator) {
        statusIndicator.className = "status-dot error";
      }
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
