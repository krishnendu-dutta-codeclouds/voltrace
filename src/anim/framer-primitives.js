import { useEffect } from 'react';
import { animate, useInView, useScroll, useTransform } from 'framer-motion';

/* ===========================================================
   toRootMargin — normalize any incoming margin string into a valid
   IntersectionObserver.rootMargin value.

   Why this exists:
   - framer-motion v12 passes `useInView({ margin })` straight through to
     IntersectionObserver.rootMargin.
   - The browser throws "rootMargin must be specified in pixels or percent"
     if the value is malformed or contains tokens it can't parse.
   - Older framer-motion versions (and many call sites in this codebase)
     used shorthand like "top 90%" or "0px 0px -15% 0px", which is no
     longer accepted by v12.
   - This helper accepts either form and returns a safe 4-value
     "<top> <right> <bottom> <left>" CSS margin shorthand using only
     positive pixel/percent tokens.
   =========================================================== */
export function toRootMargin(value) {
  if (value == null) return '0px';
  if (typeof value !== 'string') return '0px';

  const trimmed = value.trim();
  if (!trimmed) return '0px';

  // Already a valid 1-4 value rootMargin (all positive) — pass through.
  const tokens = trimmed.split(/\s+/);
  if (tokens.length >= 1 && tokens.length <= 4) {
    const allValid = tokens.every((t) => /^-?\d+(\.\d+)?(px|%)$/.test(t));
    if (allValid) return trimmed;
  }

  // Legacy framer-motion shorthand: "top 90%", "bottom 10%", "top 85%".
  // Translate to rootMargin by negating the side that the trigger should
  // fire on. "top 90%" → fire when the element's top crosses the 90% mark
  // from the top of the viewport → "0px 0px -90% 0px".
  const legacy = trimmed.match(/^(top|bottom|left|right)\s+(-?\d+(?:\.\d+)?)(px|%)$/i);
  if (legacy) {
    const [, side, num, unit] = legacy;
    const v = `${num}${unit}`;
    switch (side.toLowerCase()) {
      case 'top':    return `0px 0px ${negate(v)} 0px`;
      case 'bottom': return `${negate(v)} 0px 0px 0px`;
      case 'left':   return `0px ${negate(v)} 0px 0px`;
      case 'right':  return `0px 0px 0px ${negate(v)}`;
    }
  }

  // Last resort: fall back to a safe value so we never crash the app.
  return '0px';
}

function negate(v) {
  return v.startsWith('-') ? v.slice(1) : `-${v}`;
}

/* ===========================================================
   SplitText helper — splits text into masks + words
   =========================================================== */
export function splitWords(el) {
  if (!el || el.dataset.splitDone === '1') return null;
  const text = el.textContent;
  el.textContent = '';
  const words = text.split(/(\s+)/); // keep spaces
  const wordSpans = [];
  words.forEach((w) => {
    if (/^\s+$/.test(w)) {
      el.appendChild(document.createTextNode(w));
    } else if (w.length) {
      const outer = document.createElement('span');
      outer.className = 'word-mask';
      const inner = document.createElement('span');
      inner.className = 'word';
      inner.textContent = w;
      outer.appendChild(inner);
      el.appendChild(outer);
      wordSpans.push(inner);
    }
  });
  el.dataset.splitDone = '1';
  return wordSpans;
}

/* ===========================================================
   Reveal — fade/slide up children
   =========================================================== */
export function useReveal(ref, opts = {}) {
  // NOTE: framer-motion v12 passes `margin` straight through to
  // IntersectionObserver.rootMargin. The browser only accepts a valid CSS
  // margin shorthand made of `<length>` / `<percentage>` tokens — no
  // unitless numbers, no empty strings. `toRootMargin` normalizes both
  // legacy shorthand ("top 90%") and CSS margin strings into something
  // the observer can always construct.
  const {
    selector = ':scope > *',
    y = 60,
    duration = 1,
    stagger = 0.08,
    delay = 0,
    start = '0px',
    once = true,
  } = opts;

  const inView = useInView(ref, {
    margin: toRootMargin(start),
    once,
  });

  useEffect(() => {
    if (!ref || !ref.current) return;
    const root = ref.current;
    const targets = root.matches(selector)
      ? [root]
      : Array.from(root.querySelectorAll(selector));

    if (inView) {
      targets.forEach((target, index) => {
        animate(
          target,
          { y: 0, opacity: 1 },
          {
            duration,
            delay: delay + index * stagger,
            ease: [0.25, 1, 0.5, 1], // easeOut power3
          }
        );
      });
    } else {
      targets.forEach((target) => {
        animate(target, { y, opacity: 0 }, { duration: 0 });
      });
    }
  }, [ref, inView, selector, y, duration, stagger, delay]);
}

