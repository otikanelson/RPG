// EquipmentModal.js - Handles equipment display and modal interactions
import gameAudio from '../systems/GameAudio.js';
import { getImagePath, VISUAL_ASSETS } from '../systems/VisualAssets.js';

class EquipmentModal {
    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.modal = document.getElementById('equipmentModal');
        this.equippedBox = document.getElementById('equippedBox');
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

        const equippedWeaponKey = this.gameLogic.inventory.equippedWeapon;
        const equippedConsumableKey = this.gameLogic.inventory.equippedConsumable;

        // Import getItemFromRegistry to look up item data
        import('../data/ItemRegistry.js').then(module => {
            const { getItemFromRegistry } = module;
            
            let contentHTML = '';

            // Get weapon data
            if (equippedWeaponKey) {
                const weapon = getItemFromRegistry(equippedWeaponKey);
                if (weapon) {
                    contentHTML += `
                        <div class="equipped-item-display">
                            ${weapon.image ? `<img src="${weapon.image}" alt="${weapon.name}" class="equipped-weapon-img">` : ''}
                            <div class="equipped-weapon-name">${weapon.name}</div>
                        </div>
                    `;
                }
            }

            // Get consumable data
            if (equippedConsumableKey) {
                const consumable = getItemFromRegistry(equippedConsumableKey);
                const potions = this.gameLogic.inventory.potions || {};
                const count = potions[equippedConsumableKey] || 0;
                
                if (consumable && count > 0) {
                    contentHTML += `
                        <div class="equipped-item-display">
                            ${consumable.image ? `<img src="${consumable.image}" alt="${consumable.name}" class="equipped-potion-img">` : ''}
                            <div class="equipped-potion-count">x${count}</div>
                        </div>
                    `;
                }
            }

            // Show placeholder if nothing equipped
            if (!contentHTML) {
                contentHTML = '<span class="equipped-placeholder">Click to view equipment</span>';
            }

            this.equippedBox.innerHTML = contentHTML;
        });
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
            
            // Get weapons array from inventory
            const weaponsArray = this.gameLogic?.inventory?.weapons || [];
            this.populateWeapons(weaponsArray);
            
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
    populateWeapons(weaponsArray = []) {
        const grid = document.getElementById('weaponsGrid');
        if (!grid) return;
        grid.innerHTML = '';

        // If no weapons provided, get from gameLogic
        if (!weaponsArray || weaponsArray.length === 0) {
            weaponsArray = this.gameLogic?.inventory?.weapons || [];
        }

        if (weaponsArray.length === 0) {
            grid.innerHTML = '<div class="equipment-empty">No weapons in inventory</div>';
            return;
        }

        // Import getItemFromRegistry function
        import('../data/ItemRegistry.js').then(module => {
            const { getItemFromRegistry } = module;
            
            weaponsArray.forEach(itemKey => {
                const itemData = getItemFromRegistry(itemKey);
                
                if (!itemData) {
                    console.warn(`Weapon ${itemKey} not found in registry`);
                    return;
                }

                const isEquipped = this.gameLogic?.inventory?.equippedWeapon === itemKey;

                const itemEl = document.createElement('div');
                itemEl.className = `equipment-item ${isEquipped ? 'equipped' : ''}`;
                itemEl.draggable = true;
                itemEl.dataset.weaponName = itemKey;
                itemEl.dataset.type = 'weapon';
                
                itemEl.innerHTML = `
                    ${itemData.image ? `<img src="${itemData.image}" alt="${itemData.name}" class="equipment-item-img">` : ''}
                    <div class="equipment-item-name">${itemData.name}</div>
                    <div class="equipment-item-stats">
                        <div class="equipment-item-damage">⚔ ${itemData.damage || 0}</div>
                        ${isEquipped ? '<div style="color: #b8860b; font-weight: bold; margin-top: 2px;">✓</div>' : ''}
                    </div>
                `;
                
                itemEl.title = itemData.description || '';
                grid.appendChild(itemEl);
            });
        });
    }

