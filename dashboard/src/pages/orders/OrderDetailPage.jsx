import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Send, FileText, Printer, Download } from 'lucide-react'
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
  const [showInvoice, setShowInvoice] = useState(false)

  const order = orderRes?.data

  const handleDownloadInvoice = () => {
    const element = document.getElementById('printable-invoice')
    if (!element) return
    
    const opt = {
      margin:       0.5,
      filename:     `invoice_${order.orderNumber || order._id.substring(18).toUpperCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, logging: false, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    const loadHtml2Pdf = () => {
      return new Promise((resolve) => {
        if (window.html2pdf) {
          resolve(true)
          return
        }
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })
    }

    toast.promise(
      loadHtml2Pdf().then((loaded) => {
        if (!loaded) throw new Error("Failed to load PDF generator")
        return window.html2pdf().from(element).set(opt).save()
      }),
      {
        loading: 'Generating PDF...',
        success: 'Invoice downloaded!',
        error: 'Could not generate PDF'
      }
    )
  }

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
    <>
      <div className="space-y-6 max-w-5xl print:hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <Button 
          variant="secondary" 
          onClick={() => setShowInvoice(true)}
          className="flex items-center space-x-2 self-start sm:self-auto text-xs"
          icon={FileText}
        >
          View Invoice
        </Button>
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

          {/* Payment Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <CreditCard size={18} className="text-slate-500" />
              <span>Payment Details</span>
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'green' : order.paymentStatus === 'pending' ? 'yellow' : 'red'}>
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentDetails?.razorpayOrderId && (
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono text-slate-650">{order.paymentDetails.razorpayOrderId}</span>
                </div>
              )}
              {order.paymentDetails?.razorpayPaymentId && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="font-mono text-slate-650">{order.paymentDetails.razorpayPaymentId}</span>
                </div>
              )}
              {order.paymentDetails?.paidAt && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Paid At:</span>
                  <span className="text-slate-600">{formatDate(order.paymentDetails.paidAt, 'dd MMM yyyy, hh:mm a')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

      {showInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto print:absolute print:inset-0 print:bg-white print:p-0">
          <div id="printable-invoice" className="bg-white rounded-2xl w-full max-w-3xl p-8 shadow-2xl relative print:shadow-none print:w-full print:max-w-none print:p-0">
            {/* Close button (hidden in print) */}
            <button 
              onClick={() => setShowInvoice(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 print:hidden text-lg font-bold"
            >
              ✕
            </button>

            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-indigo-650 tracking-tight">Shop Sathi</h1>
                <p className="text-sm text-slate-500 mt-1">Premium E-Commerce Platform</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Invoice</h2>
                <p className="text-sm text-slate-500 mt-1">Invoice #: {order.orderNumber || order._id.substring(18).toUpperCase()}</p>
                <p className="text-xs text-slate-400 mt-0.5">Date: {formatDate(order.createdAt, 'dd MMM yyyy')}</p>
              </div>
            </div>

            {/* Billing & Payment details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Billed To:</h3>
                <p className="font-medium text-slate-800">{order.shippingAddress?.fullName}</p>
                <p className="text-slate-600">{order.shippingAddress?.street}</p>
                <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                <p className="text-slate-600">{order.shippingAddress?.country}</p>
                <p className="text-slate-500 mt-1">Phone: {order.shippingAddress?.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Payment Details:</h3>
                <p className="text-slate-700"><span className="font-medium">Method:</span> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p className="text-slate-700 mt-1">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`capitalize font-semibold ${order.paymentStatus === 'paid' ? 'text-green-650 font-bold' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </span>
                </p>
                {order.paymentDetails?.razorpayPaymentId && (
                  <p className="text-slate-500 text-xs mt-2">
                    <span className="font-medium">Transaction ID:</span> {order.paymentDetails.razorpayPaymentId}
                  </p>
                )}
                {order.paymentDetails?.paidAt && (
                  <p className="text-slate-500 text-xs mt-1">
                    <span className="font-medium">Paid On:</span> {formatDate(order.paymentDetails.paidAt, 'dd MMM yyyy, hh:mm a')}
                  </p>
                )}
              </div>
            </div>

            {/* Items list */}
            <table className="w-full text-left border-collapse my-6 text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-705 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <tr key={item._id} className="text-slate-800">
                    <td className="py-3 px-3">
                      <span className="font-medium">{item.name}</span>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <span className="block text-xs text-slate-450 mt-0.5">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-3 text-center">{item.quantity}</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end text-sm">
              <div className="w-64 space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingCharge)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-base text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-650">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer message */}
            <div className="text-center text-xs text-slate-400 border-t border-slate-200 pt-6 mt-8">
              Shop Sathi Administrator Order Invoice. Generated automatically on {formatDate(new Date().toISOString(), 'dd MMM yyyy, hh:mm a')}.
            </div>

            {/* Action buttons (hidden in print) */}
            <div className="flex justify-end space-x-3 mt-6 print:hidden">
              <Button variant="secondary" onClick={() => setShowInvoice(false)}>
                Close
              </Button>
              <Button onClick={handleDownloadInvoice} className="flex items-center space-x-2 text-xs" icon={Download}>
                Download PDF
              </Button>
              <Button onClick={() => window.print()} className="flex items-center space-x-2 text-xs" icon={Printer}>
                Print Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderDetailPage
