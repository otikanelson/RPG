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
                image: 'Assets/Rustyknife.png',
                type: 'dagger'  // ADDED
            },
            'Short Sword': {
                damage: 10,
                cost: 30,
                image: 'Assets/shortSword.png',
                type: 'sword'  // ADDED
            },
            'Steel Axe': {
                damage: 15,
                cost: 50,
                image: 'assets/Steel Axe.png',
                type: 'axe'  // ADDED
            }
        };

        // Initialize inventory - MOVED THIS BEFORE setting equippedPotion
        this.inventory = {
            healthPotions: 2,
            weapons: ['Rusty Knife', 'Short Sword', 'Steel Axe'],
            equippedWeapon: '',
            equippedPotion: null  // Added here instead of trying to set it separately
        };

        // Initial UI update
        this.updateUI();
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
    }

    updateEquippedWeapon() {
        if (this.equippedBox && this.equippedText) {
            const weapon = this.weapons[this.inventory.equippedWeapon];
            if (weapon) {
                this.equippedBox.innerHTML = `<img src="${weapon.image}" alt="${this.inventory.equippedWeapon}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
            }
        }
    }

    buyWeapon(weaponName) {
        const weapon = this.weapons[weaponName];
        if (!weapon) {
            console.error('Weapon does not exist:', weaponName);
            return false;
        }

        if (this.inventory.weapons.includes(weaponName)) {
            return false; // Already owned
        }

        if (this.canAfford(weapon.cost)) {
            this.modifyGold(-weapon.cost);
            this.addToInventory('weapon', weaponName);
            return true;
        }
        return false;
    }

    equipWeapon(weaponName) {
        if (this.inventory.weapons.includes(weaponName)) {
            this.inventory.equippedWeapon = weaponName;
            this.updateUI();
            return true;
        }
        return false;
    }

    getWeaponDamage() {
        const weapon = this.weapons[this.inventory.equippedWeapon];
        return weapon ? weapon.damage : 1;
    }

    /**
     * Get the type of the equipped weapon
     * @returns {string} - Weapon type (sword, axe, dagger) or 'default'
     */
    getWeaponType() {
        const equippedWeapon = this.inventory.equippedWeapon;
        if (!equippedWeapon || !this.weapons[equippedWeapon]) {
            return 'default';
        }
        return this.weapons[equippedWeapon].type || 'default';
    }

    // Item management
    addToInventory(itemType, item = null, quantity = 1) {
        switch(itemType) {
            case 'healthPotion':
                this.inventory.healthPotions += quantity;
                break;
            case 'weapon':
                if (item && !this.inventory.weapons.includes(item)) {
                    this.inventory.weapons.push(item);
                }
                break;
        }
        this.updateUI();
    }

    removeFromInventory(itemType, item = null, quantity = 1) {
        switch(itemType) {
            case 'healthPotion':
                if (this.inventory.healthPotions >= quantity) {
                    this.inventory.healthPotions -= quantity;
                    return true;
                }
                return false;
            case 'weapon':
                if (item) {
                    const index = this.inventory.weapons.indexOf(item);
                    if (index > -1) {
                        this.inventory.weapons.splice(index, 1);
                        if (this.inventory.equippedWeapon === item) {
                            this.inventory.equippedWeapon = this.inventory.weapons[0] || null;
                        }
                        return true;
                    }
                }
                return false;
        }
        this.updateUI();
    }

    useHealthPotion() {
        if (this.inventory.healthPotions > 0) {
            this.heal(10);
            this.removeFromInventory('healthPotion');
            return true;
        }
        return false;
    }

    buyHealthPotion(cost = 10) {
        if (this.canAfford(cost)) {
            this.modifyGold(-cost);
            this.addToInventory('healthPotion');
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        this.stats.health = Math.max(0, this.stats.health - amount);
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