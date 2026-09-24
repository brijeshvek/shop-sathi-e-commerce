import crypto from 'crypto'
import User from '../models/User.model.js'
import Role from '../models/Role.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { generateAccessToken, generateRefreshToken, setCookies, clearCookies } from '../utils/generateToken.js'
import { sendWelcomeEmail, sendPasswordResetEmail, sendLoginOtpEmail } from '../services/email.service.js'
import { sendLoginOtpSms } from '../services/sms.service.js'

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body
  if (!phone) throw new ApiError(400, 'Phone number is required.')

  const exists = await User.findOne({ $or: [{ email }, { phone }] })
  if (exists) {
    if (exists.email === email) throw new ApiError(409, 'An account with this email already exists.')
    if (exists.phone === phone) throw new ApiError(409, 'An account with this phone number already exists.')
  }

  const user = await User.create({ name, email, password, phone })
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
  return res.status(200).json(new ApiResponse(200, userData, 'Login successful'))
})

// POST /api/auth/social-login
export const socialLogin = asyncHandler(async (req, res) => {
  const { provider, email, identifier, name, avatar, providerId, phone } = req.body

  if (!provider || !['google', 'facebook', 'twitter'].includes(provider)) {
    throw new ApiError(400, 'A valid social provider is required (google, facebook, twitter).')
  }

  const rawInput = (email || identifier || '').trim()
  let userEmail = ''
  let userPhone = phone || ''
  let userName = (name || '').trim() || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`

  // Check if rawInput is email, phone, or username
  if (rawInput.includes('@') && rawInput.includes('.')) {
    userEmail = rawInput.toLowerCase()
  } else if (/^\d{10,12}$/.test(rawInput.replace(/[\s+-]/g, ''))) {
    userPhone = rawInput.replace(/[\s+-]/g, '').slice(-10)
    userEmail = `${userPhone}@${provider}.shopsathi.com`
  } else if (rawInput) {
    const cleanHandle = rawInput.replace('@', '').toLowerCase()
    userEmail = `${cleanHandle}@${provider}.shopsathi.com`
  } else {
    userEmail = `${provider}_${providerId || Date.now()}@social.shopsathi.com`
  }

  // Look for existing user by providerId, email, or phone
  const orConditions = [{ email: userEmail }]
  if (userPhone) {
    orConditions.push({ phone: userPhone })
  }
  if (providerId) {
    orConditions.push({ [`${provider}Id`]: providerId })
  }

  let user = await User.findOne({ $or: orConditions })

  if (user) {
    if (user.isBlocked) throw new ApiError(403, 'Your account has been suspended. Contact support.')
    let shouldSave = false
    if (providerId && !user[`${provider}Id`]) {
      user[`${provider}Id`] = providerId
      shouldSave = true
    }
    if (userPhone && !user.phone) {
      user.phone = userPhone
      shouldSave = true
    }
    if (avatar && (!user.avatar || !user.avatar.url)) {
      user.avatar = { url: avatar, publicId: '' }
      shouldSave = true
    }
    if (shouldSave) {
      await user.save({ validateBeforeSave: false })
    }
  } else {
    // Create new social user
    const randomPassword = crypto.randomBytes(16).toString('hex')
    const createData = {
      name: userName,
      email: userEmail,
      password: randomPassword,
      avatar: { url: avatar || '', publicId: '' },
      authProvider: provider,
      [`${provider}Id`]: providerId || `social_${Date.now()}`,
      role: 'customer'
    }
    if (userPhone) {
      createData.phone = userPhone
    }

    user = await User.create(createData)

    if (userEmail && !userEmail.includes('.shopsathi.com')) {
      sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err.message))
    }
  }

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
  res.status(200).json(new ApiResponse(200, userData, `Logged in successfully with ${provider}`))
})

// POST /api/auth/login-phone
export const loginWithPhone = asyncHandler(async (req, res) => {
  const { phone } = req.body
  const user = await User.findOne({ phone })
  if (!user) throw new ApiError(404, 'Phone number not registered.')
  if (user.isBlocked) throw new ApiError(403, 'Your account has been suspended. Contact support.')

  // Generate 6-digit verification code
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  user.loginOtp = otp
  user.loginOtpExpire = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  await user.save({ validateBeforeSave: false })

  // Log OTP in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📱 [DEV ONLY] OTP for phone ${user.phone} is: ${otp}\n`)
  }

  // Send SMS (non-blocking)
  sendLoginOtpSms(user, otp).catch(err => console.error('OTP sms error:', err.message))
  
  res.status(200).json(new ApiResponse(200, { otpRequired: true, phone: user.phone }, 'Verification OTP sent to phone.'))
})

// POST /api/auth/verify-phone-otp
export const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body
  if (!phone || !otp) {
    throw new ApiError(400, 'Phone number and OTP code are required.')
  }

  const user = await User.findOne({ phone }).select('+loginOtp +loginOtpExpire')
  if (!user) throw new ApiError(404, 'User not found.')

  if (!user.loginOtp || !user.loginOtpExpire || user.loginOtpExpire < Date.now()) {
    throw new ApiError(400, 'The verification code has expired or is invalid. Please request a new one.')
  }

  if (user.loginOtp !== otp) {
    throw new ApiError(400, 'Invalid verification code. Please try again.')
  }

  // Clear OTP fields
  user.loginOtp = undefined
  user.loginOtpExpire = undefined
  await user.save({ validateBeforeSave: false })

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


// POST /api/auth/verify-otp
export const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP code are required.')
  }

  const user = await User.findOne({ email }).select('+loginOtp +loginOtpExpire')
  if (!user) throw new ApiError(404, 'User not found.')

  if (!user.loginOtp || !user.loginOtpExpire || user.loginOtpExpire < Date.now()) {
    throw new ApiError(400, 'The verification code has expired or is invalid. Please login again.')
  }

  if (user.loginOtp !== otp) {
    throw new ApiError(400, 'Invalid verification code. Please try again.')
  }

  // Clear OTP fields
  user.loginOtp = undefined
  user.loginOtpExpire = undefined
  await user.save({ validateBeforeSave: false })

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

// POST /api/auth/resend-otp
export const resendLoginOtp = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new ApiError(400, 'Email is required.')

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, 'User not found.')
  if (user.isBlocked) throw new ApiError(403, 'Your account has been suspended. Contact support.')

  // Generate new 6-digit verification code
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  user.loginOtp = otp
  user.loginOtpExpire = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  await user.save({ validateBeforeSave: false })

  // Log OTP in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔑 [DEV ONLY] OTP for ${user.email} is: ${otp}\n`)
  }

  // Send OTP email (non-blocking)
  sendLoginOtpEmail(user, otp).catch(err => console.error('OTP email error:', err.message))

  res.status(200).json(new ApiResponse(200, { email: user.email }, 'Verification OTP resent to email.'))
})
