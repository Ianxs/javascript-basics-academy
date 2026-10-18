/* ==========================================================================
   NAVIGATION & ROUTING MANAGER (ES Module)
   Sidebar rendering, hash navigation, mobile drawer, and progress reset modal
   ========================================================================== */

import stateManager from "../services/state-manager.js";
import gamificationService from "../services/gamification-service.js";
import ContentRenderer from "./content-renderer.js";
import EventBus, { EVENTS } from "../core/event-bus.js";
import { showToast } from "../factories/toast-factory.js";

class NavigationManager {
  currentTopicId = null;
  topics = [];
  quizzes = null;
  #viewedThisSession = new Set();

  init({ topics = [], quizzes = null } = {}) {
    this.topics = topics;
    this.quizzes = quizzes;

    this.renderSidebar();
    this.setupHashListener();
    this.setupMobileMenu();
    this.setupResetModal();

    // Keep sidebar tick marks synchronized with state changes
    EventBus.on(EVENTS.STATE_CHANGED, () => this.updateSidebarTopicStatus());
    EventBus.on(EVENTS.STATE_RESET, () => {
      this.#viewedThisSession.clear();
      this.renderSidebar();
      if (this.topics.length > 0) {
        this.setActiveTopic(this.topics[0].id);
      }
    });
  }

  renderSidebar() {
    const navList = document.getElementById("sidebar-topics-list");
    if (!navList || !this.topics.length) return;

    const state = stateManager.getState();

    navList.innerHTML = this.topics.map((topic) => {
      const isCompleted = state.completedTopics.includes(topic.id);
      return `
        <li>
          <a href="#${topic.id}" class="topic-nav-item" id="nav-item-${topic.id}" data-topic="${topic.id}">
            <div class="topic-item-left">
              <span class="topic-num">${topic.number}</span>
              <span>${topic.icon || ''} ${topic.title}</span>
            </div>
            <span class="topic-status-icon ${isCompleted ? 'completed' : ''}" id="status-icon-${topic.id}">
              ${isCompleted ? '✓' : '○'}
            </span>
          </a>
        </li>
      `;
    }).join("");
  }

  updateSidebarTopicStatus() {
    const state = stateManager.getState();
    this.topics.forEach(topic => {
      const icon = document.getElementById(`status-icon-${topic.id}`);
      if (icon) {
        const isCompleted = state.completedTopics.includes(topic.id);
        icon.className = `topic-status-icon ${isCompleted ? 'completed' : ''}`;
        icon.textContent = isCompleted ? '✓' : '○';
      }
    });
  }

  setActiveTopic(topicId) {
    if (!this.topics.length) return;
    const topic = this.topics.find(t => t.id === topicId) || this.topics[0];
    this.currentTopicId = topic.id;

    // Update active class in sidebar
    document.querySelectorAll(".topic-nav-item").forEach(item => {
      item.classList.remove("active");
    });
    const activeItem = document.getElementById(`nav-item-${topic.id}`);
    if (activeItem) activeItem.classList.add("active");

    // Render topic in main view
    const mainContainer = document.getElementById("main-topic-view");
    ContentRenderer.renderTopic(topic, mainContainer, this.topics, this.quizzes);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile drawer if open
    this.closeMobileDrawer();

    // Award read XP only on the first view of each topic this session
    if (!this.#viewedThisSession.has(topic.id)) {
      this.#viewedThisSession.add(topic.id);
      stateManager.addXP(10);
      gamificationService.updateHeaderUI();
    }
  }

  setupHashListener() {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && this.topics.some(t => t.id === hash)) {
        this.setActiveTopic(hash);
      } else if (this.topics.length > 0) {
        window.location.hash = `#${this.topics[0].id}`;
      }
    };

    window.addEventListener("hashchange", handleHash);
    handleHash();
  }

  setupMobileMenu() {
    const toggleBtn = document.getElementById("menu-toggle-btn");
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        if (backdrop) backdrop.classList.toggle("open");
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", () => {
        this.closeMobileDrawer();
      });
    }
  }

  closeMobileDrawer() {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  }

  setupResetModal() {
    const resetBtn = document.getElementById("reset-all-btn");
    const resetModal = document.getElementById("reset-confirm-modal");
    const confirmBtn = document.getElementById("confirm-reset-action");
    const cancelBtn = document.getElementById("cancel-reset-action");

    if (resetBtn && resetModal) {
      resetBtn.addEventListener("click", () => resetModal.classList.add("active"));
    }

    if (cancelBtn && resetModal) {
      cancelBtn.addEventListener("click", () => resetModal.classList.remove("active"));
    }

    if (confirmBtn && resetModal) {
      confirmBtn.addEventListener("click", () => {
        resetModal.classList.remove("active");
        // The STATE_RESET event (emitted by stateManager) re-renders the sidebar and first topic
        stateManager.resetAllProgress().then(() => {
          showToast("All course progress has been reset!", "xp");
        });
      });
    }
  }
}

const navigation = new NavigationManager();
export default navigation;
