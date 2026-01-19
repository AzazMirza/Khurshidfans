import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

// Define TypeScript interface for cart items
interface CartItem {
  id: number;
  quantity: number;
  color: string;
  size: string;
  name: string;
  price: number;
  image: string;
  productId: number;
  sku: string;
}
interface CartSidebarProps {
  open?: boolean; // optional controlled open state
  onOpenChange?: (open: boolean) => void; // optional callback
}
interface CartSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Determine final open state
  const isControlled = open !== undefined;
  const drawerOpen = isControlled ? open : isOpen;
  const setDrawerOpen = isControlled ? onOpenChange ?? (() => {}) : setIsOpen;


  // Fetch cart data
  useEffect(() => {
    // Simulate API fetch
    const fetchCart = async () => {
      try {
        // In production:
        const userId = localStorage.getItem("userId");
        const guestId = localStorage.getItem("guestId");
        const url = userId
          ? `/api/cart?userId=${userId}`
          : `/api/cart?guestId=${guestId}`;
        const res = await fetch(url);
        const data = await res.json();

        setCartItems(
          data.map((item: any) => ({
            id: item.id,
            userId: item.userId,
            guestId: item.guestId,
            productId: item.productId,
            size: item.size,
            color: item.color,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            name: item.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  // Use controlled prop if provided, otherwise use local state
  // const isOpen = controlledOpen ?? uncontrolledOpen;
  // const setIsOpen = onOpenChange ?? setUncontrolledOpen;

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          🛒
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[85vh] mx-auto max-w-md">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Your Cart ({totalItems})</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-destructive text-center py-8">{error}</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <>
              <ScrollArea className="h-[calc(85vh-200px)] pr-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {item.color} • Size {item.size}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Badge variant="secondary">Qty: {item.quantity}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <Button className="w-full">Proceed to Checkout</Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}