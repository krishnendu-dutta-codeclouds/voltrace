import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Stars from '../ui/Stars';
import Swatch from '../ui/Swatch';
import ProductImage from './ProductImage';
import { getInStockCount } from '../../utils/filters';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * ProductCard — PLP grid card (Tailwind CSS v4).
 * Real product photos with object-cover.
 * 3D tilt on hover via Framer Motion springs.
 */
export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const [activeColor, setActiveColor] = useState(product.colorways[0].name);

  // Find image for active colorway
  const currentImage =
    product.images.find((i) => i.colorway === activeColor) ?? product.images[0];
  const altImage = product.images[1] ?? product.images[0];

  const inStock = getInStockCount(product);
  const totalSizes = product.sizes.length;
  const lowStock = inStock > 0 && inStock <= 4;

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);

  const onMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const stockLabel =
    inStock === 0
      ? 'Sold out'
      : lowStock
      ? `Only ${inStock} sizes left`
      : `${inStock}/${totalSizes} in stock`;
  const stockColor =
    inStock === 0 ? 'text-[#C81E1E]' : lowStock ? 'text-[#b45309]' : 'text-[#6B6F7A]';

  return (
    <motion.article
      ref={cardRef}
      className="group flex flex-col bg-[#FFFFFF] rounded-[20px] overflow-hidden shadow-[0_1px_2px_rgba(11,11,15,0.04)] hover:shadow-[0_8px_24px_rgba(11,11,15,0.08)] transition-shadow duration-200 cursor-pointer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
    >
      {/* Media area */}
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden bg-[#F1F0EA] aspect-[4/3]"
        aria-label={`${product.name} — view details`}
        data-cursor="hover"
      >
        {/* Primary photo */}
        <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
          <ProductImage
            src={currentImage.src}
            alt={`${product.name} — ${currentImage.colorway}`}
            primary={currentImage.primary}
            eager
          />
        </div>

        {/* Alt photo on hover */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ProductImage
            src={altImage.src}
            alt={`${product.name} — ${altImage.colorway} angle`}
            primary={altImage.primary}
          />
        </div>

        {/* Line badge */}
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-[#0B0B0F]/80 text-[#FAFAF7] text-[10px] font-semibold uppercase tracking-[0.06em] backdrop-blur-sm">
          {product.line}
        </span>

        {/* Quick-action overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 h-8 flex items-center justify-center rounded-full bg-ink text-accent text-[11px] font-bold uppercase tracking-[0.06em] hover:bg-accent hover:text-ink transition-all duration-150"
            data-cursor="hover"
            onClick={(e) => e.stopPropagation()}
          >
            View product
          </Link>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAFAF7]/90 backdrop-blur-sm text-[#0B0B0F] hover:bg-[#D6FF3A] transition-all duration-150"
            aria-label="Save to wishlist"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            data-cursor="hover"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold text-[#0B0B0F] leading-tight">
            <Link
              to={`/product/${product.id}`}
              className="hover:text-[#6B6F7A] transition-colors duration-150 no-underline"
            >
              {product.name}
            </Link>
          </h3>
          <span className="text-[16px] font-black text-[#0B0B0F] flex-shrink-0">${product.price}</span>
        </div>

        <Stars rating={product.rating} reviewCount={product.reviewCount} size={13} />

        {/* Colorway swatches */}
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Colorways">
          {product.colorways.slice(0, 4).map((c) => (
            <Swatch
              key={c.name}
              color={c.swatch}
              label={`${c.name}${c.name === activeColor ? ' (selected)' : ''}`}
              selected={c.name === activeColor}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveColor(c.name);
              }}
              size={22}
            />
          ))}
          {product.colorways.length > 4 && (
            <span className="text-[11px] text-[#6B6F7A] font-medium">+{product.colorways.length - 4}</span>
          )}
        </div>

        {/* Stock status */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className={`text-[11px] font-semibold ${stockColor}`}>{stockLabel}</span>
          {product.tagline && (
            <span className="text-[11px] text-[#9A9DA6] font-medium truncate max-w-[120px]">{product.tagline}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
