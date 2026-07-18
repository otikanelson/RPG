// EquipmentModal.js - Handles equipment display and modal interactions

class EquipmentModal {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.modal = document.getElementById('equipmentModal');
        this.equippedBox = document.getElementById('equippedBox');
        
        console.log('EquipmentModal constructor - modal found:', !!this.modal);
        console.log('EquipmentModal constructor - equippedBox found:', !!this.equippedBox);
        
        // Don't add click listener here - it's handled in the HTML script
        // Just initialize the equipped weapon display
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
     * Open equipment modal automatically before battle
     * @param {string} reason - Why the modal is being opened ('battle' or 'manual')
     * @returns {Promise} - Resolves when modal is closed
     */
    openForBattle(reason = 'battle') {
        return new Promise((resolve) => {
            this.battleResolve = resolve;
            this.open(reason);
        });
    }

    /**
     * Update the collapsed equipped weapon display
     */
    updateEquippedDisplay() {
        if (!this.equippedBox || !this.gameLogic || !this.gameLogic.inventory) return;
        
        const equippedWeapon = this.gameLogic.inventory.equippedWeapon;
        
        if (equippedWeapon && this.gameLogic.weapons && this.gameLogic.weapons[equippedWeapon]) {
            const weapon = this.gameLogic.weapons[equippedWeapon];
            this.equippedBox.innerHTML = `
                <img src="${weapon.image}" alt="${equippedWeapon}" class="equipped-weapon-img">
                <div class="equipped-weapon-name">${equippedWeapon}</div>
                <div class="equipment-hint">🎒</div>
            `;
        } else {
            this.equippedBox.innerHTML = `
                <span class="equipped-placeholder">Click to view equipment</span>
                <div class="equipment-hint">🎒</div>
            `;
        }
        
        console.log('Equipment display updated');
    }

    /**
     * Open the equipment modal and populate it
     * @param {string} reason - Reason for opening ('battle' or 'manual')
     */
    open(reason = 'manual') {
        console.log('EquipmentModal.open() called with reason:', reason);
        
        if (!this.modal) {
            console.error('Modal element not found!');
            return;
        }
        
        try {
            console.log('Setting up battle-specific styling...');
            // Add battle-specific styling and messaging
            if (reason === 'battle') {
                this.modal.classList.add('battle-prep-mode');
                const header = this.modal.querySelector('.equipment-modal-header h2');
                if (header) {
                    header.textContent = '⚔️ Prepare for Battle';
                }
                
                // Add battle-ready button
                this.addBattleReadyButton();
            } else {
                this.modal.classList.remove('battle-prep-mode');
                const header = this.modal.querySelector('.equipment-modal-header h2');
                if (header) {
                    header.textContent = '🎒 Equipment & Inventory';
                }
                this.removeBattleReadyButton();
            }
            
            console.log('Populating modal content...');
            this.populateWeapons();
            this.populateArmor();
            this.populateConsumables();
            this.populateEquippedWeapon();
            this.populateEquippedArmor();
            this.populateEquippedConsumable();
            this.setupDragAndDrop();
            
            console.log('Showing modal...');
            this.modal.classList.add('active');
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            
            console.log('EquipmentModal.open() completed successfully');
        } catch (error) {
            console.error('Error in EquipmentModal.open():', error);
        }
    }

    /**
     * Add battle ready button for pre-battle equipment selection
     */
    addBattleReadyButton() {
        // Remove existing button first
        this.removeBattleReadyButton();
        
        const modalBody = this.modal.querySelector('.equipment-modal-body');
        if (modalBody) {
            const battleFooter = document.createElement('div');
            battleFooter.className = 'battle-ready-footer';
            battleFooter.innerHTML = `
                <div class="battle-prep-message">
                    <p>💡 <strong>Tip:</strong> Drag weapons and items to equip them before battle!</p>
                </div>
                <button class="battle-ready-btn" onclick="window.equipmentModalInstance.confirmBattleReady()">
                    ⚔️ Ready for Battle
                </button>
            `;
            modalBody.appendChild(battleFooter);
        }
    }

