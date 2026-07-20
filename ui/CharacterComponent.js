/**
 * CharacterComponent.js - Individual Character Component with Stats
 * Creates reusable character display components with stats
 */
import { getImagePath, VISUAL_ASSETS } from '../systems/VisualAssets.js';

class CharacterComponent {
    constructor(characterData, gameLogic, battleManager) {
        this.characterData = characterData;
        this.gameLogic = gameLogic;
        this.battleManager = battleManager;
        this.container = null;
        this.statsVisible = true;
        
        this.createComponent();
    }

    createComponent() {
        this.container = document.createElement('div');
        this.container.className = 'character-component';
        this.container.innerHTML = this.generateHTML();
        
        this.bindEvents();
        this.updateStats();
    }

    generateHTML() {
        const { name, image, description, level, isPlayer, bio } = this.characterData;
        const hasStats = this.shouldShowStats();
        
        return `
            <div class="character-header">
                <h3 class="character-name">${name}</h3>
                <button class="character-info-btn" data-action="toggleDescription">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" class="info-icon">
                        <path fill="#1c2b45" d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-192-32 0c-17.7 0-32-14.3-32-32z"/>
                    </svg>
                </button>
            </div>

            <div class="character-description" style="display: none;">
                <p class="character-description-text">${description}</p>
                <p class="character-bio">${bio || ''}</p>
            </div>

            <div class="character-display">
                <div class="character-image-container${hasStats ? '' : ' no-stats'}">
                    <img class="character-image" src="${image}" alt="${name}">
                </div>

                ${hasStats ? this.generateStatsHTML() : ''}
            </div>
        `;
    }

    generateStatsHTML() {
        const { isPlayer, level } = this.characterData;
        
        return `
            <div class="character-stats-panel">
                <div class="stats-content">
                    ${this.generateLevelStat()}
                    ${isPlayer ? this.generateHealthStat() : this.generateMonsterHealthStat()}
                    ${isPlayer ? this.generateGoldStat() : ''}
                </div>
            </div>
        `;
    }

    generateLevelStat() {
        if (this.characterData.isPlayer) {
            return `
                <div class="stat-row level-row">
                    <span class="stat-label">Level:</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar">
                            <div class="stat-bar-fill" data-stat="level"></div>
                        </div>
                    </div>
                    <span class="stat-value" data-value="level">1</span>
                </div>
            `;
        } else if (this.isMonster()) {
            // For monsters, show level from monster data
            const monsterData = this.getMonsterData();
            return `
                <div class="stat-row level-row">
                    <span class="stat-label">Level:</span>
                    <span class="stat-text-value">${monsterData ? monsterData.level : this.characterData.level}</span>
                </div>
            `;
        } else {
            // For NPCs, show rank/level from character data
            return `
                <div class="stat-row level-row">
                    <span class="stat-label">Rank:</span>
                    <span class="stat-text-value rank-value">${this.characterData.level}</span>
                </div>
            `;
        }
    }

    generateHealthStat() {
        return `
            <div class="stat-row health-row">
                <span class="stat-label">Health:</span>
                <div class="stat-bar-container">
                    <div class="stat-bar health-bar">
                        <div class="stat-bar-fill health-fill" data-stat="health"></div>
                    </div>
                </div>
                <span class="stat-value health-value" data-value="health">100</span>
            </div>
        `;
    }

    generateMonsterHealthStat() {
        if (!this.isMonster()) return '';
        
        const monsterData = this.getMonsterData();
        if (!monsterData) return '';

        return `
            <div class="stat-row health-row">
                <span class="stat-label">Health:</span>
                <div class="stat-bar-container">
                    <div class="stat-bar health-bar">
                        <div class="stat-bar-fill health-fill" style="width: 100%"></div>
                    </div>
                </div>
                <span class="stat-value health-value">${monsterData.maxHealth}</span>
            </div>
        `;
    }

    generateGoldStat() {
        return `
            <div class="stat-row gold-row">
                <span class="stat-label">Gold:</span>
                <div class="gold-display">
                    <img src="${getImagePath('UI', 'GOLD_ICON')}" alt="Gold" class="gold-icon">
                    <span class="stat-value gold-value" data-value="gold">50</span>
                </div>
            </div>
        `;
    }