    /**
     * Populate the armor grid
     */
    populateArmor() {
        const armorGrid = document.getElementById('armorGrid');
        if (!armorGrid || !this.gameLogic || !this.gameLogic.inventory) return;

        armorGrid.innerHTML = '';

        const ownedArmor = this.gameLogic.inventory.special_gear || [];
        const equippedArmor = this.gameLogic.inventory.equippedArmor || {};

        if (ownedArmor.length === 0) {
            armorGrid.innerHTML = '<div class="equipment-empty">No armor in inventory</div>';
            return;
        }

        // Import getItemFromRegistry to look up armor data
        import('../data/ItemRegistry.js').then(module => {
            const { getItemFromRegistry } = module;
            
            ownedArmor.forEach(armorKey => {
                const armor = getItemFromRegistry(armorKey);
                if (!armor) {
                    console.warn(`Armor ${armorKey} not found in registry`);
                    return;
                }

                const isEquipped = Object.values(equippedArmor).includes(armorKey);

                const armorCard = document.createElement('div');
                armorCard.className = `equipment-item ${isEquipped ? 'equipped' : ''}`;
                armorCard.draggable = true;
                armorCard.dataset.armorName = armorKey;
                armorCard.dataset.type = 'armor';
                armorCard.dataset.armorType = armor.slot || 'chest';

                armorCard.innerHTML = `
                    ${armor.image ? `<img src="${armor.image}" alt="${armor.name}" class="equipment-item-img">` : ''}
                    <div class="equipment-item-name">${armor.name}</div>
                    <div class="equipment-item-stats">
                        <div class="equipment-item-defense">🛡 ${armor.defense || 0}</div>
                        ${isEquipped ? '<div style="color: #b8860b; font-weight: bold; margin-top: 2px;">✓</div>' : ''}
                    </div>
                `;

                armorCard.title = armor.description || '';
                armorGrid.appendChild(armorCard);
            });
        });
    }

    /**
     * Populate the consumables grid
     */
    populateConsumables() {
        const consumablesGrid = document.getElementById('consumablesGrid');
        if (!consumablesGrid || !this.gameLogic || !this.gameLogic.inventory) return;

        consumablesGrid.innerHTML = '';

        // Get potions from new inventory structure
        const potions = this.gameLogic.inventory.potions || {};
        
        // Check if we have any potions
        const totalPotions = Object.values(potions).reduce((sum, count) => sum + count, 0);
        
        if (totalPotions === 0) {
            consumablesGrid.innerHTML = '<div class="equipment-empty">No consumables in inventory</div>';
            return;
        }

        // Import getItemFromRegistry to look up potion data
        import('../data/ItemRegistry.js').then(module => {
            const { getItemFromRegistry } = module;
            
            // Display each potion type that the player has
            Object.entries(potions).forEach(([potionKey, count]) => {
                if (count <= 0) return;
                
                const potion = getItemFromRegistry(potionKey);
                if (!potion) {
                    console.warn(`Potion ${potionKey} not found in registry`);
                    return;
                }

                const potionCard = document.createElement('div');
                potionCard.className = 'equipment-item';
                potionCard.draggable = true;
                potionCard.dataset.consumableName = potionKey;
                potionCard.dataset.type = 'consumable';

                let effectDisplay = '';
                if (potion.effect?.type === 'heal') {
                    effectDisplay = `<div style="color: #90ee90; font-weight: bold;">❤ +${potion.effect.value}</div>`;
                } else if (potion.effect?.type === 'mana') {
                    effectDisplay = `<div style="color: #87ceeb; font-weight: bold;">⚡ +${potion.effect.value}</div>`;
                }

                potionCard.innerHTML = `
                    ${potion.image ? `<img src="${potion.image}" alt="${potion.name}" class="equipment-item-img">` : ''}
                    <div class="equipment-item-name">${potion.name}</div>
                    <div class="equipment-item-stats">
                        ${effectDisplay}
                        <div style="color: #f5deb3; margin-top: 2px;">x${count}</div>
                    </div>
                `;
                potionCard.title = potion.description || '';
                consumablesGrid.appendChild(potionCard);
            });
        });
    }

