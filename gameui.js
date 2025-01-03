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