import { useState, useMemo } from 'react';
import {
  Sparkles, ChevronDown, ChevronUp, Plus, Search,
  AlertTriangle, Lightbulb, CheckCircle, Shield, Swords, Star,
} from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { PokemonSprite } from './PokemonSprite';
import { StatBar } from './StatBar';
import { usePokemonData } from '../hooks/usePokemonData';
import {
  analyzeTeamCoverage, suggestTypes, analyzeSynergies,
  scoreDefensive, scoreOffensive, getMegaCount, applyMegaPenalty,
} from '../utils/coverage';
import { getDefensiveEffectiveness, TYPE_CHART } from '../data/typeChart';
import { getMetaWeight, getMetaTier } from '../data/metaWeights';
import type { TeamMember, Pokemon, PokemonType } from '../types/pokemon';

interface Props {
  members: (TeamMember | null)[];
  onAdd: (p: Pokemon) => void;
  hasPokemon: (name: string) => boolean;
  teamFull: boolean;
}

type RecTab = 'meta' | 'defensive' | 'offensive';

const TIER_COLORS: Record<string, string> = {
  S:    'bg-red-500 text-white',
  'A+': 'bg-orange-500 text-white',
  A:    'bg-amber-500 text-white',
  'A-': 'bg-yellow-500 text-black',
  B:    'bg-green-600 text-white',
  C:    'bg-blue-500 text-white',
  D:    'bg-slate-500 text-white',
  '?':  'bg-slate-700 text-slate-400',
};

const REC_TABS = [
  { id: 'meta'      as RecTab, label: 'Meta',      icon: <Star    size={12} />, desc: 'top tournament picks'  },
  { id: 'defensive' as RecTab, label: 'Defensive',  icon: <Shield  size={12} />, desc: 'plug type weaknesses'  },
  { id: 'offensive' as RecTab, label: 'Offensive',  icon: <Swords  size={12} />, desc: 'fill coverage gaps'    },
];

// ── Synergy alert styles ──────────────────────────────────────────────────────
const SYNERGY_STYLE = {
  warning:  { icon: <AlertTriangle size={12} className="text-red-400   flex-shrink-0 mt-0.5" />, text: 'text-red-300',   bg: 'bg-red-950/30   border-red-800/40'   },
  tip:      { icon: <Lightbulb    size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />, text: 'text-amber-300', bg: 'bg-amber-950/30 border-amber-800/40' },
  positive: { icon: <CheckCircle  size={12} className="text-green-400 flex-shrink-0 mt-0.5" />, text: 'text-green-300', bg: 'bg-green-950/30 border-green-800/40' },
};

// ── Per-card reason chips ─────────────────────────────────────────────────────
function MetaReason({ name }: { name: string }) {
  const w = getMetaWeight(name);
  const tier = getMetaTier(w);
  if (w <= 1) return <span className="text-[10px] text-slate-500">Unranked</span>;
  const usageLabel =
    w >= 10 ? '40%+ usage' : w >= 8 ? '25–40% usage' : w >= 7 ? '15–25% usage' :
    w >= 5  ? '7–15% usage' : w >= 4 ? 'solid pick' : 'niche pick';
  return (
    <span className="text-[10px] text-slate-400">
      Tier <span className={`font-bold px-1 py-0.5 rounded text-[9px] ${TIER_COLORS[tier]}`}>{tier}</span>{' '}
      · {usageLabel}
    </span>
  );
}

function DefensiveReason({ types, coverage }: { types: PokemonType[]; coverage: ReturnType<typeof analyzeTeamCoverage> }) {
  const eff = getDefensiveEffectiveness(types);
  const minCount = 1;
  const resists = coverage.defensiveWeaknesses
    .filter(w => w.count >= minCount && eff[w.type] <= 0.5 && eff[w.type] > 0)
    .map(w => w.type);
  const immune = coverage.defensiveWeaknesses
    .filter(w => eff[w.type] === 0)
    .map(w => w.type);
  if (resists.length === 0 && immune.length === 0)
    return <span className="text-[10px] text-slate-500">No relevant defensive synergy</span>;
  return (
    <span className="flex items-center gap-1 flex-wrap">
      {immune.length > 0 && <><span className="text-[10px] text-violet-400">Immune:</span>{immune.map(t => <TypeBadge key={t} type={t} small />)}</>}
      {resists.length > 0 && <><span className="text-[10px] text-green-400 ml-1">Resists:</span>{resists.map(t => <TypeBadge key={t} type={t} small />)}</>}
    </span>
  );
}

