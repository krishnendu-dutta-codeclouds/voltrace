/**
 * Chip — filter chip / tag (Tailwind CSS v4).
 * Active state uses volt accent background.
 */
export default function Chip({
  active = false,
  onClick,
  onRemove,
  children,
  as: As = 'button',
  className = '',
  ...rest
}) {
  const base =
    'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1';
  const activeClass = active
    ? 'bg-accent text-ink border-accent'
    : 'bg-surface-pure text-ink border-border hover:border-ink-muted';

  const classes = [base, activeClass, className].filter(Boolean).join(' ');

  if (As === 'button') {
    return (
      <button
        type="button"
        className={classes}
        aria-pressed={active}
        onClick={onClick}
        {...rest}
      >
        {children}
        {onRemove && (
          <span
            className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full hover:bg-ink/10 cursor-pointer text-[11px] leading-none"
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove filter"
          >
            ×
          </span>
        )}
      </button>
    );
  }

  return (
    <As className={classes} {...rest}>
      {children}
    </As>
  );
}
