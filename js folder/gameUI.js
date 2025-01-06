// StartGame  //
document.getElementById('startButton').addEventListener('click', function () {
    const video = document.getElementById("background-audio");
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('game').style.display = 'block'; 
    video.muted = false; 
    video.play(); 
    const gameDiv = document.getElementById('game');
    setTimeout(() => { gameDiv.classList.add('visible'); }, 10);
});

// Select all SVG elements inside the navBar
const svgElements = document.querySelectorAll('.navBar svg');

// Function to show a popup when an SVG is clicked
function showPopup(event) {
    const popup = document.getElementById('popupId');


    // Style the popup
    Object.assign(popup.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: '1000',
    });

    // Add the popup to the document body
    document.body.appendChild(popup1);

    // Add a click event to close the popup
    popupId.addEventListener('click', () => {
      popupId.remove();
    });

    // Prevent bubbling up
    event.stopPropagation();
}

// Add click event listeners to all SVG elements
svgElements.forEach((svg) => {
    svg.addEventListener('click', showPopup);
});

// Optional: Add a global click listener to remove popups
document.addEventListener('click', (event) => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach((popup) => popup.remove());
});


window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const startPage = document.getElementById("startPage");

    // Hide the loader
    loader.classList.add("hidden");

    // Show the content
    setTimeout(() => {
        loader.style.display = "none";
        startPage.style.display = "block";

    }, 300); // Allow the fade-out animation to complete
});

const buttonclick = new Audio('mouse-click-104737.mp3');
const audio = document.getElementById('background-audio');
const slider = document.getElementById('volumeSlider');

slider.addEventListener('input', () => {
  audio.volume = slider.value;
  
});

const buttonSound = new Audio('button-click.mp3');

function playButtonSound() {
  buttonSound.volume = slider.value;
  buttonSound.currentTime = 0;
  buttonSound.play();
}
const allButtons = document.querySelectorAll('button');
allButtons.forEach(button => {
  button.addEventListener('click', playButtonSound);
});

const typingSpeed = 70; // Adjust this value to control typing speed (milliseconds)
const textElement = document.getElementById('text');
let isTyping = false; 
let currentInterval; 

function typeText(textToType, element, speed) {
  // Initialize variables
  let index = 0;
  let intervalId;

  // Function to display the next character
  function displayCharacter() {
    if (index < textToType.length) {
      element.innerText += textToType.charAt(index);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }

  // Start the typing animation
  intervalId = setInterval(displayCharacter, speed);
}