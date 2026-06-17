export type PokemonType =
  | 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice'
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug'
  | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy';

export interface PokemonRoster {
  name: string;
  dexNumber: number;
  types: PokemonType[];
  form: string;
  abilities: Record<string, string>;
  championsVerified: boolean;
}

export interface BaseStats {
  name: string;
  dexNumber: number;
  form: string;
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  total: number;
  championsVerified: boolean;
}

export interface Move {
  name: string;
  type: PokemonType;
  category: 'Physical' | 'Special' | 'Status';
  description: string;
  target: string;
  inChampions: boolean;
  championsVerified: boolean;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
}

export interface Pokemon extends PokemonRoster, BaseStats {
  sprite?: string;
}

export interface TeamMember {
  pokemon: Pokemon;
  moves: Move[];
  nature: string;
  item: string;
  spAllocation: Partial<Record<keyof BaseStats, number>>;
}

export interface Team {
  members: (TeamMember | null)[];
}

export type TypeChart = Record<PokemonType, Record<PokemonType, number>>;

export interface CoverageAnalysis {
  offensiveWeaknesses: PokemonType[];
  defensiveWeaknesses: Array<{ type: PokemonType; count: number }>;
  offensiveCoverage: PokemonType[];
  missingCoverage: PokemonType[];
}
