import { Plus, Check } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { StatBar } from './StatBar';
import { PokemonSprite } from './PokemonSprite';
import type { Pokemon } from '../types/pokemon';

interface Props {
  pokemon: Pokemon;
  onAdd: (p: Pokemon) => void;
  inTeam: boolean;
  teamFull: boolean;
}

export function PokemonCard({ pokemon, onAdd, inTeam, teamFull }: Props) {
  const canAdd = !inTeam && !teamFull;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 hover:border-violet-500 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 font-mono">#{String(pokemon.dexNumber).padStart(3, '0')}</span>
          <h3 className="text-slate-100 font-semibold text-sm leading-tight">{pokemon.name}</h3>
          <div className="flex gap-1 flex-wrap">
            {pokemon.types.map(t => <TypeBadge key={t} type={t} small />)}
          </div>
        </div>
        <PokemonSprite name={pokemon.name} dexNumber={pokemon.dexNumber} size={72} />
      </div>

      <div className="flex flex-col gap-1">
        <StatBar label="HP"  value={pokemon.hp} />
        <StatBar label="ATK" value={pokemon.atk} />
        <StatBar label="DEF" value={pokemon.def} />
        <StatBar label="SPA" value={pokemon.spa} />
        <StatBar label="SPD" value={pokemon.spd} />
        <StatBar label="SPE" value={pokemon.spe} />
        <div className="text-xs text-slate-400 text-right font-mono mt-0.5">BST {pokemon.total}</div>
      </div>

      <button
        onClick={() => canAdd && onAdd(pokemon)}
        disabled={!canAdd}
        className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
          inTeam
            ? 'bg-violet-900/50 text-violet-300 cursor-default'
            : canAdd
            ? 'bg-violet-600 hover:bg-violet-500 text-white cursor-pointer'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {inTeam ? (
          <><Check size={13} /> On Team</>
        ) : (
          <><Plus size={13} /> Add to Team</>
        )}
      </button>
    </div>
  );
}
