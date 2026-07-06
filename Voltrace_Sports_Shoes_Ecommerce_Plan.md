# Loop-Engineered E-Commerce UI — Sports Shoes Vertical

**Brand:** Voltrace
**Vertical:** Sports Shoes
**Tech stack:** React 18 (functional components, hooks), React Router v6, Context API + `useReducer` for cart/order state, local `products.json` as the data layer (swap-in ready for a real API later)
**Reviewed as:** a principal fullstack engineer's data/state architecture pass + a senior UI/UX designer's system, hierarchy, and accessibility pass — the two lenses the assignment actually grades on (craft *and* discipline).

---

## 1 · Rules Block (opened once, at the top of the planning loop)

> Paste this into Claude/ChatGPT before starting the planning loop. Every planning cycle is graded against these rules.

```
RULES FOR THIS PLANNING LOOP:
1. One primary CTA per screen. If a screen has two competing actions, demote one to a text link.
2. Every persuasive claim must be paired with proof (a spec, a number, a policy, a real product attribute) — no unsupported superlatives.
3. Reply in spec format only: headings, bullets, labeled sections. No prose paragraphs, no filler.
4. Honest persuasion only: no fake urgency ("only 2 left!"), no fabricated scarcity, no invented review counts or ratings. If a persuasive element can't be backed by real catalog data, cut it.
5. Every response should end with an explicit "open questions" list if anything is ambiguous.
6. Every screen spec must state its states, not just its happy path: default, hover/focus, loading, empty, error, disabled.
```

---

## 2 · Brand & Catalog

**Brand name:** Voltrace
**Positioning:** Performance running/training shoes for people who train seriously but also wear their shoes all day — engineered comfort without the premium-only price tag.

**Catalog — 7 SKUs across 4 lines (exceeds the 6-SKU minimum; gives real price-tier and use-case spread):**

| SKU | Line | Use case | Price | Sizes | Width | Colorways |
|---|---|---|---|---|---|---|
| Pulse Runner | Running | Daily road running | $129 | 6–13 (half sizes) | Standard/Wide | Volt Green/Black, Arctic Blue/White |
| Pulse Runner Pro | Running (premium) | Race day, carbon-plated | $179 | 6–13 | Standard/Wide | Solar Orange/Black, Stealth Black |
| ForgeFit Trainer | Training | Gym, HIIT, lateral movement | $99 | 6–13 | — | Graphite/Lime, Black/Black |
| ForgeFit Trainer Mid | Training (support) | Lifting + cross-training, ankle support | $119 | 6–13 | — | Charcoal/Red |
| TrailBlaze GTX | Trail | Wet/technical trail, waterproof | $159 | 6–13 | Standard/Wide | Moss/Brown, Slate/Orange |
| TrailBlaze Lite | Trail (budget) | Dry trail, day hikes | $119 | 6–13 | Standard/Wide | Sand/Green |
| Cruiser Street | Lifestyle | Everyday wear, casual | $89 | 6–13 | — | White/Grey, Black/Gum |

**Variant model:** size (required) + colorway (required) + width (optional, Running/Trail only). Width is deliberately scoped to two lines — this is the detail a junior spec misses and an agent will either over-generalize (add width everywhere) or drop silently. Call it out explicitly so the build tool doesn't guess.

**Stock edge case to design for:** at least one SKU should ship with a partially sold-out size run in the seed data (e.g. Pulse Runner Pro missing size 8 and 13) so the PDP's disabled-state and the PLP's "low availability" honesty rule both have something real to render against.

---

## 3 · Information Architecture & Sitemap

```
/                     Landing
/shop                 PLP  (supports ?line=, ?size=, ?width=, ?sort=, ?minPrice=, ?maxPrice=)
/product/:id          PDP
/cart                 Cart
/checkout             Checkout   (guarded: redirects to /cart if cart is empty)
/confirmation         Confirmation (guarded: redirects to / if no order in state)
```

**Navigation model:** persistent top nav (logo, Shop, Cart icon with live item-count badge) on every screen except Checkout, where nav is intentionally stripped down to logo-only + a "Back to cart" link — removing exit points at the highest-friction step is a deliberate conversion decision, not an oversight, and should be logged as such in the design-decision log.

**Deep-linking requirement:** the landing hero CTA passes a `line` query param into `/shop`; the PLP must read and apply it on mount, and the filter UI must visibly reflect that a filter is already active (not just filter silently) — otherwise a user who lands on a pre-filtered PLP won't know why the catalog looks smaller than expected.

---

## 4 · Design System (tokens — lock these before any screen is generated)

A build tool given loose direction will invent its own scale per screen and the six screens will visibly disagree. Lock tokens first.

**Color (all pairings pre-checked for WCAG AA):**

**Direction:** competitor-benchmarked against Nike, Adidas, and Reebok's flagship sites — the shared pattern across all three is a near-monochrome base (black/white) that gets out of the way of product photography, one electric accent color reserved *only* for action and status, oversized bold display type, and almost no decorative chrome. That's the "ultimate attraction" lever: restraint everywhere except the shoe and the CTA, so both pop without competing with each other.

| Token | Hex | Usage | Contrast |
|---|---|---|---|
| `--color-ink` | #0A0A0A | Primary text, nav, footer — near-black like Nike/Adidas, not a soft gray | 20.1:1 on white |
| `--color-ink-muted` | #5C5F66 | Secondary text, meta info | 5.1:1 on white |
| `--color-accent` | #CFFF04 | Volt/electric accent — "just did it" energy; primary CTA fill, active filter chips, price highlight | 15.6:1 (ink text on it) |
| `--color-accent-alt` | #FF3B1F | Secondary accent — sparingly, for a "New" tag or one seasonal callout, never both accents on one screen | 4.5:1 on white, large text/UI only |
| `--color-surface` | #FFFFFF | Page background | — |
| `--color-surface-dark` | #0A0A0A | Inverted sections — closing CTA band, footer, sticky mobile add-to-cart bar | — |
| `--color-surface-alt` | #F2F2F2 | Card/section background, filter drawer | — |
| `--color-success` | #1E7B34 | In-stock, confirmation | 4.8:1 |
| `--color-error` | #C81E1E | Out-of-stock, validation | 5.1:1 |
| `--color-border` | #E1E1E1 | Dividers, input borders | — |

**Accent usage rule (this is what keeps it premium instead of loud):** `--color-accent` (volt) appears only on interactive/actionable elements — primary buttons, the active nav underline, selected swatch ring, price on hover. It never fills large decorative blocks. Everything else stays black/white/gray so the accent reads as energy, not noise — this is the exact discipline Nike's PDP uses: ~95% grayscale, ~5% volt, always on the thing you're meant to click.

