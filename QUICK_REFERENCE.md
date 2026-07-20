# Quick Reference Guide

## 📂 Where Is Everything?

### HTML Files
- `index.html` - Entry point (redirects to splash)
- `screens/splash.html` - Splash screen
- `screens/start.html` - Main menu
- `screens/game.html` - Gameplay

### CSS Files
- `style.css` - Main CSS (imports all components)
- `styles/base.css` - Variables, fonts, resets
- `styles/splash-screen.css` - Splash screen styles
- `styles/start-page.css` - Menu styles
- `styles/game-page.css` - Game interface styles
- `styles/equipment-modal.css` - Equipment system
- `styles/character-components.css` - Character displays
- `styles/player-monster.css` - Stats and health bars
- `styles/modals.css` - Generic modals
- `styles/map-shop-modals.css` - Map and shop
- `styles/responsive.css` - Media queries

### JavaScript (Not Changed)
All JS files remain in their original locations:
- `core/` - Game logic, storage, settings
- `systems/` - Battle, audio, dialogue, map
- `ui/` - Equipment modal, shop modal, components
- `managers/` - Character, shop, dialogue
- `data/` - Player data, items, monsters

## 🎯 Quick Tasks

### "I need to change splash screen text"
→ Edit `screens/splash.html` (line ~30)

### "I need to adjust menu button"
→ Edit `screens/start.html` (line ~70)

### "I need to modify game layout"
→ Edit `screens/game.html` (line ~100+)

### "I need to change splash screen colors"
→ Edit `styles/splash-screen.css`

### "I need to adjust equipment modal"
→ Edit `styles/equipment-modal.css`

### "I need to change mobile layout"
→ Edit `styles/responsive.css`

### "I need to update CSS variables"
→ Edit `styles/base.css` (line ~18)

## 🔧 Common Edits

### Change Color Scheme
```css
File: styles/base.css
Line: ~18 (in :root)

--primary-blue: #007BFF;      ← Change this
--secondary-purple: #5c3d9e;  ← Change this
--success-green: #0ec20e;     ← Change this
```

### Add New Screen
```
1. Create screens/new-screen.html
2. Copy structure from existing screen
3. Update paths: ../Assets/, ../style.css
4. Link from another screen
```

### Add New CSS Component
```
1. Create styles/new-component.css
2. Add your styles
3. Edit style.css
4. Add: @import url('styles/new-component.css');
```

## 🚀 Start Development

### To Work on Splash Screen
1. Open `screens/splash.html`
2. Open `styles/splash-screen.css`
3. Edit and save
4. Refresh browser (Ctrl+F5)

### To Work on Game Screen
1. Open `screens/game.html`
2. Open relevant CSS file:
   - `styles/game-page.css` for layout
   - `styles/equipment-modal.css` for equipment
   - `styles/character-components.css` for character
3. Edit and save
4. Refresh browser (Ctrl+F5)

## 🐛 Troubleshooting

### Styles Not Showing
1. Clear browser cache (Ctrl+F5)
2. Check style.css has @import
3. Verify path: `@import url('styles/filename.css');`
4. Check browser console for errors

### Scripts Not Loading
1. Check path starts with `../` in screens folder
2. Verify script file exists
3. Check browser console for errors
4. Ensure module type: `type="module"`

### Assets Not Loading
1. Check path uses `../Assets/` in screens
2. Verify asset file exists
3. Check browser Network tab
4. Fix 404 errors

### Navigation Not Working
1. Check href points to correct file
2. Verify file exists in screens/
3. Test onclick functions
4. Check browser console

## 📱 Testing Quick Guide

### Test Navigation
1. Open index.html
2. Should redirect to splash
3. Click "Enter the Realm"
4. Should go to start menu
5. Click "Start"
6. Should load game

### Test Each Screen
```
splash.html:  Check particles, animations
start.html:   Check menu, sidebars, video
game.html:    Check all game features
```

### Test Responsive
```
Desktop:  1920px width
Laptop:   1366px width
Tablet:   768px width
Mobile:   375px width
```

## 📊 File Sizes

```
index.html:       ~1 KB
splash.html:      ~2 KB
start.html:       ~6 KB
game.html:        ~25 KB

base.css:         ~5 KB
splash-screen.css: ~7 KB
start-page.css:   ~6 KB
game-page.css:    ~18 KB
equipment-modal.css: ~17 KB
[etc...]
```

## 🎨 Color Variables Quick Reference

```css
/* Primary Colors */
--primary-blue: #007BFF
--primary-blue-light: #4a90e2
--secondary-purple: #5c3d9e

/* Status Colors */
--success-green: #0ec20e
--danger-red: #dc3545
--warning-yellow: #f6c204

/* Text Colors */
--text-light: #EdddE0
--text-dark: #11135c
--text-cyan: #0195ff

/* Background Colors */
--bg-dark: #0a0808
--bg-darker: rgba(10, 10, 10, 0.87)
--bg-overlay: rgba(0, 0, 0, 0.5)
```

## 🔗 Internal Links

```html
<!-- From root to screens -->
<a href="screens/splash.html">

<!-- Between screens -->
<a href="start.html">       (same folder)
<a href="game.html">        (same folder)

<!-- Assets from screens -->
<img src="../Assets/Images/file.png">
<link href="../style.css">
<script src="../core/file.js">
```

## ⚡ Performance Tips

### For CSS
- Keep component files focused
- Use CSS variables for consistency
- Minimize nested selectors
- Avoid !important

### For HTML
- Load critical scripts first
- Use defer for non-critical scripts
- Lazy load images when possible
- Minimize inline styles

### For Assets
- Optimize images before upload
- Use appropriate image formats
- Compress audio files
- Cache static assets

## 📖 Documentation Files

```
CSS_REORGANIZATION_SUMMARY.md     - CSS changes
HTML_REORGANIZATION_SUMMARY.md    - HTML changes
CSS_STRUCTURE_DIAGRAM.md          - CSS architecture
HTML_STRUCTURE_DIAGRAM.md         - HTML architecture
TESTING_CHECKLIST_CSS.md          - CSS testing
TESTING_CHECKLIST_HTML.md         - HTML testing
REORGANIZATION_COMPLETE.md        - Complete summary
QUICK_REFERENCE.md                - This file
styles/README.md                  - CSS components guide
```

## 🎯 Most Common Tasks

### 1. Change Splash Title
```html
File: screens/splash.html
Line: ~30
<h1 class="splash-title">Shadow of the Arcane</h1>
```

### 2. Update Menu Video
```html
File: screens/start.html
Line: ~85
<source src="../Assets/Audio/video.mp4">
```

### 3. Modify Game Title
```html
File: screens/game.html
Line: ~60
<p>Shadow of the arcane</p>
```

### 4. Add New Modal
```
1. Create HTML in screens/game.html
2. Create CSS in styles/modals.css
3. Add JavaScript handler
4. Test functionality
```

### 5. Update Colors
```css
File: styles/base.css
Edit: :root variables
Save: All components update automatically
```

## ✅ Checklist Before Deployment

- [ ] Test all navigation paths
- [ ] Verify all assets load
- [ ] Check console for errors
- [ ] Test on multiple browsers
- [ ] Test responsive layouts
- [ ] Verify audio works
- [ ] Test save/load functions
- [ ] Check performance
- [ ] Review all documentation
- [ ] Create backup

---

**Need more help? Check the full documentation files listed above!**
