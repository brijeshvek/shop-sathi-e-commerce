"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Package, Truck, CheckCircle, PackageOpen, XCircle, FileText, Printer, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Spinner } from "@/components/common/Spinner";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleDownloadInvoice = () => {
    const element = document.getElementById('printable-invoice');
    if (!element) return;
    
    const opt = {
      margin:       0.5,
      filename:     `invoice_${order.orderNumber || order._id.slice(-6).toUpperCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: false, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const loadHtml2Pdf = () => {
      return new Promise((resolve) => {
        if (window.html2pdf) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    toast.promise(
      loadHtml2Pdf().then((loaded) => {
        if (!loaded) throw new Error("Failed to load PDF generator");
        return window.html2pdf().from(element).set(opt).save();
      }),
      {
        loading: 'Generating PDF...',
        success: 'Invoice downloaded!',
        error: 'Could not generate PDF'
      }
    );
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

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Razorpay payment gateway failed to load. Please try again.");
        return;
      }

      const { data } = await api.post(`/orders/${order._id}/pay`);
      const { razorpayOrder } = data.data;

      const { data: keyRes } = await api.get("/orders/razorpay-key");
      const razorpayKey = keyRes.data.keyId;

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Shop Sathi",
        description: `Payment for Order ${order.orderNumber || order._id}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          setIsPaying(true);
          try {
            const { data: verifyData } = await api.post("/orders/verify-payment", {
              orderId: order._id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            setOrder(verifyData.data);
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
          } finally {
            setIsPaying(false);
          }
        },
        prefill: {
          name: order.shippingAddress.fullName,
          contact: order.shippingAddress.phone,
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled.");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 animate-pulse space-y-6 opacity-30">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <Spinner size="lg" className="z-10" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order not found</h3>
        <p className="mt-1 text-sm text-gray-500">The order you are looking for does not exist or you don't have access.</p>
        <div className="mt-6">
          <Button onClick={() => router.push('/profile/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  // Determine active step for tracking
  const statuses = ["pending", "processing", "shipped", "delivered"];
  const isCancelled = order.orderStatus === "cancelled";
  
  let currentStepIndex = statuses.indexOf(order.orderStatus);
  if (currentStepIndex === -1 && !isCancelled) currentStepIndex = 0;

  return (
    <>
      <div className="print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/profile/orders')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
            Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
          </h1>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setShowInvoice(true)}
          className="flex items-center space-x-2 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>View Invoice</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Placed</p>
            <p className="font-medium text-gray-900 dark:text-white">{format(new Date(order.createdAt), "MMMM dd, yyyy h:mm a")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium text-gray-900 dark:text-white">₹{order.totalAmount?.toFixed(2)}</p>
          </div>
          <div>
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold capitalize
              ${order.orderStatus === 'delivered' ? 'bg-success-100 text-success-800' : 
                order.orderStatus === 'cancelled' ? 'bg-error-100 text-error-800' : 
                'bg-warning-100 text-warning-800'}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Order Tracking Timeline */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tracking Status</h3>
          
          {isCancelled ? (
            <div className="flex items-center text-error-600 bg-error-50 dark:bg-error-900/20 p-4 rounded-xl border border-error-100 dark:border-error-800/30">
              <XCircle className="w-6 h-6 mr-3" />
              <div>
                <p className="font-medium">Order Cancelled</p>
                <p className="text-sm mt-0.5 opacity-90">This order was cancelled {order.cancelledAt && `on ${format(new Date(order.cancelledAt), "MMM dd, yyyy")}`}</p>
                {order.cancelReason && <p className="text-sm mt-1 opacity-80">Reason: {order.cancelReason}</p>}
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className={`flex flex-col items-center w-1/4 ${currentStepIndex >= 0 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${currentStepIndex >= 0 ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Pending</span>
                  </div>
                  
                  <div className={`flex flex-col items-center w-1/4 ${currentStepIndex >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${currentStepIndex >= 1 ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <PackageOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Processing</span>
                  </div>

                  <div className={`flex flex-col items-center w-1/4 ${currentStepIndex >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${currentStepIndex >= 2 ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Shipped</span>
                  </div>

                  <div className={`flex flex-col items-center w-1/4 ${currentStepIndex >= 3 ? 'text-success-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${currentStepIndex >= 3 ? 'bg-success-100 dark:bg-success-900/30 text-success-600' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center">Delivered</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Line */}
              <div className="absolute top-5 left-[12.5%] right-[12.5%] h-[2px] bg-gray-200 dark:bg-gray-700 -z-0">
                <div 
                  className="h-full bg-primary-500 transition-all duration-500 ease-in-out" 
                  style={{ width: `${(Math.min(currentStepIndex, 3) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Items</h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {order.items.map((item) => (
                <li key={item._id} className="p-6 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product?.slug || item.product?._id}`}>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-primary-600 truncate">{item.name}</h4>
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-base font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-500 mt-1">₹{item.price.toFixed(2)} each</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>₹{order.taxAmount?.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Discount</span>
                  <span>-₹{order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-primary-600">₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shipping Information</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p className="font-medium text-gray-900 dark:text-white mb-2">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p className="pt-2">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Information</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <span>Status:</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-success-600' : 'text-warning-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentDetails?.razorpayPaymentId && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{order.paymentDetails.razorpayPaymentId}</span>
                </div>
              )}
              {order.paymentDetails?.paidAt && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Paid On:</span>
                  <span>{format(new Date(order.paymentDetails.paidAt), "dd MMM yyyy, h:mm a")}</span>
                </div>
              )}

              {order.paymentMethod === 'ONLINE' && order.paymentStatus === 'pending' && (
                <div className="pt-4">
                  <Button 
                    onClick={handlePayNow} 
                    isLoading={isPaying} 
                    className="w-full text-sm font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Pay Now</span>
                  </Button>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Complete payment securely via Razorpay
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {showInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto print:absolute print:inset-0 print:bg-white print:p-0 animate-fade-in-overlay">
          <div id="printable-invoice" className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl p-8 shadow-2xl relative print:shadow-none print:w-full print:max-w-none print:p-0 animate-modal-open">
            {/* Close button (hidden in print) */}
            <button 
              onClick={() => setShowInvoice(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 print:hidden text-lg font-bold"
            >
              ✕
            </button>

            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-800 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-primary-600 tracking-tight">Shop Sathi</h1>
                <p className="text-sm text-gray-500 mt-1">Premium E-Commerce Platform</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Invoice</h2>
                <p className="text-sm text-gray-500 mt-1">Invoice #: {order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-0.5">Date: {format(new Date(order.createdAt), "dd MMM yyyy")}</p>
              </div>
            </div>

            {/* Billing & Payment details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Billed To:</h3>
                <p className="font-medium text-gray-800 dark:text-gray-300">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress?.street}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress?.country}</p>
                <p className="text-gray-500 mt-1">Phone: {order.shippingAddress?.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Details:</h3>
                <p className="text-gray-750 dark:text-gray-300"><span className="font-medium">Method:</span> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p className="text-gray-750 dark:text-gray-300 mt-1">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`capitalize font-semibold ${order.paymentStatus === 'paid' ? 'text-success-600' : 'text-warning-600'}`}>
                    {order.paymentStatus}
                  </span>
                </p>
                {order.paymentDetails?.razorpayPaymentId && (
                  <p className="text-gray-500 text-xs mt-2">
                    <span className="font-medium">Transaction ID:</span> {order.paymentDetails.razorpayPaymentId}
                  </p>
                )}
                {order.paymentDetails?.paidAt && (
                  <p className="text-gray-500 text-xs mt-1">
                    <span className="font-medium">Paid On:</span> {format(new Date(order.paymentDetails.paidAt), "dd MMM yyyy, h:mm a")}
                  </p>
                )}
              </div>
            </div>

            {/* Items list */}
            <table className="w-full text-left border-collapse my-6 text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items.map((item) => (
                  <tr key={item._id} className="text-gray-800 dark:text-gray-200">
                    <td className="py-3 px-3">
                      <span className="font-medium">{item.name}</span>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <span className="block text-xs text-gray-400 mt-0.5">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="py-3 px-3 text-center">{item.quantity}</td>
                    <td className="py-3 px-3 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end text-sm">
              <div className="w-64 space-y-2 border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge?.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>₹{order.taxAmount?.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-success-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-2 flex justify-between font-bold text-base text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-primary-600">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-center text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
              Thank you for shopping with Shop Sathi! If you have any questions, contact us at support@shopsathi.com.
            </div>

            {/* Action buttons (hidden in print) */}
            <div className="flex justify-end space-x-3 mt-6 print:hidden">
              <Button variant="secondary" onClick={() => setShowInvoice(false)}>
                Close
              </Button>
              <Button onClick={handleDownloadInvoice} className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </Button>
              <Button onClick={() => window.print()} className="flex items-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
