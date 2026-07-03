import ApiError from '../utils/ApiError.js'

// Generic role-based authorization middleware
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}`)
  }
  next()
}

export const requirePermission = (permissionKey) => async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.')
    }
    
    // Admins always have all permissions
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      return next()
    }

    // Check custom permissions for other roles (e.g., seller)
    const Role = (await import('../models/Role.model.js')).default
    const roleDoc = await Role.findOne({ name: req.user.role })
    
    if (!roleDoc || !roleDoc.permissions || !roleDoc.permissions[permissionKey]) {
      throw new ApiError(403, `Access denied. Missing required permission: ${permissionKey}`)
    }
    
    next()
  } catch (error) {
    next(error)
  }
}

export default authorize
