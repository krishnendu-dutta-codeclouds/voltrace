import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState, useRef, useEffect, useMemo } from 'react';
import productsJson from '../../data/products.json';

/* ── Mega-menu data ────────────────────────────────────────────── */
const MEGA_MENU = [
  {
    id: 'shop',
    label: 'Shop All',
    to: '/shop',
    columns: [
      {
        heading: 'By Line',
        links: [
          { label: 'Running',   sub: 'Road & track',    to: '/shop?line=Running'   },
          { label: 'Trail',     sub: 'Off-road grip',   to: '/shop?line=Trail'     },
          { label: 'Training',  sub: 'Gym & cross-fit', to: '/shop?line=Training'  },
          { label: 'Lifestyle', sub: 'Street-ready',    to: '/shop?line=Lifestyle' },
        ],
      },
      {
        heading: 'By Price',
        links: [
          { label: 'Under $100',    to: '/shop?maxPrice=100'           },
          { label: '$100 – $150',   to: '/shop?minPrice=100&maxPrice=150' },
          { label: '$150 – $200',   to: '/shop?minPrice=150&maxPrice=200' },
          { label: 'Over $200',     to: '/shop?minPrice=200'           },
        ],
      },
      {
        heading: 'By Width',
        links: [
          { label: 'Standard fit', to: '/shop?width=Standard' },
          { label: 'Wide fit',     to: '/shop?width=Wide'     },
        ],
      },
    ],
    featured: {
      label: '🔥 New drop',
      title: 'Pulse Runner Pro',
      sub: 'Carbon plate · 225g · 8mm drop',
      to: '/product/pulse-runner-pro',
      badge: '$129',
    },
  },
  {
    id: 'running',
    label: 'Running',
    to: '/shop?line=Running',
    columns: [
      {
        heading: 'Road Running',
        links: [
          { label: 'Pulse Runner Pro',  sub: 'Race day beast',   to: '/product/pulse-runner-pro'  },
          { label: 'Voltstreak Elite',  sub: 'Daily trainer',    to: '/product/voltstreak-elite'  },
        ],
      },
      {
        heading: 'Features',
        links: [
          { label: 'Carbon Plate',       to: '/shop?line=Running' },
          { label: 'Lightweight (<230g)',to: '/shop?line=Running' },
          { label: 'Heel Drop 8mm',      to: '/shop?line=Running' },
          { label: 'GORE-TEX',           to: '/shop?line=Running' },
        ],
      },
      {
        heading: 'Guides',
        links: [
          { label: 'How to pick a running shoe', to: '/shop?line=Running' },
          { label: 'Size guide',                 to: '/shop?line=Running' },
          { label: 'Stack height explained',     to: '/shop?line=Running' },
        ],
      },
    ],
    featured: {
      label: '⚡ Best seller',
      title: 'Voltstreak Elite',
      sub: 'Responsive foam · 215g',
      to: '/product/voltstreak-elite',
      badge: '$145',
    },
  },
  {
    id: 'trail',
    label: 'Trail',
    to: '/shop?line=Trail',
    columns: [
      {
        heading: 'Trail Shoes',
        links: [
          { label: 'Terrex Volt X',   sub: 'Technical terrain', to: '/product/terrex-volt-x'   },
          { label: 'Ridgeback GTX',   sub: 'GORE-TEX warmth',   to: '/product/ridgeback-gtx'   },
        ],
      },
      {
        heading: 'Technology',
        links: [
          { label: 'GORE-TEX Lining',  to: '/shop?line=Trail' },
          { label: '4mm Lug Outsole',  to: '/shop?line=Trail' },
          { label: 'Rock Plate',       to: '/shop?line=Trail' },
        ],
      },
    ],
    featured: {
      label: '🏔 Trail pick',
      title: 'Terrex Volt X',
      sub: 'GORE-TEX · 4mm lugs',
      to: '/product/terrex-volt-x',
      badge: '$159',
    },
  },
  {
    id: 'training',
    label: 'Training',
    to: '/shop?line=Training',
    columns: [
      {
        heading: 'Training Shoes',
        links: [
          { label: 'StormFlex Pro',   sub: 'Lateral support',  to: '/product/stormflex-pro'   },
          { label: 'CoreLift Nano',   sub: 'Weightlifting',     to: '/product/corelift-nano'   },
        ],
      },
      {
        heading: 'Activity',
        links: [
          { label: 'Cross-training',  to: '/shop?line=Training' },
          { label: 'HIIT & bootcamp', to: '/shop?line=Training' },
          { label: 'Weightlifting',   to: '/shop?line=Training' },
        ],
      },
    ],
    featured: {
      label: '💪 Gym pick',
      title: 'StormFlex Pro',
      sub: '4mm platform · 285g',
      to: '/product/stormflex-pro',
      badge: '$119',
    },
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    to: '/shop?line=Lifestyle',
    columns: [
      {
        heading: 'Lifestyle Shoes',
        links: [
          { label: 'Nimbus Classic',  sub: 'Street heritage',  to: '/product/nimbus-classic'  },
        ],
      },
      {
        heading: 'Style',
        links: [
          { label: 'Monochrome',      to: '/shop?line=Lifestyle' },
          { label: 'Colourblock',     to: '/shop?line=Lifestyle' },
          { label: 'Minimal',         to: '/shop?line=Lifestyle' },
        ],
      },
    ],
    featured: {
      label: '🎨 Street edit',
      title: 'Nimbus Classic',
      sub: 'Suede · Gum rubber',
      to: '/product/nimbus-classic',
      badge: '$99',
    },
  },
];

