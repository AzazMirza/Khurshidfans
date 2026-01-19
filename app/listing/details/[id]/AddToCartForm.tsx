// 'use client';

// import { useState, FormEvent, useRef, useEffect } from 'react';
// import { addToCart } from '@/app/lib/cart';
// import { Product, CartItem, CartResponse } from '@/app/types';
// import { useCartStore } from '@/app/lib/cart-store';

// // ✅ CUSTOM COLOR SELECTOR (embedded for simplicity)
// interface ColorComboSelectorProps {
//   value: string;
//   onChange: (value: string) => void;
//   colorOpts: string[];
//   placeholder?: string;
// }

// function ColorComboSelector({
//   value,
//   onChange,
//   colorOpts,
//   placeholder = 'Select a color combo',
// }: ColorComboSelectorProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const getGradientStyle = (opt: string) => {
//     const [c1, c2] = opt.trim().split(/\s+/);
//     if (!c1 || !c2) return {};
//     return {
//       background: `linear-gradient(to bottom right, var(--color-${c1}) 0%, var(--color-${c1}) 49%, var(--color-${c2}) 51%, var(--color-${c2}) 100%)`,
//     };
//   };

//   return (
//     <div className="relative w-full" ref={containerRef}>
//       <button
//         type="button"
//         className="w-full flex items-center gap-3 px-3 py-2 border rounded-md bg-background text-foreground text-left shadow-sm hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {value ? (
//           <>
//             <span
//               className="w-10 h-7 rounded-4xl border border-black/20 shrink-0"
//               style={getGradientStyle(value)}
//               aria-hidden="true"
//             />
//             <span className="text-sm">{value}</span>
//           </>
//         ) : (
//           <span className="text-sm text-muted-foreground">{placeholder}</span>
//         )}
//       </button>

