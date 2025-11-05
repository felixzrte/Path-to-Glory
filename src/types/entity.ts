/**
 * ENTITY SYSTEM - Shared foundation for Characters, Bestiary, NPCs
 * 
 * Any "thing" that has attributes, skills, and can make Tests is an Entity.
 * This includes:
 * - Player Characters
 * - NPCs
 * - Bestiary entries (enemies, monsters, aliens)
 * - Allies/Companions
 * 
 * Entities use the property system for all their stats and abilities.
 */

import type { Property } from './property-system';
import type { KeywordId } from '@/data/keywords';

/**
 * Base Entity - The foundation for anything that can act in the game
 */
export interface Entity {
  id: string;
  name: string;
  type: 'character' | 'npc' | 'bestiary';
  
  // Core Identity
  species?: string;          // Species ID
  faction?: string[];        // Faction keywords
  keywords: KeywordId[];     // All keywords this entity has
  tier: number;              // 1-4 (or higher for powerful enemies)
  
  // Property Tree - ALL stats computed from this
  properties: Record<string, Property>;  // All properties by ID
  rootPropertyId: string;                // Top-level folder
  
  // Computed Stats (cached from property system)
  stats?: EntityStats;
  
  // Metadata
  source?: {
    book: string;
    page: number;
  };
  notes?: string;
}

/**
 * Computed/Cached stats for quick access
 * These are calculated from the property tree
 */
export interface EntityStats {
  // Attributes (always present, minimum 1)
  strength: number;
  toughness: number;
  agility: number;
  initiative: number;
  willpower: number;
  intellect: number;
  fellowship: number;
  
  // Derived Stats
  defence: number;           // 1 + (initiative / 2, rounded down)
  resilience: number;        // 1 + toughness + armour
  determination: number;     // 1 + (willpower / 2, rounded down)
  maxWounds: number;         // tier + toughness + bonus
  maxShock: number;          // willpower + tier + bonus
  speed: number;             // 6 + (agility / 2, rounded down, minimum 6)
  passiveAwareness: number;  // (intellect / 2, rounded down)
  conviction: number;        // willpower
  resolve: number;           // (willpower / 2, rounded down, minimum 1)
  influence: number;         // tier + bonus
  wealth: number;            // tier + bonus
  
  // Skills (0 if untrained)
  skills: {
    athletics: number;
    awareness: number;
    ballisticSkill: number;
    cunning: number;
    deception: number;
    insight: number;
    intimidation: number;
    investigation: number;
    leadership: number;
    medicae: number;
    persuasion: number;
    pilot: number;
    psychicMastery: number;
    scholar: number;
    stealth: number;
    survival: number;
    tech: number;
    weaponSkill: number;
  };
}

/**
 * Attribute names as a type-safe constant
 */
export const ATTRIBUTES = [
  'strength',
  'toughness',
  'agility',
  'initiative',
  'willpower',
  'intellect',
  'fellowship',
] as const;

export type AttributeName = typeof ATTRIBUTES[number];

/**
 * Attribute abbreviations for display
 */
export const ATTRIBUTE_ABBREVIATIONS: Record<AttributeName, string> = {
  strength: 'S',
  toughness: 'T',
  agility: 'A',
  initiative: 'I',
  willpower: 'Wil',
  intellect: 'Int',
  fellowship: 'Fel',
};

/**
 * Skill names as a type-safe constant
 */
export const SKILLS = [
  'athletics',
  'awareness',
  'ballisticSkill',
  'cunning',
  'deception',
  'insight',
  'intimidation',
  'investigation',
  'leadership',
  'medicae',
  'persuasion',
  'pilot',
  'psychicMastery',
  'scholar',
  'stealth',
  'survival',
  'tech',
  'weaponSkill',
] as const;

export type SkillName = typeof SKILLS[number];

/**
 * Skill linked attributes
 */
export const SKILL_ATTRIBUTES: Record<SkillName, AttributeName> = {
  athletics: 'strength',
  awareness: 'intellect',
  ballisticSkill: 'agility',
  cunning: 'fellowship',
  deception: 'fellowship',
  insight: 'fellowship',
  intimidation: 'willpower',
  investigation: 'intellect',
  leadership: 'willpower',
  medicae: 'intellect',
  persuasion: 'fellowship',
  pilot: 'agility',
  psychicMastery: 'willpower',
  scholar: 'intellect',
  stealth: 'agility',
  survival: 'willpower',
  tech: 'intellect',
  weaponSkill: 'initiative',
};

/**
 * Skill display names
 */
export const SKILL_NAMES: Record<SkillName, string> = {
  athletics: 'Athletics',
  awareness: 'Awareness',
  ballisticSkill: 'Ballistic Skill',
  cunning: 'Cunning',
  deception: 'Deception',
  insight: 'Insight',
  intimidation: 'Intimidation',
  investigation: 'Investigation',
  leadership: 'Leadership',
  medicae: 'Medicae',
  persuasion: 'Persuasion',
  pilot: 'Pilot',
  psychicMastery: 'Psychic Mastery',
  scholar: 'Scholar',
  stealth: 'Stealth',
  survival: 'Survival',
  tech: 'Tech',
  weaponSkill: 'Weapon Skill',
};


