import { useState, useCallback } from 'react';
import type { TeamMember, Pokemon, Move } from '../types/pokemon';

const TEAM_SIZE = 6;

export function useTeam() {
  const [members, setMembers] = useState<(TeamMember | null)[]>(Array(TEAM_SIZE).fill(null));

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
    isFull,
    count,
    hasPokemon,
  };
}
