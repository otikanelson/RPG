/**
 * src/core/PlayerState.js
 * Live operational tracking for the Player, ready for serialization.
 */

import { ITEM_REGISTRY, getItemFromRegistry } from '../data/ItemRegistry.js';

class PlayerState {
    constructor() {
        this.resetToDefault();
    }

    /**
     * Set up a completely fresh game state.
     * Starts with ONLY the 'rusty_knife' ID token.
     */
    resetToDefault() {
        this.stats = {
            level: 1,
            xp: 0,
            gold: 0,
            health: 50,
            maxHealth: 50
        };

        // All inventory items are stored strictly as registry ID string tokens
        this.inventory = {
            weapons: ['rusty_knife'],
            potions: {},       // Key-value pairs for stacking: { 'minor_health': 3 }
            specialGear: [],   // E.g., ['leather_cloak']
            specialItems: [],  // E.g., ['crypt_key']
            equippedWeapon: 'rusty_knife'
        };
    }

    /**
     * COMBAT LOOKUP MECHANICS
     * Safely grabs the live, dynamic data from the registry based on what is equipped.
     */
    getEquippedWeaponData() {
        return getItemFromRegistry(this.inventory.equippedWeapon) || ITEM_REGISTRY.weapons['rusty_knife'];
    }

    getNormalizedWeaponType() {
        return this.getEquippedWeaponData().type; // Returns 'dagger', 'sword', or 'axe' safely
    }

    getWeaponDamageValue() {
        return this.getEquippedWeaponData().damage;
    }

    /**
     * INVENTORY MANAGEMENT UTILITIES
     */
    addItem(itemId) {
        const item = getItemFromRegistry(itemId);
        if (!item) return false;

        // Automatically determine where it goes based on registry lookup
        if (ITEM_REGISTRY.weapons[itemId] || ITEM_REGISTRY.secret_weapons[itemId]) {
            if (!this.inventory.weapons.includes(itemId)) this.inventory.weapons.push(itemId);
        } else if (ITEM_REGISTRY.potions[itemId]) {
            this.inventory.potions[itemId] = (this.inventory.potions[itemId] || 0) + 1;
        } else if (ITEM_REGISTRY.special_gear[itemId]) {
            if (!this.inventory.specialGear.includes(itemId)) this.inventory.specialGear.push(itemId);
        } else if (ITEM_REGISTRY.special_items[itemId]) {
            if (!this.inventory.specialItems.includes(itemId)) this.inventory.specialItems.push(itemId);
        }
        return true;
    }

    /**
     * SAVE & LOAD SERIALIZATION FAILSAFE
     */

    /**
     * Step 1: Export clean, safe state data.
     * Can be converted straight to a JSON text string for localStorage or cloud saves.
     */
    exportSaveData() {
        return {
            stats: { ...this.stats },
            inventory: {
                weapons: [...this.inventory.weapons],
                potions: { ...this.inventory.potions },
                specialGear: [...this.inventory.specialGear],
                specialItems: [...this.inventory.specialItems],
                equippedWeapon: this.inventory.equippedWeapon
            }
        };
    }

    /**
     * Step 2: Import saved state data, applying strict recovery validation checks.
     */
    importSaveData(customSaveObject) {
        try {
            if (!customSaveObject || typeof customSaveObject !== 'object') {
                throw new Error("Invalid save format detected.");
            }

            // Restore basic statistics
            this.stats = { ...this.stats, ...customSaveObject.stats };

            // Restore inventories safely
            const inv = customSaveObject.inventory || {};
            this.inventory.weapons = Array.isArray(inv.weapons) ? inv.weapons : [];
            this.inventory.potions = typeof inv.potions === 'object' ? inv.potions : {};
            this.inventory.specialGear = Array.isArray(inv.specialGear) ? inv.specialGear : [];
            this.inventory.specialItems = Array.isArray(inv.specialItems) ? inv.specialItems : [];
            this.inventory.equippedWeapon = inv.equippedWeapon || '';

            // Run the recovery failsafe verification loop
            this.executeFailsafeValidation();

        } catch (error) {
            console.error("Critical error while parsing save state. Running recovery protocol.", error);
            this.executeFailsafeValidation();
        }
    }

    /**
     * Step 3: The Ultimate Failsafe Protocol.
     * Ensures that if an item gets completely corrupted or cleared by accident,
     * the player is still fully playable and won't throw uncatchable runtime exceptions.
     */
    executeFailsafeValidation() {
        // Failsafe 1: Ensure player owns at least one weapon.
        if (this.inventory.weapons.length === 0) {
            console.warn("Failsafe activated: Player inventory empty. Injecting 'rusty_knife'.");
            this.inventory.weapons.push('rusty_knife');
        }

        // Failsafe 2: Ensure the currently equipped weapon actually exists in their pocket.
        if (!this.inventory.weapons.includes(this.inventory.equippedWeapon)) {
            console.warn(`Failsafe activated: Equipped weapon '${this.inventory.equippedWeapon}' not owned. Reverting to first available weapon.`);
            this.inventory.equippedWeapon = this.inventory.weapons[0];
        }

        // Failsafe 3: Ensure the equipped weapon ID successfully resolves against the master registry.
        if (!getItemFromRegistry(this.inventory.equippedWeapon)) {
            console.warn(`Critical Failsafe activated: Weapon token '${this.inventory.equippedWeapon}' broken in database. Resetting to 'rusty_knife'.`);
            if (!this.inventory.weapons.includes('rusty_knife')) {
                this.inventory.weapons.push('rusty_knife');
            }
            this.inventory.equippedWeapon = 'rusty_knife';
        }
        
        console.log("Save/Load integrity verification checks successfully passed.");
    }
}

const playerState = new PlayerState();
export default playerState;