    /**
     * Populate the equipped weapon section
     */
    populateEquippedWeapon() {
        const equippedWeaponZone = document.getElementById('equippedWeaponZone');
        if (!equippedWeaponZone || !this.gameLogic || !this.gameLogic.inventory) return;

        equippedWeaponZone.innerHTML = '';

        const equippedWeaponKey = this.gameLogic.inventory.equippedWeapon;

        if (!equippedWeaponKey) {
            equippedWeaponZone.innerHTML = '<div class="equipment-empty">Drag weapon here to equip</div>';
            return;
        }

        // Import getItemFromRegistry to look up weapon data
        import('../data/ItemRegistry.js').then(module => {
            const { getItemFromRegistry } = module;
            const weapon = getItemFromRegistry(equippedWeaponKey);
            
            if (!weapon) {
                equippedWeaponZone.innerHTML = '<div class="equipment-empty">Drag weapon here to equip</div>';
                return;
            }

            const equippedCard = document.createElement('div');
            equippedCard.className = 'equipment-item equipped';
            equippedCard.draggable = true;
            equippedCard.dataset.weaponName = equippedWeaponKey;
            equippedCard.dataset.type = 'weapon';

            equippedCard.innerHTML = `
                ${weapon.image ? `<img src="${weapon.image}" alt="${weapon.name}" class="equipment-item-img">` : ''}
                <div class="equipment-item-name">${weapon.name}</div>
                <div class="equipment-item-stats">
                    <div class="equipment-item-damage">⚔ ${weapon.damage || 0}</div>
                    <div style="color: #b8860b; font-weight: bold; margin-top: 2px;">✓</div>
                </div>
            `;

            equippedWeaponZone.appendChild(equippedCard);
        });
    }

    /**
     * Populate the equipped armor section
     */
    populateEquippedArmor() {
        const equippedArmorZone = document.getElementById('equippedArmorZone');
        if (!equippedArmorZone || !this.gameLogic || !this.gameLogic.inventory) return;

        equippedArmorZone.innerHTML = '';

        const equippedArmor = this.gameLogic.inventory.equippedArmor || {};

        // Create slots for different armor types
        const armorSlots = [
            { type: 'head', label: 'Head' },
            { type: 'chest', label: 'Chest' },
            { type: 'accessory', label: 'Accessory' }
        ];

        // Import getItemFromRegistry to look up armor data
        import('../data/ItemRegistry.js').then(module => {
            const { getItemFromRegistry } = module;
            
            armorSlots.forEach(slot => {
                const slotDiv = document.createElement('div');
                slotDiv.className = 'equipment-armor-slot';
                slotDiv.dataset.armorSlot = slot.type;

                const equippedItemKey = equippedArmor[slot.type];

                if (equippedItemKey) {
                    const armor = getItemFromRegistry(equippedItemKey);
                    if (armor) {
                        slotDiv.innerHTML = `
                            <div class="equipment-item equipped" draggable="true" data-armor-name="${equippedItemKey}" data-type="armor">
                                ${armor.image ? `<img src="${armor.image}" alt="${armor.name}" class="equipment-item-img">` : ''}
                                <div class="equipment-item-name">${armor.name}</div>
                                <div class="equipment-item-stats">
                                    <div class="equipment-item-defense">🛡 ${armor.defense || 0}</div>
                                    <div style="color: #b8860b; font-weight: bold; margin-top: 2px;">✓</div>
                                </div>
                            </div>
                        `;
                    } else {
                        slotDiv.innerHTML = `
                            <div class="equipment-empty armor-slot-empty">
                                <div class="armor-slot-label">${slot.label}</div>
                                <div>Empty</div>
                            </div>
                        `;
                    }
                } else {
                    slotDiv.innerHTML = `
                        <div class="equipment-empty armor-slot-empty">
                            <div class="armor-slot-label">${slot.label}</div>
                            <div>Empty</div>
                        </div>
                    `;
                }

                equippedArmorZone.appendChild(slotDiv);
            });
        });
    }

