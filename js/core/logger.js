/* ==========================================================================
   LOGGER SINGLETON
   Patterns: Logger Singleton · Class Singleton · Static Property Singleton ·
             Static Method Singleton (getInstance) · Private Constructor-style ·
             Lazy Singleton
   --------------------------------------------------------------------------
   - The instance lives in a private static field (#instance).
   - `new Logger()` throws unless called from inside getInstance(), which
     mimics a private constructor (JavaScript has no real private constructors).
   - The instance is created lazily: only the first time someone asks for it.
   ========================================================================== */

import config from "./config.js";

const MAX_HISTORY = 200;

export default class Logger {
  static #instance = null;
  static #isInternalConstruction = false;

  #history = [];

  constructor() {
    if (!Logger.#isInternalConstruction) {
      throw new Error("Logger is a singleton. Use Logger.getInstance() instead of new Logger().");
    }
  }

  static getInstance() {
    if (!Logger.#instance) {
      Logger.#isInternalConstruction = true;
      Logger.#instance = new Logger();
      Logger.#isInternalConstruction = false;
    }
    return Logger.#instance;
  }

  #write(level, args) {
    this.#history.push({ level, time: new Date().toISOString(), message: args.join(" ") });
    if (this.#history.length > MAX_HISTORY) this.#history.shift();
    console[level](`[${config.APP_NAME}]`, ...args);
  }

  debug(...args) { if (config.DEBUG) this.#write("log", args); }
  info(...args)  { this.#write("info", args); }
  warn(...args)  { this.#write("warn", args); }
  error(...args) { this.#write("error", args); }

  /** Read-only copy of recent log entries (useful when debugging a demo). */
  getHistory() { return [...this.#history]; }
}
