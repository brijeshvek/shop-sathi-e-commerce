import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

// --- Custom Tooltips ---
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {prefix}{entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Reusable Card Wrapper ---
const ChartCard = ({ title, children, span = 1 }) => (
  <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm col-span-1 ${span === 2 ? 'lg:col-span-2' : ''}`}>
    <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
    <div className="h-64 w-full">
      {children}
    </div>
  </div>
);

export const DashboardCharts = ({ revenueData = [], ordersData = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Revenue Chart */}
      <ChartCard title="Revenue Growth (Monthly)" span={1}>
        {revenueData.length === 0 ? (
           <div className="flex items-center justify-center h-full text-slate-400 text-sm">No revenue data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* 2. Orders Chart */}
      <ChartCard title="Orders Breakdown (Monthly)" span={1}>
        {ordersData.length === 0 ? (
           <div className="flex items-center justify-center h-full text-slate-400 text-sm">No orders data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="delivered" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={40} />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} maxBarSize={40} />
              <Bar dataKey="cancelled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

    </div>
  )
}

export default DashboardCharts;
