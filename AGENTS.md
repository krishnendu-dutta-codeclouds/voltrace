---
applyTo: '**'
description: 'Always-on instructions for the Voltrace e-commerce React app. Use when: working on the Voltrace codebase, building UI, fixing functionality, or making any change to src/.'
---

# Voltrace — Sports Shoes E-Commerce (AI Agent Guide)

> **Stack:** React 18 + Vite + React Router v6 + Framer Motion + Lenis. Context API + `useReducer` for cart/order state. **`src/data/products.json`** is the single source of truth — never invent products, ratings, or stock.
>
> **Migration in progress:** the project is being converted from plain CSS + design tokens to **Tailwind CSS v4** for cross-component consistency. Read [`./.github/skills/tailwind-migration/SKILL.md`](./.github/skills/tailwind-migration/SKILL.md) before touching styles.

---

## 1. Run the project

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview the build
```

There are **no tests** in this project. `npm run build` is the closest thing to a verification step — it catches type/import errors and confirms Vite is happy.

---

## 2. Routes & state ownership

| Path | File | Notes |
|---|---|---|
| `/` | `src/pages/Landing.jsx` | Hero + trust bar + value props + **computed live rating** from `products.json` |
| `/shop` | `src/pages/Shop.jsx` | PLP. Filters sync to URL query params. Filter state is **local**, not global. |
| `/product/:id` | `src/pages/Product.jsx` | PDP. Variant state is **local**, reset on route change. |
| `/cart` | `src/pages/Cart.jsx` | 5s undo on remove. |
| `/checkout` | `src/pages/Checkout.jsx` | Guarded — redirects to `/cart` if empty. **Nav is stripped** (logo + "Back to cart" only) — this is intentional, not a bug. |
| `/confirmation` | `src/pages/Confirmation.jsx` | Guarded — redirects to `/` if no order in `OrderContext`. |

- **Cart state** — global (`src/context/CartContext.jsx` + `cartReducer.js`). Actions: `ADD_ITEM`, `UPDATE_QTY`, `REMOVE_ITEM`, `CLEAR_CART`. Helper hooks: `useCart()`.
- **Last placed order** — global but ephemeral (`src/context/OrderContext.jsx`). Read once on `Confirmation`, cleared on reload.
- **PLP filters / sort** — local to `Shop.jsx`, mirrored to URL query params (deep-linkable, shareable).
- **PDP variant selection** — local to `Product.jsx`.

---

## 3. Architecture & component boundaries

```
src/
├── data/products.json          # 7 SKUs, single source of truth — never edit to "fix" the UI
├── context/                    # Cart + Order providers, reducers
├── components/
│   ├── ui/                     # Button, LinkButton, Input, Chip, Swatch, Badge, Stars, CardSkeleton
│   ├── layout/                 # NavBar, Footer, TrustBar
│   └── product/                # ProductCard, VariantSelector, SpecTable, ReviewList, CrossSell, ShoeSVG
├── pages/                      # Landing, Shop, Product, Cart, Checkout, Confirmation
├── utils/                      # pricing.js, filters.js (pure functions — keep them pure)
├── hooks/useProducts.js
├── styles/globals.css          # Design tokens (pre-Tailwind) — keep until migration is complete
├── anim/                       # Cursor, framer-primitives, primitives (framer-motion helpers)
├── App.jsx                     # Router + providers + scroll-to-top
└── main.jsx
```

**Rules:**
- Pure logic goes in `src/utils/` (e.g. `pricing.js`, `filters.js`) — no React imports, easy to read in isolation.
- `products.json` is read-only at runtime. Don't add fields that aren't in the schema unless you're updating the seed data deliberately.
- New UI primitives go in `src/components/ui/`, not in `pages/`.
- New product-specific components go in `src/components/product/`.

---

## 4. The brand & design rules (do not violate)

> These come straight from `Voltrace_Sports_Shoes_Ecommerce_Plan.md`. They are not preferences — they are the spec.

1. **One primary CTA per screen.** If a screen has two competing actions, demote one to a text link.
2. **Every persuasive claim needs proof** — a spec, a number, a policy, a real product attribute. No unsupported superlatives.
3. **Honest persuasion only** — no "Only 2 left!" badges, no invented ratings, no countdown timers, no fake discount. If a persuasive element can't be backed by `products.json`, cut it.
4. **Out-of-stock sizes are visibly struck-through, not hidden** — hiding them hides information.
5. **Width selector is scoped to Running and Trail lines only** — `product.width` is present only for those two lines in the data. Do not generalize width to Training/Lifestyle.
6. **Aggregated rating on Landing is computed live** from `products.json` — never hardcode.
7. **Sticky mobile Add to Cart bar on PDP** appears once the primary button scrolls out of view (`IntersectionObserver`).
8. **5-second undo on Cart remove** — destructive actions must be recoverable.
9. **Single-page Checkout with three visual blocks** (Shipping / Payment / Review) — friction is fields, not scroll length.
10. **Honest retention hook on Confirmation** — no countdown, no fake discount.

---

## 5. Accessibility (non-negotiable)

- Every interactive element has a visible `:focus-visible` ring (volt outline).
- All images have alt text or `aria-label` / `aria-hidden` as appropriate.
- Colorway swatches and size chips use `role="radiogroup"` / `role="radio"`.
- Form fields validate on blur; errors announced via `aria-invalid` + `aria-describedby`.
- Tap targets ≥ 44×44px on mobile.
- Respect `prefers-reduced-motion` (motion durations clamped to 0.01ms).
- One H1 per page; semantic landmarks (`<main>`, `<header>`, `<nav>`, `<footer>`).

---

## 6. The Tailwind migration (active)

The project is in the middle of a **plain-CSS → Tailwind CSS v4** migration. See the migration skill for the procedure:
→ [`.github/skills/tailwind-migration/SKILL.md`](./.github/skills/tailwind-migration/SKILL.md)

**Short version:**
- Tailwind v4 is being added via the Vite plugin (`@tailwindcss/vite`).
- Design tokens in `src/styles/globals.css` are being mapped to Tailwind's `@theme` directive in a new `tailwind.css` entry.
- Per-component CSS files (e.g. `Button.css`) are being removed; class names are moving into the JSX as Tailwind utilities.
- **One component at a time.** Don't convert the entire codebase in one pass — migrate one component, verify `npm run build` + visual parity, then move on.
- See the file-scoped instruction at [`.github/instructions/styles-and-css.instructions.md`](./.github/instructions/styles-and-css.instructions.md) for component-level style rules.

---

## 7. Common pitfalls (learned the hard way)

- **Don't "fix" the stripped nav on `/checkout`.** It is intentional. See design rule #1.
- **Don't add width to non-Running/Trail products** — the data layer enforces this via `product.width` being either present or absent.
- **Don't add a `Cart` link to the `/checkout` nav.** Same reason.
- **Don't invent reviews, ratings, or stock counts** — only the values in `products.json` exist.
- **Don't import from `products.json` to mutate it** — read-only.
- **Animation durations** are 150ms / 200ms / 250ms. Nothing longer than 300ms anywhere.
- **Spacing** uses a 4px base (`--s-1` = 4px, `--s-2` = 8px, …). No arbitrary values.
- **The accent (`#CFFF04` / volt)** is only used on interactive elements. Never as decorative fill.

---

## 8. Files to read first when onboarding

1. [`README.md`](./README.md) — high-level stack, structure, design tokens.
2. [`Voltrace_Sports_Shoes_Ecommerce_Plan.md`](./Voltrace_Sports_Shoes_Ecommerce_Plan.md) — the full spec the codebase is graded against.
3. [`src/styles/globals.css`](./src/styles/globals.css) — design tokens (pre-migration).
4. [`src/data/products.json`](./src/data/products.json) — the catalog.
5. [`src/context/cartReducer.js`](./src/context/cartReducer.js) — the cart state machine.
