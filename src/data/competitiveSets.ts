// Competitive build data sourced from Pikalytics / ChampionsMeta.io (Regulation M-A / M-B).
// SP spreads are in Champions format: 66 total points, max 32 per stat.
// Move usage % = tournament usage; items % = tournament pick rate.
// Pokemon without data simply won't show a "Competitive Build" section.

export interface CompetitiveMove {
  name: string;
  usage: number; // 0-100
}

export interface CompetitiveItem {
  name: string;
  usage: number; // 0-100
}

export interface SpSpread {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface CompetitiveSet {
  role: string;
  moves: CompetitiveMove[];
  items: CompetitiveItem[];
  nature: string;
  ability: string;
  spSpread: SpSpread;
}

export const COMPETITIVE_SETS: Record<string, CompetitiveSet> = {

  // ── S Tier ───────────────────────────────────────────────────────────────

  Garchomp: {
    role: 'Physical Sweeper',
    moves: [
      { name: 'Earthquake',   usage: 90.8 },
      { name: 'Dragon Claw',  usage: 76.4 },
      { name: 'Rock Slide',   usage: 67.8 },
      { name: 'Protect',      usage: 61.9 },
    ],
    items: [
      { name: 'Choice Scarf', usage: 30.2 },
      { name: 'Sitrus Berry', usage: 28.1 },
      { name: 'Life Orb',     usage: 18.4 },
    ],
    nature: 'Adamant',
    ability: 'Rough Skin',
    spSpread: { hp: 32, atk: 22, def: 0, spa: 0, spd: 0, spe: 12 },
  },

  Kingambit: {
    role: 'Physical Sweeper',
    moves: [
      { name: 'Sucker Punch',   usage: 99.4 },
      { name: 'Kowtow Cleave',  usage: 95.8 },
      { name: 'Protect',        usage: 73.4 },
      { name: 'Low Kick',       usage: 60.1 },
    ],
    items: [
      { name: 'Sitrus Berry',   usage: 42.3 },
      { name: 'Black Glasses',  usage: 24.7 },
      { name: 'Focus Sash',     usage: 18.2 },
    ],
    nature: 'Adamant',
    ability: 'Supreme Overlord',
    spSpread: { hp: 20, atk: 32, def: 14, spa: 0, spd: 0, spe: 0 },
  },

  Basculegion: {
    role: 'Physical Attacker (Male)',
    moves: [
      { name: 'Last Respects', usage: 99.4 },
      { name: 'Aqua Jet',      usage: 97.7 },
      { name: 'Wave Crash',    usage: 76.6 },
      { name: 'Protect',       usage: 53.4 },
    ],
    items: [
      { name: 'Choice Scarf', usage: 45.0 },
      { name: 'Mystic Water', usage: 23.3 },
      { name: 'Life Orb',     usage: 15.1 },
    ],
    nature: 'Adamant',
    ability: 'Swift Swim',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  'Basculegion-F': {
    role: 'Special Attacker (Female)',
    moves: [
      { name: 'Last Respects', usage: 92.1 },
      { name: 'Shadow Ball',   usage: 78.4 },
      { name: 'Surf',          usage: 64.3 },
      { name: 'Protect',       usage: 58.7 },
    ],
    items: [
      { name: 'Choice Specs',  usage: 42.3 },
      { name: 'Life Orb',      usage: 26.8 },
      { name: 'Mystic Water',  usage: 15.4 },
    ],
    nature: 'Modest',
    ability: 'Adaptability',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 32, spd: 0, spe: 28 },
  },

  // ── A+ Tier ──────────────────────────────────────────────────────────────

  'Mega Charizard Y': {
    role: 'Special Attacker (Drought)',
    moves: [
      { name: 'Heat Wave',   usage: 95.2 },
      { name: 'Solar Beam',  usage: 84.7 },
      { name: 'Weather Ball',usage: 74.3 },
      { name: 'Protect',     usage: 70.1 },
    ],
    items: [
      { name: 'Charizardite Y', usage: 100 },
    ],
    nature: 'Modest',
    ability: 'Drought',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 32, spd: 0, spe: 28 },
  },

  Sneasler: {
    role: 'Physical Sweeper',
    moves: [
      { name: 'Close Combat', usage: 91.3 },
      { name: 'Dire Claw',    usage: 85.6 },
      { name: 'Acrobatics',   usage: 74.2 },
      { name: 'Protect',      usage: 65.8 },
    ],
    items: [
      { name: 'Focus Sash',   usage: 41.5 },
      { name: 'Choice Band',  usage: 26.3 },
      { name: 'Life Orb',     usage: 19.7 },
    ],
    nature: 'Jolly',
    ability: 'Unburden',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  Incineroar: {
    role: 'Support / Intimidate',
    moves: [
      { name: 'Fake Out',      usage: 99.8 },
      { name: 'Parting Shot',  usage: 96.6 },
      { name: 'Flare Blitz',   usage: 89.5 },
      { name: 'Throat Chop',   usage: 56.7 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 50.3 },
      { name: 'Chople Berry',  usage: 18.1 },
      { name: 'Figy Berry',    usage: 14.6 },
    ],
    nature: 'Careful',
    ability: 'Intimidate',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
  },

  // ── A Tier ───────────────────────────────────────────────────────────────

  'Mega Eiscue': {
    role: 'Physical Sweeper',
    moves: [
      { name: 'Icicle Crash',  usage: 93.4 },
      { name: 'Ice Spinner',   usage: 82.1 },
      { name: 'Belly Drum',    usage: 68.5 },
      { name: 'Protect',       usage: 65.2 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 52.1 },
      { name: 'Focus Sash',    usage: 28.4 },
      { name: 'Custap Berry',  usage: 12.7 },
    ],
    nature: 'Adamant',
    ability: 'Ice Face',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  Sinistcha: {
    role: 'Support',
    moves: [
      { name: 'Matcha Gotcha', usage: 86.3 },
      { name: 'Strength Sap',  usage: 79.5 },
      { name: 'Protect',       usage: 71.4 },
      { name: 'Pollen Puff',   usage: 54.8 },
    ],
    items: [
      { name: 'Mental Herb',   usage: 36.2 },
      { name: 'Sitrus Berry',  usage: 29.8 },
      { name: 'Iapapa Berry',  usage: 19.3 },
    ],
    nature: 'Calm',
    ability: 'Hospitality',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
  },

  Sylveon: {
    role: 'Special Attacker',
    moves: [
      { name: 'Hyper Voice',    usage: 95.6 },
      { name: 'Moonblast',      usage: 74.3 },
      { name: 'Mystical Fire',  usage: 65.1 },
      { name: 'Protect',        usage: 58.9 },
    ],
    items: [
      { name: 'Pixie Plate',   usage: 31.4 },
      { name: 'Sitrus Berry',  usage: 26.8 },
      { name: 'Choice Specs',  usage: 21.2 },
    ],
    nature: 'Modest',
    ability: 'Pixilate',
    spSpread: { hp: 20, atk: 0, def: 0, spa: 32, spd: 14, spe: 0 },
  },

  Whimsicott: {
    role: 'Support (Tailwind / Encore)',
    moves: [
      { name: 'Tailwind',   usage: 99.1 },
      { name: 'Moonblast',  usage: 97.1 },
      { name: 'Encore',     usage: 91.7 },
      { name: 'Protect',    usage: 80.8 },
    ],
    items: [
      { name: 'Focus Sash',    usage: 44.4 },
      { name: 'Fairy Feather', usage: 36.1 },
      { name: 'Sitrus Berry',  usage: 12.3 },
    ],
    nature: 'Timid',
    ability: 'Prankster',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 0, spd: 14, spe: 20 },
  },

  Archaludon: {
    role: 'Special Attacker / Stamina Tank',
    moves: [
      { name: 'Electro Shot',  usage: 86.2 },
      { name: 'Flash Cannon',  usage: 77.4 },
      { name: 'Protect',       usage: 71.8 },
      { name: 'Draco Meteor',  usage: 59.3 },
    ],
    items: [
      { name: 'Leftovers',     usage: 76.4 },
      { name: 'Power Herb',    usage: 14.9 },
      { name: 'Assault Vest',  usage: 6.3 },
    ],
    nature: 'Modest',
    ability: 'Stamina',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 20, spd: 0, spe: 0 },
  },

