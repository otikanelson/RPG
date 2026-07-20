/**
 * ShopModal.js
 * Renders and drives tabbed navigation interactions for shop items.
 */
import shopManager, { MERCHANT_STOCK, ITEM_REGISTRY } from '../managers/ShopManager.js';

class ShopModal {
    constructor() {
        this.activeMerchant = null;
        this.activeTab = 'all';
        this.initDOM();
    }

    initDOM() {
        // Construct Modal elements if missing
        if (document.getElementById('shopModal')) return;

        const modalHtml = `
            <div id="shopModal" class="shop-modal-overlay" style="display: none;">
                <div class="shop-modal-container">
                    <div class="shop-header">
                        <div class="shop-title-area">
                            <h2 id="shopkeeperName">Merchant's Cache</h2>
                            <p id="shopkeeperDialogue" class="shop-bubble">...</p>
                        </div>
                        <button id="closeShopBtn" class="shop-close-x">&times;</button>
                    </div>
                    
                    <div class="shop-navigation-tabs">
                        <button class="shop-tab active" data-tab="all">All Items</button>
                        <button class="shop-tab" data-tab="weapon">Weapons ⚔️</button>
                        <button class="shop-tab" data-tab="armor">Armor 🛡️</button>
                        <button class="shop-tab" data-tab="consumable">Potions 🧪</button>
                    </div>

                    <div id="shopItemGrid" class="shop-items-grid"></div>

                    <div class="shop-footer-bar">
                        <div class="player-gold-display">Your Wallet: <span id="shopPlayerGold">0</span> Gold</div>
                        <div id="shopFeedbackMessage" class="shop-feedback"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('closeShopBtn').addEventListener('click', () => this.close());
        
        // Tab Filtering Listeners
        const tabs = document.querySelectorAll('.shop-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.activeTab = e.target.getAttribute('data-tab');
                this.renderCatalog();
            });
        });
    }

    open(merchantKey) {
        const merchantProfile = MERCHANT_STOCK[merchantKey];
        if (!merchantProfile) return console.error(`Merchant ID matching "${merchantKey}" not verified.`);

        this.activeMerchant = merchantKey;
        document.getElementById('shopkeeperName').textContent = merchantKey.replace(/([A-Z])/g, ' $1').trim();
        document.getElementById('shopkeeperDialogue').textContent = `"${merchantProfile.greeting}"`;
        
        // Sync player gold stat indicators
        if (window.gameLogic && window.gameLogic.stats) {
            document.getElementById('shopPlayerGold').textContent = window.gameLogic.stats.gold;
        }

        document.getElementById('shopFeedbackMessage').textContent = '';
        document.getElementById('shopModal').style.display = 'flex';
        this.renderCatalog();
    }

    renderCatalog() {
        const grid = document.getElementById('shopItemGrid');
        grid.innerHTML = '';
        
        const stockKeys = MERCHANT_STOCK[this.activeMerchant].items;

        stockKeys.forEach(key => {
            const item = ITEM_REGISTRY[key];
            if (!item) return;

            // Type filter verification
            if (this.activeTab !== 'all' && item.type !== this.activeTab) return;

            const card = document.createElement('div');
            card.className = 'shop-item-card';
            
            let structuralStat = item.attack ? `Atk: +${item.attack}` : item.defense ? `Def: +${item.defense}` : `Restores: ${item.value}`;
            
            card.innerHTML = `
                <div class="shop-item-details">
                    <div class="shop-item-title">${item.name}</div>
                    <div class="shop-item-stat-badge">${structuralStat}</div>
                    <div class="shop-item-description">${item.description}</div>
                </div>
                <button class="shop-buy-action-btn" data-key="${key}">
                    Buy for <span>${item.cost}g</span>
                </button>
            `;

            // Setup transaction handling trigger
            card.querySelector('.shop-buy-action-btn').addEventListener('click', (e) => {
                const targetKey = e.currentTarget.getAttribute('data-key');
                this.executeTransaction(targetKey);
            });

            grid.appendChild(card);
        });
    }

    executeTransaction(key) {
        const feedback = document.getElementById('shopFeedbackMessage');
        const transaction = shopManager.purchaseItem(key);

        if (transaction.success) {
            feedback.style.color = '#4caf50';
            feedback.textContent = `Purchased ${transaction.item.name} successfully!`;
            document.getElementById('shopPlayerGold').textContent = window.gameLogic.stats.gold;
        } else {
            feedback.style.color = '#f44336';
            feedback.textContent = transaction.error;
        }
    }

    close() {
        document.getElementById('shopModal').style.display = 'none';
        // Auto-refresh layout stat structures on close
        if (window.updatePlayerStatsDisplay) window.updatePlayerStatsDisplay();
    }
}

const shopModalInstance = new ShopModal();
window.shopModalInstance = shopModalInstance;
export default shopModalInstance;