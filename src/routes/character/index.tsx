import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { Character } from '@/types/character';
import { CharacterSettings, type CharacterCreationSettings } from '@/components/character/CharacterSettings';
import { CharacterCreator } from '@/components/character/CharacterCreator';

export const Route = createFileRoute('/character/')({
  component: CharacterPage,
});

const STORAGE_PREFIX = 'path-to-glory-character-';

type PageState = 'settings' | 'creation';

function CharacterPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('settings');
  const [settings, setSettings] = useState<CharacterCreationSettings | null>(null);

  const handleSettingsComplete = (newSettings: CharacterCreationSettings) => {
    setSettings(newSettings);
    setPageState('creation');
  };

  const handleCharacterCreated = (newCharacter: Character) => {
    localStorage.setItem(`${STORAGE_PREFIX}${newCharacter.id}`, JSON.stringify(newCharacter));
    navigate({ to: '/character/$characterId', params: { characterId: newCharacter.id } });
  };

  const handleBackToSettings = () => {
    setSettings(null);
    setPageState('settings');
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {pageState === 'settings' && (
          <CharacterSettings onComplete={handleSettingsComplete} />
        )}
        
        {pageState === 'creation' && settings && (
          <CharacterCreator 
            settings={settings}
            onCharacterCreated={handleCharacterCreated}
            onBack={handleBackToSettings}
          />
        )}
      </div>
    </div>
  );
}
