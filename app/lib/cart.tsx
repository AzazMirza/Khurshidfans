// lib/cart.ts
import { CartResponse, AddToCartPayload, CartItem } from '@/app/types';
import { create } from 'zustand';

interface CartStore {
  totalQuantity: number;
  setTotalQuantity: (qty: number) => void;
  increment: (by: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  totalQuantity: 0,
  setTotalQuantity: (qty) => set({ totalQuantity: qty }),
  increment: (by) => set((state) => ({ totalQuantity: state.totalQuantity + by })),
}));

export const addToCart = async (
  payload: AddToCartPayload,
  endpoint = `/api/cart`
): Promise<CartResponse> => {
  // ✅ Guard localStorage for SSR safety (even though this should only run in Client Components)
  const guestId = typeof window !== 'undefined' 
    ? localStorage.getItem('guestId') 
    : null;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ...payload, 
        guestId // 👈 sent as part of body, not separate array
      }),
      // credentials: 'include', // keep only if backend uses cookies/sessions
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('[ADD_TO_CART_ERROR]', error);
    throw error;
  }
};

export const fetchCart = async (
  endpoint = '/api/cart'
): Promise<CartResponse> => {
  // Safe localStorage access (for SSR compatibility)
  const guestId =
    typeof window !== 'undefined' ? localStorage.getItem('guestId') : null;

  try {
    const url = guestId ? `${endpoint}?guestId=${encodeURIComponent(guestId)}` : endpoint;
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
      // credentials: 'include', // Uncomment if using session cookies
    });

    if (!res.ok) {
      // Try to parse error message, fallback to status text
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch cart: ${res.status} ${res.statusText}`
      );
    }

    const cartItems: CartItem[] = await res.json();

    // Sum quantities
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return { totalItems, success: true, message: 'Cart fetched successfully' };
    
  } catch (error) {
    console.error('[FETCH_CART_ERROR]', error);
    throw error;
  }
};