    /**
     * Remove battle ready button
     */
    removeBattleReadyButton() {
        const existingFooter = this.modal.querySelector('.battle-ready-footer');
        if (existingFooter) {
            existingFooter.remove();
        }
    }

    /**
     * Confirm battle readiness and close modal
     */
    confirmBattleReady() {
        // Check if player has a weapon equipped
        if (!this.gameLogic || !this.gameLogic.inventory || !this.gameLogic.inventory.equippedWeapon) {
            this.showBattleWarning('⚠️ You should equip a weapon before battle!');
            return;
        }
        
        this.close();
        
        // Resolve the battle promise if it exists
        if (this.battleResolve) {
            this.battleResolve();
            this.battleResolve = null;
        }
    }

    /**
     * Show warning message in battle mode
     */
    showBattleWarning(message) {
        const messageDiv = this.modal.querySelector('.battle-prep-message p');
        if (messageDiv) {
            const originalMessage = messageDiv.innerHTML;
            messageDiv.innerHTML = message;
            messageDiv.style.color = '#ff6b6b';
            
            setTimeout(() => {
                messageDiv.innerHTML = originalMessage;
                messageDiv.style.color = '';
            }, 3000);
        }
    }

    /**
     * Close the equipment modal
     */
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Resolve battle promise if needed
        if (this.battleResolve) {
            this.battleResolve();
            this.battleResolve = null;
        }
    }

    /**
     * Populate the weapons grid
     */
    populateWeapons() {
        const weaponsGrid = document.getElementById('weaponsGrid');
        if (!weaponsGrid || !this.gameLogic || !this.gameLogic.inventory) return;
        
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
     * Populate the armor grid
     */
    populateArmor() {
        const armorGrid = document.getElementById('armorGrid');
        if (!armorGrid || !this.gameLogic || !this.gameLogic.inventory) return;
        
        armorGrid.innerHTML = '';
        
        const ownedArmor = this.gameLogic.inventory.armor;
        const equippedArmor = this.gameLogic.inventory.equippedArmor;
        
        if (ownedArmor.length === 0) {
            armorGrid.innerHTML = '<div class="equipment-empty">No armor in inventory</div>';
            return;
        }
        
        ownedArmor.forEach(armorName => {
            const armor = this.gameLogic.armor[armorName];
            if (!armor) return;
            
            const isEquipped = Object.values(equippedArmor).includes(armorName);
            
            const armorCard = document.createElement('div');
            armorCard.className = `equipment-item ${isEquipped ? 'equipped' : ''}`;
            armorCard.draggable = true;
            armorCard.dataset.armorName = armorName;
            armorCard.dataset.type = 'armor';
            armorCard.dataset.armorType = armor.type;
            
            armorCard.innerHTML = `
                <img src="${armor.image}" alt="${armorName}" class="equipment-item-img">
                <div class="equipment-item-name">${armorName}</div>
                <div class="equipment-item-stats">
                    <div class="equipment-item-defense">🛡 ${armor.defense} DEF</div>
                    <div class="equipment-item-type">${armor.type.toUpperCase()}</div>
                    ${armor.cost > 0 ? `<div class="equipment-item-cost">💰 ${armor.cost}g</div>` : ''}
                </div>
            `;
            
            armorCard.title = armor.description; // Tooltip
            armorGrid.appendChild(armorCard);
        });
    }

    /**
     * Populate the consumables grid
     */
    populateConsumables() {
        const consumablesGrid = document.getElementById('consumablesGrid');
        if (!consumablesGrid || !this.gameLogic || !this.gameLogic.inventory) return;
        
        consumablesGrid.innerHTML = '';
        
        const healthPotions = this.gameLogic.inventory.healthPotions;
        const manaPotions = this.gameLogic.inventory.manaPotions || 0;
        
        if (healthPotions === 0 && manaPotions === 0) {
            consumablesGrid.innerHTML = '<div class="equipment-empty">No consumables in inventory</div>';
            return;
        }
        
        // Create health potion card
        if (healthPotions > 0) {
            const healthPotionCard = document.createElement('div');
            healthPotionCard.className = 'equipment-item';
            healthPotionCard.draggable = true;
            healthPotionCard.dataset.consumableName = 'Health Potion';
            healthPotionCard.dataset.type = 'consumable';
            
            const consumable = this.gameLogic.consumables['Health Potion'];
            healthPotionCard.innerHTML = `
                <img src="${consumable.image}" alt="Health Potion" class="equipment-item-img">
                <div class="equipment-item-name">Health Potion</div>
                <div class="equipment-item-stats">
                    <div style="color: var(--success-green); font-weight: bold;">❤ +${consumable.value} HP</div>
                    <div style="color: white; margin-top: 4px;">Owned: ${healthPotions}</div>
                </div>
            `;
            healthPotionCard.title = consumable.description;
            consumablesGrid.appendChild(healthPotionCard);
        }
        
        // Create mana potion card
        if (manaPotions > 0) {
            const manaPotionCard = document.createElement('div');
            manaPotionCard.className = 'equipment-item';
            manaPotionCard.draggable = true;
            manaPotionCard.dataset.consumableName = 'Mana Potion';
            manaPotionCard.dataset.type = 'consumable';
            
            const consumable = this.gameLogic.consumables['Mana Potion'];
            manaPotionCard.innerHTML = `
                <img src="${consumable.image}" alt="Mana Potion" class="equipment-item-img">
                <div class="equipment-item-name">Mana Potion</div>
                <div class="equipment-item-stats">
                    <div style="color: #4A90E2; font-weight: bold;">⚡ +${consumable.value} MP</div>
                    <div style="color: white; margin-top: 4px;">Owned: ${manaPotions}</div>
                </div>
            `;
            manaPotionCard.title = consumable.description;
            consumablesGrid.appendChild(manaPotionCard);
        }
    }

    /**
     * Populate the equipped weapon section
     */
    populateEquippedWeapon() {
        const equippedWeaponZone = document.getElementById('equippedWeaponZone');
        if (!equippedWeaponZone || !this.gameLogic || !this.gameLogic.inventory) return;
        
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
     * Populate the equipped armor section
     */
    populateEquippedArmor() {
        const equippedArmorZone = document.getElementById('equippedArmorZone');
        if (!equippedArmorZone || !this.gameLogic || !this.gameLogic.inventory) return;
        
        equippedArmorZone.innerHTML = '';
        
        const equippedArmor = this.gameLogic.inventory.equippedArmor;
        
        // Create slots for different armor types
        const armorSlots = [
            { type: 'head', label: 'Head' },
            { type: 'chest', label: 'Chest' },
            { type: 'legs', label: 'Legs' }
        ];
        
        armorSlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'equipment-armor-slot';
            slotDiv.dataset.armorSlot = slot.type;
            
            const equippedItem = equippedArmor[slot.type];
            
            if (equippedItem && this.gameLogic.armor[equippedItem]) {
                const armor = this.gameLogic.armor[equippedItem];
                slotDiv.innerHTML = `
                    <div class="equipment-item equipped" draggable="true" data-armor-name="${equippedItem}" data-type="armor">
                        <img src="${armor.image}" alt="${equippedItem}" class="equipment-item-img">
                        <div class="equipment-item-name">${equippedItem}</div>
                        <div class="equipment-item-stats">
                            <div class="equipment-item-defense">🛡 ${armor.defense} DEF</div>
                            <div style="color: var(--success-green); font-weight: bold; margin-top: 4px;">✓ Equipped</div>
                        </div>
                    </div>
                    <button class="equipment-unequip-btn" onclick="window.equipmentModalInstance.unequipArmor('${slot.type}')">Unequip</button>
                `;
            } else {
                slotDiv.innerHTML = `
                    <div class="equipment-empty armor-slot-empty">
                        <div class="armor-slot-label">${slot.label}</div>
                        <div>Drag ${slot.label.toLowerCase()} armor here</div>
                    </div>
                `;
            }
            
            equippedArmorZone.appendChild(slotDiv);
        });
    }

    /**
     * Populate the equipped consumable section
     */
    populateEquippedConsumable() {
        const equippedConsumableZone = document.getElementById('equippedConsumableZone');
        if (!equippedConsumableZone || !this.gameLogic || !this.gameLogic.inventory) return;
        
        equippedConsumableZone.innerHTML = '';
        
        const equippedConsumable = this.gameLogic.inventory.equippedConsumable;
        
        if (!equippedConsumable || !this.gameLogic.consumables[equippedConsumable]) {
            equippedConsumableZone.innerHTML = '<div class="equipment-empty">Drag consumable here for quick use</div>';
            return;
        }
        
        const consumable = this.gameLogic.consumables[equippedConsumable];
        const equippedCard = document.createElement('div');
        equippedCard.className = 'equipment-item equipped';
        equippedCard.draggable = true;
        equippedCard.dataset.consumableName = equippedConsumable;
        equippedCard.dataset.type = 'consumable';
        
        let statDisplay = '';
        if (consumable.effect === 'heal') {
            statDisplay = `<div style="color: var(--success-green); font-weight: bold;">❤ +${consumable.value} HP</div>`;
        } else if (consumable.effect === 'mana') {
            statDisplay = `<div style="color: #4A90E2; font-weight: bold;">⚡ +${consumable.value} MP</div>`;
        }
        
        equippedCard.innerHTML = `
            <img src="${consumable.image}" alt="${equippedConsumable}" class="equipment-item-img">
            <div class="equipment-item-name">${equippedConsumable}</div>
            <div class="equipment-item-stats">
                ${statDisplay}
                <div style="color: var(--success-green); font-weight: bold; margin-top: 4px;">✓ Equipped</div>
            </div>
        `;
        
        equippedConsumableZone.appendChild(equippedCard);
        
        // Add unequip button
        const unequipBtn = document.createElement('button');
        unequipBtn.className = 'equipment-unequip-btn';
        unequipBtn.textContent = 'Unequip';
        unequipBtn.onclick = () => this.unequipConsumable();
        equippedConsumableZone.appendChild(unequipBtn);
    }

    /**
     * Equip a weapon
     * @param {string} weaponName - Name of the weapon to equip
     */
    equipWeapon(weaponName) {
        if (!this.gameLogic?.equipWeapon(weaponName)) return;
        
        // Update displays
        this.populateWeapons();
        this.populateEquippedWeapon();
        this.setupDragAndDrop();
        
        // Play sound effect
        this.playEquipSound();
    }

    /**
     * Play equipment sound effect
     */
    playEquipSound() {
        const equipSound = new Audio('Assets/button-click.mp3');
        equipSound.volume = 0.3;
        equipSound.play().catch(e => console.warn('Sound playback failed:', e));
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        // Get all drop zones
        const inventoryWeaponsZone = document.getElementById('inventoryWeaponsZone');
        const inventoryArmorZone = document.getElementById('inventoryArmorZone');
        const inventoryConsumablesZone = document.getElementById('inventoryConsumablesZone');
        const equippedWeaponZone = document.getElementById('equippedWeaponZone');
        const equippedArmorZone = document.getElementById('equippedArmorZone');
        const equippedConsumableZone = document.getElementById('equippedConsumableZone');
        
        const allZones = [
            inventoryWeaponsZone, 
            inventoryArmorZone, 
            inventoryConsumablesZone,
            equippedWeaponZone, 
            equippedArmorZone,
            equippedConsumableZone
        ].filter(zone => zone !== null);
        
        // Setup drag over effects for all zones
        allZones.forEach(zone => {
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
                
                const itemType = e.dataTransfer.getData('type');
                const itemName = e.dataTransfer.getData('itemName');
                const armorType = e.dataTransfer.getData('armorType');
                
                console.log('Drop event:', { itemType, itemName, zone: zone.id });
                
                // Handle weapon equipping
                if (itemType === 'weapon' && itemName && zone === equippedWeaponZone) {
                    this.equipWeapon(itemName);
                }
                
                // Handle armor equipping
                if (itemType === 'armor' && itemName && zone === equippedArmorZone) {
                    this.equipArmor(itemName);
                }
                
                // Handle consumable equipping
                if (itemType === 'consumable' && itemName && zone === equippedConsumableZone) {
                    this.equipConsumable(itemName);
                }
            });
        });
        
        // Setup drag start for all draggable items - do this after a small delay to ensure DOM is ready
        setTimeout(() => {
            document.querySelectorAll('[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    
                    // Set the data based on the item's dataset
                    const itemName = item.dataset.weaponName || item.dataset.armorName || item.dataset.consumableName || '';
                    const itemType = item.dataset.type || '';
                    const armorType = item.dataset.armorType || '';
                    
                    e.dataTransfer.setData('itemName', itemName);
                    e.dataTransfer.setData('type', itemType);
                    if (armorType) {
                        e.dataTransfer.setData('armorType', armorType);
                    }
                    
                    console.log('Drag start:', { itemName, itemType, armorType });
                }, false);
            });
        }, 100);
    }

    /**
     * Equip a piece of armor
     * @param {string} armorName - Name of the armor to equip
     */
    equipArmor(armorName) {
        if (!this.gameLogic?.equipArmor(armorName)) return;
        
        // Refresh displays
        this.populateArmor();
        this.populateEquippedArmor();
        this.setupDragAndDrop();
        this.playEquipSound();
    }

    /**
     * Equip a consumable for quick use
     * @param {string} consumableName - Name of the consumable to equip
     */
    equipConsumable(consumableName) {
        if (!this.gameLogic?.inventory || !this.gameLogic?.consumables?.[consumableName]) return;
        
        // Check if we have this consumable
        const hasConsumable = (consumableName === 'Health Potion' && this.gameLogic.inventory.healthPotions > 0) ||
                             (consumableName === 'Mana Potion' && (this.gameLogic.inventory.manaPotions || 0) > 0);
        
        if (!hasConsumable) return;
        
        this.gameLogic.inventory.equippedConsumable = consumableName;
        this.populateEquippedConsumable();
        this.setupDragAndDrop();
        this.playEquipSound();
    }

    /**
     * Unequip armor from a specific slot
     * @param {string} slotType - Type of armor slot (head, chest, legs)
     */
    unequipArmor(slotType) {
        if (!this.gameLogic?.inventory) return;
        
        this.gameLogic.inventory.equippedArmor[slotType] = null;
        this.populateArmor();
        this.populateEquippedArmor();
        this.setupDragAndDrop();
        this.playEquipSound();
    }

    /**
     * Unequip the current consumable
     */
    unequipConsumable() {
        if (!this.gameLogic?.inventory) return;
        
        this.gameLogic.inventory.equippedConsumable = null;
        this.populateEquippedConsumable();
        this.setupDragAndDrop();
        this.playEquipSound();
    }

    /**
     * Unequip the current weapon
     */
    unequipWeapon() {
        if (!this.gameLogic?.inventory) return;
        
        this.gameLogic.inventory.equippedWeapon = null;
        this.updateEquippedDisplay();
        this.populateWeapons();
        this.populateEquippedWeapon();
        this.setupDragAndDrop();
        this.playEquipSound();
    }

    /**
     * Unequip the current potion (legacy method, use unequipConsumable instead)
     */
    unequipPotion() {
        this.unequipConsumable();
    }
}

// Export for module usage
export default EquipmentModal;
