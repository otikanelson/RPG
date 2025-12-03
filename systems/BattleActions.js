/**
 * BattleActions.js (Fixed Dialogue Retrieval)
 * Contains all battle action handling using the state machine with PROPER dialogue contexts
 */

import { BATTLE_STATE, TURN_ACTOR } from './BattleLogic.js';

class BattleActions {
    constructor(battleManager) {
        this.battleManager = battleManager;
    }

    /**
     * Handle any player action during battle
     * @param {string} actionType - Type of action (battleAttack, battleDefend, etc.)
     * @param {string} actionName - Specific action name (Heavy Slash, Block, etc.)
     * @returns {Promise<Object>} - Contains text and choices for next step
     */
    async handlePlayerAction(actionType, actionName) {
        const bm = this.battleManager;
        
        console.log("=== PLAYER ACTION ===");
        console.log("Action Type:", actionType);
        console.log("Action Name:", actionName);
        console.log("Current State:", bm.battleState);
        console.log("Current Actor:", bm.currentActor);
        
        // Map action type to actual action category
        const actionObject = {
            type: this.getActionCategory(actionType),
            actionName: actionName,
            actor: TURN_ACTOR.PLAYER
        };
        
        console.log("Action Object:", actionObject);
        
        // Handle based on current battle state
        if (bm.battleState === BATTLE_STATE.ACTOR_PHASE && bm.currentActor === TURN_ACTOR.PLAYER) {
            // Player is declaring their action (going first)
            console.log("Player DECLARES action (going first)");
            bm.declaredAction = actionObject;
            
            // Monster now responds
            console.log("Monster will respond...");
            const monsterAction = bm.determineMonsterAction();
            monsterAction.actor = TURN_ACTOR.MONSTER;
            bm.respondingAction = monsterAction;
            
            console.log("Monster responds with:", monsterAction);
            
            // Resolve both actions
            return await this.resolveActions();
            
        } else if (bm.battleState === BATTLE_STATE.RESPONDER_PHASE) {
            // Player is responding to monster's declared action
            console.log("Player RESPONDS to monster's action");
            console.log("Monster had declared:", bm.declaredAction);
            bm.respondingAction = actionObject;
            
            // Resolve both actions
            return await this.resolveActions();
            
        } else {
            console.error("Invalid battle state for player action:", bm.battleState);
            console.error("Current actor:", bm.currentActor);
            return {
                text: "Something went wrong with the battle flow. Please try again.",
                choices: bm.getBattleChoices()
            };
        }
    }
    
    /**
     * Get action category from action type
     * @param {string} actionType - The action type string
     * @returns {string} - The category (attack, defend, dodge, counter)
     */
    getActionCategory(actionType) {
        const categoryMap = {
            'battleAttack': 'attack',
            'battleDefend': 'defend',
            'battleDodge': 'dodge',
            'battleCounter': 'counter'
        };
        
        return categoryMap[actionType] || 'attack';
    }

