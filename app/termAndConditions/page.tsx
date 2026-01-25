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
           Terms & Conditions
        </h2>
        <strong>Last updated: 20/01/2026</strong>
        <p className="text-gray-600 mb-4">
          Welcome to Khurshid Fans. By accessing or using our website khurshidfans.com, you agree to be bound by these Terms and Conditions.
        </p>
        <h3 className="text-xl font-semibold text-gray-800 m-4">
            1. Use of the Website:
          </h3>
          <p className="text-gray-600 mb-4">
        You agree to use this website only for lawful purposes and in a way that does 
        not infringe the rights of others or restrict their use of the website.
        </p>
        <p className="text-gray-600 mb-4">
              You must not:
            </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Use the website for fraudulent or illegal activities.</li>
            <li>Attempt to gain unauthorized access to our systems.</li>
            <li>Upload viruses, malware, or harmful code.</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
            2. Eligibility:
          </h3>
          <p className="text-gray-600 mb-4">
        By using this website, you confirm that:
        </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>You are at least 16 years old (or have parental permission)</li>
            <li>You are at least 16 years old (or have parental permission)</li>
          </ul>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 m-4">
            3. Products & Services:
          </h3>
          <p className="text-gray-600 mb-4">
        All products or services listed on our website are subject to availability.
        We reserve the right to:
        </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Modify or discontinue products/services at any time</li>
            <li>Limit quantities per order</li>
            <li>Refuse service to anyone for any reason</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
            4. Pricing & Payments:
          </h3>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Prices are listed in Pakistani Rupees.</li>
            <li>Prices may change without prior notice</li>
            <li>Payments must be completed before order processing</li>
            <li>We are not responsible for third-party payment gateway issues</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
            5. Shipping & Delivery:
          </h3>
          <p className="text-gray-600 mb-4">
        Delivery times are estimates and may vary due to external factors.
        We are not responsible for delays caused by:
        </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Courier services</li>
            <li>Customs clearance</li>
            <li>Natural events</li>
            <li>Political reasons</li>
          </ul>
        </div>

         <h3 className="text-xl font-semibold text-gray-800 m-4">
            6. Returns & Refunds:
          </h3>
          <p className="text-gray-600 mb-4">
        Returns and refunds are governed by our Return Policy.
        Items must meet eligibility criteria to qualify for a refund or exchange.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
           7. User Accounts:
          </h3>
          <p className="text-gray-600 mb-4">
        If you create an account:
        </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>You are responsible for maintaining confidentiality</li>
            <li>You are responsible for all activities under your account</li>
            <li>We may suspend or terminate accounts that violate our terms</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
           8. Intellectual Property:
          </h3>
          <p className="text-gray-600 mb-4">
        All content on this website (text, images, logos, code, designs) is owned by Khurshid Fans and is protected by intellectual property laws.
        </p>
        <p className="text-gray-600 mb-4">
              You may not:
            </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Copy or redistribute content without permission</li>
            <li>Use our brand assets without authorization</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
           9. Limitation of Liability:
          </h3>
          <p className="text-gray-600 mb-4">
        To the maximum extent permitted by law, Khurshid Fans shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
           10. Indemnification:
          </h3>
          <p className="text-gray-600 mb-4">
        You agree to indemnify and hold harmless Khurshid Fans from any claims, damages, or expenses arising from:
        </p>
        <div className="mb-4">
          <ul className="list-disc list-inside ml-10 text-gray-600 space-y-1">
            <li>Your misuse of the website</li>
            <li>Violation of these Terms</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
           11. Termination:
          </h3>
          <p className="text-gray-600 mb-4">
            We may suspend or terminate access to the website without notice if you violate these Terms and Conditions.        
          </p>

        <h3 className="text-xl font-semibold text-gray-800 m-4">
           12. Changes to Terms:
          </h3>
          <p className="text-gray-600 mb-4">
            We reserve the right to update or modify these Terms at any time. Changes will be effective once posted on this page.
          </p>
        <h3 className="text-xl font-semibold text-gray-800 m-4">
           13. Contact Information:
          </h3>
          <p className="text-gray-600 mb-4">
           If you have any questions about these Terms and Conditions, contact us at:
          </p>
          <p><strong>Email: </strong>info@khurshidfans.com</p>
          <p><strong>Address: </strong> khurshid Fans GT road, Gujrat.</p>
          <p><strong>Phone: </strong>+923096237788</p>
      </div>
    </section>

      <Footer04Page />
    </BubbleBackground>
  );
}


