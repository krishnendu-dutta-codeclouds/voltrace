import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import LinkButton from '../components/ui/LinkButton';
import ProductImage from '../components/product/ProductImage';
import Badge from '../components/ui/Badge';
import { useCart } from '../context/CartContext';
import { cartTotals, formatMoney, FREE_SHIPPING_THRESHOLD_CENTS } from '../utils/pricing';
import { Split, PageEnter, useReveal, Magnetic } from '../anim/primitives';
import { motion, AnimatePresence } from 'framer-motion';

const REMOVE_UNDO_MS = 5000;

/* Qty control shared component */
function QtyControl({ label, qty, onDecrease, onIncrease }) {
  return (
    <div
      className="flex items-center gap-0 border border-border rounded-full overflow-hidden"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center text-ink hover:bg-surface-alt transition-colors duration-150 text-lg font-bold"
        aria-label="Decrease"
        onClick={onDecrease}
      >
        −
      </button>
      <span className="w-8 text-center text-[14px] font-bold text-ink" aria-live="polite">{qty}</span>
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center text-ink hover:bg-surface-alt transition-colors duration-150 text-lg font-bold"
        aria-label="Increase"
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  );
}

export default function Cart() {
  const { items, count, addItem, updateQty, removeItem, clearCart, lineKey } = useCart();
  const [lastRemoved, setLastRemoved] = useState(null);
  const undoTimer = useRef(null);
  const headRef = useRef(null);
  const summaryRef = useRef(null);

  const totals = useMemo(() => cartTotals(items), [items]);
  const remainingCents = totals.freeShippingProgressCents;
  const shipProgress = Math.min(1, totals.subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS);

  useReveal(headRef, { y: 30, duration: 0.7, start: '0px' });
  useReveal(summaryRef, { y: 24, duration: 0.7, start: '0px' });

  const handleRemove = (itemKey, item) => {
    removeItem(itemKey);
    setLastRemoved({ itemKey, item, qty: item.qty });
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setLastRemoved(null), REMOVE_UNDO_MS);
  };

  const handleUndo = () => {
    if (!lastRemoved) return;
    addItem(lastRemoved.item, lastRemoved.qty);
    setLastRemoved(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current); }, []);

  return (
    <PageEnter as="main" className="pt-[72px] min-h-screen bg-surface">
      {/* Page header */}
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-8" ref={headRef}>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-4">Your bag</span>
        <h1 className="font-display font-black text-[clamp(40px,6vw,88px)] leading-[0.92] tracking-[-0.04em] text-ink">
          <Split key={count} as="span" className="block">{count} {count === 1 ? 'pair' : 'pairs'} in your</Split>
          <Split as="span" className="block italic">{' '}bag</Split>
          <Split as="span" className="block">.</Split>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="mx-auto max-w-[1440px] px-6 py-24 flex flex-col items-center gap-6 text-center" role="status">
          <svg className="text-ink-soft" width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="10" y="18" width="44" height="36" rx="4" stroke="currentColor" strokeWidth="2.5" />
            <path d="M22 18c0-5 4-10 10-10s10 5 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 30h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h2 className="text-[clamp(24px,3vw,40px)] font-display font-black text-ink">Your bag is empty.</h2>
          <p className="text-[16px] text-ink-muted">Start with our most-loved pair — or all seven.</p>
          <Magnetic>
            <LinkButton to="/shop" variant="primary" data-cursor="hover">Browse the shop</LinkButton>
          </Magnetic>
        </div>
      ) : (
        <div className="mx-auto max-w-[1440px] px-6 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Line items */}
          <div className="flex flex-col gap-4">
            {/* Free shipping bar */}
            {remainingCents > 0 ? (
              <div className="bg-surface-alt rounded-[14px] p-4" role="status">
                <p className="text-[13px] text-ink mb-3">
                  You're <strong className="text-ink">{formatMoney(remainingCents)}</strong> away from free shipping.
                </p>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: shipProgress }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-[#16703A]/10 rounded-[14px] p-4" role="status">
                <Badge variant="success">✓ Free shipping unlocked</Badge>
                <p className="text-[13px] text-[#16703A] font-medium">We just saved you {formatMoney(totals.shippingCents)}.</p>
              </div>
            )}

            {/* Item list */}
            <ul className="flex flex-col gap-0">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const itemKey = lineKey(item);
                  return (
                    <motion.li
                      key={itemKey}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 80, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex gap-4 py-5 border-b border-border last:border-none"
                    >
                      {/* Thumbnail */}
                      <Link
                        to={`/product/${item.productId}`}
                        className="w-[90px] h-[90px] flex-shrink-0 rounded-[14px] bg-surface-alt flex items-center justify-center p-2 hover:opacity-80 transition-opacity duration-150"
                        data-cursor="hover"
                      >
                        <ProductImage src={item.image.src} alt={item.name} primary={item.image.primary} eager />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[15px] font-bold text-ink leading-snug">
                            <Link to={`/product/${item.productId}`} className="hover:text-ink-muted transition-colors duration-150 no-underline">
                              {item.name}
                            </Link>
                          </h3>
                          <span className="text-[16px] font-black text-ink flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                        <p className="text-[12px] text-ink-muted">
                          {item.line} · {item.colorway} · Size {item.size}{item.width ? ` · ${item.width}` : ''}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <QtyControl
                            label={`Update quantity of ${item.name}`}
                            qty={item.qty}
                            onDecrease={() => {
                              if (item.qty <= 1) {
                                handleRemove(itemKey, item);
                              } else {
                                updateQty(itemKey, item.qty - 1);
                              }
                            }}
                            onIncrease={() => updateQty(itemKey, item.qty + 1)}
                          />
                          <button
                            type="button"
                            className="text-[12px] font-semibold text-ink-muted hover:text-[#C81E1E] transition-colors duration-150"
                            onClick={() => handleRemove(itemKey, item)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            {/* Cart actions */}
            <div className="flex items-center justify-between pt-2">
              <LinkButton to="/shop" variant="ghost" data-cursor="hover">← Continue shopping</LinkButton>
              <Button variant="secondary" onClick={clearCart} data-cursor="hover">Clear bag</Button>
            </div>
          </div>

          {/* Order summary */}
          <aside
            className="bg-surface-pure border border-border rounded-[20px] p-6 flex flex-col gap-4 self-start sticky top-[88px]"
            ref={summaryRef}
            aria-label="Order summary"
          >
            <h2 className="text-[17px] font-bold text-ink">Order summary</h2>
            <dl className="flex flex-col gap-2">
              {[
                { label: 'Subtotal', value: formatMoney(totals.subtotalCents) },
                { label: 'Shipping', value: totals.shippingCents === 0 ? 'Free' : formatMoney(totals.shippingCents) },
                { label: 'Estimated tax', value: formatMoney(totals.taxCents) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-[14px]">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="font-semibold text-ink">{value}</dd>
                </div>
              ))}
              <div className="flex justify-between text-[16px] font-black border-t border-border pt-3 mt-1">
                <dt className="text-ink">Total</dt>
                <dd className="text-ink">{formatMoney(totals.totalCents)}</dd>
              </div>
            </dl>
            <Magnetic>
              <LinkButton to="/checkout" variant="primary" size="lg" fullWidth data-cursor="hover">
                Checkout · {formatMoney(totals.totalCents)}
              </LinkButton>
            </Magnetic>
            <p className="text-[11px] text-ink-muted text-center">Free 60-day trial · Free returns · Secure checkout</p>
          </aside>
        </div>
      )}

      {/* Undo toast (outside conditional rendering to persist when cart is empty) */}
      <AnimatePresence>
        {lastRemoved && (
          <div className="mx-auto max-w-[1440px] px-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="flex items-center justify-between gap-4 bg-ink text-surface rounded-[12px] px-4 py-3 text-[13px] font-medium max-w-[600px]"
              role="status"
            >
              <p>Removed <strong>{lastRemoved.item.name}</strong> from your bag.</p>
              <Button variant="ghost" onClick={handleUndo} className="text-accent text-[12px] font-bold p-0 min-h-0">
                Undo
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageEnter>
  );
}
