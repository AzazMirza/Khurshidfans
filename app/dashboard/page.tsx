"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CuratedSidebar from "@/components/curatedsidebar";

// export default function Dashboard() {
export default function Dashboard() {
  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const oredrres = await fetch("/api/order?page=1");
        const oredrdata = await oredrres.json();
        // from your existing API
        setTotalOrders(oredrdata.totalOrders);
      } catch (error) {
        console.error("Failed to fetch Total Orders", error);
      }
    };

    fetchOrdersCount();
  }, []);

  const [totalusers, setTotalUsers] = useState<number | null>(null);
 useEffect(() => {
  const fetchUserCount = async () => {
      try {
        const userres = await fetch("/api/user?page=1");
        const userdata = await userres.json();
        // from your existing API
        setTotalUsers(userdata.totalUsers);
      } catch (error) {
        console.error("Failed to fetch Total Users", error);
      }
    };

    fetchUserCount();
  }, []);
  
  const [totalproducts, setTotalProducts] = useState<number | null>(null);

useEffect(() => {
  const fetchProductCount = async () => {
    try {
      const productres = await fetch("/api/products?page=1");
      const productdata = await productres.json();

      setTotalProducts(productdata.totalProds); 
    } catch (error) {
      console.error("Failed to fetch Total products", error);
    }
  };

  fetchProductCount();
}, []);


  return (
    <CuratedSidebar
      main={
        <main className="flex-1 p-4 ">
          <div className="mb-4">
            <SidebarTrigger />
          </div>
          <div className="flex justify-around flex-wrap gap-6 md:flex-nowrap">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Users</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                  Total Users:{" "}
                  {totalusers === null ? "Loading..." : totalusers}
                </p>
                  {/* <Badge variant="default">NEW</Badge> */}
                </div>
                <Link href="/user" className="w-full">
                  <Button variant="outline" className="w-full">
                    View all users
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Products</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                  Total Products:{" "}
                  {totalproducts === null ? "Loading..." : totalproducts}
                </p>
                  {/* <Badge variant="default">NEW</Badge> */}
                </div>
                <Link href="/products" className="w-full">
                  <Button variant="outline" className="w-full">
                    View all products
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Orders</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                  Total orders:{" "}
                  {totalOrders === null ? "Loading..." : totalOrders}
                </p>
                  {/* <Badge variant="default">NEW</Badge> */}
                </div>
                <Link href="/order" className="w-full">
                  <Button variant="outline" className="w-full">
                    View all orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      }
    />
  );
}
