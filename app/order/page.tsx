//app/orders/page.tsx
import {OrdersTable} from "@/app/ui/order/table";
import { Order } from "@/app/ui/order/table";
import CuratedSidebar from '@/components/curatedsidebar';
import { Suspense } from 'react';
import { OrdersSkeleton } from '@/components/skeletons';
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function OrdersPage() {
  // const res = await fetch(`/api/order?page=1`, {
  //   next: { revalidate: 30 },
  // });
  // const json = await res.json();
  // const orders: Order[] = json.data || [];
  // const totalPages = json.totalPages || 1;

  return (

        <CuratedSidebar
        main={
          <main className="flex-1 p-6 bg-gray-50">
            <SidebarTrigger />
              <Suspense  fallback={<OrdersSkeleton />}>
              {/* <OrdersTable orders={orders} totalPages={totalPages} /> */}
              <OrdersTable   />
              </Suspense>
            </main>
          }
        />
    
  );
}

// app/orders/page.tsx
// import CuratedSidebar from "@/components/curatedsidebar";
// import { Suspense } from "react";
// import { OrdersSkeleton } from "@/components/skeletons";
// import { OrdersTable } from "@/app/ui/order/table";

// export default function OrdersPage() {
//   return (
//     <CuratedSidebar
//       main={
//         <main className="flex-1 p-6 bg-gray-50">
//           <Suspense fallback={<OrdersSkeleton />}>
//             <OrdersTable />
//           </Suspense>
//         </main>
//       }
//     />
//   );
// }
