import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true })

wishlistSchema.virtual('count').get(function () {
  return this.products.length
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)
export default Wishlist
