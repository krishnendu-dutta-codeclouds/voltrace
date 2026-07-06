// Tiny cart-key helper: same product+size+colorway+width = same line.
export function lineKey(item) {
  return [item.id, item.size, item.colorway, item.width ?? '-'].join('|');
}

export const initialCartState = { items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const incoming = action.item;
      const key = lineKey(incoming);
      const existing = state.items.find((i) => lineKey(i) === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            lineKey(i) === key ? { ...i, qty: i.qty + incoming.qty } : i
          ),
        };
      }
      return { ...state, items: [...state.items, incoming] };
    }
    case 'UPDATE_QTY': {
      const { key, qty } = action;
      if (qty <= 0) {
        return { ...state, items: state.items.filter((i) => lineKey(i) !== key) };
      }
      return {
        ...state,
        items: state.items.map((i) => (lineKey(i) === key ? { ...i, qty } : i)),
      };
    }
    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter((i) => lineKey(i) !== action.key) };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function cartItemCount(items) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
