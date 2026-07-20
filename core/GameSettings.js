/**
 * src/core/GameSettings.js
 * Cleaned Controller Layer for volume, popup mechanics, and layout interfaces.
 */
import gameAudio from '../systems/GameAudio.js';

class SettingsManager {
  constructor() {
    this.volumeSliders = document.querySelectorAll(".volume-slider");
    this.musicSliders = document.querySelectorAll(".music-slider");
    this.characterInfo = document.getElementById("characterInfo");
    this.audio = document.getElementById("background-audio");

    this.sidebarOverlay = document.getElementById("sidebarOverlay");
    this.settingsSidebar = document.getElementById("settingsSidebar");
    this.aboutSidebar = document.getElementById("aboutSidebar");
    this.openSettingsLink = document.getElementById("openSettings");
    this.openAboutLink = document.getElementById("openAbout");

    this.popups = {
      settings:     { element: document.getElementById("popup1"), trigger: document.querySelector(".settings-menu") },
      Audio:        { element: document.getElementById("popup1"), trigger: document.querySelector(".settings-menu") },
      save:         { element: document.getElementById("popup2"), trigger: document.querySelector(".save") },
      load:         { element: document.getElementById("popup3"), trigger: document.querySelector(".load") },
      achievements: { element: document.getElementById("popup4"), trigger: document.querySelector(".achievements") },
    };

    this.gameAudio = gameAudio;
    this.isSidebarVisible = false;
    this.activeNavSidebar = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.volumeSliders.forEach((slider) => {
      slider.addEventListener("input", () => this.handleVolumeChange(slider));
    });
    this.musicSliders.forEach((slider) => {
      slider.addEventListener("input", () => this.handleMusicChange(slider));
    });

    // Attach click sound to navigation buttons
    document.querySelectorAll(".settings, .options").forEach((button) => {
      button.addEventListener("click", () => this.playButtonSound());
    });

    // Attach to dialogue and action buttons
    document.querySelectorAll(".dialogueBtns button, .closeBtn, .splash-continue").forEach((button) => {
      button.addEventListener("click", () => this.playButtonSound());
    });

    Object.entries(this.popups).forEach(([key, popup]) => {
      if (popup.trigger) {
        popup.trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openPopup(key);
        });
      }
    });

    this.openSettingsLink?.addEventListener("click", (e) => { e.preventDefault(); this.openNavSidebar("settings"); });
    this.openAboutLink?.addEventListener("click", (e) => { e.preventDefault(); this.openNavSidebar("about"); });
    this.sidebarOverlay?.addEventListener("click", () => this.closeNavSidebars());

    document.querySelectorAll(".nav-sidebar .sidebar-close").forEach((button) => {
      button.addEventListener("click", () => this.closeNavSidebars());
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".popup") && !event.target.closest(".settings-menu, .save, .load, .achievements")) {
        this.closeAllPopups();
      }
    });

    document.querySelector(".fullscreen")?.addEventListener("click", () => this.toggleFullscreen());
    document.querySelector(".side-menu")?.addEventListener("click", () => this.toggleSidebar());
    document.querySelector(".map-icon")?.addEventListener("click", () => this.openMap());
    document.querySelectorAll(".closeBtn").forEach((button) => {
      button.addEventListener("click", () => this.closeAllPopups());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeNavSidebars();
        this.closeAllPopups();
        if (document.fullscreenElement) this.exitFullscreen();
      }
    });
  }

  syncSliders(sliders, value) {
    sliders.forEach((slider) => { slider.value = value; });
  }

  handleVolumeChange(sourceSlider) {
    const volume = parseFloat(sourceSlider.value);
    this.syncSliders(this.volumeSliders, volume);
    this.gameAudio.setSFXVolume(volume);
  }

  handleMusicChange(sourceSlider) {
    const volume = parseFloat(sourceSlider.value);
    this.syncSliders(this.musicSliders, volume);
    this.gameAudio.setMusicVolume(volume);
    if (this.audio) this.audio.volume = volume;
  }

  playButtonSound() {
    this.gameAudio.playSFX('button_click');
  }

  openNavSidebar(type) {
    this.closeAllPopups();
    this.closeNavSidebars();

    const sidebar = type === "settings" ? this.settingsSidebar : this.aboutSidebar;
    if (!sidebar) return;

    sidebar.classList.add("open");
    if (this.sidebarOverlay) this.sidebarOverlay.classList.add("visible");
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
      popup.element?.classList.remove("open-popup");
    });
    document.body.classList.remove("popup-active");
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      this.exitFullscreen();
    }
  }

  exitFullscreen() {
    document.exitFullscreen().catch(err => console.warn(err));
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    if (this.characterInfo) this.characterInfo.style.display = this.isSidebarVisible ? "none" : "flex";
  }

  openMap() {
    if (window.openMapModal && typeof window.openMapModal === 'function') {
      window.openMapModal();
    }
  }
}

const settingsManager = new SettingsManager();
window.openPopup = (popupId = "settings") => settingsManager.openPopup(popupId);
window.closePopup = () => settingsManager.closeAllPopups();