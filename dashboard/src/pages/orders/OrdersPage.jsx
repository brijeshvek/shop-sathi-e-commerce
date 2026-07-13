import React, { useState } from 'react'
import { Eye, Search, Calendar, FileDown, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetAllOrdersQuery } from '../../features/orders/ordersApi.js'
import { useGetSellerOrdersQuery } from '../../features/seller/sellerApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import { useAuth } from '../../hooks/useAuth.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatDate } from '../../utils/formatDate.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const OrdersPage = () => {
  const navigate = useNavigate()
  const { isSeller, isAdmin } = useAuth()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const debouncedSearch = useDebounce(search, 400)

  // Admin uses admin API, Seller uses seller API
  const adminQuery = useGetAllOrdersQuery({
    page, limit: 10,
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    search: debouncedSearch || undefined,
  }, { skip: isSeller })

  const sellerQuery = useGetSellerOrdersQuery({
    page, limit: 10,
  }, { skip: !isSeller })

  const activeQuery = isSeller ? sellerQuery : adminQuery

  const orders = activeQuery.data?.data || []
  const isLoading = activeQuery.isLoading
  const pagination = activeQuery.data?.pagination || { currentPage: 1, totalPages: 1 }

  const getStatusVariant = (orderStatus) => {
    switch (orderStatus) {
      case 'delivered': return 'green'
      case 'cancelled': return 'red'
      case 'pending': return 'yellow'
      case 'processing': return 'blue'
      case 'shipped': return 'purple'
      default: return 'gray'
    }
  }

  // CSV export (admin only)
  const handleExportCSV = () => {
    if (orders.length === 0) return
    const headers = ['Order Number', 'Customer Name', 'Customer Email', 'Items Count', 'Total Amount', 'Status', 'Date']
    const rows = orders.map(order => [
      order.orderNumber || order._id,
      order.user?.name || 'Guest',
      order.user?.email || 'N/A',
      order.items?.length || 0,
      order.totalAmount,
      order.orderStatus || order.status,
      formatDate(order.createdAt, 'yyyy-MM-dd')
    ])

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `orders_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isSeller ? 'My Orders' : 'Orders'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isSeller ? 'Orders containing your products' : 'Monitor, process, and export customer order records'}
          </p>
        </div>
        {isAdmin && (
          <Button variant="secondary" icon={FileDown} onClick={handleExportCSV} disabled={orders.length === 0}>
            Export CSV
          </Button>
        )}
      </div>

      {/* Filters Bar — admin gets full filters, seller gets simplified */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      {/* Orders Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center py-16 text-slate-400">
          <ShoppingCart size={40} className="mb-3" />
          <p className="text-base font-semibold">No orders found</p>
          <p className="text-sm mt-1">{isSeller ? 'Orders with your products will appear here' : 'No matching orders'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Table
            columns={['#', 'Order #', 'Customer', 'Items Count', 'Total', 'Payment', 'Date', 'Status', ...(isAdmin ? ['Actions'] : [])]}
            data={orders}
            renderRow={(order, index) => {
              const orderStatus = order.orderStatus || order.status
              return (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                    {(pagination.currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900">
                    #{order.orderNumber || order._id.substring(18).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-800">{order.user?.name || 'Guest'}</div>
                    <div className="text-xs text-slate-400">{order.user?.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {order.items?.length || 0} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-slate-500 font-medium capitalize">
                      {order.paymentMethod || '-'} | <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-bold' : ''}>{order.paymentStatus || 'pending'}</span>
                    </div>
                    {order.paymentStatus === 'paid' && order.paymentDetails?.razorpayPaymentId && (
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Txn: {order.paymentDetails.razorpayPaymentId}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(order.createdAt, 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(orderStatus)}>
                      {orderStatus}
                    </Badge>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order._id}`)}>
                        <Eye size={14} className="text-slate-500" />
                      </Button>
                    </td>
                  )}
                </tr>
              )
            }}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}

export default OrdersPage
