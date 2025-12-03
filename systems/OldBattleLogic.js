import TextManager from '../ui/TextDesignManager.js';
import { DIALOGUES } from '../managers/DialogueManager.js';
import { MONSTER_DIALOGUES } from './BattleDialogue.js';
import gameLogic from '../core/GameLogic.js';
import CharacterManager from '../managers/CharacterManager.js';

class BattleManager {
    constructor(gameLogic, textManager) {
        this.gameLogic = gameLogic;
        this.textManager = textManager;
        this.monsterStats = document.getElementById('monsterStats');
        this.monsterName = document.getElementById('monsterName');
        this.monsterHealth = document.getElementById('monsterHealth');
        this.monsterLevel = document.getElementById('monsterLevel');
        this.monsterHealthBar = document.querySelector('.monsterHealthBar');
        this.diceElement = document.getElementById('dice'); // Dice roll animation element
        this.gameLogic = gameLogic;
        this.textManager = textManager;
        // Load monster dialogues
        this.monsterDialogues = MONSTER_DIALOGUES || {}; // Assuming MONSTER_DIALOGUES is imported
        
        // Initialize audio elements
        this.battleSounds = {
            dice: new Audio('Assets/dice-roll.mp3'),
            attack: new Audio('Assets/attack-sound.mp3'),
            defend: new Audio('Assets/defend-sound.mp3'),
            victory: new Audio('Assets/victory-sound.mp3'),
            defeat: new Audio('Assets/defeat-sound.mp3')
        };
        
        this.battleMusic = {
            slimeBeast: new Audio('Assets/slime-battle.mp3'),
            shardWarden: new Audio('Assets/warden-battle.mp3'),
            default: new Audio('Assets/default-battle.mp3')
        };
        
        // Initialize battle state
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
            // Add other monsters here
        };
        
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
                offensive: 0.7,  // Poor with offensive
                defensive: 0.8,  // Poor with defensive
                balanced: 1.2    // Better with balanced
            },
            'Short Sword': {
                offensive: 1.0,
                defensive: 1.0,
                balanced: 1.1
            },
            'Steel Axe': {
                offensive: 1.3,  // Great with offensive
                defensive: 0.7,  // Poor with defensive
                balanced: 0.9
            }
            // Add more weapons as needed
        };
        
        this.currentMonster = null;
        this.selectedStance = null;
        this.inBattle = false;
        this.isPlayerTurn = false;
        this.currentBattleMusic = null;
        this.battlePrepManager = new BattlePreparationManager(gameLogic, this);
    }

/**
 * Start the battle sequence
 * @param {string} monsterName - The name of the monster to battle
 * @returns {Promise} - Resolves when battle prep is complete
 */
