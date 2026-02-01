"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeatureProducts() {
  const fans = [
    {
      id: 1,
      title: "Majesty Fans",
      imgDesktop: "/images/slide.webp",
      imgMobile: "/images/1a.webp",
      link: "/catalogue",
    },
    {
      id: 2,
      title: "Astro Fans",
      imgDesktop: "/images/slide2.webp",
      imgMobile: "/images/2a.webp",
      link: "/catalogue",
    },
    {
      id: 3,
      title: "Nitro Fans",
      imgDesktop: "/images/slide3.webp",
      imgMobile: "/images/3a.webp",
      link: "/catalogue",
    },
    {
      id: 4,
      title: "Majesty Fans",
      imgDesktop: "/images/slide4.webp",
      imgMobile: "/images/4a.webp",
      link: "/catalogue",
    },
    {
      id: 5,
      title: "Astro Fans",
      imgDesktop: "/images/slide5.webp",
      imgMobile: "/images/5a.webp",
      link: "/catalogue",
    },
    {
      id: 6,
      title: "Nitro Fans",
      imgDesktop: "/images/slide6.webp",
      imgMobile: "/images/6a.webp",
      link: "/catalogue",
    },
  ];

  const [inView, setInView] = useState(false);

  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setInView(true);
    },
    { threshold: 0.2 }
  );

  const el = document.getElementById("feature-products-section");

  if (el) {
    observer.observe(el);
  }

  return () => {
    if (el) {
      observer.unobserve(el);
    }
  };
}, []);


  return (
    <section id="feature-products-section" className="mt-24">
      <div
        className={`p-2 md:p-3 lg:p-4 transition-opacity duration-700 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          speed={1500}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          loop={fans.length > 1}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 250,
            modifier: 1,
            slideShadows: true,
          }}
        >
          {fans.map((fan) => (
            <SwiperSlide
              key={fan.id}
              className="w-[92vw] sm:w-[80vw] lg:w-[1600px]"
            >
              <Link href={fan.link} className="block rounded-2xl">
                <Card className="rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white">
                  <CardContent className="p-0">
                    {/* Desktop Image */}
                    <img
                      src={fan.imgDesktop}
                      alt={fan.title}
                      className="hidden sm:block w-full object-contain"
                    />

                    {/* Mobile Image */}
                    <img
                      src={fan.imgMobile}
                      alt={fan.title}
                      className="block sm:hidden w-full object-contain"
                    />
                  </CardContent>
                </Card>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
