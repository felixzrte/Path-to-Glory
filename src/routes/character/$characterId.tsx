import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import type { Character } from '@/types/character';
import { CharacterSheet, type RollResult } from '@/components/character/CharacterSheet';
import { DiceLogSidebar } from '@/components/character/dice-log-sidebar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ArrowLeft, Download, Plus, Dices } from 'lucide-react';

export const Route = createFileRoute('/character/$characterId')({
  component: CharacterViewPage,
});

const STORAGE_PREFIX = 'path-to-glory-character-';

function CharacterViewPage() {
  const { characterId } = Route.useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [isDiceLogOpen, setIsDiceLogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${characterId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCharacter(parsed);
      } catch (e) {
        console.error('Failed to load character:', e);
      }
    }
  }, [characterId]);

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
    localStorage.setItem(`${STORAGE_PREFIX}${updatedCharacter.id}`, JSON.stringify(updatedCharacter));
  };

  const handleClearHistory = () => {
    setRollHistory([]);
  };

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">Character Not Found</h1>
          <p className="text-muted-foreground">
            The character you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate({ to: '/characters' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Characters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-none border-b bg-background">
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/characters' })}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Characters
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDiceLogOpen(!isDiceLogOpen)}
              className="relative"
            >
              <Dices className="h-4 w-4 mr-2" />
              Dice Log
              {rollHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {rollHistory.length}
                </span>
              )}
            </Button>
            <Link to="/character">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Character
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${character.name}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="w-full max-w-[1920px] mx-auto">
          <CharacterSheet
            character={character}
            onCharacterUpdate={handleCharacterUpdate}
            rollHistory={rollHistory}
            onRollHistoryUpdate={setRollHistory}
          />
        </div>
      </div>

      <DiceLogSidebar
        isOpen={isDiceLogOpen}
        onClose={() => setIsDiceLogOpen(false)}
        rollHistory={rollHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
