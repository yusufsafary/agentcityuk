interface CityArtProps {
  seed?: number;
  className?: string;
  label?: string;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = [
  { sky: ['#0b1d33', '#1e4a6e'], glow: '#fbbf24', building: '#0f2537', far: '#163a57' },
  { sky: ['#0a1f1c', '#1d5a4f'], glow: '#5eead4', building: '#0c2a25', far: '#17463e' },
  { sky: ['#1b1433', '#3b2f63'], glow: '#fcd34d', building: '#17112b', far: '#2b2150' },
];

export function CityArt({ seed = 1, className = '', label }: CityArtProps) {
  const rand = mulberry32(seed * 9973 + 17);
  const palette = PALETTES[seed % PALETTES.length];
  const gradientId = `sky-${seed}`;

  const buildings = Array.from({ length: 14 }, (_, i) => {
    const w = 18 + rand() * 26;
    const h = 60 + rand() * 150;
    const x = i * 30 - 10 + rand() * 6;
    return { x, w, h };
  });

  const windows: { x: number; y: number }[] = [];
  buildings.forEach((b) => {
    for (let wy = 14; wy < b.h - 10; wy += 14) {
      for (let wx = 5; wx < b.w - 6; wx += 9) {
        if (rand() > 0.62) windows.push({ x: b.x + wx, y: 300 - b.h + wy });
      }
    }
  });

  const stars = Array.from({ length: 26 }, () => ({
    x: rand() * 400,
    y: rand() * 150,
    r: 0.6 + rand() * 1.2,
  }));

  return (
    <figure className={`relative overflow-hidden rounded-3xl ring-1 ring-white/10 ${className}`}>
      <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={label ?? 'City skyline artwork'}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.sky[0]} />
            <stop offset="100%" stopColor={palette.sky[1]} />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#${gradientId})`} />
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity="0.6" />
        ))}
        <circle cx={300 + rand() * 40} cy={60} r="22" fill={palette.glow} opacity="0.15" />
        <circle cx={300 + rand() * 40} cy={60} r="10" fill={palette.glow} opacity="0.85" />
        {buildings.map((b, i) => (
          <rect key={`far-${i}`} x={b.x + 8} y={300 - b.h * 0.7} width={b.w} height={b.h * 0.7} fill={palette.far} />
        ))}
        {buildings.map((b, i) => (
          <rect key={`near-${i}`} x={b.x} y={300 - b.h} width={b.w} height={b.h} fill={palette.building} />
        ))}
        {windows.map((w, i) => (
          <rect key={`w-${i}`} x={w.x} y={w.y} width="3" height="4" fill={palette.glow} opacity="0.8" />
        ))}
        <rect x="0" y="262" width="400" height="38" fill="#06121c" opacity="0.85" />
        <path d="M0 270 Q 100 262 200 270 T 400 270 L400 300 L0 300 Z" fill="#0b2a3c" opacity="0.7" />
      </svg>
    </figure>
  );
}
