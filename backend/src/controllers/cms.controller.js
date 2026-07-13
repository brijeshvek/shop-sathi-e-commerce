import BlogPost from '../models/BlogPost.model.js'
import FAQ from '../models/FAQ.model.js'
import CmsPage from '../models/CmsPage.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// ==========================================
// BLOG POST CONTROLLERS
// ==========================================

export const getBlogPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, activeOnly } = req.query
  const filter = {}
  if (search) {
    filter.title = { $regex: search, $options: 'i' }
  }
  if (activeOnly === 'true') {
    filter.isActive = true
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [posts, total] = await Promise.all([
    BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    BlogPost.countDocuments(filter)
  ])

  res.status(200).json(new ApiResponse(200, posts, 'Blog posts fetched successfully', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit)
  }))
})

export const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug }).lean()
  if (!post) throw new ApiError(404, 'Blog post not found')
  res.status(200).json(new ApiResponse(200, post, 'Blog post fetched successfully'))
})

export const createBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.create(req.body)
  res.status(201).json(new ApiResponse(201, post, 'Blog post created successfully'))
})

export const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
  if (!post) throw new ApiError(404, 'Blog post not found')
  res.status(200).json(new ApiResponse(200, post, 'Blog post updated successfully'))
})

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id)
  if (!post) throw new ApiError(404, 'Blog post not found')
  res.status(200).json(new ApiResponse(200, null, 'Blog post deleted successfully'))
})

// ==========================================
// FAQ CONTROLLERS
// ==========================================

export const getFaqs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, activeOnly } = req.query
  const filter = {}
  if (search) {
    filter.$or = [
      { question: { $regex: search, $options: 'i' } },
      { answer: { $regex: search, $options: 'i' } }
    ]
  }
  if (activeOnly === 'true') {
    filter.isActive = true
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [faqs, total] = await Promise.all([
    FAQ.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    FAQ.countDocuments(filter)
  ])

  res.status(200).json(new ApiResponse(200, faqs, 'FAQs fetched successfully', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit)
  }))
})

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.create(req.body)
  res.status(201).json(new ApiResponse(201, faq, 'FAQ created successfully'))
})

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
  if (!faq) throw new ApiError(404, 'FAQ not found')
  res.status(200).json(new ApiResponse(200, faq, 'FAQ updated successfully'))
})

export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id)
  if (!faq) throw new ApiError(404, 'FAQ not found')
  res.status(200).json(new ApiResponse(200, null, 'FAQ deleted successfully'))
})

// ==========================================
// CMS PAGE CONTROLLERS
// ==========================================

export const getCmsPages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, activeOnly } = req.query
  const filter = {}
  if (search) {
    filter.title = { $regex: search, $options: 'i' }
  }
  if (activeOnly === 'true') {
    filter.isActive = true
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [pages, total] = await Promise.all([
    CmsPage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    CmsPage.countDocuments(filter)
  ])

  res.status(200).json(new ApiResponse(200, pages, 'CMS pages fetched successfully', {
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: Number(limit)
  }))
})

export const getCmsPageBySlug = asyncHandler(async (req, res) => {
  const page = await CmsPage.findOne({ slug: req.params.slug }).lean()
  if (!page) throw new ApiError(404, 'Page not found')
  res.status(200).json(new ApiResponse(200, page, 'Page fetched successfully'))
})

export const createCmsPage = asyncHandler(async (req, res) => {
  const page = await CmsPage.create(req.body)
  res.status(201).json(new ApiResponse(201, page, 'Page created successfully'))
})

export const updateCmsPage = asyncHandler(async (req, res) => {
  const page = await CmsPage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
  if (!page) throw new ApiError(404, 'Page not found')
  res.status(200).json(new ApiResponse(200, page, 'Page updated successfully'))
})

export const deleteCmsPage = asyncHandler(async (req, res) => {
  const page = await CmsPage.findByIdAndDelete(req.params.id)
  if (!page) throw new ApiError(404, 'Page not found')
  res.status(200).json(new ApiResponse(200, null, 'Page deleted successfully'))
})
