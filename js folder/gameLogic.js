// function updateHealth(newHealth) {
//     // Ensure health stays within 0-100 range
//     health = Math.max(0, Math.min(100, newHealth));
    
//     // Update the health text
//     healthText.innerText = health;
    
//     // Calculate exact pixel width (2px per health unit)
//     const pixelWidth = health * 2; // 100 health = 200px, 1 health = 2px
    
//     // Update the health bar width with pixel precision
//     healthBar.style.transition = 'width 0.3s ease-in-out';
//     healthBar.style.width = `${pixelWidth}px`;
    
//     // Add visual feedback for health changes
//     healthBar.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
//     setTimeout(() => {
//         healthBar.style.boxShadow = 'none';
//     }, 300);
// }



// Dice roll mechanics //
function rollTwoDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    return {
        dice: [die1, die2],
        total: die1 + die2
    };
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}


document.addEventListener('DOMContentLoaded', function() {
    // Hide monster stats initially
    monsterStats.style.display = "none";
    
    update(dialogue[0]);
});

async function update(location) {
    monsterStats.style.display = "none";
    
    button1.innerText = location["button text"][0];
    button1.onclick = location["button functions"][0];
    button1.style.display = "inline-block";
    
    await typeText(location.text, text);
    
    if (location["button text"].length > 1) {
        button2.innerText = location["button text"][1];
        button2.onclick = location["button functions"][1];
        button2.style.display = "inline-block";
    } else {
        button2.style.display = "none";
    }
    
    if (location["button text"].length > 2) {
        button3.innerText = location["button text"][2];
        button3.onclick = location["button functions"][2];
        button3.style.display = "inline-block";
    } else {
        button3.style.display = "none";
    }
}


class DialogueManager {
    constructor() {
        this.currentDialogue = null;
        this.currentTextIndex = 0;
        this.dialogueHistory = [];
        this.isTyping = false;
        this.currentTimeout = null;
        this.fullTextContent = '';
        this.typeSpeed = 30;
        
        // Cache DOM elements
        this.textElement = document.getElementById('text');
        this.button1 = document.getElementById('button1');
        this.button2 = document.getElementById('button2');
        this.button3 = document.getElementById('button3');
        this.monsterStats = document.getElementById('monsterStats');
        
        // Create skip instruction element
        this.skipInstruction = document.createElement('div');
        this.skipInstruction.className = 'skip-instruction';
        this.skipInstruction.textContent = 'Press SPACE to skip';
        this.skipInstruction.style.cssText = 'position: fixed; bottom: 20px; right: 20px; color: #666; font-size: 14px; opacity: 0; transition: opacity 0.3s ease;';
        document.body.appendChild(this.skipInstruction);
        
        // Bind methods
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.initializeSkipHandler();
    }

    initializeSkipHandler() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress(e) {
        if (e.code === 'Space' && this.isTyping) {
            this.skipTyping(this.textElement);
        }
    }

    parseHighlightedText(text) {
        return text.replace(/\[\[(.*?)\]\]/g, '<span class="highlighted-text">$1</span>');
    }

    disableButtons() {
        [this.button1, this.button2, this.button3].forEach(button => {
            if (button) {
                button.style.opacity = '0.5';
                button.style.pointerEvents = 'none';
            }
        });
    }

    enableButtons() {
        [this.button1, this.button2, this.button3].forEach(button => {
            if (button) {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
            }
        });
    }

    showSkipInstruction() {
        this.skipInstruction.style.opacity = '1';
    }

    hideSkipInstruction() {
        this.skipInstruction.style.opacity = '0';
    }

