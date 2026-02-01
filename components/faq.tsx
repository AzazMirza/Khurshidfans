import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";
import { BubbleBackground } from "@/components/ui/bubble-background/bubble-background";
import Banner from "@/components/ui/banner";
import Link from "next/link";

const faq = [
  {
    question: "What is your return policy?",
    answer:
      ".",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is dispatched, we will send you a tracking number. You can use it to track your order online and see where it is right now.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      ".",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Cash on delivery is available, as well as advance payment before delivery through online payment methods such as Raast, bank transfer, and credit card.",
  },
  {
    question: "What if I receive a damaged item?",
    answer:
      "If the product arrives damaged, the company will replace it. Please contact customer support for more information.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      " To contact customer support, you can call the number provided on your fan invoice. You may also reach us through the phone number listed on our website, or by emailing us at info@khurshidfans.com You can also contact us through the contact form on our website.",
  },
];

export default function FAQ() {
  return (
    // <BubbleBackground interactive>
      <div id="faq" className="relative z-10 w-full  backdrop-blur-lg ">
        <div className="max-w-screen-xl mx-auto py-8 xs:py-16 text-center lg:text-left px-4 lg:px-28">
          <h2 className="text-center text-2xl xs:text-3xl lg:text-4xl !leading-[1.15] font-bold tracking-tighter text-black">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-center text-gray-800 text-xl">
           Everything you need to know about our products and services
          </p>

          <div className="min-h-[550px] md:min-h-[320px] xl:min-h-[300px]">
            <Accordion
                type="single"
                       collapsible
                   className="mt-8 md:columns-2 text-white"
>
              {faq.map(({ question, answer }, index) => (
                <AccordionItem
                        key={question}
                             value={`question-${index}`}
                 className="mb-4 break-inside-avoid bg-[#009395] py-1 px-4 rounded-xl border border-white"
>
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className={cn(
                        "flex cursor-pointer flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all",
                        "text-start text-lg text-white relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0",
                        "after:bg-(--gold-btn-color) after:transition-all after:duration-300 hover:after:w-full hover:text-[var(--gold-btn-color)] active:text-[var(--gold-btn-color)]"
                      )}
                    >
                      {question}
                      <PlusIcon className="h-5 w-5 shrink-0 text-white transition-transform duration-200" />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent className="text-[16px] text-white/90">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
      <div className="text-center mt-12 mb-10">
        <Link
          href="stillFaq"
          className="inline-block px-6 py-3 bg-[var(--gold-btn-color)] text-black font-semibold rounded-lg shadow-md hover:bg-[var(--gold-btn-hover)] transition"
        >
          Know More
        </Link>
      </div>
          </div>
        </div>
        {/* Button */}
      </div>
    // </BubbleBackground>
  );
}
