import { Link } from 'react-router-dom';

/* ─── Social icon SVGs ──────────────────────────────────────────── */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const NAV_SHOP = [
  { to: '/shop?line=Running',   label: 'Running'   },
  { to: '/shop?line=Trail',     label: 'Trail'     },
  { to: '/shop?line=Training',  label: 'Training'  },
  { to: '/shop?line=Lifestyle', label: 'Lifestyle' },
  { to: '/shop',                label: 'All shoes' },
];
const NAV_SUPPORT = ['Shipping', 'Returns', 'FAQ', 'Contact'];
const SOCIALS = [
  { label: 'Instagram', href: '#instagram', Icon: IconInstagram },
  { label: 'Twitter',   href: '#twitter',   Icon: IconTwitter   },
  { label: 'YouTube',   href: '#youtube',   Icon: IconYouTube   },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#080808] text-surface overflow-hidden" role="contentinfo">

      {/* ── Ambient glow ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(ellipse at center, #CFFF04 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6">

        {/* ── Hero tagline ──────────────────────────────────────────── */}
        <div className="py-20 border-b border-white/8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent mb-6">
            Voltrace
          </p>
          <h2 className="font-display font-black tracking-[-0.04em] leading-[0.88] text-[clamp(52px,8vw,112px)] text-surface max-w-[10ch]">
            Built for<br />
            <span className="text-accent">the miles</span><br />
            that matter.
          </h2>

          {/* Stat pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { num: '60',   unit: 'days',  desc: 'free trial' },
              { num: '256',  unit: 'bit',   desc: 'encryption' },
              { num: '2–4',  unit: 'days',  desc: 'delivery'   },
              { num: '2yr',  unit: '',      desc: 'outsole warranty' },
            ].map(({ num, unit, desc }) => (
              <div
                key={num + desc}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
              >
                <span className="font-display font-black text-[18px] text-accent leading-none">
                  {num}
                  {unit && <span className="text-[12px] ml-0.5 font-semibold">{unit}</span>}
                </span>
                <span className="text-[12px] text-surface/50 font-medium">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-white/8">

          {/* Shop */}
          <nav aria-label="Shop links">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface/30 mb-5">Shop</p>
            <ul className="flex flex-col gap-3">
              {NAV_SHOP.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[14px] font-medium text-surface/60 hover:text-accent transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support links">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface/30 mb-5">Support</p>
            <ul className="flex flex-col gap-3">
              {NAV_SUPPORT.map((label) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase()}`}
                    className="text-[14px] font-medium text-surface/60 hover:text-accent transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter — spans 2 cols on md */}
          <div className="col-span-2 flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface/30 mb-3">Newsletter</p>
              <p className="text-[14px] leading-relaxed text-surface/50 max-w-[24rem]">
                New drops, restock alerts & early access — straight to your inbox.
              </p>
            </div>
            <form
              className="flex items-center gap-2 max-w-[400px]"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter subscription"
            >
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="your@email.com"
                className="min-h-[48px] flex-1 rounded-full border border-white/12 bg-white/6 px-5 text-[13px] text-surface placeholder:text-surface/30 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-150"
              />
              <button
                type="submit"
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-accent px-6 text-[13px] font-bold uppercase tracking-[0.08em] text-ink hover:bg-white transition-colors duration-150 flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[12px] text-surface/25">
            © {new Date().getFullYear()} Voltrace. Built for the miles that matter.
          </p>
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-surface/40 hover:border-accent hover:text-accent transition-all duration-150"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
