class GameLogic {
    constructor() {
        // Get all UI elements
        this.healthBar = document.querySelector('.healthBar');
        this.healthText = document.getElementById('healthText');
        this.goldText = document.getElementById('goldText');
        this.potionsText = document.getElementById('potionsText');
        this.weaponsText = document.getElementById('weaponsText');
        this.equippedBox = document.querySelector('.equippedBox');
        this.equippedText = document.getElementById('equippedText');

        if (!this.healthBar || !this.healthText || !this.goldText) {
            console.error('Required UI elements not found!');
            return;
        }

        // Initialize game stats
        this.stats = {
            health: 100,
            maxHealth: 100,
            gold: 50,
            xp: 0,    // Start at 0 XP
            level: 1
        };

        // Initialize weapons data
        this.weapons = {
            'Rusty Knife': {
                damage: 5,
                cost: 0,
                image: 'Assets/RustyKnife.png',
                type: 'dagger',
                rarity: 'common',
                description: 'A worn blade, better than nothing.'
            },
            'Short Sword': {
                damage: 10,
                cost: 30,
                image: 'Assets/shortSword.png',
                type: 'sword',
                rarity: 'common',
                description: 'A reliable steel sword for combat.'
            },
            'Steel Axe': {
                damage: 15,
                cost: 50,
                image: 'Assets/Steel Axe.png',
                type: 'axe',
                rarity: 'uncommon',
                description: 'A heavy axe that cleaves through enemies.'
            },
            'Bow': {
                damage: 12,
                cost: 40,
                image: 'Assets/bow.png',
                type: 'ranged',
                rarity: 'common',
                description: 'A simple bow for ranged attacks.'
            }
        };

        // Initialize armor/accessories data
        this.armor = {
            'Leather Vest': {
                defense: 3,
                cost: 25,
                image: 'Assets/inventory.png',
                type: 'chest',
                rarity: 'common',
                description: 'Basic leather protection.'
            },
            'Iron Helm': {
                defense: 5,
                cost: 35,
                image: 'Assets/gem.png',
                type: 'head',
                rarity: 'uncommon',
                description: 'Sturdy iron helmet.'
            }
        };

        // Initialize consumables data
        this.consumables = {
            'Health Potion': {
                effect: 'heal',
                value: 10,
                image: 'Assets/health-potion.png',
                description: 'Restores 10 HP instantly.'
            },
            'Mana Potion': {
                effect: 'mana',
                value: 5,
                image: 'Assets/alchemy.png',
                description: 'Restores 5 MP (future use).'
            }
        };

        // Initialize inventory - MOVED THIS BEFORE setting equippedPotion
        this.inventory = {
            healthPotions: 2,
            manaPotions: 1,
            weapons: ['Rusty Knife', 'Short Sword', 'Steel Axe', 'Bow'],
            armor: ['Leather Vest'],
            equippedWeapon: 'Short Sword',
            equippedArmor: {
                head: null,
                chest: 'Leather Vest',
                legs: null
            },
            equippedConsumable: 'Health Potion'
        };

        // Initialize GameStorage for save/load functionality
        this.initializeGameStorage();

        // Initial UI update
        this.updateUI();
    }

    /**
     * Initialize GameStorage system
     */
    async initializeGameStorage() {
        try {
            const GameStorage = await import('./GameStorage.js');
            this.gameStorage = new GameStorage.default();
            
            // Make gameLogic globally accessible for GameStorage
            window.gameLogic = this;
            
            console.log('GameStorage initialized successfully');
        } catch (error) {
            console.error('Failed to initialize GameStorage:', error);
        }
    }


    equipPotion(index) {
        if (this.inventory.healthPotions > 0) {
            this.inventory.equippedPotion = index;
            return true;
        }
        return false;
    }

    useEquippedPotion() {
        if (this.inventory.equippedPotion !== null && this.inventory.healthPotions > 0) {
            this.heal(10);
            this.inventory.healthPotions--;
            this.inventory.equippedPotion = null;
            this.updateUI();
            return true;
        }
        return false;
    }

