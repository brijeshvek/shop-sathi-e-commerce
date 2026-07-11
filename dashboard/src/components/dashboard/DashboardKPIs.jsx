import React from 'react';
import { 
  IndianRupee, ShoppingBag, CalendarDays, BarChart, 
  Clock, CheckCircle, XCircle, RefreshCcw, Users, 
  Store, Package, AlertTriangle, AlertCircle, Ticket, 
  Star, Eye, Layers
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

export const DashboardKPIs = ({ stats }) => {
  
  // Real data mapped strictly from the API (no fake fallbacks)
  const kpis = [
    { title: "Today's Revenue", value: formatCurrency(stats?.revenue?.today || 0), icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Weekly Revenue", value: formatCurrency(stats?.revenue?.thisWeek || 0), icon: BarChart, color: "text-teal-600", bg: "bg-teal-100" },
    { title: "Monthly Revenue", value: formatCurrency(stats?.revenue?.thisMonth || 0), icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-100" },
    
    { title: "Total Orders", value: stats?.orders?.total || 0, icon: ShoppingBag, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Pending Orders", value: stats?.orders?.pending || 0, icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Delivered Orders", value: stats?.orders?.delivered || 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { title: "Cancelled Orders", value: stats?.orders?.cancelled || 0, icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
    
    { title: "Total Customers", value: stats?.customers?.total || 0, icon: Users, color: "text-violet-600", bg: "bg-violet-100" },
    { title: "New Customers Today", value: stats?.customers?.newToday || 0, icon: Users, color: "text-fuchsia-600", bg: "bg-fuchsia-100" },
    { title: "Total Sellers", value: stats?.sellers?.total || 0, icon: Store, color: "text-amber-600", bg: "bg-amber-100" },
    
    { title: "Total Categories", value: stats?.categories?.total || 0, icon: Layers, color: "text-cyan-600", bg: "bg-cyan-100" },
    { title: "Total Products", value: stats?.products?.total || 0, icon: Package, color: "text-sky-600", bg: "bg-sky-100" },
    { title: "Active Products", value: stats?.products?.active || 0, icon: CheckCircle, color: "text-lime-600", bg: "bg-lime-100" },
    { title: "Out of Stock", value: stats?.products?.outOfStock || 0, icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <Icon size={18} className={kpi.color} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{kpi.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardKPIs;
