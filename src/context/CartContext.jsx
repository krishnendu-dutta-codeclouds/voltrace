import { createContext, useContext, useMemo, useReducer } from 'react';
import { cartReducer, initialCartState, lineKey, cartItemCount } from './cartReducer';

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const stateValue = useMemo(
    () => ({
      items: state.items,
      count: cartItemCount(state.items),
    }),
    [state.items]
  );

  // Stable action helpers — so consumers can call addItem() without thinking about dispatch shapes.
  const dispatchValue = useMemo(
    () => ({
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      updateQty: (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty }),
      removeItem: (key) => dispatch({ type: 'REMOVE_ITEM', key }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }),
    []
  );

  return (
    <CartStateContext.Provider value={stateValue}>
      <CartDispatchContext.Provider value={dispatchValue}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCart() {
  const state = useContext(CartStateContext);
  const dispatch = useContext(CartDispatchContext);
  if (!state || !dispatch) {
    throw new Error('useCart must be used within <CartProvider>');
  }
  return { ...state, ...dispatch, lineKey };
}
