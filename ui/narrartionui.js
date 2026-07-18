// Get all pages and initialize current page index
const pages = document.querySelectorAll('.page');
let currentPageIndex = 0;
let isTyping = false;
let skipTyping = false;

// Create audio elements for typing sounds
const typingSound = new Audio();
typingSound.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAYbUjbB5AAAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAAQAAAAAA0JTT1VORFhNSU5HVEVDSAAAABAwAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMAQAPAAAGkAAAAIAAANIAAAAQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
typingSound.volume = 0.2;

// Function to play typing sound
function playTypingSound() {
    const sound = typingSound.cloneNode();
    sound.play().catch(e => console.log('Audio play failed:', e));
}

// Function to prepare page for typing
function preparePage(narrationElement) {
    let textContainer = narrationElement.querySelector('.text-container');
    if (!textContainer) {
        textContainer = document.createElement('div');
        textContainer.className = 'text-container';
        while (narrationElement.firstChild) {
            if (narrationElement.firstChild.nodeType === Node.TEXT_NODE ||
                (narrationElement.firstChild.nodeType === Node.ELEMENT_NODE && 
                 !narrationElement.firstChild.classList.contains('nextBtn'))) {
                textContainer.appendChild(narrationElement.firstChild);
            } else {
                break;
            }
        }
        narrationElement.insertBefore(textContainer, narrationElement.firstChild);
    }
    return textContainer;
}

// Function to type text with animation
function typeText(element, text, speed = 50) {
    const textContainer = preparePage(element);
    textContainer.textContent = '';
    const button = element.querySelector('.nextBtn');
    if (button) {
        button.style.display = 'none';
    }
    isTyping = true;
    skipTyping = false;

    const skipInstruction = document.createElement('div');
    skipInstruction.className = 'skip-instruction';
    skipInstruction.textContent = 'Press SPACE to skip';
    skipInstruction.style.cssText = 'position: fixed; bottom: 20px; right: 20px; color: #666; font-size: 14px;';
    document.body.appendChild(skipInstruction);

    return new Promise((resolve) => {
        let index = 0;
        function addCharacter() {
            if (skipTyping) {
                textContainer.textContent = text;
                finishTyping();
                return;
            }

            if (index < text.length) {
                textContainer.textContent += text.charAt(index);
                playTypingSound();
                index++;
                setTimeout(addCharacter, speed);
            } else {
                finishTyping();
            }
        }

        function finishTyping() {
            if (button) {
                button.style.display = 'block';
                button.style.opacity = '0';
                button.style.transition = 'opacity 0.5s ease';
                setTimeout(() => button.style.opacity = '1', 10);
            }
            isTyping = false;
            skipInstruction.remove();
            resolve();
        }

        addCharacter();
    });
}

// Function to handle page transitions
async function showNextPage() {
    // Get current and next pages
    const currentPage = pages[currentPageIndex];
    currentPage.style.opacity = '0';
    currentPage.style.transform = 'translateY(-20px)';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    currentPage.style.display = 'none';
    
    currentPageIndex++;
    
    if (currentPageIndex < pages.length) {
        const nextPage = pages[currentPageIndex];
        nextPage.style.display = 'flex';
        nextPage.style.opacity = '0';
        nextPage.style.transform = 'translateY(20px)';
        
        // Force reflow
        nextPage.offsetHeight;
        
        nextPage.style.opacity = '1';
        nextPage.style.transform = 'translateY(0)';
        
        const narration = nextPage.querySelector('.narration');
        const textContainer = preparePage(narration);
        const text = textContainer.textContent.trim();
        
        await typeText(narration, text);
    } else if (currentPageIndex === pages.length) {
        window.location.href = 'index.html';
    }
}

// Add skip functionality
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && isTyping) {
        skipTyping = true;
    }
});

// Initialize the first page
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS styles for transitions
    const style = document.createElement('style');
    style.textContent = `
        .page {
            transition: opacity 0.5s ease, transform 0.5s ease;
            opacity: 1;
            transform: translateY(0);
        }
        .nextBtn {
            position: fixed;
            width: 200px;
            transition: all 0.3s ease;
            padding: 30px 50px;
            font-size: 20px; 
            border: none;
            border-radius: 35px;
            background:rgba(34, 32, 32, 0.23);
            color: white;
            cursor: pointer;
            position: fixed;
            bottom: 30px; 
            right: 20px; 
            font-size: 14px;

            display: block;
        }
        .nextBtn:hover {
            transform: scale(1.05);
            background:rgba(41, 29, 7, 0.41);
        }
        .text-container {
            margin-bottom: 20px;
        }
    `;
    document.head.appendChild(style);

    // Initialize first page
    const firstPage = pages[0];
    firstPage.style.display = 'flex';
    
    const firstNarration = firstPage.querySelector('.narration');
    const textContainer = preparePage(firstNarration);
    const text = textContainer.textContent.trim();
    
    typeText(firstNarration, text);
    
    // Add click event listeners to all next buttons
    document.querySelectorAll('.nextBtn').forEach(button => {
        button.addEventListener('click', showNextPage);
    });
});