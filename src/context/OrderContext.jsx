import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [order, setOrder] = useState(null);

  const placeOrder = useCallback((newOrder) => {
    setOrder(newOrder);
  }, []);

  const clearOrder = useCallback(() => {
    setOrder(null);
  }, []);

  const value = useMemo(
    () => ({ order, placeOrder, clearOrder }),
    [order, placeOrder, clearOrder]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within <OrderProvider>');
  return ctx;
}