/* ── Search Modal popup ─────────────────────────────────────────── */
function SearchModal({ onClose, navigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Esc key closes modal & locks body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Navigate to product page then close modal
  const handleProductClick = (productId) => {
    document.body.style.overflow = '';
    onClose();
    navigate(`/product/${productId}`);
  };

  // Filter products
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return productsJson.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.line.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.colorways.some((c) => c.name.toLowerCase().includes(q)) ||
        (p.specs.cushioning && p.specs.cushioning.toLowerCase().includes(q)) ||
        (p.specs.upperMaterial && p.specs.upperMaterial.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const trending = productsJson.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] bg-[#070707] flex flex-col text-surface overflow-y-auto transition-all duration-300">
      
      {/* Top Ambient Glow */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[350px] opacity-[0.07] z-0"
        style={{ background: 'radial-gradient(ellipse at top, #CFFF04 0%, transparent 70%)' }}
      />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-[960px] w-full px-6 py-[12vh] flex flex-col gap-10">
        
        {/* Header row / Input block */}
        <div className="flex flex-col gap-2 border-b border-white/10 pb-6 relative group">
          <div className="flex items-center justify-between gap-6">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start typing..."
              className="flex-1 bg-transparent text-[28px] sm:text-[48px] font-display font-black text-surface outline-none placeholder:text-white/10 tracking-tight leading-none"
              autoFocus
            />
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center justify-center px-2.5 py-1 rounded-[6px] border border-white/12 text-[10px] font-bold text-surface/30 tracking-widest uppercase">
                ESC
              </span>
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-surface/60 hover:text-accent hover:bg-accent/10 border border-white/8 hover:border-accent/30 transition-all duration-150"
                aria-label="Close search"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          {/* Animated active focus bar */}
          <div className={`h-[2px] w-full transition-all duration-300 ${query ? 'bg-accent shadow-[0_0_12px_#CFFF04]' : 'bg-white/10 group-focus-within:bg-accent/60'}`} />
        </div>

        {/* Hot terms / quick tags */}
        <div className="flex items-center gap-2 flex-wrap text-[13px] text-surface/40">
          <span className="font-semibold uppercase tracking-wider text-surface/20 text-[9px] mr-2">Hot suggestions:</span>
          {['Running', 'Trail', 'Carbon Plate', 'Stealth', 'Volt'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-4 py-1.5 rounded-full border border-white/8 bg-white/5 hover:bg-accent/10 hover:border-accent/40 hover:text-accent transition-all duration-150 text-[12px] font-bold"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Live results grid */}
        <div className="mt-4 flex flex-col gap-6">
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface/30">
                  Search Results
                </h3>
                <span className="text-[11px] font-medium text-accent tabular-nums bg-accent/10 px-2 py-0.5 rounded-[4px] border border-accent/20">
                  {results.length} found
                </span>
              </div>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((p) => {
                    const firstImage = p.images && p.images[0] ? p.images[0].src : '';
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProductClick(p.id)}
                        className="flex gap-4 p-4 rounded-[22px] bg-white/3 border border-white/5 hover:border-accent/35 hover:bg-white/6 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-150 group text-left cursor-pointer"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-[16px] bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                          {firstImage ? (
                            <img src={`/voltrace${firstImage}`} alt={p.name} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: p.images[0]?.primary || '#ccc' }} />
                          )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-accent">{p.line}</span>
                            <span className="text-[12px] font-black text-surface/80 group-hover:text-accent transition-colors">${p.price}</span>
                          </div>
                          <span className="text-[16px] font-bold text-surface truncate group-hover:text-surface transition-colors mt-0.5">{p.name}</span>
                          
                          {/* Mini specs labels */}
                          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-surface/35">
                            {p.specs.weight && <span>Wt: {p.specs.weight}</span>}
                            {p.specs.drop && <span>Drop: {p.specs.drop}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-surface/40 flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-[24px] bg-white/2">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-surface/30">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[16px] font-bold text-surface/60">No shoes matching "{query}"</p>
                    <p className="text-[12px] text-surface/30">Double check spelling or try other keywords.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface/30 mb-6">
                Trending Now
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {trending.map((p) => {
                  const firstImage = p.images && p.images[0] ? p.images[0].src : '';
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProductClick(p.id)}
                      className="flex flex-col p-5 rounded-[24px] bg-white/3 border border-white/5 hover:border-accent/35 hover:bg-white/6 transition-all duration-150 group text-left cursor-pointer"
                    >
                      <div className="h-32 rounded-[18px] bg-white/4 flex items-center justify-center overflow-hidden mb-4 relative">
                        {firstImage ? (
                          <img src={`/voltrace${firstImage}`} alt={p.name} className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-200" />
                        ) : (
                          <div className="w-12 h-12 rounded-full" style={{ backgroundColor: p.images[0]?.primary }} />
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-accent">{p.line}</span>
                        <span className="text-[13px] font-black text-surface/60 group-hover:text-accent transition-colors">${p.price}</span>
                      </div>
                      <span className="text-[15px] font-bold text-surface truncate mt-1 group-hover:text-surface transition-colors">{p.name}</span>
                      <p className="text-[11px] text-surface/40 mt-1 line-clamp-1">{p.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Mega panel ─────────────────────────────────────────────────── */
function MegaPanel({ item, onClose }) {
  return (
    <div
      className="absolute top-full left-0 right-0 bg-surface border-b border-border shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-50"
      role="region"
      aria-label={`${item.label} menu`}
    >
      <div className="mx-auto max-w-[1440px] px-6 py-8 grid gap-8"
        style={{ gridTemplateColumns: `repeat(${item.columns.length}, 1fr) 240px` }}
      >
        {/* Columns */}
        {item.columns.map((col) => (
          <div key={col.heading} className="flex flex-col gap-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted border-b border-border pb-2">
              {col.heading}
            </p>
            <ul className="flex flex-col gap-1">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="flex flex-col py-1.5 group"
                  >
                    <span className="text-[13px] font-semibold text-ink group-hover:text-accent transition-colors duration-150">
                      {link.label}
                    </span>
                    {link.sub && (
                      <span className="text-[11px] text-ink-muted group-hover:text-ink-muted transition-colors duration-150">
                        {link.sub}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Featured card */}
        <div className="rounded-[20px] bg-ink text-surface p-5 flex flex-col gap-3 self-start">
          <span className="text-[11px] font-semibold text-accent">{item.featured.label}</span>
          <div>
            <p className="text-[15px] font-bold text-surface leading-tight">{item.featured.title}</p>
            <p className="text-[11px] text-surface/50 mt-1">{item.featured.sub}</p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
            <span className="text-[18px] font-black text-accent">{item.featured.badge}</span>
            <Link
              to={item.featured.to}
              onClick={onClose}
              className="inline-flex h-8 items-center px-4 rounded-full bg-accent text-ink text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-white transition-colors duration-150"
            >
              View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── NavBar ─────────────────────────────────────────────────────── */
export default function NavBar({ minimal = false }) {
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const onCheckout = location.pathname === '/checkout';
  const showMinimal = minimal || onCheckout;

  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState(null); // active MEGA_MENU item id on mobile
  const navRef = useRef(null);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setActiveMenu(null);
    setSearchOpen(false);
    setMobileOpen(false);
    setMobileSub(null);
  }, [location.pathname, location.search]);

  const activeItem = MEGA_MENU.find((m) => m.id === activeMenu);

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-border"
        role="banner"
      >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-6 h-[64px] flex items-center gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-black text-[15px] tracking-[0.08em] text-ink flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          aria-label="Voltrace — Home"
          onClick={() => setActiveMenu(null)}
        >
          
          <img className="w-8 h-auto" src="public/favicon.svg" alt="" />
      
          <span>VOLTRACE</span>
        </Link>

        {/* ── Mega nav links (desktop) ─────────────────────────── */}
        {!showMinimal && (
          <nav className="hidden lg:flex items-center gap-1 flex-1" aria-label="Primary">
            {MEGA_MENU.map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveMenu(item.id)}
                onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                className={[
                  'relative flex items-center gap-1 h-[64px] px-4 text-[13px] font-semibold tracking-[0.03em] transition-colors duration-150 border-b-2 -mb-px',
                  activeMenu === item.id
                    ? 'text-ink border-accent'
                    : 'text-ink-muted hover:text-ink border-transparent',
                ].join(' ')}
                aria-expanded={activeMenu === item.id}
                aria-haspopup="true"
              >
                {item.label}
                <svg
                  viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5"
                  fill="none" strokeLinecap="round"
                  className={`transition-transform duration-150 ${activeMenu === item.id ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            ))}

            {/* Sale / New badge links */}
            <NavLink
              to="/shop?sort=newest"
              className={({ isActive }) =>
                `flex items-center gap-1.5 h-[64px] px-4 text-[13px] font-semibold tracking-[0.03em] transition-colors duration-150 border-b-2 -mb-px ${
                  isActive ? 'text-ink border-accent' : 'text-ink-muted hover:text-ink border-transparent'
                }`
              }
              onClick={() => setActiveMenu(null)}
            >
              New Arrivals
              <span className="inline-flex h-4 items-center px-1.5 rounded-sm bg-accent text-ink text-[9px] font-black uppercase tracking-[0.1em]">
                NEW
              </span>
            </NavLink>

            <NavLink
              to="/shop?maxPrice=100"
              className={({ isActive }) =>
                `flex items-center gap-1.5 h-[64px] px-4 text-[13px] font-semibold tracking-[0.03em] transition-colors duration-150 border-b-2 -mb-px ${
                  isActive ? 'text-[#ef4444] border-[#ef4444]' : 'text-[#ef4444] hover:text-[#dc2626] border-transparent'
                }`
              }
              onClick={() => setActiveMenu(null)}
            >
              Sale
              <span className="inline-flex h-4 items-center px-1.5 rounded-sm bg-[#ef4444] text-white text-[9px] font-black uppercase tracking-[0.1em]">
                HOT
              </span>
            </NavLink>
          </nav>
        )}

        {/* ── Right: search + icons ────────────────────────────── */}
        <div className="flex items-center gap-2 ml-auto">
          {!showMinimal && (
            <>
              {/* Search toggle (popup style) */}
              <button
                type="button"
                onClick={() => { setSearchOpen(true); setActiveMenu(null); }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Search"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? '' : 's'}`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center rounded-full bg-accent text-ink text-[9px] font-black px-0.5" aria-hidden="true">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-accent text-[13px] font-bold tracking-[0.04em] hover:bg-accent hover:text-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
                  <path d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L21 8H6" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-accent text-ink text-[10px] font-black px-0.5" aria-hidden="true">
                    {count}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-alt transition-all duration-150"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen
                  ? <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  : <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                }
              </button>
            </>
          )}

          {showMinimal && (
            <Link to="/cart" className="text-[13px] font-semibold text-ink-muted hover:text-ink transition-colors duration-150">
              ← Back to cart
            </Link>
          )}
        </div>
      </div>

      {/* ── Mega panel (desktop) ─────────────────────────────────── */}
      {!showMinimal && activeItem && (
        <div onMouseLeave={() => setActiveMenu(null)}>
          <MegaPanel item={activeItem} onClose={() => setActiveMenu(null)} />
        </div>
      )}
    </header>

      {/* ── Mobile sidebar overlay ───────────────────────────────── */}
      {!showMinimal && (
        <>
          {/* Backdrop */}
          <div
            className={[
              'fixed inset-0 top-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
              mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
            ].join(' ')}
            onClick={() => { setMobileOpen(false); setMobileSub(null); }}
            aria-hidden="true"
          />

          {/* Sidebar panel */}
          <div
            className={[
              'fixed top-0 left-0 bottom-0 z-[70] w-[300px] bg-[#0A0A0A] flex flex-col transition-transform duration-300 ease-out lg:hidden',
              mobileOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 flex-shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2 font-display font-black text-[14px] tracking-[0.08em] text-surface"
                onClick={() => { setMobileOpen(false); setMobileSub(null); }}
              >
                <svg viewBox="0 0 32 32" width="20" height="20">
                  <path d="M3 24 L11 8 L17 20 L25 8" stroke="#CFFF04" strokeWidth="3" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
                VOLTRACE
              </Link>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setMobileSub(null); }}
                className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-surface/60 hover:text-surface hover:bg-white/15 transition-all duration-150"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-white/8 flex-shrink-0">
              <button
                type="button"
                onClick={() => { setSearchOpen(true); setMobileOpen(false); setMobileSub(null); }}
                className="w-full h-9 pl-9 pr-3 rounded-full border border-white/12 bg-white/6 text-[13px] text-surface/40 hover:text-surface/70 transition-all duration-150 relative text-left"
              >
                Search shoes…
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-surface/30" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>

            {/* Two-panel body */}
            <div className="flex flex-1 overflow-hidden">

              {/* Left: category list */}
              <nav className="w-[120px] flex-shrink-0 border-r border-white/8 overflow-y-auto flex flex-col" aria-label="Categories">
                {MEGA_MENU.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMobileSub(item.id === mobileSub ? null : item.id)}
                    className={[
                      'flex flex-col items-start px-4 py-4 text-left border-b border-white/6 transition-all duration-150',
                      mobileSub === item.id
                        ? 'bg-accent/12 border-l-2 border-l-accent text-accent'
                        : 'text-surface/60 hover:bg-white/5 hover:text-surface border-l-2 border-l-transparent',
                    ].join(' ')}
                  >
                    <span className="text-[12px] font-bold leading-tight">{item.label}</span>
                  </button>
                ))}

                <div className="mt-auto border-t border-white/8">
                  <Link
                    to="/shop?sort=newest"
                    onClick={() => { setMobileOpen(false); setMobileSub(null); }}
                    className="flex flex-col items-start px-4 py-4 border-b border-white/6 text-accent"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] bg-accent text-ink px-1.5 py-0.5 rounded-sm">NEW</span>
                    <span className="text-[11px] font-semibold mt-1 text-surface/60">Arrivals</span>
                  </Link>
                  <Link
                    to="/shop?maxPrice=100"
                    onClick={() => { setMobileOpen(false); setMobileSub(null); }}
                    className="flex flex-col items-start px-4 py-4"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] bg-[#ef4444] text-white px-1.5 py-0.5 rounded-sm">SALE</span>
                    <span className="text-[11px] font-semibold mt-1 text-[#ef4444]/80">Deals</span>
                  </Link>
                </div>
              </nav>

              {/* Right: sub-links panel */}
              <div className="flex-1 overflow-y-auto">
                {mobileSub ? (() => {
                  const item = MEGA_MENU.find((m) => m.id === mobileSub);
                  if (!item) return null;
                  return (
                    <div className="flex flex-col">
                      {/* Featured card */}
                      <div className="m-4 rounded-[16px] bg-white/6 border border-white/10 p-4 flex flex-col gap-2">
                        <span className="text-[10px] font-semibold text-accent">{item.featured.label}</span>
                        <p className="text-[14px] font-bold text-surface">{item.featured.title}</p>
                        <p className="text-[11px] text-surface/40">{item.featured.sub}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[16px] font-black text-accent">{item.featured.badge}</span>
                          <Link
                            to={item.featured.to}
                            onClick={() => { setMobileOpen(false); setMobileSub(null); }}
                            className="inline-flex h-7 items-center px-3 rounded-full bg-accent text-ink text-[10px] font-bold uppercase"
                          >
                            View
                          </Link>
                        </div>
                      </div>

                      {/* All columns */}
                      {item.columns.map((col) => (
                        <div key={col.heading} className="px-4 pb-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-surface/30 mb-2 pt-2 border-t border-white/6">
                            {col.heading}
                          </p>
                          {col.links.map((link) => (
                            <Link
                              key={link.label}
                              to={link.to}
                              onClick={() => { setMobileOpen(false); setMobileSub(null); }}
                              className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-none group"
                            >
                              <span className="flex flex-col">
                                <span className="text-[13px] font-semibold text-surface/80 group-hover:text-accent transition-colors">{link.label}</span>
                                {link.sub && <span className="text-[10px] text-surface/35">{link.sub}</span>}
                              </span>
                              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-surface/25 group-hover:text-accent transition-colors flex-shrink-0">
                                <polyline points="9 18 15 12 9 6"/>
                              </svg>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })() : (
                  <div className="flex flex-col gap-0 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-surface/25 mb-4">Browse</p>
                    {MEGA_MENU.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMobileSub(item.id)}
                        className="flex items-center justify-between py-3.5 border-b border-white/6 last:border-none group"
                      >
                        <span className="text-[14px] font-semibold text-surface/70 group-hover:text-surface transition-colors">{item.label}</span>
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-surface/25 group-hover:text-accent transition-colors">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar footer */}
            <div className="px-5 py-4 border-t border-white/8 flex items-center gap-4 flex-shrink-0">
              <Link
                to="/wishlist"
                onClick={() => { setMobileOpen(false); setMobileSub(null); }}
                className="flex items-center gap-2 text-[12px] font-semibold text-surface/50 hover:text-surface transition-colors"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Wishlist
              </Link>
              <Link
                to="/cart"
                onClick={() => { setMobileOpen(false); setMobileSub(null); }}
                className="ml-auto flex items-center gap-2 h-9 px-4 rounded-full bg-accent text-ink text-[12px] font-bold"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>
                  <path d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L21 8H6"/>
                </svg>
                Cart {count > 0 && `(${count})`}
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Search Modal popup overlay */}
      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} navigate={navigate} />
      )}

      {/* Desktop mega backdrop */}
      {activeItem && (
        <div
          className="fixed inset-0 top-[64px] bg-ink/20 z-40 hidden lg:block"
          onClick={() => setActiveMenu(null)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