    /**
     * Resolve both declared and responding actions
     * @returns {Promise<Object>} - Contains text and choices
     */
    async resolveActions() {
        const bm = this.battleManager;
        
        console.log("=== RESOLVING ACTIONS ===");
        console.log("Declared Action:", bm.declaredAction);
        console.log("Responding Action:", bm.respondingAction);
        
        // STATE: RESOLUTION
        bm.battleState = BATTLE_STATE.RESOLUTION;
        
        let battleText = '';
        
        // Get weapon type from gameLogic
        const weaponType = bm.gameLogic.getWeaponType();
        console.log("Weapon type for dialogue:", weaponType);
        
        // Play dice animation for resolution
        bm.playDiceAnimation();
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const firstAction = bm.declaredAction;
        const secondAction = bm.respondingAction;
        
        // Validate both actions exist
        if (!firstAction || !secondAction) {
            console.error("Missing action in resolution!", { firstAction, secondAction });
            return {
                text: "Something went wrong with the battle flow.",
                choices: bm.getBattleChoices()
            };
        }
        
        // Determine scenario based on who declared what
        if (firstAction.actor === TURN_ACTOR.MONSTER && firstAction.type === 'attack') {
            // SCENARIO 1: Monster attacked, Player responds
            console.log("SCENARIO: Monster attacked, Player responds");
            battleText += await this.resolveMonsterAttackScenario(firstAction, secondAction, weaponType);
            
        } else if (firstAction.actor === TURN_ACTOR.MONSTER && firstAction.type === 'defend') {
            // SCENARIO 2: Monster defended, Player responds
            console.log("SCENARIO: Monster defended, Player responds");
            battleText += await this.resolveMonsterDefendScenario(firstAction, secondAction, weaponType);
            
        } else if (firstAction.actor === TURN_ACTOR.MONSTER && firstAction.type === 'magic') {
            // SCENARIO 3: Monster used magic, Player responds
            console.log("SCENARIO: Monster used magic, Player responds");
            battleText += await this.resolveMagicScenario(firstAction, secondAction, weaponType);
            
        } else if (firstAction.actor === TURN_ACTOR.PLAYER && firstAction.type === 'attack') {
            // SCENARIO 4: Player attacked, Monster responds
            console.log("SCENARIO: Player attacked, Monster responds");
            battleText += await this.resolvePlayerAttackScenario(firstAction, secondAction, weaponType);
            
        } else if (firstAction.actor === TURN_ACTOR.PLAYER && firstAction.type === 'defend') {
            // SCENARIO 5: Player defended, Monster responds
            console.log("SCENARIO: Player defended, Monster responds");
            battleText += await this.resolvePlayerDefendScenario(firstAction, secondAction, weaponType);
        }
        
        // Check victory/defeat
        if (bm.currentMonster.health <= 0) {
            console.log("Monster defeated!");
            return await bm.handleMonsterDefeat();
        }
        if (bm.gameLogic.stats.health <= 0) {
            console.log("Player defeated!");
            return await bm.handlePlayerDefeat();
        }
        
        // TURN ALTERNATION: Switch current actor for next turn
        const previousActor = bm.currentActor;
        bm.currentActor = bm.currentActor === TURN_ACTOR.PLAYER ? TURN_ACTOR.MONSTER : TURN_ACTOR.PLAYER;
        console.log(`Turn switching: ${previousActor} -> ${bm.currentActor}`);
        
        // Clear actions from this turn
        bm.declaredAction = null;
        bm.respondingAction = null;
        
        // Set up next turn
        if (bm.currentActor === TURN_ACTOR.MONSTER) {
            // Monster's turn to act first
            console.log("Next turn: Monster acts first");
            
            const monsterAction = bm.determineMonsterAction();
            monsterAction.actor = TURN_ACTOR.MONSTER;
            bm.declaredAction = monsterAction;
            
            console.log("Monster declares:", monsterAction);
            
            bm.battleState = BATTLE_STATE.RESPONDER_PHASE;
            
            const monsterActionText = bm.getMonsterActionText(monsterAction, weaponType);
            
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
            
            battleText += `\n\n${monsterActionText}\n\n${responsePrompt}`;
            
            return {
                text: battleText,
                choices: bm.getBattleChoices()
            };
            
        } else {
            // Player's turn to act first
            console.log("Next turn: Player acts first");
            
            bm.battleState = BATTLE_STATE.ACTOR_PHASE;
            battleText += `\n\nYour turn! What will you do?`;
            
            return {
                text: battleText,
                choices: bm.getBattleChoices()
            };
        }
    }
    
    /**
     * Get player defense dialogue when responding to monster attack
     * @param {string} weaponType - Weapon type (sword, axe, dagger)
     * @param {string} defenseAction - Defense action name
     * @param {string} attackType - Monster's attack type
     * @returns {string} - Dialogue text or null
     */
    getPlayerDefendDialogue(weaponType, defenseAction, attackType) {
        const bm = this.battleManager;
        const monsterKey = bm.currentMonster.name.replace(/\s+/g, '').toLowerCase();
        const dialogues = bm.monsterDialogues[monsterKey];
        
        if (!dialogues || !dialogues.playerDefends) {
            return null;
        }
        
        // Convert defense action to dialogue key (e.g., "Block" -> "vsSlam")
        const dialogueKey = `vs${bm.capitalizeFirstLetter(attackType)}`;
        
        return dialogues.playerDefends?.[weaponType]?.[dialogueKey] || null;
    }
    
    /**
     * Get player attack dialogue when responding to monster defense
     * @param {string} weaponType - Weapon type (sword, axe, dagger)
     * @param {string} attackAction - Attack action name
     * @param {string} defendType - Monster's defense type
     * @returns {string} - Dialogue text or null
     */
    getPlayerAttackDialogue(weaponType, attackAction, defendType) {
        const bm = this.battleManager;
        const monsterKey = bm.currentMonster.name.replace(/\s+/g, '').toLowerCase();
        const dialogues = bm.monsterDialogues[monsterKey];
        
        if (!dialogues || !dialogues.playerAttacks) {
            return null;
        }
        
        // Convert defense type to dialogue key (e.g., "split" -> "vsSplit")
        const dialogueKey = `vs${bm.capitalizeFirstLetter(defendType)}`;
        
        return dialogues.playerAttacks?.[weaponType]?.[dialogueKey] || null;
    }
    