/* ===========================================================
   SplitReveal — animate heading word-by-word.

   History of bugs here:
   1. Old default `y = '110%'` couldn't be animated to 0 by
      framer-motion (which doesn't interpolate from
      percentage strings on raw DOM elements). Words stayed
      stuck at translateY(64px).
   2. Even after switching to a pixel value, framer-motion
      v12's `animate()` on a raw DOM element sometimes fails
      to determine the current transform and silently does
      nothing.
   3. `splitWords` returns `null` on subsequent runs because
      it caches `dataset.splitDone = '1'`, so re-running the
      effect with `inView = true` after the initial mount
      finds no words to animate.

   The fix uses the Web Animations API directly. WAAPI:
   - Always reads the current computed transform.
   - Works on raw DOM elements without any React wrappers.
   - Is supported in every browser since 2020.
   - Returns an Animation handle we can cancel on cleanup.
   =========================================================== */
function resolveYPixels(y, sampleEl) {
  if (typeof y === 'number' && Number.isFinite(y)) return y;
  if (typeof y !== 'string') return 60;
  const trimmed = y.trim();
  if (!trimmed) return 60;
  const num = parseFloat(trimmed);
  if (!Number.isFinite(num)) return 60;
  if (trimmed.endsWith('%')) {
    const base = sampleEl ? sampleEl.getBoundingClientRect().height : 40;
    return (num / 100) * base;
  }
  if (trimmed.endsWith('px')) return num;
  if (trimmed.endsWith('rem') || trimmed.endsWith('em')) {
    const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return num * (trimmed.endsWith('rem') ? rootSize : rootSize);
  }
  return num;
}

function animateWordToTop(word, options) {
  const { duration = 0.9, delay = 0, ease = 'cubic-bezier(0.16, 1, 0.3, 1)' } = options;
  // Read the current transform (set by the initial pass) to make
  // sure WAAPI can interpolate from the right starting point.
  const computed = getComputedStyle(word);
  const currentY = parseFloat(computed.transform.match(/-?\d+(\.\d+)?(?=\))/) || '0') || 0;

  // Use WAAPI directly — rock-solid on raw DOM elements, and
  // doesn't need framer-motion's special-cased element control.
  const anim = word.animate(
    [
      { transform: `translateY(${currentY}px)`, opacity: 1 },
      { transform: 'translateY(0px)', opacity: 1 },
    ],
    {
      duration: duration * 1000,
      delay: delay * 1000,
      easing: ease,
      fill: 'forwards',
    }
  );

  // When the animation finishes, clear the inline transform so
  // it doesn't override any CSS :hover / :focus transforms.
  anim.onfinish = () => {
    word.style.transform = '';
    word.style.opacity = '';
  };

  return anim;
}

