/**
 * src/systems/MapManager.js
 * Tracks the player's spatial location, manages location discovery, 
 * drives a live vector Node-Link UI map graph display overlay,
 * and manages global view transition lifecycles.
 */

// Global database of locations, spatial coordinates, and paths
export const MAP_LOCATIONS = {
    TOWN_SQUARE: {
        id: 'TOWN_SQUARE',
        name: 'Town Square',
        initialDialogue: 'Intro',
        x: 20,
        y: 50,
        connections: ['MERCHANTS_SHOP', 'BAZAAR_STREETS']
    },
    MERCHANTS_SHOP: {
        id: 'MERCHANTS_SHOP',
        name: "Merchant's Shop",
        initialDialogue: 'SalesExplanation',
        x: 50,
        y: 25,
        connections: ['TOWN_SQUARE']
    },
    BAZAAR_STREETS: {
        id: 'BAZAAR_STREETS',
        name: 'Bazaar Streets',
        initialDialogue: 'LeavingShop',
        x: 50,
        y: 75,
        connections: ['TOWN_SQUARE', 'SHARD_CHAMBER']
    },
    SHARD_CHAMBER: {
        id: 'SHARD_CHAMBER',
        name: 'Shard Chamber',
        initialDialogue: 'Fight',
        x: 80,
        y: 50,
        connections: ['BAZAAR_STREETS']
    }
};

class MapManager {
    constructor() {
        this.currentLocation = null;
        
        // Embedded View Transition Selectors
        this.startPage = document.getElementById('startPage');
        this.gamePage = document.getElementById('gamePage');
        this.startButton = document.getElementById('startButton');
        this.backgroundAudio = document.getElementById('background-audio');
        
        this.initializeTransitions();
    }

    /**
     * Set up global game transition behaviors directly inside the system loop
     */
    initializeTransitions() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                console.log('Start button clicked. Launching world states...');
                
                if (this.startPage) this.startPage.style.display = 'none';
                if (this.gamePage) this.gamePage.style.display = 'block';
                
                // Self-initialize map layout tracking on game start
                this.init('TOWN_SQUARE');
                
                if (this.backgroundAudio) {
                    this.backgroundAudio.muted = false;
                    this.backgroundAudio.play().catch(e => console.warn('Audio playback restricted:', e));
                }

                setTimeout(() => {
                    if (this.gamePage) this.gamePage.classList.add('visible');
                    
                    // Wait for dialogue system engine hookups
                    const startDialogue = () => {
                        if (window.dialogueManager) {
                            console.log('Starting Intro dialogue');
                            window.dialogueManager.startDialogue('Intro');
                        } else {
                            console.log('Dialogue system loading, retrying...');
                            setTimeout(startDialogue, 50);
                        }
                    };
                    
                    startDialogue();
                }, 100);
            });
        }
    }

    /**
     * Initializes the map placement on game boot or save reload.
     */
    init(locationId = 'TOWN_SQUARE') {
        console.log(`Initializing Map Subsystem at: ${locationId}`);
        
        // Ensure starting location exists in global storage tracking safely
        if (window.gameLogic && window.gameLogic.visitedLocations) {
            if (!window.gameLogic.visitedLocations.includes(locationId)) {
                window.gameLogic.visitedLocations.push(locationId);
            }
        }
        
        this.buildGraphUI();
        this.travelTo(locationId, false);
        
        // Track adjustments dynamically for map connection vectors
        window.removeEventListener('resize', this.boundDrawLines);
        this.boundDrawLines = () => this.drawConnectionLines();
        window.addEventListener('resize', this.boundDrawLines);
    }

    travelTo(locationId, triggerDialogue = true) {
        const targetLocation = MAP_LOCATIONS[locationId];
        if (!targetLocation) return;

        this.currentLocation = targetLocation;

        if (window.gameLogic && window.gameLogic.visitedLocations) {
            if (!window.gameLogic.visitedLocations.includes(locationId)) {
                window.gameLogic.visitedLocations.push(locationId);
            }
        }

        this.syncMapUI();

        if (triggerDialogue && targetLocation.initialDialogue && window.dialogueManager) {
            window.dialogueManager.startDialogue(targetLocation.initialDialogue);
        }
    }

    buildGraphUI() {
        const container = document.getElementById('mapNodesContainer');
        if (!container) return;

        container.innerHTML = '';

        Object.values(MAP_LOCATIONS).forEach(loc => {
            const node = document.createElement('div');
            node.className = `map-node`;
            node.id = `map-node-${loc.id}`;
            node.style.left = `${loc.x}%`;
            node.style.top = `${loc.y}%`;
            node.setAttribute('data-name', loc.name);

            node.onclick = () => {
                const isVisited = window.gameLogic?.visitedLocations?.includes(loc.id);
                if (isVisited && this.currentLocation?.id !== loc.id) {
                    this.travelTo(loc.id, true);
                    window.closeMapModal(); // Automatically shut modal view frame on travel
                }
            };

            container.appendChild(node);
        });

        this.drawConnectionLines();
    }

    drawConnectionLines() {
        const svg = document.getElementById('mapConnections');
        if (!svg) return;

        svg.innerHTML = '';
        const width = svg.clientWidth || svg.getBoundingClientRect().width;
        const height = svg.clientHeight || svg.getBoundingClientRect().height;

        const drawnPaths = new Set();

        Object.values(MAP_LOCATIONS).forEach(source => {
            source.connections.forEach(targetId => {
                const target = MAP_LOCATIONS[targetId];
                if (!target) return;

                const pathToken = [source.id, targetId].sort().join('-');
                if (drawnPaths.has(pathToken)) return;
                drawnPaths.add(pathToken);

                const x1 = (source.x / 100) * width;
                const y1 = (source.y / 100) * height;
                const x2 = (target.x / 100) * width;
                const y2 = (target.y / 100) * height;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.id = `line-${pathToken}`;
                line.setAttribute('class', 'map-connection-line');

                svg.appendChild(line);
            });
        });

        this.syncMapUI();
    }

    syncMapUI() {
        if (!this.currentLocation) return;

        const titleEl = document.getElementById('location-title-display');
        if (titleEl) {
            titleEl.textContent = `Current Location: ${this.currentLocation.name}`;
        }

        const visitedList = window.gameLogic?.visitedLocations || [];

        Object.values(MAP_LOCATIONS).forEach(loc => {
            const nodeEl = document.getElementById(`map-node-${loc.id}`);
            if (!nodeEl) return;

            const isVisited = visitedList.includes(loc.id);
            const isActive = this.currentLocation.id === loc.id;

            nodeEl.classList.toggle('discovered', isVisited);
            nodeEl.classList.toggle('active', isActive);
        });

        Object.values(MAP_LOCATIONS).forEach(source => {
            source.connections.forEach(targetId => {
                const pathToken = [source.id, targetId].sort().join('-');
                const lineEl = document.getElementById(`line-${pathToken}`);
                if (!lineEl) return;

                const bothVisited = visitedList.includes(source.id) && visitedList.includes(targetId);
                lineEl.classList.toggle('visited', bothVisited);
            });
        });
    }
}

const mapManager = new MapManager();
export default mapManager;