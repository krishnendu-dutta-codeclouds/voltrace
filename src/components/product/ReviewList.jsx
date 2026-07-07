import Stars from '../ui/Stars';

/**
 * ReviewList — editorial dark-theme review section (Tailwind CSS v4).
 * Inspired by Tracksmith / On Running aesthetics.
 */

/* ── Rating breakdown helper ─────────────────────────────────────── */
function breakdown(reviews) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const k = Math.round(r.rating);
    if (k >= 1 && k <= 5) counts[k]++;
  });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    pct: Math.round((counts[star] / total) * 100),
  }));
}

/* ── Quote mark SVG ──────────────────────────────────────────────── */
function QuoteMark() {
  return (
    <svg
      viewBox="0 0 32 24"
      width="28"
      height="21"
      fill="currentColor"
      className="text-accent/40 flex-shrink-0"
      aria-hidden="true"
    >
      <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 3.2C10.133 4.533 7.2 7.467 6.4 12H12V24H0Zm20 0V14.4C20 6.4 24.8 1.6 34.4 0L36 3.2C30.133 4.533 27.2 7.467 26.4 12H32V24H20Z" />
    </svg>
  );
}

export default function ReviewList({ reviews = [], rating, reviewCount }) {
  const bars = breakdown(reviews);

  return (
    <section
      className="py-24 bg-ink text-surface"
      aria-labelledby="reviews-h"
    >
      <div className="mx-auto max-w-[1440px] px-6">

        {/* ── Header row ──────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-12 mb-16 pb-12 border-b border-white/10">

          {/* Left — big rating */}
          <div className="flex-shrink-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-surface/50 mb-4">
              Customer reviews
            </span>
            <h2
              id="reviews-h"
              className="text-[clamp(40px,6vw,72px)] font-display font-black leading-[0.9] tracking-[-0.03em] text-surface mb-6"
            >
              Loved by<br />
              <em className="text-accent not-italic">runners.</em>
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-[80px] font-display font-black leading-none text-accent tabular-nums">
                {rating?.toFixed(1) ?? '—'}
              </span>
              <div className="flex flex-col gap-1.5">
                <Stars rating={rating} reviewCount={reviewCount} size={20} />
                <p className="text-[12px] text-surface/50 font-medium">
                  {reviewCount} verified reviews
                </p>
              </div>
            </div>
          </div>

          {/* Right — breakdown bars */}
          <div className="flex-1 max-w-[360px] flex flex-col gap-2.5">
            {bars.map(({ star, pct, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-surface/60 w-4 text-right flex-shrink-0">
                  {star}
                </span>
                <svg viewBox="0 0 12 12" width="11" height="11" fill="#CFFF04" className="flex-shrink-0" aria-hidden="true">
                  <path d="M6 0l1.545 3.13 3.455.502-2.5 2.437.59 3.441L6 7.902 2.91 9.51l.59-3.441L1 3.632l3.455-.502z" />
                </svg>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-surface/40 w-6 text-right flex-shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Review cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="relative flex flex-col gap-4 rounded-[24px] bg-white/5 border border-white/8 p-6 hover:bg-white/8 hover:border-accent/30 transition-all duration-200 group"
            >
              {/* Quote decoration */}
              <QuoteMark />

              {/* Review text */}
              <p className="text-[15px] text-surface/80 leading-relaxed flex-1 italic">
                "{r.text}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/8">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-surface">{r.author}</span>
                  <Stars rating={r.rating} size={12} />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4ADE80] bg-[#4ADE80]/10 px-2.5 py-1 rounded-full">
                  <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                  Verified
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
