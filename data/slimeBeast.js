// Slime Beast Battle Data
// This file contains all battle dialogue, actions, and responses specific to the Slime Beast

export const SLIME_BEAST_DATA = {
    id: "slimebeast",
    name: "Slime Beast",
    
    // Introduction text when battle begins
    introText: "A massive, gelatinous creature oozes into view, its translucent green body pulsing with acidic bubbles. Despite its seemingly harmless appearance, the beast's predatory intelligence gleams in its dark core as it prepares to engulf you.",
    
    // Available attack types for this monster's AI
    availableAttacks: ["slam", "spit", "engulf", "bounce"],
    
    // Available defense types for this monster's AI
    availableDefends: ["absorb", "deflect", "split", "harden"],
    
    // Available magic types for this monster's AI
    availableMagics: ["selfBuff", "attackBuff", "playerDebuff"],
    
    // Monster attack dialogues (when monster attacks player)
    attacks: {
        sword: {
            slam: "The slime beast rears up like a green wave, preparing to crash down upon you with crushing force.",
            spit: "The creature's core contracts violently, launching a stream of corrosive acid toward your sword arm.",
            engulf: "The beast spreads wide, attempting to surround and digest you within its acidic mass.",
            bounce: "The slime compresses itself into a tight ball before launching forward with surprising speed and force."
        },
        axe: {
            slam: "The massive slime rises high above you, its gelatinous form threatening to flatten you and your axe beneath its weight.",
            spit: "Acidic projectiles spray from the beast's core, hissing as they arc toward you and your heavy weapon.",
            engulf: "The creature flows outward like a toxic tide, seeking to overwhelm your axe's reach with sheer mass.",
            bounce: "The slime ball hurtles toward you with momentum that could shatter stone, let alone bone."
        },
        dagger: {
            slam: "The slime beast towers over you, its massive form preparing to crush your smaller weapon and you along with it.",
            spit: "Concentrated acid jets from the creature's center, aimed precisely at your dagger hand.",
            engulf: "The beast expands rapidly, trying to trap you within its digestive embrace before you can strike.",
            bounce: "The compressed slime rockets toward you, its speed making up for what your dagger lacks in reach."
        }
    },
    
    // Monster defense dialogues (when monster defends against player attacks)
    defends: {
        sword: {
            absorb: "Your sword sinks into the slime's gelatinous mass, the creature's body flowing around the blade to cushion the impact.",
            deflect: "The beast's surface tension increases, causing your sword to slide off its hardened exterior.",
            split: "The slime divides around your sword strike, reforming instantly as your blade passes through empty space.",
            harden: "The creature's body crystallizes where your sword would strike, creating a shell-like defense."
        },
        axe: {
            absorb: "The slime's mass compresses and expands to absorb the tremendous force of your axe blow.",
            deflect: "The beast's surface becomes slick and angled, causing your axe to glance off harmlessly.",
            split: "The creature parts like a curtain before your axe, leaving you swinging at nothing but air.",
            harden: "The slime's body becomes rock-solid at the point of impact, stopping your axe cold."
        },
        dagger: {
            absorb: "Your dagger penetrates the slime but finds no vital organs, the creature's distributed anatomy negating the strike.",
            deflect: "The beast's surface becomes impossibly slippery, your dagger unable to find purchase.",
            split: "The slime flows around your precise strike like water, reforming without a trace of damage.",
            harden: "A protective shell forms exactly where your dagger aims, turning the creature's weakness into strength."
        }
    },
    
    // Monster magic dialogues
    magics: {
        selfBuff: "The slime beast draws moisture from the air, its mass swelling as it becomes more cohesive and dangerous.",
        attackBuff: "Acidic bubbles form throughout the creature's body, making its attacks more corrosive and deadly.",
        playerDebuff: "The beast releases toxic vapors that burn your lungs and slow your reflexes."
    },
    
    // Player attacking dialogues (successful attacks against monster)
    playerAttacks: {
        sword: {
            vsAbsorb: "You twist your sword as it sinks in, creating internal damage the slime cannot simply absorb.",
            vsDeflect: "You angle your blade to cut through the slime's hardened surface, finding the soft tissue beneath.",
            vsSplit: "You anticipate the creature's division, striking both halves before they can fully separate.",
            vsHarden: "Your sword finds a gap in the crystallized shell, piercing through to the vulnerable core within."
        },
        axe: {
            vsAbsorb: "The sheer force of your axe overwhelms the slime's absorption capacity, tearing through its mass.",
            vsDeflect: "You adjust your swing mid-strike, the axe's weight carrying through the slime's deflection attempt.",
            vsSplit: "Your axe cleaves so powerfully that it damages both halves of the splitting creature.",
            vsHarden: "Your mighty blow shatters the hardened shell entirely, exposing the soft slime within."
        },
        dagger: {
            vsAbsorb: "You strike with surgical precision, finding the creature's core where absorption is impossible.",
            vsDeflect: "Your dagger moves too quickly for the slime to deflect, slipping through its defenses.",
            vsSplit: "You throw your dagger with perfect timing, striking before the creature can complete its division.",
            vsHarden: "You find a weak point in the shell with your dagger's tip, cracking it open like an egg."
        }
    },
    
    // Player defending dialogues (successful defenses against monster attacks)
    playerDefends: {
        sword: {
            vsSlam: "You brace your sword horizontally above you, the blade distributing the slime's crushing weight.",
            vsSpit: "Your sword becomes a shield, deflecting the acidic projectiles away from your body.",
            vsEngulf: "You create a barrier of steel with continuous sword movements, keeping the slime at bay.",
            vsBounce: "You plant your sword point-first, using it as a pole to vault over the bouncing slime ball."
        },
        axe: {
            vsSlam: "You raise your axe handle overhead, the sturdy wood bearing the brunt of the slime's crushing attack.",
            vsSpit: "The broad blade of your axe serves as an effective shield against the creature's acid spray.",
            vsEngulf: "You swing your axe in wide arcs, the weapon's reach keeping the encroaching slime away.",
            vsBounce: "You time your axe swing perfectly, deflecting the bouncing slime ball to the side."
        },
        dagger: {
            vsSlam: "You roll aside at the last moment, your dagger cutting through any slime that follows your movement.",
            vsSpit: "You weave between the acid projectiles with acrobatic grace, your dagger deflecting any that come too close.",
            vsEngulf: "You dance around the slime's perimeter, your dagger disrupting its flow at crucial points.",
            vsBounce: "You sidestep the bouncing attack and score the slime ball with your dagger as it passes."
        }
    },
    
    // Player counter dialogues (successful counters)
    playerCounters: {
        sword: {
            vsSlam: "As the slime crashes down, you thrust upward with your sword, piercing its core from below.",
            vsSpit: "You deflect the acid with your blade and follow through with a devastating counter-slash.",
            vsEngulf: "You leap into the slime's embrace with sword extended, striking its center before it can close around you.",
            vsBounce: "You sidestep the bouncing attack and spin with your sword, catching the slime as it tries to recover."
        },
        axe: {
            vsSlam: "You let the slime pass over your lowered form, then rise with an uppercut axe strike to its core.",
            vsSpit: "You charge through the acid spray, your axe cleaving the creature before it can prepare another attack.",
            vsEngulf: "You plant your feet and spin like a whirlwind, your axe creating a vortex that tears the slime apart.",
            vsBounce: "You duck under the bouncing slime and swing upward, your axe catching it at the peak of its arc."
        },
        dagger: {
            vsSlam: "You roll between the slime's 'legs' and strike upward with your dagger, finding its vulnerable underside.",
            vsSpit: "You weave through the acid barrage and close distance, your dagger finding the creature's core.",
            vsEngulf: "You dive through a gap in the slime's flow, your dagger piercing its center in one fluid motion.",
            vsBounce: "You leap over the bouncing slime and strike downward, your dagger embedding in its back."
        }
    },
    
    // Player dodge dialogues (successful evasions)
    playerDodges: {
        sword: {
            vsSlam: "You backflip away from the crushing slime, your sword cutting any tendrils that reach for you.",
            vsSpit: "You weave between acid projectiles with your sword held defensively, each drop missing by inches.",
            vsEngulf: "You sprint along the slime's edge, staying just ahead of its engulfing embrace.",
            vsBounce: "You sidestep at the last second, the slime ball whistling past your ear."
        },
        axe: {
            vsSlam: "You lumber aside with surprising speed, your axe ready to strike if the slime follows.",
            vsSpit: "You duck behind your axe handle, using it as cover while you reposition.",
            vsEngulf: "You retreat steadily, your axe's reach keeping you just outside the slime's grasp.",
            vsBounce: "You plant your axe and use it to vault aside, the slime ball crashing where you stood."
        },
        dagger: {
            vsSlam: "You dart away with cat-like reflexes, your small size allowing you to escape the crushing attack.",
            vsSpit: "You become a blur of motion, weaving through the acid spray without a drop touching you.",
            vsEngulf: "You sprint in a wide circle around the expanding slime, staying just out of reach.",
            vsBounce: "You drop into a slide, the bouncing slime passing harmlessly overhead."
        }
    },
    
    // Flavor text for different battle situations
    flavorText: {
        lowHealth: [
            "The slime beast's form becomes less cohesive, acidic fluid leaking from numerous wounds.",
            "The creature's movements slow as its mass decreases, leaving a trail of green residue.",
            "Bubbles of pain rise through the slime's translucent body, its core flickering weakly."
        ],
        fullHealth: [
            "The slime beast pulses with vitality, its gelatinous form perfectly smooth and menacing.",
            "Acidic bubbles dance through the creature's mass, ready to dissolve anything they touch.",
            "The beast's core glows with predatory hunger, its entire being focused on consuming you."
        ],
        playerLowHealth: [
            "The slime beast senses your weakness, its movements becoming more aggressive and confident.",
            "Acidic vapors intensify around the creature as it prepares to finish you off.",
            "The beast's core pulses faster, excited by the prospect of an easy meal."
        ],
        stalemate: [
            "You and the slime beast circle each other cautiously, neither able to gain a clear advantage.",
            "The creature's form shifts defensively, its acidic nature keeping you at a respectful distance.",
            "Steam rises from the ground where the beast's acid has dripped, creating an eerie atmosphere."
        ]
    },
    
    // Taunts and battle cries
    taunts: [
        "The slime beast gurgles menacingly, bubbles rising to its surface in anticipation.",
        "Acidic steam hisses from the creature's pores as it prepares its next attack.",
        "The beast's core pulses with malevolent glee, savoring the coming battle.",
        "A wet, slithering sound emanates from the slime as it shifts its massive bulk.",
        "The creature's surface ripples with barely contained aggression, acid droplets sizzling on the ground."
    ],
    
    // Victory dialogue (when player defeats the slime beast)
    defeatDialogue: [
        "The slime beast's form loses cohesion, dissolving into a puddle of harmless green liquid.",
        "With a final, wet gurgle, the creature collapses into component fluids that quickly evaporate.",
        "The beast's core dims and dissolves, its acidic mass neutralizing into harmless water.",
        "Steam rises as the slime beast's remains evaporate, leaving only a faint green stain behind."
    ],
    
    // Defeat dialogue (when slime beast defeats player)
    victoryDialogue: [
        "The slime beast engulfs you completely, its acidic embrace the last sensation you feel.",
        "You sink into the creature's gelatinous mass as consciousness fades away.",
        "The beast's triumphant gurgle echoes as it begins the slow process of digestion."
    ]
};