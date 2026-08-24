/* ==========================================================================
   NAVIGATION & ROUTING MANAGER
   Sidebar rendering, hash navigation, mobile drawer handling
   ========================================================================== */

const Navigation = {
  currentTopicId: null,

  init() {
    this.renderSidebar();
    this.setupHashListener();
    this.setupMobileMenu();
    this.setupResetModal();
  },

  renderSidebar() {
    const navList = document.getElementById("sidebar-topics-list");
    if (!navList) return;

    const state = StorageManager.getState();

    navList.innerHTML = TOPICS_DATA.map((topic) => {
      const isCompleted = state.completedTopics.includes(topic.id);
      return `
        <li>
          <a href="#${topic.id}" class="topic-nav-item" id="nav-item-${topic.id}" data-topic="${topic.id}">
            <div class="topic-item-left">
              <span class="topic-num">${topic.number}</span>
              <span>${topic.title}</span>
            </div>
            <span class="topic-status-icon ${isCompleted ? 'completed' : ''}" id="status-icon-${topic.id}">
              ${isCompleted ? '✓' : '○'}
            </span>
          </a>
        </li>
      `;
    }).join("");
  },

  updateSidebarTopicStatus() {
    const state = StorageManager.getState();
    TOPICS_DATA.forEach(topic => {
      const icon = document.getElementById(`status-icon-${topic.id}`);
      if (icon) {
        const isCompleted = state.completedTopics.includes(topic.id);
        icon.className = `topic-status-icon ${isCompleted ? 'completed' : ''}`;
        icon.textContent = isCompleted ? '✓' : '○';
      }
    });
  },

  setActiveTopic(topicId) {
    const topic = TOPICS_DATA.find(t => t.id === topicId) || TOPICS_DATA[0];
    this.currentTopicId = topic.id;

    // Update active class in sidebar
    document.querySelectorAll(".topic-nav-item").forEach(item => {
      item.classList.remove("active");
    });
    const activeItem = document.getElementById(`nav-item-${topic.id}`);
    if (activeItem) activeItem.classList.add("active");

    // Render topic in main view
    const mainContainer = document.getElementById("main-topic-view");
    ContentRenderer.renderTopic(topic, mainContainer);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile drawer if open
    this.closeMobileDrawer();

    // Award read XP on first view
    StorageManager.updateXP(10);
    GamificationEngine.updateHeaderUI();
  },

  setupHashListener() {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && TOPICS_DATA.some(t => t.id === hash)) {
        this.setActiveTopic(hash);
      } else {
        // Default to first topic
        window.location.hash = `#${TOPICS_DATA[0].id}`;
      }
    };

    window.addEventListener("hashchange", handleHash);
    handleHash();
  },

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
  },

  closeMobileDrawer() {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
  },

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
        StorageManager.resetAllProgress();
        resetModal.classList.remove("active");
        this.renderSidebar();
        GamificationEngine.updateHeaderUI();
        this.setActiveTopic(TOPICS_DATA[0].id);
        GamificationEngine.showToast("All course progress has been reset!", "xp");
      });
    }
  }
};
