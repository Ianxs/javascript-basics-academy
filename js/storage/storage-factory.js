/* ==========================================================================
   STORAGE FACTORY
   Patterns: Factory with Registration · Factory with Strategy Pattern ·
             Factory with Dependency Injection
   --------------------------------------------------------------------------
   Callers ask for a storage *type* ("local" or "backend") and receive an
   object with the same interface (load / save / clear). They never need to
   know which class was used. New storage types can be added later with
   StorageFactory.register(...) without editing this file's callers.
   ========================================================================== */

import config from "../core/config.js";
import ApiClient from "../services/api-client.js";
import LocalStorageStrategy from "./local-storage-strategy.js";
import BackendStorageStrategy from "./backend-storage-strategy.js";

const registry = new Map(); // type -> creator(options)

const StorageFactory = Object.freeze({
  register(type, creator) {
    if (typeof creator !== "function") throw new TypeError(`Creator for "${type}" must be a function.`);
    registry.set(type, creator);
  },

  create(type, options = {}) {
    const creator = registry.get(type);
    if (!creator) {
      throw new Error(`Unknown storage type "${type}". Registered: ${[...registry.keys()].join(", ")}`);
    }
    return creator(options);
  },

  types() {
    return [...registry.keys()];
  }
});

// Built-in strategies. Dependencies are injected here (overridable via options),
// which keeps the strategy classes easy to test in isolation.
StorageFactory.register("local", ({ key = config.STORAGE_KEY } = {}) =>
  new LocalStorageStrategy(key)
);

StorageFactory.register("backend", ({ api = ApiClient.getInstance(), debounceMs = config.SYNC_DEBOUNCE_MS } = {}) =>
  new BackendStorageStrategy(api, debounceMs)
);

export default StorageFactory;
