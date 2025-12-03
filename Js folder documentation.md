JS FOLDERS STRUCTURE AND FUNCTIONALITY
Game Properties
	Sound class(Attribute Sound Path)
	Play Sound method

2.	Game Transitions
	Loading animation
	Start Page(on-click for start Btn)
	Game Page  =>  start Journey
	Narration Page  =>  Next Page
	Game Page  =>  Next Btns

3.	Game Settings
	Pop up Toggle & assignment 
	Music & Sound Volume 
	Full Screen Toggle 
	Side Bar Toggle
	 Character Description Toggle
	About Navigation

4.	Game Storage
	Save Files
	Achievement
	Collected Achievements
	Choice Sequences 
	Locations Lists
	Characters Description

5.	Game Text Design
	Highlight function for dialogue
	Typing Animation
	Press Space To Skip Function
	Update health & Xp Text

6.	Game Logic
	Attack Function
	Attack Impact function
	Defend Function
	Dodge Function
	Equip Item Function
	Item Use Function
	Item Stats
	Monster Levels Randomizer
	Update health & Xp Text


7.	Game Progress and Dialogue manager
	Sequences Manager
	Choice Manager
	Location Manager


Battle system Logic
CORE BATTLE COMPONENTS:

Battle Flow States

A. Pre-Battle
- Dialogue trigger initiates battle
- Monster intro text displayed from MONSTER_DIALOGUES[monsterName].introText
- Weapon/potion selection (1 weapon, up to 2 potions)
- Stance selection (Offensive, Defensive, Balanced)

B. Turn System
- Initial dice roll animation for first turn determination
- Subsequent turns alternate between player and monster
- Dice roll animation for:
  * Action success calculations
  * Defense success calculations
  * Reward determination
  
- Monster Turn Options:
  * Attack (weapon-based)
  * Defense (weapon-based)
  * Magic buff actions:
    - Self-heal (if health < 100%)
    - Attack boost (affects next turn)
    - Player debuff (health reduction)

- Player Turn:
  * Display stance-specific options
  * If first turn: Attack/Defense options only
  * If responding: All stance options available
  * Action selected -> Dialogue displayed -> Effects calculated

Combat Mechanics

Stances:
A. Offensive
- Heavy Slash
- Deep Thrust
- Block

B. Defensive
- Quick Slice
- Dodge
- Parry/Deflect

C. Balanced
- Light Slash
- Dodge
- Counter

Weapon Properties:
- Base hit points
- Attack success rate
- Level-based modifiers
- Stance compatibility ratings

Combat Resolution System

A. Attack Scenarios:
- Player attacks first:
  * Dice roll for success
  * Success: "Attack hits for X points"
  * Failure: "Attack failed"

B. Response Scenarios:
When Monster Attacks First:
- Player defends:
  * Correct defense type: 
      - Display specific defense dialogue from MONSTER_DIALOGUES[monsterName].defends[weaponType][defenseType]
      - Guaranteed success
  * Wrong defense type: 
      - Dice roll for success with standard probability
      - Display generic success/failure text
  * Attack response:
      - Take damage
      - Deal damage if successful (based on standard attack success rate)
      - Return to monster's turn
  * Dodge response:
      Success: Display generic success text + return to monster's turn
      Failure: Display generic failure text + take damage + stay in turn

When Monster Defends First:
- Player attacks:
  * Correct attack type: 
      - Display specific attack dialogue from MONSTER_DIALOGUES[monsterName].playerAttacks[weaponType][attackType]
      - Guaranteed success
  * Wrong attack type:
      - Dice roll for success with standard probability
      - Display generic success/failure text
  * Defense response: Display "you raise your defense" + return to monster's turn
  * Counter/Dodge:
      - Follow standard success calculations
      - Does nothing
      - Return to monster's turn

C. Calculation Factors:
- Weapon level
- Stance bonuses
- Player vs Monster level difference (determines battle difficulty)
- Success rates based on dice rolls

Technical Features

A. Audio System
- Monster-specific battle music
- Action feedback sound effects

B. Visual Feedback
- Dice roll animation for success calculations
- Health bar updates
- Battle text display
- Button state management

C. Dialogue Integration
- Monster-specific dialogue pools from MONSTER_DIALOGUES
- Weapon-specific attack/defense texts
- Dynamic text selection based on combat state
- Text feedback sourced from:
  * BattleDialogue.js: Contains all monster-specific dialogue templates
  * DialogueManager.js: Handles dialogue flow and state management

Reward System

A. Battle Difficulty
- Calculated from player vs monster level difference

B. Possible Rewards (Dice roll determines)
- XP (Most Common)
- Health restoration (Most Common)
- Gold (Moderately Common)
- Weapon (Rare)

C. Reward Amount Factors
- Battle difficulty rating
- Performance metrics

Dependencies/Requirements:

Consistent naming conventions across all files
Synchronized HTML/CSS IDs and class names
Well-defined monster dialogue structure in BattleDialogue.js
Asset management for audio/visual elements
Dice roll animation integration
Monster buff/debuff system integration
MONSTER_DIALOGUES structure in BattleDialogue.js for all text feedback
DialogueManager integration for battle state management
