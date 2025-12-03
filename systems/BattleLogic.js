import { 
    getMonsterData, 
    getRandomAttackType, 
    getRandomDefendType, 
    getRandomMagicType,
    getAttackDialogue,
    getDefendDialogue,
    getMagicDialogue
} from './BattleDialogue.js';
import gameLogic from '../core/GameLogic.js';
import CharacterManager from '../managers/CharacterManager.js';
import BattleCalculations from './BattleCalculations.js';
import BattleActions from './BattleActions.js';
import BattlePreparationManager from './BattlePreparation.js';

// Battle State Machine Constants
const BATTLE_STATE = {
    NOT_STARTED: 'NOT_STARTED',
    PREPARATION: 'PREPARATION',
    FIRST_TURN: 'FIRST_TURN',
    ACTOR_PHASE: 'ACTOR_PHASE',      // Current actor declares their action
    RESPONDER_PHASE: 'RESPONDER_PHASE', // Other actor responds to declared action
    RESOLUTION: 'RESOLUTION',         // Resolve both actions
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT'
};

const TURN_ACTOR = {
    PLAYER: 'PLAYER',
    MONSTER: 'MONSTER'
};

class BattleManager {
    constructor(gameLogic, textManager) {
        this.gameLogic = gameLogic;
        this.textManager = textManager;
        this.monsterStats = document.getElementById('monsterStats');
        this.monsterName = document.getElementById('monsterName');
        this.monsterHealth = document.getElementById('monsterHealth');
        this.monsterLevel = document.getElementById('monsterLevel');
        this.monsterHealthBar = document.querySelector('.monsterHealthBar');
        this.diceElement = document.getElementById('dice');
         
        // Initialize audio elements
        this.battleSounds = {
            dice: new Audio('Assets/dice-roll.mp3'),
            attack: new Audio('Assets/attack-sound.mp3'),
            defend: new Audio('Assets/defend-sound.mp3'),
            victory: new Audio('Assets/victory-sound.mp3'),
            defeat: new Audio('Assets/defeat-sound.mp3')
        };
        
        this.battleMusic = {
            slimebeast: new Audio('Assets/slime-battle.mp3'),
            shardwarden: new Audio('Assets/warden-battle.mp3'),
            shadowbeast: new Audio('Assets/shadow-battle.mp3'),
            default: new Audio('Assets/default-battle.mp3')
        };
        
        // Monster definitions
        this.monsters = {
            'Shard Warden': {
                name: 'Shard Warden',
                health: 100,
                maxHealth: 100,
                level: 5,
                baseAttack: 10,
                defenseChance: 0.4
            },            
            'Shadow Beast': {
                name: 'Shadow Beast',
                health: 80,
                maxHealth: 80,
                level: 3,
                baseAttack: 8,
                defenseChance: 0.3,
                specialAbility: 'phase'
            },
            'Slime Beast': {
                name: 'Slime Beast',
                health: 120,
                maxHealth: 120,
                level: 4,
                baseAttack: 7,
                defenseChance: 0.5
            }
        };
        
        // Stance definitions
        this.stances = {
            offensive: {
                name: "Offensive",
                actions: ["Heavy Slash", "Deep Thrust", "Block"],
                damageMultiplier: 1.5,
                hitRateModifier: -0.1
            },
            defensive: {
                name: "Defensive",
                actions: ["Quick Slice", "Dodge", "Parry"],
                damageMultiplier: 0.8,
                hitRateModifier: 0.2
            },
            balanced: {
                name: "Balanced",
                actions: ["Light Slash", "Dodge", "Counter"],
                damageMultiplier: 1.0,
                hitRateModifier: 0.1
            }
        };
        
        // Weapon effectiveness by stance
        this.weaponStanceEffectiveness = {
            'Rusty Knife': {
                offensive: 0.7,
                defensive: 0.8,
                balanced: 1.2
            },
            'Short Sword': {
                offensive: 1.0,
                defensive: 1.0,
                balanced: 1.1
            },
            'Steel Axe': {
                offensive: 1.3,
                defensive: 0.7,
                balanced: 0.9
            }
        };
        
        // Battle state
        this.battleState = BATTLE_STATE.NOT_STARTED;
        this.currentActor = null;
        this.currentMonster = null;
        this.selectedStance = null;
        this.currentBattleMusic = null;
        this.inBattle = false; // Legacy flag for ProgressManager compatibility
        
        // Action tracking for state machine
        this.declaredAction = null;   // The action declared by the first actor
        this.respondingAction = null; // The action declared by the responding actor
        
        // Initialize helper classes
        this.calculations = new BattleCalculations(this);
        this.actions = new BattleActions(this);
        this.battlePrepManager = new BattlePreparationManager(gameLogic, this);
    }

