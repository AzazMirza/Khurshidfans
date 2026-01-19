// app/ui/orders/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Order } from "@/app/ui/order/table";

// Utils
const formatDate = (isoString: string): string => {
  return format(new Date(isoString), "MMM d, yyyy");
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order #",
    cell: ({ row }) => <span>#{row.getValue("id")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const { firstName, lastName, phoneNumber } = row.original;
      const name = [firstName, lastName].filter(Boolean).join(" ") || "Guest";
      return (
        <div>
          <div className="font-medium">{name}</div>
          {phoneNumber && (
            <div className="text-xs text-muted-foreground">{phoneNumber}</div>
          )}
        </div>
      );
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.orderItems;
      return (
        <div className="text-sm max-w-xs truncate">
          {items.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            items.map((oi) => oi.product.name).join(", ")
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.getValue("totalAmount"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="text-right">
        <Button asChild size="sm" variant="default">
          <Link href={`/order/${row.original.id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];