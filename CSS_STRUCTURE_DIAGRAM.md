# CSS Architecture Diagram

## File Structure

```
RPG/
│
├── style.css (Main entry point - 22 lines)
│   │
│   └── @imports all component files ↓
│
└── styles/
    │
    ├── base.css (210 lines)
    │   ├── Fonts (@font-face)
    │   ├── CSS Variables (:root)
    │   ├── Global Resets (*, body)
    │   ├── Utility Classes (.fade-in, .glow)
    │   ├── Animations (@keyframes)
    │   └── Accessibility (focus, print)
    │
    ├── splash-screen.css (274 lines)
    │   ├── #splashScreen
    │   ├── .splash-title, .splash-message
    │   ├── .splash-particles, .particle
    │   ├── .loader-container, .loader
    │   └── Ghostly animations
    │
    ├── start-page.css (260 lines)
    │   ├── #startPage
    │   ├── .NavBar, ul, li
    │   ├── #startButton
    │   ├── #video-container
    │   └── .nav-sidebar (left/right)
    │
    ├── modals.css (336 lines)
    │   ├── .popup
    │   ├── .battle-prep-modal
    │   ├── .modal-content
    │   ├── .modal-tabs, .tab-btn
    │   └── .item-card
    │
    ├── equipment-modal.css (683 lines)
    │   ├── .equipment-modal
    │   ├── .equipment-modal-content
    │   ├── .equipment-grid
    │   ├── .equipment-item
    │   ├── #equippedArmorZone (3-col grid)
    │   ├── .battle-ready-footer
    │   └── Drag-and-drop zones
    │
    ├── game-page.css (717 lines)
    │   ├── #gamePage
    │   ├── .navBar (in-game)
    │   ├── #Game (main layout)
    │   ├── .storySection
    │   │   ├── .storyNar
    │   │   ├── .text, #text
    │   │   └── .diceRoll, #dice
    │   ├── .storyFunctions
    │   │   ├── .player-stats-box
    │   │   ├── .toggle-stats-equipment
    │   │   └── .equipped-stats-container
    │   ├── .dialogue, .dialogueBtns
    │   └── .equipped, .equippedBox
    │
    ├── character-components.css (554 lines)
    │   ├── #characterInfo
    │   ├── .character-component
    │   │   ├── .character-header
    │   │   ├── .character-display
    │   │   ├── .character-image-container
    │   │   ├── .character-stats-panel
    │   │   └── .character-description
    │   ├── .location-display
    │   │   ├── .location-header
    │   │   ├── .location-image-container
    │   │   └── .location-description
    │   └── Legacy components (.char, .CharImg)
    │
    ├── player-monster.css (370 lines)
    │   ├── .playerInfo
    │   │   ├── .playerStats
    │   │   ├── .experience, .xpBar
    │   │   ├── .health, .healthBar
    │   │   ├── .Money, #goldCoin
    │   │   └── #inventory
    │   └── #monsterStats
    │       ├── .monster-health-container
    │       ├── .monster-name
    │       ├── .progress-container
    │       └── .monsterHealthBar
    │
    ├── map-shop-modals.css (337 lines)
    │   ├── .map-modal
    │   │   ├── .map-modal-content
    │   │   ├── .map-viewport
    │   │   ├── .map-connections
    │   │   ├── .map-nodes-container
    │   │   └── .map-node (interactive)
    │   └── .shop-modal-overlay
    │       ├── .shop-modal-container
    │       ├── .shop-navigation-tabs
    │       ├── .shop-items-grid
    │       ├── .shop-item-card
    │       └── .shop-footer-bar
    │
    ├── responsive.css (502 lines)
    │   ├── @media (max-width: 1919px) Laptop
    │   ├── @media (max-width: 1365px) Tablet
    │   ├── @media (max-width: 968px)  Mid-mobile
    │   ├── @media (max-width: 767px)  Mobile
    │   └── @media (max-width: 480px)  Small mobile
    │
    └── README.md (Documentation)
```

## Import Chain

```
index.html
    └── <link rel="stylesheet" href="style.css">
            └── style.css
                ├── @import 'styles/base.css'
                ├── @import 'styles/splash-screen.css'
                ├── @import 'styles/start-page.css'
                ├── @import 'styles/modals.css'
                ├── @import 'styles/equipment-modal.css'
                ├── @import 'styles/game-page.css'
                ├── @import 'styles/character-components.css'
                ├── @import 'styles/player-monster.css'
                ├── @import 'styles/map-shop-modals.css'
                └── @import 'styles/responsive.css'
```