export function useSplitReveal(ref, opts = {}) {
  const { start = '0px', stagger = 0.04, y = 60, duration = 0.9, delay = 0 } = opts;
  const inView = useInView(ref, { margin: toRootMargin(start), once: true });

  useEffect(() => {
    if (!ref || !ref.current) return;
    const el = ref.current;

    // Reduced motion — just mark as done, don't animate.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.dataset.splitDone = '1';
      return;
    }

    // Always (re)split, but only the first time. splitWords is
    // idempotent — it sets `dataset.splitDone = '1'` so we
    // don't re-mutate the DOM on re-renders. The returned
    // word-span list is what we animate, regardless of
    // whether the effect is running for the first or the Nth
    // time.
    // Always (re)split, but only the first time. splitWords is
    // idempotent — it sets `dataset.splitDone = '1'` so we
    // don't re-mutate the DOM on re-renders. The returned
    // word-span list is what we animate, regardless of
    // whether the effect is running for the first or the Nth
    // time.
    const words = splitWords(el);
    if (!words) {
      // Already split on a prior run. If we're now in view and
      // the words are still translated, animate them up. This
      // handles the case where the element was below the fold
      // on mount and then scrolled into view.
      if (inView) {
        const existing = Array.from(el.querySelectorAll('.word'));
        existing.forEach((w, i) => animateWordToTop(w, { duration, delay: delay + i * stagger }));
      }
      return;
    }

    const yPx = resolveYPixels(y, words[0]);

    // Apply the initial hidden state via inline style.
    words.forEach((w) => {
      w.style.transform = `translateY(${yPx}px)`;
      w.style.display = 'inline-block';
    });

    // If the element is already in view on mount, animate now.
    if (inView) {
      // Force a layout flush so the browser commits the initial
      // transform before we start animating from it.
      void el.offsetHeight;
      words.forEach((w, i) => animateWordToTop(w, { duration, delay: delay + i * stagger }));
    }
  }, [ref, inView, y, duration, stagger, delay]);
}

/* ===========================================================
   Parallax — translateY on scroll
   =========================================================== */
export function useParallax(ref, { speed = -0.3 } = {}) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    if (!ref || !ref.current) return;
    return scrollYProgress.on("change", (latest) => {
      if (ref.current) {
        const val = (latest - 0.5) * window.innerHeight * speed;
        ref.current.style.transform = `translateY(${val}px)`;
      }
    });
  }, [ref, scrollYProgress, speed]);
}

/* ===========================================================
   Magnetic — CTA attracts to cursor.

   Tuning notes:
   - `strength` is the fraction of cursor offset applied to the
     element. Even small values feel strong on small CTAs, so
     default is 0.12 (12%) — barely a wiggle, but enough to read
     as a hover affordance.
   - `range` is the dead-zone around the element. The effect
     is fully inactive outside this radius. Default 24px so the
     button only "wakes up" right before the user clicks.
   - `maxOffset` clamps the maximum translation in pixels,
     regardless of how far away the cursor is. Prevents the
     button from drifting off the tap target.
   - The listener attaches to the element itself, not the
     window — no effect unless the cursor is over the element
     (or its wrapper).
   - Skipped entirely on touch / coarse-pointer devices.
   - Honors `prefers-reduced-motion`.
   =========================================================== */
export function useMagnetic(ref, { strength = 0.12, range = 24, maxOffset = 8 } = {}) {
  useEffect(() => {
    if (!ref || !ref.current) return;
    if (typeof window === 'undefined') return;

    // Touch / coarse pointer — magnetic is unusable on touch, skip entirely.
    const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    // Reduced motion — no magnetic drift.
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const el = ref.current;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      // Only activate when the cursor is within the element's bounds
      // plus a small range halo. Past that, the element rests.
      const activateDist = Math.max(rect.width, rect.height) / 2 + range;
      if (dist > activateDist) {
        animate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 250, damping: 20, mass: 0.6 });
        return;
      }

      // Linear-pull strength with a cap.
      const pull = Math.min(1, dist / activateDist);
      let x = dx * strength * pull;
      let y = dy * strength * pull;

      // Clamp to maxOffset so the button never wanders off the tap target.
      if (Math.abs(x) > maxOffset) x = Math.sign(x) * maxOffset;
      if (Math.abs(y) > maxOffset) y = Math.sign(y) * maxOffset;

      animate(el, { x, y }, { type: 'spring', stiffness: 280, damping: 18, mass: 0.5 });
    };

    const onLeave = () => {
      animate(
        el,
        { x: 0, y: 0 },
        { type: 'spring', stiffness: 250, damping: 20, mass: 0.6 }
      );
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      // Snap back on unmount to avoid leaving the button mid-translation.
      animate(el, { x: 0, y: 0 }, { duration: 0 });
    };
  }, [ref, strength, range, maxOffset]);
}

/* ===========================================================
   Tilt — 3D tilt on hover
   =========================================================== */
