class TransitionManager {
    constructor() {
        this.loader = document.getElementById('loader');
        this.startPage = document.getElementById('startPage');
        this.gamePage = document.getElementById('gamePage');
        this.startButton = document.getElementById('startButton');
        this.backgroundAudio = document.getElementById('background-audio');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Handle initial page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.startPage.style.display = 'block';
            }, 300);
        });
        
        // Handle start button click
        this.startButton.addEventListener('click', () => {
            console.log('Start button clicked in TransitionManager');
            this.startPage.style.display = 'none';
            this.gamePage.style.display = 'block';
            
            if (this.backgroundAudio) {
                this.backgroundAudio.muted = false;
                this.backgroundAudio.play().catch(e => console.warn('Audio play failed:', e));
            }

            setTimeout(() => {
                this.gamePage.classList.add('visible');
                
                // Wait for dialogue manager to be ready
                const startDialogue = () => {
                    if (window.dialogueManager) {
                        console.log('Starting Intro dialogue');
                        window.dialogueManager.startDialogue('Intro');
                    } else {
                        console.log('DialogueManager not ready yet, waiting...');
                        setTimeout(startDialogue, 50);
                    }
                };
                
                startDialogue();
            }, 100);
        });
    }
}

const transitionManager = new TransitionManager();