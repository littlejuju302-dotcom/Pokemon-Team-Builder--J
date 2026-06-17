import { ALL_TYPES, TYPE_CHART, getDefensiveEffectiveness } from '../data/typeChart';
import type { PokemonType, TeamMember } from '../types/pokemon';

export interface TeamCoverage {
  defensiveWeaknesses: Array<{ type: PokemonType; multiplier: number; count: number }>;
  defensiveResistances: Array<{ type: PokemonType; count: number }>;
  offensiveCoverage: PokemonType[];
  offensiveGaps: PokemonType[];
  typeDistribution: Record<PokemonType, number>;
  existingTypes: Set<PokemonType>;
}

export function analyzeTeamCoverage(members: (TeamMember | null)[]): TeamCoverage {
  const active = members.filter(Boolean) as TeamMember[];

  const weaknessCount: Partial<Record<PokemonType, number>> = {};
  const resistanceCount: Partial<Record<PokemonType, number>> = {};

  for (const member of active) {
    const effectiveness = getDefensiveEffectiveness(member.pokemon.types);
    for (const type of ALL_TYPES) {
      const val = effectiveness[type];
      if (val > 1) {
        weaknessCount[type] = (weaknessCount[type] ?? 0) + 1;
      } else if (val < 1 && val > 0) {
        resistanceCount[type] = (resistanceCount[type] ?? 0) + 1;
      }
    }
  }

  const defensiveWeaknesses = ALL_TYPES
    .filter(t => (weaknessCount[t] ?? 0) > 0)
    .map(t => ({ type: t, multiplier: 2, count: weaknessCount[t] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const defensiveResistances = ALL_TYPES
    .filter(t => (resistanceCount[t] ?? 0) > 0)
    .map(t => ({ type: t, count: resistanceCount[t] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  // Offensive coverage: types the team can hit super effectively (via STAB or moves)
  const coveredTypes = new Set<PokemonType>();
  for (const member of active) {
    for (const move of member.moves) {
      if (move.category !== 'Status') {
        for (const defType of ALL_TYPES) {
          if (TYPE_CHART[move.type][defType] >= 2) coveredTypes.add(defType);
        }
      }
    }
    for (const pokeType of member.pokemon.types) {
      for (const defType of ALL_TYPES) {
        if (TYPE_CHART[pokeType][defType] >= 2) coveredTypes.add(defType);
      }
    }
  }

  const offensiveCoverage = ALL_TYPES.filter(t => coveredTypes.has(t));
  const offensiveGaps = ALL_TYPES.filter(t => !coveredTypes.has(t));

  const typeDistribution: Partial<Record<PokemonType, number>> = {};
  const existingTypes = new Set<PokemonType>();
  for (const member of active) {
    for (const t of member.pokemon.types) {
      typeDistribution[t] = (typeDistribution[t] ?? 0) + 1;
      existingTypes.add(t);
    }
  }

  return {
    defensiveWeaknesses,
    defensiveResistances,
    offensiveCoverage,
    offensiveGaps,
    typeDistribution: typeDistribution as Record<PokemonType, number>,
    existingTypes,
  };
}

export function suggestTypes(members: (TeamMember | null)[]): PokemonType[] {
  const active = members.filter(Boolean) as TeamMember[];
  const coverage = analyzeTeamCoverage(members);

  // Collect types already on the team — don't suggest more of the same
  const existingTypes = coverage.existingTypes;

  // Use a lower threshold for small teams so suggestions appear sooner
  const minCount = active.length <= 2 ? 1 : 2;
  const weaknessTypes = coverage.defensiveWeaknesses
    .filter(w => w.count >= minCount)
    .map(w => w.type);

  if (weaknessTypes.length === 0) return [];

  // Score each type NOT already on the team by how many weaknesses it resists
  const suggestions: Map<PokemonType, number> = new Map();
  for (const weakType of weaknessTypes) {
    for (const t of ALL_TYPES) {
      if (existingTypes.has(t)) continue; // skip types already on the team
      if (TYPE_CHART[weakType][t] <= 0.5) {
        suggestions.set(t, (suggestions.get(t) ?? 0) + 1);
      }
    }
  }

  return [...suggestions.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t)
    .slice(0, 4);
}

export function scoreCandidate(
  candidateTypes: PokemonType[],
  coverage: TeamCoverage,
  suggestedTypes: PokemonType[],
  bst: number
): number {
  const eff = getDefensiveEffectiveness(candidateTypes);
  let score = 0;

  // Resist team weaknesses — more valuable when more members share the weakness
  for (const { type, count } of coverage.defensiveWeaknesses) {
    if (eff[type] === 0) score += count * 5;       // immune: best
    else if (eff[type] <= 0.5) score += count * 3; // resists
    else if (eff[type] >= 2) score -= count * 2;   // also weak: bad
  }

  // STAB matches a suggested new type (types not on team that would help defensively)
  for (const t of candidateTypes) {
    if (suggestedTypes.includes(t)) score += 4;
  }

  // Covers offensive gaps the team currently has, via STAB
  for (const t of candidateTypes) {
    for (const defType of coverage.offensiveGaps) {
      if (TYPE_CHART[t][defType] >= 2) score += 2;
    }
  }

  // Penalise type overlap — sharing a type with the team doesn't add new coverage
  for (const t of candidateTypes) {
    if (coverage.existingTypes.has(t)) score -= 1.5;
  }

  // Slight BST bonus so among equally-synergistic picks the stronger one wins
  score += bst / 250;

  return score;
}
