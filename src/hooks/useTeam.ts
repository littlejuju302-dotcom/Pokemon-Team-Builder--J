import { useState, useCallback, useEffect } from 'react';
import type { TeamMember, Pokemon, Move } from '../types/pokemon';

const TEAM_SIZE = 6;
const AUTOSAVE_KEY = 'champ-team-v1';

function loadFromStorage(): (TeamMember | null)[] {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === TEAM_SIZE) return parsed;
    }
  } catch {}
  return Array(TEAM_SIZE).fill(null);
}

export function useTeam() {
  const [members, setMembers] = useState<(TeamMember | null)[]>(loadFromStorage);

  useEffect(() => {
    try { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(members)); } catch {}
  }, [members]);

  const addPokemon = useCallback((pokemon: Pokemon, slotIndex?: number) => {
    setMembers(prev => {
      const next = [...prev];
      const targetSlot = slotIndex ?? next.findIndex(m => m === null);
      if (targetSlot === -1) return prev; // team full
      next[targetSlot] = {
        pokemon,
        moves: [],
        nature: 'Hardy',
        item: '',
        spAllocation: {},
        selectedAbility: Object.values(pokemon.abilities)[0] ?? '',
      };
      return next;
    });
  }, []);

  const removePokemon = useCallback((slotIndex: number) => {
    setMembers(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  const setMoves = useCallback((slotIndex: number, moves: Move[]) => {
    setMembers(prev => {
      const next = [...prev];
      const member = next[slotIndex];
      if (!member) return prev;
      next[slotIndex] = { ...member, moves };
      return next;
    });
  }, []);

  const setNature = useCallback((slotIndex: number, nature: string) => {
    setMembers(prev => {
      const next = [...prev];
      const member = next[slotIndex];
      if (!member) return prev;
      next[slotIndex] = { ...member, nature };
      return next;
    });
  }, []);

  const setItem = useCallback((slotIndex: number, item: string) => {
    setMembers(prev => {
      const next = [...prev];
      const member = next[slotIndex];
      if (!member) return prev;
      next[slotIndex] = { ...member, item };
      return next;
    });
  }, []);

  const setMegaEvolved = useCallback((slotIndex: number, evolved: boolean, formName?: string) => {
    setMembers(prev => {
      const next = [...prev];
      const member = next[slotIndex];
      if (!member) return prev;
      next[slotIndex] = { ...member, megaEvolved: evolved, megaFormName: formName };
      return next;
    });
  }, []);

  const setSelectedAbility = useCallback((slotIndex: number, ability: string) => {
    setMembers(prev => {
      const next = [...prev];
      const member = next[slotIndex];
      if (!member) return prev;
      next[slotIndex] = { ...member, selectedAbility: ability };
      return next;
    });
  }, []);

  const setSpAllocation = useCallback((slotIndex: number, stat: string, value: number) => {
    setMembers(prev => {
      const next = [...prev];
      const member = next[slotIndex];
      if (!member) return prev;
      next[slotIndex] = {
        ...member,
        spAllocation: { ...member.spAllocation, [stat]: Math.max(0, Math.min(32, value)) },
      };
      return next;
    });
  }, []);

  const loadTeam = useCallback((newMembers: (TeamMember | null)[]) => {
    setMembers(newMembers.length === TEAM_SIZE ? newMembers : Array(TEAM_SIZE).fill(null));
  }, []);

  const isFull = members.every(m => m !== null);
  const count = members.filter(Boolean).length;

  const hasPokemon = useCallback((name: string) =>
    members.some(m => m?.pokemon.name === name), [members]);

  return {
    members,
    addPokemon,
    removePokemon,
    setMoves,
    setNature,
    setItem,
    setMegaEvolved,
    setSelectedAbility,
    setSpAllocation,
    loadTeam,
    isFull,
    count,
    hasPokemon,
  };
}
