/**
 * KEYWORDS DATA - Official Wrath & Glory keywords
 * Source: Core Rulebook p.375-379
 */

import type { KeywordDefinition } from '@/types/keywords';

/**
 * Database of official keyword definitions
 */
export const KEYWORD_DEFINITIONS = {
  // ============================================================================
  // SPECIAL KEYWORDS
  // ============================================================================
  
  'ANY': {
    keyword: 'ANY',
    category: 'special',
    name: '[ANY]',
    description: 'This Keyword can be replaced with any other Keyword of your choice. In almost all circumstances it makes the most sense to select a Faction Keyword.',
    gameEffect: 'Discuss your choice with your GM and the group to ensure it makes sense for the narrative of your game.',
    examples: [
      // Common Imperium factions
      'IMPERIUM',
      'ADEPTUS MECHANICUS',
      'ASTRA MILITARUM',
      'INQUISITION',
      'ROGUE TRADER',
      'ADEPTUS ARBITES',
      'ECCLESIARCHY',
      'OFFICIO ASSASSINORUM',
      // Chaos
      'CHAOS',
      'HERETIC ASTARTES',
      // Xenos
      'AELDARI',
      'DRUKHARI',
      'ORK',
      'T\'AU EMPIRE',
      // Other
      'SCUM',
      'MUTANT',
      'CRIMINAL',
      'MERCENARY',
      'PIRATE',
      'OUTCAST'
    ]
  },
  
  'PSYKER': {
    keyword: 'PSYKER',
    category: 'special',
    name: 'PSYKER',
    description: 'You are a Psyker, capable of channeling the raw energies of the Warp.',
    gameEffect: 'Know the Universal Psyker Abilities (p.267). Can spend XP to learn psychic powers. Can spend XP to improve your Psychic Mastery Skill.',
    examples: ['Becoming a Psyker will dramatically change your character, making them a powerful, feared, and potentially illegal citizen of the Imperium.']
  },
  
  // ============================================================================
  // FACTION KEYWORDS
  // ============================================================================
  
  'ABHUMAN': {
    keyword: 'ABHUMAN',
    category: 'faction',
    name: 'ABHUMAN',
    description: 'Some mutated strains of Humanity, such as the muscular, oversized, impeccably loyal Ogryns, are allowed citizenship in parts of the Imperium due to their usefulness.',
    gameEffect: 'Mutated strain of Humanity recognized by the Imperium.'
  },
  
  'ADEPTA SORORITAS': {
    keyword: 'ADEPTA SORORITAS',
    category: 'faction',
    name: 'ADEPTA SORORITAS',
    description: 'A sect of righteous warrior-monks that form the army of the Adeptus Ministorum, waging Wars of Faith to see the God-Emperor\'s will done.',
    gameEffect: 'Access to Acts of Faith and Adepta Sororitas equipment.'
  },
  
  'ADEPTUS ADMINISTRATUM': {
    keyword: 'ADEPTUS ADMINISTRATUM',
    category: 'faction',
    name: 'ADEPTUS ADMINISTRATUM',
    description: 'The colossal bureaucratic organisation that governs the Imperium. They keep the records, levy the tithes, assemble the munitions, and fulfill a numberless host of other clerical duties.',
    gameEffect: 'Access to Imperial bureaucratic resources and records.'
  },
  
  'ADEPTUS ASTARTES': {
    keyword: 'ADEPTUS ASTARTES',
    category: 'faction',
    name: 'ADEPTUS ASTARTES',
    description: 'The Space Marines: genetically enhanced transhuman super soldiers who know no fear.',
    gameEffect: 'Grants access to Space Marine equipment and abilities.'
  },
  
  'ADEPTUS ASTRA TELEPATHICA': {
    keyword: 'ADEPTUS ASTRA TELEPATHICA',
    category: 'faction',
    name: 'ADEPTUS ASTRA TELEPATHICA',
    description: 'The organisation responsible for recruiting and training Psykers for the Imperium.',
    gameEffect: 'Access to psychic training and sanctioning.'
  },
  
  'ADEPTUS MECHANICUS': {
    keyword: 'ADEPTUS MECHANICUS',
    category: 'faction',
    name: 'ADEPTUS MECHANICUS',
    description: 'Adherents to the Cult Mechanicus, the Mars-based cult of the machine that supply the Imperium with its advanced technology and guard the sacred knowledge of its workings.',
    gameEffect: 'Access to advanced technology and augmetics.'
  },
  
  'ADEPTUS MINISTORUM': {
    keyword: 'ADEPTUS MINISTORUM',
    category: 'faction',
    name: 'ADEPTUS MINISTORUM',
    description: 'The state church of the Imperium that propagates and maintains the worship of the God-Emperor to unite His people.',
    gameEffect: 'Religious authority and Imperial faith resources.'
  },
  
  'AELDARI': {
    keyword: 'AELDARI',
    category: 'faction',
    name: 'AELDARI',
    description: 'An ancient xenos Species whose declining empire once spanned the galaxy. They are naturally psychic, long lived, and old enemies of the Imperium.',
    gameEffect: 'Natural psychic aptitude and ancient technology access.'
  },
  
  'AERONAUTICA IMPERIALIS': {
    keyword: 'AERONAUTICA IMPERIALIS',
    category: 'faction',
    name: 'AERONAUTICA IMPERIALIS',
    description: 'Part of the Navis Imperialis, responsible for Imperial in-atmosphere aviation.',
    gameEffect: 'Access to aircraft and aerial combat capabilities.'
  },
  
  'ANHRATHE': {
    keyword: 'ANHRATHE',
    category: 'faction',
    name: 'ANHRATHE',
    description: 'The Aeldari name for the Corsairs, the piratical outcasts that form Coteries.',
    gameEffect: 'Independent Aeldari pirates, not bound to Craftworld traditions.'
  },
  
  'ASPECT WARRIOR': {
    keyword: 'ASPECT WARRIOR',
    category: 'faction',
    name: 'ASPECT WARRIOR',
    description: 'Asuryani that follow the Path of the Warrior devote themselves to a specific aspect of Khaine, the Aeldari God of War.',
    gameEffect: 'Specialized Aeldari warrior training and abilities.'
  },
  
  'ASTRA CARTOGRAPHICA': {
    keyword: 'ASTRA CARTOGRAPHICA',
    category: 'faction',
    name: 'ASTRA CARTOGRAPHICA',
    description: 'A sub-faction of the Administratum, tasked with mapping the vast expanse of the galaxy.',
    gameEffect: 'Access to stellar cartography and exploration data.'
  },
  
  'ASTRA MILITARUM': {
    keyword: 'ASTRA MILITARUM',
    category: 'faction',
    name: 'ASTRA MILITARUM',
    description: 'The largest military force of the Imperium, numbering billions of mortal Humans.',
    gameEffect: 'Access to Imperial Guard equipment and regimental traditions.'
  },
  
  'ASURYANI': {
    keyword: 'ASURYANI',
    category: 'faction',
    name: 'ASURYANI',
    description: 'The Aeldari name for the citizens that live disciplined lives on Craftworlds.',
    gameEffect: 'Follow the Path system, access to Craftworld resources.'
  },
  
  'BEAST': {
    keyword: 'BEAST',
    category: 'faction',
    name: 'BEAST',
    description: 'Unintelligent creatures that do not possess the self-awareness and high intelligence of Humans.',
    gameEffect: 'Animal-level intelligence, cannot use complex equipment.'
  },
  
  'CHAOS': {
    keyword: 'CHAOS',
    category: 'faction',
    name: 'CHAOS',
    description: 'The forces and worshippers of the Chaos Gods.',
    gameEffect: 'Access to Chaos powers and corrupted abilities.'
  },
  
  'DAEMON': {
    keyword: 'DAEMON',
    category: 'faction',
    name: 'DAEMON',
    description: 'The twisted creatures native to the Immaterium are named daemons and are believed to be made of Warp energy.',
    gameEffect: 'Warp entity, immune to mundane weapons, unstable in realspace.'
  },
  
  'DARK MECHANICUM': {
    keyword: 'DARK MECHANICUM',
    category: 'faction',
    name: 'DARK MECHANICUM',
    description: 'Traitors and renegades formerly of the Cult Mechanicus, those of the Dark Mechanicum commit the sins of worshipping Chaos, abusing forbidden technologies, and practicing innovation, including the abject horrors of daemon-infused tech.',
    gameEffect: 'Access to forbidden technology and daemon engines.'
  },
  
  'DRUKHARI': {
    keyword: 'DRUKHARI',
    category: 'faction',
    name: 'DRUKHARI',
    description: 'Cruel and depraved, the "Dark Eldar" are Aeldari who have succumbed utterly to their Species\' bottomless hedonism. Since the fall of the Aeldari, they have lived in the foul Webway metropolis Commorragh, subsisting their twisted souls on the psychic emanations of the suffering of their many slaves.',
    gameEffect: 'Feed on suffering, use advanced torture technology.'
  },
  
  'GENESTEALER CULT': {
    keyword: 'GENESTEALER CULT',
    category: 'faction',
    name: 'GENESTEALER CULT',
    description: 'The Genestealer life cycle infects other creatures, warping their minds and bodies to serve the grotesque Tyranid as it grows in power and plans total insurrection.',
    gameEffect: 'Hybrid capabilities, brood mind connection.'
  },
  
  'HARLEQUIN': {
    keyword: 'HARLEQUIN',
    category: 'faction',
    name: 'HARLEQUIN',
    description: 'The inscrutable worshipers of the Laughing God Cegorach, the Harlequins are Aeldari that tour the galaxy in troupes, mounting theatrical reenactments of Aeldari history and intervening in combats with deadly efficiency.',
    gameEffect: 'Acrobatic combat, access to Black Library.'
  },
  
  'HERETIC': {
    keyword: 'HERETIC',
    category: 'faction',
    name: 'HERETIC',
    description: 'Those that have sinned, blasphemed, or turned traitorously from the light of the Emperor are known as heretics.',
    gameEffect: 'Traitor to the Imperium, hunted by the Inquisition.'
  },
  
  'IMPERIUM': {
    keyword: 'IMPERIUM',
    category: 'faction',
    name: 'IMPERIUM',
    description: 'The vast interstellar empire of Humanity that spans over a million worlds, led by the Emperor from Holy Terra.',
    gameEffect: 'Identifies you as a loyal servant of the Imperium.'
  },
  
  'INQUISITION': {
    keyword: 'INQUISITION',
    category: 'faction',
    name: 'INQUISITION',
    description: 'A clandestine organisation given absolute power to battle the greatest threats to the Imperium: heresy, xenos, and daemons.',
    gameEffect: 'Absolute authority, access to Inquisitorial resources.'
  },
  
  'JOKAERO': {
    keyword: 'JOKAERO',
    category: 'faction',
    name: 'JOKAERO',
    description: 'A simian-like xenos Species with an incredible innate understanding of technology.',
    gameEffect: 'Instinctive technology manipulation and creation.'
  },
  
  'KHORNE': {
    keyword: 'KHORNE',
    category: 'faction',
    name: 'KHORNE',
    description: 'One of the Ruinous Powers, the Blood God\'s domains are acts of violence, murder, and brutality.',
    gameEffect: 'Enhanced combat abilities, hatred of psykers.'
  },
  
  'KROOT': {
    keyword: 'KROOT',
    category: 'faction',
    name: 'KROOT',
    description: 'A mercenary xenos Species with the ability to control their evolution through the consumption of other lifeforms.',
    gameEffect: 'Evolutionary adaptation through consumption.'
  },
  
  'MILITARUM AUXILLA': {
    keyword: 'MILITARUM AUXILLA',
    category: 'faction',
    name: 'MILITARUM AUXILLA',
    description: 'A division of the Astra Militarum that consists of Abhumans.',
    gameEffect: 'Abhuman auxiliary forces of the Imperial Guard.'
  },
  
  'MILITARUM TEMPESTUS': {
    keyword: 'MILITARUM TEMPESTUS',
    category: 'faction',
    name: 'MILITARUM TEMPESTUS',
    description: 'A division of the Astra Militarum that provides elite special operations soldiers.',
    gameEffect: 'Elite training and special operations capabilities.'
  },
  
  'MUTANT': {
    keyword: 'MUTANT',
    category: 'faction',
    name: 'MUTANT',
    description: 'Humans that have deviated from the pure, Ecclesiarchy-defined form due to the malign influence of the Warp are known as Mutants.',
    gameEffect: 'Feared and persecuted by Imperial society.'
  },
  
  'NAVIS IMPERIALIS': {
    keyword: 'NAVIS IMPERIALIS',
    category: 'faction',
    name: 'NAVIS IMPERIALIS',
    description: 'The Imperial organisation responsible for the operation and application of voidships. The Navis Imperialis, or Imperial Navy, ferry the Astra Militarum from one of a million battles to another, and engage in void combat with the many spacefaring enemies of the Imperium.',
    gameEffect: 'Access to voidships and naval warfare.'
  },
  
  'NAVIS NOBILITE': {
    keyword: 'NAVIS NOBILITE',
    category: 'faction',
    name: 'NAVIS NOBILITE',
    description: 'An ancient extended noble family of sanctioned Human mutants, all possessing the hereditary ability to navigate through the shifting tides of the Warp and guide a voidship through the seas of the Empyrean.',
    gameEffect: 'Warp navigation abilities, Navigator mutation.'
  },
  
  'NECRON': {
    keyword: 'NECRON',
    category: 'faction',
    name: 'NECRON',
    description: 'A prehistoric Species of deathless robotic xenos that are returning to life after a multiple millennia of slumber. The Necrons employ technology beyond any other living Species in their quest to re-conquer the galaxy.',
    gameEffect: 'Advanced technology, living metal bodies, reanimation protocols.'
  },
  
  'NURGLE': {
    keyword: 'NURGLE',
    category: 'faction',
    name: 'NURGLE',
    description: 'One of the Ruinous Powers, the Plague God\'s domains are disease, decay, and entropy.',
    gameEffect: 'Disease immunity, plague abilities.'
  },
  
  'OFFICIO ASSASSINORUM': {
    keyword: 'OFFICIO ASSASSINORUM',
    category: 'faction',
    name: 'OFFICIO ASSASSINORUM',
    description: 'A clandestine Imperial organisation that trains the deadliest assassins available to Humanity.',
    gameEffect: 'Elite assassination training and techniques.'
  },
  
  'OFFICIO PREFECTUS': {
    keyword: 'OFFICIO PREFECTUS',
    category: 'faction',
    name: 'OFFICIO PREFECTUS',
    description: 'The Imperial organisation that recruits and trains Commissars.',
    gameEffect: 'Commissar authority and leadership capabilities.'
  },
  
  'ORK': {
    keyword: 'ORK',
    category: 'faction',
    name: 'ORK',
    description: 'A brutal xenos Species that crave violence and live only for war.',
    gameEffect: 'Natural toughness, gets stronger in groups.'
  },
  
  'PRIMARIS': {
    keyword: 'PRIMARIS',
    category: 'faction',
    name: 'PRIMARIS',
    description: 'A new breed of transhuman Space Marines, more powerful even than their Adeptus Astartes brethren.',
    gameEffect: 'Enhanced capabilities beyond standard Astartes.'
  },
  
  'QUESTOR MECHANICUS': {
    keyword: 'QUESTOR MECHANICUS',
    category: 'faction',
    name: 'QUESTOR MECHANICUS',
    description: 'The robotic combat walkers known as Imperial Knights. Laying ancient claim to the feudal Knight Worlds of the Imperium, a single Knight can turn the tide of a battle using the millennia of combat knowledge passed down through the Throne Mechanicum.',
    gameEffect: 'Pilot Imperial Knight war machines.'
  },
  
  'ROGUE TRADER': {
    keyword: 'ROGUE TRADER',
    category: 'faction',
    name: 'ROGUE TRADER',
    description: 'The Holders of Warrants of Trade, Rogue Traders are empowered to explore, conquer, and trade beyond the borders of the Imperium to expand the Emperor\'s realm.',
    gameEffect: 'Warrant of Trade grants unlimited authority beyond Imperium borders.'
  },
  
  'SCHOLASTIA PSYKANA': {
    keyword: 'SCHOLASTIA PSYKANA',
    category: 'faction',
    name: 'SCHOLASTIA PSYKANA',
    description: 'A division of the Adeptus Astra Telepathica, tasked with examining the Psykers that are brought to Terra by the Black Ships and training them to determine their usefulness to the Imperium.',
    gameEffect: 'Psychic training and examination authority.'
  },
  
  'SCUM': {
    keyword: 'SCUM',
    category: 'faction',
    name: 'SCUM',
    description: 'The dregs of Imperial society operating outside of other Factions, and often the law.',
    gameEffect: 'Underworld connections and criminal resources.'
  },
  
  'SERVITOR': {
    keyword: 'SERVITOR',
    category: 'faction',
    name: 'SERVITOR',
    description: 'AI, or Abominable Intelligence, is a sin to the Cult Mechanicus. Their many technological servants, known as Servitors, are all constructed around biological brains supplemented with holy mechanisms.',
    gameEffect: 'Lobotomized cyborg servant, limited autonomy.'
  },
  
  'SKITARII': {
    keyword: 'SKITARII',
    category: 'faction',
    name: 'SKITARII',
    description: 'The heavily augmented Humans known as Skitarii are the eternally devoted mechanised armies of the Cult Mechanicus.',
    gameEffect: 'Extensive augmentation and technological integration.'
  },
  
  'SLAANESH': {
    keyword: 'SLAANESH',
    category: 'faction',
    name: 'SLAANESH',
    description: 'One of the Ruinous Powers, the Lord of Excess — or to the Aeldari, She Who Thirsts — claims domain over decadence, hedonism, and the pursuit of perfection.',
    gameEffect: 'Enhanced sensory abilities, perfection-seeking bonuses.'
  },
  
  'T\'AU': {
    keyword: 'T\'AU',
    category: 'faction',
    name: 'T\'AU',
    description: 'A young but technologically advanced xenos Species, the T\'au empire is rapidly spreading on the eastern fringes of the galaxy.',
    gameEffect: 'Advanced technology, Greater Good philosophy.'
  },
  
  'TYRANID': {
    keyword: 'TYRANID',
    category: 'faction',
    name: 'TYRANID',
    description: 'An extra-galactic gestalt Species of grotesque xenos solely intent on devouring all other life. Though they appear as multiple adaptive bioforms (including the dreaded Genestealers) they operate as a Hive Mind, deadly and singular in purpose and fighting with disgusting bio-tech weaponry.',
    gameEffect: 'Hive Mind connection, biological weapons and adaptation.'
  },
  
  'TZEENTCH': {
    keyword: 'TZEENTCH',
    category: 'faction',
    name: 'TZEENTCH',
    description: 'One of the Ruinous Powers, the Changer of Ways\' domains are fate, ambition, and sorcery.',
    gameEffect: 'Enhanced psychic abilities, manipulation powers.'
  },
  
  'WRAITH CONSTRUCT': {
    keyword: 'WRAITH CONSTRUCT',
    category: 'faction',
    name: 'WRAITH CONSTRUCT',
    description: 'Every Asuryani carries a Spirit Stone, a device that will capture their soul when they die to protect it from the predations of She Who Thirsts. These Spirit Stones can be attached to wraithbone technology, powering it with the nascent psychic ability of the Aeldari soul.',
    gameEffect: 'Spirit Stone powered artificial body, undead Aeldari.'
  },
  
  'YNNARI': {
    keyword: 'YNNARI',
    category: 'faction',
    name: 'YNNARI',
    description: 'A recently emerging religious sub-faction of the Aeldari, the Ynnari seek to unite the Asuryani, Drukhari, Harlequins, and Outcasts. Their ultimate mission is to awaken Ynnead, the Aeldari God of the Dead, so that they may defeat She Who Thirsts and reclaim their position as rulers of the galaxy.',
    gameEffect: 'United Aeldari faction, death-themed powers.'
  },
  
  // ============================================================================
  // BRACKETED KEYWORDS
  // ============================================================================
  
  '[CHAPTER]': {
    keyword: '[CHAPTER]',
    category: 'bracketed',
    name: '[CHAPTER]',
    description: 'A Space Marine Chapter name, such as Ultramarines, Blood Angels, or Dark Angels.',
    gameEffect: 'Identifies Chapter loyalty and traditions.',
    examples: ['ULTRAMARINES', 'BLOOD ANGELS', 'DARK ANGELS', 'SPACE WOLVES']
  },
  
  '[CLAN]': {
    keyword: '[CLAN]',
    category: 'bracketed',
    name: '[CLAN]',
    description: 'An Ork Clan name, such as Goffs, Bad Moons, or Evil Sunz.',
    gameEffect: 'Identifies Ork Clan affiliation and kultur.',
    examples: ['GOFFS', 'BAD MOONS', 'EVIL SUNZ', 'BLOOD AXES']
  },
  
  '[COTERIE]': {
    keyword: '[COTERIE]',
    category: 'bracketed',
    name: '[COTERIE]',
    description: 'An Anhrathe (Corsair) Coterie name.',
    gameEffect: 'Identifies Aeldari Corsair band affiliation.',
    examples: []
  },
  
  '[CRAFTWORLD]': {
    keyword: '[CRAFTWORLD]',
    category: 'bracketed',
    name: '[CRAFTWORLD]',
    description: 'An Asuryani Craftworld name, such as Ulthwé, Iyanden, or Biel-Tan.',
    gameEffect: 'Identifies Craftworld origin and philosophies.',
    examples: ['ULTHWÉ', 'IYANDEN', 'BIEL-TAN', 'ALAITOC']
  },
  
  '[DYNASTY]': {
    keyword: '[DYNASTY]',
    category: 'bracketed',
    name: '[DYNASTY]',
    description: 'A Necron Dynasty name.',
    gameEffect: 'Identifies Necron Dynasty and traditions.',
    examples: ['SAUTEKH', 'NIHILAKH', 'MEPHRIT']
  },
  
  '[FORGE WORLD]': {
    keyword: '[FORGE WORLD]',
    category: 'bracketed',
    name: '[FORGE WORLD]',
    description: 'An Adeptus Mechanicus Forge World name, such as Mars, Ryza, or Graia.',
    gameEffect: 'Identifies Mechanicus origin and tech-traditions.',
    examples: ['MARS', 'RYZA', 'GRAIA', 'METALICA']
  },
  
  '[HAEMONCULUS COVEN]': {
    keyword: '[HAEMONCULUS COVEN]',
    category: 'bracketed',
    name: '[HAEMONCULUS COVEN]',
    description: 'A Drukhari Haemonculus Coven name.',
    gameEffect: 'Identifies Haemonculus Coven affiliation and fleshcraft specialties.',
    examples: ['PROPHETS OF FLESH', 'DARK CREED']
  },
  
  '[KABAL]': {
    keyword: '[KABAL]',
    category: 'bracketed',
    name: '[KABAL]',
    description: 'A Drukhari Kabal name.',
    gameEffect: 'Identifies Kabal affiliation and pirate traditions.',
    examples: ['KABAL OF THE BLACK HEART', 'KABAL OF THE POISONED TONGUE']
  },
  
  '[LEGION]': {
    keyword: '[LEGION]',
    category: 'bracketed',
    name: '[LEGION]',
    description: 'A Traitor Legion name, such as Black Legion, Word Bearers, or Iron Warriors.',
    gameEffect: 'Identifies Chaos Legion affiliation and traditions.',
    examples: ['BLACK LEGION', 'WORD BEARERS', 'IRON WARRIORS', 'DEATH GUARD']
  },
  
  '[MARK OF CHAOS]': {
    keyword: '[MARK OF CHAOS]',
    category: 'bracketed',
    name: '[MARK OF CHAOS]',
    description: 'The mark of a specific Chaos God: Khorne, Nurgle, Slaanesh, or Tzeentch.',
    gameEffect: 'Identifies devotion to a specific Chaos God.',
    examples: ['KHORNE', 'NURGLE', 'SLAANESH', 'TZEENTCH']
  },
  
  '[ORDER]': {
    keyword: '[ORDER]',
    category: 'bracketed',
    name: '[ORDER]',
    description: 'An Adepta Sororitas Order name, such as Order of Our Martyred Lady or Order of the Bloody Rose.',
    gameEffect: 'Identifies Order affiliation and traditions.',
    examples: ['ORDER OF OUR MARTYRED LADY', 'ORDER OF THE BLOODY ROSE', 'ORDER OF THE VALOROUS HEART']
  },
  
  '[ORDO]': {
    keyword: '[ORDO]',
    category: 'bracketed',
    name: '[ORDO]',
    description: 'An Inquisition Ordo name, such as Ordo Xenos, Ordo Hereticus, or Ordo Malleus.',
    gameEffect: 'Identifies Inquisition specialization.',
    examples: ['ORDO XENOS', 'ORDO HERETICUS', 'ORDO MALLEUS']
  },
  
  '[REGIMENT]': {
    keyword: '[REGIMENT]',
    category: 'bracketed',
    name: '[REGIMENT]',
    description: 'An Astra Militarum Regiment name, such as Cadian, Catachan, or Krieg.',
    gameEffect: 'Identifies regimental traditions and homeworld.',
    examples: ['CADIAN', 'CATACHAN', 'KRIEG', 'VALHALLAN']
  },
  
  '[WYCH CULT]': {
    keyword: '[WYCH CULT]',
    category: 'bracketed',
    name: '[WYCH CULT]',
    description: 'A Drukhari Wych Cult name.',
    gameEffect: 'Identifies Wych Cult affiliation and combat traditions.',
    examples: ['CULT OF STRIFE', 'CULT OF THE RED GRIEF']
  },
  
  // ============================================================================
  // WARGEAR KEYWORDS
  // ============================================================================
  
  '2-HANDED': {
    keyword: '2-HANDED',
    category: 'wargear',
    name: '2-HANDED',
    description: 'A weapon that requires two hands to wield.',
    gameEffect: 'Cannot be used with a shield or second weapon.'
  },
  
  'ARC': {
    keyword: 'ARC',
    category: 'wargear',
    name: 'ARC',
    description: 'Ancient weapons that spew blasts of electricity that tear asunder biological nerves and mechanical systems.',
    gameEffect: 'Effective against both organic and mechanical targets.'
  },
  
  'BLADE': {
    keyword: 'BLADE',
    category: 'wargear',
    name: 'BLADE',
    description: 'A simple bladed weapon, such as a Sword or Knife.',
    gameEffect: 'Basic melee weapon.'
  },
  
  'BOLT': {
    keyword: 'BOLT',
    category: 'wargear',
    name: 'BOLT',
    description: 'A firearm that fires the self-propelled, mass-reactive rounds known as Bolts, which explode when they penetrate the enemy.',
    gameEffect: 'Mass-reactive ammunition for devastating damage.'
  },
  
  'CHAIN': {
    keyword: 'CHAIN',
    category: 'wargear',
    name: 'CHAIN',
    description: 'A weapon that uses sharp, motorised teeth to inflict maximum damage.',
    gameEffect: 'Additional damage dice on successful hits.'
  },
  
  'EXOTIC': {
    keyword: 'EXOTIC',
    category: 'wargear',
    name: 'EXOTIC',
    description: 'A strange or unusual weapon that defies usual categorisation.',
    gameEffect: 'Unique or xenos technology.'
  },
  
  'EXPLOSIVE': {
    keyword: 'EXPLOSIVE',
    category: 'wargear',
    name: 'EXPLOSIVE',
    description: 'A weapon that explodes or fires explosives.',
    gameEffect: 'Area effect damage.'
  },
  
  'FIRE': {
    keyword: 'FIRE',
    category: 'wargear',
    name: 'FIRE',
    description: 'A weapon that shoots flames or incorporates fire.',
    gameEffect: 'Causes burning damage over time.'
  },
  
  'FLAK': {
    keyword: 'FLAK',
    category: 'wargear',
    name: 'FLAK',
    description: 'A sturdy, lightweight, mass-produced form of armour.',
    gameEffect: 'Standard Imperial Guard armor.'
  },
  
  'FORCE': {
    keyword: 'FORCE',
    category: 'wargear',
    name: 'FORCE',
    description: 'Psykers can channel Warp energies into a Force weapon, unnaturally amplifying the power of their blows.',
    gameEffect: 'Psychically enhanced melee weapon.'
  },
  
  'HEAVY': {
    keyword: 'HEAVY',
    category: 'wargear',
    name: 'HEAVY',
    description: 'A particularly weighty piece of equipment.',
    gameEffect: 'Strength requirements and movement penalties.'
  },
  
  'LAS': {
    keyword: 'LAS',
    category: 'wargear',
    name: 'LAS',
    description: 'Mass-produced, easily maintained, and fueled by rechargeable power cells used to fire lasers, Las weapons are the mainstay weapon of the Imperium.',
    gameEffect: 'Standard Imperial laser weapons.'
  },
  
  'LIGHT_WARGEAR': {
    keyword: 'LIGHT',
    category: 'wargear',
    name: 'LIGHT',
    description: 'A particularly low-weight piece of equipment.',
    gameEffect: 'Easy to carry and wield.'
  },
  
  'MELTA': {
    keyword: 'MELTA',
    category: 'wargear',
    name: 'MELTA',
    description: 'Firing focused beams of extreme heat, these thermal firearms are powered by sub-atomic technology and make excellent anti-armour weapons.',
    gameEffect: 'Devastating against armored targets at close range.'
  },
  
  'NEEDLE': {
    keyword: 'NEEDLE',
    category: 'wargear',
    name: 'NEEDLE',
    description: 'These silent weapons have a two-stage firing mechanism: an invisible laser that penetrates the skin, followed by a poisonous crystalised needle of neurotoxin to ruthlessly dispatch foes at a distance.',
    gameEffect: 'Silent assassination weapon with neurotoxin.'
  },
  
  'PLASMA': {
    keyword: 'PLASMA',
    category: 'wargear',
    name: 'PLASMA',
    description: 'Advanced firearms that shoot deadly pulses of superheated matter, these weapons revered for their destructive prowess and feared for their instability.',
    gameEffect: 'High damage, risk of overheating.'
  },
  
  'POWER FIELD': {
    keyword: 'POWER FIELD',
    category: 'wargear',
    name: 'POWER FIELD',
    description: 'Melee weapons sheathed in matter-disrupting power fields cut through armour with ease.',
    gameEffect: 'Ignores armor.'
  },
  
  'POWERED': {
    keyword: 'POWERED',
    category: 'wargear',
    name: 'POWERED',
    description: 'Ceramite, adamantium, and plasteel are but a few of the super-heavy materials used to provide Imperial warriors with protection. This armour would be too heavy to use were it not for the electrically motivated fibre bundles that enhance and replicate the wearer\'s movements, mitigating heavy weight and increasing the strength of the wearer.',
    gameEffect: 'Increases Strength, mitigates armour weight penalties.'
  },
  
  'PRIMITIVE': {
    keyword: 'PRIMITIVE',
    category: 'wargear',
    name: 'PRIMITIVE',
    description: 'Equipment that uses outdated technology.',
    gameEffect: 'Less effective than modern weapons.'
  },
  
  'PROJECTILE': {
    keyword: 'PROJECTILE',
    category: 'wargear',
    name: 'PROJECTILE',
    description: 'A firearm that uses ancient gunpowder technology to launch simple metal slugs at high speeds.',
    gameEffect: 'Basic ballistic weapons.'
  },
  
  'SHURIKEN': {
    keyword: 'SHURIKEN',
    category: 'wargear',
    name: 'SHURIKEN',
    description: 'The advanced technology of the Aeldari allows them to construct monomolecular plasti-crystal ammunition that slices through flesh and armour when fired. These weapons usually utilise gravitic pulses to launch Shurikens at speeds so fast they screech through the air.',
    gameEffect: 'Aeldari weapons with armor-piercing ammunition.'
  },
  
  // ============================================================================
  // PSYCHIC POWER KEYWORDS
  // ============================================================================
  
  'PSYCHIC': {
    keyword: 'PSYCHIC',
    category: 'psychic',
    name: 'PSYCHIC',
    description: 'A Keyword attached to every Psychic Power.',
    gameEffect: 'Identifies psychic abilities.'
  },
  
  'AELDARI_PSYCHIC': {
    keyword: 'AELDARI',
    category: 'psychic',
    name: 'AELDARI',
    description: 'An advanced psychic power employed only by the Aeldari Species.',
    gameEffect: 'Aeldari-exclusive psychic powers.'
  },
  
  'CHAOS_PSYCHIC': {
    keyword: 'CHAOS',
    category: 'psychic',
    name: 'CHAOS',
    description: 'A psychic power employed only by the forces of Chaos.',
    gameEffect: 'Chaos-exclusive psychic powers.'
  },
  
  'AUDITORY': {
    keyword: 'AUDITORY',
    category: 'psychic',
    name: 'AUDITORY',
    description: 'A psychic power that has an audible effect.',
    gameEffect: 'Creates sound, can be heard.'
  },
  
  'FIRE_PSYCHIC': {
    keyword: 'FIRE',
    category: 'psychic',
    name: 'FIRE',
    description: 'A psychic power that manipulates heat or conjures flame.',
    gameEffect: 'Pyrokinetic abilities.'
  },
  
  'KINETIC': {
    keyword: 'KINETIC',
    category: 'psychic',
    name: 'KINETIC',
    description: 'A psychic power that manifests kinetic force to move something in realspace.',
    gameEffect: 'Telekinesis and force manipulation.'
  },
  
  'LIGHT_PSYCHIC': {
    keyword: 'LIGHT',
    category: 'psychic',
    name: 'LIGHT',
    description: 'A psychic power that produces light.',
    gameEffect: 'Illumination effects.'
  },
  
  'TELEPATHY': {
    keyword: 'TELEPATHY',
    category: 'psychic',
    name: 'TELEPATHY',
    description: 'A psychic power that allows the Psyker to enter the mind of another individual.',
    gameEffect: 'Mental communication and manipulation.'
  }
} as const satisfies Record<string, KeywordDefinition>;

/**
 * Type-safe keyword IDs extracted from the keyword database
 */
export type KeywordId = keyof typeof KEYWORD_DEFINITIONS;

/**
 * Get all keyword definitions
 */
export function getAllKeywords(): KeywordDefinition[] {
  return Object.values(KEYWORD_DEFINITIONS) as KeywordDefinition[];
}

/**
 * Get keyword definition by keyword string
 */
export function getKeywordDefinition(keyword: string): KeywordDefinition | undefined {
  return KEYWORD_DEFINITIONS[keyword.toUpperCase() as KeywordId];
}

/**
 * Get keywords by category
 */
export function getKeywordsByCategory(
  category: 'special' | 'faction' | 'bracketed' | 'wargear' | 'psychic'
): KeywordDefinition[] {
  return getAllKeywords().filter(def => def.category === category);
}
