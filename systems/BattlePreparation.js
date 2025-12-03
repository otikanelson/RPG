/**
 * BattlePreparation.js (Cleaned)
 * Battle Preparation Manager - handles weapon/potion/stance selection
 */

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
        
        // Track preparation stage
        this.prepStage = 'weapon'; // weapon -> potion -> stance
    }

    setupModalHTML() {
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Prepare for Battle</h2>
                </div>
                <div class="modal-tabs">
                    <button class="tab-btn active" data-tab="weapons">Weapons</button>
                    <button class="tab-btn" data-tab="potions">Potions</button>
                    <button class="tab-btn" data-tab="stance" disabled>Stance</button>
                </div>
                <div class="tab-content">
                    <div id="weapons-tab" class="tab-panel active">
                        <div class="items-grid"></div>
                    </div>
                    <div id="potions-tab" class="tab-panel">
                        <div class="potions-selection">
                            <h3>Select Potions (0/2)</h3>
                            <div class="items-grid"></div>
                        </div>
                    </div>
                    <div id="stance-tab" class="tab-panel">
                        <div class="stance-selection">
                            <h3>Choose Your Battle Stance</h3>
                            <div class="items-grid stance-grid"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="next-btn">Next</button>
                    <button class="ready-btn" style="display: none;">Ready for Battle</button>
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
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1000;
                font-family: 'Seagram', sans-serif;
            }

            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #1a1003;
                color: #EdddE0;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #5f0cbd;
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
                border-bottom: 1px solid #5f0cbd;
                padding-bottom: 10px;
            }

            .modal-tabs {
                display: flex;
                border-bottom: 2px solid #5f0cbd;
                margin-bottom: 20px;
            }

            .tab-btn {
                padding: 10px 20px;
                background: rgba(3, 13, 27, 0.767);
                color: #EdddE0;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                font-family: 'Seagram', sans-serif;
                font-size: 16px;
            }

            .tab-btn.active {
                opacity: 1;
                border-bottom: 2px solid #5f0cbd;
                margin-bottom: -2px;
                background: rgba(8, 2, 61, 0.959);
            }

            .tab-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .tab-panel {
                display: none;
            }

            .tab-panel.active {
                display: block;
            }

            .items-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 16px;
                padding: 16px;
            }

            .stance-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .item-card {
                border: 1px solid #5f0cbd;
                border-radius: 4px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(8, 2, 61, 0.959);
                text-align: center;
            }

            .item-card:hover {
                background-color: rgba(95, 12, 189, 0.3);
                transform: scale(1.05);
            }

            .item-card.equipped, .item-card.selected {
                border-color: #0066cc;
                background-color: rgba(0, 102, 204, 0.3);
            }

            .modal-footer {
                margin-top: 20px;
                text-align: right;
            }

            .next-btn, .ready-btn {
                padding: 10px 20px;
                background-color: #5f0cbd;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-family: 'Seagram', sans-serif;
                font-size: 16px;
            }

            .next-btn:hover, .ready-btn:hover {
                background-color: #4a099d;
                transform: scale(1.05);
            }
            
            .stance-card h3 {
                margin-top: 0;
                color: #EdddE0;
            }
            
            .stance-card p {
                color: #ccc;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // Tab switching
        this.modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    this.switchTab(btn.dataset.tab);
                }
            });
        });

        // Next button
        this.modal.querySelector('.next-btn').addEventListener('click', () => {
            this.nextStage();
        });

        // Ready button
        this.modal.querySelector('.ready-btn').addEventListener('click', () => {
            this.finishPreparation();
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

    nextStage() {
        if (this.prepStage === 'weapon') {
            // Move to potions
            this.prepStage = 'potion';
            this.switchTab('potions');
            
            // Enable potions tab
            this.modal.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.dataset.tab === 'potions') {
                    btn.disabled = false;
                }
            });
            
        } else if (this.prepStage === 'potion') {
            // Move to stance
            this.prepStage = 'stance';
            this.switchTab('stance');
            this.updateStanceDisplay();
            
            // Enable stance tab
            this.modal.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.dataset.tab === 'stance') {
                    btn.disabled = false;
                }
            });
            
            // Show ready button, hide next button
            this.modal.querySelector('.next-btn').style.display = 'none';
            this.modal.querySelector('.ready-btn').style.display = 'inline-block';
        }
    }

    finishPreparation() {
        // Validate stance is selected
        if (!this.battleManager.selectedStance) {
            alert("Please select a stance before continuing!");
            return;
        }
        
        console.log("Battle preparation finished - closing modal");
        
        // Hide modal and resolve the promise
        // Note: We don't call onBattleReady here - ProgressManager will handle that
        this.hide();
    }
    
    createWeaponCard(weapon) {
        const card = document.createElement('div');
        card.className = 'item-card weapon-card';
        
        // Check if this weapon is equipped
        if (this.gameLogic.inventory.equippedWeapon === weapon) {
            card.classList.add('equipped');
        }

        // Get weapon stats
        const weaponObj = this.gameLogic.weapons[weapon] || { damage: '?', image: 'Assets/unknown.png' };

        card.innerHTML = `
            <h3>${weapon}</h3>
            <div class="weapon-image">
                <img src="${weaponObj.image}" alt="${weapon}" style="max-width: 100%; height: 60px; object-fit: contain;">
            </div>
            <p>Damage: ${weaponObj.damage}</p>
        `;

        card.addEventListener('click', () => {
            this.gameLogic.equipWeapon(weapon);
            this.updateWeaponsDisplay();
        });

        return card;
    }
    
    createPotionCard(index) {
        const card = document.createElement('div');
        card.className = 'item-card potion-card';
        
        // Check if this potion is selected
        if (this.selectedPotions && this.selectedPotions.includes(index)) {
            card.classList.add('selected');
        }

        card.innerHTML = `
            <h3>Health Potion</h3>
            <div class="potion-image">
                <img src="Assets/health-potion.png" alt="Health Potion" style="max-width: 100%; height: 60px; object-fit: contain;">
            </div>
            <p>Restores 10 HP</p>
        `;

        card.addEventListener('click', () => {
            this.togglePotionSelection(index, card);
        });

        return card;
    }
    
    createStanceCard(stance) {
        const card = document.createElement('div');
        card.className = 'item-card stance-card';
        
        if (this.battleManager.selectedStance === stance.name.toLowerCase()) {
            card.classList.add('selected');
        }
        
        // Calculate stance effectiveness with current weapon
        let effectivenessText = "";
        const equippedWeapon = this.gameLogic.inventory.equippedWeapon;
        if (equippedWeapon && this.battleManager.weaponStanceEffectiveness[equippedWeapon]) {
            const effectiveness = this.battleManager.weaponStanceEffectiveness[equippedWeapon][stance.name.toLowerCase()];
            if (effectiveness > 1.1) {
                effectivenessText = "<strong style='color: #4CAF50;'>Excellent Match</strong>";
            } else if (effectiveness > 0.9) {
                effectivenessText = "<strong style='color: #FFC107;'>Good Match</strong>";
            } else {
                effectivenessText = "<strong style='color: #F44336;'>Poor Match</strong>";
            }
        }

        card.innerHTML = `
            <h3>${stance.name} Stance</h3>
            <p>${this.getStanceDescription(stance.name.toLowerCase())}</p>
            <p>Actions: ${stance.actions.join(', ')}</p>
            <p>${effectivenessText}</p>
        `;

        card.addEventListener('click', () => {
            // Select this stance
            this.battleManager.setStance(stance.name.toLowerCase());
            
            // Update UI
            this.modal.querySelectorAll('.stance-card').forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
        });

        return card;
    }
    
    getStanceDescription(stanceName) {
        const descriptions = {
            offensive: "Maximum damage, but lower hit chance. Best with heavy weapons.",
            defensive: "Focus on protection with counter-attacks. Higher hit chance, lower damage.",
            balanced: "Even mix of offense and defense. Good with versatile weapons."
        };
        
        return descriptions[stanceName] || "Unknown stance type";
    }
    
    togglePotionSelection(index, card) {
        // Initialize selected potions array if needed
        if (!this.selectedPotions) {
            this.selectedPotions = [];
        }
        
        // Toggle selection
        const potionIdx = this.selectedPotions.indexOf(index);
        if (potionIdx === -1) {
            // Add if not already selected (max 2)
            if (this.selectedPotions.length < 2) {
                this.selectedPotions.push(index);
                card.classList.add('selected');
            } else {
                alert("You can only select up to 2 potions!");
                return;
            }
        } else {
            // Remove if already selected
            this.selectedPotions.splice(potionIdx, 1);
            card.classList.remove('selected');
        }
        
        // Update selection counter
        const potionSelectionTitle = this.modal.querySelector('.potions-selection h3');
        if (potionSelectionTitle) {
            potionSelectionTitle.textContent = `Select Potions (${this.selectedPotions.length}/2)`;
        }
    }
    
    updateWeaponsDisplay() {
        const grid = this.modal.querySelector('#weapons-tab .items-grid');
        grid.innerHTML = '';
        this.gameLogic.inventory.weapons.forEach(weapon => {
            grid.appendChild(this.createWeaponCard(weapon));
        });
    }

    updatePotionsDisplay() {
        const grid = this.modal.querySelector('#potions-tab .items-grid');
        grid.innerHTML = '';
        
        // Reset selection
        this.selectedPotions = [];
        
        // Create potion cards based on available potions
        for (let i = 0; i < this.gameLogic.inventory.healthPotions; i++) {
            grid.appendChild(this.createPotionCard(i));
        }
        
        // Show message if no potions
        if (this.gameLogic.inventory.healthPotions === 0) {
            const noItemsMsg = document.createElement('p');
            noItemsMsg.textContent = "You don't have any health potions!";
            noItemsMsg.style.gridColumn = "1 / -1";
            noItemsMsg.style.textAlign = "center";
            grid.appendChild(noItemsMsg);
        }
    }
    
    updateStanceDisplay() {
        const grid = this.modal.querySelector('#stance-tab .stance-grid');
        grid.innerHTML = '';
        
        // Create stance cards
        Object.values(this.battleManager.stances).forEach(stance => {
            grid.appendChild(this.createStanceCard(stance));
        });
    }

    show() {
        console.log("BattlePreparationManager.show called");
        
        this.prepStage = 'weapon';
        
        try {
            this.updateWeaponsDisplay();
            this.updatePotionsDisplay();
        } catch (error) {
            console.error("Error updating preparation displays:", error);
        }
        
        // Reset tabs
        try {
            this.modal.querySelectorAll('.tab-btn').forEach(btn => {
                btn.disabled = btn.dataset.tab !== 'weapons';
                btn.classList.toggle('active', btn.dataset.tab === 'weapons');
            });
            
            // Reset panels
            this.modal.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === 'weapons-tab');
            });
            
            // Show next button, hide ready button
            const nextBtn = this.modal.querySelector('.next-btn');
            const readyBtn = this.modal.querySelector('.ready-btn');
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (readyBtn) readyBtn.style.display = 'none';
        } catch (error) {
            console.error("Error setting up battle preparation UI:", error);
        }
        
        // Show modal
        try {
            console.log("Displaying battle preparation modal");
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        } catch (error) {
            console.error("Error displaying modal:", error);
        }
        
        // Return promise that resolves when player is ready
        return new Promise(resolve => {
            this.onReadyCallback = resolve;
        });
    }

    hide() {
        this.modal.style.display = 'none';
        if (this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        
        // Resolve ready promise
        if (this.onReadyCallback) {
            this.onReadyCallback();
            this.onReadyCallback = null;
        }
    }
}

export default BattlePreparationManager;