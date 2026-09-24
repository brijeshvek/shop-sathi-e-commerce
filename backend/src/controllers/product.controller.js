import mongoose from 'mongoose'
import Product from '../models/Product.model.js'
import Category from '../models/Category.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/products
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, search, category, minPrice, maxPrice,
    brand, minRating, inStock, isFeatured, sort = 'createdAt', order = 'desc', tags, isFlashSale,
    collectionName,
  } = req.query

  const filter = { isActive: true }
  if (isFlashSale === 'true') filter.isFlashSale = true
  if (collectionName) filter.collectionName = collectionName
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' }
    filter.$or = [
      { name: searchRegex },
      { brand: searchRegex },
      { tags: searchRegex },
      { description: searchRegex }
    ]
  }
  if (category) {
    const childCats = await Category.find({ parent: category }).select('_id').lean()
    const catIds = [category, ...childCats.map(c => c._id)]
    filter.category = { $in: catIds }
  }
  if (brand) filter.brand = { $regex: brand, $options: 'i' }
  if (tags) filter.tags = { $in: tags.split(',') }
  if (isFeatured === 'true') filter.isFeatured = true
  if (inStock === 'true') filter.stock = { $gt: 0 }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (minRating) filter['ratings.average'] = { $gte: Number(minRating) }

  const sortObj = {}
  sortObj[sort] = order === 'asc' ? 1 : -1

  const skip = (Number(page) - 1) * Number(limit)
  const [products, total] = await Promise.all([
    Product.find(filter)
      .select('name slug price originalPrice discount images category brand ratings stock isActive isFeatured isFlashSale collectionName tags createdAt')
      .populate('category', 'name slug')
      .sort(sortObj).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(filter),
  ])

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')
  res.status(200).json(new ApiResponse(200, products, 'Products fetched', {
    currentPage: Number(page), totalPages: Math.ceil(total / limit),
    totalItems: total, itemsPerPage: Number(limit),
  }))
})

// GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .select('name slug price originalPrice discount images category brand ratings stock isActive isFeatured isFlashSale collectionName createdAt')
    .populate('category', 'name slug').limit(8).lean()
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')
  res.status(200).json(new ApiResponse(200, products, 'Featured products fetched'))
})

// GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug').lean()
  if (!product) throw new ApiError(404, 'Product not found.')

  const ReviewModel = mongoose.model('Review')
  const reviews = await ReviewModel.find({ product: product._id })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .lean()

  product.reviews = reviews

  res.status(200).json(new ApiResponse(200, product, 'Product fetched'))
})

// POST /api/products  (Admin/Seller)
export const createProduct = asyncHandler(async (req, res) => {
  const extra = {}
  // If the creator is a seller, auto-tag this product with their sellerId
  if (req.user.role === 'seller') {
    extra.seller = req.user._id
  }
  const product = await Product.create({ ...req.body, ...extra, createdBy: req.user._id })
  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'))
})

// PUT /api/products/:id  (Admin/Seller)
export const updateProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id)
  if (!existingProduct) throw new ApiError(404, 'Product not found.')

  if (req.user.role === 'seller' && existingProduct.createdBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only modify your own products.')
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).lean()
  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'))
})

// DELETE /api/products/:id  (Admin/Seller)
export const deleteProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id)
  if (!existingProduct) throw new ApiError(404, 'Product not found.')

  if (req.user.role === 'seller' && existingProduct.createdBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own products.')
  }

  await Product.findByIdAndDelete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'))
})

// PATCH /api/products/:id/status  (Admin/Seller)
export const toggleProductStatus = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id)
  if (!existingProduct) throw new ApiError(404, 'Product not found.')

  if (req.user.role === 'seller' && existingProduct.createdBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only modify your own products.')
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id, { isActive: req.body.isActive }, { new: true }
  )
  res.status(200).json(new ApiResponse(200, null, 'Product status updated'))
})

// GET /api/products/admin/list (Admin)
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, isActive, isFlashSale } = req.query
  const filter = {}
  if (isFlashSale !== undefined) filter.isFlashSale = isFlashSale === 'true'
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ]
  }
  if (category) {
    const childCats = await Category.find({ parent: category }).select('_id').lean()
    const catIds = [category, ...childCats.map(c => c._id)]
    filter.category = { $in: catIds }
  }
  if (isActive !== undefined) filter.isActive = isActive === 'true'

  // If the user is a seller, only show their products
  if (req.user.role === 'seller') {
    filter.createdBy = req.user._id
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'name email phone sellerInfo')
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(filter)
  ])

  res.status(200).json(new ApiResponse(200, products, 'Admin products fetched', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit),
  }))
})

// GET /api/products/admin/:id (Admin)
export const getProductByIdAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('seller', 'name email phone sellerInfo')
    .lean()
  if (!product) throw new ApiError(404, 'Product not found.')
  res.status(200).json(new ApiResponse(200, product, 'Product fetched for admin'))
})

// GET /api/products/brands/distinct
export const getDistinctBrands = asyncHandler(async (req, res) => {
  const { category, subcategory } = req.query
  const filter = { brand: { $ne: null, $ne: '' } }

  // Use the most specific category available
  const activeCategory = subcategory || category
  if (activeCategory) {
    const childCats = await Category.find({ parent: activeCategory }).select('_id').lean()
    const catIds = [activeCategory, ...childCats.map(c => c._id)]
    // In our model, we store category, subcategory, childCategory. Let's just match against any of them using $or, or just category since parent IDs are expanded.
    filter.category = { $in: catIds.map(id => new mongoose.Types.ObjectId(id)) }
  }

  const brands = await Product.aggregate([
    { $match: filter },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $project: { _id: 0, name: '$_id', count: 1 } },
    { $sort: { name: 1 } }
  ])

  res.status(200).json(new ApiResponse(200, brands, 'Distinct brands fetched'))
})
