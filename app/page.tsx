// app/page.tsx
import Navbar from "@/components/ui/navbar";
import Hero05 from "@/components/hero-05";
import Contact02 from "@/components/contact-02";
import Stats01 from "@/components/stats-01";
import FeatureProducts from "@/components/featureProducts";
import Testimonial06 from "@/components/Testimonial06";
import Footer from "@/components/footer-04";
import CTA from "@/components/CTA";
import FAQ from "@/components/faq";
import Message from "@/components/Massage";
import Banner from "@/components/ui/banner";
import BackToTopButton from "@/components/BackToTopButton";
import FansCards from "@/components/fancard";
import { BubbleBackground } from "@/components/ui/bubble-background/bubble-background";
import CompanyProile from "./companyProile/page";


  export default async function HomePage() {
  return (
    <div>
      <Navbar  />
      <FeatureProducts />
      <Hero05 />    
      <CompanyProile />
      <Stats01 />
      <FansCards />
      <div className="">
        <Message />
      </div>
      <BubbleBackground interactive>
        <div className="relative z-10 border-t border-gray-200">
          <Testimonial06 />
          <FAQ />
          <Banner />
          <Contact02 />
          <CTA />
        </div>
      </BubbleBackground>
      <Footer />
      <BackToTopButton />
    </div>
  );
}