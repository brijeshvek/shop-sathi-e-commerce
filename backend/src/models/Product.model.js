import mongoose from 'mongoose'
import slugify from 'slugify'

const productSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Product name is required'],
    trim: true, minLength: 3, maxLength: 200,
  },
  slug:             { type: String, unique: true, index: true },
  description:      { type: String, required: [true, 'Description is required'] },
  shortDescription: { type: String, maxLength: 500 },
  longDescription:  { type: String, maxLength: 5000 },
  
  // SEO
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }]
  },

  // Base Pricing details
  price: {
    type: Number, required: [true, 'Price is required'], min: 0,
  },
  originalPrice: { type: Number, min: 0 },
  discount:      { type: Number, min: 0, max: 100, default: 0 },
  discountType:  { type: String, enum: ['Percentage', 'Flat', 'None'], default: 'None' },
  discountValue: { type: Number, default: 0 },
  offerPrice:    { type: Number },
  taxRate:       { type: Number, default: 0 }, // GST / Tax rate in %
  currency:      { type: String, default: 'INR' },
  costPrice:     { type: Number, min: 0 },
  profitMargin:  { type: Number },

  // Base Category relationships
  category: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Category',
    required: [true, 'Category is required'], index: true,
  },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  childCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  collectionName: { type: String },
  productType: { type: String },

  // Branding and MFG
  brand: { type: String, trim: true },
  manufacturer: { type: String },
  modelNumber: { type: String },
  sku:   { type: String, unique: true, sparse: true, trim: true, uppercase: true },
  barcode: { type: String, unique: true, sparse: true, trim: true },
  
  // Media Assets
  images: [{
    url:      { type: String, required: true },
    publicId: { type: String, default: '' },
    isMain:   { type: Boolean, default: false },
  }],
  videos: [{ type: String }],
  images360: [{ type: String }],

  // Physical Dimensions
  dimensions: {
    weight: { type: Number },
    height: { type: Number },
    width: { type: Number },
    length: { type: Number },
    thickness: { type: Number },
    diameter: { type: Number },
    volume: { type: Number },
    packageWeight: { type: Number },
    packageDimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    }
  },

  // Dynamic Category specific attributes
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Child variant SKUs
  variants: [{
    variantSku: { type: String },
    attributes: { type: Map, of: mongoose.Schema.Types.Mixed },
    price: { type: Number },
    stock: { type: Number },
    images: [{ type: String }]
  }],

  // Render-friendly specifications table
  specifications: [{
    groupName: { type: String },
    key:   { type: String, required: true },
    value: { type: String, required: true },
    _id: false,
  }],

  // Features list
  features: [{ type: String }],

  // Certifications compliance
  certifications: {
    bis: { type: Boolean, default: false },
    isi: { type: Boolean, default: false },
    ce: { type: Boolean, default: false },
    fcc: { type: Boolean, default: false },
    rohs: { type: Boolean, default: false },
    fda: { type: Boolean, default: false },
    iso: { type: Boolean, default: false },
    fssai: { type: Boolean, default: false },
    organicCertification: { type: String }
  },

  tags:  [{ type: String, lowercase: true, trim: true }],
  stock: { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
  warehouse: { type: String },
  lowStockAlertLimit: { type: Number, default: 5 },
  minOrderQuantity: { type: Number, default: 1 },
  maxOrderQuantity: { type: Number },
  availableQuantity: { type: Number },

  // Shipping policies
  shipping: {
    weight: { type: Number },
    packageLength: { type: Number },
    packageWidth: { type: Number },
    packageHeight: { type: Number },
    deliveryTimeDays: { type: Number },
    freeShipping: { type: Boolean, default: false },
    codAvailable: { type: Boolean, default: true },
    returnPolicy: { type: String }
  },

  // Warranty
  warranty: {
    period: { type: String },
    type: { type: String, enum: ['Brand Warranty', 'Seller Warranty', 'No Warranty'], default: 'No Warranty' },
    replacementPolicy: { type: String },
    returnPolicy: { type: String }
  },

  // Advanced configurations
  isActive:   { type: Boolean, default: true,  index: true },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  visibility: { type: String, enum: ['Public', 'Private', 'Hidden'], default: 'Public' },
  status: { type: String, enum: ['Draft', 'Active', 'Scheduled'], default: 'Active' },
  scheduledPublishDate: { type: Date },

  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count:   { type: Number, default: 0, min: 0 },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
}, { timestamps: true })

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

// Auto-calculate discount %
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.price && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  next()
})

// Stock status virtual
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0)  return 'out_of_stock'
  if (this.stock < 10)   return 'low_stock'
  return 'in_stock'
})

// Full-text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' })

const Product = mongoose.model('Product', productSchema)
export default Product
