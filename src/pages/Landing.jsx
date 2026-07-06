import { useMemo, useRef, useState } from 'react';
import LinkButton from '../components/ui/LinkButton';
import Stars from '../components/ui/Stars';
import ShoeSVG from '../components/product/ShoeSVG';
import ProductCard from '../components/product/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { aggregateRating } from '../utils/filters';
import { formatMoney } from '../utils/pricing';
import {
  Split, Reveal, Magnetic, ImageReveal, Counter,
  PageEnter, useMarquee, useTilt, useReveal, useParallax,
} from '../anim/primitives';

/* ============================================================
   Hero
   ============================================================ */
function Hero({ heroProduct }) {
  const heroRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const cardRef = useRef(null);
  const cardStageRef = useRef(null);

  useTilt(cardRef, { max: 4 });
  useReveal(heroRef, { selector: '.hero__eyebrow, .hero__kicker', y: 16, duration: 0.6, start: 'top 90%' });
  useReveal(ctaGroupRef, { y: 20, duration: 0.8, delay: 0.3, stagger: 0.08, start: 'top 95%' });
  useReveal(cardStageRef, { y: 60, duration: 1.1, delay: 0.2, start: 'top 90%', once: true });
  useParallax(cardStageRef, { speed: -0.12 });

  const featured = heroProduct;
  const colorways = featured?.colorways || [];
  const images = featured?.images || [];
  const [activeColor, setActiveColor] = useState(0);
  const activeImage = images[activeColor] || images[0] || null;

  if (!featured || !activeImage) {
    return (
      <section className="min-h-[70vh] flex items-center" ref={heroRef}>
        <div className="mx-auto max-w-[1440px] px-6 w-full">
          <div className="skeleton-shimmer w-full h-[400px] rounded-[24px]" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden"
      ref={heroRef}
      style={{ '--glow-color': `${activeImage?.primary || '#CFFF04'}1E` }}
    >
      {/* Promo strip */}
      <div
        className="bg-ink text-surface py-2.5"
        role="region"
        aria-label="Site promotions"
      >
        <div className="mx-auto max-w-[1440px] px-6 flex items-center justify-center gap-6 flex-wrap text-[12px] font-medium">
          <span><strong>Free shipping</strong> over $75</span>
          <span className="text-ink-3" aria-hidden="true">·</span>
          <span>30-day returns</span>
          <span className="text-ink-3" aria-hidden="true">·</span>
          <span>2-year outsole warranty</span>
          <span className="text-ink-3" aria-hidden="true">·</span>
          <span className="text-accent font-bold">New SS26 drop is live</span>
        </div>
      </div>

      {/* Two-column hero */}
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: copy */}
        <div className="flex flex-col gap-6">
          <span className="hero__eyebrow text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
            Voltrace · New collection · SS26
          </span>

          <h1 className="font-display font-black text-[clamp(40px,6vw,88px)] leading-[0.92] tracking-[-0.04em] text-ink">
            <span className="hero__line block">
              <Split as="span">{featured.name}</Split>
            </span>
            <span className="hero__line hero__line--sub block italic text-ink-muted text-[0.7em]">
              <Split as="span">{featured.tagline}</Split>
            </span>
          </h1>

          {/* Price + rating */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[28px] font-display font-black text-ink">{formatMoney(featured.price * 100)}</span>
            <Stars rating={featured.rating} reviewCount={featured.reviewCount} size={15} />
          </div>

          {/* Specs inline */}
          <ul className="flex gap-6 flex-wrap border-y border-border py-4" aria-label="Key specifications">
            <li className="flex flex-col gap-0.5">
              <span className="text-[11px] text-ink-muted font-medium">Weight</span>
              <strong className="text-[14px] font-bold text-ink">{featured.specs.weight}</strong>
            </li>
            <li className="flex flex-col gap-0.5">
              <span className="text-[11px] text-ink-muted font-medium">Heel drop</span>
              <strong className="text-[14px] font-bold text-ink">{featured.specs.drop}</strong>
            </li>
            <li className="flex flex-col gap-0.5">
              <span className="text-[11px] text-ink-muted font-medium">Cushioning</span>
              <strong className="text-[14px] font-bold text-ink">{featured.specs.cushioning}</strong>
            </li>
          </ul>

          {/* Colorway swatches */}
          <div role="radiogroup" aria-label={`${featured.name} colorways`}>
            <span className="block text-[12px] text-ink-muted mb-2">
              Color · <strong className="text-ink">{activeImage.colorway}</strong>
            </span>
            <div className="flex gap-2">
              {colorways.map((cw, i) => {
                const active = i === activeColor;
                return (
                  <button
                    key={cw.name}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={cw.name}
                    title={cw.name}
                    onClick={() => setActiveColor(i)}
                    className={[
                      'w-9 h-9 rounded-full border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                      active ? 'border-ink ring-2 ring-ink ring-offset-2' : 'border-border hover:border-ink-muted',
                    ].join(' ')}
                    style={{ background: cw.swatch }}
                  />
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div ref={ctaGroupRef} className="flex gap-3 flex-wrap">
            <Magnetic strength={0.1}>
              <LinkButton to={`/product/${featured.id}`} variant="accent" size="lg" data-cursor="hover">
                Shop now — {formatMoney(featured.price * 100)}
              </LinkButton>
            </Magnetic>
            <Magnetic strength={0.08}>
              <LinkButton to="/shop" variant="ghost" size="lg" data-cursor="hover">
                Browse all 7 styles
              </LinkButton>
            </Magnetic>
          </div>
        </div>

        {/* RIGHT: product visual */}
        <div className="relative" ref={cardStageRef} data-cursor="hover">
          <div ref={cardRef} className="relative rounded-[32px] overflow-hidden bg-surface-alt aspect-square flex items-center justify-center p-10" data-cursor="hover">
            {/* New drop badge */}
            <span className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-accent text-ink text-[11px] font-black uppercase tracking-[0.08em]">
              New drop
            </span>
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(60% 60% at 50% 50%, var(--glow-color) 0%, transparent 70%)` }}
            />
            <ShoeSVG primary={activeImage.primary} secondary={activeImage.secondary} angle={0} />
          </div>

          {/* Floating tech badges */}
          <div className="absolute top-8 -left-4 flex items-center gap-2 bg-surface-pure/90 backdrop-blur-md rounded-full px-3 py-2 shadow-md text-[12px] font-semibold text-ink">
            <span>⚡</span>
            <span>{featured.specs.cushioning} Cushioning</span>
          </div>
          <div className="absolute bottom-12 -right-4 flex items-center gap-2 bg-ink text-surface rounded-full px-3 py-2 shadow-md text-[12px] font-semibold">
            <span>⚖️</span>
            <span>{featured.specs.weight} (Ultra light)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Marquee strip
   ============================================================ */
function MarqueeStrip() {
  const items = [
    'Free shipping over $75', '30-day returns', '2-year outsole warranty',
    'Secure 256-bit checkout', 'Carbon-neutral delivery', 'Engineered in Lisbon',
    'Free shipping over $75', '30-day returns', '2-year outsole warranty',
    'Secure 256-bit checkout', 'Carbon-neutral delivery', 'Engineered in Lisbon',
  ];
  const ref = useRef(null);
  useMarquee(ref, { speed: 80, direction: 1, pauseOnHover: true });

  return (
    <aside className="w-full overflow-hidden bg-ink border-y border-ink-3 py-4" aria-label="Trust signals">
      <div ref={ref} className="flex items-center whitespace-nowrap">
        {items.map((it, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-[12px] font-medium text-surface flex-shrink-0 px-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            {it}
            <span className="text-ink-soft ml-6" aria-hidden="true">◆</span>
          </span>
        ))}
      </div>
    </aside>
  );
}

/* ============================================================
   Featured collection
   ============================================================ */
function FeaturedCollection({ featured, loading }) {
  const headRef = useRef(null);
  const gridRef = useRef(null);
  useReveal(headRef, { y: 30, duration: 0.7, stagger: 0.08, start: 'top 85%' });
  useReveal(gridRef, { selector: '.card, article', y: 60, duration: 0.9, stagger: 0.08, start: 'top 80%' });

  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-[1440px] px-6">
        <header className="flex items-end justify-between gap-6 mb-12" ref={headRef}>
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">Featured · 4 of 7</span>
            <h2 className="text-[clamp(32px,5vw,64px)] font-display font-black leading-tight tracking-tight text-ink mt-2">
              The <em>essentials</em>.
            </h2>
            <p className="text-[16px] text-ink-muted mt-3 max-w-[40ch]">
              Hand-picked from the catalog — the shoes our team actually reaches for.
            </p>
          </div>
          <Magnetic>
            <LinkButton to="/shop" variant="secondary" data-cursor="hover">See the full collection →</LinkButton>
          </Magnetic>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" ref={gridRef}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col rounded-[20px] overflow-hidden bg-surface-alt">
                  <div className="skeleton-shimmer aspect-[4/3]" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
                    <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
                  </div>
                </div>
              ))
            : featured.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Bento
   ============================================================ */
function Bento() {
  const headRef = useRef(null);
  const gridRef = useRef(null);
  useReveal(headRef, { y: 24, duration: 0.7, stagger: 0.08, start: 'top 85%' });
  useReveal(gridRef, { selector: '.bento-cell', y: 40, duration: 0.8, stagger: 0.1, start: 'top 80%' });

  return (
    <section className="py-24 bg-surface-alt">
      <div className="mx-auto max-w-[1440px] px-6">
        <header className="mb-12" ref={headRef}>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">Engineered by line</span>
          <h2 className="text-[clamp(32px,5vw,64px)] font-display font-black leading-tight tracking-tight text-ink max-w-[20ch]">
            Three lines, three jobs, zero compromise.
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" ref={gridRef}>
          {/* Running — large */}
          <article className="bento-cell col-span-1 lg:col-span-2 row-span-1 bg-ink text-surface rounded-[24px] p-8 flex flex-col gap-4 relative overflow-hidden min-h-[320px]" data-cursor="hover">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted">01 / Running</span>
            <h3 className="text-[28px] font-display font-black leading-tight">Daily miles, dialed in.</h3>
            <p className="text-[14px] text-on-dark-muted leading-relaxed max-w-[36ch]">
              A dual-density foam midsole and a 4mm forefoot rocker deliver a smooth heel-to-toe transition.
            </p>
            <span className="text-[11px] font-semibold text-on-dark-muted">8mm drop · 225g · Carbon-plate option</span>
            <div className="absolute right-0 bottom-0 w-48 opacity-30 pointer-events-none">
              <ShoeSVG primary="#D6FF3A" secondary="#0B0B0F" accent="#FFFFFF" />
            </div>
          </article>

          {/* Trail */}
          <article className="bento-cell bg-surface-pure rounded-[24px] p-8 flex flex-col gap-3 min-h-[260px]" data-cursor="hover">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">02 / Trail</span>
            <h3 className="text-[24px] font-display font-black leading-tight text-ink">Wet rock,<br/>dry feet.</h3>
            <span className="text-[12px] text-ink-muted font-semibold mt-auto">GORE-TEX · 4mm lugs</span>
          </article>

          {/* Counter cell */}
          <article className="bento-cell bg-accent rounded-[24px] p-8 flex flex-col gap-2 justify-end" data-cursor="hover">
            <Counter from={0} to={4} decimals={0} duration={1.6} className="text-[80px] font-display font-black leading-none text-ink" suffix="mm" />
            <span className="text-[13px] font-semibold text-ink/70">Aggressive lugs</span>
          </article>

          {/* Training */}
          <article className="bento-cell bg-surface-pure rounded-[24px] p-8 flex flex-col gap-3" data-cursor="hover">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">03 / Training</span>
            <h3 className="text-[24px] font-display font-black leading-tight text-ink">Stable under load.</h3>
            <p className="text-[14px] text-ink-muted leading-relaxed">Flat 4mm-drop platform with TPU-reinforced sidewall.</p>
            <span className="text-[12px] text-ink-muted font-semibold mt-auto">285g · Rope-guard sidewall</span>
          </article>

          {/* Lifestyle */}
          <article className="bento-cell bg-ink-2 text-surface rounded-[24px] p-8 flex flex-col gap-3" data-cursor="hover">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted">04 / Lifestyle</span>
            <h3 className="text-[24px] font-display font-black leading-tight">Engineered off the clock.</h3>
            <p className="text-[14px] text-on-dark-muted leading-relaxed">Running-shoe comfort, suede upper, recycled foam.</p>
            <span className="text-[12px] text-on-dark-muted font-semibold mt-auto">Premium suede · Gum rubber</span>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Proof (ratings)
   ============================================================ */
function Proof({ loading, average, total }) {
  const ref = useRef(null);
  useReveal(ref, { y: 24, duration: 0.7, stagger: 0.08, start: 'top 85%' });

  return (
    <section className="py-24 bg-surface-dark text-surface">
      <div className="mx-auto max-w-[1440px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" ref={ref}>
        <div className="flex flex-col gap-6">
          <Stars rating={average} size={22} />
          <h2 className="text-[clamp(32px,5vw,64px)] font-display font-black leading-tight tracking-tight">
            Rated by the people who actually log the miles.
          </h2>
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="text-[80px] font-display font-black leading-none text-accent">
              {loading ? '—' : <Counter from={0} to={average} decimals={1} duration={1.4} />}
            </span>
            <p className="text-[15px] text-on-dark-muted max-w-[24ch]">
              {loading ? 'Loading reviews…' : `Average from ${total} verified reviews across the catalog.`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '$75', label: 'Free shipping threshold' },
            { num: '30d', label: 'Free returns' },
            { num: '2yr', label: 'Outsole warranty' },
            { num: '7', label: 'SKUs · 4 lines' },
          ].map(({ num, label }) => (
            <div key={num} className="bg-ink-2 rounded-[20px] p-6 flex flex-col gap-2" data-cursor="hover">
              <p className="text-[36px] font-display font-black text-accent leading-none">{num}</p>
              <p className="text-[12px] text-on-dark-muted font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Closing CTA
   ============================================================ */
function Closing() {
  const ref = useRef(null);
  useReveal(ref, { selector: '.closing-eyebrow, .closing-sub', y: 24, duration: 0.7, stagger: 0.08, start: 'top 80%' });
  useReveal(ref, { selector: '.closing-ctas > *', y: 20, duration: 0.7, delay: 0.6, stagger: 0.1, start: 'top 80%' });

  return (
    <section className="py-32 bg-surface-alt" ref={ref}>
      <div className="mx-auto max-w-[1440px] px-6 flex flex-col items-center text-center gap-8">
        <span className="closing-eyebrow text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Ready when you are</span>
        <h2 className="text-[clamp(48px,8vw,120px)] font-display font-black leading-[0.9] tracking-tight text-ink">
          <Split as="span" className="block">Find the shoe</Split>
          <Split as="span" className="block">for the <em>work</em></Split>
          <Split as="span" className="block">you're doing.</Split>
        </h2>
        <p className="closing-sub text-[16px] text-ink-muted max-w-[40ch]">
          Browse the full Voltrace lineup — running, trail, training, and everyday.
        </p>
        <div className="closing-ctas flex gap-3 flex-wrap justify-center">
          <Magnetic>
            <LinkButton to="/shop" variant="accent" size="lg" data-cursor="hover">Browse Full Collection →</LinkButton>
          </Magnetic>
          <Magnetic>
            <LinkButton to="/shop?line=Running" variant="secondary" size="lg" data-cursor="hover">Running first</LinkButton>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Landing
   ============================================================ */
export default function Landing() {
  const { products, loading } = useProducts();
  const { average, total } = aggregateRating(products);
  const heroProduct = products.find((p) => p.id === 'pulse-runner-pro') ?? products[0];
  const featured = products.filter((p) => p.line !== 'Lifestyle').slice(0, 4);

  return (
    <PageEnter as="main" className="pt-[72px]">
      <Hero heroProduct={heroProduct} />
      <MarqueeStrip />
      <FeaturedCollection featured={featured} loading={loading} />
      <Bento />
      <Proof loading={loading} average={average} total={total} />
      <Closing />
    </PageEnter>
  );
}
