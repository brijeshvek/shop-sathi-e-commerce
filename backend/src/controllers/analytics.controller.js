import Order from '../models/Order.model.js'
import Product from '../models/Product.model.js'
import User from '../models/User.model.js'
import Category from '../models/Category.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/analytics/dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today     = new Date(); today.setHours(0, 0, 0, 0)
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - 7)
  const monthStart= new Date(today); monthStart.setDate(1)

  const [
    totalOrders, ordersByStatus, revenueToday, revenueWeek, revenueMonth,
    totalProducts, activeProducts, outOfStock,
    totalCustomers, totalSellers, newCustomers, lowStock, recentOrders,
    totalCategories,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: today }, orderStatus: 'delivered' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: weekStart }, orderStatus: 'delivered' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: monthStart }, orderStatus: 'delivered' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: 0, isActive: true }),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ role: 'customer', createdAt: { $gte: today } }),
    Product.find({ stock: { $gt: 0, $lte: Number(process.env.LOW_STOCK_THRESHOLD) || 10 }, isActive: true }).select('name stock').limit(10).lean(),
    Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10).lean(),
    Category.countDocuments(),
  ])

  const statusMap = {}
  ordersByStatus.forEach(s => { statusMap[s._id] = s.count })

  res.status(200).json(new ApiResponse(200, {
    revenue: {
      today:    revenueToday[0]?.total  || 0,
      thisWeek: revenueWeek[0]?.total   || 0,
      thisMonth:revenueMonth[0]?.total  || 0,
    },
    orders: {
      total:      totalOrders,
      pending:    statusMap.pending     || 0,
      processing: statusMap.processing  || 0,
      shipped:    statusMap.shipped     || 0,
      delivered:  statusMap.delivered   || 0,
      cancelled:  statusMap.cancelled   || 0,
    },
    products: { total: totalProducts, active: activeProducts, outOfStock },
    customers: { total: totalCustomers, newToday: newCustomers },
    sellers: { total: totalSellers },
    categories: { total: totalCategories },
    lowStockProducts: lowStock,
    recentOrders,
  }, 'Dashboard stats fetched'))
})

// GET /api/analytics/revenue
export const getRevenueChart = asyncHandler(async (req, res) => {
  const { period = 'monthly', year = new Date().getFullYear() } = req.query

  let groupBy, match
  if (period === 'monthly') {
    match   = { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${Number(year) + 1}-01-01`) }, orderStatus: 'delivered' }
    groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
  } else {
    match   = { orderStatus: 'delivered' }
    groupBy = { year: { $year: '$createdAt' } }
  }

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const data = await Order.aggregate([
    { $match: match },
    { $group: { _id: groupBy, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ])

  const result = data.map(d => ({
    label:   period === 'monthly' ? MONTHS[(d._id.month || 1) - 1] : String(d._id.year),
    revenue: Math.round(d.revenue),
    orders:  d.orders,
  }))

  res.status(200).json(new ApiResponse(200, result, 'Revenue chart fetched'))
})

// GET /api/analytics/top-products
export const getTopProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query
  const topProducts = await Order.aggregate([
    { $match: { orderStatus: 'delivered' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, image: { $first: '$items.image' }, unitsSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { unitsSold: -1 } },
    { $limit: Number(limit) },
  ])
  res.status(200).json(new ApiResponse(200, topProducts, 'Top products fetched'))
})

// GET /api/analytics/orders
export const getOrdersChart = asyncHandler(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${Number(year) + 1}-01-01`) } } },
    { $group: { _id: { month: { $month: '$createdAt' }, status: '$orderStatus' }, count: { $sum: 1 } } },
  ])

  const monthMap = {}
  for (let m = 1; m <= 12; m++) {
    monthMap[m] = { label: MONTHS[m - 1], total: 0, delivered: 0, cancelled: 0, pending: 0 }
  }
  data.forEach(d => {
    const m = d._id.month
    if (monthMap[m]) {
      monthMap[m].total += d.count
      if (monthMap[m][d._id.status] !== undefined) monthMap[m][d._id.status] += d.count
    }
  })

  res.status(200).json(new ApiResponse(200, Object.values(monthMap), 'Orders chart fetched'))
})
