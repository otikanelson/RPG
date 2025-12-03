/**
 * BattleCalculations.js (Cleaned & Refactored)
 * Contains all combat calculation logic (hit chances, damage, success rates)
 */

class BattleCalculations {
    constructor(battleManager) {
        this.battleManager = battleManager;
    }

    /**
     * Calculate if an attack is successful
     * @param {string} actionName - Name of the attack action
     * @returns {boolean} - True if attack hits
     */
    calculateAttackSuccess(actionName) {
        const { gameLogic, selectedStance, stances, weaponStanceEffectiveness, currentMonster } = this.battleManager;
        
        // Base hit chance
        let baseHitChance = 0.7; // 70% base
        
        // Modify based on stance
        if (selectedStance && stances[selectedStance]) {
            baseHitChance += stances[selectedStance].hitRateModifier;
        }
        
        // Modify based on weapon and stance combination
        const weapon = gameLogic.inventory.equippedWeapon;
        if (weapon && selectedStance && weaponStanceEffectiveness[weapon]) {
            baseHitChance *= weaponStanceEffectiveness[weapon][selectedStance];
        }
        
        // Action-specific modifiers
        if (actionName === 'Heavy Slash' || actionName === 'Deep Thrust') {
            baseHitChance -= 0.1; // Harder to hit with heavy attacks
        } else if (actionName === 'Quick Slice') {
            baseHitChance += 0.1; // Easier to hit with quick attacks
        }
        
        // Level difference factor
        const levelDiff = gameLogic.stats.level - currentMonster.level;
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
        const { gameLogic, selectedStance, stances, weaponStanceEffectiveness, currentMonster } = this.battleManager;
        
        // Base damage from weapon
        const weaponDamage = gameLogic.getWeaponDamage();
        let damage = weaponDamage;
        
        // Add random factor (1-10)
        damage += Math.floor(Math.random() * 10) + 1;
        
        // Modify based on action type
        if (actionName === 'Heavy Slash') {
            damage *= 1.5; // 50% more damage
        } else if (actionName === 'Deep Thrust') {
            damage *= 1.4; // 40% more damage
        } else if (actionName === 'Light Slash' || actionName === 'Quick Slice') {
            damage *= 0.8; // 20% less damage
        }
        
        // Modify based on stance
        if (selectedStance && stances[selectedStance]) {
            damage *= stances[selectedStance].damageMultiplier;
        }
        
        // Weapon stance effectiveness modifier
        const weapon = gameLogic.inventory.equippedWeapon;
        if (weapon && selectedStance && weaponStanceEffectiveness[weapon]) {
            damage *= weaponStanceEffectiveness[weapon][selectedStance];
        }
        
        // Level difference factor
        const levelDiff = gameLogic.stats.level - currentMonster.level;
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
        const { gameLogic, selectedStance, weaponStanceEffectiveness, currentMonster } = this.battleManager;
        
        // Base defense chance
        let baseDefenseChance = 0.7; // 70% base
        
        // Modify based on stance
        if (selectedStance) {
            if (selectedStance === 'defensive') {
                baseDefenseChance += 0.15; // Defensive stance is better at defending
            } else if (selectedStance === 'offensive') {
                baseDefenseChance -= 0.1; // Offensive stance is worse at defending
            }
        }
        
        // Different defense actions have different success rates
        if (actionName === 'Block') {
            baseDefenseChance += 0.1; // Better at blocking
        } else if (actionName === 'Parry') {
            baseDefenseChance += 0.05; // Slightly better at parrying
        }
        
        // Weapon stance effectiveness can influence defense
        const weapon = gameLogic.inventory.equippedWeapon;
        if (weapon && selectedStance && weaponStanceEffectiveness[weapon]) {
            const effectiveness = weaponStanceEffectiveness[weapon][selectedStance];
            if (effectiveness > 1.1) {
                baseDefenseChance += 0.1;
            } else if (effectiveness < 0.9) {
                baseDefenseChance -= 0.1;
            }
        }
        
        // Level difference factor
        const levelDiff = gameLogic.stats.level - currentMonster.level;
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
        const { gameLogic, selectedStance, currentMonster } = this.battleManager;
        
        // Base dodge chance (harder than blocking)
        let baseDodgeChance = 0.6; // 60% base
        
        // Modify based on stance
        if (selectedStance) {
            if (selectedStance === 'defensive') {
                baseDodgeChance += 0.1; // Defensive stance is better at dodging
            } else if (selectedStance === 'balanced') {
                baseDodgeChance += 0.05; // Balanced is slightly better
            }
        }
        
        // Weapon weight affects dodge - heavier weapons make dodging harder
        const weapon = gameLogic.inventory.equippedWeapon;
        if (weapon === 'Steel Axe') {
            baseDodgeChance -= 0.1; // Harder to dodge with heavy axe
        } else if (weapon === 'Rusty Knife') {
            baseDodgeChance += 0.05; // Easier to dodge with light knife
        }
        
        // Level difference factor
        const levelDiff = gameLogic.stats.level - currentMonster.level;
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
        const { gameLogic, selectedStance, currentMonster } = this.battleManager;
        
        // Base counter chance (harder than normal attacks)
        let baseCounterChance = 0.5; // 50% base
        
        // Modify based on stance
        if (selectedStance) {
            if (selectedStance === 'balanced') {
                baseCounterChance += 0.2; // Balanced stance is much better at countering
            } else if (selectedStance === 'defensive') {
                baseCounterChance += 0.1; // Defensive stance is better at countering
            }
        }
        
        // Weapon type affects counter ability
        const weapon = gameLogic.inventory.equippedWeapon;
        if (weapon === 'Short Sword') {
            baseCounterChance += 0.1; // Swords are good for countering
        }
        
        // Level difference factor
        const levelDiff = gameLogic.stats.level - currentMonster.level;
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
        const { gameLogic, selectedStance, currentMonster } = this.battleManager;
        
        // Counter attacks do more damage than regular attacks
        const weaponDamage = gameLogic.getWeaponDamage();
        let damage = weaponDamage * 1.5; // 50% more damage for counters
        
        // Add random factor (1-10)
        damage += Math.floor(Math.random() * 10) + 1;
        
        // Modify based on stance
        if (selectedStance === 'balanced') {
            damage *= 1.2; // 20% more damage for balanced stance counters
        }
        
        // Level difference factor
        const levelDiff = gameLogic.stats.level - currentMonster.level;
        damage *= (1 + levelDiff * 0.1); // +/- 10% per level difference
        
        // Ensure damage is at least 1
        return Math.max(1, Math.floor(damage));
    }

