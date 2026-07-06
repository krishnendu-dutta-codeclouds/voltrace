import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Cursor — fixed custom cursor that follows the mouse.
 * Add `data-cursor="hover|text"` to any element to switch styles.
 * Falls back to native cursor on touch / small screens (handled in CSS).
 */
export default function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const scale = useMotionValue(1);

  const springX = useSpring(mouseX, { stiffness: 350, damping: 35 });
  const springY = useSpring(mouseY, { stiffness: 350, damping: 35 });
  const springScale = useSpring(scale, { stiffness: 450, damping: 25 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 960px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onOver = (e) => {
      const dot = document.querySelector('.cursor');
      if (!dot) return;
      const t = e.target.closest('[data-cursor]');
      if (!t) {
        dot.classList.remove('cursor--hover', 'cursor--text');
        return;
      }
      const kind = t.getAttribute('data-cursor');
      dot.classList.remove('cursor--hover', 'cursor--text');
      if (kind === 'hover') dot.classList.add('cursor--hover');
      if (kind === 'text') dot.classList.add('cursor--text');
    };
    const onDown = () => scale.set(0.7);
    const onUp = () => scale.set(1);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [mouseX, mouseY, scale]);

  return <motion.div style={{ x: springX, y: springY, scale: springScale }} className="cursor" aria-hidden="true" />;
}
