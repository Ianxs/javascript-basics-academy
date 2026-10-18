/* ==========================================================================
   SANDBOXED CODE EXECUTION RUNNER
   Uses Console Output Factory to format output safely.
   ========================================================================== */

import { createConsoleEntry } from "../factories/console-output-factory.js";
import { escapeHtml } from "../utils/html.js";
import stateManager from "../services/state-manager.js";
import gamificationService from "../services/gamification-service.js";
import config from "../core/config.js";

export default class CodeRunner {
  static execute(codeString, outputElement, statusIndicator) {
    if (!outputElement) return;

    outputElement.innerHTML = "";
    if (statusIndicator) {
      statusIndicator.className = "status-dot running";
    }

    const logs = [];
    let syncPhaseDone = false;
    // Each run gets a token so late logs from an older run don't leak into a newer one
    const runToken = Symbol("run");
    outputElement.__runToken = runToken;

    const rowHtml = (entry) => `
      <div class="console-row ${entry.rowClass}">
        <span class="console-prefix">&gt;</span>
        <div class="console-entry">${entry.html}</div>
      </div>
    `;

    const push = (type, args) => {
      const entry = createConsoleEntry(type, args);
      if (!syncPhaseDone) {
        logs.push(entry);
        return;
      }
      // Async output (setTimeout, Promises): append live
      if (outputElement.__runToken !== runToken) return;
      outputElement.querySelector(".console-empty")?.remove();
      outputElement.insertAdjacentHTML("beforeend", rowHtml(entry));
    };

    const customConsole = {
      log: (...args) => push("log", args),
      warn: (...args) => push("warn", args),
      error: (...args) => push("error", args),
      info: (...args) => push("info", args)
    };

    try {
      const runner = new Function("console", `"use strict";\n${codeString}`);
      runner(customConsole);
      syncPhaseDone = true;

      if (logs.length === 0) {
        outputElement.innerHTML = `
          <div class="console-empty">
            Code executed successfully (no console.log output produced).<br>
            <small style="color: var(--text-dim);">Tip: Add <code>console.log(variableName);</code> to see values here.</small>
          </div>
        `;
      } else {
        outputElement.innerHTML = logs.map(rowHtml).join("");
      }

      if (statusIndicator) {
        statusIndicator.className = "status-dot";
      }

      // First code run reward
      const state = stateManager.getState();
      if (!state.hasRunCode) {
        stateManager.setHasRunCode();
        gamificationService.checkBadge("first_run");
        gamificationService.awardXP(config.XP.FIRST_CODE_RUN, "First Code Run");
      }

    } catch (err) {
      outputElement.innerHTML = `
        <div class="console-error">
          <strong>⛔ ${escapeHtml(err.name)}:</strong> ${escapeHtml(err.message)}
        </div>
      `;
      if (statusIndicator) {
        statusIndicator.className = "status-dot error";
      }
    }
  }
}
