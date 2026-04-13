// Tactical Combat Demo - Chess-like Battle System
class TacticalCombatDemo {
    constructor() {
        this.gameState = {
            turn: 1,
            playerHealth: 100,
            monsterHealth: 100,
            playerPosition: 'NEUTRAL',
            monsterPosition: 'AGGRESSIVE',
            momentum: 'CONTESTED', // CONTROLLING, CONTESTED, PRESSURED
            momentumValue: 50, // 0-100, 50 is neutral
            
            // Monster AI state
            monsterAgenda: 'STUDY_MODE',
            agendaTurns: 0,
            agendaProgress: 0,
            
            // Pattern learning
            playerPatterns: [],
            learnedPatterns: [],
            
            // Information warfare
            telegraphedAction: null,
            hiddenPlan: null,
            
            // Combat history
            battleLog: [],
            actionHistory: []
        };
        
        this.positions = {
            AGGRESSIVE: {
                name: 'Aggressive',
                description: 'Close range - High damage potential, vulnerable to counters',
                advantages: ['High damage', 'Can pressure opponent', 'Breaks defensive stances'],
                disadvantages: ['Vulnerable to counters', 'Predictable', 'Energy intensive']
            },
            DEFENSIVE: {
                name: 'Defensive', 
                description: 'Mid range - Safe, gains information about opponent',
                advantages: ['Safe from most attacks', 'Gains intel', 'Builds focus'],
                disadvantages: ['Limited damage', 'Can be overwhelmed', 'Reactive only']
            },
            NEUTRAL: {
                name: 'Neutral',
                description: 'Balanced - Most options available, no special advantages',
                advantages: ['Flexible', 'Unpredictable', 'Can shift anywhere'],
                disadvantages: ['No special bonuses', 'Jack of all trades', 'Master of none']
            },
            EVASIVE: {
                name: 'Evasive',
                description: 'Long range - Hard to hit, limited attack options', 
                advantages: ['Hard to hit', 'Can scout patterns', 'Mobility focused'],
                disadvantages: ['Limited attacks', 'Can be cornered', 'Low damage']
            }
        };
        
        this.monsterAgendas = {
            STUDY_MODE: {
                name: 'Studying',
                description: 'Learning your patterns',
                duration: 3,
                behavior: 'defensive',
                telegraph: 'The beast watches you intently, red eyes tracking every movement...'
            },
            HUNT_MODE: {
                name: 'Hunting', 
                description: 'Trying to get behind you',
                duration: 2,
                behavior: 'positioning',
                telegraph: 'The creature circles you, looking for an opening...'
            },
            PHASE_MODE: {
                name: 'Phase Preparation',
                description: 'Building up for teleport attack',
                duration: 3,
                behavior: 'charging',
                telegraph: 'The beast\'s form flickers and wavers, becoming less solid...'
            },
            FRENZY_MODE: {
                name: 'Frenzied Assault',
                description: 'All-out attack mode',
                duration: 2,
                behavior: 'aggressive',
                telegraph: 'The shadow beast\'s eyes blaze with fury as it prepares to strike!'
            }
        };
        
        this.initializeUI();
        this.updateDisplay();
        this.generateActions();
    }
    
    initializeUI() {
        // Initialize battle log
        this.addToBattleLog("The Shadow Beast emerges from the darkness, its form shifting and coiling...");
        this.addToBattleLog("You sense malevolent intelligence in its red eyes as it sizes you up.");
        this.addToBattleLog("<strong>Combat begins!</strong>");
    }
    
    addToBattleLog(message) {
        const log = document.getElementById('battleLog');
        const div = document.createElement('div');
        div.innerHTML = message;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    }
    
    updateDisplay() {
        // Update turn counter
        document.getElementById('turnNumber').textContent = this.gameState.turn;
        
        // Update positions
        document.getElementById('playerPosition').textContent = this.gameState.playerPosition;
        document.getElementById('monsterPosition').textContent = this.gameState.monsterPosition;
        
        // Update position indicators
        const playerPosEl = document.getElementById('playerPos');
        const monsterPosEl = document.getElementById('monsterPos');
        
        playerPosEl.className = 'position-indicator active';
        monsterPosEl.className = 'position-indicator inactive';
        
        // Update momentum
        this.updateMomentum();
        
        // Update health
        this.updateHealth();
        
        // Update agenda hint
        this.updateAgendaHint();
        
        // Update patterns
        this.updatePatterns();
        
        // Update telegraph
        this.updateTelegraph();
    }
    