    generateNPCLevelOnlyStat() {
        return `
            <div class="stat-row npc-level-row">
                <span class="stat-label">Rank:</span>
                <span class="stat-text-value rank-value">${this.characterData.level}</span>
            </div>
        `;
    }

    shouldShowStats() {
        // Show stats for all characters except pure location displays
        return this.statsVisible && this.characterData.name !== undefined;
    }

    isMonster() {
        const monsterNames = ['ShadowBeast', 'BloodBeast', 'HellDogs', 'ShardWarden'];
        return monsterNames.some(monster => 
            this.characterData.name.includes(monster) || 
            this.characterData.name.replace(/\s+/g, '').includes(monster.replace(/\s+/g, ''))
        );
    }

    getMonsterData() {
        if (!this.battleManager) return null;
        
        // Map character names to battle system monster keys
        const monsterBattleKeys = {
            'ShadowBeast': 'Shadow Beast',
            'Shadow Beast': 'Shadow Beast',
            'ShardWarden': 'Shard Warden',  
            'Shard Warden': 'Shard Warden',
            'BloodBeast': 'Slime Beast',
            'Blood Beast': 'Slime Beast',
            'HellDogs': 'Slime Beast',
            'Hell Dogs': 'Slime Beast'
        };

        const normalizedName = this.characterData.name.replace(/\s+/g, '');
        for (const [key, battleKey] of Object.entries(monsterBattleKeys)) {
            if (normalizedName.includes(key.replace(/\s+/g, '')) || this.characterData.name === battleKey) {
                return this.battleManager.monsters?.[battleKey] || null;
            }
        }
        return null;
    }

    bindEvents() {
        const infoBtn = this.container.querySelector('.character-info-btn');
        if (infoBtn) {
            infoBtn.addEventListener('click', () => this.toggleDescription());
        }
    }

    toggleDescription() {
        const description = this.container.querySelector('.character-description');
        const image = this.container.querySelector('.character-image-container');
        
        if (description && image) {
            const isVisible = description.style.display !== 'none';
            description.style.display = isVisible ? 'none' : 'block';
            image.style.display = isVisible ? 'block' : 'none';
        }
    }

    updateStats() {
        if (!this.shouldShowStats()) return;

        if (this.characterData.isPlayer && this.gameLogic?.stats) {
            this.updatePlayerStats();
        } else if (this.isMonster()) {
            this.updateMonsterStats();
        }
    }

    updatePlayerStats() {
        const { health, maxHealth, level, xp, gold } = this.gameLogic.stats;
        const xpPerLevel = 100;
        const xpInCurrentLevel = xp % xpPerLevel;
        const levelPercent = (xpInCurrentLevel / xpPerLevel) * 100;
        const healthPercent = (health / maxHealth) * 100;

        // Update level
        const levelFill = this.container.querySelector('[data-stat="level"]');
        const levelValue = this.container.querySelector('[data-value="level"]');
        if (levelFill) levelFill.style.width = `${levelPercent}%`;
        if (levelValue) levelValue.textContent = level.toString();

        // Update health
        const healthFill = this.container.querySelector('[data-stat="health"]');
        const healthValue = this.container.querySelector('[data-value="health"]');
        if (healthFill) healthFill.style.width = `${healthPercent}%`;
        if (healthValue) healthValue.textContent = health.toString();

        // Update gold
        const goldValue = this.container.querySelector('[data-value="gold"]');
        if (goldValue) goldValue.textContent = gold.toString();
    }

    updateMonsterStats() {
        const monsterData = this.getMonsterData();
        if (!monsterData) return;

        const healthValue = this.container.querySelector('.health-value');
        const levelValue = this.container.querySelector('.stat-text-value');
        
        if (healthValue) healthValue.textContent = monsterData.maxHealth.toString();
        if (levelValue) levelValue.textContent = monsterData.level.toString();
    }

    setStatsVisibility(visible) {
        this.statsVisible = visible;
        const statsPanel = this.container.querySelector('.character-stats-panel');
        if (statsPanel) {
            statsPanel.style.display = visible ? 'block' : 'none';
        }
    }

    getElement() {
        return this.container;
    }

    refresh() {
        this.updateStats();
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export default CharacterComponent;