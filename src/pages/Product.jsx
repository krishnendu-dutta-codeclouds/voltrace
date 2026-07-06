import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import LinkButton from '../components/ui/LinkButton';
import Badge from '../components/ui/Badge';
import Stars from '../components/ui/Stars';
import VariantSelector from '../components/product/VariantSelector';
import SpecTable from '../components/product/SpecTable';
import ReviewList from '../components/product/ReviewList';
import CrossSell from '../components/product/CrossSell';
import ProductImage from '../components/product/ProductImage';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Split, PageEnter, useReveal, useParallax, useTilt, Magnetic } from '../anim/primitives';
import { motion, useAnimate, AnimatePresence } from 'framer-motion';

const FLYTO_DUR = 0.95;

export default function Product() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeAngle, setActiveAngle] = useState(0);
  const [colorway, setColorway] = useState(null);
  const [size, setSize] = useState(null);
  const [width, setWidth] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState('');
  const [flyTo, setFlyTo] = useState(null);

  const heroRef = useRef(null);
  const galleryRef = useRef(null);
  const primaryImgRef = useRef(null);
  const infoRef = useRef(null);
  const stickyBarRef = useRef(null);
  const specsRef = useRef(null);

  const [scope, animate] = useAnimate();

  useReveal(heroRef, { y: 30, duration: 0.8, start: 'top 90%' });
  useReveal(infoRef, { y: 30, duration: 0.6, stagger: 0.07, start: 'top 85%' });
  useReveal(specsRef, { y: 24, duration: 0.7, start: 'top 85%' });
  useParallax(primaryImgRef, { y: -40, scrub: 0.4 });
  useTilt(galleryRef, { max: 4, perspective: 1000 });

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  useEffect(() => {
    if (!product) return;
    setColorway(product.colorways[0].name);
    setSize(null); setWidth(null); setQty(1);
    setActiveAngle(0); setAddError(''); setAdded(false);
  }, [product]);

  /* Sticky mobile bar */
  useEffect(() => {
    if (!product) return;
    const bar = stickyBarRef.current;
    if (!bar) return;
    const target = document.getElementById('pdp-cta');
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => bar.classList.toggle('translate-y-full', entry.isIntersecting),
      { rootMargin: '-50px 0px 0px 0px', threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [product]);

  const popChip = (el) => {
    if (!el) return;
    animate(el, { scale: [0.85, 1] }, { duration: 0.4, type: 'spring', stiffness: 300, damping: 15 });
  };
  const onPickSize = (val, e) => { popChip(e?.currentTarget); setSize(val); };
  const onPickColor = (val, e) => { popChip(e?.currentTarget); setColorway(val); };
  const onPickWidth = (val, e) => { popChip(e?.currentTarget); setWidth(val); };

  if (loading) {
    return (
      <PageEnter as="main" className="pt-[72px]">
        <div className="mx-auto max-w-[1440px] px-6 py-24 flex items-center justify-center">
          <div className="flex flex-col gap-4 w-full max-w-[480px]">
            <div className="skeleton-shimmer aspect-square rounded-[20px]" />
            <div className="skeleton-shimmer h-8 w-2/3 rounded-full" />
            <div className="skeleton-shimmer h-5 w-1/2 rounded-full" />
          </div>
        </div>
      </PageEnter>
    );
  }

  if (!product) {
    return (
      <PageEnter as="main" className="pt-[72px]">
        <div className="mx-auto max-w-[1440px] px-6 py-24 flex flex-col items-center gap-6 text-center">
          <h1 className="text-[clamp(24px,4vw,48px)] font-display font-black text-ink">We couldn't find that shoe.</h1>
          <Button onClick={() => navigate('/shop')}>Back to shop</Button>
        </div>
      </PageEnter>
    );
  }

  const currentImage = product.images.find((i) => i.colorway === colorway) ?? product.images[0];
  const angleBImage = product.images[1] ?? product.images[0];
  const sizeRecord = product.sizes.find((s) => s.size === size);
  const sizeInStock = sizeRecord ? sizeRecord.inStock : null;
  const wishlisted = isInWishlist(product.id);

  const related = products.filter((p) => p.id !== product.id && p.line === product.line).slice(0, 4);

  const onAdd = (e) => {
    const sourceEl = e?.currentTarget;
    if (!size) { setAddError('Pick a size first.'); return; }
    if (sizeInStock === false) { setAddError(`Size ${size} is sold out.`); return; }
    setAddError('');

    const cartLink = document.querySelector('[aria-label*="Cart,"]');
    if (sourceEl && cartLink) {
      const sRect = sourceEl.getBoundingClientRect();
      const cRect = cartLink.getBoundingClientRect();
      setFlyTo({
        startX: sRect.left + sRect.width / 2 - 80,
        startY: sRect.top + sRect.height / 2 - 60,
        endX: cRect.left + cRect.width / 2 - 80,
        endY: cRect.top + cRect.height / 2 - 60,
        src: currentImage.src,
        primary: currentImage.primary,
      });
    }

    addItem({
      productId: product.id, name: product.name, line: product.line,
      price: product.price, colorway: colorway || product.colorways[0].name,
      size, width: width || (product.width?.[0] ?? null),
      image: { primary: currentImage.primary, secondary: currentImage.secondary, src: currentImage.src },
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <PageEnter as="main" className="pt-[72px] bg-surface" ref={scope}>
      {/* Hero grid */}
      <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-20" ref={heroRef}>
        {/* Breadcrumb */}
        <div className="mb-8">
          <LinkButton to="/shop" variant="ghost" size="sm">← Back to shop</LinkButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery */}
          <div ref={galleryRef} data-cursor="hover" className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative rounded-[24px] overflow-hidden bg-[#F1F0EA] aspect-square">
              <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-[#0B0B0F]/80 text-[#FAFAF7] text-[11px] font-semibold uppercase tracking-[0.06em] backdrop-blur-sm">
                {product.line}
              </span>
              {/* Primary angle */}
              <motion.div
                ref={primaryImgRef}
                className="absolute inset-0"
                animate={{ opacity: activeAngle === 0 ? 1 : 0, scale: activeAngle === 0 ? 1 : 1.04 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                <ProductImage
                  src={currentImage.src}
                  alt={`${product.name} — ${currentImage.colorway}`}
                  primary={currentImage.primary}
                  eager
                />
              </motion.div>
              {/* Alt angle */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: activeAngle === 1 ? 1 : 0, scale: activeAngle === 1 ? 1 : 0.96 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                <ProductImage
                  src={angleBImage.src}
                  alt={`${product.name} — ${angleBImage.colorway} angle`}
                  primary={angleBImage.primary}
                />
              </motion.div>
            </div>

            {/* Angle thumbnails */}
            <div className="flex gap-3" role="tablist" aria-label="Image angle">
              {[currentImage, angleBImage].map((img, a) => (
                <button
                  key={a}
                  type="button"
                  role="tab"
                  aria-selected={activeAngle === a}
                  onClick={() => setActiveAngle(a)}
                  data-cursor="hover"
                  className={[
                    'flex-1 aspect-square rounded-[14px] overflow-hidden border-2 transition-all duration-150',
                    activeAngle === a ? 'border-[#0B0B0F]' : 'border-[#E6E4DC] hover:border-[#6B6F7A]',
                  ].join(' ')}
                  aria-label={`View ${a === 0 ? 'side' : '3/4'} angle`}
                >
                  <ProductImage
                    src={img.src}
                    alt={`${product.name} — ${a === 0 ? 'side' : '3/4'} view`}
                    primary={img.primary}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-6" ref={infoRef}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{product.line}</span>
              <AnimatePresence>
                {added && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <Badge variant="success">Added ✓</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <h1 className="text-[clamp(28px,4vw,56px)] font-display font-black leading-tight tracking-tight text-ink">
              <Split as="span" className="block">{product.name}</Split>
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-[28px] font-display font-black text-ink">${product.price}</span>
              <Stars rating={product.rating} reviewCount={product.reviewCount} size={16} />
            </div>

            {product.tagline && (
              <p className="text-[15px] text-ink-muted italic">"{product.tagline}"</p>
            )}

            {/* Variant selector */}
            <VariantSelector
              product={product}
              colorway={colorway}
              onColorway={onPickColor}
              size={size}
              onSize={onPickSize}
              width={width}
              onWidth={onPickWidth}
            />

            {/* Qty + CTA */}
            <div id="pdp-cta" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-full border border-border bg-surface-pure p-1">
                <button
                  type="button"
                  className="w-11 h-11 flex items-center justify-center rounded-full text-lg font-bold text-ink hover:bg-surface-alt transition-colors duration-150"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="text-center text-[15px] font-semibold text-ink">{qty}</span>
                <button
                  type="button"
                  className="w-11 h-11 flex items-center justify-center rounded-full text-lg font-bold text-ink hover:bg-surface-alt transition-colors duration-150"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <Magnetic>
                <Button
                  variant="dark"
                  size="lg"
                  onClick={onAdd}
                  data-cursor="hover"
                  className="w-full sm:w-auto rounded-[18px] shadow-[0_24px_64px_-34px_rgba(207,255,4,0.95)]"
                >
                  {added ? 'Added to bag ✓' : 'Add to bag'}
                </Button>
              </Magnetic>

              <button
                type="button"
                className={[
                  'w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all duration-150 flex-shrink-0',
                  wishlisted ? 'border-[#ff3e6c] text-[#ff3e6c] bg-[#ff3e6c]/10' : 'border-border text-ink hover:border-ink-muted',
                ].join(' ')}
                onClick={() => toggleWishlist(product)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                data-cursor="hover"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill={wishlisted ? '#ff3e6c' : 'none'} stroke={wishlisted ? '#ff3e6c' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {addError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[13px] font-semibold text-[#C81E1E] bg-[#C81E1E]/10 px-3 py-2 rounded-lg"
                  role="alert"
                >
                  {addError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Benefits */}
            <ul className="flex flex-col gap-2 border-t border-border pt-4">
              {[
                ['Free shipping', 'on orders over $75'],
                ['60-day', 'trial, free returns'],
                ['30-day', 'defect guarantee'],
              ].map(([strong, rest]) => (
                <li key={strong} className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <strong className="text-ink">{strong}</strong> {rest}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className="mx-auto max-w-[1440px] px-6 py-16" ref={specsRef}>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">Specifications</span>
        <h2 className="text-[clamp(24px,3vw,40px)] font-display font-black text-ink mb-8">What's inside</h2>
        <div className="max-w-[560px]">
          <SpecTable specs={product.specs} />
        </div>
      </div>

      {/* Reviews */}
      <ReviewList reviews={product.reviews ?? []} rating={product.rating} reviewCount={product.reviewCount} />

      {/* Cross-sell */}
      <CrossSell related={related} />

      {/* Sticky mobile bar */}
      <div
        ref={stickyBarRef}
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-4 py-3 bg-surface/90 backdrop-blur-xl border-t border-border translate-y-full transition-transform duration-200 md:hidden"
        aria-hidden={!product}
      >
        <div>
          <p className="text-[14px] font-bold text-ink leading-tight">{product.name}</p>
          <p className="text-[13px] font-black text-ink">${product.price}</p>
        </div>
        <Button
          variant="accent"
          onClick={onAdd}
          data-cursor="hover"
          className="bg-[#CFFF04] text-ink border-[#CFFF04] hover:bg-[#D4FF3B] hover:text-ink shadow-accent"
        >
          {added ? 'Added ✓' : 'Add to bag'}
        </Button>
      </div>

      {/* Fly-to-cart overlay */}
      {flyTo && <FlyThumb {...flyTo} onDone={() => setFlyTo(null)} />}
    </PageEnter>
  );
}

function FlyThumb({ startX, startY, endX, endY, src, primary, onDone }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!scope.current) return;
    const dx = endX - startX;
    const dy = endY - startY;
    async function run() {
      await Promise.all([
        animate(scope.current, { scale: [0.5, 0.7], opacity: [0, 1] }, { duration: 0.2, ease: 'easeOut' }),
        animate(scope.current, { x: dx, y: dy, scale: 0.18, rotate: -12 }, { duration: FLYTO_DUR, ease: 'easeInOut' }),
      ]);
      const cartLink = document.querySelector('[aria-label*="Cart,"]');
      if (cartLink) animate(cartLink, { scale: [1, 1.18, 1] }, { duration: 0.36, ease: 'easeOut' });
      await animate(scope.current, { opacity: 0 }, { duration: 0.18 });
      onDone();
    }
    run();
  }, [endX, endY, startX, startY, animate, scope, onDone]);

  return (
    <motion.div
      ref={scope}
      style={{
        position: 'fixed', left: startX, top: startY,
        width: 160, height: 120, zIndex: 200,
        pointerEvents: 'none', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
      }}
    >
      <ProductImage src={src} alt="" primary={primary} eager />
    </motion.div>
  );
}
