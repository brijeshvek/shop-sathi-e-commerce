import React, { useState } from 'react'
import { DollarSign, Search, CreditCard, Landmark, Percent, Receipt, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetAllOrdersQuery } from '../../features/orders/ordersApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

export const FinancePage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('')

  const debouncedSearch = useDebounce(search, 400)

  // Fetch all orders
  const { data: ordersRes, isLoading } = useGetAllOrdersQuery({
    page,
    limit: 15,
    search: debouncedSearch || undefined,
  })

  const orders = ordersRes?.data || []
  const pagination = ordersRes?.pagination || { currentPage: 1, totalPages: 1 }

  // Filter orders by payment method locally if requested
  const filteredTransactions = orders.filter(order => {
    if (paymentMethodFilter && order.paymentMethod !== paymentMethodFilter) return false
    return true
  })

  // Global calculations based on loaded page orders or database analytics
  // Let's calculate total metrics based on available orders
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const onlineRevenue = orders
    .filter(o => o.paymentStatus === 'paid' && o.paymentMethod === 'ONLINE')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const codRevenue = orders
    .filter(o => o.paymentStatus === 'paid' && o.paymentMethod === 'COD')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const commissionRate = 0.10 // 10% standard platform commission
  const totalCommission = totalRevenue * commissionRate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="text-emerald-600" />
          Financial Ledger
        </h1>
        <p className="text-slate-500 text-sm mt-1">Track payments collected, gateway splits, and platform commissions.</p>
      </div>

      {/* Finance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Landmark size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Net Revenue</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Online Payments</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(onlineRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">COD Collected</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(codRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-650 rounded-lg">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Comm. (10%)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalCommission)}</p>
          </div>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setPaymentMethodFilter('')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              paymentMethodFilter === ''
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Methods
          </button>
          <button
            onClick={() => setPaymentMethodFilter('ONLINE')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              paymentMethodFilter === 'ONLINE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Online Only
          </button>
          <button
            onClick={() => setPaymentMethodFilter('COD')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              paymentMethodFilter === 'COD'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            COD Only
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transaction by order..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={['Order #', 'Date', 'Gross Amount', 'Comm. (10%)', 'Net Seller Payout', 'Payment Gateway', 'Payment Status', 'Details']}
          data={filteredTransactions}
          isLoading={isLoading}
          emptyMessage="No transaction logs found."
          renderRow={(order) => {
            const gross = order.totalAmount
            const comm = gross * commissionRate
            const net = gross - comm
            
            return (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900">
                  #{order.orderNumber || order._id.substring(18).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(order.createdAt, 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                  {formatCurrency(gross)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-650 font-medium">
                  -{formatCurrency(comm)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                  {formatCurrency(net)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                  {order.paymentMethod === 'ONLINE' ? 'Razorpay Gateway' : 'COD (Cash Collected)'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={order.paymentStatus === 'paid' ? 'green' : order.paymentStatus === 'refunded' ? 'gray' : 'yellow'}>
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  >
                    View Invoice
                    <ArrowUpRight size={14} />
                  </button>
                </td>
              </tr>
            )
          }}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FinancePage
