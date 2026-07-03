import Coupon from '../models/Coupon.model.js'
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

// POST /api/coupons/validate
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body
  const coupon = await Coupon.findOne({ code: code.toUpperCase() })
  if (!coupon) throw new ApiError(404, 'Coupon not found.')

  const errors = coupon.validateForUser(req.user._id, orderAmount)
  if (errors.length) throw new ApiError(400, errors[0])

  const discountAmount = coupon.calculateDiscount(orderAmount)
  res.status(200).json(new ApiResponse(200, {
    code: coupon.code, discountType: coupon.discountType,
    discountValue: coupon.discountValue, discountAmount,
    maxDiscount: coupon.maxDiscount,
    finalAmount: parseFloat((orderAmount - discountAmount).toFixed(2)),
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
