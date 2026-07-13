import mongoose from 'mongoose'

const cmsPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Page title is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  content: {
    type: String,
    required: [true, 'Page content is required'],
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

cmsPageSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }
  next()
})

const CmsPage = mongoose.model('CmsPage', cmsPageSchema)
export default CmsPage
