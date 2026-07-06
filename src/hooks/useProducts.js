import { useEffect, useState } from 'react';
import productsJson from '../data/products.json';

// Tiny "loading" simulation so the loading skeleton has a chance to render
// (no real network call exists, but this matches the spec's explicit-states requirement).
const LOAD_MS = 150;

export function useProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      if (cancelled) return;
      try {
        setData(productsJson);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    }, LOAD_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return { products: data, loading, error };
}
