import Stars from '../ui/Stars';

/**
 * ReviewList — customer review section (Tailwind CSS v4).
 */
export default function ReviewList({ reviews = [], rating, reviewCount }) {
  return (
    <section className="py-20 bg-surface-alt" aria-labelledby="reviews-h">
      <div className="mx-auto max-w-[1440px] px-6">
        {/* Header */}
        <header className="mb-12">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">
            Customer reviews
          </span>
          <h2
            id="reviews-h"
            className="text-[clamp(32px,4vw,56px)] font-display font-black leading-tight tracking-tight text-ink mb-6"
          >
            Loved by runners.
          </h2>
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="text-[64px] font-display font-black leading-none text-ink">
              {rating?.toFixed(1) ?? '—'}
            </span>
            <div className="flex flex-col gap-1">
              <Stars rating={rating} reviewCount={reviewCount} size={18} />
              <p className="text-[12px] text-ink-muted font-medium mt-1">
                {reviewCount} verified reviews
              </p>
            </div>
          </div>
        </header>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="bg-surface-pure rounded-[20px] p-6 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-ink">{r.author}</span>
                <span className="text-[11px] font-semibold text-[#16703A] bg-[#16703A]/10 px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              </div>
              <Stars rating={r.rating} size={14} />
              <p className="text-[14px] text-ink-muted leading-relaxed">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
