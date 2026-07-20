# Quick Asset Reference Card

## 🎨 Visual Assets (Images)

### Basic Usage
```javascript
import { getImagePath } from '../systems/VisualAssets.js';

// Get any image path
const image = getImagePath('CATEGORY', 'ASSET_KEY');
```

### Quick Reference Table

| Category | Common Keys | Example |
|----------|-------------|---------|
| **WEAPONS** | RUSTY_KNIFE, SHORT_SWORD, STEEL_AXE, BOW | `getImagePath('WEAPONS', 'SHORT_SWORD')` |
| **ARMOR** | LEATHER_VEST, IRON_HELM | `getImagePath('ARMOR', 'IRON_HELM')` |
| **CONSUMABLES** | HEALTH_POTION, MANA_POTION | `getImagePath('CONSUMABLES', 'HEALTH_POTION')` |
| **CHARACTERS** | ELIZA, SYLAS, MERCHANT_RAGNOR | `getImagePath('CHARACTERS', 'ELIZA')` |
| **MONSTERS** | SHADOW_BEAST, SHARD_WARDEN, BLOOD_BEAST | `getImagePath('MONSTERS', 'SHADOW_BEAST')` |
| **LOCATIONS** | TOWN_SQUARE, BAZAAR_STREETS | `getImagePath('LOCATIONS', 'TOWN_SQUARE')` |
| **UI** | GOLD_ICON, BACKPACK, GEM, SOUND | `getImagePath('UI', 'GOLD_ICON')` |
| **MISC** | DEFAULT_ICON, DICE_VIDEO | `getImagePath('MISC', 'DICE_VIDEO')` |

---

## 🔊 Game Audio (Sounds & Music)

### Basic Usage
```javascript
import gameAudio from '../systems/GameAudio.js';

// Play sound effects
gameAudio.playSFX('dice');
gameAudio.playSFX('attack');

// Play music (looping)
gameAudio.playMusic('slimebeast');

// Control volume
gameAudio.setMasterVolume(0.5);  // 0.0 to 1.0
gameAudio.setSFXVolume(0.8);
gameAudio.setMusicVolume(0.6);

// Stop everything
gameAudio.stopAll();
```

### Available Sounds

#### 🎵 Sound Effects (SFX)
```javascript
gameAudio.playSFX('dice');      // Dice roll sound
gameAudio.playSFX('attack');    // Attack sound
gameAudio.playSFX('defend');    // Defend sound
gameAudio.playSFX('victory');   // Victory fanfare
gameAudio.playSFX('defeat');    // Defeat sound
```

#### 🎶 Music Tracks
```javascript
gameAudio.playMusic('slimebeast');     // Slime battle theme
gameAudio.playMusic('shardwarden');    // Shard warden battle
gameAudio.playMusic('shadowbeast');    // Shadow beast battle
gameAudio.playMusic('default_battle'); // Default battle music
```

---

## 🚀 Common Patterns

### Pattern 1: Displaying Weapon Image
```javascript
const weaponName = 'Short Sword';
const weapon = gameLogic.weapons[weaponName];

// The weapon object already has the image path!
const imgElement = document.createElement('img');
imgElement.src = weapon.image;  // Already uses getImagePath internally
```

### Pattern 2: Playing Battle Sounds
```javascript
// In battle start
gameAudio.playMusic('shadowbeast');

// During attack
gameAudio.playSFX('attack');

// During defense
gameAudio.playSFX('defend');

// Battle end
gameAudio.playSFX('victory');
gameAudio.stopAll();  // Stop music
```

### Pattern 3: Showing Character
```javascript
const character = characterManager.characters['Eliza'];

// Character object already has image from VisualAssets
const charImage = character.image;  // Already centralized!
```

### Pattern 4: Adding New Weapon
```javascript
// 1. Add image to VisualAssets.js
WEAPONS: {
    // ...existing weapons
    LEGENDARY_BLADE: 'Assets/Images/LegendaryBlade.png'
}

// 2. Add weapon to GameLogic.js
this.weapons = {
    // ...existing weapons
    'Legendary Blade': {
        damage: 25,
        cost: 100,
        image: getImagePath('WEAPONS', 'LEGENDARY_BLADE'),
        type: 'sword',
        rarity: 'legendary',
        description: 'A blade of legend.'
    }
};

// 3. That's it! Use it anywhere in the game.
```

---

## ⚠️ Common Mistakes

### ❌ DON'T DO THIS:
```javascript
// Hardcoded path
const image = 'Assets/Images/sword.png';

// Manual audio creation
const audio = new Audio('Assets/Audio/attack.mp3');
audio.play();

// Lowercase keys
getImagePath('weapons', 'short_sword');  // WRONG!
```

### ✅ DO THIS INSTEAD:
```javascript
// Use centralized system
const image = getImagePath('WEAPONS', 'SHORT_SWORD');

// Use game audio system
gameAudio.playSFX('attack');

// Uppercase keys
getImagePath('WEAPONS', 'SHORT_SWORD');  // CORRECT!
```

---

## 🔧 Debugging Tips

### Image not showing?
```javascript
// Check what path you're getting
const path = getImagePath('WEAPONS', 'SHORT_SWORD');
console.log('Image path:', path);

// Check for typos in the key
// Remember: keys are UPPERCASE, category is UPPERCASE
```

### Sound not playing?
```javascript
// Check if audio is loaded
console.log('Audio assets:', AUDIO_ASSETS);

// Test volume settings
gameAudio.setMasterVolume(1.0);
gameAudio.setSFXVolume(1.0);
gameAudio.playSFX('dice');
```

### Fallback not working?
```javascript
// getImagePath automatically returns DEFAULT_ICON for missing assets
// Check console for warnings:
// "[VisualAssets] Missing asset in path: VISUAL_ASSETS.WEAPONS.UNKNOWN_KEY"
```

---

## 📝 Adding New Assets Checklist

### For Images:
- [ ] Place image in `Assets/Images/` folder
- [ ] Add entry to `systems/VisualAssets.js` in appropriate category
- [ ] Use UPPERCASE snake_case for key (e.g., `LEATHER_VEST`)
- [ ] Test with `getImagePath('CATEGORY', 'KEY')`

### For Audio:
- [ ] Place audio file in `Assets/Audio/` folder
- [ ] Add entry to `systems/GameAudio.js` in SFX or MUSIC
- [ ] Audio is automatically preloaded on page load
- [ ] Test with `gameAudio.playSFX('key')` or `gameAudio.playMusic('key')`

---

## 💡 Pro Tips

1. **Batch Operations**: Import VISUAL_ASSETS to loop through all assets in a category
   ```javascript
   import { VISUAL_ASSETS } from '../systems/VisualAssets.js';
   
   Object.keys(VISUAL_ASSETS.WEAPONS).forEach(weaponKey => {
       console.log(weaponKey); // RUSTY_KNIFE, SHORT_SWORD, etc.
   });
   ```

2. **Type Safety**: Keys are case-sensitive. Always use UPPERCASE for consistency.

3. **Performance**: Assets are preloaded, so `playSFX()` and `playMusic()` are instant.

4. **Volume Persistence**: Volume settings are managed by GameAudio singleton and apply to all sounds.

5. **Auto-cloning**: SFX sounds are automatically cloned, so you can play the same sound multiple times simultaneously.

---

**Keep this card handy when working with assets!** 🎮
