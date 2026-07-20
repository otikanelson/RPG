/**
 * src/systems/DialogueEngine.js
 * Narrative processor that handles script flows, branch choices, and stateful conditions.
 * Tailored directly to run your existing DIALOGUES dataset structures.
 */
import gameLogic from '../core/GameLogic.js';
import gameController, { GAME_STATES } from '../core/GameController.js';
import { DIALOGUES } from '../managers/DialogueManager.js'; // Points to your story object location

class DialogueEngine {
    constructor() {
        this.currentDialogueKey = null;
        this.currentDialogueNode = null;
        this.textIndex = 0;
        
        // Target buttons matched to your framework layout
        this.buttons = [
            document.getElementById('button1'),
            document.getElementById('button2'),
            document.getElementById('button3')
        ];
    }

    /**
     * Boots a dialogue chain context and shifts game mode into CUTSCENE.
     * @param {string} dialogueKey - The key pointing inside your DIALOGUES master data object
     */
    startConversation(dialogueKey) {
        console.log('DialogueEngine: Starting conversation:', dialogueKey);
        
        if (!DIALOGUES[dialogueKey]) {
            console.error(`Dialogue Engine Error: Key "${dialogueKey}" does not exist.`);
            return;
        }

        this.currentDialogueKey = dialogueKey;
        this.currentDialogueNode = DIALOGUES[dialogueKey];
        this.textIndex = 0;

        console.log('DialogueEngine: Dialogue node loaded:', this.currentDialogueNode);

        // Notify CharacterManager to update display
        if (window.characterManager) {
            window.characterManager.onDialogueChange(this.currentDialogueNode);
        }

        gameController.transitionTo(GAME_STATES.CUTSCENE);
        this.renderCurrentText();
    }

    /**
     * Alias for startConversation to maintain compatibility with MapManager
     */
    startDialogue(dialogueKey) {
        this.startConversation(dialogueKey);
    }

    /**
     * Renders the current step inside the active text content array block.
     */
    async renderCurrentText() {
        const textDataArray = this.currentDialogueNode.texts;
        const activeTextStep = textDataArray[this.textIndex];

        console.log('DialogueEngine: Rendering text index', this.textIndex, 'of', textDataArray.length);
        console.log('DialogueEngine: Active text step:', activeTextStep);

        if (!activeTextStep) {
            this.endConversation();
            return;
        }

        // Hide buttons by default before routing calculations
        this.hideAllButtons();

        // 1. Output the dialogue line text with typing effect
        const hasMoreText = this.textIndex < textDataArray.length - 1 && !activeTextStep.choices;
        
        if (window.textManager) {
            await window.textManager.typeText(activeTextStep.content, hasMoreText);
        } else {
            // Fallback to direct text display if TextManager not available
            const textWrapper = document.getElementById('text');
            if (textWrapper) {
                textWrapper.textContent = activeTextStep.content;
            } else {
                console.log(`Narration Line: ${activeTextStep.content}`);
            }
        }

        // 2. Check if this specific line introduces choices
        if (activeTextStep.choices && activeTextStep.choices.length > 0) {
            console.log('DialogueEngine: Showing', activeTextStep.choices.length, 'choices');
            activeTextStep.choices.forEach((choice, idx) => {
                if (idx < this.buttons.length && this.buttons[idx]) {
                    const btn = this.buttons[idx];
                    btn.textContent = choice.text;
                    btn.style.display = 'block';
                    
                    // Bind interactions cleanly
                    btn.onclick = () => {
                        console.log('DialogueEngine: Choice selected:', choice.text);
                        this.handleChoiceSelection(choice);
                    };
                }
            });
        } else {
            // No choices means clicking/progressing advances text array steps forward
            const proceedBtn = this.buttons[0];
            if (proceedBtn) {
                proceedBtn.textContent = this.textIndex < textDataArray.length - 1 ? "Continue..." : "Close";
                proceedBtn.style.display = 'block';
                
                const handleContinue = () => {
                    if (this.textIndex < textDataArray.length - 1) {
                        this.textIndex++;
                        this.renderCurrentText();
                    } else {
                        this.endConversation();
                    }
                };
                
                proceedBtn.onclick = handleContinue;
                
                // Store the continue handler so spacebar can trigger it
                this.currentContinueHandler = handleContinue;
            }
        }
    }

    /**
     * Processes execution rewards/penalties attached to user action pathways.
     */
    async handleChoiceSelection(choice) {
        // Run game logic modifications if a choice block carries a trigger execution action
        if (choice.action) {
            await this.executeActionTrigger(choice.action, choice.params);
        }

        // Halts narrative progression pipeline completely if battle engine overrides
        if (choice.action === 'fight') {
            return;
        }

        // Advance layout to destination target dialogue path sequence
        if (choice.nextDialogue) {
            this.startConversation(choice.nextDialogue);
        } else {
            this.endConversation();
        }
    }

    /**
     * Decoupled action intercept router running operations via gameLogic configurations
     */
    async executeActionTrigger(actionType, params = {}) {
        console.log(`Executing engine event trigger action: ${actionType}`, params);
        
        switch (actionType) {
            case 'modifyGold':
                // Handles your standard currency increments/decrements cleanly
                const goldAmount = params.amount || -20; 
                gameLogic.modifyGold(goldAmount);
                break;

            case 'buyWeapon':
                const weaponToken = params.weapon ? params.weapon.toLowerCase().replace(' ', '_') : 'short_sword';
                gameLogic.buyWeapon(weaponToken);
                break;

            case 'fight':
                // Pass operational shift rules off to your core controller
                // Claude and you will seamlessly wire your BattleManager straight to this hook target!
                gameController.transitionTo(GAME_STATES.BATTLE, {
                    monsterData: this.currentDialogueNode.monster || this.currentDialogueNode.characters
                });
                break;

            case 'openShop':
                const merchantId = params?.merchant || 'MerchantRagnor';
                if (window.shopModalInstance) {
                    window.shopModalInstance.open(merchantId);
                }
                break;

            default:
                console.warn(`Action token sequence target "${actionType}" unmapped.`);
                break;
        }
    }

    hideAllButtons() {
        this.buttons.forEach(btn => {
            if (btn) btn.style.display = 'none';
        });
    }

    /**
     * Returns focus back cleanly to standard EXPLORATION loop
     */
    endConversation() {
        console.log("Narrative scene tracking cycle resolved safely.");
        this.currentDialogueKey = null;
        this.currentDialogueNode = null;
        this.currentContinueHandler = null;
        this.hideAllButtons();
        gameController.transitionTo(GAME_STATES.EXPLORATION);
    }
}

// At the bottom of your dialogue engine file
const dialogueManager = new DialogueEngine(); // Or new DialogueManager()
window.dialogueManager = dialogueManager;    // <-- CRITICAL: Expose it to the window scope
export default dialogueManager;