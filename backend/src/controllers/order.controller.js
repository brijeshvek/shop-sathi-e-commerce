import Order from '../models/Order.model.js'
import Cart from '../models/Cart.model.js'
import Product from '../models/Product.model.js'
import Coupon from '../models/Coupon.model.js'
import User from '../models/User.model.js'
import Setting from '../models/Setting.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/email.service.js'
import crypto from 'crypto'
import razorpay from '../config/razorpay.js'

// POST /api/orders
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body

  // Load system settings
  let dbSettings = await Setting.findOne().lean()
  const taxRateVal = dbSettings?.taxRate !== undefined ? dbSettings.taxRate / 100 : (Number(process.env.TAX_RATE) || 0.18)
  const freeShippingVal = dbSettings?.freeShippingThreshold !== undefined ? dbSettings.freeShippingThreshold : (Number(process.env.FREE_SHIPPING_THRESHOLD) || 499)
  const shippingChargeVal = dbSettings?.shippingCharge !== undefined ? dbSettings.shippingCharge : (Number(process.env.SHIPPING_CHARGE) || 99)

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart || !cart.items.length) throw new ApiError(400, 'Cart is empty.')

  // Verify stock for each item
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw new ApiError(400, `Product "${item.name}" is no longer available.`)
    }
    if (item.product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for "${item.name}". Available: ${item.product.stock}`)
    }
  }

  // Build order items
  const items = cart.items.map(item => ({
    product: item.product._id, name: item.name, image: item.image,
    price: item.price, quantity: item.quantity, selectedVariants: item.selectedVariants,
  }))

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Apply coupon
  let discountAmount = 0, couponDoc = null
  if (couponCode) {
    couponDoc = await Coupon.findOne({ code: couponCode.toUpperCase() })
    if (couponDoc) {
      const errors = couponDoc.validateForUser(req.user._id, subtotal)
      if (errors.length) throw new ApiError(400, errors[0])
      discountAmount = couponDoc.calculateDiscount(subtotal)
    }
  }

  const taxableAmount  = subtotal - discountAmount
  const taxAmount      = parseFloat((taxableAmount * taxRateVal).toFixed(2))
  const shippingCharge = taxableAmount >= freeShippingVal ? 0 : shippingChargeVal
  const totalAmount    = parseFloat((taxableAmount + taxAmount + shippingCharge).toFixed(2))

  // Estimated delivery = 7 days from now
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // Create order
  const order = await Order.create({
    user: req.user._id, items, shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    coupon: couponDoc?._id || null,
    subtotal, discountAmount, taxAmount, shippingCharge, totalAmount, estimatedDelivery,
  })

  // Create Razorpay order if ONLINE
  let razorpayOrder = null
  if (order.paymentMethod === 'ONLINE') {
    try {
      const options = {
        amount: Math.round(order.totalAmount * 100), // in paise
        currency: 'INR',
        receipt: order._id.toString(),
      }
      razorpayOrder = await razorpay.orders.create(options)
      order.paymentDetails = {
        razorpayOrderId: razorpayOrder.id,
      }
      await order.save()
    } catch (err) {
      // If Razorpay order creation fails, we still have the order in DB, but payment status is pending.
      console.error('Razorpay order creation failed:', err.message)
    }
  }

  // Decrement stock
  await Promise.all(cart.items.map(item =>
    Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } })
  ))

  // Update coupon usage
  if (couponDoc) {
    couponDoc.usedCount += 1
    couponDoc.usedBy.push(req.user._id)
    await couponDoc.save()
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null, discountAmount: 0 })

  // Send confirmation email only if COD (Online orders get it after payment verification)
  if (order.paymentMethod === 'COD') {
    sendOrderConfirmationEmail(req.user, order).catch(e => console.error('Order email error:', e.message))
  }

  res.status(201).json(new ApiResponse(201, { order, razorpayOrder }, 'Order placed successfully'))
})

// GET /api/orders  (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, paymentStatus, startDate, endDate, search, hasReturns } = req.query
  const filter = {}
  if (status)        filter.orderStatus  = status
  if (paymentStatus) filter.paymentStatus = paymentStatus
  if (hasReturns === 'true') {
    filter['items.returnStatus'] = { $in: ['requested', 'approved', 'completed', 'rejected'] }
  }
  if (startDate || endDate) {
    filter.createdAt = {}
    if (startDate) filter.createdAt.$gte = new Date(startDate)
    if (endDate)   filter.createdAt.$lte = new Date(endDate)
  }

  const skip = (Number(page) - 1) * Number(limit)
  let query = Order.find(filter).populate('user', 'name email')
    .sort({ createdAt: -1 }).skip(skip).limit(Number(limit))

  const [orders, total] = await Promise.all([query.lean(), Order.countDocuments(filter)])

  res.status(200).json(new ApiResponse(200, orders, 'Orders fetched', {
    currentPage: Number(page), totalPages: Math.ceil(total / limit),
    totalItems: total, itemsPerPage: Number(limit),
  }))
})

// GET /api/orders/my-orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query
  const filter = { user: req.user._id }
  if (status) filter.orderStatus = status

  const skip = (Number(page) - 1) * Number(limit)
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments(filter),
  ])

  res.status(200).json(new ApiResponse(200, orders, 'Orders fetched', {
    currentPage: Number(page), totalPages: Math.ceil(total / limit),
    totalItems: total, itemsPerPage: Number(limit),
  }))
})

// GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product')
    .lean()
  if (!order) throw new ApiError(404, 'Order not found.')
  if (req.user.role === 'customer' && order.user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this order.')
  }
  res.status(200).json(new ApiResponse(200, order, 'Order fetched'))
})

// PUT /api/orders/:id/status  (Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, note } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) throw new ApiError(404, 'Order not found.')

  order.orderStatus = orderStatus
  if (orderStatus === 'delivered') order.deliveredAt = new Date()
  if (orderStatus === 'cancelled') order.cancelledAt = new Date()
  if (note) order.statusHistory[order.statusHistory.length - 1].note = note

  await order.save()

  const user = await User.findById(order.user)
  if (user) sendOrderStatusEmail(user, order).catch(e => console.error('Status email error:', e.message))

  res.status(200).json(new ApiResponse(200, null, `Order status updated to ${orderStatus}`))
})

// PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) throw new ApiError(404, 'Order not found.')
  if (order.user.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not authorized.')
  if (order.orderStatus !== 'pending') {
    throw new ApiError(400, 'Order cannot be cancelled after processing has begun.')
  }

  order.orderStatus = 'cancelled'
  order.cancelledAt = new Date()
  order.cancelReason = req.body.cancelReason || 'Cancelled by customer'
  await order.save()

  // Restore stock
  await Promise.all(order.items.map(item =>
    Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
  ))

  res.status(200).json(new ApiResponse(200, null, 'Order cancelled successfully'))
})

// GET /api/orders/razorpay-key
export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key' }, 'Razorpay Key fetched'))
})

// POST /api/orders/verify-payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body

  const order = await Order.findById(orderId)
  if (!order) throw new ApiError(404, 'Order not found.')

  // Verify signature
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
  hmac.update(razorpayOrderId + '|' + razorpayPaymentId)
  const generatedSignature = hmac.digest('hex')

  if (generatedSignature !== razorpaySignature) {
    order.paymentStatus = 'failed'
    await order.save()
    throw new ApiError(400, 'Payment verification failed. Invalid signature.')
  }

  // Update order status
  order.paymentStatus = 'paid'
  order.orderStatus = 'processing'
  order.paymentDetails = {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paidAt: new Date(),
  }
  await order.save()

  // Send confirmation email (non-blocking)
  const user = await User.findById(order.user)
  if (user) {
    sendOrderConfirmationEmail(user, order).catch(e => console.error('Order email error:', e.message))
  }

  res.status(200).json(new ApiResponse(200, order, 'Payment verified successfully'))
})

// POST /api/orders/:id/pay
export const payPendingOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) throw new ApiError(404, 'Order not found.')
  if (order.user.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not authorized.')
  if (order.paymentStatus === 'paid') throw new ApiError(400, 'Order is already paid.')
  if (order.paymentMethod !== 'ONLINE') throw new ApiError(400, 'Only online payment orders can be paid online.')

  const options = {
    amount: Math.round(order.totalAmount * 100), // in paise
    currency: 'INR',
    receipt: order._id.toString(),
  }
  const razorpayOrder = await razorpay.orders.create(options)

  order.paymentDetails = {
    ...order.paymentDetails,
    razorpayOrderId: razorpayOrder.id,
  }
  await order.save()

  res.status(200).json(new ApiResponse(200, { order, razorpayOrder }, 'Razorpay payment re-initiated'))
})

// POST /api/orders/:id/items/:itemId/return
export const requestReturn = asyncHandler(async (req, res) => {
  const { reason } = req.body
  const order = await Order.findById(req.params.id).populate('items.product')
  
  if (!order) throw new ApiError(404, 'Order not found.')
  if (order.user.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not authorized.')
  if (order.orderStatus !== 'delivered') throw new ApiError(400, 'Only delivered orders can be returned.')

  const item = order.items.id(req.params.itemId)
  if (!item) throw new ApiError(404, 'Item not found in order.')

  const product = item.product
  if (!product.returnPolicy?.isReturnable) {
    throw new ApiError(400, 'This product is not returnable.')
  }

  // Check window
  const daysSinceDelivery = Math.floor((Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24))
  if (daysSinceDelivery > product.returnPolicy.returnDays) {
    throw new ApiError(400, `Return window of ${product.returnPolicy.returnDays} days has expired.`)
  }

  if (item.returnStatus !== 'none') {
    throw new ApiError(400, 'Return already requested for this item.')
  }

  item.returnStatus = 'requested'
  item.returnReason = reason
  item.returnRequestDate = new Date()

  await order.save()

  res.status(200).json(new ApiResponse(200, order, 'Return requested successfully'))
})

// POST /api/orders/:id/items/:itemId/exchange
export const requestExchange = asyncHandler(async (req, res) => {
  const { id, itemId } = req.params
  const { reason } = req.body
  const order = await Order.findById(id).populate('items.product')
  if (!order) throw new ApiError(404, 'Order not found')
  if (req.user.role === 'customer' && order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized')
  }
  const item = order.items.id(itemId)
  if (!item) throw new ApiError(404, 'Item not found in order')
  if (order.orderStatus !== 'delivered') throw new ApiError(400, 'Order not delivered')
  const product = item.product
  if (!product.returnPolicy?.isExchangeable) throw new ApiError(400, 'Item not exchangeable')
  const daysSinceDelivery = (new Date() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24)
  if (daysSinceDelivery > product.returnPolicy.exchangeDays) {
    throw new ApiError(400, 'Exchange window closed')
  }
  if (item.exchangeStatus !== 'none') throw new ApiError(400, 'Exchange already requested')
  item.exchangeStatus = 'requested'
  item.exchangeReason = reason
  await order.save()
  res.json(new ApiResponse(200, order, 'Exchange requested'))
})

export const updateItemReturnStatus = asyncHandler(async (req, res) => {
  const { id, itemId } = req.params
  const { status } = req.body
  const order = await Order.findById(id)
  if (!order) throw new ApiError(404, 'Order not found')
  const item = order.items.id(itemId)
  if (!item) throw new ApiError(404, 'Item not found')
  item.returnStatus = status
  await order.save()
  res.json(new ApiResponse(200, order, 'Return status updated'))
})

export const updateItemExchangeStatus = asyncHandler(async (req, res) => {
  const { id, itemId } = req.params
  const { status } = req.body
  const order = await Order.findById(id)
  if (!order) throw new ApiError(404, 'Order not found')
  const item = order.items.id(itemId)
  if (!item) throw new ApiError(404, 'Item not found')
  item.exchangeStatus = status
  await order.save()
  res.json(new ApiResponse(200, order, 'Exchange status updated'))
})
