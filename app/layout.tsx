
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
          <div className="fixed z-50 top-0 left-0 w-full bg-[#009395] text-white text-center py-2">
  <p className="text-sm font-semibold">
    Buy 4 items and get <span className="underline">FREE DELIVERY</span>!
  </p>
</div>

          <NavbarWrapper />
          {children}
        </body>
      </html>
    );
}

