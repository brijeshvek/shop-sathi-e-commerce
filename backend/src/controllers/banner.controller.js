import Banner from '../models/Banner.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/banners
export const getBanners = asyncHandler(async (req, res) => {
  const { type, activeOnly = 'false' } = req.query
  const filter = {}
  
  if (type) {
    filter.bannerType = type
  }
  
  if (activeOnly === 'true') {
    filter.isActive = true
  }

  const banners = await Banner.find(filter).sort({ createdAt: -1 }).lean()
  res.status(200).json(new ApiResponse(200, banners, 'Banners fetched successfully'))
})

// POST /api/banners (Admin only)
export const createBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, image, link, bannerType, discountCode, isActive } = req.body

  if (!title || !image) {
    throw new ApiError(400, 'Title and image are required.')
  }

  const banner = await Banner.create({
    title,
    subtitle,
    image,
    link,
    bannerType,
    discountCode,
    isActive
  })

  res.status(201).json(new ApiResponse(201, banner, 'Banner created successfully'))
})

// PUT /api/banners/:id (Admin only)
export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)
  if (!banner) {
    throw new ApiError(404, 'Banner not found.')
  }

  const updatedBanner = await Banner.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).lean()

  res.status(200).json(new ApiResponse(200, updatedBanner, 'Banner updated successfully'))
})

// DELETE /api/banners/:id (Admin only)
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)
  if (!banner) {
    throw new ApiError(404, 'Banner not found.')
  }

  await Banner.findByIdAndDelete(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Banner deleted successfully'))
})
