// Battle Dialogue Manager
// This file loads and manages monster-specific dialogue from individual data files

import { SHADOW_BEAST_DATA } from '../data/shadowBeast.js';

// Central registry of all available monsters
// Add new monsters here as they are created
const MONSTER_DATA_REGISTRY = {
    'shadowbeast': SHADOW_BEAST_DATA,
    'shadow beast': SHADOW_BEAST_DATA, // Allow for both formats
    // Add more monsters as needed:
    // 'slime': SLIME_DATA,
    // 'warden': WARDEN_DATA,
};

/**
 * Get monster data by ID or name
 * @param {string} monsterId - The ID or name of the monster
 * @returns {Object|null} Monster data object or null if not found
 */
export function getMonsterData(monsterId) {
    if (!monsterId) {
        console.error('No monster ID provided to getMonsterData');
        return null;
    }
    
    const normalizedId = monsterId.toLowerCase().replace(/\s+/g, '');
    
    // Try exact match first
    if (MONSTER_DATA_REGISTRY[normalizedId]) {
        return MONSTER_DATA_REGISTRY[normalizedId];
    }
    
    // Try with spaces
    const idWithSpaces = monsterId.toLowerCase();
    if (MONSTER_DATA_REGISTRY[idWithSpaces]) {
        return MONSTER_DATA_REGISTRY[idWithSpaces];
    }
    
    console.error(`Monster data not found for: ${monsterId}`);
    return null;
}

/**
 * Get a random element from an array
 * @param {Array} array - The array to choose from
 * @returns {*} A random element from the array
 */
function getRandomElement(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a random attack type for a monster
 * @param {string} monsterId - The ID of the monster
 * @returns {string|null} A random attack type or null if not found
 */
export function getRandomAttackType(monsterId) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.availableAttacks) {
        console.error(`No available attacks found for monster: ${monsterId}`);
        return null;
    }
    return getRandomElement(monsterData.availableAttacks);
}

/**
 * Get a random defense type for a monster
 * @param {string} monsterId - The ID of the monster
 * @returns {string|null} A random defense type or null if not found
 */
export function getRandomDefendType(monsterId) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.availableDefends) {
        console.error(`No available defends found for monster: ${monsterId}`);
        return null;
    }
    return getRandomElement(monsterData.availableDefends);
}

/**
 * Get a random magic type for a monster
 * @param {string} monsterId - The ID of the monster
 * @returns {string|null} A random magic type or null if not found
 */
export function getRandomMagicType(monsterId) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.availableMagics) {
        console.error(`No available magics found for monster: ${monsterId}`);
        return null;
    }
    return getRandomElement(monsterData.availableMagics);
}

/**
 * Get attack dialogue for a monster
 * @param {string} monsterId - The ID of the monster
 * @param {string} weaponType - The player's weapon type
 * @param {string} attackType - The type of attack
 * @returns {string|null} The attack dialogue or null if not found
 */
export function getAttackDialogue(monsterId, weaponType, attackType) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.attacks) return null;
    
    const weaponAttacks = monsterData.attacks[weaponType];
    if (!weaponAttacks) {
        console.warn(`No attacks found for weapon ${weaponType} on monster ${monsterId}`);
        return null;
    }
    
    return weaponAttacks[attackType] || null;
}

/**
 * Get defense dialogue for a monster
 * @param {string} monsterId - The ID of the monster
 * @param {string} weaponType - The player's weapon type
 * @param {string} defendType - The type of defense
 * @returns {string|null} The defense dialogue or null if not found
 */
export function getDefendDialogue(monsterId, weaponType, defendType) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.defends) return null;
    
    const weaponDefends = monsterData.defends[weaponType];
    if (!weaponDefends) {
        console.warn(`No defends found for weapon ${weaponType} on monster ${monsterId}`);
        return null;
    }
    
    return weaponDefends[defendType] || null;
}

/**
 * Get magic dialogue for a monster
 * @param {string} monsterId - The ID of the monster
 * @param {string} magicType - The type of magic
 * @returns {string|null} The magic dialogue or null if not found
 */
export function getMagicDialogue(monsterId, magicType) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.magics) return null;
    
    return monsterData.magics[magicType] || null;
}

