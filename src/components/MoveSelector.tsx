import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { useMoves, useLearnsets } from '../hooks/usePokemonData';
import type { Move, Pokemon } from '../types/pokemon';

interface Props {
  pokemon: Pokemon;
  selectedMoves: Move[];
  onChange: (moves: Move[]) => void;
}

export function MoveSelector({ pokemon, selectedMoves, onChange }: Props) {
  const { data: allMoves } = useMoves();
  const { data: learnsets } = useLearnsets();
  const [query, setQuery] = useState('');

  const learnableMoveNames = useMemo(() => {
    if (!learnsets) return new Set<string>();
    const entry = learnsets[pokemon.name];
    if (!entry) return new Set<string>();
    return new Set(entry.moves.map(m => m.name));
  }, [learnsets, pokemon.name]);

  const availableMoves = useMemo(() => {
    if (!allMoves) return [];
    return allMoves
      .filter(m => learnableMoveNames.has(m.name) && !selectedMoves.find(s => s.name === m.name))
      .filter(m => !query || m.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 40);
  }, [allMoves, learnableMoveNames, selectedMoves, query]);

  const addMove = (move: Move) => {
    if (selectedMoves.length >= 4) return;
    onChange([...selectedMoves, move]);
  };

  const removeMove = (moveName: string) => {
    onChange(selectedMoves.filter(m => m.name !== moveName));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Selected moves */}
      <div className="grid grid-cols-2 gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => {
          const move = selectedMoves[i];
          return (
            <div
              key={i}
              className={`rounded-lg border px-2 py-1.5 min-h-[40px] flex items-center justify-between text-xs ${
                move ? 'border-slate-600 bg-slate-700/50' : 'border-dashed border-slate-700 bg-slate-800/30'
              }`}
            >
              {move ? (
                <>
                  <div>
                    <div className="font-medium text-slate-200">{move.name}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <TypeBadge type={move.type} small />
                      <span className="text-slate-500">{move.category}</span>
                      {move.power && <span className="text-slate-400">{move.power} BP</span>}
                    </div>
                  </div>
                  <button onClick={() => removeMove(move.name)} className="text-slate-500 hover:text-red-400 ml-1">
                    <X size={12} />
                  </button>
                </>
              ) : (
                <span className="text-slate-600">Empty slot</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Move search */}
      {selectedMoves.length < 4 && (
        <div className="mt-1">
          <div className="relative mb-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search learnable moves…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1 pr-1">
            {learnableMoveNames.size === 0 ? (
              <p className="text-xs text-slate-500 text-center py-2">Loading learnset…</p>
            ) : availableMoves.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-2">No moves found</p>
            ) : availableMoves.map(move => (
              <button
                key={move.name}
                onClick={() => addMove(move)}
                className="text-left flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-700 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <TypeBadge type={move.type} small />
                  <span className="text-slate-200">{move.name}</span>
                  <span className="text-slate-500">{move.category}</span>
                </div>
                {move.power ? <span className="text-slate-400 font-mono">{move.power}</span> : <span className="text-slate-600">—</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
