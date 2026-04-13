// Shard Warden Battle Data
// This file contains all battle dialogue, actions, and responses specific to the Shard Warden

export const SHARD_WARDEN_DATA = {
    id: "shardwarden",
    name: "Shard Warden",
    
    // Introduction text when battle begins
    introText: "A towering construct of crystalline shards and ancient metal emerges from the shadows, its form crackling with arcane energy. Glowing runes pulse along its surface as it raises weapons forged from the same mystical crystals that comprise its body.",
    
    // Available attack types for this monster's AI
    availableAttacks: ["crush", "pierce", "shatter", "resonance"],
    
    // Available defense types for this monster's AI
    availableDefends: ["crystallize", "deflect", "shatter", "absorb"],
    
    // Available magic types for this monster's AI
    availableMagics: ["selfBuff", "attackBuff", "playerDebuff"],
    
    // Monster attack dialogues (when monster attacks player)
    attacks: {
        sword: {
            crush: "The Shard Warden raises its massive crystalline fist, preparing to bring it down with earth-shaking force.",
            pierce: "Sharp crystal spikes extend from the Warden's arm, aimed directly at your sword-wielding form.",
            shatter: "The construct's body resonates with power, preparing to unleash a devastating shockwave of crystal fragments.",
            resonance: "The Warden's runes flare as it emits a harmonic frequency that threatens to shatter both crystal and steel."
        },
        axe: {
            crush: "The towering construct swings its crystalline arm in a wide arc, seeking to overwhelm your axe with raw power.",
            pierce: "Crystal spears shoot from the Warden's body, their points gleaming as they streak toward your position.",
            shatter: "The construct's form vibrates violently, ready to explode outward in a storm of razor-sharp crystal shards.",
            resonance: "Harmonic waves pulse from the Warden's core, the frequency designed to make your axe head ring and vibrate uncontrollably."
        },
        dagger: {
            crush: "The Shard Warden's massive form looms over you, its crystalline bulk threatening to crush your smaller weapon and frame.",
            pierce: "Needle-thin crystal projectiles launch from the construct, their precision matching your dagger's own accuracy.",
            shatter: "The Warden prepares to fragment into countless pieces, each shard seeking to overwhelm your limited reach.",
            resonance: "The construct emits a high-pitched tone that makes your dagger vibrate painfully in your grip."
        }
    },
    
    // Monster defense dialogues (when monster defends against player attacks)
    defends: {
        sword: {
            crystallize: "The Warden's surface hardens into diamond-like crystal where your sword would strike, creating an impenetrable barrier.",
            deflect: "Angled crystal plates emerge from the construct's body, designed to turn your sword's edge aside.",
            shatter: "The Warden allows part of its form to break away, sacrificing crystal mass to avoid your sword's bite.",
            absorb: "The construct's crystalline matrix shifts to distribute your sword's impact across its entire structure."
        },
        axe: {
            crystallize: "Layers of crystal armor form instantly where your axe threatens to strike, each layer harder than steel.",
            deflect: "The Warden angles its body to redirect your axe's tremendous force away from vital crystal nodes.",
            shatter: "The construct deliberately fractures its outer shell, letting your axe destroy expendable crystal while protecting its core.",
            absorb: "The Warden's entire frame flexes to absorb your axe's impact, crystal fibers bending but not breaking."
        },
        dagger: {
            crystallize: "A small but perfectly formed crystal shield materializes to block your precise dagger strike.",
            deflect: "Microscopic crystal scales shift to create a surface your dagger cannot penetrate or grip.",
            shatter: "The Warden allows a small section to crumble away, making your dagger strike empty air instead of crystal.",
            absorb: "The construct's crystal matrix flows like liquid around your dagger, negating its piercing advantage."
        }
    },
    
    // Monster magic dialogues
    magics: {
        selfBuff: "The Shard Warden draws power from nearby crystal formations, its runes blazing brighter as it grows stronger.",
        attackBuff: "Arcane energy courses through the construct's crystalline weapons, making them glow with deadly power.",
        playerDebuff: "The Warden emits a discordant frequency that disrupts your concentration and coordination."
    },
    
    // Player attacking dialogues (successful attacks against monster)
    playerAttacks: {
        sword: {
            vsCrystallize: "You find a hairline crack in the crystal armor and drive your sword through with perfect precision.",
            vsDeflect: "You adjust your angle mid-strike, your sword finding the gap between deflecting crystal plates.",
            vsShatter: "You strike the Warden's core before it can complete its defensive fragmentation.",
            vsAbsorb: "Your sword's edge finds a resonant frequency in the crystal, amplifying the damage beyond what the construct can absorb."
        },
        axe: {
            vsCrystallize: "The sheer force of your axe overwhelms even diamond-hard crystal, shattering through the armor.",
            vsDeflect: "Your axe's weight carries through the deflection, the momentum too great for crystal plates to redirect.",
            vsShatter: "You strike faster than the Warden can fragment, your axe biting deep into solid crystal.",
            vsAbsorb: "Your mighty blow exceeds the construct's absorption capacity, crystal fibers snapping under the strain."
        },
        dagger: {
            vsCrystallize: "Your dagger finds the exact point where crystal formation is weakest, slipping through like a needle.",
            vsDeflect: "You throw your dagger with such precision that it threads between the shifting crystal scales.",
            vsShatter: "You strike the Warden's control node before it can complete its defensive fragmentation sequence.",
            vsAbsorb: "Your dagger moves too quickly for the crystal matrix to flow around it, piercing straight through."
        }
    },
    
    // Player defending dialogues (successful defenses against monster attacks)
    playerDefends: {
        sword: {
            vsCrush: "You brace your sword against the Warden's crushing blow, the steel holding firm against crystal force.",
            vsPierce: "Your sword deflects the crystal spikes with precise parries, each movement perfectly timed.",
            vsShatter: "You create a protective barrier with your sword, deflecting crystal fragments away from your body.",
            vsResonance: "You adjust your sword's position to counter the harmonic frequency, using steel to disrupt crystal resonance."
        },
        axe: {
            vsCrush: "You meet the Warden's crushing attack with your axe handle, wood and steel proving stronger than crystal.",
            vsPierce: "Your axe sweeps in wide arcs, batting away crystal spears before they can reach you.",
            vsShatter: "You hunker behind your axe's broad blade, using it as a shield against the crystal storm.",
            vsResonance: "You plant your axe firmly, its weight and your grip dampening the construct's disruptive frequency."
        },
        dagger: {
            vsCrush: "You roll away from the crushing blow, your dagger scoring the Warden's arm as you escape.",
            vsPierce: "You weave between crystal spikes with acrobatic grace, your dagger deflecting any that come too close.",
            vsShatter: "You find cover behind a crystal formation, letting the Warden's own fragments shield you.",
            vsResonance: "You move constantly to avoid the resonance field, your dagger's small mass making you harder to target."
        }
    },
    
    // Player counter dialogues (successful counters)
    playerCounters: {
        sword: {
            vsCrush: "You sidestep the crushing blow and thrust upward, your sword finding a gap in the Warden's crystal armor.",
            vsPierce: "You parry the crystal spikes and riposte with lightning speed, your blade finding the construct's core.",
            vsShatter: "You charge through the crystal storm with your sword extended, striking the Warden before it can reform.",
            vsResonance: "You use the harmonic frequency to your advantage, your sword vibrating in perfect counter-resonance as you strike."
        },
        axe: {
            vsCrush: "You duck under the crushing attack and swing upward with tremendous force, your axe cleaving through crystal joints.",
            vsPierce: "You spin past the crystal spears and bring your axe around in a devastating arc that shatters the Warden's arm.",
            vsShatter: "You charge into the crystal storm, your axe spinning to deflect fragments while you close for a killing blow.",
            vsResonance: "You use your axe's weight to resist the frequency, then strike with a blow that sends shock waves through the construct."
        },
        dagger: {
            vsCrush: "You leap onto the Warden's crushing arm and run up it, your dagger finding the construct's head crystal.",
            vsPierce: "You weave through the crystal spears and close distance, your dagger piercing the Warden's control matrix.",
            vsShatter: "You dive through the crystal storm and strike the Warden's core before it can complete its attack.",
            vsResonance: "You throw your dagger at the exact moment the frequency peaks, the blade finding a resonant weak point."
        }
    },
    
    // Player dodge dialogues (successful evasions)
    playerDodges: {
        sword: {
            vsCrush: "You backflip away from the crushing blow, your sword cutting any crystal fragments that follow.",
            vsPierce: "You weave between crystal spikes with your sword held defensively, each projectile missing by mere inches.",
            vsShatter: "You sprint away from the explosion point, your sword deflecting any fragments that reach you.",
            vsResonance: "You move erratically to avoid the resonance field, staying just outside its effective range."
        },
        axe: {
            vsCrush: "You lumber aside with surprising speed for someone carrying such a heavy weapon.",
            vsPierce: "You use your axe handle to vault over the crystal spears, landing safely beyond their reach.",
            vsShatter: "You retreat to a safe distance, your axe ready to deflect any fragments that come your way.",
            vsResonance: "You plant your axe and use it as an anchor, staying grounded while the frequency passes over you."
        },
        dagger: {
            vsCrush: "You dart away with cat-like reflexes, your small size allowing you to escape the massive attack.",
            vsPierce: "You become a blur of motion, weaving through crystal spears without a single one finding its mark.",
            vsShatter: "You sprint in a zigzag pattern, staying ahead of the expanding crystal explosion.",
            vsResonance: "You drop into a roll, staying low and mobile to avoid the worst of the harmonic assault."
        }
    },
    
    // Flavor text for different battle situations
    flavorText: {
        lowHealth: [
            "Cracks spread across the Shard Warden's crystalline form, its runes flickering weakly.",
            "Crystal fragments litter the ground around the damaged construct, its movements becoming jerky.",
            "The Warden's core crystal dims as its power reserves dwindle, sparks of energy escaping through fractures."
        ],
        fullHealth: [
            "The Shard Warden stands in perfect crystalline majesty, its runes pulsing with arcane power.",
            "Light refracts beautifully through the construct's flawless crystal form, creating rainbow patterns.",
            "The Warden's core blazes with energy, its entire structure humming with barely contained power."
        ],
        playerLowHealth: [
            "The Shard Warden's runes pulse faster, sensing your weakness and preparing to exploit it.",
            "Crystal formations around the construct grow more aggressive, reaching toward your wounded form.",
            "The Warden's harmonic frequency intensifies, seeking to shatter your remaining resolve."
        ],
        stalemate: [
            "You and the Shard Warden circle each other warily, crystal meeting steel in a test of endurance.",
            "The construct's runes pulse steadily as it calculates the optimal strategy to defeat you.",
            "Sparks fly where crystal meets metal, neither combatant able to gain a decisive advantage."
        ]
    },
    
    // Taunts and battle cries
    taunts: [
        "The Shard Warden's runes flare brighter, casting eerie shadows as it prepares its next move.",
        "Crystal formations resonate around the construct, creating an ominous harmonic chord.",
        "The Warden's core pulses with ancient power, its crystalline form shifting into a more aggressive stance.",
        "Arcane energy crackles between the construct's crystal spikes, building toward a devastating attack.",
        "The Shard Warden emits a low, thrumming sound that makes nearby crystals vibrate in sympathy."
    ],
    
    // Victory dialogue (when player defeats the shard warden)
    defeatDialogue: [
        "The Shard Warden's runes fade to darkness as its crystalline form crumbles into glittering dust.",
        "With a sound like breaking glass, the construct collapses, its crystal components scattering across the ground.",
        "The Warden's core crystal cracks and goes dark, the ancient magic that animated it finally spent.",
        "Crystal fragments rain down as the construct's form loses cohesion, returning to lifeless mineral."
    ],
    
    // Defeat dialogue (when shard warden defeats player)
    victoryDialogue: [
        "The Shard Warden stands triumphant over your fallen form, its runes pulsing with satisfied power.",
        "Crystal formations grow around your defeated body as the construct claims victory.",
        "The Warden's harmonic victory song resonates through the chamber, a sound of ancient triumph."
    ]
};