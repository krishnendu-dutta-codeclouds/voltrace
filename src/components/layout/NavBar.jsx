import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function NavBar({ minimal = false }) {
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const location = useLocation();
  const onCheckout = location.pathname === '/checkout';
  const showMinimal = minimal || onCheckout;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-surface/80 backdrop-blur-xl border-b border-border-soft"
      role="banner"
    >
      <div className="mx-auto max-w-[1440px] px-6 h-full flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-black text-[15px] tracking-[0.08em] text-ink no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
          aria-label="Voltrace — Home"
        >
          <span aria-hidden="true" className="text-ink">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <path
                d="M3 24 L11 8 L17 20 L25 8"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
          </span>
          <span>VOLTRACE</span>
        </Link>

        {/* Primary nav links */}
        {!showMinimal && (
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {[
              { to: '/shop', label: 'Shop', end: true },
              { to: '/shop?line=Running', label: 'Running' },
              { to: '/shop?line=Trail', label: 'Trail' },
              { to: '/shop?line=Training', label: 'Training' },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'text-[13px] font-semibold tracking-[0.04em] transition-colors duration-150 relative py-1',
                    'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-accent after:transition-transform after:duration-200',
                    isActive
                      ? 'text-ink after:scale-x-100'
                      : 'text-ink-muted hover:text-ink after:scale-x-0 hover:after:scale-x-100',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {showMinimal ? (
            <Link
              to="/cart"
              className="text-[13px] font-semibold text-ink-muted hover:text-ink transition-colors duration-150"
            >
              ← Back to cart
            </Link>
          ) : (
            <>
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-surface-alt transition-colors duration-150 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? '' : 's'}`}
                data-cursor="hover"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-accent text-ink text-[10px] font-black px-1"
                    aria-hidden="true"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 h-11 px-4 rounded-full bg-ink text-accent text-[13px] font-bold tracking-[0.04em] hover:bg-accent hover:text-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 isolate"
                style={{ mixBlendMode: 'normal' }}
                aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
                data-cursor="hover"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="17" cy="20" r="1.5" />
                  <path d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L21 8H6" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span
                    className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-accent text-ink text-[10px] font-black px-1"
                    aria-hidden="true"
                  >
                    {count}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
