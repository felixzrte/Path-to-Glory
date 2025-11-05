/**
 * PROPERTY SYSTEM - DiceCloud-style computation engine
 * Properties are the building blocks of everything in Wrath & Glory
 */

/**
 * Property System for Wrath & Glory Character Creation
 * Inspired by DiceCloud's property-based computation engine
 */

import type { Keyword, KeywordCondition } from './keywords';

export interface BaseProperty {
  id: string;
  type: string;
  name: string;
  parent?: string; // ID of parent property for tree structure
  children?: string[]; // IDs of child properties
  order: number; // Order within parent
  tags?: string[];
  keywords?: Keyword[]; // Keywords associated with this property
  enabled: boolean;
  description?: string;
  source?: string; // Where this property comes from (species, archetype, talent, etc.)
  condition?: KeywordCondition; // Condition for when this property is active
}

/**
 * All property types in the system
 */
export type PropertyType = 
  // Core character stats
  | 'attribute'              // Strength, Agility, Toughness, etc.
  | 'skill'                  // Athletics, Awareness, Ballistic Skill, etc.
  | 'resource'               // Wounds, Shock, Wrath
  | 'constant'               // Tier, Speed (doesn't change often)
  
  // Modifiers
  | 'effect'                 // Modifies other properties
  | 'bonus'                  // Simple +X bonus to a stat
  
  // Containers
  | 'folder'                 // Groups properties (Species, Archetype, Equipment)
  | 'feature'                // Special ability or trait
  
  // Actions
  | 'action'                 // Attacks, tests, powers
  | 'note';                  // Text-only

/**
 * ATTRIBUTE - Core stats (Strength, Toughness, Agility, etc.)
 */
export interface Attribute extends BaseProperty {
  type: 'attribute';
  baseValue: number;         // Starting value
  maximum?: number;          // Species-based cap (optional, computed from species)
}

/**
 * SKILL - Trainable abilities
 */
export interface Skill extends BaseProperty {
  type: 'skill';
  baseValue: number;         // Ranks in the skill (0-5+)
  linkedAttribute: string;   // Which attribute it's based on ('strength', 'agility', etc.)
}

/**
 * RESOURCE - Pools like Wounds, Shock, Wrath
 */
export interface Resource extends BaseProperty {
  type: 'resource';
  current: number;
  maximum: string;           // Formula: "tier + toughness + 4"
  resetOn?: 'rest' | 'scene' | 'session' | 'manual';
}

/**
 * CONSTANT - Fixed values or references
 */
export interface Constant extends BaseProperty {
  type: 'constant';
  value: number | string;    // Can be a number or a formula/reference
}

/**
 * EFFECT - Modifies other properties
 */
export interface Effect extends BaseProperty {
  type: 'effect';
  operation: 'add' | 'multiply' | 'set' | 'advantage' | 'disadvantage';
  amount: string;            // Formula: "2" or "tier" or "strength / 2"
  target: PropertyTarget;
}

/**
 * Targeting system for effects
 */
export interface PropertyTarget {
  type: 'specific' | 'all' | 'tags';
  names?: string[];          // Specific property names ['strength', 'toughness']
  tags?: string[];           // Target by tags ['attribute', 'skill']
}

/**
 * BONUS - Simple +X bonus (common case, simpler than Effect)
 */
export interface Bonus extends BaseProperty {
  type: 'bonus';
  target: string;            // Property name to boost
  amount: number;            // Simple number bonus
}

/**
 * FOLDER - Container for grouping properties
 */
export interface Folder extends BaseProperty {
  type: 'folder';
  collapsed?: boolean;       // UI state
}

/**
 * Feature - Special abilities, traits, or passive effects
 */
export interface Feature extends BaseProperty {
  type: 'feature';
  text: string;
  activeEffect?: boolean; // Whether this grants an active ability vs passive trait
  grantedAbilities?: string[]; // IDs of other properties this feature grants
}

/**
 * KeywordGrant - Grants or modifies keywords
 */
export interface KeywordGrant extends BaseProperty {
  type: 'keyword';
  operation: 'add' | 'remove' | 'replace';
  keywordsToAdd?: Keyword[];
  keywordsToRemove?: Keyword[];
  bracketedReplacement?: {
    bracket: string; // e.g., '[CHAPTER]'
    value: string; // e.g., 'ULTRAMARINES'
  };
}

/**
 * ACTION - Something you can do (attack, test, power)
 */
export interface Action extends BaseProperty {
  type: 'action';
  actionType: 'attack' | 'test' | 'power' | 'other';
  skillTest?: string;        // Which skill to roll
  damageFormula?: string;    // For attacks
  traits?: string[];         // Weapon/power traits
}

/**
 * NOTE - Pure text/documentation
 */
export interface Note extends BaseProperty {
  type: 'note';
  text: string;              // Markdown content
}

/**
 * Union type of all properties
 */
export type Property = 
  | Attribute
  | Skill
  | Resource
  | Constant
  | Effect
  | Bonus
  | Folder
  | Feature
  | KeywordGrant
  | Action
  | Note;/**
 * Type guard utilities
 */
export function isAttribute(prop: Property): prop is Attribute {
  return prop.type === 'attribute';
}

export function isSkill(prop: Property): prop is Skill {
  return prop.type === 'skill';
}

export function isResource(prop: Property): prop is Resource {
  return prop.type === 'resource';
}

export function isConstant(prop: Property): prop is Constant {
  return prop.type === 'constant';
}

export function isEffect(prop: Property): prop is Effect {
  return prop.type === 'effect';
}

export function isBonus(prop: Property): prop is Bonus {
  return prop.type === 'bonus';
}

export function isFolder(prop: Property): prop is Folder {
  return prop.type === 'folder';
}

export function isFeature(prop: Property): prop is Feature {
  return prop.type === 'feature';
}

export function isKeyword(prop: Property): prop is KeywordGrant {
  return prop.type === 'keyword';
}

export function isAction(prop: Property): prop is Action {
  return prop.type === 'action';
}

export function isNote(prop: Property): prop is Note {
  return prop.type === 'note';
}
