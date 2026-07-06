---
name: tailwind-migration
description: 'Migrate the Voltrace React app from per-component plain CSS + design tokens to Tailwind CSS v4 with a single tokenized @theme block. Use when: converting a component from CSS to Tailwind, mapping design tokens to Tailwind utilities, or planning the final cutover from globals.css. Triggers: "tailwind", "migrate component to tailwind", "convert css to tailwind", "use tailwind classes", "remove the css file".'
---

# Tailwind CSS v4 Migration — Voltrace

> **Status:** active. The project is mid-migration. Migrate **one component at a time** and verify each one.

---

## 1. Why this skill exists

The project ships with per-component CSS files (e.g. `Button.css`, `ProductCard.css`) that consume design tokens from `src/styles/globals.css`. We are moving to **Tailwind CSS v4** so styling lives inline on the JSX, tokens are declared once in `@theme`, and there is one consistent vocabulary across the app.

This skill defines the **safe procedure** — if you skip a step, you'll either lose the design system, break accessibility, or break the build.

---

## 2. Prerequisites (one-time setup)

If Tailwind is not yet installed in the project, do this **once** before migrating any component:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Then wire it into `vite.config.js`:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: true },
});
```

Create `src/styles/tailwind.css` (the new single source of truth) with the token map from `globals.css` (full map in section 4 below).

Import it in `src/main.jsx` **in addition to** (not instead of) `globals.css` for now — `globals.css` stays until every component is migrated:

```jsx
// src/main.jsx
import './styles/tailwind.css';
import './styles/globals.css';   // keep until migration is complete
```

---

## 3. The per-component migration procedure

For each component (e.g. `Button.jsx` + `Button.css`):

### Step 1 — Read the source

1. Read the `.jsx` file and identify every `className` it uses.
2. Read the `.css` file and identify every rule that targets one of those classes.
3. Note any **state variants** (`:hover`, `:focus-visible`, `:disabled`, `.btn--loading`, etc.).
4. Note any **media queries** (typically one mobile breakpoint at `768px`).

### Step 2 — Map CSS values to Tailwind utilities

Use the token map in section 4. Prefer semantic tokens (`bg-ink`, `text-accent`) over raw values.

### Step 3 — Rewrite the JSX

Apply the Tailwind utilities inline. Use `clsx` or a small template helper if the className list gets long:

```jsx
import clsx from 'clsx';

<button
  className={clsx(
    'inline-flex items-center justify-center rounded-full font-semibold transition',
    'h-11 px-6',                      // md size
    variant === 'primary' && 'bg-ink text-accent hover:bg-accent hover:text-ink',
    variant === 'accent'  && 'bg-accent text-ink',
    variant === 'secondary' && 'border border-ink/20 hover:border-ink',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    fullWidth && 'w-full'
  )}
>
```

### Step 4 — Delete the CSS file

Once the JSX is fully covered, delete `Component.css`. Also delete the `import './Component.css'` line in the JSX.

### Step 5 — Verify

```bash
npm run build
```

Then visually confirm in `npm run dev`:
- All variants still render.
- Hover, focus, disabled, loading states all work.
- Mobile breakpoint (`< 768px`) still behaves.
- Focus ring is visible on every interactive element.

### Step 6 — One component per commit

Migrate **one component per change**. This keeps the diff reviewable and the rollback trivial.

---

## 4. Token map (globals.css → @theme → Tailwind utilities)

> Tailwind v4 reads the `@theme` block at build time and exposes each variable as a utility class. Names below use kebab-case in CSS and dash-case in className.

### Colors

| `--color-*` in `globals.css` | `@theme` value | Tailwind class | Usage |
|---|---|---|---|
| `--color-ink: #0B0B0F` | `--color-ink: #0B0B0F;` | `bg-ink` / `text-ink` / `border-ink` | Primary text, nav, footer |
| `--color-ink-2: #1A1A22` | `--color-ink-2` | `bg-ink-2` | Subtle elevation |
| `--color-ink-3: #2A2A35` | `--color-ink-3` | `bg-ink-3` | Borders on dark |
| `--color-ink-muted: #6B6F7A` | `--color-ink-muted` | `text-ink-muted` | Secondary text |
| `--color-ink-soft: #9A9DA6` | `--color-ink-soft` | `text-ink-soft` | Tertiary text |
| `--color-accent: #D6FF3A` | `--color-accent` | `bg-accent` / `text-accent` / `ring-accent` | Volt — **interactive only** |
| `--color-accent-soft: #F1FFC4` | `--color-accent-soft` | `bg-accent-soft` | Volt tints |
| `--color-accent-alt: #FF5436` | `--color-accent-alt` | `bg-accent-alt` | Sparingly (one "New" tag) |
| `--color-surface: #FAFAF7` | `--color-surface` | `bg-surface` | Default background |
| `--color-surface-pure: #FFFFFF` | `--color-surface-pure` | `bg-surface-pure` | Cards |
| `--color-surface-dark: #0B0B0F` | `--color-surface-dark` | `bg-surface-dark` | Inverted sections |
| `--color-surface-alt: #F1F0EA` | `--color-surface-alt` | `bg-surface-alt` | Alternate panels |
| `--color-success: #16703A` | `--color-success` | `text-success` | |
| `--color-error: #C81E1E` | `--color-error` | `text-error` | |
| `--color-border: #E6E4DC` | `--color-border` | `border-border` | |
| `--color-border-soft: #EFEDE6` | `--color-border-soft` | `border-border-soft` | |

