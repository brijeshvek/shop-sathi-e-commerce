import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Upload, X, Check, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import { useCreateProductMutation, useGetDistinctBrandsQuery } from '../../features/products/productsApi.js'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useGetCategoryAttributesQuery } from '../../features/attributes/attributesApi.js'

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

export const AddProductPage = () => {
  const navigate = useNavigate()
  const { data: categoriesRes } = useGetCategoriesQuery()
  const [createProduct, { isLoading }] = useCreateProductMutation()

  const [images, setImages] = useState([]) // Array of { url, isMain }
  const [uploading, setUploading] = useState(false)
  const [manualUrl, setManualUrl] = useState('')
  const [showCustomBrand, setShowCustomBrand] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { isFeatured: false, stock: 10, isReturnable: false, returnDays: 0, isExchangeable: false, exchangeDays: 0 }
  })
  
  const isReturnable = watch('isReturnable')
  const isExchangeable = watch('isExchangeable')

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

  const selectedCategoryObj = subCategories.find(c => c._id === selectedSubCategory) || activeMainCatObj;
  const selectedBrand = watch('brand');

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

  const { data: attrRes } = useGetCategoryAttributesQuery(selectedMainCategory, { skip: !selectedMainCategory })
  const dynamicFields = attrRes?.data?.fields || []

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
      toast.error('File upload failed. Ensure it is a valid image under 5MB.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddManualUrl = () => {
    if (!manualUrl) return
    if (!manualUrl.startsWith('http') && !manualUrl.startsWith('data:')) {
      toast.error('Please enter a valid image URL')
      return
    }
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
    // If we removed the main image, make the first remaining image main
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
        ...data,
        category: data.mainCategory,
        subcategory: data.subCategory,
        tags: formattedTags,
        images,
        dimensions: {
          weight: data.dimensions?.weight ? Number(data.dimensions.weight) : undefined,
          height: data.dimensions?.height ? Number(data.dimensions.height) : undefined,
          width: data.dimensions?.width ? Number(data.dimensions.width) : undefined,
          length: data.dimensions?.length ? Number(data.dimensions.length) : undefined,
        },
        shipping: {
          ...data.shipping,
          deliveryTimeDays: data.shipping?.deliveryTimeDays ? Number(data.shipping.deliveryTimeDays) : undefined,
        },
        returnPolicy: {
          isReturnable: data.isReturnable,
          returnDays: data.isReturnable ? data.returnDays : 0,
          isExchangeable: data.isExchangeable,
          exchangeDays: data.isExchangeable ? data.exchangeDays : 0
        }
      }

      await createProduct(payload).unwrap()
      toast.success('Product created successfully!')
      navigate('/products')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create product.')
    }
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
          <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
          <p className="text-slate-500 text-sm mt-0.5">Upload a new item to catalog listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h3>
              <Input
                label="Product Name"
                placeholder="e.g. iPhone 15 Pro Max"
                error={errors.name}
                {...register('name')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SKU Code"
                  placeholder="e.g. AAPL-IP15PM"
                  error={errors.sku}
                  {...register('sku')}
                />
              </div>
              <Input
                label="Short Summary description"
                placeholder="Provide a quick one-line summary..."
                error={errors.shortDescription}
                {...register('shortDescription')}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Full Description</label>
                <textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Detailed product descriptions..."
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
                  placeholder="129999"
                  error={errors.price}
                  {...register('price')}
                />
                <Input
                  label="Original Price (₹)"
                  type="number"
                  placeholder="139999"
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

            {/* Dynamic Category Attributes */}
            {dynamicFields.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
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

            {/* Dimensions & Shipping */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Dimensions & Shipping</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="Weight (g)" type="number" {...register('dimensions.weight')} />
                <Input label="Height (cm)" type="number" {...register('dimensions.height')} />
                <Input label="Width (cm)" type="number" {...register('dimensions.width')} />
                <Input label="Length (cm)" type="number" {...register('dimensions.length')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Shipping Delivery Time (Days)" type="number" placeholder="3-5" {...register('shipping.deliveryTimeDays')} />
                <div className="flex items-center space-x-3 pt-6">
                  <input
                    id="freeShipping"
                    type="checkbox"
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                    {...register('shipping.freeShipping')}
                  />
                  <label htmlFor="freeShipping" className="text-sm font-semibold text-slate-700">
                    Free Shipping
                  </label>
                </div>
              </div>
            </div>

            {/* Certifications & Warranty */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Compliance & Warranty</h3>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 text-sm text-slate-600">
                  <input type="checkbox" {...register('certifications.bis')} className="rounded border-slate-300" />
                  <span>BIS Certified</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-600">
                  <input type="checkbox" {...register('certifications.isi')} className="rounded border-slate-300" />
                  <span>ISI Mark</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-600">
                  <input type="checkbox" {...register('certifications.ce')} className="rounded border-slate-300" />
                  <span>CE Certified</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-600">
                  <input type="checkbox" {...register('certifications.rohs')} className="rounded border-slate-300" />
                  <span>RoHS Compliant</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-slate-600">
                  <input type="checkbox" {...register('certifications.fssai')} className="rounded border-slate-300" />
                  <span>FSSAI (Food)</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Warranty Period" placeholder="e.g. 1 Year" {...register('warranty.period')} />
                <select
                  {...register('warranty.type')}
                  className="block w-full mt-6 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="No Warranty">No Warranty</option>
                  <option value="Brand Warranty">Brand Warranty</option>
                  <option value="Seller Warranty">Seller Warranty</option>
                </select>
              </div>
            </div>

            {/* Return & Exchange Policy */}
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

          {/* Media & Tags Sidebar (1 col) */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Product Media</h3>
              
              {/* Image upload box */}
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
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG or WebP (max 5MB)</span>
              </div>

              {/* Manual URL box */}
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

              {/* Uploaded Images List */}
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
                placeholder="e.g. mobile, smart, iOS"
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
          <Button variant="secondary" onClick={() => navigate('/products')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Publish Product
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddProductPage
