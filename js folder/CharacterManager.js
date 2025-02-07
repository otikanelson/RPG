class CharacterManager {
    constructor() {
        // DOM Elements
        this.characterInfo = document.getElementById('characterInfo');
        this.charName = document.querySelector('.charName');
        this.charImg = document.querySelector('.CharImg');
        this.descr = document.querySelector('.descr');
        this.descrText = document.querySelector('.descrText');
        this.infoToggleBtn = document.querySelector('.Info');
        this.charLevel = document.querySelector('.charLevel span');
        
        // Location Data
        this.locations = {
            "Town Square": {
                image: "Assets/locations/townsquare.webp",
                description: "Once a bustling center of commerce, now a haunting reminder of what was lost. Crumbling buildings and ash-covered streets tell tales of recent devastation.",
                soundtrack: "Assets/audio/townsquare-ambient.mp3",
                ambientSounds: ["crowd_murmur", "distant_bells"]
            },
            "Dark Alley": {
                image: "Assets/locations/darkalley.webp",
                description: "Narrow passages between towering buildings where shadows seem to move of their own accord. The air here is thick with tension.",
                soundtrack: "Assets/audio/alley-ambient.mp3",
                ambientSounds: ["dripping_water", "distant_echoes"]
            },
            "Merchant's Shop": {
                image: "Assets/locations/merchantshop.webp",
                description: "A cramped but well-stocked shop, its shelves lined with curiosities and weapons. The air smells of leather and metal.",
                soundtrack: "Assets/audio/shop-theme.mp3",
                ambientSounds: ["creaking_wood", "tinkling_bells"]
            },
            "Hidden Passages": {
                image: "Assets/locations/hiddenpassages.webp",
                description: "Secret tunnels beneath the bazaar, known only to a select few. Water drips from ancient stones overhead.",
                soundtrack: "Assets/audio/caves-ambient.mp3",
                ambientSounds: ["water_drops", "distant_rumbles"]
            },
            "Shard Chamber": {
                image: "Assets/locations/shardchamber.webp",
                description: "A vast circular chamber where the shard's power pulses visibly in the air. Ancient runes circle the walls.",
                soundtrack: "Assets/audio/chamber-theme.mp3",
                ambientSounds: ["crystal_hum", "energy_crackle"]
            },
            "Bazaar Streets": {
                image: "Assets/locations/bazaarstreets.webp",
                description: "Once-bustling market streets now eerily empty. Abandoned stalls and scattered wares tell of a hasty evacuation.",
                soundtrack: "Assets/audio/bazaar-ambient.mp3",
                ambientSounds: ["wind_through_stalls", "distant_voices"]
            },
            "Journey": {
                image: "Assets/locations/journey.webp",
                description: "The winding paths between destinations, each step bringing new dangers and discoveries.",
                soundtrack: "Assets/audio/journey-theme.mp3",
                ambientSounds: ["footsteps", "wilderness_ambient"]
            }
        };
        
        // Character Data with Soundtracks
        this.characters = {
                "V'ial Imdall": {
                    name: "V'ial Imdall",
                    image: "Assets/V'ial imdall.jpg",
                    description: "A powerful archmage and guardian of the realm. V'ial Imdall bears the weight of countless centuries, his weathered face marked by the wisdom of ages. His robes, adorned with intricate runes, pulse with barely contained magical energy. Despite his formidable presence, a hint of weariness shows in his ancient eyes, suggesting the burden of knowledge too heavy for most to bear.",
                    level: "Legendary",
                    bio: "A powerful mage tasked with maintaining peace in the realm."
                },
                "Eliza": {
                    name: "Eliza",
                    image: "Assets/Eliza.webp",
                    description: "A mysterious woman whose beauty belies her enigmatic nature. Eliza's presence carries an otherworldly grace, her movements fluid and deliberate. Her knowledge of ancient artifacts and forgotten lore hints at a past deeply intertwined with the realm's most guarded secrets. The gentle smile she wears often masks calculations happening behind her keen eyes.",
                    level: "Unknown",
                    bio: "A mysterious woman with knowledge of ancient artifacts."
                },
                "MerchantRagnor": {
                    name: "Merchant Ragnor",
                    image: "Assets/MerchantRagnor.webp",
                    description: "A cunning merchant whose wretched appearance conceals his sharp business acumen. Despite his diminutive stature, Ragnor's presence fills any room he occupies. His shop, while modest in appearance, holds treasures and weapons of considerable power. Years of trading in both legitimate and questionable goods have left him with an extensive network of contacts.",
                    level: "Common",
                    bio: "A shrewd merchant dealing in weapons and potions."
                },
                "ShadowBeast": {
                    name: "Shadow Beast",
                    image: "Assets/ShadowBeast.webp",
                    description: "A nightmarish creature born of darkness and malice. Its form shifts and writhes like living shadow, defying natural law. Red eyes gleam with predatory intelligence, and its very presence seems to dim the light around it.",
                    level: "Unknown",
                    bio: "A creature of shadow and malice."
                },
                "BloodBeast": {
                    name: "Blood Beast",
                    image: "Assets/BloodBeast.webp",
                    description: "A horrifying amalgamation of flesh and fury. Its crimson form pulses with unnatural life, each movement leaving trails of visceral energy. The air around it thrums with malevolent power.",
                    level: "Elite",
                    bio: "A monstrous entity of blood and rage."
                },
                "HellDogs": {
                    name: "Hell Dogs",
                    image: "Assets/HellDogs.webp",
                    description: "Infernal hounds whose fur burns with hellfire. Their eyes glow like embers, and their barks echo with otherworldly resonance. These fearsome beasts hunt in packs, coordinating their attacks with terrifying intelligence.",
                    level: "Rare",
                    bio: "Hellish beasts that hunt in packs."
                },
                "Sylas": {
                    name: "Sylas",
                    image: "Assets/Sylas.webp",
                    description: "A shadow walker and master of the bazaar's hidden paths. Sylas moves with the practiced grace of one who has spent years navigating the darkest corners of the city. His tattered clothes and easy smile belie both his skills and the true extent of his knowledge. Every word he speaks seems carefully chosen, every gesture calculated.",
                    level: "Rare",
                    bio: "A skilled rogue with intimate knowledge of the bazaar."
                }
            };

        this.currentCharacter = null;
        this.isShowingDescription = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        if (this.infoToggleBtn) {
            this.infoToggleBtn.addEventListener('click', () => this.toggleDescription());
        }
    }

    toggleDescription() {
        this.isShowingDescription = !this.isShowingDescription;
        
        if (this.charImg && this.descr) {
            if (this.isShowingDescription) {
                this.charImg.style.display = 'none';
                this.descr.style.display = 'block';
            } else {
                this.charImg.style.display = 'block';
                this.descr.style.display = 'none';
            }
        }
    }

    updateDisplay(dialogue) {
        if (!dialogue) {
            this.hideCharacterInfo();
            return;
        }

        // If there are characters, show character info
        if (dialogue.characters && dialogue.characters.length > 0) {
            const primaryCharacter = dialogue.characters[0];
            const characterData = this.characters[primaryCharacter];

            if (!characterData) {
                console.warn(`Character data not found for: ${primaryCharacter}`);
                return;
            }

            this.currentCharacter = characterData;
            this.showCharacterInfo();
            this.updateUI(characterData);
        }
        // If no characters but location exists, show location info
        else if (dialogue.location) {
            const locationData = this.locations[dialogue.location];
            
            if (!locationData) {
                console.warn(`Location data not found for: ${dialogue.location}`);
                return;
            }

            this.currentCharacter = locationData;
            this.showCharacterInfo();
            this.updateUI(locationData);
        }
        // If neither characters nor location, hide the panel
        else {
            this.hideCharacterInfo();
        }
    }

    updateUI(data) {
        if (this.charName) this.charName.textContent = data.name;
        if (this.charImg) {
            this.charImg.src = data.image;
            this.charImg.style.display = 'block';
        }
        if (this.descrText) this.descrText.textContent = data.description;
        if (this.charLevel) this.charLevel.textContent = data.level;
    }

    showCharacterInfo() {
        if (this.characterInfo) {
            this.characterInfo.style.display = 'flex';
        }
    }

    hideCharacterInfo() {
        if (this.characterInfo) {
            this.characterInfo.style.display = 'none';
        }
    }

    // Method to be called from DialogueManager when dialogue changes
    onDialogueChange(dialogue) {
        this.updateDisplay(dialogue);
    }
}

export default CharacterManager;