"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface p-8 text-center rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-success-100 rounded-full animate-ping opacity-75"></div>
            <CheckCircle2 className="relative w-20 h-20 text-success-500 bg-white rounded-full" />
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
