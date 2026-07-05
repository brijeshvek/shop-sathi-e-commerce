import crypto from 'crypto'
import User from '../models/User.model.js'
import Role from '../models/Role.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { generateAccessToken, generateRefreshToken, setCookies, clearCookies } from '../utils/generateToken.js'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.service.js'

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(409, 'An account with this email already exists.')

  const user = await User.create({ name, email, password })
  const accessToken  = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id)
  setCookies(res, accessToken, refreshToken)

  // Send welcome email (non-blocking)
  sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err.message))

  const { password: _, ...userData } = user.toObject()
  userData.token = accessToken
  res.status(201).json(new ApiResponse(201, userData, 'Account created successfully'))
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(400, 'Invalid email or password.')
  }
  if (user.isBlocked) throw new ApiError(403, 'Your account has been suspended. Contact support.')

  const accessToken  = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id)
  setCookies(res, accessToken, refreshToken)

  let roleDoc = await Role.findOne({ name: user.role })
  if (!roleDoc && user.role !== 'admin' && user.role !== 'superadmin') {
    roleDoc = await Role.create({ name: user.role })
  }
  const rolePermissions = roleDoc ? roleDoc.permissions : {}

  const { password: _, ...userData } = user.toObject()
  userData.permissions = rolePermissions
  userData.token = accessToken
  res.status(200).json(new ApiResponse(200, userData, 'Login successful'))
})

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearCookies(res)
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'))
})

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  let roleDoc = await Role.findOne({ name: req.user.role })
  if (!roleDoc && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    roleDoc = await Role.create({ name: req.user.role })
  }
  const rolePermissions = roleDoc ? roleDoc.permissions : {}

  const userData = req.user.toObject()
  userData.permissions = rolePermissions

  res.status(200).json(new ApiResponse(200, userData, 'User fetched'))
})

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  // Always return success (security: don't reveal if email exists)
  if (user) {
    const rawToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`
    sendPasswordResetEmail(user, resetUrl).catch(err => console.error('Reset email error:', err.message))
  }
  res.status(200).json(new ApiResponse(200, null, 'If this email is registered, a reset link has been sent.'))
})

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire')

  if (!user) throw new ApiError(400, 'Password reset token is invalid or has expired.')
  if (req.body.password !== req.body.confirmPassword) {
    throw new ApiError(400, 'Passwords do not match.')
  }

  user.password            = req.body.password
  user.resetPasswordToken  = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  clearCookies(res)
  res.status(200).json(new ApiResponse(200, null, 'Password reset successful. Please login.'))
})
