"use client";

import Image from "next/image";
import Navbar from "@/components/ui/navbar";
import { BubbleBackground } from "@/components/ui/bubble-background/bubble-background";
import Footer04Page from "@/components/footer-04";

export default function CompanyValues() {
  return (
    <BubbleBackground interactive>
      {/* <Navbar /> */}
      <div className="relative z-10  ">
        {/* Main Section */}
        <section className="max-w-6xl mx-auto py-16 px-6 text-center">
          {/* Quote Section */}
          <div className="mt-6 mb-12">
            <div className="text-6xl text-gray-800 mb-6">❝</div>
            <p className="text-xl md:text-2xl text-black font-medium max-w-3xl mx-auto">
              “May Allah have mercy on a person who is lenient when selling, lenient when buying, and lenient when seeking repayment.”
              <br />   The Holy Prophet PBUH <br/>
                |Sahih al-Bukhari 2076|
            </p>
            {/* <div className="mt-6 flex flex-row justify-center items-center">
              <img
                src="/images/kingmodel.png"
                alt="CEO"
                width={50}
                height={50}
                className="rounded-full border border-gray-300"
              />
              <div className="text-left p-3">
                <h4 className="   font-bold text-black">Mr. Zeeshan</h4>
                <p className="text-gray-800 text-sm">
                  Founder & Creative Director
                </p>
              </div>
            </div> */}
          </div>

          <div
            className="  mx-auto p-8 bg-[#009395] dark:bg-black/20 
                          border-white dark:border-white/10 rounded-2xl 
                            backdrop-blur-lg shadow-md transition 
                            hover:shadow-xl hover:scale-[1.02] 
                            active:scale-[0.98] active:shadow-lg 
                            duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-white mb-2">Our Mission</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">
              

S.G.S Electrical Company was founded with a singular purpose to manufacture high quality fans with zero compromise on quality. From the very beginning profit maximization was never our primary objective. Our mission has always been to create lasting value through superior engineering, honest manufacturing, and an unwavering commitment to our customers.

We have never approached our work by asking what the bare minimum might be. Instead, from day one, our focus has been on delivering the utmost level of quality and performance possible even when it requires us to invest more than what is commercially convenient. This philosophy defines who we are and continues to guide every product we create.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mt-6 p-8 text-black">
              Our Core Ethos
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left ">
              <ValueCard
                title="Quality without Compromise"
                description="At S.G.S Electrical Company, quality is not a benchmark it is a responsibility. From materials selection to final assembly, every decision is guided by durability, reliability, and performance. We do not optimize for the lowest acceptable standard; we engineer for the highest possible one. This commitment has been embedded in our manufacturing philosophy since day one and continues to define every product that carries the Khurshid Fans name ."
              />
              <ValueCard
                title=" Responsibility to the Customer"
                description="Trust is earned through consistency. We view every customer relationship as a long-term commitment, not a transaction. Transparency in production, honest communication, and dependable after-sales support are integral to how we operate. Every fan we manufacture reflects our accountability to the people who choose to bring our products into their homes and workplaces."
              />
              <ValueCard
                title="Building the Industry, Not Just a Brand"
                description="Our vision extends beyond individual success. By modernizing manufacturing practices through CNC machining, conveyor based production systems, and process standardization we have aimed to elevate industry benchmarks. Progress is meaningful only when it creates positive ripple effects, and we take pride in contributing to the gradual modernization of fan manufacturing across the country."
              />
              <ValueCard
                title="Engineering-Led Innovation"
                description="Innovation at Khurshid Fans is driven by engineering, not trends. Long before energy efficiency became an industry talking point, we invested in research, process optimization, and indigenous development. Our early adoption and local development of BLDC motor technology is a reflection of our belief that meaningful innovation must solve real problems, not merely follow market cycles.
"
              />
              <ValueCard
                title="Developing People and Potential"
                description=" We believe a strong industry is built on skilled people. Khurshid Fans is committed to bridging the gap between academia and industry by providing opportunities for learning, exposure, and practical growth. By investing in youth development, skill-building, and knowledge transfer, we aim to create clear pathways for talent to grow and contribute meaningfully within this country.
"
              />
              <ValueCard
                title="Integrity in Every Decision"
                description=" Integrity governs how we manufacture, how we price, and how we engage with stakeholders. We choose clarity over shortcuts and responsibility over convenience. This principle has allowed us to build enduring relationships and a reputation rooted in trust, consistency, and accountability."
              />
            </div>
          </div>
        </section>
         <Footer04Page />
      </div>
     
    </BubbleBackground>
  );
}

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="p-6 bg-[#009395] dark:bg-black/20 
                   border-white dark:border-white/10 
                  border-l-6
                  rounded-2xl 
                  backdrop-blur-lg 
                  shadow-md 
                  transition 
                  hover:shadow-xl hover:scale-[1.02] 
                  active:scale-[0.98] active:shadow-lg 
                  duration-300 ease-in-out">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white text-sm">{description}</p>
    </div>
  );
}
