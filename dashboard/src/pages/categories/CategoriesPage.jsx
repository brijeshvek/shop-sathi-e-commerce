import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Folder } from 'lucide-react'
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

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
  })

  const categories = categoriesRes?.data || []

  const handleOpenAdd = () => {
    setEditingCategory(null)
    reset({ name: '', description: '', imageUrl: '', parent: null })
    setModalOpen(true)
  }

  const handleOpenEdit = (category) => {
    setEditingCategory(category)
    reset({
      name: category.name,
      description: category.description || '',
      imageUrl: category.image?.url || '',
      parent: category.parent?._id || category.parent || null,
    })
    setModalOpen(true)
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
  const tableData = categories.reduce((acc, cat) => {
    acc.push(cat)
    if (cat.children && cat.children.length > 0) {
      cat.children.forEach(child => {
        acc.push({ ...child, parentName: cat.name })
      })
    }
    return acc
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage catalog sections and sub-categories</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Category
        </Button>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          columns={['Image', 'Name', 'Parent Category', 'Description', 'Actions']}
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
              <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                {cat.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
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

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/..."
            error={errors.imageUrl}
            {...register('imageUrl')}
          />

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
