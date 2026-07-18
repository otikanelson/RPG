# Character Component System

## Overview
The enhanced character sidebar system now uses individual character components that automatically display stats below character images when their names are called in the ProgressManager.

## How It Works

### 1. Character Detection
- When a dialogue starts, the ProgressManager calls `CharacterManager.onDialogueChange()`
- The CharacterManager looks at the `dialogue.characters` array to find characters
- It creates appropriate display components based on what's found

### 2. Character Types and Stats Display

#### **Player Characters** (isPlayer: true)
- Shows: Level bar (XP progress), Health bar, Gold counter
- Stats update in real-time based on gameLogic.stats
- Example: "Rift Walker" (Player)

#### **Monster Characters** 
- Shows: Level (static text), Health (full bar)
- Gets stats from BattleManager monster data
- Examples: "Shadow Beast", "Shard Warden", "Blood Beast"

#### **NPC Characters**
- Shows: Rank/Level (static text only)
- Examples: "V'ial Imdall" (Legendary), "Merchant Ragnor" (Common)

#### **Locations**
- Shows: Location name, image, description
- No stats displayed
- Examples: "Town Square", "Bazaar Streets"

### 3. Component Features

#### **Visual Elements**
- Character name in header with fantasy font
- Toggleable description overlay
- Character portrait with themed borders
- Stats panel with bars and values
- Responsive design for different screen sizes

#### **Interactive Features**
- Info button to toggle character description
- Automatic stats refresh when game state changes
- Smooth transitions and hover effects

## Implementation Details

### File Structure
```
ui/CharacterComponent.js    - Individual character component class
managers/CharacterManager.js - Updated to use components
managers/ProgressManager.js  - Initializes with game references
style.css                   - Component styles added
```

### Character Data Structure
Each character in `CharacterManager.characters` should have:
```javascript
{
    name: "Character Name",
    image: "Assets/character.png", 
    description: "Character description text",
    level: "Rank/Level text or number",
    isPlayer: boolean,           // true for player character
    bio: "Short bio text"
}
```

### Adding New Characters
1. Add character data to `CharacterManager.characters`
2. Add character name to dialogue `characters` array
3. For monsters, add mapping in `monsterBattleKeys`
4. Component will automatically display with appropriate stats

### Stats Updates
- **Player stats**: Auto-update from `gameLogic.stats`
- **Monster stats**: Pulled from `battleManager.monsters`
- **Manual refresh**: Call `characterManager.refreshSidebarStats()`

## Benefits

1. **Automatic Display**: Characters show with stats when called in dialogues
2. **Contextual Stats**: Different stat types for different character types  
3. **Reusable Components**: Clean, modular character display system
4. **Responsive Design**: Works on mobile and desktop
5. **Easy Extension**: Simple to add new character types and stats

## Usage Example

In a dialogue definition:
```javascript
{
    name: "MerchantEncounter",
    location: "Merchant's Shop", 
    characters: ["MerchantRagnor", "Player"],  // Both will show with stats
    texts: [
        {content: "The merchant greets you warmly..."}
    ]
}
```

This automatically displays:
- MerchantRagnor with "Common" rank
- Player with level/health/gold bars
- Both with character portraits and descriptions

The character component system makes the sidebar much more dynamic and informative while maintaining the immersive RPG experience!