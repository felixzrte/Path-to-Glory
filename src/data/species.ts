/**
 * SPECIES DATA - Official Wrath & Glory species
 * Source: Core Rulebook
 */

import type { Species } from '@/types/species';

/**
 * HUMAN
 * The most numerous species in the galaxy
 * 
 * XP Cost: 0
 * Speed: 6
 * Bonuses: None (but also costs 0 XP!)
 */
export const HUMAN: Species = {
  id: 'human',
  name: 'Human',
  xpCost: 0,
  
  // Humans start with no bonuses - all attributes start at 1
  baseAttributes: {},
  baseSkills: {},
  
  // Attribute maximums (humans are balanced)
  attributeMaximums: {
    strength: 8,
    toughness: 8,
    agility: 8,
    initiative: 8,
    willpower: 8,
    intellect: 8,
    fellowship: 8,
  },
  
  // No special properties - humans are flexible!
  properties: [],
  
  speed: 6,
  size: 'average',
  keywords: ['IMPERIUM', 'HUMAN'],
  
  description: 'The uncounted trillions of Humans are the most numerous and widespread Species in the galaxy. Their fathomless multitudes are spread across a million worlds with endless variety in mind and body.',
  
  commonNames: [
    'Adrielle', 'Alaric', 'Barus', 'Castus', 'Celeste',
    'Diana', 'Dar', 'Davian', 'Ephrael', 'Erith', 'Estebus',
    'Felicia', 'Gaius', 'Gezrael', 'Halo', 'Harken',
    'Haveloch', 'Hestia', 'Iris', 'Jestilla', 'Kamir', 'Katrina',
    'Lukas', 'Lyta', 'Mikel', 'Mira', 'Nura', 'Ophelia', 'Poul',
    'Quitus', 'Ravenna', 'Rossel', 'Ruby', 'Silvana', 'Skyv',
    'Steele', 'Taur', 'Titus', 'Tyanna', 'Ursa', 'Undine',
    'Verbal', 'Victor', 'Waynoka', 'Wilhemina', 'Xavier',
    'Yvette', 'Zane', 'Zellith', 'Zek',
  ],
  
  source: {
    book: 'Core Rulebook',
    page: 26,
  },
};

/**
 * ADEPTUS ASTARTES (Space Marines)
 * The Emperor's Angels of Death
 * 
 * XP Cost: 160
 * Speed: 7
 * Bonuses: Str 4, Tou 4, Agi 4, Ini 4, Int 3, Wil 3
 *          Athletics 3, Awareness 3, Ballistic Skill 3, Stealth 3, Weapon Skill 3
 */
export const ADEPTUS_ASTARTES: Species = {
  id: 'adeptus-astartes',
  name: 'Adeptus Astartes',
  xpCost: 160,
  
  // Starting attributes
  baseAttributes: {
    strength: 4,
    toughness: 4,
    agility: 4,
    initiative: 4,
    intellect: 3,
    willpower: 3,
  },
  
  // Starting skills
  baseSkills: {
    athletics: 3,
    awareness: 3,
    ballisticSkill: 3,
    stealth: 3,
    weaponSkill: 3,
  },
  
  // Attribute maximums (enhanced beyond human)
  attributeMaximums: {
    strength: 10,
    toughness: 10,
    agility: 9,
    initiative: 9,
    willpower: 10,
    intellect: 10,
    fellowship: 8,
  },
  
  // Special abilities
  properties: [
    {
      id: 'astartes-defender',
      type: 'feature',
      name: 'Defender of Humanity',
      parent: '',
      children: [],
      order: 1,
      tags: ['species', 'combat'],
      enabled: true,
      text: 'Add +Rank Icons to any successful attack against a Mob.',
      description: 'Space Marines are devastatingly effective against hordes of lesser foes.',
    },
    {
      id: 'astartes-honour',
      type: 'feature',
      name: 'Honour the Chapter',
      parent: '',
      children: [],
      order: 2,
      tags: ['species', 'social'],
      enabled: true,
      text: 'You are subject to the orders of your chapter master, and must honour the beliefs and traditions of your chapter.',
      description: 'Space Marines are bound by duty and honour.',
    },
    {
      id: 'astartes-resolve',
      type: 'bonus',
      name: 'Astartes Resolve',
      parent: '',
      children: [],
      order: 3,
      tags: ['species', 'resolve'],
      enabled: true,
      target: 'resolve',
      amount: 1,
      description: 'Your Resolve increases by +1',
    },
    {
      id: 'astartes-implants',
      type: 'feature',
      name: 'Space Marine Implants',
      parent: '',
      children: [],
      order: 4,
      tags: ['species', 'combat'],
      enabled: true,
      text: 'You are immune to the Bleeding Condition. You gain +1 bonus dice to any test related to one of the 19 implants if the GM agrees it is appropriate.',
      description: 'The 19 gene-seed implants make Space Marines superhuman.',
    },
  ],
  
  speed: 7,
  size: 'large',
  keywords: ['IMPERIUM', 'ADEPTUS ASTARTES', '[CHAPTER]'],
  
  description: 'The Emperor\'s Angels of Death were all once mortal men. All have undergone incredible trials and Gene-Seed implantation to become something more: transhuman demigods created for war who know no fear.',
  
  commonNames: [
    'Androcles', 'Balthazar', 'Chryses', 'Diallo',
    'Egnatius', 'Fafnir', 'Gerhart', 'Helbrecht', 'Ibrahim',
    'Jamshaid', 'Kalim', 'Luthando', 'Maximus',
    'Nicator', 'Octavian', 'Proteus', 'Qaseem', 'Raziq',
    'Seigfried', 'Tarik', 'Ursinus', 'Viggo', 'Woyzeck',
    'Xanthus', 'Youssou', 'Zosimus',
  ],
  
  source: {
    book: 'Core Rulebook',
    page: 27,
  },
};

