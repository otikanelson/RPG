// StartGame  //
document.getElementById('startButton').addEventListener('click', function () {
    const video = document.getElementById("background-audio");
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('gamePage').style.display = 'block'; 
    video.muted = false; 
    video.play(); 
    const gameDiv = document.getElementById('gamePage');
    setTimeout(() => { gameDiv.classList.add('visible'); }, 10);
});


// Load Screen  //
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const startPage = document.getElementById("startPage");

    loader.classList.add("hidden");

    setTimeout(() => {
        loader.style.display = "none";
        startPage.style.display = "block";

    }, 300);
});


// Sound Settings  //
const audio = document.getElementById('background-audio');
const soundSlider = document.getElementById('volumeSlider');

const buttonSound = new Audio('Assets/button-click.mp3');

function playButtonSound() {
  buttonSound.volume = soundSlider.value;
  buttonSound.currentTime = 0;
  buttonSound.play();
}
const allButtons = document.querySelectorAll('button, #size-6');
allButtons.forEach(button => {
  button.addEventListener('click', playButtonSound);
});


// Music Settings  //
const musicSlider = document.getElementById('musicSlider');

musicSlider.addEventListener('input', () => {
  audio.volume = musicSlider.value;
});



// Fullscreen functionality
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}


// Side menu functionality
const characterInfo = document.querySelector('#characterInfo');
let isMenuVisible = true;

function toggleSideMenu() {
    if (isMenuVisible) {
        characterInfo.style.display = 'flex';
        isMenuVisible = false;
    } else {
        characterInfo.style.display = 'none';
        isMenuVisible = true;
    }
}

document.querySelector('.fullscreen').addEventListener('click', toggleFullscreen);
document.querySelector('.side-menu').addEventListener('click', toggleSideMenu);



// Typing functionalities  //
let isTyping = false;
let currentTimeout = null;
let fullTextContent = '';

const gameButtons = [button1, button2, button3];

function disableButtons() {
    gameButtons.forEach(button => {
        if (button) {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';
        }
    });
}

function enableButtons() {
    gameButtons.forEach(button => {
        if (button) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }
    });
}

const skipBtn = document.querySelector('.skipBtn');
const skipText = document.getElementById('skipText');

function showSkipButton() {
    skipBtn.style.opacity = '1';
    skipBtn.style.pointerEvents = 'auto';
    skipBtn.style.cursor = 'pointer';
}

function hideSkipButton() {
    skipBtn.style.opacity = '0';
    skipBtn.style.pointerEvents = 'none';
    skipBtn.style.cursor = 'default';
}

function typeText(text, element, speed = 30) {
    return new Promise((resolve) => {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

        disableButtons();
        showSkipButton();

        // Store the full text and create a wrapper div
        fullTextContent = Array.isArray(text) ? text.join('\n') : String(text);
        const words = fullTextContent.split('');
        let currentIndex = 0;
        isTyping = true;

        // Clear the element and create a wrapper div
        element.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.whiteSpace = 'pre-wrap';
        wrapper.style.wordWrap = 'break-word';
        wrapper.style.width = '100%';
        element.appendChild(wrapper);

        function typeNextCharacter() {
            if (currentIndex < words.length) {
                const char = words[currentIndex];
                if (char === '\n') {
                    wrapper.appendChild(document.createElement('br'));
                } else {
                    wrapper.appendChild(document.createTextNode(char));
                }
                currentIndex++;
                currentTimeout = setTimeout(typeNextCharacter, speed);
            } else {
                isTyping = false;
                currentTimeout = null;
                enableButtons();
                hideSkipButton();
                resolve();
            }
        }

        typeNextCharacter();
    });
}

function skipTyping(element) {
    return new Promise((resolve) => {
        if (isTyping && fullTextContent) {
            clearTimeout(currentTimeout);
            
            // Create a wrapper with proper styling
            const wrapper = document.createElement('div');
            wrapper.style.whiteSpace = 'pre-wrap';
            wrapper.style.wordWrap = 'break-word';
            wrapper.style.width = '100%';
            
            // Add the text with proper line breaks
            const formattedText = fullTextContent.split('\n').map(line => {
                const lineElement = document.createElement('div');
                lineElement.textContent = line;
                return lineElement;
            });
            
            formattedText.forEach(line => wrapper.appendChild(line));
            
            // Clear and update the element
            element.innerHTML = '';
            element.appendChild(wrapper);
            
            isTyping = false;
            currentTimeout = null;
            enableButtons();
            hideSkipButton();
        }
        resolve();
    });
}

skipBtn.addEventListener('click', async function() {
    if (isTyping) {
        const textElement = document.getElementById('text');
        try {
            await skipTyping(textElement);
        } catch (error) {
            console.error('Error during skip typing:', error);
            enableButtons();
            hideSkipButton();
        }
    }
});



// Popup Settings  //
const popups = {
    settings: document.getElementById('popup1'),
    save: document.getElementById('popup2'),
    load: document.getElementById('popup3'),
    achievements: document.getElementById('popup4')
};

const popupConfig = {
    settings: {
        popup: document.getElementById('popup1'),
        triggers: document.querySelectorAll('.settings-menu')
    },
    save: {
        popup: document.getElementById('popup2'),
        triggers: document.querySelectorAll('.save')
    },
    load: {
        popup: document.getElementById('popup3'),
        triggers: document.querySelectorAll('.load')
    },
    achievements: {
        popup: document.getElementById('popup4'),
        triggers: document.querySelectorAll('.achievements')
    },
};

// Function to open specific popup
function openPopup(popupId) {
    // Close any open popups first
    closeAllPopups();
    
    const popup = popups[popupId];
    if (popup) {
        popup.classList.add('open-popup');
        // Add overlay to prevent clicking behind popup
        document.body.classList.add('popup-active');
    }
}

// Function to close all popups
function closeAllPopups() {
    Object.values(popupConfig).forEach(({ popup }) => {
        if (popup) {
            popup.classList.remove('open-popup');
        }
    });
    document.body.classList.remove('popup-active');
}

// Add click handlers for each popup trigger
Object.entries(popupConfig).forEach(([popupId, config]) => {
    config.triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            openPopup(popupId);
        });
    });
});

// Event listeners for settings buttons
document.addEventListener('click', (event) => {
    const isPopup = event.target.closest('.popup');
    const isTrigger = event.target.closest('.settings-menu, .save, .load, .achievements');  // removed fullscreen and side-menu
    
    if (!isPopup && !isTrigger) {
        closeAllPopups();
    }
});

// Close buttons handler
const closeButtons = document.querySelectorAll('.popup button');
closeButtons.forEach(button => {
    button.addEventListener('click', closeAllPopups);
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllPopups();
    }
});