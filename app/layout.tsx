<<<<<<< HEAD
"use client";
=======
// "use client";
>>>>>>> dev-azaz

import "./globals.css";
import NavbarWrapper from "./navbarWrapper";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
<<<<<<< HEAD

  const pathname = usePathname();

 
  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/order");

  import("gsap/ScrollTrigger").catch(() => {});

  return (
    <html lang="en">
      <body className="antialiased">

        {!hideNavbar && (
          <>
            <NavbarWrapper />

            <div className="absolute z-50 -mt-1 top-1 no-print left-0 w-full bg-[#009395] text-white text-center py-2 px-5 flex justify-between">
              <p className="text-sm font-semibold">
                Buy 4 or more items and get <span className="underline">FREE DELIVERY</span>!
              </p>
              <p>for more information whatsapp on 0309-6237788</p>
            </div>
          </>
        )}

=======
  import("gsap/ScrollTrigger").catch(() => {});

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="abosolute z-50 top-1 left-0 w-full md:text-sm  text-[10px] bg-[#009395] text-white  text-center py-2 px-5 flex justify-between no-print">
          {/* <p className="text-sm font-semibold"> */}
            <p className="no-print">
            Buy 4 or more items and get{" "}
            <span className="underline">FREE DELIVERY</span>!
          </p>
          <p className="no-print">for more information whatsapp on 0309-6237788</p>
        </div>

        <NavbarWrapper />
>>>>>>> dev-azaz
        {children}
      </body>
    </html>
  );
}
