document.getElementById('startButton').addEventListener('click', function () {
    document.getElementById('startPage').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    const gameDiv = document.getElementById('game');
    setTimeout(() => { gameDiv.classList.add('visible'); }, 10);
    playTextAnimation();
});


// Function to type text with a delay
function typeText(element, text, speed = 50, callback) {
    element.innerHTML = ""; // Clear the element content
    let index = 0;

    function type() {
        if (index < text.length) {
            element.innerHTML += text[index];
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            callback(); // Call the callback function after typing is done
        }
    }

    type();
}

// Function to play text animation and show buttons afterward
function playTextAnimation() {
    const textElement = document.querySelector("#text");

    typeText(textElement, text, 50, function () {
        fadeInButtons(); // Fade in buttons after typing is complete
    });
}

// Function to fade in the buttons
function fadeInButtons() {
    const buttons = document.querySelectorAll("#controls button");
    let delay = 0;

    buttons.forEach((button) => {
        button.style.opacity = 0;
        button.style.transition = "opacity 1s ease-in";
        setTimeout(() => {
            button.style.opacity = 1;
        }, delay);
        delay += 500; // Add delay between buttons
    });
}



// // -----playerStats--------
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = [ "rusty knife" ];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterLevelText = document.querySelector("#monsterLevel");
const monsterHealthText = document.querySelector("#monsterHealth");
const weaponsText = document.querySelector("#WeaponsText");
const monsterNameText = document.querySelector("#monsterName");
const weapons = [
    {name: "rusty knife", price: 20, power: 5},
    {name: "dagger", price: 35, power: 40},
    {name: "hammer", price: 120, power: 100},
    {name: "Sword", price: 200, power: 70},
];

const monsters = [
    {name: "Slime monster", health: 15, level: 2},
    {name: "Fanged beast", health: 60, level: 8},
    {name: "Dragon", health: 300, level: 20},
];

const locations = [
    {
        name: "town square",
        "button functions": [ goStore, goCave, fightDragon ],
        "button text": ["Go to Store", "Go to Cave", "Fight"],
        text: ["You are back in the town square. The situation almost exactly as you left it.\"I need to act quick!\" you think.",
        "There are two seemingly able bodied warriors still at the front line of the battle, \"There could still be time\" you think.",
        "The store right behind you. And a tight but capable looking crevice right by the 4 foot long tail of the beast you are currently muddled by."]
    },
    {
        name: "Store",
        "button functions": [ buyHealth, buyWeapon, goTown ],
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Leave the store"],
        text: ["You quickly jolt into the store, The old shopkeeper greets you. \"Hello there young adventurer what would you like to purchase\"",
        "with a rather high spirited grin like he is completely oblivious to what's transpiring outside. You start to ponder."]
    },
    {
        name: "Cave",
        "button functions": [ stayHidden, lookAround ],
        "button text": ["stay hidden and wait the fight out", "look around"],
        text: ["You hurry into the tiny crevice and drop your gear on the ground during the action.",
        "It was not much but now you are absolutely defenseless. If this swift act of cowardice does not work, it means your doom."]
    },
    {
        name: "Battle",
        "button functions": [ attack, dodge, goTown ],
        "button text": ["attack", "dodge", "run"],
        text: "You engage in battle."
    },
    {
        name: "Kill monster",
        "button text": [ "Go to town square", "plunder" ],
        "button functions": [goTown, easterEgg],
        text: "The monster screams \"Arg!\" as it dies. You gain experience point and find gold."
    },
    {
        name: "lose",
        "button text": [ "Replay ?" ],
        "button functions": [ restart ],
        text: "You die."
    },
    {
        name: "Win",
        "button text": [ "Restart Game" ],
        "button functions": [ restart ],
        text: "You defeat the dragon! YOU WIN!!"
    },
    {
        name: "easter egg",
        "button text": [ "2", "8", "Go to town square?" ],
        "button functions": [ pickTwo, pickEight, goTown ],
        text: ["You find a secret game, Pick a number above.",
        "Ten numbers will be randomly chosen between 0 and 10,",
        "If the number you choose matches one of the random numbers,. YOU WIN!!"]
    },
]



button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function updateInventoryDisplay() {
    weaponsText.innerText = inventory.join(", ");
}

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button1.onclick = location["button functions"][0];
    button1.style.display = "inline-block"; 
    
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

    const textElement = document.getElementById("text");
    typeText(textElement, location.text, 30); 
}


