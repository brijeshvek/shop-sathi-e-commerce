import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Tags, Search } from 'lucide-react'
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

const subCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  parent: z.string().min(1, 'Parent category is required'),
})

export const SubCategoriesPage = () => {
  const { data: categoriesRes, isLoading } = useGetCategoriesQuery()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(subCategorySchema),
  })

  // Get all top level categories for the dropdown
  const mainCategories = categoriesRes?.data || []

  // Flatten all subcategories from the children arrays
  const allSubCategories = mainCategories.reduce((acc, parent) => {
    if (!parent.children) return acc
    const subs = parent.children.map(child => ({ ...child, parentName: parent.name }))
    return [...acc, ...subs]
  }, [])

  // Filter by search
  const filteredSubCategories = search 
    ? allSubCategories.filter(sub => sub.name.toLowerCase().includes(search.toLowerCase()) || sub.parentName.toLowerCase().includes(search.toLowerCase()))
    : allSubCategories

  const handleOpenAdd = () => {
    setEditingCategory(null)
    reset({ name: '', description: '', parent: '' })
    setModalOpen(true)
  }

  const handleOpenEdit = (category) => {
    setEditingCategory(category)
    reset({
      name: category.name,
      description: category.description || '',
      parent: category.parent?._id || category.parent || '',
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        parent: data.parent, // Always set for subcategories
      }

      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, ...payload }).unwrap()
        toast.success('Sub-category updated successfully')
      } else {
        await createCategory(payload).unwrap()
        toast.success('Sub-category created successfully')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed. Please try again.')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(deletingId).unwrap()
      toast.success('Sub-category deleted successfully')
      setDeletingId(null)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete sub-category.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sub Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage sub-categories for your main catalog sections</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Sub-Category
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search sub-categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredSubCategories.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center py-16 text-slate-400">
          <Tags size={40} className="mb-3 opacity-50" />
          <p className="text-base font-semibold text-slate-700">No sub-categories found</p>
          <p className="text-sm mt-1">Add sub-categories to organize your catalog deeper.</p>
        </div>
      ) : (
        <Table
          columns={['Name', 'Parent Category', 'Description', 'Actions']}
          data={filteredSubCategories}
          renderRow={(cat) => (
            <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                <span className="text-slate-400 font-normal text-xs mr-1">└</span>
                {cat.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                {cat.parentName}
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">
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
        title={editingCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Sub-Category Name"
            placeholder="e.g. Smartphones"
            error={errors.name}
            {...register('name')}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category <span className="text-red-500">*</span></label>
            <select
              {...register('parent')}
              className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Select a Main Category</option>
              {mainCategories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {errors.parent && (
              <p className="mt-1 text-xs text-red-500">{errors.parent.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide a summary of products in this sub-category..."
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)} disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
              {editingCategory ? 'Save Changes' : 'Create Sub-Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Sub-Category?"
        message="Are you sure you want to delete this sub-category? It will only succeed if no active products are associated."
        isLoading={isDeleting}
      />
    </div>
  )
}

export default SubCategoriesPage
