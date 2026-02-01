// app/orders/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Image from "next/image";
import CuratedSidebar from "@/components/curatedsidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ProductInItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string[];
  sku: string;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  color: string | null;
  size: number | null;
  product: ProductInItem;
}

interface OrderDetail {
  id: number;
  userId: number | null;
  guestId: string | null;
  firstName: string | null;
  lastName: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  // address: string;
  street: string;
  city: string;
  stateProvince: string;
  country: string | null;
  paymentMethod: string;
  shippingMethod: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

interface OrderUpdateData {
  status: string;
  paymentStatus: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderUpdateData>({
    status: "", paymentStatus: ""
  });

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/order/${orderId}`
        );

        if (!res.ok) {
          throw new Error(
            `Failed to fetch order: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        setOrder(data.order);

        setEditingOrder({
          status: data.order.status || "",
          paymentStatus: data.order.paymentStatus || ""
        });
      } catch (err) {
        console.error("Error fetching order:", err);
        setError((err as Error).message);
        toast.error("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Fix: This handles input change (not submission)
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  // const handleUpdateOrder = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const payload = {
  //       orderId: parseInt(orderId, 10),
  //       status: editingOrder.status,
  //     };

  //     const res = await fetch(`/api/order`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (res.ok){
  //       const response = JSON.parse(await res.text());
  //       setOrder(response);
  //     }

  //     if (!res.ok) {
  //       const errData = await res.json();
  //       throw new Error(errData.message);
  //     }

  //     const updatedOrder = await res.json();
  //     setOrder(updatedOrder);

  //     toast.success("Order status updated successfully!");
  //     setIsEditDialogOpen(false);
  //   } catch (error) {
  //     toast.error((error as Error).message);
  //   }
  // };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        orderId: parseInt(orderId, 10),
        status: editingOrder.status,
        paymentStatus: editingOrder.paymentStatus
      };

      const res = await fetch(`/api/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update order");
      }

      // ⬇️ Correct way: parse once
      const data = await res.json();

      // Your API returns: { order: {...} }
      const updatedOrder = data.order ?? data;

      // ⬇️ Update UI immediately without reload
      setOrder(updatedOrder);

      toast.success("Order status updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const buildImageUrl = (path: string) => {
    const base = `/api`;
    if (!base) return "/placeholder-image.jpg";
    return new URL(path, base).href;
  };

  const [deliveryCharges, setDeliveryCharges] = useState(0);

  useEffect(() => {
    if (order) {
      setDeliveryCharges(order.orderItems.length < 4 ? ((order.orderItems.length)*250) : 0)
    }
  }, [order]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-red-500">{error || "Order not found."}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <CuratedSidebar
      main={
        <main className="flex-1 p-4">
          <SidebarTrigger />

          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">Order #{order.id}</h1>

             <div className="flex justify-between items-start mb-6">
  {/* <h1 className="text-3xl font-bold"></h1> */}

  <div className="flex gap-2 no-print">
    <Button variant="outline" className="no-print" onClick={() => window.print()}>
      Print
    </Button>
    <Button variant="outline" className="no-print" onClick={() => setIsEditDialogOpen(true)}>
      Edit Status
    </Button>
  </div>
</div>

            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>SubTotal:</strong> Rs. {order.totalAmount}
                  </p>
                  <p>
                    <strong>Delivery Charges:</strong> Rs. {deliveryCharges}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs. {order.totalAmount + deliveryCharges}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    {order.paymentStatus }
                  </p>
                </CardContent>
              </Card>

              {/* Customer */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Name:</strong> {order.firstName} {order.lastName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phoneNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.street}{" "} {order.city},{" "} {order.stateProvince}, {order.country}
                  </p>
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="w-16 h-16 relative">
                        <img
                          src={item.product.image}
                          alt=""
                          // fill
                          className="object-contain overflow-hidden"
                        />
                      </div>

                      <div>
                        <p>{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                           {item.quantity} x {item.size}" : Rs.{item.price}
                        </p>
                      </div>

                      <div className="ml-auto font-semibold">
                        Rs. {item.quantity * item.price}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              

            </div>

            

            {/* --- Edit Status Dialog --- */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Order Status</DialogTitle>
                  <DialogDescription>
                    Change the order status and click save.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdateOrder} className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <select
                      name="status"
                      value={editingOrder.status}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                      required>
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                  <div>
                    <Label>Payment</Label>
                    <select
                      name="paymentStatus"
                      value={editingOrder.paymentStatus}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                      required>
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      }
    />
  );
}
