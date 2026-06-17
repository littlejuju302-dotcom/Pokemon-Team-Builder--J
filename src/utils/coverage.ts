import { ALL_TYPES, TYPE_CHART, getDefensiveEffectiveness } from '../data/typeChart';
import { getMetaWeight } from '../data/metaWeights';
import type { PokemonType, TeamMember, BaseStats } from '../types/pokemon';

export interface TeamCoverage {
  defensiveWeaknesses: Array<{ type: PokemonType; multiplier: number; count: number }>;
  defensiveResistances: Array<{ type: PokemonType; count: number }>;
  offensiveCoverage: PokemonType[];
  offensiveGaps: PokemonType[];
  typeDistribution: Record<PokemonType, number>;
  existingTypes: Set<PokemonType>;
  offensiveBias: 'physical' | 'special' | 'balanced';
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

  // Offensive coverage via STAB and selected moves
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

  // Detect whether team leans physical, special, or balanced
  let physicalCount = 0;
  let specialCount = 0;
  for (const member of active) {
    const { atk, spa } = member.pokemon;
    if (atk > spa + 15) physicalCount++;
    else if (spa > atk + 15) specialCount++;
    // within 15 pts = mixed / irrelevant
  }
  let offensiveBias: 'physical' | 'special' | 'balanced' = 'balanced';
  if (active.length >= 2) {
    if (physicalCount >= active.length - 1 && specialCount === 0) offensiveBias = 'physical';
    else if (specialCount >= active.length - 1 && physicalCount === 0) offensiveBias = 'special';
  }

  return {
    defensiveWeaknesses,
    defensiveResistances,
    offensiveCoverage,
    offensiveGaps,
    typeDistribution: typeDistribution as Record<PokemonType, number>,
    existingTypes,
    offensiveBias,
  };
}

