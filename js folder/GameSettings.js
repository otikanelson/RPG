class SettingsManager {
  constructor() {
    // DOM Elements
    this.volumeSlider = document.getElementById("volumeSlider");
    this.musicSlider = document.getElementById("musicSlider");
    this.characterInfo = document.getElementById("characterInfo");
    this.audio = document.getElementById("background-audio");

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

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Volume Controls
    this.volumeSlider.addEventListener("input", () =>
      this.handleVolumeChange()
    );
    this.musicSlider.addEventListener("input", () => this.handleMusicChange());

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
      .addEventListener("click", () => this.toggleFullscreen());
    document
      .querySelector(".side-menu")
      .addEventListener("click", () => this.toggleSidebar());

    // Close buttons
    document.querySelectorAll(".closeBtn").forEach((button) => {
      button.addEventListener("click", () => this.closeAllPopups());
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllPopups();
        if (document.fullscreenElement) {
          this.exitFullscreen();
        }
      }
    });
  }

  handleVolumeChange() {
    const volume = parseFloat(this.volumeSlider.value);
    this.buttonSound.volume = volume;
  }

  handleMusicChange() {
    const volume = parseFloat(this.musicSlider.value);
    this.audio.volume = volume;
  }

  playButtonSound() {
    this.buttonSound.currentTime = 0;
    this.buttonSound
      .play()
      .catch((e) => console.warn("Button sound failed:", e));
  }

  openPopup(popupId) {
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