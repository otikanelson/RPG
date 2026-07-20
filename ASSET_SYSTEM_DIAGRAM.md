# Asset System Architecture

## 📐 System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    RPG Game Architecture                     │
│                  Asset Management System                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐       ┌──────────────────────────┐
│   VisualAssets.js        │       │     GameAudio.js         │
│  ==================       │       │  ==================      │
│                           │       │                          │
│  • VISUAL_ASSETS         │       │  • AUDIO_ASSETS          │
│    - WEAPONS             │       │    - SFX                 │
│    - ARMOR               │       │    - MUSIC               │
│    - CONSUMABLES         │       │                          │
│    - CHARACTERS          │       │  • GameAudio Class       │
│    - MONSTERS            │       │    - playSFX()           │
│    - LOCATIONS           │       │    - playMusic()         │
│    - UI                  │       │    - setVolume()         │
│    - MISC                │       │    - stopAll()           │
│                           │       │                          │
│  • getImagePath()        │       │  • Singleton Pattern     │
│    - Fallback support    │       │  • Auto-preloading       │
│    - Error logging       │       │  • Volume management     │
└──────────┬───────────────┘       └────────────┬─────────────┘
           │                                    │
           │ IMPORTED BY                        │ IMPORTED BY
           │                                    │
           ▼                                    ▼
┌──────────────────────────────────────────────────────────────┐
│                      GAME COMPONENTS                          │
├───────────────────┬──────────────────┬───────────────────────┤
│   Core Systems    │  Battle Systems  │   UI Components       │
├───────────────────┼──────────────────┼───────────────────────┤
│ • GameLogic.js    │ • BattleLogic.js │ • EquipmentModal.js   │
│   - Weapons       │   - Sounds       │   - Images            │
│   - Armor         │   - Music        │   - Sounds            │
│   - Consumables   │                  │                       │
│                   │ • BattlePrep.js  │ • CharacterComp.js    │
│ • GameSettings.js │   - Weapons      │   - Gold Icon         │
│   - Button sounds │   - Potions      │   - Images            │
│   - Volume sync   │                  │                       │
│                   │ • BattleActions  │ • GameTransitions.js  │
│ • GameStorage.js  │ • BattleCalcs    │                       │
├───────────────────┴──────────────────┴───────────────────────┤
│                      MANAGERS                                 │
├───────────────────────────────────────────────────────────────┤
│ • CharacterManager.js                                         │
│   - Character images                                          │
│   - Monster images                                            │
│   - Location images                                           │
│                                                               │
│ • DialogueManager.js                                          │
│ • ProgressManager.js                                          │
└───────────────────────────────────────────────────────────────┘
                              │
                              │ RENDERS TO
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                         index.html                            │
│                      (User Interface)                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Visual Asset Flow

```
 User Action          Code Request              System Response
     │                     │                          │
     │   "Show Weapon"     │                          │
     ├─────────────────────▶ getImagePath()          │
     │                     │     ('WEAPONS',          │
     │                     │      'SHORT_SWORD')      │
     │                     │           │              │
     │                     │           ▼              │
     │                     │   VISUAL_ASSETS.WEAPONS  │
     │                     │   .SHORT_SWORD           │
     │                     │           │              │
     │                     │           ▼              │
     │                     │   'Assets/Images/        │
     │                     │    shortSword.png'       │
     │                     │           │              │
     │                     │           ▼              │
     │  Display Image      │◀──────────┘              │
     │◀────────────────────┤                          │
     ▼                     │                          │
```

### Audio Asset Flow

```
 User Action          Code Request              System Response
     │                     │                          │
     │   "Attack Enemy"    │                          │
     ├─────────────────────▶ gameAudio.playSFX()     │
     │                     │     ('attack')           │
     │                     │           │              │
     │                     │           ▼              │
     │                     │   AUDIO_ASSETS.SFX       │
     │                     │   .ATTACK                │
     │                     │           │              │
     │                     │           ▼              │
     │                     │   Load cached audio      │
     │                     │   Clone for overlap      │
     │                     │   Apply volume           │
     │                     │           │              │
     │                     │           ▼              │
     │  Play Sound         │    audio.play()          │
     │◀────────────────────┤                          │
     ▼                     │                          │
```

---

## 🏗️ Component Relationships

### Weapon System Flow

