import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Plus, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { PokemonSprite } from './PokemonSprite';
import { StatBar } from './StatBar';
import { usePokemonData } from '../hooks/usePokemonData';
import { analyzeTeamCoverage, suggestTypes, scoreCandidate, analyzeSynergies } from '../utils/coverage';
import { getDefensiveEffectiveness } from '../data/typeChart';
import { getMetaTier } from '../data/metaWeights';
import type { TeamMember, Pokemon } from '../types/pokemon';

interface Props {
  members: (TeamMember | null)[];
  onAdd: (p: Pokemon) => void;
  hasPokemon: (name: string) => boolean;
  teamFull: boolean;
}

const TIER_COLORS: Record<string, string> = {
  S:   'bg-red-500 text-white',
  'A+':'bg-orange-500 text-white',
  A:   'bg-amber-500 text-white',
  'A-':'bg-yellow-500 text-black',
  B:   'bg-green-600 text-white',
  C:   'bg-blue-500 text-white',
  D:   'bg-slate-500 text-white',
  '?': 'bg-slate-700 text-slate-400',
};

export function RecommendationsPanel({ members, onAdd, hasPokemon, teamFull }: Props) {
  const { data: allPokemon } = usePokemonData();
  const [expanded, setExpanded] = useState<string | null>(null);

  const coverage = analyzeTeamCoverage(members);
  const suggestedTypes = suggestTypes(members);
  const synergyNotes = analyzeSynergies(members);

  const recommendations = (() => {
    if (!allPokemon || members.filter(Boolean).length === 0) return [];

    return allPokemon
      .filter(p => !hasPokemon(p.name))
      .map(p => ({
        pokemon: p,
        scored: scoreCandidate(p.name, p.types, p, coverage, suggestedTypes),
      }))
      .sort((a, b) => b.scored.total - a.scored.total)
      .slice(0, 8);
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
      {/* Team analysis */}
      <div className="bg-violet-950/40 border border-violet-800/50 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm font-semibold text-violet-300">Team analysis</span>
        </div>

        {/* Defensive danger zones */}
        {coverage.defensiveWeaknesses.filter(w => w.count >= 2).length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-1.5">Multiple members weak to:</p>
            <div className="flex flex-wrap gap-1">
              {coverage.defensiveWeaknesses.filter(w => w.count >= 2).map(w => (
                <span key={w.type} className="flex items-center gap-1">
                  <TypeBadge type={w.type} small />
                  <span className="text-xs text-red-400 mr-1">({w.count}×)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested defensive types */}
        {suggestedTypes.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-1.5">Types that would plug those holes (not yet on team):</p>
            <div className="flex flex-wrap gap-1">
              {suggestedTypes.map(t => <TypeBadge key={t} type={t} />)}
            </div>
          </div>
        )}

        {/* Offensive bias notice */}
        {coverage.offensiveBias !== 'balanced' && (
          <div className="bg-amber-950/40 border border-amber-700/40 rounded-lg px-3 py-2 text-xs text-amber-300">
            Your team attacks mostly <strong>{coverage.offensiveBias === 'physical' ? 'physically' : 'specially'}</strong>.
            {' '}Consider adding a {coverage.offensiveBias === 'physical' ? 'special' : 'physical'} attacker
            so stat boosts on one side don't shut you down.
          </div>
        )}

        {/* Offensive gaps */}
        {coverage.offensiveGaps.length > 0 && coverage.offensiveGaps.length <= 8 && (
          <div>
            <p className="text-xs text-slate-400 mb-1.5">Types your team can't hit super-effectively:</p>
            <div className="flex flex-wrap gap-1">
              {coverage.offensiveGaps.map(t => (
                <span key={t} className="inline-block text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide text-slate-400 border border-slate-600">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Synergy notes */}
        {synergyNotes.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 border-t border-violet-800/40">
            {synergyNotes.map((note, i) => {
              const styles = {
                warning: { icon: <AlertTriangle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />, text: 'text-red-300', bg: 'bg-red-950/30 border-red-800/40' },
                tip:     { icon: <Lightbulb    size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />, text: 'text-amber-300', bg: 'bg-amber-950/30 border-amber-800/40' },
                positive:{ icon: <CheckCircle  size={12} className="text-green-400 flex-shrink-0 mt-0.5" />, text: 'text-green-300', bg: 'bg-green-950/30 border-green-800/40' },
              }[note.level];
              return (
                <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs border ${styles.bg}`}>
                  {styles.icon}
                  <span className={styles.text}>{note.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Recommended Teammates</h3>
        <p className="text-xs text-slate-500 mb-3">Ranked by type synergy + meta usage + offensive balance</p>
        <div className="flex flex-col gap-2">
          {recommendations.map(({ pokemon, scored }) => {
            const eff = getDefensiveEffectiveness(pokemon.types);
            const resistsWeaknesses = coverage.defensiveWeaknesses
              .filter(w => w.count >= 2 && eff[w.type] <= 0.5)
              .map(w => w.type);
            const isExpanded = expanded === pokemon.name;
            const tier = getMetaTier(scored.metaScore);
            const isPhysical = pokemon.atk > pokemon.spa + 15;
            const isSpecial  = pokemon.spa > pokemon.atk + 15;
            const balancesTeam = scored.balanceScore >= 4;

            return (
              <div key={pokemon.name} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <PokemonSprite name={pokemon.name} dexNumber={pokemon.dexNumber} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-100 font-semibold text-sm">{pokemon.name}</span>
                      {pokemon.types.map(t => <TypeBadge key={t} type={t} small />)}
                      {/* Meta tier badge */}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${TIER_COLORS[tier]}`}>
                        {tier}
                      </span>
                    </div>

                    {/* Why recommended */}
                    <div className="flex flex-wrap gap-1 mt-1 items-center">
                      {resistsWeaknesses.length > 0 && (
                        <>
                          <span className="text-[10px] text-green-400">Resists:</span>
                          {resistsWeaknesses.map(t => <TypeBadge key={t} type={t} small />)}
                        </>
                      )}
                      {balancesTeam && (
                        <span className="text-[10px] text-amber-400 font-semibold ml-1">
                          {isSpecial ? '✦ Special attacker' : '✦ Physical attacker'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5 flex gap-2">
                      <span>BST {pokemon.total}</span>
                      <span>{isPhysical ? '⚔ Physical' : isSpecial ? '✦ Special' : '⚔✦ Mixed'}</span>
                    </div>
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
                    <div className="text-xs text-slate-500 mt-1 flex gap-3">
                      <span>Type synergy: <span className="text-slate-300">{scored.typeScore.toFixed(1)}</span></span>
                      <span>Meta tier: <span className="text-slate-300">{tier} ({scored.metaScore}/10)</span></span>
                      {scored.balanceScore > 0 && <span>Balance: <span className="text-amber-400">+{scored.balanceScore}</span></span>}
                    </div>
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
