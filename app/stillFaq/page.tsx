"use client";

import { useState } from "react";
import Navbar from "@/components/ui/navbar";

const faqData = {
  Difference: [
     {
      question: "What is the difference between AC/DC and Inverter fans?",
      answer: (
       <table className="w-full border border-gray-300  mt-4">
  <thead>
    <tr className="bg-gray-100">
      <th className="border border-gray-300 px-4 py-3 text-left">Feature</th>
      <th className="border border-gray-300 px-4 py-3 text-left">AC/DC Fans</th>
      <th className="border border-gray-300 px-4 py-3 text-left">E-Force Inverter 30 Watt Fans</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-gray-300 px-4 py-3">Motor Technology</td>
      <td className="border border-gray-300 px-4 py-3">BLDC Motor</td>
      <td className="border border-gray-300 px-4 py-3">BLDC Motor</td>
    </tr>
    <tr className="bg-white">
      <td className="border border-gray-300 px-4 py-3">Power Input</td>
      <td className="border border-gray-300 px-4 py-3">Dual Input (220V AC + Direct DC)</td>
      <td className="border border-gray-300 px-4 py-3">AC Only</td>
    </tr>
    <tr className="bg-gray-50">
      <td className="border border-gray-300 px-4 py-3">DC Support</td>
      <td className="border border-gray-300 px-4 py-3">Yes (Battery / Solar Compatible)</td>
      <td className="border border-gray-300 px-4 py-3">No</td>
    </tr>
    <tr className="bg-white">
      <td className="border border-gray-300 px-4 py-3">Power Consumption</td>
      <td className="border border-gray-300 px-4 py-3">Higher than 30W (varies by speed)</td>
      <td className="border border-gray-300 px-4 py-3">Approximately 30 Watts</td>
    </tr>
    <tr className="bg-gray-50">
      <td className="border border-gray-300 px-4 py-3">Energy Efficiency</td>
      <td className="border border-gray-300 px-4 py-3">Efficient with flexible power options</td>
      <td className="border border-gray-300 px-4 py-3">Ultra-low power consumption</td>
    </tr>
    <tr className="bg-white">
      <td className="border border-gray-300 px-4 py-3">Airflow & RPM</td>
      <td className="border border-gray-300 px-4 py-3">Higher maximum airflow and RPM</td>
      <td className="border border-gray-300 px-4 py-3">Slightly lower airflow and RPM</td>
    </tr>
    <tr className="bg-gray-50">
      <td className="border border-gray-300 px-4 py-3">Usage During Power Outage</td>
      <td className="border border-gray-300 px-4 py-3">Yes (via DC source)</td>
      <td className="border border-gray-300 px-4 py-3">No</td>
    </tr>
    <tr className="bg-white">
      <td className="border border-gray-300 px-4 py-3">Best For</td>
      <td className="border border-gray-300 px-4 py-3">Flexibility & higher performance</td>
      <td className="border border-gray-300 px-4 py-3">Minimum electricity consumption</td>
    </tr>
  </tbody>
</table>

      ),
    },
    {
      question: "How your fans is better than others ?",
      answer:
        " Our fans are better because We use advanced BLDC motor technology, offer higher airflow and flexibility with AC/DC input (for AC and battery/solar), and still deliver excellent energy efficiency. ",
    },
    // {
    //   question: "How do I delete my account?",
    //   answer:
    //     "You can request account deletion from your account settings page. Please note this action is permanent and all your data will be removed.",
    // },
  ],
  Warranty: [
    {
      question: "What warranty do our fans come with ?",
      answer: "Our fans include a 2-year motor warranty and a 1-year PCB warranty.",
    },
    {
      question: "How can I claim my warranty ?",
      
      answer: <p> <span className="font-bold ">Customers can claim the warranty in the following ways: </span><br />

1.  Through the original shop
The warranty can be claimed at the shop where the fan was originally purchased. <br />

2.  Through any authorized dealer
Customers may also claim the warranty through any other authorized dealer of our brand.
<br />

3. By sending the product to the factory (Not recommended)
Customers can send the fan or circuit to the factory for warranty service.
However, this option is costly and may involve additional inconvenience.
Therefore, we strongly recommend using the first two options for a faster and easier process.</p> 
    },
    {
      question: "Can the PCB kit be repaired after the warranty expires ?",
      answer:
        "Yes, in some cases the kit can be repaired if only a few components are damaged. However, if the entire circuit is burned or completely damaged, it cannot be repaired.",
    },
    {
      question: "What are the delivery charges for claiming the warranty ?",
      answer:
        "There are no delivery charges from our side, but the customer is responsible for the shipping cost of sending the circuit or fan for repair",
    },
  ],
  Service: [
    {
      question: "How can I contact support?",
      answer:
        "You can contact us through the form on this page or email us at info@khurshidfans.com",
    },
    {
      question: "What are your support hours?",
      answer: "Our support team is available 9 AM to 5 PM.",
    },
  ],
};

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<"Difference" | "Warranty" | "Service">(
    "Difference"
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#f1f1f1] text-black min-h-screen">
      {/* Navbar with same background */}

      {/* FAQ Section */}
      <section className=" py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mt-20">
          {/* Left Side */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-900 mb-6">
              Find answers to common questions or contact our support team
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 ">
              {Object.keys(faqData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as "Difference" | "Warranty" | "Service");
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-1 rounded-md cursor-pointer ${
                    activeTab === tab
                      ? "bg-[var(--gold-btn-color)] text-black"
                      : "bg-white text-black hover:bg-[var(--gold-btn-hover)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {faqData[activeTab].map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between cursor-pointer items-center w-full text-left"
                  >
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <span className="">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === index && (
                    <p className="text-gray-900 mt-2">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>

            {/* <button className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm cursor-pointer">
              View all FAQs
            </button> */}
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-[#009395] shadow-none rounded-2xl p-6">
            <h3 className="text-xl font-semibold  text-white mb-2">Still have questions?</h3>
            <p className="text-white mb-6">
              Contact our support team and we'll get back to you as soon as possible.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full p-3 rounded-md text-black bg-white border border-gray-300 "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full p-3 rounded-md text-black bg-white border border-gray-300 "
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  className="w-full p-3 rounded-md text-black bg-white border border-gray-300 "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Message
                </label>
                <textarea
                  placeholder="Please provide as much detail as possible..."
                  rows={4}
                  className="w-full p-3 rounded-md text-black bg-white border border-gray-300 "
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[var(--gold-btn-color)]  font-medium hover:bg-[var(--gold-btn-hover)] cursor-pointer"
              >
                Send Message
              </button>
            </form>

            <p className="mt-6 text-white ">
              Prefer direct contact? Email us at{" "}
              <a
                href="mailto:info@khurshidfans.com"
                className="text-gray-900 font-medium underline hover:text-[var(--gold-btn-hover)]"
              >
                info@khurshidfans.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
