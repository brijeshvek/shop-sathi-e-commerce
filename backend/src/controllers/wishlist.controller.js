import Wishlist from '../models/Wishlist.model.js'
import Product from '../models/Product.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('products', 'name slug price originalPrice discount images ratings stock isActive').lean()
  if (!wishlist) wishlist = { products: [], count: 0 }
  else wishlist.count = wishlist.products.length
  res.status(200).json(new ApiResponse(200, wishlist, 'Wishlist fetched'))
})

// POST /api/wishlist/add
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body
  const product = await Product.findById(productId)
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found.')

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { products: productId } },
    { new: true, upsert: true }
  )
  res.status(200).json(new ApiResponse(200, { count: wishlist.products.length }, 'Added to wishlist'))
})

// DELETE /api/wishlist/remove/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: req.params.productId } },
    { new: true }
  )
  res.status(200).json(new ApiResponse(200, { count: wishlist?.products.length || 0 }, 'Removed from wishlist'))
})
