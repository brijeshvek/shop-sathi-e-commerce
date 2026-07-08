import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import { 
  useGetProductByIdAdminQuery, useUpdateProductMutation 
} from '../../features/products/productsApi.js'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Spinner from '../../components/common/Spinner.jsx'

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  brand: z.string().min(1, 'Brand name is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  price: z.preprocess((val) => Number(val), z.number().min(1, 'Price must be positive')),
  originalPrice: z.preprocess((val) => Number(val), z.number().min(1, 'Original price must be positive')),
  stock: z.preprocess((val) => Number(val), z.number().min(0, 'Stock cannot be negative')),
  category: z.string().min(1, 'Category is required'),
  shortDescription: z.string().min(10, 'Short description should be at least 10 characters'),
  description: z.string().min(10, 'Full description should be at least 10 characters'),
  tags: z.string().optional(),
  isFeatured: z.boolean().default(false),
})

export const EditProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: categoriesRes } = useGetCategoriesQuery()
  const { data: productRes, isLoading: isFetching } = useGetProductByIdAdminQuery(id)
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [manualUrl, setManualUrl] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  })

  const product = productRes?.data
  const categories = categoriesRes?.data || []

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        brand: product.brand || '',
        sku: product.sku || '',
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        category: product.category?._id || product.category || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        tags: product.tags?.join(', ') || '',
        isFeatured: product.isFeatured || false,
      })
      setImages(product.images || [])
    }
  }, [product, reset])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (res.data?.success) {
        const newImg = { 
          url: res.data.data.url, 
          publicId: res.data.data.publicId || 'uploaded_' + Math.random().toString(36).substring(2, 9), 
          isMain: images.length === 0 
        }
        setImages([...images, newImg])
        toast.success('Image uploaded successfully!')
      }
    } catch (err) {
      toast.error('File upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddManualUrl = () => {
    if (!manualUrl) return
    const newImg = { 
      url: manualUrl, 
      publicId: 'manual_' + Math.random().toString(36).substring(2, 9), 
      isMain: images.length === 0 
    }
    setImages([...images, newImg])
    setManualUrl('')
  }

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, idx) => idx !== index)
    if (images[index]?.isMain && updated.length > 0) {
      updated[0].isMain = true
    }
    setImages(updated)
  }

  const handleSetMainImage = (index) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isMain: idx === index
    }))
    setImages(updated)
  }

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please add at least one product image.')
      return
    }

    try {
      const formattedTags = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []

      const payload = {
        id,
        ...data,
        tags: formattedTags,
        images
      }

      await updateProduct(payload).unwrap()
      toast.success('Product updated successfully!')
      navigate('/products')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update product.')
    }
  }

  if (isFetching) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
          <p className="text-slate-500 text-sm mt-0.5">Modify catalog item details and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h3>
              <Input
                label="Product Name"
                error={errors.name}
                {...register('name')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Brand Name"
                  error={errors.brand}
                  {...register('brand')}
                />
                <Input
                  label="SKU Code"
                  error={errors.sku}
                  {...register('sku')}
                />
              </div>
              <Input
                label="Short Summary"
                error={errors.shortDescription}
                {...register('shortDescription')}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Full Description</label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Pricing & Inventory</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sale Price (₹)"
                  type="number"
                  error={errors.price}
                  {...register('price')}
                />
                <Input
                  label="Original Price (₹)"
                  type="number"
                  error={errors.originalPrice}
                  {...register('originalPrice')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Available Stock"
                  type="number"
                  error={errors.stock}
                  {...register('stock')}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Category</label>
                  <select
                    {...register('category')}
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <optgroup key={c._id} label={c.name}>
                        <option value={c._id}>{c.name} (Main)</option>
                        {c.children && c.children.map((child) => (
                          <option key={child._id} value={child._id}>{child.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Media & Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Product Media</h3>
              
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Upload className="text-slate-400 mb-2" size={24} />
                <span className="text-xs font-semibold text-slate-600">
                  {uploading ? 'Uploading...' : 'Click to Upload Image'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Or paste Image URL..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <Button variant="secondary" size="sm" onClick={handleAddManualUrl}>
                  Add
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 h-20 bg-slate-50">
                      <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1.5 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(idx)}
                          className={`p-1 rounded-full text-white ${img.isMain ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-800'}`}
                          title="Set as cover image"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 bg-red-600 hover:bg-red-700 rounded-full text-white"
                          title="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      {img.isMain && (
                        <div className="absolute top-1 left-1 bg-green-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded shadow-xs">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Additional Settings</h3>
              
              <Input
                label="Tags (Comma separated)"
                error={errors.tags}
                {...register('tags')}
              />

              <div className="flex items-center space-x-3 pt-2">
                <input
                  id="isFeatured"
                  type="checkbox"
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                  {...register('isFeatured')}
                />
                <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700">
                  Feature on Client Home
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-end space-x-4">
          <Button variant="secondary" onClick={() => navigate('/products')} disabled={isUpdating}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isUpdating}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditProductPage
