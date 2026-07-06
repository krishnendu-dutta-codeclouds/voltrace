---
applyTo: '**/*.{css,jsx,tsx}'
description: 'Styling rules for the Voltrace e-commerce app during the Tailwind migration. Use when: editing any component, page, or stylesheet — applies to all JSX and CSS files.'
---

# Voltrace — Styling & CSS Rules (Tailwind Migration Active)

> **Context:** the project is being migrated from per-component CSS files to **Tailwind CSS v4** with a single tokenized `@theme` block. See [`../skills/tailwind-migration/SKILL.md`](../skills/tailwind-migration/SKILL.md) for the procedure.

---

## The rules

### 1. Don't create new per-component `.css` files

If you're adding a new component, **use Tailwind utility classes inline in the JSX**. Do **not** create a new `Component.css` file.

```jsx
// ✅ Correct — Tailwind utilities inline
<button className="bg-ink text-accent rounded-full px-6 py-3 font-semibold">
  Add to cart
</button>

// ❌ Wrong — new per-component CSS file
// src/components/ui/NewButton.css
.btn-new { background: var(--color-ink); ... }
```

### 2. When editing an existing component, finish the migration in that component

If you touch a component that still has a sibling `.css` file, **migrate it fully to Tailwind in the same change** — do not leave a half-converted component. See the migration skill for the token mapping.

### 3. Never use arbitrary values when a token exists

```jsx
// ✅ Correct
<div className="p-4 gap-2 rounded-2xl">

// ❌ Wrong — arbitrary value when the token exists
<div className="p-[17px] gap-[9px] rounded-[14px]">
```

The 4px-based spacing scale is the source of truth. See the migration skill for the full token map.

### 4. Use semantic color tokens, not raw hex

```jsx
// ✅ Correct
<span className="text-ink bg-accent">

// ❌ Wrong
<span className="text-[#0B0B0F] bg-[#D6FF3A]">
```

Tokens are defined in `src/styles/tailwind.css` under `@theme { ... }`. Read that file first if a color isn't in your vocabulary yet.

### 5. Honor the brand constraints

These are **brand rules**, not preferences. They override Tailwind defaults:

- **One primary CTA per screen.** Don't add a second `bg-accent` button to compete with the first.
- **Accent color (`text-accent` / `bg-accent`) is only for interactive elements.** Never as a decorative fill on a card, hero gradient stop, or icon background — those use `text-ink`, `bg-surface`, etc.
- **Out-of-stock sizes are visibly struck-through, not hidden.** Use `line-through text-ink-muted` and `aria-disabled`.
- **Width selector only on Running and Trail lines.** Read `product.width` from the data; do not hardcode a width array.
- **No fake scarcity.** No "Only 2 left!" badges, no countdown timers, no fabricated review counts.

### 6. Motion

Use the project's motion tokens. Nothing longer than 300ms anywhere. Always gate on `prefers-reduced-motion`:

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
/>
```

Framer Motion + Lenis are already configured. Don't pull in another animation library.

### 7. Accessibility (still applies to Tailwind output)

- **Visible focus ring on every interactive element.** Use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`.
- **Tap targets ≥ 44×44px on mobile.** Use `min-h-11 min-w-11` (44px) on buttons, swatches, and chips.
- **Form errors** use `aria-invalid` + `aria-describedby` linking to the error message.
- **Colorway swatches and size chips** use `role="radiogroup"` / `role="radio"` + `aria-checked`.

### 8. Don't touch `src/styles/globals.css` until the migration is done

`globals.css` still contains the design tokens used by unmigrated components. **Do not delete it.** When all components are migrated, the migration skill's "Finalization" step covers the safe removal of the legacy file and the consolidation into `src/styles/tailwind.css`.

---

## Quick checklist for any style change

- [ ] No new `.css` file was created.
- [ ] If the component had a sibling `.css` file, it was deleted as part of this change.
- [ ] No arbitrary values (`p-[17px]`) — tokens used instead.
- [ ] No raw hex — semantic color tokens used.
- [ ] Brand constraints honored (one CTA, no fake scarcity, etc.).
- [ ] Focus ring present on every interactive element.
- [ ] Tap targets ≥ 44×44px.
- [ ] `npm run build` passes.
