import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Banner title is required'],
    trim: true
  },
  subtitle: { 
    type: String, 
    trim: true 
  },
  image: { 
    type: String, 
    required: [true, 'Banner image URL is required'] 
  },
  link: { 
    type: String, 
    default: '/products' 
  },
  bannerType: { 
    type: String, 
    enum: ['hero', 'coupon', 'offer'], 
    default: 'hero' 
  },
  discountCode: { 
    type: String, 
    trim: true,
    uppercase: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true })

const Banner = mongoose.model('Banner', bannerSchema)
export default Banner
