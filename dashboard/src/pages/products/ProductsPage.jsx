import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight, AlertTriangle, Package } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  useGetProductsAdminQuery, useToggleProductStatusMutation, useDeleteProductMutation 
} from '../../features/products/productsApi.js'
import { useGetSellerProductsQuery } from '../../features/seller/sellerApi.js'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import { useAuth } from '../../hooks/useAuth.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const ProductsPage = () => {
  const navigate = useNavigate()
  const { isSeller } = useAuth()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  
  const debouncedSearch = useDebounce(search, 400)
  
  const { data: categoriesRes } = useGetCategoriesQuery()

  // Admin uses admin API, Seller uses seller API
  const adminQuery = useGetProductsAdminQuery({
    page, limit: 10,
    search: debouncedSearch,
    category: category || undefined,
    isActive: status === '' ? undefined : status,
  }, { skip: isSeller })

  const sellerQuery = useGetSellerProductsQuery({
    page, limit: 10, search: debouncedSearch,
  }, { skip: !isSeller })

  const activeQuery = isSeller ? sellerQuery : adminQuery

  const [toggleStatus] = useToggleProductStatusMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  
  const [deletingId, setDeletingId] = useState(null)

  const categories = categoriesRes?.data || []
  const products = activeQuery.data?.data || []
  const pagination = activeQuery.data?.pagination || { currentPage: 1, totalPages: 1 }
  const isLoading = activeQuery.isLoading

  const handleToggle = async (product) => {
    try {
      await toggleStatus({ id: product._id, isActive: !product.isActive }).unwrap()
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error('Failed to change product status.')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deletingId).unwrap()
      toast.success('Product deleted successfully')
      setDeletingId(null)
    } catch (err) {
      toast.error('Failed to delete product.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isSeller ? 'My Products' : 'Products'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isSeller ? 'Manage your listed products' : 'Manage catalog inventory, pricing, and active status'}
          </p>
        </div>
        <Link to="/products/add">
          <Button variant="primary" icon={Plus}>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className={`grid grid-cols-1 gap-4 ${isSeller ? 'md:grid-cols-1' : 'md:grid-cols-4'} bg-white p-4 border border-slate-200 rounded-xl shadow-xs`}>
        <div className={`relative ${isSeller ? '' : 'md:col-span-2'}`}>
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search products by name, SKU or brand..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        {!isSeller && (
          <>
            <div>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center py-16 text-slate-400">
          <Package size={40} className="mb-3" />
          <p className="text-base font-semibold">No products found</p>
          <Link to="/products/add" className="mt-3 text-sm text-violet-600 font-semibold hover:underline">Add your first product →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <Table
            columns={['#', 'Image', 'Product details / SKU', 'Category', 'Price', 'Stock', ...(!isSeller ? ['Seller'] : []), 'Status', 'Actions']}
            data={products}
            renderRow={(product, index) => (
              <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                  {(pagination.currentPage - 1) * 10 + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={product.images?.find(i => i.isMain)?.url || product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-800">{product.name}</div>
                  <div className="text-xs text-slate-400">SKU: {product.sku || 'N/A'} | Brand: {product.brand || 'Generic'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {product.category?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through ml-1.5">{formatCurrency(product.originalPrice)}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {product.stock <= 10 ? (
                    <div className="flex items-center text-amber-600 font-semibold space-x-1">
                      <AlertTriangle size={14} />
                      <span>{product.stock} (Low Stock)</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 font-medium">{product.stock} items</span>
                  )}
                </td>
                {!isSeller && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.seller ? (
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{product.seller.sellerInfo?.storeName || product.seller.name}</p>
                        <p className="text-xs text-slate-400">{product.seller.email}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">Admin</span>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleToggle(product)} className="focus:outline-none">
                    {product.isActive ? (
                      <div className="flex items-center text-green-600 hover:text-green-800 transition-colors">
                        <ToggleRight size={28} />
                        <span className="text-xs font-semibold ml-1">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                        <ToggleLeft size={28} />
                        <span className="text-xs font-semibold ml-1">Inactive</span>
                      </div>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-1.5">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/products/edit/${product._id}`)}>
                    <Edit2 size={14} className="text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeletingId(product._id)}>
                    <Trash2 size={14} className="text-red-500" />
                  </Button>
                </td>
              </tr>
            )}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        message="Are you sure you want to delete this product? It will be removed from the catalog."
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ProductsPage
