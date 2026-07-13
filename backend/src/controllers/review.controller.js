import Review from '../models/Review.model.js'
import Order from '../models/Order.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, rating } = req.query
  const filter = {}

  if (rating) {
    filter.rating = Number(rating)
  }

  if (req.user.role === 'seller') {
    const Product = (await import('../models/Product.model.js')).default
    const sellerProducts = await Product.find({ createdBy: req.user._id }).select('_id').lean()
    const productIds = sellerProducts.map(p => p._id)
    filter.product = { $in: productIds }
  }

  const skip = (Number(page) - 1) * Number(limit)

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name email avatarUrl')
      .populate('product', 'name images slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Review.countDocuments(filter)
  ])

  res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched successfully', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit)
  }))
})

// GET /api/reviews/:productId
export const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'newest' } = req.query
  const sortObj = sort === 'highest' ? { rating: -1 } : sort === 'lowest' ? { rating: 1 } : { createdAt: -1 }
  const filter = { product: req.params.productId }
  const skip = (Number(page) - 1) * Number(limit)

  const [reviews, total, stats] = await Promise.all([
    Review.find(filter).populate('user', 'name avatarUrl').sort(sortObj).skip(skip).limit(Number(limit)).lean(),
    Review.countDocuments(filter),
    Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(req.params.productId) } },
      { $group: {
        _id: null,
        average: { $avg: '$rating' },
        count:   { $sum: 1 },
        r5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        r4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        r3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        r2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        r1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
      }},
    ]),
  ])

  const summary = stats[0] ? {
    average:   Math.round(stats[0].average * 10) / 10,
    count:     stats[0].count,
    breakdown: { 5: stats[0].r5, 4: stats[0].r4, 3: stats[0].r3, 2: stats[0].r2, 1: stats[0].r1 },
  } : { average: 0, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }

  res.status(200).json(new ApiResponse(200, { reviews, summary }, 'Reviews fetched', {
    currentPage: Number(page), totalPages: Math.ceil(total / limit),
    totalItems: total, itemsPerPage: Number(limit),
  }))
})

// POST /api/reviews/:productId
export const submitReview = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const { rating, title, comment } = req.body

  const existing = await Review.findOne({ product: productId, user: req.user._id })
  if (existing) throw new ApiError(409, 'You have already reviewed this product.')

  const deliveredOrder = await Order.findOne({
    user: req.user._id, 'items.product': productId, orderStatus: 'delivered',
  })

  const review = await Review.create({
    product: productId, user: req.user._id, rating, title, comment,
    isVerifiedPurchase: !!deliveredOrder,
  })

  await review.populate('user', 'name avatarUrl')
  res.status(201).json(new ApiResponse(201, review, 'Review submitted successfully'))
})

// PUT /api/reviews/:reviewId
export const editReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId)
  if (!review) throw new ApiError(404, 'Review not found.')
  if (review.user.toString() !== req.user._id.toString() && req.user.role === 'customer') {
    throw new ApiError(403, 'Not authorized.')
  }
  const { rating, title, comment } = req.body
  if (rating)  review.rating  = rating
  if (title)   review.title   = title
  if (comment) review.comment = comment
  await review.save()
  res.status(200).json(new ApiResponse(200, review, 'Review updated successfully'))
})

// DELETE /api/reviews/:reviewId
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId)
  if (!review) throw new ApiError(404, 'Review not found.')
  if (review.user.toString() !== req.user._id.toString() && req.user.role === 'customer') {
    throw new ApiError(403, 'Not authorized.')
  }
  await Review.findByIdAndDelete(req.params.reviewId)
  res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'))
})
