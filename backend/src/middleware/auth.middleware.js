import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { generateAccessToken, setCookies } from '../utils/generateToken.js'

const authMiddleware = asyncHandler(async (req, res, next) => {
  let { accessToken, refreshToken } = req.cookies || {}
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    accessToken = req.headers.authorization.split(' ')[1]
  }

  if (!accessToken && !refreshToken) {
    throw new ApiError(401, 'Authentication required. Please login.')
  }

  // Try access token first
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
      const user = await User.findById(decoded.id)
      if (!user) throw new ApiError(401, 'User not found.')
      if (user.isBlocked) throw new ApiError(403, 'Your account has been suspended.')
      req.user = user
      return next()
    } catch (err) {
      if (err.name !== 'TokenExpiredError') throw err
    }
  }

  // Fallback: try refresh token
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const user = await User.findById(decoded.id)
      if (!user) throw new ApiError(401, 'Session expired. Please login again.')
      if (user.isBlocked) throw new ApiError(403, 'Your account has been suspended.')

      // Issue new access token
      const newAccessToken = generateAccessToken(user._id)
      setCookies(res, newAccessToken, refreshToken)
      req.user = user
      return next()
    } catch {
      throw new ApiError(401, 'Session expired. Please login again.')
    }
  }

  throw new ApiError(401, 'Authentication required. Please login.')
})

export default authMiddleware