    async typeText(text, element) {
        return new Promise((resolve) => {
            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
            }

            this.disableButtons();
            this.showSkipInstruction();

            // Store the original text for skip function
            this.fullTextContent = Array.isArray(text) ? text.join('\n') : String(text);
            
            // Parse the text for highlighting
            const parsedText = this.parseHighlightedText(this.fullTextContent);
            const tokens = this.tokenizeHTML(parsedText);
            let currentIndex = 0;
            this.isTyping = true;

            element.innerHTML = '';
            const wrapper = document.createElement('div');
            wrapper.style.whiteSpace = 'pre-wrap';
            wrapper.style.wordWrap = 'break-word';
            wrapper.style.width = '100%';
            element.appendChild(wrapper);

            const typeNextToken = () => {
                if (currentIndex < tokens.length) {
                    const token = tokens[currentIndex];
                    if (token === '\n') {
                        wrapper.appendChild(document.createElement('br'));
                    } else if (token.startsWith('<')) {
                        wrapper.insertAdjacentHTML('beforeend', token);
                    } else {
                        wrapper.insertAdjacentText('beforeend', token);
                    }
                    currentIndex++;
                    this.currentTimeout = setTimeout(typeNextToken, this.typeSpeed);
                } else {
                    this.finishTyping();
                    resolve();
                }
            };

            typeNextToken();
        });
    }

    finishTyping() {
        this.isTyping = false;
        this.currentTimeout = null;
        this.enableButtons();
        this.hideSkipInstruction();
    }

    tokenizeHTML(html) {
        const tokens = [];
        let inTag = false;
        let currentToken = '';
        let currentSpan = '';

        for (let i = 0; i < html.length; i++) {
            const char = html[i];

            if (char === '<') {
                if (currentToken) {
                    tokens.push(...currentToken.split(''));
                    currentToken = '';
                }
                inTag = true;
                currentSpan = char;
            } else if (char === '>') {
                currentSpan += char;
                tokens.push(currentSpan);
                currentSpan = '';
                inTag = false;
            } else if (inTag) {
                currentSpan += char;
            } else {
                tokens.push(char);
            }
        }

        return tokens;
    }

    skipTyping(element) {
        if (!this.isTyping || !this.fullTextContent) return;
        
        clearTimeout(this.currentTimeout);
        
        const wrapper = document.createElement('div');
        wrapper.style.whiteSpace = 'pre-wrap';
        wrapper.style.wordWrap = 'break-word';
        wrapper.style.width = '100%';
        
        const parsedText = this.parseHighlightedText(this.fullTextContent);
        wrapper.innerHTML = parsedText;
        
        element.innerHTML = '';
        element.appendChild(wrapper);
        
        this.finishTyping();
    }

    async startDialogue(dialogueName) {
        this.currentDialogue = DIALOGUES[dialogueName];
        if (!this.currentDialogue) {
            console.error(`Dialogue ${dialogueName} not found`);
            return;
        }
        
        this.currentTextIndex = 0;
        this.monsterStats.style.display = "none";
        await this.updateDialogue();
    }

    async updateDialogue() {
        if (!this.currentDialogue) return;
        
        const currentText = this.currentDialogue.texts[this.currentTextIndex];
        if (!currentText) return;

        await this.typeText(currentText.content, this.textElement);

        if (currentText.choices) {
            currentText.choices.forEach((choice, index) => {
                const button = this[`button${index + 1}`];
                if (button) {
                    button.innerText = choice.text;
                    button.onclick = () => this.makeChoice(choice);
                    button.style.display = "inline-block";
                }
            });
        } else {
            this.button1.innerText = "Continue";
            this.button1.onclick = () => this.nextText();
            this.button1.style.display = "inline-block";
            this.button2.style.display = "none";
            this.button3.style.display = "none";
        }
    }

    makeChoice(choice) {
        if (choice.nextDialogue) {
            this.dialogueHistory.push({
                dialogueName: this.currentDialogue.name,
                textIndex: this.currentTextIndex
            });
            this.startDialogue(choice.nextDialogue);
        } else if (choice.function) {
            choice.function();
        }
    }

    nextText() {
        if (!this.currentDialogue) return;

        this.currentTextIndex++;
        if (this.currentTextIndex >= this.currentDialogue.texts.length) {
            if (this.currentDialogue.nextDialogue) {
                this.startDialogue(this.currentDialogue.nextDialogue);
            } else {
                this.currentDialogue = null;
                this.currentTextIndex = 0;
            }
        } else {
            this.updateDialogue();
        }
    }

    // Clean up when dialogue manager is destroyed
    destroy() {
        document.removeEventListener('keydown', this.handleKeyPress);
        if (this.skipInstruction && this.skipInstruction.parentNode) {
            this.skipInstruction.parentNode.removeChild(this.skipInstruction);
        }
    }
}

// Add the highlighting styles
const style = document.createElement('style');
style.textContent = `
    .highlighted-text {
        color: #FFD700;
        font-weight: bold;
        text-shadow: 0 0 2px rgba(255, 215, 0, 0.5);
    }
    
    .skip-instruction {
        position: fixed;
        bottom: 20px;
        right: 20px;
        color: #666;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);