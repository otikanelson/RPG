# 🧪 Asset System Testing Checklist

Use this checklist to verify that the asset integration is working correctly.

---

## 🎨 Visual Assets Testing

### Weapons Display
- [ ] Open equipment modal (click backpack icon)
- [ ] Verify "Rusty Knife" displays with correct image
- [ ] Verify "Short Sword" displays with correct image
- [ ] Verify "Steel Axe" displays with correct image
- [ ] Verify "Bow" displays with correct image
- [ ] Check that weapon stats (damage, cost) appear correctly
- [ ] Try equipping each weapon - image should update in equipped slot

**Expected Result:** All weapons show their proper images without broken image icons.

---

### Armor Display
- [ ] Open equipment modal
- [ ] Navigate to armor section
- [ ] Verify "Leather Vest" displays with correct image
- [ ] Verify "Iron Helm" displays with correct image
- [ ] Try equipping armor pieces to different slots
- [ ] Verify armor stats (defense) display correctly

**Expected Result:** All armor pieces show their proper images and can be equipped.

---

### Consumables Display
- [ ] Open equipment modal
- [ ] Navigate to consumables section
- [ ] Verify "Health Potion" displays with red potion icon
- [ ] Verify "Mana Potion" displays with blue potion icon
- [ ] Check that quantity shows correctly (e.g., "Owned: 2")

**Expected Result:** All consumables show correct images and quantities.

---

### Character Images
- [ ] Start a new game or load existing save
- [ ] Verify Eliza's portrait appears in character panel
- [ ] Advance dialogue to meet different NPCs:
  - [ ] V'ial Imdall (archmage)
  - [ ] Merchant Ragnor (shop keeper)
  - [ ] Sylas (rogue)
- [ ] Each character should show a unique portrait
- [ ] Toggle character description (info button) - should work smoothly

**Expected Result:** All character portraits load correctly and switch between characters.

---

### Monster Images
- [ ] Enter a battle with Shadow Beast
  - [ ] Verify monster image shows
  - [ ] Check monster stats display
- [ ] Battle Shard Warden
  - [ ] Verify boss image shows
  - [ ] Check health bar updates
- [ ] Test other monsters if available

**Expected Result:** Monster portraits appear during battles with correct stats.

---

### Location Images
- [ ] Travel to different locations:
  - [ ] Town Square
  - [ ] Dark Alley
  - [ ] Merchant's Shop
  - [ ] Bazaar Streets
  - [ ] Hidden Passages
  - [ ] Shard Chamber
- [ ] Verify each location shows appropriate background image
- [ ] Check that location descriptions appear

**Expected Result:** Location backgrounds change appropriately when traveling.

---

### UI Elements
- [ ] Check gold icon displays next to gold amount
- [ ] Verify backpack icon shows on equipment toggle button
- [ ] Verify gem icon shows on stats toggle button
- [ ] Check sound icon in settings menu
- [ ] Verify browser tab shows favicon

**Expected Result:** All UI icons appear correctly throughout the interface.

---

### Fallback Behavior
- [ ] Open browser console (F12)
- [ ] Look for any warnings about missing assets
- [ ] If a warning appears, verify that DEFAULT_ICON is used instead
- [ ] Check that game doesn't crash from missing assets

**Expected Result:** Missing assets show fallback icon and log warning to console.

---

## 🔊 Audio Assets Testing

### Sound Effects (SFX)

#### Dice Roll Sound
- [ ] Enter a battle
- [ ] Wait for first turn roll
- [ ] Verify dice sound plays
- [ ] Sound should be audible but not too loud

**Expected Result:** Dice roll sound plays at appropriate times.

---

#### Attack Sound
- [ ] In battle, choose an attack action
- [ ] Verify attack sound effect plays
- [ ] Try multiple attacks - sound should play each time
- [ ] Sound should complete even if actions happen quickly

**Expected Result:** Attack sound plays reliably during combat.

---

#### Defend Sound
- [ ] In battle, choose a defense action
- [ ] Verify defend sound effect plays
- [ ] Sound should be distinct from attack sound

**Expected Result:** Defend sound plays when using defensive actions.

---

#### Victory Sound
- [ ] Win a battle
- [ ] Verify victory fanfare plays
- [ ] Sound should be celebratory
- [ ] Check that battle music stops

**Expected Result:** Victory sound plays at battle end with music stopping.

---

#### Defeat Sound
- [ ] Lose a battle (let enemy defeat you)
- [ ] Verify defeat sound plays
- [ ] Sound should convey loss
- [ ] Check that battle music stops

**Expected Result:** Defeat sound plays at battle loss with music stopping.

---

#### Button Sounds
- [ ] Click various buttons in the UI
- [ ] Open/close menus
- [ ] Navigate settings
- [ ] Verify consistent button click sounds

**Expected Result:** Buttons play feedback sounds when clicked.

---

### Music Tracks

#### Slime Beast Battle Music
- [ ] Enter battle with Slime Beast
- [ ] Verify battle music starts
- [ ] Music should loop continuously
- [ ] Check that music matches the enemy type

**Expected Result:** Slime battle theme plays and loops.

---

