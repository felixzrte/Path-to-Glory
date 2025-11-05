/**
 * COMPUTATION ENGINE - Calculate entity stats from property tree
 * 
 * This is the heart of the property system: traverse the property tree,
 * apply all bonuses/effects, and compute the final EntityStats.
 * 
 * Inspired by DiceCloud's computation model:
 * 1. Start with base values (all attributes at 1, all skills at 0)
 * 2. Traverse property tree in order
 * 3. Apply bonuses, effects, and modifiers
 * 4. Calculate derived stats (Defence, Speed, etc.)
 * 5. Return computed EntityStats
 */

import type { Entity, EntityStats, AttributeName, SkillName } from '@/types/entity';
import type { Property, Attribute, Skill, Bonus, Effect } from '@/types/property-system';
import { calculateDerivedStats } from '@/lib/dice-engine';

/**
 * Convert display name to camelCase (e.g., "Ballistic Skill" -> "ballisticSkill")
 */
function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

/**
 * Extract attribute name from property name or ID
 */
function extractAttributeFromName(name: string): string | undefined {
  const lower = name.toLowerCase();
  const attributes = ['strength', 'toughness', 'agility', 'initiative', 'willpower', 'intellect', 'fellowship'];
  
  for (const attr of attributes) {
    if (lower.includes(attr)) {
      return attr;
    }
  }
  
  return undefined;
}

/**
 * Extract skill name from property name
 */
function extractSkillFromName(name: string): string | undefined {
  const lower = name.toLowerCase();
  const skillMap: Record<string, string> = {
    'athletics': 'athletics',
    'awareness': 'awareness',
    'ballistic skill': 'ballisticSkill',
    'cunning': 'cunning',
    'deception': 'deception',
    'insight': 'insight',
    'intimidation': 'intimidation',
    'investigation': 'investigation',
    'leadership': 'leadership',
    'medicae': 'medicae',
    'persuasion': 'persuasion',
    'pilot': 'pilot',
    'psychic mastery': 'psychicMastery',
    'scholar': 'scholar',
    'stealth': 'stealth',
    'survival': 'survival',
    'tech': 'tech',
    'weapon skill': 'weaponSkill',
  };
  
  for (const [displayName, camelName] of Object.entries(skillMap)) {
    if (lower.includes(displayName)) {
      return camelName;
    }
  }
  
  return undefined;
}

/**
 * Type guards
 */
function isAttributeName(name: string): name is AttributeName {
  const attributes: string[] = ['strength', 'toughness', 'agility', 'initiative', 'willpower', 'intellect', 'fellowship'];
  return attributes.includes(name);
}

function isSkillName(name: string): name is SkillName {
  const skills: string[] = [
    'athletics', 'awareness', 'ballisticSkill', 'cunning', 'deception', 
    'insight', 'intimidation', 'investigation', 'leadership', 'medicae', 
    'persuasion', 'pilot', 'psychicMastery', 'scholar', 'stealth', 
    'survival', 'tech', 'weaponSkill'
  ];
  return skills.includes(name);
}

/**
 * Compute EntityStats from an entity's property tree
 */
