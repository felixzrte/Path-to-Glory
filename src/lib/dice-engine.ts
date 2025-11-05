/**
 * DICE ENGINE - Wrath & Glory dice mechanics
 * 
 * Handles all dice rolling, pool calculation, and test resolution.
 * 
 * Core Mechanics:
 * - Roll pool of d6s (Attribute + Skill + bonuses)
 * - 4+ = Success (Icon)
 * - 6 = Critical Success (Exalted Icon) 
 * - Meet or exceed DN (Difficulty Number) to succeed
 * - Shift: Use extra Icons for bonus effects
 * - Wrath die: Special d6 that can trigger Complications or Glory
 */

/**
 * Result of a single d6 roll
 */
export type DieResult = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Wrath die special results
 */
export type WrathResult = {
  value: DieResult;
  isComplication: boolean; // Rolled 1 on Wrath die
  isGlory: boolean;        // Rolled 6 on Wrath die
};

/**
 * Complete test result
 */
export interface TestResult {
  // Pool composition
  dicePool: number;
  wrathDice: number;
  
  // Roll results
  rolls: DieResult[];
  wrathRolls: WrathResult[];
  
  // Success calculation
  icons: number;           // 4+ results
  exaltedIcons: number;    // 6 results
  totalIcons: number;      // icons + exaltedIcons
  
  // Test outcome
  dn: number;              // Difficulty Number
  success: boolean;        // totalIcons >= dn
  shift: number;           // totalIcons - dn (extra icons)
  
  // Special results
  complications: number;   // Number of 1s on Wrath dice
  glory: number;           // Number of 6s on Wrath dice
}

/**
 * Get attribute modifier (half attribute, rounded down)
 */
export function getAttributeModifier(attributeValue: number): number {
  return Math.floor(attributeValue / 2);
}

/**
 * Calculate derived stats from attributes
 */
export function calculateDerivedStats(stats: {
  initiative: number;
  willpower: number;
  agility: number;
  intellect: number;
  toughness: number;
  tier: number;
}): {
  defence: number;
  determination: number;
  speed: number;
  passiveAwareness: number;
  resolve: number;
  conviction: number;
  maxWounds: number;
  maxShock: number;
} {
  return {
    defence: 1 + getAttributeModifier(stats.initiative),
    determination: 1 + getAttributeModifier(stats.willpower),
    speed: Math.max(6, 6 + getAttributeModifier(stats.agility)),
    passiveAwareness: getAttributeModifier(stats.intellect),
    resolve: Math.max(1, getAttributeModifier(stats.willpower)),
    conviction: stats.willpower,
    maxWounds: stats.tier + stats.toughness,
    maxShock: stats.tier + stats.willpower,
  };
}

/**
 * Calculate dice pool for a skill test
 */
export function calculateDicePool(
  attribute: number,
  skill: number,
  bonusDice: number = 0
): number {
  return attribute + skill + bonusDice;
}

/**
 * Roll a single d6
 */
export function rollD6(): DieResult {
  return (Math.floor(Math.random() * 6) + 1) as DieResult;
}

/**
 * Roll a pool of d6s
 */
export function rollDicePool(poolSize: number): DieResult[] {
  return Array.from({ length: poolSize }, () => rollD6());
}

/**
 * Roll Wrath dice (tracks complications and glory)
 */
export function rollWrathDice(count: number): WrathResult[] {
  return Array.from({ length: count }, () => {
    const value = rollD6();
    return {
      value,
      isComplication: value === 1,
      isGlory: value === 6,
    };
  });
}

/**
 * Count Icons (4+ results) and Exalted Icons (6 results)
 */
export function countIcons(rolls: DieResult[]): {
  icons: number;
  exaltedIcons: number;
  totalIcons: number;
} {
  let icons = 0;
  let exaltedIcons = 0;
  
  for (const roll of rolls) {
    if (roll >= 4) {
      icons++;
      if (roll === 6) {
        exaltedIcons++;
      }
    }
  }
  
  return {
    icons,
    exaltedIcons,
    totalIcons: icons,
  };
}

/**
 * Perform a complete test
 */
export function performTest(
  dicePool: number,
  dn: number,
  wrathDice: number = 1
): TestResult {
  // Roll dice
  const rolls = rollDicePool(dicePool);
  const wrathRolls = rollWrathDice(wrathDice);
  
  // Combine all rolls for counting icons
  const allRolls = [...rolls, ...wrathRolls.map(w => w.value)];
  const { icons, exaltedIcons, totalIcons } = countIcons(allRolls);
  
  // Calculate success
  const success = totalIcons >= dn;
  const shift = success ? totalIcons - dn : 0;
  
  // Count special Wrath results
  const complications = wrathRolls.filter(w => w.isComplication).length;
  const glory = wrathRolls.filter(w => w.isGlory).length;
  
  return {
    dicePool,
    wrathDice,
    rolls,
    wrathRolls,
    icons,
    exaltedIcons,
    totalIcons,
    dn,
    success,
    shift,
    complications,
    glory,
  };
}

/**
 * Get difficulty name for DN
 */
export function getDifficultyName(dn: number): string {
  if (dn <= 2) return 'Simple';
  if (dn === 3) return 'Easy';
  if (dn === 4) return 'Medium';
  if (dn === 5) return 'Hard';
  if (dn === 6) return 'Very Hard';
  if (dn >= 7) return 'Extreme';
  return 'Unknown';
}

/**
 * Perform an opposed test between two entities
 */
export function performOpposedTest(
  attackerPool: number,
  defenderPool: number,
  wrathDice: number = 1
): {
  attacker: TestResult;
  defender: TestResult;
  winner: 'attacker' | 'defender' | 'tie';
  margin: number;
} {
  const attackerResult = performTest(attackerPool, 0, wrathDice);
  const defenderResult = performTest(defenderPool, 0, wrathDice);
  
  let winner: 'attacker' | 'defender' | 'tie';
  let margin: number;
  
  if (attackerResult.totalIcons > defenderResult.totalIcons) {
    winner = 'attacker';
    margin = attackerResult.totalIcons - defenderResult.totalIcons;
  } else if (defenderResult.totalIcons > attackerResult.totalIcons) {
    winner = 'defender';
    margin = defenderResult.totalIcons - attackerResult.totalIcons;
  } else {
    winner = 'tie';
    margin = 0;
  }
  
  return {
    attacker: attackerResult,
    defender: defenderResult,
    winner,
    margin,
  };
}
