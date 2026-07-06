// Pure pricing functions. No React, no DOM.
// All money is handled as integer cents to avoid floating-point rounding bugs.

export const FREE_SHIPPING_THRESHOLD_CENTS = 7500; // $75
export const FLAT_SHIPPING_CENTS = 599;            // $5.99
export const TAX_RATE = 0.08;                      // 8% placeholder tax

export function toCents(dollars) {
  return Math.round(dollars * 100);
}

export function fromCents(cents) {
  return cents / 100;
}

export function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function lineSubtotalCents(item) {
  return Math.round(item.price * 100) * item.qty;
}

export function cartSubtotalCents(items) {
  return items.reduce((sum, item) => sum + lineSubtotalCents(item), 0);
}

export function shippingCents(subtotalCents) {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}

export function taxCents(subtotalCents) {
  return Math.round(subtotalCents * TAX_RATE);
}

export function totalCents(subtotalCents) {
  return subtotalCents + shippingCents(subtotalCents) + taxCents(subtotalCents);
}

export function cartTotals(items) {
  const subtotal = cartSubtotalCents(items);
  const shipping = shippingCents(subtotal);
  const tax = taxCents(subtotal);
  const total = subtotal + shipping + tax;
  return {
    subtotalCents: subtotal,
    shippingCents: shipping,
    taxCents: tax,
    totalCents: total,
    freeShippingProgressCents: Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal),
    qualifiesForFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD_CENTS,
  };
}
