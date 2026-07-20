/**
 * src/core/GameLogic.js
 * Refactored State Core. Manages calculations using flat tokens.
 * Mapped directly to your updated ITEM_REGISTRY structure.
 */
import { ITEM_REGISTRY, getItemFromRegistry } from '../data/ItemRegistry.js';

class GameLogic {
    constructor() {
        // UI Elements Mapping
        this.healthBar = document.getElementById('healthBarFill');
        this.sidebarHealthBar = document.getElementById('sidebarHealthBarFill');
        this.healthText = document.getElementById('healthValue');
        this.sidebarHealthText = document.getElementById('sidebarHealthValue');
        this.goldText = document.getElementById('goldValue');
        this.sidebarGoldText = document.getElementById('sidebarGoldValue');
        this.potionsText = document.getElementById('potionsText');
        this.weaponsText = document.getElementById('weaponsText');
        this.equippedBox = document.querySelector('.equippedBox');
        this.equippedText = document.getElementById('equippedText');

        if (!this.healthBar || !this.healthText || !this.goldText) {
            console.error('Required UI elements not found!');
            // Don't return - continue initialization even if some elements are missing
        }

        // Live Operational Statistics
        this.stats = {
            health: 100,
            maxHealth: 100,
            gold: 50,
            xp: 0,
            level: 1
        };

        // Dynamic inventory using your exact registry tokens.
        // Starts cleanly with ONLY ONE weapon token!
        this.inventory = {
            potions: {
                'minor_health': 2 // Structured dictionary tracking quantity
            },
            weapons: ['rusty_knife'], 
            special_gear: ['leather_cloak'],
            special_items: [],
            equippedWeapon: 'rusty_knife',
            equippedArmor: {
                chest: 'leather_cloak',
                head: null,
                accessory: null
            }
        };

        // Track visited locations for map system
        this.visitedLocations = [];

        this.initializeGameStorage();
        this.updateUI();
    }

    async initializeGameStorage() {
        try {
            const GameStorage = await import('./GameStorage.js');
            this.gameStorage = new GameStorage.default();
            window.gameLogic = this;
            console.log('GameStorage sub-tier operational.');
        } catch (error) {
            console.error('Failed to link internal storage class:', error);
        }
    }

    updateUI() {
        const healthPercent = (this.stats.health / this.stats.maxHealth) * 100;
        
        // Update main health bar
        if (this.healthBar) {
            this.healthBar.style.width = `${healthPercent}%`;
            
            const hue = (healthPercent * 1.2);
            this.healthBar.style.background = `linear-gradient(
                to bottom,
                hsl(${hue}, 90%, 55%) 0%,
                hsl(${hue}, 90%, 45%) 50%,
                hsl(${hue}, 90%, 35%) 100%
            )`;
        }

        // Update sidebar health bar
        if (this.sidebarHealthBar) {
            this.sidebarHealthBar.style.width = `${healthPercent}%`;
        }

        const xpBar = document.querySelector('.xpBar');
        if (xpBar) {
            xpBar.style.width = `${(this.stats.xp / 100) * 100}%`;
        }
        
        // Update text displays
        if (this.healthText) this.healthText.textContent = this.stats.health.toString();
        if (this.sidebarHealthText) this.sidebarHealthText.textContent = this.stats.health.toString();
        if (this.goldText) this.goldText.textContent = this.stats.gold.toString();
        if (this.sidebarGoldText) this.sidebarGoldText.textContent = this.stats.gold.toString();
        
        // Update level displays
        const levelValue = document.getElementById('levelValue');
        if (levelValue) {
            levelValue.textContent = this.stats.level.toString();
        }
        const sidebarLevelValue = document.getElementById('sidebarLevelValue');
        if (sidebarLevelValue) {
            sidebarLevelValue.textContent = this.stats.level.toString();
        }
        
        if (this.potionsText) {
            const minorCount = this.inventory.potions['minor_health'] || 0;
            const majorCount = this.inventory.potions['major_health'] || 0;
            this.potionsText.textContent = `Potions: Minor (${minorCount}) Major (${majorCount})`;
        }
        
        if (this.weaponsText) {
            // Uses your new getItemFromRegistry helper dynamically!
            const weaponNames = this.inventory.weapons.map(id => {
                const item = getItemFromRegistry(id);
                return item ? item.name : id;
            });
            this.weaponsText.textContent = weaponNames.join(', ');
        }

        this.updateEquippedWeapon();

        if (window.characterManager?.refreshSidebarStats) {
            window.characterManager.refreshSidebarStats();
        }
    }