    /**
     * Start the battle sequence
     * @param {string} monsterName - The name of the monster to battle
     * @returns {Promise} - Resolves when battle prep is complete
     */
    async startBattle(monsterName) {
        console.log(`BattleManager.startBattle called with monster: ${monsterName}`);
        
        if (this.battleState !== BATTLE_STATE.NOT_STARTED) {
            console.warn("Battle already in progress");
            return;
        }
        
        if (!this.monsters[monsterName]) {
            console.error(`Monster "${monsterName}" not found!`);
            return;
        }
        
        // Initialize monster stats
        this.currentMonster = {
            ...this.monsters[monsterName],
            health: this.monsters[monsterName].maxHealth
        };
        
        this.battleState = BATTLE_STATE.PREPARATION;
        this.inBattle = true; // Set legacy flag for ProgressManager compatibility
        this.updateMonsterStats();
        
        // Show monster stats UI
        if (this.monsterStats) {
            this.monsterStats.style.display = 'block';
        }
        
        // Start battle music
        try {
            this.playBattleMusic(monsterName.toLowerCase().replace(/\s+/g, ''));
        } catch (error) {
            console.warn("Failed to play battle music:", error);
        }
        
        // Get monster intro text
        const introText = this.getMonsterIntroText(monsterName);
        
        if (introText && this.textManager) {
            try {
                await this.textManager.typeText(introText);
            } catch (error) {
                console.error("Error displaying intro text:", error);
            }
        }
        
        // Show weapon/potion/stance selection
        try {
            return this.battlePrepManager.show();
        } catch (error) {
            console.error("Error showing battle preparation:", error);
            this.battleState = BATTLE_STATE.NOT_STARTED;
            if (this.textManager) {
                await this.textManager.typeText("Failed to prepare for battle. Try again.");
            }
            return Promise.reject(error);
        }
    }
    
    /**
     * Get the monster's introduction text from dialogue file
     * @param {string} monsterName - The name of the monster
     * @returns {string} - The intro text or a default message
     */
    getMonsterIntroText(monsterName) {
        const monsterId = monsterName.toLowerCase().replace(/\s+/g, '');
        const monsterData = getMonsterData(monsterId);
        
        if (monsterData && monsterData.introText) {
            return monsterData.introText;
        }
        
        return `A ${monsterName} appears before you!`;
    }
    
    /**
     * Update the monster stats display
     */
    updateMonsterStats() {
        if (this.currentMonster && this.monsterStats) {
            this.monsterName.textContent = this.currentMonster.name;
            this.monsterHealth.textContent = this.currentMonster.health;
            this.monsterLevel.textContent = this.currentMonster.level;

            // Update health bar
            if (this.monsterHealthBar) {
                const healthPercent = (this.currentMonster.health / this.currentMonster.maxHealth) * 100;
                this.monsterHealthBar.style.width = `${healthPercent}%`;

                // Color based on health percentage
                const hue = healthPercent * 1.2;
                const saturation = 90;
                const lightness = 45;
        
                this.monsterHealthBar.style.background = `linear-gradient(
                    to bottom,
                    hsl(${hue}, ${saturation}%, ${lightness + 10}%) 0%,
                    hsl(${hue}, ${saturation}%, ${lightness}%) 50%,
                    hsl(${hue}, ${saturation}%, ${lightness - 10}%) 100%
                )`;
            }
        }
    }
    