    updateMomentum() {
        const fill = document.getElementById('momentumFill');
        const text = document.getElementById('momentumText');
        
        fill.style.width = this.gameState.momentumValue + '%';
        
        if (this.gameState.momentumValue > 70) {
            this.gameState.momentum = 'CONTROLLING';
            fill.className = 'momentum-fill momentum-controlling';
            text.textContent = 'CONTROLLING - You dictate the flow';
        } else if (this.gameState.momentumValue < 30) {
            this.gameState.momentum = 'PRESSURED';
            fill.className = 'momentum-fill momentum-pressured';
            text.textContent = 'PRESSURED - Monster controls the fight';
        } else {
            this.gameState.momentum = 'CONTESTED';
            fill.className = 'momentum-fill momentum-contested';
            text.textContent = 'CONTESTED - Even footing';
        }
    }
    
    updateHealth() {
        // Player health
        const playerHealthPercent = (this.gameState.playerHealth / 100) * 100;
        document.getElementById('playerHealth').style.width = playerHealthPercent + '%';
        document.getElementById('playerHealthText').textContent = `${this.gameState.playerHealth}/100`;
        
        // Monster health
        const monsterHealthPercent = (this.gameState.monsterHealth / 100) * 100;
        document.getElementById('monsterHealth').style.width = monsterHealthPercent + '%';
        document.getElementById('monsterHealthText').textContent = `${this.gameState.monsterHealth}/100`;
    }
    
    updateAgendaHint() {
        const agenda = this.monsterAgendas[this.gameState.monsterAgenda];
        const hintEl = document.getElementById('agendaHint');
        
        let hintText = agenda.description;
        
        // Add momentum-based hints
        if (this.gameState.momentum === 'CONTROLLING') {
            hintText += " (You can see its next moves clearly)";
        } else if (this.gameState.momentum === 'PRESSURED') {
            hintText += " (Its intentions are unclear)";
        }
        
        hintEl.textContent = hintText;
    }
    
    updatePatterns() {
        const tracker = document.getElementById('patternTracker');
        tracker.innerHTML = '';
        
        if (this.gameState.learnedPatterns.length === 0) {
            const item = document.createElement('div');
            item.className = 'pattern-item';
            item.textContent = 'No patterns discovered yet';
            tracker.appendChild(item);
        } else {
            this.gameState.learnedPatterns.forEach(pattern => {
                const item = document.createElement('div');
                item.className = 'pattern-item';
                item.textContent = pattern;
                tracker.appendChild(item);
            });
        }
    }
    
    updateTelegraph() {
        const telegraphEl = document.getElementById('telegraph');
        
        if (this.gameState.telegraphedAction) {
            telegraphEl.style.display = 'block';
            telegraphEl.textContent = this.gameState.telegraphedAction;
        } else {
            telegraphEl.style.display = 'none';
        }
    }
    
