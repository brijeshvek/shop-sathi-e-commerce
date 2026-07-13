import mongoose from 'mongoose'

const attributeFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'number', 'select', 'multiselect', 'checkbox', 'date'], 
    required: true 
  },
  options: [{ type: String }],
  required: { type: Boolean, default: false },
  defaultValue: { type: mongoose.Schema.Types.Mixed }
}, { _id: true })

const categoryAttributeSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    unique: true
  },
  fields: [attributeFieldSchema]
}, { timestamps: true })

const CategoryAttribute = mongoose.model('CategoryAttribute', categoryAttributeSchema)
export default CategoryAttribute
