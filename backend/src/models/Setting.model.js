import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema({
  taxRate: { 
    type: Number, 
    required: true, 
    default: 18, // percentage (e.g. 18%)
    min: 0,
    max: 100
  },
  freeShippingThreshold: { 
    type: Number, 
    required: true, 
    default: 499,
    min: 0
  },
  shippingCharge: { 
    type: Number, 
    required: true, 
    default: 99,
    min: 0
  }
}, { timestamps: true })

const Setting = mongoose.model('Setting', settingSchema)
export default Setting
