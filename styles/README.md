# CSS Component Structure

This directory contains organized CSS files for the Shadow of the Arcane RPG game.

## File Organization

### `base.css`
**Foundation styles and utilities**
- Font-face declarations
- CSS custom properties (variables)
- Global resets and base styles
- Utility classes (fade-in, slide-up, glow)
- Common animations (fadeIn, slideUp, pulse, etc.)
- Accessibility styles (focus states, visually-hidden)
- Print styles

### `splash-screen.css`
**Splash screen and initial loading**
- Eerie splash screen with particles effect
- Ghostly title animations
- Loading spinner animation
- Splash screen transitions

### `start-page.css`
**Main menu and start page**
- Start page layout
- Navigation bar with gradient effects
- Start button with pulse animation
- Video background container
- Navigation sidebars (settings, about)
- Sidebar overlays and transitions

### `modals.css`
**Generic modal and popup system**
- Base popup/modal styles
- Settings modal
- Battle preparation modal
- Modal tabs and panels
- Item cards for modals
- Modal headers, footers, and close buttons

### `equipment-modal.css`
**Equipment inventory management**
- Equipment modal overlay and content
- Equipment grid layouts
- Drag-and-drop zones
- Equipment item cards with stats
- Armor slot system (3-column grid)
- Battle ready footer
- Equipped weapon/potion displays
- Unequip buttons and interactions

### `game-page.css`
**Main gameplay interface**
- Game page layout and structure
- Navigation bar (in-game)
- Story narration section
- Text display with dice roll
- Story functions bar
- Player stats box with bars
- Dialogue section and buttons
- Equipped items display
- Toggle buttons for stats/equipment

### `character-components.css`
**Character and location displays**
- Character info sidebar
- Character component system
- Character header with info button
- Character image containers
- Character stats panel (compact)
- Location display component
- Character description overlay
- Legacy character components

### `player-monster.css`
**Player and monster statistics**
- Player info panel
- Experience bar with glow
- Health bar with critical state
- Gold/money display with coin spin
- Inventory section
- Monster stats display
- Monster health bar with pulse
- Monster name and level display

### `map-shop-modals.css`
**World map and shop interfaces**
- World map modal system
- Map viewport and connections
- Interactive location nodes
- Location tooltips
- Shop modal overlay
- Shop navigation tabs
- Shop item grid and cards
- Shop footer with gold display

### `responsive.css`
**Media queries for all screen sizes**
- Laptop screens (1366px - 1919px)
- Tablet screens (768px - 1365px)
- Mobile screens (320px - 767px)
- Small mobile (320px - 480px)
- Responsive adjustments for all components
- Layout changes for different viewports

## Usage

All component CSS files are imported in the main `style.css` file using `@import` statements. The browser will load them in order:

```css
@import url('styles/base.css');
@import url('styles/splash-screen.css');
@import url('styles/start-page.css');
/* ... etc */
```

## Benefits of This Structure

1. **Maintainability**: Easy to find and edit specific component styles
2. **Scalability**: Add new components without bloating existing files
3. **Collaboration**: Multiple developers can work on different files
4. **Performance**: Browser can cache individual files
5. **Organization**: Clear separation of concerns
6. **Debugging**: Easier to locate and fix style issues

## Naming Conventions

- **Files**: kebab-case (e.g., `equipment-modal.css`)
- **Classes**: kebab-case (e.g., `.equipment-modal-content`)
- **IDs**: camelCase (e.g., `#monsterStats`)
- **Variables**: kebab-case with double dash (e.g., `--primary-blue`)

## CSS Variables

All colors, spacing, transitions, and common values are defined as CSS custom properties in `base.css` under the `:root` selector. This ensures consistency across all components.

### Color Variables
- `--primary-blue`, `--primary-blue-dark`, `--primary-blue-light`
- `--secondary-purple`, `--secondary-purple-dark`
- `--success-green`, `--danger-red`, `--warning-yellow`
- `--text-light`, `--text-dark`, `--text-blue`, `--text-cyan`
- `--bg-dark`, `--bg-darker`, `--bg-semi-dark`, `--bg-overlay`

### Spacing Variables
- `--spacing-xs` (5px)
- `--spacing-sm` (10px)
- `--spacing-md` (20px)
- `--spacing-lg` (30px)

### Other Variables
- Border radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- Transitions: `--transition-fast`, `--transition-normal`, `--transition-slow`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`

## Browser Compatibility

The CSS uses modern features like:
- CSS Custom Properties (CSS Variables)
- CSS Grid
- Flexbox
- @import statements
- Animations and transitions

Ensure your target browsers support these features or provide fallbacks where necessary.

## Future Improvements

Consider these enhancements for the future:
1. Migrate to CSS-in-JS for component-scoped styles
2. Use CSS preprocessors (SASS/LESS) for nesting and mixins
3. Implement CSS modules for better encapsulation
4. Add dark/light theme support using CSS variables
5. Optimize critical CSS for faster initial load
