import { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, Check, Zap } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { PokemonSprite } from './PokemonSprite';
import { MoveSelector } from './MoveSelector';
import { useNatures, usePokemonData, useMoves } from '../hooks/usePokemonData';
import { getCompetitiveSet } from '../data/competitiveSets';
import { AbilityBadge } from './AbilityBadge';
import { ALL_ITEMS } from '../data/items';
import { getNatureMult, calcFinalStat } from '../utils/stats';
import type { TeamMember, Move, BaseStats } from '../types/pokemon';

interface Props {
  member: TeamMember | null;
  slotIndex: number;
  onRemove: (i: number) => void;
  onSetMoves: (i: number, moves: Move[]) => void;
  onSetNature: (i: number, nature: string) => void;
  onSetItem: (i: number, item: string) => void;
  onSetMegaEvolved: (i: number, evolved: boolean, formName?: string) => void;
  onSetSelectedAbility: (i: number, ability: string) => void;
  onSetSpAllocation: (i: number, stat: string, value: number) => void;
}

const SP_STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const;
type SpStat = typeof SP_STATS[number];

const SP_LABELS: Record<SpStat, string> = {
  hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE',
};

const STAT_COLORS: Record<SpStat, string> = {
  hp:  '#ff5959',
  atk: '#f5ac78',
  def: '#fae078',
  spa: '#9db7f5',
  spd: '#a7db8d',
  spe: '#fa92b2',
};

