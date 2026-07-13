import React, { useState } from 'react'
import { FileText, Download, Calendar, TrendingUp, BarChart2, AlertCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetAllOrdersQuery } from '../../features/orders/ordersApi.js'
import { useGetTopProductsQuery } from '../../features/analytics/analyticsApi.js'
import { useGetProductsAdminQuery } from '../../features/products/productsApi.js'
import { useAuth } from '../../hooks/useAuth.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

export const ReportsPage = () => {
  const { isSeller } = useAuth()
  const [activeTab, setActiveTab] = useState('sales') // 'sales', 'products', 'inventory'
  
  // Date filter for Sales Report
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30) // Default last 30 days
    return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  // Queries
  const { data: ordersRes, isLoading: ordersLoading } = useGetAllOrdersQuery({
    startDate: startDate || undefined,
    endDate: endDate ? `${endDate}T23:59:59.999Z` : undefined,
    limit: 100
  })

  const { data: topProductsRes, isLoading: topProductsLoading } = useGetTopProductsQuery({
    limit: 15
  })

  const { data: productsRes, isLoading: productsLoading } = useGetProductsAdminQuery({
    limit: 100
  })

  const orders = ordersRes?.data || []
  const topProducts = topProductsRes?.data || []
  const products = productsRes?.data || []

  // Sales calculations
  const totalSales = orders
    .filter(o => o.paymentStatus === 'paid' || o.orderStatus === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  
  const totalOrdersCount = orders.length
  const avgOrderValue = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0

  // Low stock inventory filtering
  const lowStockItems = products.filter(p => p.stock <= (p.lowStockAlertLimit || 5))

  // Helper to convert data and download CSV
  const downloadCSV = (headers, rows, filename) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => {
        // Escape quotes and wrap strings in quotes if they contain commas
        const strVal = String(val === undefined || val === null ? '' : val)
        if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
          return `"${strVal.replace(/"/g, '""')}"`
        }
        return strVal
      }).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export Sales CSV
  const handleExportSales = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Items Count', 'Payment Method', 'Payment Status', 'Total Amount']
    const rows = orders.map(o => [
      o.orderNumber || o._id,
      new Date(o.createdAt).toLocaleDateString(),
      o.user?.name || 'Guest',
      o.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
      o.paymentMethod,
      o.paymentStatus,
      o.totalAmount
    ])
    downloadCSV(headers, rows, 'sales_report')
    toast.success('Sales report exported to CSV')
  }

  // Export Top Products CSV
  const handleExportTopProducts = () => {
    const headers = ['Product ID', 'Product Name', 'Quantity Sold', 'Total Revenue']
    const rows = topProducts.map(p => [
      p._id,
      p.name,
      p.salesCount || 0,
      p.revenue || 0
    ])
    downloadCSV(headers, rows, 'top_products_performance')
    toast.success('Product performance exported to CSV')
  }

  // Export Inventory Alert CSV
  const handleExportInventory = () => {
    const headers = ['Product Name', 'SKU', 'Current Stock', 'Alert Limit', 'Warehouse Location']
    const rows = lowStockItems.map(p => [
      p.name,
      p.sku || 'N/A',
      p.stock,
      p.lowStockAlertLimit || 5,
      p.warehouse || 'Primary Warehouse'
    ])
    downloadCSV(headers, rows, 'inventory_alerts')
    toast.success('Inventory alerts exported to CSV')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Export transactional records, product performace charts, and physical inventory alerts.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'sales'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Performance
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Inventory Alerts ({lowStockItems.length})
          </button>
        </div>
      </div>

      {/* SALES REPORT TAB */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Filters & Actions */}
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Range:</span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <Button variant="primary" icon={Download} onClick={handleExportSales} disabled={orders.length === 0}>
              Export to CSV
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Net Revenue</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalSales)}</p>
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <BarChart2 size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders Placed</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{totalOrdersCount}</p>
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg. Order Value</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(avgOrderValue)}</p>
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Detailed Transactions List</h3>
            </div>
            <Table
              columns={['Order #', 'Date', 'Customer', 'Items Count', 'Payment Status', 'Total Amount']}
              data={orders}
              isLoading={ordersLoading}
              emptyMessage="No transaction records found in this range."
              renderRow={(o) => (
                <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900">
                    #{o.orderNumber || o._id.substring(18).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(o.createdAt, 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {o.user?.name || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {o.items?.reduce((sum, i) => sum + i.quantity, 0) || 0} item(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                    {formatCurrency(o.totalAmount)}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      )}

      {/* PRODUCTS PERFORMANCE TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Top-Selling Products</h3>
            <Button variant="primary" icon={Download} onClick={handleExportTopProducts} disabled={topProducts.length === 0}>
              Export list
            </Button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <Table
              columns={['Rank', 'Product Name', 'Total Quantity Sold', 'Revenue Generated']}
              data={topProducts}
              isLoading={topProductsLoading}
              emptyMessage="No product sales statistics available."
              renderRow={(p, idx) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-400">
                    #{idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 max-w-[300px] truncate" title={p.name}>
                    {p.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {p.salesCount || 0} unit(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                    {formatCurrency(p.revenue || 0)}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      )}

      {/* INVENTORY REPORT TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Low Stock Warnings</h3>
            <Button variant="primary" icon={Download} onClick={handleExportInventory} disabled={lowStockItems.length === 0}>
              Export list
            </Button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <Table
              columns={['Product Name', 'SKU', 'Current Stock Level', 'Alert Limit', 'Warehouse Location']}
              data={lowStockItems}
              isLoading={productsLoading}
              emptyMessage="All product inventory levels are healthy!"
              renderRow={(p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">
                    {p.sku || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                      p.stock === 0 ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {p.stock} items left
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {p.lowStockAlertLimit || 5} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {p.warehouse || 'Primary Warehouse'}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsPage
