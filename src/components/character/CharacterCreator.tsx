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

interface CharacterCreatorProps {
  onCharacterCreated: (character: Character) => void;
}

type CreationMode = 'select' | 'regular' | 'advanced';
type Step = 'basic' | 'species' | 'archetype' | 'keywords' | 'stats' | 'review';

const ATTRIBUTE_COSTS: Record<number, number> = {
  2: 4, 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, 8: 110
};

const SKILL_COSTS: Record<number, number> = {
  1: 2, 2: 6, 3: 12, 4: 20, 5: 30
};

export function CharacterCreator({ onCharacterCreated }: CharacterCreatorProps) {
  const [creationMode, setCreationMode] = useState<CreationMode>('select');
  const [step, setStep] = useState<Step>('basic');
  
  // Character creation state
  const [name, setName] = useState('');
  const [tier, setTier] = useState(1);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Record<string, string>>({});
  
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
        const baseValue = 1;
        const archetypeBonus = selectedArchetype.attributeBonuses?.[attr] || 0;
        const finalBase = baseValue + archetypeBonus;
        // Set the purchase target to the base value (including archetype bonus)
        newAttributePurchases[attr] = finalBase;
      });
      setAttributePurchases(newAttributePurchases);

      // Also initialize skill purchases to include archetype bonuses
      const newSkillPurchases = { ...skillPurchases };
      SKILLS.forEach((skill) => {
        const archetypeBonus = selectedArchetype.skillBonuses?.[skill] || 0;
        newSkillPurchases[skill] = archetypeBonus;
      });
      setSkillPurchases(newSkillPurchases);
    }
  }, [selectedArchetype?.id]); // Only trigger when archetype changes

  const calculateXPSpent = () => {
    let spent = 0;
    
    // Species cost
    if (selectedSpecies) {
      spent += selectedSpecies.xpCost;
    }
    
    // Archetype cost
    if (selectedArchetype) {
      spent += selectedArchetype.cost;
    }
    
    // Attribute costs
    ATTRIBUTES.forEach((attr) => {
      const baseValue = 1;
      const archetypeBonus = selectedArchetype?.attributeBonuses?.[attr] || 0;
      const finalBase = baseValue + archetypeBonus;
      const targetValue = attributePurchases[attr];
      
      // Calculate cost from finalBase to targetValue
      for (let i = finalBase + 1; i <= targetValue; i++) {
        spent += ATTRIBUTE_COSTS[i] || 0;
      }
    });
    
    // Skill costs
    SKILLS.forEach((skill) => {
      const archetypeBonus = selectedArchetype?.skillBonuses?.[skill] || 0;
      const purchasedRanks = skillPurchases[skill];
      
      // Calculate cost from archetypeBonus to purchasedRanks
      for (let i = archetypeBonus + 1; i <= purchasedRanks; i++) {
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
      default: return 100;
    }
  };

  const xpTotal = getTierXP(tier);
  const xpSpent = calculateXPSpent();
  const xpRemaining = xpTotal - xpSpent;

  // Mode Selection Screen
  const renderModeSelection = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Character Creation</CardTitle>
        <CardDescription>Choose your creation method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regular Character Creation */}
          <Card 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => {
              setCreationMode('regular');
              setStep('archetype');
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl">Regular Character Creation</CardTitle>
              <CardDescription>Quick archetype-based creation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Choose an archetype</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Species locked by archetype</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Keywords auto-selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Spend XP on attributes & skills</span>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="outline">Recommended</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Character Creation */}
          <Card 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => {
              setCreationMode('advanced');
              setStep('basic');
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl">Advanced Character Creation</CardTitle>
              <CardDescription>Full customization control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Name and tier selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Choose species independently</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Select archetype (filtered by species)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Customize keywords</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Full XP control</span>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="outline">For experienced players</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  // Step 1: Basic Info
  const renderBasicStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Start by naming your character and choosing their tier</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Character Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter character name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tier (Starting XP)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((t) => (
              <Button
                key={t}
                variant={tier === t ? 'default' : 'outline'}
                onClick={() => setTier(t)}
                className="flex flex-col h-auto py-4"
              >
                <span className="text-lg font-bold">Tier {t}</span>
                <span className="text-xs">{getTierXP(t)} XP</span>
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            if (creationMode === 'regular') {
              setStep('archetype');
            } else {
              setStep('species');
            }
          }}
          disabled={!name}
          className="w-full"
        >
          {creationMode === 'regular' ? 'Continue to Archetype' : 'Continue to Species Selection'}
        </Button>
      </CardContent>
    </Card>
  );

  // Step 2: Species Selection
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
          <Button variant="outline" onClick={() => setStep('basic')} className="flex-1">
            Back
          </Button>
          <Button
            onClick={() => setStep('archetype')}
            disabled={!selectedSpecies}
            className="flex-1"
          >
            Continue to Archetype
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
              onClick={() => {
                if (creationMode === 'regular') {
                  setCreationMode('select');
                  setStep('basic');
                } else {
                  setStep('species');
                }
              }} 
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (creationMode === 'regular') {
                  // Auto-select first keyword choice or skip if none
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
                } else {
                  setStep('keywords');
                }
              }}
              disabled={!selectedArchetype}
              className="flex-1"
            >
              {creationMode === 'regular' ? 'Continue to Stats' : 'Continue to Keywords'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 4: Keywords
  const renderKeywordsStep = () => {
    if (!selectedArchetype) return null;

    const keywordChoices = selectedArchetype.keywordChoices || [];

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Choose Keywords</CardTitle>
          <CardDescription>
            Select keywords that define your character's affiliations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fixed Keywords */}
          <div>
            <h3 className="font-semibold mb-2">Fixed Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {selectedArchetype.keywords.map((kw) => (
                <Badge key={kw} variant="secondary">{kw}</Badge>
              ))}
            </div>
          </div>

          {/* Keyword Choices */}
          {keywordChoices.length > 0 && (
            <>
              <Separator />
              {keywordChoices.map((choice) => {
                const kwDef = resolveKeywordChoice(choice.bracketedKeywordId);
                if (!kwDef) return null;

                return (
                  <div key={choice.bracketedKeywordId}>
                    <label className="block text-sm font-medium mb-2">
                      {kwDef.name} {choice.required && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-sm text-muted-foreground mb-3">{kwDef.description}</p>
                    <select
                      value={selectedKeywords[choice.bracketedKeywordId] || ''}
                      onChange={(e) =>
                        setSelectedKeywords({
                          ...selectedKeywords,
                          [choice.bracketedKeywordId]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select {kwDef.name}</option>
                      {kwDef.examples.map((example) => (
                        <option key={example} value={example}>
                          {example}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('archetype')} className="flex-1">
              Back
            </Button>
            <Button
              onClick={() => setStep('stats')}
              disabled={
                keywordChoices.some(
                  (choice) => choice.required && !selectedKeywords[choice.bracketedKeywordId]
                )
              }
              className="flex-1"
            >
              Continue to Stats
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 5: Attributes & Skills Combined
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
                const baseValue = 1;
                const archetypeBonus = selectedArchetype.attributeBonuses?.[attr] || 0;
                const currentBase = baseValue + archetypeBonus;
                const targetValue = attributePurchases[attr];
                const nextCost = ATTRIBUTE_COSTS[targetValue + 1] || 0;

                return (
                  <Card key={attr}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold capitalize">{attr}</div>
                          <div className="text-xs text-muted-foreground">
                            Base: {currentBase}
                          </div>
                        </div>
                        <div className="text-2xl font-bold">{targetValue}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (targetValue > currentBase) {
                              setAttributePurchases({
                                ...attributePurchases,
                                [attr]: targetValue - 1,
                              });
                            }
                          }}
                          disabled={targetValue <= currentBase}
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
                const archetypeBonus = selectedArchetype.skillBonuses?.[skill] || 0;
                const currentRanks = skillPurchases[skill];
                const nextCost = SKILL_COSTS[currentRanks + 1] || 0;
                const linkedAttr = SKILL_ATTRIBUTES[skill];

                return (
                  <Card key={skill} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{SKILL_NAMES[skill]}</div>
                        <div className="text-xs text-muted-foreground">
                          ({linkedAttr.slice(0, 3)}) Base: {archetypeBonus}
                        </div>
                      </div>
                      <div className="text-xl font-bold">{currentRanks}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (currentRanks > archetypeBonus) {
                            setSkillPurchases({
                              ...skillPurchases,
                              [skill]: currentRanks - 1,
                            });
                          }
                        }}
                        disabled={currentRanks <= archetypeBonus}
                      >
                        −
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const cost = SKILL_COSTS[currentRanks + 1];
                          if (cost && xpRemaining >= cost && currentRanks < 5) {
                            setSkillPurchases({
                              ...skillPurchases,
                              [skill]: currentRanks + 1,
                            });
                          }
                        }}
                        disabled={currentRanks >= 5 || xpRemaining < nextCost}
                        className="flex-1"
                      >
                        + ({nextCost} XP)
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('keywords')} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep('review')} className="flex-1">
              Review Character
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 6: Review & Create
  const renderReviewStep = () => {
    if (!selectedSpecies || !selectedArchetype) return null;

    const handleCreate = () => {
      // For regular mode, use archetype name as default if no name provided
      const characterName = name || `${selectedArchetype.name}`;
      
      const newChar = createEmptyCharacter(characterName, tier);
      newChar.species = selectedSpecies.id;
      newChar.archetype = selectedArchetype.id;
      newChar.keywords = [
        ...selectedArchetype.keywords,
        ...Object.values(selectedKeywords),
      ] as KeywordId[];
      newChar.xpSpent = xpSpent;
      newChar.xpAvailable = xpRemaining;

      // Add attribute properties
      ATTRIBUTES.forEach((attr) => {
        const finalValue = attributePurchases[attr];
        const archetypeBonus = selectedArchetype.attributeBonuses?.[attr] || 0;
        
        // Save property if value differs from base (1) OR if archetype gives bonus
        if (finalValue > 1 || archetypeBonus > 0) {
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
          addProperty(newChar, prop);
        }
      });

      // Add skill properties
      SKILLS.forEach((skill) => {
        const finalValue = skillPurchases[skill];
        const archetypeBonus = selectedArchetype.skillBonuses?.[skill] || 0;
        
        // Save property if value > 0 OR if archetype gives bonus
        if (finalValue > 0 || archetypeBonus > 0) {
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
          addProperty(newChar, prop);
        }
      });

      // Compute final stats
      newChar.stats = computeEntityStats(newChar);

      onCharacterCreated(newChar);
    };

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Review Character</CardTitle>
          <CardDescription>Review your character before finalizing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name input at review (for regular mode) */}
          {creationMode === 'regular' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Character Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder={`Enter name (or leave blank for "${selectedArchetype.name}")`}
                />
              </div>
              <Separator />
            </>
          )}

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {creationMode === 'advanced' && (
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-semibold">{name}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground">Tier</div>
              <div className="font-semibold">{tier}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Species</div>
              <div className="font-semibold">{selectedSpecies.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Archetype</div>
              <div className="font-semibold">{selectedArchetype.name}</div>
            </div>
          </div>

          <Separator />

          {/* XP Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">XP Expenditure</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total XP (Tier {tier}):</span>
                <span className="font-semibold">{xpTotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Spent:</span>
                <span>−{xpSpent}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Remaining:</span>
                <span>{xpRemaining}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('stats')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleCreate} className="flex-1">
              Create Character
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Main render with stepper
  return (
    <div className="space-y-6">
      {creationMode !== 'select' && (
        <>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            {(creationMode === 'advanced' ? [
                { key: 'basic', label: 'Basic' },
                { key: 'species', label: 'Species' },
                { key: 'archetype', label: 'Archetype' },
                { key: 'keywords', label: 'Keywords' },
                { key: 'stats', label: 'Stats' },
                { key: 'review', label: 'Review' },
              ] : [
                { key: 'archetype', label: 'Archetype' },
                { key: 'stats', label: 'Stats' },
                { key: 'review', label: 'Review' },
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
        </>
      )}

      {/* Step content */}
      {creationMode === 'select' && renderModeSelection()}
      {creationMode !== 'select' && (
        <>
          {step === 'basic' && creationMode === 'advanced' && renderBasicStep()}
          {step === 'species' && creationMode === 'advanced' && renderSpeciesStep()}
          {step === 'archetype' && renderArchetypeStep()}
          {step === 'keywords' && creationMode === 'advanced' && renderKeywordsStep()}
          {step === 'stats' && renderStatsStep()}
          {step === 'review' && renderReviewStep()}
        </>
      )}
    </div>
  );
}
