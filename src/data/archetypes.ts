/**
 * ARCHETYPE DATA - Official Wrath & Glory archetypes
 * Source: Core Rulebook p.90-117
 */

import type { Archetype } from '@/types/archetype';
import { getKeywordDefinition } from './keywords';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Resolve keyword choice details from the keyword database
 * This ensures we don't duplicate data - archetype just references the keyword ID
 */
export function resolveKeywordChoice(bracketedKeywordId: string) {
  const keywordDef = getKeywordDefinition(bracketedKeywordId);
  
  if (!keywordDef) {
    console.warn(`Keyword definition not found for: ${bracketedKeywordId}`);
    return null;
  }
  
  return {
    keyword: keywordDef.keyword,
    name: keywordDef.name,
    description: keywordDef.description,
    examples: keywordDef.examples || [],
  };
}

// ============================================================================
// TIER 1 ARCHETYPES - Starting characters
// ============================================================================

/**
 * SISTER HOSPITALLER (Tier 1)
 * A battlefield healer of both body and soul
 */
export const SISTER_HOSPITALLER: Archetype = {
  id: 'sister-hospitaller',
  name: 'Sister Hospitaller',
  faction: 'Adepta Sororitas',
  tier: 1,
  
  description: 'A battlefield healer of both mind and soul. You ministrate to the injured with great Medicae expertise and inspire the pious with your cavernous well of faith.',
  
  flavorText: 'Our medicae knowledge of these xenos bioweapons is limited; fortunately, my faith in the Emperor is not.',
  
  loreText: `When plague runs rife or blood spills, every Imperial Citizen prays the Emperor will send a skilled and compassionate Sister Hospitaller. They are the Emperor's loving embrace, devout women sent to purify festering flesh and stitch the faithful's wounds. Becoming a Sister Hospitaller requires complete dedication to the Adepta Sororitas' teachings and meticulous research of anatomy and physiology.

Their expertise in Medicae and resolute will makes them invaluable assets for unlocking the secrets of bizarre xenos biology, decoding deadly neurotoxin bombs, and discovering non-lethal but excruciatingly painful torture techniques. A Sister Hospitaller fulfils the vital dual role of physical and spiritual healer in a group. Though they usually prefer to put people back together, they are also skilled at taking them apart.`,
  
  speciesRestriction: ['human'],
  
  // BASE COST: Just the archetype itself
  cost: 24,
  
  // SUGGESTED PURCHASE: Optional "quick build" buttons
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 2,
        toughness: 2,
        agility: 2,
        initiative: 2,
        willpower: 3,
        intellect: 3,
        fellowship: 3,
      },
      cost: 26,
    },
    skills: {
      values: {
        investigation: 1,
        medicae: 3,
        scholar: 2,
        weaponSkill: 2,
      },
      cost: 22,
    },
    talents: {
      names: ['By His Will', 'Orthopraxy', 'Shield of Faith'],
      cost: 0, // Will be calculated from talent database
    },
  },
  
  // GRANTED BY ARCHETYPE (automatic)
  keywords: ['IMPERIUM', 'ADEPTUS MINISTORUM', 'ADEPTA SORORITAS'],
  
  // KEYWORD CHOICES (player must select from keyword database)
  keywordChoices: [
    {
      bracketedKeywordId: '[ORDER]',
      required: true,
    },
  ],
  
  attributeBonuses: {
    willpower: 3,
    intellect: 3,
  },
  
  skillBonuses: {
    medicae: 1,
    scholar: 1,
  },
  
  ability: {
    abilityId: 'loyal-compassion',
    name: 'Loyal Compassion',
    description: 'Your dedication to healing the Emperor\'s servants is unmatched.',
    gameEffect: '+Double Rank bonus dice whenever you make a Medicae (Int) Test on a character with the IMPERIUM Keyword.',
  },
  
  wargear: [
    {
      type: 'specific',
      items: [
        'Sororitas Power Armour',
        'Chirurgeon\'s Tools',
        'Chain Bayonet (wrist mounted)',
        'Laspistol',
        'Sororitas Vestments',
        'Copy of the Rule of the Sororitas',
      ],
    },
  ],
  
  influenceBonus: 0,
  
  source: {
    book: 'Core Rulebook',
    page: 91,
  },
};

