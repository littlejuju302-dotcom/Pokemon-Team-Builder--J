import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { StatBar } from './StatBar';
import { PokemonSprite } from './PokemonSprite';
import { MoveSelector } from './MoveSelector';
import { useNatures } from '../hooks/usePokemonData';
import { getCompetitiveSet } from '../data/competitiveSets';
import type { TeamMember, Move } from '../types/pokemon';

interface Props {
  member: TeamMember | null;
  slotIndex: number;
  onRemove: (i: number) => void;
  onSetMoves: (i: number, moves: Move[]) => void;
  onSetNature: (i: number, nature: string) => void;
  onSetItem: (i: number, item: string) => void;
}

const SP_STAT_LABELS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const;
const SP_STAT_DISPLAY: Record<string, string> = {
  hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE',
};

function spBarColor(value: number) {
  if (value >= 32) return 'bg-amber-400';
  if (value >= 16) return 'bg-violet-500';
  if (value > 0)  return 'bg-blue-500';
  return '';
}

export function TeamSlot({ member, slotIndex, onRemove, onSetMoves, onSetNature, onSetItem }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { data: natures } = useNatures();

  if (!member) {
    return (
      <div className="border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center h-20 text-slate-600 text-sm">
        Empty Slot {slotIndex + 1}
      </div>
    );
  }

  const { pokemon, moves, nature, item } = member;
  const compSet = getCompetitiveSet(pokemon.name);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <PokemonSprite name={pokemon.name} dexNumber={pokemon.dexNumber} size={52} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-100 font-semibold text-sm">{pokemon.name}</span>
            {pokemon.types.map(t => <TypeBadge key={t} type={t} small />)}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">BST {pokemon.total}</span>
            {item && (
              <span className="text-[10px] bg-amber-900/50 border border-amber-700/50 text-amber-300 px-1.5 py-0.5 rounded">
                {item}
              </span>
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
          {/* Base Stats */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Base Stats</p>
            <div className="flex flex-col gap-1">
              <StatBar label="HP"  value={pokemon.hp} />
              <StatBar label="ATK" value={pokemon.atk} />
              <StatBar label="DEF" value={pokemon.def} />
              <StatBar label="SPA" value={pokemon.spa} />
              <StatBar label="SPD" value={pokemon.spd} />
              <StatBar label="SPE" value={pokemon.spe} />
            </div>
          </div>

          {/* Competitive Build */}
          {compSet && (
            <div className="bg-slate-700/40 border border-slate-600/60 rounded-xl p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-violet-300 uppercase tracking-wide">Competitive Build</p>
                <span className="text-[10px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">{compSet.role}</span>
              </div>

              {/* Recommended Moves with usage bars */}
              <div>
                <p className="text-[10px] text-slate-500 mb-1.5">Top moves by tournament usage</p>
                <div className="flex flex-col gap-1.5">
                  {compSet.moves.map(mv => {
                    const isSelected = moves.some(m => m.name === mv.name);
                    return (
                      <div key={mv.name} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 flex-shrink-0 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-green-500' : 'bg-slate-600'
                        }`}>
                          {isSelected && <Check size={8} className="text-white" />}
                        </div>
                        <span className={`text-xs w-28 truncate flex-shrink-0 ${isSelected ? 'text-green-400 font-medium' : 'text-slate-300'}`}>
                          {mv.name}
                        </span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isSelected ? 'bg-green-500' : 'bg-violet-500'}`}
                            style={{ width: `${mv.usage}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 w-9 text-right flex-shrink-0">
                          {mv.usage.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Items */}
              {compSet.items.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-500 mb-1.5">Recommended items (click to select)</p>
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

              {/* Nature + Ability */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 mb-0.5">Nature</p>
                  <span className={`text-xs font-medium ${nature === compSet.nature ? 'text-green-400' : 'text-slate-200'}`}>
                    {compSet.nature}
                    {nature === compSet.nature && <span className="ml-1 text-green-400">✓</span>}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 mb-0.5">Ability</p>
                  <span className="text-xs text-slate-200">{compSet.ability}</span>
                </div>
              </div>

              {/* SP Spread */}
              <div>
                <p className="text-[10px] text-slate-500 mb-1.5">
                  SP Investment <span className="text-slate-600">(66 pts total · max 32 per stat)</span>
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {SP_STAT_LABELS.map(stat => {
                    const value = compSet.spSpread[stat];
                    return (
                      <div key={stat} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 w-7 flex-shrink-0">{SP_STAT_DISPLAY[stat]}</span>
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${spBarColor(value)}`}
                            style={{ width: `${(value / 32) * 100}%` }}
                          />
                        </div>
                        <span className={`text-[10px] w-6 text-right flex-shrink-0 font-medium ${
                          value >= 32 ? 'text-amber-400' : value > 0 ? 'text-slate-300' : 'text-slate-600'
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
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Abilities</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(pokemon.abilities).map(([slot, ability]) => (
                <span key={slot} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                  {ability}{slot === 'H' ? ' (HA)' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Moves */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Moves (max 4)</p>
            <MoveSelector
              pokemon={pokemon}
              selectedMoves={moves}
              onChange={m => onSetMoves(slotIndex, m)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
