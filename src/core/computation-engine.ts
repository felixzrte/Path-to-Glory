// src/core/computation-engine.ts

import type { 
  Property, 
  Attribute, 
  Skill, 
  Resource,
  Effect,
  Constant
} from '../types/property-system';
import { isAttribute, isSkill, isResource, isEffect } from '../types/property-system';
import type { 
  Computation, 
  ComputedEffect, 
  ComputationContext,
  ComputationResult 
} from '../types/computation';
import { evaluateFormula } from './formula-parser';

/**
 * COMPUTATION ENGINE
 * This is where the magic happens - auto-calculating everything!
 */

/**
 * Type guard for Constant
 */
function isConstant(prop: Property): prop is Constant {
  return prop.type === 'constant';
}

/**
 * Build computation context from all properties
 */
export function buildContext(properties: Record<string, Property>): ComputationContext {
  const context: ComputationContext = {
    properties: new Map(Object.entries(properties)),
    variables: new Map(),
    functions: new Map([
      ['floor', Math.floor],
      ['ceil', Math.ceil],
      ['max', Math.max],
      ['min', Math.min],
    ])
  };
  
  // Pre-populate variables with constants (only if they're numeric)
  for (const [id, prop] of context.properties) {
    if (isConstant(prop)) {
      // Only add if value is a number (not a formula reference)
      if (typeof prop.value === 'number') {
        context.variables.set(prop.name, prop.value);
      }
      // If it's a string (formula), we'll compute it later after attributes are done
    }
  }
  
  return context;
}

/**
 * Find all effects that target a specific property
 */
export function findEffectsForProperty(
  propertyId: string,
  propertyName: string,
  context: ComputationContext
): Effect[] {
  const effects: Effect[] = [];
  
  for (const [id, prop] of context.properties) {
    if (!isEffect(prop)) continue;
    if (!prop.enabled) continue;
    
    // Check if this effect targets our property
    const target = prop.target;
    
    if (target.type === 'specific' && target.names?.includes(propertyName)) {
      effects.push(prop);
    } else if (target.type === 'all') {
      effects.push(prop);
    }
    // TODO: Add tag-based targeting
  }
  
  return effects;
}

/**
 * Compute the value of an attribute
 */
export function computeAttribute(
  attribute: Attribute,
  context: ComputationContext
): Computation {
  const breakdown: string[] = [];
  const computedEffects: ComputedEffect[] = [];
  
  let base = attribute.baseValue;
  breakdown.push(`Base: ${base}`);
  
  // Find all effects that modify this attribute
  const effects = findEffectsForProperty(attribute.id, attribute.name, context);
  
  // Apply effects in order: set > multiply > add
  const setEffects = effects.filter(e => e.operation === 'set');
  const multiplyEffects = effects.filter(e => e.operation === 'multiply');
  const addEffects = effects.filter(e => e.operation === 'add');
  
  // Set operations override base
  if (setEffects.length > 0) {
    const setEffect = setEffects[0]; // Use first one
    const value = evaluateFormula(setEffect.amount, context.variables);
    base = value;
    breakdown.push(`${setEffect.name}: set to ${value}`);
    computedEffects.push({
      name: setEffect.name,
      operation: 'set',
      value,
      source: setEffect.id
    });
  }
  
  // Multiply operations
  for (const effect of multiplyEffects) {
    const value = evaluateFormula(effect.amount, context.variables);
    base *= value;
    breakdown.push(`${effect.name}: ×${value}`);
    computedEffects.push({
      name: effect.name,
      operation: 'multiply',
      value,
      source: effect.id
    });
  }
  
  // Add operations
  for (const effect of addEffects) {
    const value = evaluateFormula(effect.amount, context.variables);
    base += value;
    breakdown.push(`${effect.name}: +${value}`);
    computedEffects.push({
      name: effect.name,
      operation: 'add',
      value,
      source: effect.id
    });
  }
  
  breakdown.push(`Total: ${base}`);
  
  return {
    propertyId: attribute.id,
    base: attribute.baseValue,
    result: base,
    effects: computedEffects,
    breakdown
  };
}

/**
 * Compute the value of a skill
 */
