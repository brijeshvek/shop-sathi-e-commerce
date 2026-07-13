import React, { useState } from 'react'
import { FileCode, Plus, Search, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useGetCmsPagesQuery, useCreateCmsPageMutation, useUpdateCmsPageMutation, useDeleteCmsPageMutation
} from '../../features/cms/cmsApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Input from '../../components/common/Input.jsx'

export const CmsPagesPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [isActive, setIsActive] = useState(true)

  const debouncedSearch = useDebounce(search, 400)

  const { data: pagesRes, isLoading, refetch } = useGetCmsPagesQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined
  })

  const [createCmsPage, { isLoading: isCreating }] = useCreateCmsPageMutation()
  const [updateCmsPage, { isLoading: isUpdating }] = useUpdateCmsPageMutation()
  const [deleteCmsPage, { isLoading: isDeleting }] = useDeleteCmsPageMutation()

  const pages = pagesRes?.data || []
  const pagination = pagesRes?.pagination || { currentPage: 1, totalPages: 1 }

  const handleOpenAddModal = () => {
    setEditingPage(null)
    setTitle('')
    setContent('')
    setMetaDescription('')
    setSlug('')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (cmsPage) => {
    setEditingPage(cmsPage)
    setTitle(cmsPage.title || '')
    setContent(cmsPage.content || '')
    setMetaDescription(cmsPage.metaDescription || '')
    setSlug(cmsPage.slug || '')
    setIsActive(cmsPage.isActive ?? true)
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!title || !content) {
      return toast.error('Title and Content are required')
    }

    const payload = {
      title,
      content,
      metaDescription,
      slug: slug || undefined,
      isActive
    }

    try {
      if (editingPage) {
        await updateCmsPage({ id: editingPage._id, ...payload }).unwrap()
        toast.success('Page updated successfully!')
      } else {
        await createCmsPage(payload).unwrap()
        toast.success('Page created successfully!')
      }
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save page')
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteCmsPage(deletingId).unwrap()
      toast.success('Page deleted successfully!')
      setDeletingId(null)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete page')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Custom Pages</h1>
          <p className="text-slate-500 text-sm mt-1">Manage static pages like About Us, Privacy Policy, and Terms.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
          New Page
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={['Page Title', 'Slug', 'Meta Description', 'Status', 'Last Updated', 'Actions']}
          data={pages}
          isLoading={isLoading}
          emptyMessage="No pages found."
          renderRow={(cmsPage) => (
            <tr key={cmsPage._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                {cmsPage.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                /{cmsPage.slug}
              </td>
              <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate" title={cmsPage.metaDescription}>
                {cmsPage.metaDescription || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={cmsPage.isActive ? 'green' : 'gray'}>
                  {cmsPage.isActive ? 'Published' : 'Draft'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                {new Date(cmsPage.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(cmsPage)}
                  className="p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => setDeletingId(cmsPage._id)}
                  className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          )}
        />

        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">
                {editingPage ? 'Edit Custom Page' : 'Create Custom Page'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <Input
                label="Page Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. About Us"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="URL Slug (Optional)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. about-us"
                />
                <Input
                  label="Meta Description (SEO)"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Brief description for search engine listings..."
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Page Content (HTML/Markdown support)</label>
                <textarea
                  required
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type the static page HTML or markdown content here..."
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Publish Immediately
                </label>
              </div>
            </form>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" onClick={handleSave} isLoading={isCreating || isUpdating}>
                Save Page
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Custom Page"
        message="Are you sure you want to permanently delete this page? This action cannot be undone."
        confirmText="Delete Page"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default CmsPagesPage
