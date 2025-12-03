class TextManager {
    constructor() {
        this.textElement = document.getElementById('text');
        this.typeSpeed = 50;
        this.isTyping = false;
        this.skipInstruction = document.createElement('div');
        this.setupSkipInstruction();
        this.setupEventListeners();
        this.hasNextText = false;

        this.buttons = {
            button1: document.getElementById('button1'),
            button2: document.getElementById('button2'),
            button3: document.getElementById('button3')
        };
        
        // Check if text element exists
        if (!this.textElement) {
            console.error("Text element not found! Make sure there's an element with id 'text' in your HTML.");
        }
    }

    /**
     * Parse text with highlighted sections
     * @param {string} text - Text to parse
     * @returns {HTMLElement} - Container with parsed text
     */
    parseHighlightedText(text) {
        // Safety check for text
        if (!text) {
            console.warn("Attempting to parse undefined or empty text");
            return document.createElement('span');
        }
        
        const parts = text.split(/(\[\[.*?\]\])/g);
        const container = document.createElement('span');
        
        parts.forEach(part => {
            if (part.startsWith('[[') && part.endsWith(']]')) {
                const highlight = document.createElement('span');
                highlight.className = 'highlighted-text';
                highlight.textContent = part.slice(2, -2);
                container.appendChild(highlight);
            } else {
                container.appendChild(document.createTextNode(part));
            }
        });
        
        return container;
    }
    
    /**
     * Prepare text for typing animation
     * @param {string} text - Text to prepare
     * @returns {Array} - Array of nodes to type
     */
    prepareTextForTyping(text) {
        // Safety check for text
        if (text === undefined || text === null) {
            console.warn("Attempted to prepare undefined or null text for typing");
            return [document.createTextNode("")];
        }
        
        const container = this.parseHighlightedText(text);
        return Array.from(container.childNodes);
    }

    /**
     * Hide all buttons
     */
    hideAllButtons() {
        Object.values(this.buttons).forEach(button => {
            if (button) {
                button.style.display = 'none';
                button.textContent = ''; // Clear button text
            }
        });
    }

    /**
     * Show buttons based on choices
     * @param {Array} choices - Choice objects to display as buttons
     */
    showButtons(choices) {
        if (!choices) return;
        
        choices.forEach((choice, index) => {
            const button = Object.values(this.buttons)[index];
            if (button && choice.text) {
                button.textContent = choice.text;
                button.style.display = 'block';
            }
        });
    }
    
    /**
     * Set up skip instruction element
     */
    setupSkipInstruction() {
        this.skipInstruction.className = 'skip-instruction';
        this.skipInstruction.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: #666;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(this.skipInstruction);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.isTyping) {
                    this.skipTyping();
                } else if (this.hasNextText) {
                    document.dispatchEvent(new CustomEvent('nextText'));
                }
            }
        });
    }

    /**
     * Type text with animation
     * @param {string} text - Text to type
     * @param {boolean} hasNext - Whether there is next text available
     * @returns {Promise} - Resolves when typing is complete
     */
    typeText(text, hasNext = false) {
        // Add a safety check for undefined or null text
        if (text === undefined || text === null) {
            console.error("Attempted to type undefined or null text");
            text = ""; // Default to empty string to prevent errors
        }
        
        return new Promise((resolve) => {
            this.isTyping = true;
            this.hasNextText = hasNext;
            this.textElement.textContent = '';
            this.showSkipInstruction('Press SPACE to skip');
            
            this.hideAllButtons();
    

            const nodes = this.prepareTextForTyping(text);
            let currentNode = 0;
            let currentChar = 0;
            
            const type = () => {
                if (!this.isTyping) {
                    if (this.textElement) {
                        this.textElement.innerHTML = this.parseHighlightedText(text).innerHTML;
                    }
                    this.finishTyping(resolve);
                    return;
                }

                if (currentNode < nodes.length) {
                    const node = nodes[currentNode];
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (currentChar < node.textContent.length) {
                            if (this.textElement) {
                                this.textElement.appendChild(document.createTextNode(node.textContent[currentChar]));
                            }
                            currentChar++;
                        } else {
                            currentNode++;
                            currentChar = 0;
                        }
                    } else {
                        if (this.textElement && node) {
                            this.textElement.appendChild(node.cloneNode(true));
                        }
                        currentNode++;
                        currentChar = 0;
                    }
                    setTimeout(type, this.typeSpeed);
                } else {
                    this.finishTyping(resolve);
                }
            };

            type();
        });
    }

    /**
     * Skip typing animation
     */
    skipTyping() {
        this.isTyping = false;
    }

    /**
     * Finish typing animation
     * @param {Function} resolve - Promise resolve function
     */
    finishTyping(resolve) {
        this.isTyping = false;
        this.showButtons();
        if (this.hasNextText) {
            this.showSkipInstruction('Press SPACE for next');
        } else {
            this.hideSkipInstruction();
        }
        resolve();
    }

    /**
     * Show skip instruction
     * @param {string} text - Instruction text
     */
    showSkipInstruction(text) {
        this.skipInstruction.textContent = text;
        this.skipInstruction.style.opacity = '1';
    }

    /**
     * Hide skip instruction
     */
    hideSkipInstruction() {
        this.skipInstruction.style.opacity = '0';
    }
}

export default TextManager;