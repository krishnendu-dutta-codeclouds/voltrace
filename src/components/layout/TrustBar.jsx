/**
 * TrustBar — horizontal trust-signal strip (Tailwind CSS v4).
 * Variants: light | dark | marquee
 */
const ITEMS = [
  { label: 'Free shipping over $75' },
  { label: '30-day returns' },
  { label: '2-year outsole warranty' },
  { label: 'Secure 256-bit checkout' },
  { label: 'Carbon-neutral delivery' },
  { label: 'Engineered in Lisbon' },
];

const DOT = <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />;

export default function TrustBar({ variant = 'light' }) {
  if (variant === 'marquee') {
    const looped = [...ITEMS, ...ITEMS];
    return (
      <aside
        className="w-full overflow-hidden bg-ink border-y border-ink-3 py-4"
        aria-label="Trust signals"
      >
        <div
          className="flex items-center animate-marquee whitespace-nowrap"
          style={{ '--marquee-duration': '40s' }}
        >
          {looped.map((it, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-[12px] font-medium text-surface flex-shrink-0 px-8"
            >
              {DOT}
              {it.label}
              <span className="text-ink-soft ml-6" aria-hidden="true">◆</span>
            </span>
          ))}
        </div>
      </aside>
    );
  }

  const wrapperClass =
    variant === 'dark'
      ? 'bg-surface-dark text-surface border-y border-ink-3'
      : 'bg-surface-alt text-ink border-y border-border';

  return (
    <aside className={`w-full overflow-hidden ${wrapperClass}`} aria-label="Trust signals">
      <ul className="mx-auto px-6 py-8 flex flex-wrap justify-center items-center gap-4 gap-x-10 d-block w-full">
        {ITEMS.slice(0, 4).map((it) => (
          <li key={it.label} className="inline-flex items-center gap-2 text-[12px] font-medium whitespace-nowrap">
            {DOT}
            {it.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