export function TeamSlot({
  member, slotIndex,
  onRemove, onSetMoves, onSetNature, onSetItem, onSetMegaEvolved, onSetSelectedAbility, onSetSpAllocation,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [itemQuery, setItemQuery] = useState('');
  const [itemOpen, setItemOpen] = useState(false);

  const { data: natures } = useNatures();
  const { data: allPokemon } = usePokemonData();
  const { data: allMoves } = useMoves();

  const megaForms = useMemo(() => {
    if (!allPokemon || !member) return [];
    const baseName = member.pokemon.name;
    return allPokemon.filter(p =>
      p.form === 'Mega' &&
      (p.name === `Mega ${baseName}` || p.name.startsWith(`Mega ${baseName} `))
    );
  }, [allPokemon, member?.pokemon.name]);

  const itemSuggestions = useMemo(() => {
    if (!itemQuery.trim()) return [];
    return ALL_ITEMS.filter(i => i.toLowerCase().includes(itemQuery.toLowerCase())).slice(0, 8);
  }, [itemQuery]);

  // Derive displayPokemon early (non-hook) so the memos below can use it before the early return.
  const _activeMega = (member?.megaEvolved && member?.megaFormName)
    ? allPokemon?.find(p => p.name === member.megaFormName) ?? null
    : null;
  const _displayPokemon = _activeMega ?? member?.pokemon ?? null;

  // These useMemo calls MUST stay before the early return so hook call order never changes.
  const natureMults = useMemo(() => {
    const result = {} as Record<SpStat, number>;
    const nat = member?.nature ?? 'Hardy';
    for (const s of SP_STATS) result[s] = s === 'hp' ? 1 : getNatureMult(s, nat, natures);
    return result;
  }, [member?.nature, natures]);

  const finalStats = useMemo(() => {
    if (!member || !_displayPokemon) return {} as Record<SpStat, number>;
    const dp = _displayPokemon;
    const result = {} as Record<SpStat, number>;
    for (const s of SP_STATS) {
      result[s] = calcFinalStat(
        dp[s as keyof typeof dp] as number,
        s === 'hp',
        member.spAllocation[s as keyof BaseStats] ?? 0,
        natureMults[s],
      );
    }
    return result;
  }, [_displayPokemon, member?.spAllocation, natureMults]);

  if (!member) {
    return (
      <div className="border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center h-20 text-slate-600 text-sm">
        Empty Slot {slotIndex + 1}
      </div>
    );
  }

  const { pokemon, moves, nature, item } = member;
  const displayPokemon = _displayPokemon ?? pokemon;

  const compSet = getCompetitiveSet(
    member.megaEvolved && member.megaFormName ? member.megaFormName : pokemon.name
  );
  const totalSP = SP_STATS.reduce((sum, s) => sum + (member.spAllocation[s] ?? 0), 0);
  const remainingSP = 66 - totalSP;

  const setSP = (stat: SpStat, value: number) => {
    onSetSpAllocation(slotIndex, stat, value);
  };

  const maxSPForStat = (stat: SpStat) => {
    const cur = member.spAllocation[stat as keyof BaseStats] ?? 0;
    return Math.min(32, cur + remainingSP);
  };

  const handleMegaEvolve = (megaName: string) => {
    const megaSet = getCompetitiveSet(megaName);
    const stone = megaSet?.items[0]?.name;
    if (stone && !item) onSetItem(slotIndex, stone);
    onSetMegaEvolved(slotIndex, true, megaName);
    const megaPokemon = allPokemon?.find(p => p.name === megaName);
    if (megaPokemon) {
      const firstAbility = Object.values(megaPokemon.abilities)[0];
      if (firstAbility) onSetSelectedAbility(slotIndex, firstAbility);
    }
  };

  const handleRevert = () => {
    onSetMegaEvolved(slotIndex, false, undefined);
    const firstAbility = Object.values(pokemon.abilities)[0];
    if (firstAbility) onSetSelectedAbility(slotIndex, firstAbility);
  };

  const applyCompMove = (moveName: string) => {
    if (!allMoves || moves.length >= 4 || moves.some(m => m.name === moveName)) return;
    const move = allMoves.find(m => m.name === moveName);
    if (move) onSetMoves(slotIndex, [...moves, move]);
  };

  const applyFullSet = () => {
    if (!compSet) return;
    onSetNature(slotIndex, compSet.nature);
    onSetSelectedAbility(slotIndex, compSet.ability);
    if (compSet.items[0]) onSetItem(slotIndex, compSet.items[0].name);
    for (const s of SP_STATS) onSetSpAllocation(slotIndex, s, compSet.spSpread[s] ?? 0);
    if (allMoves) {
      const newMoves: Move[] = [];
      for (const cm of compSet.moves.slice(0, 4)) {
        const mv = allMoves.find(m => m.name === cm.name);
        if (mv) newMoves.push(mv);
      }
      if (newMoves.length > 0) onSetMoves(slotIndex, newMoves);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <PokemonSprite name={pokemon.name} dexNumber={pokemon.dexNumber} size={52} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-100 font-semibold text-sm">
              {member.megaEvolved ? member.megaFormName : pokemon.name}
            </span>
            {member.megaEvolved && (
              <span className="text-[9px] font-bold bg-amber-500/20 border border-amber-500/50 text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                MEGA
              </span>
            )}
            {displayPokemon.types.map(t => <TypeBadge key={t} type={t} small />)}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-500">{nature}</span>
            {member.selectedAbility && (
              <span className="text-[10px] text-violet-400">{member.selectedAbility}</span>
            )}
            {item && (
              <span className="text-[10px] bg-amber-900/50 border border-amber-700/50 text-amber-300 px-1.5 py-0.5 rounded">
                {item}
              </span>
            )}
            {totalSP > 0 && (
              <span className="text-[10px] text-slate-500">{totalSP}/66 SP</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {moves.map(m => (
              <span key={m.name} className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{m.name}</span>
            ))}
            {moves.length === 0 && <span className="text-xs text-slate-600">No moves selected</span>}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={() => onRemove(slotIndex)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
            <X size={14} />
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-700 p-3 flex flex-col gap-4">

          {/* Mega Evolution */}
          {megaForms.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Mega Evolution</p>
              <div className="flex items-center gap-2 flex-wrap">
                {member.megaEvolved ? (
                  <>
                    <span className="text-xs text-amber-300 font-medium">{member.megaFormName}</span>
                    <button onClick={handleRevert} className="text-xs bg-slate-700 border border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-400 px-2 py-1 rounded-lg transition-colors">
                      ↩ Revert
                    </button>
                  </>
                ) : (
                  megaForms.map(mega => {
                    const label = mega.name === `Mega ${pokemon.name}` ? 'Mega Evolve' : mega.name.replace(`Mega ${pokemon.name} `, '');
                    return (
                      <button key={mega.name} onClick={() => handleMegaEvolve(mega.name)}
                        className="text-xs bg-amber-600/20 border border-amber-500/50 text-amber-400 hover:bg-amber-600/40 hover:border-amber-400 px-2.5 py-1 rounded-lg transition-colors font-medium">
                        ⚡ {label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Stats with SP allocation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {member.megaEvolved ? 'Mega Form Stats' : 'Stats'} · Lv.50
              </p>
              <span className={`text-[10px] font-medium ${remainingSP === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                {totalSP}/66 SP
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {SP_STATS.map(stat => {
                const sp = member.spAllocation[stat as keyof BaseStats] ?? 0;
                const mult = natureMults[stat];
                const finalVal = finalStats[stat];
                const maxVal = 300;
                const canAdd = sp < 32 && remainingSP > 0;
                const canSub = sp > 0;
                const canMax = maxSPForStat(stat) > sp;

                return (
                  <div key={stat} className="flex items-center gap-1.5">
                    {/* Stat label — colored by nature */}
                    <span className={`text-xs font-bold w-9 flex-shrink-0 ${
                      mult > 1 ? 'text-rose-400' : mult < 1 ? 'text-sky-400' : 'text-slate-400'
                    }`}>
                      {SP_LABELS[stat]}{mult > 1 ? '+' : mult < 1 ? '−' : ''}
                    </span>

                    {/* Final stat value */}
                    <span className="w-8 text-right font-mono text-slate-100 text-xs font-semibold flex-shrink-0">{finalVal}</span>

                    {/* Bar */}
                    <div className="flex-1 h-2 rounded-full bg-slate-700 min-w-0">
                      <div
                        className="h-2 rounded-full transition-all duration-200"
                        style={{
                          width: `${Math.min(100, (finalVal / maxVal) * 100)}%`,
                          backgroundColor: STAT_COLORS[stat],
                        }}
                      />
                    </div>

                    {/* SP controls */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => setSP(stat, sp - 1)}
                        disabled={!canSub}
                        className="w-5 h-5 text-[10px] bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 disabled:opacity-25 disabled:cursor-not-allowed leading-none"
                      >−</button>
                      <span className="text-[10px] w-5 text-center font-mono text-slate-300">{sp}</span>
                      <button
                        onClick={() => setSP(stat, sp + 1)}
                        disabled={!canAdd}
                        className="w-5 h-5 text-[10px] bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 disabled:opacity-25 disabled:cursor-not-allowed leading-none"
                      >+</button>
                      {canMax && (
                        <button
                          onClick={() => setSP(stat, maxSPForStat(stat))}
                          className="text-[9px] text-slate-500 hover:text-violet-400 ml-0.5 w-5 text-center transition-colors"
                        >MAX</button>
                      )}
                      {!canMax && <span className="w-5 ml-0.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
            {remainingSP > 0 && (
              <p className="text-[10px] text-slate-600 mt-1.5">{remainingSP} SP remaining</p>
            )}
          </div>

          {/* Nature */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Nature</p>
            <select
              value={nature}
              onChange={e => onSetNature(slotIndex, e.target.value)}
              className="bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5 w-full"
            >
              {(natures ?? []).map(n => (
                <option key={n.name} value={n.name}>
                  {n.name}{n.increasedStat ? ` (+${n.increasedStat} / -${n.decreasedStat})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Abilities */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              {member.megaEvolved ? 'Mega Ability' : 'Abilities'}
              {!member.megaEvolved && (
                <span className="ml-1 font-normal normal-case text-slate-600">(select active · ⓘ for info)</span>
              )}
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(displayPokemon.abilities).map(([slot, ability]) => (
                <AbilityBadge
                  key={slot}
                  name={ability}
                  isHidden={slot === 'H' && !member.megaEvolved}
                  selected={member.selectedAbility === ability}
                  onSelect={() => onSetSelectedAbility(slotIndex, ability)}
                />
              ))}
            </div>
          </div>

          {/* Item */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Item</p>
            {item && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-amber-900/50 border border-amber-700/50 text-amber-300 px-2 py-1 rounded-lg font-medium">{item}</span>
                <button onClick={() => onSetItem(slotIndex, '')} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={itemQuery}
                onChange={e => { setItemQuery(e.target.value); setItemOpen(true); }}
                onFocus={() => setItemOpen(true)}
                onBlur={() => setTimeout(() => setItemOpen(false), 150)}
                placeholder={item ? 'Change item…' : 'Search all items…'}
                className="w-full bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1.5 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
              />
              {itemOpen && itemSuggestions.length > 0 && (
                <div className="absolute z-30 top-full mt-0.5 left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-y-auto max-h-40">
                  {itemSuggestions.map(it => (
                    <button
                      key={it}
                      onMouseDown={() => { onSetItem(slotIndex, it); setItemQuery(''); setItemOpen(false); }}
                      className={`w-full text-left px-2 py-1.5 text-xs hover:bg-slate-700 border-b border-slate-700 last:border-0 ${item === it ? 'text-amber-300' : 'text-slate-200'}`}
                    >
                      {it}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Moves */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Moves (max 4)</p>
            <MoveSelector pokemon={pokemon} selectedMoves={moves} onChange={m => onSetMoves(slotIndex, m)} />
          </div>

          {/* Competitive Build Reference */}
          {compSet && (
            <div className="bg-slate-700/40 border border-slate-600/60 rounded-xl p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-violet-300 uppercase tracking-wide">Competitive Build</p>
                  <span className="text-[10px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">{compSet.role}</span>
                </div>
                <button
                  onClick={applyFullSet}
                  className="flex items-center gap-1 text-[10px] bg-violet-700/40 border border-violet-600/50 text-violet-300 hover:bg-violet-700/60 px-2 py-1 rounded-lg transition-colors font-medium flex-shrink-0"
                >
                  <Zap size={9} />
                  Apply All
                </button>
              </div>

              {/* Recommended Moves */}
              <div>
                <p className="text-[10px] text-slate-500 mb-1.5">Moves — click to add</p>
                <div className="flex flex-col gap-1">
                  {compSet.moves.map(mv => {
                    const isSelected = moves.some(m => m.name === mv.name);
                    const canAdd = !isSelected && moves.length < 4 && !!allMoves;
                    return (
                      <div key={mv.name} className="flex items-center gap-2">
                        <button
                          onClick={() => applyCompMove(mv.name)}
                          disabled={isSelected || moves.length >= 4}
                          className={`flex items-center gap-1.5 flex-1 min-w-0 text-left transition-colors ${
                            isSelected
                              ? 'cursor-default'
                              : canAdd
                              ? 'hover:text-slate-100'
                              : 'opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 flex-shrink-0 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-green-500' : 'bg-slate-600'
                          }`}>
                            {isSelected && <Check size={8} className="text-white" />}
                          </div>
                          <span className={`text-xs truncate ${isSelected ? 'text-green-400 font-medium' : 'text-slate-300'}`}>
                            {mv.name}
                          </span>
                        </button>
                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isSelected ? 'bg-green-500' : 'bg-violet-500'}`}
                            style={{ width: `${mv.usage}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 w-9 text-right flex-shrink-0">{mv.usage.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nature + Ability quick-apply */}
              <div className="flex flex-wrap gap-3">
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Nature</p>
                  <button
                    onClick={() => onSetNature(slotIndex, compSet.nature)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                      nature === compSet.nature
                        ? 'bg-green-700/30 border-green-600/50 text-green-400 cursor-default'
                        : 'bg-slate-700 border-slate-600 text-slate-200 hover:border-violet-500 hover:text-violet-300'
                    }`}
                  >
                    {compSet.nature}
                    {nature === compSet.nature && <span className="ml-1">✓</span>}
                  </button>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Ability</p>
                  <button
                    onClick={() => onSetSelectedAbility(slotIndex, compSet.ability)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                      member.selectedAbility === compSet.ability
                        ? 'bg-green-700/30 border-green-600/50 text-green-400 cursor-default'
                        : 'bg-slate-700 border-slate-600 text-slate-200 hover:border-violet-500 hover:text-violet-300'
                    }`}
                  >
                    {compSet.ability}
                    {member.selectedAbility === compSet.ability && <span className="ml-1">✓</span>}
                  </button>
                </div>
              </div>

              {/* Recommended Items */}
              {compSet.items.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-500 mb-1.5">Items — click to select</p>
                  <div className="flex flex-wrap gap-1.5">
                    {compSet.items.map(it => {
                      const isSelected = item === it.name;
                      return (
                        <button
                          key={it.name}
                          onClick={() => onSetItem(slotIndex, isSelected ? '' : it.name)}
                          className={`text-[11px] px-2 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                            isSelected
                              ? 'bg-amber-600/40 border-amber-500 text-amber-300'
                              : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500 hover:text-slate-200'
                          }`}
                        >
                          {isSelected && <Check size={9} />}
                          {it.name}
                          <span className="text-slate-400 ml-0.5">{it.usage.toFixed(0)}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SP Spread quick-apply */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] text-slate-500">SP Spread</p>
                  <button
                    onClick={() => { for (const s of SP_STATS) onSetSpAllocation(slotIndex, s, compSet.spSpread[s] ?? 0); }}
                    className="text-[10px] text-violet-400 hover:text-violet-300 underline transition-colors"
                  >
                    Apply spread
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {SP_STATS.map(stat => {
                    const value = compSet.spSpread[stat] ?? 0;
                    const currentSP = member.spAllocation[stat as keyof BaseStats] ?? 0;
                    return (
                      <div key={stat} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 w-7 flex-shrink-0">{SP_LABELS[stat]}</span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${currentSP === value ? 'bg-green-500' : 'bg-violet-500'}`}
                            style={{ width: `${(value / 32) * 100}%` }}
                          />
                        </div>
                        <span className={`text-[10px] w-6 text-right flex-shrink-0 font-medium ${
                          currentSP === value ? 'text-green-400' : value >= 32 ? 'text-amber-400' : value > 0 ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {value > 0 ? value : '–'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
