import { useState, useMemo, useRef } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { usePokemonData } from '../hooks/usePokemonData';
import { getOffensiveEffectiveness, getDefensiveEffectiveness } from '../data/typeChart';
import { getMetaWeight } from '../data/metaWeights';
import type { Pokemon, TeamMember, Move, PokemonType } from '../types/pokemon';

interface Props {
  members: (TeamMember | null)[];
}

type Weather = 'None' | 'Sun' | 'Rain' | 'Sand' | 'Snow';

function getActivePokemon(member: TeamMember, allPokemon?: Pokemon[]): Pokemon {
  if (member.megaEvolved && member.megaFormName && allPokemon) {
    return allPokemon.find(p => p.name === member.megaFormName) ?? member.pokemon;
  }
  return member.pokemon;
}

function scoreVsOpponents(
  member: TeamMember,
  opponents: Pokemon[],
  allPokemon?: Pokemon[],
): { score: number; seCount: number; immuneCount: number } {
  const active = getActivePokemon(member, allPokemon);
  const myTypes = active.types;
  const myDef = getDefensiveEffectiveness(myTypes);
  let offScore = 0;
  let defScore = 0;
  let seCount = 0;
  let immuneCount = 0;

  for (const opp of opponents) {
    let bestOff = 0.5;
    for (const t of myTypes) {
      bestOff = Math.max(bestOff, getOffensiveEffectiveness(t, opp.types));
    }
    for (const move of member.moves) {
      if (move.category !== 'Status' && move.power) {
        bestOff = Math.max(bestOff, getOffensiveEffectiveness(move.type, opp.types));
      }
    }
    offScore += Math.log2(bestOff) + 1; // 4x→3, 2x→2, 1x→1, 0.5x→0
    if (bestOff >= 2) seCount++;

    let immuneToThisOpp = false;
    for (const oppType of opp.types) {
      const threat = myDef[oppType];
      if (threat === 0) { defScore += 1.5; immuneToThisOpp = true; }
      else if (threat <= 0.5) defScore += 0.3;
      else if (threat >= 4) defScore -= 2.5;
      else if (threat >= 2) defScore -= 1;
    }
    if (immuneToThisOpp) immuneCount++;
  }

  return { score: offScore + defScore, seCount, immuneCount };
}

function pickReason(seCount: number, immuneCount: number, total: number): string {
  const parts: string[] = [];
  if (seCount >= total && total > 0) parts.push(`SE vs all ${total}`);
  else if (seCount > 0) parts.push(`SE vs ${seCount}/${total}`);
  if (immuneCount >= 2) parts.push(`${immuneCount} immunities`);
  return parts.join(' · ') || 'Balanced coverage';
}

// Approximate level-50 stat (31 IVs, 0 EVs, neutral nature)
function calcStat(base: number): number {
  return Math.floor((2 * base + 31) * 50 / 100 + 5);
}
function calcHP(base: number): number {
  return Math.floor((2 * base + 31 + 100) * 50 / 100 + 10);
}

function weatherMult(weather: Weather, moveType: PokemonType): number {
  if (weather === 'Sun')  { if (moveType === 'Fire') return 1.5; if (moveType === 'Water') return 0.5; }
  if (weather === 'Rain') { if (moveType === 'Water') return 1.5; if (moveType === 'Fire') return 0.5; }
  return 1;
}

