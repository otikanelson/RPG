/**
 * src/data/PlayerData.js
 * Pure, static configuration data for the Player ecosystem.
 * Read-only at runtime.
 */

import { VISUAL_ASSETS } from '../systems/VisualAssets.js';

export const PLAYER_CONFIG = {
    id: "player",
    name: "Rift Walker",
    bio: "The soul guiding this body toward the shards.",
    description: "An avatar from another world...",
    image: VISUAL_ASSETS.MISC.PLAYER || "Assets/Images/thief.png",
    
    // Starting values for a new game session
    startingStats: {
        level: 1,
        xp: 0,
        gold: 0,
        health: 50,
        maxHealth: 50,
        baseAttack: 5,
        potions: 0
    },

    // Normalized lookup table mapping explicit inventory titles to clean combat weapon types
    weaponRegistry: {
        'Rusty Knife': { type: 'dagger', damage: 8, image: 'Assets/Images/rusty_knife.png' },
        'Short Sword': { type: 'sword', damage: 12, image: 'Assets/Images/short_sword.png' },
        'Steel Axe':   { type: 'axe',   damage: 16, image: 'Assets/Images/steel_axe.png' }
    },

    // Master balance matrix for dynamic combat matching
    weaponStanceEffectiveness: {
        'Short Sword': { offensive: 1.0, defensive: 1.2, balanced: 1.3 },
        'Steel Axe':   { offensive: 1.4, defensive: 0.8, balanced: 1.0 },
        'Rusty Knife': { offensive: 0.9, defensive: 1.1, balanced: 1.2 }
    }
};