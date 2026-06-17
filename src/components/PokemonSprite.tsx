import { useState } from 'react';
import { getPokemonSpriteUrl, getFallbackSpriteUrl } from '../utils/sprites';

interface Props {
  name: string;
  dexNumber: number;
  size?: number;
  className?: string;
}

export function PokemonSprite({ name, dexNumber, size = 80, className = '' }: Props) {
  const [src, setSrc] = useState(() => getPokemonSpriteUrl(name, dexNumber));
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setSrc(getFallbackSpriteUrl(dexNumber));
    }
  };

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`object-contain drop-shadow-lg ${className}`}
      onError={handleError}
      style={{ imageRendering: 'auto' }}
    />
  );
}