/**
 * MINISTORUM PRIEST (Tier 1)
 * A preacher and enforcer of the Imperial Cult
 */
export const MINISTORUM_PRIEST: Archetype = {
  id: 'ministorum-priest',
  name: 'Ministorum Priest',
  faction: 'Adeptus Ministorum',
  tier: 1,
  
  description: 'You preach and enforce the Imperial Cult. You lead the faithful to execute His will, inflaming faithful hearts with your impassioned oration.',
  
  flavorText: 'Deliverance from your blasphemy is possible, brother. Take up your blade, and join me in charge! Death in service is salvation!',
  
  loreText: `Paragons of faith in the Emperor, every moment of a Ministorum Priests existence is devoted to bringing the Imperial Cult greater glory. Many members of the Ecclesiarchy believe they are the mortal manifestations of the God-Emperor's Will, brought into existence to demonstrate His might, His triumphs, and the wisdom of His creed.

When priests take to the battlefield they lead the righteous charge, invigorating allies with hymns and litanies of zealous hatred, armed only with small arms and their faith. A priest's respected position will open doors; few pious citizens will turn away a priest, as to do so is to turn away from the light of the God-Emperor Himself.`,
  
  speciesRestriction: ['human'],
  
  cost: 12,
  
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 1,
        toughness: 2,
        agility: 2,
        initiative: 2,
        willpower: 3,
        intellect: 2,
        fellowship: 3,
      },
      cost: 26,
    },
    skills: {
      values: {
        awareness: 2,
        ballisticSkill: 2,
        insight: 1,
        intimidation: 1,
        leadership: 2,
        scholar: 2,
        weaponSkill: 2,
      },
      cost: 32,
    },
    talents: {
      names: ['Flagellant', 'In His Name', 'Repent!'],
      cost: 0,
    },
  },
  
  keywords: ['IMPERIUM', 'ADEPTUS MINISTORUM'],
  
  keywordChoices: [],
  
  attributeBonuses: {
    willpower: 3,
  },
  
  skillBonuses: {
    scholar: 1,
  },
  
  ability: {
    abilityId: 'fiery-invective',
    name: 'Fiery Invective',
    description: 'You can preach the word of the Imperial Creed to inspire the faithful.',
    gameEffect: 'You can preach the word of the Imperial Creed as a Free Action once per combat. You and all allies with the IMPERIUM Keyword heal 1d3+Rank Shock.',
  },
  
  wargear: [
    {
      type: 'specific',
      items: [
        'Chainsword',
        'Laspistol',
        'Rosarius',
        'Knife',
        'Ministorum Robes',
        'Missionary Kit',
      ],
    },
  ],
  
  influenceBonus: 0,
  
  source: {
    book: 'Core Rulebook',
    page: 92,
  },
};

/**
 * IMPERIAL GUARDSMAN (Tier 1)
 * A trained foot soldier in the galaxy's greatest army
 */
