// src/test-wrath-and-glory-official.ts

import { createEmptyCharacter } from './types/character';
import type { Attribute, Skill, Resource, Effect, Constant, Folder } from './types/property-system';
import { computeCharacter } from './core/computation-engine';

console.log('⚔️  WRATH & GLORY - TACTICAL SPACE MARINE (OFFICIAL)\n');
console.log('='.repeat(70));
console.log('\n📖 Source: Doctors of Doom / Core Rulebook');
console.log('   Tier 3 | Adeptus Astartes');
console.log('   XP Cost: 257\n');

const char = createEmptyCharacter('Brother Titus - Ultramarines');

// ============================================================
// TIER
// ============================================================

char.properties['tier'] = {
  id: 'tier',
  type: 'constant',
  name: 'tier',
  value: 3,
  parent: char.rootPropertyId,
  children: [],
  order: 0,
  tags: ['constant', 'core'],
  enabled: true,
};

// ============================================================
// ATTRIBUTES (OFFICIAL STATS)
// Strength 4, Toughness 5, Agility 5, Initiative 5, Willpower 3, Intellect 3
// Fellowship not listed, assume 3
// ============================================================

console.log('📝 Creating Attributes (Official Stats)...\n');

const baseAttributes: Record<string, number> = {
  strength: 4,
  toughness: 5,
  agility: 5,
  initiative: 5,
  willpower: 3,
  intellect: 3,
  fellowship: 3  // Not listed, default
};

for (const [name, value] of Object.entries(baseAttributes)) {
  const attr: Attribute = {
    id: `attr-${name}`,
    type: 'attribute',
    name,
    baseValue: value,
    parent: char.rootPropertyId,
    children: [],
    order: Object.keys(baseAttributes).indexOf(name) + 10,
    tags: ['attribute', 'core'],
    enabled: true,
  };
  char.properties[attr.id] = attr;
  console.log(`   ${name.padEnd(12)} ${value}`);
}

// ============================================================
// SKILLS (OFFICIAL STATS)
// Athletics 3, Awareness 3, Ballistic Skill 5, Leadership 1, 
// Scholar 1, Stealth 3, Survival 1, Weapon Skill 4
// ============================================================

console.log('\n📝 Creating Skills (Official Stats)...\n');

const skills = [
  { name: 'athletics', ability: 'strength', ranks: 3 },
  { name: 'awareness', ability: 'intellect', ranks: 3 },
  { name: 'ballisticSkill', ability: 'agility', ranks: 5 },
  { name: 'leadership', ability: 'willpower', ranks: 1 },
  { name: 'scholar', ability: 'intellect', ranks: 1 },
  { name: 'stealth', ability: 'agility', ranks: 3 },
  { name: 'survival', ability: 'willpower', ranks: 1 },
  { name: 'weaponSkill', ability: 'initiative', ranks: 4 },
];

for (const skillData of skills) {
  const skill: Skill = {
    id: `skill-${skillData.name}`,
    type: 'skill',
    name: skillData.name,
    ability: skillData.ability,
    baseValue: skillData.ranks,
    parent: char.rootPropertyId,
    children: [],
    order: 100 + skills.indexOf(skillData),
    tags: ['skill', 'core'],
    enabled: true,
  };
  char.properties[skill.id] = skill;
  console.log(`   ${skillData.name.padEnd(16)} ${skillData.ranks} ranks (${skillData.ability})`);
}

// ============================================================
// DERIVED STATS
// ============================================================

console.log('\n📝 Creating Derived Stats...\n');

// Defense = Initiative
char.properties['defense'] = {
  id: 'defense',
  type: 'constant',
  name: 'defense',
  value: 'initiative',
  parent: char.rootPropertyId,
  children: [],
  order: 200,
  tags: ['derived', 'combat'],
  enabled: true,
  description: 'Defense = Initiative'
};

// Resilience = Toughness
char.properties['resilience'] = {
  id: 'resilience',
  type: 'constant',
  name: 'resilience',
  value: 'toughness',
  parent: char.rootPropertyId,
  children: [],
  order: 201,
  tags: ['derived', 'combat'],
  enabled: true,
  description: 'Resilience = Toughness'
};

// Determination = Tier
char.properties['determination'] = {
  id: 'determination',
  type: 'constant',
  name: 'determination',
  value: 'tier',
  parent: char.rootPropertyId,
  children: [],
  order: 202,
  tags: ['derived'],
  enabled: true,
  description: 'Determination = Tier'
};

// Conviction = Tier
char.properties['conviction'] = {
  id: 'conviction',
  type: 'constant',
  name: 'conviction',
  value: 'tier',
  parent: char.rootPropertyId,
  children: [],
  order: 203,
  tags: ['derived'],
  enabled: true,
  description: 'Conviction = Tier'
};

// Influence = Tier + 2 (Tactical Marine bonus)
char.properties['influence'] = {
  id: 'influence',
  type: 'constant',
  name: 'influence',
  value: 5,  // Tier 3 + 2
  parent: char.rootPropertyId,
  children: [],
  order: 204,
  tags: ['derived', 'social'],
  enabled: true,
  description: 'Influence = Tier + 2'
};