    /**
     * Play battle music for the monster
     * @param {string} monsterType - The type of monster (normalized)
     */
    playBattleMusic(monsterType) {
        // Stop current battle music if playing
        if (this.currentBattleMusic) {
            this.currentBattleMusic.pause();
            this.currentBattleMusic.currentTime = 0;
        }
        
        // Choose the appropriate music
        this.currentBattleMusic = this.battleMusic[monsterType] || this.battleMusic.default;
        
        // Configure and play
        this.currentBattleMusic.loop = true;
        this.currentBattleMusic.volume = 0.5;
        this.currentBattleMusic.play().catch(e => console.warn('Battle music failed to play:', e));
    }
    
    /**
     * Set the player's stance for battle
     * @param {string} stanceName - The name of the stance (offensive, defensive, balanced)
     */
    setStance(stanceName) {
        this.selectedStance = stanceName;
        return this.stances[stanceName];
    }
    
    /**
     * Get battle action choices based on current battle state
     * @returns {Array} - Array of action choice objects
     */
    /**
     * Get valid response actions based on what the monster did
     * This enforces the core combat rule: respond appropriately to monster's action
     * @returns {Array<string>} - Array of valid action names
     */
    getValidResponseActions() {
        if (!this.selectedStance || !this.declaredAction) {
            // If no declared action yet, return all stance actions
            return this.stances[this.selectedStance]?.actions || [];
        }
        
        const monsterActionType = this.declaredAction.type;
        const stance = this.stances[this.selectedStance];
        
        // RULE 1: If monster ATTACKS, player can only DEFEND, DODGE, or COUNTER
        if (monsterActionType === 'attack') {
            return stance.actions.filter(action => {
                const actionType = this.getActionTypeFromName(action);
                return actionType === 'battleDefend' || 
                       actionType === 'battleDodge' || 
                       actionType === 'battleCounter';
            });
        }
        
        // RULE 2: If monster DEFENDS, player can only ATTACK
        if (monsterActionType === 'defend') {
            return stance.actions.filter(action => {
                const actionType = this.getActionTypeFromName(action);
                return actionType === 'battleAttack';
            });
        }
        
        // RULE 3: If monster uses MAGIC, player can ATTACK (interrupt) or DEFEND (brace)
        if (monsterActionType === 'magic') {
            return stance.actions.filter(action => {
                const actionType = this.getActionTypeFromName(action);
                return actionType === 'battleAttack' || actionType === 'battleDefend';
            });
        }
        
        // Default: all actions available
        return stance.actions;
    }
    
    getBattleChoices() {
        if (!this.selectedStance) {
            return [
                { text: "Attack", action: 'battleAttack' },
                { text: "Defend", action: 'battleDefend' },
                { text: "Use Potion", action: 'useHealth' }
            ];
        }
        
        const stance = this.stances[this.selectedStance];
        if (!stance) {
            console.error(`Stance "${this.selectedStance}" not found!`);
            return [];
        }
        
        // ACTOR_PHASE: Player declares their action (going first)
        if (this.battleState === BATTLE_STATE.ACTOR_PHASE && this.currentActor === TURN_ACTOR.PLAYER) {
            // Only show attack and defense actions - player declares intent
            const choices = stance.actions.map(action => ({
                text: action,
                action: this.getActionTypeFromName(action),
                params: { actionName: action }
            }));
            
            choices.push({ text: "Use Potion", action: 'useHealth' });
            return choices;
        }
        
        // RESPONDER_PHASE: Player responds to monster's declared action
        if (this.battleState === BATTLE_STATE.RESPONDER_PHASE) {
            // CRITICAL FIX: Filter actions based on what monster did
            const validActions = this.getValidResponseActions();
            
            const choices = validActions.map(action => ({
                text: action,
                action: this.getActionTypeFromName(action),
                params: { actionName: action }
            }));
            
            choices.push({ text: "Use Potion", action: 'useHealth' });
            return choices;
        }
        
        // Default: show all actions
        const choices = stance.actions.map(action => ({
            text: action,
            action: this.getActionTypeFromName(action),
            params: { actionName: action }
        }));
        
        choices.push({ text: "Use Potion", action: 'useHealth' });
        return choices;
    }
    
