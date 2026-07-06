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
          ? 'border-accent ring-2 ring-accent/40 shadow-[0_0_0_6px_rgba(207,255,4,0.18)]'
          : 'border-border hover:border-accent/75',
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