function OffensiveReason({ types, coverage }: { types: PokemonType[]; coverage: ReturnType<typeof analyzeTeamCoverage> }) {
  const coversGaps = coverage.offensiveGaps.filter(defType =>
    types.some(t => TYPE_CHART[t][defType] >= 2)
  );
  const isPhysical = false; // determined by stats, shown separately
  if (coversGaps.length === 0)
    return <span className="text-[10px] text-slate-500">No new type coverage</span>;
  return (
    <span className="flex items-center gap-1 flex-wrap">
      <span className="text-[10px] text-amber-400">Covers:</span>
      {coversGaps.map(t => <TypeBadge key={t} type={t} small />)}
    </span>
  );
}

// ── Recommendation card ───────────────────────────────────────────────────────
function RecommendationCard({
  pokemon, tab, coverage, onAdd, hasPokemon, teamFull, expanded, onToggle,
}: {
  pokemon: Pokemon;
  tab: RecTab;
  coverage: ReturnType<typeof analyzeTeamCoverage>;
  onAdd: (p: Pokemon) => void;
  hasPokemon: (name: string) => boolean;
  teamFull: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const tier = getMetaTier(getMetaWeight(pokemon.name));
  const inTeam = hasPokemon(pokemon.name);
  const isPhysical = pokemon.atk > pokemon.spa + 15;
  const isSpecial  = pokemon.spa > pokemon.atk + 15;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <PokemonSprite name={pokemon.name} dexNumber={pokemon.dexNumber} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-100 font-semibold text-sm">{pokemon.name}</span>
            {pokemon.types.map(t => <TypeBadge key={t} type={t} small />)}
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${TIER_COLORS[tier]}`}>{tier}</span>
          </div>
          <div className="mt-1">
            {tab === 'meta'      && <MetaReason      name={pokemon.name} />}
            {tab === 'defensive' && <DefensiveReason types={pokemon.types} coverage={coverage} />}
            {tab === 'offensive' && <OffensiveReason types={pokemon.types} coverage={coverage} />}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 flex gap-2">
            <span>BST {pokemon.total}</span>
            <span>{isPhysical ? '⚔ Physical' : isSpecial ? '✦ Special' : '⚔✦ Mixed'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => !inTeam && !teamFull && onAdd(pokemon)}
            disabled={inTeam || teamFull}
            className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
              inTeam   ? 'bg-violet-900/40 text-violet-400 cursor-default' :
              teamFull ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
                         'bg-violet-600 hover:bg-violet-500 text-white'
            }`}
          >
            <Plus size={11} />
          </button>
          <button onClick={onToggle} className="text-slate-500 hover:text-slate-300 p-1">
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {expanded && (
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
}

// ── Main panel ────────────────────────────────────────────────────────────────
export function RecommendationsPanel({ members, onAdd, hasPokemon, teamFull }: Props) {
  const { data: allPokemon } = usePokemonData();
  const [recTab, setRecTab]   = useState<RecTab>('meta');
  const [query, setQuery]     = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const active = members.filter(Boolean) as TeamMember[];
  const coverage      = useMemo(() => analyzeTeamCoverage(members), [members]);
  const suggestedTypes = useMemo(() => suggestTypes(members), [members]);
  const synergyNotes  = useMemo(() => analyzeSynergies(members), [members]);
  const megaCount     = getMegaCount(members);

  // Build scored candidates
  const scoredCandidates = useMemo(() => {
    if (!allPokemon) return [];
    return allPokemon
      .filter(p => !hasPokemon(p.name))
      .map(p => {
        const megaPen = applyMegaPenalty(p.name, megaCount);
        return {
          pokemon: p,
          metaScore:      getMetaWeight(p.name) + megaPen + p.total / 600,
          defensiveScore: (active.length > 0 ? scoreDefensive(p.types, coverage, suggestedTypes) : 0) + megaPen,
          offensiveScore: (active.length > 0 ? scoreOffensive(p.types, p, coverage) : 0) + megaPen,
        };
      });
  }, [allPokemon, hasPokemon, megaCount, coverage, suggestedTypes, active.length]);

  const displayList = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? scoredCandidates.filter(c => c.pokemon.name.toLowerCase().includes(q))
      : scoredCandidates;
    const key = recTab === 'meta' ? 'metaScore' : recTab === 'defensive' ? 'defensiveScore' : 'offensiveScore';
    return [...filtered].sort((a, b) => b[key] - a[key]).slice(0, q ? 20 : 10);
  }, [scoredCandidates, recTab, query]);

  // ── Team gaps ──────────────────────────────────────────────────────────────
  const defensiveGaps = coverage.defensiveWeaknesses.filter(w => w.count >= (active.length <= 2 ? 1 : 2));
  const offensiveGaps = coverage.offensiveGaps;

  return (
    <div className="flex flex-col gap-4">

      {/* ── Team Analysis ─────────────────────────────────────────────────── */}
      <div className="bg-violet-950/40 border border-violet-800/50 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm font-semibold text-violet-300">Team analysis</span>
        </div>

        {/* Gaps grid */}
        {active.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {/* Defensive gaps */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Shield size={10} /> Defensive gaps
              </p>
              {defensiveGaps.length === 0
                ? <p className="text-[10px] text-slate-600">No major weaknesses</p>
                : <div className="flex flex-wrap gap-1">
                    {defensiveGaps.map(w => (
                      <span key={w.type} className="flex items-center gap-0.5">
                        <TypeBadge type={w.type} small />
                        <span className="text-[9px] text-red-400">×{w.count}</span>
                      </span>
                    ))}
                  </div>
              }
            </div>
            {/* Offensive gaps */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Swords size={10} /> Offensive gaps
              </p>
              {offensiveGaps.length === 0
                ? <p className="text-[10px] text-slate-600">Full coverage!</p>
                : offensiveGaps.length > 10
                ? <p className="text-[10px] text-slate-500">{offensiveGaps.length} types uncovered</p>
                : <div className="flex flex-wrap gap-1">
                    {offensiveGaps.map(t => (
                      <span key={t} className="inline-block text-[9px] px-1 py-0.5 rounded font-bold uppercase tracking-wide text-slate-400 border border-slate-600">{t}</span>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* Offensive bias notice */}
        {coverage.offensiveBias !== 'balanced' && active.length >= 2 && (
          <div className="bg-amber-950/40 border border-amber-700/40 rounded-lg px-3 py-2 text-xs text-amber-300">
            Your team attacks mostly <strong>{coverage.offensiveBias === 'physical' ? 'physically' : 'specially'}</strong>.
            {' '}The Offensive tab will highlight {coverage.offensiveBias === 'physical' ? 'special' : 'physical'} attackers.
          </div>
        )}

        {/* Suggested defensive types */}
        {suggestedTypes.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-1">Types that would plug those holes:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedTypes.map(t => <TypeBadge key={t} type={t} />)}
            </div>
          </div>
        )}

        {/* Synergy alerts */}
        {synergyNotes.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1 border-t border-violet-800/40">
            {synergyNotes.map((note, i) => {
              const s = SYNERGY_STYLE[note.level];
              return (
                <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs border ${s.bg}`}>
                  {s.icon}
                  <span className={s.text}>{note.message}</span>
                </div>
              );
            })}
          </div>
        )}

        {active.length === 0 && (
          <p className="text-xs text-slate-500">Add at least one Pokémon to see team analysis.</p>
        )}
      </div>

      {/* ── Search + Recommendation tabs ─────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search any Pokémon…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >✕</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl">
          {REC_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setRecTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                recTab === t.id
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab description */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {query
              ? `${displayList.length} result${displayList.length !== 1 ? 's' : ''} · sorted by ${recTab}`
              : `Top picks · ${REC_TABS.find(t => t.id === recTab)?.desc}`
            }
          </p>
          {megaCount > 0 && (
            <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
              {megaCount} Mega{megaCount > 1 ? 's' : ''} in team
            </span>
          )}
        </div>

        {/* Recommendation list */}
        {recTab !== 'meta' && active.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm">
            Add at least one Pokémon to get {recTab} recommendations.
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">No Pokémon match your search.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayList.map(({ pokemon }) => (
              <RecommendationCard
                key={pokemon.name}
                pokemon={pokemon}
                tab={recTab}
                coverage={coverage}
                onAdd={onAdd}
                hasPokemon={hasPokemon}
                teamFull={teamFull}
                expanded={expanded === pokemon.name}
                onToggle={() => setExpanded(expanded === pokemon.name ? null : pokemon.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
