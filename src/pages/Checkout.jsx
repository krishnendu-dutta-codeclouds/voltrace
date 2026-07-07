import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LinkButton from '../components/ui/LinkButton';
import ProductImage from '../components/product/ProductImage';
import TrustBar from '../components/layout/TrustBar';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { cartTotals, formatMoney } from '../utils/pricing';
import { Split, PageEnter, useReveal, Magnetic } from '../anim/primitives';

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

const BLOCK_NUM = 'w-7 h-7 rounded-full bg-accent text-ink text-[12px] font-black flex items-center justify-center flex-shrink-0';

export default function Checkout() {
  const { items, clearCart, lineKey } = useCart();
  const { placeOrder } = useOrder();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvc: '',
  });

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const totals = cartTotals(items);
  const headRef = useRef(null);
  const formRef = useRef(null);
  const sideRef = useRef(null);
  const btnRef = useRef(null);
  useReveal(headRef, { y: 30, duration: 0.7, start: '0px' });
  useReveal(formRef, { selector: 'section', y: 40, duration: 0.7, stagger: 0.12, start: '0px' });
  useReveal(sideRef, { y: 40, duration: 0.8, start: '0px' });
  useReveal(btnRef, { y: 20, duration: 0.6, delay: 0.4, start: '0px' });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const markTouched = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errors = {
    name: form.name.trim().length < 2 ? 'Please enter your full name.' : null,
    email: !isValidEmail(form.email) ? 'Please enter a valid email.' : null,
    address: form.address.trim().length < 3 ? 'Please enter your address.' : null,
    city: form.city.trim().length < 2 ? 'Please enter your city.' : null,
    zip: form.zip.trim().length < 3 ? 'Please enter your ZIP / postal code.' : null,
    cardNumber: form.cardNumber.replace(/\s/g, '').length < 12 ? 'Card number looks incomplete.' : null,
    expiry: !/^\d{2}\s*\/\s*\d{2}$/.test(form.expiry.trim()) ? 'Use MM/YY format.' : null,
    cvc: form.cvc.trim().length < 3 ? 'CVC is 3 or 4 digits.' : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, address: true, city: true, zip: true, cardNumber: true, expiry: true, cvc: true });
    if (hasErrors || submitting) return;

    setSubmitting(true);
    const timer = setTimeout(() => {
      try {
        const orderNumber = `VLT-${Date.now().toString(36).toUpperCase()}`;
        placeOrder({ orderNumber, items, totals, placedAt: new Date().toISOString(), contact: { name: form.name, email: form.email, address: form.address, city: form.city, zip: form.zip } });
        clearCart();
        navigate('/confirmation');
      } catch {
        // If anything fails (e.g. context error), unlock the button so the
        // user can try again rather than being stuck on a disabled spinner.
        setSubmitting(false);
      }
    }, 800);

    // Cleanup: if the component unmounts (user navigates away via Back)
    // before the 800 ms timer fires, cancel it to avoid calling setState
    // on an unmounted component.
    return () => clearTimeout(timer);
  };

  return (
    <PageEnter as="main" className="pt-[72px] min-h-screen bg-surface">
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-24">
        {/* Header */}
        <div className="mb-12" ref={headRef}>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-4">Voltrace · Secure checkout</span>
          <h1 className="font-display font-black text-[clamp(40px,6vw,80px)] leading-[0.92] tracking-[-0.04em] text-ink">
            <Split as="span" className="block">Place your <em>order</em>.</Split>
          </h1>
          <p className="text-[16px] text-ink-muted mt-4">Secure 256-bit checkout. We never store your card details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Form */}
          <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate ref={formRef}>
            {/* Shipping */}
            <section className="bg-surface-pure border border-border rounded-[20px] p-6" aria-labelledby="ship-h">
              <div className="flex items-center gap-3 mb-6">
                <span className={BLOCK_NUM}>1</span>
                <h2 id="ship-h" className="text-[18px] font-bold text-ink">Shipping</h2>
                <span className="ml-auto text-[12px] text-ink-muted font-medium">Guest · No account</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input className="sm:col-span-2" label="Full name" autoComplete="name" value={form.name} onChange={update('name')} onBlur={markTouched('name')} error={touched.name ? errors.name : null} required />
                <Input className="sm:col-span-2" label="Email" type="email" autoComplete="email" value={form.email} onChange={update('email')} onBlur={markTouched('email')} error={touched.email ? errors.email : null} required />
                <Input className="sm:col-span-2" label="Street address" autoComplete="street-address" value={form.address} onChange={update('address')} onBlur={markTouched('address')} error={touched.address ? errors.address : null} required />
                <Input label="City" autoComplete="address-level2" value={form.city} onChange={update('city')} onBlur={markTouched('city')} error={touched.city ? errors.city : null} required />
                <Input label="ZIP / postal code" autoComplete="postal-code" value={form.zip} onChange={update('zip')} onBlur={markTouched('zip')} error={touched.zip ? errors.zip : null} required />
              </div>
            </section>

            {/* Payment */}
            <section className="bg-surface-pure border border-border rounded-[20px] p-6" aria-labelledby="pay-h">
              <div className="flex items-center gap-3 mb-6">
                <span className={BLOCK_NUM}>2</span>
                <h2 id="pay-h" className="text-[18px] font-bold text-ink">Payment</h2>
                <span className="ml-auto flex items-center gap-1.5 text-[12px] text-ink-muted font-medium" aria-label="Secure 256-bit checkout">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="11" width="16" height="10" rx="1" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  Secure 256-bit
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input className="sm:col-span-2" label="Card number" autoComplete="cc-number" inputMode="numeric" value={form.cardNumber} onChange={update('cardNumber')} onBlur={markTouched('cardNumber')} error={touched.cardNumber ? errors.cardNumber : null} placeholder="1234 5678 9012 3456" required />
                <Input label="Expiry (MM/YY)" autoComplete="cc-exp" value={form.expiry} onChange={update('expiry')} onBlur={markTouched('expiry')} error={touched.expiry ? errors.expiry : null} placeholder="MM/YY" required />
                <Input label="CVC" autoComplete="cc-csc" inputMode="numeric" value={form.cvc} onChange={update('cvc')} onBlur={markTouched('cvc')} error={touched.cvc ? errors.cvc : null} placeholder="123" required />
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <span className="text-[12px] text-ink-muted">We accept</span>
                {['VISA', 'MC', 'AMEX'].map((card) => (
                  <span key={card} className="px-2 py-1 rounded border border-border text-[11px] font-bold text-ink-muted">{card}</span>
                ))}
              </div>
            </section>

            {/* Review */}
            <section className="bg-surface-pure border border-border rounded-[20px] p-6" aria-labelledby="rev-h">
              <div className="flex items-center gap-3 mb-6">
                <span className={BLOCK_NUM}>3</span>
                <h2 id="rev-h" className="text-[18px] font-bold text-ink">Review</h2>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Shipping to', value: form.address ? `${form.city}, ${form.zip}` : 'Add your address' },
                  { label: 'Email receipt to', value: form.email || '—' },
                  { label: 'Items', value: `${items.length} ${items.length === 1 ? 'pair' : 'pairs'}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-[14px] py-2 border-b border-border last:border-none">
                    <span className="text-ink-muted">{label}</span>
                    <strong className="text-ink">{value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <div ref={btnRef}>
              <Magnetic>
                <Button type="submit" variant="dark" size="lg" fullWidth loading={submitting} disabled={hasErrors} data-cursor="hover">
                  {submitting ? 'Processing…' : `Place order · ${formatMoney(totals.totalCents)}`}
                </Button>
              </Magnetic>
            </div>
          </form>

          {/* Summary sidebar */}
          <aside className="self-start sticky top-[88px]" ref={sideRef} aria-label="Order summary">
            <div className="bg-surface-pure border border-border rounded-[20px] p-6 flex flex-col gap-4">
              <h2 className="text-[17px] font-bold text-ink">Order summary</h2>

              {/* Items */}
              <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={lineKey(item)} className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-surface-alt flex items-center justify-center p-1">
                      <ProductImage src={item.image.src} alt={item.name} primary={item.image.primary} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-ink truncate">{item.name}</p>
                      <p className="text-[11px] text-ink-muted">Size {item.size} · {item.colorway}{item.width ? ` · ${item.width}` : ''} · Qty {item.qty}</p>
                    </div>
                    <span className="text-[13px] font-bold text-ink flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                {[
                  { label: 'Subtotal', value: formatMoney(totals.subtotalCents) },
                  { label: 'Shipping', value: totals.shippingCents === 0 ? 'Free' : formatMoney(totals.shippingCents) },
                  { label: 'Tax (est.)', value: formatMoney(totals.taxCents) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-[13px]">
                    <span className="text-ink-muted">{label}</span>
                    <strong className="text-ink">{value}</strong>
                  </div>
                ))}
                <div className="flex justify-between text-[16px] font-black border-t border-border pt-3 mt-1">
                  <span className="text-ink">Total</span>
                  <span className="text-ink">{formatMoney(totals.totalCents)}</span>
                </div>
              </div>

              <LinkButton to="/cart" variant="ghost" className="self-center text-[13px]">← Back to cart</LinkButton>
            </div>
          </aside>
        </div>
      </div>
      <TrustBar variant="light" />
    </PageEnter>
  );
}
