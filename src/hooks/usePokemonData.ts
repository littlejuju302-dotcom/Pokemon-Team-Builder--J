import { useQuery } from '@tanstack/react-query';
import type { PokemonRoster, BaseStats, Pokemon } from '../types/pokemon';

const BASE_URL = 'https://raw.githubusercontent.com/otterlyclueless/pokemon-champions-data/main';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export function usePokemonData() {
  return useQuery({
    queryKey: ['pokemon-data'],
    queryFn: async () => {
      const [roster, stats] = await Promise.all([
        fetchJson<PokemonRoster[]>('pokemon/roster.json'),
        fetchJson<BaseStats[]>('pokemon/base-stats.json'),
      ]);

      const statsMap = new Map<string, BaseStats>(stats.map(s => [s.name, s]));

      const pokemon: Pokemon[] = roster
        .filter(r => r.championsVerified)
        .map(r => {
          const s = statsMap.get(r.name);
          return {
            ...r,
            hp: s?.hp ?? 0,
            atk: s?.atk ?? 0,
            def: s?.def ?? 0,
            spa: s?.spa ?? 0,
            spd: s?.spd ?? 0,
            spe: s?.spe ?? 0,
            total: s?.total ?? 0,
          };
        });

      return pokemon;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useMoves() {
  return useQuery({
    queryKey: ['moves'],
    queryFn: () => fetchJson<import('../types/pokemon').Move[]>('moves/moves.json'),
    staleTime: 1000 * 60 * 60,
    select: moves => moves.filter(m => m.inChampions),
  });
}

export function useLearnsets() {
  return useQuery({
    queryKey: ['learnsets'],
    queryFn: () =>
      fetchJson<Record<string, { moves: Array<{ name: string }>; dexNumber: number; form: string }>>('learnsets/learnsets.json'),
    staleTime: 1000 * 60 * 60,
  });
}

export function useNatures() {
  return useQuery({
    queryKey: ['natures'],
    queryFn: () =>
      fetchJson<Array<{ name: string; increasedStat: string | null; decreasedStat: string | null }>>('natures/natures.json'),
    staleTime: Infinity,
  });
}
