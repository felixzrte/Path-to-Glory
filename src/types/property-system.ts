/**
 * STEP 1: The Foundation - Base Property
 * Everything in the character sheet inherits from this
 */
export interface BaseProperty {
  id: string;
  type: PropertyType;
  name: string;
  
  // Tree structure
  parent?: string;           // Parent property ID
  children: string[];        // Child property IDs
  order: number;             // Display order within parent
  
  // Metadata
  tags: string[];            // For filtering/targeting ["combat", "psychic"]
  enabled: boolean;          // Can be toggled on/off
  color?: string;            // UI organization color
  
  // Documentation
  summary?: string;          // One-line description
  description?: string;      // Full markdown description
  
  // Conditional activation
  condition?: string;        // Formula: "tier >= 3"
}

/**
 * All property types in the system
 */
export type PropertyType = 
  // Core stats
  | 'attribute'              // Strength, Agility, etc.
  | 'skill'                  // Athletics, Awareness, etc.
  | 'resource'               // Wounds, Shock, Wrath
  | 'constant'               // Tier, Level (user doesn't change)
  
  // Modifiers
  | 'effect'                 // Modifies other properties
  
  // Containers
  | 'folder'                 // Groups properties
  
  // Actions & Features  
  | 'action'                 // Attacks, tests
  | 'note';                  // Text-only

/**
 * ATTRIBUTE - A numeric stat like Strength or Agility
 */
export interface Attribute extends BaseProperty {
  type: 'attribute';
  baseValue: number;         // User input
  // Final value computed by engine
}

/**
 * SKILL - Tied to an attribute
 */
export interface Skill extends BaseProperty {
  type: 'skill';
  baseValue: number;         // Skill ranks
  ability: string;           // Name of linked attribute
  // Final value = ability + baseValue + effects
}

/**
 * RESOURCE - Tracked pool with current/max
 */
export interface Resource extends BaseProperty {
  type: 'resource';
  current: number;
  maximum: string;           // Formula: "tier + toughness"
  resetOn?: 'short_rest' | 'long_rest' | 'session' | 'manual';
}

/**
 * CONSTANT - Fixed value or formula
 */
export interface Constant extends BaseProperty {
  type: 'constant';
  value: number | string;    // Could be formula
}

/**
 * EFFECT - Modifies other properties
 * This is the KEY to auto-calculation
 */
export interface Effect extends BaseProperty {
  type: 'effect';
  operation: EffectOperation;
  amount: string;            // Formula: "2", "tier * 2", "strengthMod"
  target: PropertyTarget;    // What does this affect?
}

export type EffectOperation = 
  | 'add'                    // Add to base
  | 'multiply'               // Multiply base
  | 'set'                    // Override base
  | 'min'                    // Set minimum
  | 'max';                   // Set maximum

/**
 * PROPERTY TARGET - Defines what an effect targets
 */
export interface PropertyTarget {
  type: 'specific' | 'tag' | 'all';
  names?: string[];          // Specific property names
  tags?: string[];           // Target properties with these tags
  condition?: string;        // Additional filter formula
}

/**
 * FOLDER - Container for organizing properties
 */
export interface Folder extends BaseProperty {
  type: 'folder';
  // Children are stored in BaseProperty.children
}

/**
 * ACTION - Something the character can do
 */
export interface Action extends BaseProperty {
  type: 'action';
  actionType: 'attack' | 'test' | 'power' | 'ability';
  dicePool?: string;         // Formula: "agility + athletics"
  difficulty?: string;       // Formula or number
  damage?: DamageRoll[];
}

export interface DamageRoll {
  formula: string;           // "1d6 + strength"
  type: string;              // "kinetic", "energy", etc.
}

/**
 * NOTE - Text-only property
 */
export interface Note extends BaseProperty {
  type: 'note';
  text: string;              // Markdown content
}

/**
 * Union type of all specific property types
 */
export type Property = 
  | Attribute 
  | Skill 
  | Resource 
  | Constant 
  | Effect 
  | Folder 
  | Action 
  | Note;

/**
 * Type guard utilities
 */
export function isAttribute(prop: BaseProperty): prop is Attribute {
  return prop.type === 'attribute';
}

export function isSkill(prop: BaseProperty): prop is Skill {
  return prop.type === 'skill';
}

export function isEffect(prop: BaseProperty): prop is Effect {
  return prop.type === 'effect';
}

export function isResource(prop: BaseProperty): prop is Resource {
  return prop.type === 'resource';
}

export function isFolder(prop: BaseProperty): prop is Folder {
  return prop.type === 'folder';
}

export function isAction(prop: BaseProperty): prop is Action {
  return prop.type === 'action';
}