# Implementation Plan: Home Page Redesign - Shadow of the Arcane

## Overview

This implementation plan breaks down the home page redesign into discrete, actionable coding tasks. The design uses HTML5, CSS3, and vanilla JavaScript to create an immersive dark fantasy experience with smooth animations, responsive layouts, and accessible interactions. Tasks are organized to build incrementally from foundational structure through animations, responsive design, and final polish.

---

## Tasks

- [x] 1. Set up splash screen HTML structure and base styling
  - Create splash screen container with semantic HTML
  - Add 10 particle elements with unique identifiers
  - Add splash content (title, message, instruction, button)
  - Implement base CSS for splash screen positioning and layout
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 2. Implement splash screen background animations
  - [x] 2.1 Create background fade-in animation (3s, black to purple gradient)
    - Implement fadeInBackground keyframes
    - Apply animation to splash screen ::before pseudo-element
    - _Requirements: 7.3_
  
  - [x] 2.2 Implement title glow effect (eerie pulsing glow)
    - Create eerieGlow keyframes with multi-layer text-shadow
    - Apply 3s infinite animation to .splash-title
    - _Requirements: 1.2, 7.1_
  
  - [ ]* 2.3 Write property test for title glow animation
    - **Property 1: Glow intensity oscillates smoothly**
    - **Validates: Requirements 1.2, 7.1**
  
  - [x] 2.4 Implement message whisper animation (breathing effect)
    - Create whisper keyframes with opacity fade (0.7 to 1.0)
    - Apply 4s infinite animation to .splash-message
    - _Requirements: 1.1_
  
  - [x] 2.5 Implement instruction pulse animation
    - Create pulseGently keyframes for border and glow
    - Apply 2s infinite animation to .splash-instruction
    - _Requirements: 7.4_
  
  - [x] 2.6 Implement button fade-in animation (appears at 3s)
    - Create fadeInButton keyframes with 70% delay
    - Apply 3s animation to .splash-continue
    - _Requirements: 7.5_

- [x] 3. Implement particle system with CSS animations
  - [x] 3.1 Create particle styling and positioning
    - Style 10 .particle elements with absolute positioning
    - Set initial opacity and size
    - _Requirements: 1.1, 7.2_
  
  - [x] 3.2 Implement floatUp animation with variations
    - Create floatUp keyframes (translateY, translateX, opacity)
    - Apply unique duration and drift values to each particle (8-12s range)
    - Use CSS variables for --duration and --drift per particle
    - _Requirements: 1.1, 7.2_
  
  - [ ]* 3.3 Write property test for particle animation consistency
    - **Property 2: All particles complete animation cycle without visual glitches**
    - **Validates: Requirements 1.1, 7.2**

- [x] 4. Implement splash screen dismissal and transitions
  - [x] 4.1 Create dismissSplash() JavaScript function
    - Add .hidden class to splash screen
    - Set opacity to 0 with 2s ease-out transition
    - Hide splash screen after transition completes
    - _Requirements: 7.6, 3.6_
  
  - [x] 4.2 Implement splash screen button click handler
    - Attach onclick="dismissSplash()" to .splash-continue button
    - Provide immediate visual feedback (scale, glow intensification)
    - _Requirements: 3.2, 3.6_
  
  - [ ]* 4.3 Write unit test for splash screen dismissal
    - Test that splash screen fades out over 2 seconds
    - Test that start page becomes visible after dismissal
    - _Requirements: 7.6_

