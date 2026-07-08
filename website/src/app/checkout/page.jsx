"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Spinner } from "@/components/common/Spinner";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { items, subtotal, clearCart, isLoading: isCartLoading } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: address,
        paymentMethod
      });
      
      const orderData = data.data.order;
      const rzOrder = data.data.razorpayOrder;

      // Clear client-side cart state immediately since the order has been created
      await clearCart();

      if (paymentMethod === "ONLINE" && rzOrder) {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          toast.error("Razorpay payment gateway failed to load. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // Fetch the public key from backend
        const { data: keyRes } = await api.get("/orders/razorpay-key");
        const razorpayKey = keyRes.data.keyId;

        const options = {
          key: razorpayKey,
          amount: rzOrder.amount,
          currency: rzOrder.currency,
          name: "Shop Sathi",
          description: `Payment for Order ${orderData.orderNumber || orderData._id}`,
          order_id: rzOrder.id,
          handler: async function (response) {
            setIsSubmitting(true);
            try {
              // Verify payment on the server
              await api.post("/orders/verify-payment", {
                orderId: orderData._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              toast.success("Payment successful!");
              router.push("/order-success");
            } catch (err) {
              toast.error(err.response?.data?.message || "Payment verification failed");
              router.push(`/profile/orders/${orderData._id}`);
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: address.fullName,
            contact: address.phone,
            email: user?.email || "",
          },
          theme: {
            color: "#4f46e5",
          },
          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled. You can complete the payment in your orders section.");
              router.push(`/profile/orders/${orderData._id}`);
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        // COD order
        toast.success("Order placed successfully via Cash on Delivery!");
        router.push("/order-success");
      }
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
          <div className={`p-6 bg-surface border border-gray-200 rounded-2xl mb-6 transition-all duration-350 ease-in-out ${step !== 1 ? 'opacity-40 select-none' : 'shadow-md border-primary-100'}`}>
            <h2 className="text-xl font-bold font-heading mb-4">1. Shipping Address</h2>
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-4 animate-fade-in">
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
          <div className={`p-6 bg-surface border border-gray-200 rounded-2xl transition-all duration-350 ease-in-out ${step !== 2 ? 'opacity-40 pointer-events-none select-none' : 'shadow-md border-primary-100'}`}>
            <h2 className="text-xl font-bold font-heading mb-4">2. Review & Place Order</h2>
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h3 className="text-md font-bold mb-3 text-gray-800">Select Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4 mt-0.5"
                      />
                      <div className="ml-3">
                        <span className="block font-semibold text-sm text-gray-900">Cash on Delivery (COD)</span>
                        <span className="block text-xs text-gray-500 mt-0.5">Pay in cash when order is delivered</span>
                      </div>
                    </label>
                    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary-600 bg-primary-50/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={paymentMethod === 'ONLINE'}
                        onChange={() => setPaymentMethod('ONLINE')}
                        className="text-primary-600 focus:ring-primary-500 h-4 w-4 mt-0.5"
                      />
                      <div className="ml-3">
                        <span className="block font-semibold text-sm text-gray-900">Online Payment</span>
                        <span className="block text-xs text-gray-500 mt-0.5">Pay securely via Razorpay (UPI, Card, Netbanking)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 text-sm">By clicking place order, you agree to our terms and conditions. Your payment will be processed securely.</p>
                <Button onClick={handlePlaceOrder} isLoading={isSubmitting} size="lg" className="w-full">
                  Place Order - ₹{(subtotal + 10).toFixed(2)}
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
                  <span className="text-sm font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>₹10.00</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>₹0.00</span></div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary-600">₹{(subtotal + 10).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