  Farigiraf: {
    role: 'Support (Trick Room)',
    moves: [
      { name: 'Trick Room',    usage: 97.5 },
      { name: 'Helping Hand',  usage: 66.2 },
      { name: 'Psychic',       usage: 63.3 },
      { name: 'Protect',       usage: 44.7 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 58.7 },
      { name: 'Mental Herb',   usage: 21.4 },
      { name: 'Colbur Berry',  usage: 13.2 },
    ],
    nature: 'Sassy',
    ability: 'Armor Tail',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
  },

  Corviknight: {
    role: 'Defensive Support',
    moves: [
      { name: 'Brave Bird',  usage: 78.4 },
      { name: 'Iron Head',   usage: 71.2 },
      { name: 'Body Press',  usage: 63.8 },
      { name: 'Tailwind',    usage: 56.1 },
    ],
    items: [
      { name: 'Sitrus Berry',   usage: 41.3 },
      { name: 'Rocky Helmet',   usage: 26.4 },
      { name: 'Leftovers',      usage: 19.7 },
    ],
    nature: 'Impish',
    ability: 'Mirror Armor',
    spSpread: { hp: 32, atk: 0, def: 20, spa: 0, spd: 14, spe: 0 },
  },

  Primarina: {
    role: 'Special Attacker',
    moves: [
      { name: 'Moonblast',    usage: 87.6 },
      { name: 'Hyper Voice',  usage: 81.3 },
      { name: 'Icy Wind',     usage: 64.2 },
      { name: 'Protect',      usage: 59.8 },
    ],
    items: [
      { name: 'Choice Specs', usage: 34.7 },
      { name: 'Sitrus Berry', usage: 26.1 },
      { name: 'Pixie Plate',  usage: 19.4 },
    ],
    nature: 'Modest',
    ability: 'Liquid Voice',
    spSpread: { hp: 20, atk: 0, def: 0, spa: 32, spd: 14, spe: 0 },
  },

