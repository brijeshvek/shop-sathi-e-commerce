import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import Badge from '../../components/common/Badge.jsx';

// --- Subcomponents ---
const ActivityCard = ({ title, children, span = 1 }) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col ${span === 2 ? 'md:col-span-2' : ''}`}>
    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All</button>
    </div>
    <div className="p-0 flex-1 overflow-x-auto">
      {children}
    </div>
  </div>
);

const getStatusVariant = (status) => {
  switch (status) {
    case 'delivered': return 'green';
    case 'cancelled': return 'red';
    case 'pending': return 'yellow';
    case 'processing': return 'blue';
    default: return 'gray';
  }
};

export const DashboardActivity = ({ stats }) => {
  const recentOrders = stats?.recentOrders || [];
  const lowStockProducts = stats?.lowStockProducts || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* 1. Recent Orders */}
      <ActivityCard title="Recent Orders" span={2}>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-400 p-6 text-center">No recent orders found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <p className="text-xs font-bold text-slate-900">{order.orderNumber || order._id.substring(18).toUpperCase()}</p>
                    <p className="text-[11px] text-slate-500">{order.user?.name || 'Guest User'}</p>
                  </td>
                  <td className="px-5 py-3">
                     <p className="text-[11px] text-slate-500">{formatDate(order.createdAt, 'dd MMM yyyy')}</p>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-800">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-5 py-3 text-right">
                    <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ActivityCard>

      {/* 2. Low Stock Products */}
      <ActivityCard title="Low Stock Alerts">
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-slate-400 p-6 text-center">All inventory levels are healthy.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {lowStockProducts.map((product, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50">
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{product.name}</p>
                  <p className="text-[11px] text-slate-500">Stock: {product.stock}</p>
                </div>
                <div className="flex items-center space-x-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold">
                  <span>Only {product.stock} left</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ActivityCard>

    </div>
  )
}

export default DashboardActivity;