function stageMult(stage: number): number {
  return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

function computeDamage(
  move: Move,
  attacker: Pokemon,
  defender: Pokemon,
  atkStage: number,
  defStage: number,
  weather: Weather,
  reflect: boolean,
  lightScreen: boolean,
  doubles: boolean,
): { min: number; max: number; defHP: number } | null {
  if (!move.power || move.category === 'Status') return null;

  const isPhys = move.category === 'Physical';
  const baseAtk = isPhys ? attacker.atk : attacker.spa;
  const baseDef = isPhys ? defender.def : defender.spd;

  const effAtk = Math.floor(calcStat(baseAtk) * stageMult(atkStage));
  const effDef = Math.floor(calcStat(baseDef) * stageMult(defStage));
  const defHP  = calcHP(defender.hp);

  const base = Math.floor(Math.floor(Math.floor(2 * 50 / 5 + 2) * move.power * effAtk / effDef) / 50) + 2;

  const stab  = attacker.types.includes(move.type) ? 1.5 : 1;
  const typeEff = getOffensiveEffectiveness(move.type, defender.types);
  const wMult = weatherMult(weather, move.type);
  const screen = (isPhys && reflect) || (!isPhys && lightScreen) ? (doubles ? 2/3 : 0.5) : 1;

  const total = base * stab * typeEff * wMult * screen;

  return {
    min: Math.floor(total * 0.85),
    max: Math.floor(total),
    defHP,
  };
}

function hkoLabel(minPct: number, maxPct: number): string {
  if (maxPct >= 100) return minPct >= 100 ? 'OHKO' : 'OHKO range';
  if (maxPct * 2 >= 100) return minPct * 2 >= 100 ? '2HKO' : '2HKO range';
  if (maxPct * 3 >= 100) return '3HKO';
  return '4+ HKO';
}

function PokemonInput({
  value,
  locked,
  placeholder,
  allPokemon,
  onSelect,
  onClear,
}: {
  value: string;
  locked: Pokemon | null;
  placeholder: string;
  allPokemon: Pokemon[] | undefined;
  onSelect: (p: Pokemon) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!allPokemon || query.length < 1) return [];
    return allPokemon
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [allPokemon, query]);

  if (locked) {
    return (
      <div className="flex items-center gap-1.5 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 min-h-[36px]">
        <span className="text-xs text-slate-200 flex-1 truncate font-medium">{locked.name}</span>
        {locked.types.map(t => <TypeBadge key={t} type={t} small />)}
        <button onClick={onClear} className="text-slate-500 hover:text-red-400 ml-auto flex-shrink-0">
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 top-full mt-0.5 left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-y-auto max-h-40">
          {suggestions.map(p => (
            <button
              key={p.name}
              onMouseDown={() => { onSelect(p); setQuery(''); setOpen(false); }}
              className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-slate-700 text-xs text-slate-200 border-b border-slate-700 last:border-0"
            >
              <span className="flex-1 truncate">{p.name}</span>
              {p.types.map(t => <TypeBadge key={t} type={t} small />)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MatchupPicker({ members }: Props) {
  const { data: allPokemon } = usePokemonData();
  const [format, setFormat] = useState<'singles' | 'doubles'>('doubles');
  const [opponents, setOpponents] = useState<(Pokemon | null)[]>(Array(6).fill(null));

  // Damage calculator state
  const [showDmg, setShowDmg] = useState(false);
  const [dmgAtkIdx, setDmgAtkIdx] = useState(0);
  const [dmgMoveIdx, setDmgMoveIdx] = useState(0);
  const [dmgDefIdx, setDmgDefIdx] = useState(0);
  const [atkStage, setAtkStage] = useState(0);
  const [defStage, setDefStage] = useState(0);
  const [weather, setWeather] = useState<Weather>('None');
  const [reflect, setReflect] = useState(false);
  const [lightScreen, setLightScreen] = useState(false);

  const activeMembers = members.filter(Boolean) as TeamMember[];
  const validOpponents = opponents.filter(Boolean) as Pokemon[];
  const pickCount = format === 'doubles' ? 4 : 3;

  const scoredTeam = useMemo(() => {
    if (activeMembers.length === 0 || validOpponents.length === 0) return [];
    return activeMembers
      .map(member => ({ member, ...scoreVsOpponents(member, validOpponents, allPokemon) }))
      .sort((a, b) => b.score - a.score);
  }, [members, opponents, allPokemon]);

  const recommended = scoredTeam.slice(0, pickCount);

  const predictedLeads = useMemo(() => {
    return [...validOpponents]
      .sort((a, b) => getMetaWeight(b.name) - getMetaWeight(a.name))
      .slice(0, format === 'doubles' ? 2 : 1);
  }, [opponents, format]);

  const suggestedLeads = useMemo(() => {
    if (predictedLeads.length === 0 || recommended.length === 0) return [];
    return [...recommended]
      .map(({ member }) => {
        const active = getActivePokemon(member, allPokemon);
        const leadScore = predictedLeads.reduce((acc, lead) => {
          let best = 0.5;
          for (const t of active.types) best = Math.max(best, getOffensiveEffectiveness(t, lead.types));
          for (const mv of member.moves) {
            if (mv.category !== 'Status' && mv.power) {
              best = Math.max(best, getOffensiveEffectiveness(mv.type, lead.types));
            }
          }
          return acc + Math.log2(best);
        }, 0);
        return { member, leadScore };
      })
      .sort((a, b) => b.leadScore - a.leadScore)
      .slice(0, format === 'doubles' ? 2 : 1)
      .map(({ member }) => member);
  }, [recommended, predictedLeads, allPokemon]);

  // Damage calculator
  const dmgAttacker = activeMembers[dmgAtkIdx];
  const dmgDefender = validOpponents[dmgDefIdx];
  const dmgAttackerPokemon = dmgAttacker ? getActivePokemon(dmgAttacker, allPokemon) : null;
  const dmgMoves = dmgAttacker?.moves.filter(m => m.category !== 'Status' && m.power) ?? [];
  const dmgMove = dmgMoves[dmgMoveIdx] ?? null;

  const dmgResult = useMemo(() => {
    if (!dmgAttackerPokemon || !dmgDefender || !dmgMove) return null;
    return computeDamage(
      dmgMove, dmgAttackerPokemon, dmgDefender,
      atkStage, defStage, weather, reflect, lightScreen, format === 'doubles',
    );
  }, [dmgAttackerPokemon, dmgDefender, dmgMove, atkStage, defStage, weather, reflect, lightScreen, format]);

  const selectOpponent = (index: number, pokemon: Pokemon) => {
    setOpponents(prev => { const n = [...prev]; n[index] = pokemon; return n; });
  };
  const clearOpponent = (index: number) => {
    setOpponents(prev => { const n = [...prev]; n[index] = null; return n; });
  };

  const stageBtn = (val: number, set: (v: number) => void, cur: number) => (
    <div className="flex items-center gap-1">
      <button onClick={() => set(Math.max(-6, cur - 1))} disabled={cur <= -6}
        className="w-5 h-5 text-xs bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">−</button>
      <span className={`text-xs w-5 text-center font-mono font-bold ${cur > 0 ? 'text-green-400' : cur < 0 ? 'text-red-400' : 'text-slate-400'}`}>
        {cur > 0 ? `+${cur}` : cur}
      </span>
      <button onClick={() => set(Math.min(6, cur + 1))} disabled={cur >= 6}
        className="w-5 h-5 text-xs bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">+</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Format selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Matchup Planner</h2>
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
          {(['singles', 'doubles'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors capitalize ${
                format === f ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'singles' ? 'Singles (3)' : 'Doubles (4)'}
            </button>
          ))}
        </div>
      </div>

      {/* Opponent inputs */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Opponent's Team</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <PokemonInput
              key={i}
              value={opponents[i]?.name ?? ''}
              locked={opponents[i]}
              placeholder={`Pokémon ${i + 1}`}
              allPokemon={allPokemon}
              onSelect={p => selectOpponent(i, p)}
              onClear={() => clearOpponent(i)}
            />
          ))}
        </div>
      </div>

      {/* Analysis results */}
      {activeMembers.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-4">Add Pokémon to your team to see recommendations.</p>
      )}
      {activeMembers.length > 0 && validOpponents.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-4">Enter opponent Pokémon above to start analysis.</p>
      )}

      {activeMembers.length > 0 && validOpponents.length > 0 && (
        <>
          {/* Recommended picks */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Bring these {pickCount} ({format})
            </p>
            <div className="flex flex-col gap-2">
              {scoredTeam.map(({ member, score, seCount, immuneCount }, rank) => {
                const active = getActivePokemon(member, allPokemon);
                const isRec = rank < pickCount;
                const isLead = suggestedLeads.includes(member);
                return (
                  <div
                    key={member.pokemon.name}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                      isRec
                        ? 'bg-slate-800 border-slate-600'
                        : 'bg-slate-900/40 border-slate-800 opacity-50'
                    }`}
                  >
                    <span className={`text-xs font-bold w-5 text-center ${
                      rank === 0 ? 'text-amber-400' : rank < pickCount ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      #{rank + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold text-slate-100">
                          {member.megaEvolved ? member.megaFormName : member.pokemon.name}
                        </span>
                        {isLead && (
                          <span className="text-[9px] font-bold bg-green-500/20 border border-green-500/40 text-green-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                            Lead
                          </span>
                        )}
                        {active.types.map(t => <TypeBadge key={t} type={t} small />)}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {pickReason(seCount, immuneCount, validOpponents.length)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-mono font-bold text-violet-400">{score.toFixed(1)}</span>
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, (score / (validOpponents.length * 3)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead & opponent lead */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">Your Suggested Lead</p>
              {suggestedLeads.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {suggestedLeads.map(m => {
                    const active = getActivePokemon(m, allPokemon);
                    return (
                      <div key={m.pokemon.name} className="flex items-center gap-2">
                        <span className="text-sm text-slate-200 font-medium">
                          {m.megaEvolved ? m.megaFormName : m.pokemon.name}
                        </span>
                        {active.types.map(t => <TypeBadge key={t} type={t} small />)}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500">—</p>
              )}
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Opponent's Likely Lead</p>
              {predictedLeads.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {predictedLeads.map(p => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span className="text-sm text-slate-200 font-medium">{p.name}</span>
                      {p.types.map(t => <TypeBadge key={t} type={t} small />)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">—</p>
              )}
            </div>
          </div>

          {/* Damage Calculator */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowDmg(d => !d)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors"
            >
              <span>Damage Calculator</span>
              {showDmg ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showDmg && (
              <div className="border-t border-slate-700 p-4 flex flex-col gap-4">

                {/* Attacker / Move / Defender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">Attacker</p>
                    <select
                      value={dmgAtkIdx}
                      onChange={e => { setDmgAtkIdx(Number(e.target.value)); setDmgMoveIdx(0); }}
                      className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5"
                    >
                      {activeMembers.map((m, i) => (
                        <option key={i} value={i}>
                          {m.megaEvolved ? m.megaFormName : m.pokemon.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">Move</p>
                    <select
                      value={dmgMoveIdx}
                      onChange={e => setDmgMoveIdx(Number(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5"
                      disabled={dmgMoves.length === 0}
                    >
                      {dmgMoves.length === 0
                        ? <option>No damaging moves</option>
                        : dmgMoves.map((m, i) => (
                          <option key={i} value={i}>{m.name} ({m.power} BP)</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">Defender</p>
                    <select
                      value={dmgDefIdx}
                      onChange={e => setDmgDefIdx(Number(e.target.value))}
                      className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5"
                    >
                      {validOpponents.map((p, i) => (
                        <option key={i} value={i}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stat stages */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide w-16">Atk stage</span>
                    {stageBtn(atkStage, setAtkStage, atkStage)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide w-16">Def stage</span>
                    {stageBtn(defStage, setDefStage, defStage)}
                  </div>
                </div>

                {/* Weather */}
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1.5">Weather</p>
                  <div className="flex gap-1 flex-wrap">
                    {(['None', 'Sun', 'Rain', 'Sand', 'Snow'] as Weather[]).map(w => (
                      <button
                        key={w}
                        onClick={() => setWeather(w)}
                        className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                          weather === w
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Screens */}
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1.5">Screens (on defender's side)</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReflect(r => !r)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        reflect ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      Reflect
                    </button>
                    <button
                      onClick={() => setLightScreen(l => !l)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        lightScreen ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      Light Screen
                    </button>
                  </div>
                </div>

                {/* Result */}
                {dmgResult && dmgMove && dmgAttackerPokemon && dmgDefender ? (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-slate-200">
                        {dmgAttackerPokemon.name}
                      </span>
                      <span className="text-xs text-slate-400">{dmgMove.name}</span>
                      <span className="text-xs text-slate-600">→</span>
                      <span className="text-sm font-semibold text-slate-200">{dmgDefender.name}</span>
                    </div>
                    {dmgResult.min === 0 ? (
                      <p className="text-sm text-slate-500">No effect (immune)</p>
                    ) : (
                      <>
                        <div className="flex items-end gap-3">
                          <div>
                            <p className="text-[10px] text-slate-500 mb-0.5">Damage range</p>
                            <p className="text-lg font-bold font-mono text-slate-100">
                              {dmgResult.min}–{dmgResult.max}
                              <span className="text-xs text-slate-400 font-normal ml-1">HP</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 mb-0.5">vs {dmgResult.defHP} HP</p>
                            <p className="text-lg font-bold font-mono text-slate-100">
                              {((dmgResult.min / dmgResult.defHP) * 100).toFixed(1)}–{((dmgResult.max / dmgResult.defHP) * 100).toFixed(1)}
                              <span className="text-xs text-slate-400 font-normal ml-1">%</span>
                            </p>
                          </div>
                          <div className="pb-1">
                            <span className={`text-sm font-bold ${
                              dmgResult.max >= dmgResult.defHP ? 'text-red-400'
                              : dmgResult.max * 2 >= dmgResult.defHP ? 'text-orange-400'
                              : 'text-slate-400'
                            }`}>
                              {hkoLabel(
                                (dmgResult.min / dmgResult.defHP) * 100,
                                (dmgResult.max / dmgResult.defHP) * 100,
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div
                              className="h-full bg-orange-500 opacity-50"
                              style={{ width: `${Math.min(100, (dmgResult.min / dmgResult.defHP) * 100)}%` }}
                            />
                            <div
                              className="h-full bg-red-500"
                              style={{ width: `${Math.min(100, ((dmgResult.max - dmgResult.min) / dmgResult.defHP) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-2">Approximate · Lv.50 · 31 IVs · no SP investment · neutral nature</p>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-2">
                    {dmgMoves.length === 0 ? 'Select damaging moves for the attacker in their team slot.' : 'Select attacker, move, and defender to calculate damage.'}
                  </p>
                )}

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
