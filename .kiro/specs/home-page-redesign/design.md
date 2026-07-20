# Home Page Redesign - Technical Design Document

## Overview

The "Shadow of the Arcane" home page redesign elevates the player's first impression through immersive visual effects, clear interaction patterns, and responsive layouts. The design maintains the dark fantasy aesthetic while introducing particle effects, smooth animations, and improved visual hierarchy to guide players toward starting the game.

The home page consists of two primary screens:
1. **Splash Screen**: An eerie, atmospheric introduction with animated particles and glowing text
2. **Start Page**: The main landing page with video background, navigation, and prominent start button

Both screens work together to create a cohesive, immersive experience that sets the tone for the game world.

---

## Architecture

### High-Level Component Structure

```
Home Page
├── Splash Screen
│   ├── Animated Background (gradient fade)
│   ├── Particle System (10+ floating particles)
│   ├── Title Text (glowing effect)
│   ├── Atmospheric Message
│   ├── Browser Zoom Instruction
│   └── "Enter the Realm" Button (fade-in after 3s)
│
└── Start Page
    ├── Navigation Bar
    │   ├── Settings Dropdown
    │   ├── Title (center)
    │   └── About Link
    ├── Video Background Container
    │   ├── Video Element (looping)
    │   └── Overlay (dark semi-transparent)
    ├── Start Button (prominent, center-positioned)
    └── Modals (Settings, About, etc.)
```

### Component Interaction Flow

```
User Loads Page
    ↓
Splash Screen Displays (0-3s)
    ├─ Background fades in
    ├─ Title glows
    ├─ Particles animate
    └─ "Enter the Realm" button fades in at 3s
    ↓
User Clicks "Enter the Realm"
    ↓
Splash Screen Fades Out (1-2s)
    ↓
Start Page Fades In
    ├─ Video background plays
    ├─ Navigation bar visible
    └─ Start button ready for interaction
    ↓
User Interacts with Start Page
    ├─ Hover effects on buttons
    ├─ Navigation opens modals
    └─ Start button transitions to game
```

### Technical Stack

- **HTML5**: Semantic structure with video and canvas support
- **CSS3**: Animations, gradients, flexbox, grid, media queries
- **JavaScript (Vanilla)**: Particle system, event handling, state management
- **Performance**: CSS animations preferred over JavaScript for 60fps smoothness

---

## Visual Design Specifications

### Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Glow | Purple | #8b7dd8 | Title, button glows |
| Primary Glow (Dark) | Dark Purple | #5c3d9e | Gradients, backgrounds |
| Secondary Glow | Blue | #4a90e2 | Accents, hover states |
| Text Primary | Light Beige | #EdddE0 | Main text |
| Text Secondary | Light Purple | #b8a8d8 | Secondary text |
| Background | Black | #000000 | Base background |
| Background Dark | Very Dark | #0a0808 | Overlay backgrounds |
| Success | Green | #0ec20e | Equipped items, confirmations |
| Danger | Red | #dc3545 | Warnings, errors |

### Typography

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Titles | EnglishTowne (serif) | 64px (splash), 32px (nav) | Normal | Main headings |
| Body Text | Seagram | 18-24px | Normal | Messages, instructions |
| UI Text | Seagram | 16-20px | Normal | Buttons, labels |
| Small Text | Seagram | 14px | Normal | Secondary info |

**Font Loading**:
```css
@font-face {
    font-family: 'EnglishTowne';
    src: url('fonts/EnglishTowne.ttf') format('truetype');
}

@font-face {
    font-family: 'Seagram';
    src: url('fonts/Seagram tfb.ttf') format('truetype');
}
```

### Spacing System

| Scale | Value | Usage |
|-------|-------|-------|
| xs | 5px | Micro spacing |
| sm | 10px | Small gaps |
| md | 20px | Standard spacing |
| lg | 30px | Large sections |

### Border Radius

