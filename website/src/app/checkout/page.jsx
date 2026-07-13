"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Spinner } from "@/components/common/Spinner";
import Modal from "@/components/common/Modal";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { items, subtotal, clearCart, isLoading: isCartLoading } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false);
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", pincode: "", country: "India"
  });
  const [settings, setSettings] = useState({ taxRate: 18, freeShippingThreshold: 499, shippingCharge: 99 });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data?.success && data.data) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    
    const fetchCoupons = async () => {
      try {
        const { data } = await api.get('/coupons/available');
        if (data?.success && data.data) {
          setAvailableCoupons(data.data);
        }
      } catch (err) {
        console.error("Failed to load available coupons", err);
      }
    };

    fetchSettings();
    if (isAuthenticated) fetchCoupons();
  }, [isAuthenticated]);

  const taxAmount = parseFloat((subtotal * (settings.taxRate / 100)).toFixed(2));
  const shippingCharge = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCharge;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalAmount = parseFloat((subtotal + taxAmount + shippingCharge - discountAmount).toFixed(2));

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
        paymentMethod,
        couponCode: appliedCoupon?.code || undefined
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

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    try {
      const { data } = await api.post("/coupons/validate", { code: couponCode });
      setAppliedCoupon(data.data);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired coupon");
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
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
                  Place Order - ₹{totalAmount.toFixed(2)}
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
            
            {/* Coupon Section */}
            <div className="border-t border-gray-200 py-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Discount Code</h3>
              {!appliedCoupon ? (
                <>
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Enter coupon code" 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value)} 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyCoupon} 
                      isLoading={isApplyingCoupon}
                      disabled={!couponCode}
                    >
                      Apply
                    </Button>
                  </div>
                  
                  {/* Available Coupons Button */}
                  {availableCoupons.length > 0 && (
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => setIsCouponsModalOpen(true)}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
                      >
                        View all available coupons
                      </button>
                    </div>
                  )}

                  {/* Coupons Modal */}
                  <Modal
                    isOpen={isCouponsModalOpen}
                    onClose={() => setIsCouponsModalOpen(false)}
                    title="Available Coupons"
                  >
                    <div className="space-y-3 mt-2">
                      {availableCoupons.map(coupon => (
                        <div 
                          key={coupon._id} 
                          className={`p-3 border rounded-xl flex items-start justify-between transition-colors ${
                            coupon.isApplicable 
                              ? 'border-primary-200 bg-primary-50/50 hover:bg-primary-50 cursor-pointer' 
                              : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (coupon.isApplicable) {
                              setCouponCode(coupon.code);
                              const applyDirectly = async (code) => {
                                setIsApplyingCoupon(true);
                                try {
                                  const { data } = await api.post("/coupons/validate", { code });
                                  setAppliedCoupon(data.data);
                                  toast.success("Coupon applied successfully!");
                                  setIsCouponsModalOpen(false); // Close modal on success
                                } catch (error) {
                                  toast.error(error.response?.data?.message || "Invalid or expired coupon");
                                } finally {
                                  setIsApplyingCoupon(false);
                                }
                              };
                              applyDirectly(coupon.code);
                            } else if (coupon.reason) {
                              toast.error(coupon.reason);
                            }
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-bold text-sm ${coupon.isApplicable ? 'text-primary-700' : 'text-gray-700'}`}>
                                {coupon.code}
                              </span>
                              {coupon.applicableCategory && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-500 font-medium">
                                  {coupon.applicableCategory.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              {coupon.discountType === 'percentage' 
                                ? `Get ${coupon.discountValue}% OFF` 
                                : `Get ₹${coupon.discountValue} OFF`}
                              {coupon.minOrderAmount > 0 && ` on orders above ₹${coupon.minOrderAmount}`}
                            </p>
                            {!coupon.isApplicable && coupon.reason && (
                              <p className="text-[10px] text-red-500 mt-1 font-medium">{coupon.reason}</p>
                            )}
                          </div>
                          {coupon.isApplicable && (
                            <span className="text-xs font-semibold text-primary-600 self-center">Apply</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Modal>
                </>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl">
                  <div>
                    <span className="text-sm font-bold text-green-800 uppercase">{appliedCoupon.code}</span>
                    <span className="text-xs text-green-600 block">Coupon applied</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-xs font-semibold text-red-600 hover:text-red-800 underline">
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-650"><span>Shipping</span><span>₹{shippingCharge.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-650"><span>Tax</span><span>₹{taxAmount.toFixed(2)}</span></div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
