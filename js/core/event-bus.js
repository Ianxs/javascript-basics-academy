/* ==========================================================================
   EVENT MANAGER SINGLETON
   Patterns: Event Manager Singleton · IIFE Singleton · Closure Singleton
   --------------------------------------------------------------------------
   The listener registry is hidden inside a closure created by an IIFE, so
   nothing outside this file can touch it directly. Modules communicate by
   emitting events instead of calling each other, e.g. the StateManager emits
   STATE_CHANGED and the header + sidebar re-render themselves.
   ========================================================================== */

import Logger from "./logger.js";

export const EVENTS = Object.freeze({
  STATE_CHANGED: "state:changed",
  STATE_RESET: "state:reset",
  AUTH_CHANGED: "auth:changed"
});

const EventBus = (() => {
  const listeners = new Map(); // eventName -> Set<handler>
  const log = Logger.getInstance();

  return Object.freeze({
    /** Subscribe. Returns an unsubscribe function. */
    on(eventName, handler) {
      if (!listeners.has(eventName)) listeners.set(eventName, new Set());
      listeners.get(eventName).add(handler);
      return () => this.off(eventName, handler);
    },

    off(eventName, handler) {
      listeners.get(eventName)?.delete(handler);
    },

    emit(eventName, payload) {
      listeners.get(eventName)?.forEach((handler) => {
        try {
          handler(payload);
        } catch (err) {
          log.error(`Listener for "${eventName}" failed:`, err);
        }
      });
    }
  });
})();

export default EventBus;