export function suggestTypes(members: (TeamMember | null)[]): PokemonType[] {
  const active = members.filter(Boolean) as TeamMember[];
  const coverage = analyzeTeamCoverage(members);
  const existingTypes = coverage.existingTypes;

  const minCount = active.length <= 2 ? 1 : 2;
  const weaknessTypes = coverage.defensiveWeaknesses
    .filter(w => w.count >= minCount)
    .map(w => w.type);

  if (weaknessTypes.length === 0) return [];

  const suggestions: Map<PokemonType, number> = new Map();
  for (const weakType of weaknessTypes) {
    for (const t of ALL_TYPES) {
      if (existingTypes.has(t)) continue;
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

export interface ScoredCandidate {
  typeScore: number;
  metaScore: number;
  balanceScore: number;
  total: number;
}

export function scoreCandidate(
  name: string,
  candidateTypes: PokemonType[],
  stats: Pick<BaseStats, 'atk' | 'spa' | 'total'>,
  coverage: TeamCoverage,
  suggestedTypes: PokemonType[],
): ScoredCandidate {
  const eff = getDefensiveEffectiveness(candidateTypes);
  let typeScore = 0;

  // Resist team weaknesses
  for (const { type, count } of coverage.defensiveWeaknesses) {
    if (eff[type] === 0)        typeScore += count * 5;  // immune
    else if (eff[type] <= 0.5)  typeScore += count * 3;  // resists
    else if (eff[type] >= 2)    typeScore -= count * 2;  // also weak
  }

  // STAB covers defensive gap types not yet on team
  for (const t of candidateTypes) {
    if (suggestedTypes.includes(t)) typeScore += 4;
  }

  // STAB hits offensive gaps
  for (const t of candidateTypes) {
    for (const defType of coverage.offensiveGaps) {
      if (TYPE_CHART[t][defType] >= 2) typeScore += 2;
    }
  }

  // Penalise type overlap
  for (const t of candidateTypes) {
    if (coverage.existingTypes.has(t)) typeScore -= 1.5;
  }

  // Slight BST tiebreaker
  typeScore += stats.total / 250;

  // ── Meta weight (usage-based) ──────────────────────────────
  const metaScore = getMetaWeight(name);

  // ── Physical / Special balance ─────────────────────────────
  let balanceScore = 0;
  const isPhysicalCandidate = stats.atk > stats.spa + 15;
  const isSpecialCandidate  = stats.spa > stats.atk + 15;

  if (coverage.offensiveBias === 'physical' && isSpecialCandidate) {
    balanceScore = 4; // team needs a special attacker
  } else if (coverage.offensiveBias === 'special' && isPhysicalCandidate) {
    balanceScore = 4; // team needs a physical attacker
  } else if (coverage.offensiveBias !== 'balanced' && !isPhysicalCandidate && !isSpecialCandidate) {
    balanceScore = 1; // mixed attacker helps a little
  }

  // High special attack bonus when team is all-physical (extra nudge)
  if (coverage.offensiveBias === 'physical' && stats.spa >= 110) balanceScore += 2;
  if (coverage.offensiveBias === 'special'  && stats.atk >= 110) balanceScore += 2;

  const total = typeScore + metaScore + balanceScore;
  return { typeScore, metaScore, balanceScore, total };
}

// ── Team synergy analysis ─────────────────────────────────────────────────

export type SynergyLevel = 'warning' | 'tip' | 'positive';

export interface SynergyNote {
  level: SynergyLevel;
  message: string;
}

const LEVITATE_ABILITIES = new Set(['Levitate']);
const WEATHER_SETTERS: Record<string, string> = {
  Drizzle: 'Rain', Drought: 'Sun', 'Sand Stream': 'Sandstorm', 'Snow Warning': 'Snow',
};
const WEATHER_ABUSERS: Record<string, string[]> = {
  Rain:      ['Swift Swim', 'Rain Dish', 'Hydration'],
  Sun:       ['Chlorophyll', 'Solar Power', 'Flower Gift'],
  Sandstorm: ['Sand Rush', 'Sand Force', 'Sand Veil'],
  Snow:      ['Slush Rush', 'Ice Body', 'Snow Cloak'],
};

export function analyzeSynergies(members: (TeamMember | null)[]): SynergyNote[] {
  const active = members.filter(Boolean) as TeamMember[];
  if (active.length < 2) return [];

  const notes: SynergyNote[] = [];

  // ── Earthquake safety ────────────────────────────────────────
  for (const member of active) {
    const hasEq = member.moves.some(m => m.name === 'Earthquake');
    if (!hasEq) continue;

    const teammates = active.filter(m => m !== member);
    const vulnerable = teammates.filter(t => {
      const eff = getDefensiveEffectiveness(t.pokemon.types);
      const hasLevitate = Object.values(t.pokemon.abilities).some(a => LEVITATE_ABILITIES.has(a));
      return eff['Ground'] > 0 && !hasLevitate;
    });
    const safe = teammates.filter(t => {
      const eff = getDefensiveEffectiveness(t.pokemon.types);
      const hasLevitate = Object.values(t.pokemon.abilities).some(a => LEVITATE_ABILITIES.has(a));
      return eff['Ground'] === 0 || hasLevitate;
    });

    if (vulnerable.length > 0) {
      notes.push({
        level: 'warning',
        message: `${member.pokemon.name}'s Earthquake will also hit ${vulnerable.map(t => t.pokemon.name).join(' and ')} — make sure to Protect them!`,
      });
    } else if (safe.length > 0) {
      notes.push({
        level: 'positive',
        message: `${member.pokemon.name} can freely use Earthquake — ${safe.map(t => t.pokemon.name).join(' and ')} won't be affected.`,
      });
    }
  }

  // ── Rock Slide / Surf / Discharge spread-move partner check ──
  const spreadMoves = ['Rock Slide', 'Surf', 'Discharge', 'Muddy Water', 'Heat Wave', 'Blizzard', 'Earthquake', 'Bulldoze'];
  const spreadUsers = active.filter(m => m.moves.some(mv => spreadMoves.includes(mv.name)));
  if (spreadUsers.length >= 2) {
    const hasProtect = active.some(m => m.moves.some(mv => mv.name === 'Protect'));
    if (!hasProtect) {
      notes.push({
        level: 'tip',
        message: 'Multiple Pokémon use spread moves. Consider teaching Protect to at least one of them so they can safely stay in while your attacker fires off spread moves.',
      });
    }
  }

  // ── Trick Room: setter but no slow abuser ────────────────────
  const trSetter = active.find(m => m.moves.some(mv => mv.name === 'Trick Room'));
  if (trSetter) {
    const slowAbusers = active.filter(m => m !== trSetter && m.pokemon.spe <= 70);
    if (slowAbusers.length === 0) {
      notes.push({
        level: 'tip',
        message: `${trSetter.pokemon.name} can set Trick Room, but your team has no slow attackers (SPE ≤ 70) to abuse it. Consider a slow, powerful Pokémon.`,
      });
    } else {
      notes.push({
        level: 'positive',
        message: `${trSetter.pokemon.name} can set Trick Room for ${slowAbusers.map(t => t.pokemon.name).join(' and ')} — great slow-team synergy!`,
      });
    }
  }

  // ── Weather synergy ──────────────────────────────────────────
  for (const member of active) {
    for (const [abilityKey, weather] of Object.entries(WEATHER_SETTERS)) {
      const hasSetter = Object.values(member.pokemon.abilities).includes(abilityKey);
      if (!hasSetter) continue;
      const abusers = WEATHER_ABUSERS[weather] ?? [];
      const hasAbuser = active
        .filter(m => m !== member)
        .some(m => Object.values(m.pokemon.abilities).some(a => abusers.includes(a)));
      if (!hasAbuser) {
        notes.push({
          level: 'tip',
          message: `${member.pokemon.name} sets ${weather} but no teammate has a ${weather.toLowerCase()}-boosted ability (${abusers.slice(0, 2).join(', ')}…). You could add one to maximize the weather.`,
        });
      } else {
        notes.push({
          level: 'positive',
          message: `${member.pokemon.name} sets ${weather} — your teammates are ready to abuse it!`,
        });
      }
    }
  }

  // ── Fake Out: multiple users ──────────────────────────────────
  const fakeOutUsers = active.filter(m => m.moves.some(mv => mv.name === 'Fake Out'));
  if (fakeOutUsers.length >= 2) {
    notes.push({
      level: 'tip',
      message: `${fakeOutUsers.map(m => m.pokemon.name).join(' and ')} both know Fake Out. Only one can use it per turn — you may prefer to replace one with a different support move.`,
    });
  }

  // ── Redirection: Follow Me + Rage Powder stacking ────────────
  const redirectors = active.filter(m =>
    m.moves.some(mv => mv.name === 'Follow Me' || mv.name === 'Rage Powder')
  );
  if (redirectors.length >= 2) {
    notes.push({
      level: 'tip',
      message: `Multiple Pokémon (${redirectors.map(m => m.pokemon.name).join(', ')}) provide redirection. One is usually enough — consider adding a more offensive option.`,
    });
  }

  return notes;
}
