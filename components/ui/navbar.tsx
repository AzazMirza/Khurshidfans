"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NavMenu } from "@/components/ui/nav-menu";
import { NavigationSheet } from "@/components/ui/navigation-sheet";
import { ThemeColors, DEFAULT_THEME } from "@/lib/theme";
import { ShoppingCart } from "lucide-react";
import Logo from "@/public/images/khurshid fans logo.svg"; 
import Image from "next/image";
import { fetchCart } from "@/app/lib/cart";

// const colorsPromise = fetch('/theme')
//   .then(response => response.json())
//   .then(data => data?.pr && data?.se ? data : DEFAULT_THEME)
//   .catch(() => DEFAULT_THEME);

const Navbar04Page = () => {
  const [scrolled, setScrolled] = useState(false);
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_THEME); // ✅ no null
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isClient, setIsClient] = useState(false); // 👈 NEW

  useEffect(() => {
    setIsClient(true); // Only true on client
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    // Load theme colors
    // colorsPromise.then(data => setColors(data));

    // Handle scroll
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // Load cart
    const loadCart = async () => {
      const { totalItems } = await fetchCart();
      setCartQuantity(totalItems);
    };
    loadCart();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-transparent no-print">
      <nav
        className={`fixed top-10  inset-x-4 mx-auto  rounded-full border transition-all duration-500 ease-in-out z-50 ${
          scrolled
            ? 'h-16 max-w-[900px] border-white/30 shadow-xl backdrop-blur-md bg-[#009395]/80'
            : 'h-16 max-w-[1200px] border-transparent shadow-none backdrop-blur-0 bg-[#009395]'
        }`}
      >
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <a href="/">
            <Image
              src={Logo}
              alt="Khurshid Fans Logo"
              width={120}   // ✅ add actual dimensions
              height={40}
              className="pl-3 sm:pl-5"
              priority
            />
          </a>
          {isClient ? (
            <>
            
            <NavMenu className="hidden md:block" />
          
          <span className="flex gap-3">
            <Link
              href="/listing/checkout"
              className="h-9 w-9 p-0 hover:bg-white/10 rounded-full transition-all relative group"
            >
              <ShoppingCart className="h-9 w-9 text-white hover:scale-110" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <span className="md:hidden">
              <NavigationSheet />
            </span>
          </span>
          </>
          ) : (
            <span className="md:hidden">
                          <Link
              href="/listing/checkout"
              className="h-9 w-9 p-0 hover:bg-white/10 rounded-full transition-all relative group"
            >
              <ShoppingCart className="h-9 w-9 text-white hover:scale-110" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {cartQuantity}
                </span>
              )}
            </Link>

              <NavigationSheet />
            </span>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar04Page;