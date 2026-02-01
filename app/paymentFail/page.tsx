"use client";

import Link from "next/link";
import { XCircle, RefreshCcw, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentFail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-xl w-full rounded-3xl border border-gray-200 bg-white shadow-xl"
      >
        <div className="p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0.85, 1.05, 1] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-5 w-24 h-24 rounded-full bg-red-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <XCircle className="w-14 h-14 text-red-600" />
            </motion.div>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
     
          <p className="text-gray-600 mb-6 leading-relaxed">
            Unfortunately, your payment could not be completed.
            <br />
            This may be due to a network issue, insufficient balance, or a declined transaction.
          </p>

          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-left text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p>
                <span className="font-semibold">What you can do:</span>
                <br />• Check your payment details  
                <br />• Try another payment method  
                <br />• Retry after a few moments
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/payment">
              <motion.button
                autoFocus
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <RefreshCcw className="w-5 h-5" />
                Retry Payment
              </motion.button>
            </Link>

            <Link href="/catalogue">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-red-600 text-red-600 font-semibold"
              >
                Back to Products
              </motion.button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            If the issue persists, please contact our support team.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
