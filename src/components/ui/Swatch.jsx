/**
 * Swatch — color swatch button (Tailwind CSS v4).
 * Selected state uses a thick ink ring per brand rules.
 */
export default function Swatch({
  color,
  label,
  selected = false,
  onClick,
  disabled = false,
  size = 32,
}) {
  return (
    <button
      type="button"
      className={[
        'rounded-full border-2 transition-all duration-150 cursor-pointer relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
        selected
          ? 'border-ink ring-2 ring-ink ring-offset-2'
          : 'border-border hover:border-ink-muted',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
      ].join(' ')}
      style={{ width: size, height: size, background: color }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={selected}
      title={label}
    >
      <span className="sr-only">{label}</span>
    </button>
  );
}
