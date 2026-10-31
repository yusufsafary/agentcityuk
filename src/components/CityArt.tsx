import type { ReactElement } from 'react';
import {
  mulberry32,
  pickArchetype,
  pickPaletteIndex,
  PALETTES,
  type Archetype,
  type Palette,
} from '@/components/cityArtScene';

interface CityArtProps {
  seed?: number;
  archetype?: Archetype;
  paletteIndex?: number;
  className?: string;
  label?: string;
}

interface Box {
  x: number;
  w: number;
  h: number;
}

type Rand = () => number;

const W = 400;
const H = 300;
const GROUND = 236;

function row(rand: Rand, count: number, minW: number, maxW: number, minH: number, maxH: number): Box[] {
  const out: Box[] = [];
  let x = -6;
  for (let i = 0; i < count && x < W + 6; i++) {
    const w = minW + rand() * (maxW - minW);
    const h = minH + rand() * (maxH - minH);
    out.push({ x, w, h });
    x += w + 2 + rand() * 4;
  }
  return out;
}

function boxes(list: Box[], fill: string, prefix: string, opacity = 1) {
  return list.map((b, i) => (
    <rect key={`${prefix}${i}`} x={b.x} y={GROUND - b.h} width={b.w} height={b.h} fill={fill} opacity={opacity} />
  ));
}

function rims(list: Box[], color: string, prefix: string) {
  return list.map((b, i) => (
    <line
      key={`${prefix}${i}`}
      x1={b.x}
      y1={GROUND - b.h}
      x2={b.x + b.w}
      y2={GROUND - b.h}
      stroke={color}
      strokeOpacity="0.45"
      strokeWidth="0.8"
    />
  ));
}

function windows(list: Box[], rand: Rand, density: number, color: string, prefix: string) {
  const dots: ReactElement[] = [];
  list.forEach((b, bi) => {
    for (let y = GROUND - b.h + 7; y < GROUND - 6; y += 8) {
      for (let x = b.x + 3; x < b.x + b.w - 3; x += 5) {
        if (rand() < density) {
          dots.push(
            <rect
              key={`${prefix}${bi}-${x}-${y}`}
              x={x}
              y={y}
              width="2"
              height="3"
              fill={color}
              opacity={0.4 + rand() * 0.5}
            />
          );
        }
      }
    }
  });
  return dots;
}

function skyline(rand: Rand, p: Palette) {
  const far = row(rand, 22, 12, 22, 40, 110);
  const mid = row(rand, 14, 20, 34, 70, 170);
  const near = row(rand, 9, 30, 44, 60, 130);
  return (
    <>
      {boxes(far, p.far, 'f')}
      {boxes(mid, p.far, 'm', 0.9)}
      {windows(mid, rand, 0.18, p.glow, 'mw')}
      {boxes(near, p.near, 'n')}
      {rims(near, p.accent, 'nr')}
      {windows(near, rand, 0.14, p.glow, 'nw')}
      {near.map((b, i) => (
        <line
          key={`ant${i}`}
          x1={b.x + b.w / 2}
          y1={GROUND - b.h}
          x2={b.x + b.w / 2}
          y2={GROUND - b.h - 14}
          stroke={p.accent}
          strokeWidth="1"
          opacity={rand() > 0.5 ? 0.9 : 0}
        />
      ))}
    </>
  );
}

