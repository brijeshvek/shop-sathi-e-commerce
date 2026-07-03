import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { 
  useGetOrderByIdQuery, useUpdateOrderStatusMutation 
} from '../../features/orders/ordersApi.js'
import Button from '../../components/common/Button.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

export const OrderDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: orderRes, isLoading } = useGetOrderByIdQuery(id)
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()

  const [newStatus, setNewStatus] = useState('')
  const [note, setNote] = useState('')

  const order = orderRes?.data

  const getStatusVariant = (status) => {
    switch (status) {
      case 'delivered': return 'green'
      case 'cancelled': return 'red'
      case 'pending': return 'yellow'
      case 'processing': return 'blue'
      case 'shipped': return 'purple'
      default: return 'gray'
    }
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    if (!newStatus) return

    try {
      await updateStatus({ id, orderStatus: newStatus, note }).unwrap()
      toast.success('Order status updated!')
      setNote('')
      setNewStatus('')
    } catch (err) {
      toast.error('Failed to update status.')
    }
  }

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Order not found.</p>
        <Button variant="secondary" onClick={() => navigate('/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/orders')}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order #{order.orderNumber || order._id.substring(18).toUpperCase()}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Placed on {formatDate(order.createdAt, 'dd MMM yyyy, hh:mm a')}</p>
        </div>
      </div>

      {/* Main Order View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Items & Cost Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <ShoppingBag size={18} className="text-slate-500" />
              <span>Order Items ({order.items?.length || 0})</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image || 'https://via.placeholder.com/150'} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200" 
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{item.name}</h4>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <p className="text-xs text-slate-400">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Payment & Bill Details</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (GST {order.taxRate ? `${order.taxRate * 100}%` : '18%'})</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.shippingCharge)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
                <span>Total Amount</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Customer, Address & Status Processing */}
        <div className="space-y-6">
          {/* Status Processing */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Process Order</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Current Status:</span>
                <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
              </div>
              <form onSubmit={handleUpdateStatus} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Order packaged and handed to BlueDart courier."
                    rows={2}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full text-xs font-bold" 
                  icon={Send}
                  isLoading={isUpdating}
                  disabled={!newStatus}
                >
                  Update Status
                </Button>
              </form>
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <User size={18} className="text-slate-500" />
              <span>Customer Details</span>
            </h3>
            <div className="text-sm">
              <p className="font-bold text-slate-800">{order.user?.name || 'Guest User'}</p>
              <p className="text-slate-500 mt-1">{order.user?.email || '-'}</p>
              <p className="text-slate-500 mt-1">{order.user?.phone || 'No phone provided'}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <MapPin size={18} className="text-slate-500" />
              <span>Shipping Address</span>
            </h3>
            <div className="text-sm text-slate-500 space-y-1.5">
              <p className="font-bold text-slate-800">{order.shippingAddress?.fullName}</p>
              <p className="text-xs">{order.shippingAddress?.phone}</p>
              <p className="text-slate-600 mt-2">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-xs uppercase font-semibold text-slate-400 mt-1">{order.shippingAddress?.label} Address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
