/**
 * ARCHETYPE ABILITIES - Structured ability definitions
 * Converting archetype gameEffect text to structured abilities
 */

import { createTestBonusAbility, createFreeActionAbility, type Ability } from '@/types/ability';

/**
 * SISTER HOSPITALLER - Loyal Compassion
 * "+Double Rank bonus dice whenever you make a Medicae (Int) Test on a character with the IMPERIUM Keyword."
 */
export const LOYAL_COMPASSION: Ability = createTestBonusAbility(
  'loyal-compassion',
  'Loyal Compassion',
  'Your dedication to healing the Emperor\'s servants is unmatched.',
  'medicae',
  'doubleRank',
  'IMPERIUM'
);

/**
 * MINISTORUM PRIEST - Fiery Invective
 * "You can preach the word of the Imperial Creed as a Free Action once per combat. 
 *  You and all allies with the IMPERIUM Keyword heal 1d3+Rank Shock."
 */
export const FIERY_INVECTIVE: Ability = createFreeActionAbility(
  'fiery-invective',
  'Fiery Invective',
  'You can preach the word of the Imperial Creed to inspire the faithful.',
  [
    {
      type: 'heal',
      healAmount: '1d3+rank',
      healType: 'shock',
    }
  ],
  1 // Once per combat
);

/**
 * IMPERIAL GUARDSMAN - Look Out, Sir!
 * "Once per combat, you may take a Reflexive Action to move up to half your Speed 
 *  to get in the way of any attack that hit an ally. The attacker then rolls against 
 *  your Resilience instead of your ally's, and may deal Wounds to you. Your Resilience 
 *  increases by +Rank for the purpose of calculating this damage."
 */
export const LOOK_OUT_SIR: Ability = {
  id: 'look-out-sir',
  name: 'Look Out, Sir!',
  description: 'You have been drilled in sacrificing yourself to save your allies.',
  activation: 'reflexive',
  conditions: [
    {
      type: 'target-type',
      targetType: 'ally',
    }
  ],
  effects: [
    {
      type: 'special',
      specialText: 'Move up to half your Speed. Redirect attack to yourself. Your Resilience increases by +Rank for this attack.',
    }
  ],
  usesPerCombat: 1,
};

/**
 * INQUISITORIAL ACOLYTE - Inquisitorial Decree
 * "You can invoke the name of your Inquisitor to gain +Rank bonus dice to any social 
 *  Skill test when interacting with an individual with the IMPERIUM Keyword. 
 *  You can only use this ability once per scene."
 */
export const INQUISITORIAL_DECREE: Ability = {
  id: 'inquisitorial-decree',
  name: 'Inquisitorial Decree',
  description: 'You can invoke the name of your Inquisitor to gain authority.',
  activation: 'once-per-scene',
  conditions: [
    {
      type: 'skill-test',
    },
    {
      type: 'target-keyword',
      targetKeyword: 'IMPERIUM',
    }
  ],
  effects: [
    {
      type: 'bonus-dice',
      bonusDice: 'rank',
    }
  ],
  usesPerScene: 1,
};

/**
 * INQUISITORIAL SAGE - Administratum Records
 * "You gain +Rank bonus dice whenever you make a Test to gather information from 
 *  Imperial sources, typically on Influence or Investigation (Int) tests."
 */
export const ADMINISTRATUM_RECORDS: Ability = {
  id: 'administratum-records',
  name: 'Administratum Records',
  description: 'You are particularly adept at navigating the Imperium\'s colossal bureaucracy.',
  activation: 'test',
  conditions: [
    {
      type: 'skill-test',
      skill: 'investigation',
    }
  ],
  effects: [
    {
      type: 'bonus-dice',
      bonusDice: 'rank',
    }
  ],
};

/**
 * GANGER - Scrounger
 * "You gain +Rank bonus dice to Cunning (Fel) Tests. Once per session you may make 
 *  an Influence or Cunning Test to acquire an item, representing something you have 
 *  prepared in advance."
 */
export const SCROUNGER: Ability = createTestBonusAbility(
  'scrounger',
  'Scrounger',
  'Your life with less has made you adept at finding spares and supplies in the most unlikely of places.',
  'cunning',
  'rank'
);

/**
 * CORSAIR - Dancing on the Blade's Edge
 * "You gain +Rank bonus dice whenever you make or resist an Athletics (S) or Persuasion (Fel) 
 *  Interaction Attack. You suffer a +1 DN penalty to Fear Tests."
 */
export const DANCING_ON_BLADES_EDGE: Ability = {
  id: 'dancing-on-blades-edge',
  name: 'Dancing on the Blade\'s Edge',
  description: 'You throw yourself into danger with reckless abandon to hide your ancestral fears.',
  activation: 'test',
  conditions: [
    {
      type: 'skill-test',
    }
  ],
  effects: [
    {
      type: 'bonus-dice',
      bonusDice: 'rank',
    },
    {
      type: 'special',
      specialText: '+1 DN penalty to Fear Tests',
    }
  ],
};

/**
 * ORK BOY - Get Stuck In
 * "You gain +Rank bonus dice to melee attacks for every ally engaged with the same target as you."
 */
export const GET_STUCK_IN: Ability = {
  id: 'get-stuck-in',
  name: 'Get Stuck In',
  description: 'You fight better when you\'re part of a mob.',
  activation: 'test',
  conditions: [
    {
      type: 'damage-type',
      damageType: 'melee',
    },
    {
      type: 'combat-situation',
      situation: 'outnumbered',
    }
  ],
  effects: [
    {
      type: 'bonus-dice',
      bonusDice: 'rank', // Per ally - needs special handling
    },
    {
      type: 'special',
      specialText: '+Rank bonus dice for EACH ally engaged with the same target',
    }
  ],
};

/**
 * All archetype abilities
 */
export const ARCHETYPE_ABILITIES: Record<string, Ability> = {
  'loyal-compassion': LOYAL_COMPASSION,
  'fiery-invective': FIERY_INVECTIVE,
  'look-out-sir': LOOK_OUT_SIR,
  'inquisitorial-decree': INQUISITORIAL_DECREE,
  'administratum-records': ADMINISTRATUM_RECORDS,
  'scrounger': SCROUNGER,
  'dancing-on-blades-edge': DANCING_ON_BLADES_EDGE,
  'get-stuck-in': GET_STUCK_IN,
};

/**
 * Get ability by ID
 */
export function getAbilityById(id: string): Ability | undefined {
  return ARCHETYPE_ABILITIES[id];
}