- [x] 5. Enhance start page HTML structure and base styling
  - [x] 5.1 Review and optimize start page HTML structure
    - Ensure semantic HTML for navigation, video container, button
    - Verify accessibility attributes (alt text, labels)
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 5.2 Implement start page base CSS styling
    - Create flexbox layout for start page container
    - Style navigation bar with proper spacing and positioning
    - Style video container with proper aspect ratio
    - Style start button with base colors and sizing
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 6. Implement navigation bar styling and interactions
  - [x] 6.1 Style navigation bar with dark fantasy aesthetic
    - Apply purple/blue color scheme to nav elements
    - Set font sizes and weights for readability
    - Position navigation at top of start page
    - _Requirements: 2.3, 4.1, 4.2, 8.2_
  
  - [x] 6.2 Implement navigation link hover effects
    - Create smooth color transition (200-300ms)
    - Add glow effect on hover (text-shadow with blue)
    - Apply scale or brightness effect
    - _Requirements: 3.3, 4.2, 6.1_
  
  - [x] 6.3 Implement dropdown menu styling
    - Style dropdown items with proper spacing
    - Add hover effects to dropdown items
    - Ensure dropdown is accessible and visible
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 6.4 Write unit test for navigation interactions
    - Test hover state triggers correctly
    - Test dropdown opens and closes
    - Test navigation links are keyboard accessible
    - _Requirements: 4.2, 10.2_

- [x] 7. Implement start button styling and interactions
  - [x] 7.1 Create start button base styling
    - Apply prominent size and positioning (center of screen)
    - Use purple/blue gradient background
    - Add glow effect with box-shadow
    - Set font size and weight for visibility
    - _Requirements: 2.1, 2.2, 8.3, 8.4_
  
  - [x] 7.2 Implement start button hover state
    - Scale button to 1.05x on hover (200ms transition)
    - Intensify glow effect
    - Change cursor to pointer
    - _Requirements: 3.1, 8.4_
  
  - [x] 7.3 Implement start button active state
    - Scale button to 0.98x on click (100ms)
    - Provide tactile feedback
    - _Requirements: 3.2_
  
  - [x] 7.4 Implement start button click handler
    - Transition to game page on click
    - Disable button during transition
    - _Requirements: 8.6_
  
  - [ ]* 7.5 Write property test for button state transitions
    - **Property 3: Button state transitions are smooth and reversible**
    - **Validates: Requirements 3.1, 3.2, 8.4**

- [x] 8. Implement video background with overlay
  - [x] 8.1 Style video container and video element
    - Set video container to full viewport size
    - Apply object-fit: cover for proper scaling
    - Ensure video loops and plays automatically
    - _Requirements: 1.3, 8.1_
  
  - [x] 8.2 Create dark overlay for video background
    - Add semi-transparent overlay (rgba with 0.3-0.5 opacity)
    - Use dark purple/blue gradient for fantasy aesthetic
    - Ensure overlay doesn't obscure video content
    - _Requirements: 1.4, 8.5_
  
  - [x] 8.3 Implement video fallback image
    - Add fallback image in CSS or HTML
    - Display fallback if video fails to load
    - _Requirements: 1.3_

- [x] 9. Implement visual effects and polish
  - [x] 9.1 Add glow effects to interactive elements
    - Apply box-shadow glow to buttons on hover
    - Apply text-shadow glow to navigation links
    - Use consistent purple/blue glow colors
    - _Requirements: 1.5, 9.2_
  
  - [x] 9.2 Implement gradient backgrounds
    - Apply purple/blue gradients to splash screen
    - Apply gradients to button backgrounds
    - Ensure gradients are smooth and consistent
    - _Requirements: 9.1, 9.5_
  
  - [x] 9.3 Add shadow effects to UI elements
    - Apply subtle shadows to buttons and containers
    - Use consistent shadow values from design
    - _Requirements: 9.2_
  
  - [ ]* 9.4 Write property test for visual consistency
    - **Property 4: All glow and shadow effects render consistently**
    - **Validates: Requirements 1.5, 9.1, 9.2**

- [x] 10. Implement responsive design for desktop (1920px+)
  - [x] 10.1 Verify desktop layout at 1920x1080
    - Ensure all elements display without overflow
    - Verify splash screen is centered and properly sized
    - Verify start page layout is optimal
    - _Requirements: 5.1_
  
  - [x] 10.2 Optimize font sizes for desktop
    - Set splash title to 64px
    - Set body text to 24px
    - Set button text to 20px
    - _Requirements: 5.1, 10.4_
  
  - [x] 10.3 Verify spacing and layout at desktop resolution
    - Ensure lg spacing (30px) is applied
    - Verify button sizing and positioning
    - _Requirements: 5.1_

