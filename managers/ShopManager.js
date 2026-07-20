/**
 * ShopManager.js
 * Centralized registry and inventory allocation systems for vendors.
 */

export const ITEM_REGISTRY = {
    // Weapons
    'iron_sword': { id: 'iron_sword', name: 'Iron Sword', cost: 30, type: 'weapon', attack: 8, description: 'A finely forged iron blade. Much sharper than a rusty kitchen knife.' },
    'steel_axe': { id: 'steel_axe', name: 'Steel Axe', cost: 50, type: 'weapon', attack: 14, description: 'A heavy, battle-hardened woodsman axe designed to cleave through armor.' },
    'mythril_dagger': { id: 'mythril_dagger', name: 'Mythril Dagger', cost: 120, type: 'weapon', attack: 22, description: 'An incredibly light, glowing blade that hums with rift energy.' },
    
    // Armor
    'leather_vest': { id: 'leather_vest', name: 'Leather Vest', cost: 25, type: 'armor', defense: 4, description: 'Cured leather hide providing rudimentary physical protection.' },
    'chainmail': { id: 'chainmail', name: 'Reinforced Chainmail', cost: 65, type: 'armor', defense: 10, description: 'Interlocking steel links optimized to absorb heavier strikes.' },
    
    // Consumables
    'health_potion': { id: 'health_potion', name: 'Healing Potion', cost: 10, type: 'consumable', value: 25, description: 'A shimmering crimson vial. Restores 25 points of Health upon consumption.' },
    'elixir_of_force': { id: 'elixir_of_force', name: 'Elixir of Force', cost: 40, type: 'consumable', value: 5, description: 'Permanently increases core Attack value by 5 points.' }
};

export const MERCHANT_STOCK = {
    'MerchantRagnor': {
        greeting: "Ah, a curious soul! What might you be in search for, young traveler?",
        items: ['iron_sword', 'steel_axe', 'leather_vest', 'health_potion']
    },
    'SylasBlackMarket': {
        greeting: "Keep it down. Only show this to individuals who won't draw the Warden's attention.",
        items: ['mythril_dagger', 'chainmail', 'elixir_of_force']
    }
};

class ShopManager {
    constructor() {
        window.ItemRegistry = ITEM_REGISTRY;
    }

    /**
     * Attempts a transactional item purchase against player global data structures
     * @param {string} itemKey 
     * @returns {Object} Result payload status indicators
     */
    purchaseItem(itemKey) {
        const item = ITEM_REGISTRY[itemKey];
        if (!item) return { success: false, error: "Item configuration missing from global registers." };

        if (!window.gameLogic || !window.gameLogic.stats) {
            return { success: false, error: "Game stats core engine uninitialized." };
        }

        const playerStats = window.gameLogic.stats;
        
        // Validation Checks
        if (playerStats.gold < item.cost) {
            return { success: false, error: `Insufficient gold! You require ${item.cost - playerStats.gold} more gold.` };
        }

        // Deduct currency
        playerStats.gold -= item.cost;

        // Route inventory item delivery based on item category
        if (!window.gameLogic.inventory) window.gameLogic.inventory = [];
        window.gameLogic.inventory.push(itemKey);

        // Update active UI bars immediately if visible
        const goldVal = document.getElementById('goldValue');
        if (goldVal) goldVal.textContent = playerStats.gold;

        return { success: true, item };
    }
}

const shopManagerInstance = new ShopManager();
window.shopManager = shopManagerInstance;
export default shopManagerInstance;