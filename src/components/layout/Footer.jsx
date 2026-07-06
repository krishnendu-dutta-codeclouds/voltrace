import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-surface py-14 mt-16" role="contentinfo">
      <div className="mx-auto max-w-[1380px] px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr] border-b border-white/10 pb-10">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">Voltrace</p>
              <h2 className="text-[clamp(28px,3.5vw,36px)] font-display font-black tracking-[-0.03em] text-surface leading-tight">
                Clean performance footwear with a premium shop experience.
              </h2>
              <p className="max-w-[28rem] text-[14px] leading-relaxed text-on-dark-muted">
                Honest product details, easy returns, and fast delivery — all built around the runner who values durability and design.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { label: 'Fast delivery', subtitle: '2–4 business days' },
                { label: 'Free returns', subtitle: '60-day window' },
                { label: 'Secure checkout', subtitle: '256-bit encryption' },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-dark-muted mb-2">
                    {item.label}
                  </p>
                  <p className="text-[14px] font-semibold text-surface">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <nav aria-label="Shop links" className="grid gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-dark-muted">Shop</p>
            <ul className="grid gap-2 text-[14px]">
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
                    className="text-on-dark-muted hover:text-surface transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support links" className="grid gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-dark-muted">Support</p>
            <ul className="grid gap-2 text-[14px]">
              {['Shipping', 'Returns', 'FAQ', 'Contact'].map((label) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase()}`}
                    className="text-on-dark-muted hover:text-surface transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-on-dark-muted">Newsletter</p>
              <p className="mt-3 text-[14px] leading-relaxed text-on-dark-muted max-w-[22rem]">
                Subscribe for restock alerts, new drops, and exclusive updates.
              </p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Footer newsletter email"
            >
              <label className="sr-only" htmlFor="footer-email">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Email address"
                className="min-h-[44px] flex-1 rounded-[14px] border border-white/15 bg-white/5 px-4 text-[13px] text-surface placeholder:text-on-dark-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-150"
              />
              <button
                type="submit"
                className="inline-flex h-[44px] items-center justify-center rounded-[14px] bg-accent px-5 text-[13px] font-bold uppercase tracking-[0.08em] text-ink transition-colors duration-150 hover:bg-white hover:text-ink"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-on-dark-muted">
            © {new Date().getFullYear()} Voltrace. Built for the miles that matter.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-on-dark-muted">
            {['Instagram', 'Twitter', 'YouTube'].map((platform) => (
              <a
                key={platform}
                href={`#${platform.toLowerCase()}`}
                className="font-medium hover:text-surface transition-colors duration-150"
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
