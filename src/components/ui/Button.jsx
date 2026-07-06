import { forwardRef } from 'react';

/**
 * Button — Tailwind CSS v4.
 * Uses explicit hex values for hover states to ensure reliability.
 * Variants: primary | accent | secondary | ghost | glass
 * Sizes:    sm | md | lg
 */
const BASE =
  'inline-flex items-center justify-center gap-2 font-bold text-[13px] uppercase tracking-[0.06em] whitespace-nowrap select-none cursor-pointer border-2 transition-all duration-150 ease-out rounded-full relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';

const VARIANTS = {
  primary:   'bg-ink text-accent border-ink hover:bg-accent hover:text-ink hover:border-accent',
  dark:      'bg-ink text-accent border-accent hover:bg-[#111] hover:text-accent hover:border-accent',
  accent:    'bg-accent text-ink border-accent hover:bg-ink hover:text-accent hover:border-ink',
  secondary: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-accent hover:border-ink',
  ghost:     'bg-transparent text-ink border-transparent hover:opacity-70 px-0 min-h-[44px]',
  glass:     'bg-white/70 backdrop-blur-md text-ink border-white/50 hover:bg-white/95',
  danger:    'bg-transparent text-error border-error hover:bg-error hover:text-white hover:border-error',
};

const SIZES = {
  sm: 'min-h-[40px] px-5 text-[12px]',
  md: 'min-h-[48px] px-7',
  lg: 'min-h-[56px] px-9 text-[14px]',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    type = 'button',
    fullWidth = false,
    loading = false,
    disabled = false,
    children,
    className = '',
    ...rest
  },
  ref
) {
  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      style={variant === 'dark' ? { backgroundColor: '#0A0A0A', color: '#CFFF04', borderColor: '#CFFF04' } : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="w-3.5 h-3.5 border-2 border-current border-r-transparent rounded-full animate-spin flex-shrink-0"
        />
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  );
});

export default Button;
