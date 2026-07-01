import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true, unique: true,
  },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     { type: String, required: true },
    image:    { type: String, default: '' },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    selectedVariants: { type: Map, of: String },
  }],
  coupon:         { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  discountAmount: { type: Number, default: 0 },
}, { timestamps: true })

cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => total + item.price * item.quantity, 0)
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
