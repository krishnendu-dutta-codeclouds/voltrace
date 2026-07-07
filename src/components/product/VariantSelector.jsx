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
        <div className="flex flex-wrap items-center gap-3" role="radiogroup" aria-label="Colorway">
          {product.colorways.map((c) => (
            <Swatch
              key={c.name}
              color={c.swatch}
              label={c.name}
              selected={colorway === c.name}
              onClick={(e) => onColorway(c.name, e)}
              size={44}
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
            const buttonStyle = selected
              ? { backgroundColor: '#0A0A0A', color: '#FFFFFF', borderColor: '#CFFF04' }
              : s.inStock
              ? { backgroundColor: '#F2F2F2', color: '#0A0A0A', borderColor: '#E1E1E1' }
              : { backgroundColor: 'rgba(242, 242, 242, 0.7)', color: '#9A9DA6', borderColor: '#E1E1E1' };
            return (
              <button
                key={s.size}
                type="button"
                className={[
                  'min-w-[60px] h-14 px-5 rounded-[18px] text-[14px] font-bold border-2 transition-all duration-200 ease-out select-none relative overflow-hidden flex items-center justify-center',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
                  selected
                    ? 'border-accent ring-2 ring-accent/20 shadow-[0_14px_48px_-28px_rgba(207,255,4,0.9)]'
                    : s.inStock
                    ? 'hover:border-accent hover:bg-accent/10'
                    : 'cursor-not-allowed opacity-60',
                ].join(' ')}
                style={buttonStyle}
                onClick={(e) => onSize(s.size, e)}
                disabled={!s.inStock}
                role="radio"
                aria-checked={selected}
                aria-disabled={!s.inStock || undefined}
                title={!s.inStock ? `Size ${s.size} — out of stock` : `Size ${s.size}`}
              >
                <span className="relative z-10">{s.size}</span>
                {!s.inStock && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                    <span className="w-[160%] h-[2px] bg-ink-soft/30 -rotate-45 transform" />
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
            {product.width.map((w) => {
              const selected = width === w;
              const widthStyle = selected
                ? { backgroundColor: '#0A0A0A', color: '#FFFFFF', borderColor: '#CFFF04' }
                : { backgroundColor: '#F2F2F2', color: '#0A0A0A', borderColor: '#E1E1E1' };
              return (
                <button
                  key={w}
                  type="button"
                  className={[
                    'relative h-12 px-6 rounded-[16px] text-[13px] font-bold border-2 transition-all duration-200 ease-out select-none flex items-center justify-center',
                    selected
                      ? 'shadow-[0_12px_40px_-24px_rgba(207,255,4,0.9)]'
                      : 'hover:border-accent hover:bg-accent/10',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
                  ].join(' ')}
                  style={widthStyle}
                  onClick={(e) => onWidth(w, e)}
                  role="radio"
                  aria-checked={selected}
                  title={`Width ${w}`}
                >
                  <span className={`relative z-10 ${selected ? 'pr-6' : ''}`}>{w}</span>
                  {selected && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 bg-accent text-ink rounded-full pointer-events-none" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
