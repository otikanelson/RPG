// class GameStorage {
//     constructor() {
//         this.saveButton = document.querySelector('.savebtn');
//         this.achievements = this.loadAchievements();
//         this.choiceSequences = [];
//         this.visitedLocations = new Set();
//         this.unlockedCharacters = new Map();
        
//         this.bindEvents();

//         this.choiceSequences = [];
//         this.visitedLocations = new Set();
//         // ... existing constructor code ...

//     }
//     addChoiceSequence(choiceData) {
//         this.choiceSequences.push({
//             ...choiceData,
//             timestamp: Date.now()
//         });
//     }

//     addLocation(location) {
//         this.visitedLocations.add(location);
//     }

//     getChoiceSequences() {
//         return this.choiceSequences;
//     }

//     getVisitedLocations() {
//         return Array.from(this.visitedLocations);
//     }


//     bindEvents() {
//         this.saveButton?.addEventListener('click', () => this.saveGame());
//         document.querySelector('.load')?.addEventListener('click', () => this.loadGame());
//     }

//     saveGame() {
//         const gameState = {
//             player: {
//                 health: health,
//                 gold: gold,
//                 xp: xp,
//                 inventory: inventory,
//                 currentWeapon: currentWeapon
//             },
//             progress: {
//                 choiceSequences: this.choiceSequences,
//                 visitedLocations: Array.from(this.visitedLocations),
//                 achievements: this.achievements,
//                 characters: Array.from(this.unlockedCharacters)
//             },
//             timestamp: Date.now()
//         };

//         try {
//             localStorage.setItem('gameState', JSON.stringify(gameState));
//             this.showNotification('Game saved successfully!');
//         } catch (error) {
//             console.error('Save failed:', error);
//             this.showNotification('Failed to save game', true);
//         }
//     }

//     loadGame() {
//         try {
//             const savedState = localStorage.getItem('gameState');
//             if (!savedState) {
//                 this.showNotification('No saved game found', true);
//                 return;
//             }

//             const gameState = JSON.parse(savedState);
            
//             // Restore player state
//             health = gameState.player.health;
//             gold = gameState.player.gold;
//             xp = gameState.player.xp;
//             inventory = gameState.player.inventory;
//             currentWeapon = gameState.player.currentWeapon;

//             // Restore progress
//             this.choiceSequences = gameState.progress.choiceSequences;
//             this.visitedLocations = new Set(gameState.progress.visitedLocations);
//             this.achievements = gameState.progress.achievements;
//             this.unlockedCharacters = new Map(gameState.progress.characters);

//             // Update UI
//             this.updateUI();
//             this.showNotification('Game loaded successfully!');
//         } catch (error) {
//             console.error('Load failed:', error);
//             this.showNotification('Failed to load game', true);
//         }
//     }

//     updateUI() {
//         // Update player stats
//         document.getElementById('healthText').textContent = health;
//         document.getElementById('goldText').textContent = gold;
//         document.getElementById('xpText').textContent = xp;
//         document.getElementById('weaponsText').textContent = inventory.join(', ');

//         // Update achievements popup
//         const achievementsPopup = document.getElementById('popup4');
//         if (achievementsPopup) {
//             achievementsPopup.innerHTML = this.achievements.length ? 
//                 this.achievements.map(a => `<p>${a.name}: ${a.description}</p>`).join('') :
//                 '<p>No achievements yet</p>';
//         }
//     }

//     showNotification(message, isError = false) {
//         const notification = document.createElement('div');
//         notification.className = `notification ${isError ? 'error' : 'success'}`;
//         notification.textContent = message;
//         document.body.appendChild(notification);

//         setTimeout(() => notification.remove(), 3000);
//     }

//     // Achievement management
//     loadAchievements() {
//         return JSON.parse(localStorage.getItem('achievements') || '[]');
//     }

//     unlockAchievement(achievement) {
//         if (!this.achievements.some(a => a.id === achievement.id)) {
//             this.achievements.push(achievement);
//             localStorage.setItem('achievements', JSON.stringify(this.achievements));
//             this.showNotification(`Achievement Unlocked: ${achievement.name}!`);
//         }
//     }

//     // Choice tracking
//     addChoice(choice) {
//         this.choiceSequences.push({
//             choice,
//             timestamp: Date.now()
//         });
//     }

//     // Location tracking
//     addLocation(location) {
//         this.visitedLocations.add(location);
//     }

//     // Character management
//     unlockCharacter(character) {
//         this.unlockedCharacters.set(character.id, character);
//     }
// }

// // Add styles
// const style = document.createElement('style');
// style.textContent = `
//     .notification {
//         position: fixed;
//         top: 20px;
//         right: 20px;
//         padding: 15px;
//         border-radius: 5px;
//         color: white;
//         z-index: 1000;
//         animation: slideIn 0.3s ease-out;
//     }

//     .success {
//         background-color: #4CAF50;
//     }

//     .error {
//         background-color: #f44336;
//     }

//     @keyframes slideIn {
//         from { transform: translateX(100%); }
//         to { transform: translateX(0); }
//     }
// `;
// document.head.appendChild(style);


// // Usage example:
// const gameStorage = new GameStorage();
// const textManager = new TextManager();
// const dialogueManager = new DialogueManager(textManager, gameStorage);

// // Start the initial dialogue
// dialogueManager.startDialogue('intro');

// export default GameStorage;