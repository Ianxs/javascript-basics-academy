/* ==========================================================================
   LOCAL STORAGE STRATEGY (guest mode + offline cache)
   Implements the storage strategy interface: load() · save() · clear()
   ========================================================================== */

import Logger from "../core/logger.js";

export default class LocalStorageStrategy {
  #key;
  #log = Logger.getInstance();

  constructor(storageKey) {
    this.#key = storageKey;
  }

  get name() { return "local"; }

  load() {
    try {
      const raw = localStorage.getItem(this.#key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      this.#log.warn("localStorage unavailable, using in-memory state:", err.message);
      return null;
    }
  }

  save(state) {
    try {
      localStorage.setItem(this.#key, JSON.stringify(state));
    } catch (err) {
      this.#log.warn("Could not write to localStorage:", err.message);
    }
  }

  clear() {
    try { localStorage.removeItem(this.#key); } catch { /* ignore */ }
  }
}
