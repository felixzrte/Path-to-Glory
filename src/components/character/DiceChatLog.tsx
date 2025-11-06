import { useState } from 'react';
import type { Character } from '@/types/character';
import { computeEntityStats } from '@/lib/computation-engine';
import { calculateDicePool, performTest } from '@/lib/dice-engine';
import type { SkillName } from '@/types/entity';
import { SKILL_NAMES, SKILL_ATTRIBUTES } from '@/types/entity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RollResult {
  id: string;
  timestamp: Date;
  skillName: string;
  linkedAttr: string;
  dicePool: number;
  dn: number;
  result: any;
}

interface DiceChatLogProps {
  character: Character;
}

export function DiceChatLog({ character }: DiceChatLogProps) {
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillName | null>(null);
  const [dn, setDn] = useState(3);
  const [bonusDice, setBonusDice] = useState(0);

  const stats = computeEntityStats(character);

  const handleRoll = (skill: SkillName) => {
    const linkedAttr = SKILL_ATTRIBUTES[skill];
    const attributeValue = stats[linkedAttr];
    const skillValue = stats.skills[skill];
    const baseDicePool = calculateDicePool(attributeValue, skillValue, 0);
    const totalPool = baseDicePool + bonusDice;
    
    const testResult = performTest(totalPool, dn, 1);
    
    const newRoll: RollResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      skillName: SKILL_NAMES[skill],
      linkedAttr,
      dicePool: totalPool,
      dn,
      result: testResult,
    };
    
    setRollHistory([newRoll, ...rollHistory]);
    setBonusDice(0); // Reset bonus dice after roll
  };

  const clearHistory = () => {
    setRollHistory([]);
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3 border-b shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dice Log</CardTitle>
          {rollHistory.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              Clear
            </Button>
          )}
        </div>
        
        {/* Quick Controls */}
        <div className="flex gap-4 pt-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">DN:</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5].map((d) => (
                <Button
                  key={d}
                  variant={dn === d ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setDn(d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Bonus:</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setBonusDice(Math.max(0, bonusDice - 1))}
            >
              −
            </Button>
            <span className="font-mono font-bold w-6 text-center">{bonusDice}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setBonusDice(bonusDice + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {rollHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-sm">Click any skill to roll dice</p>
                <p className="text-xs mt-1">Rolls will appear here</p>
              </div>
            ) : (
              rollHistory.map((roll) => (
                <div
                  key={roll.id}
                  className="border rounded-lg p-3 bg-card hover:bg-muted/50 transition-colors"
                >
                  {/* Roll Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">{roll.skillName}</div>
                      <div className="text-xs text-muted-foreground">
                        {roll.linkedAttr.slice(0, 3).toUpperCase()} • {roll.dicePool} dice vs DN {roll.dn}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {roll.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Result Badge */}
                  <div className="mb-2">
                    {roll.result.success ? (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-700 font-medium">
                        ✓ Success • {roll.result.icons} icons
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-700 font-medium">
                        ✗ Failed • {roll.result.icons} icons
                      </div>
                    )}
                  </div>

                  {/* Dice Visual */}
                  <div className="flex flex-wrap gap-1.5">
                    {roll.result.rolls?.slice(0, -1).map((dieRoll: number, idx: number) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-bold ${
                          dieRoll === 6
                            ? 'bg-yellow-100 border-yellow-400 text-yellow-900'
                            : dieRoll >= roll.dn
                            ? 'bg-green-100 border-green-400 text-green-900'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {dieRoll}
                      </div>
                    ))}
                    {roll.result.rolls && roll.result.rolls.length > 0 && (() => {
                      const wrathRoll = roll.result.rolls[roll.result.rolls.length - 1];
                      return (
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-bold ${
                            wrathRoll === 6
                              ? 'bg-purple-100 border-purple-400 text-purple-900'
                              : wrathRoll === 1
                              ? 'bg-red-100 border-red-400 text-red-900'
                              : wrathRoll >= roll.dn
                              ? 'bg-green-100 border-green-400 text-green-900'
                              : 'bg-muted border-border text-muted-foreground'
                          }`}
                        >
                          {wrathRoll === 6 ? '⚡' : wrathRoll === 1 ? '☠' : wrathRoll}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Special Results */}
                  {(roll.result.glory || roll.result.complication || roll.result.shift > 0) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {roll.result.glory && (
                        <div className="text-xs px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-purple-700 font-medium">
                          ⚡ Glory!
                        </div>
                      )}
                      {roll.result.complication && (
                        <div className="text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-700 font-medium">
                          ☠ Complication
                        </div>
                      )}
                      {roll.result.shift > 0 && (
                        <div className="text-xs px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-700 font-medium">
                          +{roll.result.shift} Shift
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Export a hook to trigger rolls from outside
export function useSkillRoll() {
  return {
    rollSkill: (skill: SkillName) => {
      // This will be handled by the parent component
      console.log('Rolling', skill);
    }
  };
}
