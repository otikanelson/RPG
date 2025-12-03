// Shadow Beast Battle Data
// This file contains all battle dialogue, actions, and responses specific to the Shadow Beast

export const SHADOW_BEAST_DATA = {
    id: "shadowbeast",
    name: "Shadow Beast",
    
    // Introduction text when battle begins
    introText: "A nightmarish creature steps from the darkness, its form shifting and wavering as if composed of living shadow. Red eyes pierce through the gloom, tracking your every movement with predatory intent.",
    
    // Available attack types for this monster's AI
    availableAttacks: ["lunge", "slash", "engulf", "phase"],
    
    // Available defense types for this monster's AI
    availableDefends: ["dissipate", "absorb", "counter", "reflect"],
    
    // Available magic types for this monster's AI
    availableMagics: ["selfBuff", "attackBuff", "playerDebuff"],
    
    // Monster attack dialogues (when monster attacks player)
    attacks: {
        sword: {
            lunge: "The shadow beast stretches impossibly, its form elongating as it launches a strike toward you with claws of pure darkness.",
            slash: "The creature's limbs become razor-sharp blades of shadow, whirling toward you in a deadly arc.",
            engulf: "The beast's form expands, threatening to surround and consume you in its inky darkness.",
            phase: "The shadow beast seems to dissolve, only to reform instantly beside you, striking from your blind spot."
        },
        axe: {
            lunge: "The shadow creature darts forward, its form compressing into a spear-like projection aimed at your chest as you grip your axe tighter.",
            slash: "Tendrils of darkness whip toward you, threatening to disarm you as you ready your axe to counter.",
            engulf: "The shadow beast expands like a tide of darkness, forcing you to swing your axe in wide arcs to keep it at bay.",
            phase: "The creature dissolves into the floor, reappearing behind you as you pivot your axe to defend."
        },
        dagger: {
            lunge: "The shadow beast extends impossibly as your dagger glints in the dim light, its form becoming a lance of pure darkness.",
            slash: "Bladed shadows slice through the air toward you, testing the limits of your dagger's reach and your reflexes.",
            engulf: "The creature becomes a swirling vortex of darkness, forcing you to dance around its edges with your dagger at the ready.",
            phase: "The beast seems to evaporate, rematerializing within striking distance as you prepare your dagger."
        }
    },
    
    // Monster defense dialogues (when monster defends against player attacks)
    defends: {
        sword: {
            dissipate: "Your sword passes through the beast as it temporarily loses cohesion, its form becoming mist-like before resolidifying.",
            absorb: "The shadow beast seems to absorb the impact of your sword, the darkness swallowing the energy of your strike.",
            counter: "As your sword connects, tendrils of darkness wrap around the blade, threatening to pull it from your grasp.",
            reflect: "The creature's surface hardens momentarily, deflecting your sword strike in an unexpected direction."
        },
        axe: {
            dissipate: "Your axe swings through temporarily insubstantial shadow, the beast's form splitting and reforming around your weapon.",
            absorb: "The creature's mass seems to accept the blow of your axe, the darkness deforming but quickly recovering.",
            counter: "The shadow beast flows around your axe strike, using your momentum to position itself for a counterattack.",
            reflect: "Your axe meets unexpected resistance as the shadow briefly crystallizes, deflecting your powerful blow."
        },
        dagger: {
            dissipate: "Your precise strike misses as the beast's form becomes smoke-like, your dagger finding no substance to cut.",
            absorb: "The shadow simply accepts your dagger's penetration, closing around it like water around a stone.",
            counter: "As your dagger strikes, the shadow beast's form wraps around your arm, threatening to pull you off balance.",
            reflect: "The creature's surface becomes mirror-like where your dagger strikes, turning your precision against you."
        }
    },
    
    // Monster magic dialogues
    magics: {
        selfBuff: "The shadow beast draws power from the surrounding darkness, its form growing larger and more substantial.",
        attackBuff: "A cold aura emanates from the creature as it taps into deeper shadow magic, its eyes burning with increased malevolence.",
        playerDebuff: "Tendrils of shadow reach out to touch you, their cold contact seeming to drain your energy and slow your movements."
    },
    
    // Player attacking dialogues (successful attacks against monster)
    playerAttacks: {
        sword: {
            vsDissipate: "You anticipate the beast's transformation, adjusting your sword's path to strike as it begins to reform.",
            vsAbsorb: "Your blade glows with determined energy, cutting through the shadow's attempt to absorb your attack.",
            vsCounter: "You twist your sword with practiced skill, breaking free of the shadow's grasp before it can take hold.",
            vsReflect: "Reading the creature's defense, you feint and strike from an unexpected angle, bypassing its reflective surface."
        },
        axe: {
            vsDissipate: "The sheer force of your axe disrupts the beast's transformation, catching it between solid and insubstantial forms.",
            vsAbsorb: "Your mighty swing carries too much power for the shadow to absorb, tearing through its defenses.",
            vsCounter: "You plant your feet firmly, using your axe's momentum to resist the shadow's attempt to unbalance you.",
            vsReflect: "Your axe crashes through the crystallized shadow with brute force, shattering its defensive structure."
        },
        dagger: {
            vsDissipate: "With supernatural speed, your dagger finds the exact moment when the beast begins to solidify.",
            vsAbsorb: "Your dagger moves with such precision that it finds the shadow's core, striking where absorption is impossible.",
            vsCounter: "You twist away from the grasping darkness, using your dagger to sever the shadow tendrils.",
            vsReflect: "You throw your dagger with perfect timing, striking before the shadow can form its reflective defense."
        }
    },
    
    // Player defending dialogues (successful defenses against monster attacks)
    playerDefends: {
        sword: {
            vsLunge: "You angle your sword perfectly, splitting the shadow's lunge attack and dissipating its force.",
            vsSlash: "Your blade dances in precise arcs, intercepting each shadow blade before it can reach you.",
            vsEngulf: "You create a barrier of continuous motion with your sword, keeping the encroaching darkness at bay.",
            vsPhase: "With warrior's intuition, you pivot at the last second, your sword meeting the beast as it reforms."
        },
        axe: {
            vsLunge: "You bring your axe down with perfect timing, cleaving through the shadow spear before it reaches you.",
            vsSlash: "The broad sweep of your axe creates a zone of safety, cutting through the shadow tendrils.",
            vsEngulf: "You spin with your axe extended, the weapon's reach and weight creating a perimeter the shadows cannot cross.",
            vsPhase: "As the beast materializes, you're already turning, your axe completing its arc directly into the reforming shadow."
        },
        dagger: {
            vsLunge: "You sidestep with extraordinary precision, your dagger scoring the shadow lance as it passes.",
            vsSlash: "Your dagger becomes a blur, deflecting each shadow blade with minimal movement and maximum efficiency.",
            vsEngulf: "You dance through the encroaching darkness, your dagger disrupting the shadow's pattern at key points.",
            vsPhase: "You sense the beast's reformation before it happens, your dagger already waiting at the point of materialization."
        }
    },
    
    // Player counter dialogues (successful counters)
    playerCounters: {
        sword: {
            vsLunge: "You sidestep the shadow lance and riposte with your sword, catching the beast mid-extension when it's most vulnerable.",
            vsSlash: "You parry the shadow blades and follow through with a devastating counter-slash that tears through the creature's form.",
            vsEngulf: "As the darkness closes in, you leap forward with your sword extended, striking the beast's core before it can complete its engulfing attack.",
            vsPhase: "The moment the shadow reforms, you're already spinning, your sword creating a whirlwind that catches the surprised beast."
        },
        axe: {
            vsLunge: "You let the shadow lance pass by your shoulder, then bring your axe around in a brutal counter that cleaves through the extended darkness.",
            vsSlash: "You duck under the shadow blades and swing upward with tremendous force, disrupting the creature's attack pattern entirely.",
            vsEngulf: "You charge into the expanding darkness, your axe spinning in a defensive pattern that transforms into a devastating offensive strike.",
            vsPhase: "Anticipating the beast's rematerialization, you're already mid-swing, your axe meeting shadow-flesh the instant it reforms."
        },
        dagger: {
            vsLunge: "You twist away from the shadow lance with acrobatic grace, your dagger finding the beast's core in the same fluid motion.",
            vsSlash: "You weave through the shadow blades like a dancer, each movement bringing your dagger closer until you strike with lethal precision.",
            vsEngulf: "You dive through a gap in the encroaching darkness, your dagger piercing the beast's center before it can close the trap.",
            vsPhase: "You throw your dagger at the exact point of the beast's rematerialization, the blade embedding itself before the creature can react."
        }
    },
    
    // Player dodge dialogues (successful evasions)
    playerDodges: {
        sword: {
            vsLunge: "You pivot on your heel, your sword creating a protective arc as the shadow lance passes harmlessly by.",
            vsSlash: "You duck and weave with your sword held defensively, the shadow blades missing you by mere inches.",
            vsEngulf: "You backflip away from the expanding darkness, your sword cutting a path through any tendrils that reach for you.",
            vsPhase: "You sense the attack before it comes, rolling away as the beast materializes where you stood a moment ago."
        },
        axe: {
            vsLunge: "You swing your axe in a wide arc, using its momentum to propel yourself out of the shadow lance's path.",
            vsSlash: "You drop into a crouch, your axe raised above you to deflect any shadows that come too close as the attack passes overhead.",
            vsEngulf: "You leap backward with surprising agility for someone wielding an axe, staying just ahead of the encroaching darkness.",
            vsPhase: "You spin away from the rematerializing beast, your axe extended to keep it at a distance."
        },
        dagger: {
            vsLunge: "You slip to the side with fluid grace, your dagger deflecting the shadow lance at the last possible moment.",
            vsSlash: "You become a blur of motion, your small stature and speed allowing you to weave through the shadow blades untouched.",
            vsEngulf: "You sprint along the edge of the expanding darkness, your dagger cutting any tendrils that reach for you as you escape.",
            vsPhase: "You sense the spatial distortion and roll away, coming up in a defensive stance as the beast reforms."
        }
    },
    
    // Flavor text for different battle situations
    flavorText: {
        lowHealth: [
            "The shadow beast's form becomes more erratic, wisps of darkness trailing from its wounds.",
            "The creature's red eyes dim slightly, but the malevolence within them only intensifies.",
            "Parts of the beast's shadowy form struggle to maintain cohesion, revealing glimpses of something darker within."
        ],
        fullHealth: [
            "The shadow beast moves with predatory confidence, its form solid and menacing.",
            "The creature's eyes burn with cruel intelligence as it circles you.",
            "The beast's shadowy form ripples with barely contained power."
        ],
        playerLowHealth: [
            "The shadow beast senses your weakness, its movements becoming more aggressive.",
            "A sound like cruel laughter echoes from the creature as it presses its advantage.",
            "The beast's form swells with confidence, darkness expanding around it."
        ],
        stalemate: [
            "You and the shadow beast circle each other warily, each looking for an opening.",
            "The creature's form shifts defensively, respecting your skill even as it seeks a weakness.",
            "An uneasy moment of stillness falls over the battle, both combatants catching their breath."
        ]
    },
    
    // Taunts and battle cries
    taunts: [
        "The shadow beast releases a chilling shriek that seems to pull at your very soul.",
        "Darkness coalesces around the creature as it prepares its next move, eyes locked on you.",
        "The beast's form ripples with anticipation, hungry for your defeat.",
        "A whisper of malevolent laughter emanates from the creature's shadowy mass.",
        "The shadow beast's eyes narrow, red light intensifying as it studies your fighting style."
    ],
    
    // Victory dialogue (when player defeats the shadow beast)
    defeatDialogue: [
        "The shadow beast lets out a final, pitiful wail as its form begins to dissolve.",
        "Darkness scatters like smoke in the wind as the creature's essence dissipates.",
        "The red eyes dim and fade, the beast's malevolent presence finally vanquished.",
        "With a sound like a sigh of wind through dead trees, the shadow beast collapses into nothingness."
    ],
    
    // Defeat dialogue (when shadow beast defeats player)
    victoryDialogue: [
        "The shadow beast towers over you as darkness closes in around your vision.",
        "The creature's red eyes are the last thing you see as shadows engulf you completely.",
        "A triumphant shriek echoes through the alley as the beast claims its victory."
    ]
};