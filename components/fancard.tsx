"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TiltCard } from "./TiltCard";

export default function FeatureProducts() {
  const fans = [
    { title: "False Ceiling Fans", img: "/images/false.webp", link: `/catalogue?category=${encodeURIComponent('False Ceiling')}` },
    { title: "Pedestal Fans", img: "/images/Pedestal.webp", link: `/catalogue?category=${encodeURIComponent('Pedestal Fans')}` },
    { title: "Exhaust Fans", img: "/images/exhaust.webp", link: `/catalogue?category=${encodeURIComponent('Exhaust Fans')}` },
    { title: "Bracket Fans", img: "/images/bracket.webp", link: `/catalogue?category=${encodeURIComponent('Bracket Fans')}` },
  ];

  const astroFan = {
    title: "Ceiling Fans",
    img: "/images/astro.webp",
    link: `/catalogue?category=${encodeURIComponent('Ceiling Fans')}`,
  };

  return (
    <section className="z-10">
      {/* Outer container with background & shadow */}
      <div className="bg-gray-100 p-8 md:p-12  lg:p-16">
        {/* Heading inside the background */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Product Catagories
        </h2>

        <div className="flex flex-col-reverse md:flex-row  lg:pl-24 lg:pr-16 gap-10 items-stretch">
          {/* Left div → 4 small cards in 2x2 grid */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {fans.map((fan, idx) => (
              <TiltCard key={idx} className="w-full">
                <Link key={idx} href={fan.link} className="w-full h-full">

                <Card
                  className=" flex flex-col items-center justify-center rounded-xl 
                          shadow-[2px_3px_6px_var(--nav-color)]      /* mobile */
                          sm:shadow-[2px_3px_6px_var(--nav-color)]   /* small screens */
                          md:shadow-[2px_3px_6px_var(--nav-color)]   /* tablets */
                          lg:shadow-[2px_3px_6px_var(--nav-color)]   /* desktops */
                          hover:shadow-[3px_4px_8px_var(--nav-color)]
                          active:shadow-[4px_5px_6px_var(--nav-color)] 
                          transition h-40 sm:h-48 md:h-56 lg:h-64 z-0 cursor-pointer">
                  <CardContent className="flex flex-col items-center ">
                    <img
                      src={fan.img}
                      alt={fan.title}
                      width={200}
                      height={200}
                      className="object-contain max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-56"
                    />
                    <h3 className="text-sm sm:text-base md:text-lg text-center font-medium">
                      {fan.title}
                    </h3>
                  </CardContent>
                </Card>
                </Link>
              </TiltCard>
            ))}
          </div>

          {/* Right div → Astro Fan card (same height as left side) */}
          <div className="flex-1 flex">
            <TiltCard className="w-full">
                <Link  href={astroFan.link} className="w-full h-full">

              <Card
                className="
              flex flex-col items-center justify-between rounded-xl 
              shadow-[2px_2px_6px_var(--nav-color)]
              sm:shadow-[2px_3px_6px_var(--nav-color)]
              md:shadow-[2px_3px_6px_var(--nav-color)]
              lg:shadow-[2px_3px_6px_var(--nav-color)]
              hover:shadow-[3px_4px_8px_var(--nav-color)]
              transition w-full z-0 
              h-auto min-h-[400px] sm:min-h-[453px] md:min-h-[500px] lg:min-h-[550px]">
                <CardContent className="flex flex-col items-center justify-center gap-4 pt-12 flex-1">
                  <img
                    src="/images/astro.webp"
                    alt="Astro Fans"
                    width={800}
                    height={800}
                    className="object-contain max-h-60 sm:max-h-60 md:max-h-72 lg:max-h-80"
                  />
                  <h3 className="text-4xl font-bold">Ceiling Fans</h3>
                </CardContent>
              </Card>
              </Link>
            </TiltCard>
          </div>
        </div>
        <div className="flex justify-center mt-10">
            <Link href="/catalogue" className="w-full max-w-xs">
              <Button className="w-full bg-[var(--gold-btn-color)] text-black 
                                hover:bg-[var(--gold-btn-hover)] active:bg-[var(--gold-btn-hover)]
                                px-8 py-6 text-xl font-bold">
                View All Products
              </Button>
            </Link>
          </div>
      </div>
    </section>
  );
}
