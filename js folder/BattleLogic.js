class BattleManager {
    constructor(gameLogic, textManager) {
        this.gameLogic = gameLogic;
        this.textManager = textManager;
        this.monsterStats = document.getElementById('monsterStats');
        this.monsterName = document.getElementById('monsterName');
        this.monsterHealth = document.getElementById('monsterHealth');
        this.monsterLevel = document.getElementById('monsterLevel');
        this.monsterHealthBar = document.querySelector('.monsterHealthBar');
        this.prepManager = new BattlePreparationManager(gameLogic, this,);
        this.dialogueManager = textManager;

        // Initialize monsters data
        this.monsters = {
            'Shard Warden': {
                name: 'Shard Warden',
                health: 100,
                maxHealth: 100,
                level: 5,
                baseAttack: 10
            },            
            'Shadow Beast': {
                name: 'Shadow Beast',
                health: 80,
                maxHealth: 80,
                level: 3,
                baseAttack: 8,
                specialAbility: 'phase'
            },
            // Add other monsters here
        };
        
        this.currentMonster = null;
        this.inBattle = false;
        this.prepManager = new BattlePreparationManager(gameLogic, this);

    }

    setupChoices(choices) {
        // Forward to the dialogue manager
        this.dialogueManager.setupChoices(choices);
    }

    async startBattle(monsterName) {
        this.currentMonster = {
            ...this.monsters[monsterName],
            health: this.monsters[monsterName].maxHealth
        };
        
        this.inBattle = true;
        this.updateMonsterStats();
        
        // Show monster stats UI
        if (this.monsterStats) {
            this.monsterStats.style.display = 'block';
        }

        // Return weapon selection choices
        this.prepManager.show();
    }

    
    onBattleReady() {
        const result = this.beginBattlePhase();
        // Update the text and choices
        if (this.textManager) {
            this.textManager.typeText(result.text).then(() => {
                this.textManager.showButtons(result.choices);
            });
        }
    }

    beginBattlePhase() {
        return {
            text: `You face the ${this.currentMonster.name}. What will you do?`,
            choices: this.getBattleChoices()
        };
    }

    updateMonsterStats() {
        if (this.currentMonster && this.monsterStats) {
            // Update text values
            this.monsterName.textContent = this.currentMonster.name;
            this.monsterHealth.textContent = this.currentMonster.health;
            this.monsterLevel.textContent = this.currentMonster.level;

            // Update health bar
            if (this.monsterHealthBar) {
                const healthPercent = (this.currentMonster.health / this.currentMonster.maxHealth) * 100;
                this.monsterHealthBar.style.width = `${healthPercent}%`;

                // Calculate color based on health percentage
                const hue = (healthPercent * 1.2); // This gives us a range from 0 (red) to 120 (green)
                const saturation = 90; // Keep colors vibrant
                const lightness = 45; // Keep colors visible but not too bright
        
                // Create gradient with calculated color
                this.monsterHealthBar.style.background = `linear-gradient(
                    to bottom,
                    hsl(${hue}, ${saturation}%, ${lightness + 10}%) 0%,
                    hsl(${hue}, ${saturation}%, ${lightness}%) 50%,
                    hsl(${hue}, ${saturation}%, ${lightness - 10}%) 100%
                )`;
            }
        }
    }

    getWeaponSelectionChoices() {
        return this.gameLogic.inventory.weapons.map(weaponName => ({
            text: `Equip ${weaponName}`,
            action: 'equipForBattle',
            params: { weapon: weaponName }
        }));
    }

    getBattleChoices() {
        return [
            { text: "Attack", action: 'battleAttack' },
            { text: "Dodge", action: 'battleDodge' },
            { text: "Use Potion", action: 'useHealth' }
        ];
    }

    async performAttack() {
        const weaponDamage = this.gameLogic.getWeaponDamage();
        let battleText = '';

        // Player's turn
        const playerHitRoll = Math.floor(Math.random() * 6) + 1;
        if (playerHitRoll > 3) {
            const damage = weaponDamage + Math.floor(Math.random() * 10) + 1;
            this.currentMonster.health = Math.max(0, this.currentMonster.health - damage);
            battleText += `You hit ${this.currentMonster.name} for ${damage} damage with your ${this.gameLogic.inventory.equippedWeapon}!\n`;
            this.updateMonsterStats();
        } else {
            battleText += `Your attack misses!\n`;
        }

        // Check if monster is defeated
        if (this.currentMonster.health <= 0) {
            return this.handleMonsterDefeat();
        }

        // Monster's turn
        const monsterHitRoll = Math.floor(Math.random() * 6) + 1;
        if (monsterHitRoll > 3) {
            const monsterDamage = this.getMonsterAttackValue();
            this.gameLogic.takeDamage(monsterDamage);
            battleText += `${this.currentMonster.name} hits you for ${monsterDamage} damage!`;
        } else {
            battleText += `${this.currentMonster.name}'s attack misses!`;
        }

        // Check if player is defeated
        if (this.gameLogic.stats.health <= 0) {
            return this.handlePlayerDefeat();
        }

        return {
            text: battleText,
            choices: this.getBattleChoices()
        };
    }

    async performDodge() {
        const dodgeRoll = Math.floor(Math.random() * 6) + 1;
        let battleText = '';

        if (dodgeRoll > 2) {
            battleText = `You successfully dodge ${this.currentMonster.name}'s attack!`;
        } else {
            const damage = Math.floor(this.getMonsterAttackValue() / 2);
            this.gameLogic.takeDamage(damage);
            battleText = `You fail to dodge and take ${damage} damage!`;
        }

        return {
            text: battleText,
            choices: this.getBattleChoices()
        };
    }

    getMonsterAttackValue() {
        const baseDamage = this.currentMonster.baseAttack;
        return baseDamage + Math.floor(Math.random() * this.currentMonster.level);
    }

    async handleMonsterDefeat() {
        this.inBattle = false;
        const goldReward = this.currentMonster.level * 10;
        const xpReward = this.currentMonster.level * 15;
        
        this.gameLogic.modifyGold(goldReward);
        const newLevel = this.gameLogic.addExperience(xpReward);
        
        // Hide monster stats UI
        if (this.monsterStats) {
            this.monsterStats.style.display = 'none';
        }

        let rewardText = `You defeated ${this.currentMonster.name}! You gain ${goldReward} gold and ${xpReward} experience!`;
        
        // Add level up message if level changed
        if (newLevel > this.gameLogic.stats.level - 1) {
            rewardText += `\nCongratulations! You reached level ${newLevel}!`;
        }

        return {
            text: rewardText,
            nextDialogue: 'DefeatWarden'
        };
    }

    async handlePlayerDefeat() {
        this.inBattle = false;
        if (this.monsterStats) {
            this.monsterStats.style.display = 'none';
        }
        
        return {
            text: "You have been defeated...",
            nextDialogue: 'GameOver'
        };
    }
}