export const IMPERIAL_GUARDSMAN: Archetype = {
  id: 'imperial-guardsman',
  name: 'Imperial Guardsman',
  faction: 'Astra Militarum',
  tier: 1,
  
  description: 'A footsoldier in the galaxy\'s greatest army. You are one of billions of raw recruits trained to stand and fire against the monstrous enemies of humanity.',
  
  flavorText: 'I only regret that I have but one life to give for the Emperor.',
  
  loreText: `Citizens plucked from planets across the Imperium's staggering expanse, each member of the Astra Militarum survives brutal training to prepare for their purpose; war. Armed with mass-produced weaponry and flung across the galaxy on voidships, uncountable waves of Imperial Guard fight back the alien and the heretic as the Emperor's hammer.

An average human is no match for a rampaging Ork, a sly Aeldari Psyker, or a monstrous Tyranid bioform. Even those well trained and armed cannot hope to match the horrors they face. To stand in the face of such nightmares is akin to madness. And yet the Guard stand, shoulder to shoulder with brothers and sisters at arms from across the Imperium.`,
  
  speciesRestriction: ['human'],
  
  cost: 6,
  
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 3,
        toughness: 3,
        agility: 3,
        initiative: 3,
        willpower: 2,
        intellect: 1,
        fellowship: 2,
      },
      cost: 48,
    },
    skills: {
      values: {
        athletics: 2,
        awareness: 1,
        ballisticSkill: 3,
        survival: 1,
        weaponSkill: 1,
      },
      cost: 18,
    },
    talents: {
      names: ['Deadshot', 'Die Hard', 'Gallows Humour'],
      cost: 0,
    },
  },
  
  keywords: ['IMPERIUM', 'ASTRA MILITARUM'],
  
  keywordChoices: [
    {
      bracketedKeywordId: '[REGIMENT]',
      required: true,
    },
  ],
  
  skillBonuses: {
    ballisticSkill: 2,
  },
  
  ability: {
    abilityId: 'look-out-sir',
    name: 'Look Out, Sir!',
    description: 'You have been drilled in sacrificing yourself to save your allies.',
    gameEffect: 'Once per combat, you may take a Reflexive Action to move up to half your Speed to get in the way of any attack that hit an ally. The attacker then rolls against your Resilience instead of your ally\'s, and may deal Wounds to you. Your Resilience increases by +Rank for the purpose of calculating this damage.',
  },
  
  wargear: [
    {
      type: 'specific',
      items: [
        'Flak Armour',
        'Lasgun',
        'Knife',
        'Munitorum issue mess kit',
        'Grooming kit',
        'A copy of the Imperial Infantryman\'s Uplifting Primer',
        '3 ration packs',
      ],
    },
  ],
  
  influenceBonus: 0,
  
  source: {
    book: 'Core Rulebook',
    page: 93,
  },
};

/**
 * INQUISITORIAL ACOLYTE (Tier 1)
 * An agent of the Imperium who identifies and destroys its enemies
 */
export const INQUISITORIAL_ACOLYTE: Archetype = {
  id: 'inquisitorial-acolyte',
  name: 'Inquisitorial Acolyte',
  faction: 'Inquisition',
  tier: 1,
  
  description: 'Conscripted to aid an Inquisitor, you identify and destroy threats to the Imperium.',
  
  flavorText: 'The Emperor bestowed authority to my master; she bequeathed knowledge to me. My gift to you is freedom from the crime of your existence.',
  
  loreText: `Foot soldiers in the fight for the Emperor's soul, each Acolyte reports to a higher member of the Inquisition. Some are assigned to investigate or purge cultist cells, while others are allowed free reign to cleanse the Imperium of the alien, the witch, and the heretic.

Each Acolyte has a unique combination of skills, equipment, and life experiences. There's no formalised recruitment process — whenever an Inquisitor finds a promising individual, or simply needs more numbers to enact their grand plans, they hire an Acolyte.`,
  
  speciesRestriction: ['human'],
  
  cost: 6,
  
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 2,
        toughness: 3,
        agility: 2,
        initiative: 2,
        willpower: 3,
        intellect: 3,
        fellowship: 1,
      },
      cost: 42,
    },
    skills: {
      values: {
        athletics: 1,
        ballisticSkill: 2,
        insight: 3,
        intimidation: 1,
        investigation: 3,
        scholar: 1,
      },
      cost: 30,
    },
    talents: {
      names: ['Ever Vigilant', 'Lip Reader', 'Secret Identity'],
      cost: 0,
    },
  },
  
  keywords: ['IMPERIUM', 'INQUISITION'],
  
  keywordChoices: [
    {
      bracketedKeywordId: '[ANY]',
      required: true,
    },
    {
      bracketedKeywordId: '[ORDO]',
      required: true,
    },
  ],
  
  skillBonuses: {
    // Player chooses any skill to increase to 2
  },
  
  ability: {
    abilityId: 'inquisitorial-decree',
    name: 'Inquisitorial Decree',
    description: 'You can invoke the name of your Inquisitor to gain authority.',
    gameEffect: 'You can invoke the name of your Inquisitor to gain +Rank bonus dice to any social Skill test when interacting with an individual with the IMPERIUM Keyword. You can only use this ability once per scene.',
  },
  
  wargear: [
    {
      type: 'specific',
      items: ['Flak Armour', 'Symbol of Authority'],
    },
    {
      type: 'any',
      constraints: {
        maxValue: 5,
        maxRarity: 'Uncommon',
        keywords: ['IMPERIUM'],
      },
      count: 2,
    },
  ],
  
  influenceBonus: 0,
  
  source: {
    book: 'Core Rulebook',
    page: 94,
  },
};