    updateUI() {
        // Update health bar
        const healthPercent = (this.stats.health / this.stats.maxHealth) * 100;
        this.healthBar.style.width = `${healthPercent}%`;
        
        // Calculate health bar color
        const hue = (healthPercent * 1.2);
        const saturation = 90;
        const lightness = 45;
        
        // Create gradient for health bar
        this.healthBar.style.background = `linear-gradient(
            to bottom,
            hsl(${hue}, ${saturation}%, ${lightness + 10}%) 0%,
            hsl(${hue}, ${saturation}%, ${lightness}%) 50%,
            hsl(${hue}, ${saturation}%, ${lightness - 10}%) 100%
        )`;

        // Update XP bar
        const xpBar = document.querySelector('.xpBar');
        if (xpBar) {
            const xpPercent = (this.stats.xp / 100) * 100;
            xpBar.style.width = `${xpPercent}%`;
        }
        
        // Update text elements
        this.healthText.textContent = this.stats.health.toString();
        this.goldText.textContent = this.stats.gold.toString();
        
        // Update XP display (showing only level)
        const xpText = document.getElementById('xpText');
        if (xpText) {
            xpText.textContent = this.stats.level.toString();
        }
        
        // Update inventory display
        if (this.potionsText) {
            this.potionsText.textContent = `Health Potions: ${this.inventory.healthPotions}`;
        }
        if (this.weaponsText) {
            this.weaponsText.textContent = this.inventory.weapons.join(', ');
        }

        // Update equipped weapon display
        this.updateEquippedWeapon();

        if (window.characterManager?.refreshSidebarStats) {
            window.characterManager.refreshSidebarStats();
        }
    }