function spires(rand: Rand, p: Palette) {
  const far = row(rand, 12, 14, 24, 40, 100);
  const towers: { x: number; w: number; h: number; tip: number }[] = [
    { x: 14, w: 30, h: 130, tip: 26 },
    { x: 72, w: 24, h: 168, tip: 34 },
    { x: 150, w: 42, h: 230, tip: 64 },
    { x: 220, w: 26, h: 176, tip: 30 },
    { x: 272, w: 34, h: 124, tip: 22 },
    { x: 332, w: 28, h: 150, tip: 28 },
  ].map((t) => ({ ...t, h: t.h + rand() * 24, tip: t.tip + rand() * 6 }));
  const near: Box[] = towers.map(({ x, w, h }) => ({ x, w, h }));
  return (
    <>
      {boxes(far, p.far, 'f')}
      {windows(far, rand, 0.12, p.glow, 'fw')}
      {towers.map((t, i) => {
        const top = GROUND - t.h;
        return (
          <path
            key={`sp${i}`}
            d={`M${t.x} ${top} L${t.x + t.w / 2} ${top - t.tip} L${t.x + t.w} ${top} Z`}
            fill={p.near}
          />
        );
      })}
      {boxes(near, p.near, 'n')}
      {rims(near, p.accent, 'nr')}
      {windows(near, rand, 0.16, p.glow, 'nw')}
      {towers.map((t, i) => {
        const cx = t.x + t.w / 2;
        const tipY = GROUND - t.h - t.tip;
        return (
          <g key={`beacon${i}`}>
            <circle cx={cx} cy={tipY} r="5" fill={p.accent} opacity="0.2" />
            <circle cx={cx} cy={tipY} r="1.6" fill={p.accent} />
          </g>
        );
      })}
    </>
  );
}

function harbor(rand: Rand, p: Palette) {
  const far = row(rand, 16, 14, 26, 24, 70);
  const mid = row(rand, 8, 26, 40, 40, 100);
  return (
    <>
      {boxes(far, p.far, 'f')}
      {windows(far, rand, 0.1, p.glow, 'fw')}
      {boxes(mid, p.near, 'm')}
      {rims(mid, p.accent, 'mr')}
      {windows(mid, rand, 0.2, p.glow, 'mw')}
      <rect x="0" y={GROUND} width={W} height={H - GROUND} fill={p.water} />
      {mid.map((b, i) => (
        <rect
          key={`ref${i}`}
          x={b.x + b.w * 0.2}
          y={GROUND + 2}
          width={b.w * 0.6}
          height={16}
          fill={p.glow}
          opacity="0.12"
        />
      ))}
      <line x1="0" y1={GROUND} x2={W} y2={GROUND} stroke={p.accent} strokeOpacity="0.5" strokeWidth="1" />
      <rect x="112" y={GROUND + 24} width="34" height="6" rx="2" fill={p.near} />
      <rect x="112" y={GROUND + 18} width="8" height="6" fill={p.glow} />
      <rect x="252" y={GROUND + 38} width="22" height="5" rx="2" fill={p.near} />
      <rect x="252" y={GROUND + 33} width="5" height="5" fill={p.accent} />
    </>
  );
}

function domes(rand: Rand, p: Palette) {
  const far = row(rand, 14, 18, 30, 50, 120);
  const mid = row(rand, 6, 34, 52, 60, 120);
  return (
    <>
      {boxes(far, p.far, 'f')}
      {boxes(mid, p.near, 'm')}
      {mid.map((b, i) => {
        if (rand() > 0.6) return null;
        const top = GROUND - b.h;
        const r = b.w * 0.45;
        return (
          <path
            key={`dome${i}`}
            d={`M${b.x} ${top} A${b.w / 2} ${r} 0 0 1 ${b.x + b.w} ${top} Z`}
            fill={p.near}
          />
        );
      })}
      {mid.map((b, i) => {
        if (rand() > 0.4) return null;
        const x = b.x + b.w * 0.8;
        const top = GROUND - b.h - 46;
        return (
          <g key={`min${i}`}>
            <rect x={x} y={top} width="4" height="46" fill={p.near} />
            <circle cx={x + 2} cy={top} r="3" fill={p.glow} />
          </g>
        );
      })}
      {windows(mid, rand, 0.16, p.glow, 'mw')}
      {rims(mid, p.accent, 'mr')}
    </>
  );
}

