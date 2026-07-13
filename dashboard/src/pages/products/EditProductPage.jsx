import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload, X, Check, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import {
  useGetProductByIdAdminQuery, useUpdateProductMutation, useGetDistinctBrandsQuery
} from '../../features/products/productsApi.js'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js'
import { useGetCategoryAttributesQuery } from '../../features/attributes/attributesApi.js'
import { useAuth } from '../../hooks/useAuth.js'
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
  mainCategory: z.string().min(1, 'Main Category is required'),
  subCategory: z.string().optional(),
  shortDescription: z.string().min(10, 'Short description should be at least 10 characters'),
  description: z.string().min(10, 'Full description should be at least 10 characters'),
  tags: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isReturnable: z.boolean().default(false),
  returnDays: z.preprocess((val) => Number(val || 0), z.number().min(0)),
  isExchangeable: z.boolean().default(false),
  exchangeDays: z.preprocess((val) => Number(val || 0), z.number().min(0)),
}).passthrough()

export const EditProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSeller } = useAuth()
  const { data: categoriesRes } = useGetCategoriesQuery()
  const { data: productRes, isLoading: isFetching } = useGetProductByIdAdminQuery(id)
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [manualUrl, setManualUrl] = useState('')
  const [showCustomBrand, setShowCustomBrand] = useState(false)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  })

  const isReturnable = watch('isReturnable')
  const isExchangeable = watch('isExchangeable')

  const product = productRes?.data
  const categories = categoriesRes?.data || []
  const selectedMainCategory = watch('mainCategory')
  const selectedSubCategory = watch('subCategory')

  // The category used to fetch brands should be the sub category if it exists, otherwise main category
  const categoryForBrands = selectedSubCategory || selectedMainCategory;

  const { data: brandsRes } = useGetDistinctBrandsQuery(
    { category: categoryForBrands }, 
    { skip: !categoryForBrands }
  )
  const categoryBrands = brandsRes?.data || []

  const activeMainCatObj = categories.find(c => c._id === selectedMainCategory);
  const subCategories = activeMainCatObj?.children || [];
  const selectedBrand = watch('brand');

  const { data: attrRes } = useGetCategoryAttributesQuery(selectedMainCategory, { skip: !selectedMainCategory })
  const dynamicFields = attrRes?.data?.fields || []
  const schemaKey = activeMainCatObj ? activeMainCatObj.name : ""

  useEffect(() => {
    if (selectedSubCategory && !subCategories.find(c => c._id === selectedSubCategory)) {
      setValue('subCategory', '');
    }
  }, [selectedMainCategory, selectedSubCategory, subCategories, setValue]);

  useEffect(() => {
    if (selectedBrand === '__custom__') {
      setShowCustomBrand(true);
      setValue('brand', '');
    }
  }, [selectedBrand, setValue]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        brand: product.brand || '',
        sku: product.sku || '',
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        mainCategory: product.category?._id || product.category || '',
        subCategory: product.subcategory?._id || product.subcategory || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        tags: product.tags?.join(', ') || '',
        isFeatured: product.isFeatured || false,
        isReturnable: product.returnPolicy?.isReturnable || false,
        returnDays: product.returnPolicy?.returnDays || 0,
        isExchangeable: product.returnPolicy?.isExchangeable || false,
        exchangeDays: product.returnPolicy?.exchangeDays || 0,
        attributes: product.attributes || {}
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
        category: data.mainCategory,
        subcategory: data.subCategory,
        tags: formattedTags,
        images,
        returnPolicy: {
          isReturnable: data.isReturnable,
          returnDays: data.isReturnable ? data.returnDays : 0,
          isExchangeable: data.isExchangeable,
          exchangeDays: data.isExchangeable ? data.exchangeDays : 0
        }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Main Category</label>
                    <select
                      {...register('mainCategory')}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">Select Main Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.mainCategory && <p className="text-xs text-red-500 mt-1">{errors.mainCategory.message}</p>}
                  </div>
                  {subCategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sub Category</label>
                      <select
                        {...register('subCategory')}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      >
                        <option value="">Select Sub Category</option>
                        {subCategories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                      {errors.subCategory && <p className="text-xs text-red-500 mt-1">{errors.subCategory.message}</p>}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
                    {categoryBrands.length > 0 && !showCustomBrand ? (
                      <select
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        {...register('brand')}
                      >
                        <option value="">Select Brand</option>
                        {categoryBrands.map(b => (
                          <option key={b.name} value={b.name}>{b.name}</option>
                        ))}
                        <option value="__custom__">+ Add Custom Brand</option>
                      </select>
                    ) : (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Type brand name..."
                          className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          {...register('brand')}
                        />
                        {categoryBrands.length > 0 && (
                          <button type="button" onClick={() => { setShowCustomBrand(false); setValue('brand', ''); }} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 hover:bg-slate-100">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                    {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Return & Exchange Policy</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    id="isReturnable"
                    type="checkbox"
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                    {...register('isReturnable')}
                  />
                  <label htmlFor="isReturnable" className="text-sm font-semibold text-slate-700">
                    Product is Returnable
                  </label>
                </div>
                {isReturnable && (
                  <div className="pl-7">
                    <Input
                      label="Return Window (Days)"
                      type="number"
                      placeholder="e.g. 7"
                      error={errors.returnDays}
                      {...register('returnDays')}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-2">
                  <input
                    id="isExchangeable"
                    type="checkbox"
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                    {...register('isExchangeable')}
                  />
                  <label htmlFor="isExchangeable" className="text-sm font-semibold text-slate-700">
                    Product is Exchangeable
                  </label>
                </div>
                {isExchangeable && (
                  <div className="pl-7">
                    <Input
                      label="Exchange Window (Days)"
                      type="number"
                      placeholder="e.g. 7"
                      error={errors.exchangeDays}
                      {...register('exchangeDays')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Category Attributes */}
          {dynamicFields.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs lg:col-span-2">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Settings size={18} className="text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-900">{schemaKey} Attributes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicFields.map((field) => {
                  const inputName = `attributes.${field.key}`;
                  return (
                    <div key={field.key} className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'select' && (
                        <select
                          {...register(inputName, { required: field.required })}
                          className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                      {field.type === 'multiselect' && (
                        <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-slate-50">
                          {field.options.map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 text-xs font-medium text-slate-600 cursor-pointer">
                              <input
                                type="checkbox"
                                value={opt}
                                {...register(inputName)}
                                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="pt-2">
                          <input
                            type="checkbox"
                            {...register(inputName)}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-slate-600">Enabled</span>
                        </div>
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          {...register(inputName, { required: field.required })}
                          className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          step="any"
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          {...register(inputName, { required: field.required })}
                          className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      )}
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          {...register(inputName, { required: field.required })}
                          className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Media & Sidebar */}
          <div className="space-y-6 lg:col-span-1">
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

            {/* Seller Info Card (Admin Only) */}
            {!isSeller && product?.seller && (
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-6 space-y-4 shadow-xs ">
                <h3 className="text-base font-semibold text-violet-900 border-b border-violet-200 pb-3">Seller Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-violet-500 font-semibold uppercase tracking-wider ">Store Name</p>
                    <p className="text-sm font-bold text-black">{product.seller.sellerInfo?.storeName || product.seller.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-violet-500 font-semibold uppercase tracking-wider">Seller Name</p>
                    <p className="text-sm font-semibold text-black">{product.seller.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-violet-500 font-semibold uppercase tracking-wider">Contact Details</p>
                    <p className="text-sm text-black">{product.seller.email}</p>
                    <p className="text-sm text-black">{product.seller.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
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