### Spacing (4px base)

`--s-1` (4) → `p-1` / `gap-1` / `m-1`
`--s-2` (8) → `p-2` / `gap-2` / `m-2`
`--s-3` (12) → `p-3` / `gap-3` / `m-3`
`--s-4` (16) → `p-4` / `gap-4` / `m-4`
`--s-5` (20) → `p-5` / `gap-5` / `m-5`
`--s-6` (24) → `p-6` / `gap-6` / `m-6`
`--s-8` (32) → `p-8` / `gap-8` / `m-8`
`--s-10` (40) → `p-10` / `gap-10` / `m-10`
`--s-12` (48) → `p-12` / `gap-12` / `m-12`
`--s-16` (64) → `p-16` / `gap-16` / `m-16`
`--s-20` (80) → `p-20` / `gap-20` / `m-20`
`--s-24` (96) → `p-24` / `gap-24` / `m-24`
`--s-32` (128) → `p-32` / `gap-32` / `m-32`

### Radii

`--r-2` (6) → `rounded-md` (use `rounded-[6px]` if you must match exactly, or extend the theme)
`--r-3` (10) → `rounded-[10px]`
`--r-4` (14) → `rounded-2xl` (close) or `rounded-[14px]`
`--r-5` (20) → `rounded-3xl` (close) or `rounded-[20px]`
`--r-6` (28) → `rounded-[28px]`
`--r-pill` (999) → `rounded-full`

**Recommended:** extend the theme to expose these as named utilities:

```css
/* src/styles/tailwind.css */
@theme {
  --radius-2: 6px;
  --radius-3: 10px;
  --radius-4: 14px;
  --radius-5: 20px;
  --radius-6: 28px;
}
```

Then use `rounded-2` / `rounded-3` / `rounded-4` etc.

### Type

| Token | Tailwind |
|---|---|
| `--font-display` (Archivo) | `font-display` |
| `--font-body` (Inter) | `font-sans` (default body) |
| `--text-display-size` (clamp 56→132) | `text-display` (extend theme) |
| `--text-h1-size` (clamp 40→72) | `text-h1` (extend theme) |
| `--text-h2-size` (clamp 28→44) | `text-h2` (extend theme) |
| `--text-h3-size` (20/26) | `text-h3` (extend theme) |
| `--text-price-size` (20/26) | `text-price` (extend theme) |
| `--text-body-size` (16/24) | `text-base` (default) |
| `--text-caption-size` (12/16) | `text-xs` |

**Recommended `@theme` block** for type:

```css
@theme {
  --font-display: 'Archivo', 'Arial Narrow', system-ui, sans-serif;
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --text-display-size: clamp(56px, 9vw, 132px);
  --text-h1-size: clamp(40px, 5.5vw, 72px);
  --text-h2-size: clamp(28px, 3vw, 44px);
  --text-h3-size: 20px;
  --text-h3-lh: 26px;
  --text-price-size: 20px;
  --text-price-lh: 26px;
}
```

