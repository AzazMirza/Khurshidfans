"use client";

import Image from "next/image";
import Navbar from "@/components/ui/navbar";
import { BubbleBackground } from "@/components/ui/bubble-background/bubble-background";
import Footer04Page from "@/components/footer-04";

export default function () {
  return (
    <BubbleBackground interactive>
      {/* <Navbar /> */}
    <section className="max-w-5xl mx-auto mt-6 px-6 py-16 relative z-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
           Delivery Policy
        </h2>
        <h3 className="text-xl font-semibold text-gray-800 m-4">
            Shipping & Delivery:
          </h3>
          <p className="text-gray-600 ml-5 mb-4">
            Delivery times are estimates and may vary due to external factors.
            We are not responsible for delays caused by:
          </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Courier services</li>
            <li>Customs clearance</li>
            <li>Natural events or force majeure</li>
          </ul>
        </div>
      </div>
    </section>
      <Footer04Page />
    </BubbleBackground>
  );
}