**Type scale — bold condensed display for headlines (like Nike/Adidas' oversized athletic sans), a clean grotesk for body, never the same weight for both:**

| Token | Size / Line-height / Weight | Usage |
|---|---|---|
| `--text-display` | 64px/68px, 800, condensed, uppercase, -1% tracking | Hero headline (1440px); scales to 36px/40px at 375px — should feel oversized and cropped at the viewport edge like Nike's hero type, not politely contained |
| `--text-h2` | 32px/38px, 700, uppercase | Section headers ("SHOP THE COLLECTION") |
| `--text-h3` | 20px/26px, 600 | Card titles, PDP product name |
| `--text-price` | 20px/26px, 700 | Price — always bold, never the same weight as surrounding body |
| `--text-body` | 16px/24px, 400 | Body copy |
| `--text-caption` | 12px/16px, 500, uppercase, +4% tracking | Category tags, meta labels ("RUNNING", "IN STOCK") — small-caps tag style is a direct Nike/Adidas convention |

**Spacing scale:** 4px base unit — 4/8/12/16/24/32/48/64/96. Use the 96 step generously around hero and PDP imagery — dense spacing reads as budget; competitor sites let product breathe.

**Component states to define once, reuse everywhere:** button (default/hover/focus-visible/active/disabled/loading-spinner — hover on a solid black button inverts to volt fill, not just a darker shade), input (default/focus/error/disabled), swatch/size-chip (default/selected — thick black ring, not a checkmark/disabled-out-of-stock), card (default/hover — see micro-interactions below).

**Micro-interactions (the actual "ultimate attraction" mechanics, borrowed directly from Nike/Adidas/Reebok PLPs and PDPs):**
- **Card image swap on hover:** product card shows a second angle/lifestyle shot on hover/focus instead of a static image — the single highest-leverage "premium feel" signal on any sneaker PLP.
- **Colorway swatch preview on the card:** clicking a colorway swatch swaps the card's image to that colorway without navigating away from the grid.
- **Sticky add-to-cart bar on PDP (mobile):** once the user scrolls past the primary Add to Cart button, a condensed sticky bar (thumbnail, price, Add to Cart) pins to the bottom — standard on every competitor PDP and a real conversion lift because the CTA stays reachable.
- **Button hover inversion:** black buttons invert to volt-fill with black text on hover, not a generic opacity fade — reads as intentional, not default-browser.
- **Underline-grow nav hover:** nav links get an animated underline that grows from the left on hover/focus, replacing a plain color change — cheap to build, reads as considered.

**Motion:** 150ms ease-out for hover/focus transitions, 200ms for drawer/filter panel open, 250ms for the card image-swap crossfade. Nothing longer than 300ms anywhere — energetic, not showy.

---

## 5 · Funnel

```
Landing (brand + line discovery)
   → PLP (browse/filter full catalog)
      → PDP (pick variant, read proof, see cross-sell)
         → Cart (review, adjust variant/qty)
            → Checkout (single-page, minimal fields)
               → Order Confirmation (reassure + one retention hook)
```

**Primary conversion goal:** first-time visitor with running/trail-shoe search intent finds the right shoe within one filter interaction and completes purchase in under 90 seconds of active steps.

**Named drop-off risks (design against these explicitly, don't discover them in hour 7):**
- PLP → PDP: card doesn't communicate fit/availability, so users bounce back and forth. *Mitigation:* show size-availability count on the card, not just on the PDP.
- PDP → Cart: Add to Cart succeeds with no visible confirmation, user re-clicks or abandons. *Mitigation:* button shows a brief inline success state ("Added ✓") before returning to default, plus the nav cart badge increments.
- Checkout abandonment: too many fields visible at once feels heavier than it is. *Mitigation:* group into three visually distinct blocks (Shipping / Payment / Review) on the same page, not three separate pages — friction is fields, not scroll length.

---

## 6 · Screen-by-Screen Blueprint (with explicit states)

### Screen 1 — Landing Page
- **Hero:** Full-bleed image, `--text-display` headline stating a concrete benefit, one dominant CTA **"Shop Running Shoes"** → `/shop?line=Running`.
- **Trust bar:** Free shipping over $75 · 30-day returns · 2-year outsole warranty · Secure checkout.
- **Value props (3 cards):** each paired with a real spec from the data (e.g. "4mm forefoot rocker"), not an adjective.
- **Social proof block:** aggregate rating *computed* from seeded review data — never hardcoded.
- **Closing CTA band:** secondary CTA **"Browse Full Collection"** → `/shop`.
- **States:** hero image lazy-loads with a low-contrast placeholder (no layout shift); CTA has a visible `:focus-visible` ring for keyboard users.

### Screen 2 — Product Listing Page (PLP)
- **Filters:** line, price range, size, width, colorway — collapsible drawer under 768px.
- **Sort:** price low–high / high–low / best rated.
- **Cards:** image, name, line tag, price, star rating, up to 3 colorway swatches, size-availability count, "View Details."
- **Grid:** 1 col @375px, 2 col tablet, 4 col @1440px.
- **States:** *loading* → skeleton cards (not a spinner over blank space); *empty* → "No shoes match those filters" + Clear Filters action; *active filter from deep link* → visible chip showing "Line: Running ✕" so the user can see and remove it.

### Screen 3 — Product Detail Page (PDP)
- **Gallery:** 3–4 images, thumbnail strip.
- **Variant selectors:** size (button grid, out-of-stock sizes visibly struck-through and disabled, not hidden — hiding them hides information), colorway (swatches), width (toggle, Running/Trail only).
- **Proof block:** spec table (weight, drop, cushioning, upper material) sourced from data fields.
- **Reviews:** real average + count from seeded data.
- **Cross-sell:** 3 items from `relatedIds`.
- **Primary CTA:** "Add to Cart" — disabled until size + colorway selected; inline microcopy explains why while disabled; on success, shows a transient confirmed state.
- **States:** selecting an out-of-stock size shows a tooltip/inline note ("Size 8 — out of stock") rather than just refusing the click silently.

### Screen 4 — Cart
- **Line items:** image, name, size/colorway/width, quantity stepper, price, remove.
- **Order summary:** subtotal, shipping (free ≥$75, else flat fee), tax placeholder, total — recomputed live.
- **Reassurance:** same trust-bar copy as landing, for consistency.
- **Path back:** "Continue Shopping" → `/shop`.
- **States:** empty cart has its own designed state (not a blank page) with a CTA back to `/shop`; removing an item shows an undo affordance for ~5s before it's final.

### Screen 5 — Checkout
- **Single page, three visual blocks:** Shipping → Payment → Review, no wizard/step-gate.
- **Fields:** name, email, address, city, zip, card number, expiry, CVC — nothing else. Guest checkout is the default; no forced account creation.
- **Trust cues:** lock icon + "Secure 256-bit checkout" near payment fields, accepted-card icons.
- **Primary CTA:** "Place Order."
- **States:** inline validation per field on blur (not only on submit); disabled submit state while the mock "processing" happens, with a visible loading indicator so the button never looks inert.

### Screen 6 — Order Confirmation
- **Summary:** order number, items, total.
- **What happens next:** shipping estimate, confirmation-email note.
- **Retention hook (honest):** newsletter signup for "early access to new colorways" — no countdown, no fake discount.
- **States:** direct navigation to this route with no order in context redirects to `/`.

**Responsive requirement:** every screen holds at 375px and 1440px — verified, not assumed, at the end of *each* screen's loop, not only at the end of the day.

---

## 7 · Technical Architecture (fullstack-principal pass)

**Why this section exists:** an AI build tool left to its own devices will inline data into components, mix presentation with state logic, and give you six screens that don't share a design system or a data contract. Constrain the architecture up front so refactors aren't part of your 8-hour budget.

**Folder structure:**
```
src/
  data/
    products.json
  context/
    CartContext.jsx        // useReducer: ADD_ITEM, UPDATE_QTY, REMOVE_ITEM, CLEAR_CART
    OrderContext.jsx        // holds last placed order for the confirmation route
  components/
    ui/                      // Button, Input, Chip, Swatch, Badge — the design-token consumers
    layout/                  // NavBar, Footer, TrustBar
    product/                 // ProductCard, VariantSelector, SpecTable, ReviewList, CrossSell
  pages/
    Landing.jsx
    Shop.jsx                 // PLP — owns filter/sort state, reads/writes URL query params
    Product.jsx              // PDP — owns local variant-selection state
    Cart.jsx
    Checkout.jsx
    Confirmation.jsx
  utils/
    pricing.js                // shipping/tax/total calculations — pure functions, unit-testable
    filters.js                 // pure filter/sort predicates over products.json
  App.jsx                      // Router + Context providers
```

**State ownership rule (state lives at the lowest common point that needs it):**
- Cart contents → global (`CartContext`), because Cart, Checkout, and the nav badge all read it.
- PLP filters/sort → local to `Shop.jsx`, synced to URL query params (so filtered views are shareable/back-button-safe) — not global state.
- PDP variant selection → local to `Product.jsx`, reset on route change.
- Last order → global but ephemeral (`OrderContext`), read once by Confirmation, cleared on unmount or app reload.

**Data contract (`products.json`) — this is the single source of truth every screen reads from, nothing is hardcoded in components:**
```json
{
  "id": "pulse-runner",
  "name": "Pulse Runner",
  "line": "Running",
  "price": 129,
  "description": "...",
  "specs": { "weight": "225g", "drop": "8mm", "cushioning": "Dual-density foam", "upperMaterial": "Engineered mesh" },
  "images": ["/img/pulse-runner-1.jpg", "..."],
  "sizes": [{ "size": 8, "inStock": true }, { "size": 9, "inStock": false }],
  "width": ["Standard", "Wide"],
  "colorways": [{ "name": "Volt Green/Black", "swatch": "#8FD400" }],
  "rating": 4.6,
  "reviewCount": 312,
  "reviews": [{ "author": "J. Rivera", "rating": 5, "text": "..." }],
  "relatedIds": ["forgefit-trainer", "cruiser-street"]
}
```

**Non-functional targets (a principal engineer would set these before day-one, not after launch):**
- Lighthouse Performance ≥ 90, Accessibility ≥ 95 on Landing and PLP (the two highest-traffic screens).
- No layout shift (CLS) from image loading — reserve aspect-ratio boxes for gallery/card images.
- Cart/checkout state must survive a page refresh at minimum for the current session (in-memory is acceptable for a prototype; note this as a known limitation in the reflection, not a silent gap).

---

## 8 · Exit Conditions (defined before building)

A screen is "done" when **all** of the following are true:
1. Exactly one dominant primary CTA is visually the strongest element on the screen.
2. Text/background contrast passes WCAG AA (4.5:1 body, 3:1 large text/UI) — checked against the token table in Section 4, not eyeballed.
3. Trust signal (shipping/returns/security) is visible above the fold on Landing, Cart, and Checkout.
4. Every persuasive claim maps to a real field in `products.json` — nothing invented.
5. Screen holds its layout with no overlap/overflow at 375px and 1440px.
6. Tap targets ≥44×44px on mobile.
7. Every interactive element has a visible `:focus-visible` state — keyboard-only navigation must be able to complete the full funnel.
8. Loading, empty, and error states are designed, not left as "TODO" or a raw blank screen.

---

## 9 · Conversion Copy (seed copy for the planning-loop spec)

**Landing headline:** "Built for the miles that matter."
**Landing subhead:** "Carbon-plated propulsion, waterproof trail grip, and all-day comfort — engineered by line, not by hype."
**Landing primary CTA:** Shop Running Shoes
**PLP filter empty-state:** "No shoes match those filters yet — try widening your size range or price."
**PDP add-to-cart disabled microcopy:** "Select a size and color to add to cart."
**PDP out-of-stock size microcopy:** "Size 8 — out of stock. We restock weekly."
**Cart reassurance line:** "Free returns within 30 days — no restocking fee."
**Checkout trust line:** "Payment is encrypted end-to-end. We never store your card details."
**Confirmation retention hook:** "Want first access to new colorways? Join the Voltrace list — no spam, unsubscribe anytime."

---

## 10 · Build Prompt (paste into your AI build tool — Antigravity / Lovable / Google Stitch / Figma Make / UX Pilot AI)

```
Build a responsive multi-product e-commerce web app called "Voltrace" (a fictional sports-shoe brand) using React 18 with functional components and hooks. Use React Router v6 for routing. Use React Context + useReducer for cart state — do not use Redux or any external state library. All product data must come from a single local JSON file (src/data/products.json), not hardcoded into components.

FOLDER STRUCTURE (follow exactly):
src/data/products.json
src/context/CartContext.jsx (actions: ADD_ITEM, UPDATE_QTY, REMOVE_ITEM, CLEAR_CART)
src/context/OrderContext.jsx (holds the most recently placed order for the confirmation page)
src/components/ui/ (Button, Input, Chip, Swatch, Badge — shared presentational components)
src/components/layout/ (NavBar with live cart-count badge, Footer, TrustBar)
src/components/product/ (ProductCard, VariantSelector, SpecTable, ReviewList, CrossSell)
src/pages/ (Landing.jsx, Shop.jsx, Product.jsx, Cart.jsx, Checkout.jsx, Confirmation.jsx)
src/utils/pricing.js (pure functions for subtotal/shipping/tax/total)
src/utils/filters.js (pure functions for filtering/sorting the product array)

VISUAL DIRECTION: benchmark against Nike, Adidas, and Reebok's flagship e-commerce sites — near-monochrome black/white base, one electric accent color used only on interactive/actionable elements (never as decorative fill), oversized bold condensed headline type, generous whitespace around product photography, minimal decorative chrome. Restraint everywhere except the product and the CTA.

DESIGN TOKENS (define once as CSS variables and reuse everywhere — do not restyle each screen independently):
Colors: --color-ink:#0A0A0A; --color-ink-muted:#5C5F66; --color-accent:#CFFF04 (volt — primary CTA fill, active states, price highlight, ONLY on interactive elements); --color-accent-alt:#FF3B1F (use sparingly, e.g. a single "New" tag, never alongside the primary accent on the same screen); --color-surface:#FFFFFF; --color-surface-dark:#0A0A0A (inverted sections: closing CTA band, footer, sticky mobile add-to-cart bar); --color-surface-alt:#F2F2F2; --color-success:#1E7B34; --color-error:#C81E1E; --color-border:#E1E1E1.
Type scale: display 64/68 800 condensed uppercase -1% tracking (scales to 36/40 on mobile — should feel oversized, cropped at the viewport edge, not politely contained), h2 32/38 700 uppercase, h3 20/26 600, price 20/26 700 (always bolder than surrounding body text), body 16/24 400, caption 12/16 500 uppercase +4% tracking (category tags like "RUNNING", "IN STOCK"). One condensed/display family for headlines + one grotesk for body — never the same weight for both.
Spacing scale: 4/8/12/16/24/32/48/64/96px — no arbitrary values. Use the 96 step generously around hero and PDP imagery; do not crowd product photography.
Motion: 150ms ease-out for hover/focus, 200ms for drawer/panel open, 250ms for card image-swap crossfade, nothing longer than 300ms.
Define reusable states once for: button (default/hover — solid black inverts to volt-fill with black text, not a generic opacity fade/focus-visible/active/disabled/loading), input (default/focus/error/disabled), size-chip/swatch (default/selected — thick black ring, not a checkmark/disabled-out-of-stock), card (default/hover — see micro-interactions below), nav link (default/hover — underline animates in from the left).

MICRO-INTERACTIONS (implement these — they are the primary "premium/attraction" signal, not optional polish):
- Product cards swap to a second angle/lifestyle image on hover/focus (250ms crossfade).
- Clicking a colorway swatch on a PLP card swaps that card's image to the selected colorway, without navigating.
- On the PDP, once the user scrolls past the primary Add to Cart button, show a sticky bottom bar on mobile with thumbnail, price, and an Add to Cart button.

DATA MODEL for each product in products.json: id, name, line (Running|Training|Trail|Lifestyle), price, description, specs {weight, drop, cushioning, upperMaterial}, images (array), sizes (array of {size, inStock}), width (optional array, Running/Trail lines only), colorways (array of {name, swatch hex}), rating, reviewCount, reviews (array of {author, rating, text}), relatedIds (array of product ids).

Seed exactly these 7 SKUs with plausible specs, sizes 6-13, and make Pulse Runner Pro missing sizes 8 and 13 (inStock:false) so the out-of-stock UI has real data to render:
1. Pulse Runner — Running — $129 — width: Standard/Wide
2. Pulse Runner Pro — Running — $179 (carbon-plated) — width: Standard/Wide
3. ForgeFit Trainer — Training — $99
4. ForgeFit Trainer Mid — Training — $119 (ankle support)
5. TrailBlaze GTX — Trail — $159 (waterproof) — width: Standard/Wide
6. TrailBlaze Lite — Trail — $119 — width: Standard/Wide
7. Cruiser Street — Lifestyle — $89

ROUTES AND STATE OWNERSHIP:
/ → Landing. Hero CTA links to /shop?line=Running.
/shop → PLP. Owns filter/sort state locally, synced to URL query params (line, size, width, minPrice, maxPrice, sort) so filtered views are shareable and back-button-safe. Read the line param on mount and show an active-filter chip if present.
/product/:id → PDP. Owns variant selection (size, colorway, width) as local state, reset on route change.
/cart → Cart. Reads/writes global CartContext.
/checkout → Checkout. Redirects to /cart if the cart is empty.
/confirmation → Confirmation. Redirects to / if OrderContext has no order.

BUILD EACH SCREEN WITH THESE EXPLICIT STATES (not just the happy path): default, loading (skeletons, not spinners over blank space), empty, error/disabled, and focus-visible for every interactive element — the full funnel must be completable via keyboard alone.

SCREEN REQUIREMENTS:

1. LANDING (/): full-bleed hero with oversized condensed display headline (cropped bold at the viewport edge, Nike-hero style) over a full-width product/lifestyle image, one dominant volt-fill CTA "Shop Running Shoes"; dark inverted trust bar (free shipping over $75, 30-day returns, 2-year outsole warranty, secure checkout) using uppercase caption-style labels; 3 value-prop cards each citing a real spec from the data, generous whitespace between them; social-proof rating computed live from the review data, never hardcoded; closing CTA band on a dark/inverted background with "Browse Full Collection" → /shop.

2. PLP (/shop): filter sidebar (collapsible drawer under 768px) for line/price/size/width/colorway, with the active filter shown as a volt-accented chip; sort dropdown (price asc/desc, best rated); responsive grid — 1 col at 375px, 2 col tablet, 4 col at 1440px; cards show image (swaps to a second angle on hover/focus), name, uppercase line tag, bold price, rating, up to 3 colorway swatches that swap the card image on click, and a size-availability count; explicit empty state with a "Clear filters" action when zero results match.

3. PDP (/product/:id): large image gallery with thumbnail strip and generous whitespace; size selector as a button grid with out-of-stock sizes visibly struck-through and disabled (not hidden); colorway swatches with a thick black selected-ring; width toggle only if the product has a width field; spec table from the specs object; reviews section with real average/count; "Complete the kit" cross-sell rendering the 3 relatedIds products; Add to Cart disabled until size+colorway chosen, with inline microcopy explaining why, and a transient success confirmation on click; sticky bottom Add to Cart bar appears on mobile once the user scrolls past the primary button.

4. CART (/cart): line items with image, selected variant, quantity stepper, price, remove (with a ~5s undo affordance); live-computed subtotal/shipping(free ≥$75 else flat fee)/tax placeholder/total; reassurance line reusing landing's trust copy; "Continue Shopping" link; a designed empty-cart state, not a blank page.

5. CHECKOUT (/checkout): single page with three visually distinct blocks — Shipping, Payment, Review — no step wizard; fields limited to name, email, address, city, zip, card number, expiry, CVC; guest checkout by default, no forced account creation; lock icon + "Secure 256-bit checkout" near payment; inline per-field validation on blur; Place Order button shows a loading state during mock processing, then clears the cart, stores the order in OrderContext, and navigates to /confirmation.

6. CONFIRMATION (/confirmation): order number, items, total from OrderContext; "what happens next" shipping estimate and email note; one honest retention hook (newsletter signup for early colorway access) — absolutely no countdown timers, fake discounts, or invented scarcity anywhere in the app; redirect to / if no order is present in context.

CONSTRAINTS:
- Exactly one visually dominant primary CTA per screen; secondary actions are visually subordinate (outline/link style).
- Every number or claim shown must trace to a field in products.json — no invented review counts, no fabricated urgency.
- WCAG AA contrast (4.5:1 body, 3:1 large text/UI) using the token palette above.
- Tap targets ≥44x44px on mobile.
- No layout shift from image loading — reserve aspect-ratio space for all images.
- Every screen must render correctly with no overflow at 375px and 1440px viewport widths.

Build and show me the Landing page first. Wait for my review before moving to the next screen — give me one screen per turn, and apply only the single change I ask for in each critique cycle rather than regenerating the whole screen.
```

---

## 11 · How to Run the Loop From Here

1. **Planning loop (Claude/ChatGPT):** Paste the Rules Block (Section 1), then Sections 2–9 as your working spec. Run at least 3 cycles sharpening headline, proof specificity, and IA before locking the spec.
2. **Build loop (your chosen tool):** Paste the Section 10 prompt as your opening message. Generate one screen at a time — six-at-once collapses the "one change per cycle" discipline the assignment grades on.
3. **Hero loop:** on the landing output, run 3+ critique cycles on the hero specifically (headline weight, CTA contrast, trust-bar placement), screenshotting each cycle.
4. **PLP loop:** run 2+ cycles on card hierarchy, filter usability, and scan-ability before moving to the PDP.
5. **Verify at 375px and 1440px after every screen**, not only at the end of the day — and check each screen against the Section 8 exit conditions before calling it done.