### Motion

| Token | Tailwind |
|---|---|
| `--t-fast` (150ms) | `duration-150` |
| `--t-med` (220ms) | `duration-200` (closest) or extend theme |
| `--t-slow` (320ms) | extend theme → `duration-slow` |
| `--ease-out` | `ease-out` is close; for exact, extend theme → `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` then use `ease-out` (Tailwind v4 maps by name) |

### Elevation / shadows

| Token | Tailwind |
|---|---|
| `--shadow-xs` | `shadow-xs` (extend theme to match exactly) |
| `--shadow-sm` | `shadow-sm` (extend theme) |
| `--shadow-md` | `shadow-md` (extend theme) |
| `--shadow-lg` | `shadow-lg` (extend theme) |
| `--shadow-accent` | extend theme → `shadow-accent` |

### Layout

| Token | Tailwind |
|---|---|
| `--container-max: 1440px` | extend theme → `--container-max: 1440px` then use `max-w-container` |
| `--container-pad: 24px` / `16px` mobile | use `px-6 md:px-4` (or a `.container` wrapper class) |
| `--nav-h: 72px` / `64px` mobile | extend theme → `--spacing-nav: 72px` and use `h-nav md:h-16` |

---

## 5. Skeleton `tailwind.css`

```css
/* src/styles/tailwind.css */
@import "tailwindcss";

@theme {
  /* --- Colors --- */
  --color-ink: #0B0B0F;
  --color-ink-2: #1A1A22;
  --color-ink-3: #2A2A35;
  --color-ink-muted: #6B6F7A;
  --color-ink-soft: #9A9DA6;
  --color-accent: #D6FF3A;
  --color-accent-soft: #F1FFC4;
  --color-accent-alt: #FF5436;
  --color-surface: #FAFAF7;
  --color-surface-pure: #FFFFFF;
  --color-surface-dark: #0B0B0F;
  --color-surface-alt: #F1F0EA;
  --color-success: #16703A;
  --color-error: #C81E1E;
  --color-border: #E6E4DC;
  --color-border-soft: #EFEDE6;

  /* --- Type --- */
  --font-display: 'Archivo', 'Arial Narrow', system-ui, sans-serif;
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --text-display-size: clamp(56px, 9vw, 132px);
  --text-h1-size: clamp(40px, 5.5vw, 72px);
  --text-h2-size: clamp(28px, 3vw, 44px);
  --text-h3-size: 20px;
  --text-price-size: 20px;

  /* --- Radii --- */
  --radius-2: 6px;
  --radius-3: 10px;
  --radius-4: 14px;
  --radius-5: 20px;
  --radius-6: 28px;

  /* --- Layout --- */
  --spacing-nav: 72px;
  --container-max: 1440px;

  /* --- Motion --- */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 6. Common pitfalls during migration

- **Don't delete `globals.css` mid-migration.** Components still importing from it will lose their styles. Keep it until *every* component is converted.
- **Don't use `@apply` in v4 unless necessary.** Tailwind v4 prefers utility classes directly in the JSX. Use `@apply` only inside the `@layer components` block for repeated compound utilities.
- **Don't add `bg-accent` as a decorative fill.** The accent is interactive-only by brand rule.
- **Don't replace the `:focus-visible` ring with `outline-none` alone.** Always pair with `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`.
- **Don't use arbitrary values when a token exists.** `p-[17px]` is wrong; `p-4` is right.
- **Don't introduce a second animation library.** Framer Motion + Lenis are already wired up.
- **One component per change.** Bigger diffs are harder to review and roll back.

---

## 7. Finalization (after every component is migrated)

1. Search the codebase for `import './styles/globals.css'` — should be zero matches.
2. Delete `src/styles/globals.css`.
3. Remove the `import './styles/globals.css';` line from `src/main.jsx`.
4. Run `npm run build` and confirm zero warnings related to missing tokens.
5. Run `npm run dev` and do a full visual sweep of every route.
6. Commit: `chore(styles): remove legacy globals.css after tailwind migration`.
