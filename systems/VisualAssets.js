/**
 * VISUAL_ASSETS Manifest
 * Central source of truth for all image assets in the game.
 * Update paths here to instantly apply changes across the codebase.
 */
export const VISUAL_ASSETS = {
    WEAPONS: {
        RUSTY_KNIFE: 'Assets/Images/RustyKnife.png',
        SHORT_SWORD: 'Assets/Images/shortSword.png',
        STEEL_AXE: 'Assets/Images/Steel Axe.png',
        BOW: 'Assets/Images/bow.png'
    },
    ARMOR: {
        LEATHER_VEST: 'Assets/Images/inventory.png',
        IRON_HELM: 'Assets/Images/gem.png'
    },
    CONSUMABLES: {
        HEALTH_POTION: 'Assets/Images/health-potion.png',
        MANA_POTION: 'Assets/Images/alchemy.png'
    },
    CHARACTERS: {
        ELIZA: 'Assets/Images/Eliza.png',
        ELIZA_WEBP: 'Assets/Images/Eliza.webp',
        VIAL_IMDALL: 'Assets/Images/V\'ial Imdall.jpg',
        MERCHANT_RAGNOR: 'Assets/Images/MerchantRagnor.webp',
        SYLAS: 'Assets/Images/Sylas.webp',
        THIEF: 'Assets/Images/thief.png'
    },
    MONSTERS: {
        SHADOW_BEAST: 'Assets/Images/ShadowBeast.webp',
        BLOOD_BEAST: 'Assets/Images/BloodBeast.webp',
        HELL_DOGS: 'Assets/Images/HellDogs.webp',
        SHARD_WARDEN: 'Assets/Images/ShardWarden.webp'
    },
    LOCATIONS: {
        TOWN_SQUARE: 'Assets/Images/townsquare.webp',
        DARK_ALLEY: 'Assets/Images/locations/darkalley.webp',
        MERCHANT_SHOP: 'Assets/Images/locations/merchantshop.webp',
        HIDDEN_PASSAGES: 'Assets/Images/locations/hiddenpassages.webp',
        SHARD_CHAMBER: 'Assets/Images/locations/shardchamber.webp',
        BAZAAR_STREETS: 'Assets/Images/BazaarStreets.webp',
        BAZAAR_STREETS_2: 'Assets/Images/BazaarStreets_2.webp',
        BAZAAR_STREETS_3: 'Assets/Images/BazaarStreets_3.webp',
        JOURNEY: 'Assets/Images/Journey.webp'
    },
    UI: {
        GOLD_ICON: 'Assets/Images/goldImg.png',
        BACKPACK: 'Assets/Images/backpack.png',
        GEM: 'Assets/Images/gem.png',
        SOUND: 'Assets/Images/sound.png',
        FAVICON: 'Assets/Images/faviconImg.png',
        HEAL: 'Assets/Images/heal.png'
    },
    MISC: {
        // Fallback default icon to gracefully handle missing assets without breaking the UI
        DEFAULT_ICON: 'Assets/Images/default.png',
        DICE_VIDEO: 'Assets/Images/Dice Number 4.mp4'
    }
};

/**
 * Safely retrieves an image path by category and key.
 * Enforces uppercase matching and returns a fallback image if an asset is missing.
 * 
 * @param {string} category - e.g., 'WEAPONS', 'ARMOR'
 * @param {string} key - e.g., 'SHORT_SWORD'
 * @returns {string} The resolved file path
 */
export function getImagePath(category, key) {
    if (!category || !key) return VISUAL_ASSETS.MISC.DEFAULT_ICON;
    
    const cleanCategory = category.toUpperCase();
    const cleanKey = key.toUpperCase().replace(/\s+/g, '_'); // Converts 'Short Sword' to 'SHORT_SWORD'
    
    const path = VISUAL_ASSETS[cleanCategory]?.[cleanKey];
    
    if (!path) {
        console.warn(`[VisualAssets] Missing asset in path: VISUAL_ASSETS.${cleanCategory}.${cleanKey}`);
        return VISUAL_ASSETS.MISC.DEFAULT_ICON;
    }
    
    return path;
}