    /**
     * Check if the defense is the correct counter for the attack type
     * @param {string} defenseAction - The defense action used
     * @param {string} attackType - The monster's attack type
     * @returns {boolean} - True if this is the right defense for this attack
     */
    isCorrectDefenseForAttack(defenseAction, attackType) {
        // Map of correct defenses for each attack type
        const correctDefenses = {
            // Blunt/Heavy attacks countered by Block
            'slam': 'Block',
            'crush': 'Block',
            'spray': 'Block',
            
            // Piercing/Sharp attacks countered by Parry
            'lunge': 'Parry',
            'pierce': 'Parry',
            'stab': 'Parry',
            
            // Fast/AOE attacks countered by Dodge
            'engulf': 'Dodge',
            'sweep': 'Dodge',
            'pulse': 'Dodge'
        };
        
        return correctDefenses[attackType] === defenseAction;
    }

    /**
     * Check if the attack is the correct counter for the defense type
     * @param {string} attackAction - The attack action used
     * @param {string} defendType - The monster's defense type
     * @returns {boolean} - True if this attack breaks this defense
     */
    isCorrectAttackForDefense(attackAction, defendType) {
        // Map of correct attacks for each defense type
        const correctAttacks = {
            // Hard defenses broken by Heavy Slash
            'harden': 'Heavy Slash',
            'block': 'Heavy Slash',
            'shell': 'Heavy Slash',
            
            // Split/Multiple defenses broken by Deep Thrust
            'split': 'Deep Thrust',
            'deflect': 'Deep Thrust',
            'mirror': 'Deep Thrust',
            
            // Soft/Absorbing defenses broken by Quick Slice
            'absorb': 'Quick Slice',
            'cushion': 'Quick Slice',
            
            // Phasing/Ethereal defenses broken by Light Slash
            'phase': 'Light Slash',
            'fade': 'Light Slash'
        };
        
        return correctAttacks[defendType] === attackAction;
    }

    /**
     * Get monster attack damage value
     * @returns {number} - Amount of damage
     */
    getMonsterAttackValue() {
        const { currentMonster } = this.battleManager;
        
        // Base damage from monster stats
        const baseDamage = currentMonster.baseAttack;
        
        // Add random factor based on monster level
        const randomFactor = Math.floor(Math.random() * currentMonster.level) + 1;
        
        // Calculate final damage
        return baseDamage + randomFactor;
    }
    
    /**
     * Calculate monster dodge success
     * @returns {boolean} - True if monster dodges successfully
     */
    calculateMonsterDodgeSuccess() {
        const { currentMonster, gameLogic } = this.battleManager;
        
        // Base dodge chance for monster
        let dodgeChance = 0.4; // 40% base
        
        // Adjust based on monster level
        dodgeChance += currentMonster.level * 0.02;
        
        // Adjust based on player level difference
        const levelDiff = currentMonster.level - gameLogic.stats.level;
        dodgeChance += levelDiff * 0.03;
        
        // Ensure within bounds
        dodgeChance = Math.max(0.2, Math.min(0.8, dodgeChance));
        
        return Math.random() < dodgeChance;
    }
}

export default BattleCalculations;