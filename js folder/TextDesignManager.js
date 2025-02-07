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
    }

    parseHighlightedText(text) {
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
    

    hideAllButtons() {
        Object.values(this.buttons).forEach(button => {
            if (button) {
                button.style.display = 'none';
                button.textContent = ''; // Clear button text
            }
        });
    }

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

    typeText(text, hasNext) {
        return new Promise((resolve) => {
            this.isTyping = true;
            this.hasNextText = hasNext;
            this.textElement.textContent = '';
            this.showSkipInstruction('Press SPACE to skip');
            
            this.hideAllButtons();

            const container = this.parseHighlightedText(text);
            const nodes = Array.from(container.childNodes);
            let currentNode = 0;
            let currentChar = 0;
            
            const type = () => {
                if (!this.isTyping) {
                    this.textElement.innerHTML = container.innerHTML;
                    this.finishTyping(resolve);
                    return;
                }

                if (currentNode < nodes.length) {
                    const node = nodes[currentNode];
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (currentChar < node.textContent.length) {
                            this.textElement.appendChild(document.createTextNode(node.textContent[currentChar]));
                            currentChar++;
                        } else {
                            currentNode++;
                            currentChar = 0;
                        }
                    } else {
                        this.textElement.appendChild(node.cloneNode(true));
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

    skipTyping() {
        this.isTyping = false;
    }

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

    showSkipInstruction(text) {
        this.skipInstruction.textContent = text;
        this.skipInstruction.style.opacity = '1';
    }

    hideSkipInstruction() {
        this.skipInstruction.style.opacity = '0';
    }
}


export default TextManager;