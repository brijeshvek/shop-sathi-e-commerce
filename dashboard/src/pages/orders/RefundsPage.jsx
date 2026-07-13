import React, { useState } from 'react'
import { CreditCard, Search, CheckCircle, RefreshCcw, Eye, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../features/orders/ordersApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatDate } from '../../utils/formatDate.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const RefundsPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('pending') // 'pending' or 'refunded'
  const [processingId, setProcessingId] = useState(null)

  const debouncedSearch = useDebounce(search, 400)

  // Fetch all orders
  const { data: ordersRes, isLoading, refetch } = useGetAllOrdersQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  })

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()

  const allOrders = ordersRes?.data || []
  const pagination = ordersRes?.pagination || { currentPage: 1, totalPages: 1 }

  // Filter orders based on active tab
  const filteredOrders = allOrders.filter((order) => {
    // Check if any item in the order has a return status that might need refunding (approved or completed)
    const hasApprovedReturns = order.items?.some(i => ['approved', 'completed'].includes(i.returnStatus))
    const isCancelledAndPaid = order.orderStatus === 'cancelled' && order.paymentStatus === 'paid'

    if (activeTab === 'pending') {
      // Pending refund: (cancelled & paid) OR (has returns & paymentStatus is paid)
      return (isCancelledAndPaid || (hasApprovedReturns && order.paymentStatus === 'paid'))
    } else {
      // Refunded: paymentStatus is refunded
      return order.paymentStatus === 'refunded'
    }
  })

  const handleIssueRefund = async () => {
    if (!processingId) return
    try {
      await updateOrderStatus({
        id: processingId,
        paymentStatus: 'refunded',
      }).unwrap()
      toast.success('Refund processed successfully!')
      setProcessingId(null)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to process refund.')
    }
  }

  const getRefundReason = (order) => {
    if (order.orderStatus === 'cancelled') {
      return `Cancellation: ${order.cancelReason || 'Customer requested'}`
    }
    const returnedItem = order.items?.find(i => ['approved', 'completed'].includes(i.returnStatus))
    if (returnedItem) {
      return `Return: ${returnedItem.returnReason || 'Item damaged/unsatisfactory'}`
    }
    return 'Customer request'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Refunds Management</h1>
          <p className="text-slate-500 text-sm mt-1">Track cancellation refunds, item returns, and process payouts.</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab('pending'); setPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending Refunds
          </button>
          <button
            onClick={() => { setActiveTab('refunded'); setPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'refunded'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Refunded History
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center py-16 text-slate-400">
          <CreditCard size={40} className="mb-3 opacity-50" />
          <p className="text-base font-semibold text-slate-700">No refunds found</p>
          <p className="text-sm mt-1">There are no {activeTab} refunds to display.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Table
            columns={['Order #', 'Customer', 'Refund Amount', 'Payment Method', 'Trigger/Reason', 'Status', 'Date', 'Actions']}
            data={filteredOrders}
            renderRow={(order) => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900">
                  #{order.orderNumber || order._id.substring(18).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-slate-800">{order.user?.name || 'Guest'}</div>
                  <div className="text-xs text-slate-400">{order.user?.email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {order.paymentMethod}
                </td>
                <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate" title={getRefundReason(order)}>
                  {getRefundReason(order)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={order.paymentStatus === 'refunded' ? 'green' : 'yellow'}>
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(order.createdAt, 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order._id}`)} title="View Order">
                    <Eye size={14} className="text-slate-500" />
                  </Button>
                  {order.paymentStatus === 'paid' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setProcessingId(order._id)}
                      icon={ArrowRight}
                    >
                      Refund
                    </Button>
                  )}
                </td>
              </tr>
            )}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Refund Confirmation */}
      <ConfirmDialog
        isOpen={!!processingId}
        onClose={() => setProcessingId(null)}
        onConfirm={handleIssueRefund}
        title="Process Refund"
        message="Are you sure you want to mark this order payment as refunded? This will update the payment status to Refunded."
        confirmText="Confirm Refund"
        cancelText="Cancel"
        isLoading={isUpdating}
      />
    </div>
  )
}

export default RefundsPage
