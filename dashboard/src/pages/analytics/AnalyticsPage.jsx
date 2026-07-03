import React, { useState } from 'react'
import { BarChart2, TrendingUp, DollarSign, Package, ShoppingBag, FileDown } from 'lucide-react'
import { 
  useGetRevenueChartQuery, useGetOrdersChartQuery, useGetTopProductsQuery 
} from '../../features/analytics/analyticsApi.js'
import Spinner from '../../components/common/Spinner.jsx'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import RevenueChart from '../../components/charts/RevenueChart.jsx'
import OrderChart from '../../components/charts/OrderChart.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const AnalyticsPage = () => {
  const [period, setPeriod] = useState('monthly')
  const { data: revenueRes, isLoading: revLoading } = useGetRevenueChartQuery({ period })
  const { data: ordersRes, isLoading: ordLoading } = useGetOrdersChartQuery()
  const { data: topRes, isLoading: topLoading } = useGetTopProductsQuery({ limit: 5 })

  const revenueData = revenueRes?.data || []
  const ordersData = ordersRes?.data || []
  const topProducts = topRes?.data || []

  const handleExportStats = () => {
    if (revenueData.length === 0) return
    const headers = ['Label', 'Revenue', 'Orders Count']
    const rows = revenueData.map(d => [d.label, d.revenue, d.orders])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `revenue_analytics_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (revLoading || ordLoading || topLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Deep-dive financial metrics and inventory sales reports</p>
        </div>
        <Button variant="secondary" icon={FileDown} onClick={handleExportStats}>
          Export Report
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <DollarSign size={18} className="text-slate-500" />
              <span>Revenue Analytics</span>
            </h3>
            <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  period === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPeriod('yearly')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  period === 'yearly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          <RevenueChart data={revenueData} height={300} />
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <ShoppingBag size={18} className="text-slate-500" />
            <span>Order Conversions & Statuses</span>
          </h3>
          <OrderChart data={ordersData} height={300} />
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Package size={18} className="text-slate-500" />
          <span>Top Selling Products</span>
        </h3>
        <Table
          columns={['Image', 'Product Name', 'Units Sold', 'Total Revenue Generated']}
          data={topProducts}
          renderRow={(prod) => (
            <tr key={prod._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <img src={prod.image || 'https://via.placeholder.com/150'} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                {prod.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                {prod.unitsSold} units
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
                {formatCurrency(prod.revenue)}
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  )
}

export default AnalyticsPage