export function computeSkill(
  skill: Skill,
  context: ComputationContext
): Computation {
  const breakdown: string[] = [];
  const computedEffects: ComputedEffect[] = [];
  
  // Get the linked attribute value
  const attributeValue = context.variables.get(skill.ability) || 0;
  
  let total = skill.baseValue + attributeValue;
  breakdown.push(`Skill Ranks: ${skill.baseValue}`);
  breakdown.push(`${skill.ability}: ${attributeValue}`);
  
  // Find effects
  const effects = findEffectsForProperty(skill.id, skill.name, context);
  
  // Apply add effects (skills typically just add)
  for (const effect of effects) {
    if (effect.operation === 'add') {
      const value = evaluateFormula(effect.amount, context.variables);
      total += value;
      breakdown.push(`${effect.name}: +${value}`);
      computedEffects.push({
        name: effect.name,
        operation: 'add',
        value,
        source: effect.id
      });
    }
  }
  
  breakdown.push(`Total: ${total}`);
  
  return {
    propertyId: skill.id,
    base: skill.baseValue + attributeValue,
    result: total,
    effects: computedEffects,
    breakdown
  };
}

/**
 * Compute maximum value for a resource
 */
export function computeResource(
  resource: Resource,
  context: ComputationContext
): Computation {
  const breakdown: string[] = [];
  
  // Evaluate the maximum formula
  const maxValue = evaluateFormula(resource.maximum, context.variables);
  breakdown.push(`Formula: ${resource.maximum}`);
  breakdown.push(`Maximum: ${maxValue}`);
  
  return {
    propertyId: resource.id,
    base: maxValue,
    result: maxValue,
    effects: [],
    breakdown
  };
}

/**
 * Compute a constant (that has a formula reference)
 */
export function computeConstant(
  constant: Constant,
  context: ComputationContext
): Computation {
  const breakdown: string[] = [];
  
  let value: number;
  
  if (typeof constant.value === 'number') {
    value = constant.value;
    breakdown.push(`Value: ${value}`);
  } else {
    // It's a formula - evaluate it
    value = evaluateFormula(constant.value, context.variables);
    breakdown.push(`Formula: ${constant.value}`);
    breakdown.push(`Result: ${value}`);
  }
  
  return {
    propertyId: constant.id,
    base: value,
    result: value,
    effects: [],
    breakdown
  };
}

/**
 * Compute all properties in a character
 */
export function computeCharacter(
  properties: Record<string, Property>
): ComputationResult {
  const computations = new Map<string, Computation>();
  const errors: any[] = [];
  
  // Build context
  const context = buildContext(properties);
  
  // First pass: Compute attributes (they don't depend on anything)
  for (const [id, prop] of context.properties) {
    if (isAttribute(prop)) {
      try {
        const computation = computeAttribute(prop, context);
        computations.set(id, computation);
        // Store result in variables for other computations
        context.variables.set(prop.name, computation.result);
      } catch (error) {
        errors.push({
          propertyId: id,
          propertyName: prop.name,
          error: String(error)
        });
      }
    }
  }
  
  // Second pass: Compute constants that reference attributes
  for (const [id, prop] of context.properties) {
    if (isConstant(prop) && typeof prop.value === 'string') {
      try {
        const computation = computeConstant(prop, context);
        computations.set(id, computation);
        context.variables.set(prop.name, computation.result);
      } catch (error) {
        errors.push({
          propertyId: id,
          propertyName: prop.name,
          error: String(error),
          formula: typeof prop.value === 'string' ? prop.value : undefined
        });
      }
    }
  }
  
  // Third pass: Compute skills (depend on attributes)
  for (const [id, prop] of context.properties) {
    if (isSkill(prop)) {
      try {
        const computation = computeSkill(prop, context);
        computations.set(id, computation);
        context.variables.set(prop.name, computation.result);
      } catch (error) {
        errors.push({
          propertyId: id,
          propertyName: prop.name,
          error: String(error)
        });
      }
    }
  }
  
  // Fourth pass: Compute resources (may depend on attributes)
  for (const [id, prop] of context.properties) {
    if (isResource(prop)) {
      try {
        const computation = computeResource(prop, context);
        computations.set(id, computation);
      } catch (error) {
        errors.push({
          propertyId: id,
          propertyName: prop.name,
          error: String(error)
        });
      }
    }
  }
  
  return {
    computations,
    errors,
    timestamp: new Date()
  };
}