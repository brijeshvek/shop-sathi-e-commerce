import Category from '../models/Category.model.js'
import Product from '../models/Product.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/categories
export const getAllCategories = asyncHandler(async (req, res) => {
  // Manual populate children since Mongoose doesn't support virtual populate in lean easily
  const parents = await Category.find({ isActive: true, parent: null }).lean()
  const children = await Category.find({ isActive: true, parent: { $ne: null } }).lean()

  const result = parents.map(p => ({
    ...p,
    children: children.filter(c => c.parent?.toString() === p._id.toString()),
  }))

  res.status(200).json(new ApiResponse(200, result, 'Categories fetched'))
})

// GET /api/categories/:slug
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean()
  if (!category) throw new ApiError(404, 'Category not found.')
  res.status(200).json(new ApiResponse(200, category, 'Category fetched'))
})

// POST /api/categories  (Admin)
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body)
  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'))
})

// PUT /api/categories/:id  (Admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).lean()
  if (!category) throw new ApiError(404, 'Category not found.')
  res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'))
})

// DELETE /api/categories/:id  (Admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id })
  if (productCount > 0) {
    throw new ApiError(400, `Cannot delete: ${productCount} product(s) are assigned to this category.`)
  }
  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) throw new ApiError(404, 'Category not found.')
  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'))
})

// PATCH /api/categories/:id/status  (Admin)
export const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id, { isActive: req.body.isActive }, { new: true }
  )
  if (!category) throw new ApiError(404, 'Category not found.')
  res.status(200).json(new ApiResponse(200, null, 'Category status updated'))
})
