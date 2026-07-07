import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import ProductCard from '../components/product/ProductCard';
import CardSkeleton from '../components/ui/CardSkeleton';
import { useProducts } from '../hooks/useProducts';
import {
  LINES, SIZES, WIDTHS, SORT_OPTIONS,
  filterProducts, sortProducts,
} from '../utils/filters';
import { Split, Reveal, PageEnter, useReveal, Magnetic } from '../anim/primitives';

function parseListParam(v) { if (!v) return []; return v.split(',').filter(Boolean); }

function buildSearchParams(state) {
  const sp = new URLSearchParams();
  if (state.lines.length) sp.set('line', state.lines.join(','));
  if (state.sizes.length) sp.set('size', state.sizes.join(','));
  if (state.widths.length) sp.set('width', state.widths.join(','));
  if (state.colorways.length) sp.set('color', state.colorways.join(','));
  if (state.minPrice) sp.set('minPrice', String(state.minPrice));
  if (state.maxPrice) sp.set('maxPrice', String(state.maxPrice));
  if (state.sort && state.sort !== 'featured') sp.set('sort', state.sort);
  return sp;
}

/* ── Sidebar section wrapper ──────────────────────────────────── */
function FilterSection({ label, count, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-surface/40">{label}</span>
        {count != null && (
          <span className="text-[10px] font-semibold text-surface/25 tabular-nums">{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Shop() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [filters, setFilters] = useState(() => ({
    lines: parseListParam(searchParams.get('line')),
    sizes: parseListParam(searchParams.get('size')).map(Number).filter(Boolean),
    widths: parseListParam(searchParams.get('width')),
    colorways: parseListParam(searchParams.get('color')),
    minPrice: Number(searchParams.get('minPrice')) || '',
    maxPrice: Number(searchParams.get('maxPrice')) || '',
    sort: searchParams.get('sort') || 'featured',
  }));

  const headRef = useRef(null);
  const gridRef = useRef(null);

  useReveal(headRef, { y: 30, duration: 0.7, stagger: 0.08, start: '0px 0px -10% 0px' });
  useReveal(gridRef, { selector: 'article', y: 50, duration: 0.7, stagger: 0.06, start: '0px 0px -10% 0px' });

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const sp = buildSearchParams(filters);
    if (sp.toString() !== searchParams.toString()) setSearchParams(sp, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const visible = useMemo(() => sortProducts(
    filterProducts(products, {
      lines: filters.lines,
      sizes: filters.sizes,
      widths: filters.widths,
      colorways: filters.colorways,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
    }),
    filters.sort
  ), [products, filters]);

  const allColorways = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.colorways.forEach((c) => set.add(c.name)));
    return Array.from(set);
  }, [products]);

  const toggleIn = (key, value) => setFilters((f) => {
    const arr = f[key];
    return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
  });
  const setField = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clearAll = () => setFilters({ lines: [], sizes: [], widths: [], colorways: [], minPrice: '', maxPrice: '', sort: 'featured' });

  const activeChips = [
    ...filters.lines.map((v) => ({ key: 'lines', value: v, label: `Line: ${v}` })),
    ...filters.sizes.map((v) => ({ key: 'sizes', value: v, label: `Size: ${v}` })),
    ...filters.widths.map((v) => ({ key: 'widths', value: v, label: `Width: ${v}` })),
    ...filters.colorways.map((v) => ({ key: 'colorways', value: v, label: `Color: ${v}` })),
    ...(filters.minPrice ? [{ key: 'minPrice', value: filters.minPrice, label: `Min: $${filters.minPrice}` }] : []),
    ...(filters.maxPrice ? [{ key: 'maxPrice', value: filters.maxPrice, label: `Max: $${filters.maxPrice}` }] : []),
  ];

  const filterGroupCount = activeChips.length;

  /* Chip base for sidebar — Line / Width */
  const sideChip = (active) => [
    'inline-flex items-center justify-center h-9 px-4 rounded-full text-[12px] font-semibold border transition-all duration-150 cursor-pointer select-none',
    active
      ? 'bg-accent text-ink border-accent shadow-[0_0_18px_rgba(207,255,4,0.55)] scale-[1.04]'
      : 'bg-accent/8 text-accent/80 border-accent/25 hover:bg-accent/15 hover:border-accent/60 hover:text-accent',
  ].join(' ');

  /* Size chip — square grid tile */
  const sizeChip = (active) => [
    'w-[52px] h-9 rounded-[10px] text-[12px] font-bold border transition-all duration-150 cursor-pointer select-none flex items-center justify-center',
    active
      ? 'bg-accent text-ink border-accent shadow-[0_0_18px_rgba(207,255,4,0.55)] scale-[1.06]'
      : 'bg-accent/8 text-accent/70 border-accent/20 hover:bg-accent/18 hover:border-accent/55 hover:text-accent',
  ].join(' ');

  return (
    <PageEnter as="main" className="min-h-screen bg-[#0A0A0A] text-surface">

      {/* ── Ambient top glow ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 h-[500px] opacity-[0.04]"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, #CFFF04, transparent)' }}
      />

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-[1440px] px-6 pt-28 pb-10" ref={headRef}>
        <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-accent/70 mb-5">
          Voltrace · {products.length} SKUs · 4 lines
        </span>
        <h1 className="font-display font-black text-[clamp(52px,7vw,96px)] leading-[1.0] tracking-[-0.04em] text-surface">
          <Split as="span" className="block">Shop the </Split>
          <Split as="span" className="block text-accent italic">collection</Split>
          <Split as="span" className="block">.</Split>
        </h1>
        <p className="text-[15px] text-surface/40 mt-5 max-w-[36ch] font-medium">
          {loading
            ? 'Loading catalog…'
            : `${visible.length} ${visible.length === 1 ? 'shoe' : 'shoes'} engineered for the work you're actually doing.`}
        </p>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 pb-28 flex gap-8">

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside
          className={[
            'w-[240px] flex-shrink-0',
            'fixed inset-0 z-40 overflow-y-auto p-6 lg:static lg:p-0 lg:overflow-visible',
            'bg-[#111] lg:bg-transparent',
            drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            'transition-transform duration-200',
          ].join(' ')}
          aria-label="Filters"
        >
          {/* Drawer header (mobile) */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <h2 className="text-[16px] font-bold text-surface">Filters</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-surface/60 hover:text-surface"
              aria-label="Close filters"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Sticky filter panel */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-7">

            {/* Line */}
            <FilterSection label="Line" count={LINES.length}>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Line filter">
                {LINES.map((line) => (
                  <button
                    key={line}
                    type="button"
                    onClick={() => toggleIn('lines', line)}
                    className={sideChip(filters.lines.includes(line))}
                    aria-pressed={filters.lines.includes(line)}
                  >
                    {line}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Price */}
            <FilterSection label="Price (USD)">
              <div className="flex items-center gap-2">
                <input
                  type="number" inputMode="numeric" min={0} max={250} placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setField('minPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  aria-label="Minimum price"
                  className="w-full h-9 px-3 rounded-[10px] border border-white/10 bg-white/5 text-[12px] text-surface placeholder:text-surface/25 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all duration-150"
                />
                <span className="text-surface/30 text-[12px] font-bold flex-shrink-0">—</span>
                <input
                  type="number" inputMode="numeric" min={0} max={250} placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setField('maxPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  aria-label="Maximum price"
                  className="w-full h-9 px-3 rounded-[10px] border border-white/10 bg-white/5 text-[12px] text-surface placeholder:text-surface/25 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all duration-150"
                />
              </div>
            </FilterSection>

            {/* Sizes */}
            <FilterSection label="Size (US)" count={SIZES.length}>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Size filter">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleIn('sizes', s)}
                    className={sizeChip(filters.sizes.includes(s))}
                    aria-pressed={filters.sizes.includes(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Width */}
            <FilterSection label="Width">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Width filter">
                {WIDTHS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleIn('widths', w)}
                    className={sideChip(filters.widths.includes(w))}
                    aria-pressed={filters.widths.includes(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Colorway */}
            {allColorways.length > 0 && (
              <FilterSection label="Colorway" count={allColorways.length}>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Colorway filter">
                  {allColorways.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleIn('colorways', c)}
                      className={[
                        'inline-flex items-center h-8 px-3 rounded-full text-[11px] font-semibold border transition-all duration-150 cursor-pointer',
                        filters.colorways.includes(c)
                          ? 'bg-accent text-ink border-accent shadow-[0_0_16px_rgba(207,255,4,0.5)] scale-[1.05]'
                          : 'bg-accent/8 text-accent/75 border-accent/22 hover:bg-accent/15 hover:border-accent/55 hover:text-accent',
                      ].join(' ')}
                      aria-pressed={filters.colorways.includes(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Clear */}
            {filterGroupCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center justify-center h-9 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-[0.1em] text-surface/40 hover:border-accent/50 hover:text-accent transition-all duration-150"
              >
                Clear all filters
              </button>
            )}

          </div>
        </aside>

        {/* Mobile overlay */}
        {drawerOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setDrawerOpen(false)} />
        )}

        {/* ── Main content ───────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setDrawerOpen((v) => !v)}
                aria-expanded={drawerOpen}
                className="lg:hidden inline-flex items-center gap-2 h-9 px-4 rounded-full border border-white/12 bg-white/5 text-[12px] font-semibold text-surface/60 hover:border-accent/50 hover:text-surface transition-all duration-150"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                </svg>
                Filters{filterGroupCount ? ` (${filterGroupCount})` : ''}
              </button>

              {/* Active chips */}
              {activeChips.length === 0 ? (
                <span className="text-[13px] text-surface/40 font-medium">
                  <strong className="text-surface font-bold">All</strong> shoes
                </span>
              ) : (
                <>
                  <span className="text-[13px] text-surface/40 font-medium">
                    <strong className="text-surface font-bold">{visible.length}</strong>{' '}
                    result{visible.length === 1 ? '' : 's'}
                  </span>
                  {activeChips.map((chip) => (
                    <button
                      key={`${chip.key}-${chip.value}`}
                      type="button"
                      onClick={() => {
                        if (['minPrice', 'maxPrice'].includes(chip.key)) setField(chip.key, '');
                        else toggleIn(chip.key, chip.value);
                      }}
                      className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-semibold hover:bg-accent/25 transition-all duration-150"
                    >
                      {chip.label}
                      <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" width="8" height="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-surface/30">Sort</span>
              <select
                value={filters.sort}
                onChange={(e) => setField('sort', e.target.value)}
                aria-label="Sort products"
                className="h-9 px-3 pr-8 rounded-full border border-white/12 bg-white/5 text-surface text-[12px] font-semibold focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-150 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {(loading || isPageLoading) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : visible.length === 0 ? (
            <Reveal as="div" y={20} duration={0.7} className="flex flex-col items-center gap-5 py-32 text-center" role="status">
              <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-2">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-surface/30"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
              <h3 className="text-[clamp(22px,3vw,36px)] font-display font-black text-surface">No shoes match those filters.</h3>
              <p className="text-[15px] text-surface/40">Try widening your size range or price.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-2 inline-flex h-11 items-center px-6 rounded-full bg-accent text-ink text-[13px] font-bold uppercase tracking-[0.08em] hover:bg-white transition-colors duration-150"
              >
                Clear filters
              </button>
            </Reveal>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              ref={gridRef}
              key={`${filters.lines.join(',')}|${filters.sizes.join(',')}|${filters.colorways.join(',')}|${filters.sort}`}
            >
              {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </PageEnter>
  );
}