    /**
     * Map action name to action type
     * @param {string} actionName - The name of the action
     * @returns {string} - The action type for the handler
     */
    getActionTypeFromName(actionName) {
        const actionMap = {
            // Offensive stance actions
            'Heavy Slash': 'battleAttack',
            'Deep Thrust': 'battleAttack',
            'Block': 'battleDefend',
            
            // Defensive stance actions
            'Quick Slice': 'battleAttack',
            'Dodge': 'battleDodge',
            'Parry': 'battleDefend',
            
            // Balanced stance actions
            'Light Slash': 'battleAttack',
            'Counter': 'battleCounter',
            
            // Generic actions
            'Attack': 'battleAttack',
            'Defend': 'battleDefend'
        };
        
        return actionMap[actionName] || 'battleAttack';
    }
    
    /**
     * Roll the dice to determine first turn and display animation
     * @returns {Promise<Object>} - Resolves with roll results
     */
    async rollForFirstTurn() {
        console.log("Rolling for first turn...");
        
        // Show dice animation
        if (this.diceElement) {
            this.diceElement.style.display = 'block';
            this.diceElement.style.opacity = '1';
            this.diceElement.play();
            
            // Play dice sound
            this.battleSounds.dice.play().catch(e => console.warn('Dice sound failed:', e));
        }
        
        // Wait for dice animation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Roll dice for both (1-6)
        const playerRoll = Math.floor(Math.random() * 6) + 1;
        const monsterRoll = Math.floor(Math.random() * 6) + 1;
        
        console.log(`Player rolled: ${playerRoll}, Monster rolled: ${monsterRoll}`);
        
        // Hide dice
        if (this.diceElement) {
            this.diceElement.style.opacity = '0';
            setTimeout(() => {
                this.diceElement.style.display = 'none';
                this.diceElement.pause();
            }, 500);
        }
        
        // Determine who goes first (player wins ties)
        const playerFirst = playerRoll >= monsterRoll;
        
        console.log(`${playerFirst ? 'Player' : 'Monster'} goes first!`);
        
        return {
            playerRoll,
            monsterRoll,
            playerFirst
        };
    }
    
