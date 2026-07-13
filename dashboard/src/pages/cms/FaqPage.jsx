import React, { useState } from 'react'
import { HelpCircle, Plus, Search, Edit2, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useGetFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation
} from '../../features/cms/cmsApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Input from '../../components/common/Input.jsx'

export const FaqPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Form states
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('General')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const debouncedSearch = useDebounce(search, 400)

  const { data: faqsRes, isLoading, refetch } = useGetFaqsQuery({
    page,
    limit: 50, // Usually FAQs are listed all at once
    search: debouncedSearch || undefined
  })

  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation()
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation()
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation()

  const faqs = faqsRes?.data || []
  const pagination = faqsRes?.pagination || { currentPage: 1, totalPages: 1 }

  const handleOpenAddModal = () => {
    setEditingFaq(null)
    setQuestion('')
    setAnswer('')
    setCategory('General')
    setOrder(0)
    setIsActive(true)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (faq) => {
    setEditingFaq(faq)
    setQuestion(faq.question || '')
    setAnswer(faq.answer || '')
    setCategory(faq.category || 'General')
    setOrder(faq.order || 0)
    setIsActive(faq.isActive ?? true)
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!question || !answer) {
      return toast.error('Question and Answer are required')
    }

    const payload = {
      question,
      answer,
      category,
      order: Number(order) || 0,
      isActive
    }

    try {
      if (editingFaq) {
        await updateFaq({ id: editingFaq._id, ...payload }).unwrap()
        toast.success('FAQ updated successfully!')
      } else {
        await createFaq(payload).unwrap()
        toast.success('FAQ created successfully!')
      }
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save FAQ')
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteFaq(deletingId).unwrap()
      toast.success('FAQ deleted successfully!')
      setDeletingId(null)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete FAQ')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
          <p className="text-slate-500 text-sm mt-1">Manage Frequently Asked Questions for customer self-service.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
          Add FAQ
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={['Question & Answer', 'Category', 'Display Order', 'Status', 'Actions']}
          data={faqs}
          isLoading={isLoading}
          emptyMessage="No FAQs found."
          renderRow={(faq) => (
            <tr key={faq._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 max-w-[320px]">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{faq.question}</p>
                  <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap line-clamp-2">{faq.answer}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                {faq.category || 'General'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {faq.order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={faq.isActive ? 'green' : 'gray'}>
                  {faq.isActive ? 'Active' : 'Hidden'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(faq)}
                  className="p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => setDeletingId(faq._id)}
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
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <Input
                label="Question"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What is your return policy?"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Shipping, Payments"
                />
                <Input
                  label="Display Order (priority)"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Answer</label>
                <textarea
                  required
                  rows={5}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type the answer for customer query..."
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
                  Display FAQ to Customers
                </label>
              </div>
            </form>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" onClick={handleSave} isLoading={isCreating || isUpdating}>
                Save FAQ
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
        title="Delete FAQ"
        message="Are you sure you want to permanently delete this FAQ? This action cannot be undone."
        confirmText="Delete FAQ"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default FaqPage
