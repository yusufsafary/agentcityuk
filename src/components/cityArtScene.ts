export type Archetype = 'skyline' | 'spires' | 'harbor' | 'domes' | 'terraces';

export interface Palette {
  top: string;
  mid: string;
  glow: string;
  accent: string;
  far: string;
  near: string;
  water: string;
}

export const ARCHETYPES: Archetype[] = ['skyline', 'spires', 'harbor', 'domes', 'terraces'];

export const PALETTES: Palette[] = [
  { top: '#050d1a', mid: '#0c2442', glow: '#fbbf24', accent: '#38bdf8', far: '#10294a', near: '#061427', water: '#0a1e35' },
  { top: '#021312', mid: '#0b3a36', glow: '#99f6e4', accent: '#2dd4bf', far: '#0d3a35', near: '#031a17', water: '#062a26' },
  { top: '#1a0a0a', mid: '#4a1d17', glow: '#fb923c', accent: '#fde68a', far: '#3b1a16', near: '#1a0a09', water: '#2a110d' },
  { top: '#020617', mid: '#0e2a52', glow: '#e0f2fe', accent: '#7dd3fc', far: '#163861', near: '#071733', water: '#0b2442' },
  { top: '#03140c', mid: '#0e3f2b', glow: '#bbf7d0', accent: '#4ade80', far: '#0f4029', near: '#04190f', water: '#072a1a' },
  { top: '#09090b', mid: '#27272a', glow: '#facc15', accent: '#e4e4e7', far: '#2c2c31', near: '#0c0c0e', water: '#151518' },
];

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickArchetype(seed: number): Archetype {
  const roll = mulberry32(seed * 31 + 7)();
  return ARCHETYPES[Math.floor(roll * ARCHETYPES.length)];
}

export function pickPaletteIndex(seed: number): number {
  const roll = mulberry32(seed * 57 + 3)();
  return Math.floor(roll * PALETTES.length);
}