```
┌─────────────────────────────────────────────────────────┐
│                    WEAPON LIFECYCLE                      │
└─────────────────────────────────────────────────────────┘

1. DEFINITION (GameLogic.js)
   │
   ├─▶ Weapon data created
   │   - name: 'Short Sword'
   │   - damage: 10
   │   - image: getImagePath('WEAPONS', 'SHORT_SWORD')
   │
2. STORAGE (Inventory)
   │
   ├─▶ Added to player inventory
   │   - inventory.weapons.push('Short Sword')
   │
3. DISPLAY (EquipmentModal.js)
   │
   ├─▶ Shown in equipment grid
   │   - Image loaded from weapon.image
   │   - Stats displayed
   │
4. EQUIPPING (GameLogic.js)
   │
   ├─▶ Set as equipped weapon
   │   - inventory.equippedWeapon = 'Short Sword'
   │
5. BATTLE (BattleLogic.js)
   │
   ├─▶ Used in combat
   │   - Damage calculated
   │   - Effects applied
   │
6. SOUND (GameAudio.js)
   │
   └─▶ Attack sound plays
       - gameAudio.playSFX('attack')
```

### Character Display Flow

```
┌─────────────────────────────────────────────────────────┐
│                  CHARACTER DISPLAY FLOW                  │
└─────────────────────────────────────────────────────────┘

Dialogue triggers
     │
     ▼
CharacterManager.updateDisplay()
     │
     ├─▶ Resolve character key
     │
     ├─▶ Get character data
     │   - characters['Eliza']
     │   - image: getImagePath('CHARACTERS', 'ELIZA')
     │
     ├─▶ Create CharacterComponent
     │   - Pass character data
     │   - Pass game logic
     │
     ├─▶ Render component
     │   - Show image
     │   - Show stats
     │   - Bind events
     │
     └─▶ Display to user
```

---

## 📦 Module Dependencies

```
┌────────────────────┐
│ VisualAssets.js    │ ◀─── Independent (no dependencies)
└────────────────────┘
         ▲
         │ IMPORTED BY
         │
    ┌────┴─────────────────────────────────────┐
    │                                           │
┌───┴───────────────┐          ┌───────────────┴──────┐
│ GameLogic.js      │          │ CharacterManager.js  │
│ (weapons/armor)   │          │ (characters/locs)    │
└───┬───────────────┘          └──────────────────────┘
    │                                    
    │ USED BY                            
    │                                    
┌───┴────────────────────────┐
│ BattlePreparation.js       │
│ EquipmentModal.js          │
│ CharacterComponent.js      │
└────────────────────────────┘


┌────────────────────┐
│ GameAudio.js       │ ◀─── Independent (no dependencies)
└────────────────────┘
         ▲
         │ IMPORTED BY
         │
    ┌────┴──────────────────────────────┐
    │                                    │
┌───┴─────────────┐      ┌──────────────┴────┐
│ BattleLogic.js  │      │ GameSettings.js   │
│ (battle sounds) │      │ (UI sounds)       │
└─────────────────┘      └───────────────────┘
         ▲
         │ USED BY
         │
┌────────┴───────────┐
│ BattleActions.js   │
│ EquipmentModal.js  │
└────────────────────┘
```

---

## 🎯 Asset Categories Mapping

