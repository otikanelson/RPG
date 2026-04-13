class GameStorage {
    constructor() {
        this.saveButton = document.querySelector('.savebtn');
        this.loadButton = document.querySelector('.load');
        this.achievements = this.loadAchievements();
        this.choiceSequences = [];
        this.visitedLocations = new Set();
        this.unlockedCharacters = new Map();
        
        this.bindEvents();
    }

    bindEvents() {
        this.saveButton?.addEventListener('click', () => this.saveGame());
        this.loadButton?.addEventListener('click', () => this.loadGame());
    }

    saveGame() {
        // Get current game state from GameLogic
        const gameLogic = window.gameLogic || this.getGameLogicInstance();
        if (!gameLogic) {
            this.showNotification('Game logic not available', true);
            return;
        }

        const gameState = {
            player: {
                health: gameLogic.stats.health,
                maxHealth: gameLogic.stats.maxHealth,
                gold: gameLogic.stats.gold,
                xp: gameLogic.stats.xp,
                level: gameLogic.stats.level,
                inventory: gameLogic.inventory,
                weapons: gameLogic.weapons
            },
            progress: {
                choiceSequences: this.choiceSequences,
                visitedLocations: Array.from(this.visitedLocations),
                achievements: this.achievements,
                characters: Array.from(this.unlockedCharacters)
            },
            timestamp: Date.now(),
            version: '1.0.0'
        };

        try {
            localStorage.setItem('rpgGameState', JSON.stringify(gameState));
            this.showNotification('Game saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            this.showNotification('Failed to save game', true);
        }
    }

    loadGame() {
        try {
            const savedState = localStorage.getItem('rpgGameState');
            if (!savedState) {
                this.showNotification('No saved game found', true);
                return;
            }

            const gameState = JSON.parse(savedState);
            const gameLogic = window.gameLogic || this.getGameLogicInstance();
            
            if (!gameLogic) {
                this.showNotification('Game logic not available', true);
                return;
            }
            
            // Restore player state
            gameLogic.stats.health = gameState.player.health;
            gameLogic.stats.maxHealth = gameState.player.maxHealth;
            gameLogic.stats.gold = gameState.player.gold;
            gameLogic.stats.xp = gameState.player.xp;
            gameLogic.stats.level = gameState.player.level;
            gameLogic.inventory = gameState.player.inventory;
            gameLogic.weapons = gameState.player.weapons;

            // Restore progress
            this.choiceSequences = gameState.progress.choiceSequences || [];
            this.visitedLocations = new Set(gameState.progress.visitedLocations || []);
            this.achievements = gameState.progress.achievements || [];
            this.unlockedCharacters = new Map(gameState.progress.characters || []);

            // Update UI
            gameLogic.updateUI();
            this.showNotification('Game loaded successfully!');
        } catch (error) {
            console.error('Load failed:', error);
            this.showNotification('Failed to load game', true);
        }
    }

    getGameLogicInstance() {
        // Try to find gameLogic instance
        if (typeof gameLogic !== 'undefined') {
            return gameLogic;
        }
        
        // Try to import it
        try {
            return import('../core/GameLogic.js').then(module => module.default);
        } catch (error) {
            console.error('Could not find GameLogic instance:', error);
            return null;
        }
    }

    showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : 'success'}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            background-color: ${isError ? '#f44336' : '#4CAF50'};
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Achievement management
    loadAchievements() {
        try {
            return JSON.parse(localStorage.getItem('rpgAchievements') || '[]');
        } catch (error) {
            console.error('Failed to load achievements:', error);
            return [];
        }
    }

    unlockAchievement(achievement) {
        if (!this.achievements.some(a => a.id === achievement.id)) {
            this.achievements.push({
                ...achievement,
                unlockedAt: Date.now()
            });
            localStorage.setItem('rpgAchievements', JSON.stringify(this.achievements));
            this.showNotification(`Achievement Unlocked: ${achievement.name}!`);
        }
    }

    // Choice tracking for story branching
    addChoice(choice, context = {}) {
        this.choiceSequences.push({
            choice,
            context,
            timestamp: Date.now()
        });
    }

    getChoiceHistory() {
        return this.choiceSequences;
    }

    // Location tracking
    addLocation(location) {
        this.visitedLocations.add(location);
    }

    hasVisitedLocation(location) {
        return this.visitedLocations.has(location);
    }

    getVisitedLocations() {
        return Array.from(this.visitedLocations);
    }

    // Character management
    unlockCharacter(character) {
        this.unlockedCharacters.set(character.id, {
            ...character,
            unlockedAt: Date.now()
        });
    }

    isCharacterUnlocked(characterId) {
        return this.unlockedCharacters.has(characterId);
    }

    getUnlockedCharacters() {
        return Array.from(this.unlockedCharacters.values());
    }

    // Clear all save data (for testing or reset)
    clearSaveData() {
        localStorage.removeItem('rpgGameState');
        localStorage.removeItem('rpgAchievements');
        this.achievements = [];
        this.choiceSequences = [];
        this.visitedLocations.clear();
        this.unlockedCharacters.clear();
        this.showNotification('Save data cleared');
    }

    // Check if save data exists
    hasSaveData() {
        return localStorage.getItem('rpgGameState') !== null;
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification {
        font-family: 'Arial', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .notification:hover {
        transform: translateX(-5px);
    }
`;
document.head.appendChild(style);

export default GameStorage;