## Component Dependencies

```
base.css (Foundation - No dependencies)
    │
    ├─── All other files depend on base.css for:
    │    ├── CSS Variables (colors, spacing, transitions)
    │    ├── Common animations (fadeIn, slideUp, pulse)
    │    └── Utility classes (glow, fade-in, etc.)
    │
    ├─── splash-screen.css (Uses base animations)
    │
    ├─── start-page.css (Uses base variables)
    │
    ├─── modals.css (Uses base modal patterns)
    │    │
    │    └─── equipment-modal.css (Extends modal.css patterns)
    │
    ├─── game-page.css (Main gameplay container)
    │    │
    │    ├─── character-components.css (Lives in game-page)
    │    │
    │    └─── player-monster.css (Lives in game-page)
    │
    ├─── map-shop-modals.css (Overlay modals)
    │
    └─── responsive.css (Adjusts all components)
         └── Must be loaded LAST to override base styles
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│ Application Flow                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. SPLASH SCREEN          (splash-screen.css)              │
│     ↓ Click continue                                        │
│                                                              │
│  2. START PAGE             (start-page.css)                 │
│     ├── Settings Sidebar   (start-page.css)                │
│     └── About Sidebar      (start-page.css)                │
│     ↓ Click start                                          │
│                                                              │
│  3. GAME PAGE              (game-page.css)                  │
│     ├── Left: Character    (character-components.css)      │
│     │   └── Stats Panel    (character-components.css)      │
│     │                                                        │
│     ├── Center/Right:                                       │
│     │   ├── Story Section  (game-page.css)                 │
│     │   ├── Player Stats   (player-monster.css)            │
│     │   ├── Monster Stats  (player-monster.css)            │
│     │   └── Dialogue Btns  (game-page.css)                 │
│     │                                                        │
│     └── Modals (Overlays):                                 │
│         ├── Equipment      (equipment-modal.css)           │
│         ├── World Map      (map-shop-modals.css)           │
│         ├── Shop           (map-shop-modals.css)           │
│         └── Settings       (modals.css)                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## CSS Variables Flow

```
base.css defines:
    ├── --primary-blue
    ├── --spacing-md
    ├── --transition-normal
    └── ... (50+ variables)
        │
        └─── Used throughout all components:
             │
             ├── game-page.css
             │   └── .navBar { gap: var(--spacing-sm); }
             │
             ├── equipment-modal.css
             │   └── .equipment-item { transition: var(--transition-normal); }
             │
             └── responsive.css
                 └── Inherits all variables
```

## Animation Flow

```
base.css defines:
    @keyframes fadeIn { ... }
    @keyframes slideUp { ... }
    @keyframes pulse { ... }
        │
        └─── Reused in components:
             │
             ├── splash-screen.css
             │   └── .splash-content { animation: fadeIn 2s; }
             │
             ├── modals.css
             │   └── .modal-content { animation: slideUp 0.4s; }
             │
             └── start-page.css
                 └── #startButton { animation: pulse 2s infinite; }
```

## Size Comparison

```
BEFORE Reorganization:
├── style.css: 4,243 lines (100% in one file)

AFTER Reorganization:
├── style.css: 22 lines (0.5%)
└── styles/
    ├── base.css: 210 lines (5%)
    ├── splash-screen.css: 274 lines (6.5%)
    ├── start-page.css: 260 lines (6%)
    ├── modals.css: 336 lines (8%)
    ├── equipment-modal.css: 683 lines (16%)
    ├── game-page.css: 717 lines (17%)
    ├── character-components.css: 554 lines (13%)
    ├── player-monster.css: 370 lines (9%)
    ├── map-shop-modals.css: 337 lines (8%)
    └── responsive.css: 502 lines (12%)
    ────────────────────────────────────────
    Total: ~4,243 lines (same content, organized)
```

## Maintainability Score

```
BEFORE: ⭐⭐ (2/5)
- One massive file
- Hard to navigate
- Merge conflicts likely
- Difficult to find specific styles

AFTER: ⭐⭐⭐⭐⭐ (5/5)
- 10 focused files
- Clear organization
- Easy to navigate
- Component-based structure
- Self-documenting file names
```