/**
 * PRIMARIS ASTARTES
 * Enhanced Space Marines with improved gene-seed
 * 
 * XP Cost: 198
 * Speed: 7
 * Bonuses: Str 5, Tou 5, Agi 4, Ini 4, Int 3, Wil 3
 *          Athletics 3, Awareness 3, Ballistic Skill 4, Stealth 3, Weapon Skill 3
 */
export const PRIMARIS_ASTARTES: Species = {
  id: 'primaris-astartes',
  name: 'Primaris Astartes',
  xpCost: 198,
  
  // Starting attributes (stronger than regular Astartes!)
  baseAttributes: {
    strength: 5,
    toughness: 5,
    agility: 4,
    initiative: 4,
    intellect: 3,
    willpower: 3,
  },
  
  // Starting skills (better shooting!)
  baseSkills: {
    athletics: 3,
    awareness: 3,
    ballisticSkill: 4,
    stealth: 3,
    weaponSkill: 3,
  },
  
  // Attribute maximums (even higher than Astartes)
  attributeMaximums: {
    strength: 12,
    toughness: 12,
    agility: 9,
    initiative: 9,
    willpower: 10,
    intellect: 10,
    fellowship: 8,
  },
  
  // Special abilities
  properties: [
    {
      id: 'primaris-defender',
      type: 'feature',
      name: 'Defender of Humanity',
      parent: '',
      children: [],
      order: 1,
      tags: ['species', 'combat'],
      enabled: true,
      text: 'Add +Rank Icons to any successful attack against a Mob.',
    },
    {
      id: 'primaris-honour',
      type: 'feature',
      name: 'Honour the Chapter (Primaris)',
      parent: '',
      children: [],
      order: 2,
      tags: ['species', 'social'],
      enabled: true,
      text: 'You are subject to the orders of your chapter master, and must honour the beliefs and traditions of your chapter. As a Primaris, you ignore any impurities in your Chapter Gene-Seed, and also gain +3 Wounds.',
    },
    {
      id: 'primaris-resolve',
      type: 'bonus',
      name: 'Primaris Resolve',
      parent: '',
      children: [],
      order: 3,
      tags: ['species', 'resolve'],
      enabled: true,
      target: 'resolve',
      amount: 1,
    },
    {
      id: 'primaris-wounds',
      type: 'bonus',
      name: 'Primaris Toughness',
      parent: '',
      children: [],
      order: 4,
      tags: ['species', 'wounds'],
      enabled: true,
      target: 'wounds',
      amount: 3,
      description: 'Primaris gain +3 bonus Wounds',
    },
    {
      id: 'primaris-implants',
      type: 'feature',
      name: 'Space Marine Implants',
      parent: '',
      children: [],
      order: 5,
      tags: ['species', 'combat'],
      enabled: true,
      text: 'You are immune to the Bleeding Condition. You gain +1 bonus dice to any test related to one of the 22 implants if the GM agrees it is appropriate.',
      description: 'Primaris have 22 gene-seed implants (3 more than regular Astartes).',
    },
  ],
  
  speed: 7,
  size: 'large',
  keywords: ['IMPERIUM', 'ADEPTUS ASTARTES', 'PRIMARIS', '[CHAPTER]'],
  
  description: 'Primaris Space Marines are a new breed of transhuman warriors, larger and more powerful than their Firstborn brothers.',
  
  commonNames: [
    'Androcles', 'Balthazar', 'Chryses', 'Diallo',
    'Egnatius', 'Fafnir', 'Gerhart', 'Helbrecht', 'Ibrahim',
    'Jamshaid', 'Kalim', 'Luthando', 'Maximus',
    'Nicator', 'Octavian', 'Proteus', 'Qaseem', 'Raziq',
    'Seigfried', 'Tarik', 'Ursinus', 'Viggo', 'Woyzeck',
    'Xanthus', 'Youssou', 'Zosimus',
  ],
  
  source: {
    book: 'Core Rulebook',
    page: 27,
  },
};