    generateActions() {
        const grid = document.getElementById('actionsGrid');
        grid.innerHTML = '';
        
        const actions = this.getAvailableActions();
        
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = `action-btn ${action.risk}`;
            btn.innerHTML = `
                <div><strong>${action.name}</strong></div>
                <div style="font-size: 12px; margin-top: 5px;">${action.description}</div>
                <div class="risk-indicator">${action.riskText}</div>
            `;
            
            btn.onclick = () => this.executeAction(action);
            grid.appendChild(btn);
        });
    }
    
    getAvailableActions() {
        const actions = [];
        const currentPos = this.gameState.playerPosition;
        
        // Position-based actions
        if (currentPos !== 'AGGRESSIVE') {
            actions.push({
                type: 'position',
                name: 'Shift to Aggressive',
                description: 'Move in close for high-damage attacks',
                target: 'AGGRESSIVE',
                risk: this.calculateRisk('AGGRESSIVE'),
                riskText: this.getRiskText('AGGRESSIVE')
            });
        }
        
        if (currentPos !== 'DEFENSIVE') {
            actions.push({
                type: 'position',
                name: 'Shift to Defensive', 
                description: 'Take a safe stance and gather intel',
                target: 'DEFENSIVE',
                risk: this.calculateRisk('DEFENSIVE'),
                riskText: this.getRiskText('DEFENSIVE')
            });
        }
        
        if (currentPos !== 'NEUTRAL') {
            actions.push({
                type: 'position',
                name: 'Shift to Neutral',
                description: 'Balanced position with all options',
                target: 'NEUTRAL', 
                risk: this.calculateRisk('NEUTRAL'),
                riskText: this.getRiskText('NEUTRAL')
            });
        }
        
        if (currentPos !== 'EVASIVE') {
            actions.push({
                type: 'position',
                name: 'Shift to Evasive',
                description: 'Create distance and avoid attacks',
                target: 'EVASIVE',
                risk: this.calculateRisk('EVASIVE'),
                riskText: this.getRiskText('EVASIVE')
            });
        }
        
        // Position-specific attacks
        if (currentPos === 'AGGRESSIVE') {
            actions.push({
                type: 'attack',
                name: 'Power Strike',
                description: 'Devastating close-range attack',
                damage: 25,
                risk: 'risky',
                riskText: 'High damage, but vulnerable to counter'
            });
        }
        
        if (currentPos === 'DEFENSIVE') {
            actions.push({
                type: 'special',
                name: 'Read Opponent',
                description: 'Gain insight into monster\'s next move',
                risk: 'safe',
                riskText: 'Safe, reveals enemy patterns'
            });
        }
        
        if (currentPos === 'EVASIVE') {
            actions.push({
                type: 'special',
                name: 'Scout Pattern',
                description: 'Learn about monster\'s agenda',
                risk: 'safe',
                riskText: 'Safe, gains tactical information'
            });
        }
        
        // Always available
        actions.push({
            type: 'attack',
            name: 'Quick Strike',
            description: 'Fast, moderate damage attack',
            damage: 15,
            risk: 'safe',
            riskText: 'Reliable damage, low risk'
        });
        
        return actions;
    }
    
    calculateRisk(targetPosition) {
        const monsterPos = this.gameState.monsterPosition;
        const agenda = this.gameState.monsterAgenda;
        
        // Risk matrix based on position matchups
        const riskMatrix = {
            'AGGRESSIVE': {
                'AGGRESSIVE': 'risky', // Both aggressive = clash
                'DEFENSIVE': 'optimal', // Aggressive beats defensive
                'NEUTRAL': 'safe',
                'EVASIVE': 'risky' // Hard to reach evasive from aggressive
            },
            'DEFENSIVE': {
                'AGGRESSIVE': 'safe', // Defensive counters aggressive
                'DEFENSIVE': 'safe', // Both defensive = stalemate
                'NEUTRAL': 'safe',
                'EVASIVE': 'optimal' // Defensive beats evasive
            },
            'NEUTRAL': {
                'AGGRESSIVE': 'safe',
                'DEFENSIVE': 'safe', 
                'NEUTRAL': 'safe',
                'EVASIVE': 'safe'
            },
            'EVASIVE': {
                'AGGRESSIVE': 'optimal', // Evasive beats aggressive
                'DEFENSIVE': 'risky', // Defensive counters evasive
                'NEUTRAL': 'safe',
                'EVASIVE': 'safe'
            }
        };
        
        let baseRisk = riskMatrix[targetPosition][monsterPos];
        
        // Modify based on agenda
        if (agenda === 'FRENZY_MODE' && targetPosition === 'AGGRESSIVE') {
            baseRisk = 'risky'; // Don't meet frenzy head-on
        }
        
        if (agenda === 'STUDY_MODE' && targetPosition === 'DEFENSIVE') {
            baseRisk = 'optimal'; // Counter-study
        }
        
        return baseRisk;
    }
    
    getRiskText(targetPosition) {
        const risk = this.calculateRisk(targetPosition);
        const texts = {
            'optimal': 'Optimal choice - high reward',
            'safe': 'Safe choice - moderate reward', 
            'risky': 'Risky choice - high risk/reward'
        };
        return texts[risk];
    }
    
    executeAction(action) {
        this.addToBattleLog(`<strong>Turn ${this.gameState.turn}:</strong>`);
        
        // Record action for pattern tracking
        this.gameState.actionHistory.push({
            turn: this.gameState.turn,
            action: action.name,
            position: this.gameState.playerPosition
        });
        
        // Execute player action
        this.executePlayerAction(action);
        
        // Monster responds
        setTimeout(() => {
            this.executeMonsterTurn();
            
            // Check win conditions
            setTimeout(() => {
                if (this.checkWinConditions()) {
                    return;
                }
                
                // Advance turn
                this.gameState.turn++;
                this.updateDisplay();
                this.generateActions();
            }, 1000);
        }, 1500);
    }
    
    executePlayerAction(action) {
        switch (action.type) {
            case 'position':
                this.gameState.playerPosition = action.target;
                this.addToBattleLog(`You shift to ${action.target} position.`);
                
                // Position changes affect momentum
                if (action.risk === 'optimal') {
                    this.adjustMomentum(15);
                    this.addToBattleLog("Your positioning gives you a tactical advantage!");
                } else if (action.risk === 'risky') {
                    this.adjustMomentum(-10);
                }
                break;
                
            case 'attack':
                this.addToBattleLog(`You use ${action.name}!`);
                const damage = this.calculateDamage(action.damage);
                this.gameState.monsterHealth = Math.max(0, this.gameState.monsterHealth - damage);
                this.addToBattleLog(`You deal ${damage} damage to the Shadow Beast!`);
                
                if (action.risk === 'risky') {
                    this.adjustMomentum(-5);
                } else {
                    this.adjustMomentum(5);
                }
                break;
                
            case 'special':
                this.addToBattleLog(`You use ${action.name}.`);
                
                if (action.name === 'Read Opponent') {
                    this.revealMonsterInfo();
                    this.adjustMomentum(10);
                } else if (action.name === 'Scout Pattern') {
                    this.learnPattern();
                    this.adjustMomentum(5);
                }
                break;
        }
        
        this.updateDisplay();
    }
    
    executeMonsterTurn() {
        // Update monster agenda
        this.updateMonsterAgenda();
        
        // Monster chooses action based on agenda and player position
        const monsterAction = this.chooseMonsterAction();
        
        this.addToBattleLog(`<strong>Shadow Beast:</strong> ${monsterAction.description}`);
        
        // Execute monster action
        switch (monsterAction.type) {
            case 'attack':
                const damage = this.calculateMonsterDamage(monsterAction.damage);
                this.gameState.playerHealth = Math.max(0, this.gameState.playerHealth - damage);
                this.addToBattleLog(`The Shadow Beast deals ${damage} damage to you!`);
                this.adjustMomentum(-10);
                break;
                
            case 'position':
                this.gameState.monsterPosition = monsterAction.target;
                this.addToBattleLog(`The Shadow Beast shifts to ${monsterAction.target} position.`);
                break;
                
            case 'special':
                this.addToBattleLog(monsterAction.effect);
                if (monsterAction.momentumChange) {
                    this.adjustMomentum(monsterAction.momentumChange);
                }
                break;
        }
        
        // Set up telegraph for next turn
        this.setTelegraph();
        
        this.updateDisplay();
    }
    
    chooseMonsterAction() {
        const agenda = this.gameState.monsterAgenda;
        const playerPos = this.gameState.playerPosition;
        const monsterPos = this.gameState.monsterPosition;
        
        // Agenda-driven behavior
        switch (agenda) {
            case 'STUDY_MODE':
                return {
                    type: 'special',
                    description: 'The beast studies your movements intently.',
                    effect: 'The Shadow Beast learns more about your fighting style.',
                    momentumChange: -5
                };
                
            case 'HUNT_MODE':
                if (playerPos === 'EVASIVE') {
                    return {
                        type: 'position',
                        target: 'AGGRESSIVE',
                        description: 'The beast lunges forward, trying to close the distance!'
                    };
                } else {
                    return {
                        type: 'attack',
                        damage: 20,
                        description: 'The beast strikes with shadowy claws!'
                    };
                }
                
            case 'PHASE_MODE':
                return {
                    type: 'special',
                    description: 'The beast\'s form flickers as it prepares something devastating.',
                    effect: 'The Shadow Beast charges its phase attack.',
                    momentumChange: -8
                };
                
            case 'FRENZY_MODE':
                return {
                    type: 'attack',
                    damage: 30,
                    description: 'The beast attacks with frenzied fury!'
                };
                
            default:
                return {
                    type: 'attack',
                    damage: 15,
                    description: 'The beast lashes out with dark energy.'
                };
        }
    }
    
    updateMonsterAgenda() {
        this.gameState.agendaTurns++;
        
        const currentAgenda = this.monsterAgendas[this.gameState.monsterAgenda];
        
        if (this.gameState.agendaTurns >= currentAgenda.duration) {
            // Switch to new agenda
            const agendas = Object.keys(this.monsterAgendas);
            let newAgenda;
            
            do {
                newAgenda = agendas[Math.floor(Math.random() * agendas.length)];
            } while (newAgenda === this.gameState.monsterAgenda);
            
            this.gameState.monsterAgenda = newAgenda;
            this.gameState.agendaTurns = 0;
            
            this.addToBattleLog(`<em>The beast's behavior shifts... It seems to have a new plan.</em>`);
        }
    }
    
    setTelegraph() {
        const agenda = this.gameState.monsterAgenda;
        const agendaData = this.monsterAgendas[agenda];
        
        // Show telegraph based on momentum and agenda
        if (this.gameState.momentum === 'CONTROLLING') {
            this.gameState.telegraphedAction = agendaData.telegraph;
        } else if (this.gameState.momentum === 'CONTESTED') {
            if (Math.random() < 0.5) {
                this.gameState.telegraphedAction = agendaData.telegraph;
            } else {
                this.gameState.telegraphedAction = null;
            }
        } else {
            this.gameState.telegraphedAction = null;
        }
    }
    
    revealMonsterInfo() {
        const agenda = this.gameState.monsterAgenda;
        const agendaData = this.monsterAgendas[agenda];
        
        this.addToBattleLog(`<em>You sense the beast is in ${agendaData.name} mode.</em>`);
        this.adjustMomentum(15);
    }
    
    learnPattern() {
        const patterns = [
            "The beast favors aggressive stances when injured",
            "It becomes defensive after taking heavy damage", 
            "The creature telegraphs big attacks with flickering",
            "It studies you more when you're unpredictable"
        ];
        
        const newPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        if (!this.gameState.learnedPatterns.includes(newPattern)) {
            this.gameState.learnedPatterns.push(newPattern);
            this.addToBattleLog(`<em>Pattern learned: ${newPattern}</em>`);
        }
    }
    
    calculateDamage(baseDamage) {
        let damage = baseDamage;
        
        // Position modifiers
        if (this.gameState.playerPosition === 'AGGRESSIVE') {
            damage *= 1.3;
        } else if (this.gameState.playerPosition === 'EVASIVE') {
            damage *= 0.7;
        }
        
        // Momentum modifiers
        if (this.gameState.momentum === 'CONTROLLING') {
            damage *= 1.2;
        } else if (this.gameState.momentum === 'PRESSURED') {
            damage *= 0.8;
        }
        
        return Math.floor(damage);
    }
    
    calculateMonsterDamage(baseDamage) {
        let damage = baseDamage;
        
        // Player position affects damage taken
        if (this.gameState.playerPosition === 'DEFENSIVE') {
            damage *= 0.6;
        } else if (this.gameState.playerPosition === 'EVASIVE') {
            damage *= 0.4;
        } else if (this.gameState.playerPosition === 'AGGRESSIVE') {
            damage *= 1.2;
        }
        
        return Math.floor(damage);
    }
    
    adjustMomentum(change) {
        this.gameState.momentumValue = Math.max(0, Math.min(100, this.gameState.momentumValue + change));
    }
    
    checkWinConditions() {
        if (this.gameState.playerHealth <= 0) {
            this.addToBattleLog("<strong>DEFEAT!</strong> The Shadow Beast has overwhelmed you.");
            this.disableActions();
            return true;
        }
        
        if (this.gameState.monsterHealth <= 0) {
            this.addToBattleLog("<strong>VICTORY!</strong> You have defeated the Shadow Beast!");
            this.disableActions();
            return true;
        }
        
        return false;
    }
    
    disableActions() {
        const buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(btn => btn.disabled = true);
    }
}

// Initialize the demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TacticalCombatDemo();
});