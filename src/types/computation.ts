import type { Property } from './property-system';

/**
 * COMPUTATION - The result of calculating a property's value
 */
export interface Computation {
  propertyId: string;
  base: number;              // Base value before effects
  result: number;            // Final calculated value
  effects: ComputedEffect[]; // All effects that were applied
  breakdown: string[];       // Human-readable calculation steps
}

/**
 * COMPUTED EFFECT - An effect that was applied during calculation
 */
export interface ComputedEffect {
  name: string;              // Effect name
  operation: string;         // 'add', 'multiply', etc.
  value: number;             // Resolved value
  source: string;            // Property ID of the effect
}

/**
 * COMPUTATION CONTEXT - Everything needed to evaluate formulas
 */
export interface ComputationContext {
  // All properties in the character
  properties: Map<string, Property>;
  
  // Pre-computed values for fast lookup
  // Key = property name, Value = computed value
  variables: Map<string, number>;
  
  // Available functions for formulas
  functions: Map<string, (...args: number[]) => number>;
}

/**
 * Result of computing entire character
 */
export interface ComputationResult {
  computations: Map<string, Computation>;
  errors: ComputationError[];
  timestamp: Date;
}

export interface ComputationError {
  propertyId: string;
  propertyName: string;
  error: string;
  formula?: string;
}