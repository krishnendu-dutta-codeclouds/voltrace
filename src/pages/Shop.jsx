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

export default function Shop() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  useReveal(headRef, { y: 30, duration: 0.7, stagger: 0.08, start: 'top 85%' });
  useReveal(gridRef, { selector: 'article', y: 50, duration: 0.7, stagger: 0.06, start: 'top 90%' });

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

  /* Shared filter group heading style */
  const filterHeading = 'text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted mb-3';
  const filterInputBase = 'w-full h-10 px-3 rounded-lg border border-border bg-surface-pure text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150 placeholder:text-ink-soft';

  return (
    <PageEnter as="main" className="pt-[72px] min-h-screen bg-surface">
      {/* Page header */}
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-8" ref={headRef}>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-4">Voltrace · 7 SKUs · 4 lines</span>
        <h1 className="font-display font-black text-[clamp(48px,7vw,100px)] leading-[0.9] tracking-[-0.04em] text-ink">
          <Split as="span" className="block">Shop the </Split>
          <Split as="span" className="block italic">collection</Split>
          <Split as="span" className="block">.</Split>
        </h1>
        <p className="text-[16px] text-ink-muted mt-4 max-w-[40ch]">
          {loading ? 'Loading catalog…' : `${visible.length} ${visible.length === 1 ? 'shoe' : 'shoes'} engineered for the work you're actually doing.`}
        </p>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 pb-24 flex gap-8">
        {/* Sidebar filters */}
        <aside
          className={[
            'w-[260px] flex-shrink-0 transition-all duration-200',
            'fixed inset-0 z-40 bg-surface-pure overflow-y-auto p-6 lg:static lg:p-0 lg:bg-transparent lg:overflow-visible',
            drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
          aria-label="Filters"
        >
          {/* Drawer header (mobile) */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-[18px] font-bold text-ink">Filters</h2>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)} className="text-2xl leading-none">×</Button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Line */}
            <div>
              <p className={filterHeading}>Line <span className="text-ink-muted normal-case tracking-normal font-normal">({LINES.length})</span></p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Line filter">
                {LINES.map((line) => (
                  <Chip key={line} active={filters.lines.includes(line)} onClick={() => toggleIn('lines', line)}>{line}</Chip>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className={filterHeading}>Price (USD)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number" inputMode="numeric" min={0} max={250} placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setField('minPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  aria-label="Minimum price"
                  className={filterInputBase}
                />
                <span className="text-ink-muted text-[12px] font-semibold">—</span>
                <input
                  type="number" inputMode="numeric" min={0} max={250} placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setField('maxPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  aria-label="Maximum price"
                  className={filterInputBase}
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className={filterHeading}>Size (US) <span className="text-ink-muted normal-case tracking-normal font-normal">({SIZES.length})</span></p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Size filter">
                {SIZES.map((s) => (
                  <Chip
                    key={s}
                    active={filters.sizes.includes(s)}
                    onClick={() => toggleIn('sizes', s)}
                    className="h-11 px-4 text-[13px] font-bold rounded-[10px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 group"
                  >
                    {s}
                    {filters.sizes.includes(s) && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-accent text-ink rounded-full" aria-hidden="true">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Width */}
            <div>
              <p className={filterHeading}>Width</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Width filter">
                {WIDTHS.map((w) => (
                  <Chip
                    key={w}
                    active={filters.widths.includes(w)}
                    onClick={() => toggleIn('widths', w)}
                    className="h-11 px-4 text-[13px] font-bold rounded-[10px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 group"
                  >
                    {w}
                    {filters.widths.includes(w) && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-accent text-ink rounded-full" aria-hidden="true">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Colorway */}
            {allColorways.length > 0 && (
              <div>
                <p className={filterHeading}>Colorway <span className="text-ink-muted normal-case tracking-normal font-normal">({allColorways.length})</span></p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Colorway filter">
                  {allColorways.map((c) => (
                    <Chip key={c} active={filters.colorways.includes(c)} onClick={() => toggleIn('colorways', c)}>{c}</Chip>
                  ))}
                </div>
              </div>
            )}

            <Button variant="secondary" onClick={clearAll} fullWidth>Clear all filters</Button>
          </div>
        </aside>

        {/* Overlay (mobile) */}
        {drawerOpen && (
          <div className="fixed inset-0 bg-ink/40 z-30 lg:hidden" onClick={() => setDrawerOpen(false)} />
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Magnetic>
                <Button
                  variant="secondary"
                  onClick={() => setDrawerOpen((v) => !v)}
                  aria-expanded={drawerOpen}
                  className="lg:hidden"
                  data-cursor="hover"
                >
                  {drawerOpen ? 'Close filters' : `Filters${filterGroupCount ? ` (${filterGroupCount})` : ''}`}
                </Button>
              </Magnetic>

              {activeChips.length === 0 ? (
                <span className="text-[14px] text-ink-muted"><strong className="text-ink">All</strong> shoes</span>
              ) : (
                <>
                  <span className="text-[14px] text-ink-muted"><strong className="text-ink">{visible.length}</strong> result{visible.length === 1 ? '' : 's'}</span>
                  {activeChips.map((chip) => (
                    <Chip
                      key={`${chip.key}-${chip.value}`}
                      active
                      onClick={() => {
                        if (['minPrice', 'maxPrice'].includes(chip.key)) setField(chip.key, '');
                        else toggleIn(chip.key, chip.value);
                      }}
                      onRemove={() => {
                        if (['minPrice', 'maxPrice'].includes(chip.key)) setField(chip.key, '');
                        else toggleIn(chip.key, chip.value);
                      }}
                    >
                      {chip.label}
                    </Chip>
                  ))}
                </>
              )}
            </div>

            <label className="flex items-center gap-2 text-[13px]">
              <span className="text-ink-muted font-medium">Sort</span>
              <select
                value={filters.sort}
                onChange={(e) => setField('sort', e.target.value)}
                aria-label="Sort products"
                className="h-9 px-3 rounded-lg border border-border bg-surface-pure text-ink text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : visible.length === 0 ? (
            <Reveal as="div" y={20} duration={0.7} className="flex flex-col items-center gap-4 py-24 text-center" role="status">
              <h3 className="text-[clamp(22px,3vw,36px)] font-display font-black text-ink">No shoes match those filters.</h3>
              <p className="text-[16px] text-ink-muted">Try widening your size range or price.</p>
              <Button variant="primary" onClick={clearAll}>Clear filters</Button>
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
