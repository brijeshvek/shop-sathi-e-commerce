import User from '../models/User.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/users  (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, isBlocked, search } = req.query
  const filter = {}
  if (role)      filter.role      = role
  if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true'
  if (search)    filter.$or = [
    { name:  { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ]

  const skip  = (Number(page) - 1) * Number(limit)
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ])

  res.status(200).json(new ApiResponse(200, users, 'Users fetched', {
    currentPage: Number(page), totalPages: Math.ceil(total / limit),
    totalItems: total, itemsPerPage: Number(limit),
  }))
})

// GET /api/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (req.user.role === 'customer' && req.user._id.toString() !== id) {
    throw new ApiError(403, 'You are not authorized to access this resource.')
  }
  const user = await User.findById(id).lean()
  if (!user) throw new ApiError(404, 'User not found.')
  res.status(200).json(new ApiResponse(200, user, 'User fetched'))
})

// PUT /api/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (req.user.role === 'customer' && req.user._id.toString() !== id) {
    throw new ApiError(403, 'Not authorized.')
  }
  const { name, phone, avatar } = req.body
  const updateData = { name, phone }
  if (avatar) updateData.avatar = avatar
  
  const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).lean()
  if (!user) throw new ApiError(404, 'User not found.')
  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'))
})

// PUT /api/users/:id/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body
  if (newPassword !== confirmPassword) throw new ApiError(400, 'Passwords do not match.')
  const user = await User.findById(req.params.id).select('+password')
  if (!user) throw new ApiError(404, 'User not found.')
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect.')
  }
  user.password = newPassword
  await user.save()
  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'))
})

// PUT /api/users/:id/block  (Admin)
export const blockUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id).lean()
  if (!target) throw new ApiError(404, 'User not found.')

  // Prevent blocking admin or superadmin accounts to avoid lockout
  if (target.role === 'admin' || target.role === 'superadmin') {
    throw new ApiError(403, 'Admin accounts cannot be blocked.')
  }

  const user = await User.findByIdAndUpdate(
    req.params.id, { isBlocked: req.body.isBlocked }, { new: true }
  ).lean()
  res.status(200).json(new ApiResponse(200, null,
    req.body.isBlocked ? 'User has been blocked.' : 'User has been unblocked.'
  ))
})

// POST /api/users/:id/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new ApiError(404, 'User not found.')
  if (req.body.isDefault) {
    user.addresses.forEach(addr => { addr.isDefault = false })
  }
  user.addresses.push(req.body)
  await user.save()
  const newAddr = user.addresses[user.addresses.length - 1]
  res.status(201).json(new ApiResponse(201, newAddr, 'Address added successfully'))
})

// PUT /api/users/:id/addresses/:addressId
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new ApiError(404, 'User not found.')
  const addr = user.addresses.id(req.params.addressId)
  if (!addr) throw new ApiError(404, 'Address not found.')
  if (req.body.isDefault) user.addresses.forEach(a => { a.isDefault = false })
  Object.assign(addr, req.body)
  await user.save()
  res.status(200).json(new ApiResponse(200, addr, 'Address updated successfully'))
})

// DELETE /api/users/:id/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { addresses: { _id: req.params.addressId } },
  })
  res.status(200).json(new ApiResponse(200, null, 'Address deleted successfully'))
})

// PATCH /api/users/:id/addresses/:addressId/default
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new ApiError(404, 'User not found.')
  user.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === req.params.addressId
  })
  await user.save()
  res.status(200).json(new ApiResponse(200, null, 'Default address updated'))
})

// POST /api/users/become-seller
export const becomeSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) throw new ApiError(404, 'User not found.')

  if (user.role === 'seller' || user.role === 'admin' || user.role === 'superadmin') {
    throw new ApiError(400, 'User is already a seller or admin.')
  }

  const { storeName, description } = req.body
  if (!storeName || !description) {
    throw new ApiError(400, 'Store name and description are required.')
  }

  user.role = 'seller'
  user.sellerInfo = {
    storeName,
    description,
    isApproved: true, // Auto-approve for now
  }
  
  await user.save()
  
  res.status(200).json(new ApiResponse(200, user, 'Successfully registered as a seller'))
})

// PATCH /api/users/:id/language
export const updateLanguage = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { language } = req.body
  
  if (req.user.role === 'customer' && req.user._id.toString() !== id) {
    throw new ApiError(403, 'Not authorized.')
  }
  if (!['en', 'hi', 'gu'].includes(language)) {
    throw new ApiError(400, 'Invalid language selected.')
  }
  
  const user = await User.findByIdAndUpdate(id, { language }, { new: true }).lean()
  if (!user) throw new ApiError(404, 'User not found.')
  
  res.status(200).json(new ApiResponse(200, user, 'Language updated successfully'))
})

// PATCH /api/users/:id/theme
export const updateTheme = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { theme } = req.body
  
  if (req.user.role === 'customer' && req.user._id.toString() !== id) {
    throw new ApiError(403, 'Not authorized.')
  }
  if (!['light', 'dark', 'system'].includes(theme)) {
    throw new ApiError(400, 'Invalid theme selected.')
  }
  
  const user = await User.findByIdAndUpdate(id, { theme }, { new: true }).lean()
  if (!user) throw new ApiError(404, 'User not found.')
  
  res.status(200).json(new ApiResponse(200, user, 'Theme updated successfully'))
})