```
┌──────────────────────────────────────────────────┐
│              VISUAL_ASSETS Structure              │
├──────────────────────────────────────────────────┤
│                                                   │
│  WEAPONS (4 items)                                │
│  ├─ RUSTY_KNIFE ────────▶ Starting weapon        │
│  ├─ SHORT_SWORD ────────▶ Common weapon          │
│  ├─ STEEL_AXE ──────────▶ Uncommon weapon        │
│  └─ BOW ────────────────▶ Ranged weapon          │
│                                                   │
│  ARMOR (2 items)                                  │
│  ├─ LEATHER_VEST ───────▶ Chest armor            │
│  └─ IRON_HELM ──────────▶ Head armor             │
│                                                   │
│  CONSUMABLES (2 items)                            │
│  ├─ HEALTH_POTION ──────▶ HP restoration         │
│  └─ MANA_POTION ────────▶ MP restoration         │
│                                                   │
│  CHARACTERS (6 items)                             │
│  ├─ ELIZA ──────────────▶ Main character         │
│  ├─ VIAL_IMDALL ────────▶ Archmage NPC           │
│  ├─ MERCHANT_RAGNOR ────▶ Shop keeper            │
│  ├─ SYLAS ──────────────▶ Rogue NPC              │
│  ├─ THIEF ──────────────▶ Player avatar          │
│  └─ ELIZA_WEBP ─────────▶ Alternative format     │
│                                                   │
│  MONSTERS (4 items)                               │
│  ├─ SHADOW_BEAST ───────▶ Level 3 enemy          │
│  ├─ SHARD_WARDEN ───────▶ Level 5 boss           │
│  ├─ BLOOD_BEAST ────────▶ Elite enemy            │
│  └─ HELL_DOGS ──────────▶ Pack enemy             │
│                                                   │
│  LOCATIONS (9 items)                              │
│  ├─ TOWN_SQUARE ────────▶ Starting area          │
│  ├─ DARK_ALLEY ─────────▶ Side path              │
│  ├─ MERCHANT_SHOP ──────▶ Shop location          │
│  ├─ BAZAAR_STREETS ─────▶ Market area (3 vars)   │
│  ├─ HIDDEN_PASSAGES ────▶ Secret area            │
│  ├─ SHARD_CHAMBER ──────▶ Boss room              │
│  └─ JOURNEY ────────────▶ Travel screen          │
│                                                   │
│  UI (6 items)                                     │
│  ├─ GOLD_ICON ──────────▶ Currency display       │
│  ├─ BACKPACK ───────────▶ Equipment toggle       │
│  ├─ GEM ────────────────▶ Stats toggle           │
│  ├─ SOUND ──────────────▶ Volume icon            │
│  ├─ FAVICON ────────────▶ Browser tab            │
│  └─ HEAL ───────────────▶ Healing indicator      │
│                                                   │
│  MISC (2 items)                                   │
│  ├─ DEFAULT_ICON ───────▶ Fallback image         │
│  └─ DICE_VIDEO ─────────▶ Dice roll animation    │
│                                                   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│               AUDIO_ASSETS Structure              │
├──────────────────────────────────────────────────┤
│                                                   │
│  SFX (5 items)                                    │
│  ├─ DICE ───────────────▶ Roll animation         │
│  ├─ ATTACK ─────────────▶ Combat action          │
│  ├─ DEFEND ─────────────▶ Defensive action       │
│  ├─ VICTORY ────────────▶ Battle won             │
│  └─ DEFEAT ─────────────▶ Battle lost            │
│                                                   │
│  MUSIC (4 items)                                  │
│  ├─ SLIMEBEAST ─────────▶ Slime battle theme     │
│  ├─ SHARDWARDEN ────────▶ Warden battle theme    │
│  ├─ SHADOWBEAST ────────▶ Shadow battle theme    │
│  └─ DEFAULT_BATTLE ─────▶ Fallback battle music  │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 🔍 Error Handling Flow

```
User requests asset
        │
        ▼
    getImagePath('WEAPONS', 'MAGIC_STAFF')
        │
        ├─▶ Check category exists?
        │   ├─ YES ──▶ Continue
        │   └─ NO ───▶ Console warning ──▶ Return DEFAULT_ICON
        │
        ├─▶ Check key exists?
        │   ├─ YES ──▶ Return asset path
        │   └─ NO ───▶ Console warning ──▶ Return DEFAULT_ICON
        │
        └─▶ Asset loaded successfully ✓
```

---

## 💡 Design Patterns Used

### 1. **Singleton Pattern** (GameAudio)
```
GameAudio instance created once
     │
     ├─▶ All imports get same instance
     ├─▶ Shared state (volume, current music)
     └─▶ Prevents duplicate audio loading
```

### 2. **Module Pattern** (VisualAssets)
```
VISUAL_ASSETS exported as constant
     │
     ├─▶ Immutable reference
     ├─▶ Single source of truth
     └─▶ Centralized management
```

### 3. **Factory Pattern** (Asset retrieval)
```
getImagePath(category, key)
     │
     ├─▶ Validates input
     ├─▶ Returns appropriate asset
     └─▶ Handles errors gracefully
```

---

**This architecture ensures:**
- ✅ Loose coupling between components
- ✅ Easy maintenance and updates
- ✅ Clear separation of concerns
- ✅ Scalable asset management
- ✅ Robust error handling

