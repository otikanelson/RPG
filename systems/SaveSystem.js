/**
 * src/systems/SaveSystem.js
 * A robust, modular Save/Load Management engine.
 * Utilizes serialization tokens to prevent data version corruption.
 */

import playerState from '../core/PlayerState.js';

export const SAVE_SYSTEM_CONFIG = {
    LOCAL_STORAGE_KEY: 'rpg_game_save_slot_1',
    AUTO_SAVE_INTERVAL_MS: 300000 // 5 minutes
};

class SaveSystem {
    constructor() {
        this.autoSaveTimer = null;
    }

    /**
     * Captures live game configurations and writes them to local storage.
     * @returns {boolean} True if the save succeeded, false otherwise.
     */
    saveGame() {
        try {
            console.log("Initiating game serialization protocol...");
            
            // 1. Gather component states (Currently only tracking playerState)
            const masterSavePayload = {
                timestamp: Date.now(),
                version: "1.0.0", // Useful for future data migration logic
                player: playerState.exportSaveData()
                // Future additions go here: questProgress, clearedMaps, monsterRespawnTimers
            };

            // 2. Convert to string and commit to the database layer
            const serializedData = JSON.stringify(masterSavePayload);
            localStorage.setItem(SAVE_SYSTEM_CONFIG.LOCAL_STORAGE_KEY, serializedData);
            
            console.log("Game state successfully written to storage registry.");
            return true;
        } catch (error) {
            console.error("Critical Failure: Unable to parse or commit save file.", error);
            return false;
        }
    }

    /**
     * Retrieves data records from local storage and distributes them to game components.
     * Runs rigorous structural failsafes if data is incomplete or absent.
     * @returns {boolean} True if a valid save was recovered, false if defaults were loaded.
     */
    loadGame() {
        try {
            console.log("Attempting to locate saved game data...");
            const rawData = localStorage.getItem(SAVE_SYSTEM_CONFIG.LOCAL_STORAGE_KEY);

            // Failsafe: No save data exists yet.
            if (!rawData) {
                console.warn("No save file detected. Initializing pristine game state context.");
                playerState.resetToDefault();
                return false;
            }

            // Parse text back into functional state properties
            const masterSavePayload = JSON.parse(rawData);

            // Verify top-level integrity of the parsed payload
            if (!masterSavePayload || typeof masterSavePayload !== 'object') {
                throw new Error("Save payload is fundamentally corrupted or empty.");
            }

            // Pass sub-objects to respective manager instances
            if (masterSavePayload.player) {
                playerState.importSaveData(masterSavePayload.player);
            } else {
                console.warn("Player segment missing from save data. Initializing raw recovery.");
                playerState.executeFailsafeValidation();
            }

            console.log(`Game state successfully loaded. Save timestamp: ${new Date(masterSavePayload.timestamp).toLocaleString()}`);
            return true;
        } catch (error) {
            console.error("Critical Failure: Save file corrupted. Bootstrapping recovery fallback.", error);
            
            // Emergency Recovery: Wipe structural corruption, fallback safely to defaults so game won't crash
            playerState.resetToDefault();
            playerState.executeFailsafeValidation();
            return false;
        }
    }

    /**
     * Purges game records completely to reset user configurations cleanly.
     */
    clearSaveFile() {
        try {
            localStorage.removeItem(SAVE_SYSTEM_CONFIG.LOCAL_STORAGE_KEY);
            console.log("Storage records fully purged from system layers.");
            playerState.resetToDefault();
            return true;
        } catch (error) {
            console.error("Failed to clear local storage slot:", error);
            return false;
        }
    }

    /**
     * Background utility to loop and back up state progression on fixed schedules.
     */
    startAutoSaveBackgroundWorker() {
        this.stopAutoSaveBackgroundWorker();
        console.log("Auto-save monitoring sequence engaged.");
        this.autoSaveTimer = setInterval(() => {
            console.log("Executing scheduled background auto-save operations...");
            this.saveGame();
        }, SAVE_SYSTEM_CONFIG.AUTO_SAVE_INTERVAL_MS);
    }

    stopAutoSaveBackgroundWorker() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log("Auto-save monitoring sequence terminated.");
        }
    }
}

const saveSystem = new SaveSystem();
export default saveSystem;