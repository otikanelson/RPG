//                Monster Battle Dialogues                 //

export const MONSTER_DIALOGUES = {
    slimeBeast: {
        name: "Slime Beast",
        introText: "The massive gelatinous form of the slime beast rises before you, its translucent body pulsing with an otherworldly light. Acidic droplets sizzle where they fall.",
        
        attacks: {
            sword: {
                slam: "The slime beast compresses itself before exploding upward, its mass descending like a tidal wave as your sword glints in the dim light.",
                lunge: "With surprising speed, the creature launches a tendril of acidic mass directly at you, your blade ready to meet its charge.",
                engulf: "The creature flows around you in a circular pattern, its form rippling as it attempts to surround and consume you whole.",
                spray: "The beast's surface bubbles violently before unleashing a spray of caustic droplets, forcing you to ready your sword in defense."
            },
            axe: {
                slam: "The towering mass of slime descends like a hammer, challenging your axe's reach with its sheer volume.",
                lunge: "A spear-like projection of slime shoots forth, meeting the broad side of your axe with caustic intent.",
                engulf: "The creature spreads itself thin, creating a dome of acidic gel that threatens to collapse upon you, your axe at the ready.",
                spray: "Globules of acid rain down as the beast's surface erupts, each droplet large enough to leave your axe handle sizzling."
            },
            dagger: {
                slam: "The massive wall of slime crashes down, forcing you to weave through its gelatinous mass with your dagger seeking weak points.",
                lunge: "A whip-like tendril of slime cracks through the air, your dagger poised to slice through its liquid form.",
                engulf: "The beast flows like quicksilver, attempting to trap you in its embrace as you ready your dagger for precise strikes.",
                spray: "A shower of acidic particles bursts forth, your dagger's short reach requiring perfect timing to avoid the caustic rain."
            }
        },

        defends: {
            sword: {
                harden: "The slime's surface crystallizes, forming a glass-like shell that sends sparks flying as your sword strikes it.",
                split: "Your blade cleaves through the creature, but its form simply parts and reforms, undamaged.",
                absorb: "The beast's body becomes almost liquid, your sword passing through with barely any resistance, trapped in its mass.",
                deflect: "Impossibly, the creature's surface becomes mirror-like, your blade sliding off its hardened exterior."
            },
            axe: {
                harden: "Your axe meets unexpected resistance as the slime's exterior becomes almost stone-like, vibrations running up the handle.",
                split: "The beast parts around your axe swing like a curtain, its divided mass rejoining without harm.",
                absorb: "The creature envelops your axe head, its gelatinous form threatening to wrench the weapon from your grip.",
                deflect: "The slime's surface becomes smooth as ice, causing your axe to glance off harmlessly."
            },
            dagger: {
                harden: "Your dagger meets what feels like solid steel as the slime's exterior suddenly crystallizes.",
                split: "The precise strike of your dagger creates a clean division in the creature that instantly seals itself.",
                absorb: "The beast's form engulfs your dagger arm, its grip surprisingly strong despite its liquid nature.",
                deflect: "Like striking water, your dagger fails to find purchase on the slime's suddenly frictionless surface."
            }
        },

        magics: {
            selfBuff1: "The slime beast's form begins to glow with an inner light, its mass doubling as it draws power from the surrounding moisture.",
            selfBuff2: "A crackling field of acidic energy surrounds the creature, its body becoming more translucent and deadly.",
            playerDebuff: "The air around you becomes thick and gelatinous, your movements slowing as the beast exerts its influence."
        },

        playerAttacks: {
            sword: {
                vsHarden: "Your blade catches the slime's crystallized surface at just the right angle, sending cracks spiderwebbing through its hardened shell.",
                vsSplit: "As the slime parts to avoid your strike, you twist your sword in a fluid arc, catching both halves before they can reunite.",
                vsAbsorb: "The moment your sword is caught, you rotate the blade violently, creating a vortex that tears through the creature's absorbing mass.",
                vsDeflect: "You feint a direct strike, then change angle at the last second, your blade finding purchase on the slime's supposedly frictionless surface."
            },
            axe: {
                vsHarden: "The sheer force of your axe shatters the slime's crystalline defense, sending hardened fragments scattering across the battlefield.",
                vsSplit: "You bring your axe down in a mighty cleave, the force too overwhelming for the slime to split around.",
                vsAbsorb: "Using your axe's momentum, you tear through the absorbing mass, the weapon's weight preventing it from being trapped.",
                vsDeflect: "The heavy head of your axe provides enough force to break through the slime's slick surface, transforming its defense into a weakness."
            },
            dagger: {
                vsHarden: "Finding a microscopic flaw in the crystallized surface, your dagger strikes with surgical precision, shattering the slime's defense.",
                vsSplit: "Your dagger moves faster than the slime can split, striking the exact point where both halves begin to separate.",
                vsAbsorb: "With practiced skill, you turn your dagger into a lever, using the slime's absorbing force against itself.",
                vsDeflect: "Your dagger finds an imperfection in the slick surface, turning the slime's smooth defense into an entry point."
            }
        },
        // Player defending against monster's attacks
        playerDefends: {
            sword: {
                vsSlam: "You angle your blade to redirect the slime's massive force, letting its own weight slide harmlessly past you.",
                vsLunge: "Your sword cuts a perfect arc through the air, splitting the acidic tendril before it can reach you.",
                vsEngulf: "Using your sword like a pole, you vault through a gap in the slime's encircling mass.",
                vsSpray: "Your blade moves in rapid circles, creating a barrier that disperses the caustic spray."
            },
            axe: {
                vsSlam: "Planting your feet firmly, you use your axe's broad side as a shield, the slime's mass crashing harmlessly against it.",
                vsLunge: "The heavy head of your axe cleaves through the lunging tendril, its weight providing perfect counter-momentum.",
                vsEngulf: "You spin with your axe extended, the weapon's reach keeping the encircling slime at bay.",
                vsSpray: "Using your axe's wide blade as cover, you deflect the spray of acid away from you."
            },
            dagger: {
                vsSlam: "You time your dodge perfectly, using your dagger to guide you through the smallest gap in the slime's crushing mass.",
                vsLunge: "Reading the tendril's trajectory, you slip past with minimal movement, your dagger scoring its substance as you dodge.",
                vsEngulf: "Dancing between the gaps of the surrounding mass, your dagger finds vital points that disrupt the slime's strategy.",
                vsSpray: "You weave through the spray with precise movements, your dagger tracking patterns in the acid's flow."
            }
    },


shardWarden: {
    name: "Shard Warden",
    introText: "The Shard Warden rises before you, its crystalline armor catching what little light exists. Ancient gears grind within its frame as it towers overhead, eyes blazing with centuries of unwavering purpose.",
    
    attacks: {
        sword: {
            crush: "The Warden's massive crystalline fist descends like an avalanche, its trajectory forcing you to position your sword carefully against its overwhelming mass.",
            sweep: "With impossible grace, the ancient guardian pivots its entire crystalline form, its arm becoming a horizontal guillotine that threatens to shear through your sword's defense.",
            pierce: "Shards of crystal extend from the Warden's arm like a lance, the deadly spear of light racing toward you as you ready your blade.",
            pulse: "The Warden's core pulses with blinding energy, sending waves of crystalline spikes erupting from the ground as you grip your sword tighter."
        },
        axe: {
            crush: "The Warden brings down its fist with earth-shattering force, challenging your axe's leverage against its pure mass.",
            sweep: "Its massive arm sweeps horizontally, crystal fragments trailing in its wake as you prepare your axe to meet its attack.",
            pierce: "The guardian launches a barrage of crystal spears, each large enough to match your axe's heft.",
            pulse: "Waves of crystalline energy radiate from the Warden's core, threatening to overwhelm your axe's reach with geometric patterns of deadly light."
        },
        dagger: {
            crush: "The crystal giant's fist crashes down like a meteor, forcing you to navigate your dagger through a maze of potential weakpoints in its attack.",
            sweep: "The Warden's arm becomes a horizontal wall of crystal, requiring precise timing with your dagger to avoid its lethal arc.",
            pierce: "Crystal shards longer than your dagger shoot forth in a deadly pattern, testing your ability to weave between them.",
            pulse: "The ancient guardian releases a burst of geometric energy, your dagger seeming inadequate against the crystalline storm."
        }
    },

    defends: {
        sword: {
            reflect: "The Warden's crystalline surface shifts, creating perfect angles that send your sword strike harmlessly away in a shower of sparks.",
            fortify: "Layers of crystal manifest and interlock across the guardian's form, your blade finding no purchase against its geometric defense.",
            absorb: "Your sword connects with the Warden's armor, but its crystalline structure seems to absorb and dissipate the impact.",
            redirect: "The guardian's form flows like liquid crystal, redirecting your sword's energy through its geometric patterns."
        },
        axe: {
            reflect: "Your axe meets a perfectly angled crystal surface, the force of your own blow threatening to unbalance you.",
            fortify: "The Warden's armor thickens with additional crystal layers, turning your axe blow into mere vibrations.",
            absorb: "Crystal formations catch and hold your axe head, the ancient guardian's defense proving as tactical as it is beautiful.",
            redirect: "The geometric patterns in the Warden's armor shift, causing your axe to slide off in an unexpected direction."
        },
        dagger: {
            reflect: "Even your precise strike is countered by the guardian's shifting crystal angles, deflecting your dagger with mathematical precision.",
            fortify: "The Warden's crystal armor becomes a maze of interlocking geometries, leaving no viable target for your dagger.",
            absorb: "Your dagger finds a gap but meets a cushion of crystalline energy that negates its penetration.",
            redirect: "The guardian's crystal surface becomes a complex pattern of prisms, each threatening to trap or deflect your dagger."
        }
    },

        // Player attacking against monster's defenses
        playerAttacks: {
            sword: {
                vsReflect: "You turn the Warden's geometric defense against it, using its own angles to guide your blade into a perfect striking point.",
                vsFortify: "Your sword finds the seam between crystal layers, its precision turning the overlapping defense into a vulnerability.",
                vsAbsorb: "As the crystal structure tries to absorb your strike, you twist your blade sharply, shattering the formation from within.",
                vsRedirect: "Reading the crystal's refraction pattern, you adjust your sword's path to strike where the energy flows converge."
            },
            axe: {
                vsReflect: "The sheer force of your axe overwhelms the crystal's reflective surface, turning its perfect angles into sprays of shards.",
                vsFortify: "Your mighty swing carries enough power to shatter multiple crystal layers at once, breaking through the Warden's defense.",
                vsAbsorb: "The weight behind your axe proves too much for the crystal to absorb, forcing its structure to buckle and break.",
                vsRedirect: "You purposely strike a redirecting crystal face, using its own geometry to guide your axe into a critical weak point."
            },
            dagger: {
                vsReflect: "With surgical precision, your dagger finds the microscopic flaw in the crystal's reflective geometry.",
                vsFortify: "Your blade slips through impossibly small gaps between the crystal layers, finding the soft core beneath.",
                vsAbsorb: "The speed of your strike exceeds the crystal's absorption rate, piercing through before it can adapt.",
                vsRedirect: "You turn your dagger into a prism of its own, using the Warden's light patterns to guide your strike true."
            }
        },
        // Player defending against monster's attacks
        playerDefends: {
            sword: {
                vsCrush: "Your blade intercepts the crystalline fist at a perfect angle, causing the force to fragment and disperse harmlessly.",
                vsSweep: "You match your sword's angle to the geometric patterns, splitting the horizontal strike like light through a prism.",
                vsPierce: "With precise timing, your blade deflects each crystal shard along its own trajectory, creating a defensive pattern.",
                vsPulse: "Your sword moves in calculated arcs, each motion disrupting the precise geometry of the energy waves."
            },
            axe: {
                vsCrush: "Bracing your axe horizontally, you meet the crystal fist head-on, its perfect structure shattering against your raw force.",
                vsSweep: "You plant your axe firmly, its broad head splitting the horizontal energy wave like a breakwater.",
                vsPierce: "The wide arc of your axe creates a spinning shield, batting away crystal spears with devastating counter-force.",
                vsPulse: "Using your axe's momentum, you create a disrupting shockwave that breaks the geometric patterns of energy."
            },
            dagger: {
                vsCrush: "Reading the crystalline patterns, you find the perfect gap to slip through as the massive fist crashes down.",
                vsSweep: "You dance between the geometric lines of force, your dagger disrupting key points in the crystal's structure.",
                vsPierce: "With incredible precision, you strike the base of each crystal spear, shattering them before they can fully form.",
                vsPulse: "Your dagger moves in a counter-pattern to the energy waves, each precise strike nullifying the geometric assault."
            },

    magics: {
        selfBuff1: "The Warden's crystal core pulses with blinding intensity, its armor refracting the light into deadly energy patterns.",
        selfBuff2: "Ancient runes illuminate across the guardian's form, each crystal component of its armor humming with awakened power.",
        playerDebuff: "The air crystallizes around you, geometric patterns forming in space itself as the Warden exerts its ancient influence."
    }
},
titan: {
    name: "Colossal Titan",
    introText: "The ground trembles as the Titan rises, its shadow blotting out the sky. Each movement sends tremors through the earth, its skin like weathered mountain stone. Ancient runes pulse across its titanic form, each as large as a shield.",
    
    attacks: {
        sword: {
            earthshatter: "The Titan raises its foot, larger than a house, preparing to turn the battlefield into an apocalyptic crater as you grip your sword against the coming shockwave.",
            swipe: "A hand the size of a battering ram sweeps through the air, creating a vacuum in its wake as you ready your blade against the titanic limb.",
            boulder: "The colossus tears a chunk of earth free, its size dwarfing your sword as it hurls the improvised meteor toward you.",
            stomp: "The titan's heel descends with devastating force, sending ripples through the ground that threaten to launch you skyward, sword and all."
        },
        axe: {
            earthshatter: "Your axe seems laughably small as the Titan's foot descends, promising to reshape the battlefield into a crater of broken earth.",
            swipe: "The massive hand cuts through the air like a siege engine, forcing you to consider how your axe might fare against something that could level a fortress.",
            boulder: "A shadow looms as the Titan hefts a boulder larger than a war wagon, your axe ready but seeming inadequate against the approaching mountain.",
            stomp: "The ground becomes a sea of broken earth as the Titan's foot crashes down, challenging you to maintain your footing with your axe at the ready."
        },
        dagger: {
            earthshatter: "Your dagger feels like a needle as the Titan's massive foot prepares to turn the earth into a maelstrom of broken ground and debris.",
            swipe: "The colossal hand passes overhead like a descending storm cloud, making your dagger seem insignificant against its city-leveling force.",
            boulder: "A shadow engulfs you as the Titan rips free and hurls a portion of the battlefield, your dagger requiring perfect timing against the approaching catastrophe.",
            stomp: "The Titan's foot crashes down with devastating force, turning stable ground into chaos as you seek an opening with your seemingly tiny blade."
        }
    },

    defends: {
        sword: {
            brace: "Your sword strikes the Titan's skin, but it's like attacking a cliff face - the blade barely leaves a mark on its weathered surface.",
            endure: "The colossus simply takes your strike, its massive form treating your sword blow as nothing more than a gentle breeze.",
            counter: "As your blade connects, the Titan's very mass seems to reject the impact, threatening to shake the sword from your grip.",
            ignore: "Your sword finds its mark, but the Titan's sheer scale makes the wound seem as significant as a paper cut."
        },
        axe: {
            brace: "The axe bites into the Titan's stone-like flesh, but the creature's immense mass absorbs the impact like a mountain absorbing rain.",
            endure: "Your strongest swing seems to disappear into the Titan's vast form, like striking an endless wall of living stone.",
            counter: "The impact of your axe is lost in the Titan's overwhelming presence, its body naturally resisting any meaningful damage.",
            ignore: "Though your axe finds purchase, the wound is like a scratch on a mountain - barely noticeable against the Titan's massive scale."
        },
        dagger: {
            brace: "Your dagger strikes true but meets resistance like trying to pierce a castle wall, the Titan's skin unnaturally dense.",
            endure: "The precision of your strike is lost against the Titan's immense form, like trying to harm a mountain with a needle.",
            counter: "Your dagger finds a mark, but the Titan's massive form makes the wound seem impossibly insignificant.",
            ignore: "Though you strike a vulnerable spot, the Titan's sheer scale renders your dagger's penetration almost meaningless."
        }
    },

        // Player attacking against monster's defenses
    playerAttacks: {
        sword: {
            vsBrace: "Finding a hairline crack in the Titan's stone-like skin, you drive your sword deep with surgical precision, turning its dense defense against itself.",
            vsEndure: "As the Titan ignores your attack, you chain together a series of strikes at the same point, each blow deepening the wound exponentially.",
            vsCounter: "The moment the Titan's mass shifts to reject your blade, you redirect your strike along the momentum, piercing through its defenses.",
            vsIgnore: "You transform your seemingly insignificant strike into a devastating blow by targeting a pressure point in the Titan's massive form."
        },
        axe: {
            vsBrace: "Your axe's crushing blow focuses all its force on a single point of the Titan's weathered skin, creating a devastating fracture.",
            vsEndure: "Using the Titan's own mass against it, you let gravity enhance your axe's downward strike, the impact resonating through its enormous body.",
            vsCounter: "As the Titan's bulk shifts, you hook your axe into its movement, turning its counter against itself with devastating results.",
            vsIgnore: "Your axe finds a structural weakness in the Titan's stance, the blow sending shockwaves through its supposedly impervious form."
        },
        dagger: {
            vsBrace: "With perfect precision, your dagger finds a microscopic flaw in the Titan's stone-like exterior, turning defense into vulnerability.",
            vsEndure: "Using the Titan's immobility against it, you strike the same exact point repeatedly, each hit exponentially more damaging than the last.",
            vsCounter: "You turn your dagger into a wedge, using the Titan's own massive counter-force to drive your blade deeper.",
            vsIgnore: "Though the wound seems tiny, your dagger strikes a crucial nexus point, sending spider-web cracks through the Titan's defenses."
        }
    },
        // Player defending against monster's attacks
    playerDefends: {
        sword: {
            vsEarthshatter: "Reading the seismic waves through the ground, you time your jump perfectly, using your sword to balance as the earth erupts around you.",
            vsSwipe: "You dive beneath the massive hand, your sword leaving a precise gash along its passing length while momentum carries you to safety.",
            vsBoulder: "With perfect timing, you strike the hurled boulder at its weakest point, your sword splitting it harmlessly around you.",
            vsStomp: "As the massive foot descends, you position your sword to redirect its force, creating a safe pocket in the chaos of shattered earth."
        },
        axe: {
            vsEarthshatter: "Planting your axe in the ground, you use it as an anchor point to vault over the spreading wave of destruction.",
            vsSwipe: "You meet the Titan's sweeping hand with your axe's blade, the impact creating a momentary shield of force that lets you stand your ground.",
            vsBoulder: "With a mighty swing, your axe connects with the boulder's center mass, the impact reducing it to harmless rubble.",
            vsStomp: "Using your axe as a pivot point, you channel the stomp's shockwave into a controlled spin that carries you clear."
        },
        dagger: {
            vsEarthshatter: "Dancing between the erupting fragments of earth, your dagger guides your movement through the smallest safe spaces.",
            vsSwipe: "You time your dodge perfectly, using your dagger to deflect debris while slipping beneath the massive limb.",
            vsBoulder: "Reading the boulder's trajectory, you find the perfect spot to stand where it will miss by inches, scoring its surface as it passes.",
            vsStomp: "With incredible agility, you weave between the impact zones, using your dagger to maintain perfect balance amidst the chaos."
    },

    magics: {
        selfBuff1: "Ancient runes blazing across the Titan's skin ignite with terrible power, their light casting harsh shadows across the battlefield as its already impossible strength doubles.",
        selfBuff2: "The very earth seems to flow into the Titan's form, its stone-like flesh becoming even more impenetrable as it draws power from the ground itself.",
        playerDebuff: "The Titan's presence becomes overwhelming, its sheer mass seeming to increase gravity itself, making every movement a struggle against its titanic influence."
    }
},

fangedBeast: {
    name: "Fanged Beast",
    introText: "A nightmarish fusion of wolf and lion emerges from the shadows, its multiple rows of teeth gleaming wetly in the dim light. Muscles ripple beneath its scarred hide as it stalks forward, each movement a coiled promise of savage violence.",
    
    attacks: {
        sword: {
            pounce: "The beast launches itself through the air, its massive jaws aimed for your throat as you bring your sword to bear against its terrible momentum.",
            frenzy: "In a blur of claws and fangs, the creature unleashes a storm of strikes, forcing you to make each sword movement count against its savage assault.",
            maul: "The beast's crushing jaws snap toward you with bone-shattering force, your sword the only barrier between its fangs and your flesh.",
            ravage: "With predatory precision, the beast feints and strikes from multiple angles, its claws seeking gaps in your sword's defense."
        },
        axe: {
            pounce: "Your axe rises to meet the beast as it hurls itself at you, its massive form a missile of fur and fang.",
            frenzy: "Claws slash through the air like scythes as the beast attacks from all sides, testing your ability to bring your axe to bear quickly enough.",
            maul: "The creature's jaws, large enough to crush a shield, snap toward you as you ready your axe against its savage strength.",
            ravage: "Multiple sets of claws tear through the air as the beast circles, forcing you to pivot constantly with your axe at the ready."
        },
        dagger: {
            pounce: "The beast hurtles through the air like a projectile of claw and fang, your dagger seeming small against its overwhelming mass.",
            frenzy: "In a whirlwind of savage strikes, the beast attacks from every angle, your dagger flashing desperately against its relentless assault.",
            maul: "Massive jaws snap with crushing force as you seek an opening with your dagger between its deadly fangs.",
            ravage: "The beast becomes a blur of slashing claws and snapping teeth, forcing you to weave your dagger through its lethal dance."
        }
    },

    defends: {
        sword: {
            evade: "The beast twists away from your sword with impossible agility, its body flowing like water around your blade.",
            recoil: "Your sword meets empty air as the creature pulls back with predatory grace, already coiling for its next strike.",
            deflect: "The beast's thick hide turns your sword strike, its muscles tensing as it prepares to punish your failed attack.",
            anticipate: "With cunning intelligence, the beast reads your sword's path, its body already moving before your strike begins."
        },
        axe: {
            evade: "Despite its massive size, the beast slips away from your axe with serpentine grace, making your swing look clumsy.",
            recoil: "The creature withdraws from your axe's arc with predatory precision, gathering itself for an immediate counter.",
            deflect: "Your axe glances off the beast's reinforced hide, the creature using the moment of contact to position for its response.",
            anticipate: "The beast's primal cunning shows as it reads your axe's movement, its body shifting to minimize the impact."
        },
        dagger: {
            evade: "The beast's reflexes prove lightning-fast as it twists away from your dagger, making even your quickest strike seem slow.",
            recoil: "Your dagger finds only air as the creature pulls back with deadly grace, its eyes never leaving your weapon.",
            deflect: "The beast's tough hide turns your blade, its muscled form already coiling to punish your failed strike.",
            anticipate: "With predatory intelligence, the beast reads your dagger's approach, its body already moving to counter."
        }
    },

    magics: {
        selfBuff1: "A blood-red mist emanates from the beast's fur as its muscles swell and contort, its already formidable form growing even more monstrous.",
        selfBuff2: "The beast's eyes blaze with feral power as its movements become impossibly fast, afterimages trailing in its wake.",
        playerDebuff: "The beast's primal aura washes over you like a wave of dread, its hunting presence seeming to slow your reactions."
    }
},

giantTroll: {
    name: "Giant Troll",
    introText: "A mountain of grey-green flesh rises before you, its wounds visibly knitting closed even as you watch. The Giant Troll's tiny eyes gleam with mindless hunger as it hefts a massive, gnarled club fashioned from an ancient tree trunk.",
    
    attacks: {
        sword: {
            smash: "The troll's club swings down with bone-crushing force, its crude weapon leaving craters where you stood as you maneuver your sword to counter.",
            grab: "Massive fingers thick as tree branches reach for you with surprising speed, threatening to pluck your sword arm clean from your body.",
            charge: "The troll barrels forward like an avalanche of flesh, its unstoppable mass forcing you to find a way to bring your sword to bear.",
            thrash: "In a display of pure brutality, the troll flails its massive limbs in all directions, each blow carrying enough force to shatter stone as you seek an opening with your blade."
        },
        axe: {
            smash: "Your axe seems small compared to the troll's makeshift club as it arcs down with devastating force, the air itself seeming to shudder.",
            grab: "Calloused hands large enough to crush wagons swipe through the air, threatening to snatch you and your axe in one massive grip.",
            charge: "The ground trembles as the troll charges, its enormous bulk promising to flatten anything in its path as you ready your axe.",
            thrash: "The troll unleashes a storm of wild swings, each powerful enough to level small buildings as you look for a chance to bring your axe into play."
        },
        dagger: {
            smash: "The troll's club descends like a falling tree, making your dagger seem impossibly inadequate against its brutal assault.",
            grab: "Fingers the size of fence posts grasp for you, threatening to trap you and your dagger in their crushing embrace.",
            charge: "Like a landslide of flesh and fury, the troll rushes forward, forcing you to find a way past its bulk with your dagger.",
            thrash: "The troll's wild assault turns the air itself into a deadly zone, each swing threatening to pulverize anything caught in its path."
        }
    },

    defends: {
        sword: {
            regenerate: "Your sword cuts deep, but the wound begins closing almost immediately, troll-flesh knitting together with horrifying speed.",
            shrug: "The blow that should have crippled simply bounces off the troll's thick hide, earning nothing more than a grunt of mild annoyance.",
            rage: "Your sword strike only serves to enrage the beast further, its pain transforming into renewed strength.",
            endure: "Though your blade strikes true, the troll's incredible vitality makes the wound seem insignificant."
        },
        axe: {
            regenerate: "Even as your axe bites deep, the troll's flesh begins mending itself, the grievous wound closing before your eyes.",
            shrug: "The troll barely notices your axe's impact, its thick hide and denser muscles absorbing the blow.",
            rage: "Your attack only fuels the troll's fury, its regenerative powers accelerating with its growing rage.",
            endure: "The troll's incredible constitution turns what should be a devastating axe wound into a mere inconvenience."
        },
        dagger: {
            regenerate: "Your precise strike means nothing as the troll's flesh simply seals itself, leaving no trace of the wound.",
            shrug: "The dagger's penetration seems to amuse the troll more than harm it, its thick hide making your weapon seem futile.",
            rage: "Your attack serves only to anger the beast, its regeneration speeding up as its fury grows.",
            endure: "The troll's natural healing makes your dagger wounds close almost as quickly as you can inflict them."
        }
    },

    magics: {
        selfBuff1: "The troll's regeneration accelerates to impossible speeds, wounds closing in the blink of an eye as its flesh pulses with primal energy.",
        selfBuff2: "Rage overtakes the troll's features as its muscles swell grotesquely, its already immense strength doubling as fury takes hold.",
        playerDebuff: "The troll's presence seems to saturate the air with exhaustion, its regenerative aura somehow draining the vitality from your limbs."
    }
},

slitheringDemon: {
    name: "Slithering Demon",
    introText: "Reality warps as the demon manifests, its form a writhing mass of shadows and corrupted flesh. Eyes open across its surface like bleeding wounds, each fixing upon you with ancient malice. The air itself seems to rot in its presence.",
    
    attacks: {
        sword: {
            corrupt: "The demon's form splits into writhing tendrils of pure corruption, each seeking to taint your sword's steel with its unholy touch.",
            devour: "A maw of impossible geometry opens in the demon's mass, threatening to consume both your blade and soul in its endless void.",
            warp: "Space distorts around your sword as the demon manipulates reality itself, turning simple distance into a maze of twisted dimensions.",
            plague: "Waves of pestilence roll from the demon's form, your sword cutting through miasma that threatens to corrode both blade and wielder."
        },
        axe: {
            corrupt: "Your axe's arc is met by tentacles of living shadow, each touch promising to corrupt the weapon's very essence.",
            devour: "The demon's flesh parts to reveal a bottomless gulf of hunger, your axe seeming small against its all-consuming void.",
            warp: "Reality bends and twists around your axe's path as the demon turns space itself into a weapon.",
            plague: "The air crystallizes with disease as the demon unleashes waves of corruption, challenging your axe to cleave through pure pestilence."
        },
        dagger: {
            corrupt: "Writhing tendrils of darkness reach for your dagger, each touch threatening to transform the blade into something unspeakable.",
            devour: "A thousand mouths open across the demon's surface, each seeking to snatch your dagger and hand into their depths.",
            warp: "The demon distorts the space around your dagger, turning a simple strike into a journey through twisted dimensions.",
            plague: "Waves of supernatural disease pulse from the demon's form, making each approach with your dagger a dance with corruption."
        }
    },

    defends: {
        sword: {
            phase: "Your sword passes through the demon's form as it shifts between realities, the blade finding no purchase in its otherworldly substance.",
            absorb: "The wound your sword creates is absorbed into the demon's mass, becoming part of its corrupted flesh.",
            mirror: "The demon's surface becomes a mirror of twisted reality, reflecting your sword strike into impossible angles.",
            corrupt: "Where your sword cuts, the demon's essence seeps into the blade, threatening to corrupt your weapon from within."
        },
        axe: {
            phase: "The demon's form becomes momentarily incorporeal, your axe passing through nothing but shadow and malice.",
            absorb: "Your axe blow is swallowed by the demon's mass, the wound becoming a new mouth in its twisted form.",
            mirror: "Reality splinters where your axe strikes, the demon's defense turning the physical into the impossible.",
            corrupt: "The impact point of your axe begins to transform, corruption spreading along the weapon's edge."
        },
        dagger: {
            phase: "Your dagger finds no purchase as the demon shifts partially out of reality, its form intangible yet threatening.",
            absorb: "The precision of your strike means nothing as the wound simply becomes part of the demon's everchanging mass.",
            mirror: "The demon's flesh becomes a maze of reflected realities, each dagger strike lost in the labyrinth of its defense.",
            corrupt: "Where your dagger pierces, corruption flows back along the blade, threatening to transform the weapon entirely."
        }
    },

    magics: {
        selfBuff1: "The demon's form swells with impossible geometries, reality fracturing around it as it draws power from dimensions beyond understanding.",
        selfBuff2: "A thousand voices scream in unison as the demon's corruption intensifies, its very presence becoming an assault on sanity.",
        playerDebuff: "Your mind reels as the demon's influence seeps into your thoughts, each second in its presence threatening to unravel your grasp on reality."
    }
},

dragonGod: {
    name: "T'Kr, Dragon God of Chaos",
    introText: "The sky tears apart as T'Kr, the Dragon God of Chaos, manifests in all its terrible glory. Its scales shimmer with the colors of creation and destruction, each movement leaving trails of reality-warping chaos. Ancient wings that could encompass cities unfold as eyes older than time itself fix upon you with divine malevolence.",
    
    attacks: {
        sword: {
            apocalypse: "The Dragon God's maw opens wide enough to swallow armies, reality itself burning away as forces that could unmake the world gather within its throat.",
            cataclysm: "T'Kr's wings spread to blot out the sky, each beat sending waves of pure chaos that threaten to shred your sword and soul alike.",
            unmake: "Divine claws that could carve valleys pierce reality itself, forcing you to defend against weapons that could erase you from existence.",
            chaos: "The Dragon God's very presence distorts the battlefield, turning simple sword movements into a desperate dance through fragmented realities."
        },
        axe: {
            apocalypse: "Your axe seems impossibly small as T'Kr channels power that could extinguish suns, the very air igniting with divine fury.",
            cataclysm: "Reality buckles under the Dragon God's wings, each movement threatening to tear the world apart as you struggle to maintain your grip on your axe.",
            unmake: "Claws that could rewrite creation descend toward you, making your axe feel like a child's toy against such divine might.",
            chaos: "The laws of physics warp around T'Kr's form, turning your axe's arc into a desperate gamble against chaos itself."
        },
        dagger: {
            apocalypse: "Your dagger becomes a mote of dust against the Dragon God's gathering power, the very fabric of reality burning away in its divine breath.",
            cataclysm: "T'Kr's wings send cascading waves of chaos across existence, making your dagger's reach seem futile against such overwhelming force.",
            unmake: "Divine talons that could reshape continents slash through space itself, leaving you to defend with what seems like little more than a needle.",
            chaos: "Reality fragments around the Dragon God's form, turning your precise strikes into a desperate struggle against chaos incarnate."
        }
    },

    defends: {
        sword: {
            transcend: "Your sword meets scales forged in the birth of universes, the blow dispersing across T'Kr's divine form like rain against a mountain.",
            rewrite: "The Dragon God simply rewrites the moment of impact, your sword strike becoming nothing more than a possibility that never was.",
            divine: "T'Kr's divine nature makes physical attacks seem meaningless, your sword passing through layers of reality without finding true purchase.",
            chaos: "The point of impact erupts into pure chaos, your sword's strike lost in a maelstrom of warping realities."
        },
        axe: {
            transcend: "Your axe connects with scales that were ancient when the first stars burned, the impact insignificant against such divine armor.",
            rewrite: "Reality shifts at T'Kr's will, transforming your mighty blow into nothing more than an echo of what might have been.",
            divine: "The Dragon God's divinity turns your axe's edge, physical laws bending around its form to deny you impact.",
            chaos: "Your strike connects with pure chaos, the point of impact dissolving into a swirling vortex of possibilities."
        },
        dagger: {
            transcend: "Your dagger meets divine scales that have withstood the death of worlds, its penetration meaningless against such cosmic might.",
            rewrite: "T'Kr's control over reality itself negates your precision, the strike becoming a memory of an event that never occurred.",
            divine: "The Dragon God's divine nature makes mockery of mortal weapons, your dagger's edge finding no truth to strike.",
            chaos: "Where your dagger meets scales, reality ruptures, the wound becoming a window into pure, swirling chaos."
        }
    },

    magics: {
        selfBuff1: "T'Kr's divine form blazes with the light of dying galaxies, its already incomprehensible power swelling to levels that threaten to tear reality apart.",
        selfBuff2: "The Dragon God channels the pure essence of chaos, its form becoming a nexus of unreality that warps the very laws of creation.",
        playerDebuff: "Divine power crashes over you like a tidal wave of raw creation, your very existence becoming fragile in the face of such cosmic might."
    }
        }}
    }}
}