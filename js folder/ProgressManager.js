import TextManager from './TextDesignManager.js';
import { DIALOGUES } from './DialogueManager.js';
import gameLogic from './GameLogic.js';
import BattleManager from './BattleLogic.js';
import CharacterManager from './CharacterManager.js';
import GameAudio from './GameAudio.js';


class DialogueManager {
    constructor() {
        this.audioManager = new GameAudio();
        this.characterManager = new CharacterManager(this.audioManager);
        this.currentDialogue = null;
        this.currentTextIndex = 0;
        this.textManager = new TextManager();
        this.gameLogic = gameLogic;
        this.battleManager = new BattleManager(gameLogic, this);        


        this.button1 = document.getElementById('button1');
        this.button2 = document.getElementById('button2');
        this.button3 = document.getElementById('button3');

        document.addEventListener('nextText', () => {
            if (this.currentDialogue && !this.currentDialogue.texts[this.currentTextIndex].choices) {
                this.nextText();
            }
        });
    }

    setupChoices(choices) {
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
                button.onclick = () => this.makeChoice(choice);
                button.style.display = 'block';
            }
        });
    }

    async handleAction(action, params) {
        params = params || {};

        switch(action) {
            case 'buyHealth':
                if (this.gameLogic.buyHealthPotion()) {
                    await this.textManager.typeText("You bought a health potion!");
                } else {
                    await this.textManager.typeText("You don't have enough gold!");
                }
                break;
                case 'useHealth':
                    if (this.gameLogic.useHealthPotion()) {
                        await this.textManager.typeText("You used a health potion and restored 10 health!");
                    } else {
                        await this.textManager.typeText("You don't have any health potions!");
                    }
                    // Always show battle choices after potion attempt, whether successful or not
                    this.setupChoices(this.battleManager.getBattleChoices());
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
                    } else {
                        await this.textManager.typeText("You don't own this weapon!");
                    }
                    
            // Battle-related actions
            case 'fight':
                // Determine which monster to fight based on the current dialogue
                let monsterName = 'Shard Warden'; // default
                if (this.currentDialogue.name === 'MonsterEncounter') {
                    monsterName = 'Shadow Beast';
                }
                const choices = await this.battleManager.startBattle(monsterName);
                await this.textManager.typeText(`The ${monsterName} stands before you. Choose your weapon:`);
                this.setupChoices(choices);
                break;
    
            case 'equipForBattle':
                if (params.weapon) {
                    if (this.gameLogic.equipWeapon(params.weapon)) {
                        await this.textManager.typeText(`You grip your ${params.weapon} tightly.`);
                        
                        // Custom text for Shadow Beast encounter
                        if (this.currentMonster?.name === 'Shadow Beast') {
                            await this.textManager.typeText("The shadows seem to recoil slightly from your weapon's edge.");
                        }
                        
                        this.setupChoices(this.battleManager.getBattleChoices());
                    } else {
                        await this.textManager.typeText("You don't own this weapon!");
                    }
                }
                break;
    
            case 'battleAttack':
                const attackResult = await this.battleManager.performAttack();
                await this.textManager.typeText(attackResult.text);
                if (attackResult.nextDialogue) {
                    await this.startDialogue(attackResult.nextDialogue);
                } else if (attackResult.choices) {
                    this.setupChoices(attackResult.choices);
                }
                break;
    
            case 'battleDodge':
                const dodgeResult = await this.battleManager.performDodge();
                await this.textManager.typeText(dodgeResult.text);
                if (dodgeResult.choices) {
                    this.setupChoices(dodgeResult.choices);
                }
                break;
        }
    }

    async startDialogue(dialogueName) {
        this.currentDialogue = DIALOGUES[dialogueName];
        this.characterManager.onDialogueChange(this.currentDialogue);
        
        if (!this.currentDialogue) return;
        
        this.currentTextIndex = 0;
        await this.displayCurrentText();
    }

    async displayCurrentText() {
        if (!this.currentDialogue) return;
        
        const currentText = this.currentDialogue.texts[this.currentTextIndex];
        if (!currentText) return;

        const hasNextText = 
            this.currentTextIndex < this.currentDialogue.texts.length - 1 && 
            !currentText.choices;

        await this.textManager.typeText(currentText.content, hasNextText);
        
        if (currentText.choices) {
            this.setupChoices(currentText.choices);
        }

        if (currentText.trigger === 'fight') {
            await this.handleAction('fight');
        }
    }

    setupChoices(choices) {
        const buttons = [this.button1, this.button2, this.button3];
        choices.forEach((choice, index) => {
            if (index < buttons.length) {
                const button = buttons[index];
                button.textContent = choice.text;
                button.onclick = () => this.makeChoice(choice);
                button.style.display = 'block';
            }
        });

        for (let i = choices.length; i < buttons.length; i++) {
            buttons[i].style.display = 'none';
        }
    }

    async makeChoice(choice) {
        [this.button1, this.button2, this.button3].forEach(button => {
            button.blur();
        });
        
        if (choice.action) {
            const params = choice.params || {};
            await this.handleAction(choice.action, params);
        }
        
        if (choice.nextDialogue) {
            await this.startDialogue(choice.nextDialogue);
        }
    }

    async nextText() {
        this.currentTextIndex++;
        await this.displayCurrentText();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dialogueManager = new DialogueManager();
    document.getElementById('startButton').addEventListener('click', () => {
        dialogueManager.startDialogue('Intro'); // Change from 'Fight' to 'MonsterEncounter'
    });
});

export default DialogueManager;