/**
 * Get player attack dialogue (successful player attacks)
 * @param {string} monsterId - The ID of the monster
 * @param {string} weaponType - The player's weapon type
 * @param {string} defendType - The monster's defense type being overcome
 * @returns {string|null} The player attack dialogue or null if not found
 */
export function getPlayerAttackDialogue(monsterId, weaponType, defendType) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.playerAttacks) return null;
    
    const weaponAttacks = monsterData.playerAttacks[weaponType];
    if (!weaponAttacks) return null;
    
    const dialogueKey = `vs${defendType.charAt(0).toUpperCase() + defendType.slice(1)}`;
    return weaponAttacks[dialogueKey] || null;
}

/**
 * Get player defend dialogue (successful player defenses)
 * @param {string} monsterId - The ID of the monster
 * @param {string} weaponType - The player's weapon type
 * @param {string} attackType - The monster's attack type being defended
 * @returns {string|null} The player defend dialogue or null if not found
 */
export function getPlayerDefendDialogue(monsterId, weaponType, attackType) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.playerDefends) return null;
    
    const weaponDefends = monsterData.playerDefends[weaponType];
    if (!weaponDefends) return null;
    
    const dialogueKey = `vs${attackType.charAt(0).toUpperCase() + attackType.slice(1)}`;
    return weaponDefends[dialogueKey] || null;
}

/**
 * Get player counter dialogue (successful player counters)
 * @param {string} monsterId - The ID of the monster
 * @param {string} weaponType - The player's weapon type
 * @param {string} attackType - The monster's attack type being countered
 * @returns {string|null} The player counter dialogue or null if not found
 */
export function getPlayerCounterDialogue(monsterId, weaponType, attackType) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.playerCounters) return null;
    
    const weaponCounters = monsterData.playerCounters[weaponType];
    if (!weaponCounters) return null;
    
    const dialogueKey = `vs${attackType.charAt(0).toUpperCase() + attackType.slice(1)}`;
    return weaponCounters[dialogueKey] || null;
}

/**
 * Get player dodge dialogue (successful player dodges)
 * @param {string} monsterId - The ID of the monster
 * @param {string} weaponType - The player's weapon type
 * @param {string} attackType - The monster's attack type being dodged
 * @returns {string|null} The player dodge dialogue or null if not found
 */
export function getPlayerDodgeDialogue(monsterId, weaponType, attackType) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.playerDodges) return null;
    
    const weaponDodges = monsterData.playerDodges[weaponType];
    if (!weaponDodges) return null;
    
    const dialogueKey = `vs${attackType.charAt(0).toUpperCase() + attackType.slice(1)}`;
    return weaponDodges[dialogueKey] || null;
}

/**
 * Get a random taunt from the monster
 * @param {string} monsterId - The ID of the monster
 * @returns {string|null} A random taunt or null if not found
 */
export function getRandomTaunt(monsterId) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.taunts) return null;
    
    return getRandomElement(monsterData.taunts);
}

/**
 * Get defeat dialogue (when player defeats monster)
 * @param {string} monsterId - The ID of the monster
 * @returns {string|null} A random defeat dialogue or null if not found
 */
export function getDefeatDialogue(monsterId) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.defeatDialogue) return null;
    
    return getRandomElement(monsterData.defeatDialogue);
}

/**
 * Get victory dialogue (when monster defeats player)
 * @param {string} monsterId - The ID of the monster
 * @returns {string|null} A random victory dialogue or null if not found
 */
export function getVictoryDialogue(monsterId) {
    const monsterData = getMonsterData(monsterId);
    if (!monsterData || !monsterData.victoryDialogue) return null;
    
    return getRandomElement(monsterData.victoryDialogue);
}

// Legacy support - maintain MONSTER_DIALOGUES export for backward compatibility
// This allows old code to still work while we transition
export const MONSTER_DIALOGUES = {
    get shadowbeast() { return SHADOW_BEAST_DATA; },
    get 'shadow beast'() { return SHADOW_BEAST_DATA; }
};

// Export all helper functions
export default {
    getMonsterData,
    getRandomAttackType,
    getRandomDefendType,
    getRandomMagicType,
    getAttackDialogue,
    getDefendDialogue,
    getMagicDialogue,
    getPlayerAttackDialogue,
    getPlayerDefendDialogue,
    getPlayerCounterDialogue,
    getPlayerDodgeDialogue,
    getRandomTaunt,
    getDefeatDialogue,
    getVictoryDialogue
};