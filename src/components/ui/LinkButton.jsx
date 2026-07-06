import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * LinkButton — Button-styled React Router Link.
 * Uses explicit hex values for hover states (same pattern as Button.jsx).
 */
const BASE =
  'inline-flex items-center justify-center gap-2 font-bold text-[13px] uppercase tracking-[0.06em] whitespace-nowrap select-none border-2 transition-all duration-150 ease-out rounded-full relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.98]';

const VARIANTS = {
  primary:   'bg-ink text-accent border-ink hover:bg-accent hover:text-ink hover:border-accent',
  accent:    'bg-accent text-ink border-accent hover:bg-ink hover:text-accent hover:border-ink',
  secondary: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-accent hover:border-ink',
  ghost:     'bg-transparent text-ink border-transparent hover:opacity-70 px-0 min-h-[44px]',
  glass:     'bg-white/70 backdrop-blur-md text-ink border-white/50 hover:bg-white/95',
};

const SIZES = {
  sm: 'min-h-[40px] px-5 text-[12px]',
  md: 'min-h-[48px] px-7',
  lg: 'min-h-[56px] px-9 text-[14px]',
};

const LinkButton = forwardRef(function LinkButton(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    to,
    href,
    className = '',
    children,
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

  if (to) {
    return <Link ref={ref} to={to} className={classes} {...rest}>{children}</Link>;
  }
  return <a ref={ref} href={href} className={classes} {...rest}>{children}</a>;
});

export default LinkButton;
