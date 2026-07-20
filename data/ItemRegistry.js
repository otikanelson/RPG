/**
 * src/data/ItemRegistry.js
 * The Single Source of Truth for all items in the game.
 * Read-only configuration.
 */

export const ITEM_REGISTRY = {
    // === WEAPONS ===
    weapons: {
        'rusty_knife': { 
            id: 'rusty_knife', 
            name: 'Rusty Knife', 
            type: 'dagger', 
            damage: 8, 
            description: 'Old and pitted, but sharper than it looks.',
            image: 'Assets/Images/RustyKnife.png'
        },
        'short_sword': { 
            id: 'short_sword', 
            name: 'Short Sword', 
            type: 'sword', 
            damage: 12, 
            description: 'A reliable iron blade preferred by scouts.',
            image: 'Assets/Images/shortSword.png'
        },
        'steel_axe': { 
            id: 'steel_axe', 
            name: 'Steel Axe', 
            type: 'axe', 
            damage: 16, 
            description: 'Heavy and demanding, built to split shields.',
            image: 'Assets/Images/Steel Axe.png'
        }
    },

    // === SECRET WEAPONS ===
    secret_weapons: {
        'void_reaver': { 
            id: 'void_reaver', 
            name: 'Void Reaver', 
            type: 'sword', 
            damage: 35, 
            description: 'A hidden blade vibrating with dark matter.',
            image: 'Assets/Images/bow.png'
        }
    },

    // === POTIONS ===
    potions: {
        'minor_health': { 
            id: 'minor_health', 
            name: 'Minor Health Potion', 
            effect: { type: 'heal', value: 20 }, 
            description: 'Restores 20 HP.',
            image: 'Assets/Images/health-potion.png'
        },
        'major_health': { 
            id: 'major_health', 
            name: 'Major Health Potion', 
            effect: { type: 'heal', value: 50 }, 
            description: 'Restores 50 HP.',
            image: 'Assets/Images/health-potion.png'
        }
    },

    // === SPECIAL GEAR ===
    special_gear: {
        'leather_cloak': { 
            id: 'leather_cloak', 
            name: 'Leather Cloak', 
            slot: 'armor', 
            defense: 2, 
            description: 'Offers mild protection from physical blows.',
            image: 'Assets/Images/inventory.png'
        },
        'shadow_pendant': { 
            id: 'shadow_pendant', 
            name: 'Shadow Pendant', 
            slot: 'accessory', 
            evasion: 0.1, 
            description: 'Slightly blurs your outline, increasing evasion.',
            image: 'Assets/Images/gem.png'
        }
    },

    // === SPECIAL ITEMS / QUEST ITEMS ===
    special_items: {
        'crypt_key': { 
            id: 'crypt_key', 
            name: 'Crypt Key', 
            isQuestItem: true, 
            description: 'An ornate, heavy key cold to the touch.',
            image: 'Assets/Images/gem.png'
        },
        'beast_talisman': { 
            id: 'beast_talisman', 
            name: 'Beast Talisman', 
            isQuestItem: true, 
            description: 'Emits a faint growl when held close.',
            image: 'Assets/Images/gem.png'
        }
    }
};

/**
 * Global helper to safely fetch an item configuration from any category using its unique ID.
 * Acts as a lookup safety net.
 */
export function getItemFromRegistry(itemId) {
    for (const category in ITEM_REGISTRY) {
        if (ITEM_REGISTRY[category][itemId]) {
            return ITEM_REGISTRY[category][itemId];
        }
    }
    console.error(`Item Failsafe Error: Item ID "${itemId}" does not exist in the Master Registry.`);
    return null;
}