// Pure filter/sort predicates over the products array.

export const LINES = ['Running', 'Training', 'Trail', 'Lifestyle'];
export const SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13];
export const WIDTHS = ['Standard', 'Wide'];
export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

export function getInStockCount(product) {
  return product.sizes.filter((s) => s.inStock).length;
}

export function filterProducts(products, filters) {
  const { lines = [], sizes = [], widths = [], minPrice, maxPrice, colorways = [] } = filters;
  return products.filter((p) => {
    if (lines.length > 0 && !lines.includes(p.line)) return false;
    if (sizes.length > 0) {
      const hasSize = p.sizes.some((s) => sizes.includes(s.size) && s.inStock);
      if (!hasSize) return false;
    }
    if (widths.length > 0) {
      const hasWidth = p.width && p.width.some((w) => widths.includes(w));
      if (!hasWidth) return false;
    }
    if (minPrice != null && p.price < minPrice) return false;
    if (maxPrice != null && p.price > maxPrice) return false;
    if (colorways.length > 0) {
      const hasColor = p.colorways.some((c) => colorways.includes(c.name));
      if (!hasColor) return false;
    }
    return true;
  });
}

export function sortProducts(products, sortKey) {
  const arr = [...products];
  switch (sortKey) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating);
    case 'featured':
    default:
      return arr;
  }
}

export function findById(products, id) {
  return products.find((p) => p.id === id);
}

export function getRelated(products, product) {
  if (!product?.relatedIds) return [];
  return product.relatedIds
    .map((id) => findById(products, id))
    .filter(Boolean);
}

export function aggregateRating(products) {
  const reviewed = products.filter((p) => p.reviewCount > 0);
  const totalReviews = reviewed.reduce((sum, p) => sum + p.reviewCount, 0);
  if (totalReviews === 0) return { average: 0, total: 0 };
  const weighted = reviewed.reduce((sum, p) => sum + p.rating * p.reviewCount, 0);
  return {
    average: weighted / totalReviews,
    total: totalReviews,
  };
}
