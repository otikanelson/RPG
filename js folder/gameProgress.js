// Example dialogue structure
const DIALOGUES = {
    intro: {
        name: "intro",
        texts: [
            {content: "\"Welcome Rift Walker! I am the Great mage of this region. And you my friend are what is called an \"Avatar\"\"",
                choices: [
                    { text: "Who are you...exactly?", nextDialogue: "mageIntro" },
                    { text: "Where am I?", nextDialogue: "avatarDefined" },
                    { text: "What is an avatar?", nextDialogue: "avatarDefined"},
            ]}
        ]
    },
    mageIntro: {
        name: "mageIntro",
        texts: [
            {content: "\"I am V'ial Imdall, i am the mage assigned to keep the peace of this realm. As you can see what a poor job i have done, which is why i need to get back to my business.\""},
            {content: "You look around for a moment and see yourself among burnt buildings and ash everywhere, you look forward again with the intent to ask Imdall a question",
                choices: [
                    { text: "Where am I?", nextDialogue: "avatarDefined"},
                    { text: "What is an avatar?", nextDialogue: "avatarDefined"}
                ]}
            ]
        },
    locationInfo: {
        name: "avatarDefined",
        texts: [
            {content: "\"Well, my friend, you are a soul magically embedded in the body of someone from another world. You were likely summoned by this jewel.\""},
            {content: "The man points at the amulet in your hand, which he had given to you earlier, \"It will help you fix the rift in which you came through and go back home\""},
            {content: "The people of this world face turmoil as a result of the revival of \"T'Kr\", an ancient deity and i have been trying to infer the cause......."},
            {content: "My friend, there is no time for further questions, more will be revealed to you as you go, The first shard is said to be hidden in the bazaar, you must find it and maybe...just maybe it might bring about a better situation",
                choices: [
                    { text: "Tell me more about avatars", nextDialogue: "avatarExplanation" },
                    { text: "What happened to the original soul?", nextDialogue: "avatarExplanation" }
            ]}]
    },
    avatarExplanation: {
        name: "avatarExplanation",
        texts: [
            {content: "You were brought here by that rift and the amulet, needs a soul to guide and fix it "},
            {content: "And as for the soul of the body you now reside in, well there's no time for such stories right now\", You ponder as you look around, and you may understand why."},
            {content: "You look forward again and Imdall is gone, you push your weight off of the floor and step forward, now you just have to find the bazaar. you are stranded, where do you even go from here",
                choices: [
                    { text: "Walk forward", nextDialogue: "wrongDirection" },
                    { text: "Take a look at the amulet", nextDialogue: "rightDirection" }
                ]}]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const dialogueManager = new DialogueManager();
    dialogueManager.startDialogue('intro');
});

function explanation() {
    update(dialogue[1]);
}

async function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
        let newHealth = Math.min(health + 10, 100);
        updateHealth(newHealth);
        button3.innerText = "Leave the store";
        button3.onclick = goTown;
        await typeText("You stare at the green bottle on the top most shelf. And the shop keep offers it to you and opens up his wretched hands. Your check you belt pockets and bring out three gold coins, he immediately snatches it from you mitts and scurries along.", text, 30);
    } else {
        await typeText("You do not seem to have enough gold for this adventurer!!?? The previously grinning shop keep yells almost concerned", text, 30);
        button1.onclick = goAway;
        button2.onclick = goAway;
    }
}


async function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            await typeText(`You bought a ${newWeapon}.`, text);
            inventory.push(newWeapon);
            updateInventoryDisplay();
            text.innerText += "\nInventory: " + inventory;
        } else {
            await typeText("You do not seem to have enough gold to buy a weapon adventurer!! The formerly grinning shop keep yells almost cross", text);
            button1.onclick = goAway;
            button2.onclick = goAway;
        }
    } else {
        await typeText("You already have the most powerful weapon!", text);
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

document.getElementById('text').addEventListener('click', function() {
    if (isTyping) {
        const currentLocation = locations.find(loc => 
            loc["button text"][0] === button1.innerText &&
            (loc["button text"][1] === button2.innerText || !loc["button text"][1]) &&
            (loc["button text"][2] === button3.innerText || !loc["button text"][2])
        );
        if (currentLocation) {
            skipTyping(this, currentLocation.text);
        }
    }
});


function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function sellWeapon(){
    if (inventory.length > 1){
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        updateInventoryDisplay();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += "Inventory: " + inventory;
    } else {
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
    inventory = ["Rusty Knife"];
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

function pickThree(){
    pick(3);
}

function pick(guess){
    let numbers = [];
    while (numbers.length < 5){
        numbers.push(Math.floor(Math.random() * 6))
    }

    text.innerText = "You picked " + guess + " here are the random numbers:\n";

    for (let i = 0; i < 5; i++) {
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