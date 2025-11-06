import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CharacterSettingsProps {
  onComplete: (settings: CharacterCreationSettings) => void;
}

export interface CharacterCreationSettings {
  characterName: string;
  additionalXP: number;
  rank: number;
  tier: number;
  settingDescription: string;
  enabledSources: string[];
  creationMode: 'regular' | 'advanced';
}

const AVAILABLE_SOURCES = [
  'Core Rulebook',
  'Forsaken System',
  'Church and Empire',
  'Redacted Records',
  'Litanies of the Lost',
  'Vow of Silence',
];

export function CharacterSettings({ onComplete }: CharacterSettingsProps) {
  const [characterName, setCharacterName] = useState('');
  const [additionalXP, setAdditionalXP] = useState(0);
  const [rank, setRank] = useState(1);
  const [tier, setTier] = useState(1);
  const [settingDescription, setSettingDescription] = useState('');
  const [enabledSources, setEnabledSources] = useState<string[]>(['Core Rulebook']);
  const [creationMode, setCreationMode] = useState<'regular' | 'advanced' | null>(null);

  const toggleSource = (source: string) => {
    if (source === 'Core Rulebook') return; // Core is always required
    
    if (enabledSources.includes(source)) {
      setEnabledSources(enabledSources.filter(s => s !== source));
    } else {
      setEnabledSources([...enabledSources, source]);
    }
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

  const totalXP = getTierXP(tier) + additionalXP + (creationMode === 'advanced' ? tier * 10 : 0);

  const handleComplete = () => {
    if (!creationMode) return;
    
    onComplete({
      characterName,
      additionalXP,
      rank,
      tier,
      settingDescription,
      enabledSources,
      creationMode,
    });
  };

  const canProceed = creationMode !== null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Character Settings</CardTitle>
          <CardDescription>Configure your character creation options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Character Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Character</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Character Name</label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Enter your character's name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Additional XP</label>
                  <input
                    type="number"
                    value={additionalXP}
                    onChange={(e) => setAdditionalXP(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rank</label>
                  <input
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Framework Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Framework</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tier</label>
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((t) => (
                    <Button
                      key={t}
                      variant={tier === t ? 'default' : 'outline'}
                      onClick={() => setTier(t)}
                      className="flex flex-col h-auto py-3"
                    >
                      <span className="text-lg font-bold">Tier {t}</span>
                      <span className="text-xs">{getTierXP(t)} XP</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Setting Description</label>
                <textarea
                  value={settingDescription}
                  onChange={(e) => setSettingDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary min-h-[100px]"
                  placeholder="Describe your setting or campaign..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Choose Sources of Data</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_SOURCES.map((source) => {
                    const isEnabled = enabledSources.includes(source);
                    const isCore = source === 'Core Rulebook';
                    
                    return (
                      <button
                        key={source}
                        onClick={() => toggleSource(source)}
                        disabled={isCore}
                        className={`px-4 py-3 rounded-lg border-2 text-left transition-colors ${
                          isEnabled
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        } ${isCore ? 'opacity-100 cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{source}</span>
                          {isCore && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Creation Mode Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Character Creation Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Regular Character Creation */}
              <Card
                className={`cursor-pointer transition-all ${
                  creationMode === 'regular'
                    ? 'border-primary ring-2 ring-primary'
                    : 'hover:border-primary'
                }`}
                onClick={() => setCreationMode('regular')}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Regular Character Creation</CardTitle>
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
                      <span>Includes archetype ability</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Character Creation */}
              <Card
                className={`cursor-pointer transition-all ${
                  creationMode === 'advanced'
                    ? 'border-primary ring-2 ring-primary'
                    : 'hover:border-primary'
                }`}
                onClick={() => setCreationMode('advanced')}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Character Creation</CardTitle>
                  <CardDescription>Full customization control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Choose species independently</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Optional archetype selection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Customize all keywords</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>+{tier * 10} bonus XP (no archetype ability)</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline">For experienced players</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {creationMode === 'advanced' && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Advanced Character Creation:</strong> You receive bonus XP equal to Tier × 10 ({tier * 10} XP).
                  You do not receive an Archetype Ability by default, but your GM may allow you to purchase one
                  for Archetype Tier × 10 XP.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* XP Summary */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Total Starting XP</div>
                <div className="text-2xl font-bold text-primary">
                  {totalXP} XP
                </div>
              </div>
              <div className="text-sm text-right space-y-1">
                <div>Base (Tier {tier}): {getTierXP(tier)} XP</div>
                {additionalXP > 0 && <div>Additional: +{additionalXP} XP</div>}
                {creationMode === 'advanced' && <div>Advanced Mode: +{tier * 10} XP</div>}
              </div>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={!canProceed}
            className="w-full"
            size="lg"
          >
            Begin Character Creation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
