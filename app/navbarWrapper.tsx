"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/order");

  if (hideNavbar) return null;
  return <Navbar quantity={0} />;
}
