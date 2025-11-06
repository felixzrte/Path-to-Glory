import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import type { Character } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Trash2, Eye, Plus } from 'lucide-react';

export const Route = createFileRoute('/characters')({
  component: CharactersPage,
});

const STORAGE_PREFIX = 'path-to-glory-character-';

function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const loadedCharacters: Character[] = [];
    
    const singleChar = localStorage.getItem('path-to-glory-character');
    if (singleChar) {
      try {
        const parsed = JSON.parse(singleChar);
        loadedCharacters.push(parsed);
        localStorage.setItem(`${STORAGE_PREFIX}${parsed.id}`, singleChar);
        localStorage.removeItem('path-to-glory-character');
      } catch (e) {
        console.error('Failed to load character:', e);
      }
    }
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          const char = JSON.parse(localStorage.getItem(key)!);
          if (!loadedCharacters.find(c => c.id === char.id)) {
            loadedCharacters.push(char);
          }
        } catch (e) {
          console.error('Failed to load character:', e);
        }
      }
    }
    
    loadedCharacters.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    setCharacters(loadedCharacters);
  }, []);

  const deleteCharacter = (id: string) => {
    if (confirm('Are you sure you want to delete this character? This cannot be undone.')) {
      localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
      setCharacters(characters.filter(c => c.id !== id));
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">My Characters</h1>
              <p className="text-muted-foreground mt-2">
                Manage your Wrath & Glory characters
              </p>
            </div>
            <Link to="/character">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Character
              </Button>
            </Link>
          </div>
        </div>

        {characters.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center space-y-4">
              <div className="text-6xl">⚔️</div>
              <div>
                <h3 className="text-xl font-semibold">No Characters Yet</h3>
                <p className="text-muted-foreground mt-2">
                  Create your first character to begin your journey in the grim darkness of the far future.
                </p>
              </div>
              <Link to="/character">
                <Button size="lg" className="mt-4">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Character
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => (
              <Card key={char.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{char.name}</CardTitle>
                      <CardDescription className="mt-1">
                        Tier {char.tier} • {char.species}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {char.xpAvailable}
                      </div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {char.keywords.slice(0, 3).map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                    {char.keywords.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{char.keywords.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>XP Spent:</span>
                      <span className="font-medium">{char.xpSpent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Properties:</span>
                      <span className="font-medium">
                        {Object.keys(char.properties).length - 1}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Updated {new Date(char.updatedAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link 
                      to="/character/$characterId" 
                      params={{ characterId: char.id }}
                      className="flex-1"
                    >
                      <Button
                        variant="default"
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteCharacter(char.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
