export const DIALOGUES = {
    Intro: {
        name: "Intro",
        location: "Town Square",
        sequence: "Sequence 1: The Shattered Bazaar",
        characters: ["V'ial Imdall", "Player"],
        texts: [
            {content: "\"Welcome [[ Rift Walker ! ]] I am the Great mage of this region..... And you my friend are what is called an \"Avatar\" \"",
                choices: [
                    { text: "Where is ...Who are you...exactly?", nextDialogue: "mageIntro" },
                    { text: "What is an avatar?", nextDialogue: "avatarDefined" }
                ]}]
    },
    mageIntro: {
        name: "mageIntro",
        location: "Town Square",
        sequence: "Sequence 1: The Shattered Bazaar",
        characters: ["V'ial Imdall", "Player"],
        texts: [
            {content: "I am [[ V'ial Imdall ]], I am the mage assigned to keep the peace of this realm...... And as you can see, A very poor job i have done, which is why i need to get back to my business."},
            {content: "You look around for a moment and see yourself among burnt buildings and ash everywhere, you look forward again with the intent to ask Imdall a question",
                choices: [
                    { text: "Where am I?", nextDialogue: "avatarDefined" },
                    { text: "What is an avatar?", nextDialogue: "avatarDefined" }
                ]}]
    },
    avatarDefined: {
        name: "avatarDefined",
        location: "Town Square",
        sequence: "Sequence 1: The Shattered Bazaar",
        characters: ["V'ial Imdall", "Player"],
        texts: [
            {content: "\"Well, my friend, you are a soul magically embedded in the body of someone from another world. You were likely summoned by this jewel.\""},
            {content: "The man points at the amulet in your hand, which he had given to you earlier, \"It will help you fix the rift in which you came through and go back home\""},
            {content: "The people of this world face turmoil as a result of the revival of \"T'Kr\", an ancient deity and i have been trying to infer the cause......."},
            {content: "My friend, there is no time for further questions, more will be revealed to you as you go, The first shard should be hidden somewhere in the bazaar, you must find it and maybe...just maybe it might bring a bit of hope to this situation",
                choices: [
                    { text: "Tell me more about an avatar", nextDialogue: "avatarExplanation" },
                    { text: "What happened to the original soul?", nextDialogue: "avatarExplanation" }
                ]}]
    },
    avatarExplanation: {
        name: "avatarExplanation",
        location: "Town Square",
        sequence: "Sequence 1: The Shattered Bazaar",
        characters: ["V'ial Imdall", "Player"],
        texts: [
            {content: "You were brought here by that rift, and that amulet needs a soul to guide and fix it "},
            {content: "And as for the soul of the body you now reside in, well there's no time for such stories right now\""},
            {content: "You begin to look around, you may understand why he held his words."},
            {content: "You look forward again and Imdall is gone, you push your weight off of the floor and step forward, now you just have to find a bazaar. you are stranded, where do you even go from here",
                choices: [
                    { text: "Walk forward", nextDialogue: "wrongDirection" },
                    { text: "Take a look at the amulet", nextDialogue: "rightDirection" }
                ]}]
    },
    wrongDirection: {
        name: "wrongDirection",
        location: "Journey",
        sequence: "Sequence 1: The Shattered Bazaar",
        texts: [
            {content: "You tensely walk forward on the pavement of what you assume to be the street. You have no actual direction after all, so it's is all instinct. "},
            {content: "..........."},
            {content: "You've been walking for what feels like two hours, quite close to the amount of time you could finally admit to yourself that you are lost. Still the smell of ashes and the sight barren fields as far as your eyes can see, whatever happened here seems really devastating"},
            {content: "Pondering to yourself on your stroll, still trying to wrap your head around all of what was just explained to you and the realty of being in such a bizarre looking place, You see a shadow flash by running down the corner into an ally way."},
            {content: "You think to yourself, If you didn't know any better you'd walk through that hall despite the malicious look of the scene you are currently in. But on the other hand, You just saw a moving shadow, could be a sign of life. Something you haven't seen through out your walk here",
                choices: [
                    { text: "Turn the corner", nextDialogue: "MonsterBattle" },
                    { text: "Continue moving Forward", nextDialogue: "Dehydration" }
                ]}]
    },
    MonsterBattle: {
        name: "MonsterBattle",
        location: "Dark Alley",
        sequence: "Sequence 1: The Shattered Bazaar",
        characters: [ "ShadowBeast", "Player"],
        monster: ["Shadow Beast"],
        texts: [
            {content: "You start to walk toward the alley way...."},
            {content: "A loud shriek interrupts the sound of your footstep"},
            {content: "A creature emerges from the shadows, its eyes gleaming with malice"},
            {content: "It's a beast of some kind, What exactly were you thinking?? It was obvious that wasn't a safe choice and you seem to have no weapons...."},
            {content: "The Shadow Beast lunges forward, leaving you with precious little time to react!"},
            {content: "You check yourself for any thing that could help",
                choices: [
                    { text: "Fight", action: "fight"}
                ]}]
    },  

    Victory: {
        name: "Victory",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Dark Alley",
        texts: [
            {content: "You've defeated the monster!",
                choices: [
                    { text: "Continue", nextDialogue: "ShadowBeastDefeated" }
                ]}
        ]
    },

    ShadowBeastDefeated: {
        name: "ShadowBeastDefeated",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Dark Alley",
        characters: ["Player"],
        texts: [
            {content: "The shadow beast dissolves into wisps of darkness, its malevolent presence finally vanquished."},
            {content: "As the last remnants fade away, you notice the alley seems brighter somehow, as if a weight has been lifted."},
            {content: "You catch your breath and check your surroundings. The path ahead is clear now.",
                choices: [
                    { text: "Continue exploring", nextDialogue: "BazaarExploration" }
                ]}
        ]
    },
      
    Dehydration: {
        name: "Dehydration",
        location: "Journey",
        sequence: "Sequence 1: The Shattered Bazaar",
        texts: [
            {content: "You continue to walk forward putting a side eye to the alley...."},
            {content: "It seems like almost an hour later now. You need to hurry"},
            {content: "At this point you are cursing Vial's under your breath wondering what he expected of you without much prior information, till you remember he did tell you something about following the amulet"},
            {content: "You come to a fork in the road and both sides look like the lead towards nowhere, you are obviously way too tired and thirsty to make this decision"},
            {content: "You are getting dizzy, though you start to see a silhouette of a person. You attempt to utter some words but obviously you are already on the verge of passing out, you are too tired for this you stumble towards the silhouette and on to the ground.",
                choices: [
                    { text: "Next", nextDialogue: "Rescue" }
                ]}]
    },            
    Rescue: {
        name: "Rescue",
        location: "Merchant's shop",
        sequence: "Sequence 1: The Shattered Bazaar",
        characters: ["Eliza", "MerchantRagnor", "Player"],
        texts: [
            {content: "You open your eyes to a woman's face....",
            narration: {
                title: "A Gentle Awakening",
        texts: [
            "The world slowly comes into focus..., A gentle face hovers above you, framed by hair the color of autumn leaves, The scent of healing herbs fills the air"                    ]
        }
    },
            {content: "\"Hello Adventurer, My name is [[Eliza]]. You seemed to be in peril on the street so i brought you here\"."},
            {content: "She is as beautiful as a gentle rose,"},
            {content: "her hair as colorful as an autumn flower "},
            {content: "\"This is my father, [[Ragnor]]. He is a merchant, He helped nurse you back to health\" The beautiful woman points to a rather wretched looking dwarf man \".......um no need to pay us back though\" "},
            {content: "And don't listen, if my father tries to make you anyways",
                choices: [
                    { text: "Thank you...Where am i??", nextDialogue: "MoreInfo" },
                    { text: "Thank you.. so What do you sell here", nextDialogue: "SalesExplanation" }
                ]}]
    },                
    MoreInfo: {
        name: "MoreInfo",
        location: "Merchant's shop",
        sequence: "Sequence 1: The Shattered Bazaar",
        characters: ["Eliza", "MerchantRagnor", "Player"],
        texts: [
            {content: "\"Well you are in a town, once known as [[\"Beggerit\"]],  Once prosperous and beautiful"},
            {content: "\"what happened\"? you ask. The merchant faces you and says well nobody knows why, or who did it but [[\"T'kr\"]] a fierce god of chaos was somehow raised from the dead "},
            {content: "The woman adds \"It first destroyed the town square and then started rampaging towards the mountains,  no one knows what it wants. the city evacuated most of the people. Although all weren't lucky\""},
            {content: "\"But now the proper authorities are on the situation\""},
            {content: "\"Anyways that's enough discussion for now, we may have more customers soon. Do yoy want anything??\" ",
                choices: [
                    { text: "Show me your weapons", nextDialogue: "WeaponDisplay" },
                    { text: "I may need a potion", nextDialogue: "PotionDisplay" }
                ]}]
    },          
    rightDirection: {
        name: "rightDirection",
        location: "Journey",
        sequence: "Sequence 1: The Shattered Bazaar",
        texts: [
            {content: "You look down at the amulet resting in the palm of your hand. The green highlight in the middle of the gem seems to move as your hand moves. \"Its a compass\" you think. You steadily stroll through a narrow corridor following the entrance of the town square"},
            {content: "Almost immediately you see a Sign in the distance, but can't really make out what it says"},
            {content: "Doesn't matter anyways, Its a sign of life. Something you haven't seen much of since you spoke to the strange man."},
            {content: "That seems like almost an hour ago now. You need to hurry"},
            {content: "You managed to reach the building with the sign, Now closer to it you can easily infer that it's a store of some kind, \"Who knows what i could find for sale here\" you climb down the stairs towards the lowered door of the small shop"},
            {content: "Still looking around your surroundings, you are welcomed by a loud wretched voice. In front of you is an old man sitting in front of the counter, \"What might you be in search for young traveler\"",
                choices: [
                    { text: "I don't Know exactly", nextDialogue: "InventoryExplanation" },
                    { text: "What do you have here?", nextDialogue: "SalesExplanation" }
                ]}]
    },    
    SalesExplanation: {
        name: "SalesExplanation",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Merchant's Shop",
        characters: ["MerchantRagnor", "Player"],
        texts: [
            {content: "The shopkeeper's eyes gleam with interest"},
            {content: "\"Ah\", the old wretch exclaims. \" a curious soul! I have potions for health and magic, weapons for the brave, and... special items for customers with enough gold.\", He grins as his eyes open unnaturally wider",
                choices: [
                    { text: "Show me your weapons", nextDialogue: "WeaponDisplay" },
                    { text: "I need a potion", nextDialogue: "PotionDisplay" }
                ]}]
    },  
    InventoryExplanation: {
        name: "InventoryExplanation",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Merchant's Shop",
        characters: ["MerchantRagnor", "Player"],
        texts: [
            {content: "\" Hmmm....A confused one aren't ya\" he speaks in an almost recognizably british accent, at least in where you are from."},
            {content: "\"Although you seem to be dressed appropriately\"......... \"Where are you from boy?!\" A loud deep voice bellows from behind the door of the shop You look around, A tall figure rises and walks towards you. A man in armor repeats himself as your jaw hangs looking up at him. \"I said where from boy?\""},
            {content: "\"Around\" you utter, for a lack of better words. \"Do they not have fires in \"around\", You look awfully pale boy\". You look down at your hands and ponder for a few seconds before, the old wretch disrupts."},
            {content: "\"As i was saying before the oaf interrupted me, You have a pouch on your waist, don't ya??\"."},
            {content: "You look down and concur, you do have a pouch on. \"That can hold as much as you want it to hold\" The shopkeeper says. \"So fill 'er up with whatever in my shop you deem worthy\"",
                choices: [
                    { text: "Show me your weapons", nextDialogue: "WeaponDisplay" },
                    { text: "I would like some Information", nextDialogue: "Info" },
                    { text: "I need potions", nextDialogue: "PotionDisplay" }
                ]}]
    },
    WeaponDisplay: {
        name: "WeaponDisplay",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Merchant's Shop",
        characters: ["Merchant Ragnor", "Player"],
        texts: [
            {content: "The merchant reaches beneath his counter"},
            {content: "\"For 30 gold, I can offer you something Better than that rusty knife you're carrying.\"", trigger: "displayWeapons"},
            {content: "\"What say you, traveler? Care to upgrade your arsenal?\"",
                choices: [
                    { text: "Buy weapon", nextDialogue: "WeaponPurchase"},
                    { text: "Show me potions instead", nextDialogue: "PotionDisplay" },
                    { text: "Leave shop", nextDialogue: "LeavingShop" }
                ]}]
    },
    WeaponPurchase: {
        name: "WeaponPurchase",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Merchant's Shop",
        characters: ["Merchant Ragnor", "Player"],
        texts: [
            {content: "The merchant displays their weapons:",
                choices: [
                    { text: "Buy Iron Sword (30 gold)", action: 'buyWeapon', params: { weapon: 'Iron Sword' } },
                    { text: "Buy Steel Axe (50 gold)", action: 'buyWeapon', params: { weapon: 'Steel Axe' } },
                    { text: "Back", nextDialogue: 'ShopMenu' }
                ]}
        ]
    },
    PotionDisplay: {
        name: "PotionDisplay",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Merchant's Shop",
        characters: ["Merchant Ragnor", "Player"],
        texts: [
            {content: "The merchant pulls out a shelf of glowing vials"},
            {content: "\"Healing potions, 10 gold each. Restores 10 health. Always good to have a few handy in these dangerous times.\"",
                choices: [
                    { text: "Buy potion (10 gold)", action: "buyHealth", nextDialogue: "PotionPurchase"},
                    { text: "Show me weapons instead", nextDialogue: "WeaponDisplay" },
                    { text: "Leave shop", nextDialogue: "LeavingShop" }
                ]}]
    },
    LeavingShop: {
        name: "LeavingShop",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Bazaar Streets",
        texts: [
            {content: "You step out into the eerily quiet bazaar"},
            {content: "The streets ahead split into three paths. Dark alleyways beckon with unknown dangers and possible rewards.",
                choices: [
                    { text: "Explore the bazaar", nextDialogue: "BazaarExploration" },
                    { text: "Head to the cave", nextDialogue: "CaveEntrance" }
                ]}]
    },
    BazaarExploration: {
        name: "BazaarExploration",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Bazaar Streets",
        texts: [
            {content: "As you venture deeper into the bazaar, shadows seem to move of their own accord"},
            {content: "The air grows thick with an otherworldly presence. Something watches from the darkness."},
            {content: "A whisper echoes through your mind: [[\"Seeker of shards, your path leads to darkness. Choose wisely.\"]]",
                choices: [
                    { text: "Investigate the sounds", nextDialogue: "MonsterEncounter" },
                    { text: "Proceed cautiously", nextDialogue: "StealthApproach" }
                ]}]
    },
    StealthApproach: {
        name: "StealthApproach",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Bazaar Shadows",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "As you creep through the shadows, a figure materializes beside you"},
            {content: "\"Careful there, friend. The Shard Warden doesn't take kindly to visitors.\""},
            {content: "The man's clothes are tattered but his movements are graceful and practiced"},
            {content: "\"Name's [[Sylas]]. I know these streets better than anyone still breathing. And you... you're looking for the shard, aren't you?\"",
                choices: [
                    { text: "How do you know about the shard?", nextDialogue: "SylasExplanation" },
                    { text: "Can you help me?", nextDialogue: "SylasOffer" }
                ]}]
    },
    SylasExplanation: {
        name: "SylasExplanation",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Bazaar Shadows",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "Sylas leans against a crumbling wall, keeping his voice low"},
            {content: "\"Everyone who's anyone knows about the shards. They're what keeps the Warden here, protecting something that used to be precious to this city.\""},
            {content: "\"But here's what most don't know - the Warden isn't just guarding the shard. It's [[bound]] to it. Break that bond...\"",
                choices: [
                    { text: "Tell me more about the Warden", nextDialogue: "WardenInformation" },
                    { text: "I need to get that shard", nextDialogue: "SylasOffer" }
                ]}]
    },
    SylasOffer: {
        name: "SylasOffer",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Bazaar Shadows",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "A sly grin spreads across Sylas's face"},
            {content: "\"I can help you get to the shard. But nothing's free in the bazaar. Half of any treasures we find along the way - that's my price.\""},
            {content: "\"Or you could try your luck with the Warden alone. Your choice, friend.\"",
                choices: [
                    { text: "Accept Sylas's help", nextDialogue: "AcceptSylasHelp", action: "modifyGold" },
                    { text: "Refuse and go alone", nextDialogue: "RefuseSylas" }
                ]}]
    },
    AcceptSylasHelp: {
        name: "AcceptSylasHelp",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Hidden Passages",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "Sylas leads you through a maze of hidden passages"},
            {content: "\"The Warden's got patterns. Times when it's more focused on one area than others. We'll use that.\""},
            {content: "You hear heavy footsteps in the distance"},
            {content: "\"Quick, through here. And remember - [[quiet steps win races]].\""},
            {content: "You come across an abandoned merchant's cache"},
            {content: "\"Well, well... what do we have here? Time to split the spoils, friend.\"",
                trigger: "findTreasure"},
            {content: "Sylas takes his share of the gold, but his knowledge seems invaluable.",
                choices: [
                    { text: "Continue following Sylas", nextDialogue: "ApproachShardChamber" }
                ]}]
    },
    RefuseSylas: {
        name: "RefuseSylas",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Bazaar Streets",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "Sylas melts back into the shadows with a knowing smirk"},
            {content: "\"Your funeral, friend. But don't say I didn't offer...\""},
            {content: "The bazaar seems more threatening now that you're alone"},
            {content: "The path ahead leads to a grand chamber. Heavy footsteps echo from within.",
                choices: [
                    { text: "Approach carefully", nextDialogue: "WardenConfrontation" },
                    { text: "Look for another way", nextDialogue: "SearchAlternateRoute" }
                ]}]
    },

    ApproachShardChamber: {
        name: "ApproachShardChamber",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Near Shard Chamber",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "Sylas stops at a grand archway, his expression serious"},
            {content: "\"The shard's in there, along with our friend the Warden. Now, I've got a plan...\""},
            {content: "\"I can create a distraction. Draw the Warden away while you grab the shard. But timing will be everything.\"",
                choices: [
                    { text: "Trust Sylas's plan", nextDialogue: "SylasDistraction" },
                    { text: "Face the Warden together", nextDialogue: "WardenConfrontationDuo" }
                ]}]
    },

    Fight: {
        name: "Fight",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Shard Chamber",
        characters: ["Shard Warden", "Player"],
        monster: ["Shard Warden"],
        texts: [
            {content: "The Shard Warden towers before you, its ancient armor pulsing with magical energy"},
            {content: "[[INTRUDER... THE SHARD MUST BE PROTECTED...]]"},
            {content: "The chamber trembles as the Warden raises its weapon"},
            {content: "You must act quickly!",
                choices: [
                    { text: "Attack", action: "fight"}
                    
                ]}]
    },        
 
    DefeatWarden: {
        name: "DefeatWarden",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Shard Chamber",
        characters: ["Shard Warden", "Player"],
        texts: [
            {content: "The Warden crashes to the ground, its magical energy dissipating"},
            {content: "In the center of the chamber, the shard pulses with an otherworldly light.",
            trigger: "defeatBoss"},
            {content: "As you approach the shard, you feel its power calling to you"},
            {content: "The first piece of the puzzle is within your grasp...",
                choices: [
                    { text: "Take the shard", nextDialogue: "ObtainFirstShard" }
                ]}]
        }, 
        GameOver: {
            texts: [
                {content: "You have been defeated... Game Over",
                    choices: [
                        { text: "Try Again", nextDialogue: 'Intro' }
                    ]}
            ]
        },   
    ObtainFirstShard: {
        name: "ObtainFirstShard",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Shard Chamber",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "The shard's energy courses through you as you grasp it"},
            {content: "A vision flashes through your mind - glimpses of other shards, other challenges yet to come."},
            {content: "Sylas emerges from the shadows, slow applauding"},
            {content: "\"Well done, friend. Didn't think you had it in you. Now, about our arrangement...\"",
                choices: [
                    { text: "Share the remaining treasure", nextDialogue: "EndSequenceOne",action: "modifyGold" },
                    { text: "Refuse to share", nextDialogue: "EndSequenceOneBad" }
                ]}]
        },
    EndSequenceOne: {
        name: "EndSequenceOne",
        sequence: "Sequence 1: The Shattered Bazaar",
        location: "Bazaar Exit",
        characters: ["Sylas", "Player"],
        texts: [
            {content: "You honor your agreement with Sylas"},
            {content: "\"You're different from the others who've come seeking the shards. Here's a tip - check the forest to the east. But watch out for the whispers...\""},
            {content: "With the first shard secured, your journey continues"},
            {content: "The weight of the shard in your pack reminds you of the challenges ahead...",
                trigger: "completeSequence",
                choices: [
                    { text: "Continue to Sequence 2", nextDialogue: "StartSequenceTwo" }
                ]}]
        }
};