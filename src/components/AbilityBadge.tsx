import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Champions-exclusive abilities not in PokéAPI
const CUSTOM_DESCRIPTIONS: Record<string, string> = {
  'Eelevate':   'Pokémon Champions exclusive. Boosts the power of Electric-type moves.',
  'Fire Mane':  'Pokémon Champions exclusive. Boosts the power of Fire-type moves.',
};

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function fetchDescription(name: string): Promise<string> {
  if (CUSTOM_DESCRIPTIONS[name]) return CUSTOM_DESCRIPTIONS[name];
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${nameToSlug(name)}/`);
  if (!res.ok) return 'No description available.';
  const data = await res.json();
  const effect = (data.effect_entries as Array<{ language: { name: string }; short_effect: string }> | undefined)
    ?.find(e => e.language.name === 'en')?.short_effect;
  if (effect) return effect;
  const flavor = (data.flavor_text_entries as Array<{ language: { name: string }; flavor_text: string }> | undefined)
    ?.findLast(e => e.language.name === 'en')?.flavor_text?.replace(/\n/g, ' ');
  return flavor ?? 'No description available.';
}

interface Props {
  name: string;
  isHidden?: boolean;
}

export function AbilityBadge({ name, isHidden }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: description, isLoading } = useQuery({
    queryKey: ['ability', name],
    queryFn: () => fetchDescription(name),
    enabled: open,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className={`text-xs px-2 py-0.5 rounded transition-colors ${
          open
            ? 'bg-violet-700/60 border border-violet-500/60 text-violet-200'
            : 'bg-slate-700 border border-transparent text-slate-300 hover:bg-slate-600 hover:text-slate-100'
        }`}
      >
        {name}
        {isHidden && <span className="ml-1 text-[9px] text-violet-400">(HA)</span>}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1.5 w-60 z-40 bg-slate-900 border border-slate-600 rounded-xl p-3 shadow-2xl">
          {/* Arrow */}
          <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-slate-900 border-r border-b border-slate-600 rotate-45" />

          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-xs font-semibold text-slate-100">{name}</p>
            {isHidden && (
              <span className="text-[9px] font-bold bg-violet-900/50 border border-violet-700/50 text-violet-400 px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0">
                Hidden
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 border border-violet-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-[11px] text-slate-500">Loading…</span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
