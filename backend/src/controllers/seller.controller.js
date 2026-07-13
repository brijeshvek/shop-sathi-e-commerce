import Product from '../models/Product.model.js'
import Order from '../models/Order.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/seller/analytics — seller-specific dashboard stats
export const getSellerAnalytics = asyncHandler(async (req, res) => {
  const sellerId = req.user._id

  // Count seller's products
  const totalProducts = await Product.countDocuments({ seller: sellerId, isActive: true })

  // Orders that contain at least one item from this seller's products
  const sellerProductIds = await Product.find({ seller: sellerId }).distinct('_id')

  const orders = await Order.find({
    'items.product': { $in: sellerProductIds },
    orderStatus: { $nin: ['cancelled'] },
  }).lean()

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count items belonging to this seller
    const sellerItems = order.items.filter(item =>
      sellerProductIds.some(id => id.toString() === item.product?.toString())
    )
    return sum + sellerItems.reduce((s, item) => s + (item.price * item.quantity), 0)
  }, 0)

  const pendingOrders = await Order.countDocuments({
    'items.product': { $in: sellerProductIds },
    orderStatus: 'processing',
  })

  res.status(200).json(new ApiResponse(200, {
    totalProducts,
    totalOrders,
    totalRevenue: Math.round(totalRevenue),
    pendingOrders,
  }, 'Seller analytics fetched'))
})

// GET /api/seller/analytics/revenue — seller's revenue chart data
export const getSellerRevenueChart = asyncHandler(async (req, res) => {
  const { period = 'monthly', year = new Date().getFullYear() } = req.query
  const sellerId = req.user._id

  let match
  if (period === 'monthly') {
    match = { 
      createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${Number(year) + 1}-01-01`) }, 
      orderStatus: 'delivered' 
    }
  } else {
    match = { orderStatus: 'delivered' }
  }

  const sellerProductIds = await Product.find({ seller: sellerId }).distinct('_id')

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const data = await Order.aggregate([
    { $match: match },
    { $unwind: '$items' },
    { $match: { 'items.product': { $in: sellerProductIds } } },
    { 
      $group: { 
        _id: { 
          year: { $year: '$createdAt' }, 
          month: period === 'monthly' ? { $month: '$createdAt' } : null,
          orderId: '$_id' // Group by order first to count unique orders later if needed, or just sum revenue
        }, 
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      } 
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month'
        },
        revenue: { $sum: '$revenue' },
        orders: { $sum: 1 } // Since we grouped by orderId above, this counts unique orders containing seller items
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ])

  const result = data.map(d => ({
    label: period === 'monthly' ? MONTHS[(d._id.month || 1) - 1] : String(d._id.year),
    revenue: Math.round(d.revenue),
    orders: d.orders,
  }))

  res.status(200).json(new ApiResponse(200, result, 'Seller revenue chart fetched'))
})

// GET /api/seller/products — seller's own products
export const getSellerProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query
  const filter = { seller: req.user._id }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(filter),
  ])

  res.status(200).json(new ApiResponse(200, products, 'Seller products fetched', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit),
  }))
})

// GET /api/seller/orders — orders containing seller's products
export const getSellerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const sellerProductIds = await Product.find({ seller: req.user._id }).distinct('_id')

  const filter = { 'items.product': { $in: sellerProductIds } }
  const skip = (Number(page) - 1) * Number(limit)

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments(filter),
  ])

  res.status(200).json(new ApiResponse(200, orders, 'Seller orders fetched', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit),
  }))
})

// PATCH /api/seller/orders/:id/status — update order status
export const updateSellerOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid order status')
  }

  // Ensure this order actually contains a product from this seller
  const sellerProductIds = await Product.find({ seller: req.user._id }).distinct('_id')
  
  const order = await Order.findOne({
    _id: id,
    'items.product': { $in: sellerProductIds }
  })

  if (!order) {
    throw new ApiError(404, 'Order not found or you do not have permission to modify it.')
  }

  order.orderStatus = status
  
  if (status === 'delivered') {
    order.deliveredAt = Date.now()
    if (order.paymentMethod === 'COD') {
      order.paymentStatus = 'paid'
      order.paymentDetails = { ...order.paymentDetails, paidAt: new Date() }
    }
  } else if (status === 'cancelled') {
    order.cancelledAt = Date.now()
  }

  await order.save()

  res.status(200).json(new ApiResponse(200, order, `Order status updated to ${status}`))
})
