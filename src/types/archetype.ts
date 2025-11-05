/**
 * ARCHETYPE TYPE DEFINITIONS
 * Represents character archetypes from Core Rulebook p.90-117
 * 
 * DESIGN PHILOSOPHY:
 * - Property-based system: Everything connects through shared types
 * - Keyword system: Uses keyword database for bracketed keyword choices
 * - XP tracking: Separate costs for archetype base + optional suggested purchases
 * - Character creator flow: Species → Archetype → Keywords → Attributes → Skills → Talents
 */

import type { Keyword } from './keywords';
import type { KeywordId } from '@/data/keywords';

/**
 * Archetype tier determines power level and starting XP
 */
export type ArchetypeTier = 1 | 2 | 3 | 4;

/**
 * Species restrictions for archetypes
 */
export type SpeciesRestriction = 'human' | 'adeptus-astartes' | 'primaris-astartes' | 'aeldari' | 'ork';

/**
 * Attribute values for character stats
 */
export interface AttributeValues {
  strength?: number;
  toughness?: number;
  agility?: number;
  initiative?: number;
  willpower?: number;
  intellect?: number;
  fellowship?: number;
}

/**
 * Skill values for character abilities
 */
export interface SkillValues {
  athletics?: number;
  awareness?: number;
  ballisticSkill?: number;
  cunning?: number;
  deception?: number;
  insight?: number;
  intimidation?: number;
  investigation?: number;
  leadership?: number;
  medicae?: number;
  persuasion?: number;
  pilot?: number;
  psychicMastery?: number;
  scholar?: number;
  stealth?: number;
  survival?: number;
  tech?: number;
  weaponSkill?: number;
}

/**
 * Keyword choice - for bracketed keywords that need player selection
 * References the keyword database rather than duplicating data
 */
export interface KeywordChoice {
  bracketedKeywordId: string; // e.g., '[ORDER]', '[CHAPTER]', '[REGIMENT]'
  required: boolean;
  // All other data (description, examples) comes from KEYWORD_DEFINITIONS
}

/**
 * Wargear option with various selection types
 */
export interface WargearOption {
  type: 'specific' | 'choice' | 'any';
  items?: string[]; // Specific items or choices
  constraints?: {
    maxValue?: number;
    maxRarity?: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Unique';
    keywords?: Keyword[]; // Must have these keywords
    category?: string; // e.g., 'weapon', 'armour'
  };
  count?: number; // How many to choose
}

/**
 * Archetype ability reference
 * Old system kept for backward compatibility, but prefer using abilityId
 */
export interface ArchetypeAbility {
  // NEW: Reference to structured ability
  abilityId?: string;        // ID in abilities database
  
  // OLD: Legacy text-based system (deprecated)
  name: string;
  description: string;
  gameEffect: string;
}

/**
 * Suggested purchase package - optional XP spend for quick character creation
 */
export interface SuggestedPurchase {
  attributes: {
    values: AttributeValues;
    cost: number;
  };
  skills: {
    values: SkillValues;
    cost: number;
  };
  talents: {
    names: string[];
    cost: number; // Total cost of all suggested talents
  };
}

/**
 * Complete archetype definition
 */
export interface Archetype {
  id: string;
  name: string;
  faction: string;
  tier: ArchetypeTier;
  
  // Lore & Description
  description: string;
  flavorText?: string;
  loreText?: string;
  
  // Requirements
  speciesRestriction: SpeciesRestriction[];
  
  // XP Cost (just the archetype itself)
  cost: number;
  
  // Suggested purchases (optional - for "Buy Suggested Build" buttons)
  suggestedPurchase: SuggestedPurchase;
  
  // Granted by archetype automatically
  keywords: KeywordId[]; // Fixed keywords - TYPE SAFE!
  keywordChoices: KeywordChoice[]; // Bracketed keywords requiring choice
  attributeBonuses?: AttributeValues; // Automatic bonuses
  skillBonuses?: SkillValues; // Automatic bonuses
  ability: ArchetypeAbility;
  wargear: WargearOption[];
  influenceBonus: number;
  
  // Source
  source: {
    book: string;
    page: number;
  };
}

/**
 * Archetype category for UI organization
 */
export interface ArchetypeCategory {
  tier: ArchetypeTier;
  name: string;
  description: string;
  archetypes: Archetype[];
}
