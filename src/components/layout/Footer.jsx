import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-surface pt-20 pb-8 mt-24" role="contentinfo">
      {/* Big background wordmark */}
      <div
        className="text-center font-display font-black text-[clamp(60px,12vw,160px)] tracking-tight leading-none text-white/5 select-none mb-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        VOLTRACE
      </div>

      <div className="mx-auto max-w-[1440px] px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-12 pb-16 border-b border-white/10">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <span className="font-display font-black text-[15px] tracking-[0.08em] text-surface">VOLTRACE</span>
            <p className="text-[14px] text-on-dark-muted leading-relaxed max-w-[280px]">
              Performance footwear engineered by line, not by hype — built in Lisbon, shipped worldwide.
            </p>
            {/* Newsletter */}
            <form
              className="flex gap-2 mt-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <label className="sr-only" htmlFor="footer-email">Email</label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@example.com"
                className="flex-1 h-10 px-3 rounded-lg text-[13px] bg-white/10 border border-white/20 text-surface placeholder:text-on-dark-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-accent text-ink text-[12px] font-bold uppercase tracking-[0.06em] hover:bg-white hover:text-ink transition-all duration-150"
              >
                Join
              </button>
            </form>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted mb-4">Shop</p>
            <ul className="flex flex-col gap-3">
              {[
                { to: '/shop?line=Running', label: 'Running' },
                { to: '/shop?line=Trail', label: 'Trail' },
                { to: '/shop?line=Training', label: 'Training' },
                { to: '/shop?line=Lifestyle', label: 'Lifestyle' },
                { to: '/shop', label: 'All shoes' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[14px] text-on-dark-muted hover:text-surface transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Help */}
          <nav aria-label="Help links">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted mb-4">Help</p>
            <ul className="flex flex-col gap-3">
              {['Shipping', 'Returns', 'Warranty', 'Contact'].map((label) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase()}`}
                    className="text-[14px] text-on-dark-muted hover:text-surface transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark-muted mb-4">Legal</p>
            <ul className="flex flex-col gap-3">
              {['Privacy', 'Terms', 'Accessibility'].map((label) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase()}`}
                    className="text-[14px] text-on-dark-muted hover:text-surface transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Base bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
          <p className="text-[12px] text-on-dark-muted">
            © {new Date().getFullYear()} Voltrace. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Instagram', 'Twitter', 'YouTube'].map((platform) => (
              <a
                key={platform}
                href={`#${platform.toLowerCase()}`}
                className="text-[12px] text-on-dark-muted hover:text-surface transition-colors duration-150 font-medium"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
