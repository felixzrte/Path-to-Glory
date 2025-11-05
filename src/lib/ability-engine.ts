/**
 * ABILITY ENGINE - Apply ability effects during gameplay
 * 
 * This connects the ability system to the dice engine:
 * 1. Check if ability conditions are met
 * 2. Calculate bonus dice/effects
 * 3. Apply to test results
 */

import type { Ability } from '@/types/ability';
import { checkAbilityConditions, calculateBonusDice } from '@/types/ability';
import type { SkillName, AttributeName } from '@/types/entity';
import type { KeywordId } from '@/data/keywords';
import { getAbilityById } from '@/data/abilities';

/**
 * Context for evaluating abilities
 */
export interface AbilityContext {
  // Who is using the ability?
  userRank: number;
  userKeywords: KeywordId[];
  
  // What are they doing?
  skill?: SkillName;
  attribute?: AttributeName;
  
  // Who/what is the target?
  targetKeywords?: KeywordId[];
  targetType?: 'ally' | 'enemy' | 'self';
  
  // Combat context
  damageType?: 'melee' | 'ranged' | 'psychic';
  situation?: string;
  alliesEngaged?: number; // For abilities like "Get Stuck In"
}

/**
 * Result of applying an ability
 */
export interface AbilityApplicationResult {
  applied: boolean;
  bonusDice: number;
  rerollCount?: number;
  rerollType?: 'failures' | 'all' | 'ones';
  autoIcons?: number;
  specialEffects: string[];
}

/**
 * Find all applicable abilities for a context
 */
export function findApplicableAbilities(
  abilityIds: string[],
  context: AbilityContext
): Ability[] {
  const applicable: Ability[] = [];
  
  for (const abilityId of abilityIds) {
    const ability = getAbilityById(abilityId);
    if (!ability) continue;
    
    if (checkAbilityConditions(ability, context)) {
      applicable.push(ability);
    }
  }
  
  return applicable;
}

/**
 * Apply a single ability and return the effects
 */
export function applyAbility(
  ability: Ability,
  context: AbilityContext
): AbilityApplicationResult {
  const result: AbilityApplicationResult = {
    applied: true,
    bonusDice: 0,
    specialEffects: [],
  };
  
  // Apply each effect
  for (const effect of ability.effects) {
    switch (effect.type) {
      case 'bonus-dice':
        if (effect.bonusDice) {
          let dice = calculateBonusDice(effect.bonusDice, context.userRank);
          
          // Special case: "Get Stuck In" - per ally
          if (ability.id === 'get-stuck-in' && context.alliesEngaged) {
            dice *= context.alliesEngaged;
          }
          
          result.bonusDice += dice;
        }
        break;
        
      case 'reroll':
        result.rerollType = effect.rerollType;
        result.rerollCount = effect.rerollCount || 1;
        break;
        
      case 'auto-success':
        result.autoIcons = effect.autoIcons || 0;
        break;
        
      case 'special':
        if (effect.specialText) {
          result.specialEffects.push(effect.specialText);
        }
        break;
        
      case 'heal':
        if (effect.healAmount) {
          result.specialEffects.push(
            `Heal ${effect.healAmount} ${effect.healType || 'wounds'}`
          );
        }
        break;
        
      case 'damage-modifier':
        if (effect.damageBonus) {
          result.specialEffects.push(`Damage: ${effect.damageBonus}`);
        }
        break;
        
      case 'condition':
        if (effect.condition) {
          result.specialEffects.push(`Apply condition: ${effect.condition}`);
        }
        break;
    }
  }
  
  return result;
}

/**
 * Apply multiple abilities and combine their effects
 */
export function applyAbilities(
  abilityIds: string[],
  context: AbilityContext
): AbilityApplicationResult {
  const applicable = findApplicableAbilities(abilityIds, context);
  
  const combined: AbilityApplicationResult = {
    applied: applicable.length > 0,
    bonusDice: 0,
    specialEffects: [],
  };
  
  for (const ability of applicable) {
    const result = applyAbility(ability, context);
    combined.bonusDice += result.bonusDice;
    
    if (result.rerollType) {
      combined.rerollType = result.rerollType;
      combined.rerollCount = (combined.rerollCount || 0) + (result.rerollCount || 0);
    }
    
    if (result.autoIcons) {
      combined.autoIcons = (combined.autoIcons || 0) + result.autoIcons;
    }
    
    combined.specialEffects.push(...result.specialEffects);
  }
  
  return combined;
}

/**
 * Helper: Get bonus dice for a skill test considering all abilities
 */
export function getAbilityBonusForTest(
  abilityIds: string[],
  context: AbilityContext
): number {
  const result = applyAbilities(abilityIds, context);
  return result.bonusDice;
}

/**
 * Example usage:
 * 
 * const context = {
 *   userRank: 2,
 *   userKeywords: ['IMPERIUM', 'ADEPTA SORORITAS'],
 *   skill: 'medicae',
 *   targetKeywords: ['IMPERIUM', 'ASTRA MILITARUM'],
 *   targetType: 'ally',
 * };
 * 
 * const bonusDice = getAbilityBonusForTest(['loyal-compassion'], context);
 * // Returns: 4 (doubleRank where rank=2)
 * 
 * const dicePool = calculateDicePool(intellect, medicae, bonusDice);
 * const result = performTest(dicePool, dn);
 */
