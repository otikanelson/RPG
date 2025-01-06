// Initial buttons //
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

text.innerText = "Welcome Dragon Slayer!"

const locations = [
    {
        name: "town square",
        "button functions": [goStore, goCave, fightDragon],
        "button text": ["Go to Store", "Go to Cave", "Fight"],
        text: ["You are back in the town square."]
    },
    {
        name: "Store",
        "button functions": [ buyHealth, buyWeapon, goTown ],
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Leave the store"],
        text: ["You quickly jolt into the store."]
    },
    {
        name: "Cave",
        "button functions": [ stayHidden, lookAround ],
        "button text": ["stay hidden and wait the fight out", "look around"],
        text: ["You hurry into the tiny crevice and drop your gear"]
    },
    {
        name: "Battle",
        "button functions": [ attack, dodge, goTown ],
        "button text": ["attack", "dodge", "run"],
        text: ["You engage in battle."]
    },
    {
        name: "Kill monster",
        "button text": [ "Go to town square", "plunder" ],
        "button functions": [goTown, easterEgg],
        text: ["The monster screams \"Arg!\" as it dies. You gain experience point and find gold."]
    },
    {
        name: "lose",
        "button text": [ "Replay ?" ],
        "button functions": [ restart ],
        text: ["You die."]
    },
    {
        name: "Win",
        "button text": [ "Restart Game" ],
        "button functions": [ restart ],
        text: ["You defeat the dragon! YOU WIN!!"]
    },
    {
        name: "easter egg",
        "button text": [ "2", "3", "Go to town square?" ],
        "button functions": [ pickTwo, pickThree, goTown ],
        text: ["You find a secret game, Pick a number above.",
        "Ten numbers will be randomly chosen between 0 and 10,",
        "If the number you choose matches one of the random numbers,. YOU WIN!!"]
    },
]

function update(location) {
    monsterStats.style.display = "none";

    button1.innerText = location["button text"][0];
    button1.onclick = location["button functions"][0];
    button1.style.display = "inline-block"; 
    text.innerText = location.text;
    
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
        typeText("You stare at the green bottle on the top most shelf. And the shop keep offers it to you and opens up his wretched hands. Your check you belt pockets and bring out three gold coins, he immediately snatches it from you mitts and scurries along.", text, 30)
    } else {
        typeText("You do not seem to have enough gold for this adventurer!!?? The previously grinning shop keep yells almost concerned", text, 30);
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