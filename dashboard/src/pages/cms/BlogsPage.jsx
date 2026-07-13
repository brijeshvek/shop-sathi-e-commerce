import React, { useState } from 'react'
import { FileText, Plus, Search, Edit2, Trash2, Save, X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useGetBlogsQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation
} from '../../features/cms/cmsApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Input from '../../components/common/Input.jsx'

export const BlogsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Form states
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [author, setAuthor] = useState('Admin')
  const [tags, setTags] = useState('')
  const [isActive, setIsActive] = useState(true)

  const debouncedSearch = useDebounce(search, 400)

  const { data: blogsRes, isLoading, refetch } = useGetBlogsQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined
  })

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()

  const blogs = blogsRes?.data || []
  const pagination = blogsRes?.pagination || { currentPage: 1, totalPages: 1 }

  const handleOpenAddModal = () => {
    setEditingPost(null)
    setTitle('')
    setSummary('')
    setContent('')
    setImage('')
    setAuthor('Admin')
    setTags('')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (post) => {
    setEditingPost(post)
    setTitle(post.title || '')
    setSummary(post.summary || '')
    setContent(post.content || '')
    setImage(post.image || '')
    setAuthor(post.author || 'Admin')
    setTags(post.tags?.join(', ') || '')
    setIsActive(post.isActive ?? true)
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!title || !content) {
      return toast.error('Title and Content are required')
    }

    const payload = {
      title,
      summary,
      content,
      image,
      author,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isActive
    }

    try {
      if (editingPost) {
        await updateBlog({ id: editingPost._id, ...payload }).unwrap()
        toast.success('Blog post updated successfully!')
      } else {
        await createBlog(payload).unwrap()
        toast.success('Blog post created successfully!')
      }
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save blog post')
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteBlog(deletingId).unwrap()
      toast.success('Blog post deleted successfully!')
      setDeletingId(null)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete blog post')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-1">Publish news, announcements, and articles for your storefront.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
          New Article
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={['Details', 'Author', 'Tags', 'Status', 'Date', 'Actions']}
          data={blogs}
          isLoading={isLoading}
          emptyMessage="No blog posts found."
          renderRow={(post) => {
            const blogImg = post.image || 'https://via.placeholder.com/150'
            return (
              <tr key={post._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={blogImg}
                      alt={post.title}
                      className="w-12 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                    <div className="max-w-[280px] truncate">
                      <p className="font-semibold text-slate-900 truncate" title={post.title}>
                        {post.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{post.summary || 'No summary'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {post.author || 'Admin'}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 max-w-[150px] truncate">
                  {post.tags?.join(', ') || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={post.isActive ? 'green' : 'gray'}>
                    {post.isActive ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(post)}
                    className="p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(post._id)}
                    className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            )
          }}
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
                {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <Input
                label="Article Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Tech Gadgets You Need in 2026"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Admin or Writer Name"
                />
                <Input
                  label="Tags (Comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Technology, Gadgets, Deals"
                />
              </div>

              <Input
                label="Featured Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />

              <Input
                label="Summary / Short Excerpt"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of the article..."
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Body Content</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing article details..."
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                Save Article
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
        title="Delete Blog Post"
        message="Are you sure you want to permanently delete this blog post? This action cannot be undone."
        confirmText="Delete Article"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default BlogsPage
