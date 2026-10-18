/* ==========================================================================
   AUTHENTICATION SINGLETON
   Patterns: Authentication Singleton · Module Singleton
   --------------------------------------------------------------------------
   The class is instantiated ONCE below and only that instance is exported,
   so the whole app shares one source of truth for "who is logged in".
   It contains no DOM code; the UI lives in ui/auth-ui.js and reacts to
   EVENTS.AUTH_CHANGED.
   ========================================================================== */

import ApiClient from "./api-client.js";
import { getSession } from "./session.js";
import EventBus, { EVENTS } from "../core/event-bus.js";
import Logger from "../core/logger.js";

class AuthService {
  #currentUser = null;
  #api = ApiClient.getInstance();
  #session = getSession();
  #log = Logger.getInstance();

  get currentUser() { return this.#currentUser; }
  isAuthenticated() { return this.#currentUser !== null; }

  /** Restores a previous session from the stored JWT (called on page load). */
  async restoreSession() {
    if (!this.#session.hasToken()) return null;
    try {
      const user = await this.#api.me();
      this.#setUser(user, "restore");
      return user;
    } catch (err) {
      // Expired token or backend offline -> continue as guest, never crash.
      this.#log.warn("Session restore failed, continuing as guest:", err.message);
      if (err.status === 401) this.#session.clear();
      return null;
    }
  }

  async register(email, password) {
    const data = await this.#api.register(email, password);
    return this.#acceptToken(data, "register");
  }

  async login(email, password) {
    const data = await this.#api.login(email, password);
    return this.#acceptToken(data, "login");
  }

  logout() {
    this.#session.clear();
    this.#currentUser = null;
    EventBus.emit(EVENTS.AUTH_CHANGED, { user: null, reason: "logout" });
  }

  #acceptToken(data, reason) {
    this.#session.setToken(data.access_token);
    this.#setUser(data.user, reason);
    return data.user;
  }

  #setUser(user, reason) {
    this.#currentUser = user;
    this.#session.setUser(user);
    this.#log.debug(`Authenticated (${reason}):`, user.email);
    EventBus.emit(EVENTS.AUTH_CHANGED, { user, reason });
  }
}

const authService = new AuthService();
export default authService;