    /**
     * Begin the battle phase after preparation
     * @returns {Promise<Object>} - Contains text and choices for the next step
     */
    async beginBattlePhase() {
        try {
            console.log("=== BEGIN BATTLE PHASE ===");
            
            // STATE: FIRST_TURN - Roll dice to determine who acts first
            this.battleState = BATTLE_STATE.FIRST_TURN;
            
            const rollResult = await this.rollForFirstTurn();
            
            // Don't show roll numbers - just who goes first
            const firstTurnText = rollResult.playerFirst ? 
                "You strike first!" : 
                `The ${this.currentMonster.name} strikes first!`;
            
            // Set the current actor based on roll result
            this.currentActor = rollResult.playerFirst ? TURN_ACTOR.PLAYER : TURN_ACTOR.MONSTER;
            console.log(`Current actor: ${this.currentActor}`);
            
            // Clear any previous actions
            this.declaredAction = null;
            this.respondingAction = null;
            
            if (this.currentActor === TURN_ACTOR.PLAYER) {
                // Player acts first - show attack/defense options only on first turn
                this.battleState = BATTLE_STATE.ACTOR_PHASE;
                console.log("Player is ACTOR - can declare action");
                
                return {
                    text: `${firstTurnText}\n\nYou face the ${this.currentMonster.name}. Choose your opening move!`,
                    choices: this.getBattleChoices()
                };
                
            } else {
                // Monster acts first - determine and declare monster's action
                console.log("Monster is ACTOR - declaring action");
                
                const monsterAction = this.determineMonsterAction();
                monsterAction.actor = TURN_ACTOR.MONSTER;
                this.declaredAction = monsterAction;
                
                console.log("Monster declared:", monsterAction);
                
                // Get weapon type from gameLogic
                const weaponType = this.gameLogic.getWeaponType();
                const monsterActionText = this.getMonsterActionText(monsterAction, weaponType);
                
                // Player must now respond
                this.battleState = BATTLE_STATE.RESPONDER_PHASE;
                console.log("Player is RESPONDER - must respond to monster action");
                
                // Create contextual prompt based on monster's action type
                let responsePrompt = "";
                switch(monsterAction.type) {
                    case 'attack':
                        responsePrompt = "How will you defend yourself?";
                        break;
                    case 'defend':
                        responsePrompt = "The enemy is defending. Strike now or prepare?";
                        break;
                    case 'magic':
                        responsePrompt = "Will you interrupt the spell or brace yourself?";
                        break;
                    default:
                        responsePrompt = "How will you respond?";
                }
                
                return {
                    text: `${firstTurnText}\n\n${monsterActionText}\n\n${responsePrompt}`,
                    choices: this.getBattleChoices()
                };
            }
        } catch (error) {
            console.error("Error in beginBattlePhase:", error);
            // Fallback - player goes first
            this.battleState = BATTLE_STATE.ACTOR_PHASE;
            this.currentActor = TURN_ACTOR.PLAYER;
            return {
                text: `You face the ${this.currentMonster.name} in combat.`,
                choices: this.getBattleChoices()
            };
        }
    }

    /**
     * Play dice animation for calculations
     */
    playDiceAnimation() {
        if (this.diceElement) {
            this.diceElement.style.display = 'block';
            this.diceElement.style.opacity = '1';
            this.diceElement.play();
            
            this.battleSounds.dice.play().catch(e => console.warn('Dice sound failed:', e));
            
            setTimeout(() => {
                this.diceElement.style.opacity = '0';
                setTimeout(() => {
                    this.diceElement.style.display = 'none';
                    this.diceElement.pause();
                }, 500);
            }, 2000);
        }
    }

    /**
     * Handle monster defeat
     * @returns {Object} - Contains text and nextDialogue
     */
    async handleMonsterDefeat() {
        this.battleState = BATTLE_STATE.VICTORY;
        this.inBattle = false; // Clear legacy flag
        
        // Play victory sound
        this.battleSounds.victory.play().catch(e => console.warn('Victory sound failed:', e));
        
        // Stop battle music
        if (this.currentBattleMusic) {
            this.currentBattleMusic.pause();
            this.currentBattleMusic.currentTime = 0;
        }
        
        // Calculate rewards based on difficulty
        const levelDifference = this.currentMonster.level - this.gameLogic.stats.level;
        const difficultyMultiplier = Math.max(1, 1 + (levelDifference * 0.2));
        
        const baseGold = this.currentMonster.level * 10;
        const baseXp = this.currentMonster.level * 15;
        
        const goldReward = Math.floor(baseGold * difficultyMultiplier);
        const xpReward = Math.floor(baseXp * difficultyMultiplier);
        
        // Grant rewards
        this.gameLogic.modifyGold(goldReward);
        const newLevel = this.gameLogic.addExperience(xpReward);
        
        // Hide monster stats UI
        if (this.monsterStats) {
            this.monsterStats.style.display = 'none';
        }

        let rewardText = `You defeated the ${this.currentMonster.name}! You gain ${goldReward} gold and ${xpReward} experience!`;
        
        if (newLevel > this.gameLogic.stats.level - 1) {
            rewardText += `\nCongratulations! You reached level ${newLevel}!`;
        }

        // Determine next dialogue based on monster
        let nextDialogue = 'Victory';
        
        switch(this.currentMonster.name) {
            case 'Shadow Beast':
                nextDialogue = 'ShadowBeastDefeated';
                break;
            case 'Shard Warden':
                nextDialogue = 'DefeatWarden';
                break;
            case 'Slime Beast':
                nextDialogue = 'SlimeBeastDefeated';
                break;
        }

        // Reset battle state
        this.battleState = BATTLE_STATE.NOT_STARTED;

        return {
            text: rewardText,
            nextDialogue: nextDialogue
        };
    }