- [x] 11. Implement responsive design for laptop (1366px - 1919px)
  - [x] 11.1 Create media query for laptop breakpoint
    - Add @media (max-width: 1919px) rule
    - Adjust font sizes (56px title, 22px body, 18px buttons)
    - _Requirements: 5.1_
  
  - [x] 11.2 Adjust layout for laptop screens
    - Verify video background scales properly
    - Verify navigation remains accessible
    - _Requirements: 5.1, 5.4_

- [x] 12. Implement responsive design for tablet (768px - 1365px)
  - [x] 12.1 Create media query for tablet breakpoint
    - Add @media (max-width: 1365px) rule
    - Adjust font sizes (48px title, 20px body, 16px buttons)
    - _Requirements: 5.2_
  
  - [x] 12.2 Adapt layout for tablet screens
    - Adjust spacing to md (20px)
    - Ensure video background maintains aspect ratio
    - Verify start button remains prominent
    - _Requirements: 5.2, 5.4_
  
  - [x] 12.3 Ensure touch targets are appropriately sized
    - Set minimum button height to 44px
    - Verify navigation links are easily tappable
    - _Requirements: 5.5_
  
  - [ ]* 12.4 Write unit test for tablet responsive layout
    - Test layout at 768px, 1024px, 1365px
    - Verify no overflow or distortion
    - _Requirements: 5.2_

- [x] 13. Implement responsive design for mobile (320px - 767px)
  - [x] 13.1 Create media query for mobile breakpoint
    - Add @media (max-width: 767px) rule
    - Adjust font sizes (36px title, 18px body, 16px buttons)
    - _Requirements: 5.3_
  
  - [x] 13.2 Adapt layout for mobile screens
    - Stack elements vertically
    - Adjust spacing to sm (10px)
    - Ensure full-width elements
    - _Requirements: 5.3_
  
  - [x] 13.3 Implement mobile-friendly navigation
    - Adapt navigation to mobile layout (hamburger or stacked)
    - Ensure navigation remains accessible
    - _Requirements: 5.6, 4.6_
  
  - [x] 13.4 Optimize start button for mobile
    - Make button full-width or larger touch target
    - Ensure minimum 44px height
    - _Requirements: 5.3, 5.5_
  
  - [x] 13.5 Optimize video background for mobile
    - Consider lazy loading for bandwidth
    - Ensure video scales properly on small screens
    - _Requirements: 5.3, 5.4_
  
  - [ ]* 13.6 Write unit test for mobile responsive layout
    - Test layout at 320px, 480px, 767px
    - Verify all elements are accessible
    - _Requirements: 5.3_

- [x] 14. Implement accessibility features
  - [x] 14.1 Ensure keyboard navigation works
    - Verify Tab key navigates through interactive elements
    - Verify Enter key activates buttons
    - Test on splash screen and start page
    - _Requirements: 10.2_
  
  - [x] 14.2 Implement focus states for interactive elements
    - Add visible focus outline to buttons
    - Add focus outline to navigation links
    - Ensure focus states are clearly visible
    - _Requirements: 10.3, 10.5_
  
  - [x] 14.3 Verify color contrast meets WCAG AA standards
    - Check text color contrast ratios
    - Verify interactive elements are distinguishable
    - _Requirements: 10.1, 10.6_
  
  - [x] 14.4 Ensure semantic HTML structure
    - Use proper heading hierarchy
    - Use semantic elements (nav, button, etc.)
    - _Requirements: 10.2_
  
  - [x] 14.5 Add ARIA labels where needed
    - Add aria-label to icon buttons
    - Add aria-hidden to decorative elements
    - _Requirements: 10.2_
  
  - [ ]* 14.6 Write unit test for accessibility features
    - Test keyboard navigation
    - Test focus states are visible
    - Test color contrast ratios
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 15. Optimize performance for 60fps animations
  - [x] 15.1 Verify CSS animations use GPU-accelerated properties
    - Use transform and opacity for animations
    - Avoid animating layout properties (width, height, position)
    - _Requirements: 9.6_
  
  - [x] 15.2 Optimize particle system performance
    - Verify particles use CSS animations (not JavaScript)
    - Limit to 10 particles
    - Use will-change sparingly
    - _Requirements: 9.3, 9.6_
  
  - [x] 15.3 Optimize video background loading
    - Implement lazy loading for video on mobile
    - Use efficient video codec (H.264)
    - _Requirements: 1.3_
  
  - [x] 15.4 Optimize font loading
    - Use font-display: swap for better performance
    - Preload fonts in HTML head
    - _Requirements: 9.6_
  
  - [ ]* 15.5 Write property test for animation performance
    - **Property 5: All animations maintain 60fps without frame drops**
    - **Validates: Requirements 9.3, 9.6**

