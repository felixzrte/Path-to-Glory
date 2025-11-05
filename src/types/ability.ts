/**
 * ABILITY SYSTEM - Structured abilities for archetypes, talents, and features
 * 
 * Abilities are structured so the system can:
 * - Detect when they trigger
 * - Apply their effects automatically
 * - Show UI prompts at the right time
 * 
 * Design: Abilities are PASSIVE (always on) but have CONDITIONS (when they apply)
 */

import type { SkillName, AttributeName } from './entity';
import type { KeywordId } from '@/data/keywords';

/**
 * When does this ability trigger?
 */
export type AbilityActivation = 
  | 'passive'        // Always active (permanent bonus)
  | 'test'           // Triggers on specific skill tests
  | 'combat-action'  // Used as a combat action
  | 'free-action'    // Used as a free action in combat
  | 'reflexive'      // Triggers as a reaction
  | 'regroup'        // Used during regroup phase
  | 'once-per-scene' // Can be used once per scene
  | 'once-per-combat'; // Can be used once per combat

/**
 * What condition must be met for this ability to apply?
 */
export interface AbilityCondition {
  type: 'skill-test' | 'target-keyword' | 'target-type' | 'damage-type' | 'combat-situation' | 'always';
  
  // For skill-test conditions
  skill?: SkillName;
  attribute?: AttributeName;
  
  // For target conditions
  targetKeyword?: KeywordId;        // Target must have this keyword
  targetType?: 'ally' | 'enemy' | 'self';
  
  // For damage conditions
  damageType?: 'melee' | 'ranged' | 'psychic';
  
  // For situational conditions
  situation?: 'outnumbered' | 'charging' | 'defending' | 'low-health';
}

/**
 * What does this ability DO?
 */
export interface AbilityEffect {
  type: 'bonus-dice' | 'reroll' | 'auto-success' | 'damage-modifier' | 'heal' | 'condition' | 'special';
  
  // Bonus dice effect
  bonusDice?: string;               // Formula: "rank", "2", "rank * 2", "doubleRank"
  
  // Reroll effect
  rerollType?: 'failures' | 'all' | 'ones';
  rerollCount?: number;
  
  // Auto success
  autoIcons?: number;               // Add this many automatic successes
  
  // Damage modifier
  damageBonus?: string;             // Formula: "+1d3", "+rank", "+strength"
  damagePenalty?: string;
  
  // Healing
  healAmount?: string;              // Formula: "1d3+rank", "rank", "willpower"
  healType?: 'wounds' | 'shock';
  
  // Apply condition
  condition?: 'hindered' | 'prone' | 'restrained' | 'bleeding' | 'poisoned' | 'on-fire';
  
  // Special text (for complex effects that need human interpretation)
  specialText?: string;
}

/**
 * Complete ability definition
 */
export interface Ability {
  id: string;
  name: string;
  description: string;           // Narrative description
  
  // Mechanics
  activation: AbilityActivation;
  conditions: AbilityCondition[]; // ALL conditions must be met
  effects: AbilityEffect[];       // ALL effects apply when triggered
  
  // Usage limits
  usesPerScene?: number;
  usesPerCombat?: number;
  usesPerSession?: number;
  
  // Source
  source?: {
    type: 'archetype' | 'talent' | 'species' | 'wargear' | 'psychic-power';
    id: string;
  };
}

/**
 * Helper: Create a simple passive bonus ability
 * Example: "+Double Rank bonus dice to Medicae tests on IMPERIUM targets"
 */
export function createTestBonusAbility(
  id: string,
  name: string,
  description: string,
  skill: SkillName,
  bonusDice: string,
  targetKeyword?: KeywordId
): Ability {
  const conditions: AbilityCondition[] = [
    {
      type: 'skill-test',
      skill,
    }
  ];
  
  if (targetKeyword) {
    conditions.push({
      type: 'target-keyword',
      targetKeyword,
    });
  }
  
  return {
    id,
    name,
    description,
    activation: 'test',
    conditions,
    effects: [
      {
        type: 'bonus-dice',
        bonusDice,
      }
    ],
  };
}

/**
 * Helper: Create a combat action ability
 * Example: "Heal 1d3+Rank Shock to all allies with IMPERIUM keyword"
 */
export function createCombatActionAbility(
  id: string,
  name: string,
  description: string,
  effects: AbilityEffect[],
  usesPerCombat?: number
): Ability {
  return {
    id,
    name,
    description,
    activation: 'combat-action',
    conditions: [{ type: 'always' }],
    effects,
    usesPerCombat,
  };
}

/**
 * Helper: Create a free action ability
 */
export function createFreeActionAbility(
  id: string,
  name: string,
  description: string,
  effects: AbilityEffect[],
  usesPerCombat?: number
): Ability {
  return {
    id,
    name,
    description,
    activation: 'free-action',
    conditions: [{ type: 'always' }],
    effects,
    usesPerCombat,
  };
}

/**
 * Check if ability conditions are met
 */
export function checkAbilityConditions(
  ability: Ability,
  context: {
    skill?: SkillName;
    attribute?: AttributeName;
    targetKeywords?: KeywordId[];
    targetType?: 'ally' | 'enemy' | 'self';
    damageType?: 'melee' | 'ranged' | 'psychic';
    situation?: string;
  }
): boolean {
  // All conditions must be met
  for (const condition of ability.conditions) {
    switch (condition.type) {
      case 'always':
        continue;
        
      case 'skill-test':
        if (condition.skill && context.skill !== condition.skill) {
          return false;
        }
        if (condition.attribute && context.attribute !== condition.attribute) {
          return false;
        }
        break;
        
      case 'target-keyword':
        if (condition.targetKeyword) {
          if (!context.targetKeywords?.includes(condition.targetKeyword)) {
            return false;
          }
        }
        break;
        
      case 'target-type':
        if (condition.targetType && context.targetType !== condition.targetType) {
          return false;
        }
        break;
        
      case 'damage-type':
        if (condition.damageType && context.damageType !== condition.damageType) {
          return false;
        }
        break;
        
      case 'combat-situation':
        if (condition.situation && context.situation !== condition.situation) {
          return false;
        }
        break;
    }
  }
  
  return true;
}

/**
 * Calculate bonus dice from formula
 */
export function calculateBonusDice(formula: string, rank: number): number {
  const lower = formula.toLowerCase().trim();
  
  if (lower === 'rank') return rank;
  if (lower === 'doublerank' || lower === 'double rank') return rank * 2;
  if (lower.startsWith('rank')) {
    // Handle "rank * 2", "rank + 1", etc.
    const match = lower.match(/rank\s*\*\s*(\d+)/);
    if (match) return rank * parseInt(match[1], 10);
  }
  
  // Try parsing as number
  const num = parseInt(formula, 10);
  if (!isNaN(num)) return num;
  
  console.warn(`Could not parse bonus dice formula: ${formula}`);
  return 0;
}
