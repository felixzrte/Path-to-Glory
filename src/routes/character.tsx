import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import type { Character } from '@/types/character';
import { CharacterCreator } from '@/components/character/CharacterCreator';
import { CharacterSheet } from '@/components/character/CharacterSheet';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/character')({
  component: CharacterPage,
});

const STORAGE_KEY = 'path-to-glory-character';

function CharacterPage() {
  const [character, setCharacter] = useState<Character | null>(null);

  // Load character from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCharacter(parsed);
      } catch (e) {
        console.error('Failed to load character:', e);
      }
    }
  }, []);

  const handleCharacterCreated = (newCharacter: Character) => {
    setCharacter(newCharacter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCharacter));
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCharacter));
  };

  const handleNewCharacter = () => {
    if (confirm('Are you sure? This will delete your current character.')) {
      localStorage.removeItem(STORAGE_KEY);
      setCharacter(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {!character ? (
          <CharacterCreator onCharacterCreated={handleCharacterCreated} />
        ) : (
          <div className="space-y-6">
            <CharacterSheet
              character={character}
              onCharacterUpdate={handleCharacterUpdate}
            />
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleNewCharacter}
              >
                Create New Character
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${character.name}.json`;
                  a.click();
                }}
              >
                Export Character
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
