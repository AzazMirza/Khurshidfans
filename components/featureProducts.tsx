"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TiltCard } from "./ui/TiltCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeatureProducts() {
  const fans = [
    { id: 1, title: "Majesty Fans", img: "/images/slide.webp", link: "/catalogue" },
    { id: 2, title: "Astro Fans", img: "/images/slide2.webp", link: "/catalogue" },
    { id: 3, title: "Nitro Fans", img: "/images/slide3.webp", link: "/catalogue" },
    { id: 4, title: "Majesty Fans", img: "/images/slide4.webp", link: "/catalogue" },
    { id: 5, title: "Astro Fans", img: "/images/slide5.webp", link: "/catalogue" },
    { id: 6, title: "Nitro Fans", img: "/images/slide6.webp", link: "/catalogue" },
  ];

  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    const el = document.getElementById("feature-products-section");
    if (el) observer.observe(el);
    // return () => el && observer.unobserve(el);
      return () => {
    if (el) observer.unobserve(el); // explicitly void
  };

  }, []);

  return (
    <section id="feature-products-section" className="mt-18">
      <div className={`h-min p-2 md:p-3 lg:p-4 transition-opacity duration-700 ${inView ? "opacity-100" : "opacity-0"}`}>
        {/* <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Feature Products</h2> */}

        {/* Swiper Coverflow */}
        <div className=" ">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            speed={1500}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 250,
              modifier: 1,
              slideShadows: true,
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            loop={fans.length > 1}
            className=""
          >
            {fans.map((fan) => (
              <SwiperSlide
                key={fan.id}
                style={{ maxWidth: "1920px", width: "1600px", height: "auto" }} // Control slide width
              >
                {/* <TiltCard options={{ max: 6, scale: 1.02 }}> */}
                  <Link href={fan.link} className="block rounded-2xl" >
                    <Card className="rounded-2xl overflow-hidden border border-white/20 
                                    bg-[var(--nav-color)] backdrop-blur-lg 
                                    shadow-lg hover:shadow-xl transition-shadow p-0" style={{backgroundColor: "white"}}>
                      <CardContent className="p-0">
                        {/* <div className="pt-[100%] relative h-20!"> */}
                          <img
                            src={fan.img}
                            alt={fan.title}
                            className=" inset-0 w-full object-contain "
                            style={{padding:"1px"}}
                          />
                        {/* </div> */}
                      </CardContent>
                    </Card>
                  </Link>
                {/* </TiltCard> */}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* CTA Button */}
          {/* <div className="flex justify-center mt-10">
            <Link href="/catalogue" className="w-full max-w-xs">
              <Button className="w-full bg-[var(--gold-btn-color)] text-black 
                                hover:bg-[var(--gold-btn-hover)] active:bg-[var(--gold-btn-hover)]
                                px-8 py-6 text-xl font-bold">
                BUY NOW
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
}