interface MarqueeProps {
  text: string;
}

export function Marquee({ text }: MarqueeProps) {
  const items = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="mx-5 inline-flex items-center gap-10">
      <span className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-amber-200/90">
        {text}
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" aria-hidden="true" />
    </span>
  ));

  return (
    <div
      className="overflow-hidden border-y border-amber-300/20 bg-amber-400/[0.06] py-3"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        <div className="flex items-center">{items}</div>
        <div className="flex items-center">{items}</div>
      </div>
    </div>
  );
}
