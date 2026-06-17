import { useState, useCallback } from 'react';
import type { TeamMember } from '../types/pokemon';

const SLOTS_KEY = 'champ-saved-teams-v1';
const MAX_SLOTS = 8;

export interface SavedTeam {
  id: string;
  name: string;
  savedAt: string; // ISO date
  members: (TeamMember | null)[];
}

function loadSlots(): SavedTeam[] {
  try {
    const raw = localStorage.getItem(SLOTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function persist(teams: SavedTeam[]) {
  try { localStorage.setItem(SLOTS_KEY, JSON.stringify(teams)); } catch {}
}

export function useSavedTeams() {
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>(loadSlots);

  const saveTeam = useCallback((name: string, members: (TeamMember | null)[]) => {
    setSavedTeams(prev => {
      const next = [
        { id: Date.now().toString(), name: name.trim() || 'My Team', savedAt: new Date().toISOString(), members },
        ...prev,
      ].slice(0, MAX_SLOTS);
      persist(next);
      return next;
    });
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setSavedTeams(prev => {
      const next = prev.filter(t => t.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const renameTeam = useCallback((id: string, newName: string) => {
    setSavedTeams(prev => {
      const next = prev.map(t => t.id === id ? { ...t, name: newName.trim() || t.name } : t);
      persist(next);
      return next;
    });
  }, []);

  return { savedTeams, saveTeam, deleteTeam, renameTeam };
}