/**
 * All species
 */
export const AELDARI: Species = {
  id: 'aeldari',
  name: 'Aeldari',
  xpCost: 10,
  
  // Starting attributes
  baseAttributes: {
    agility: 3,
  },
  
  baseSkills: {},
  
  // Attribute maximums
  attributeMaximums: {
    strength: 6,
    toughness: 6,
    agility: 10,
    initiative: 10,
    willpower: 8,
    intellect: 8,
    fellowship: 7,
  },
  
  // Special abilities
  properties: [
    {
      id: 'aeldari-emotion',
      type: 'feature',
      name: 'Intense Emotion',
      parent: '',
      children: [],
      order: 1,
      tags: ['species', 'social'],
      enabled: true,
      text: 'Increase the DN of any Resolve Tests you make by +1.',
      description: 'The Aeldari experience emotions far more intensely than other species.',
    },
    {
      id: 'aeldari-psychosensitive',
      type: 'feature',
      name: 'Psychosensitive',
      parent: '',
      children: [],
      order: 2,
      tags: ['species', 'psychic'],
      enabled: true,
      text: 'You may take the PSYKER Keyword for only 5 XP.',
      description: 'All Aeldari have some connection to the Warp.',
    },
  ],
  
  speed: 8,
  size: 'average',
  keywords: ['AELDARI'],
  
  description: 'An ancient xenos Species whose declining empire once spanned the galaxy. They are naturally psychic, long lived, and old enemies of the Imperium.',
  
  commonNames: [
    'Aestra', 'Alanaris', 'Alean', 'Aradryan', 'Bael-Shemaer',
    'Caelledhin', 'Druthkhala', 'Elarique', 'Elissanadrin',
    'Farstel', 'Gostradir', 'Illic', 'Iyanna', 'Kayleth',
    'Lathriel', 'Macha', 'Nuadhu', 'Ronahn', 'Taldeer',
    'Veldoran', 'Ynnead',
  ],
  
  source: {
    book: 'Core Rulebook',
    page: 28,
  },
};

export const ORK: Species = {
  id: 'ork',
  name: 'Ork',
  xpCost: 20,
  
  // Starting attributes
  baseAttributes: {
    strength: 3,
    toughness: 3,
  },
  
  baseSkills: {},
  
  // Attribute maximums
  attributeMaximums: {
    strength: 12,
    toughness: 12,
    agility: 6,
    initiative: 6,
    willpower: 7,
    intellect: 5,
    fellowship: 5,
  },
  
  // Special abilities
  properties: [
    {
      id: 'ork-orky',
      type: 'feature',
      name: 'Orky',
      parent: '',
      children: [],
      order: 1,
      tags: ['species', 'social'],
      enabled: true,
      text: 'You gain +1 bonus die on all Intimidation tests.',
      description: 'Orks are naturally terrifying.',
    },
    {
      id: 'ork-bigger',
      type: 'feature',
      name: 'Bigger is Better',
      parent: '',
      children: [],
      order: 2,
      tags: ['species', 'social'],
      enabled: true,
      text: 'Your Influence is equal to your Strength Attribute.',
      description: 'Among Orks, physical might determines social standing.',
    },
  ],
  
  speed: 6,
  size: 'large',
  keywords: ['ORK', '[CLAN]'],
  
  description: 'A brutal xenos Species that crave violence and live only for war. Their crude appearance belies their threat—Orks grow larger and stronger through combat, and their collective psychic field can make their ramshackle technology function through sheer belief.',
  
  commonNames: [
    'Ghazghkull', 'Nazdreg', 'Urgok', 'Grukk', 'Mogrok',
    'Snikrot', 'Zagstruk', 'Badrukk', 'Kaptin Bluddflagg',
    'Wazzdakka', 'Wazdakka', 'Makari', 'Grotsnik',
    'Zogwort', 'Orkimedes', 'Mad Dok Grotsnik',
  ],
  
  source: {
    book: 'Core Rulebook',
    page: 29,
  },
};

export const ALL_SPECIES: Species[] = [
  HUMAN,
  ADEPTUS_ASTARTES,
  PRIMARIS_ASTARTES,
  AELDARI,
  ORK,
];

/**
 * Get species by ID
 */
export function getSpeciesById(id: string): Species | undefined {
  return ALL_SPECIES.find(s => s.id === id);
}
