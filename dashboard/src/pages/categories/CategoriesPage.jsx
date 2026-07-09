import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Folder, Upload, X, Tags, LayoutGrid, ArrowLeft, Eye } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { 
  useGetCategoriesQuery, useCreateCategoryMutation, 
  useUpdateCategoryMutation, useDeleteCategoryMutation 
} from '../../features/categories/categoriesApi.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import api from '../../services/api.js'

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  parent: z.string().optional().nullable(),
})

export const CategoriesPage = () => {
  const { data: categoriesRes, isLoading } = useGetCategoriesQuery()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [activeParent, setActiveParent] = useState(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
  })

  const categories = categoriesRes?.data || []

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setPreviewImage(null)
    reset({ name: '', description: '', imageUrl: '', parent: null })
    setModalOpen(true)
  }

  const handleOpenEdit = (category) => {
    setEditingCategory(category)
    setPreviewImage(category.image?.url || null)
    reset({
      name: category.name,
      description: category.description || '',
      imageUrl: category.image?.url || '',
      parent: category.parent?._id || category.parent || null,
    })
    setModalOpen(true)
  }

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
        const imageUrl = res.data.data.url
        setValue('imageUrl', imageUrl)
        setPreviewImage(imageUrl)
        toast.success('Image uploaded successfully!')
      }
    } catch (err) {
      toast.error('Image upload failed. Ensure it is a valid image under 5MB.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setValue('imageUrl', '')
    setPreviewImage(null)
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        image: data.imageUrl ? { url: data.imageUrl, publicId: 'custom' } : undefined,
        parent: data.parent || null,
      }

      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, ...payload }).unwrap()
        toast.success('Category updated successfully')
      } else {
        await createCategory(payload).unwrap()
        toast.success('Category created successfully')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed. Please try again.')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(deletingId).unwrap()
      toast.success('Category deleted successfully')
      setDeletingId(null)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete category.')
    }
  }

  // Flattened categories for listing
  const tableData = activeParent
    ? (activeParent.children || []).map(child => ({ ...child, parentName: activeParent.name }))
    : categories

  const mainCategoriesCount = categories.length
  const subCategoriesCount = categories.reduce((acc, cat) => acc + (cat.children ? cat.children.length : 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {activeParent ? (
            <div className="flex items-center space-x-3 mb-1">
              <button 
                onClick={() => setActiveParent(null)}
                className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">{activeParent.name} <span className="text-slate-400 font-medium text-lg">Subcategories</span></h1>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
              <p className="text-slate-500 text-sm mt-1">Manage catalog sections and sub-categories</p>
            </>
          )}
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Category
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center space-x-4 p-3 border border-slate-100 rounded-lg bg-slate-50">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <LayoutGrid size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Main Categories</p>
            <p className="text-xl font-bold text-slate-900">{mainCategoriesCount}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-3 border border-slate-100 rounded-lg bg-slate-50">
          <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
            <Tags size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Sub Categories</p>
            <p className="text-xl font-bold text-slate-900">{subCategoriesCount}</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          columns={['Image', 'Name', 'Parent Category', 'Subcategories', 'Actions']}
          data={tableData}
          renderRow={(cat) => (
            <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                {cat.image?.url ? (
                  <img src={cat.image.url} alt={cat.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">
                    <Folder size={18} />
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                {cat.parentName ? (
                  <span className="text-slate-400 font-normal text-xs mr-1">└</span>
                ) : null}
                {cat.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                {cat.parentName || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {!activeParent && cat.children ? (
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                    {cat.children.length} subcategories
                  </span>
                ) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                {!activeParent && (
                  <Button variant="secondary" size="sm" onClick={() => setActiveParent(cat)} className="!px-2" title="View Subcategories">
                    <Eye size={14} className="text-slate-600" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(cat)}>
                  <Edit2 size={14} className="text-slate-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeletingId(cat._id)}>
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </td>
            </tr>
          )}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Laptops"
            error={errors.name}
            {...register('name')}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
            <select
              {...register('parent')}
              className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">None (Top-Level Category)</option>
              {categories
                .filter(c => !c.parent && c._id !== editingCategory?._id)
                .map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
          </div>

          {/* Category Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Category Image</label>
            
            {/* Preview */}
            {previewImage && (
              <div className="relative inline-block">
                <img 
                  src={previewImage} 
                  alt="Category preview" 
                  className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-xs"
                />
                <button 
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Upload Box */}
            {!previewImage && (
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                {uploading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Upload size={22} className="text-slate-400 mb-1" />
                    <p className="text-xs text-slate-500 font-medium">Click to upload image</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP under 5MB</p>
                  </>
                )}
              </div>
            )}

            {/* Or paste URL */}
            <Input
              label="Or paste Image URL"
              placeholder="https://images.unsplash.com/..."
              error={errors.imageUrl}
              {...register('imageUrl', {
                onChange: (e) => {
                  const url = e.target.value
                  if (url && (url.startsWith('http') || url.startsWith('data:'))) {
                    setPreviewImage(url)
                  } else if (!url) {
                    setPreviewImage(null)
                  }
                }
              })}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide a summary of products in this category..."
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category?"
        message="Are you sure you want to delete this category? All sub-categories may be orphaned, and it will only succeed if no active products are associated."
        isLoading={isDeleting}
      />
    </div>
  )
}

export default CategoriesPage
