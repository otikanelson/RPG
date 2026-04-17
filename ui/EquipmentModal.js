// EquipmentModal.js - Handles equipment display and modal interactions

class EquipmentModal {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.modal = document.getElementById('equipmentModal');
        this.equippedBox = document.getElementById('equippedBox');
        
        console.log('EquipmentModal constructor - equippedBox found:', !!this.equippedBox);
        
        // Add click listener to equipped box
        if (this.equippedBox) {
            this.equippedBox.style.cursor = 'pointer';
            this.equippedBox.addEventListener('click', (e) => {
                console.log('Equipped box clicked via event listener!');
                e.preventDefault();
                e.stopPropagation();
                this.open();
            }, true); // Use capture phase
            console.log('Click listener added to equipped box');
        } else {
            console.error('Equipped box not found!');
        }
        
        // Initialize the equipped weapon display
        this.updateEquippedDisplay();
        
        // Close modal when clicking outside
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.close();
            }
        });
    }

    /**
     * Update the collapsed equipped weapon display
     */
    updateEquippedDisplay() {
        if (!this.equippedBox || !this.gameLogic) return;
        
        const equippedWeapon = this.gameLogic.inventory.equippedWeapon;
        
        if (equippedWeapon && this.gameLogic.weapons[equippedWeapon]) {
            const weapon = this.gameLogic.weapons[equippedWeapon];
            this.equippedBox.innerHTML = `
                <img src="${weapon.image}" alt="${equippedWeapon}" class="equipped-weapon-img">
                <div class="equipped-weapon-name">${equippedWeapon}</div>
            `;
            
            // Re-add click listener after innerHTML change
            this.equippedBox.onclick = () => this.open();
        } else {
            this.equippedBox.innerHTML = '<span class="equipped-placeholder">No weapon equipped</span>';
            this.equippedBox.onclick = () => this.open();
        }
    }

    /**
     * Open the equipment modal and populate it
     */
    open() {
        if (!this.modal) return;
        
        this.populateWeapons();
        this.populatePotions();
        this.populateEquippedWeapon();
        this.populateEquippedPotion();
        this.setupDragAndDrop();
        this.modal.classList.add('active');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the equipment modal
     */
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Populate the weapons grid
     */
    populateWeapons() {
        const weaponsGrid = document.getElementById('weaponsGrid');
        if (!weaponsGrid || !this.gameLogic) return;
        
        weaponsGrid.innerHTML = '';
        
        const ownedWeapons = this.gameLogic.inventory.weapons;
        const equippedWeapon = this.gameLogic.inventory.equippedWeapon;
        
        if (ownedWeapons.length === 0) {
            weaponsGrid.innerHTML = '<div class="equipment-empty">No weapons in inventory</div>';
            return;
        }
        
        ownedWeapons.forEach(weaponName => {
            const weapon = this.gameLogic.weapons[weaponName];
            if (!weapon) return;
            
            const isEquipped = weaponName === equippedWeapon;
            
            const weaponCard = document.createElement('div');
            weaponCard.className = `equipment-item ${isEquipped ? 'equipped' : ''}`;
            weaponCard.draggable = true;
            weaponCard.dataset.weaponName = weaponName;
            weaponCard.dataset.type = 'weapon';
            
            weaponCard.innerHTML = `
                <img src="${weapon.image}" alt="${weaponName}" class="equipment-item-img">
                <div class="equipment-item-name">${weaponName}</div>
                <div class="equipment-item-stats">
                    <div class="equipment-item-damage">⚔ ${weapon.damage} DMG</div>
                    ${weapon.cost > 0 ? `<div class="equipment-item-cost">💰 ${weapon.cost}g</div>` : ''}
                </div>
            `;
            
            weaponsGrid.appendChild(weaponCard);
        });
    }

    /**
     * Populate the potions grid
     */
    populatePotions() {
        const potionsGrid = document.getElementById('potionsGrid');
        if (!potionsGrid || !this.gameLogic) return;
        
        potionsGrid.innerHTML = '';
        
        const healthPotions = this.gameLogic.inventory.healthPotions;
        
        if (healthPotions === 0) {
            potionsGrid.innerHTML = '<div class="equipment-empty">No potions in inventory</div>';
            return;
        }
        
        // Create health potion card
        const potionCard = document.createElement('div');
        potionCard.className = 'equipment-item';
        potionCard.draggable = true;
        potionCard.dataset.potionName = 'Health Potion';
        potionCard.dataset.type = 'potion';
        
        potionCard.innerHTML = `
            <img src="Assets/health-potion.png" alt="Health Potion" class="equipment-item-img">
            <div class="equipment-item-name">Health Potion</div>
            <div class="equipment-item-stats">
                <div style="color: var(--success-green); font-weight: bold;">❤ +10 HP</div>
                <div style="color: white; margin-top: 4px;">Owned: ${healthPotions}</div>
            </div>
        `;
        
        potionsGrid.appendChild(potionCard);
    }

    /**
     * Populate the equipped weapon section
     */
    populateEquippedWeapon() {
        const equippedWeaponZone = document.getElementById('equippedWeaponZone');
        if (!equippedWeaponZone || !this.gameLogic) return;
        
        equippedWeaponZone.innerHTML = '';
        
        const equippedWeapon = this.gameLogic.inventory.equippedWeapon;
        
        if (!equippedWeapon || !this.gameLogic.weapons[equippedWeapon]) {
            equippedWeaponZone.innerHTML = '<div class="equipment-empty">Drag weapon here to equip</div>';
            return;
        }
        
        const weapon = this.gameLogic.weapons[equippedWeapon];
        const equippedCard = document.createElement('div');
        equippedCard.className = 'equipment-item equipped';
        equippedCard.draggable = true;
        equippedCard.dataset.weaponName = equippedWeapon;
        equippedCard.dataset.type = 'weapon';
        
        equippedCard.innerHTML = `
            <img src="${weapon.image}" alt="${equippedWeapon}" class="equipment-item-img">
            <div class="equipment-item-name">${equippedWeapon}</div>
            <div class="equipment-item-stats">
                <div class="equipment-item-damage">⚔ ${weapon.damage} DMG</div>
                <div style="color: var(--success-green); font-weight: bold; margin-top: 4px;">✓ Equipped</div>
            </div>
        `;
        
        equippedWeaponZone.appendChild(equippedCard);
        
        // Add unequip button
        const unequipBtn = document.createElement('button');
        unequipBtn.className = 'equipment-unequip-btn';
        unequipBtn.textContent = 'Unequip';
        unequipBtn.onclick = () => this.unequipWeapon();
        equippedWeaponZone.appendChild(unequipBtn);
    }

    /**
     * Populate the equipped potion section
     */
    populateEquippedPotion() {
        const equippedPotionZone = document.getElementById('equippedPotionZone');
        if (!equippedPotionZone || !this.gameLogic) return;
        
        equippedPotionZone.innerHTML = '';
        
        // Check if there's an equipped potion state (we'll use a simple flag)
        const equippedPotion = this.gameLogic.inventory.equippedPotion;
        const healthPotions = this.gameLogic.inventory.healthPotions;
        
        // If no potion is equipped or no potions available, show empty
        if (!equippedPotion || healthPotions === 0) {
            equippedPotionZone.innerHTML = '<div class="equipment-empty">Drag potion here to equip</div>';
            return;
        }
        
        // Create equipped potion card
        const potionCard = document.createElement('div');
        potionCard.className = 'equipment-item equipped';
        potionCard.draggable = true;
        potionCard.dataset.potionName = 'Health Potion';
        potionCard.dataset.type = 'potion';
        
        potionCard.innerHTML = `
            <img src="Assets/health-potion.png" alt="Health Potion" class="equipment-item-img">
            <div class="equipment-item-name">Health Potion</div>
            <div class="equipment-item-stats">
                <div style="color: var(--success-green); font-weight: bold;">❤ +10 HP</div>
                <div style="color: var(--success-green); font-weight: bold; margin-top: 4px;">✓ Equipped</div>
            </div>
        `;
        
        equippedPotionZone.appendChild(potionCard);
        
        // Add unequip button
        const unequipBtn = document.createElement('button');
        unequipBtn.className = 'equipment-unequip-btn';
        unequipBtn.textContent = 'Unequip';
        unequipBtn.onclick = () => this.unequipPotion();
        equippedPotionZone.appendChild(unequipBtn);
    }

    /**
     * Equip a weapon
     * @param {string} weaponName - Name of the weapon to equip
     */
    equipWeapon(weaponName) {
        if (!this.gameLogic) return;
        
        const success = this.gameLogic.equipWeapon(weaponName);
        
        if (success) {
            // Update the collapsed display
            this.updateEquippedDisplay();
            
            // Refresh the modal to show new equipped state
            this.populateWeapons();
            this.populateEquippedWeapon();
            this.setupDragAndDrop();
            
            // Play a sound effect (if available)
            const equipSound = new Audio('Assets/button-click.mp3');
            equipSound.volume = 0.3;
            equipSound.play().catch(e => console.warn('Equip sound failed:', e));
        }
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        const inventoryWeaponsZone = document.getElementById('inventoryWeaponsZone');
        const inventoryPotionsZone = document.getElementById('inventoryPotionsZone');
        const equippedWeaponZone = document.getElementById('equippedWeaponZone');
        const equippedPotionZone = document.getElementById('equippedPotionZone');
        
        const allZones = [inventoryWeaponsZone, inventoryPotionsZone, equippedWeaponZone, equippedPotionZone];
        
        // Setup drag over effects for all zones
        allZones.forEach(zone => {
            if (!zone) return;
            
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', (e) => {
                if (e.target === zone) {
                    zone.classList.remove('drag-over');
                }
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const weaponName = e.dataTransfer.getData('weaponName');
                const potionName = e.dataTransfer.getData('potionName');
                const type = e.dataTransfer.getData('type');
                
                // Handle weapon equipping
                if (type === 'weapon' && weaponName && zone === equippedWeaponZone) {
                    this.equipWeapon(weaponName);
                }
                
                // Handle potion equipping
                if (type === 'potion' && potionName && zone === equippedPotionZone) {
                    this.equipPotion(potionName);
                }
            });
        });
        
        // Setup drag start for all draggable items
        setTimeout(() => {
            document.querySelectorAll('[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('weaponName', item.dataset.weaponName || '');
                    e.dataTransfer.setData('potionName', item.dataset.potionName || '');
                    e.dataTransfer.setData('type', item.dataset.type || '');
                }, false);
            });
        }, 100);
    }

    /**
     * Equip a potion
     * @param {string} potionName - Name of the potion to equip
     */
    equipPotion(potionName) {
        if (!this.gameLogic) return;
        
        // Set the equipped potion flag
        this.gameLogic.inventory.equippedPotion = potionName;
        
        // Refresh the display
        this.populateEquippedPotion();
        this.setupDragAndDrop();
        
        // Play a sound effect (if available)
        const equipSound = new Audio('Assets/button-click.mp3');
        equipSound.volume = 0.3;
        equipSound.play().catch(e => console.warn('Equip sound failed:', e));
    }

    /**
     * Unequip the current weapon
     */
    unequipWeapon() {
        if (!this.gameLogic) return;
        
        this.gameLogic.inventory.equippedWeapon = null;
        this.updateEquippedDisplay();
        this.populateWeapons();
        this.populateEquippedWeapon();
        this.setupDragAndDrop();
        
        // Play a sound effect
        const unequipSound = new Audio('Assets/button-click.mp3');
        unequipSound.volume = 0.3;
        unequipSound.play().catch(e => console.warn('Unequip sound failed:', e));
    }

    /**
     * Unequip the current potion
     */
    unequipPotion() {
        if (!this.gameLogic) return;
        
        this.gameLogic.inventory.equippedPotion = null;
        this.populateEquippedPotion();
        this.setupDragAndDrop();
        
        // Play a sound effect
        const unequipSound = new Audio('Assets/button-click.mp3');
        unequipSound.volume = 0.3;
        unequipSound.play().catch(e => console.warn('Unequip sound failed:', e));
    }
}

// Global functions for onclick handlers
window.openEquipmentModal = function() {
    if (window.equipmentModal) {
        window.equipmentModal.open();
    }
};

window.closeEquipmentModal = function() {
    if (window.equipmentModal) {
        window.equipmentModal.close();
    }
};

// Export for module usage
export default EquipmentModal;
