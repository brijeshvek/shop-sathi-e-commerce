"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface p-8 text-center rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-success-100 rounded-full animate-ping opacity-75"></div>
            <svg 
              className="relative w-20 h-20 text-success-500 bg-white rounded-full p-1 shadow-inner" 
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                className="stroke-success-500/20" 
                cx="26" 
                cy="26" 
                r="23" 
                stroke="currentColor" 
                strokeWidth="4" 
              />
              <circle 
                className="stroke-success-500" 
                cx="26" 
                cy="26" 
                r="23" 
                stroke="currentColor" 
                strokeWidth="4" 
                style={{
                  strokeDasharray: 150,
                  strokeDashoffset: 150,
                  animation: 'drawCheckmark 0.4s ease-out forwards'
                }}
              />
              <path 
                className="checkmark-path stroke-success-500" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16 26l7 7 13-13" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading mb-2">
          Order Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your purchase. We've received your order and are getting it ready to be shipped. 
          You will receive an email confirmation shortly.
        </p>
        
        <div className="space-y-4">
          <Link href="/profile/orders" className="block w-full">
            <Button className="w-full" size="lg">
              Track My Order
            </Button>
          </Link>
          <Link href="/products" className="block w-full">
            <Button variant="outline" className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
