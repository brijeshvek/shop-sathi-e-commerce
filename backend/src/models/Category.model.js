import mongoose from 'mongoose'
import slugify from 'slugify'

const categorySchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Category name is required'],
    unique: true, trim: true, minLength: 2, maxLength: 50,
  },
  slug:        { type: String, unique: true },
  description: { type: String, trim: true },
  image: {
    url:      { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  parent:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

categorySchema.virtual('isSubcategory').get(function () {
  return this.parent !== null
})

// Performance Indexes
categorySchema.index({ isActive: 1, parent: 1 })
categorySchema.index({ slug: 1 })

const Category = mongoose.model('Category', categorySchema)
export default Category
