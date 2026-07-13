import React, { useState } from 'react'
import { Star, Trash2, ShieldCheck, Calendar, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetReviewsQuery, useDeleteReviewMutation } from '../../features/reviews/reviewsApi.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'

export const ProductReviewsPage = () => {
  const [page, setPage] = useState(1)
  const [ratingFilter, setRatingFilter] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const { data: reviewsRes, isLoading, refetch } = useGetReviewsQuery({
    page,
    limit: 10,
    rating: ratingFilter || undefined,
  })

  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation()

  const reviews = reviewsRes?.data || []
  const pagination = reviewsRes?.pagination || { currentPage: 1, totalPages: 1 }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteReview(deletingId).unwrap()
      toast.success('Review deleted successfully')
      setDeletingId(null)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete review')
    }
  }

  const columns = ['Product', 'Customer', 'Review Rating', 'Details', 'Created At', 'Actions']

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            size={16}
            fill={idx < rating ? 'currentColor' : 'transparent'}
            className={idx < rating ? 'text-amber-400' : 'text-slate-200'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Reviews</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor, review, and moderate customer reviews and ratings.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-48"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing {reviews.length} review(s)
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={columns}
          data={reviews}
          isLoading={isLoading}
          emptyMessage="No reviews found matching the filters."
          renderRow={(review) => {
            const product = review.product || {}
            const user = review.user || {}
            const productImg = product.images?.[0]?.url || 'https://via.placeholder.com/150'

            return (
              <tr key={review._id} className="hover:bg-slate-50/50 transition-colors">
                {/* Product Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={productImg}
                      alt={product.name || 'Product'}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                    <div className="max-w-[200px] truncate">
                      <p className="font-semibold text-slate-900 truncate" title={product.name}>
                        {product.name || 'Unknown Product'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Customer Column */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{user.name || 'Anonymous'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user.email || 'N/A'}</p>
                  </div>
                </td>

                {/* Rating Column */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {renderStars(review.rating)}
                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                        <ShieldCheck size={12} />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </td>

                {/* Details Column */}
                <td className="px-6 py-4 max-w-[300px]">
                  <div>
                    {review.title && <p className="font-semibold text-slate-800 text-sm truncate">{review.title}</p>}
                    <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap line-clamp-3">{review.comment}</p>
                  </div>
                </td>

                {/* Date Column */}
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setDeletingId(review._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )
          }}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this customer review? This action cannot be undone and will affect the product's average rating."
        confirmText="Delete Review"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ProductReviewsPage
