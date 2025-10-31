// app/types/character.ts

import type { Property } from './property-system';

/**
 * CHARACTER - The root of the property tree
 * A character is essentially a collection of properties
 */
export interface Character {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  
  // The root property that contains everything
  rootPropertyId: string;
  
  // Flat map of all properties for fast lookup
  // Key = property.id, Value = property
  properties: Record<string, Property>;
  
  // Metadata
  system: 'wrath-and-glory';
  version: string;
}

/**
 * Helper to create a new empty character
 */
export function createEmptyCharacter(name: string = 'New Character'): Character {
  const now = new Date();
  const rootId = 'root';
  
  return {
    id: crypto.randomUUID(),
    name,
    created: now,
    updated: now,
    rootPropertyId: rootId,
    properties: {
      [rootId]: {
        id: rootId,
        type: 'folder',
        name: 'Character Root',
        parent: undefined,
        children: [],
        order: 0,
        tags: ['root'],
        enabled: true,
      }
    },
    system: 'wrath-and-glory',
    version: '1.0.0'
  };
}