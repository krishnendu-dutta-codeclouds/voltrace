import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import LinkButton from '../components/ui/LinkButton';
import { Split, PageEnter, useReveal, Magnetic } from '../anim/primitives';
import { useRef } from 'react';

/**
 * Wishlist Page (Tailwind CSS v4)
 */
export default function Wishlist() {
  const { wishlist, count } = useWishlist();
  const headRef = useRef(null);

  useReveal(headRef, { y: 30, duration: 0.7, start: 'top 90%' });

  return (
    <PageEnter as="main" className="pt-[72px] min-h-screen bg-surface">
      {/* Header */}
      <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-8" ref={headRef}>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-4">Your choices</span>
        <h1 className="font-display font-black text-[clamp(40px,6vw,88px)] leading-[0.92] tracking-[-0.04em] text-ink">
          <Split as="span" className="block">{count} {count === 1 ? 'pair' : 'pairs'} in your</Split>
          <Split as="span" className="block italic">wishlist</Split>
          <Split as="span" className="block">.</Split>
        </h1>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 pb-24">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center" role="status">
            <svg
              className="text-ink-soft"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="text-[clamp(24px,3vw,40px)] font-display font-black text-ink">Your wishlist is empty.</h2>
            <p className="text-[16px] text-ink-muted">Explore our collection to save your favorite styles.</p>
            <Magnetic>
              <LinkButton to="/shop" variant="primary" data-cursor="hover">Browse the Shop</LinkButton>
            </Magnetic>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageEnter>
  );
}
