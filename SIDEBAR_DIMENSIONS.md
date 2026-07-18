# Sidebar Image & Component Dimensions

## Fixed Dimensions Specifications

All images and components in the character sidebar now maintain consistent dimensions across all character types and screen sizes.

### 📐 **Desktop Dimensions (>768px)**

#### **Container**
- **Width**: 340px (min: 320px, max: 380px)
- **Height**: 500-600px (min: 500px, max: 600px)

#### **Header Section**
- **Height**: 60px (fixed)
- Contains character/location name and info button

#### **Character Images (with stats)**
- **Container**: 320px height × 100% width
- **Image**: Fills container with `object-fit: cover`
- **Border**: 3px solid border with rounded corners

#### **Character Images (no stats)**
- **Container**: 400px height × 100% width  
- **Image**: Fills container with `object-fit: cover`
- Used for characters without stats panels

#### **Location Images**
- **Container**: 320px height × 100% width
- **Image**: Fills container with `object-fit: cover`
- Always same size regardless of description length

#### **Stats Panel**
- **Height**: 80px (compact fixed height)
- **Content**: 2-3 stat rows at 20px each
- **Bars**: 6px height with thinner, more compact styling

### 📱 **Mobile Dimensions (≤768px)**

#### **Layout Change**
- **Direction**: Horizontal (row layout)
- **Total Height**: 400px (fixed)

#### **Header Section**
- **Width**: 60px (vertical text)
- **Height**: 100% (400px)

#### **Character Images**
- **Width**: 180px (with stats) / 100% (no stats)
- **Height**: 100% (400px)

#### **Stats Panel**
- **Width**: 120px (compact)
- **Height**: 100% (400px)
- **Rows**: Compactly stacked vertically

#### **Location Images**
- **Width**: 200px
- **Height**: 100% (400px)

### 🎯 **Key Benefits**

✅ **Consistent Image Sizes**: All character/location images maintain exact same dimensions  
✅ **Predictable Layout**: Stats panels always same height and position  
✅ **Responsive Design**: Switches to horizontal layout on mobile  
✅ **Proper Accommodation**: Character images sized to perfectly fit with stats  
✅ **No Layout Shifts**: Fixed dimensions prevent UI jumping  

### 🔧 **Implementation Details**

#### **CSS Classes for Dimension Control**
- `.character-image-container` - 320px height (with stats)
- `.character-image-container.no-stats` - 400px height (no stats)
- `.location-image-container` - 320px height (locations)
- `.character-stats-panel` - 80px height (compact fixed)

#### **Responsive Breakpoints**
- **1200px**: Slightly smaller dimensions
- **768px**: Switch to horizontal layout
- **480px**: Compact mobile view

#### **Image Handling**
- All images use `object-fit: cover` to fill containers
- Consistent 3px borders and rounded corners
- Same shadow effects across all image types
- Maintains aspect ratio while filling space

This ensures a polished, professional appearance where every image and component has predictable, consistent dimensions regardless of character type or content!