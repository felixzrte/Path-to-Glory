/**
 * ABILITY SYSTEM DEMO
 * 
 * This shows how the structured ability system works in practice
 */

import { getAbilityById } from '@/data/abilities';
import { applyAbility, type AbilityContext } from '@/lib/ability-engine';
import { calculateDicePool, performTest } from '@/lib/dice-engine';
import type { KeywordId } from '@/data/keywords';

// ============================================================================
// EXAMPLE 1: Sister Hospitaller using Loyal Compassion
// ============================================================================
console.log('=== EXAMPLE 1: Sister Hospitaller - Loyal Compassion ===\n');

// Sister Hospitaller (Rank 2) tries to heal an injured Imperial Guardsman
const sisterHospitaller = {
  rank: 2,
  intellect: 4,
  medicae: 3,
  keywords: ['IMPERIUM', 'ADEPTA SORORITAS'] as KeywordId[],
  abilities: ['loyal-compassion'],
};

const injuredGuardsman = {
  keywords: ['IMPERIUM', 'ASTRA MILITARUM'] as KeywordId[],
};

// Context for the medicae test
const medicaeContext: AbilityContext = {
  userRank: sisterHospitaller.rank,
  userKeywords: sisterHospitaller.keywords,
  skill: 'medicae',
  targetKeywords: injuredGuardsman.keywords,
  targetType: 'ally',
};

// Check if Loyal Compassion applies
const loyalCompassion = getAbilityById('loyal-compassion');
if (loyalCompassion) {
  const abilityResult = applyAbility(loyalCompassion, medicaeContext);
  
  console.log('Ability: Loyal Compassion');
  console.log('Trigger: Making a Medicae test on a character with IMPERIUM keyword');
  console.log(`Bonus Dice: +${abilityResult.bonusDice} (Double Rank: 2 × 2)`);
  console.log('');
  
  // Calculate dice pool
  const baseDicePool = calculateDicePool(
    sisterHospitaller.intellect,
    sisterHospitaller.medicae,
    0
  );
  
  const finalDicePool = baseDicePool + abilityResult.bonusDice;
  
  console.log(`Base Pool: ${sisterHospitaller.intellect} (Int) + ${sisterHospitaller.medicae} (Medicae) = ${baseDicePool} dice`);
  console.log(`With Ability: ${baseDicePool} + ${abilityResult.bonusDice} = ${finalDicePool} dice`);
  console.log('');
  
  // Perform the test
  const result = performTest(finalDicePool, 4, 1);
  console.log(`Rolling ${finalDicePool}d6 vs DN 4...`);
  console.log(`Result: ${result.success ? 'SUCCESS' : 'FAILURE'}`);
  console.log(`Icons: ${result.totalIcons}, Shift: ${result.shift}`);
  if (result.glory > 0) console.log(`Glory! (${result.glory} × 6 on Wrath dice)`);
  if (result.complications > 0) console.log(`Complication! (${result.complications} × 1 on Wrath dice)`);
}

console.log('\n');

// ============================================================================
// EXAMPLE 2: Ministorum Priest using Fiery Invective
// ============================================================================
console.log('=== EXAMPLE 2: Ministorum Priest - Fiery Invective ===\n');

const ministorumPriest = {
  rank: 3,
  keywords: ['IMPERIUM', 'ADEPTUS MINISTORUM'] as KeywordId[],
  abilities: ['fiery-invective'],
};

const fieryInvective = getAbilityById('fiery-invective');
if (fieryInvective) {
  console.log('Ability: Fiery Invective');
  console.log('Activation: Free Action (once per combat)');
  console.log('Effect: All allies with IMPERIUM keyword heal 1d3+Rank Shock');
  console.log('');
  
  // Simulate healing
  const healRoll = Math.floor(Math.random() * 3) + 1; // 1d3
  const totalHealing = healRoll + ministorumPriest.rank;
  
  console.log(`Rolling healing: 1d3 + ${ministorumPriest.rank} (Rank) = ${healRoll} + ${ministorumPriest.rank} = ${totalHealing} Shock healed`);
  console.log('Applies to: Self + all IMPERIUM allies in range');
}

console.log('\n');

// ============================================================================
// EXAMPLE 3: Ork Boy using Get Stuck In
// ============================================================================
console.log('=== EXAMPLE 3: Ork Boy - Get Stuck In ===\n');

const orkBoy = {
  rank: 1,
  initiative: 3,
  weaponSkill: 3,
  keywords: ['ORK'] as KeywordId[],
  abilities: ['get-stuck-in'],
};

// Ork is fighting alongside 2 other Orks against the same enemy
const mobContext: AbilityContext = {
  userRank: orkBoy.rank,
  userKeywords: orkBoy.keywords,
  damageType: 'melee',
  alliesEngaged: 2, // 2 other boyz fighting the same target
};

const getStuckIn = getAbilityById('get-stuck-in');
if (getStuckIn) {
  const abilityResult = applyAbility(getStuckIn, mobContext);
  
  console.log('Ability: Get Stuck In');
  console.log('Trigger: Melee attack with allies engaged with same target');
  console.log(`Allies Engaged: ${mobContext.alliesEngaged}`);
  console.log(`Bonus Dice: +${abilityResult.bonusDice} (Rank ${orkBoy.rank} × ${mobContext.alliesEngaged} allies)`);
  console.log('');
  
  const baseDicePool = calculateDicePool(
    orkBoy.initiative,
    orkBoy.weaponSkill,
    0
  );
  
  const finalDicePool = baseDicePool + abilityResult.bonusDice;
  
  console.log(`Base Pool: ${orkBoy.initiative} (Init) + ${orkBoy.weaponSkill} (WS) = ${baseDicePool} dice`);
  console.log(`With Ability: ${baseDicePool} + ${abilityResult.bonusDice} = ${finalDicePool} dice`);
  console.log('');
  
  const result = performTest(finalDicePool, 3, 1);
  console.log(`Rolling ${finalDicePool}d6 vs DN 3 (enemy Defence)...`);
  console.log(`Result: ${result.success ? 'HIT!' : 'MISS'}`);
  console.log(`Icons: ${result.totalIcons}`);
}

console.log('\n');
console.log('=== ABILITY SYSTEM WORKING! ===');

export {};
