"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { BubbleBackground } from "./ui/bubble-background/bubble-background";

const Contact02Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.message) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      // ✅ SUCCESS POPUP
      alert("✅ Message sent successfully! We will contact you soon.");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error: any) {
      // ❌ ERROR POPUP
      alert(`❌ Message failed: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <BubbleBackground interactive>
    <section
      id="contact"
      className="relative z-10 min-h-screen flex items-center justify-center py-16 "
    >
      <div className="w-full max-w-[\var(--breakpoint-xl)] mx-auto px-6 xl:px-0">
        <h2 className="mt-3 text-3xl justify-center text-center md:text-4xl xs:text-3xl font-bold tracking-tight text-black">
          Chat with our friendly team!
        </h2>
        <p className="mt-3 text-base justify-center text-center sm:text-lg text-black">
          We&apos;d love to hear from you. Please fill out this form or shoot us an email.
        </p>

        <div className="mt-24 grid lg:grid-cols-2 gap-16 md:gap-10">
          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            {[
              {
                icon: <MailIcon className="w-6 h-6" />,
                title: "Email",
                desc: "Our friendly team is here to help.",
                link: "mailto:KhurshidFans@gmail.com",
                linkText: "KhurshidFans@gmail.com",
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Live chat",
                desc: "Our friendly team is here to help.",
                link: "https://wa.me/923096237788",
                linkText: <div>03096237788</div>,
              },
              {
                icon: <MapPinIcon className="w-6 h-6" />,
                title: "Office",

                desc: "Visit us at our office.",
                link: "https://www.google.com/maps/place/Khurshid+Fans/@32.530334,74.090236,16z/data=!4m6!3m5!1s0x391f1b3a6e405615:0x33983c89be3f46b1!8m2!3d32.5297194!4d74.0920601!16s%2Fg%2F1tfw1f8g?hl=en&entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D",

//                 desc: "Come say hello at our Office.",
//                 link:
//                   "https://www.google.com/maps/place/Khurshid+Fans",
//  1e1172f (contact form edit)
                linkText: (
                  <>
                    SGS Electrical Company, GT Rd, Gujrat, Pakistan
                  </>
                ),
              },
              {
                icon: <PhoneIcon className="w-6 h-6" />,
                title: "Phone",
                desc: "Sat-Thurs from 9am to 5pm.",
                link: "tel:0533707903",
                linkText: <div>0533707903</div>,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-[#009395] border border-white rounded-2xl shadow-md transition hover:shadow-xl"
              >
                <div className="h-12 w-12 flex items-center justify-center text-white rounded-full">
                  {item.icon}
                </div>
                <h3 className="mt-5 font-semibold text-2xl text-white">
                  {item.title}
                </h3>
                <p className="my-2.5 text-white">{item.desc}</p>
                <Link
                  className="font-medium text-white"
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                >
                  {item.linkText}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="bg-[#009395] shadow-none py-0">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-2 bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-2 bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2 bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-2 bg-white"
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox id="acceptTerms" />
                    <Label htmlFor="acceptTerms">
                      You agree to our terms and conditions
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-white"
                >
                  {loading ? "Sending..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    // </BubbleBackground>
  );
};

export default Contact02Page;
