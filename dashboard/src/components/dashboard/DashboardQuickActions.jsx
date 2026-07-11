import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layers, Tag, Ticket, Store, Bell } from 'lucide-react';

const actions = [
  { name: 'Add Product', path: '/products/add', icon: Plus, color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100', border: 'border-indigo-100' },
  { name: 'Add Category', path: '/categories', icon: Layers, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100', border: 'border-blue-100' },
  { name: 'Add Brand', path: '/brands', icon: Tag, color: 'bg-violet-50 text-violet-600 hover:bg-violet-100', border: 'border-violet-100' },
  { name: 'Create Coupon', path: '/coupons', icon: Ticket, color: 'bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100', border: 'border-fuchsia-100' },
  { name: 'Add Seller', path: '/sellers', icon: Store, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100', border: 'border-amber-100' },
  { name: 'Send Notification', path: '/notifications', icon: Bell, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100', border: 'border-rose-100' },
];

export const DashboardQuickActions = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link 
            key={idx}
            to={action.path}
            className={`flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-slate-300 group`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${action.color} ${action.border} mb-3`}>
              <Icon size={22} strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-slate-700 text-center">{action.name}</span>
          </Link>
        )
      })}
    </div>
  )
}

export default DashboardQuickActions;
