class GameAudio {
  constructor() {
      this.sounds = new Map();
      this.currentLocationTheme = null;
      this.currentCharacterTheme = null;
      this.currentAmbientSounds = [];
      this.masterVolume = 0.5;
      this.musicVolume = 0.5;
      this.sfxVolume = 0.5;

      // Initialize volume controls
      this.initializeVolumeControls();
  }

  initializeVolumeControls() {
      const musicSlider = document.getElementById('musicSlider');
      const volumeSlider = document.getElementById('volumeSlider');

      if (musicSlider) {
          musicSlider.addEventListener('input', (e) => {
              this.setMusicVolume(e.target.value);
          });
      }

      if (volumeSlider) {
          volumeSlider.addEventListener('input', (e) => {
              this.setSFXVolume(e.target.value);
          });
      }
  }

  loadSound(key, path) {
      const audio = new Audio(path);
      audio.volume = this.masterVolume;
      this.sounds.set(key, audio);
  }

  setMasterVolume(volume) {
      this.masterVolume = Math.max(0, Math.min(1, volume));
      this.sounds.forEach(sound => {
          sound.volume = this.masterVolume;
      });
  }

  setMusicVolume(volume) {
      this.musicVolume = Math.max(0, Math.min(1, volume));
      if (this.currentLocationTheme) {
          this.currentLocationTheme.volume = this.musicVolume * this.masterVolume;
      }
      if (this.currentCharacterTheme) {
          this.currentCharacterTheme.volume = this.musicVolume * this.masterVolume;
      }
  }

  setSFXVolume(volume) {
      this.sfxVolume = Math.max(0, Math.min(1, volume));
      this.currentAmbientSounds.forEach(sound => {
          sound.volume = this.sfxVolume * this.masterVolume;
      });
  }

  playLocationTheme(path) {
      if (this.currentLocationTheme) {
          this.currentLocationTheme.pause();
          this.currentLocationTheme.currentTime = 0;
      }

      if (path) {
          const theme = new Audio(path);
          theme.volume = this.musicVolume * this.masterVolume;
          theme.loop = true;
          theme.play().catch(e => console.warn('Audio play failed:', e));
          this.currentLocationTheme = theme;
      }
  }

  playCharacterTheme(path) {
      if (this.currentCharacterTheme) {
          this.currentCharacterTheme.pause();
          this.currentCharacterTheme.currentTime = 0;
      }

      if (path) {
          const theme = new Audio(path);
          theme.volume = this.musicVolume * this.masterVolume;
          theme.play().catch(e => console.warn('Audio play failed:', e));
          this.currentCharacterTheme = theme;
      }
  }

  playAmbientSounds(soundKeys) {
      // Stop current ambient sounds
      this.currentAmbientSounds.forEach(sound => {
          sound.pause();
          sound.currentTime = 0;
      });
      this.currentAmbientSounds = [];

      // Play new ambient sounds
      if (Array.isArray(soundKeys)) {
          soundKeys.forEach(key => {
              const sound = this.sounds.get(key);
              if (sound) {
                  const soundClone = sound.cloneNode();
                  soundClone.volume = this.sfxVolume * this.masterVolume;
                  soundClone.loop = true;
                  soundClone.play().catch(e => console.warn('Audio play failed:', e));
                  this.currentAmbientSounds.push(soundClone);
              }
          });
      }
  }

  playSoundEffect(key) {
      const sound = this.sounds.get(key);
      if (sound) {
          const soundClone = sound.cloneNode();
          soundClone.volume = this.sfxVolume * this.masterVolume;
          soundClone.play().catch(e => console.warn('Audio play failed:', e));
      }
  }

  stopAll() {
      if (this.currentLocationTheme) {
          this.currentLocationTheme.pause();
          this.currentLocationTheme.currentTime = 0;
      }
      if (this.currentCharacterTheme) {
          this.currentCharacterTheme.pause();
          this.currentCharacterTheme.currentTime = 0;
      }
      this.currentAmbientSounds.forEach(sound => {
          sound.pause();
          sound.currentTime = 0;
      });
      this.currentAmbientSounds = [];
  }
}

export default GameAudio;