function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
        button3.innerText = "Leave the store";
        button3.onclick = goTown;
        text.innerText = "You stare at the green bottle on the top most shelf.\
        The label is mostly unreadable but you can almost make out the word \"heal\".\
        Could it be, a possible solution to your current problem you point to it.\
        And the shop keep offers it to you and opens up his wretched hands your check you belt pockets and bring out three gold coins,\
        he immediately snatches it from you mitts and scurries along. Confused \"was that the price for the potion you think\".\
        you start to face the dusty exit of the cottage.";
    }else {
        text.innerText = "\"You do not seem to have enough gold for this adventurer!!??\"\
        the previously grinning shop keep yells almost concerned";
        button1.onclick = goAway;
        button2.onclick = goAway;
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1){
        if (gold >= 30) {
            gold -= 30;
            currentWeapon ++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You bought a " + newWeapon + ".";
            inventory.push(newWeapon);
            updateInventoryDisplay();
            text.innerText += "Inventory: " + inventory;
        } else {
            text.innerText = " \"You do not seem to have enough gold to buy a weapon adventurer!!\"\
            the formerly grinning shop keep yells almost cross";
            button1.onclick = goAway;
            button2.onclick = goAway;
        }
    } else{ 
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}
function sellWeapon(){
    if (inventory.length > 1){
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        updateInventoryDisplay();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += "Inventory: " + inventory;
    }else{
        text.innerText = "Don't sell your only Weapon";
    }
}

function leave() {
    update(locations[0]);
}

function goAway() {
    text.innerText = "You slowly walk out of the store empty handed";
    button1.innerText = "continue";
    button1.onclick = leave;    
    button2.innerText = "continue";
    button2.onclick = leave;
    button3.innerText = "continue";
    button3.onclick = leave;
}


function stayHidden(){
    button1.innerText = "No";
    button1.onclick = goCave; 
    text.innerText = "Do you really want to wait around for this??. It gets really boring";
}

function lookAround(){
    button1.innerText = "Fight the Slime";
    button2.innerText = "Fight fanged beast";
    button1.onclick = fightSlime;
    button2.onclick = fightBeast;
}

function fightSlime(){
    fighting = 0;
    goFight();

}

function fightBeast(){
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
    text.innerText = "You look up at the beast taking a brave stance against it, until its mouth opens up.\
    Thats when you truly realize the uncertainty of the situation, your heart in your mouth,\
    you brace for certain doom with nothing but a "+ inventory +" in a small sheath by the side of your belt.";
}

function goFight(){
    update(locations[3]);
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealth = monsters[fighting].health;
    monsterHealthText.innerText = monsterHealth;
    monsterLevelText.innerText = monsters[fighting].level;
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

    const diceRoll = Math.floor(Math.random() * 6) + 1; 
    if (diceRoll > 4) {
        text.innerText += " Your attack hits!";
        const damage = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
        monsterHealth -= damage;
        monsterHealthText.innerText = monsterHealth;

        if (monsterHealth <= 0) {
            fighting === 2 ? winGame() : defeatMonster();
        }
    } else {
        text.innerText += " Your attack misses!";
    }

    const monsterAttackRoll = Math.floor(Math.random() * 6) + 1;
    if (monsterAttackRoll > 3) { 
        const monsterDamage = getMonsterAttackValue(monsters[fighting].level);
        health -= monsterDamage;
        text.innerText += ` The monster hits you for ${monsterDamage} damage.`;
        healthText.innerText = health;
    } else {
        text.innerText += " The monster's attack misses!";
    }

    if (health <= 0) {
        lose();
        return;
    }

    if (Math.random() <= 0.1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon--;
    }
}


function getMonsterAttackValue(level){
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function isMonsterHit(){
    return Math.random() > .2 || health < 20;
}

function dodge(){
    text.innerText = "You dodge the attack from the " + monsters[fighting].name + " successfully.";
}

function defeatMonster(){
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose(){
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
}

function restart(){
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function easterEgg(){
    update(locations[7])
}

function pickTwo(){
    pick(2);
}

function pickEight(){
    pick(8);
}

function pick(guess){
    let numbers = [];
    while (numbers.length < 10){
        numbers.push(Math.floor(Math.random() * 11))
    }

    text.innerText = "You picked " + guess + " here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers. indexOf(guess) !== -1) 
    {
        text.innerText += "Right! You win 20 gold!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 Health!"
        health -= 10;
        healthText.innerText = health
        if (health <= 0 ) {
            lose();
        }
    }
}