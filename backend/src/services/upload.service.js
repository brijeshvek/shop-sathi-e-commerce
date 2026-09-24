import sharp from 'sharp'
import ApiError from '../utils/ApiError.js'

export const uploadFile = async (file, folderKey = 'products') => {
  try {
    if (!file || !file.buffer) {
      throw new ApiError(400, 'Invalid file object.')
    }

    // Convert any image format (PNG, JPEG, GIF, TIFF, etc.) to optimized WebP
    let imagePipeline = sharp(file.buffer)
    const metadata = await imagePipeline.metadata()

    // Resize if dimensions are excessively large (keep aspect ratio)
    if (metadata.width && metadata.width > 1600) {
      imagePipeline = imagePipeline.resize({ width: 1600, withoutEnlargement: true })
    }

    const webpBuffer = await imagePipeline
      .webp({ quality: 82, effort: 4 })
      .toBuffer()

    const base64Str = webpBuffer.toString('base64')
    const url = `data:image/webp;base64,${base64Str}`
    
    // Generate a unique publicId for reference/indexing
    const publicId = `${folderKey}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    return { url, publicId, format: 'webp', size: webpBuffer.length }
  } catch (error) {
    throw new ApiError(500, `Image processing and WebP conversion failed: ${error.message}`)
  }
}

export const deleteImage = async (publicId) => {
  // Base64 files are stored inline in database documents, so no external asset needs to be deleted.
  // This is a no-op method to preserve interface compatibility.
  return true
}
