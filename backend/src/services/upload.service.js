import ApiError from '../utils/ApiError.js'

export const uploadFile = async (file, folderKey = 'products') => {
  try {
    if (!file || !file.buffer || !file.mimetype) {
      throw new ApiError(400, 'Invalid file object.')
    }
    const base64Str = file.buffer.toString('base64')
    const url = `data:${file.mimetype};base64,${base64Str}`
    
    // Generate a unique publicId for reference/indexing
    const publicId = `${folderKey}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    return { url, publicId }
  } catch (error) {
    throw new ApiError(500, `File conversion to Base64 failed: ${error.message}`)
  }
}

export const deleteImage = async (publicId) => {
  // Base64 files are stored inline in database documents, so no external asset needs to be deleted.
  // This is a no-op method to preserve interface compatibility.
  return true
}