export default BattleManager;


class BattlePreparationManager {
    constructor(gameLogic, battleManager) {
        this.gameLogic = gameLogic;
        this.battleManager = battleManager;
        
        // Create modal elements
        this.modal = document.createElement('div');
        this.modal.className = 'battle-prep-modal';
        this.setupModalHTML();
        
        // Bind event listeners
        this.bindEvents();
        
        // Add styles
        this.addStyles();
    }

    setupModalHTML() {
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Prepare for Battle</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-tabs">
                    <button class="tab-btn active" data-tab="weapons">Weapons</button>
                    <button class="tab-btn" data-tab="potions">Potions</button>
                </div>
                <div class="tab-content">
                    <div id="weapons-tab" class="tab-panel active">
                        <div class="items-grid"></div>
                    </div>
                    <div id="potions-tab" class="tab-panel">
                        <div class="items-grid"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="ready-btn">Ready for Battle</button>
                </div>
            </div>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .battle-prep-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
            }

            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                width: 80%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
            }

            .modal-tabs {
                display: flex;
                border-bottom: 2px solid #ccc;
                margin-bottom: 20px;
            }

            .tab-btn {
                padding: 10px 20px;
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
            }

            .tab-btn.active {
                opacity: 1;
                border-bottom: 2px solid #0066cc;
                margin-bottom: -2px;
            }

            .tab-panel {
                display: none;
            }

            .tab-panel.active {
                display: block;
            }

            .items-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
                padding: 16px;
            }

            .item-card {
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .item-card:hover {
                background-color: #f0f0f0;
            }

            .item-card.equipped {
                border-color: #0066cc;
                background-color: #e6f0ff;
            }

            .modal-footer {
                margin-top: 20px;
                text-align: right;
            }

            .ready-btn {
                padding: 10px 20px;
                background-color: #0066cc;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .ready-btn:hover {
                background-color: #0052a3;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // Tab switching
        this.modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Close button
        this.modal.querySelector('.close-btn').addEventListener('click', () => this.hide());

        // Ready button
        this.modal.querySelector('.ready-btn').addEventListener('click', () => {
            this.hide();
            // Get and set up battle choices
            const choices = this.battleManager.getBattleChoices();
            this.battleManager.setupChoices(choices);
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        this.modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab panels
        this.modal.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-tab`);
        });
    }

    createItemCard(item, type) {
        const card = document.createElement('div');
        card.className = 'item-card';
        if (type === 'weapon' && item === this.gameLogic.inventory.equippedWeapon) {
            card.classList.add('equipped');
        }

        card.innerHTML = `
            <h3>${item}</h3>
            <p>${type === 'weapon' ? 'Click to equip' : 'Restores 10 HP'}</p>
        `;

        card.addEventListener('click', () => {
            if (type === 'weapon') {
                this.gameLogic.equipWeapon(item);
                this.updateWeaponsDisplay();
            } else {
                this.gameLogic.equipPotion(item);
                this.updatePotionsDisplay();
            }
        });

        return card;
    }

    updateWeaponsDisplay() {
        const grid = this.modal.querySelector('#weapons-tab .items-grid');
        grid.innerHTML = '';
        this.gameLogic.inventory.weapons.forEach(weapon => {
            grid.appendChild(this.createItemCard(weapon, 'weapon'));
        });
    }

    updatePotionsDisplay() {
        const grid = this.modal.querySelector('#potions-tab .items-grid');
        grid.innerHTML = '';
        for (let i = 0; i < this.gameLogic.inventory.healthPotions; i++) {
            grid.appendChild(this.createItemCard('Health Potion', 'potion'));
        }
    }

    show() {
        this.updateWeaponsDisplay();
        this.updatePotionsDisplay();
        this.modal.style.display = 'block';
        document.body.appendChild(this.modal);
    }

    hide() {
        this.modal.style.display = 'none';
        if (this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
    }

    onBattleReady() {
        this.battleManager.beginBattlePhase();
    }
}