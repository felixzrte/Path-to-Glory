import { useState } from 'react';
import type { Character } from '@/types/character';
import { computeEntityStats } from '@/lib/computation-engine';
import { calculateDicePool, performTest } from '@/lib/dice-engine';
import type { SkillName } from '@/types/entity';
import { SKILL_NAMES, SKILL_ATTRIBUTES } from '@/types/entity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DiceRollerProps {
  character: Character;
  selectedSkill: SkillName;
  onClose: () => void;
}

export function DiceRoller({ character, selectedSkill, onClose }: DiceRollerProps) {
  const [dn, setDn] = useState(3);
  const [bonusDice, setBonusDice] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [rolling, setRolling] = useState(false);

  const stats = computeEntityStats(character);
  const linkedAttr = SKILL_ATTRIBUTES[selectedSkill];
  const attributeValue = stats[linkedAttr];
  const skillValue = stats.skills[selectedSkill];
  const baseDicePool = calculateDicePool(attributeValue, skillValue, 0);

  const handleRoll = () => {
    setRolling(true);
    const totalPool = baseDicePool + bonusDice;
    const testResult = performTest(totalPool, dn, 1);
    setResult(testResult);
    
    setTimeout(() => setRolling(false), 500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{SKILL_NAMES[selectedSkill]} Test</CardTitle>
            <CardDescription>
              {linkedAttr} ({attributeValue}) + {SKILL_NAMES[selectedSkill]} ({skillValue})
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dice Pool */}
        <div>
          <div className="text-sm font-medium mb-2">Dice Pool</div>
          <div className="text-4xl font-bold text-primary">{baseDicePool + bonusDice}</div>
          <div className="text-xs text-muted-foreground">
            Base: {baseDicePool} dice + Bonus: {bonusDice}
          </div>
        </div>

        {/* DN Selection */}
        <div>
          <div className="text-sm font-medium mb-2">Difficulty Number (DN)</div>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6, 7].map((d) => (
              <Button
                key={d}
                variant={dn === d ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDn(d)}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        {/* Bonus Dice */}
        <div>
          <div className="text-sm font-medium mb-2">Bonus Dice</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBonusDice(Math.max(0, bonusDice - 1))}
            >
              −
            </Button>
            <div className="text-xl font-bold w-12 text-center">{bonusDice}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBonusDice(bonusDice + 1)}
            >
              +
            </Button>
          </div>
        </div>

        {/* Roll Button */}
        <Button onClick={handleRoll} className="w-full" size="lg" disabled={rolling}>
          {rolling ? 'Rolling...' : 'Roll Test'}
        </Button>

        {/* Results */}
        {result && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="font-semibold text-lg text-center">
              {result.success ? (
                <span className="text-green-600 text-2xl">✓ Success!</span>
              ) : (
                <span className="text-red-600 text-2xl">✗ Failed</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted p-3 rounded">
                <div className="text-xs text-muted-foreground">Icons</div>
                <div className="font-semibold text-lg">{result.icons}</div>
              </div>
              <div className="bg-muted p-3 rounded">
                <div className="text-xs text-muted-foreground">Exalted Icons</div>
                <div className="font-semibold text-lg">{result.exaltedIcons}</div>
              </div>
              {result.shift > 0 && (
                <div className="col-span-2 bg-green-500/10 p-3 rounded border border-green-500/30">
                  <div className="text-xs text-green-700">Shift (Extra Success)</div>
                  <div className="font-semibold text-lg text-green-700">+{result.shift}</div>
                </div>
              )}
              {result.glory && (
                <div className="col-span-2 bg-purple-500/10 p-3 rounded border border-purple-500/30">
                  <div className="text-xs text-purple-700">⚡ Glory!</div>
                  <div className="font-semibold text-purple-700">Critical Success - Wrath 6!</div>
                </div>
              )}
              {result.complication && (
                <div className="col-span-2 bg-red-500/10 p-3 rounded border border-red-500/30">
                  <div className="text-xs text-red-700">☠ Complication</div>
                  <div className="font-semibold text-red-700">Wrath 1 - Something bad happens</div>
                </div>
              )}
            </div>

            {/* Visual Dice */}
            <div>
              <div className="text-xs font-medium mb-3 text-center">Dice Results:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.rolls?.slice(0, -1).map((roll: number, idx: number) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg shadow-md transform transition-transform ${
                      rolling ? 'animate-bounce' : ''
                    } ${
                      roll === 6
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-900'
                        : roll >= 4
                        ? 'bg-green-100 border-green-400 text-green-900'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}
                  >
                    {roll}
                  </div>
                ))}
                {result.rolls && result.rolls.length > 0 && (() => {
                  const wrathRoll = result.rolls[result.rolls.length - 1];
                  return (
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg shadow-md transform transition-transform ${
                        rolling ? 'animate-spin' : ''
                      } ${
                        wrathRoll === 6
                          ? 'bg-purple-100 border-purple-400 text-purple-900'
                          : wrathRoll === 1
                          ? 'bg-red-100 border-red-400 text-red-900'
                          : wrathRoll >= 4
                          ? 'bg-green-100 border-green-400 text-green-900'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}
                    >
                      {wrathRoll === 6 ? '⚡' : wrathRoll === 1 ? '☠' : wrathRoll}
                    </div>
                  );
                })()}
              </div>
              <div className="text-xs text-center text-muted-foreground mt-2">
                🎲 Normal dice | ⚡ Wrath die (last die)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
