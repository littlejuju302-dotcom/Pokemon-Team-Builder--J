// All items available in Pokémon Champions (Regulation M-B).
// Mega Stones use Champions-specific names where known.
export const ALL_ITEMS: string[] = [
  // ── Mega Stones ───────────────────────────────────────────────
  'Abomasite', 'Absolite', 'Aerodactylite', 'Aggronite', 'Alakazite',
  'Altarianite', 'Ampharosite', 'Audinoite', 'Banettite', 'Beedrillite',
  'Blastoisite', 'Blazikenite', 'Cameruptite', 'Charizardite X', 'Charizardite Y',
  'Diancite', 'Eelektrosite', 'Falinxite', 'Galladite', 'Garchompite',
  'Gardevoirite', 'Glalitite', 'Gyaradosite', 'Heracronite', 'Houndoominite',
  'Kangaskhanite', 'Latiasite', 'Latiosite', 'Lopunnite', 'Lucarionite',
  'Manectite', 'Mawilite', 'Medichamite', 'Metagrossite', 'Mewtwoite X',
  'Mewtwoite Y', 'Pidgeotite', 'Pinsirite', 'Pyroarite', 'Raichunite X',
  'Raichunite Y', 'Sablenite', 'Salamencite', 'Scizorite', 'Scraftynite',
  'Sharpedonite', 'Slowbronite', 'Staraptite', 'Steelixite', 'Swampertite',
  'Tyranitarite', 'Venusaurite', 'Victreebellite',

  // ── Choice items ──────────────────────────────────────────────
  'Choice Band', 'Choice Specs', 'Choice Scarf',

  // ── Orbs & power items ────────────────────────────────────────
  'Life Orb', 'Flame Orb', 'Toxic Orb',

  // ── Defensive held items ──────────────────────────────────────
  'Leftovers', 'Black Sludge', 'Rocky Helmet', 'Assault Vest',
  'Eviolite', 'Air Balloon', 'Shed Shell',

  // ── Sash & focus items ────────────────────────────────────────
  'Focus Sash', 'Focus Band',

  // ── Stat-boost items ─────────────────────────────────────────
  'Weakness Policy', 'White Herb', 'Power Herb', 'Mental Herb',
  'Expert Belt', 'Muscle Band', 'Wise Glasses',
  'Scope Lens', 'Razor Claw', 'Wide Lens', 'Zoom Lens',
  'Quick Claw', 'King\'s Rock', 'Razor Fang',
  'Metronome', 'Loaded Dice', 'Punching Glove',
  'Booster Energy',

  // ── Utility items ─────────────────────────────────────────────
  'Safety Goggles', 'Covert Cloak', 'Clear Amulet',
  'Eject Button', 'Eject Pack', 'Red Card',
  'Throat Spray', 'Room Service', 'Mirror Herb',
  'Smoke Ball', 'Bright Powder', 'Lax Incense',
  'Destiny Knot', 'Grip Claw',

  // ── Type-enhancing items ──────────────────────────────────────
  'Charcoal', 'Mystic Water', 'Miracle Seed', 'Magnet',
  'Black Belt', 'Twisted Spoon', 'Soft Sand', 'Sharp Beak',
  'Poison Barb', 'Silk Scarf', 'Never-Melt Ice', 'Spell Tag',
  'Dragon Fang', 'Dread Plate', 'Metal Coat', 'Fairy Feather',
  'Sea Incense', 'Wave Incense', 'Rose Incense', 'Rock Incense',
  'Odd Incense', 'Pure Incense',

  // ── Berries: healing ─────────────────────────────────────────
  'Sitrus Berry', 'Oran Berry', 'Lum Berry', 'Leppa Berry',
  'Figy Berry', 'Wiki Berry', 'Mago Berry', 'Aguav Berry', 'Iapapa Berry',
  'Cheri Berry', 'Chesto Berry', 'Pecha Berry', 'Rawst Berry',
  'Aspear Berry', 'Persim Berry', 'Cure Berry',

  // ── Berries: stat boosts ─────────────────────────────────────
  'Petaya Berry', 'Salac Berry', 'Liechi Berry', 'Ganlon Berry',
  'Apicot Berry', 'Lansat Berry', 'Starf Berry', 'Micle Berry',
  'Custap Berry', 'Enigma Berry',

  // ── Berries: type resist ─────────────────────────────────────
  'Occa Berry', 'Passho Berry', 'Wacan Berry', 'Rindo Berry',
  'Yache Berry', 'Chople Berry', 'Kebia Berry', 'Shuca Berry',
  'Coba Berry', 'Payapa Berry', 'Tanga Berry', 'Charti Berry',
  'Kasib Berry', 'Haban Berry', 'Colbur Berry', 'Babiri Berry',
  'Roseli Berry', 'Kee Berry', 'Maranga Berry', 'Jaboca Berry', 'Rowap Berry',

  // ── Terrain seeds ─────────────────────────────────────────────
  'Electric Seed', 'Grassy Seed', 'Misty Seed', 'Psychic Seed',
];

// Items that interact with the damage calculator as attacker
export interface AttackerItemEffect {
  atkMult?: number;     // multiplies physical attack
  spaMult?: number;     // multiplies special attack
  damageMult?: number;  // multiplies final damage
  recoilFraction?: number; // attacker loses this fraction of their max HP after attacking
  onlySE?: boolean;     // only applies to super-effective moves (Expert Belt)
}

export const ATTACKER_ITEM_EFFECTS: Record<string, AttackerItemEffect> = {
  'Choice Band':   { atkMult: 1.5 },
  'Choice Specs':  { spaMult: 1.5 },
  'Life Orb':      { damageMult: 1.3, recoilFraction: 0.1 },
  'Muscle Band':   { damageMult: 1.1 },  // physical only, applied in calc
  'Wise Glasses':  { damageMult: 1.1 },  // special only, applied in calc
  'Expert Belt':   { damageMult: 1.2, onlySE: true },
};

// Items that interact with the damage calculator as defender
export interface DefenderItemEffect {
  spdMult?: number;     // multiplies SpDef (Assault Vest)
  contactRecoilFraction?: number; // attacker takes this fraction of their max HP on contact
}

export const DEFENDER_ITEM_EFFECTS: Record<string, DefenderItemEffect> = {
  'Assault Vest':  { spdMult: 1.5 },
  'Rocky Helmet':  { contactRecoilFraction: 1/6 },
};