/**
 * INQUISITORIAL SAGE (Tier 1)
 * A bureaucratic savant who wields information as a weapon
 */
export const INQUISITORIAL_SAGE: Archetype = {
  id: 'inquisitorial-sage',
  name: 'Inquisitorial Sage',
  faction: 'Inquisition',
  tier: 1,
  
  description: 'You are a bureaucratic savant, an expert at sourcing and judiciously applying knowledge to serve the Imperium and your own ends.',
  
  flavorText: 'The planet is not \'lost\', my liege. It is exactly where it was, as far as we know. The files have just been misplaced, and the Prefectus in charge of them passed away… about a century ago.',
  
  loreText: `Inquisitors and Acolytes may be expert investigators, hunting down cultists and nefarious aliens, but their training will never make it possible for them to recall the vast information that makes up the Adeptus Terra's immense bureaucracy.

Inquisitorial Sages are applied to this impossibly huge librarium, looking for the grain of truth with which an Inquisitor may hound their prey. When applied to an Inquisitorial mission, these scholarly individuals discover details that can give insight into heretical plans or aliens who have influenced a sector for centuries.`,
  
  speciesRestriction: ['human'],
  
  cost: 16,
  
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 1,
        toughness: 1,
        agility: 2,
        initiative: 2,
        willpower: 3,
        intellect: 4,
        fellowship: 2,
      },
      cost: 32,
    },
    skills: {
      values: {
        awareness: 2,
        ballisticSkill: 1,
        deception: 1,
        investigation: 2,
        scholar: 3,
        tech: 1,
      },
      cost: 24,
    },
    talents: {
      names: ['Augmetic', 'Deductive', 'Supplicant'],
      cost: 0,
    },
  },
  
  keywords: ['ADEPTUS ADMINISTRATUM', 'IMPERIUM', 'INQUISITION'],
  
  keywordChoices: [
    {
      bracketedKeywordId: '[ORDO]',
      required: true,
    },
  ],
  
  attributeBonuses: {
    intellect: 3,
  },
  
  skillBonuses: {
    scholar: 2,
  },
  
  ability: {
    abilityId: 'administratum-records',
    name: 'Administratum Records',
    description: 'You are particularly adept at navigating the Imperium\'s colossal bureaucracy.',
    gameEffect: 'You gain +Rank bonus dice whenever you make a Test to gather information from Imperial sources, typically on Influence or Investigation (Int) tests.',
  },
  
  wargear: [
    {
      type: 'specific',
      items: [
        'Administratum Robes',
        'Laspistol',
        'Knife',
        'Auto Quill',
        'Data-Slate',
        '3 Scrolls of Ancient Records',
      ],
    },
  ],
  
  influenceBonus: 1,
  
  source: {
    book: 'Core Rulebook',
    page: 95,
  },
};

/**
 * GANGER (Tier 1)
 * A crude criminal of the Imperial underclass
 */