    /**
     * Handle player defeat
     * @returns {Object} - Contains text and nextDialogue
     */
    async handlePlayerDefeat() {
        this.battleState = BATTLE_STATE.DEFEAT;
        this.inBattle = false; // Clear legacy flag
        
        // Play defeat sound
        this.battleSounds.defeat.play().catch(e => console.warn('Defeat sound failed:', e));
        
        // Stop battle music
        if (this.currentBattleMusic) {
            this.currentBattleMusic.pause();
            this.currentBattleMusic.currentTime = 0;
        }
        
        // Hide monster stats UI
        if (this.monsterStats) {
            this.monsterStats.style.display = 'none';
        }
        
        // Reset battle state
        this.battleState = BATTLE_STATE.NOT_STARTED;
        
        return {
            text: `You have been defeated by the ${this.currentMonster.name}...`,
            nextDialogue: 'GameOver'
        };
    }

    /**
     * Utility function to capitalize first letter
     * @param {string} string - Input string
     * @returns {string} - String with first letter capitalized
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * Determine monster's action using intelligent AI
     * @returns {Object} - Contains action type and details
     */
    determineMonsterAction() {
        const monster = this.currentMonster;
        const playerHealth = this.gameLogic.stats.health;
        const playerMaxHealth = this.gameLogic.stats.maxHealth;
        const monsterHealthPercent = (monster.health / monster.maxHealth) * 100;
        const playerHealthPercent = (playerHealth / playerMaxHealth) * 100;
        
        // CRITICAL: Heal if very low health (< 30%)
        if (monsterHealthPercent < 30 && Math.random() < 0.7) {
            return {
                type: 'magic',
                magicType: 'selfHeal'
            };
        }
        
        // AGGRESSIVE: Attack if player is low health (< 40%)
        if (playerHealthPercent < 40 && Math.random() < 0.8) {
            return this.chooseMonsterAttack();
        }
        
        // DEFENSIVE: Defend if monster is low health (< 50%)
        if (monsterHealthPercent < 50 && Math.random() < 0.5) {
            return this.chooseMonsterDefense();
        }
        
        // BUFF: Use attack buff if healthy and hasn't buffed yet
        if (monsterHealthPercent > 70 && !monster.hasAttackBuff && Math.random() < 0.2) {
            monster.hasAttackBuff = true;
            return {
                type: 'magic',
                magicType: 'attackBuff'
            };
        }
        
        // DEBUFF: Weaken player if they're strong
        if (playerHealthPercent > 70 && Math.random() < 0.15) {
            return {
                type: 'magic',
                magicType: 'playerDebuff'
            };
        }
        
        // DEFAULT: Weighted random decision (60% attack, 30% defend, 10% magic)
        const roll = Math.random();
        if (roll < 0.6) {
            return this.chooseMonsterAttack();
        } else if (roll < 0.9) {
            return this.chooseMonsterDefense();
        } else {
            return this.chooseMonsterMagic();
        }
    }
    
    /**
     * Choose attack for monster based on monster type
     * @returns {Object} - Attack action
     */
    chooseMonsterAttack() {
        // Get monster ID from name
        const monsterId = this.currentMonster.name.toLowerCase().replace(/\s+/g, '');
        
        // Use the new dialogue system to get random attack type
        const attackType = getRandomAttackType(monsterId);
        
        if (!attackType) {
            console.warn(`No attack types found for ${monsterId}, using default`);
            return { type: 'attack', attackType: 'slam' };
        }
        
        return { type: 'attack', attackType };
    }
    