    /**
     * Update the equipped weapon display in both the sidebar and modal
     */
    updateEquippedWeapon() {
        if (!this.inventory.equippedWeapon) return;
        
        const weapon = this.weapons[this.inventory.equippedWeapon];
        if (!weapon) return;
        
        // Update sidebar equipped box
        if (this.equippedBox) {
            this.equippedBox.innerHTML = `<img src="${weapon.image}" alt="${this.inventory.equippedWeapon}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
        }
        
        // Update equipment modal if it exists
        window.equipmentModalInstance?.updateEquippedDisplay?.();
    }

    /**
     * Buy a weapon from the shop
     * @param {string} weaponName - Name of weapon to purchase
     * @returns {boolean} - Success status
     */
    buyWeapon(weaponName) {
        const weapon = this.weapons[weaponName];
        if (!weapon) {
            console.error('Weapon does not exist:', weaponName);
            return false;
        }

        if (this.inventory.weapons.includes(weaponName)) {
            console.warn('Weapon already owned:', weaponName);
            return false;
        }

        if (!this.canAfford(weapon.cost)) {
            console.warn('Cannot afford weapon:', weaponName);
            return false;
        }

        this.modifyGold(-weapon.cost);
        this.addToInventory('weapon', weaponName);
        return true;
    }

    /**
     * Equip a weapon from inventory
     * @param {string} weaponName - Name of weapon to equip
     * @returns {boolean} - Success status
     */
    equipWeapon(weaponName) {
        if (!this.inventory.weapons.includes(weaponName)) {
            console.warn('Weapon not in inventory:', weaponName);
            return false;
        }
        
        this.inventory.equippedWeapon = weaponName;
        this.updateUI();
        return true;
    }

    /**
     * Get damage value of currently equipped weapon
     * @returns {number} - Weapon damage value
     */
    getWeaponDamage() {
        const weapon = this.weapons[this.inventory.equippedWeapon];
        return weapon?.damage || 1;
    }

    /**
     * Get the type of the equipped weapon
     * @returns {string} - Weapon type (sword, axe, dagger, ranged) or 'default'
     */
    getWeaponType() {
        const weapon = this.weapons[this.inventory.equippedWeapon];
        return weapon?.type || 'default';
    }

    /**
     * Add items to inventory
     * @param {string} itemType - Type of item (healthPotion, weapon, armor)
     * @param {string|null} item - Item name (for weapons/armor)
     * @param {number} quantity - Quantity to add
     */
    addToInventory(itemType, item = null, quantity = 1) {
        switch(itemType) {
            case 'healthPotion':
                this.inventory.healthPotions += quantity;
                break;
            case 'manaPotion':
                this.inventory.manaPotions = (this.inventory.manaPotions || 0) + quantity;
                break;
            case 'weapon':
                if (item && !this.inventory.weapons.includes(item)) {
                    this.inventory.weapons.push(item);
                }
                break;
            case 'armor':
                if (item && !this.inventory.armor.includes(item)) {
                    this.inventory.armor.push(item);
                }
                break;
        }
        
        this.updateUI();
        window.equipmentModalInstance?.updateEquippedDisplay?.();
    }

    /**
     * Remove items from inventory
     * @param {string} itemType - Type of item
     * @param {string|null} item - Item name (for weapons/armor)
     * @param {number} quantity - Quantity to remove
     * @returns {boolean} - Success status
     */
    removeFromInventory(itemType, item = null, quantity = 1) {
        switch(itemType) {
            case 'healthPotion':
                if (this.inventory.healthPotions >= quantity) {
                    this.inventory.healthPotions -= quantity;
                    window.equipmentModalInstance?.populateConsumables?.();
                    this.updateUI();
                    return true;
                }
                return false;
                
            case 'manaPotion':
                if ((this.inventory.manaPotions || 0) >= quantity) {
                    this.inventory.manaPotions -= quantity;
                    window.equipmentModalInstance?.populateConsumables?.();
                    this.updateUI();
                    return true;
                }
                return false;
                
            case 'weapon':
                if (!item) return false;
                const weaponIndex = this.inventory.weapons.indexOf(item);
                if (weaponIndex > -1) {
                    this.inventory.weapons.splice(weaponIndex, 1);
                    
                    // If removing equipped weapon, equip another or set to null
                    if (this.inventory.equippedWeapon === item) {
                        this.inventory.equippedWeapon = this.inventory.weapons[0] || null;
                    }
                    
                    window.equipmentModalInstance?.updateEquippedDisplay?.();
                    window.equipmentModalInstance?.populateWeapons?.();
                    this.updateUI();
                    return true;
                }
                return false;
                
            case 'armor':
                if (!item) return false;
                const armorIndex = this.inventory.armor.indexOf(item);
                if (armorIndex > -1) {
                    this.inventory.armor.splice(armorIndex, 1);
                    
                    // If removing equipped armor, unequip it
                    const armorData = this.armor[item];
                    if (armorData && this.inventory.equippedArmor[armorData.type] === item) {
                        this.inventory.equippedArmor[armorData.type] = null;
                    }
                    
                    window.equipmentModalInstance?.populateArmor?.();
                    window.equipmentModalInstance?.populateEquippedArmor?.();
                    this.updateUI();
                    return true;
                }
                return false;
        }
        
        return false;
    }

    /**
     * Use a health potion to restore HP
     * @returns {boolean} - Success status
     */
    useHealthPotion() {
        if (this.inventory.healthPotions <= 0) return false;
        
        const consumable = this.consumables['Health Potion'];
        this.heal(consumable?.value || 10);
        this.removeFromInventory('healthPotion');
        return true;
    }

    /**
     * Buy health potion from shop
     * @param {number} cost - Cost of potion
     * @returns {boolean} - Success status
     */
    buyHealthPotion(cost = 10) {
        if (!this.canAfford(cost)) return false;
        
        this.modifyGold(-cost);
        this.addToInventory('healthPotion');
        return true;
    }

    /**
     * Get total defense from equipped armor
     * @returns {number} - Total defense value
     */
    getTotalDefense() {
        let totalDefense = 0;
        const equippedArmor = this.inventory.equippedArmor;
        
        for (const slot in equippedArmor) {
            const armorName = equippedArmor[slot];
            if (armorName && this.armor[armorName]) {
                totalDefense += this.armor[armorName].defense;
            }
        }
        
        return totalDefense;
    }

    /**
     * Check if player has an item in inventory
     * @param {string} itemType - Type of item
     * @param {string} itemName - Name of item
     * @returns {boolean} - Whether item is owned
     */
    hasItem(itemType, itemName) {
        switch(itemType) {
            case 'weapon':
                return this.inventory.weapons.includes(itemName);
            case 'armor':
                return this.inventory.armor.includes(itemName);
            case 'healthPotion':
                return this.inventory.healthPotions > 0;
            case 'manaPotion':
                return (this.inventory.manaPotions || 0) > 0;
            default:
                return false;
        }
    }

    /**
     * Equip armor piece
     * @param {string} armorName - Name of armor to equip
     * @returns {boolean} - Success status
     */
    equipArmor(armorName) {
        if (!this.inventory.armor.includes(armorName)) return false;
        
        const armorData = this.armor[armorName];
        if (!armorData) return false;
        
        this.inventory.equippedArmor[armorData.type] = armorName;
        this.updateUI();
        return true;
    }

    /**
     * Take damage with armor defense calculation
     * @param {number} amount - Raw damage amount
     * @returns {boolean} - Whether player survived
     */
    takeDamage(amount) {
        const defense = this.getTotalDefense();
        const actualDamage = Math.max(1, amount - defense); // Minimum 1 damage
        
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

    canAfford(cost) {
        return this.stats.gold >= cost;
    }

    addExperience(amount) {
        this.stats.xp += amount;
        
        // Check for level up
        if (this.stats.xp >= 100) {
            this.levelUp();
        }
        
        this.updateUI();
        return this.stats.level;
    }

    levelUp() {
        this.stats.level += 1;
        this.stats.xp = 0; // Reset XP to 0
        
        // Level up benefits
        this.stats.maxHealth += 10;
        this.stats.health = this.stats.maxHealth; // Heal to full on level up
        
        return {
            newLevel: this.stats.level,
            maxHealth: this.stats.maxHealth
        };
    }

    getInventoryCount(itemType) {
        switch(itemType) {
            case 'healthPotion':
                return this.inventory.healthPotions;
            case 'weapons':
                return this.inventory.weapons.length;
            default:
                return 0;
        }
    }
}

// Create a single instance of GameLogic
const gameLogic = new GameLogic();

// Make it globally accessible
window.gameLogic = gameLogic;

// Export for module usage
export default gameLogic;