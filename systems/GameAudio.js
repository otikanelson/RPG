// systems/GameAudio.js

// 1. Centralized Sound Manifest (Decouples paths from your execution logic)
export const AUDIO_ASSETS = {
    SFX: {
        DICE: 'Assets/Audio/dice-roll.mp3',
        BUTTON_CLICK: 'Assets/Audio/button-click.mp3',
        ATTACK: 'Assets/Audio/attack-sound.mp3',
        DEFEND: 'Assets/Audio/defend-sound.mp3',
        VICTORY: 'Assets/Audio/victory-sound.mp3',
        DEFEAT: 'Assets/Audio/defeat-sound.mp3'
    },
    MUSIC: {
        SLIMEBEAST: 'Assets/Audio/slime-battle.mp3',
        SHARDWARDEN: 'Assets/Audio/warden-battle.mp3',
        SHADOWBEAST: 'Assets/Audio/shadow-battle.mp3',
        DEFAULT_BATTLE: 'Assets/Audio/default-battle.mp3'
    }
};

class GameAudio {
    constructor() {
        // Enforce Singleton layout
        if (GameAudio.instance) {
            return GameAudio.instance;
        }

        this.sounds = new Map();
        this.currentLocationTheme = null;
        this.currentCharacterTheme = null;
        this.currentAmbientSounds = [];
        this.masterVolume = 0.5;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.5;

        // Auto-load all declared configurations safely
        this.preloadAssets();
        this.initializeVolumeControls();

        GameAudio.instance = this;
    }

    /**
     * Preloads all defined game audio tracking assets to prevent mid-game delays.
     */
    preloadAssets() {
        // Preload SFX
        Object.entries(AUDIO_ASSETS.SFX).forEach(([key, path]) => {
            this.loadSound(key.toLowerCase(), path);
        });
        // Preload Music tracks
        Object.entries(AUDIO_ASSETS.MUSIC).forEach(([key, path]) => {
            this.loadSound(key.toLowerCase(), path);
        });
    }

    initializeVolumeControls() {
        // Use DOMContentLoaded guard to ensure execution if UI mounts late
        const attachSliders = () => {
            const musicSlider = document.getElementById('musicSlider');
            const volumeSlider = document.getElementById('volumeSlider');

            if (musicSlider) {
                musicSlider.addEventListener('input', (e) => this.setMusicVolume(parseFloat(e.target.value)));
            }
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => this.setSFXVolume(parseFloat(e.target.value)));
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachSliders);
        } else {
            attachSliders();
        }
    }

    loadSound(key, path) {
        const audio = new Audio();
        audio.src = path;
        audio.volume = this.sfxVolume * this.masterVolume;
        
        // Quietly fail or mock broken paths without breaking the thread execution
        audio.addEventListener('error', () => console.warn(`Audio source file missing: ${path}`));
        
        // Wrap play method safely to prevent browser autoplay blocks from tossing errors
        const nativePlay = audio.play.bind(audio);
        audio.play = () => nativePlay().catch(() => /* Autoplay safe fallback */ {});

        this.sounds.set(key, audio);
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            sound.volume = this.masterVolume;
        });
        this.updateRunningVolumes();
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateRunningVolumes();
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateRunningVolumes();
    }

    updateRunningVolumes() {
        const computedMusicVol = this.musicVolume * this.masterVolume;
        if (this.currentLocationTheme) this.currentLocationTheme.volume = computedMusicVol;
        if (this.currentCharacterTheme) this.currentCharacterTheme.volume = computedMusicVol;

        const computedSFXVol = this.sfxVolume * this.masterVolume;
        this.currentAmbientSounds.forEach(sound => sound.volume = computedSFXVol);
    }

    /**
     * Plays background tracks dynamically by manifest key (e.g., 'slimebeast').
     */
    playMusic(key, loop = true) {
        const cleanKey = key.toLowerCase().replace(/\s+/g, '');
        const loadedAudio = this.sounds.get(cleanKey);

        if (this.currentLocationTheme) {
            this.currentLocationTheme.pause();
            this.currentLocationTheme.currentTime = 0;
        }

        if (loadedAudio) {
            this.currentLocationTheme = loadedAudio;
            this.currentLocationTheme.volume = this.musicVolume * this.masterVolume;
            this.currentLocationTheme.loop = loop;
            this.currentLocationTheme.play();
        } else {
            // Fallback to default battle music if a custom key isn't loaded
            const fallback = this.sounds.get('default_battle');
            if (fallback) {
                this.currentLocationTheme = fallback;
                this.currentLocationTheme.volume = this.musicVolume * this.masterVolume;
                this.currentLocationTheme.loop = loop;
                this.currentLocationTheme.play();
            }
        }
    }

    /**
     * Clean, fire-and-forget SFX playback function using standard clones.
     */
    playSFX(key) {
        const sourceSound = this.sounds.get(key.toLowerCase());
        if (sourceSound) {
            const runtimeClone = sourceSound.cloneNode();
            runtimeClone.volume = this.sfxVolume * this.masterVolume;
            runtimeClone.play();
        }
    }

    stopAll() {
        if (this.currentLocationTheme) {
            this.currentLocationTheme.pause();
            this.currentLocationTheme.currentTime = 0;
            this.currentLocationTheme = null;
        }
        if (this.currentCharacterTheme) {
            this.currentCharacterTheme.pause();
            this.currentCharacterTheme.currentTime = 0;
            this.currentCharacterTheme = null;
        }
        this.currentAmbientSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.currentAmbientSounds = [];
    }
}

// Export the shared single execution instance
const audioEngine = new GameAudio();
export default audioEngine;