    /**
     * Choose defense for monster based on monster type
     * @returns {Object} - Defense action
     */
    chooseMonsterDefense() {
        // Get monster ID from name
        const monsterId = this.currentMonster.name.toLowerCase().replace(/\s+/g, '');
        
        // Use the new dialogue system to get random defend type
        const defendType = getRandomDefendType(monsterId);
        
        if (!defendType) {
            console.warn(`No defend types found for ${monsterId}, using default`);
            return { type: 'defend', defendType: 'absorb' };
        }
        
        return { type: 'defend', defendType };
    }
    
    /**
     * Choose magic for monster
     * @returns {Object} - Magic action
     */
    chooseMonsterMagic() {
        // Get monster ID from name
        const monsterId = this.currentMonster.name.toLowerCase().replace(/\s+/g, '');
        
        // Use the new dialogue system to get random magic type
        const magicType = getRandomMagicType(monsterId);
        
        if (!magicType) {
            console.warn(`No magic types found for ${monsterId}, using default`);
            return { type: 'magic', magicType: 'selfBuff' };
        }
        
        return { type: 'magic', magicType };
    }
    
    /**
     * Get appropriate text for monster's action
     * @param {Object} action - The monster's action
     * @param {string} weaponType - The player's weapon type (sword, axe, dagger)
     * @returns {string} - Text describing the monster's action
     */
    getMonsterActionText(action, weaponType) {
        const monsterId = this.currentMonster.name.toLowerCase().replace(/\s+/g, '');
        
        console.log(`Getting action text for ${monsterId}, weapon: ${weaponType}, action:`, action);
        
        let actionText = null;
        
        switch (action.type) {
            case 'attack':
                actionText = getAttackDialogue(monsterId, weaponType, action.attackType);
                
                if (!actionText) {
                    console.warn(`No attack dialogue for ${weaponType}.${action.attackType}`);
                    return `The ${this.currentMonster.name} attacks with ${action.attackType}!`;
                }
                return actionText;
                
            case 'defend':
                actionText = getDefendDialogue(monsterId, weaponType, action.defendType);
                
                if (!actionText) {
                    console.warn(`No defend dialogue for ${weaponType}.${action.defendType}`);
                    return `The ${this.currentMonster.name} prepares to defend with ${action.defendType}!`;
                }
                return actionText;
                
            case 'magic':
                actionText = getMagicDialogue(monsterId, action.magicType);
                
                if (!actionText) {
                    console.warn(`No magic dialogue for ${action.magicType}`);
                    return `The ${this.currentMonster.name} casts a spell!`;
                }
                return actionText;
                
            default:
                return `The ${this.currentMonster.name} makes a move!`;
        }
    }
    
    /**
     * Called when battle preparation is complete
     * @returns {Promise<Object>} - Battle phase result with text and choices
     */
    async onBattleReady() {
        try {
            console.log("Battle phase starting after preparation");
            
            const result = await this.beginBattlePhase();
            
            if (!result || !result.text) {
                console.error("Invalid battle phase result:", result);
                return { 
                    text: `You face the ${this.currentMonster.name}. What will you do?`,
                    choices: this.getBattleChoices()
                };
            }
            
            console.log("Battle phase ready result:", result);
            return result;
            
        } catch (error) {
            console.error("Error in onBattleReady:", error);
            
            return {
                text: `Battle with ${this.currentMonster.name} begins. What will you do?`,
                choices: this.getBattleChoices()
            };
        }
    }

    // Delegate action methods to BattleActions
    async handlePlayerAction(actionType, actionName) {
        return this.actions.handlePlayerAction(actionType, actionName);
    }

    async continueAfterPotion() {
        return this.actions.continueAfterPotion();
    }
}

export { BattleManager, BattlePreparationManager, BATTLE_STATE, TURN_ACTOR };