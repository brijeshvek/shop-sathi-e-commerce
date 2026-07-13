import Coupon from '../models/Coupon.model.js'
import Cart from '../models/Cart.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// Helper: map frontend field names to model field names
const mapCouponBody = (body) => {
  const mapped = { ...body }
  // Frontend sends 'expiryDate', model uses 'expiresAt'
  if (body.expiryDate && !body.expiresAt) {
    mapped.expiresAt = new Date(body.expiryDate)
    delete mapped.expiryDate
  }
  // Frontend sends startDate as string, convert to Date
  if (body.startDate) {
    mapped.startDate = new Date(body.startDate)
  }
  return mapped
}

// GET /api/coupons/available
export const getAvailableCoupons = asyncHandler(async (req, res) => {
  const CartModel = (await import('mongoose')).default.model('Cart')
  const cart = await CartModel.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    populate: { path: 'category' }
  })
  
  if (!cart || !cart.items.length) {
    return res.status(200).json(new ApiResponse(200, [], 'No items in cart'))
  }

  // Fetch all active and unexpired coupons
  const now = new Date()
  const allCoupons = await Coupon.find({
    isActive: true,
    expiresAt: { $gt: now }
  }).populate('applicableCategory', 'name')

  const available = []
  
  for (const coupon of allCoupons) {
    // Check if usage limit reached
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) continue
    
    // Check if user has already used it
    const used = coupon.usedBy.filter(id => id.toString() === req.user._id.toString()).length
    if (used >= coupon.perUserLimit) continue

    // Validate against cart to get errors if any
    const errors = coupon.validateForUser(req.user._id, cart.items)
    
    available.push({
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount,
      minOrderAmount: coupon.minOrderAmount,
      applicableCategory: coupon.applicableCategory,
      isApplicable: errors.length === 0,
      reason: errors.length > 0 ? errors[0] : null
    })
  }

  res.status(200).json(new ApiResponse(200, available, 'Available coupons fetched'))
})

// POST /api/coupons/validate
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body
  const coupon = await Coupon.findOne({ code: code.toUpperCase() })
  if (!coupon) throw new ApiError(404, 'Coupon not found.')

  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    populate: { path: 'category' }
  })
  
  if (!cart || !cart.items.length) {
    throw new ApiError(400, 'Your cart is empty.')
  }

  const errors = coupon.validateForUser(req.user._id, cart.items)
  if (errors.length) throw new ApiError(400, errors[0])

  const discountAmount = coupon.calculateDiscount(cart.items)
  
  // Calculate total amount to send back as finalAmount
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  res.status(200).json(new ApiResponse(200, {
    code: coupon.code, discountType: coupon.discountType,
    discountValue: coupon.discountValue, discountAmount,
    maxDiscount: coupon.maxDiscount,
    finalAmount: parseFloat((subtotal - discountAmount).toFixed(2)),
  }, 'Coupon applied successfully'))
})

// GET /api/coupons  (Admin)
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean()
  // Map expiresAt → expiryDate in response for frontend compatibility
  const mapped = coupons.map(c => ({
    ...c,
    expiryDate: c.expiresAt,
  }))
  res.status(200).json(new ApiResponse(200, mapped, 'Coupons fetched'))
})

// POST /api/coupons  (Admin)
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(mapCouponBody(req.body))
  res.status(201).json(new ApiResponse(201, { ...coupon.toObject(), expiryDate: coupon.expiresAt }, 'Coupon created successfully'))
})

// PUT /api/coupons/:id  (Admin)
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, mapCouponBody(req.body), {
    new: true, runValidators: true,
  }).lean()
  if (!coupon) throw new ApiError(404, 'Coupon not found.')
  res.status(200).json(new ApiResponse(200, { ...coupon, expiryDate: coupon.expiresAt }, 'Coupon updated successfully'))
})

// PATCH /api/coupons/:id/status  (Admin)
export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id, { isActive: req.body.isActive }, { new: true }
  )
  if (!coupon) throw new ApiError(404, 'Coupon not found.')
  res.status(200).json(new ApiResponse(200, null, `Coupon ${req.body.isActive ? 'activated' : 'deactivated'}`))
})

// DELETE /api/coupons/:id  (Admin)
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id)
  if (!coupon) throw new ApiError(404, 'Coupon not found.')
  res.status(200).json(new ApiResponse(200, null, 'Coupon deleted successfully'))
})
