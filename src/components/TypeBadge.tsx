import { TYPE_COLORS } from '../data/typeChart';
import type { PokemonType } from '../types/pokemon';

interface Props {
  type: PokemonType;
  small?: boolean;
}

export function TypeBadge({ type, small }: Props) {
  const color = TYPE_COLORS[type];
  return (
    <span
      className={`inline-block font-bold uppercase tracking-wide rounded ${small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}
      style={{ backgroundColor: color, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
    >
      {type}
    </span>
  );
}
