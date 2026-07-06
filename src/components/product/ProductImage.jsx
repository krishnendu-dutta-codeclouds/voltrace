/**
 * ProductImage — renders a real product photo using object-cover.
 * Falls back to the SVG shoe if no src is provided.
 *
 * Props:
 *   src      — the /images/products/*.png path from products.json
 *   alt      — descriptive alt text
 *   primary  — hex color for SVG fallback background
 *   className — extra classes applied to the img/wrapper
 *   eager    — if true, loads immediately (above-the-fold items)
 */
export default function ProductImage({
  src,
  alt = '',
  primary = '#E6E4DC',
  className = '',
  eager = false,
}) {
  if (!src) {
    // Graceful fallback: colored placeholder
    return (
      <div
        className={['w-full h-full flex items-center justify-center rounded-[inherit]', className].join(' ')}
        style={{ background: primary }}
        aria-label={alt || 'Product image'}
        role="img"
      />
    );
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedSrc = src.startsWith('/') ? `${baseUrl}${src.slice(1)}` : src;

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={['w-full h-full object-cover object-center', className].join(' ')}
      draggable={false}
    />
  );
}
