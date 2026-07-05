"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Package, Truck, CheckCircle, PackageOpen, XCircle } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
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
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => router.push('/profile/orders')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading">
          Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Placed</p>
            <p className="font-medium text-gray-900 dark:text-white">{format(new Date(order.createdAt), "MMMM dd, yyyy h:mm a")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium text-gray-900 dark:text-white">${order.totalAmount?.toFixed(2)}</p>
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
                    <p className="text-base font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)} each</p>}
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
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? 'Free' : `$${order.shippingCharge?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span>${order.taxAmount?.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Discount</span>
                  <span>-${order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-primary-600">${order.totalAmount?.toFixed(2)}</span>
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
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="flex justify-between mb-2">
                <span>Method:</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium capitalize ${order.paymentStatus === 'paid' ? 'text-success-600' : 'text-warning-600'}`}>
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
