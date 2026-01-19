
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import '@/app/globals.css';

// ------------------ Types ------------------
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sku: string;
  rating: number;
  description: string;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  color: string | null;
  size: string | null;
  product: Product;
}

export interface Order {
  id: number;
  userId: number | null;
  guestId: string;
  firstName: string | null;
  lastName: string | null;
  totalAmount: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  address: string;
  shippingMethod: string;
  paymentMethod: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

interface OrdersResponse {
  data: Order[];
  totalOrders: number;
  currentPage: number;
  totalPages: number;
}

// ------------------ Utils ------------------
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (isoString: string): string => {
  return format(new Date(isoString), "MMM d, yyyy h:mm a");
};

const getStatusVariant = (status: Order["status"]) => {
  switch (status) {
    case "PENDING": return "secondary";
    case "SHIPPED": return "default";
    case "DELIVERED": return "outline";
    case "CANCELLED": return "destructive";
    default: return "secondary";
  }
};

// 🔍 Full-text search helper
const filterOrders = (orders: Order[], query: string): Order[] => {
  if (!query) return orders;
  const q = query.toLowerCase().trim();
  return orders.filter((order) => {
    const fullName = `${order.firstName || ""} ${order.lastName || ""}`.toLowerCase();
    const itemsText = order.orderItems.map(oi => oi.product.name).join(" ").toLowerCase();
    return (
      order.id.toString().includes(q) ||
      fullName.includes(q) ||
      (order.phoneNumber || "").toLowerCase().includes(q) ||
      itemsText.includes(q) ||
      order.status.toLowerCase().includes(q)
    );
  });
};

// ------------------ Component ------------------
interface OrdersTableProps {
orders: Order[];
totalPages: number;
}
export function OrdersTable() {



  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPageFromUrl = useMemo(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page, 10) : 1;
  }, [searchParams]);

  const searchQueryFromUrl = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    totalOrders: 0,
    currentPage: currentPageFromUrl,
    totalPages: 1,
  });
  const [searchQuery, setSearchQuery] = useState(searchQueryFromUrl);

  // 🔁 Keep URL in sync with state
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const needsUpdate = 
      parseInt(url.get("page") || "1") !== currentPageFromUrl ||
      url.get("search") !== searchQuery;

    if (needsUpdate) {
      url.set("page", String(currentPageFromUrl));
      if (searchQuery) url.set("search", searchQuery);
      else url.delete("search");
      router.replace(`${pathname}?${url.toString()}`);
    }
  }, [currentPageFromUrl, searchQuery, pathname, router]);

  const fetchOrders = async (page: number, search = "") => {
try {
  setLoading(true);

  const res = await fetch(`/api/order?page=${page}`);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json: OrdersResponse = await res.json();

  setOrders(json.data || []);
  setMeta({
    totalOrders: json.totalOrders ?? 0,
    currentPage: json.currentPage ?? page,
    totalPages: json.totalPages ?? 1,
  });
} catch (err) {
  console.error("[OrdersTable] Failed to load orders:", err);
  setError("Failed to load orders. Please try again.");
} finally {
  setLoading(false);
}
  };

  // 🔄 Fetch on URL param change
  useEffect(() => {
    fetchOrders(currentPageFromUrl, searchQuery);
  }, [currentPageFromUrl]);

  const onPageChange = (page: number) => {
    if (page < 1 || page > meta.totalPages) return;
    const url = new URLSearchParams(window.location.search);
    url.set("page", String(page));
    if (searchQuery) url.set("search", searchQuery);
    else url.delete("search");
    router.push(`${pathname}?${url.toString()}`);
  };

  const onSearch = (query: string) => {
    setSearchQuery(query);
    // Reset to page 1 on new search
    const url = new URLSearchParams(window.location.search);
    url.set("page", "1");
    if (query) url.set("search", query);
    else url.delete("search");
    router.push(`${pathname}?${url.toString()}`);
  };

  // 🔍 Apply client-side filtering (since API likely doesn’t support search yet)
  const filteredOrders = useMemo(() => filterOrders(orders, searchQuery), [orders, searchQuery]);

// const printTable = () => {
//   const tableElement = document.querySelector(
//     '.hidden.md\\:block.overflow-x-auto'
//   ) as HTMLElement | null;

//   if (!tableElement) {
//     alert('Table not found!');
//     return;
//   }

//   const printWindow = window.open('', '_blank');
//   if (!printWindow) {
//     alert('Please allow popups for printing');
//     return;
//   }

//   const doc = printWindow.document;

//   // Create basic structure
//   const html = doc.documentElement || doc.createElement('html');
//   doc.appendChild(html);

//   // Head
//   const head = doc.createElement('head');
//   html.appendChild(head);

//   // Title
//   const title = doc.createElement('title');
//   title.textContent = 'Orders Report';
//   head.appendChild(title);

//   // Inject globals.css (must be in public folder)
//   const link = doc.createElement('link');
//   link.rel = 'stylesheet';
//   link.href = '/print.css'; 
//   head.appendChild(link);

//   // Custom print styles
//   const style = doc.createElement('style');
//   style.textContent = `
//     body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
//     table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//     th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//     th { background-color: #f2f2f2; }
//     .text-right { text-align: right; }
//     .text-center { text-align: center; }
//     @media print {
//       button, .no-print { display: none !important; }
//     }
//   `;
//   head.appendChild(style);

//   // Body
//   const body = doc.createElement('body');
//   html.appendChild(body);

//   // Header
//   const headerDiv = doc.createElement('div');
//   headerDiv.style.display = 'flex';
//   headerDiv.style.justifyContent = 'space-between';
//   headerDiv.style.alignItems = 'center';
//   headerDiv.innerHTML = `
//     <h2>Orders Report</h2>
//     <p>${new Date().toLocaleString()}</p>
//   `;
//   body.appendChild(headerDiv);