    updateEquippedWeapon() {
        if (!this.inventory.equippedWeapon) return;
        const weapon = getItemFromRegistry(this.inventory.equippedWeapon);
        if (!weapon) return;
        
        if (this.equippedBox) {
            // Fallback UI rendering since image paths aren't hardcoded in the new registry
            this.equippedBox.innerHTML = weapon.image 
                ? `<img src="${weapon.image}" alt="${weapon.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`
                : `<span style="font-size: 10px; color: white;">${weapon.name}</span>`;
        }
        window.equipmentModalInstance?.updateEquippedDisplay?.();
    }

    buyWeapon(weaponToken) {
        const weapon = getItemFromRegistry(weaponToken);
        // Added a fallback cost calculation since cost isn't in your new registry layout
        const cost = weapon.cost || 30; 

        if (!weapon || this.inventory.weapons.includes(weaponToken) || !this.canAfford(cost)) {
            return false;
        }

        this.modifyGold(-cost);
        this.addToInventory('weapons', weaponToken);
        return true;
    }

    equipWeapon(weaponToken) {
        if (!this.inventory.weapons.includes(weaponToken)) return false;
        this.inventory.equippedWeapon = weaponToken;
        this.updateUI();
        return true;
    }

    getWeaponDamage() {
        const weapon = getItemFromRegistry(this.inventory.equippedWeapon);
        return weapon ? weapon.damage : 1;
    }

    getWeaponType() {
        const weapon = getItemFromRegistry(this.inventory.equippedWeapon);
        return weapon ? weapon.type : 'default';
    }

    addToInventory(category, itemToken, quantity = 1) {
        if (!this.inventory[category]) {
            this.inventory[category] = [];
        }

        if (category === 'potions') {
            this.inventory.potions[itemToken] = (this.inventory.potions[itemToken] || 0) + quantity;
        } else {
            if (!this.inventory[category].includes(itemToken)) {
                this.inventory[category].push(itemToken);
            }
        }
        this.updateUI();
        window.equipmentModalInstance?.updateEquippedDisplay?.();
    }

    removeFromInventory(category, itemToken, quantity = 1) {
        if (!this.inventory[category]) return false;

        if (category === 'potions') {
            if ((this.inventory.potions[itemToken] || 0) >= quantity) {
                this.inventory.potions[itemToken] -= quantity;
                this.updateUI();
                return true;
            }
        } else {
            const idx = this.inventory[category].indexOf(itemToken);
            if (idx > -1) {
                this.inventory[category].splice(idx, 1);
                if (this.inventory.equippedWeapon === itemToken) {
                    this.inventory.equippedWeapon = this.inventory.weapons[0] || null;
                }
                this.updateUI();
                return true;
            }
        }
        return false;
    }

    usePotion(potionToken = 'minor_health') {
        const count = this.inventory.potions[potionToken] || 0;
        if (count <= 0) return false;
        
        const potionConfig = getItemFromRegistry(potionToken);
        const healValue = potionConfig?.effect?.value || 20;

        this.heal(healValue);
        this.removeFromInventory('potions', potionToken, 1);
        return true;
    }

    getTotalDefense() {
        let defense = 0;
        for (const slot in this.inventory.equippedArmor) {
            const id = this.inventory.equippedArmor[slot];
            if (id) {
                const gear = getItemFromRegistry(id);
                if (gear && gear.defense) defense += gear.defense;
            }
        }
        return defense;
    }

    hasItem(category, itemToken) {
        if (category === 'potions') {
            return (this.inventory.potions[itemToken] || 0) > 0;
        }
        return this.inventory[category]?.includes(itemToken) || false;
    }

    equipArmor(armorToken) {
        if (!this.inventory.special_gear.includes(armorToken)) return false;
        const gearData = getItemFromRegistry(armorToken);
        if (!gearData || !gearData.slot) return false;
        
        this.inventory.equippedArmor[gearData.slot] = armorToken;
        this.updateUI();
        return true;
    }

    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.getTotalDefense());
        this.stats.health = Math.max(0, this.stats.health - actualDamage);
        this.updateUI();
        return this.stats.health > 0;
    }

    heal(amount) {
        this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
        this.updateUI();
    }

    modifyGold(amount) {
        this.stats.gold += amount;
        this.updateUI();
    }

    canAfford(cost) { return this.stats.gold >= cost; }

    addExperience(amount) {
        this.stats.xp += amount;
        if (this.stats.xp >= 100) this.levelUp();
        this.updateUI();
        return this.stats.level;
    }

    levelUp() {
        this.stats.level += 1;
        this.stats.xp = 0;
        this.stats.maxHealth += 10;
        this.stats.health = this.stats.maxHealth;
        return { newLevel: this.stats.level, maxHealth: this.stats.maxHealth };
    }
}

const gameLogic = new GameLogic();
window.gameLogic = gameLogic;
export default gameLogic;