import ApiError from '../utils/ApiError.js'

const adminMiddleware = (req, res, next) => {
  if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
    throw new ApiError(403, 'Access denied. Admin privileges required.')
  }
  next()
}

export const superAdminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    throw new ApiError(403, 'Access denied. Super admin privileges required.')
  }
  next()
}

export default adminMiddleware
