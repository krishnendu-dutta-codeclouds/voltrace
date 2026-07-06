/**
 * Stars — star rating display (Tailwind CSS v4).
 */
export default function Stars({ rating, reviewCount, size = 14 }) {
  const filled = Math.round(rating);
  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5${reviewCount ? `, ${reviewCount} reviews` : ''}`}
    >
      <span className="inline-flex" style={{ fontSize: size }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= filled ? 'text-accent' : 'text-ink-soft'}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </span>
      {reviewCount != null && (
        <span className="text-[11px] text-ink-muted font-medium">({reviewCount})</span>
      )}
    </span>
  );
}
