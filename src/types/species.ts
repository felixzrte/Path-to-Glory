/**
 * SPECIES - Playable species in Wrath & Glory
 * A Species is a template that adds properties to a character
 */

import type { Property } from './property-system';
import type { Keyword } from './keywords';

/**
 * Species definition
 * When you select a species, all its properties get added to your character
 */
export interface Species {
  id: string;
  name: string;
  
  // Cost
  xpCost: number;            // XP cost to select this species
  
  // Base stats (for Archetype creation)
  baseAttributes?: {
    strength?: number;
    toughness?: number;
    agility?: number;
    initiative?: number;
    willpower?: number;
    intellect?: number;
    fellowship?: number;
  };
  
  baseSkills?: {
    [skillName: string]: number;  // Skill ranks
  };
  
  // Attribute maximums (species caps)
  attributeMaximums: {
    strength: number;
    toughness: number;
    agility: number;
    initiative: number;
    willpower: number;
    intellect: number;
    fellowship: number;
  };
  
  // Properties that get added when you select this species
  properties: Property[];
  
  // Metadata
  speed: number;             // Movement speed
  size: 'tiny' | 'small' | 'average' | 'large' | 'huge';
  keywords: Keyword[];       // Faction/species keywords
  
  // Fluff
  description: string;
  commonNames?: string[];
  
  // Source
  source: {
    book: string;
    page: number;
  };
}

/**
 * Helper to create species properties
 */
export function createSpeciesProperties(species: Species): Property[] {
  const properties: Property[] = [];
  
  // Create folder for the species
  const speciesFolderId = `species-${species.id}`;
  properties.push({
    id: speciesFolderId,
    type: 'folder',
    name: species.name,
    parent: undefined, // Will be set when added to character
    children: [],
    order: 0,
    tags: ['species'],
    enabled: true,
    description: species.description,
    source: `${species.source.book} p.${species.source.page}`,
  });
  
  // Add base attributes as bonuses (if provided)
  if (species.baseAttributes) {
    let order = 1;
    for (const [attr, value] of Object.entries(species.baseAttributes)) {
      if (value && value > 0) {
        properties.push({
          id: `${speciesFolderId}-attr-${attr}`,
          type: 'bonus',
          name: `${species.name} ${attr}`,
          parent: speciesFolderId,
          children: [],
          order: order++,
          tags: ['species', 'attribute'],
          enabled: true,
          target: attr,
          amount: value,
          description: `Base ${attr} from ${species.name} species`,
        });
      }
    }
  }
  
  // Add base skills as bonuses (if provided)
  if (species.baseSkills) {
    let order = 100;
    for (const [skill, ranks] of Object.entries(species.baseSkills)) {
      if (ranks > 0) {
        properties.push({
          id: `${speciesFolderId}-skill-${skill}`,
          type: 'bonus',
          name: `${species.name} ${skill}`,
          parent: speciesFolderId,
          children: [],
          order: order++,
          tags: ['species', 'skill'],
          enabled: true,
          target: skill,
          amount: ranks,
          description: `Base ${skill} from ${species.name} species`,
        });
      }
    }
  }
  
  // Add speed as constant
  properties.push({
    id: `${speciesFolderId}-speed`,
    type: 'constant',
    name: 'Speed',
    parent: speciesFolderId,
    children: [],
    order: 200,
    tags: ['species', 'movement'],
    enabled: true,
    value: species.speed,
    description: `Movement speed from ${species.name} species`,
  });
  
  // Add custom properties from the species definition
  properties.push(...species.properties.map(prop => ({
    ...prop,
    parent: speciesFolderId,
  })));
  
  // Update children references
  const folderChildren = properties
    .filter(p => p.parent === speciesFolderId)
    .map(p => p.id);
  
  properties[0].children = folderChildren;
  
  return properties;
}