    /**
     * Populate the equipped consumable section
     */
    populateEquippedConsumable() {
        const equippedConsumableZone = document.getElementById('equippedConsumableZone');
        if (!equippedConsumableZone || !this.gameLogic || !this.gameLogic.inventory) return;

        equippedConsumableZone.innerHTML = '';

        const equippedConsumableKey = this.gameLogic.inventory.equippedConsumable;

        if (!equippedConsumableKey) {
            equippedConsumableZone.innerHTML = '<div class="equipment-empty">Drag consumable here for quick use</div>';
            return;
        }

        // Import getItemFromRegistry to look up consumable data
        import('../data/ItemRegistry.js').then(module => {
            const { getItemFromRegistry } = module;
            const consumable = getItemFromRegistry(equippedConsumableKey);
            
            if (!consumable) {
                equippedConsumableZone.innerHTML = '<div class="equipment-empty">Drag consumable here for quick use</div>';
                return;
            }

            const equippedCard = document.createElement('div');
            equippedCard.className = 'equipment-item equipped';
            equippedCard.draggable = true;
            equippedCard.dataset.consumableName = equippedConsumableKey;
            equippedCard.dataset.type = 'consumable';

            let statDisplay = '';
            if (consumable.effect?.type === 'heal') {
                statDisplay = `<div style="color: #90ee90; font-weight: bold;">❤ +${consumable.effect.value}</div>`;
            } else if (consumable.effect?.type === 'mana') {
                statDisplay = `<div style="color: #87ceeb; font-weight: bold;">⚡ +${consumable.effect.value}</div>`;
            }

            equippedCard.innerHTML = `
                ${consumable.image ? `<img src="${consumable.image}" alt="${consumable.name}" class="equipment-item-img">` : ''}
                <div class="equipment-item-name">${consumable.name}</div>
                <div class="equipment-item-stats">
                    ${statDisplay}
                    <div style="color: #b8860b; font-weight: bold; margin-top: 2px;">✓</div>
                </div>
            `;

            equippedConsumableZone.appendChild(equippedCard);
        });
    }

    /**
     * Equip a weapon
     * @param {string} weaponName - Name of the weapon to equip
     */
    equipWeapon(weaponName) {
        if (!this.gameLogic?.equipWeapon(weaponName)) return;

        // Update displays
        const weaponsArray = this.gameLogic?.inventory?.weapons || [];
        this.populateWeapons(weaponsArray);
        this.populateEquippedWeapon();
        this.setupDragAndDrop();

        // Play sound effect
        this.playEquipSound();
    }

