"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { items, subtotal, clearCart, isLoading: isCartLoading } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: "", country: "India"
  });

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      // Only pre-fill if the current address is empty (don't overwrite user edits)
      setAddress(prev => prev.fullName ? prev : {
        fullName: defaultAddr.fullName || "",
        phone: defaultAddr.phone || "",
        street: defaultAddr.street || "",
        city: defaultAddr.city || "",
        state: defaultAddr.state || "",
        pincode: defaultAddr.pincode || "",
        country: defaultAddr.country || "India"
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Please sign in or create an account to checkout");
      router.push("/login?redirect=/checkout");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || isCartLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Button className="mt-4" onClick={() => router.push("/products")}>Back to Shop</Button>
      </div>
    );
  }

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode || !address.country) {
        toast.error("Please fill in all address fields");
        return;
      }
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: address,
        paymentMethod: "ONLINE"
      });
      await clearCart();
      router.push("/order-success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 font-heading mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          {/* Step 1: Address */}
          <div className={`p-6 bg-surface border border-gray-200 rounded-2xl mb-6 ${step !== 1 ? 'opacity-50' : ''}`}>
            <h2 className="text-xl font-bold font-heading mb-4">1. Shipping Address</h2>
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Full Name" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} required />
                  <Input label="Phone Number" type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} required />
                </div>
                <Input label="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required />
                  <Input label="State/Province" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="ZIP/Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} required />
                  <Input label="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full mt-4">Continue to Review</Button>
              </form>
            ) : (
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{address.fullName} ({address.phone})</p>
                <p>{address.street}, {address.city}</p>
                <p>{address.state} {address.pincode}, {address.country}</p>
                <button onClick={() => setStep(1)} className="text-primary-600 font-medium mt-2">Edit Address</button>
              </div>
            )}
          </div>

          {/* Step 2: Review & Pay */}
          <div className={`p-6 bg-surface border border-gray-200 rounded-2xl ${step !== 2 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-bold font-heading mb-4">2. Review & Place Order</h2>
            {step === 2 && (
              <div>
                <p className="text-gray-600 mb-6">By clicking place order, you agree to our terms and conditions. Your payment will be processed securely.</p>
                <Button onClick={handlePlaceOrder} isLoading={isSubmitting} size="lg" className="w-full">
                  Place Order - ${(subtotal + 10).toFixed(2)}
                </Button>
                <button onClick={() => setStep(1)} className="block w-full text-center mt-4 text-sm text-gray-500 hover:text-gray-700">Back to Address</button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold font-heading mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.product._id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 text-sm">{item.quantity}x</span>
                    <span className="text-sm font-medium line-clamp-1">{item.product.name}</span>
                  </div>
                  <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>$10.00</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>$0.00</span></div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary-600">${(subtotal + 10).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
