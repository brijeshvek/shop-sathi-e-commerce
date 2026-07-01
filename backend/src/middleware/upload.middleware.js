import multer from 'multer'
import ApiError from '../utils/ApiError.js'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/mpeg', 'video/webm', 'video/ogg', 'video/quicktime'
  ]
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ApiError(400, 'File type not allowed. Use standard images or videos (mp4, webm, quicktime, etc.).'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB to support videos
})

export default upload
