/* ==========================================================================
   AUTHENTICATION UI COMPONENT
   Binds header buttons, profile menu, and modal dialog to AuthService
   ========================================================================== */

import authService from "../services/auth-service.js";
import stateManager from "../services/state-manager.js";
import EventBus, { EVENTS } from "../core/event-bus.js";
import { showToast } from "../factories/toast-factory.js";

export default class AuthUI {
  static init() {
    this.#setupHeaderControls();
    this.#setupModal();

    // Re-render user pill whenever authentication state changes
    EventBus.on(EVENTS.AUTH_CHANGED, ({ user, reason }) => {
      if (user) {
        this.#renderUserUI(user);
        if (reason === "login" || reason === "register") {
          stateManager.connectBackend().then(() => {
            showToast(`Welcome, ${user.email.split("@")[0]}! 🐘 PostgreSQL sync active.`, "xp");
          });
        } else if (reason === "restore") {
          stateManager.connectBackend();
        }
      } else {
        stateManager.disconnectBackend();
        this.#renderGuestUI();
        if (reason === "logout") {
          showToast("Signed out. Operating in Guest mode.", "xp");
        }
      }
    });

    // Check if user is already logged in or needs guest UI
    if (authService.currentUser) {
      this.#renderUserUI(authService.currentUser);
    } else {
      this.#renderGuestUI();
    }
  }

  static #setupHeaderControls() {
    const authBtn = document.getElementById("header-auth-btn");
    const userMenu = document.getElementById("header-user-menu");
    const logoutBtn = document.getElementById("header-logout-btn");

    if (authBtn) {
      authBtn.addEventListener("click", () => {
        if (authService.isAuthenticated()) {
          userMenu?.classList.toggle("active");
        } else {
          this.openModal("signin");
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        userMenu?.classList.remove("active");
        authService.logout();
      });
    }

    document.addEventListener("click", (e) => {
      if (userMenu && !userMenu.contains(e.target) && authBtn && !authBtn.contains(e.target)) {
        userMenu.classList.remove("active");
      }
    });
  }

  static #setupModal() {
    const modal = document.getElementById("auth-modal");
    const closeBtn = document.getElementById("auth-modal-close");
    const tabSignIn = document.getElementById("auth-tab-signin");
    const tabSignUp = document.getElementById("auth-tab-signup");
    const form = document.getElementById("auth-form");
    const submitBtn = document.getElementById("auth-submit-btn");

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }

    tabSignIn?.addEventListener("click", () => this.#switchTab("signin"));
    tabSignUp?.addEventListener("click", () => this.#switchTab("signup"));

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("auth-email").value.trim();
        const password = document.getElementById("auth-password").value;
        const mode = form.getAttribute("data-mode") || "signin";

        this.#clearError();

        if (!email || !password) {
          this.#showError("Please enter both email and password.");
          return;
        }

        if (password.length < 6) {
          this.#showError("Password must be at least 6 characters long.");
          return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = mode === "signin" ? "Signing In..." : "Creating Account...";

        try {
          if (mode === "signup") {
            await authService.register(email, password);
          } else {
            await authService.login(email, password);
          }
          modal?.classList.remove("active");
          form.reset();
        } catch (err) {
          this.#showError(err.message || "Authentication failed.");
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
    }
  }

  static openModal(tab = "signin") {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;
    this.#switchTab(tab);
    this.#clearError();
    modal.classList.add("active");
    const emailInput = document.getElementById("auth-email");
    if (emailInput) setTimeout(() => emailInput.focus(), 150);
  }

  static #switchTab(tab) {
    const tabSignIn = document.getElementById("auth-tab-signin");
    const tabSignUp = document.getElementById("auth-tab-signup");
    const form = document.getElementById("auth-form");
    const submitBtn = document.getElementById("auth-submit-btn");
    const subtitle = document.getElementById("auth-modal-subtitle");

    if (!form || !submitBtn) return;
    this.#clearError();

    if (tab === "signup") {
      tabSignUp?.classList.add("active");
      tabSignIn?.classList.remove("active");
      form.setAttribute("data-mode", "signup");
      submitBtn.textContent = "Create Account & Sync Progress";
      if (subtitle) subtitle.textContent = "Create an account to save your XP, streaks, and badges to PostgreSQL.";
    } else {
      tabSignIn?.classList.add("active");
      tabSignUp?.classList.remove("active");
      form.setAttribute("data-mode", "signin");
      submitBtn.textContent = "Sign In & Sync Progress";
      if (subtitle) subtitle.textContent = "Sign in to access your saved JavaScript course progress across devices.";
    }
  }

  static #showError(msg) {
    const errorBox = document.getElementById("auth-error-box");
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.style.display = "block";
    }
  }

  static #clearError() {
    const errorBox = document.getElementById("auth-error-box");
    if (errorBox) {
      errorBox.textContent = "";
      errorBox.style.display = "none";
    }
  }

  static #renderGuestUI() {
    const authBtn = document.getElementById("header-auth-btn");
    const userMenu = document.getElementById("header-user-menu");
    if (authBtn) {
      authBtn.innerHTML = `
        <span class="auth-icon">👤</span>
        <span class="auth-label">Sign In</span>
      `;
      authBtn.title = "Sign In or Register to store progress in PostgreSQL";
      authBtn.classList.remove("logged-in");
    }
    if (userMenu) {
      userMenu.classList.remove("active");
      userMenu.style.display = "none";
    }
  }

  static #renderUserUI(user) {
    const authBtn = document.getElementById("header-auth-btn");
    const userMenu = document.getElementById("header-user-menu");
    const userEmailDisplay = document.getElementById("menu-user-email");

    const displayName = (user && user.email) ? user.email.split("@")[0] : "Learner";

    if (authBtn) {
      authBtn.innerHTML = `
        <span class="auth-avatar-pill">${displayName.charAt(0).toUpperCase()}</span>
        <span class="auth-label">${displayName}</span>
        <span class="auth-cloud-badge" title="PostgreSQL Sync Active">🐘</span>
      `;
      authBtn.title = `Signed in as ${user.email}. Click for options.`;
      authBtn.classList.add("logged-in");
    }

    if (userEmailDisplay && user) {
      userEmailDisplay.textContent = user.email;
    }
    if (userMenu) {
      userMenu.style.display = "block";
    }
  }
}
