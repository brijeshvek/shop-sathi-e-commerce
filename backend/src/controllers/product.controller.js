import Product from '../models/Product.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/products
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, search, category, minPrice, maxPrice,
    brand, minRating, inStock, isFeatured, sort = 'createdAt', order = 'desc', tags,
  } = req.query

  const filter = { isActive: true }
  if (search)    filter.$text = { $search: search }
  if (category)  filter.category = category
  if (brand)     filter.brand = { $regex: brand, $options: 'i' }
  if (tags)      filter.tags = { $in: tags.split(',') }
  if (isFeatured === 'true') filter.isFeatured = true
  if (inStock === 'true')    filter.stock = { $gt: 0 }
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
      .populate('category', 'name slug')
      .sort(sortObj).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(filter),
  ])

  res.status(200).json(new ApiResponse(200, products, 'Products fetched', {
    currentPage: Number(page), totalPages: Math.ceil(total / limit),
    totalItems: total, itemsPerPage: Number(limit),
  }))
})

// GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug').limit(8).lean()
  res.status(200).json(new ApiResponse(200, products, 'Featured products fetched'))
})

// GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug').lean()
  if (!product) throw new ApiError(404, 'Product not found.')
  res.status(200).json(new ApiResponse(200, product, 'Product fetched'))
})

// POST /api/products  (Admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, createdBy: req.user._id })
  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'))
})

// PUT /api/products/:id  (Admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).lean()
  if (!product) throw new ApiError(404, 'Product not found.')
  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'))
})

// DELETE /api/products/:id  (Admin — soft delete)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, { isActive: false }, { new: true }
  )
  if (!product) throw new ApiError(404, 'Product not found.')
  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'))
})

// PATCH /api/products/:id/status  (Admin)
export const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, { isActive: req.body.isActive }, { new: true }
  )
  if (!product) throw new ApiError(404, 'Product not found.')
  res.status(200).json(new ApiResponse(200, null, 'Product status updated'))
})
