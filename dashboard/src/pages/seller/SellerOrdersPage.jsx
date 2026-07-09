import React, { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useGetSellerOrdersQuery, useUpdateSellerOrderStatusMutation } from '../../features/seller/sellerApi.js'
import toast from 'react-hot-toast'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

const STATUS_STYLES = {
  processing: 'bg-blue-100 text-blue-700',
  confirmed:  'bg-indigo-100 text-indigo-700',
  shipped:    'bg-yellow-100 text-yellow-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

export const SellerOrdersPage = () => {
  const [page, setPage] = useState(1)
  const { data: res, isLoading } = useGetSellerOrdersQuery({ page, limit: 10 })
  const orders = res?.data || []
  const meta = res?.pagination || {}

  const [updateStatus, { isLoading: isUpdating }] = useUpdateSellerOrderStatusMutation()

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap()
      toast.success('Order status updated!')
    } catch (err) {
      toast.error('Failed to update order status.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500 text-sm mt-1">Orders containing your products</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-400">
          <ShoppingCart size={40} className="mb-3" />
          <p className="text-base font-semibold">No orders yet</p>
          <p className="text-sm mt-1">Orders with your products will appear here</p>
        </div>
      ) : (
        <>
          <Table
            columns={['#', 'Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Action']}
            data={orders}
            renderRow={(order, index) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-500">
                  {((meta.currentPage || 1) - 1) * 10 + index + 1}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-sm text-slate-700">
                  #{order._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900">{order.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-400">{order.user?.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.orderStatus] || 'bg-slate-100 text-slate-600'}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={isUpdating || order.orderStatus === 'cancelled' || order.orderStatus === 'delivered'}
                    className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            )}
          />

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-colors ${
                    page === p
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SellerOrdersPage
