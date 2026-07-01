import Coupon from '../models/Coupon.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

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
  res.status(200).json(new ApiResponse(200, coupons, 'Coupons fetched'))
})

// POST /api/coupons  (Admin)
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body)
  res.status(201).json(new ApiResponse(201, coupon, 'Coupon created successfully'))
})

// PUT /api/coupons/:id  (Admin)
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).lean()
  if (!coupon) throw new ApiError(404, 'Coupon not found.')
  res.status(200).json(new ApiResponse(200, coupon, 'Coupon updated successfully'))
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
