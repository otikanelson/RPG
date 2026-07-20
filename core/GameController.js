/**
 * src/core/GameController.js
 * The master state machine and traffic controller for the game application lifecycle.
 * Highly scalable for adding future gameplay modes or story phases.
 */

import gameStorage from './GameStorage.js';
import gameLogic from './GameLogic.js';

// Define explicit engine states. Add new ones here as the game grows!
export const GAME_STATES = {
    START_MENU: 'START_MENU',
    CUTSCENE: 'CUTSCENE',
    EXPLORATION: 'EXPLORATION',
    BATTLE: 'BATTLE',
    GAME_OVER: 'GAME_OVER'
};

class GameController {
    constructor() {
        this.currentState = GAME_STATES.START_MENU;
        this.activeContextData = null; // Holds transient context data (e.g., current enemy id)
        this.autoSaveTimer = null;
    }

    /**
     * Initializes the entire game application on startup.
     */
    init() {
        console.log("Initializing core game subsystems...");
        
        // Try auto-loading an existing save profile via your Storage module
        if (gameStorage.hasSaveData()) {
            this.transitionTo(GAME_STATES.START_MENU); // Let them choose to hit "Continue" from the UI
        } else {
            this.transitionTo(GAME_STATES.START_MENU);
        }
    }

    /**
     * Master transition routing handler.
     * Manages tear-down of the old state and setup of the new state.
     * @param {string} newState - A valid token from GAME_STATES
     * @param {Object} contextData - Optional payloads passed forward (like monster configurations)
     */
    transitionTo(newState, contextData = null) {
        if (!GAME_STATES[newState]) {
            console.error(`State Engine Error: Transition target "${newState}" is invalid.`);
            return;
        }

        console.log(`Game shifting state: [${this.currentState}] ===> [${newState}]`);
        
        // 1. EXIT LOGIC FOR PREVIOUS STATE
        this._exitStateCleanup(this.currentState);

        // Update state pointers
        this.currentState = newState;
        this.activeContextData = contextData;

        // 2. ENTER LOGIC FOR NEW STATE
        this._enterStateSetup(newState, contextData);

        // 3. UI SYNC TRIGGER
        this.syncUI();
    }

    /**
     * Handles cleanup routines before abandoning a state mode
     */
    _exitStateCleanup(state) {
        switch (state) {
            case GAME_STATES.EXPLORATION:
                this.stopAutoSaveWorker(); // Stop auto-saving when leaving peaceful exploration
                break;
        }
    }

    /**
     * Bootstraps configurations required for entering a new gameplay state
     */
    _enterStateSetup(state, context) {
        switch (state) {
            case GAME_STATES.START_MENU:
                this.stopAutoSaveWorker();
                break;

            case GAME_STATES.EXPLORATION:
                // Safely engage automatic background saves every 5 minutes during general travel (300,000 ms)
                this.startAutoSaveWorker(300000);
                break;

            case GAME_STATES.BATTLE:
                // Stop background auto-saves during combat to prevent midway save state corruption
                this.stopAutoSaveWorker();
                console.log(`Engaging battle loop context with target enemy:`, context);
                break;

            case GAME_STATES.CUTSCENE:
                this.stopAutoSaveWorker();
                break;

            case GAME_STATES.GAME_OVER:
                this.stopAutoSaveWorker();
                console.log("Player defeated. Halting update tasks.");
                break;
        }
    }

    /**
     * Centralized UI Synchronization Router.
     * Keeps your logic completely detached from HTML elements. 
     * When the state changes, it hides/reveals the correct sections.
     */
    syncUI() {
        console.log(`UI synchronization update dispatched for state: ${this.currentState}`);
        // Your UI manager file can hook into this.currentState to toggle display layouts
    }

    /**
     * Timed background worker helper to auto-commit progress using your GameStorage module
     */
    startAutoSaveWorker(intervalMs) {
        this.stopAutoSaveWorker();
        this.autoSaveTimer = setInterval(() => {
            console.log("Executing scheduled background auto-save operations...");
            gameStorage.saveGame();
        }, intervalMs);
    }

    stopAutoSaveWorker() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Global Trigger for player defeat
     */
    handlePlayerDefeat() {
        this.transitionTo(GAME_STATES.GAME_OVER);
    }
}

const gameController = new GameController();
export default gameController;