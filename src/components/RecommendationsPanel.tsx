import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { PokemonSprite } from './PokemonSprite';
import { StatBar } from './StatBar';
import { usePokemonData } from '../hooks/usePokemonData';
import { analyzeTeamCoverage, suggestTypes } from '../utils/coverage';
import { getDefensiveEffectiveness } from '../data/typeChart';
import type { TeamMember, Pokemon } from '../types/pokemon';

interface Props {
  members: (TeamMember | null)[];
  onAdd: (p: Pokemon) => void;
  hasPokemon: (name: string) => boolean;
  teamFull: boolean;
}

export function RecommendationsPanel({ members, onAdd, hasPokemon, teamFull }: Props) {
  const { data: allPokemon } = usePokemonData();
  const [expanded, setExpanded] = useState<string | null>(null);

  const coverage = analyzeTeamCoverage(members);
  const suggestedTypes = suggestTypes(members);

  const recommendations = (() => {
    if (!allPokemon || members.filter(Boolean).length === 0) return [];

    return allPokemon
      .filter(p => !hasPokemon(p.name))
      .map(p => {
        const eff = getDefensiveEffectiveness(p.types);
        let score = 0;

        // Resist team's biggest weaknesses
        for (const { type, count } of coverage.defensiveWeaknesses) {
          if (eff[type] <= 0.5) score += count * 3;
          if (eff[type] === 0) score += count * 4;
        }

        // STAB matches a suggested coverage type
        for (const t of p.types) {
          if (suggestedTypes.includes(t)) score += 5;
        }

        // Penalize Pokemon that share multiple weaknesses with the team
        for (const { type, count } of coverage.defensiveWeaknesses.filter(w => w.count >= 2)) {
          if (eff[type] >= 2) score -= count * 2;
        }

        // Offensive gap coverage via STAB
        for (const gapType of coverage.offensiveGaps) {
          for (const t of p.types) {
            if (!members.filter(Boolean).some((m) => m!.pokemon.types.includes(t))) {
              const alreadyCovered = coverage.offensiveCoverage.includes(gapType);
              if (!alreadyCovered) score += 1;
            }
          }
        }

        score += p.total / 200;

        return { pokemon: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  })();

  if (members.filter(Boolean).length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm">
        Add at least one Pokémon to get team recommendations.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Coverage insight */}
      {suggestedTypes.length > 0 && (
        <div className="bg-violet-950/40 border border-violet-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-sm font-semibold text-violet-300">Team analysis</span>
          </div>
          {coverage.defensiveWeaknesses.filter(w => w.count >= 2).length > 0 && (
            <>
              <p className="text-xs text-slate-400 mb-2">
                Your team has multiple members weak to these types:
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {coverage.defensiveWeaknesses.filter(w => w.count >= 2).map(w => (
                  <span key={w.type} className="flex items-center gap-1">
                    <TypeBadge type={w.type} small />
                    <span className="text-xs text-red-400 mr-1">({w.count}×)</span>
                  </span>
                ))}
              </div>
            </>
          )}
          <p className="text-xs text-slate-400 mb-1">Types that would improve your team:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedTypes.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      )}

      {/* Recommendations list */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Recommended Teammates</h3>
        <div className="flex flex-col gap-2">
          {recommendations.map(({ pokemon }) => {
            const eff = getDefensiveEffectiveness(pokemon.types);
            const resistsWeaknesses = coverage.defensiveWeaknesses
              .filter(w => w.count >= 2 && eff[w.type] <= 0.5)
              .map(w => w.type);
            const isExpanded = expanded === pokemon.name;

            return (
              <div key={pokemon.name} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <PokemonSprite name={pokemon.name} dexNumber={pokemon.dexNumber} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-100 font-semibold text-sm">{pokemon.name}</span>
                      {pokemon.types.map(t => <TypeBadge key={t} type={t} small />)}
                    </div>
                    {resistsWeaknesses.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className="text-[10px] text-green-400">Resists:</span>
                        {resistsWeaknesses.map(t => <TypeBadge key={t} type={t} small />)}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-0.5">BST {pokemon.total}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => !hasPokemon(pokemon.name) && !teamFull && onAdd(pokemon)}
                      disabled={hasPokemon(pokemon.name) || teamFull}
                      className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                        hasPokemon(pokemon.name)
                          ? 'bg-violet-900/40 text-violet-400 cursor-default'
                          : teamFull
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-violet-600 hover:bg-violet-500 text-white'
                      }`}
                    >
                      <Plus size={11} />
                    </button>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : pokemon.name)}
                      className="text-slate-500 hover:text-slate-300 p-1"
                    >
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-700 p-3 flex flex-col gap-1.5">
                    <StatBar label="HP"  value={pokemon.hp} />
                    <StatBar label="ATK" value={pokemon.atk} />
                    <StatBar label="DEF" value={pokemon.def} />
                    <StatBar label="SPA" value={pokemon.spa} />
                    <StatBar label="SPD" value={pokemon.spd} />
                    <StatBar label="SPE" value={pokemon.spe} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
