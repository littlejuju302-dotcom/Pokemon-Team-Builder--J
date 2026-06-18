// Shared stat calculation helpers used in TeamSlot and MatchupPicker.

export const NATURE_STAT_MAP: Record<string, string> = {
  'attack':          'atk',
  'defense':         'def',
  'special-attack':  'spa',
  'special-defense': 'spd',
  'speed':           'spe',
};

interface NatureEntry {
  name: string;
  increasedStat: string | null;
  decreasedStat: string | null;
}

// Returns 1.1, 0.9, or 1.0 for a given stat key ('atk', 'def', ...) under the given nature.
export function getNatureMult(
  stat: string,
  natureName: string,
  natures: NatureEntry[] | undefined,
): number {
  if (!natures) return 1;
  const n = natures.find(x => x.name.toLowerCase() === natureName.toLowerCase());
  if (!n?.increasedStat) return 1;
  if (NATURE_STAT_MAP[n.increasedStat] === stat) return 1.1;
  if (NATURE_STAT_MAP[n.decreasedStat ?? ''] === stat) return 0.9;
  return 1;
}

// Level-50 stat approximation with 31 IVs, no EVs — then apply nature and flat SP.
// SP in Champions format is a direct stat bonus (not EVs).
export function calcFinalStat(
  base: number,
  isHP: boolean,
  sp: number,
  natureMult: number,
): number {
  if (isHP) {
    return Math.floor((2 * base + 31 + 100) * 50 / 100 + 10) + sp;
  }
  const raw = Math.floor((2 * base + 31) * 50 / 100 + 5);
  return Math.floor(raw * natureMult) + sp;
}