async startBattle(monsterName) {
    console.log(`BattleManager.startBattle called with monster: ${monsterName}`);
    
    // Check if battle is already in progress
    if (this.inBattle) {
        console.warn("Battle already in progress, not starting new battle");
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
    
    this.inBattle = true;
    this.updateMonsterStats();
    
    // Show monster stats UI
    if (this.monsterStats) {
        this.monsterStats.style.display = 'block';
    }
    
    // Try to start battle music - gracefully handle errors
    try {
        this.playBattleMusic(monsterName.toLowerCase().replace(/\s+/g, ''));
    } catch (error) {
        console.warn("Failed to play battle music:", error);
        // Continue without music - don't let this stop the battle
    }
    
    // Get monster intro text from dialogue file
    const introText = this.getMonsterIntroText(monsterName);
    console.log("Monster intro text:", introText);
    
    if (introText && this.textManager) {
        try {
            await this.textManager.typeText(introText);
        } catch (error) {
            console.error("Error displaying intro text:", error);
            // Continue anyway
        }
    }
    
    // Show weapon/potion selection
    try {
        console.log("Showing battle preparation screen");
        return this.battlePrepManager.show();
    } catch (error) {
        console.error("Error showing battle preparation:", error);
        // Provide a basic fallback instead of throwing
        this.inBattle = false; // Reset battle state on error
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
        if (!monsterName) return `A mysterious creature appears before you!`;
        
        const normalizedName = monsterName.replace(/\s+/g, '').toLowerCase();
        
        // First, try exact match with the formatted name
        for (const key in this.monsterDialogues) {
            const monster = this.monsterDialogues[key];
            if (key.toLowerCase() === normalizedName) {
                return monster.introText || `A ${monsterName} appears before you!`;
            }
        }
        
        // Second attempt: try to match by the monster's "name" property
        for (const key in this.monsterDialogues) {
            const monster = this.monsterDialogues[key];
            if (monster.name && monster.name.toLowerCase() === monsterName.toLowerCase()) {
                return monster.introText || `A ${monsterName} appears before you!`;
            }
        }
        
        // Third attempt: try partial matches (in case of slight name variations)
        for (const key in this.monsterDialogues) {
            const monster = this.monsterDialogues[key];
            const keyNormalized = key.toLowerCase();
            const nameNormalized = normalizedName.toLowerCase();
            
            if (keyNormalized.includes(nameNormalized) || 
                (monster.name && monster.name.toLowerCase().includes(monsterName.toLowerCase()))) {
                return monster.introText || `A ${monsterName} appears before you!`;
            }
        }
        
        // If all else fails, return a default message
        console.warn(`No dialogue found for monster: ${monsterName}`);
        return `A ${monsterName} appears before you!`;
    }
    
    /**
     * Update the monster stats display
     */
    updateMonsterStats() {
        if (this.currentMonster && this.monsterStats) {
            // Update text values
            this.monsterName.textContent = this.currentMonster.name;
            this.monsterHealth.textContent = this.currentMonster.health;
            this.monsterLevel.textContent = this.currentMonster.level;

            // Update health bar
            if (this.monsterHealthBar) {
                const healthPercent = (this.currentMonster.health / this.currentMonster.maxHealth) * 100;
                this.monsterHealthBar.style.width = `${healthPercent}%`;

                // Calculate color based on health percentage
                const hue = (healthPercent * 1.2); // This gives us a range from 0 (red) to 120 (green)
                const saturation = 90; // Keep colors vibrant
                const lightness = 45; // Keep colors visible but not too bright
        
                // Create gradient with calculated color
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
     * @param {string} monsterType - The type of monster
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
     * Get weapon selection options for battle preparation
     * @returns {Array} - Array of weapon choice objects
     */
    getWeaponSelectionChoices() {
        return this.gameLogic.inventory.weapons.map(weaponName => ({
            text: `Equip ${weaponName}`,
            action: 'equipForBattle',
            params: { weapon: weaponName }
        }));
    }
    
    /**
     * Get stance selection options after weapon is chosen
     * @returns {Array} - Array of stance choice objects
     */
    getStanceSelectionChoices() {
        return Object.values(this.stances).map(stance => ({
            text: `${stance.name} Stance`,
            action: 'selectStance',
            params: { stance: stance.name.toLowerCase() }
        }));
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
     * Get battle action choices based on selected stance
     * @returns {Array} - Array of action choice objects
     */
    getBattleChoices() {
        if (!this.selectedStance) {
            // Default choices if no stance selected
            return [
                { text: "Attack", action: 'battleAttack' },
                { text: "Dodge", action: 'battleDodge' },
                { text: "Use Potion", action: 'useHealth' }
            ];
        }
        
        const stance = this.stances[this.selectedStance];
        
        if (!stance) {
            console.error(`Stance "${this.selectedStance}" not found!`);
            return [];
        }
        
        // If it's first turn and player goes first, don't show defensive actions
        // since there's nothing to defend against yet
        if (this.isPlayerTurn && !this.pendingMonsterAction) {
            // Only show offensive actions
            const offensiveActions = stance.actions.filter(action => 
                this.getActionTypeFromName(action) === 'battleAttack'
            );
            
            const choices = offensiveActions.map(action => ({
                text: action,
                action: 'battleAttack',
                params: { actionName: action }
            }));
            
            // Always add potion option
            choices.push({ text: "Use Potion", action: 'useHealth' });
            
            return choices;
        }
        
        // Otherwise show all stance actions
        const choices = stance.actions.map(action => ({
            text: action,
            action: this.getActionTypeFromName(action),
            params: { actionName: action }
        }));
        
        // Always add potion option
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
            'Dodge': 'battleDodge',
            'Counter': 'battleCounter',
            
            // Generic actions
            'Attack': 'battleAttack',
            'Defend': 'battleDefend'
        };
        
        return actionMap[actionName] || 'battleAttack';
    }
    
    /**
     * Roll the dice to determine first turn and display animation
     * @returns {Promise} - Resolves when dice animation completes
     */
    async rollForFirstTurn() {
        // Show dice animation
        if (this.diceElement) {
            this.diceElement.style.display = 'block';
            this.diceElement.style.opacity = '1';
            this.diceElement.play();
            
            // Play dice sound
            this.battleSounds.dice.play().catch(e => console.warn('Dice sound failed:', e));
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animation
        
        // Determine first turn
        const playerRoll = Math.floor(Math.random() * 6) + 1;
        const monsterRoll = Math.floor(Math.random() * 6) + 1;
        
        // Hide dice
        if (this.diceElement) {
            this.diceElement.style.opacity = '0';
            setTimeout(() => {
                this.diceElement.style.display = 'none';
                this.diceElement.pause();
            }, 500);
        }
        
        // Set turn based on roll
        this.isPlayerTurn = playerRoll >= monsterRoll;
        
        return {
            playerRoll,
            monsterRoll,
            playerFirst: this.isPlayerTurn
        };
    }
    
    /**
     * Begin the battle phase after preparation
     * @returns {Object} - Contains text and choices for the next step
     */
    async beginBattlePhase() {
        try {
            // Roll for first turn
            const rollResult = await this.rollForFirstTurn();
            const rollText = `You rolled ${rollResult.playerRoll} and the ${this.currentMonster.name} rolled ${rollResult.monsterRoll}. ${rollResult.playerFirst ? 'You go first!' : 'The monster goes first!'}`;
            
            if (rollResult.playerFirst) {
                // Player's turn first
                return {
                    text: `${rollText}\nYou face the ${this.currentMonster.name}. What will you do?`,
                    choices: this.getBattleChoices()
                };
            } else {
                // Monster's turn first - implement monster's action
                const monsterAction = this.determineMonsterAction();
                const weaponType = this.gameLogic.inventory.equippedWeapon?.toLowerCase().replace(/\s+/g, '') || 'default';
                const monsterActionText = this.getMonsterActionText(monsterAction, weaponType);
                
                return {
                    text: `${rollText}\n${monsterActionText}`,
                    choices: this.getBattleChoices(),
                    monsterAction: monsterAction
                };
            }
        } catch (error) {
            console.error("Error determining battle phase:", error);
            // Return fallback data
            return {
                text: `You face the ${this.currentMonster.name} in combat.`,
                choices: this.getBattleChoices()
            };
        }
    }

/**
 * Handle player choice selection
 * @param {Object} choice - The choice object
 */
async makeChoice(choice) {
    console.log("Choice made:", choice);
    
    // Prevent double-clicks or actions while processing
    if (this.actionInProgress) {
        console.log("Action already in progress, ignoring");
        return;
    }
    
    this.actionInProgress = true;
    
    try {
        // Remove focus from buttons for better UX
        [this.button1, this.button2, this.button3].forEach(button => {
            if (button) button.blur();
        });
        
        // Handle action first, if present
        if (choice.action) {
            console.log(`Handling action: ${choice.action}`);
            const params = choice.params || {};
            
            // Special handling for 'fight' action to prevent multiple battle initiations
            if (choice.action === 'fight' && this.battleManager && this.battleManager.inBattle) {
                console.log("Battle already in progress, not restarting");
                // Skip the action but continue with nextDialogue if present
            } else {
                await this.handleAction(choice.action, params);
            }
            
            // If we're in a battle, don't transition to nextDialogue automatically
            if (this.battleManager && this.battleManager.inBattle && !this.pendingBattleResult) {
                console.log("In battle, not proceeding to next dialogue");
                this.actionInProgress = false;
                return;
            }
        }
        
        // Only proceed to next dialogue if specified AND we're not in active battle
        if (choice.nextDialogue && 
            (!this.battleManager || !this.battleManager.inBattle || this.pendingBattleResult)) {
            console.log(`Moving to next dialogue: ${choice.nextDialogue}`);
            await this.startDialogue(choice.nextDialogue);
        }
    } catch (error) {
        console.error("Error in makeChoice:", error);
    } finally {
        this.actionInProgress = false;
    }
}
    
    async performAttack(actionName = 'Attack') {
        // Set a flag to track that we're in the middle of an action
        this.actionInProgress = true;
        
        try {
            // Play attack sound
            this.battleSounds.attack.play().catch(e => console.warn('Attack sound failed:', e));
            
            // Show dice animation for attack roll
            this.playDiceAnimation();
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            let battleText = '';
            const weaponType = this.gameLogic.inventory.equippedWeapon?.toLowerCase().replace(/\s+/g, '') || 'default';
            
            // Calculate attack success based on weapon, stance, and other factors
            const attackSuccess = this.calculateAttackSuccess(actionName);
            
            // If monster has a pending action from previous turn, handle appropriate response
            if (this.pendingMonsterAction) {
                if (this.pendingMonsterAction.type === 'defend') {
                    // Monster was defending, get appropriate attack dialogue
                    const monsterKey = this.currentMonster.name.replace(/\s+/g, '').toLowerCase();
                    const dialogues = this.monsterDialogues[monsterKey];
                    
                    if (dialogues && dialogues.playerAttacks) {
                        // Get correct counter-attack dialogue based on defense type
                        const attackText = dialogues.playerAttacks[weaponType]?.[`vs${this.capitalizeFirstLetter(this.pendingMonsterAction.defendType)}`];
                        if (attackText) {
                            battleText += `${attackText}\n`;
                        }
                    }
                }
            }
            
            // Process attack result
            if (attackSuccess) {
                // Calculate damage based on weapon, stance, and level difference
                const damage = this.calculateDamage(actionName);
                
                // Apply damage to monster
                this.currentMonster.health = Math.max(0, this.currentMonster.health - damage);
                
                battleText += `Your ${actionName} hits ${this.currentMonster.name} for ${damage} damage!\n`;
                this.updateMonsterStats();
            } else {
                battleText += `Your ${actionName} misses!\n`;
            }
    
            // Check if monster is defeated
            if (this.currentMonster.health <= 0) {
                this.actionInProgress = false;
                return await this.handleMonsterDefeat();
            }
    
            // Monster's turn - determine action
            this.pendingMonsterAction = null; // Reset pending action
            const monsterAction = this.determineMonsterAction();
            
            // Fetch appropriate dialogue and apply action effects
            const monsterActionText = this.getMonsterActionText(monsterAction, weaponType);
            battleText += `\n${monsterActionText}`;
            
            // Store action for next turn's context
            this.pendingMonsterAction = monsterAction;
            
            // Apply monster action effects
            if (monsterAction.type === 'attack') {
                // Direct attack hits player
                const monsterDamage = this.getMonsterAttackValue();
                this.gameLogic.takeDamage(monsterDamage);
                battleText += `\nYou take ${monsterDamage} damage!`;
                
                // Check if player is defeated
                if (this.gameLogic.stats.health <= 0) {
                    this.actionInProgress = false;
                    return await this.handlePlayerDefeat();
                }
            } else if (monsterAction.type === 'magic') {
                // Apply magic effects
                if (monsterAction.magicType === 'selfBuff1') {
                    this.currentMonster.baseAttack += 2;
                    battleText += "\nThe monster's attack power increases!";
                } else if (monsterAction.magicType === 'selfBuff2') {
                    this.currentMonster.defenseChance += 0.1;
                    battleText += "\nThe monster's defenses strengthen!";
                } else if (monsterAction.magicType === 'playerDebuff') {
                    this.gameLogic.takeDamage(5);
                    battleText += "\nYou feel weakened and lose 5 health!";
                    
                    // Check if player is defeated
                    if (this.gameLogic.stats.health <= 0) {
                        this.actionInProgress = false;
                        return await this.handlePlayerDefeat();
                    }
                }
            }
    
            this.actionInProgress = false;
            return {
                text: battleText,
                choices: this.getBattleChoices()
            };
        } catch (error) {
            console.error("Error in performAttack:", error);
            this.actionInProgress = false;
            return {
                text: "Something unexpected happened during your attack.",
                choices: this.getBattleChoices()
            };
        }
    }

/**
 * Handle player defend action
 * @param {string} actionName - The name of the defend action
 * @returns {Object} - Contains text and choices for next step
 */
async performDefend(actionName = 'Block') {
    this.actionInProgress = true;
    
    try {
        // Play defend sound
        this.battleSounds.defend.play().catch(e => console.warn('Defend sound failed:', e));
        
        let battleText = '';
        const weaponType = this.gameLogic.inventory.equippedWeapon?.toLowerCase().replace(/\s+/g, '') || 'default';
        
        // If monster has a pending attack from previous turn, handle the defense properly
        if (this.pendingMonsterAction && this.pendingMonsterAction.type === 'attack') {
            const monsterKey = this.currentMonster.name.replace(/\s+/g, '').toLowerCase();
            const dialogues = this.monsterDialogues[monsterKey];
            
            // Show dice animation for defense roll
            this.playDiceAnimation();
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (dialogues && dialogues.playerDefends) {
                // Get correct defense dialogue
                const defenseText = dialogues.playerDefends[weaponType]?.[`vs${this.capitalizeFirstLetter(this.pendingMonsterAction.attackType)}`];
                if (defenseText) {
                    battleText += `${defenseText}\n`;
                }
            }
            
            // Check if the defense is the correct counter to the attack
            const isCorrectDefense = this.isCorrectDefenseForAttack(actionName, this.pendingMonsterAction.attackType);
            
            if (isCorrectDefense) {
                // Perfect defense - 100% success
                battleText += `Your ${actionName} perfectly counters the attack!\n`;
            } else {
                // Calculate defense success chance
                const defenseSuccess = this.calculateDefenseSuccess(actionName);
                if (defenseSuccess) {
                    battleText += `You successfully defend against the attack!\n`;
                } else {
                    // Defense fails - take reduced damage
                    const reducedDamage = Math.floor(this.getMonsterAttackValue() * 0.5);
                    this.gameLogic.takeDamage(reducedDamage);
                    battleText += `Your defense partially fails! You take ${reducedDamage} damage.\n`;
                    
                    // Check if player is defeated
                    if (this.gameLogic.stats.health <= 0) {
                        this.actionInProgress = false;
                        return await this.handlePlayerDefeat();
                    }
                }
            }
        } else {
            // No pending attack to defend against
            battleText += `You raise your defense in anticipation...\n`;
        }
        
        // Reset pending monster action
        this.pendingMonsterAction = null;
        
        // Monster's turn
        const monsterAction = this.determineMonsterAction();
        const monsterActionText = this.getMonsterActionText(monsterAction, weaponType);
        battleText += `\n${monsterActionText}`;
        
        // Store action for next turn's context
        this.pendingMonsterAction = monsterAction;
        
        // Apply monster action effects if it's an attack
        if (monsterAction.type === 'attack') {
            // We don't apply damage now because the player will have a chance to respond next turn
            battleText += `\nYou must respond to this attack on your next turn!`;
        } else if (monsterAction.type === 'magic') {
            // Apply magic effects immediately
            if (monsterAction.magicType === 'selfBuff1') {
                this.currentMonster.baseAttack += 2;
                battleText += "\nThe monster's attack power increases!";
            } else if (monsterAction.magicType === 'selfBuff2') {
                this.currentMonster.defenseChance += 0.1;
                battleText += "\nThe monster's defenses strengthen!";
            } else if (monsterAction.magicType === 'playerDebuff') {
                this.gameLogic.takeDamage(5);
                battleText += "\nYou feel weakened and lose 5 health!";
                
                // Check if player is defeated
                if (this.gameLogic.stats.health <= 0) {
                    this.actionInProgress = false;
                    return await this.handlePlayerDefeat();
                }
            }
        }

        this.actionInProgress = false;
        return {
            text: battleText,
            choices: this.getBattleChoices()
        };
    } catch (error) {
        console.error("Error in performDefend:", error);
        this.actionInProgress = false;
        return {
            text: "Something unexpected happened during your defense.",
            choices: this.getBattleChoices()
        };
    }
}

/**
 * Handle player dodge action
 * @returns {Object} - Contains text and choices for next step
 */
async performDodge() {
    this.actionInProgress = true;
    
    try {
        // Play dodge sound effect if available
        if (this.battleSounds.dodge) {
            this.battleSounds.dodge.play().catch(e => console.warn('Dodge sound failed:', e));
        } else if (this.battleSounds.defend) {
            // Fallback to defend sound if dodge sound isn't available
            this.battleSounds.defend.play().catch(e => console.warn('Defend sound failed:', e));
        }
        
        // Show dice animation
        this.playDiceAnimation();
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let battleText = '';
        const weaponType = this.gameLogic.inventory.equippedWeapon?.toLowerCase().replace(/\s+/g, '') || 'default';
        
        // Calculate dodge success chance
        const dodgeSuccess = this.calculateDodgeSuccess();
        
        // If monster has a pending attack from previous turn, handle the dodge properly
        if (this.pendingMonsterAction && this.pendingMonsterAction.type === 'attack') {
            if (dodgeSuccess) {
                battleText += `You successfully dodge the ${this.currentMonster.name}'s attack!\n`;
            } else {
                // Dodge fails - take full damage
                const damage = this.getMonsterAttackValue();
                this.gameLogic.takeDamage(damage);
                battleText += `You fail to dodge and take ${damage} damage!\n`;
                
                // Check if player is defeated
                if (this.gameLogic.stats.health <= 0) {
                    this.actionInProgress = false;
                    return await this.handlePlayerDefeat();
                }
            }
        } else {
            // No pending attack to dodge
            battleText += `You nimbly position yourself, ready to evade...\n`;
        }
        
        // Reset pending monster action
        this.pendingMonsterAction = null;
        
        // Monster's turn
        const monsterAction = this.determineMonsterAction();
        const monsterActionText = this.getMonsterActionText(monsterAction, weaponType);
        battleText += `\n${monsterActionText}`;
        
        // Store action for next turn's context
        this.pendingMonsterAction = monsterAction;
        
        // Apply monster action effects if it's an attack
        if (monsterAction.type === 'attack') {
            // We don't apply damage now because the player will have a chance to respond next turn
            battleText += `\nYou must respond to this attack on your next turn!`;
        } else if (monsterAction.type === 'magic') {
            // Apply magic effects immediately
            if (monsterAction.magicType === 'selfBuff1') {
                this.currentMonster.baseAttack += 2;
                battleText += "\nThe monster's attack power increases!";
            } else if (monsterAction.magicType === 'selfBuff2') {
                this.currentMonster.defenseChance += 0.1;
                battleText += "\nThe monster's defenses strengthen!";
            } else if (monsterAction.magicType === 'playerDebuff') {
                this.gameLogic.takeDamage(5);
                battleText += "\nYou feel weakened and lose 5 health!";
                
                // Check if player is defeated
                if (this.gameLogic.stats.health <= 0) {
                    this.actionInProgress = false;
                    return await this.handlePlayerDefeat();
                }
            }
        }

        this.actionInProgress = false;
        return {
            text: battleText,
            choices: this.getBattleChoices()
        };
    } catch (error) {
        console.error("Error in performDodge:", error);
        this.actionInProgress = false;
        return {
            text: "Something unexpected happened during your dodge.",
            choices: this.getBattleChoices()
        };
    }
}

/**
 * Handle player counter action
 * @returns {Object} - Contains text and choices for next step
 */
async performCounter() {
    this.actionInProgress = true;
    
    try {
        // Play counter sound effect if available, otherwise use attack sound
        if (this.battleSounds.counter) {
            this.battleSounds.counter.play().catch(e => console.warn('Counter sound failed:', e));
        } else if (this.battleSounds.attack) {
            this.battleSounds.attack.play().catch(e => console.warn('Attack sound as counter failed:', e));
        }
        
        // Show dice animation
        this.playDiceAnimation();
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let battleText = '';
        const weaponType = this.gameLogic.inventory.equippedWeapon?.toLowerCase().replace(/\s+/g, '') || 'default';
        
        // Calculate counter success chance - should be harder than normal attacks
        const counterSuccess = this.calculateCounterSuccess();
        
        // If monster has a pending attack from previous turn, handle the counter
        if (this.pendingMonsterAction && this.pendingMonsterAction.type === 'attack') {
            if (counterSuccess) {
                // Counter succeeds - deal damage to monster
                const counterDamage = this.calculateCounterDamage();
                this.currentMonster.health = Math.max(0, this.currentMonster.health - counterDamage);
                
                battleText += `You perfectly counter the ${this.currentMonster.name}'s attack and strike for ${counterDamage} damage!\n`;
                this.updateMonsterStats();
                
                // Check if monster is defeated
                if (this.currentMonster.health <= 0) {
                    this.actionInProgress = false;
                    return await this.handleMonsterDefeat();
                }
            } else {
                // Counter fails - take damage
                const damage = this.getMonsterAttackValue();
                this.gameLogic.takeDamage(damage);
                battleText += `Your counter fails and you take ${damage} damage!\n`;
                
                // Check if player is defeated
                if (this.gameLogic.stats.health <= 0) {
                    this.actionInProgress = false;
                    return await this.handlePlayerDefeat();
                }
            }
        } else {
            // No pending attack to counter
            battleText += `You prepare a counter-attack, but there's nothing to counter...\n`;
        }
        
        // Reset pending monster action
        this.pendingMonsterAction = null;
        
        // Monster's turn
        const monsterAction = this.determineMonsterAction();
        const monsterActionText = this.getMonsterActionText(monsterAction, weaponType);
        battleText += `\n${monsterActionText}`;
        
        // Store action for next turn's context
        this.pendingMonsterAction = monsterAction;
        
        // Apply monster action effects if it's an attack
        if (monsterAction.type === 'attack') {
            // We don't apply damage now because the player will have a chance to respond next turn
            battleText += `\nYou must respond to this attack on your next turn!`;
        } else if (monsterAction.type === 'magic') {
            // Apply magic effects immediately
            if (monsterAction.magicType === 'selfBuff1') {
                this.currentMonster.baseAttack += 2;
                battleText += "\nThe monster's attack power increases!";
            } else if (monsterAction.magicType === 'selfBuff2') {
                this.currentMonster.defenseChance += 0.1;
                battleText += "\nThe monster's defenses strengthen!";
            } else if (monsterAction.magicType === 'playerDebuff') {
                this.gameLogic.takeDamage(5);
                battleText += "\nYou feel weakened and lose 5 health!";
                
                // Check if player is defeated
                if (this.gameLogic.stats.health <= 0) {
                    this.actionInProgress = false;
                    return await this.handlePlayerDefeat();
                }
            }
        }

        this.actionInProgress = false;
        return {
            text: battleText,
            choices: this.getBattleChoices()
        };
    } catch (error) {
        console.error("Error in performCounter:", error);
        this.actionInProgress = false;
        return {
            text: "Something unexpected happened during your counter.",
            choices: this.getBattleChoices()
        };
    }
}

/**
 * Play dice animation for random calculations
 */
playDiceAnimation() {
    if (this.diceElement) {
        this.diceElement.style.display = 'block';
        this.diceElement.style.opacity = '1';
        this.diceElement.play();
        
        // Play dice sound
        this.battleSounds.dice.play().catch(e => console.warn('Dice sound failed:', e));
        
        // Hide dice after animation
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
 * Calculate if an attack is successful
 * @param {string} actionName - Name of the attack action
 * @returns {boolean} - True if attack hits
 */
calculateAttackSuccess(actionName) {
    // Base hit chance depends on action
    let baseHitChance = 0.7; // 70% base hit chance
    
    // Modify based on stance
    if (this.selectedStance) {
        baseHitChance += this.stances[this.selectedStance].hitRateModifier;
    }
    
    // Modify based on weapon and stance combination
    const weapon = this.gameLogic.inventory.equippedWeapon;
    if (weapon && this.selectedStance && this.weaponStanceEffectiveness[weapon]) {
        baseHitChance *= this.weaponStanceEffectiveness[weapon][this.selectedStance];
    }
    
    // More aggressive actions might have lower hit chance but higher damage
    if (actionName === 'Heavy Slash' || actionName === 'Deep Thrust') {
        baseHitChance -= 0.1;
    } else if (actionName === 'Quick Slice') {
        baseHitChance += 0.1;
    }
    
    // Level difference factor
    const levelDiff = this.gameLogic.stats.level - this.currentMonster.level;
    baseHitChance += levelDiff * 0.05; // +/- 5% per level difference
    
    // Ensure chance is within reasonable bounds
    baseHitChance = Math.max(0.2, Math.min(0.95, baseHitChance));
    
    // Roll for success
    return Math.random() < baseHitChance;
}

/**
 * Calculate damage for an attack
 * @param {string} actionName - Name of the attack action
 * @returns {number} - Amount of damage
 */
calculateDamage(actionName) {
    // Base damage from weapon
    const weaponDamage = this.gameLogic.getWeaponDamage();
    let damage = weaponDamage;
    
    // Add random factor (1-10)
    damage += Math.floor(Math.random() * 10) + 1;
    
    // Modify based on action type
    if (actionName === 'Heavy Slash') {
        damage *= 1.5; // 50% more damage for heavy attacks
    } else if (actionName === 'Deep Thrust') {
        damage *= 1.4; // 40% more damage for thrusts
    } else if (actionName === 'Light Slash' || actionName === 'Quick Slice') {
        damage *= 0.8; // 20% less damage for quick attacks
    }
    
    // Modify based on stance
    if (this.selectedStance) {
        damage *= this.stances[this.selectedStance].damageMultiplier;
    }
    
    // Weapon stance effectiveness modifier
    const weapon = this.gameLogic.inventory.equippedWeapon;
    if (weapon && this.selectedStance && this.weaponStanceEffectiveness[weapon]) {
        damage *= this.weaponStanceEffectiveness[weapon][this.selectedStance];
    }
    
    // Level difference factor
    const levelDiff = this.gameLogic.stats.level - this.currentMonster.level;
    damage *= (1 + levelDiff * 0.1); // +/- 10% per level difference
    
    // Ensure damage is at least 1
    return Math.max(1, Math.floor(damage));
}

/**
 * Calculate if defense is successful
 * @param {string} actionName - Name of the defense action
 * @returns {boolean} - True if defense succeeds
 */
calculateDefenseSuccess(actionName) {
    // Base defense chance
    let baseDefenseChance = 0.7; // 70% base success
    
    // Modify based on stance
    if (this.selectedStance) {
        if (this.selectedStance === 'defensive') {
            baseDefenseChance += 0.15; // defensive stance is better at defending
        } else if (this.selectedStance === 'offensive') {
            baseDefenseChance -= 0.1; // offensive stance is worse at defending
        }
    }
    
    // Different defense actions have different success rates
    if (actionName === 'Block') {
        baseDefenseChance += 0.1; // better at blocking
    } else if (actionName === 'Parry') {
        baseDefenseChance += 0.05; // slightly better at parrying
    }
    
    // Weapon stance effectiveness can influence defense success
    const weapon = this.gameLogic.inventory.equippedWeapon;
    if (weapon && this.selectedStance && this.weaponStanceEffectiveness[weapon]) {
        const effectiveness = this.weaponStanceEffectiveness[weapon][this.selectedStance];
        // Adjust based on weapon-stance compatibility
        if (effectiveness > 1.1) {
            baseDefenseChance += 0.1;
        } else if (effectiveness < 0.9) {
            baseDefenseChance -= 0.1;
        }
    }
    
    // Level difference factor
    const levelDiff = this.gameLogic.stats.level - this.currentMonster.level;
    baseDefenseChance += levelDiff * 0.05; // +/- 5% per level difference
    
    // Ensure chance is within reasonable bounds
    baseDefenseChance = Math.max(0.2, Math.min(0.95, baseDefenseChance));
    
    // Roll for success
    return Math.random() < baseDefenseChance;
}

/**
 * Calculate if dodge is successful
 * @returns {boolean} - True if dodge succeeds
 */
calculateDodgeSuccess() {
    // Base dodge chance
    let baseDodgeChance = 0.6; // 60% base success, harder than blocking
    
    // Modify based on stance
    if (this.selectedStance) {
        if (this.selectedStance === 'defensive') {
            baseDodgeChance += 0.1; // defensive stance is better at dodging
        } else if (this.selectedStance === 'balanced') {
            baseDodgeChance += 0.05; // balanced is slightly better at dodging
        }
    }
    
    // Weapon weight can affect dodge - heavier weapons make dodging harder
    const weapon = this.gameLogic.inventory.equippedWeapon;
    if (weapon === 'Steel Axe') {
        baseDodgeChance -= 0.1; // harder to dodge with heavy axe
    } else if (weapon === 'Rusty Knife') {
        baseDodgeChance += 0.05; // easier to dodge with light knife
    }
    
    // Level difference factor
    const levelDiff = this.gameLogic.stats.level - this.currentMonster.level;
    baseDodgeChance += levelDiff * 0.05; // +/- 5% per level difference
    
    // Ensure chance is within reasonable bounds
    baseDodgeChance = Math.max(0.2, Math.min(0.9, baseDodgeChance));
    
    // Roll for success
    return Math.random() < baseDodgeChance;
}

/**
 * Calculate if counter is successful
 * @returns {boolean} - True if counter succeeds
 */
calculateCounterSuccess() {
    // Base counter chance - should be lower than regular attacks
    let baseCounterChance = 0.5; // 50% base success, harder than normal attacks
    
    // Modify based on stance
    if (this.selectedStance) {
        if (this.selectedStance === 'balanced') {
            baseCounterChance += 0.2; // balanced stance is much better at countering
        } else if (this.selectedStance === 'defensive') {
            baseCounterChance += 0.1; // defensive stance is better at countering
        }
    }
    
    // Weapon type can affect counter ability
    const weapon = this.gameLogic.inventory.equippedWeapon;
    if (weapon === 'Short Sword') {
        baseCounterChance += 0.1; // swords are good for countering
    }
    
    // Level difference factor
    const levelDiff = this.gameLogic.stats.level - this.currentMonster.level;
    baseCounterChance += levelDiff * 0.05; // +/- 5% per level difference
    
    // Ensure chance is within reasonable bounds
    baseCounterChance = Math.max(0.2, Math.min(0.9, baseCounterChance));
    
    // Roll for success
    return Math.random() < baseCounterChance;
}

/**
 * Calculate damage for a counter attack
 * @returns {number} - Amount of damage
 */
calculateCounterDamage() {
    // Counter attacks do more damage than regular attacks
    const weaponDamage = this.gameLogic.getWeaponDamage();
    let damage = weaponDamage * 1.5; // 50% more damage for counters
    
    // Add random factor (1-10)
    damage += Math.floor(Math.random() * 10) + 1;
    
    // Modify based on stance
    if (this.selectedStance === 'balanced') {
        damage *= 1.2; // 20% more damage for balanced stance counters
    }
    
    // Level difference factor
    const levelDiff = this.gameLogic.stats.level - this.currentMonster.level;
    damage *= (1 + levelDiff * 0.1); // +/- 10% per level difference
    
    // Ensure damage is at least 1
    return Math.max(1, Math.floor(damage));
}

/**
 * Check if the defense is correct for the attack type
 * @param {string} defenseAction - The defense action used
 * @param {string} attackType - The monster's attack type
 * @returns {boolean} - True if this is the right defense for this attack
 */
isCorrectDefenseForAttack(defenseAction, attackType) {
    // Map of correct defenses for each attack type
    const correctDefenses = {
        'slam': 'Block',
        'crush': 'Block',
        'lunge': 'Parry',
        'pierce': 'Parry',
        'engulf': 'Dodge',
        'sweep': 'Dodge',
        'spray': 'Block',
        'pulse': 'Dodge'
    };
    
    return correctDefenses[attackType] === defenseAction;
}

/**
 * Get monster attack damage value
 * @returns {number} - Amount of damage
 */
getMonsterAttackValue() {
    // Base damage from monster stats
    const baseDamage = this.currentMonster.baseAttack;
    
    // Add random factor based on monster level
    const randomFactor = Math.floor(Math.random() * this.currentMonster.level) + 1;
    
    // Calculate final damage
    return baseDamage + randomFactor;
}

/**
 * Handle monster defeat
 * @returns {Object} - Contains text and nextDialogue
 */
async handleMonsterDefeat() {
    this.inBattle = false;
    
    // Play victory sound
    this.battleSounds.victory.play().catch(e => console.warn('Victory sound failed:', e));
    
    // Stop battle music
    if (this.currentBattleMusic) {
        this.currentBattleMusic.pause();
        this.currentBattleMusic.currentTime = 0;
    }
    
    // Calculate reward amount based on difficulty
    const levelDifference = this.currentMonster.level - this.gameLogic.stats.level;
    const difficultyMultiplier = Math.max(1, 1 + (levelDifference * 0.2)); // At least 1x, +20% per level above player
    
    // Base rewards
    const baseGold = this.currentMonster.level * 10;
    const baseXp = this.currentMonster.level * 15;
    
    // Apply difficulty multiplier
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
    
    // Add level up message if level changed
    if (newLevel > this.gameLogic.stats.level - 1) {
        rewardText += `\nCongratulations! You reached level ${newLevel}!`;
    }

    // Determine which dialogue to go to next based on the monster defeated
    let nextDialogue = 'Victory'; // Default generic victory dialogue
    
    // Use a switch or if statements to determine specific victory dialogues
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
        // Add more monsters as needed
    }

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
    this.inBattle = false;
    
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
    
    return {
        text: "You have been defeated by the ${this.currentMonster.name}...",
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
     * Determine monster's action (attack, defend, magic)
     * @returns {Object} - Contains action type and details
     */
    determineMonsterAction() {
        // Simple AI for now - 70% chance to attack, 20% to defend, 10% magic
        const roll = Math.random();
        if (roll < 0.7) {
            // Attack with random type
            const attackTypes = ['slam', 'lunge', 'engulf', 'spray'];
            const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            return { type: 'attack', attackType };
        } else if (roll < 0.9) {
            // Defend with random type
            const defendTypes = ['harden', 'split', 'absorb', 'deflect'];
            const defendType = defendTypes[Math.floor(Math.random() * defendTypes.length)];
            return { type: 'defend', defendType };
        } else {
            // Magic with random type
            const magicTypes = ['selfBuff1', 'selfBuff2', 'playerDebuff'];
            const magicType = magicTypes[Math.floor(Math.random() * magicTypes.length)];
            return { type: 'magic', magicType };
        }
    }
    
    /**
     * Get appropriate text for monster's action
     * @param {Object} action - The monster's action
     * @param {string} weaponType - The player's weapon type
     * @returns {string} - Text describing the monster's action
     */
    getMonsterActionText(action, weaponType) {
        const monsterKey = this.currentMonster.name.replace(/\s+/g, '').toLowerCase();
        const dialogues = this.monsterDialogues[monsterKey];
        
        if (!dialogues) {
            return `The ${this.currentMonster.name} makes a move!`;
        }
        
        switch (action.type) {
            case 'attack':
                return dialogues.attacks[weaponType]?.[action.attackType] || 
                       `The ${this.currentMonster.name} attacks you with a ${action.attackType}!`;
            case 'defend':
                return dialogues.defends[weaponType]?.[action.defendType] || 
                       `The ${this.currentMonster.name} prepares to defend with ${action.defendType}!`;
            case 'magic':
                return dialogues.magics[action.magicType] || 
                       `The ${this.currentMonster.name} casts a spell!`;
            default:
                return `The ${this.currentMonster.name} makes a move!`;
        }
    }
    
    /**
     * Call when battle preparation is complete
     */
    async onBattleReady() {
        try {
            console.log("Battle phase starting after preparation");
            
            // Set a flag to prevent duplicate battle actions
            if (this.battlePhaseInProgress) {
                console.warn("Battle phase already in progress, ignoring duplicate call");
                return;
            }
            
            this.battlePhaseInProgress = true;
            
            // Use await to properly handle the Promise returned by beginBattlePhase
            const result = await this.beginBattlePhase();
            
            // Add safety check for result
            if (!result || !result.text) {
                console.error("Invalid battle phase result:", result);
                // Provide a default text
                result = { 
                    text: `You face the ${this.currentMonster.name}. What will you do?`,
                    choices: this.getBattleChoices()
                };
            }
            
            // Update the text and choices
            if (this.textManager) {
                await this.textManager.typeText(result.text);
                this.textManager.showButtons(result.choices);
            } else {
                console.error("TextManager not available in BattleManager");
            }
            
            this.battlePhaseInProgress = false;
        } catch (error) {
            console.error("Error in battle phase:", error);
            this.battlePhaseInProgress = false;
            
            // Provide fallback behavior
            if (this.textManager) {
                await this.textManager.typeText(`Battle with ${this.currentMonster.name} begins. What will you do?`);
                this.textManager.showButtons(this.getBattleChoices());
            }
        }
    }y
}

/**
 * Battle Preparation Manager - handles weapon/potion/stance selection
 */
class BattlePreparationManager {
    constructor(gameLogic, battleManager) {
        this.gameLogic = gameLogic;
        this.battleManager = battleManager;
        
        // Create modal elements
        this.modal = document.createElement('div');
        this.modal.className = 'battle-prep-modal';
        this.setupModalHTML();
        
        // Bind event listeners
        this.bindEvents();
        
        // Add styles
        this.addStyles();
        
        // Track preparation stage
        this.prepStage = 'weapon'; // weapon -> potion -> stance
    }

    setupModalHTML() {
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Prepare for Battle</h2>
                </div>
                <div class="modal-tabs">
                    <button class="tab-btn active" data-tab="weapons">Weapons</button>
                    <button class="tab-btn" data-tab="potions">Potions</button>
                    <button class="tab-btn" data-tab="stance" disabled>Stance</button>
                </div>
                <div class="tab-content">
                    <div id="weapons-tab" class="tab-panel active">
                        <div class="items-grid"></div>
                    </div>
                    <div id="potions-tab" class="tab-panel">
                        <div class="potions-selection">
                            <h3>Select Potions (0/2)</h3>
                            <div class="items-grid"></div>
                        </div>
                    </div>
                    <div id="stance-tab" class="tab-panel">
                        <div class="stance-selection">
                            <h3>Choose Your Battle Stance</h3>
                            <div class="items-grid stance-grid"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="next-btn">Next</button>
                    <button class="ready-btn" style="display: none;">Ready for Battle</button>
                </div>
            </div>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .battle-prep-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1000;
                font-family: 'Seagram', sans-serif;
            }

            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #1a1003;
                color: #EdddE0;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #5f0cbd;
                width: 80%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #5f0cbd;
                padding-bottom: 10px;
            }

            .modal-tabs {
                display: flex;
                border-bottom: 2px solid #5f0cbd;
                margin-bottom: 20px;
            }

            .tab-btn {
                padding: 10px 20px;
                background: rgba(3, 13, 27, 0.767);
                color: #EdddE0;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                font-family: 'Seagram', sans-serif;
                font-size: 16px;
            }

            .tab-btn.active {
                opacity: 1;
                border-bottom: 2px solid #5f0cbd;
                margin-bottom: -2px;
                background: rgba(8, 2, 61, 0.959);
            }

            .tab-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .tab-panel {
                display: none;
            }

            .tab-panel.active {
                display: block;
            }

            .items-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 16px;
                padding: 16px;
            }

            .stance-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .item-card {
                border: 1px solid #5f0cbd;
                border-radius: 4px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(8, 2, 61, 0.959);
                text-align: center;
            }

            .item-card:hover {
                background-color: rgba(95, 12, 189, 0.3);
                transform: scale(1.05);
            }

            .item-card.equipped, .item-card.selected {
                border-color: #0066cc;
                background-color: rgba(0, 102, 204, 0.3);
            }

            .modal-footer {
                margin-top: 20px;
                text-align: right;
            }

            .next-btn, .ready-btn {
                padding: 10px 20px;
                background-color: #5f0cbd;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-family: 'Seagram', sans-serif;
                font-size: 16px;
            }

            .next-btn:hover, .ready-btn:hover {
                background-color: #4a099d;
                transform: scale(1.05);
            }
            
            .stance-card h3 {
                margin-top: 0;
                color: #EdddE0;
            }
            
            .stance-card p {
                color: #ccc;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // Tab switching
        this.modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    this.switchTab(btn.dataset.tab);
                }
            });
        });

        // Next button
        this.modal.querySelector('.next-btn').addEventListener('click', () => {
            this.nextStage();
        });

        // Ready button
        this.modal.querySelector('.ready-btn').addEventListener('click', () => {
            this.finishPreparation();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        this.modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab panels
        this.modal.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-tab`);
        });
        
        // Update current stage
        this.prepStage = tabName;
        
        // Update button text
        const nextBtn = this.modal.querySelector('.next-btn');
        const readyBtn = this.modal.querySelector('.ready-btn');
        
        if (tabName === 'stance') {
            nextBtn.style.display = 'none';
            readyBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            readyBtn.style.display = 'none';
        }
    }
    
    nextStage() {
        // Move to next preparation stage
        if (this.prepStage === 'weapon') {
            // Ensure a weapon is selected
            if (!this.gameLogic.inventory.equippedWeapon) {
                alert("You must equip a weapon!");
                return;
            }
            
            // Enable and switch to potions tab
            const potionsTab = this.modal.querySelector('[data-tab="potions"]');
            potionsTab.disabled = false;
            this.switchTab('potions');
            
        } else if (this.prepStage === 'potions') {
            // Always allow continuing from potions (they're optional)
            // Enable and switch to stance tab
            const stanceTab = this.modal.querySelector('[data-tab="stance"]');
            stanceTab.disabled = false;
            this.switchTab('stance');
            
            // Update stance options based on equipped weapon
            this.updateStanceDisplay();
        }
    }
    
    finishPreparation() {
        console.log("BattlePreparationManager.finishPreparation called");
        
        // Check if a stance is selected
        if (!this.battleManager.selectedStance) {
            console.warn("No stance selected");
            alert("You must select a stance!");
            return;
        }
        
        console.log(`Selected stance: ${this.battleManager.selectedStance}`);
        
        try {
            this.hide();
        } catch (error) {
            console.error("Error hiding preparation UI:", error);
            // Continue anyway - the battle is more important than UI cleanup
        }
        
        // Add try/catch to protect against errors in battle initialization
        try {
            console.log("Starting battle phase");
            // Begin battle phase
            this.battleManager.onBattleReady();
        } catch (error) {
            console.error("Error starting battle:", error);
            alert("An error occurred starting the battle. Please try again.");
        }
    }

    createWeaponCard(weapon) {
        const card = document.createElement('div');
        card.className = 'item-card weapon-card';
        if (weapon === this.gameLogic.inventory.equippedWeapon) {
            card.classList.add('equipped');
        }

        // Get weapon stats
        const weaponObj = this.gameLogic.weapons[weapon] || { damage: '?', image: 'Assets/unknown.png' };

        card.innerHTML = `
            <h3>${weapon}</h3>
            <div class="weapon-image">
                <img src="${weaponObj.image}" alt="${weapon}" style="max-width: 100%; height: 60px; object-fit: contain;">
            </div>
            <p>Damage: ${weaponObj.damage}</p>
        `;

        card.addEventListener('click', () => {
            this.gameLogic.equipWeapon(weapon);
            this.updateWeaponsDisplay();
        });

        return card;
    }
    
    createPotionCard(index) {
        const card = document.createElement('div');
        card.className = 'item-card potion-card';
        
        // Check if this potion is selected
        if (this.selectedPotions && this.selectedPotions.includes(index)) {
            card.classList.add('selected');
        }

        card.innerHTML = `
            <h3>Health Potion</h3>
            <div class="potion-image">
                <img src="Assets/health-potion.png" alt="Health Potion" style="max-width: 100%; height: 60px; object-fit: contain;">
            </div>
            <p>Restores 10 HP</p>
        `;

        card.addEventListener('click', () => {
            this.togglePotionSelection(index, card);
        });

        return card;
    }

    /**
     * Continue battle after using a potion
     * @returns {Object} - Contains text and choices for next step
     */
    async continueAfterPotion() {
        try {
            let battleText = "You prepare for the monster's next move.\n";
            const weaponType = this.gameLogic.inventory.equippedWeapon?.toLowerCase().replace(/\s+/g, '') || 'default';
            
            // Monster's turn
            const monsterAction = this.determineMonsterAction();
            const monsterActionText = this.getMonsterActionText(monsterAction, weaponType);
            battleText += monsterActionText;
            
            // Store action for next turn's context
            this.pendingMonsterAction = monsterAction;
            
            // Apply monster action effects if it's magic (attacks will be handled on player's next turn)
            if (monsterAction.type === 'magic') {
                // Apply magic effects immediately
                if (monsterAction.magicType === 'selfBuff1') {
                    this.currentMonster.baseAttack += 2;
                    battleText += "\nThe monster's attack power increases!";
                } else if (monsterAction.magicType === 'selfBuff2') {
                    this.currentMonster.defenseChance += 0.1;
                    battleText += "\nThe monster's defenses strengthen!";
                } else if (monsterAction.magicType === 'playerDebuff') {
                    this.gameLogic.takeDamage(5);
                    battleText += "\nYou feel weakened and lose 5 health!";
                    
                    // Check if player is defeated
                    if (this.gameLogic.stats.health <= 0) {
                        return await this.handlePlayerDefeat();
                    }
                }
            } else if (monsterAction.type === 'attack') {
                battleText += "\nYou must respond to this attack on your next turn!";
            }

            return {
                text: battleText,
                choices: this.getBattleChoices()
            };
        } catch (error) {
            console.error("Error handling post-potion action:", error);
            return {
                text: "The battle continues...",
                choices: this.getBattleChoices()
            };
        }
    }
    
    createStanceCard(stance) {
        const card = document.createElement('div');
        card.className = 'item-card stance-card';
        
        if (this.battleManager.selectedStance === stance.name.toLowerCase()) {
            card.classList.add('selected');
        }
        
        // Calculate stance effectiveness with current weapon
        let effectivenessText = "";
        const equippedWeapon = this.gameLogic.inventory.equippedWeapon;
        if (equippedWeapon && this.battleManager.weaponStanceEffectiveness[equippedWeapon]) {
            const effectiveness = this.battleManager.weaponStanceEffectiveness[equippedWeapon][stance.name.toLowerCase()];
            if (effectiveness > 1.1) {
                effectivenessText = "<strong style='color: #4CAF50;'>Excellent Match</strong>";
            } else if (effectiveness > 0.9) {
                effectivenessText = "<strong style='color: #FFC107;'>Good Match</strong>";
            } else {
                effectivenessText = "<strong style='color: #F44336;'>Poor Match</strong>";
            }
        }

        card.innerHTML = `
            <h3>${stance.name} Stance</h3>
            <p>${this.getStanceDescription(stance.name.toLowerCase())}</p>
            <p>Actions: ${stance.actions.join(', ')}</p>
            <p>${effectivenessText}</p>
        `;

        card.addEventListener('click', () => {
            // Select this stance
            this.battleManager.setStance(stance.name.toLowerCase());
            
            // Update UI
            this.modal.querySelectorAll('.stance-card').forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
        });

        return card;
    }
    
    getStanceDescription(stanceName) {
        const descriptions = {
            offensive: "Maximum damage, but lower hit chance. Best with heavy weapons.",
            defensive: "Focus on protection with counter-attacks. Higher hit chance, lower damage.",
            balanced: "Even mix of offense and defense. Good with versatile weapons."
        };
        
        return descriptions[stanceName] || "Unknown stance type";
    }
    
    togglePotionSelection(index, card) {
        // Initialize selected potions array if needed
        if (!this.selectedPotions) {
            this.selectedPotions = [];
        }
        
        // Toggle selection
        const potionIdx = this.selectedPotions.indexOf(index);
        if (potionIdx === -1) {
            // Add if not already selected (max 2)
            if (this.selectedPotions.length < 2) {
                this.selectedPotions.push(index);
                card.classList.add('selected');
            } else {
                alert("You can only select up to 2 potions!");
                return;
            }
        } else {
            // Remove if already selected
            this.selectedPotions.splice(potionIdx, 1);
            card.classList.remove('selected');
        }
        
        // Update selection counter
        const potionSelectionTitle = this.modal.querySelector('.potions-selection h3');
        if (potionSelectionTitle) {
            potionSelectionTitle.textContent = `Select Potions (${this.selectedPotions.length}/2)`;
        }
    }
    
    updateWeaponsDisplay() {
        const grid = this.modal.querySelector('#weapons-tab .items-grid');
        grid.innerHTML = '';
        this.gameLogic.inventory.weapons.forEach(weapon => {
            grid.appendChild(this.createWeaponCard(weapon));
        });
    }

    updatePotionsDisplay() {
        const grid = this.modal.querySelector('#potions-tab .items-grid');
        grid.innerHTML = '';
        
        // Reset selection
        this.selectedPotions = [];
        
        // Create potion cards based on available potions
        for (let i = 0; i < this.gameLogic.inventory.healthPotions; i++) {
            grid.appendChild(this.createPotionCard(i));
        }
        
        // Show message if no potions
        if (this.gameLogic.inventory.healthPotions === 0) {
            const noItemsMsg = document.createElement('p');
            noItemsMsg.textContent = "You don't have any health potions!";
            noItemsMsg.style.gridColumn = "1 / -1";
            noItemsMsg.style.textAlign = "center";
            grid.appendChild(noItemsMsg);
        }
    }
    
    updateStanceDisplay() {
        const grid = this.modal.querySelector('#stance-tab .stance-grid');
        grid.innerHTML = '';
        
        // Create stance cards
        Object.values(this.battleManager.stances).forEach(stance => {
            grid.appendChild(this.createStanceCard(stance));
        });
    }

    show() {
        console.log("BattlePreparationManager.show called");
        
        this.prepStage = 'weapon';
        
        try {
            this.updateWeaponsDisplay();
            this.updatePotionsDisplay();
        } catch (error) {
            console.error("Error updating preparation displays:", error);
        }
        
        // Reset tabs
        try {
            this.modal.querySelectorAll('.tab-btn').forEach(btn => {
                btn.disabled = btn.dataset.tab !== 'weapons';
                btn.classList.toggle('active', btn.dataset.tab === 'weapons');
            });
            
            // Reset panels
            this.modal.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === 'weapons-tab');
            });
            
            // Show next button, hide ready button
            const nextBtn = this.modal.querySelector('.next-btn');
            const readyBtn = this.modal.querySelector('.ready-btn');
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (readyBtn) readyBtn.style.display = 'none';
        } catch (error) {
            console.error("Error setting up battle preparation UI:", error);
        }
        
        // Show modal
        try {
            console.log("Displaying battle preparation modal");
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        } catch (error) {
            console.error("Error displaying modal:", error);
        }
        
        // Return promise that resolves when player is ready
        return new Promise(resolve => {
            this.onReadyCallback = resolve;
        });
    }

    hide() {
        this.modal.style.display = 'none';
        if (this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        
        // Resolve ready promise
        if (this.onReadyCallback) {
            this.onReadyCallback();
            this.onReadyCallback = null;
        }
    }
}

export { BattleManager, BattlePreparationManager };