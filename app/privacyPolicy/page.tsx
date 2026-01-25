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
          Privacy Policy
        </h2>

        <p className="text-gray-600 mb-4">
          We respect your privacy and are committed to protecting your personal
          information. The details below explain what data we collect, how it is
          used, and the measures we take to keep it secure.
        </p>

        {/* Information We Collect */}
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Name.</li>
            <li>Phone Number.</li>
            <li>Email Address.</li>
            <li>Postal Code / Delivery Address</li>
          </ul>
        </div>

        {/* Information Sharing */}
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            Depending on the nature of your inquiry, we may share your information
            only with the following trusted parties:
          </p>
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Logistics & Delivery Partners.</li>
            <li>Authorized Dealers & Service Centers.</li>
            <li>Payment Processors (when applicable).</li>
            <li>Legal or Regulatory Authorities (when required by law).</li>
          </ul>
          <p className="text-gray-600 mt-5">
            All third parties are required to protect your information as per their rules & regulations.
          </p>
        </div>

        <div>
          <p className="text-gray-600 mb-4">
            We implement reasonable administrative, technical, and physical safeguards to protect your personal information from:
          </p>
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Unauthorized access.</li>
            <li>Disclosure.</li>
            <li>Alteration.</li>
            <li>Loss or misuse.</li>
          </ul>
          <p className="text-gray-500 mt-4">
            However, no method of transmission or storage is 100% secure.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 m-4">
            Cookies & Tracking:
          </h3>
            <p className="text-gray-600 mb-4">
              If you use our website:
            </p>
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>We may use cookies to improve your browsing experience.</li>
            <li>You can disable cookies through your browser settings.</li>
            <li>Disabling cookies may affect certain features or functionality of
              the website.
            </li>
          </ul>
        </div>

        {/* Data Retention */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Data Retention
          </h3>
          <p className="text-gray-600 mb-4">
            We retain personal and business information only for the duration
            necessary to:
          </p>
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Fulfill legitimate business purposes</li>
            <li>Comply with legal and regulatory requirements</li>
            <li>Provide warranty and after-sales service support</li>
          </ul>
        </div>

        {/* Information Usage */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            How We Use Your Information
          </h3>
          <p className="text-gray-600 mb-4">
            Collected information may be used for the following purposes:
          </p>
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-2">
            <li>Process orders and manage deliveries.</li>
            <li>Provide customer support and warranty services.</li>
            <li>Communicate product updates, offers, or service notices.</li>
            <li>Improve our products, services, and website performance.</li>
            <li>Maintain internal business records.</li>
            <li>Manage dealer and distributor relationships.</li>
          </ul>

          <p className="text-gray-600 mt-4">
            We do not sell or rent your personal information to third parties.
          </p>
        </div>
      </div>
    </section>

      <Footer04Page />
    </BubbleBackground>
  );
}

// function ValueCard({
//   title,
//   description,
// }: {
//   title: string;
//   description: string;
// }) {
//   return (
//     <div
//       className="p-6 bg-[#009395] dark:bg-black/20 
//                    border-white dark:border-white/10 
//                   border-l-6
//                   rounded-2xl 
//                   backdrop-blur-lg 
//                   shadow-md 
//                   transition 
//                   hover:shadow-xl hover:scale-[1.02] 
//                   active:scale-[0.98] active:shadow-lg 
//                   duration-300 ease-in-out">
//       <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
//       <p className="text-white text-sm">{description}</p>
//     </div>
//   );
// }
