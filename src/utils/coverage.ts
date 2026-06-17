import { ALL_TYPES, TYPE_CHART, getDefensiveEffectiveness } from '../data/typeChart';
import type { PokemonType, TeamMember } from '../types/pokemon';

export interface TeamCoverage {
  defensiveWeaknesses: Array<{ type: PokemonType; multiplier: number; count: number }>;
  defensiveResistances: Array<{ type: PokemonType; count: number }>;
  offensiveCoverage: PokemonType[];   // types the team hits super effectively
  offensiveGaps: PokemonType[];       // types not hit super effectively
  typeDistribution: Record<PokemonType, number>;
}

export function analyzeTeamCoverage(members: (TeamMember | null)[]): TeamCoverage {
  const active = members.filter(Boolean) as TeamMember[];

  // Defensive: check weaknesses/resistances for team as a whole
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
    .map(t => ({
      type: t,
      multiplier: 2,
      count: weaknessCount[t] ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  const defensiveResistances = ALL_TYPES
    .filter(t => (resistanceCount[t] ?? 0) > 0)
    .map(t => ({ type: t, count: resistanceCount[t] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  // Offensive: collect move types used by the team
  const coveredTypes = new Set<PokemonType>();
  for (const member of active) {
    for (const move of member.moves) {
      if (move.category !== 'Status') {
        // Check which types this move hits super effectively
        for (const defType of ALL_TYPES) {
          if (TYPE_CHART[move.type][defType] >= 2) {
            coveredTypes.add(defType);
          }
        }
      }
    }
    // Also consider STAB coverage
    for (const pokeType of member.pokemon.types) {
      for (const defType of ALL_TYPES) {
        if (TYPE_CHART[pokeType][defType] >= 2) {
          coveredTypes.add(defType);
        }
      }
    }
  }

  const offensiveCoverage = ALL_TYPES.filter(t => coveredTypes.has(t));
  const offensiveGaps = ALL_TYPES.filter(t => !coveredTypes.has(t));

  // Type distribution across team
  const typeDistribution: Partial<Record<PokemonType, number>> = {};
  for (const member of active) {
    for (const t of member.pokemon.types) {
      typeDistribution[t] = (typeDistribution[t] ?? 0) + 1;
    }
  }

  return {
    defensiveWeaknesses,
    defensiveResistances,
    offensiveCoverage,
    offensiveGaps,
    typeDistribution: typeDistribution as Record<PokemonType, number>,
  };
}

export function suggestTypes(members: (TeamMember | null)[]): PokemonType[] {
  const coverage = analyzeTeamCoverage(members);
  // Suggest types that cover our biggest weaknesses
  const weaknessTypes = coverage.defensiveWeaknesses
    .filter(w => w.count >= 2)
    .map(w => w.type);

  // Find types that resist our top weaknesses
  const suggestions: Map<PokemonType, number> = new Map();
  for (const weakType of weaknessTypes) {
    for (const t of ALL_TYPES) {
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