    /**
     * Play equipment sound effect using centralized audio system
     */
    playEquipSound() {
        gameAudio.playSFX('button_click');
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        console.log('Setting up drag and drop...');
        
        // Get all drop zones (fresh query)
        const zones = [
            { element: document.getElementById('inventoryWeaponsZone'), id: 'inventoryWeaponsZone' },
            { element: document.getElementById('inventoryArmorZone'), id: 'inventoryArmorZone' },
            { element: document.getElementById('inventoryConsumablesZone'), id: 'inventoryConsumablesZone' },
            { element: document.getElementById('equippedWeaponZone'), id: 'equippedWeaponZone' },
            { element: document.getElementById('equippedArmorZone'), id: 'equippedArmorZone' },
            { element: document.getElementById('equippedConsumableZone'), id: 'equippedConsumableZone' }
        ].filter(zone => zone.element !== null);

        console.log('Found zones:', zones.map(z => z.id));

        // Setup drop zones
        zones.forEach(({ element, id }) => {
            // Create bound handlers that capture correct zone reference
            const dragOverHandler = (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                element.classList.add('drag-over');
            };

            const dragLeaveHandler = (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                
                if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
                    element.classList.remove('drag-over');
                }
            };

            const dropHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                element.classList.remove('drag-over');

                const itemType = e.dataTransfer.getData('type');
                const itemName = e.dataTransfer.getData('itemName');
                const armorType = e.dataTransfer.getData('armorType');

                console.log('Drop event:', { 
                    itemType, 
                    itemName, 
                    armorType,
                    zone: id
                });

                if (!itemName || !itemType) {
                    console.warn('Drop ignored: missing itemName or itemType');
                    return;
                }

                // Handle weapon equipping
                if (itemType === 'weapon' && id === 'equippedWeaponZone') {
                    console.log('Equipping weapon:', itemName);
                    this.equipWeapon(itemName);
                }

                // Handle armor equipping
                if (itemType === 'armor' && id === 'equippedArmorZone') {
                    console.log('Equipping armor:', itemName);
                    this.equipArmor(itemName);
                }

                // Handle consumable equipping
                if (itemType === 'consumable' && id === 'equippedConsumableZone') {
                    console.log('Equipping consumable:', itemName);
                    this.equipConsumable(itemName);
                }
            };

            // Remove all existing listeners by cloning (clean slate)
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Get the fresh element reference
            const freshElement = document.getElementById(id);
            
            // Add new listeners to fresh element
            freshElement.addEventListener('dragover', dragOverHandler);
            freshElement.addEventListener('dragleave', dragLeaveHandler);
            freshElement.addEventListener('drop', dropHandler);
        });

        // Small delay to ensure DOM is fully updated
        setTimeout(() => {
            // Setup drag start for all draggable items
            const allDraggableItems = this.modal.querySelectorAll('.equipment-item[draggable="true"]');
            console.log('Found draggable items:', allDraggableItems.length);
            
            allDraggableItems.forEach((item, index) => {
                const dragStartHandler = (e) => {
                    const itemName = item.dataset.weaponName || item.dataset.armorName || item.dataset.consumableName || '';
                    const itemType = item.dataset.type || '';
                    const armorType = item.dataset.armorType || '';

                    console.log('Drag start:', { 
                        itemName, 
                        itemType, 
                        armorType
                    });

                    if (!itemName || !itemType) {
                        console.error('Cannot drag: missing itemName or itemType');
                        e.preventDefault();
                        return;
                    }

                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', itemName);
                    e.dataTransfer.setData('itemName', itemName);
                    e.dataTransfer.setData('type', itemType);
                    if (armorType) {
                        e.dataTransfer.setData('armorType', armorType);
                    }
                    
                    item.style.opacity = '0.5';
                };

                const dragEndHandler = (e) => {
                    item.style.opacity = '1';
                    
                    // Remove drag-over from all zones
                    document.querySelectorAll('.drag-over').forEach(zone => {
                        zone.classList.remove('drag-over');
                    });
                };

                item.addEventListener('dragstart', dragStartHandler);
                item.addEventListener('dragend', dragEndHandler);
            });
            
            console.log('Drag and drop setup complete');
        }, 50);
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
     * @param {string} consumableKey - Key of the consumable to equip
     */
    equipConsumable(consumableKey) {
        if (!this.gameLogic?.inventory) return;

        // Check if we have this consumable
        const potions = this.gameLogic.inventory.potions || {};
        const hasConsumable = (potions[consumableKey] || 0) > 0;

        if (!hasConsumable) return;

        this.gameLogic.inventory.equippedConsumable = consumableKey;
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
     * Unequip all armor pieces
     */
    unequipAllArmor() {
        if (!this.gameLogic?.inventory) return;

        this.gameLogic.inventory.equippedArmor = {
            head: null,
            chest: null,
            accessory: null
        };
        
        this.populateArmor();
        this.populateEquippedArmor();
        this.setupDragAndDrop();
        this.playEquipSound();
    }

    /**
     * Unequip current weapon
     */
    unequipWeapon() {
        if (!this.gameLogic?.inventory) return;

        this.gameLogic.inventory.equippedWeapon = null;
        
        const weaponsArray = this.gameLogic?.inventory?.weapons || [];
        this.populateWeapons(weaponsArray);
        this.populateEquippedWeapon();
        this.setupDragAndDrop();
        this.playEquipSound();
    }

    /**
     * Unequip the current consumable
     */
    unequipConsumable() {
        if (!this.gameLogic?.inventory) return;

        this.gameLogic.inventory.equippedConsumable = null;
        this.populateConsumables();
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
        
        const weaponsArray = this.gameLogic?.inventory?.weapons || [];
        this.populateWeapons(weaponsArray);
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