export function computeEntityStats(entity: Entity): EntityStats {
  // Step 1: Initialize base stats (attributes at 1, skills at 0)
  const stats: EntityStats = {
    strength: 1,
    toughness: 1,
    agility: 1,
    initiative: 1,
    willpower: 1,
    intellect: 1,
    fellowship: 1,
    defence: 1,
    resilience: 1,
    determination: 1,
    maxWounds: 0,
    maxShock: 0,
    speed: 6,
    passiveAwareness: 0,
    conviction: 1,
    resolve: 1,
    influence: entity.tier,
    wealth: entity.tier,
    skills: {
      athletics: 0,
      awareness: 0,
      ballisticSkill: 0,
      cunning: 0,
      deception: 0,
      insight: 0,
      intimidation: 0,
      investigation: 0,
      leadership: 0,
      medicae: 0,
      persuasion: 0,
      pilot: 0,
      psychicMastery: 0,
      scholar: 0,
      stealth: 0,
      survival: 0,
      tech: 0,
      weaponSkill: 0,
    },
  };

  // Step 2: Collect all enabled properties in order
  const allProperties = collectEnabledProperties(entity);

  // Step 3: Apply attributes
  for (const prop of allProperties) {
    if (prop.type === 'attribute') {
      const attrProp = prop as Attribute;
      // Try to extract attribute name from property ID (e.g., "attr-strength" -> "strength")
      let attrName: string | undefined;
      
      if (prop.id.startsWith('attr-')) {
        attrName = prop.id.replace('attr-', '').toLowerCase();
      } else {
        // Fallback: try to parse from name
        attrName = extractAttributeFromName(prop.name);
      }
      
      if (attrName && isAttributeName(attrName as AttributeName)) {
        stats[attrName as AttributeName] = Math.max(1, attrProp.baseValue); // Minimum 1
      }
    }
  }

  // Step 4: Apply skills
  for (const prop of allProperties) {
    if (prop.type === 'skill') {
      const skillProp = prop as Skill;
      // Try to extract skill name from property ID (e.g., "skill-athletics" -> "athletics")
      let skillName: string | undefined;
      
      if (prop.id.startsWith('skill-')) {
        skillName = prop.id.replace('skill-', '');
      } else {
        // Fallback: try to parse from name or linkedAttribute
        skillName = extractSkillFromName(prop.name);
      }
      
      if (skillName && isSkillName(skillName as SkillName)) {
        stats.skills[skillName as SkillName] = Math.max(0, skillProp.baseValue); // Minimum 0
      }
    }
  }

  // Step 5: Apply bonuses
  for (const prop of allProperties) {
    if (prop.type === 'bonus') {
      const bonusProp = prop as Bonus;
      const target = bonusProp.target.toLowerCase();
      
      // Check if it's an attribute
      if (isAttributeName(target as AttributeName)) {
        stats[target as AttributeName] += bonusProp.amount;
      }
      // Check if it's a skill
      const skillTarget = toCamelCase(target) as SkillName;
      if (isSkillName(skillTarget)) {
        stats.skills[skillTarget] += bonusProp.amount;
      }
    }
  }

  // Step 6: Apply effects (more complex modifiers)
  for (const prop of allProperties) {
    if (prop.type === 'effect') {
      const effectProp = prop as Effect;
      applyEffect(stats, effectProp);
    }
  }

  // Step 7: Calculate derived stats
  const derived = calculateDerivedStats({
    initiative: stats.initiative,
    willpower: stats.willpower,
    agility: stats.agility,
    intellect: stats.intellect,
    toughness: stats.toughness,
    tier: entity.tier,
  });

  stats.defence = derived.defence;
  stats.determination = derived.determination;
  stats.speed = derived.speed;
  stats.passiveAwareness = derived.passiveAwareness;
  stats.resolve = derived.resolve;
  stats.conviction = derived.conviction;
  stats.maxWounds = derived.maxWounds;
  stats.maxShock = derived.maxShock;

  // Ensure no attributes go below 1
  stats.strength = Math.max(1, stats.strength);
  stats.toughness = Math.max(1, stats.toughness);
  stats.agility = Math.max(1, stats.agility);
  stats.initiative = Math.max(1, stats.initiative);
  stats.willpower = Math.max(1, stats.willpower);
  stats.intellect = Math.max(1, stats.intellect);
  stats.fellowship = Math.max(1, stats.fellowship);

  return stats;
}

/**
 * Collect all enabled properties in tree order
 */
function collectEnabledProperties(entity: Entity): Property[] {
  const properties: Property[] = [];
  
  function traverse(propId: string) {
    const prop = entity.properties[propId];
    if (!prop) return;
    
    if (prop.enabled) {
      properties.push(prop);
    }
    
    // Traverse children in order
    if (prop.children && prop.children.length > 0) {
      const sortedChildren = [...prop.children].sort((a, b) => {
        const propA = entity.properties[a];
        const propB = entity.properties[b];
        return (propA?.order ?? 0) - (propB?.order ?? 0);
      });
      
      for (const childId of sortedChildren) {
        traverse(childId);
      }
    }
  }
  
  traverse(entity.rootPropertyId);
  return properties;
}

/**
 * Apply an effect to stats
 */
function applyEffect(stats: EntityStats, effect: Effect): void {
  // TODO: Implement complex effect system
  // For now, just handle simple cases
  
  if (effect.target.type === 'specific' && effect.target.names) {
    for (const targetName of effect.target.names) {
      const name = targetName.toLowerCase();
      
      if (isAttributeName(name as AttributeName)) {
        const attrName = name as AttributeName;
        const current = stats[attrName];
        stats[attrName] = applyOperation(current, effect.operation, parseAmount(effect.amount, stats));
      }
      
      const skillName = toCamelCase(name) as SkillName;
      if (isSkillName(skillName)) {
        const current = stats.skills[skillName];
        stats.skills[skillName] = applyOperation(current, effect.operation, parseAmount(effect.amount, stats));
      }
    }
  }
}

/**
 * Apply an operation to a value
 */
function applyOperation(
  current: number,
  operation: 'add' | 'multiply' | 'set' | 'advantage' | 'disadvantage',
  amount: number
): number {
  switch (operation) {
    case 'add':
      return current + amount;
    case 'multiply':
      return current * amount;
    case 'set':
      return amount;
    case 'advantage':
    case 'disadvantage':
      // These affect dice rolls, not stat values
      return current;
  }
}

/**
 * Parse amount string (can be formula or number)
 */
function parseAmount(amount: string, stats: EntityStats): number {
  // Try parsing as number first
  const num = parseInt(amount, 10);
  if (!isNaN(num)) return num;
  
  // Handle simple formulas
  const lower = amount.toLowerCase().trim();
  
  // Check attributes
  if (lower === 'strength') return stats.strength;
  if (lower === 'toughness') return stats.toughness;
  if (lower === 'agility') return stats.agility;
  if (lower === 'initiative') return stats.initiative;
  if (lower === 'willpower') return stats.willpower;
  if (lower === 'intellect') return stats.intellect;
  if (lower === 'fellowship') return stats.fellowship;
  
  // Default to 0 if can't parse
  console.warn(`Could not parse amount: ${amount}`);
  return 0;
}
