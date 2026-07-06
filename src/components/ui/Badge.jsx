/**
 * Badge — small inline status pill (Tailwind CSS v4).
 * Variants: default | success | error | accent | alt
 */
const VARIANTS = {
  default: 'bg-ink text-surface',
  success: 'bg-[#16703A] text-white',
  error:   'bg-[#C81E1E] text-white',
  accent:  'bg-accent text-ink',
  alt:     'bg-[#FF5436] text-white',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.06em]',
        VARIANTS[variant] ?? VARIANTS.default,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