//       {isOpen && (
//         <ul className="absolute z-10 mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-48 overflow-auto py-1">
//           {colorOpts.map((opt) => (
//             <li
//               key={opt}
//               className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm transition-colors ${
//                 value === opt ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
//               }`}
//               onClick={() => {
//                 onChange(opt);
//                 setIsOpen(false);
//               }}
//             >
//               <span
//                 className="w-10 h-7 rounded-4xl border border-black/20 shrink-0"
//                 style={getGradientStyle(opt)}
//                 aria-hidden="true"
//               />
//               <span>{opt}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// // ✅ MAIN FORM COMPONENT
// export default function AddToCartForm({ product }: { product: Product }) {
//   const [theme, setTheme] = useState({
//     pr: '#009395',
//     se: '#fef200',
//     tx: '#000000',
//     bg: '#eeeeee',
//   });
//   const [quantity, setQuantity] = useState<number>(1);
//   const { addItem } = useCartStore();
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   const getOptions = (val: unknown): string[] => {
//     if (Array.isArray(val)) return val.map(String);
//     if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
//     if (typeof val === 'number') return [String(val)];
//     return val ? [String(val)] : [];
//   };

//   const colorOpts = getOptions(product.color);
//   const sizeOpts = getOptions(product.size);
//   const speedOpts = getOptions(product.productDetails.speedLevels);
//   const bladeOpts = getOptions(product.productDetails.blades);

//   const [color, setColor] = useState<string>(colorOpts[0] || '');
//   const [size, setSize] = useState<string | number>(sizeOpts[0] || '');
//   const [speed, setSpeed] = useState<string | number>(speedOpts[0] || '');
//   const [blades, setBlades] = useState<string | number>(bladeOpts[0] || '');

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setMessage(null);

//     const payload = {
//       productId: product.id,
//       quantity,
//       color,
//       size,
      
//     };

    
//     const CartItem: CartItem = {
//       id: 0, // will be set by API
//       productId: product.id,
//       name: product.name,
//       price: product.price,
//       quantity,
//       image: product.image,
//       sku: product.sku,
//       size: size,
//       color: color,
//       // attributes: {
//       //   speedLevel: speed,
//       //   blades: blades,
//       // },
//       userId: null,  // guest/user handling done by API
//       guestId: null,
//       // guestId/userId added by API layer
//     };

//     try {
//       const result = await addToCart(CartItem);
//       console.log('Add to Cart Result:', result);
//             if (result.success) {
//         addItem({
//           ...CartItem,
//           id: result.CartItem.id, // use real DB ID
//           userId: result.CartItem.userId || null,
//           guestId: result.CartItem.guestId || null,
//         });

//         // Show success, open cart, etc.
//         setMessage({ type: 'success', text: result.message || 'Added to cart!' });
//       }

//       // <Navbar04Page quantity={result.cartItem.quantity} />

//       if (result.guestId && !localStorage.getItem('guestId')) {
//         localStorage.setItem('guestId', result.guestId);
//       }

//       setIsCartOpen(true);
//       setTimeout(() => setMessage(null), 3000);
//     } catch (err: any) {
//       setMessage({
//         type: 'error',
//         text: err.message || 'Failed to add item. Please try again.',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Quantity */}
//         <div className="flex items-center gap-2">
//           <label className="text-sm font-medium">Qty:</label>
//           <button
//             type="button"
//             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//             className="w-8 h-8 rounded border flex items-center justify-center"
//             disabled={quantity <= 1}
//           >
//             −
//           </button>
//           <span className="w-10 text-center">{quantity}</span>
//           <button
//             type="button"
//             onClick={() => setQuantity(quantity + 1)}
//             className="w-8 h-8 rounded border flex items-center justify-center"
//           >
//             +
//           </button>
//         </div>

//         {/* ✅ REPLACED: Color Selector */}
//         {colorOpts.length > 0 && (
//           <div>
//             <label className="block text-sm font-medium mb-1">Select Color:</label>
//             <ColorComboSelector
//               value={color}
//               onChange={setColor}
//               colorOpts={colorOpts}
//               placeholder="Choose color combo"
//             />
//           </div>
//         )}

//         {/* Size */}
//         {sizeOpts.length > 0 && (
//           <div>
//             <label className="block text-sm font-medium mb-1">Select Size:</label>
//             <select
//               value={size}
//               onChange={(e) => setSize(e.target.value)}
//               className="w-full p-2 border rounded"
//             >
//               {sizeOpts.map((opt) => (
//                 <option key={opt} value={opt}>
//                   {opt}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           style={{ backdropFilter: `blur(10px)`, backgroundColor: `${theme.pr}` }}
//           className={`w-full py-3 px-4 rounded font-semibold ${
//             isSubmitting
//               ? 'bg-gray-300 cursor-not-allowed border-white border-2'
//               : 'bg-black text-white hover:bg-gray-800 border-white border'
//           }`}
//         >
//           {isSubmitting ? 'Adding…' : 'Add to Cart'}
//         </button>

//         {/* Feedback */}
//         {message && (
//           <div
//             className={`p-2 text-sm rounded ${
//               message.type === 'success'
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-red-100 text-red-800'
//             }`}
//           >
//             {message.text}
//           </div>
//         )}
//       </form>

//       {/* <CartSidebar open={isCartOpen} onOpenChange={setIsCartOpen} /> */}
//     </>
//   );
// }




"use client";

import { useState, FormEvent, useEffect, useRef } from 'react';
import { addToCart } from '@/app/lib/cart'; // your API function
import { useCartStore } from '@/app/lib/cart-store'; // your Zustand store
import { Product, CartItem } from '@/app/types';

interface ColorComboSelectorProps {
  value: string;
  onChange: (value: string) => void;
  colorOpts: string[];
  placeholder?: string;
}

function ColorComboSelector({
  value,
  onChange,
  colorOpts,
  placeholder = 'Select a color combo',
}: ColorComboSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getGradientStyle = (opt: string) => {
    const [c1, c2] = opt.trim().split(/\s+/);
    if (!c1 || !c2) return {};
    return {
      background: `linear-gradient(to bottom right, var(--color-${c1}) 0%, var(--color-${c1}) 49%, var(--color-${c2}) 51%, var(--color-${c2}) 100%)`,
    };
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        className="w-full flex items-center gap-3 px-3 py-2 border rounded-md bg-background text-foreground text-left shadow-sm hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <>
            <span
              className="w-10 h-7 rounded-4xl border border-black/20 shrink-0"
              style={getGradientStyle(value)}
              aria-hidden="true"
            />
            <span className="text-sm">{value}</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">{placeholder}</span>
        )}
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-48 overflow-auto py-1">
          {colorOpts.map((opt) => (
            <li
              key={opt}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm transition-colors ${
                value === opt ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              }`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              <span
                className="w-10 h-7 rounded-4xl border border-black/20 shrink-0"
                style={getGradientStyle(opt)}
                aria-hidden="true"
              />
              <span>{opt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// Helper to safely parse options
const getOptions = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  if (typeof val === 'number') return [String(val)];
  return val ? [String(val)] : [];
};



export default function AddToCartForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addItem } = useCartStore();
  const colorOpts = getOptions(product.color);
  const [color, setColor] = useState<string>(colorOpts[0] || '');
  
  // Parse size options
let sizeOpts: string[] = [];

if (Array.isArray(product.pricesBySize) && product.pricesBySize.length > 0) {
  sizeOpts = Array.from(
    new Set(product.pricesBySize.map(p => p.split(':')[0]))
  ).filter(Boolean);
} else if (product.size) {
  sizeOpts = getOptions(product.size); // your original logic
}  const [size, setSize] = useState<string>(sizeOpts[0] || '');

  // Compute dynamic price from pricesBySize
  const [currentPrice, setCurrentPrice] = useState<number>(product.price);

  // Parse pricesBySize on product load
  useEffect(() => {
    const priceMap: Record<string, number> = {};
    if (Array.isArray(product.pricesBySize)) {
      product.pricesBySize.forEach(pair => {
        if (typeof pair === 'string') {
          const [sizeKey, priceStr] = pair.split(':');
          const priceNum = Number(priceStr);
          if (!isNaN(priceNum)) {
            priceMap[sizeKey] = priceNum;
          }
        }
      });
    }

    // Set initial price
    const initialSize = sizeOpts[0] || '';
    const initialPrice = priceMap[initialSize] ?? product.price;
    setCurrentPrice(initialPrice);
    setSize(initialSize);
  }, [product]);

  // Update price when size changes
  useEffect(() => {
    const priceMap: Record<string, number> = {};
    if (Array.isArray(product.pricesBySize)) {
      product.pricesBySize.forEach(pair => {
        if (typeof pair === 'string') {
          const [sizeKey, priceStr] = pair.split(':');
          const priceNum = Number(priceStr);
          if (!isNaN(priceNum)) {
            priceMap[sizeKey] = priceNum;
          }
        }
      });
    }

    const newPrice = priceMap[size] ?? product.price;
    setCurrentPrice(newPrice);
  }, [size, product]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const CartItem: CartItem = {
      id: 0, // will be replaced by API
      productId: product.id,
      name: product.name,
      price: currentPrice, // ✅ Dynamic price
      quantity,
      image: product.image,
      sku: product.sku,
      size, // ✅ Selected size
      color, // fallback for now
      userId: null,
      guestId: null,
      attributes: {},
    };

    try {
      const result = await addToCart(CartItem);

      if (result.success && result.CartItem) {
        
        addItem({
          ...CartItem,
          id: result.CartItem.id,
          userId: result.CartItem.userId || null,
          guestId: result.CartItem.guestId || null,
        });

        console.log('Add to Cart Result:', result);

        // Store guestId/userId in localStorage

        if (result.CartItem.userId) {
          localStorage.setItem('userId', String(result.CartItem.userId));
        } else if (result.CartItem.guestId) {
          localStorage.setItem('guestId', String(result.CartItem.guestId));
        }

        console.log('Stored IDs in localStorage',localStorage.getItem('userId'), localStorage.getItem('guestId'));

        setMessage({ type: 'success', text: result.message || 'Added to cart!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error(result.message || 'Unknown error');
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to add item. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Price */}
      <div className="text-3xl font-bold">
        Rs. {currentPrice.toLocaleString('en-IN')}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Qty:</label>
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-8 h-8 rounded border flex items-center justify-center"
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className="w-10 text-center">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className="w-8 h-8 rounded border flex items-center justify-center"
        >
          +
        </button>
      </div>

              {colorOpts.length > 0 && (
              <div>
              <label className="block text-sm font-medium mb-1">Select Color:</label>
                <ColorComboSelector
                value={color}
                onChange={setColor}
                colorOpts={colorOpts}
                placeholder="Choose color combo"
              />
            </div>
          )}


      {/* Size Selector */}
      {sizeOpts.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Size:</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-2 border rounded">
            {sizeOpts.map(opt => (
              <option key={opt} value={opt}>
                {opt}"
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded font-semibold ${
          isSubmitting
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isSubmitting ? 'Adding…' : 'Add to Cart'}
      </button>

      {/* Feedback */}
      {message && (
        <div
          className={`p-2 text-sm rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}