#### Shadow Beast Battle Music
- [ ] Enter battle with Shadow Beast
- [ ] Verify appropriate battle music plays
- [ ] Music should be more intense than slime battle
- [ ] Check looping works correctly

**Expected Result:** Shadow beast theme plays and loops.

---

#### Shard Warden Battle Music
- [ ] Enter boss battle with Shard Warden
- [ ] Verify epic boss music plays
- [ ] Music should be most intense
- [ ] Volume should be appropriate

**Expected Result:** Boss battle music plays correctly.

---

#### Default Battle Music
- [ ] If new enemy type is encountered without specific music
- [ ] Verify default battle music plays as fallback

**Expected Result:** Fallback music plays for enemies without specific themes.

---

### Volume Controls

#### Master Volume
- [ ] Open settings
- [ ] Adjust master volume slider
- [ ] Play a sound effect - volume should change
- [ ] Set to 0 - all sounds should mute
- [ ] Set to 100% - sounds should be loudest

**Expected Result:** Master volume affects all audio.

---

#### SFX Volume
- [ ] Open settings
- [ ] Adjust SFX volume slider
- [ ] Play sound effects - volume should change
- [ ] Music volume should remain independent
- [ ] Test with dice roll, attack, defend sounds

**Expected Result:** SFX volume only affects sound effects, not music.

---

#### Music Volume
- [ ] Open settings
- [ ] Adjust music volume slider
- [ ] Battle music volume should change
- [ ] SFX volume should remain independent
- [ ] Test during battle

**Expected Result:** Music volume only affects background music, not SFX.

---

#### Volume Persistence
- [ ] Set custom volume levels
- [ ] Close and reopen settings
- [ ] Volume sliders should remember settings
- [ ] Test that audio respects saved volumes

**Expected Result:** Volume settings persist during session.

---

### Audio Error Handling

#### Missing Audio Files
- [ ] Check browser console for audio errors
- [ ] Verify game doesn't crash if audio fails
- [ ] Gameplay should continue even without sound

**Expected Result:** Missing audio fails gracefully without breaking game.

---

#### Browser Autoplay Policy
- [ ] Refresh page
- [ ] Some browsers may block autoplay
- [ ] Verify game prompts user interaction if needed
- [ ] After interaction, audio should work

**Expected Result:** Game handles autoplay restrictions gracefully.

---

## 🔧 Developer Testing

### Console Warnings
- [ ] Open browser console (F12)
- [ ] Look for asset-related warnings
- [ ] Check format: `[VisualAssets] Missing asset in path: ...`
- [ ] Verify warnings are helpful and specific

**Expected Result:** Clear, actionable warnings for missing assets.

---

### Performance
- [ ] Check page load time
- [ ] Verify no lag when opening equipment modal
- [ ] Battle transitions should be smooth
- [ ] Audio should start/stop without delay

**Expected Result:** Asset system adds minimal performance overhead.

---

### Module Imports
- [ ] No console errors about failed imports
- [ ] No errors about undefined functions
- [ ] All modules load successfully

**Expected Result:** All modules import without errors.

---

## 📊 Results Summary

### Visual Assets: _____ / 40 Tests Passed

| Category | Tests Passed | Tests Failed |
|----------|--------------|--------------|
| Weapons | ___ / 4 | ___ |
| Armor | ___ / 2 | ___ |
| Consumables | ___ / 2 | ___ |
| Characters | ___ / 6 | ___ |
| Monsters | ___ / 4 | ___ |
| Locations | ___ / 9 | ___ |
| UI Elements | ___ / 6 | ___ |
| Fallback | ___ / 4 | ___ |

### Audio Assets: _____ / 25 Tests Passed

| Category | Tests Passed | Tests Failed |
|----------|--------------|--------------|
| SFX | ___ / 5 | ___ |
| Music | ___ / 4 | ___ |
| Volume Controls | ___ / 4 | ___ |
| Error Handling | ___ / 2 | ___ |

### Developer Testing: _____ / 5 Tests Passed

---

## 🐛 Issues Found

Document any issues discovered during testing:

### Issue 1:
- **Category:** 
- **Description:** 
- **Steps to Reproduce:** 
- **Expected Behavior:** 
- **Actual Behavior:** 
- **Priority:** (High/Medium/Low)

### Issue 2:
- **Category:** 
- **Description:** 
- **Steps to Reproduce:** 
- **Expected Behavior:** 
- **Actual Behavior:** 
- **Priority:** (High/Medium/Low)

---

## ✅ Sign-Off

- [ ] All critical tests passed
- [ ] No game-breaking bugs found
- [ ] Performance is acceptable
- [ ] Asset system is production-ready

**Tested By:** ___________________  
**Date:** ___________________  
**Browser Used:** ___________________  
**Notes:** ___________________

---

## 🔄 Regression Testing

After any changes to asset system, re-run these sections:

- [ ] Visual Assets - Weapons (quick check)
- [ ] Audio Assets - SFX (quick check)
- [ ] Volume Controls (all sliders)
- [ ] Console Warnings (check for new errors)

**Last Regression Test:** ___________________

---

**Keep this checklist and use it for:**
- Initial integration testing
- After major updates
- Before releasing new versions
- When adding new assets

