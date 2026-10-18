/* ==========================================================================
   API CLIENT SINGLETON
   Patterns: API Client Singleton · Class Singleton · Static Method Singleton
   --------------------------------------------------------------------------
   One shared HTTP client for the FastAPI backend. Reusing a single instance
   means one place for the base URL, auth header, and error handling.
   ========================================================================== */

import config from "../core/config.js";
import { getSession } from "./session.js";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export default class ApiClient {
  static #instance = null;

  #baseUrl;
  #session;

  constructor(baseUrl, session) {
    if (ApiClient.#instance) return ApiClient.#instance; // constructor guard
    this.#baseUrl = baseUrl;
    this.#session = session;
    ApiClient.#instance = this;
  }

  static getInstance() {
    return ApiClient.#instance ?? new ApiClient(config.API_BASE_URL, getSession());
  }

  async request(endpoint, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = this.#session.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(`${this.#baseUrl}${endpoint}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch {
      throw new ApiError(`Cannot reach the backend at ${this.#baseUrl}. Is FastAPI running?`, 0);
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const detail = data?.detail;
      const message = typeof detail === "string"
        ? detail
        : Array.isArray(detail) ? detail[0]?.msg ?? "Invalid request" : "Request failed";
      throw new ApiError(message, response.status);
    }
    return data;
  }

  // ---- Auth endpoints ----
  register(email, password) { return this.request("/api/auth/register", { method: "POST", body: { email, password } }); }
  login(email, password)    { return this.request("/api/auth/login", { method: "POST", body: { email, password } }); }
  me()                      { return this.request("/api/auth/me"); }

  // ---- Progress endpoints ----
  getProgress()             { return this.request("/api/progress"); }
  updateProgress(payload)   { return this.request("/api/progress", { method: "PUT", body: payload }); }
  resetProgress()           { return this.request("/api/progress/reset", { method: "POST" }); }
}
