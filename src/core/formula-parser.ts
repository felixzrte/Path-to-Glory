/**
 * Simple formula evaluator
 * Handles: numbers, +, -, *, /, (), variables
 */

export function evaluateFormula(
  formula: string,
  variables: Map<string, number>
): number {
  // Replace variables with their values
  let expression = formula;
  
  for (const [name, value] of variables.entries()) {
    // Use word boundaries to match whole variable names only
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    expression = expression.replace(regex, value.toString());
  }
  
  // Add support for common functions
  expression = expression.replace(/floor\(/g, 'Math.floor(');
  expression = expression.replace(/ceil\(/g, 'Math.ceil(');
  expression = expression.replace(/max\(/g, 'Math.max(');
  expression = expression.replace(/min\(/g, 'Math.min(');
  
  try {
    // Evaluate the expression
    // Note: In production, you'd want a safer evaluator
    const result = Function(`"use strict"; return (${expression})`)();
    return Number(result);
  } catch (error) {
    throw new Error(`Failed to evaluate formula "${formula}": ${error}`);
  }
}