import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true, index: true,
  },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     { type: String, required: true },
    image:    { type: String, default: '' },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedVariants: { type: Map, of: String },
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone:    { type: String, required: true },
    street:   { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    pincode:  { type: String, required: true },
    country:  { type: String, default: 'India' },
  },
  paymentMethod:  { type: String, enum: ['COD', 'ONLINE'], required: true },
  paymentStatus:  { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentDetails: {
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paidAt:            { type: Date },
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending', index: true,
  },
  statusHistory: [{
    status:    { type: String, required: true },
    note:      { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    _id: false,
  }],
  coupon:         { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  subtotal:       { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  taxAmount:      { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount:    { type: Number, required: true },
  estimatedDelivery: { type: Date },
  deliveredAt:       { type: Date },
  cancelledAt:       { type: Date },
  cancelReason:      { type: String, trim: true },
}, { timestamps: true })

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date   = new Date()
    const ymd    = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    const count  = (await mongoose.model('Order').countDocuments()) + 1
    const serial = String(count).padStart(4, '0')
    this.orderNumber = `ORD-${ymd}-${serial}`
  }
  next()
})

// Track status changes
orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({ status: this.orderStatus })
  }
  next()
})

orderSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0)
})

const Order = mongoose.model('Order', orderSchema)
export default Order
