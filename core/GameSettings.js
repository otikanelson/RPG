class SettingsManager {
  constructor() {
    // DOM Elements
    this.volumeSliders = document.querySelectorAll(".volume-slider");
    this.musicSliders = document.querySelectorAll(".music-slider");
    this.characterInfo = document.getElementById("characterInfo");
    this.audio = document.getElementById("background-audio");

    // Start page sidebars
    this.sidebarOverlay = document.getElementById("sidebarOverlay");
    this.settingsSidebar = document.getElementById("settingsSidebar");
    this.aboutSidebar = document.getElementById("aboutSidebar");
    this.openSettingsLink = document.getElementById("openSettings");
    this.openAboutLink = document.getElementById("openAbout");

    // Popup Elements
    this.popups = {
      settings: {
        element: document.getElementById("popup1"),
        trigger: document.querySelector(".settings-menu"),
      },
      Audio: {
        element: document.getElementById("popup1"),
        trigger: document.querySelector(".settings-menu"),
      },
      save: {
        element: document.getElementById("popup2"),
        trigger: document.querySelector(".save"),
      },
      load: {
        element: document.getElementById("popup3"),
        trigger: document.querySelector(".load"),
      },
      achievements: {
        element: document.getElementById("popup4"),
        trigger: document.querySelector(".achievements"),
      },
    };

    // Button Sound
    this.buttonSound = new Audio("Assets/button-click.mp3");

    // State
    this.isSidebarVisible = false;
    this.activeNavSidebar = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Volume Controls
    this.volumeSliders.forEach((slider) => {
      slider.addEventListener("input", () => this.handleVolumeChange(slider));
    });
    this.musicSliders.forEach((slider) => {
      slider.addEventListener("input", () => this.handleMusicChange(slider));
    });

    // Add sound to all buttons
    document.querySelectorAll("button, #size-6").forEach((button) => {
      button.addEventListener("click", () => this.playButtonSound());
    });

    // Popup Triggers
    Object.entries(this.popups).forEach(([key, popup]) => {
      if (popup.trigger) {
        popup.trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openPopup(key);
        });
      }
    });

    // Start page sidebar triggers
    this.openSettingsLink?.addEventListener("click", (e) => {
      e.preventDefault();
      this.openNavSidebar("settings");
    });
    this.openAboutLink?.addEventListener("click", (e) => {
      e.preventDefault();
      this.openNavSidebar("about");
    });

    this.sidebarOverlay?.addEventListener("click", () => this.closeNavSidebars());

    document.querySelectorAll(".nav-sidebar .sidebar-close").forEach((button) => {
      button.addEventListener("click", () => this.closeNavSidebars());
    });

    // Close popups on outside click
    document.addEventListener("click", (event) => {
      if (
        !event.target.closest(".popup") &&
        !event.target.closest(".settings-menu, .save, .load, .achievements")
      ) {
        this.closeAllPopups();
      }
    });

    // Display Controls
    document
      .querySelector(".fullscreen")
      ?.addEventListener("click", () => this.toggleFullscreen());
    document
      .querySelector(".side-menu")
      ?.addEventListener("click", () => this.toggleSidebar());

    // Close buttons
    document.querySelectorAll(".closeBtn").forEach((button) => {
      button.addEventListener("click", () => this.closeAllPopups());
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeNavSidebars();
        this.closeAllPopups();
        if (document.fullscreenElement) {
          this.exitFullscreen();
        }
      }
    });
  }

  syncSliders(sliders, value) {
    sliders.forEach((slider) => {
      slider.value = value;
    });
  }

  handleVolumeChange(sourceSlider) {
    const volume = parseFloat(sourceSlider.value);
    this.syncSliders(this.volumeSliders, volume);
    this.buttonSound.volume = volume;
  }

  handleMusicChange(sourceSlider) {
    const volume = parseFloat(sourceSlider.value);
    this.syncSliders(this.musicSliders, volume);
    if (this.audio) {
      this.audio.volume = volume;
    }
  }

  playButtonSound() {
    this.buttonSound.currentTime = 0;
    this.buttonSound
      .play()
      .catch((e) => console.warn("Button sound failed:", e));
  }

  openNavSidebar(type) {
    this.closeAllPopups();
    this.closeNavSidebars();

    const sidebar =
      type === "settings" ? this.settingsSidebar : this.aboutSidebar;
    if (!sidebar) return;

    sidebar.classList.add("open");
    this.sidebarOverlay?.classList.add("visible");
    this.activeNavSidebar = type;
    document.body.classList.add("sidebar-active");
  }

  closeNavSidebars() {
    this.settingsSidebar?.classList.remove("open");
    this.aboutSidebar?.classList.remove("open");
    this.sidebarOverlay?.classList.remove("visible");
    this.activeNavSidebar = null;
    document.body.classList.remove("sidebar-active");
  }

  openPopup(popupId) {
    this.closeNavSidebars();
    this.closeAllPopups();
    const popup = this.popups[popupId];
    if (popup && popup.element) {
      popup.element.classList.add("open-popup");
      document.body.classList.add("popup-active");
    }
  }

  closeAllPopups() {
    Object.values(this.popups).forEach((popup) => {
      if (popup.element) {
        popup.element.classList.remove("open-popup");
      }
    });
    document.body.classList.remove("popup-active");
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    } else {
      this.exitFullscreen();
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen failed:", err);
      });
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.characterInfo.style.display = this.isSidebarVisible ? "flex" : "none";

    // Update sidebar button SVG
    const sidebarButton = document.querySelector(".side-menu");
    if (sidebarButton) {
      // Add appropriate SVG path based on state
      // [SVG PATH PLACEHOLDER - Add open/closed state SVG paths here]
    }
  }
}

// Initialize settings manager
const settingsManager = new SettingsManager();

window.openPopup = (popupId = "settings") => settingsManager.openPopup(popupId);
window.closePopup = () => settingsManager.closeAllPopups();
