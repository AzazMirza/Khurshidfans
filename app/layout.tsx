
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
          <NavbarWrapper />
          {children}
        </body>
      </html>
    );
}

