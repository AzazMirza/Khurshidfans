"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-lg w-full rounded-3xl shadow-2xl border border-white/40 bg-white/80 backdrop-blur-md"
      >
        <div className="p-8 text-center">
       
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mx-auto mb-5 w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg"
          >
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Your payment has been <span className="font-semibold">successfully completed</span>.
            <br />
            Thank you for your purchase. Your order is being processed.
          </p>

        
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalogue">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-600 text-white font-semibold"
              >
                Continue Shopping
              </motion.button>
            </Link>

            <motion.a
              href="https://wa.me/923096237788?text=Hi,%20I%20would%20like%20to%20I%20have%20completed%20my%20payment%20successfully"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Contact on WhatsApp
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
