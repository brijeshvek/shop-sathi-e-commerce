import mongoose from 'mongoose'
import slugify from 'slugify'

const productSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Product name is required'],
    trim: true, minLength: 3, maxLength: 200,
  },
  slug:             { type: String, unique: true, index: true },
  description:      { type: String, required: [true, 'Description is required'] },
  shortDescription: { type: String, maxLength: 300 },
  price: {
    type: Number, required: [true, 'Price is required'], min: 0,
  },
  originalPrice: { type: Number, min: 0 },
  discount:      { type: Number, min: 0, max: 100, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Category',
    required: [true, 'Category is required'], index: true,
  },
  brand: { type: String, trim: true },
  sku:   { type: String, unique: true, sparse: true, trim: true, uppercase: true },
  images: [{
    url:      { type: String, required: true },
    publicId: { type: String, required: true },
    isMain:   { type: Boolean, default: false },
  }],
  variants: [{
    name:    { type: String, required: true },
    options: [{ type: String }],
    _id: false,
  }],
  specifications: [{
    key:   { type: String, required: true },
    value: { type: String, required: true },
    _id: false,
  }],
  tags:  [{ type: String, lowercase: true, trim: true }],
  stock: { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
  isActive:   { type: Boolean, default: true,  index: true },
  isFeatured: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count:   { type: Number, default: 0, min: 0 },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
