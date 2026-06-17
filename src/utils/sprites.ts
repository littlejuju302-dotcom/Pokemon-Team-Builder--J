// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPokemonSpriteUrl(name: string, _dexNumber: number): string {
  const formatted = toPokemonDbName(name);
  return `https://img.pokemondb.net/sprites/home/normal/${formatted}.png`;
}

function toPokemonDbName(name: string): string {
  const lower = name.toLowerCase().trim();

  // Handle regional forms
  if (lower.includes('alolan')) {
    const base = lower.replace('alolan ', '');
    return `${base}-alolan`;
  }
  if (lower.includes('galarian')) {
    const base = lower.replace('galarian ', '');
    return `${base}-galarian`;
  }
  if (lower.includes('hisuian')) {
    const base = lower.replace('hisuian ', '');
    return `${base}-hisuian`;
  }
  if (lower.includes('paldean')) {
    const base = lower.replace('paldean ', '');
    return `${base}-paldean`;
  }

  // Handle mega evolutions: "Mega Charizard X" → "charizard-mega-x"
  if (lower.startsWith('mega ')) {
    const rest = lower.slice(5);
    const parts = rest.split(' ');
    // Single letter suffix (X or Y)
    if (parts.length > 1 && parts[parts.length - 1].length === 1) {
      const suffix = parts.pop()!;
      return `${parts.join('-')}-mega-${suffix}`;
    }
    return `${rest.replace(/\s+/g, '-')}-mega`;
  }

  return lower.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// Fallback to PokeAPI sprite — for form variants use a per-form path when known
const POKEAPI_FORM_PATHS: Record<string, string> = {
  'Rotom-Heat':  'rotom-heat',
  'Rotom-Wash':  'rotom-wash',
  'Rotom-Frost': 'rotom-frost',
  'Rotom-Fan':   'rotom-fan',
  'Rotom-Mow':   'rotom-mow',
  'Basculegion-F': 'basculegion-female',
};

export function getFallbackSpriteUrl(dexNumber: number, name?: string): string {
  const formPath = name ? POKEAPI_FORM_PATHS[name] : undefined;
  if (formPath) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/forms/${formPath}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexNumber}.png`;
}
