# Voltrace — Sports Shoes E-Commerce UI

A responsive, multi-product e-commerce app for the fictional performance-shoe brand **Voltrace**. Built end-to-end from the spec in `Voltrace_Sports_Shoes_Ecommerce_Plan.md`.

## Stack

- **React 18** (functional components + hooks)
- **React Router v6** for routing
- **Context API + `useReducer`** for cart and order state — no external state library
- **Plain CSS with design tokens** (no Tailwind / no UI lib)
- **`src/data/products.json`** as the single source of truth

## Folder structure

```
src/
├── data/products.json          # 7 SKUs, single source of truth
├── context/
│   ├── CartContext.jsx         # useReducer: ADD_ITEM, UPDATE_QTY, REMOVE_ITEM, CLEAR_CART
│   ├── cartReducer.js
│   └── OrderContext.jsx        # last placed order, ephemeral
├── components/
│   ├── ui/                     # Button, LinkButton, Input, Chip, Swatch, Badge, Stars, CardSkeleton
│   ├── layout/                 # NavBar, Footer, TrustBar
│   └── product/                # ProductCard, VariantSelector, SpecTable, ReviewList, CrossSell, ShoeSVG
├── pages/                      # Landing, Shop, Product, Cart, Checkout, Confirmation
├── utils/                      # pricing.js, filters.js (pure functions, unit-testable)
├── hooks/useProducts.js
├── styles/globals.css          # design tokens locked here
├── App.jsx                     # Router + providers
└── main.jsx
```

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview the build
```

## Routes

| Path | Screen | Notes |
|---|---|---|
| `/` | Landing | Hero + trust bar + value props (real specs) + computed rating + closing CTA band |
| `/shop` | PLP | Filter (line / price / size / width / colorway), sort, active-filter chips synced to URL |
| `/product/:id` | PDP | Gallery, variant selectors (size / colorway / width), spec table, reviews, cross-sell, sticky mobile Add to Cart |
| `/cart` | Cart | Line items with 5s undo on remove, live totals, free-shipping progress, designed empty state |
| `/checkout` | Checkout | Single page, three blocks (Shipping / Payment / Review), inline validation, guest checkout, redirects to `/cart` if empty |
| `/confirmation` | Confirmation | Order summary, what-happens-next, honest newsletter retention hook, redirects to `/` if no order in context |

## Design tokens (locked in `src/styles/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0A0A0A` | Primary text, nav, footer |
| `--color-accent` | `#CFFF04` | Volt — primary CTA, active states, price highlight. **Only on interactive elements** (never decorative fill) |
| `--color-accent-alt` | `#FF3B1F` | Sparingly, e.g. one "New" tag — never alongside the primary accent on the same screen |
| `--color-surface-dark` | `#0A0A0A` | Inverted sections (closing CTA, footer, sticky mobile add-to-cart bar) |
| Type | Archivo (display) + Inter (body) | Same weight never reused across both families |
| Motion | 150ms / 200ms / 250ms | Nothing longer than 300ms anywhere |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 | 4px base unit, no arbitrary values |

## Design decisions worth logging

1. **Checkout strips the nav to logo + "Back to cart"** — this is a deliberate conversion decision (removing exit points at the highest-friction step), not an oversight.
2. **Out-of-stock sizes are visibly struck-through, not hidden** — hiding them hides information and prevents size-range visibility.
3. **Width selector is intentionally scoped to Running and Trail lines** — this is the junior-spec-misses-it detail; the data layer enforces it via `product.width` being either present (Running/Trail) or absent (Training/Lifestyle).
4. **Aggregated rating on Landing is computed live from `products.json`** — never hardcoded. The spec calls this out as a "no invented review counts" rule.
5. **PLP filters sync to URL query params** — deep links from the Landing CTA (`/shop?line=Running`) survive back/forward navigation, are shareable, and the active filter is visibly reflected as a chip.
6. **Sticky mobile Add to Cart bar on PDP** — appears once the primary button scrolls out of view via `IntersectionObserver`.
7. **5-second undo affordance on Cart remove** — turns a destructive action into a recoverable one.
8. **Single-page Checkout with three visual blocks** — friction is fields, not scroll length. Grouping Shipping/Payment/Review on one page reduces perceived weight.
9. **Honest retention hook on Confirmation** — newsletter signup for early colorway access, no countdown timer, no fake discount, no fabricated urgency.
10. **No fake scarcity anywhere** — no "Only 2 left!" badges, no invented ratings, no countdown timers. Persuasion only where the data supports it.

## State ownership

- **Cart contents** — global (`CartContext`), read by Cart, Checkout, Confirmation, and the NavBar badge.
- **PLP filters / sort** — local to `Shop.jsx`, synced to URL query params (not global state).
- **PDP variant selection** — local to `Product.jsx`, reset on route change.
- **Last placed order** — global but ephemeral (`OrderContext`), read once by Confirmation, cleared on unmount/reload.

## Accessibility

- Every interactive element has a visible `:focus-visible` ring (volt outline).
- All images have alt text or `aria-label`/`aria-hidden` as appropriate.
- Colorway swatches and size chips use `role="radiogroup"` / `role="radio"`.
- Form fields validate on blur; errors are announced via `aria-invalid` + `aria-describedby`.
- Tap targets are ≥ 44×44px on mobile (verified in `Button`, `Input`, `SizeChip`, `Swatch`).
- Honors `prefers-reduced-motion` (motion durations clamped to 0.01ms).
