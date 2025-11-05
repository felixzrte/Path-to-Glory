/**
 * BESTIARY - NPCs, Enemies, Monsters, Aliens
 * 
 * Bestiary entries are Entities (share attributes/skills system with Characters)
 * but have threat-specific features like suggested encounters and tactics.
 */

import type { Entity } from './entity';

/**
 * Threat rating for encounter building
 */
export type ThreatRating = 'Troop' | 'Elite' | 'Champion' | 'Nemesis';

/**
 * Bestiary Entry - Any NPC, enemy, monster, or creature
 */
export interface BestiaryEntry extends Omit<Entity, 'type'> {
  type: 'bestiary';
  
  // Threat & Combat
  threat: ThreatRating;
  role?: string;             // 'Melee Brute', 'Ranged Sniper', 'Support', etc.
  
  // Encounter Info
  suggestedEncounter?: {
    quantity: string;        // '2-4', '1 per player', '1d3+1'
    tactics?: string;        // How this enemy fights
    environment?: string;    // Where they're typically encountered
  };
  
  // Lore
  description?: string;
  loreText?: string;
  
  // GM Notes
  gmNotes?: string;
}

/**
 * Create empty bestiary entry
 */
export function createEmptyBestiaryEntry(
  name: string,
  tier: number = 1,
  threat: ThreatRating = 'Troop'
): BestiaryEntry {
  const rootId = 'root';
  
  return {
    id: crypto.randomUUID(),
    name,
    type: 'bestiary',
    keywords: [],
    tier,
    threat,
    properties: {
      [rootId]: {
        id: rootId,
        type: 'folder',
        name: name,
        parent: undefined,
        children: [],
        order: 0,
        tags: ['root'],
        enabled: true,
      }
    },
    rootPropertyId: rootId,
  };
}

/**
 * Threat modifiers - how threat affects stats
 */
export const THREAT_MODIFIERS: Record<ThreatRating, {
  woundsMultiplier: number;
  shockMultiplier: number;
  bonusDice: number;
}> = {
  'Troop': {
    woundsMultiplier: 1,
    shockMultiplier: 1,
    bonusDice: 0,
  },
  'Elite': {
    woundsMultiplier: 2,
    shockMultiplier: 2,
    bonusDice: 1,
  },
  'Champion': {
    woundsMultiplier: 3,
    shockMultiplier: 3,
    bonusDice: 2,
  },
  'Nemesis': {
    woundsMultiplier: 5,
    shockMultiplier: 5,
    bonusDice: 3,
  },
};

/**
 * Calculate wounds for a bestiary entry based on threat
 */
export function calculateBestiaryWounds(
  baseTier: number,
  toughness: number,
  threat: ThreatRating
): number {
  const baseWounds = baseTier + toughness;
  const multiplier = THREAT_MODIFIERS[threat].woundsMultiplier;
  return baseWounds * multiplier;
}

/**
 * Calculate shock for a bestiary entry based on threat
 */
export function calculateBestiaryShock(
  baseTier: number,
  willpower: number,
  threat: ThreatRating
): number {
  const baseShock = baseTier + willpower;
  const multiplier = THREAT_MODIFIERS[threat].shockMultiplier;
  return baseShock * multiplier;
}