//   // Table container
//   const container = doc.createElement('div');
//   container.id = 'table-container';
//   body.appendChild(container);

//   // Clone table into print window
//   container.appendChild(tableElement.cloneNode(true));

//   // Wait a moment for styles to load
//   printWindow.focus();
//   printWindow.print();
//   printWindow.close();
// };

const printTable = () => {
  const tableElement = document.querySelector(
    '.hidden.md\\:block.overflow-x-auto'
  ) as HTMLElement | null;

  if (!tableElement) {
    alert('Table not found!');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for printing');
    return;
  }

  const doc = printWindow.document;

  // Clear any existing content
  doc.open();
  doc.write('<!DOCTYPE html>');
  doc.close();

  // Add CSS
  const link = doc.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/globals.css'; // Must be public folder
  doc.head.appendChild(link);

  const style = doc.createElement('style');
  style.textContent = `
    body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    @media print {
      button, .no-print { display: none !important; }
    }
  `;
  doc.head.appendChild(style);

  // Add header
  const headerDiv = doc.createElement('div');
  headerDiv.style.display = 'flex';
  headerDiv.style.justifyContent = 'space-between';
  headerDiv.style.alignItems = 'center';
  headerDiv.innerHTML = `
    <h2>Orders Report</h2>
    <p>${new Date().toLocaleString()}</p>
  `;
  doc.body.appendChild(headerDiv);

  // Table container
  const container = doc.createElement('div');
  container.id = 'table-container';
  doc.body.appendChild(container);

  // Clone table
  container.appendChild(tableElement.cloneNode(true));

  printWindow.focus();
  printWindow.print();
  printWindow.close();
};


  // --- UI Rendering ---
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">{error}</div>
        <Button variant="outline" onClick={() => fetchOrders(currentPageFromUrl, searchQuery)}>
          Retry
        </Button>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-12">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search orders (ID, name, phone, items, status)..."
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full text-black"
          />
        </div>
      </div>
        <div className="text-muted-foreground">No orders match your search.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Search Bar (identical to ProductTable) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search orders (ID, name, phone, items, status)..."
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full text-black"
          />
        </div>
          <Button onClick={printTable} variant="default" size="sm" className="no-print"> Print Table </Button>

      </div>

      {/* Mobile: Card Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">
                    {order.firstName || order.lastName
                      ? `${order.firstName || ""} ${order.lastName || ""}`.trim()
                      : "Guest"}
                  </p>
                  {order.phoneNumber && (
                    <p className="text-sm text-muted-foreground">{order.phoneNumber}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
                  <ul className="text-sm space-y-1">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-muted-foreground">
                          {item.quantity} x {'Rs. '+(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">{'Rs. '+(order.totalAmount)}</p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/order/${order.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto rounded-md border print-area">

        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-left">Order</TableHead>
              <TableHead className="w-1/6 text-left">Date</TableHead>
              <TableHead className="w-1/6 text-left">Customer</TableHead>
              <TableHead className="w-1/6 text-left">Items</TableHead>
              <TableHead className="w-1/10 text-left">Size</TableHead>
              <TableHead className="w-1/8 text-left">Color</TableHead>
              <TableHead className="w-1/12 text-left">Total</TableHead>
              <TableHead className="w-1/12 text-left">Payment Method</TableHead>
              <TableHead className="w-1/6 text-left">Status</TableHead>
              <TableHead className="w-1/6 text-left no-print">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-left">{order.id}</TableCell>
                <TableCell className="text-sm text-muted-foreground text-left">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-left">
                  <div>{order.phoneNumber || "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.firstName || order.lastName
                      ? `${order.firstName || ""} ${order.lastName || ""}`.trim()
                      : "Guest"}
                  </div>
                </TableCell>
                {/* <TableCell className="text-left">
                  <div className="text-sm max-w-xs truncate">
                    {order.orderItems.length === 0
                      ? "—"
                      : order.orderItems.map((oi) => oi.product.name).join(", ")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                  </div>
                </TableCell> */}

                <TableCell className="text-left">
                  <div className="text-sm max-w-xs truncate">
                    {order.orderItems.length === 0
                      ? "—"
                      : order.orderItems.map((oi) => oi.product.name).join(", ")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(() => {
                      const totalQty = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
                      return `${totalQty} ${totalQty === 1 ? "item" : "items"}`;
                    })()}
                  </div>
                </TableCell>
                
                <TableCell className="text-left">
                  <div className="text-sm max-w-xs truncate">
                    {order.orderItems.length === 0
                      ? "—"
                      : order.orderItems.map((oi) => oi.size || "—").join(", ")}
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="text-sm max-w-xs truncate">
                    {order.orderItems.length === 0
                      ? "—"
                      : order.orderItems.map((oi) => oi.color || "—").join(", ")}
                  </div>
                </TableCell>
                <TableCell className="text-left font-medium">
                  {'Rs. '+(order.totalAmount)}
                </TableCell>
                <TableCell className="text-left">
                  {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                </TableCell>
                <TableCell className="text-left">
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right no-print">
                  <Button asChild size="sm" variant="default" className="no-print">
                    <Link href={`/order/${order.id}`}  className="no-print">View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (✅ Fixed) */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing{" "}
            {(meta.currentPage - 1) * 10 + 1}{" "}
            to{" "}
            {Math.min(meta.currentPage * 10, meta.totalOrders)}{" "}
            of {meta.totalOrders} orders
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={meta.currentPage <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.currentPage - 1)}
              disabled={meta.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {meta.currentPage} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.currentPage + 1)}
              disabled={meta.currentPage >= meta.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.totalPages)}
              disabled={meta.currentPage >= meta.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}