// "use client";

import "./globals.css";
import NavbarWrapper from "./navbarWrapper";
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        {children}
      </body>
    </html>
  );
}