    /**
     * SCENARIO 1: Monster attacked first, player responded
     */
    async resolveMonsterAttackScenario(monsterAttack, playerResponse, weaponType) {
        const bm = this.battleManager;
        let text = '';
        
        // Play attack sound
        bm.battleSounds.attack.play().catch(e => console.warn('Attack sound failed:', e));
        
        if (playerResponse.type === 'defend') {
            // Player chose to defend against the attack
            const isCorrectDefense = bm.calculations.isCorrectDefenseForAttack(
                playerResponse.actionName, 
                monsterAttack.attackType
            );
            
            // Try to get player defense dialogue
            const defenseDialogue = this.getPlayerDefendDialogue(weaponType, playerResponse.actionName, monsterAttack.attackType);
            
            if (isCorrectDefense) {
                // Perfect counter - use dialogue if available
                if (defenseDialogue) {
                    text += `${defenseDialogue}\n`;
                } else {
                    text += `Your ${playerResponse.actionName} perfectly counters the ${monsterAttack.attackType}!\n`;
                }
                // No damage taken
            } else {
                // Wrong defense type - roll for success
                const defenseSuccess = bm.calculations.calculateDefenseSuccess(playerResponse.actionName);
                if (defenseSuccess) {
                    text += `You successfully block the attack!\n`;
                } else {
                    const damage = Math.floor(bm.calculations.getMonsterAttackValue() * 0.5);
                    bm.gameLogic.takeDamage(damage);
                    text += `Your defense partially fails! You take ${damage} damage.\n`;
                }
            }
            
        } else if (playerResponse.type === 'dodge') {
            // Player chose to dodge the attack
            const dodgeSuccess = bm.calculations.calculateDodgeSuccess();
            if (dodgeSuccess) {
                text += `You dodge the attack successfully!\n`;
            } else {
                const damage = bm.calculations.getMonsterAttackValue();
                bm.gameLogic.takeDamage(damage);
                text += `You fail to dodge and take ${damage} damage!\n`;
            }
            
        } else if (playerResponse.type === 'attack') {
            // Player chose to attack back - both hit each other
            const monsterDamage = bm.calculations.getMonsterAttackValue();
            bm.gameLogic.takeDamage(monsterDamage);
            text += `You take ${monsterDamage} damage from the monster's attack!\n`;
            
            const attackSuccess = bm.calculations.calculateAttackSuccess(playerResponse.actionName);
            if (attackSuccess) {
                const playerDamage = bm.calculations.calculateDamage(playerResponse.actionName);
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - playerDamage);
                text += `But your ${playerResponse.actionName} hits back for ${playerDamage} damage!\n`;
                bm.updateMonsterStats();
            } else {
                text += `Your counterattack misses!\n`;
            }
            
        } else if (playerResponse.type === 'counter') {
            // Player chose to counter
            const counterSuccess = bm.calculations.calculateCounterSuccess();
            if (counterSuccess) {
                const counterDamage = bm.calculations.calculateCounterDamage();
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - counterDamage);
                text += `You expertly counter the attack for ${counterDamage} damage!\n`;
                bm.updateMonsterStats();
            } else {
                const damage = bm.calculations.getMonsterAttackValue();
                bm.gameLogic.takeDamage(damage);
                text += `Your counter fails and you take ${damage} damage!\n`;
            }
        }
        
        return text;
    }
    
    /**
     * SCENARIO 2: Monster defended first, player responded
     */
    async resolveMonsterDefendScenario(monsterDefend, playerResponse, weaponType) {
        const bm = this.battleManager;
        let text = '';
        
        // Play defend sound
        bm.battleSounds.defend.play().catch(e => console.warn('Defend sound failed:', e));
        
        if (playerResponse.type === 'attack') {
            // Player attacks the defending monster
            const isCorrectAttack = bm.calculations.isCorrectAttackForDefense(
                playerResponse.actionName,
                monsterDefend.defendType
            );
            
            // Try to get player attack dialogue
            const attackDialogue = this.getPlayerAttackDialogue(weaponType, playerResponse.actionName, monsterDefend.defendType);
            
            if (isCorrectAttack) {
                // Perfect counter - breaks defense guaranteed
                const damage = bm.calculations.calculateDamage(playerResponse.actionName);
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - damage);
                
                // Use dialogue if available
                if (attackDialogue) {
                    text += `${attackDialogue} You deal ${damage} damage!\n`;
                } else {
                    text += `Your ${playerResponse.actionName} breaks through the defense for ${damage} damage!\n`;
                }
                bm.updateMonsterStats();
            } else {
                // Wrong attack type - roll for success
                const attackSuccess = bm.calculations.calculateAttackSuccess(playerResponse.actionName);
                if (attackSuccess) {
                    const damage = Math.floor(bm.calculations.calculateDamage(playerResponse.actionName) * 0.7);
                    bm.currentMonster.health = Math.max(0, bm.currentMonster.health - damage);
                    text += `Your attack partially breaks through for ${damage} damage!\n`;
                    bm.updateMonsterStats();
                } else {
                    text += `The monster's defense blocks your attack completely!\n`;
                }
            }
            
        } else if (playerResponse.type === 'defend' || playerResponse.type === 'dodge' || playerResponse.type === 'counter') {
            // Player wasted turn with non-attack action
            text += `You ${playerResponse.type}, but the monster was only defending. Nothing happens.\n`;
        }
        
        return text;
    }
    
    /**
     * SCENARIO 3: Monster used magic, player responds
     * Handles magic spells with interrupt mechanics and proper dialogues
     */
    async resolveMagicScenario(monsterMagic, playerResponse, weaponType) {
        const bm = this.battleManager;
        const monsterId = bm.currentMonster.name.toLowerCase().replace(/\s+/g, '');
        let text = '';
        
        // Import monster data to get magic dialogues
        const { getMonsterData } = await import('./BattleDialogue.js');
        const monsterData = getMonsterData(monsterId);
        
        console.log("Resolving magic scenario:", monsterMagic.magicType, "Player response:", playerResponse.type);
        
        // Get magic action data
        const magicActionData = monsterData?.magicActions?.[monsterMagic.magicType];
        
        // Show magic description
        if (magicActionData?.description) {
            text += `${magicActionData.description}\n\n`;
        } else {
            text += `The ${bm.currentMonster.name} casts ${monsterMagic.magicType}!\n\n`;
        }
        
        // Handle player response
        if (playerResponse.type === 'attack') {
            // Player tries to INTERRUPT the magic
            const interruptDialogue = magicActionData?.playerResponses?.attack;
            
            if (interruptDialogue?.attempt) {
                text += `${interruptDialogue.attempt}\n\n`;
            } else {
                text += `You strike at the ${bm.currentMonster.name}, attempting to disrupt the spell!\n\n`;
            }
            
            // Roll for interrupt success (50% chance)
            const interruptSuccess = Math.random() > 0.5;
            
            if (interruptSuccess) {
                // SUCCESSFUL INTERRUPT
                if (interruptDialogue?.success) {
                    text += `${interruptDialogue.success}\n`;
                } else {
                    text += `Your attack disrupts the spell!\n`;
                }
                
                // Apply reduced magic effect
                text += this.applyMagicEffectWithInterrupt(monsterMagic.magicType);
                
            } else {
                // FAILED INTERRUPT
                if (interruptDialogue?.failure) {
                    text += `${interruptDialogue.failure}\n`;
                } else {
                    text += `The spell completes despite your efforts!\n`;
                }
                
                // Apply full magic effect
                text += this.applyMagicEffect(monsterMagic.magicType);
            }
            
        } else if (playerResponse.type === 'defend') {
            // Player BRACES for the magic effect
            const defendDialogue = magicActionData?.playerResponses?.defend;
            
            if (defendDialogue?.attempt) {
                text += `${defendDialogue.attempt}\n\n`;
            } else {
                text += `You brace yourself against the magical assault!\n\n`;
            }
            
            if (defendDialogue?.result) {
                text += `${defendDialogue.result}\n`;
            } else {
                text += `The spell takes effect.\n`;
            }
            
            // Apply full magic effect (no reduction for defending)
            text += this.applyMagicEffect(monsterMagic.magicType);
            
        } else {
            // Other responses (dodge, counter) - treat as defend
            text += `You ${playerResponse.type}, but cannot fully avoid the magical effect.\n`;
            text += this.applyMagicEffect(monsterMagic.magicType);
        }
        
        return text;
    }
    
    /**
     * Apply magic effect with reduced potency (when interrupted)
     * @param {string} magicType - Type of magic
     * @returns {string} - Description of effect
     */
    applyMagicEffectWithInterrupt(magicType) {
        const bm = this.battleManager;
        let text = '';
        
        switch(magicType) {
            case 'selfHeal':
                // Reduced healing (50% of normal)
                const reducedHealAmount = Math.floor(bm.currentMonster.maxHealth * 0.1);
                bm.currentMonster.health = Math.min(
                    bm.currentMonster.maxHealth, 
                    bm.currentMonster.health + reducedHealAmount
                );
                text += `The interrupted healing only restores ${reducedHealAmount} HP.\n`;
                bm.updateMonsterStats();
                break;
                
            case 'selfBuff':
            case 'attackBuff':
                // Reduced buff (50% effectiveness)
                const reducedBuff = Math.floor(3 * 0.5);
                bm.currentMonster.baseAttack += reducedBuff;
                text += `The disrupted spell only increases attack power by ${reducedBuff}.\n`;
                break;
                
            case 'playerDebuff':
                // Reduced debuff damage (50% of normal)
                const reducedDebuffDamage = Math.floor(5 * 0.5);
                bm.gameLogic.takeDamage(reducedDebuffDamage);
                text += `The weakened curse only drains ${reducedDebuffDamage} health.\n`;
                break;
                
            default:
                text += `The spell effect is diminished!\n`;
        }
        
        return text;
    }
    
    /**
     * SCENARIO 4: Player attacked first, monster responded
     */
    async resolvePlayerAttackScenario(playerAttack, monsterResponse, weaponType) {
        const bm = this.battleManager;
        let text = '';
        
        // Play attack sound
        bm.battleSounds.attack.play().catch(e => console.warn('Attack sound failed:', e));
        
        const attackSuccess = bm.calculations.calculateAttackSuccess(playerAttack.actionName);
        
        if (monsterResponse.type === 'attack') {
            // Both attack each other
            if (attackSuccess) {
                const damage = bm.calculations.calculateDamage(playerAttack.actionName);
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - damage);
                text += `Your ${playerAttack.actionName} hits for ${damage} damage!\n`;
                bm.updateMonsterStats();
            } else {
                text += `Your ${playerAttack.actionName} misses!\n`;
            }
            
            const monsterDamage = bm.calculations.getMonsterAttackValue();
            bm.gameLogic.takeDamage(monsterDamage);
            text += `The monster attacks back for ${monsterDamage} damage!\n`;
            
        } else if (monsterResponse.type === 'defend') {
            // Monster defends against player attack - use monster defense dialogue
            const monsterKey = bm.currentMonster.name.replace(/\s+/g, '').toLowerCase();
            const dialogues = bm.monsterDialogues[monsterKey];
            
            // Get monster defense dialogue
            let defenseDialogue = null;
            if (dialogues && dialogues.defends) {
                defenseDialogue = dialogues.defends?.[weaponType]?.[monsterResponse.defendType];
            }
            
            // Show defense dialogue if available
            if (defenseDialogue) {
                text += `${defenseDialogue}\n`;
            }
            
            const isCorrectAttack = bm.calculations.isCorrectAttackForDefense(
                playerAttack.actionName,
                monsterResponse.defendType
            );
            
            if (isCorrectAttack) {
                const damage = bm.calculations.calculateDamage(playerAttack.actionName);
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - damage);
                text += `Your ${playerAttack.actionName} breaks the defense for ${damage} damage!\n`;
                bm.updateMonsterStats();
            } else if (attackSuccess) {
                const damage = Math.floor(bm.calculations.calculateDamage(playerAttack.actionName) * 0.7);
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - damage);
                text += `Your attack is partially blocked, dealing ${damage} damage!\n`;
                bm.updateMonsterStats();
            } else {
                text += `The monster's defense blocks your attack completely!\n`;
            }
            
        } else if (monsterResponse.type === 'dodge') {
            // Monster tries to dodge
            const monsterDodgeSuccess = bm.calculations.calculateMonsterDodgeSuccess();
            if (monsterDodgeSuccess) {
                text += `The monster dodges your ${playerAttack.actionName}!\n`;
            } else if (attackSuccess) {
                const damage = bm.calculations.calculateDamage(playerAttack.actionName);
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - damage);
                text += `The monster fails to dodge! Your ${playerAttack.actionName} hits for ${damage} damage!\n`;
                bm.updateMonsterStats();
            } else {
                text += `Your ${playerAttack.actionName} misses!\n`;
            }
            
        } else if (monsterResponse.type === 'magic') {
            // Monster uses magic while player attacks
            if (attackSuccess) {
                const damage = bm.calculations.calculateDamage(playerAttack.actionName);
                bm.currentMonster.health = Math.max(0, bm.currentMonster.health - damage);
                text += `Your ${playerAttack.actionName} hits for ${damage} damage!\n`;
                bm.updateMonsterStats();
            } else {
                text += `Your ${playerAttack.actionName} misses!\n`;
            }
            
            // Apply magic effect
            text += this.applyMagicEffect(monsterResponse.magicType);
        }
        
        return text;
    }
    
    /**
     * SCENARIO 5: Player defended first, monster responded
     */
    async resolvePlayerDefendScenario(playerDefend, monsterResponse, weaponType) {
        const bm = this.battleManager;
        let text = '';
        
        // Play defend sound
        bm.battleSounds.defend.play().catch(e => console.warn('Defend sound failed:', e));
        
        if (monsterResponse.type === 'attack') {
            // Monster attacks the defending player - use monster attack dialogue
            const monsterKey = bm.currentMonster.name.replace(/\s+/g, '').toLowerCase();
            const dialogues = bm.monsterDialogues[monsterKey];
            
            // Get monster attack dialogue
            let attackDialogue = null;
            if (dialogues && dialogues.attacks) {
                attackDialogue = dialogues.attacks?.[weaponType]?.[monsterResponse.attackType];
            }
            
            // Show attack dialogue if available
            if (attackDialogue) {
                text += `${attackDialogue}\n`;
            }
            
            const isCorrectDefense = bm.calculations.isCorrectDefenseForAttack(
                playerDefend.actionName,
                monsterResponse.attackType
            );
            
            if (isCorrectDefense) {
                // Perfect defense
                text += `Your ${playerDefend.actionName} perfectly blocks the ${monsterResponse.attackType}!\n`;
            } else {
                // Wrong defense - roll for success
                const defenseSuccess = bm.calculations.calculateDefenseSuccess(playerDefend.actionName);
                if (defenseSuccess) {
                    text += `You successfully defend against the attack!\n`;
                } else {
                    const damage = Math.floor(bm.calculations.getMonsterAttackValue() * 0.5);
                    bm.gameLogic.takeDamage(damage);
                    text += `Your defense partially fails! You take ${damage} damage.\n`;
                }
            }
            
        } else if (monsterResponse.type === 'defend' || monsterResponse.type === 'dodge') {
            // Both defending - nothing happens
            text += `Both you and the monster are on the defensive. Nothing happens.\n`;
            
        } else if (monsterResponse.type === 'magic') {
            // Monster uses magic
            text += `You raise your defense, but the monster casts a spell!\n`;
            text += this.applyMagicEffect(monsterResponse.magicType);
        }
        
        return text;
    }
    
    /**
     * Apply magic effect and return descriptive text
     * @param {string} magicType - Type of magic
     * @returns {string} - Description of effect
     */
    applyMagicEffect(magicType) {
        const bm = this.battleManager;
        let text = '';
        
        switch(magicType) {
            case 'selfHeal':
                const healAmount = Math.floor(bm.currentMonster.maxHealth * 0.2);
                bm.currentMonster.health = Math.min(
                    bm.currentMonster.maxHealth, 
                    bm.currentMonster.health + healAmount
                );
                text += `The monster heals for ${healAmount} HP!\n`;
                bm.updateMonsterStats();
                break;
                
            case 'attackBuff':
                bm.currentMonster.baseAttack += 3;
                text += `The monster's attack power increases!\n`;
                break;
                
            case 'playerDebuff':
                const debuffDamage = 5;
                bm.gameLogic.takeDamage(debuffDamage);
                text += `You feel weakened and lose ${debuffDamage} health!\n`;
                break;
                
            default:
                text += `The monster casts a spell!\n`;
        }
        
        return text;
    }

    /**
     * Handle potion use and continue battle
     */
    async continueAfterPotion() {
        const bm = this.battleManager;
        
        // Potion use doesn't change state - just return to current phase
        return {
            text: "You used a potion. What will you do?",
            choices: bm.getBattleChoices()
        };
    }
}

export default BattleActions;