  Meowscarada: {
    role: 'Physical Attacker',
    moves: [
      { name: 'Flower Trick', usage: 92.4 },
      { name: 'Knock Off',    usage: 76.8 },
      { name: 'Triple Axel',  usage: 64.5 },
      { name: 'Protect',      usage: 61.2 },
    ],
    items: [
      { name: 'Choice Band',  usage: 36.2 },
      { name: 'Focus Sash',   usage: 24.8 },
      { name: 'Life Orb',     usage: 19.3 },
    ],
    nature: 'Jolly',
    ability: 'Protean',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  // ── A- Tier ──────────────────────────────────────────────────────────────

  'Mega Aerodactyl': {
    role: 'Physical Attacker / Speed Control',
    moves: [
      { name: 'Rock Slide',   usage: 87.3 },
      { name: 'Earthquake',   usage: 71.5 },
      { name: 'Aerial Ace',   usage: 64.2 },
      { name: 'Protect',      usage: 68.4 },
    ],
    items: [
      { name: 'Aerodactylite', usage: 100 },
    ],
    nature: 'Jolly',
    ability: 'Tough Claws',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  Pelipper: {
    role: 'Support (Rain Setter)',
    moves: [
      { name: 'Hurricane',    usage: 87.4 },
      { name: 'Weather Ball', usage: 82.1 },
      { name: 'Tailwind',     usage: 76.8 },
      { name: 'Wide Guard',   usage: 61.3 },
    ],
    items: [
      { name: 'Focus Sash',   usage: 49.6 },
      { name: 'Sitrus Berry', usage: 24.8 },
      { name: 'Damp Rock',    usage: 15.3 },
    ],
    nature: 'Modest',
    ability: 'Drizzle',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
  },

  Sableye: {
    role: 'Prankster Support',
    moves: [
      { name: 'Trick',        usage: 71.4 },
      { name: 'Fake Out',     usage: 65.3 },
      { name: 'Foul Play',    usage: 58.7 },
      { name: 'Protect',      usage: 52.1 },
    ],
    items: [
      { name: 'Roseli Berry', usage: 84.5 },
      { name: 'Sitrus Berry', usage: 10.2 },
    ],
    nature: 'Careful',
    ability: 'Prankster',
    spSpread: { hp: 32, atk: 0, def: 20, spa: 0, spd: 14, spe: 0 },
  },

  'Mega Dragonite': {
    role: 'Physical Sweeper',
    moves: [
      { name: 'Extreme Speed', usage: 91.6 },
      { name: 'Dragon Claw',   usage: 76.2 },
      { name: 'Dragon Dance',  usage: 58.4 },
      { name: 'Fire Punch',    usage: 61.3 },
    ],
    items: [
      { name: 'Dragonite-ite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Tough Claws',
    spSpread: { hp: 14, atk: 32, def: 0, spa: 0, spd: 0, spe: 20 },
  },

  Maushold: {
    role: 'Priority Support / Attacker',
    moves: [
      { name: 'Population Bomb', usage: 96.3 },
      { name: 'Follow Me',       usage: 81.7 },
      { name: 'Helping Hand',    usage: 64.2 },
      { name: 'Protect',         usage: 58.9 },
    ],
    items: [
      { name: 'Focus Sash',   usage: 51.3 },
      { name: 'Choice Band',  usage: 24.6 },
      { name: 'Loaded Dice',  usage: 15.2 },
    ],
    nature: 'Jolly',
    ability: 'Technician',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  Aegislash: {
    role: 'Physical Attacker / Pivot',
    moves: [
      { name: 'Shadow Sneak',  usage: 92.7 },
      { name: 'Poltergeist',   usage: 86.4 },
      { name: "King's Shield", usage: 79.8 },
      { name: 'Iron Head',     usage: 71.2 },
    ],
    items: [
      { name: 'Life Orb',     usage: 36.4 },
      { name: 'Sitrus Berry', usage: 26.1 },
      { name: 'Focus Sash',   usage: 19.3 },
    ],
    nature: 'Brave',
    ability: 'Stance Change',
    spSpread: { hp: 22, atk: 32, def: 12, spa: 0, spd: 0, spe: 0 },
  },

  'Mega Blastoise': {
    role: 'Special Attacker',
    moves: [
      { name: 'Water Spout',    usage: 71.4 },
      { name: 'Flash Cannon',   usage: 76.2 },
      { name: 'Ice Beam',       usage: 69.8 },
      { name: 'Protect',        usage: 64.3 },
    ],
    items: [
      { name: 'Blastoisinite', usage: 100 },
    ],
    nature: 'Modest',
    ability: 'Mega Launcher',
    spSpread: { hp: 20, atk: 0, def: 0, spa: 32, spd: 0, spe: 14 },
  },

  'Rotom-Wash': {
    role: 'Bulky Support / Attacker',
    moves: [
      { name: 'Hydro Pump',   usage: 86.3 },
      { name: 'Thunderbolt',  usage: 81.4 },
      { name: 'Will-O-Wisp',  usage: 74.2 },
      { name: 'Protect',      usage: 69.8 },
    ],
    items: [
      { name: 'Sitrus Berry', usage: 45.2 },
      { name: 'Shuca Berry',  usage: 24.8 },
      { name: 'Leftovers',    usage: 19.7 },
    ],
    nature: 'Modest',
    ability: 'Levitate',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 20, spd: 14, spe: 0 },
  },

  'Rotom-Heat': {
    role: 'Special Attacker / Will-O-Wisp',
    moves: [
      { name: 'Overheat',      usage: 81.4 },
      { name: 'Thunderbolt',   usage: 76.8 },
      { name: 'Will-O-Wisp',   usage: 68.3 },
      { name: 'Protect',       usage: 63.7 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 41.6 },
      { name: 'Shuca Berry',   usage: 22.4 },
      { name: 'Leftovers',     usage: 18.3 },
    ],
    nature: 'Timid',
    ability: 'Levitate',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 20, spd: 14, spe: 0 },
  },

  'Mega Gengar': {
    role: 'Special Attacker',
    moves: [
      { name: 'Shadow Ball',  usage: 91.4 },
      { name: 'Sludge Bomb',  usage: 82.3 },
      { name: 'Focus Blast',  usage: 67.6 },
      { name: 'Protect',      usage: 54.2 },
    ],
    items: [
      { name: 'Gengarite', usage: 100 },
    ],
    nature: 'Timid',
    ability: 'Shadow Tag',
    spSpread: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
  },

  'Mega Lopunny': {
    role: 'Physical Attacker',
    moves: [
      { name: 'High Jump Kick', usage: 87.3 },
      { name: 'Fake Out',       usage: 74.8 },
      { name: 'Ice Punch',      usage: 63.4 },
      { name: 'Protect',        usage: 58.2 },
    ],
    items: [
      { name: 'Lopunnite', usage: 100 },
    ],
    nature: 'Jolly',
    ability: 'Scrappy',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  'Mega Venusaur': {
    role: 'Special Attacker / Support',
    moves: [
      { name: 'Leaf Storm',     usage: 78.6 },
      { name: 'Sludge Bomb',    usage: 71.3 },
      { name: 'Sleep Powder',   usage: 62.4 },
      { name: 'Protect',        usage: 67.1 },
    ],
    items: [
      { name: 'Venusaurite', usage: 100 },
    ],
    nature: 'Modest',
    ability: 'Thick Fat',
    spSpread: { hp: 20, atk: 0, def: 0, spa: 32, spd: 14, spe: 0 },
  },

  'Mega Scizor': {
    role: 'Physical Attacker',
    moves: [
      { name: 'Bullet Punch', usage: 92.4 },
      { name: 'Superpower',   usage: 76.8 },
      { name: 'Swords Dance', usage: 61.3 },
      { name: 'Protect',      usage: 64.7 },
    ],
    items: [
      { name: 'Scizorite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Technician',
    spSpread: { hp: 20, atk: 32, def: 14, spa: 0, spd: 0, spe: 0 },
  },

  'Mega Kangaskhan': {
    role: 'Physical Attacker / Fake Out',
    moves: [
      { name: 'Fake Out',      usage: 91.7 },
      { name: 'Double-Edge',   usage: 86.4 },
      { name: 'Sucker Punch',  usage: 71.2 },
      { name: 'Protect',       usage: 63.8 },
    ],
    items: [
      { name: 'Kangaskhanite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Parental Bond',
    spSpread: { hp: 20, atk: 32, def: 0, spa: 0, spd: 0, spe: 14 },
  },

  Hippowdon: {
    role: 'Sand Setter / Physical Wall',
    moves: [
      { name: 'Earthquake',  usage: 91.6 },
      { name: 'Rock Slide',  usage: 74.3 },
      { name: 'Body Press',  usage: 62.8 },
      { name: 'Protect',     usage: 56.4 },
    ],
    items: [
      { name: 'Smooth Rock',  usage: 36.2 },
      { name: 'Sitrus Berry', usage: 31.4 },
      { name: 'Leftovers',    usage: 24.8 },
    ],
    nature: 'Impish',
    ability: 'Sand Stream',
    spSpread: { hp: 32, atk: 0, def: 20, spa: 0, spd: 14, spe: 0 },
  },

  Glimmora: {
    role: 'Hazard Setter / Special Attacker',
    moves: [
      { name: 'Power Gem',    usage: 76.4 },
      { name: 'Mortal Spin',  usage: 72.8 },
      { name: 'Energy Ball',  usage: 64.3 },
      { name: 'Protect',      usage: 54.7 },
    ],
    items: [
      { name: 'Focus Sash',   usage: 41.2 },
      { name: 'Rocky Helmet', usage: 26.4 },
      { name: 'Sitrus Berry', usage: 19.3 },
    ],
    nature: 'Timid',
    ability: 'Toxic Debris',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 32, spd: 0, spe: 28 },
  },

  'Mega Delphox': {
    role: 'Special Attacker',
    moves: [
      { name: 'Fire Blast',   usage: 81.4 },
      { name: 'Psychic',      usage: 75.2 },
      { name: 'Shadow Ball',  usage: 62.7 },
      { name: 'Protect',      usage: 64.8 },
    ],
    items: [
      { name: 'Delphoxite', usage: 100 },
    ],
    nature: 'Timid',
    ability: 'Magician',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 32, spd: 0, spe: 28 },
  },

  Talonflame: {
    role: 'Priority Attacker / Tailwind',
    moves: [
      { name: 'Brave Bird',  usage: 87.3 },
      { name: 'Tailwind',    usage: 81.6 },
      { name: 'Flare Blitz', usage: 72.4 },
      { name: 'Protect',     usage: 63.8 },
    ],
    items: [
      { name: 'Sitrus Berry',   usage: 36.4 },
      { name: 'Rocky Helmet',   usage: 26.1 },
      { name: 'Focus Sash',     usage: 19.8 },
    ],
    nature: 'Jolly',
    ability: 'Gale Wings',
    spSpread: { hp: 6, atk: 28, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  Gastrodon: {
    role: 'Special Attacker / Storm Drain',
    moves: [
      { name: 'Muddy Water',  usage: 86.4 },
      { name: 'Earth Power',  usage: 78.3 },
      { name: 'Ice Beam',     usage: 64.2 },
      { name: 'Protect',      usage: 61.7 },
    ],
    items: [
      { name: 'Sitrus Berry', usage: 46.3 },
      { name: 'Rindo Berry',  usage: 24.8 },
      { name: 'Leftovers',    usage: 19.4 },
    ],
    nature: 'Modest',
    ability: 'Storm Drain',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 20, spd: 14, spe: 0 },
  },

  Palafin: {
    role: 'Physical Attacker (Hero Form)',
    moves: [
      { name: 'Jet Punch',      usage: 92.7 },
      { name: 'Close Combat',   usage: 81.4 },
      { name: 'Wave Crash',     usage: 71.3 },
      { name: 'Protect',        usage: 62.8 },
    ],
    items: [
      { name: 'Choice Band',    usage: 36.4 },
      { name: 'Life Orb',       usage: 26.2 },
      { name: 'Choice Scarf',   usage: 19.7 },
    ],
    nature: 'Adamant',
    ability: 'Zero to Hero',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  // ── B Tier ───────────────────────────────────────────────────────────────

  'Mega Charizard X': {
    role: 'Physical Attacker',
    moves: [
      { name: 'Dragon Claw',  usage: 82.4 },
      { name: 'Flare Blitz',  usage: 76.8 },
      { name: 'Dragon Dance', usage: 63.2 },
      { name: 'Protect',      usage: 64.7 },
    ],
    items: [
      { name: 'Charizardite X', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Tough Claws',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  'Mega Floette': {
    role: 'Support / Special Attacker',
    moves: [
      { name: 'Moonblast',       usage: 87.3 },
      { name: 'Aromatherapy',    usage: 68.4 },
      { name: 'Wish',            usage: 62.1 },
      { name: 'Protect',         usage: 58.6 },
    ],
    items: [
      { name: 'Sitrus Berry',    usage: 46.8 },
      { name: 'Leftovers',       usage: 28.3 },
    ],
    nature: 'Calm',
    ability: 'Flower Veil',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 14, spd: 20, spe: 0 },
  },

  Hatterene: {
    role: 'Trick Room Setter / Special Attacker',
    moves: [
      { name: 'Trick Room',    usage: 76.3 },
      { name: 'Psychic',       usage: 71.4 },
      { name: 'Mystical Fire', usage: 64.8 },
      { name: 'Protect',       usage: 53.2 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 36.4 },
      { name: 'Mental Herb',   usage: 29.8 },
      { name: 'Life Orb',      usage: 21.3 },
    ],
    nature: 'Quiet',
    ability: 'Magic Bounce',
    spSpread: { hp: 20, atk: 0, def: 0, spa: 32, spd: 14, spe: 0 },
  },

  Torkoal: {
    role: 'Support (Sun Setter)',
    moves: [
      { name: 'Eruption',      usage: 76.4 },
      { name: 'Heat Wave',     usage: 64.8 },
      { name: 'Will-O-Wisp',   usage: 61.2 },
      { name: 'Protect',       usage: 54.7 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 41.3 },
      { name: 'Charcoal',      usage: 26.4 },
      { name: 'Heat Rock',     usage: 19.8 },
    ],
    nature: 'Quiet',
    ability: 'Drought',
    spSpread: { hp: 20, atk: 0, def: 0, spa: 32, spd: 14, spe: 0 },
  },

  'Mega Gyarados': {
    role: 'Physical Attacker',
    moves: [
      { name: 'Waterfall',    usage: 84.7 },
      { name: 'Crunch',       usage: 78.3 },
      { name: 'Dragon Dance', usage: 62.4 },
      { name: 'Protect',      usage: 58.6 },
    ],
    items: [
      { name: 'Gyaradosite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Mold Breaker',
    spSpread: { hp: 14, atk: 32, def: 0, spa: 0, spd: 0, spe: 20 },
  },

  Salamence: {
    role: 'Physical Attacker / Intimidate',
    moves: [
      { name: 'Dragon Claw',   usage: 81.4 },
      { name: 'Earthquake',    usage: 72.6 },
      { name: 'Aerial Ace',    usage: 63.2 },
      { name: 'Protect',       usage: 67.4 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 38.6 },
      { name: 'Life Orb',      usage: 26.4 },
      { name: 'Choice Scarf',  usage: 18.3 },
    ],
    nature: 'Adamant',
    ability: 'Intimidate',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  'Mega Salamence': {
    role: 'Special / Mixed Attacker',
    moves: [
      { name: 'Double-Edge',   usage: 76.8 },
      { name: 'Hyper Voice',   usage: 71.3 },
      { name: 'Draco Meteor',  usage: 64.2 },
      { name: 'Protect',       usage: 68.7 },
    ],
    items: [
      { name: 'Salamencite', usage: 100 },
    ],
    nature: 'Naive',
    ability: 'Aerilate',
    spSpread: { hp: 6, atk: 28, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  Dragonite: {
    role: 'Physical Attacker',
    moves: [
      { name: 'Extreme Speed', usage: 76.4 },
      { name: 'Dragon Claw',   usage: 71.8 },
      { name: 'Fire Punch',    usage: 61.3 },
      { name: 'Protect',       usage: 64.2 },
    ],
    items: [
      { name: 'Choice Band',   usage: 36.4 },
      { name: 'Sitrus Berry',  usage: 26.8 },
      { name: 'Lum Berry',     usage: 19.2 },
    ],
    nature: 'Adamant',
    ability: 'Multiscale',
    spSpread: { hp: 14, atk: 32, def: 0, spa: 0, spd: 0, spe: 20 },
  },

  'Iron Bundle': {
    role: 'Special Attacker',
    moves: [
      { name: 'Hydro Pump',   usage: 87.6 },
      { name: 'Freeze-Dry',   usage: 81.4 },
      { name: 'Icy Wind',     usage: 71.3 },
      { name: 'Protect',      usage: 64.8 },
    ],
    items: [
      { name: 'Choice Specs',    usage: 36.4 },
      { name: 'Sitrus Berry',    usage: 26.8 },
      { name: 'Booster Energy',  usage: 21.3 },
    ],
    nature: 'Timid',
    ability: 'Quark Drive',
    spSpread: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
  },

  Gholdengo: {
    role: 'Special Attacker',
    moves: [
      { name: 'Make It Rain',  usage: 91.7 },
      { name: 'Shadow Ball',   usage: 82.4 },
      { name: 'Nasty Plot',    usage: 54.6 },
      { name: 'Protect',       usage: 71.3 },
    ],
    items: [
      { name: 'Wise Glasses',  usage: 31.4 },
      { name: 'Choice Specs',  usage: 24.8 },
      { name: 'Life Orb',      usage: 21.2 },
    ],
    nature: 'Timid',
    ability: 'Good as Gold',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 32, spd: 0, spe: 28 },
  },

  Annihilape: {
    role: 'Physical Attacker',
    moves: [
      { name: 'Rage Fist',      usage: 91.4 },
      { name: 'Close Combat',   usage: 76.8 },
      { name: 'Shadow Claw',    usage: 61.3 },
      { name: 'Protect',        usage: 56.7 },
    ],
    items: [
      { name: 'Choice Band',    usage: 36.2 },
      { name: 'Focus Sash',     usage: 24.8 },
      { name: 'Life Orb',       usage: 19.3 },
    ],
    nature: 'Adamant',
    ability: 'Vital Spirit',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  Grimmsnarl: {
    role: 'Prankster Support',
    moves: [
      { name: 'Spirit Break',    usage: 74.3 },
      { name: 'Thunder Wave',    usage: 68.6 },
      { name: 'Parting Shot',    usage: 62.4 },
      { name: 'Protect',         usage: 54.8 },
    ],
    items: [
      { name: 'Sitrus Berry',    usage: 41.6 },
      { name: 'Black Glasses',   usage: 24.3 },
      { name: 'Light Clay',      usage: 18.7 },
    ],
    nature: 'Careful',
    ability: 'Prankster',
    spSpread: { hp: 32, atk: 0, def: 20, spa: 0, spd: 14, spe: 0 },
  },

  Cresselia: {
    role: 'Support (Trick Room)',
    moves: [
      { name: 'Trick Room',    usage: 86.4 },
      { name: 'Helping Hand',  usage: 71.3 },
      { name: 'Moonblast',     usage: 56.2 },
      { name: 'Protect',       usage: 62.8 },
    ],
    items: [
      { name: 'Mental Herb',   usage: 41.3 },
      { name: 'Sitrus Berry',  usage: 29.8 },
      { name: 'Leftovers',     usage: 19.4 },
    ],
    nature: 'Sassy',
    ability: 'Levitate',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
  },

  Amoonguss: {
    role: 'Redirection Support',
    moves: [
      { name: 'Spore',         usage: 91.4 },
      { name: 'Rage Powder',   usage: 87.6 },
      { name: 'Pollen Puff',   usage: 64.3 },
      { name: 'Protect',       usage: 56.8 },
    ],
    items: [
      { name: 'Sitrus Berry',   usage: 51.4 },
      { name: 'Rocky Helmet',   usage: 21.6 },
      { name: 'Colbur Berry',   usage: 14.3 },
    ],
    nature: 'Calm',
    ability: 'Regenerator',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
  },

  'Mega Alakazam': {
    role: 'Special Attacker',
    moves: [
      { name: 'Psychic',        usage: 86.4 },
      { name: 'Shadow Ball',    usage: 74.2 },
      { name: 'Dazzling Gleam', usage: 61.8 },
      { name: 'Protect',        usage: 64.3 },
    ],
    items: [
      { name: 'Alakazite', usage: 100 },
    ],
    nature: 'Timid',
    ability: 'Magic Guard',
    spSpread: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
  },

  'Mega Tyranitar': {
    role: 'Physical Attacker / Sand Setter',
    moves: [
      { name: 'Rock Slide',   usage: 81.4 },
      { name: 'Crunch',       usage: 76.8 },
      { name: 'Ice Punch',    usage: 62.3 },
      { name: 'Protect',      usage: 64.7 },
    ],
    items: [
      { name: 'Tyranitarite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Sand Stream',
    spSpread: { hp: 20, atk: 32, def: 0, spa: 0, spd: 14, spe: 0 },
  },

  'Mega Lucario': {
    role: 'Physical / Special Attacker',
    moves: [
      { name: 'Close Combat',   usage: 81.4 },
      { name: 'Flash Cannon',   usage: 72.6 },
      { name: 'Bullet Punch',   usage: 64.8 },
      { name: 'Protect',        usage: 61.3 },
    ],
    items: [
      { name: 'Lucarionite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Adaptability',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  Togekiss: {
    role: 'Redirection Support',
    moves: [
      { name: 'Follow Me',       usage: 76.4 },
      { name: 'Air Slash',       usage: 71.8 },
      { name: 'Dazzling Gleam',  usage: 64.3 },
      { name: 'Protect',         usage: 62.7 },
    ],
    items: [
      { name: 'Sitrus Berry',    usage: 41.3 },
      { name: 'Chople Berry',    usage: 21.6 },
      { name: 'Lum Berry',       usage: 14.8 },
    ],
    nature: 'Calm',
    ability: 'Serene Grace',
    spSpread: { hp: 32, atk: 0, def: 14, spa: 0, spd: 20, spe: 0 },
  },

  // ── C Tier ───────────────────────────────────────────────────────────────

  'Mega Absol': {
    role: 'Physical Attacker',
    moves: [
      { name: 'Sucker Punch', usage: 76.4 },
      { name: 'Play Rough',   usage: 64.8 },
      { name: 'Megahorn',     usage: 54.3 },
      { name: 'Protect',      usage: 62.1 },
    ],
    items: [
      { name: 'Absolite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Magic Bounce',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  'Alolan Raichu': {
    role: 'Special Attacker (Surge Surfer)',
    moves: [
      { name: 'Thunderbolt',    usage: 87.4 },
      { name: 'Psychic',        usage: 78.6 },
      { name: 'Fake Out',       usage: 66.3 },
      { name: 'Protect',        usage: 58.1 },
    ],
    items: [
      { name: 'Life Orb',      usage: 36.4 },
      { name: 'Sitrus Berry',  usage: 26.8 },
      { name: 'Focus Sash',    usage: 18.3 },
    ],
    nature: 'Timid',
    ability: 'Surge Surfer',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 28, spd: 0, spe: 32 },
  },

  Raichu: {
    role: 'Special Attacker',
    moves: [
      { name: 'Thunderbolt', usage: 81.6 },
      { name: 'Fake Out',    usage: 71.4 },
      { name: 'Focus Blast', usage: 63.8 },
      { name: 'Protect',     usage: 56.2 },
    ],
    items: [
      { name: 'Life Orb',     usage: 31.4 },
      { name: 'Sitrus Berry', usage: 24.8 },
      { name: 'Focus Sash',   usage: 19.2 },
    ],
    nature: 'Timid',
    ability: 'Lightning Rod',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 28, spd: 0, spe: 32 },
  },

  Mimikyu: {
    role: 'Physical Attacker',
    moves: [
      { name: 'Play Rough',    usage: 82.4 },
      { name: 'Shadow Sneak',  usage: 76.8 },
      { name: 'Shadow Claw',   usage: 61.4 },
      { name: 'Protect',       usage: 64.3 },
    ],
    items: [
      { name: 'Life Orb',      usage: 36.4 },
      { name: 'Sitrus Berry',  usage: 28.6 },
      { name: 'Focus Sash',    usage: 18.3 },
    ],
    nature: 'Jolly',
    ability: 'Disguise',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  Blaziken: {
    role: 'Physical Attacker (Speed Boost)',
    moves: [
      { name: 'Close Combat',     usage: 86.4 },
      { name: 'Blaze Kick',       usage: 74.8 },
      { name: 'High Jump Kick',   usage: 61.3 },
      { name: 'Protect',          usage: 64.2 },
    ],
    items: [
      { name: 'Focus Sash',   usage: 42.3 },
      { name: 'Life Orb',     usage: 26.4 },
      { name: 'Sitrus Berry', usage: 18.6 },
    ],
    nature: 'Jolly',
    ability: 'Speed Boost',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  'Mega Blaziken': {
    role: 'Physical / Special Attacker (Speed Boost)',
    moves: [
      { name: 'Close Combat',     usage: 86.4 },
      { name: 'Blaze Kick',       usage: 74.8 },
      { name: 'High Jump Kick',   usage: 61.3 },
      { name: 'Protect',          usage: 64.2 },
    ],
    items: [
      { name: 'Blazikenite', usage: 100 },
    ],
    nature: 'Jolly',
    ability: 'Speed Boost',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  Swampert: {
    role: 'Physical Attacker',
    moves: [
      { name: 'Earthquake',  usage: 87.3 },
      { name: 'Wave Crash',  usage: 74.8 },
      { name: 'Ice Punch',   usage: 61.4 },
      { name: 'Protect',     usage: 64.7 },
    ],
    items: [
      { name: 'Sitrus Berry', usage: 41.4 },
      { name: 'Life Orb',     usage: 26.3 },
      { name: 'Choice Band',  usage: 18.7 },
    ],
    nature: 'Adamant',
    ability: 'Swift Swim',
    spSpread: { hp: 20, atk: 32, def: 14, spa: 0, spd: 0, spe: 0 },
  },

  'Mega Swampert': {
    role: 'Physical Attacker (Rain)',
    moves: [
      { name: 'Earthquake',  usage: 87.3 },
      { name: 'Wave Crash',  usage: 74.8 },
      { name: 'Ice Punch',   usage: 61.4 },
      { name: 'Protect',     usage: 64.7 },
    ],
    items: [
      { name: 'Swampertite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Swift Swim',
    spSpread: { hp: 20, atk: 32, def: 14, spa: 0, spd: 0, spe: 0 },
  },

  Sceptile: {
    role: 'Special Attacker',
    moves: [
      { name: 'Leaf Storm',  usage: 81.4 },
      { name: 'Dragon Pulse',usage: 71.6 },
      { name: 'Focus Blast', usage: 62.3 },
      { name: 'Protect',     usage: 64.8 },
    ],
    items: [
      { name: 'Focus Sash',   usage: 36.4 },
      { name: 'Life Orb',     usage: 26.8 },
      { name: 'Choice Specs', usage: 19.3 },
    ],
    nature: 'Timid',
    ability: 'Unburden',
    spSpread: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
  },

  'Mega Sceptile': {
    role: 'Special Attacker (Lightning Rod)',
    moves: [
      { name: 'Leaf Storm',  usage: 81.4 },
      { name: 'Dragon Pulse',usage: 71.6 },
      { name: 'Focus Blast', usage: 62.3 },
      { name: 'Protect',     usage: 64.8 },
    ],
    items: [
      { name: 'Sceptilite', usage: 100 },
    ],
    nature: 'Timid',
    ability: 'Lightning Rod',
    spSpread: { hp: 2, atk: 0, def: 0, spa: 32, spd: 0, spe: 32 },
  },

  Mawile: {
    role: 'Physical Attacker',
    moves: [
      { name: 'Play Rough',   usage: 86.4 },
      { name: 'Sucker Punch', usage: 76.8 },
      { name: 'Iron Head',    usage: 71.3 },
      { name: 'Protect',      usage: 61.2 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 41.6 },
      { name: 'Choice Band',   usage: 26.3 },
      { name: 'Focus Sash',    usage: 18.7 },
    ],
    nature: 'Adamant',
    ability: 'Intimidate',
    spSpread: { hp: 20, atk: 32, def: 14, spa: 0, spd: 0, spe: 0 },
  },

  'Mega Mawile': {
    role: 'Physical Attacker (Huge Power)',
    moves: [
      { name: 'Play Rough',   usage: 86.4 },
      { name: 'Sucker Punch', usage: 76.8 },
      { name: 'Iron Head',    usage: 71.3 },
      { name: 'Protect',      usage: 61.2 },
    ],
    items: [
      { name: 'Mawilite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Huge Power',
    spSpread: { hp: 20, atk: 32, def: 14, spa: 0, spd: 0, spe: 0 },
  },

  Metagross: {
    role: 'Physical Attacker',
    moves: [
      { name: 'Iron Head',     usage: 87.4 },
      { name: 'Zen Headbutt',  usage: 76.8 },
      { name: 'Ice Punch',     usage: 64.3 },
      { name: 'Protect',       usage: 61.7 },
    ],
    items: [
      { name: 'Sitrus Berry',  usage: 36.4 },
      { name: 'Choice Band',   usage: 26.8 },
      { name: 'Air Balloon',   usage: 18.3 },
    ],
    nature: 'Adamant',
    ability: 'Clear Body',
    spSpread: { hp: 20, atk: 32, def: 0, spa: 0, spd: 0, spe: 14 },
  },

  'Mega Metagross': {
    role: 'Physical Attacker (Tough Claws)',
    moves: [
      { name: 'Iron Head',     usage: 87.4 },
      { name: 'Zen Headbutt',  usage: 76.8 },
      { name: 'Ice Punch',     usage: 64.3 },
      { name: 'Protect',       usage: 61.7 },
    ],
    items: [
      { name: 'Metagrossite', usage: 100 },
    ],
    nature: 'Adamant',
    ability: 'Tough Claws',
    spSpread: { hp: 20, atk: 32, def: 0, spa: 0, spd: 0, spe: 14 },
  },

  // ── Rotom variants ───────────────────────────────────────────────────────

  'Rotom-Frost': {
    role: 'Special Attacker (Blizzard)',
    moves: [
      { name: 'Blizzard',     usage: 92.4 },
      { name: 'Thunderbolt',  usage: 81.3 },
      { name: 'Will-O-Wisp',  usage: 63.7 },
      { name: 'Protect',      usage: 58.2 },
    ],
    items: [
      { name: 'Sitrus Berry', usage: 44.2 },
      { name: 'Shuca Berry',  usage: 22.6 },
      { name: 'Leftovers',    usage: 18.4 },
    ],
    nature: 'Modest',
    ability: 'Levitate',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 20, spd: 14, spe: 0 },
  },

  'Rotom-Fan': {
    role: 'Special Attacker / Speed Control',
    moves: [
      { name: 'Air Slash',    usage: 88.3 },
      { name: 'Thunderbolt',  usage: 79.4 },
      { name: 'Icy Wind',     usage: 63.2 },
      { name: 'Protect',      usage: 61.8 },
    ],
    items: [
      { name: 'Sitrus Berry',   usage: 43.6 },
      { name: 'Rocky Helmet',   usage: 22.3 },
      { name: 'Leftovers',      usage: 18.1 },
    ],
    nature: 'Timid',
    ability: 'Levitate',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 20, spd: 0, spe: 14 },
  },

  'Rotom-Mow': {
    role: 'Special Attacker / Speed Control',
    moves: [
      { name: 'Leaf Storm',   usage: 84.7 },
      { name: 'Thunderbolt',  usage: 76.3 },
      { name: 'Icy Wind',     usage: 64.8 },
      { name: 'Protect',      usage: 58.4 },
    ],
    items: [
      { name: 'Sitrus Berry', usage: 42.1 },
      { name: 'Shuca Berry',  usage: 24.3 },
      { name: 'Leftovers',    usage: 17.8 },
    ],
    nature: 'Timid',
    ability: 'Levitate',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 12, spd: 0, spe: 22 },
  },

  // ── M-B supplement entries ────────────────────────────────────────────────

  Eelektross: {
    role: 'Mixed Attacker (No Weakness)',
    moves: [
      { name: 'Wild Charge',   usage: 88.3 },
      { name: 'Drain Punch',   usage: 76.4 },
      { name: 'Flamethrower',  usage: 64.2 },
      { name: 'Protect',       usage: 57.8 },
    ],
    items: [
      { name: 'Life Orb',      usage: 38.4 },
      { name: 'Assault Vest',  usage: 26.2 },
      { name: 'Choice Band',   usage: 18.7 },
    ],
    nature: 'Adamant',
    ability: 'Levitate',
    spSpread: { hp: 20, atk: 32, def: 0, spa: 0, spd: 14, spe: 0 },
  },

  Scolipede: {
    role: 'Lead / Speed Boost Attacker',
    moves: [
      { name: 'Megahorn',    usage: 87.4 },
      { name: 'Rock Slide',  usage: 76.8 },
      { name: 'Earthquake',  usage: 64.3 },
      { name: 'Protect',     usage: 62.7 },
    ],
    items: [
      { name: 'Focus Sash',  usage: 46.2 },
      { name: 'Life Orb',    usage: 26.4 },
      { name: 'Choice Band', usage: 18.3 },
    ],
    nature: 'Adamant',
    ability: 'Speed Boost',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  Scrafty: {
    role: 'Trick Room Physical Attacker',
    moves: [
      { name: 'High Jump Kick', usage: 87.6 },
      { name: 'Fake Out',       usage: 76.8 },
      { name: 'Crunch',         usage: 64.3 },
      { name: 'Protect',        usage: 56.7 },
    ],
    items: [
      { name: 'Sitrus Berry',   usage: 41.4 },
      { name: 'Assault Vest',   usage: 26.8 },
      { name: 'Iapapa Berry',   usage: 18.4 },
    ],
    nature: 'Brave',
    ability: 'Moxie',
    spSpread: { hp: 32, atk: 32, def: 2, spa: 0, spd: 0, spe: 0 },
  },

  Barbaracle: {
    role: 'Shell Smash Sweeper',
    moves: [
      { name: 'Shell Smash',  usage: 92.3 },
      { name: 'Razor Shell',  usage: 83.4 },
      { name: 'Cross Chop',   usage: 71.2 },
      { name: 'Protect',      usage: 64.8 },
    ],
    items: [
      { name: 'Focus Sash',   usage: 52.1 },
      { name: 'White Herb',   usage: 28.4 },
      { name: 'Life Orb',     usage: 14.7 },
    ],
    nature: 'Adamant',
    ability: 'Tough Claws',
    spSpread: { hp: 6, atk: 32, def: 0, spa: 0, spd: 0, spe: 28 },
  },

  Dragalge: {
    role: 'Special Attacker (Adaptability)',
    moves: [
      { name: 'Draco Meteor',  usage: 87.4 },
      { name: 'Sludge Wave',   usage: 79.3 },
      { name: 'Scald',         usage: 64.8 },
      { name: 'Protect',       usage: 58.3 },
    ],
    items: [
      { name: 'Assault Vest',  usage: 44.2 },
      { name: 'Sitrus Berry',  usage: 28.6 },
      { name: 'Choice Specs',  usage: 16.4 },
    ],
    nature: 'Quiet',
    ability: 'Adaptability',
    spSpread: { hp: 32, atk: 0, def: 0, spa: 20, spd: 14, spe: 0 },
  },

  Falinks: {
    role: 'No Retreat Sweeper',
    moves: [
      { name: 'No Retreat',    usage: 92.4 },
      { name: 'Close Combat',  usage: 86.8 },
      { name: 'Throat Chop',   usage: 71.3 },
      { name: 'Protect',       usage: 64.7 },
    ],
    items: [
      { name: 'Focus Sash',    usage: 48.3 },
      { name: 'Life Orb',      usage: 28.4 },
      { name: 'Choice Band',   usage: 16.2 },
    ],
    nature: 'Jolly',
    ability: 'Battle Armor',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  Malamar: {
    role: 'Contrary Sweeper (Superpower)',
    moves: [
      { name: 'Superpower',  usage: 94.7 },
      { name: 'Knock Off',   usage: 82.3 },
      { name: 'Trick Room',  usage: 62.4 },
      { name: 'Protect',     usage: 54.8 },
    ],
    items: [
      { name: 'Assault Vest', usage: 42.1 },
      { name: 'Life Orb',     usage: 26.4 },
      { name: 'Sitrus Berry', usage: 18.7 },
    ],
    nature: 'Brave',
    ability: 'Contrary',
    spSpread: { hp: 32, atk: 32, def: 2, spa: 0, spd: 0, spe: 0 },
  },

  Pyroar: {
    role: 'Special Attacker',
    moves: [
      { name: 'Heat Wave',    usage: 88.4 },
      { name: 'Hyper Voice',  usage: 79.3 },
      { name: 'Fire Blast',   usage: 68.7 },
      { name: 'Protect',      usage: 61.4 },
    ],
    items: [
      { name: 'Life Orb',      usage: 36.4 },
      { name: 'Choice Specs',  usage: 26.8 },
      { name: 'Sitrus Berry',  usage: 19.3 },
    ],
    nature: 'Timid',
    ability: 'Moxie',
    spSpread: { hp: 6, atk: 0, def: 0, spa: 28, spd: 0, spe: 32 },
  },

  'Mega Garchomp': {
    role: 'Physical Sweeper (Sand Force)',
    moves: [
      { name: 'Earthquake',  usage: 94.8 },
      { name: 'Dragon Claw', usage: 83.7 },
      { name: 'Rock Slide',  usage: 71.2 },
      { name: 'Protect',     usage: 63.4 },
    ],
    items: [
      { name: 'Garchompite', usage: 100 },
    ],
    nature: 'Jolly',
    ability: 'Sand Force',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

  'Mega Victreebel': {
    role: 'Trick Room Mixed Attacker (Innards Out)',
    moves: [
      { name: 'Power Whip',    usage: 87.4 },
      { name: 'Sludge Bomb',   usage: 79.3 },
      { name: 'Leaf Storm',    usage: 64.8 },
      { name: 'Protect',       usage: 58.6 },
    ],
    items: [
      { name: 'Victreebelite', usage: 100 },
    ],
    nature: 'Brave',
    ability: 'Innards Out',
    spSpread: { hp: 32, atk: 20, def: 0, spa: 14, spd: 0, spe: 0 },
  },

  Staraptor: {
    role: 'Physical Attacker (Reckless)',
    moves: [
      { name: 'Brave Bird',    usage: 92.4 },
      { name: 'Close Combat',  usage: 76.8 },
      { name: 'Double-Edge',   usage: 61.3 },
      { name: 'Protect',       usage: 64.7 },
    ],
    items: [
      { name: 'Choice Band',   usage: 41.4 },
      { name: 'Choice Scarf',  usage: 26.8 },
      { name: 'Life Orb',      usage: 18.4 },
    ],
    nature: 'Jolly',
    ability: 'Reckless',
    spSpread: { hp: 2, atk: 32, def: 0, spa: 0, spd: 0, spe: 32 },
  },

};

export function getCompetitiveSet(name: string): CompetitiveSet | null {
  return COMPETITIVE_SETS[name] ?? null;
}
