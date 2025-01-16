// // -----playerStats--------
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let inventory = [ "Rusty knife" ];
let level = 1;
let maxXP = 1000;
let currentXP = 0;

// Get DOM elements
const xpBar = document.querySelector('.xpBar');
const levelText = document.getElementById('level');
const healthBar = document.querySelector('.healthBar');
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterNameText = document.querySelector("#monsterName");
const monsterStats = document.querySelector("#monsterStats");
const monsterLevelText = document.querySelector("#monsterLevel");
const monsterHealthText = document.querySelector("#monsterHealth");
const weaponsText = document.querySelector("#weaponsText");
const weapons = [
    {name: "rusty knife", price: 20, power: 5},
    {name: "dagger", price: 35, power: 40},
    {name: "Heavy hammer", price: 120, power: 100},
    {name: "Light Sword", price: 200, power: 70},
    {name: "Heavy Sword", price: 200, power: 70},
    {name: "Light Shield", price: 200, power: 70},
    {name: "Light hammer", price: 200, power: 70},
    {name: "Frost Sword", price: 200, power: 70},
    {name: "Flame Sword", price: 200, power: 70},
    {name: "Heavy shield", price: 200, power: 70},
    {name: "Flame Shield", price: 200, power: 70},
    {name: "Light Armor", price: 200, power: 70},
    {name: "Heavy Armor", price: 200, power: 70},
];

function updateInventoryDisplay() {
    weaponsText.innerText = inventory.join(", ");
}