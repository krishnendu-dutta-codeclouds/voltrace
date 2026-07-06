import { forwardRef, useRef } from 'react';
import {
  useReveal,
  useSplitReveal,
  useParallax,
  useMagnetic,
  useTilt,
  useCounter,
  useScrollProgress,
  usePageEnter,
  useImageReveal,
  useMarquee,
} from './framer-primitives';

// Re-export hooks so screens can compose them.
export {
  useReveal,
  useSplitReveal,
  useParallax,
  useMagnetic,
  useTilt,
  useCounter,
  useScrollProgress,
  usePageEnter,
  useImageReveal,
  useMarquee,
};

/**
 * Reveal — wraps children and animates them in on scroll.
 * By default each direct child becomes its own animated target.
 */
export const Reveal = forwardRef(function Reveal(
  { as: As = 'div', children, className = '', selector, ...opts },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useReveal(ref, { selector, ...opts });
  return <As ref={ref} className={className}>{children}</As>;
});

/** Split — splits the inner text into per-word spans and reveals them. */
export const Split = forwardRef(function Split({ as: As = 'span', children, className = '', ...opts }, forwardedRef) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useSplitReveal(ref, opts);
  return <As ref={ref} className={`split-target ${className}`}>{children}</As>;
});

/** Parallax — translates the element on scroll. */
export const Parallax = forwardRef(function Parallax(
  { as: As = 'div', children, className = '', ...opts },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useParallax(ref, opts);
  return <As ref={ref} className={className}>{children}</As>;
});

/** Magnetic — wrapper that makes inner CTAs attract to the cursor. */
export const Magnetic = forwardRef(function Magnetic(
  { as: As = 'div', children, className = '', strength, range },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useMagnetic(ref, { strength, range });
  return <As ref={ref} className={`magnetic ${className}`}>{children}</As>;
});

/** Tilt — 3D tilt on hover. */
export const Tilt = forwardRef(function Tilt(
  { as: As = 'div', children, className = '', max, perspective },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useTilt(ref, { max, perspective });
  return <As ref={ref} className={className}>{children}</As>;
});

/** Counter — animates a number from `from` to `to` on scroll. */
export const Counter = forwardRef(function Counter(
  { from, to, decimals, duration, delay, start, className = '', prefix = '', suffix = '' },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useCounter(ref, { from, to, decimals, duration, delay, start });
  return <span ref={ref} className={className}>{prefix}{Number(to || 0).toFixed(decimals || 0)}{suffix}</span>;
});

/** ScrollProgress — fixed top bar that fills as the page scrolls. */
export const ScrollProgress = forwardRef(function ScrollProgress({ className = '' }, forwardedRef) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useScrollProgress(ref);
  return <div ref={ref} className={`scroll-progress ${className}`} aria-hidden="true" />;
});

/** PageEnter — soft fade + lift on mount. */
export const PageEnter = forwardRef(function PageEnter(
  { as: As = 'div', children, className = '' },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  usePageEnter(ref);
  return <As ref={ref} className={`page ${className}`}>{children}</As>;
});

/** ImageReveal — clip-path reveal on scroll. */
export const ImageReveal = forwardRef(function ImageReveal(
  { as: As = 'div', children, className = '', ...opts },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useImageReveal(ref, opts);
  return <As ref={ref} className={className}>{children}</As>;
});
