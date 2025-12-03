import TextManager from '../ui/TextDesignManager.js';
import { DIALOGUES } from './DialogueManager.js';
import { MONSTER_DIALOGUES } from '../systems/BattleDialogue.js';
import gameLogic from '../core/GameLogic.js';
import { BattleManager } from '../systems/BattleLogic.js';
import CharacterManager from './CharacterManager.js';

class DialogueManager {
    constructor() {
        this.currentDialogue = null;
        this.currentTextIndex = 0;
        this.textManager = new TextManager();
        this.gameLogic = gameLogic;
        this.battleManager = new BattleManager(gameLogic, this.textManager);
        this.characterManager = new CharacterManager();
        this.pendingBattleResult = null;
        this.actionInProgress = false;

        this.button1 = document.getElementById('button1');
        this.button2 = document.getElementById('button2');
        this.button3 = document.getElementById('button3');

        // Event listener for advancing text when no choices are present
        document.addEventListener('nextText', () => {
            if (this.currentDialogue && !this.currentDialogue.texts[this.currentTextIndex].choices) {
                this.nextText();
            }
        });
        
        // Ensure MONSTER_DIALOGUES is accessible to BattleManager
        this.battleManager.monsterDialogues = MONSTER_DIALOGUES;
    }

    /**
     * Set up choice buttons based on provided choices
     * @param {Array} choices - Array of choice objects
     */
    setupChoices(choices) {
        console.log("Setting up choices:", choices);
        if (!choices || choices.length === 0) {
            this.textManager.hideAllButtons();
            return;
        }

        const buttons = [this.button1, this.button2, this.button3];
        // First hide all buttons
        this.textManager.hideAllButtons();
        
        // Then show only the needed buttons
        choices.forEach((choice, index) => {
            if (index < buttons.length) {
                const button = buttons[index];
                button.textContent = choice.text;
                
                // Create a bound function that will be preserved as the button's onclick
                const boundFunction = () => this.makeChoice(choice);
                button.onclick = boundFunction;
                
                button.style.display = 'block';
                console.log(`Set up button ${index + 1}: ${choice.text} with action: ${choice.action}`);
            }
        });
    }

