import { uploadFile, deleteImage } from '../services/upload.service.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// POST /api/upload/image
export const uploadImageHandler = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file provided.')
  const folder = req.body.folder || 'products'
  const result = await uploadFile(req.file, folder)
  res.status(200).json(new ApiResponse(200, result, 'File uploaded successfully'))
})

// POST /api/upload/avatar
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file provided.')
  const result = await uploadFile(req.file, 'avatars')
  res.status(200).json(new ApiResponse(200, result, 'Avatar uploaded successfully'))
})

// DELETE /api/upload/image/:publicId
export const deleteImageHandler = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId)
  await deleteImage(publicId)
  res.status(200).json(new ApiResponse(200, null, 'File deleted successfully'))
})
