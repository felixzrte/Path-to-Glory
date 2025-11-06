import { useState, useEffect } from 'react';
import type { Character } from '@/types/character';
import { createEmptyCharacter, addProperty } from '@/types/character';
import type { Property } from '@/types/property-system';
import { computeEntityStats } from '@/lib/computation-engine';
import type { Archetype } from '@/types/archetype';
import type { Species } from '@/types/species';
import { ALL_SPECIES } from '@/data/species';
import { TIER_1_ARCHETYPES, resolveKeywordChoice } from '@/data/archetypes';
import type { KeywordId } from '@/data/keywords';
import { getAbilityById } from '@/data/abilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ATTRIBUTES, SKILLS, SKILL_NAMES, SKILL_ATTRIBUTES } from '@/types/entity';
import type { AttributeName, SkillName } from '@/types/entity';
import type { CharacterCreationSettings } from './CharacterSettings';

interface CharacterCreatorProps {
  settings: CharacterCreationSettings;
  onCharacterCreated: (character: Character) => void;
  onBack: () => void;
}

type Step = 'species' | 'archetype' | 'stats' | 'talents' | 'wargear' | 'psychic' | 'background';

// Incremental costs to increase to each rating
const ATTRIBUTE_COSTS: Record<number, number> = {
  2: 4,    // 1→2 costs 4 XP
  3: 6,    // 2→3 costs 6 XP
  4: 10,   // 3→4 costs 10 XP
  5: 15,   // 4→5 costs 15 XP
  6: 20,   // 5→6 costs 20 XP
  7: 25,   // 6→7 costs 25 XP
  8: 30,   // 7→8 costs 30 XP
  9: 35,   // 8→9 costs 35 XP
  10: 40,  // 9→10 costs 40 XP
  11: 45,  // 10→11 costs 45 XP
  12: 50,  // 11→12 costs 50 XP
};

const SKILL_COSTS: Record<number, number> = {
  1: 2,    // 0→1 costs 2 XP
  2: 4,    // 1→2 costs 4 XP
  3: 6,    // 2→3 costs 6 XP
  4: 8,    // 3→4 costs 8 XP
  5: 10,   // 4→5 costs 10 XP
  6: 12,   // 5→6 costs 12 XP
  7: 14,   // 6→7 costs 14 XP
  8: 16,   // 7→8 costs 16 XP
};