export function useTilt(ref, { max = 8, perspective = 1000 } = {}) {
  useEffect(() => {
    if (!ref || !ref.current) return;
    const el = ref.current;

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      animate(
        el,
        {
          rotateY: px * max * 2,
          rotateX: -py * max * 2,
          transformPerspective: perspective,
        },
        { duration: 0.4, ease: "easeOut" }
      );
    };

    const onLeave = () => {
      animate(
        el,
        { rotateY: 0, rotateX: 0 },
        { duration: 0.6, ease: "easeOut" }
      );
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, max, perspective]);
}

/* ===========================================================
   Marquee — infinite horizontal loop
   =========================================================== */
export function useMarquee(ref, { speed = 60, direction = 1, pauseOnHover = true } = {}) {
  useEffect(() => {
    if (!ref || !ref.current) return;
    const el = ref.current;

    if (!el.dataset.marqueeReady) {
      el.innerHTML += el.innerHTML;
      el.dataset.marqueeReady = '1';
    }

    const distance = el.scrollWidth / 2;
    const duration = distance / speed;

    const animControls = animate(
      el,
      { x: direction > 0 ? -distance : distance },
      {
        duration,
        ease: "linear",
        repeat: Infinity,
      }
    );

    if (pauseOnHover) {
      const onEnter = () => animControls.pause();
      const onLeave = () => animControls.play();

      const parent = el.parentElement;
      parent?.addEventListener('mouseenter', onEnter);
      parent?.addEventListener('mouseleave', onLeave);

      return () => {
        animControls.stop();
        parent?.removeEventListener('mouseenter', onEnter);
        parent?.removeEventListener('mouseleave', onLeave);
      };
    }

    return () => animControls.stop();
  }, [ref, speed, direction, pauseOnHover]);
}

/* ===========================================================
   Counter — animated number ticker
   =========================================================== */
export function useCounter(ref, { from = 0, to = 100, duration = 1.6, decimals = 0, delay = 0, start = '0px' } = {}) {
  const inView = useInView(ref, { margin: toRootMargin(start), once: true });

  useEffect(() => {
    if (!ref || !ref.current || !inView) return;
    const el = ref.current;

    const controls = animate(
      from,
      to,
      {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expoOut
        onUpdate: (latest) => {
          if (el) el.textContent = latest.toFixed(decimals);
        }
      }
    );

    return () => controls.stop();
  }, [ref, from, to, duration, decimals, delay, inView]);
}

/* ===========================================================
   SmoothScroll — Lenis wiring using requestAnimationFrame
   =========================================================== */
let lenisInstance = null;
export function installSmoothScroll() {
  if (lenisInstance) return lenisInstance;
  if (typeof window === 'undefined') return null;

  import('lenis').then(({ default: Lenis }) => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenisInstance = lenis;
  });

  return null;
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: false });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ===========================================================
   PageTransition — fade + lift on mount
   =========================================================== */
export function usePageEnter(ref) {
  useEffect(() => {
    if (!ref || !ref.current) return;
    animate(
      ref.current,
      { opacity: [0, 1], y: [12, 0] },
      { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
    );
  }, [ref]);
}

/* ===========================================================
   ScrollProgress — progress fill tracking
   =========================================================== */
export function useScrollProgress(ref) {
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!ref || !ref.current) return;
    return scrollYProgress.on("change", (latest) => {
      if (ref.current) {
        ref.current.style.transform = `scaleX(${latest})`;
        ref.current.style.transformOrigin = '0% 50%';
      }
    });
  }, [ref, scrollYProgress]);
}

/* ===========================================================
   ImageReveal — clip-path expand on scroll
   =========================================================== */
export function useImageReveal(ref, { start = '0px', duration = 1.2 } = {}) {
  const inView = useInView(ref, { margin: toRootMargin(start), once: true });

  useEffect(() => {
    if (!ref || !ref.current) return;
    const el = ref.current;
    el.style.clipPath = 'inset(100% 0% 0% 0%)';

    if (inView) {
      animate(
        el,
        { clipPath: 'inset(0% 0% 0% 0%)' },
        { duration, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }, [ref, inView, duration]);
}
