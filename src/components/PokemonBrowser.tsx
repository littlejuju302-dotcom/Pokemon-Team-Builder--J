import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PokemonCard } from './PokemonCard';
import { TypeBadge } from './TypeBadge';
import { usePokemonData } from '../hooks/usePokemonData';
import { ALL_TYPES } from '../data/typeChart';
import { getMetaWeight } from '../data/metaWeights';
import type { Pokemon, PokemonType } from '../types/pokemon';

interface Props {
  onAddPokemon: (p: Pokemon) => void;
  hasPokemon: (name: string) => boolean;
  teamFull: boolean;
}

type SortKey = 'meta' | 'name' | 'total' | 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

export function PokemonBrowser({ onAddPokemon, hasPokemon, teamFull }: Props) {
  const { data: pokemon, isLoading, error } = usePokemonData();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PokemonType | ''>('');
  const [formFilter, setFormFilter] = useState<'all' | 'base' | 'regional' | 'variant'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('meta');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    if (!pokemon) return [];
    return pokemon
      .filter(p => {
        if (p.form === 'Mega') return false; // Megas accessed via slot Mega Evolution
        const matchName = p.name.toLowerCase().includes(query.toLowerCase());
        const matchType = !typeFilter || p.types.includes(typeFilter);
        const matchForm = formFilter === 'all'
          || (formFilter === 'base' && p.form === 'Base')
          || (formFilter === 'regional' && p.form === 'Regional')
          || (formFilter === 'variant' && p.form === 'Variant');
        return matchName && matchType && matchForm;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'meta') {
          const diff = getMetaWeight(b.name) - getMetaWeight(a.name);
          return diff !== 0 ? diff : b.total - a.total;
        }
        return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
      });
  }, [pokemon, query, typeFilter, formFilter, sortBy]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Pokémon Champions data…
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-400 text-sm">
      Failed to load data. Check your connection and refresh.
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Pokémon…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1 transition-colors ${
            showFilters ? 'bg-violet-700 border-violet-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-violet-500'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col gap-3">
          {/* Type filter */}
          <div>
            <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">Type</p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setTypeFilter('')}
                className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wide transition-opacity ${
                  !typeFilter ? 'opacity-100 ring-2 ring-white' : 'opacity-50 hover:opacity-80'
                } bg-slate-600 text-slate-200`}
              >
                All
              </button>
              {ALL_TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(typeFilter === t ? '' : t)}>
                  <span className={typeFilter === t ? 'ring-2 ring-white rounded' : 'opacity-60 hover:opacity-100 transition-opacity'}>
                    <TypeBadge type={t} small />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form & Sort */}
          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wide">Form</p>
              <div className="flex gap-1">
                {(['all', 'base', 'regional', 'variant'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormFilter(f)}
                    className={`text-xs px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      formFilter === f ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wide">Sort by</p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-2 py-1"
              >
                <option value="meta">Meta Usage</option>
                <option value="total">BST</option>
                <option value="name">Name</option>
                <option value="hp">HP</option>
                <option value="atk">ATK</option>
                <option value="def">DEF</option>
                <option value="spa">SPA</option>
                <option value="spd">SPD</option>
                <option value="spe">SPE</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500">{filtered.length} Pokémon</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(p => (
          <PokemonCard
            key={p.name}
            pokemon={p}
            onAdd={onAddPokemon}
            inTeam={hasPokemon(p.name)}
            teamFull={teamFull}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-slate-500 py-12 text-sm">No Pokémon match your filters.</div>
      )}
    </div>
  );
}