| Scale | Value | Usage |
|-------|-------|-------|
| sm | 5px | Small elements |
| md | 10px | Medium elements |
| lg | 20px | Large containers |
| xl | 30px | Extra large containers |

### Shadows & Glows

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.3);
--shadow-lg: 5px 5px 10px rgba(0, 0, 0, 0.459);
--shadow-glow: 0 0 10px rgba(74, 144, 226, 0.5);
```

---

## Animation Specifications

### Splash Screen Animations

#### 1. Background Fade-In
- **Duration**: 3 seconds
- **Easing**: ease-in
- **Effect**: Transitions from pure black (#000000) to dark purple gradient (#1a0a2e → #0f0520)
- **Timing**: Starts immediately on page load

```css
@keyframes fadeInBackground {
    0% { opacity: 0; }
    100% { opacity: 1; }
}
```

#### 2. Title Glow (Eerie Glow)
- **Duration**: 3 seconds (infinite loop)
- **Easing**: ease-in-out
- **Effect**: Text shadow pulses between two intensities
- **Color**: Purple (#8b7dd8) with multiple shadow layers
- **Intensity**: Varies from 0.3 to 1.0 opacity

```css
@keyframes eerieGlow {
    0%, 100% {
        text-shadow: 0 0 20px rgba(139, 125, 216, 0.8),
                     0 0 40px rgba(139, 125, 216, 0.5),
                     0 0 60px rgba(139, 125, 216, 0.3);
    }
    50% {
        text-shadow: 0 0 30px rgba(139, 125, 216, 1),
                     0 0 60px rgba(139, 125, 216, 0.8),
                     0 0 90px rgba(139, 125, 216, 0.5);
    }
}
```

#### 3. Message Whisper
- **Duration**: 4 seconds (infinite loop)
- **Easing**: ease-in-out
- **Effect**: Opacity fades between 0.7 and 1.0
- **Purpose**: Creates a breathing, atmospheric effect

```css
@keyframes whisper {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
}
```

#### 4. Instruction Pulse
- **Duration**: 2 seconds (infinite loop)
- **Easing**: ease-in-out
- **Effect**: Border color and glow intensity pulse
- **Purpose**: Draws attention to the instruction text

```css
@keyframes pulseGently {
    0%, 100% {
        border-color: rgba(139, 125, 216, 0.3);
        box-shadow: 0 0 10px rgba(139, 125, 216, 0.2);
    }
    50% {
        border-color: rgba(139, 125, 216, 0.6);
        box-shadow: 0 0 20px rgba(139, 125, 216, 0.4);
    }
}
```

#### 5. Button Fade-In
- **Duration**: 3 seconds
- **Easing**: linear
- **Effect**: Button appears after 3 seconds (70% delay before fade)
- **Purpose**: Ensures button doesn't appear until splash screen is established

```css
@keyframes fadeInButton {
    0% { opacity: 0; }
    70% { opacity: 0; }
    100% { opacity: 1; }
}
```

#### 6. Content Ghostly Appear
- **Duration**: 2 seconds
- **Easing**: ease-in-out
- **Effect**: Content fades in while moving up 30px
- **Purpose**: Creates ethereal entrance effect

```css
@keyframes ghostlyAppear {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Particle System Animations

#### Particle Movement
- **Duration**: 8-12 seconds (varies per particle)
- **Easing**: linear
- **Effect**: Particles float upward with varying speeds
- **Opacity**: Fades from 0.8 to 0 as it rises
- **Horizontal Drift**: Slight random horizontal movement

```css
@keyframes floatUp {
    0% {
        transform: translateY(0) translateX(0);
        opacity: 0.8;
    }
    100% {
        transform: translateY(-500px) translateX(var(--drift));
        opacity: 0;
    }
}
```

**Particle Variations** (via CSS variables):
- Particle 1: 8s, drift: -20px
- Particle 2: 10s, drift: 15px
- Particle 3: 9s, drift: -10px
- Particle 4: 11s, drift: 25px
- Particle 5: 8.5s, drift: -15px
- Particle 6: 10.5s, drift: 20px
- Particle 7: 9.5s, drift: -25px
- Particle 8: 11.5s, drift: 10px
- Particle 9: 8.8s, drift: -5px
- Particle 10: 10.2s, drift: 30px

### Start Page Animations

#### Button Hover State
- **Duration**: 200ms
- **Easing**: ease
- **Effect**: Scale 1.05, glow intensifies
- **Purpose**: Immediate visual feedback

```css
.start-button:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(139, 125, 216, 0.6);
    transition: all 0.2s ease;
}
```

#### Button Active State
- **Duration**: 100ms
- **Easing**: ease
- **Effect**: Scale 0.98
- **Purpose**: Tactile feedback on click

```css
.start-button:active {
    transform: scale(0.98);
}
```

#### Navigation Link Hover
- **Duration**: 300ms
- **Easing**: ease
- **Effect**: Color brightens, glow appears
- **Purpose**: Indicates interactivity

```css
.nav-link:hover {
    color: #4a90e2;
    text-shadow: 0 0 15px rgba(74, 144, 226, 0.6);
    transition: all 0.3s ease;
}
```

#### Splash Screen Fade Out
- **Duration**: 1-2 seconds
- **Easing**: ease-out
- **Effect**: Opacity goes from 1 to 0
- **Purpose**: Smooth transition to start page

```css
#splashScreen.hidden {
    opacity: 0;
    pointer-events: none;
    transition: opacity 2s ease-out;
}
```

---

## Component Structure

### Splash Screen Component

**HTML Structure**:
```html
<div id="splashScreen">
    <div class="splash-particles">
        <div class="particle"></div>
        <!-- 10 particles total -->
    </div>
    <div class="splash-content">
        <h1 class="splash-title">Shadow of the Arcane</h1>
        <p class="splash-message">The darkness awaits...</p>
        <p class="splash-instruction">
            For the best experience, please zoom out your browser...
        </p>
        <button class="splash-continue" onclick="dismissSplash()">
            Enter the Realm
        </button>
    </div>
</div>
```

**CSS Classes**:
- `.splash-screen`: Main container, fixed positioning, full viewport
- `.splash-particles`: Container for particle elements
- `.particle`: Individual particle (10 instances)
- `.splash-content`: Text content wrapper
- `.splash-title`: Main title with glow effect
- `.splash-message`: Atmospheric message
- `.splash-instruction`: Browser zoom instruction
- `.splash-continue`: "Enter the Realm" button

### Start Page Component

**HTML Structure**:
```html
<div id="startPage">
    <nav class="NavBar">
        <ul>
            <li><a href="#">Settings ▾</a>
                <ul class="dropdown">
                    <li><a href="#">Audio</a></li>
                    <li><a href="#">Display</a></li>
                </ul>
            </li>
            <li><a href="#" id="title">Shadow of the Arcane</a></li>
            <li><a href="#">About</a></li>
        </ul>
    </nav>
    
    <div id="video-container">
        <video autoplay muted loop id="background-video">
            <source src="Assets/Images/mylivewallpapers-com-Night-Dragon-4K.mp4" type="video/mp4">
        </video>
    </div>
    
    <button id="startButton">Start</button>
</div>
```

**CSS Classes**:
- `.NavBar`: Navigation container
- `.dropdown`: Dropdown menu
- `#video-container`: Video background wrapper
- `#background-video`: Video element
- `#startButton`: Start button

---

## Responsive Breakpoints

### Desktop (1920px and above)
- **Splash Screen**: Full viewport, centered content
- **Start Page**: Full video background, navigation at top, start button centered
- **Font Sizes**: 64px title, 24px body, 20px buttons
- **Spacing**: Full lg spacing (30px)

### Laptop (1366px - 1919px)
- **Splash Screen**: Adjusted for smaller viewport
- **Start Page**: Video scales proportionally
- **Font Sizes**: 56px title, 22px body, 18px buttons
- **Spacing**: lg spacing (30px)

### Tablet (768px - 1365px)
- **Splash Screen**: Content remains centered, particles adjusted
- **Start Page**: Video background maintained, navigation adapts
- **Font Sizes**: 48px title, 20px body, 16px buttons
- **Spacing**: md spacing (20px)
- **Navigation**: Horizontal layout maintained, may wrap if needed
- **Start Button**: Larger touch target (minimum 44px height)

### Mobile (320px - 767px)
- **Splash Screen**: Optimized for small screens
- **Start Page**: Vertical layout, full-width elements
- **Font Sizes**: 36px title, 18px body, 16px buttons
- **Spacing**: sm spacing (10px)
- **Navigation**: Hamburger menu or stacked layout
- **Start Button**: Full-width or large touch target
- **Video Background**: May use fallback image on low-bandwidth devices

### Media Query Implementation

```css
/* Desktop (default) */
@media (max-width: 1919px) {
    /* Laptop adjustments */
}

@media (max-width: 1365px) {
    /* Tablet adjustments */
}

@media (max-width: 767px) {
    /* Mobile adjustments */
}

@media (max-width: 480px) {
    /* Small mobile adjustments */
}
```

---

## Interaction Flows

### User Journey 1: First-Time Player

```
1. Page Loads
   ├─ Splash screen displays with black background
   ├─ Background gradient fades in over 3 seconds
   ├─ Title appears with ghostly effect
   ├─ Particles begin floating upward
   └─ Message whispers in and out

2. At 3 Seconds
   └─ "Enter the Realm" button fades in

3. Player Clicks "Enter the Realm"
   ├─ Button provides immediate visual feedback (scale, glow)
   ├─ Splash screen begins fading out
   └─ Start page fades in

4. Start Page Visible
   ├─ Video background plays
   ├─ Navigation bar is visible
   ├─ Start button is prominent and ready
   └─ Player can interact with navigation or start game
```

### User Journey 2: Navigation Interaction

```
1. Player Hovers Over Navigation Link
   ├─ Link color brightens
   ├─ Glow effect appears
   └─ Cursor changes to pointer

2. Player Clicks Navigation Link
   ├─ Link provides visual feedback
   ├─ Modal or page opens
   └─ Content displays with fade-in animation

3. Player Closes Modal
   ├─ Modal fades out
   └─ Start page remains visible
```

### User Journey 3: Start Game

```
1. Player Hovers Over Start Button
   ├─ Button scales up (1.05x)
   ├─ Glow intensifies
   └─ Visual feedback confirms interactivity

2. Player Clicks Start Button
   ├─ Button scales down (0.98x) for tactile feedback
   ├─ Page transitions to game
   └─ Game initialization begins
```

---

## Technical Approach

### CSS Animations (Preferred)

**Advantages**:
- 60fps performance without JavaScript overhead
- GPU acceleration for smooth rendering
- Reduced CPU usage
- Better battery life on mobile devices

**Implementation**:
```css
/* Particle animation with CSS */
.particle {
    animation: floatUp var(--duration) linear infinite;
    --duration: 10s;
    --drift: 0px;
}

.particle:nth-child(1) {
    --duration: 8s;
    --drift: -20px;
}
```

### JavaScript Interactions

**Minimal JavaScript for**:
- Splash screen dismissal
- Modal open/close
- Event listeners for buttons
- State management

**Example**:
```javascript
function dismissSplash() {
    const splash = document.getElementById('splashScreen');
    splash.classList.add('hidden');
    
    setTimeout(() => {
        splash.style.display = 'none';
    }, 2000);
}
```

### Performance Considerations

1. **Video Background**:
   - Use H.264 codec for broad browser support
   - Provide fallback image for low-bandwidth devices
   - Mute video by default (autoplay policy)
   - Consider lazy loading on mobile

2. **Particle System**:
   - Use CSS animations instead of canvas
   - Limit to 10 particles for performance
   - Use transform and opacity (GPU-accelerated properties)

3. **Font Loading**:
   - Use font-display: swap for better performance
   - Preload fonts in HTML head
   - Consider system fonts as fallback

4. **Image Optimization**:
   - Use WebP format with PNG fallback
   - Compress images appropriately
   - Lazy load non-critical images

5. **Animation Optimization**:
   - Use will-change sparingly
   - Avoid layout thrashing
   - Use requestAnimationFrame for JavaScript animations
   - Prefer CSS transforms over position changes

### Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Features**: Flexbox, Grid, CSS Variables, Animations, Gradients
- **Video Format**: MP4 (H.264) with WebM fallback
- **Fallbacks**: Graceful degradation for older browsers

---

## Error Handling

### Video Background Failures
- **Fallback**: Display static image if video fails to load
- **Implementation**: Use `<source>` tags with fallback image in `<video>`

```html
<div id="video-container">
    <video autoplay muted loop id="background-video">
        <source src="video.mp4" type="video/mp4">
        <source src="video.webm" type="video/webm">
    </video>
    <img src="fallback.jpg" alt="Background" class="video-fallback">
</div>
```

### Font Loading Failures
- **Fallback**: Use system fonts (Seagram → sans-serif, EnglishTowne → serif)
- **Implementation**: CSS font-stack with system fonts

```css
font-family: 'EnglishTowne', 'Georgia', serif;
font-family: 'Seagram', 'Arial', sans-serif;
```

### JavaScript Errors
- **Graceful Degradation**: Page remains functional without JavaScript
- **Error Logging**: Log errors to console for debugging
- **User Feedback**: Display error messages if critical features fail

---

## Testing Strategy

### Unit Tests (Example-Based)

1. **Splash Screen Display**
   - Verify splash screen appears on page load
   - Verify button appears after 3 seconds
   - Verify dismissal function works correctly

2. **Navigation Functionality**
   - Verify navigation links are clickable
   - Verify modals open and close
   - Verify navigation state persists

3. **Start Button Functionality**
   - Verify start button transitions to game page
   - Verify button is disabled during transition
   - Verify game page loads correctly

### Integration Tests

1. **Page Transitions**
   - Verify splash screen → start page transition
   - Verify start page → game page transition
   - Verify smooth fade effects

2. **Video Background**
   - Verify video loads and plays
   - Verify video loops correctly
   - Verify fallback image displays if video fails

3. **Responsive Layout**
   - Verify layout adapts to different screen sizes
   - Verify touch targets are appropriately sized
   - Verify navigation remains accessible

### Performance Tests

1. **Animation Performance**
   - Verify animations run at 60fps
   - Verify no jank or stuttering
   - Verify CPU/GPU usage is reasonable

2. **Load Time**
   - Verify page loads within 3 seconds
   - Verify video background loads efficiently
   - Verify fonts load without blocking rendering

3. **Memory Usage**
   - Verify no memory leaks
   - Verify particle system doesn't consume excessive memory
   - Verify modals clean up properly

### Accessibility Tests

1. **Keyboard Navigation**
   - Verify all interactive elements are reachable via Tab
   - Verify Enter key activates buttons
   - Verify focus states are visible

2. **Color Contrast**
   - Verify text meets WCAG AA standards
   - Verify interactive elements are distinguishable
   - Verify color is not the only indicator

3. **Screen Reader Compatibility**
   - Verify semantic HTML structure
   - Verify ARIA labels where needed
   - Verify alt text for images

---

## Implementation Checklist

- [ ] Create splash screen HTML structure
- [ ] Implement splash screen CSS animations
- [ ] Create particle system with CSS
- [ ] Implement splash screen dismissal JavaScript
- [ ] Create start page HTML structure
- [ ] Implement start page CSS styling
- [ ] Implement navigation functionality
- [ ] Implement start button functionality
- [ ] Add video background with fallback
- [ ] Implement responsive design
- [ ] Test on desktop, tablet, mobile
- [ ] Optimize performance
- [ ] Test accessibility
- [ ] Cross-browser testing
- [ ] Deploy to production