console.log('   ✓ Defense: Initiative (5)');
console.log('   ✓ Resilience: Toughness (5)');
console.log('   ✓ Determination: Tier (3)');
console.log('   ✓ Conviction: Tier (3)');
console.log('   ✓ Influence: 5 (Tier + 2)');

// ============================================================
// RESOURCES
// ============================================================

console.log('\n📝 Creating Resources...\n');

// Max Wounds = Tier + Toughness (for Astartes)
const wounds: Resource = {
  id: 'resource-wounds',
  type: 'resource',
  name: 'wounds',
  current: 8,
  maximum: 'tier + toughness',
  resetOn: 'manual',
  parent: char.rootPropertyId,
  children: [],
  order: 210,
  tags: ['resource', 'health'],
  enabled: true,
  description: 'Max Wounds = Tier + Toughness'
};
char.properties[wounds.id] = wounds;

// Max Shock = Tier + Willpower
const shock: Resource = {
  id: 'resource-shock',
  type: 'resource',
  name: 'shock',
  current: 6,
  maximum: 'tier + willpower',
  resetOn: 'manual',
  parent: char.rootPropertyId,
  children: [],
  order: 211,
  tags: ['resource', 'health'],
  enabled: true,
  description: 'Max Shock = Tier + Willpower'
};
char.properties[shock.id] = shock;

console.log('   ✓ Max Wounds: tier + toughness (3 + 5 = 8)');
console.log('   ✓ Max Shock: tier + willpower (3 + 3 = 6)');

// ============================================================
// WARGEAR (OFFICIAL)
// ============================================================

console.log('\n🎖️  Adding Official Wargear...\n');

// Aquila Mk VII Power Armor
const powerArmor: Folder = {
  id: 'item-aquila-armor',
  type: 'folder',
  name: 'Aquila Mk VII',
  parent: char.rootPropertyId,
  children: [],
  order: 300,
  tags: ['equipment', 'armor', 'equipped'],
  enabled: true,
  description: 'Power armor (Armor 5)'
};
char.properties[powerArmor.id] = powerArmor;
console.log('   ✓ Aquila Mk VII (Armor 5)');

// Boltgun
const boltgun: Folder = {
  id: 'item-boltgun',
  type: 'folder',
  name: 'Boltgun',
  parent: char.rootPropertyId,
  children: [],
  order: 301,
  tags: ['equipment', 'weapon', 'equipped', 'ranged'],
  enabled: true,
  description: 'Rapid Fire (3), Damage 10+1ED'
};
char.properties[boltgun.id] = boltgun;
console.log('   ✓ Boltgun (Rapid Fire 3, 10+1ED)');

// Bolt Pistol
const boltPistol: Folder = {
  id: 'item-bolt-pistol',
  type: 'folder',
  name: 'Bolt Pistol',
  parent: char.rootPropertyId,
  children: [],
  order: 302,
  tags: ['equipment', 'weapon', 'pistol'],
  enabled: true,
  description: 'Pistol, Damage 10+1ED'
};
char.properties[boltPistol.id] = boltPistol;
console.log('   ✓ Bolt Pistol (10+1ED)');

// Astartes Combat Knife
const knife: Folder = {
  id: 'item-knife',
  type: 'folder',
  name: 'Astartes Combat Knife',
  parent: char.rootPropertyId,
  children: [],
  order: 303,
  tags: ['equipment', 'weapon', 'melee'],
  enabled: true,
  description: 'Damage 3+1ED, Reliable'
};
char.properties[knife.id] = knife;
console.log('   ✓ Astartes Combat Knife (3+1ED)');

console.log('   ✓ 3x Frag Grenades');
console.log('   ✓ 3x Krak Grenades');

// ============================================================
// ARCHETYPE ABILITY (OFFICIAL)
// ============================================================

console.log('\n⭐ Archetype Ability:\n');

const tacticalVersatility: Folder = {
  id: 'ability-tactical-versatility',
  type: 'folder',
  name: 'Tactical Versatility',
  parent: char.rootPropertyId,
  children: [],
  order: 400,
  tags: ['ability', 'archetype'],
  enabled: true,
  description: 'When you make a Critical Hit, roll twice on Critical Hit Table and choose either result'
};
char.properties[tacticalVersatility.id] = tacticalVersatility;
console.log('   ✓ Tactical Versatility');
console.log('     "When you crit, roll twice and choose result"');

// ============================================================
// COMPUTE EVERYTHING
// ============================================================

console.log('\n' + '='.repeat(70));
console.log('🔄 COMPUTING CHARACTER...\n');

const result = computeCharacter(char.properties);

// ============================================================
// DISPLAY FINAL CHARACTER SHEET
// ============================================================

console.log('📊 TACTICAL SPACE MARINE - CHARACTER SHEET\n');
console.log('='.repeat(70));

// Header
console.log('\n🎖️  BROTHER TITUS - ULTRAMARINES');
console.log('   Tier 3 Tactical Space Marine | Adeptus Astartes');
console.log('   XP Cost: 257 | Keywords: Imperium, Adeptus Astartes, [Chapter]\n');

