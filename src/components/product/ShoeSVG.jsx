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
  const assetSrc = baseUrl.replace(/\/$/, '') + '/images/banana_shoe.png';

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
