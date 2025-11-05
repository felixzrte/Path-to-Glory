/**
 * CHARACTER - The player's character sheet
 * A character is essentially a collection of properties in a tree structure
 * 
 * Characters are Entities (share attributes/skills system with Bestiary)
 * but have additional player-specific features like XP tracking.
 */

import type { Entity } from './entity';
import type { Property } from './property-system';

export interface Character extends Omit<Entity, 'type'> {
  type: 'character';
  
  // Player-specific fields
  player?: string;
  archetype?: string;        // Archetype ID (if using standard creation)
  
  // XP tracking (only for player characters)
  xpTotal: number;           // Total XP earned
  xpSpent: number;           // XP spent on character
  xpAvailable: number;       // Remaining XP
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create an empty character with default structure
 */
export function createEmptyCharacter(name: string, tier: number = 1): Character {
  const rootId = 'root';
  
  return {
    id: crypto.randomUUID(),
    name,
    type: 'character',
    keywords: [],
    tier,
    xpTotal: getTierXP(tier),
    xpSpent: 0,
    xpAvailable: getTierXP(tier),
    properties: {
      [rootId]: {
        id: rootId,
        type: 'folder',
        name: 'Character',
        parent: undefined,
        children: [],
        order: 0,
        tags: ['root'],
        enabled: true,
      }
    },
    rootPropertyId: rootId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get starting XP for a tier
 */
function getTierXP(tier: number): number {
  switch (tier) {
    case 1: return 100;
    case 2: return 200;
    case 3: return 300;
    case 4: return 400;
    default: return 100;
  }
}

/**
 * Add a property to a character
 */
export function addProperty(
  character: Character, 
  property: Property, 
  parentId?: string
): Character {
  const parent = parentId || character.rootPropertyId;
  const parentProp = character.properties[parent];
  
  if (!parentProp) {
    throw new Error(`Parent property ${parent} not found`);
  }
  
  // Add to properties map
  const updatedProperties = {
    ...character.properties,
    [property.id]: { ...property, parent },
  };
  
  // Add to parent's children
  updatedProperties[parent] = {
    ...parentProp,
    children: [...(parentProp.children || []), property.id],
  };
  
  return {
    ...character,
    properties: updatedProperties,
    updatedAt: new Date(),
  };
}

/**
 * Remove a property from a character
 */
export function removeProperty(
  character: Character,
  propertyId: string
): Character {
  const property = character.properties[propertyId];
  
  if (!property || !property.parent) {
    throw new Error(`Cannot remove property ${propertyId}`);
  }
  
  const updatedProperties = { ...character.properties };
  
  // Remove from parent's children
  const parent = updatedProperties[property.parent];
  parent.children = (parent.children || []).filter(id => id !== propertyId);
  
  // Remove property and all its children recursively
  function removeRecursive(id: string) {
    const prop = updatedProperties[id];
    if (prop) {
      if (prop.children && prop.children.length > 0) {
        prop.children.forEach(removeRecursive);
      }
      delete updatedProperties[id];
    }
  }
  
  removeRecursive(propertyId);
  
  return {
    ...character,
    properties: updatedProperties,
    updatedAt: new Date(),
  };
}
