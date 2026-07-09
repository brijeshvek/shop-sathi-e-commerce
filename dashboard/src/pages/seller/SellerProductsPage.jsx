import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetSellerProductsQuery } from '../../features/seller/sellerApi.js'
import { useDeleteProductMutation, useToggleProductStatusMutation } from '../../features/products/productsApi.js'
import Table from '../../components/common/Table.jsx'
import Button from '../../components/common/Button.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Badge from '../../components/common/Badge.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const SellerProductsPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState(null)

  const { data: res, isLoading } = useGetSellerProductsQuery({ page, limit: 10, search })
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const [toggleStatus] = useToggleProductStatusMutation()

  const products = res?.data || []
  const meta = res?.pagination || {}

  const handleDelete = async () => {
    try {
      await deleteProduct(deletingId).unwrap()
      toast.success('Product deleted')
      setDeletingId(null)
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleToggle = async (product) => {
    try {
      await toggleStatus({ id: product._id, isActive: !product.isActive }).unwrap()
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your listed products</p>
        </div>
        <Link to="/products/add">
          <Button variant="primary" icon={Plus}>Add Product</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <Table
          columns={['#', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions']}
          data={products}
          renderRow={(product, index) => (
            <tr key={product._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-500">
                {((meta.currentPage || 1) - 1) * 10 + index + 1}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-slate-400" /></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.sku || '—'}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{product.category?.name || '—'}</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</td>
              <td className="px-6 py-4 text-sm text-slate-500">{product.stock}</td>
              <td className="px-6 py-4">
                <button onClick={() => handleToggle(product)}>
                  <Badge variant={product.isActive ? 'success' : 'danger'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </button>
              </td>
              <td className="px-6 py-4 space-x-2">
                <Link to={`/products/edit/${product._id}`}>
                  <Button variant="ghost" size="sm"><Edit2 size={14} className="text-slate-500" /></Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setDeletingId(product._id)}>
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </td>
            </tr>
          )}
        />
      )}

      {meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message="This will remove the product from your store. This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  )
}

export default SellerProductsPage
