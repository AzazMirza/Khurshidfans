"use client";

import Link from "next/link";
import { Pacifico } from "next/font/google";
const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

type TimelineItem = {
  title: string;
  subtitle: string;
  role: string;
  date: string;
  name: string;
  link: string;
};

const timelineData: TimelineItem[] = [
  {
    title: "Pioneering Fan Technology",
    subtitle: "We’re committed to delivering cutting-edge cooling solutions...",
    role: "Company CEO",
    date: "March 15, 2024",
    name: "Mr. Zeeshan",
    link: "",
  },
  {
    title: "Building Trust, One Home at a Time",
    subtitle: "Our customers are at the heart of everything we do...",
    role: "Company CEO",
    date: "January 28, 2024",
    name: "Mr. Zeeshan",
    link: "",
  },
  {
    title: "Leading with Innovation",
    subtitle: "Shaping the future with efficient, eco-friendly products...",
    role: "Company CEO",
    date: "July 10, 2024",
    name: "Mr. Zeeshan",
    link: "",
  },
];

export default function Timeline() {
  return (
    // <div className=" bg-[#009395]">
    // <section className="max-w-6xl mx-auto py-16 ">
    //   {/* Header */}
    //   <div className="text-center mb-12 ">
    //     <span className="px-3 py-1 text-lg rounded-full bg-white/90 border border-white/40 text-black">
    //       Speaking Journey
    //     </span>
    //     <h2 className="text-2xl lg:text-4xl font-bold text-white mt-4">
    //       CEO’s Perspective
    //     </h2>
    //     <p className="text-white/80 text-sm mt-2 max-w-2xl mx-auto">
    //       "An overview of my recent talks and workshops, where I’ve shared our
    //       vision for the future and the steps we’re taking to lead with purpose."
    //     </p>
    //   </div>

    //   {/* Timeline */}
    //   <div className="relative">
    //     {/* Line — left on mobile, center on desktop */}
    //     <div className="absolute top-0 h-full w-0.5 bg-neutral-700 left-6 sm:left-1/2 sm:-translate-x-1/2"></div>

    //     <div className="flex flex-col gap-24">
    //       {timelineData.map((item, i) => {
    //         const isLeft = i % 2 === 0;
    //         return (
    //           <div
    //             key={i}
    //             className={`
    //               relative flex w-full 
    //               ${isLeft ? "sm:justify-start" : "sm:justify-end"} 
    //               justify-end
    //             `}
    //           >
    //             {/* Date */}
    //             <div
    //               className="
    //                 absolute 
    //                 left-2 sm:left-1/2 sm:-translate-x-1/2 
    //                 -top-10
    //               "
    //             >
    //               <span className="px-3 py-1 text-xs font-medium text-black bg-white border border-neutral-300 rounded-full shadow-sm whitespace-nowrap">
    //                 {item.date}
    //               </span>
    //             </div>

    //             {/* Marker */}
    //             <div
    //               className="
    //                 absolute 
    //                 left-[18px] sm:left-1/2 sm:-translate-x-1/2 
    //                 top-0 w-3.5 h-3.5 rounded-full bg-neutral-900
    //               "
    //             ></div>

    //             {/* Card */}
    //             <div
    //               className={`
    //                 w-[90%] sm:w-1/2 
    //                 pl-4 sm:pl-0 
    //                 ${
    //                   isLeft
    //                     ? "sm:pr-2 sm:justify-end"
    //                     : "sm:pl-2 sm:justify-start"
    //                 } 
    //                 flex justify-start
    //               `}
    //             >
    //               <Card {...item} />
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>

    //   {/* Button */}
    //   <div className="text-center mt-16">
    //     <Link
    //       href=""
    //       className="inline-block px-6 py-3 bg-[var(--gold-btn-color)] text-black font-semibold rounded-lg shadow-md hover:bg-[var(--gold-btn-hover)] transition"
    //     >
    //       View All Events
    //     </Link>
    //   </div>
    // </section>
    // </div>

    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-background to-muted/30">
  <div className="max-w-5xl mx-auto">
    {/* Header */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
        <span>🇵🇰 Pakistan’s First</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
        Revolutionizing Fans with <span className="text-primary">BLDC Technology</span>
      </h2>
      <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
    </div>

    {/* Content Grid */}
    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* Left: Key Facts */}
      <div className="space-y-6">
        <div className="p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg text-foreground mb-2">⚡ Energy Efficiency Redefined</h3>
          <p className="text-muted-foreground">
            Reduced power consumption from <strong>110W</strong> to just <strong>50–55W per hour</strong> — cutting electricity bills by nearly 50%.
          </p>
        </div>

        <div className="p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg text-foreground mb-2">🔧 Brushless = Longer Life</h3>
          <p className="text-muted-foreground">
            No brushes means <strong>zero friction</strong>, <strong>no overheating</strong>, and <strong>exponentially extended fan lifespan</strong>.
          </p>
        </div>

        <div className="p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg text-foreground mb-2">🔋 AC/DC Innovation</h3>
          <p className="text-muted-foreground">
            Runs on efficient <strong>12V DC</strong> instead of traditional <strong>220V AC</strong> — safer, smarter, and future-ready.
          </p>
        </div>
      </div>

      {/* Right: Narrative */}
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-5">
        <p>
          Khurshid Fans holds the historic distinction of being <strong>Pakistan’s first official manufacturer</strong> to integrate <strong>BLDC (Brushless Direct Current)</strong> technology into ceiling and pedestal fans.
        </p>

        <p>
          Our BLDC motor uses <strong>permanent magnets</strong> on the rotor, driven by a precision-controlled magnetic field from <strong>99.99% pure copper windings</strong>. With <strong>electronic commutation</strong> replacing mechanical brushes, we eliminated wear, noise, and energy waste — achieving unmatched efficiency and reliability.
        </p>

        <blockquote className="border-l-4 border-primary pl-5 italic text-foreground">
          “This breakthrough didn’t happen overnight. It took countless sleepless nights, relentless R&D, and the courage to build what didn’t exist.”
        </blockquote>

        <p>
          Today, Khurshid Fans stands as the undisputed market leader in AC/DC fans — driving national progress, creating jobs, and building a legacy Pakistanis can be proud of.
        </p>
      </div>
    </div>

    {/* Footer Badge */}
    <div className={`mt-12 text-center ${pacifico.className}`}>
      <div className="inline-flex items-center border-2 border-primary/80 gap-3 bg-radial from-primary/60 to-secondary px-6 py-3 rounded-full">
        <span className="font-semibold text-Black">Pioneers of BLDC in Pakistan</span>
      </div>
    </div>
  </div>
</section>
  );
}

function Card({ title, subtitle, role, name, link }: TimelineItem) {
  return (
    <div
      className=" border bg-white border-white/50 p-6 rounded-xl shadow-md max-w-md
                 transition-transform duration-300 ease-in-out 
                 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-xl"
    >
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <p className="text-neutral-800">{subtitle}</p>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <span className="px-3 py-1.5 bg-black/90 rounded-lg text-[var(--gold-btn-color)] font-medium hover:text-[var(--gold-btn-hover)] transition-colors">
          {role}
        </span>
        <span className="px-3 py-1.5 text-black">{name}</span>
      </div>
      <Link
        href={link}
        className="inline-flex items-center gap-1 mt-4 px-4 py-2 rounded-lg bg-black/10 text-black hover:bg-black/20 transition-colors"
      >
        Event details ↗
      </Link>
    </div>
  );
}
