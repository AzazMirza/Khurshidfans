"use client";

import { useState } from "react";
import Navbar from "@/components/ui/navbar";

const faqData = {
  Account: [
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll email you instructions to create a new password.",
    },
    {
      question: "Can I change my username?",
      answer:
        "Yes, you can change your username in your account settings. Note that if you change your username, your profile URL will also change.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can request account deletion from your account settings page. Please note this action is permanent and all your data will be removed.",
    },
  ],
  Billing: [
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, debit cards, and PayPal.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Refunds are available within 14 days of purchase if the service has not been used.",
    },
  ],
  Service: [
    {
      question: "How can I contact support?",
      answer:
        "You can contact us through the form on this page or email support@example.com.",
    },
    {
      question: "What are your support hours?",
      answer: "Our support team is available 24/7.",
    },
  ],
};

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState<"Account" | "Billing" | "Service">(
    "Account"
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ----- NEW STATE FOR FORM -----
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ----- FORM HANDLERS -----
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert("Message sent successfully ✅");
      setFormData({ firstName: "", lastName: "", subject: "", message: "" });
    } catch (err: any) {
      alert(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f1f1] text-black min-h-screen">
      <Navbar />

      <section className="py-16 px-6 md:px-12">
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
                    setActiveTab(tab as "Account" | "Billing" | "Service");
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
                    <span>{openIndex === index ? "−" : "+"}</span>
                  </button>
                  {openIndex === index && (
                    <p className="text-gray-900 mt-2">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-[#009395] shadow-none rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
            <p className="text-white mb-6">
              Contact our support team and we'll get back to you as soon as possible.
            </p>

            {/* ----- FORM LINKED TO BACKEND ----- */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full p-3 rounded-md text-black bg-white border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="w-full p-3 rounded-md text-black bg-white border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full p-3 rounded-md text-black bg-white border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide as much detail as possible..."
                  rows={4}
                  className="w-full p-3 rounded-md text-black bg-white border border-gray-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[var(--gold-btn-color)] font-medium hover:bg-[var(--gold-btn-hover)] cursor-pointer"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <p className="mt-6 text-white">
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