export const GANGER: Archetype = {
  id: 'ganger',
  name: 'Ganger',
  faction: 'Scum',
  tier: 1,
  
  description: 'A member of the Imperial underclass, your life is rife with violence and hardship. Your identity is tied to a territorial gang, a brutal reflection of lower hive life.',
  
  flavorText: 'This hive is rife with villainous Scum, fighting with mutants, racing promethium-fuelled death traps, exploring the dangers of the sump. All they have is each other.',
  
  loreText: `Life in the Imperium is a fight for survival, but there is strength in numbers. Overworked citizens band together, rising from the slums and sewage to take what they can with threats and violence.

A Ganger fights for their found family. Though some break the Pax Imperialis for profit, many are normal citizens taking up arms to find justice. Anything can unite a gang; religious fervour, social injustice, a passion for technology. Those that survive develop traditions, initiation rituals, and identifying markers.`,
  
  speciesRestriction: ['human'],
  
  cost: 2,
  
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 2,
        toughness: 3,
        agility: 2,
        initiative: 3,
        willpower: 2,
        intellect: 1,
        fellowship: 3,
      },
      cost: 42,
    },
    skills: {
      values: {
        awareness: 1,
        ballisticSkill: 2,
        cunning: 3,
        deception: 1,
        investigation: 1,
        stealth: 1,
        survival: 1,
        weaponSkill: 2,
      },
      cost: 32,
    },
    talents: {
      names: ['Dirty Fighter', 'Hive Explorer', 'Unremarkable'],
      cost: 0,
    },
  },
  
  keywords: ['SCUM'],
  
  keywordChoices: [
    {
      bracketedKeywordId: '[ANY]',
      required: true,
    },
  ],
  
  skillBonuses: {
    cunning: 1,
  },
  
  ability: {
    abilityId: 'scrounger',
    name: 'Scrounger',
    description: 'Your life with less has made you adept at finding spares and supplies in the most unlikely of places.',
    gameEffect: 'You gain +Rank bonus dice to Cunning (Fel) Tests. Once per session you may make an Influence or Cunning Test to acquire an item, representing something you have prepared in advance.',
  },
  
  wargear: [
    {
      type: 'choice',
      items: ['Knife', 'Sword'],
      count: 1,
    },
    {
      type: 'specific',
      items: ['Bedroll', 'Canteen', 'Gang colours'],
    },
    {
      type: 'choice',
      items: ['Laspistol', 'Autopistol', 'Hand Cannon', 'Stubber'],
      count: 1,
    },
  ],
  
  influenceBonus: 1,
  
  source: {
    book: 'Core Rulebook',
    page: 96,
  },
};

/**
 * CORSAIR (Tier 1)
 * A self-imposed outcast and space pirate
 */
export const CORSAIR: Archetype = {
  id: 'corsair',
  name: 'Corsair',
  faction: 'Aeldari',
  tier: 1,
  
  description: 'A space pirate, a self-imposed exile of your Species, you raid and fight for coin, and to experience the full spectrum of sensation and emotion.',
  
  flavorText: 'Why, Mon-Keigh? In your base tongue, because it was… exciting.',
  
  loreText: `Travelling the stars in small, swift vessels, Corsairs strike aggressively and opportunistically. Operating in tight bands rich with camaraderie, they pirate any prey to satiate their desire for lives filled with passion.

Unbound by the strictures of their Craftworld kin, the swaggering Corsair embraces the vast depth of their emotion. They risk death and consumption by She Who Thirsts to fill their wanderlust, travelling the galaxy at their whim in a quest for new experiences.`,
  
  speciesRestriction: ['aeldari'],
  
  cost: 16,
  
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 2,
        toughness: 2,
        agility: 4,
        initiative: 4,
        willpower: 1,
        intellect: 2,
        fellowship: 2,
      },
      cost: 46,
    },
    skills: {
      values: {
        athletics: 3,
        awareness: 1,
        ballisticSkill: 2,
        pilot: 1,
        weaponSkill: 1,
      },
      cost: 18,
    },
    talents: {
      names: ['Augmetic', 'Legacy of Sorrow', 'Touched by Fate'],
      cost: 0,
    },
  },
  
  keywords: ['AELDARI', 'ANHRATHE'],
  
  keywordChoices: [
    {
      bracketedKeywordId: '[COTERIE]',
      required: true,
    },
  ],
  
  attributeBonuses: {
    agility: 3,
  },
  
  skillBonuses: {
    athletics: 2,
  },
  
  ability: {
    abilityId: 'dancing-on-blades-edge',
    name: 'Dancing on the Blade\'s Edge',
    description: 'You throw yourself into danger with reckless abandon to hide your ancestral fears.',
    gameEffect: 'You gain +Rank bonus dice whenever you make or resist an Athletics (S) or Persuasion (Fel) Interaction Attack. You suffer a +1 DN penalty to Fear Tests.',
  },
  
  wargear: [
    {
      type: 'specific',
      items: [
        'Corsair Armour',
        'Shuriken Pistol',
        'Lasblaster',
        'Spirit Stone',
        '3 Plasma Grenades',
        'Void Suit',
      ],
    },
  ],
  
  influenceBonus: 0,
  
  source: {
    book: 'Core Rulebook',
    page: 97,
  },
};

