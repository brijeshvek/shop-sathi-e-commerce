import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String, required: [true, 'Code is required'],
    unique: true, uppercase: true, trim: true,
    minLength: 3, maxLength: 20,
  },
  discountType:  { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true, min: 1 },
  minOrderAmount:{ type: Number, default: 0 },
  maxDiscount:   { type: Number, default: null },
  usageLimit:    { type: Number, default: null },
  usedCount:     { type: Number, default: 0 },
  perUserLimit:  { type: Number, default: 1 },
  usedBy:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive:      { type: Boolean, default: true },
  expiresAt:     { type: Date, required: [true, 'Expiry date is required'] },
}, { timestamps: true })

couponSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiresAt
})

couponSchema.virtual('isUsageLimitReached').get(function () {
  return this.usageLimit !== null && this.usedCount >= this.usageLimit
})

couponSchema.methods.validateForUser = function (userId, orderAmount) {
  const errors = []
  if (!this.isActive)              errors.push('This coupon is inactive')
  if (this.isExpired)              errors.push('This coupon has expired')
  if (this.isUsageLimitReached)    errors.push('Coupon usage limit has been reached')
  if (orderAmount < this.minOrderAmount)
    errors.push(`Minimum order amount of ₹${this.minOrderAmount} required`)
  const used = this.usedBy.filter(id => id.toString() === userId.toString()).length
  if (used >= this.perUserLimit)   errors.push('You have already used this coupon')
  return errors
}

couponSchema.methods.calculateDiscount = function (orderAmount) {
  let discount = 0
  if (this.discountType === 'flat') {
    discount = Math.min(this.discountValue, orderAmount)
  } else {
    discount = (orderAmount * this.discountValue) / 100
    if (this.maxDiscount) discount = Math.min(discount, this.maxDiscount)
  }
  return Math.round(discount * 100) / 100
}

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon
