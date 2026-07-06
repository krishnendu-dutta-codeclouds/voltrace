import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LinkButton from '../components/ui/LinkButton';
import ProductImage from '../components/product/ProductImage';
import { useOrder } from '../context/OrderContext';
import { formatMoney } from '../utils/pricing';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  } catch { return 'soon'; }
}

export default function Confirmation() {
  const { order } = useOrder();
  const [email, setEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  if (!order) return <Navigate to="/" replace />;

  const handleSignup = (e) => {
    e.preventDefault();
    if (!email) return;
    setSignedUp(true);
  };

  return (
    <main className="pt-[72px] min-h-screen bg-surface">
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-24">
        {/* Success header */}
        <header className="flex flex-col items-center text-center gap-4 py-12 mb-12 border-b border-border">
          <span
            className="w-16 h-16 rounded-full bg-[#16703A] flex items-center justify-center text-white"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 L9 17 L4 12" />
            </svg>
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Order {order.orderNumber}</span>
          <h1 className="font-display font-black text-[clamp(48px,7vw,96px)] leading-[0.9] tracking-[-0.04em] text-ink">
            Order <em>confirmed</em>.
          </h1>
          <p className="text-[16px] text-ink-muted max-w-[40ch]">
            Thanks{order.contact.name ? `, ${order.contact.name.split(' ')[0]}` : ''}. We've sent a receipt to{' '}
            <strong className="text-ink">{order.contact.email}</strong>.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Main details */}
          <div className="flex flex-col gap-8">
            {/* What happens next */}
            <section className="bg-surface-pure border border-border rounded-[20px] p-6" aria-labelledby="what-h">
              <h2 id="what-h" className="text-[18px] font-bold text-ink mb-4">📦 What happens next</h2>
              <div className="flex flex-col gap-3 text-[15px] text-ink-muted leading-relaxed">
                <p>
                  Your order ships from our warehouse within <strong className="text-ink">1–2 business days</strong>.
                  You'll receive a tracking link by email the moment it leaves the dock.
                </p>
                <p>
                  Estimated delivery: <strong className="text-ink">{formatDate(new Date(Date.now() + 5 * 86400000).toISOString())}</strong>
                </p>
                <p>
                  Confirmation sent to: <strong className="text-ink">{order.contact.email}</strong>
                </p>
              </div>
            </section>

            {/* Order items */}
            <section className="bg-surface-pure border border-border rounded-[20px] p-6" aria-labelledby="items-h">
              <h2 id="items-h" className="text-[18px] font-bold text-ink mb-6">🛍 Your order</h2>
              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={`${item.id}|${item.size}|${item.colorway}`} className="flex items-center gap-4">
                    <div className="w-16 h-16 flex-shrink-0 rounded-[12px] bg-surface-alt flex items-center justify-center p-2">
                      <ProductImage src={item.image.src} alt={item.name} primary={item.image.primary} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-ink">{item.name}</p>
                      <p className="text-[12px] text-ink-muted">
                        Size {item.size} · {item.colorway}{item.width ? ` · ${item.width}` : ''} · Qty {item.qty}
                      </p>
                    </div>
                    <span className="text-[15px] font-black text-ink flex-shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order totals */}
              <div className="flex flex-col gap-2 border-t border-border mt-6 pt-4">
                {[
                  { label: 'Subtotal', value: formatMoney(order.totals.subtotalCents) },
                  { label: 'Shipping', value: order.totals.shippingCents === 0 ? 'Free' : formatMoney(order.totals.shippingCents) },
                  { label: 'Tax', value: formatMoney(order.totals.taxCents) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-[14px]">
                    <span className="text-ink-muted">{label}</span>
                    <strong className="text-ink">{value}</strong>
                  </div>
                ))}
                <div className="flex justify-between text-[16px] font-black border-t border-border pt-3 mt-1">
                  <span className="text-ink">Total</span>
                  <span className="text-ink">{formatMoney(order.totals.totalCents)}</span>
                </div>
              </div>
            </section>

            <LinkButton to="/shop" variant="primary" size="lg">Keep shopping →</LinkButton>
          </div>

          {/* Retention sidebar */}
          <aside className="self-start sticky top-[88px] bg-ink text-surface rounded-[20px] p-6 flex flex-col gap-4" aria-labelledby="ret-h">
            <h2 id="ret-h" className="text-[20px] font-bold text-surface">First in line.</h2>
            <p className="text-[14px] text-on-dark-muted leading-relaxed">
              Want first access to new colorways? Join the Voltrace list — no spam, unsubscribe anytime.
            </p>
            {!signedUp ? (
              <form className="flex flex-col gap-3" onSubmit={handleSignup}>
                <label className="sr-only" htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 px-4 rounded-lg bg-white/10 border border-white/20 text-surface placeholder:text-on-dark-muted text-[14px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150"
                />
                <button
                  type="submit"
                  className="h-11 rounded-lg bg-accent text-ink text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-white transition-all duration-150"
                >
                  Join the list
                </button>
              </form>
            ) : (
              <p className="text-[13px] font-semibold text-accent">✓ You're in. We'll be in touch.</p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