function terraces(rand: Rand, p: Palette) {
  const far = row(rand, 14, 20, 30, 60, 120);
  const blocks = row(rand, 6, 40, 62, 0, 0).map((b) => ({ ...b, h: 90 + rand() * 90 }));
  return (
    <>
      {boxes(far, p.far, 'f')}
      {blocks.flatMap((b, bi) => {
        const tierH = b.h / 3;
        return [0, 1, 2].map((tier) => {
          const tierW = b.w * (1 - 0.22 * tier);
          const x = b.x + (b.w - tierW) / 2;
          const y = GROUND - tierH * (tier + 1);
          return (
            <g key={`t${bi}-${tier}`}>
              <rect x={x} y={y} width={tierW} height={tierH} fill={p.near} />
              <rect x={x} y={y + 3} width={tierW} height="1.5" fill={p.glow} opacity="0.85" />
              <rect x={x} y={y + tierH * 0.5} width={tierW} height="1" fill={p.accent} opacity="0.5" />
            </g>
          );
        });
      })}
      {windows(blocks, rand, 0.08, p.glow, 'tw')}
    </>
  );
}

const BODY: Record<Archetype, (rand: Rand, p: Palette) => ReactElement> = { skyline, spires, harbor, domes, terraces };

export function CityArt({ seed = 1, archetype, paletteIndex, className = '', label }: CityArtProps) {
  const rand = mulberry32(seed * 9973 + 17);
  const kind = archetype ?? pickArchetype(seed);
  const p = PALETTES[paletteIndex ?? pickPaletteIndex(seed)];
  const id = `city-${seed}-${kind}`;
  const moonX = 70 + rand() * 260;
  const moonY = 46 + rand() * 50;
  const stars = Array.from({ length: 40 }, () => ({ x: rand() * W, y: rand() * 150, r: 0.4 + rand() * 1.1 }));
  const nodes = Array.from({ length: 6 }, () => ({ x: 30 + rand() * (W - 60), y: 40 + rand() * 110 }));
  const code = `#${String(seed).padStart(4, '0')}`;
  const body = BODY[kind](rand, p);

  return (
    <figure className={`relative overflow-hidden rounded-3xl ring-1 ring-white/10 ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={label ?? 'City skyline artwork'}>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.top} />
            <stop offset="80%" stopColor={p.mid} />
            <stop offset="100%" stopColor={p.mid} />
          </linearGradient>
          <radialGradient id={`${id}-moon`}>
            <stop offset="0%" stopColor={p.glow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0" />
            <stop offset="100%" stopColor={p.accent} stopOpacity="0.22" />
          </linearGradient>
          <radialGradient id={`${id}-vignette`} cx="50%" cy="45%" r="75%">
            <stop offset="55%" stopColor="#020617" stopOpacity="0" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.7" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill={`url(#${id}-sky)`} />
        {stars.map((s, i) => (
          <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={0.25 + (i % 5) * 0.12} />
        ))}
        <circle cx={moonX} cy={moonY} r="70" fill={`url(#${id}-moon)`} />
        <circle cx={moonX} cy={moonY} r="8" fill={p.glow} opacity="0.92" />

        {body}

        <rect x="0" y={GROUND - 60} width={W} height="60" fill={`url(#${id}-haze)`} pointerEvents="none" />
        {kind !== 'harbor' && (
          <>
            <rect x="0" y={GROUND} width={W} height={H - GROUND} fill={p.water} />
            <path d={`M0 ${GROUND + 14} H${W}`} stroke={p.glow} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="10 8" />
          </>
        )}

        {nodes.slice(1).map((n, i) => {
          const prev = nodes[i];
          return (
            <line key={`l${i}`} x1={prev.x} y1={prev.y} x2={n.x} y2={n.y} stroke={p.accent} strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="2 3" />
          );
        })}
        {nodes.map((n, i) => (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r="5" fill={p.accent} opacity="0.15" />
            <circle cx={n.x} cy={n.y} r="1.8" fill={p.accent} />
          </g>
        ))}

        <rect width={W} height={H} fill={`url(#${id}-vignette)`} pointerEvents="none" />
        <text x="18" y="28" fill={p.glow} fontSize="10" letterSpacing="3" fontFamily="Inter, sans-serif" opacity="0.9">
          AGENT CITY
        </text>
        <text x={W - 18} y="28" textAnchor="end" fill={p.glow} fontSize="10" letterSpacing="2" fontFamily="Inter, sans-serif" opacity="0.9">
          {code}
        </text>
      </svg>
    </figure>
  );
}
