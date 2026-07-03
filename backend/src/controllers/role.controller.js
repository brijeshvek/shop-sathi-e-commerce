import Role from '../models/Role.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

export const getRolePermissions = asyncHandler(async (req, res) => {
    const { roleName } = req.params
    let role = await Role.findOne({ name: roleName })

    if (!role) {
        // Create with defaults if it doesn't exist
        role = await Role.create({ name: roleName })
    }

    res.status(200).json(new ApiResponse(200, role.permissions, 'Permissions fetched successfully'))
})

export const updateRolePermissions = asyncHandler(async (req, res) => {
    const { roleName } = req.params
    const permissions = req.body

    const role = await Role.findOneAndUpdate(
        { name: roleName },
        { $set: { permissions } },
        { new: true, upsert: true, runValidators: true },
    )

    res.status(200).json(new ApiResponse(200, role.permissions, 'Permissions updated successfully'))
})