export function CharacterCreator({ settings, onCharacterCreated, onBack }: CharacterCreatorProps) {
  const creationMode = settings.creationMode;
  
  // Start at appropriate step based on mode
  // Advanced: species first, Regular: archetype first
  const [step, setStep] = useState<Step>(creationMode === 'advanced' ? 'species' : 'archetype');
  
  // Character creation state
  const tier = settings.tier;
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Record<string, string>>({});
  
  // Wargear selection state
  const [selectedWargear, setSelectedWargear] = useState<string[]>([]);
  
  // Attribute purchases (stores the TARGET value, not bonus)
  const [attributePurchases, setAttributePurchases] = useState<Record<AttributeName, number>>({
    strength: 1,
    toughness: 1,
    agility: 1,
    initiative: 1,
    willpower: 1,
    intellect: 1,
    fellowship: 1,
  });
  
  // Skill purchases
  const [skillPurchases, setSkillPurchases] = useState<Record<SkillName, number>>({
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
  });

  // When archetype changes, initialize attribute purchases to include archetype bonuses
  useEffect(() => {
    if (selectedArchetype) {
      const newAttributePurchases = { ...attributePurchases };
      ATTRIBUTES.forEach((attr) => {
        const bonus = selectedArchetype.attributeBonuses?.[attr] || 0;
        // If archetype provides a value, use it directly (not 1 + bonus)
        // Otherwise default to 1
        newAttributePurchases[attr] = bonus > 0 ? bonus : 1;
      });
      setAttributePurchases(newAttributePurchases);
      
      // Skills start at 0 purchased (archetype bonuses are added separately in display)
      // Don't reset skills here - keep any existing purchases
    }
  }, [selectedArchetype?.id]); // Only trigger when archetype changes

  const calculateXPSpent = () => {
    let spent = 0;
    
    // Species cost
    if (selectedSpecies) {
      spent += selectedSpecies.xpCost;
    }
    
    // Archetype cost (only if selected in advanced mode)
    if (selectedArchetype && creationMode === 'regular') {
      spent += selectedArchetype.cost;
    }
    
    // Attribute costs
    ATTRIBUTES.forEach((attr) => {
      const archetypeBonus = selectedArchetype?.attributeBonuses?.[attr] || 0;
      const startingValue = archetypeBonus > 0 ? archetypeBonus : 1; // Starting value is the archetype bonus or 1
      const targetValue = attributePurchases[attr];
      
      // Calculate cost from startingValue to targetValue
      for (let i = startingValue + 1; i <= targetValue; i++) {
        spent += ATTRIBUTE_COSTS[i] || 0;
      }
    });
    
    // Skill costs
    SKILLS.forEach((skill) => {
      const purchasedRanks = skillPurchases[skill]; // This is just purchased, not including archetype
      
      // Calculate cost for each purchased rank
      for (let i = 1; i <= purchasedRanks; i++) {
        spent += SKILL_COSTS[i] || 0;
      }
    });
    
    return spent;
  };

  const getTierXP = (t: number) => {
    switch (t) {
      case 1: return 100;
      case 2: return 200;
      case 3: return 300;
      case 4: return 400;
      case 5: return 500;
      default: return 100;
    }
  };

  const xpTotal = getTierXP(tier) + settings.additionalXP + (creationMode === 'advanced' ? tier * 10 : 0);
  const xpSpent = calculateXPSpent();
  const xpRemaining = xpTotal - xpSpent;

  // Mode Selection Screen
  // Step 1: Species Selection (Advanced mode only)

  // Step 1: Basic Info
  // Step 1: Species Selection (Advanced mode only)
  const renderSpeciesStep = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Choose Species</CardTitle>
        <CardDescription>Select your character's species</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_SPECIES.map((species) => (
            <Card
              key={species.id}
              className={`cursor-pointer transition-all ${
                selectedSpecies?.id === species.id
                  ? 'ring-2 ring-primary'
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => setSelectedSpecies(species)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {species.name}
                  <Badge variant="secondary">{species.xpCost} XP</Badge>
                </CardTitle>
                <CardDescription>{species.description}</CardDescription>
              </CardHeader>
              {selectedSpecies?.id === species.id && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">Selected species</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Settings
          </Button>
          <Button
            onClick={() => setStep('stats')}
            disabled={!selectedSpecies}
            className="flex-1"
          >
            Continue to Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: Archetype Selection
  const renderArchetypeStep = () => {
    const availableArchetypes = creationMode === 'advanced' && selectedSpecies
      ? TIER_1_ARCHETYPES.filter((arch) =>
          arch.speciesRestriction.includes(selectedSpecies.id as any)
        )
      : TIER_1_ARCHETYPES;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Choose Archetype</CardTitle>
          <CardDescription>
            {creationMode === 'regular' 
              ? 'Select your archetype (species will be auto-assigned)' 
              : 'Select your character\'s archetype and role'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {availableArchetypes.map((archetype) => {
              const ability = archetype.ability.abilityId
                ? getAbilityById(archetype.ability.abilityId)
                : null;

              return (
                <Card
                  key={archetype.id}
                  className={`cursor-pointer transition-all ${
                    selectedArchetype?.id === archetype.id
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:border-primary'
                  }`}
                  onClick={() => {
                    setSelectedArchetype(archetype);
                    // In regular mode, auto-select the first compatible species
                    if (creationMode === 'regular') {
                      const compatibleSpecies = ALL_SPECIES.find(s => 
                        archetype.speciesRestriction.includes(s.id as any)
                      );
                      if (compatibleSpecies) {
                        setSelectedSpecies(compatibleSpecies);
                      }
                    }
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{archetype.name}</CardTitle>
                        <CardDescription>{archetype.faction} • Tier {archetype.tier}</CardDescription>
                      </div>
                      <Badge variant="secondary">{archetype.cost} XP</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{archetype.description}</p>
                    
                    {selectedArchetype?.id === archetype.id && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Special Ability: {archetype.ability.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{archetype.ability.description}</p>
                          {ability && (
                            <div className="bg-muted p-3 rounded-lg text-xs">
                              <div className="font-medium mb-1">Mechanics:</div>
                              <div>Activation: {ability.activation}</div>
                              {ability.effects.map((effect, idx) => (
                                <div key={idx}>
                                  {effect.type === 'bonus-dice' && `Bonus Dice: ${effect.bonusDice}`}
                                  {effect.type === 'heal' && `Heals: ${effect.healAmount} ${effect.healType}`}
                                  {effect.type === 'special' && effect.specialText}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {(archetype.attributeBonuses || archetype.skillBonuses) && (
                          <>
                            <Separator />
                            <div className="flex gap-4 text-xs">
                              {archetype.attributeBonuses && (
                                <div>
                                  <div className="font-semibold mb-1">Attribute Bonuses:</div>
                                  {Object.entries(archetype.attributeBonuses).map(([attr, bonus]) => (
                                    <div key={attr}>+{bonus} {attr}</div>
                                  ))}
                                </div>
                              )}
                              {archetype.skillBonuses && (
                                <div>
                                  <div className="font-semibold mb-1">Skill Bonuses:</div>
                                  {Object.entries(archetype.skillBonuses).map(([skill, bonus]) => (
                                    <div key={skill}>+{bonus} {skill}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
            >
              Back to Settings
            </Button>
            <Button
              onClick={() => {
                // Auto-select first keyword choice
                if (selectedArchetype) {
                  const keywordChoices = selectedArchetype.keywordChoices || [];
                  const autoKeywords: Record<string, string> = {};
                  keywordChoices.forEach((choice) => {
                    const kwDef = resolveKeywordChoice(choice.bracketedKeywordId);
                    if (kwDef && kwDef.examples && kwDef.examples.length > 0) {
                      autoKeywords[choice.bracketedKeywordId] = kwDef.examples[0];
                    }
                  });
                  setSelectedKeywords(autoKeywords);
                }
                setStep('stats');
              }}
              disabled={!selectedArchetype}
              className="flex-1"
            >
              Continue to Stats
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 4: Keywords
  // Step 3: Attributes & Skills Combined
  const renderStatsStep = () => {
    if (!selectedArchetype) return null;

    return (
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Build Your Character</CardTitle>
              <CardDescription>Spend XP to increase attributes and skills</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{xpRemaining}</div>
              <div className="text-xs text-muted-foreground">XP Remaining</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Attributes */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ATTRIBUTES.map((attr) => {
                const archetypeBonus = selectedArchetype.attributeBonuses?.[attr] || 0;
                const startingValue = archetypeBonus > 0 ? archetypeBonus : 1; // Starting value from archetype or default 1
                const targetValue = attributePurchases[attr];
                const nextCost = ATTRIBUTE_COSTS[targetValue + 1] || 0;

                return (
                  <Card key={attr}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold capitalize">{attr}</div>
                          <div className="text-xs text-muted-foreground">
                            Base: {startingValue}
                          </div>
                        </div>
                        <div className="text-2xl font-bold">{targetValue}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (targetValue > startingValue) {
                              setAttributePurchases({
                                ...attributePurchases,
                                [attr]: targetValue - 1,
                              });
                            }
                          }}
                          disabled={targetValue <= startingValue}
                        >
                          −
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const cost = ATTRIBUTE_COSTS[targetValue + 1];
                            if (cost && xpRemaining >= cost && targetValue < 8) {
                              setAttributePurchases({
                                ...attributePurchases,
                                [attr]: targetValue + 1,
                              });
                            }
                          }}
                          disabled={targetValue >= 8 || xpRemaining < nextCost}
                          className="flex-1"
                        >
                          + ({nextCost} XP)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {SKILLS.map((skill) => {
                // Skip Psychic Mastery if character doesn't have PSYKER keyword
                if (skill === 'psychicMastery') {
                  const isPsyker = selectedArchetype.keywords.some(kw => 
                    kw.toUpperCase() === 'PSYKER'
                  );
                  if (!isPsyker) return null;
                }

                const archetypeBonus = selectedArchetype.skillBonuses?.[skill] || 0;
                const purchasedRanks = skillPurchases[skill];
                const totalRanks = archetypeBonus + purchasedRanks;
                const nextCost = SKILL_COSTS[purchasedRanks + 1] || 0;
                const linkedAttr = SKILL_ATTRIBUTES[skill];
                
                // Get the current attribute value for this skill
                const linkedAttrValue = attributePurchases[linkedAttr];

                return (
                  <Card key={skill} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{SKILL_NAMES[skill]}</div>
                        <div className="text-xs text-muted-foreground">
                          Base ({linkedAttr.slice(0, 3).toUpperCase()}): {linkedAttrValue}
                        </div>
                      </div>
                      <div className="text-xl font-bold">{totalRanks}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (purchasedRanks > 0) {
                            setSkillPurchases({
                              ...skillPurchases,
                              [skill]: purchasedRanks - 1,
                            });
                          }
                        }}
                        disabled={purchasedRanks <= 0}
                      >
                        −
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const cost = SKILL_COSTS[purchasedRanks + 1];
                          if (cost && xpRemaining >= cost && purchasedRanks < 5) {
                            setSkillPurchases({
                              ...skillPurchases,
                              [skill]: purchasedRanks + 1,
                            });
                          }
                        }}
                        disabled={purchasedRanks >= 5 || xpRemaining < nextCost}
                        className="flex-1"
                      >
                        + ({nextCost} XP)
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(creationMode === 'advanced' ? 'species' : 'archetype')} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep('talents')} className="flex-1">
              Continue to Talents
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step: Wargear Selection
  const renderWargearStep = () => {
    if (!selectedArchetype) return null;

    const wargear = selectedArchetype.wargear || [];

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Select Wargear</CardTitle>
          <CardDescription>Choose your starting equipment from your archetype</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {wargear.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No wargear options available for this archetype.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wargear.map((option, idx) => {
                if (option.type === 'specific' && option.items) {
                  return (
                    <Card key={idx} className="border-2 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-base">Starting Equipment</CardTitle>
                        <CardDescription>You receive all of these items</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {option.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              <span className="font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                }

                if (option.type === 'choice' && option.items) {
                  const count = option.count || 1;
                  return (
                    <Card key={idx} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-base">Choose {count} {count === 1 ? 'Item' : 'Items'}</CardTitle>
                        <CardDescription>Select from the following options</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {option.items.map((item, itemIdx) => {
                            const isSelected = selectedWargear.includes(`${idx}-${item}`);
                            return (
                              <Button
                                key={itemIdx}
                                variant={isSelected ? 'default' : 'outline'}
                                onClick={() => {
                                  const key = `${idx}-${item}`;
                                  if (isSelected) {
                                    setSelectedWargear(selectedWargear.filter(w => w !== key));
                                  } else {
                                    // Count how many from this option are selected
                                    const currentCount = selectedWargear.filter(w => w.startsWith(`${idx}-`)).length;
                                    if (currentCount < count) {
                                      setSelectedWargear([...selectedWargear, key]);
                                    }
                                  }
                                }}
                                className="justify-start h-auto py-3"
                              >
                                {item}
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                if (option.type === 'any') {
                  return (
                    <Card key={idx} className="border-2 border-dashed">
                      <CardHeader>
                        <CardTitle className="text-base">Any Wargear</CardTitle>
                        <CardDescription>
                          You may choose any wargear that fits the constraints
                          {option.constraints?.maxValue && ` (Max Value: ${option.constraints.maxValue})`}
                          {option.constraints?.maxRarity && ` (Max Rarity: ${option.constraints.maxRarity})`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground italic">
                          Custom wargear selection coming soon...
                        </p>
                      </CardContent>
                    </Card>
                  );
                }

                return null;
              })}
            </div>
          )}

          <Separator />

          {/* Summary of selected wargear */}
          <div>
            <h3 className="font-semibold mb-2">Your Wargear</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              {wargear.map((option, idx) => {
                if (option.type === 'specific' && option.items) {
                  return option.items.map((item, itemIdx) => (
                    <div key={`${idx}-${itemIdx}`} className="text-sm">✓ {item}</div>
                  ));
                }
                return null;
              })}
              {selectedWargear.map((key) => {
                const item = key.split('-').slice(1).join('-');
                return <div key={key} className="text-sm">✓ {item}</div>;
              })}
              {wargear.length === 0 && selectedWargear.length === 0 && (
                <div className="text-sm text-muted-foreground">No wargear selected yet</div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('talents')} className="flex-1">
              Back to Talents
            </Button>
            <Button onClick={() => setStep('psychic')} className="flex-1">
              Continue to Psychic Powers
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Main render with stepper
  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
        {(creationMode === 'advanced' ? [
            { key: 'species', label: 'Species' },
            { key: 'stats', label: 'Stats' },
            { key: 'talents', label: 'Talents' },
            { key: 'wargear', label: 'Wargear' },
            { key: 'psychic', label: 'Psychic' },
            { key: 'background', label: 'Background' },
          ] : [
            { key: 'archetype', label: 'Archetype' },
            { key: 'stats', label: 'Stats' },
            { key: 'talents', label: 'Talents' },
            { key: 'wargear', label: 'Wargear' },
            { key: 'psychic', label: 'Psychic' },
            { key: 'background', label: 'Background' },
          ]).map((s, idx, arr) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`px-3 py-1 rounded-full ${
                step === s.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {idx + 1}. {s.label}
            </div>
            {idx < arr.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div>
        {step === 'species' && creationMode === 'advanced' && renderSpeciesStep()}
        {step === 'archetype' && creationMode === 'regular' && renderArchetypeStep()}
        {step === 'stats' && renderStatsStep()}
        {step === 'talents' && <PlaceholderStep title="Talents" nextStep="wargear" onContinue={setStep} />}
        {step === 'wargear' && renderWargearStep()}
        {step === 'psychic' && <PlaceholderStep title="Psychic Powers" nextStep="background" onContinue={setStep} />}
        {step === 'background' && renderBackgroundStep()}
      </div>
    </div>
  );

  // Background step - finalizes and creates the character
  function renderBackgroundStep() {
    const handleCreate = () => {
      if (!selectedSpecies) return;
      
      let newChar = createEmptyCharacter(settings.characterName, settings.tier);
      newChar.species = selectedSpecies.id;
      if (selectedArchetype) {
        newChar.archetype = selectedArchetype.id;
      }
      newChar.keywords = [
        ...(selectedArchetype?.keywords || []),
        ...Object.values(selectedKeywords),
      ] as KeywordId[];
      newChar.xpSpent = xpSpent;
      newChar.xpAvailable = xpRemaining;

      // Add attribute properties - ALWAYS save all attributes
      ATTRIBUTES.forEach((attr) => {
        const finalValue = attributePurchases[attr];
        
        const propId = `attr-${attr}`;
        const prop: Property = {
          id: propId,
          parent: newChar.rootPropertyId,
          type: 'attribute',
          name: `${attr} (Character Creation)`,
          enabled: true,
          order: 0,
          baseValue: finalValue,
        };
        // IMPORTANT: addProperty returns a new character - we must capture it!
        newChar = addProperty(newChar, prop);
      });

      // Add skill properties - save if we have any ranks
      SKILLS.forEach((skill) => {
        const purchasedRanks = skillPurchases[skill];
        const archetypeBonus = selectedArchetype?.skillBonuses?.[skill] || 0;
        const finalValue = archetypeBonus + purchasedRanks;
        
        // Only save if we have ranks (to avoid cluttering with 0-rank skills)
        if (finalValue > 0) {
          const propId = `skill-${skill}`;
          const linkedAttr = SKILL_ATTRIBUTES[skill];
          const prop: Property = {
            id: propId,
            parent: newChar.rootPropertyId,
            type: 'skill',
            name: `${SKILL_NAMES[skill]} (Character Creation)`,
            enabled: true,
            order: 0,
            baseValue: finalValue,
            linkedAttribute: linkedAttr,
          };
          // IMPORTANT: addProperty returns a new character - we must capture it!
          newChar = addProperty(newChar, prop);
        }
      });

      // Compute final stats
      newChar.stats = computeEntityStats(newChar);

      onCharacterCreated(newChar);
    };

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Background & Finalize</CardTitle>
          <CardDescription>Add background details (WIP) and finalize your character</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="py-6 text-center text-muted-foreground">
            <p className="mb-4">Background customization coming soon...</p>
          </div>

          <Separator />

          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">XP Remaining</div>
                <div className="text-2xl font-bold text-primary">{xpRemaining} XP</div>
              </div>
              <div className="text-sm">
                <div>Total: {xpTotal} XP</div>
                <div>Spent: {xpSpent} XP</div>
              </div>
            </div>
          </div>

          <Button onClick={handleCreate} className="w-full" size="lg">
            Create Character
          </Button>
        </CardContent>
      </Card>
    );
  }
}

function PlaceholderStep({ title, nextStep, onContinue }: { title: string; nextStep: Step; onContinue: (step: Step) => void }) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Coming soon...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-12 text-center text-muted-foreground">
          <p className="mb-6">This step is work in progress.</p>
          <Button onClick={() => onContinue(nextStep)}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
