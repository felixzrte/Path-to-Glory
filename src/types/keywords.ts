/**
 * Keyword Type Definitions
 * 
 * Keywords are a fundamental mechanic in Wrath & Glory that:
 * - Define faction allegiances
 * - Grant special abilities (PSYKER)
 * - Categorize equipment
 * - Enable targeting/conditions for abilities
 * 
 * Data: See src/data/keywords.ts
 * Logic: See src/lib/keywords.ts
 */

// ============================================================================
// Keyword Type Categories
// ============================================================================

/**
 * Special Keywords with unique game mechanics
 */
export type SpecialKeyword = 
  | 'ANY'      // Can be replaced with any other keyword
  | 'PSYKER';  // Grants psychic abilities, can learn powers

/**
 * Faction Keywords - Define allegiances and organizations
 */
export type FactionKeyword = 
  // Imperial Factions
  | 'ABHUMAN'
  | 'ADEPTA SORORITAS'
  | 'ADEPTUS ADMINISTRATUM'
  | 'ADEPTUS ASTARTES'
  | 'ADEPTUS ASTRA TELEPATHICA'
  | 'ADEPTUS MECHANICUS'
  | 'ADEPTUS MINISTORUM'
  | 'AERONAUTICA IMPERIALIS'
  | 'ASTRA CARTOGRAPHICA'
  | 'ASTRA MILITARUM'
  | 'IMPERIUM'
  | 'INQUISITION'
  | 'MILITARUM AUXILLA'
  | 'MILITARUM TEMPESTUS'
  | 'NAVIS IMPERIALIS'
  | 'NAVIS NOBILITE'
  | 'OFFICIO ASSASSINORUM'
  | 'OFFICIO PREFECTUS'
  | 'QUESTOR MECHANICUS'
  | 'ROGUE TRADER'
  | 'SCHOLASTIA PSYKANA'
  | 'SCUM'
  | 'SERVITOR'
  | 'SKITARII'
  
  // Aeldari Factions
  | 'AELDARI'
  | 'ANHRATHE'
  | 'ASPECT WARRIOR'
  | 'ASURYANI'
  | 'DRUKHARI'
  | 'HARLEQUIN'
  | 'WRAITH CONSTRUCT'
  | 'YNNARI'
  
  // Chaos Factions
  | 'CHAOS'
  | 'DAEMON'
  | 'DARK MECHANICUM'
  | 'HERETIC'
  | 'KHORNE'
  | 'NURGLE'
  | 'SLAANESH'
  | 'TZEENTCH'
  
  // Xenos Factions
  | 'BEAST'
  | 'GENESTEALER CULT'
  | 'JOKAERO'
  | 'KROOT'
  | 'MUTANT'
  | 'NECRON'
  | 'ORK'
  | 'T\'AU'
  | 'TYRANID'
  
  // Special Status
  | 'PRIMARIS';

/**
 * Bracketed Keywords - Represent sub-faction choices
 * These are template keywords that get replaced with specific values
 */
export type BracketedKeywordType = 
  | '[CHAPTER]'           // Space Marine Chapter (e.g., ULTRAMARINES, BLOOD ANGELS)
  | '[CLAN]'              // Ork Clan (e.g., GOFFS, BAD MOONS)
  | '[COTERIE]'           // Aeldari Corsair band
  | '[CRAFTWORLD]'        // Asuryani Craftworld (e.g., ULTHWE, BIEL-TAN)
  | '[DYNASTY]'           // Rogue Trader Dynasty
  | '[FORGE WORLD]'       // Mechanicus Forge World (e.g., MARS, RYZA)
  | '[HAEMONCULUS COVEN]' // Drukhari Haemonculus group
  | '[KABAL]'             // Drukhari Kabal (e.g., BLACK HEART)
  | '[LEGION]'            // Chaos Legion (e.g., BLACK LEGION, DEATH GUARD)
  | '[MARK OF CHAOS]'     // Chaos God allegiance
  | '[ORDER]'             // Adepta Sororitas Order
  | '[ORDO]'              // Inquisition Ordo (e.g., XENOS, HERETICUS, MALLEUS)
  | '[REGIMENT]'          // Astra Militarum Regiment (e.g., CADIAN, CATACHAN)
  | '[WYCH CULT]';        // Drukhari gladiator cult

/**
 * Wargear Keywords - Categorize equipment and weapons
 */
export type WargearKeyword = 
  // Weapon Properties
  | '2-HANDED'
  | 'ARC'
  | 'BLADE'
  | 'BOLT'
  | 'CHAIN'
  | 'EXOTIC'
  | 'EXPLOSIVE'
  | 'FIRE'
  | 'FORCE'
  | 'HEAVY'
  | 'LAS'
  | 'LIGHT'
  | 'MELTA'
  | 'NEEDLE'
  | 'PLASMA'
  | 'POWER FIELD'
  | 'PRIMITIVE'
  | 'PROJECTILE'
  | 'SHURIKEN'
  
  // Armour Properties
  | 'FLAK'
  | 'POWERED';

/**
 * Psychic Power Keywords - Categorize psychic abilities
 */
export type PsychicKeyword = 
  | 'PSYCHIC'      // Base keyword for all powers
  | 'AELDARI'      // Aeldari-specific powers
  | 'CHAOS'        // Chaos-specific powers
  | 'AUDITORY'     // Creates sound
  | 'FIRE'         // Manipulates heat/flame
  | 'KINETIC'      // Manifests kinetic force
  | 'LIGHT'        // Produces light
  | 'TELEPATHY';   // Mental powers

/**
 * All possible keyword types
 */
export type Keyword = 
  | SpecialKeyword 
  | FactionKeyword 
  | BracketedKeywordType 
  | WargearKeyword 
  | PsychicKeyword
  | string; // Allow custom keywords for user-created content

// ============================================================================
// Keyword Data Structures
// ============================================================================

/**
 * Represents a bracketed keyword with its chosen value
 */
export interface BracketedKeyword {
  type: BracketedKeywordType;
  value: string; // The specific choice (e.g., "ULTRAMARINES" for [CHAPTER])
  description?: string;
}

/**
 * Keyword with optional metadata
 */
export interface KeywordData {
  keyword: Keyword;
  source?: string; // Where this keyword comes from (species, archetype, talent, etc.)
  description?: string;
  grantedAbilities?: string[]; // IDs of properties this keyword grants
  restrictions?: string[]; // Any restrictions or requirements
}

/**
 * Keyword condition for targeting abilities/effects
 */
export interface KeywordCondition {
  type: 'has' | 'lacks' | 'any' | 'all';
  keywords: Keyword[];
  operator?: 'AND' | 'OR';
}

// ============================================================================
// Keyword Definitions & Descriptions
// ============================================================================

export interface KeywordDefinition {
  keyword: Keyword;
  category: 'special' | 'faction' | 'bracketed' | 'wargear' | 'psychic';
  name: string;
  description: string;
  gameEffect?: string;
  examples?: string[];
}

