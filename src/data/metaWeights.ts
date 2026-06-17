// Meta usage weights for Regulation M-A (final) / M-B (early).
// Source: Pikalytics, ChampionsMeta.io, Smogon viability rankings.
// Scale: 0-10. Pokemon not listed default to 1 (present but unranked).
// Names match the otterlyclueless roster format ("Mega X" not "X-Mega").

export const META_WEIGHTS: Record<string, number> = {
  // ── Tier S / 40%+ usage ──────────────────────────────────
  'Basculegion':          10,
  'Kingambit':            10,
  'Garchomp':             10,

  // ── Tier A+ / 25-40% usage ───────────────────────────────
  'Mega Charizard Y':      8,
  'Sneasler':              8,
  'Incineroar':            8,

  // ── Tier A / 15-25% usage ────────────────────────────────
  'Mega Eiscue':           7,
  'Sinistcha':             7,
  'Sylveon':               7,
  'Whimsicott':            7,
  'Archaludon':            7,
  'Farigiraf':             7,
  'Corviknight':           7,
  'Primarina':             7,
  'Meowscarada':           7,

  // ── Tier A- / 7-15% usage ────────────────────────────────
  'Mega Aerodactyl':       5,
  'Pelipper':              5,
  'Sableye':               5,
  'Mega Dragonite':        5,
  'Maushold':              5,
  'Aegislash':             5,
  'Mega Blastoise':        5,
  'Rotom-Wash':            5,
  'Mega Gengar':           5,
  'Mega Lopunny':          5,
  'Mega Venusaur':         5,
  'Mega Scizor':           5,
  'Mega Kangaskhan':       5,
  'Hippowdon':             5,
  'Glimmora':              5,
  'Mega Delphox':          5,
  'Talonflame':            5,
  'Gastrodon':             5,
  'Palafin':               5,

  // ── Tier B / solid situational picks ─────────────────────
  'Mega Charizard X':      4,
  'Mega Floette':          4,
  'Hatterene':             4,
  'Torkoal':               4,
  'Mega Gyarados':         4,
  'Salamence':             4,
  'Mega Salamence':        4,
  'Dragonite':             4,
  'Iron Bundle':           3, // legal in Champions despite Paradox status
  'Gholdengo':             4,
  'Annihilape':            4,
  'Grimmsnarl':            4,
  'Cresselia':             4,
  'Amoonguss':             4,
  'Mega Alakazam':         4,
  'Mega Tyranitar':        4,
  'Mega Lucario':          4,
  'Mega Absol':            3,
  'Togekiss':              4,
  'Raichu':                3,

  // ── Tier C / niche / low usage ───────────────────────────
  'Klefki':                2,
  'Rillaboom':             2,
  'Breloom':               2,
  'Mega Steelix':          2,
  'Mega Beedrill':         2,
  'Mimikyu':               3,
  'Smeargle':              2,
  'Scrafty':               2,
  'Blaziken':              3,
  'Mega Blaziken':         4,
  'Swampert':              3,
  'Mega Swampert':         5,
  'Sceptile':              2,
  'Mega Sceptile':         3,
  'Mawile':                2,
  'Mega Mawile':           4,
  'Metagross':             4,
  'Mega Metagross':        5,
  'Staraptor':             3,
};

export function getMetaWeight(name: string): number {
  return META_WEIGHTS[name] ?? 1;
}

export function getMetaTier(weight: number): string {
  if (weight >= 10) return 'S';
  if (weight >= 8)  return 'A+';
  if (weight >= 7)  return 'A';
  if (weight >= 5)  return 'A-';
  if (weight >= 4)  return 'B';
  if (weight >= 3)  return 'C';
  if (weight >= 2)  return 'D';
  return '?';
}