    /**
     * Handle player actions based on action type
     * @param {string} action - The action to handle
     * @param {Object} params - Parameters for the action
     */
    async handleAction(action, params) {
        params = params || {};

        switch(action) {
            // Shop/Inventory actions
            case 'buyHealth':
                if (this.gameLogic.buyHealthPotion()) {
                    await this.textManager.typeText("You bought a health potion!");
                } else {
                    await this.textManager.typeText("You don't have enough gold!");
                }
                break;
                
            case 'useHealth':
                // Show immediate feedback
                let potionResult = false;
                if (this.gameLogic.useHealthPotion()) {
                    await this.textManager.typeText("You quickly drink a health potion, restoring 10 health!");
                    potionResult = true;
                } else {
                    await this.textManager.typeText("You don't have any health potions!");
                }
                
                // If in battle, show battle choices after potion use
                if (this.battleManager && this.battleManager.inBattle) {
                    // If potion was used successfully, trigger monster's turn
                    if (potionResult) {
                        // Make a dummy attack that just triggers monster's next action
                        const dummyResult = await this.battleManager.continueAfterPotion();
                        
                        if (dummyResult) {
                            await this.textManager.typeText(dummyResult.text);
                            
                            if (dummyResult.nextDialogue) {
                                // Battle is over
                                this.pendingBattleResult = null;
                                await this.startDialogue(dummyResult.nextDialogue);
                            } else if (dummyResult.choices) {
                                // Battle continues
                                this.setupChoices(dummyResult.choices);
                            }
                        } else {
                            this.setupChoices(this.battleManager.getBattleChoices());
                        }
                    } else {
                        // Potion failed, just show battle choices again
                        this.setupChoices(this.battleManager.getBattleChoices());
                    }
                }
                break;

                
            case 'buyWeapon':
                if (!params.weapon) {
                    console.error('No weapon specified for buyWeapon action');
                    return;
                }
                const weaponName = params.weapon;
                if (this.gameLogic.buyWeapon(weaponName)) {
                    await this.textManager.typeText(`You bought the ${weaponName}!`);
                    
                    // Offer to equip the weapon
                    this.setupChoices([
                        { text: `Equip ${weaponName}`, action: 'equipWeapon', params: { weapon: weaponName } },
                        { text: "Keep current weapon", nextDialogue: 'WeaponDisplay' }
                    ]);
                } else {
                    if (this.gameLogic.inventory.weapons.includes(weaponName)) {
                        await this.textManager.typeText("You already own this weapon!");
                    } else {
                        await this.textManager.typeText("You don't have enough gold!");
                    }
                }
                break;
    
            case 'equipWeapon':
                const weaponToEquip = params.weapon;
                if (this.gameLogic.equipWeapon(weaponToEquip)) {
                    await this.textManager.typeText(`You equipped the ${weaponToEquip}!`);
                    
                    // If nextDialogue is specified, go there next
                    if (params.nextDialogue) {
                        await this.startDialogue(params.nextDialogue);
                    }
                } else {
                    await this.textManager.typeText("You don't own this weapon!");
                }
                break;
                
            // Battle-related actions
    case 'fight':
        // Determine which monster to fight based on the current dialogue
        let monsterName = null;
        
        if (this.currentDialogue.monster && this.currentDialogue.monster.length > 0) {
            // Get first monster from dialogue's monster array
            monsterName = this.currentMonster = this.currentDialogue.monster[0];
            console.log("Monster found in dialogue.monster:", monsterName);
        } else if (this.currentDialogue.characters) {
            // Try to find monster in characters array
            for (const character of this.currentDialogue.characters) {
                if (this.battleManager.monsters[character]) {
                    monsterName = this.currentMonster = character;
                    console.log("Monster found in characters:", monsterName);
                    break;
                }
            }
        }
        
        if (!monsterName) {
            console.error("No monster found for battle!");
            await this.textManager.typeText("Error: No monster found for battle!");
            return;
        }
        
        // Check if we're already in battle to prevent double-triggering
        if (this.battleManager.inBattle) {
            console.log("Already in battle, not restarting");
            return;
        }
        
        try {
            console.log(`Starting battle with ${monsterName}`);
            
            // Start battle - this shows prep modal and waits for completion
            await this.battleManager.startBattle(monsterName);
            
            // After prep is complete, start the battle phase (if provided)
            const battleResult = await this.battleManager.onBattleReady();
            
            console.log("Battle result after prep:", battleResult);
            
            // Display the battle start text and choices
            if (battleResult) {
                await this.textManager.typeText(battleResult.text);
                this.setupChoices(battleResult.choices);
            } else {
                // If no result, fall back to showing battle choices (or just do nothing)
                console.error("No battle result returned");
                await this.textManager.typeText("Battle failed to start properly.");
            }
            
        } catch (error) {
            console.error("Battle failed to start:", error);
            await this.textManager.typeText("Something went wrong starting the battle.");
        }
        break;
            case 'equipForBattle':
                if (params.weapon) {
                    if (this.gameLogic.equipWeapon(params.weapon)) {
                        await this.textManager.typeText(`You grip your ${params.weapon} tightly.`);
                        
                        // Next step: Show stance selection
                        const stanceChoices = this.battleManager.getStanceSelectionChoices();
                        this.setupChoices(stanceChoices);
                    } else {
                        await this.textManager.typeText("You don't own this weapon!");
                    }
                }
                break;
                
            case 'selectStance':
                if (params.stance) {
                    const stance = this.battleManager.setStance(params.stance);
                    await this.textManager.typeText(`You adopt a ${stance.name} stance, ready for battle.`);
                    
                    // Begin the battle
                    this.battleManager.onBattleReady();
                }
                break;
                
            case 'battleAttack':
            case 'battleDefend':
            case 'battleDodge':
            case 'battleCounter':
                try {
                    console.log(`Handling battle action: ${action} with params:`, params);
                    
                    // Use the new unified handlePlayerAction method
                    const battleResult = await this.battleManager.handlePlayerAction(action, params?.actionName);
                    
                    if (!battleResult) {
                        console.error("Battle action didn't return any result");
                        await this.textManager.typeText("Something went wrong with your action.");
                        this.setupChoices(this.battleManager.getBattleChoices());
                        return;
                    }
                    
                    // Display the result text
                    await this.textManager.typeText(battleResult.text);
                    
                    // Handle battle result
                    if (battleResult.nextDialogue) {
                        // Battle is over, move to next dialogue
                        this.pendingBattleResult = null;
                        await this.startDialogue(battleResult.nextDialogue);
                    } else if (battleResult.choices) {
                        // Battle continues, show next choices
                        this.setupChoices(battleResult.choices);
                    } else {
                        // Fallback in case no choices were returned
                        this.setupChoices(this.battleManager.getBattleChoices());
                    }
                } catch (error) {
                    console.error(`Battle action ${action} failed:`, error);
                    await this.textManager.typeText("Your action fails in an unexpected way.");
                    this.setupChoices(this.battleManager.getBattleChoices());
                }
                break;
                try {
                    // Show immediate feedback
                    await this.textManager.typeText("You prepare to counter the enemy's attack...");
                    
                    // Perform the counter action
                    const counterResult = await this.battleManager.performCounter();
                    
                    if (!counterResult) {
                        console.error("Counter didn't return any result");
                        await this.textManager.typeText("Your counter attack fails to connect.");
                        this.setupChoices(this.battleManager.getBattleChoices());
                        return;
                    }
                    
                    // Display the result text
                    await this.textManager.typeText(counterResult.text);
                    
                    // Handle battle result
                    if (counterResult.nextDialogue) {
                        // Battle is over
                        this.pendingBattleResult = null;
                        await this.startDialogue(counterResult.nextDialogue);
                    } else if (counterResult.choices) {
                        // Battle continues
                        this.setupChoices(counterResult.choices);
                    } else {
                        // Fallback
                        this.setupChoices(this.battleManager.getBattleChoices());
                    }
                } catch (error) {
                    console.error("Counter action failed:", error);
                    await this.textManager.typeText("Your counter fails in an unexpected way.");
                    this.setupChoices(this.battleManager.getBattleChoices());
                }
                break;
                
            // Handle other actions
            case 'modifyGold':
                const goldAmount = params.amount || 0;
                this.gameLogic.modifyGold(goldAmount);
                if (goldAmount > 0) {
                    await this.textManager.typeText(`You gained ${goldAmount} gold.`);
                } else if (goldAmount < 0) {
                    await this.textManager.typeText(`You lost ${Math.abs(goldAmount)} gold.`);
                }
                break;
                
            default:
                console.warn(`Unknown action: ${action}`);
                break;
        }
    }

