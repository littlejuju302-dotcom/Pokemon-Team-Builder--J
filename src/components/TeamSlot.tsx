import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { StatBar } from './StatBar';
import { PokemonSprite } from './PokemonSprite';
import { MoveSelector } from './MoveSelector';
import { useNatures } from '../hooks/usePokemonData';
import type { TeamMember, Move } from '../types/pokemon';

interface Props {
  member: TeamMember | null;
  slotIndex: number;
  onRemove: (i: number) => void;
  onSetMoves: (i: number, moves: Move[]) => void;
  onSetNature: (i: number, nature: string) => void;
}

export function TeamSlot({ member, slotIndex, onRemove, onSetMoves, onSetNature }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { data: natures } = useNatures();

  if (!member) {
    return (
      <div className="border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center h-20 text-slate-600 text-sm">
        Empty Slot {slotIndex + 1}
      </div>
    );
  }

  const { pokemon, moves, nature } = member;

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
          <div className="text-xs text-slate-500 mt-0.5">BST {pokemon.total}</div>
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
          {/* Stats */}
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
