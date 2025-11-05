# Ability System - Complete Implementation

## 🎯 System Architecture

The ability system is **structured and parseable** so the game engine can:
- ✅ Detect when abilities trigger (conditions)
- ✅ Calculate effects automatically (bonus dice, healing, etc.)
- ✅ Show UI prompts at the right time
- ✅ Apply effects to dice rolls

## 📁 File Structure

```
/src/types/ability.ts          - Type definitions
/src/data/abilities.ts          - All 8 archetype abilities (structured)
/src/lib/ability-engine.ts      - Apply abilities to tests
/src/demo/ability-demo.ts       - Working examples
```

## 🔧 Core Concepts

### 1. **Activation Types**
```typescript
type AbilityActivation = 
  | 'passive'        // Always on
  | 'test'           // Triggers on skill tests
  | 'combat-action'  // Costs an action
  | 'free-action'    // Free to use
  | 'reflexive'      // Reaction
  | 'once-per-scene'
  | 'once-per-combat'
```

### 2. **Conditions** (when does it trigger?)
```typescript
interface AbilityCondition {
  type: 'skill-test' | 'target-keyword' | 'target-type' | 'damage-type' | 'combat-situation';
  skill?: SkillName;              // 'medicae', 'cunning', etc.
  targetKeyword?: KeywordId;      // 'IMPERIUM', 'ORK', etc.
  targetType?: 'ally' | 'enemy';
  damageType?: 'melee' | 'ranged';
}
```

### 3. **Effects** (what does it do?)
```typescript
interface AbilityEffect {
  type: 'bonus-dice' | 'reroll' | 'heal' | 'damage-modifier' | 'condition' | 'special';
  bonusDice?: string;     // "rank", "doubleRank", "2"
  healAmount?: string;    // "1d3+rank"
  damageBonus?: string;   // "+1d3", "+strength"
}
```

## 📋 Implemented Abilities

### **Loyal Compassion** (Sister Hospitaller)
```typescript
activation: 'test'
conditions: [
  { type: 'skill-test', skill: 'medicae' },
  { type: 'target-keyword', targetKeyword: 'IMPERIUM' }
]
effects: [
  { type: 'bonus-dice', bonusDice: 'doubleRank' }
]
```
**Result:** +Double Rank bonus dice on Medicae tests for IMPERIUM targets

### **Fiery Invective** (Ministorum Priest)
```typescript
activation: 'free-action'
usesPerCombat: 1
effects: [
  { type: 'heal', healAmount: '1d3+rank', healType: 'shock' }
]
```
**Result:** Free action, heals 1d3+Rank Shock to IMPERIUM allies

### **Get Stuck In** (Ork Boy)
```typescript
activation: 'test'
conditions: [
  { type: 'damage-type', damageType: 'melee' }
]
effects: [
  { type: 'bonus-dice', bonusDice: 'rank' } // × number of allies
]
```
**Result:** +Rank bonus dice per ally engaged with same target

## 🎮 Usage Example

```typescript
import { getAbilityBonusForTest } from '@/lib/ability-engine';
import { calculateDicePool, performTest } from '@/lib/dice-engine';

// Setup context
const context = {
  userRank: 2,
  userKeywords: ['IMPERIUM', 'ADEPTA SORORITAS'],
  skill: 'medicae',
  targetKeywords: ['IMPERIUM'],
  targetType: 'ally',
};

// Get bonus from abilities
const bonusDice = getAbilityBonusForTest(['loyal-compassion'], context);
// → Returns 4 (doubleRank: 2 × 2)

// Calculate full dice pool
const dicePool = calculateDicePool(4, 3, bonusDice);
// → 4 (Int) + 3 (Medicae) + 4 (ability) = 11 dice

// Perform test
const result = performTest(dicePool, 4, 1);
// → { success: true, totalIcons: 7, shift: 3, ... }
```

## 🔗 Integration Points

### With Property System
Abilities can be added as properties to characters:
```typescript
{
  type: 'feature',
  name: 'Loyal Compassion',
  abilityId: 'loyal-compassion', // References ability database
}
```

### With Archetype System
Archetypes now reference structured abilities:
```typescript
ability: {
  abilityId: 'loyal-compassion',  // NEW: References ability DB
  name: 'Loyal Compassion',        // OLD: For display
  description: '...',               // OLD: For display
  gameEffect: '...',                // OLD: For humans
}
```

### With Dice Engine
```typescript
// 1. Get applicable abilities
const applicable = findApplicableAbilities(['loyal-compassion'], context);

// 2. Apply effects
const result = applyAbilities(['loyal-compassion'], context);

// 3. Add bonus dice to roll
const dicePool = baseDicePool + result.bonusDice;
const testResult = performTest(dicePool, dn);
```

## ✅ Benefits

1. **Type-Safe**: TypeScript knows all skills, keywords, effects
2. **Queryable**: UI can ask "what abilities apply to this test?"
3. **Automated**: System calculates bonus dice, no manual math
4. **Extensible**: Easy to add new abilities, conditions, effects
5. **Debuggable**: Clear structure shows exactly what's happening
6. **Flexible**: Special effects for complex abilities

## 🚀 Next Steps

- [ ] Add abilities to character property trees
- [ ] Build UI for ability prompts ("Loyal Compassion applies! +4 dice?")
- [ ] Implement talent abilities (similar structure)
- [ ] Add wargear abilities (weapon traits, armor effects)
- [ ] Build combat action menu (show available abilities)
- [ ] Track ability uses (once-per-combat, once-per-scene)
