import { useMemo, useRef, useState, useEffect } from 'react';
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
   Typing Headline helper
   ============================================================ */
function TypingHeadline() {
  const phrases = [
    ["TIME TO", "DOUBLE", "DOWN."],
    ["RACE ON", "CARBON", "FOAM."],
    ["RUN THE", "STREET", "HARD."]
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [displayedLines, setDisplayedLines] = useState(['', '', '']);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[phraseIdx];

    const tick = () => {
      if (!isDeleting) {
        const targetText = currentPhrase[lineIdx];
        const currentText = displayedLines[lineIdx];

        if (currentText.length < targetText.length) {
          // Add character
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[lineIdx] = targetText.substring(0, currentText.length + 1);
            return next;
          });
        } else {
          // Done typing this line
          if (lineIdx < 2) {
            setLineIdx((prev) => prev + 1);
          } else {
            // Entire phrase complete, wait and then delete
            timer = setTimeout(() => {
              setIsDeleting(true);
            }, 2000);
            return;
          }
        }
      } else {
        const currentText = displayedLines[lineIdx];

        if (currentText.length > 0) {
          // Delete character
          setDisplayedLines((prev) => {
            const next = [...prev];
            next[lineIdx] = currentText.substring(0, currentText.length - 1);
            return next;
          });
        } else {
          // Done deleting this line
          if (lineIdx > 0) {
            setLineIdx((prev) => prev - 1);
          } else {
            // Entire phrase deleted, wait and then show next phrase
            timer = setTimeout(() => {
              setIsDeleting(false);
              setPhraseIdx((prev) => (prev + 1) % phrases.length);
              setLineIdx(0);
            }, 400);
            return;
          }
        }
      }
    };

    const delay = isDeleting ? 30 : 65;
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [phraseIdx, lineIdx, isDeleting, displayedLines]);

  return (
    <h1 className="hero__headline font-display font-black leading-[0.88] tracking-[-0.04em] text-surface flex flex-col">
      <span className=" text-[clamp(36px,4.5vw,72px)] min-h-[1.1em] flex items-center gap-1.5">
        {displayedLines[0]}
        {((!isDeleting && lineIdx === 0) || (isDeleting && lineIdx === 0 && displayedLines[0].length > 0)) && (
          <span className="w-1.5 h-[0.7em] bg-accent inline-block animate-pulse shadow-[0_0_8px_#CFFF04]" />
        )}
      </span>
      <span className=" text-[clamp(36px,4.5vw,72px)] min-h-[1.1em] flex items-center gap-1.5">
        {displayedLines[1]}
        {((!isDeleting && lineIdx === 1) || (isDeleting && lineIdx === 1 && displayedLines[1].length > 0)) && (
          <span className="w-1.5 h-[0.7em] bg-accent inline-block animate-pulse shadow-[0_0_8px_#CFFF04]" />
        )}
      </span>
      <span className=" text-[clamp(36px,4.5vw,72px)] min-h-[1.1em] flex items-center gap-1.5 text-accent">
        {displayedLines[2]}
        {((!isDeleting && lineIdx === 2) || (isDeleting && lineIdx === 2 && displayedLines[2].length > 0)) && (
          <span className="w-1.5 h-[0.7em] bg-accent inline-block animate-pulse shadow-[0_0_8px_#CFFF04]" />
        )}
      </span>
    </h1>
  );
}

/* ============================================================
   Hero — 3-panel editorial bento (Adidas/Nike-style)
   ============================================================ */
