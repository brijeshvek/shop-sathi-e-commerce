"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, isLoading, itemCount, subtotal, updateQuantity, removeFromCart } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
        <div className="w-full md:w-1/3">
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet. Discover our top products.
        </p>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading mb-8">
        Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 flex flex-col space-y-6">
          {items.map((item) => (
            <div key={item._id || item.product._id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-surface border border-gray-200 dark:border-gray-700 rounded-2xl">
              <Link href={`/products/${item.product.slug || item.product._id}`} className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                {item.product.images?.[0] ? (
                  <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </Link>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{item.product.category?.name}</p>
                    <Link href={`/products/${item.product.slug || item.product._id}`}>
                      <h3 className="font-medium text-gray-900 dark:text-white text-lg hover:text-primary-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg whitespace-nowrap ml-4">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-300 rounded-lg h-9 bg-white w-28">
                    <button 
                      onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                      className="w-1/3 h-full text-gray-600 hover:text-primary-600"
                    >-</button>
                    <span className="w-1/3 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                      className="w-1/3 h-full text-gray-600 hover:text-primary-600"
                    >+</button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item._id, item.product._id)}
                    className="text-gray-400 hover:text-error-500 flex items-center text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
            <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping estimate</span>
                <span className="font-medium text-gray-900 dark:text-white">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax estimate</span>
                <span className="font-medium text-gray-900 dark:text-white">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Estimated Total</span>
              <span className="text-2xl font-bold text-primary-600">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" className="block w-full">
              <Button size="lg" className="w-full flex items-center justify-center">
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <div className="mt-4 text-center">
              <Link href="/products" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
