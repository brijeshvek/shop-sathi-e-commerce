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
    status: { $nin: ['cancelled'] },
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
    status: 'processing',
  })

  res.status(200).json(new ApiResponse(200, {
    totalProducts,
    totalOrders,
    totalRevenue: Math.round(totalRevenue),
    pendingOrders,
  }, 'Seller analytics fetched'))
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
