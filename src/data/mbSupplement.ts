import type { Pokemon } from '../types/pokemon';

// M-B Pokemon missing from the otterlyclueless data repo (last updated April 2026).
// Base stats from standard series — Champions uses identical base stats.
// Remove entries here once the live repo is updated to avoid duplicates.
export const MB_SUPPLEMENT: Pokemon[] = [

  // ── Rotom appliance forms ─────────────────────────────────────────────────
  // The data repo only has base Rotom (Electric/Ghost).
  // All appliance forms share identical stats; only the secondary type differs.
  {
    name: 'Rotom-Heat', dexNumber: 479, form: 'Variant',
    types: ['Electric', 'Fire'],
    abilities: { '0': 'Levitate' },
    championsVerified: false,
    hp: 50, atk: 65, def: 107, spa: 105, spd: 107, spe: 86, total: 520,
  },
  {
    name: 'Rotom-Wash', dexNumber: 479, form: 'Variant',
    types: ['Electric', 'Water'],
    abilities: { '0': 'Levitate' },
    championsVerified: false,
    hp: 50, atk: 65, def: 107, spa: 105, spd: 107, spe: 86, total: 520,
  },
  {
    name: 'Rotom-Frost', dexNumber: 479, form: 'Variant',
    types: ['Electric', 'Ice'],
    abilities: { '0': 'Levitate' },
    championsVerified: false,
    hp: 50, atk: 65, def: 107, spa: 105, spd: 107, spe: 86, total: 520,
  },
  {
    name: 'Rotom-Fan', dexNumber: 479, form: 'Variant',
    types: ['Electric', 'Flying'],
    abilities: { '0': 'Levitate' },
    championsVerified: false,
    hp: 50, atk: 65, def: 107, spa: 105, spd: 107, spe: 86, total: 520,
  },
  {
    name: 'Rotom-Mow', dexNumber: 479, form: 'Variant',
    types: ['Electric', 'Grass'],
    abilities: { '0': 'Levitate' },
    championsVerified: false,
    hp: 50, atk: 65, def: 107, spa: 105, spd: 107, spe: 86, total: 520,
  },

  // ── Regulation M-B Megas: new Champions-exclusive forms (not in live repo) ─
  // Stats marked with * are estimated; confirmed fields noted in comments.
  {
    // Confirmed: Fighting/Flying type, ability Contrary, stone Staraptite
    name: 'Mega Staraptor', dexNumber: 398, form: 'Mega',
    types: ['Fighting', 'Flying'],
    abilities: { '0': 'Contrary' },
    championsVerified: false,
    hp: 85, atk: 155, def: 80, spa: 55, spd: 70, spe: 140, total: 585,
  },
  {
    // Confirmed: ability Electric Surge, ATK 135, DEF 95, SpD 95, HP 60, SpA 90
    // Type Electric/Fighting inferred from Volt Tackle + Close Combat usage
    name: 'Mega Raichu X', dexNumber: 26, form: 'Mega',
    types: ['Electric', 'Fighting'],
    abilities: { '0': 'Electric Surge' },
    championsVerified: false,
    hp: 60, atk: 135, def: 95, spa: 90, spd: 95, spe: 110, total: 585,
  },
  {
    // Confirmed: HP 60, ATK 100, DEF 55, SpA 160, SpD 80, SPE 130 (total 585)
    name: 'Mega Raichu Y', dexNumber: 26, form: 'Mega',
    types: ['Electric'],
    abilities: { '0': 'Galvanize' },
    championsVerified: false,
    hp: 60, atk: 100, def: 55, spa: 160, spd: 80, spe: 130, total: 585,
  },
  {
    // Champions-exclusive Mega; ability Eelevate confirmed (new ability)
    name: 'Mega Eelektross', dexNumber: 604, form: 'Mega',
    types: ['Electric'],
    abilities: { '0': 'Eelevate' },
    championsVerified: false,
    hp: 85, atk: 145, def: 95, spa: 135, spd: 95, spe: 60, total: 615,
  },
  {
    // Champions-exclusive Mega; ability Fire Mane confirmed (new ability)
    name: 'Mega Pyroar', dexNumber: 668, form: 'Mega',
    types: ['Fire', 'Normal'],
    abilities: { '0': 'Fire Mane' },
    championsVerified: false,
    hp: 86, atk: 80, def: 82, spa: 149, spd: 84, spe: 126, total: 607,
  },
  {
    // Champions-exclusive Mega
    name: 'Mega Falinks', dexNumber: 870, form: 'Mega',
    types: ['Fighting'],
    abilities: { '0': 'Iron Fist' },
    championsVerified: false,
    hp: 65, atk: 140, def: 130, spa: 70, spd: 80, spe: 95, total: 580,
  },
  {
    // Champions-exclusive Mega
    name: 'Mega Scrafty', dexNumber: 560, form: 'Mega',
    types: ['Dark', 'Fighting'],
    abilities: { '0': 'Moxie' },
    championsVerified: false,
    hp: 75, atk: 130, def: 125, spa: 45, spd: 125, spe: 88, total: 588,
  },

  // ── Regulation M-B Megas: missing from base-stats.json ───────────────────
  // These ARE in the live roster.json (championsVerified: true) but have no
  // entry in base-stats.json, so they appear with all-zero stats.
  // The hook uses these as a stat fallback; types/abilities come from the roster.
  {
    name: 'Mega Alakazam', dexNumber: 65, form: 'Mega',
    types: ['Psychic'],
    abilities: { '0': 'Trace' },
    championsVerified: false,
    hp: 55, atk: 50, def: 65, spa: 175, spd: 105, spe: 150, total: 600,
  },
  {
    name: 'Mega Garchomp', dexNumber: 445, form: 'Mega',
    types: ['Dragon', 'Ground'],
    abilities: { '0': 'Sand Force' },
    championsVerified: false,
    hp: 108, atk: 170, def: 115, spa: 120, spd: 95, spe: 92, total: 700,
  },
  {
    name: 'Mega Victreebel', dexNumber: 71, form: 'Mega',
    types: ['Grass', 'Poison'],
    abilities: { '0': 'Innards Out' },
    championsVerified: false,
    hp: 100, atk: 130, def: 85, spa: 130, spd: 90, spe: 65, total: 600,
  },

  // ── Mega Eiscue — Champions-exclusive Mega, not in live repo at all ───────
  {
    name: 'Mega Eiscue', dexNumber: 875, form: 'Mega',
    types: ['Ice'],
    abilities: { '0': 'Ice Face' },
    championsVerified: false,
    hp: 85, atk: 140, def: 110, spa: 65, spd: 90, spe: 110, total: 600,
  },

  // ── Basculegion female form ───────────────────────────────────────────────
  // The data repo only has Basculegion (male: 112 ATK / 80 SPA).
  // Female redistributes: 92 ATK / 100 SPA — more of a special attacker.
  {
    name: 'Basculegion-F', dexNumber: 902, form: 'Variant',
    types: ['Water', 'Ghost'],
    abilities: { '0': 'Swift Swim', '1': 'Adaptability', H: 'Rattled' },
    championsVerified: false,
    hp: 120, atk: 92, def: 65, spa: 100, spd: 75, spe: 78, total: 530,
  },
  {
    name: 'Blaziken', dexNumber: 257, form: 'Base',
    types: ['Fire', 'Fighting'],
    abilities: { '0': 'Blaze', H: 'Speed Boost' },
    championsVerified: false,
    hp: 80, atk: 120, def: 70, spa: 110, spd: 70, spe: 80, total: 530,
  },
  {
    name: 'Mega Blaziken', dexNumber: 257, form: 'Mega',
    types: ['Fire', 'Fighting'],
    abilities: { '0': 'Speed Boost' },
    championsVerified: false,
    hp: 80, atk: 160, def: 80, spa: 130, spd: 80, spe: 100, total: 630,
  },
  {
    name: 'Sceptile', dexNumber: 254, form: 'Base',
    types: ['Grass'],
    abilities: { '0': 'Overgrow', H: 'Unburden' },
    championsVerified: false,
    hp: 70, atk: 85, def: 65, spa: 105, spd: 85, spe: 120, total: 530,
  },
  {
    name: 'Mega Sceptile', dexNumber: 254, form: 'Mega',
    types: ['Grass', 'Dragon'],
    abilities: { '0': 'Lightning Rod' },
    championsVerified: false,
    hp: 70, atk: 110, def: 75, spa: 145, spd: 85, spe: 145, total: 630,
  },
  {
    name: 'Swampert', dexNumber: 260, form: 'Base',
    types: ['Water', 'Ground'],
    abilities: { '0': 'Torrent', H: 'Swift Swim' },
    championsVerified: false,
    hp: 100, atk: 110, def: 90, spa: 85, spd: 90, spe: 60, total: 535,
  },
  {
    name: 'Mega Swampert', dexNumber: 260, form: 'Mega',
    types: ['Water', 'Ground'],
    abilities: { '0': 'Swift Swim' },
    championsVerified: false,
    hp: 100, atk: 150, def: 110, spa: 95, spd: 110, spe: 70, total: 635,
  },
  {
    name: 'Mawile', dexNumber: 303, form: 'Base',
    types: ['Steel', 'Fairy'],
    abilities: { '0': 'Hyper Cutter', '1': 'Intimidate', H: 'Sheer Force' },
    championsVerified: false,
    hp: 50, atk: 85, def: 85, spa: 55, spd: 55, spe: 50, total: 380,
  },
  {
    name: 'Mega Mawile', dexNumber: 303, form: 'Mega',
    types: ['Steel', 'Fairy'],
    abilities: { '0': 'Huge Power' },
    championsVerified: false,
    hp: 50, atk: 105, def: 125, spa: 55, spd: 95, spe: 50, total: 480,
  },
  {
    name: 'Staraptor', dexNumber: 398, form: 'Base',
    types: ['Normal', 'Flying'],
    abilities: { '0': 'Intimidate', '1': 'Reckless' },
    championsVerified: false,
    hp: 85, atk: 120, def: 70, spa: 50, spd: 60, spe: 100, total: 485,
  },
  {
    name: 'Raichu', dexNumber: 26, form: 'Base',
    types: ['Electric'],
    abilities: { '0': 'Static', H: 'Lightning Rod' },
    championsVerified: false,
    hp: 60, atk: 90, def: 55, spa: 90, spd: 80, spe: 110, total: 485,
  },
  {
    name: 'Eelektross', dexNumber: 604, form: 'Base',
    types: ['Electric'],
    abilities: { '0': 'Levitate' },
    championsVerified: false,
    hp: 85, atk: 115, def: 80, spa: 105, spd: 80, spe: 50, total: 515,
  },
  {
    name: 'Scolipede', dexNumber: 545, form: 'Base',
    types: ['Bug', 'Poison'],
    abilities: { '0': 'Poison Point', '1': 'Swarm', H: 'Speed Boost' },
    championsVerified: false,
    hp: 60, atk: 100, def: 89, spa: 55, spd: 69, spe: 112, total: 485,
  },
  {
    name: 'Scrafty', dexNumber: 560, form: 'Base',
    types: ['Dark', 'Fighting'],
    abilities: { '0': 'Shed Skin', '1': 'Moxie', H: 'Intimidate' },
    championsVerified: false,
    hp: 65, atk: 90, def: 115, spa: 45, spd: 115, spe: 58, total: 488,
  },
  {
    name: 'Barbaracle', dexNumber: 689, form: 'Base',
    types: ['Water', 'Rock'],
    abilities: { '0': 'Tough Claws', '1': 'Sniper', H: 'Pickpocket' },
    championsVerified: false,
    hp: 72, atk: 105, def: 115, spa: 54, spd: 86, spe: 68, total: 500,
  },
  {
    name: 'Dragalge', dexNumber: 691, form: 'Base',
    types: ['Poison', 'Dragon'],
    abilities: { '0': 'Poison Point', '1': 'Poison Touch', H: 'Adaptability' },
    championsVerified: false,
    hp: 65, atk: 75, def: 90, spa: 97, spd: 123, spe: 44, total: 494,
  },
  {
    name: 'Falinks', dexNumber: 870, form: 'Base',
    types: ['Fighting'],
    abilities: { '0': 'Battle Armor', H: 'Defiant' },
    championsVerified: false,
    hp: 65, atk: 100, def: 100, spa: 70, spd: 60, spe: 85, total: 480,
  },
  {
    name: 'Malamar', dexNumber: 686, form: 'Base',
    types: ['Dark', 'Psychic'],
    abilities: { '0': 'Contrary', '1': 'Suction Cups', H: 'Infiltrator' },
    championsVerified: false,
    hp: 86, atk: 92, def: 88, spa: 68, spd: 75, spe: 73, total: 482,
  },
  {
    name: 'Pyroar', dexNumber: 668, form: 'Base',
    types: ['Fire', 'Normal'],
    abilities: { '0': 'Rivalry', '1': 'Unnerve', H: 'Moxie' },
    championsVerified: false,
    hp: 86, atk: 68, def: 72, spa: 109, spd: 66, spe: 106, total: 507,
  },
  {
    name: 'Metagross', dexNumber: 376, form: 'Base',
    types: ['Steel', 'Psychic'],
    abilities: { '0': 'Clear Body', H: 'Light Metal' },
    championsVerified: false,
    hp: 80, atk: 135, def: 130, spa: 95, spd: 90, spe: 70, total: 600,
  },
  {
    name: 'Mega Metagross', dexNumber: 376, form: 'Mega',
    types: ['Steel', 'Psychic'],
    abilities: { '0': 'Tough Claws' },
    championsVerified: false,
    hp: 80, atk: 145, def: 150, spa: 105, spd: 110, spe: 110, total: 700,
  },
  {
    name: 'Annihilape', dexNumber: 979, form: 'Base',
    types: ['Fighting', 'Ghost'],
    abilities: { '0': 'Vital Spirit', '1': 'Inner Focus', H: 'Defiant' },
    championsVerified: false,
    hp: 110, atk: 115, def: 80, spa: 50, spd: 90, spe: 90, total: 535,
  },
  {
    name: 'Gholdengo', dexNumber: 1000, form: 'Base',
    types: ['Steel', 'Ghost'],
    abilities: { '0': 'Good as Gold' },
    championsVerified: false,
    hp: 87, atk: 60, def: 95, spa: 133, spd: 91, spe: 84, total: 550,
  },
  {
    name: 'Grimmsnarl', dexNumber: 861, form: 'Base',
    types: ['Dark', 'Fairy'],
    abilities: { '0': 'Prankster', '1': 'Frisk', H: 'Pickpocket' },
    championsVerified: false,
    hp: 95, atk: 120, def: 65, spa: 95, spd: 75, spe: 60, total: 510,
  },
];
