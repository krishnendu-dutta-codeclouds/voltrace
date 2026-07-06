import Chip from '../ui/Chip';
import Swatch from '../ui/Swatch';

/**
 * VariantSelector — colorway / size / width picker (Tailwind CSS v4).
 */
export default function VariantSelector({
  product,
  colorway,
  onColorway,
  size,
  onSize,
  width,
  onWidth,
}) {
  const oosSize = size && product.sizes.find((s) => s.size === size && !s.inStock);

  return (
    <div className="flex flex-col gap-6">
      {/* Colorway */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-ink uppercase tracking-[0.04em]">Colorway</span>
          <span className="text-[12px] text-ink-muted">{colorway || 'Select'}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap" role="radiogroup" aria-label="Colorway">
          {product.colorways.map((c) => (
            <Swatch
              key={c.name}
              color={c.swatch}
              label={c.name}
              selected={colorway === c.name}
              onClick={(e) => onColorway(c.name, e)}
              size={40}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-ink uppercase tracking-[0.04em]">
            Size <span className="text-ink-muted font-medium normal-case tracking-normal">US</span>
          </span>
          <button
            type="button"
            className="text-[12px] text-ink-muted font-semibold hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded"
          >
            Size guide
          </button>
        </div>
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Size">
          {product.sizes.map((s) => {
            const selected = size === s.size;
            return (
              <button
                key={s.size}
                type="button"
                className={[
                  'w-14 h-14 rounded-[12px] text-[15px] font-black border-2 transition-all duration-200 ease-out select-none relative overflow-hidden group',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
                  selected
                    ? 'bg-ink text-accent border-ink shadow-lg shadow-ink/30 scale-105 ring-2 ring-accent ring-offset-2'
                    : s.inStock
                    ? 'bg-surface-pure text-ink border-border hover:bg-ink hover:text-accent hover:border-ink hover:scale-105 hover:shadow-md hover:shadow-ink/20'
                    : 'bg-surface-alt/50 text-ink-soft/40 border-border cursor-not-allowed opacity-50',
                ].join(' ')}
                onClick={(e) => onSize(s.size, e)}
                disabled={!s.inStock}
                role="radio"
                aria-checked={selected}
                aria-disabled={!s.inStock || undefined}
                title={!s.inStock ? `Size ${s.size} — out of stock` : `Size ${s.size}`}
              >
                <span className="relative z-10 flex items-center justify-center w-full h-full">{s.size}</span>
                {!s.inStock && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                    <span className="w-[160%] h-[2px] bg-ink-soft/30 -rotate-45 transform" />
                  </span>
                )}
                {selected && s.inStock && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-accent text-ink rounded-full" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {oosSize && (
          <p className="text-[12px] text-[#b45309] font-medium" role="status">
            Size {oosSize.size} is out of stock. We restock weekly.
          </p>
        )}
      </div>

      {/* Width (Running/Trail only) */}
      {product.width && product.width.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-ink uppercase tracking-[0.04em]">Width</span>
            <span className="text-[12px] text-ink-muted">{width || 'Select'}</span>
          </div>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Width">
            {product.width.map((w) => (
              <Chip
                key={w}
                active={width === w}
                onClick={(e) => onWidth(w, e)}
                className="h-12 px-5 text-[13px] font-bold rounded-[10px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 group"
              >
                {w}
                {width === w && (
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
      )}
    </div>
  );
}
