// lib/cart-store.ts

import { create } from 'zustand';
import { CartItem, CartStore } from '@/app/types';

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  totalQuantity: 0,

  // Replace entire cart (e.g., on page load)
  setItems: (items) => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    set({ items, totalQuantity: total });
  },

  // Add new item (used by AddToCartForm)
  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find(item => 
        item.productId === newItem.productId &&
        item.size === newItem.size &&
        item.color === newItem.color
      );

      let newItems;
      if (existing) {
        // Update quantity if same variant exists
        newItems = state.items.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add as new item
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, totalQuantity: total };
    });
  },

  // Increase quantity of existing item
  increaseItem: (id) => {
    set((state) => {
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      const total = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, totalQuantity: total };
    });
  },

  // Decrease quantity (remove if <= 0)
  decreaseItem: (id) => {
    set((state) => {
      const newItems = state.items
        .map(item =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
      const total = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, totalQuantity: total };
    });
  },

  // Remove item completely
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== id);
      const total = newItems.reduce((sum, item) => sum + item.quantity, 0);
      return { items: newItems, totalQuantity: total };
    });
  },

  // Clear cart
  clearCart: () => set({ items: [], totalQuantity: 0 }),
}));