// Attributes
console.log('⚔️  ATTRIBUTES:\n');
for (const name of Object.keys(baseAttributes)) {
  const computation = result.computations.get(`attr-${name}`);
  if (computation) {
    console.log(`   ${name.toUpperCase().padEnd(12)} ${computation.result}`);
  }
}

// Combat Stats
console.log('\n🎯 COMBAT STATS:\n');
const defComp = result.computations.get('defense');
const resComp = result.computations.get('resilience');
const detComp = result.computations.get('determination');
const convComp = result.computations.get('conviction');
console.log(`   Defense        ${defComp?.result} (Initiative)`);
console.log(`   Resilience     ${resComp?.result} (Toughness)`);
console.log(`   Determination  ${detComp?.result} (rerolls/session)`);
console.log(`   Conviction     ${convComp?.result} (restore uses/session)`);
console.log(`   Influence      5 (Tier + 2)`);

// Resources
console.log('\n💚 RESOURCES:\n');
const woundsComp = result.computations.get('resource-wounds');
const shockComp = result.computations.get('resource-shock');
console.log(`   Max Wounds     ${woundsComp?.result} (Tier + Toughness)`);
console.log(`   Max Shock      ${shockComp?.result} (Tier + Willpower)`);

// Skills (show as dice pools)
console.log('\n🎲 SKILLS (Dice Pool = Attribute + Skill Ranks):\n');
for (const skillData of skills) {
  const computation = result.computations.get(`skill-${skillData.name}`);
  if (computation) {
    console.log(`   ${skillData.name.padEnd(18)} ${computation.result.toString().padStart(2)} dice`);
  }
}

// Equipment
console.log('\n🛡️  WARGEAR:\n');
console.log('   • Aquila Mk VII (Armor 5)');
console.log('   • Boltgun (Rapid Fire 3, 10+1ED, 24m range)');
console.log('   • Bolt Pistol (10+1ED, 12m range)');
console.log('   • Astartes Combat Knife (3+1ED, Reliable)');
console.log('   • 3x Frag Grenades (Blast, 12+1ED)');
console.log('   • 3x Krak Grenades (Assault, 12+2ED)');

// Abilities
console.log('\n⭐ ABILITIES:\n');
console.log('   • Tactical Versatility');
console.log('     When you make a Critical Hit, roll twice on the');
console.log('     Critical Hit Table and choose either result.');
console.log('\n   • Angel of Death (Species)');
console.log('     +½ Rank icons vs Mobs');
console.log('\n   • And They Shall Know No Fear (Species)');
console.log('     Immune to Fear, +Rank to Resolve tests');

// ============================================================
// DETAILED BREAKDOWNS
// ============================================================

console.log('\n' + '='.repeat(70));
console.log('📋 CALCULATION EXAMPLES:\n');

// Show Ballistic Skill breakdown (highest skill)
const bsComp = result.computations.get('skill-ballisticSkill');
if (bsComp) {
  console.log('🎯 BALLISTIC SKILL (for Boltgun attacks):');
  for (const line of bsComp.breakdown) {
    console.log(`   ${line}`);
  }
  console.log(`   → Roll ${bsComp.result} dice when shooting!`);
}

// Show Weapon Skill breakdown
const wsComp = result.computations.get('skill-weaponSkill');
if (wsComp) {
  console.log('\n⚔️  WEAPON SKILL (for melee attacks):');
  for (const line of wsComp.breakdown) {
    console.log(`   ${line}`);
  }
  console.log(`   → Roll ${wsComp.result} dice in melee!`);
}

// Show Wounds breakdown
const woundsCompDetailed = result.computations.get('resource-wounds');
if (woundsCompDetailed) {
  console.log('\n❤️  MAX WOUNDS:');
  for (const line of woundsCompDetailed.breakdown) {
    console.log(`   ${line}`);
  }
}

// Show Athletics
const athComp = result.computations.get('skill-athletics');
if (athComp) {
  console.log('\n🏃 ATHLETICS:');
  for (const line of athComp.breakdown) {
    console.log(`   ${line}`);
  }
}

// Show any errors
if (result.errors.length > 0) {
  console.log('\n⚠️  COMPUTATION ERRORS:');
  for (const error of result.errors) {
    console.log(`   ${error.propertyName}: ${error.error}`);
  }
}

console.log('\n' + '='.repeat(70));
console.log('✅ CHARACTER SHEET COMPLETE!\n');

console.log('📦 WHAT THIS DEMONSTRATES:');
console.log('   ✓ Official Tactical Space Marine stats');
console.log('   ✓ All 7 attributes');
console.log('   ✓ All 8 trained skills');
console.log('   ✓ Automatic dice pool calculation (attribute + skill)');
console.log('   ✓ Derived stats (Defense, Resilience, etc.)');
console.log('   ✓ Resource formulas (Wounds, Shock)');
console.log('   ✓ Complete wargear loadout');
console.log('   ✓ Archetype ability');
console.log('   ✓ XP cost tracking (257 XP)');

console.log('\n🎉 For the Emperor!\n');