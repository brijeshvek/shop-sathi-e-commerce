import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String, required: [true, 'Code is required'],
    unique: true, uppercase: true, trim: true,
    minLength: 3, maxLength: 20,
  },
  discountType:  { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 1 },
  minOrderAmount:{ type: Number, default: 0 },
  maxDiscount:   { type: Number, default: null },
  usageLimit:    { type: Number, default: null },
  usedCount:     { type: Number, default: 0 },
  perUserLimit:  { type: Number, default: 1 },
  usedBy:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  applicableCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive:      { type: Boolean, default: true },
  startDate:     { type: Date, default: Date.now },
  expiresAt:     { type: Date, required: [true, 'Expiry date is required'] },
}, { timestamps: true })

// Also expose expiryDate as alias for expiresAt for frontend compatibility
couponSchema.virtual('expiryDate').get(function () {
  return this.expiresAt
})

couponSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiresAt
})

couponSchema.virtual('isUsageLimitReached').get(function () {
  return this.usageLimit !== null && this.usedCount >= this.usageLimit
})

couponSchema.methods.validateForUser = function (userId, cartItems) {
  // calculate eligible subtotal based on category
  let eligibleSubtotal = 0;
  if (this.applicableCategory) {
    eligibleSubtotal = cartItems.reduce((sum, item) => {
      let itemCat = item.product.category?._id || item.product.category;
      let parentCat = item.product.category?.parent;
      if (
        (itemCat && itemCat.toString() === this.applicableCategory.toString()) ||
        (parentCat && parentCat.toString() === this.applicableCategory.toString())
      ) {
        return sum + (item.price * item.quantity);
      }
      return sum;
    }, 0);
  } else {
    eligibleSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  const errors = []
  if (!this.isActive)              errors.push('This coupon is inactive')
  if (this.isExpired)              errors.push('This coupon has expired')
  if (this.isUsageLimitReached)    errors.push('Coupon usage limit has been reached')
  if (this.applicableCategory && eligibleSubtotal === 0) {
    errors.push('Coupon is not applicable to any items in your cart')
  }
  if (eligibleSubtotal < this.minOrderAmount)
    errors.push(`Minimum eligible order amount of ₹${this.minOrderAmount} required`)
  const used = this.usedBy.filter(id => id.toString() === userId.toString()).length
  if (used >= this.perUserLimit)   errors.push('You have already used this coupon')
  return errors
}

couponSchema.methods.calculateDiscount = function (cartItems) {
  let eligibleSubtotal = 0;
  if (this.applicableCategory) {
    eligibleSubtotal = cartItems.reduce((sum, item) => {
      let itemCat = item.product.category?._id || item.product.category;
      let parentCat = item.product.category?.parent;
      if (
        (itemCat && itemCat.toString() === this.applicableCategory.toString()) ||
        (parentCat && parentCat.toString() === this.applicableCategory.toString())
      ) {
        return sum + (item.price * item.quantity);
      }
      return sum;
    }, 0);
  } else {
    eligibleSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  let discount = 0
  if (this.discountType === 'fixed') {
    discount = Math.min(this.discountValue, eligibleSubtotal)
  } else {
    discount = (eligibleSubtotal * this.discountValue) / 100
    if (this.maxDiscount) discount = Math.min(discount, this.maxDiscount)
  }
  return Math.round(discount * 100) / 100
}

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon
