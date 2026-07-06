import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';

/**
 * CrossSell — related products section (Tailwind CSS v4).
 */
export default function CrossSell({ related = [] }) {
  if (related.length === 0) return null;

  return (
    <section className="py-20 bg-surface" aria-labelledby="cross-h">
      <div className="mx-auto max-w-[1440px] px-6">
        {/* Header */}
        <header className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">
              You may also like
            </span>
            <h2
              id="cross-h"
              className="text-[clamp(28px,3.5vw,48px)] font-display font-black leading-tight tracking-tight text-ink"
            >
              Complete the kit.
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-[13px] font-bold text-ink-muted hover:text-ink transition-colors duration-150 flex-shrink-0 mb-1"
          >
            Shop all →
          </Link>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {related.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group flex flex-col rounded-[16px] overflow-hidden bg-surface-alt hover:shadow-md transition-shadow duration-200 no-underline"
            >
              <div className="aspect-square bg-surface-alt flex items-center justify-center p-4 overflow-hidden">
                <div className="transition-transform duration-200 group-hover:scale-105 w-full h-full">
                  <ProductImage
                    src={p.images[0].src}
                    alt={p.name}
                    primary={p.images[0].primary}
                  />
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                  {p.line}
                </span>
                <p className="text-[14px] font-bold text-ink leading-snug">{p.name}</p>
                <p className="text-[15px] font-black text-ink">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
