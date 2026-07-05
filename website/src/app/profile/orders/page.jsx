"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { format } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders");
        setOrders(data.data || []);
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      ))}
    </div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders yet</h3>
        <p className="mt-1 text-sm text-gray-500">When you place orders, they will appear here.</p>
        <div className="mt-6">
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-6">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-700 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Number</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date Placed</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Amount</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">${order.totalAmount?.toFixed(2)}</p>
              </div>
              <div>
                <Link href={`/profile/orders/${order._id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No img</div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${order.orderStatus === 'delivered' ? 'bg-success-100 text-success-800' : 
                      order.orderStatus === 'cancelled' ? 'bg-error-100 text-error-800' : 
                      'bg-warning-100 text-warning-800'}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