    /**
     * Start a new dialogue sequence
     * @param {string} dialogueName - The name of the dialogue to start
     */
    async startDialogue(dialogueName) {
        this.currentDialogue = DIALOGUES[dialogueName];
        
        if (!this.currentDialogue) {
            console.error(`Dialogue "${dialogueName}" not found!`);
            return;
        }
        
        // Update character display
        this.characterManager.onDialogueChange(this.currentDialogue);
        
        this.currentTextIndex = 0;
        await this.displayCurrentText();
    }

    /**
     * Display the current text in the dialogue sequence
     */
    async displayCurrentText() {
        if (!this.currentDialogue) return;
        
        const currentText = this.currentDialogue.texts[this.currentTextIndex];
        if (!currentText) return;

        const hasNextText = 
            this.currentTextIndex < this.currentDialogue.texts.length - 1 && 
            !currentText.choices;

        await this.textManager.typeText(currentText.content, hasNextText);
        
        // Handle special triggers
        if (currentText.trigger) {
            await this.handleTrigger(currentText.trigger, currentText.triggerParams);
        }
        
        // If after handling triggers we have a pending battle result,
        // do not show the normal choices
        if (this.pendingBattleResult) {
            return;
        }
        
        if (currentText.choices) {
            this.setupChoices(currentText.choices);
        }
    }
    
    /**
     * Handle special triggers in dialogue
     * @param {string} trigger - The trigger type
     * @param {Object} params - Parameters for the trigger
     */
    async handleTrigger(trigger, params) {
        switch(trigger) {
                
            case 'displayWeapons':
                // This could show a special weapon display if needed
                break;
                
            case 'findTreasure':
                // Handle finding treasure
                const goldAmount = Math.floor(Math.random() * 50) + 10;
                this.gameLogic.modifyGold(goldAmount);
                await this.textManager.typeText(`You found ${goldAmount} gold!`);
                break;
                
            case 'defeatBoss':
                // Handle boss defeat effects
                // Could play special animation, grant achievements, etc.
                break;
                
            case 'completeSequence':
                // Handle sequence completion
                // Could update game state, unlock new areas, etc.
                break;
                
            default:
                console.warn(`Unknown trigger: ${trigger}`);
                break;
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
                button.blur();
            });
            
            // Handle action first, if present
            if (choice.action) {
                console.log(`Handling action: ${choice.action}`);
                const params = choice.params || {};
                await this.handleAction(choice.action, params);
                
                // If we're in a battle, don't transition to nextDialogue automatically
                if (this.battleManager.inBattle && !this.pendingBattleResult) {
                    console.log("In battle, not proceeding to next dialogue");
                    this.actionInProgress = false;
                    return;
                }
            }
            
            // Only proceed to next dialogue if specified AND we're not in active battle
            if (choice.nextDialogue && (!this.battleManager.inBattle || this.pendingBattleResult)) {
                console.log(`Moving to next dialogue: ${choice.nextDialogue}`);
                await this.startDialogue(choice.nextDialogue);
            }
        } catch (error) {
            console.error("Error in makeChoice:", error);
        } finally {
            this.actionInProgress = false;
        }
    }

    /**
     * Advance to the next text in the dialogue sequence
     */
    async nextText() {
        this.currentTextIndex++;
        await this.displayCurrentText();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dialogueManager = new DialogueManager();
    document.getElementById('startButton').addEventListener('click', () => {
        dialogueManager.startDialogue('Intro');
    });
});

export default DialogueManager;