function Hero({ heroProduct }) {
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const cardStageRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useTilt(cardRef, { max: 6 });
  useReveal(leftRef, { selector: '.hero__eyebrow, .hero__headline, .hero__sub, .hero__cats', y: 28, duration: 0.7, stagger: 0.1, start: '0px' });
  useReveal(cardStageRef, { y: 50, duration: 1.1, delay: 0.1, start: '0px', once: true });
  useReveal(rightRef, { selector: '.right-cell', y: 36, duration: 0.8, stagger: 0.12, start: '0px' });

  const featured = heroProduct;
  const colorways = featured?.colorways || [];
  const images = featured?.images || [];
  const [activeColor, setActiveColor] = useState(0);
  const activeImage = images[activeColor] || images[0] || null;

  const categories = [
    { label: 'Shop Men', to: '/shop' },
    { label: 'Shop Women', to: '/shop' },
    { label: 'Shop Trail', to: '/shop?line=Trail' },
  ];

  if (!featured || !activeImage) {
    return (
      <section className="min-h-[70vh] flex items-center pt-[64px]" ref={heroRef}>
        <div className="mx-auto max-w-[1440px] px-6 w-full">
          <div className="skeleton-shimmer w-full h-[500px] rounded-[24px]" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="relative bg-[#060606] text-surface overflow-hidden py-[20px]"
      aria-label="Hero — New Season"
    >
      {/* Ambient volt glow behind center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${activeImage.primary}14 0%, transparent 70%)`,
        }}
      />

      {/* ── Three-panel grid ────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-[1fr_1.1fr_1fr] gap-3 min-h-[calc(100vh-80px)]">

        {/* ══ PANEL 1 · Campaign copy ════════════════════════════ */}
        <div
          ref={leftRef}
          className="flex flex-col justify-between p-7 md:p-9 bg-white/3 border border-white/8 rounded-[28px] overflow-hidden relative group"
        >
          {/* Top texture lines */}
          <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          <div className="flex flex-col gap-6">
            <span className="hero__eyebrow inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/80">
              <span className="w-4 h-[1px] bg-accent/60 inline-block" />
              Voltrace · SS26 Season
            </span>

            <TypingHeadline />

            <p className="hero__sub text-[14px] text-surface/45 max-w-[28ch] leading-relaxed">
              Choose from the new season lineup and get them at performance price.
            </p>
          </div>

          {/* Category link buttons — Adidas-style */}
          <div className="hero__cats flex flex-col gap-2 mt-8">
            {categories.map(({ label, to }) => (
              <a
                key={label}
                href={`#${to}`}
                onClick={(e) => { e.preventDefault(); window.location.hash = to; }}
                className="flex items-center justify-between px-5 py-3.5 rounded-[14px] border border-white/10 bg-white/4 hover:bg-accent/10 hover:border-accent/40 hover:text-accent text-[13px] font-bold text-surface/60 transition-all duration-150 group/link"
              >
                <span>{label}</span>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-transform duration-150">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}

            {/* Main CTA */}
            <a
              href={`/voltrace/#/product/${featured.id}`}
              className="mt-2 flex items-center justify-center gap-2 h-12 rounded-[14px] bg-accent text-ink text-[13px] font-black uppercase tracking-[0.08em] hover:bg-surface hover:text-ink transition-all duration-150"
            >
              Shop Now — {formatMoney(featured.price * 100)}
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ══ PANEL 2 · Product center stage ════════════════════ */}
        <div
          ref={cardStageRef}
          className="relative flex flex-col items-center justify-between p-6 rounded-[28px] overflow-visible min-h-[460px]"
          data-cursor="hover"
        >
          {/* Radial glow tied to active colorway */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(70% 70% at 50% 55%, ${activeImage.primary}45 0%, transparent 70%)` }}
          />

          {/* New drop badge */}
          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-ink text-[10px] font-black uppercase tracking-[0.1em]">
              <span className="w-1.5 h-1.5 rounded-full bg-ink/50 animate-pulse" />
              New Drop SS26
            </span>
            <span className="text-[11px] font-mono text-surface/30 uppercase tracking-[0.15em]">
              {featured.line}
            </span>
          </div>

          {/* Shoe visual */}
          <div
            ref={cardRef}
            className="relative z-10 flex-1 flex items-center justify-center w-full py-4"
          >
            <ShoeSVG
              primary={activeImage.primary}
              secondary={activeImage.secondary}
              angle={0}
            />
          </div>

          {/* Product name + price */}
          <div className="relative z-10 w-full text-center mb-2">
            <p className="text-[22px] font-display font-black text-surface tracking-tight leading-tight">
              {featured.name}
            </p>
            <p className="text-[13px] text-surface/40 mt-1">{featured.tagline}</p>
          </div>

          {/* Colorway picker */}
          <div className="relative z-10 w-full flex flex-col items-center gap-3">
            <span className="text-[11px] text-surface/35 tracking-widest uppercase font-mono">
              {activeImage.colorway}
            </span>
            <div className="flex gap-2" role="radiogroup" aria-label={`${featured.name} colorways`}>
              {colorways.map((cw, i) => {
                const active = i === activeColor;
                return (
                  <button
                    key={cw.name}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={cw.name}
                    onClick={() => setActiveColor(i)}
                    className={[
                      'w-8 h-8 rounded-full border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]',
                      active
                        ? 'border-accent ring-2 ring-accent/40 ring-offset-2 ring-offset-[#060606] scale-110'
                        : 'border-white/15 hover:border-white/40',
                    ].join(' ')}
                    style={{ background: cw.swatch }}
                  />
                );
              })}
            </div>

            {/* Specs row */}
            <div className="flex items-center gap-4 mt-1 text-[11px] font-mono text-surface/30">
              {featured.specs.weight && <span>WT {featured.specs.weight}</span>}
              <span className="text-white/10">·</span>
              {featured.specs.drop && <span>DROP {featured.specs.drop}</span>}
              <span className="text-white/10">·</span>
              {featured.specs.cushioning && <span>{featured.specs.cushioning.toUpperCase()}</span>}
            </div>
          </div>
        </div>

        {/* ══ PANEL 3 · Promo / stats / social proof ═══════════ */}
        <div
          ref={rightRef}
          className="flex flex-col gap-3"
        >
          {/* Promo card — volt */}
          <div className="right-cell flex-1 flex flex-col justify-between p-7 rounded-[28px] bg-accent overflow-hidden relative min-h-[220px]">
            {/* big background number */}
            <span
              aria-hidden="true"
              className="absolute -right-4 -bottom-4 text-[180px] font-black leading-none text-ink/8 select-none pointer-events-none"
            >
              26
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/50">
              End of Season
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-bold text-ink/70 uppercase tracking-[0.06em]">Shop The</p>
              <p className="text-[52px] font-display font-black leading-none text-ink tracking-[-0.04em]">
                SS26
              </p>
              <p className="text-[14px] font-bold text-ink/70 uppercase tracking-[0.06em]">Collection</p>
            </div>
            <a
              href="/voltrace/#/shop"
              className="inline-flex self-start items-center gap-2 mt-2 h-10 px-5 rounded-full bg-ink text-accent text-[12px] font-black uppercase tracking-[0.08em] hover:bg-surface-alt transition-all duration-150"
            >
              Explore →
            </a>
          </div>

          {/* Stat cards row */}
          <div className="right-cell grid grid-cols-2 gap-3">
            <div className="flex flex-col justify-between p-5 rounded-[22px] bg-white/4 border border-white/8 min-h-[120px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-surface/30">Rating</span>
              <div>
                <p className="text-[36px] font-display font-black text-accent leading-none">4.7</p>
                <p className="text-[11px] text-surface/40 mt-1">Avg across catalog</p>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 rounded-[22px] bg-white/4 border border-white/8 min-h-[120px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-surface/30">Lines</span>
              <div>
                <p className="text-[36px] font-display font-black text-surface leading-none">4</p>
                <p className="text-[11px] text-surface/40 mt-1">Run · Trail · Train · Life</p>
              </div>
            </div>
          </div>

          {/* Tech highlight card */}
          <div className="right-cell flex items-center gap-4 p-5 rounded-[22px] bg-white/4 border border-white/8">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#CFFF04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-surface">Carbon Plate Tech</p>
              <p className="text-[11px] text-surface/40 mt-0.5">Full-length propulsion plate — race-ready at any pace</p>
            </div>
          </div>

          {/* GORE-TEX highlight card */}
          <div className="right-cell flex items-center gap-4 p-5 rounded-[22px] bg-white/4 border border-white/8">
            <div className="w-10 h-10 rounded-full bg-surface/8 border border-white/12 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface/70">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-surface">GORE-TEX Waterproof</p>
              <p className="text-[11px] text-surface/40 mt-0.5">Trail-proof membrane — wet rock, dry feet, every time</p>
            </div>
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
  useReveal(headRef, { y: 30, duration: 0.7, stagger: 0.08, start: '0px 0px -10% 0px' });
  useReveal(gridRef, { selector: '.card, article', y: 60, duration: 0.9, stagger: 0.08, start: '0px 0px -10% 0px' });

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
   Bento — redesigned dark editorial grid
   ============================================================ */
function Bento() {
  const headRef = useRef(null);
  const gridRef = useRef(null);
  useReveal(headRef, { y: 24, duration: 0.7, stagger: 0.08, start: '0px 0px -10% 0px' });
  useReveal(gridRef, { selector: '.bento-cell', y: 48, duration: 0.85, stagger: 0.09, start: '0px 0px -10% 0px' });

  return (
    <section className="py-28 bg-[#060606] relative overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(ellipse at center, #CFFF0412 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-[1440px] px-6">
        {/* Section header */}
        <header className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6" ref={headRef}>
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-accent/70 mb-4">
              <span className="w-5 h-px bg-accent/50 inline-block" />
              Engineered by line
            </span>
            <h2 className="text-[clamp(36px,5.5vw,76px)] font-display font-black leading-[0.92] tracking-[-0.03em] text-surface max-w-[18ch]">
              Three lines.<br />
              <span className="text-accent">Three jobs.</span><br />
              Zero compromise.
            </h2>
          </div>
          <p className="text-[14px] text-surface/35 max-w-[30ch] leading-relaxed md:text-right">
            Every Voltrace line is purpose-built — designed from the ground up for a specific kind of athlete.
          </p>
        </header>

        {/* Bento grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 grid-rows-auto gap-4"
          ref={gridRef}
        >
          {/* ── 01 RUNNING · large hero card ── */}
          <article
            className="bento-cell lg:col-span-7 relative flex flex-col justify-between p-8 md:p-10 rounded-[28px] overflow-hidden min-h-[380px] bg-[#0e0e0e] border border-white/6 group"
            data-cursor="hover"
          >
            {/* Top accent line */}
            <div aria-hidden="true" className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            {/* Floating shoe watermark */}
            <div className="absolute right-0 bottom-0 w-[55%] opacity-[0.15] group-hover:opacity-[0.22] transition-opacity duration-500 pointer-events-none scale-x-[-1]">
              <ShoeSVG primary="#CFFF04" secondary="#1a1a1a" accent="#ffffff" />
            </div>

            {/* Glowing tag */}
            <div className="flex items-center justify-between relative z-10">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-accent/80">
                <span className="w-5 h-5 rounded-full bg-accent/12 border border-accent/30 flex items-center justify-center text-[8px] font-black text-accent">01</span>
                Running
              </span>
              <span className="text-[11px] font-mono text-surface/20 uppercase tracking-[0.12em]">SS26</span>
            </div>

            {/* Main content */}
            <div className="relative z-10 mt-auto">
              <h3 className="text-[clamp(28px,4vw,46px)] font-display font-black leading-[0.95] tracking-[-0.03em] text-surface mb-3">
                Daily miles,<br />dialed in.
              </h3>
              <p className="text-[13px] text-surface/40 max-w-[34ch] leading-relaxed mb-6">
                Dual-density foam midsole and 4mm forefoot rocker for a smooth heel-to-toe transition.
              </p>

              {/* Specs bar */}
              <div className="flex items-stretch gap-0 divide-x divide-white/8">
                {[
                  { label: 'Drop', value: '8mm' },
                  { label: 'Weight', value: '225g' },
                  { label: 'Plate', value: 'Carbon' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5 px-5 first:pl-0">
                    <span className="text-[9px] font-mono text-surface/30 uppercase tracking-[0.1em]">{label}</span>
                    <strong className="text-[15px] font-black text-accent leading-tight">{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* ── 02 TRAIL ── */}
          <article
            className="bento-cell lg:col-span-5 relative flex flex-col justify-between p-8 rounded-[28px] overflow-hidden min-h-[380px] bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-white/6 group"
            data-cursor="hover"
          >
            {/* Faint grid pattern */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-surface/50">
                <span className="w-5 h-5 rounded-full bg-white/6 border border-white/12 flex items-center justify-center text-[8px] font-black text-surface/60">02</span>
                Trail
              </span>
              {/* Gore-Tex badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/12 bg-white/5 text-[9px] font-black uppercase tracking-[0.12em] text-surface/50">
                <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-70"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Gore-Tex
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-[clamp(28px,3.5vw,40px)] font-display font-black leading-[0.95] tracking-[-0.03em] text-surface mb-4">
                Wet rock,<br />dry feet.
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-surface/30 uppercase tracking-[0.1em]">Shield</span>
                  <strong className="text-[14px] font-black text-surface">GORE-TEX</strong>
                </div>
                <div className="flex flex-col gap-0.5 border-l border-white/8 pl-4">
                  <span className="text-[9px] font-mono text-surface/30 uppercase tracking-[0.1em]">Lugs</span>
                  <strong className="text-[14px] font-black text-accent">4mm</strong>
                </div>
              </div>
            </div>
          </article>

          {/* ── 03 COUNTER card ── */}
          <article
            className="bento-cell lg:col-span-3 relative flex flex-col justify-end p-8 rounded-[28px] overflow-hidden bg-accent min-h-[220px] group"
            data-cursor="hover"
          >
            {/* Big decorative number in background */}
            <span
              aria-hidden="true"
              className="absolute -right-3 -top-6 text-[140px] font-black leading-none text-ink/8 select-none pointer-events-none"
            >
              4
            </span>
            <Counter
              from={0} to={4} decimals={0} duration={1.6}
              className="relative z-10 text-[72px] font-display font-black leading-none text-ink"
              suffix="mm"
            />
            <span className="relative z-10 text-[12px] font-bold text-ink/60 uppercase tracking-[0.08em] mt-1">Aggressive Trail Lugs</span>
          </article>

          {/* ── 04 TRAINING ── */}
          <article
            className="bento-cell lg:col-span-5 relative flex flex-col justify-between p-8 rounded-[28px] overflow-hidden min-h-[220px] bg-white/[0.035] border border-white/8 group"
            data-cursor="hover"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-surface/40">
              <span className="w-5 h-5 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-[8px] font-black text-surface/40">03</span>
              Training
            </span>
            <div>
              <h3 className="text-[clamp(20px,2.5vw,28px)] font-display font-black leading-tight tracking-tight text-surface mb-3">
                Stable under load.
              </h3>
              <p className="text-[12px] text-surface/35 leading-relaxed mb-4">Flat 4mm-drop platform with TPU-reinforced sidewall.</p>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-surface/30 uppercase tracking-[0.1em]">Platform</span>
                  <strong className="text-[13px] font-black text-accent">4mm Drop</strong>
                </div>
                <div className="flex flex-col gap-0.5 border-l border-white/8 pl-4">
                  <span className="text-[9px] font-mono text-surface/30 uppercase tracking-[0.1em]">Weight</span>
                  <strong className="text-[13px] font-black text-accent">285g</strong>
                </div>
              </div>
            </div>
          </article>

          {/* ── 05 LIFESTYLE ── */}
          <article
            className="bento-cell lg:col-span-4 relative flex flex-col justify-between p-8 rounded-[28px] overflow-hidden min-h-[220px] bg-[#111] border border-white/6 group"
            data-cursor="hover"
          >
            {/* Subtle diagonal stripe */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.06]"
              style={{ background: 'conic-gradient(from 45deg, #CFFF04, transparent 50%)' }}
            />
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-surface/40">
              <span className="w-5 h-5 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-[8px] font-black text-surface/40">04</span>
              Lifestyle
            </span>
            <div className="relative z-10">
              <h3 className="text-[clamp(20px,2.5vw,26px)] font-display font-black leading-tight tracking-tight text-surface mb-3">
                Engineered off<br />the clock.
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-surface/30 uppercase tracking-[0.1em]">Material</span>
                  <strong className="text-[13px] font-black text-accent">Suede</strong>
                </div>
                <div className="flex flex-col gap-0.5 border-l border-white/8 pl-4">
                  <span className="text-[9px] font-mono text-surface/30 uppercase tracking-[0.1em]">Outsole</span>
                  <strong className="text-[13px] font-black text-accent">Gum Rubber</strong>
                </div>
              </div>
            </div>
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
  useReveal(ref, { y: 24, duration: 0.7, stagger: 0.08, start: '0px 0px -10% 0px' });

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
  useReveal(ref, { selector: '.closing-eyebrow, .closing-sub', y: 24, duration: 0.7, stagger: 0.08, start: '0px 0px -10% 0px' });
  useReveal(ref, { selector: '.closing-ctas > *', y: 20, duration: 0.7, delay: 0.6, stagger: 0.1, start: '0px 0px -10% 0px' });

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
    <PageEnter as="main" className="pt-[65px]">
      <Hero heroProduct={heroProduct} />
      <MarqueeStrip />
      <FeaturedCollection featured={featured} loading={loading} />
      <Bento />
      <Proof loading={loading} average={average} total={total} />
      <Closing />
    </PageEnter>
  );
}
