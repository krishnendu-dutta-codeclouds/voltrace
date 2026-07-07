/**
 * ShoeSVG — Voltrace Banana Edition.
 * Renders the high-quality banana running shoe image.
 */
export default function ShoeSVG({
  primary = '#0B0B0F',
  secondary = '#D6FF3A',
  accent = '#FFFFFF',
  angle = 0,
  size = '100%',
}) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const isBlack = primary.toLowerCase() === '#1a1a1a' || primary.toLowerCase() === '#0a0a0a' || primary.toLowerCase() === '#0b0b0f';
  const assetSrc = baseUrl.replace(/\/$/, '') + (isBlack ? '/images/banana_shoe_black.png' : '/images/banana_shoe.png');

  return (
    <img
      src={assetSrc}
      alt="Voltrace Banana Edition"
      style={{
        width: size,
        height: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        display: 'block',
        margin: '0 auto',
        transform: angle === 1 ? 'scaleX(-1) rotate(-3deg)' : 'none',
        transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    />
  );
}
