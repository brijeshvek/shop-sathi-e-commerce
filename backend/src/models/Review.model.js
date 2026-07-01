import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Product',
    required: true, index: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: {
    type: Number, required: [true, 'Rating is required'], min: 1, max: 5,
  },
  title:   { type: String, trim: true, maxLength: 100 },
  comment: {
    type: String, required: [true, 'Comment is required'],
    trim: true, minLength: 10, maxLength: 1000,
  },
  isVerifiedPurchase: { type: Boolean, default: false },
}, { timestamps: true })

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true })

// Recalculate ratings after save/delete
async function updateProductRatings(productId) {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  await mongoose.model('Product').findByIdAndUpdate(productId, {
    'ratings.average': stats.length > 0 ? Math.round(stats[0].average * 10) / 10 : 0,
    'ratings.count':   stats.length > 0 ? stats[0].count : 0,
  })
}

reviewSchema.post('save', async function () {
  await updateProductRatings(this.product)
})

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await updateProductRatings(doc.product)
})

const Review = mongoose.model('Review', reviewSchema)
export default Review
