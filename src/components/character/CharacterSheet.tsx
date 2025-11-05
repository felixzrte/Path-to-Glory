import { useState } from 'react';
import type { Character } from '@/types/character';
import { computeEntityStats } from '@/lib/computation-engine';
import { getArchetypeById } from '@/data/archetypes';
import { getAbilityById } from '@/data/abilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DiceRoller } from './DiceRoller';
import { ATTRIBUTES, SKILLS, SKILL_NAMES, SKILL_ATTRIBUTES } from '@/types/entity';
import type { SkillName } from '@/types/entity';

interface CharacterSheetProps {
  character: Character;
  onCharacterUpdate: (character: Character) => void;
}

export function CharacterSheet({ character }: CharacterSheetProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillName | null>(null);

  const stats = computeEntityStats(character);
  const archetype = character.archetype ? getArchetypeById(character.archetype) : null;
  const ability = archetype?.ability.abilityId ? getAbilityById(archetype.ability.abilityId) : null;

  return (
    <div className="space-y-6">
      {/* Character Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold">{character.name}</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Tier {character.tier} • {character.species} {archetype?.name}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {character.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary">{kw}</Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{character.xpAvailable}</div>
              <div className="text-sm text-muted-foreground">XP Available</div>
              <div className="text-sm text-muted-foreground mt-1">
                {character.xpSpent} XP Spent
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Stats */}
        <div className="space-y-6">
          {/* Attributes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Attribute</th>
                    <th className="text-center py-2 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {ATTRIBUTES.map((attr) => (
                    <tr key={attr} className="border-b last:border-0">
                      <td className="py-2 capitalize">{attr}</td>
                      <td className="text-center py-2">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 font-bold">
                          {stats[attr]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Derived Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Derived Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Defence</td>
                    <td className="text-right py-2">{stats.defence}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Resilience</td>
                    <td className="text-right py-2">{stats.resilience}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Determination</td>
                    <td className="text-right py-2">{stats.determination}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Max Wounds</td>
                    <td className="text-right py-2">{stats.maxWounds}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Max Shock</td>
                    <td className="text-right py-2">{stats.maxShock}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Speed</td>
                    <td className="text-right py-2">{stats.speed}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Conviction</td>
                    <td className="text-right py-2">{stats.conviction}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Resolve</td>
                    <td className="text-right py-2">{stats.resolve}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Influence</td>
                    <td className="text-right py-2">{stats.influence}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Wealth</td>
                    <td className="text-right py-2">{stats.wealth}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Passive Awareness</td>
                    <td className="text-right py-2">{stats.passiveAwareness}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Click a skill to roll</p>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Skill</th>
                  <th className="text-center py-2 font-semibold text-xs">Attr</th>
                  <th className="text-center py-2 font-semibold">Rank</th>
                </tr>
              </thead>
              <tbody>
                {SKILLS.map((skill) => {
                  const value = stats.skills[skill];
                  const linkedAttr = SKILL_ATTRIBUTES[skill];

                  return (
                    <tr
                      key={skill}
                      className={`border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedSkill === skill ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <td className="py-2">{SKILL_NAMES[skill]}</td>
                      <td className="text-center py-2 text-xs uppercase text-muted-foreground">
                        {linkedAttr.slice(0, 3)}
                      </td>
                      <td className="text-center py-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold text-sm">
                          {value}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Right Column: Abilities, Wargear, Dice Roller */}
        <div className="space-y-6">
          {/* Archetype Ability */}
          {archetype && ability && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{archetype.ability.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Archetype Ability</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{archetype.ability.description}</p>
                <Separator />
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Activation:</span>
                    <span className="text-muted-foreground">{ability.activation}</span>
                  </div>
                  {ability.conditions.map((cond, idx) => {
                    if (cond.type === 'skill-test' && 'skillName' in cond) {
                      return (
                        <div key={idx} className="flex justify-between">
                          <span className="font-medium">When:</span>
                          <span className="text-muted-foreground">{String(cond.skillName)} tests</span>
                        </div>
                      );
                    }
                    if (cond.type === 'target-keyword' && 'keyword' in cond) {
                      return (
                        <div key={idx} className="flex justify-between">
                          <span className="font-medium">Target:</span>
                          <span className="text-muted-foreground">{String(cond.keyword)}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  {ability.effects.map((effect, idx) => {
                    if (effect.type === 'bonus-dice') {
                      return (
                        <div key={idx} className="bg-green-500/10 p-2 rounded border border-green-500/20">
                          <span className="font-medium text-green-600">Effect:</span> +{effect.bonusDice} bonus dice
                        </div>
                      );
                    }
                    if (effect.type === 'heal') {
                      return (
                        <div key={idx} className="bg-blue-500/10 p-2 rounded border border-blue-500/20">
                          <span className="font-medium text-blue-600">Effect:</span> Heal {effect.healAmount} {effect.healType}
                        </div>
                      );
                    }
                    if (effect.type === 'special') {
                      return (
                        <div key={idx} className="bg-purple-500/10 p-2 rounded border border-purple-500/20">
                          <span className="font-medium text-purple-600">Effect:</span> {effect.specialText}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wargear */}
          {archetype && archetype.wargear && archetype.wargear.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wargear</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {archetype.wargear.map((item, idx) => {
                    if (typeof item === 'string') {
                      return (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      );
                    }
                    return (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          {item.type === 'specific' && item.items ? item.items.join(', ') : 'Wargear option'}
                          {item.type === 'choice' && item.items && ` (Choose ${item.count || 1}: ${item.items.join(', ')})`}
                          {item.type === 'any' && ` (Any wargear)`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Dice Roller */}
          {selectedSkill && (
            <DiceRoller
              character={character}
              selectedSkill={selectedSkill}
              onClose={() => setSelectedSkill(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