- [x] 16. Implement cross-browser compatibility
  - [x] 16.1 Test on Chrome (latest)
    - Verify all animations work smoothly
    - Verify video background plays
    - Verify responsive design works
    - _Requirements: 9.6_
  
  - [x] 16.2 Test on Firefox (latest)
    - Verify CSS animations work
    - Verify video background plays
    - Verify layout is correct
    - _Requirements: 9.6_
  
  - [x] 16.3 Test on Safari (latest)
    - Verify animations work (may need -webkit prefixes)
    - Verify video background plays
    - Verify responsive design works
    - _Requirements: 9.6_
  
  - [x] 16.4 Test on Edge (latest)
    - Verify all features work
    - Verify layout is correct
    - _Requirements: 9.6_
  
  - [x] 16.5 Implement vendor prefixes where needed
    - Add -webkit- prefixes for Safari compatibility
    - Add -moz- prefixes for Firefox if needed
    - _Requirements: 9.6_
  
  - [ ]* 16.6 Write unit test for cross-browser compatibility
    - Test animations on multiple browsers
    - Test video fallback works
    - _Requirements: 9.6_

- [x] 17. Checkpoint - Ensure all animations and transitions work smoothly
  - Verify splash screen animations play without stuttering
  - Verify particle system animates smoothly
  - Verify button transitions are responsive
  - Verify page transitions are smooth
  - Test on desktop, tablet, and mobile
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Implement world-building and engagement elements
  - [x] 18.1 Enhance splash screen atmospheric text
    - Verify title "Shadow of the Arcane" is prominent
    - Verify message "The darkness awaits..." creates atmosphere
    - _Requirements: 6.1, 6.5_
  
  - [x] 18.2 Ensure start page suggests adventure and danger
    - Verify video background depicts dark fantasy scenes
    - Verify visual elements create sense of mystery
    - _Requirements: 6.2, 6.3_
  
  - [x] 18.3 Implement responsive interactions
    - Verify hover effects feel rewarding
    - Verify click feedback is satisfying
    - _Requirements: 6.4_
  
  - [x] 18.4 Ensure About section is accessible
    - Verify About link opens modal or page
    - Verify lore content is readable
    - _Requirements: 6.6_

- [x] 19. Final polish and visual refinement
  - [x] 19.1 Review all color usage for consistency
    - Verify purple/blue gradient is consistent
    - Verify glow colors match design
    - _Requirements: 2.5, 9.1_
  
  - [x] 19.2 Verify text readability and sizing
    - Ensure minimum 16px for body text
    - Verify font weights are appropriate
    - _Requirements: 10.4_
  
  - [x] 19.3 Add final shadow and glow effects
    - Verify all interactive elements have subtle effects
    - Ensure effects don't overwhelm the design
    - _Requirements: 9.2, 9.3_
  
  - [x] 19.4 Test all animations at different speeds
    - Verify animations feel natural
    - Verify timing is consistent
    - _Requirements: 3.4, 9.3_

- [x] 20. Final checkpoint - Ensure all tests pass and design is complete
  - Run all unit tests and verify they pass
  - Run all property tests and verify they pass
  - Test responsive design on all breakpoints
  - Test accessibility features
  - Verify cross-browser compatibility
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 17 and 20) ensure incremental validation
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples and edge cases
- All animations use CSS for optimal 60fps performance
- Responsive design uses mobile-first approach with progressive enhancement
- Accessibility is built in throughout, not added as an afterthought
- Cross-browser testing ensures compatibility with modern browsers
