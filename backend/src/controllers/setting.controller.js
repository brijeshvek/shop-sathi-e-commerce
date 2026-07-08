import Setting from '../models/Setting.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne().lean()
  if (!settings) {
    // Create initial default settings if none exist
    settings = await Setting.create({
      taxRate: Number(process.env.TAX_RATE) * 100 || 18,
      freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD) || 499,
      shippingCharge: Number(process.env.SHIPPING_CHARGE) || 99
    })
  }
  res.status(200).json(new ApiResponse(200, settings, 'Settings fetched successfully'))
})

// PUT /api/settings (Admin only)
export const updateSettings = asyncHandler(async (req, res) => {
  const { taxRate, freeShippingThreshold, shippingCharge } = req.body
  
  let settings = await Setting.findOne()
  if (!settings) {
    settings = new Setting()
  }

  if (taxRate !== undefined) settings.taxRate = Number(taxRate)
  if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold)
  if (shippingCharge !== undefined) settings.shippingCharge = Number(shippingCharge)

  await settings.save()
  res.status(200).json(new ApiResponse(200, settings, 'Settings updated successfully'))
})