/**
 * ORK BOY (Tier 1)
 * A brutish creature born to fight
 */
export const ORK_BOY: Archetype = {
  id: 'ork-boy',
  name: 'Ork Boy',
  faction: 'Ork',
  tier: 1,
  
  description: 'A hulking, brutish creature who lives only to fight. You are a loutish, anarchic bruiser born for battle.',
  
  flavorText: 'Do not fear their great numbers! Only cowards need overwhelm their foes! Do not be intimidated by their size! These brutes cannot stand against the strength of our faith!',
  
  loreText: `The terrifying tide of charging green beasts known as a WAAAGH! is made up of Boyz, the most common of the Orks. Few know of anything besides war, and the Boyz like it that way. Bigger and stronger than a Human in every way, with a mind bent only toward fighting and killing, a single Ork can rip through a crowd without exertion.

Though part of a clan, each Boy has their own look cobbled together from gubbinz and bitz. Their ramshackle weapons are built from scrap, but Orks love their absurd amalgamations — provided they prove as deadly as possible.`,
  
  speciesRestriction: ['ork'],
  
  cost: 26,
  
  suggestedPurchase: {
    attributes: {
      values: {
        strength: 4,
        toughness: 4,
        agility: 2,
        initiative: 3,
        willpower: 1,
        intellect: 1,
        fellowship: 1,
      },
      cost: 34,
    },
    skills: {
      values: {
        athletics: 1,
        ballisticSkill: 1,
        intimidation: 2,
        weaponSkill: 3,
      },
      cost: 16,
    },
    talents: {
      names: ['Berzerker', 'Brutalist', 'Frenzy'],
      cost: 0,
    },
  },
  
  keywords: ['ORK'],
  
  keywordChoices: [
    {
      bracketedKeywordId: '[CLAN]',
      required: true,
    },
  ],
  
  attributeBonuses: {
    strength: 3,
    toughness: 3,
  },
  
  skillBonuses: {
    weaponSkill: 2,
  },
  
  ability: {
    abilityId: 'get-stuck-in',
    name: 'Get Stuck In',
    description: 'You fight better when you\'re part of a mob.',
    gameEffect: 'You gain +Rank bonus dice to melee attacks for every ally engaged with the same target as you.',
  },
  
  wargear: [
    {
      type: 'specific',
      items: ['Shoota', 'Slugga', 'Choppa', 'Ripped clothes'],
    },
  ],
  
  influenceBonus: 0,
  
  source: {
    book: 'Core Rulebook',
    page: 98,
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export const TIER_1_ARCHETYPES: Archetype[] = [
  SISTER_HOSPITALLER,
  MINISTORUM_PRIEST,
  IMPERIAL_GUARDSMAN,
  INQUISITORIAL_ACOLYTE,
  INQUISITORIAL_SAGE,
  GANGER,
  CORSAIR,
  ORK_BOY,
];

export const ALL_ARCHETYPES: Archetype[] = [
  ...TIER_1_ARCHETYPES,
];

export function getArchetypeById(id: string): Archetype | undefined {
  return ALL_ARCHETYPES.find(a => a.id === id);
}

export function getArchetypesByTier(tier: number): Archetype[] {
  return ALL_ARCHETYPES.filter(a => a.tier === tier);
}

export function getArchetypesByFaction(faction: string): Archetype[] {
  return ALL_ARCHETYPES.filter(a => a.faction === faction);
}

export function getArchetypesBySpecies(species: string): Archetype[] {
  return ALL_ARCHETYPES.filter(a => 
    a.speciesRestriction.includes(species as any)
  );
}
