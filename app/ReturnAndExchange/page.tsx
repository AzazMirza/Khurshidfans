"use client";

import Image from "next/image";
import Navbar from "@/components/ui/navbar";
import { BubbleBackground } from "@/components/ui/bubble-background/bubble-background";
import Footer04Page from "@/components/footer-04";

export default function () {
  return (
    <BubbleBackground interactive>
      {/* <Navbar /> */}
    <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
           Return & Exchange Policy
        </h2>
        <p className="text-gray-600 mb-4">
          All our warranties are applicable through our certified dealerships.
          Any purchasing from unaffiliated 3rd party shops won’t fall under our warranty.
        </p>
        
          <p className="text-gray-600 mb-4">
            Buying from certified dealerships is recommended. Please refrain from buying Khurshid Fans from 3rd party unaffiliated shops, as Khurshid Fans won’t be liable in that scenario.
        </p>
        {/* <h3 className="text-xl font-semibold text-gray-800 m-4">
            2 Year Motor Warranty
            1 Year PCB Warranty
          </h3> */}
          <p><strong>2 Year Motor Warranty</strong></p>
          <p><strong>1 Year PCB Warranty</strong></p>
        <p className="text-gray-600 m-4">
              In the case of online buying through our website, incase of any problem I.e incomplete/damaged/wrong/unsatisfactory product, please get in touch with our customer service within 7 days of receiving. Any claims sent after this time period will not be entertained.

            </p>       
      </div>
    </section>

      <Footer04Page />
    </BubbleBackground>
  );
}


