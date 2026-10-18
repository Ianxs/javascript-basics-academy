/* ==========================================================================
   SESSION SINGLETON
   Patterns: Session Singleton · Factory Singleton
   --------------------------------------------------------------------------
   getSession() is a factory function that ALWAYS returns the same object.
   The session owns the persisted JWT token + cached user profile.
   ========================================================================== */

import config from "../core/config.js";
import Logger from "../core/logger.js";

let sessionInstance = null;

function createSession() {
  const log = Logger.getInstance();

  const read = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const write = (key, value) => {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (err) {
      log.warn("Session storage unavailable:", err.message);
    }
  };

  return {
    getToken: () => read(config.TOKEN_KEY),
    setToken: (token) => write(config.TOKEN_KEY, token),

    getUser() {
      const raw = read(config.USER_KEY);
      try { return raw ? JSON.parse(raw) : null; } catch { return null; }
    },
    setUser: (user) => write(config.USER_KEY, user ? JSON.stringify(user) : null),

    hasToken() { return Boolean(this.getToken()); },

    clear() {
      write(config.TOKEN_KEY, null);
      write(config.USER_KEY, null);
    }
  };
}

export function getSession() {
  if (!sessionInstance) sessionInstance = createSession();
  return sessionInstance;
}
