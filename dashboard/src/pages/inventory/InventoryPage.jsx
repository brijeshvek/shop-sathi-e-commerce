import React, { useState } from 'react'
import { Box, Search, Save, Plus, Minus, AlertTriangle, CheckCircle, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetProductsAdminQuery, useUpdateProductMutation } from '../../features/products/productsApi.js'
import { useGetSellerProductsQuery } from '../../features/seller/sellerApi.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'

export const InventoryPage = () => {
  const { isSeller } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all') // 'all', 'low', 'out'
  const [localStock, setLocalStock] = useState({}) // { [productId]: stockValue }
  const [updatingId, setUpdatingId] = useState(null)

  const debouncedSearch = useDebounce(search, 400)

  // Fetch admin products or seller products
  const adminQuery = useGetProductsAdminQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  }, { skip: isSeller })

  const sellerQuery = useGetSellerProductsQuery({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  }, { skip: !isSeller })

  const activeQuery = isSeller ? sellerQuery : adminQuery
  const products = activeQuery.data?.data || []
  const pagination = activeQuery.data?.pagination || { currentPage: 1, totalPages: 1 }
  const isLoading = activeQuery.isLoading

  const [updateProduct] = useUpdateProductMutation()

  // Inline stock state helper
  const handleStockChange = (productId, val) => {
    setLocalStock({
      ...localStock,
      [productId]: Math.max(0, parseInt(val, 10) || 0)
    })
  }

  const handleIncrement = (productId, currentVal) => {
    const current = localStock[productId] !== undefined ? localStock[productId] : currentVal
    handleStockChange(productId, current + 1)
  }

  const handleDecrement = (productId, currentVal) => {
    const current = localStock[productId] !== undefined ? localStock[productId] : currentVal
    handleStockChange(productId, current - 1)
  }

  const handleSaveStock = async (productId) => {
    const newStock = localStock[productId]
    if (newStock === undefined) return
    setUpdatingId(productId)
    try {
      await updateProduct({ id: productId, stock: newStock }).unwrap()
      toast.success('Stock level updated successfully!')
      // Clear local state for this product
      const updatedLocal = { ...localStock }
      delete updatedLocal[productId]
      setLocalStock(updatedLocal)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update stock.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter products by stock status in frontend since API doesn't support stock filters directly
  const filteredProducts = products.filter(product => {
    const isOut = product.stock === 0
    const isLow = product.stock > 0 && product.stock <= (product.lowStockAlertLimit || 5)
    
    if (stockFilter === 'out') return isOut
    if (stockFilter === 'low') return isLow
    return true
  })

  // Statistics
  const totalSkus = products.length
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockAlertLimit || 5)).length
  const outOfStockCount = products.filter(p => p.stock === 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Manage physical stock levels, low-stock warnings, and adjust quantities inline.</p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total SKUs</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalSkus}</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Low Stock Alert</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Out of Stock</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              stockFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              stockFilter === 'low'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              stockFilter === 'out'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items by name or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={['Product Details', 'SKU', 'Warehouse/Location', 'Status', 'Inline Stock Level', 'Actions']}
          data={filteredProducts}
          isLoading={isLoading}
          emptyMessage="No inventory items found matching your filters."
          renderRow={(product) => {
            const hasLocalChange = localStock[product._id] !== undefined
            const currentStock = hasLocalChange ? localStock[product._id] : product.stock
            const isOut = product.stock === 0
            const isLow = product.stock > 0 && product.stock <= (product.lowStockAlertLimit || 5)
            const productImg = product.images?.[0]?.url || 'https://via.placeholder.com/150'

            return (
              <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                {/* Details */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={productImg}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                    <div className="max-w-[240px] truncate">
                      <p className="font-semibold text-slate-900 truncate" title={product.name}>
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                  {product.sku || 'N/A'}
                </td>

                {/* Warehouse */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {product.warehouse || 'Primary Warehouse'}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={isOut ? 'red' : isLow ? 'yellow' : 'green'}>
                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock alert' : 'Healthy / In Stock'}
                  </Badge>
                </td>

                {/* Adjuster */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleDecrement(product._id, product.stock)}
                      className="p-1 border border-slate-300 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      value={currentStock}
                      onChange={(e) => handleStockChange(product._id, e.target.value)}
                      className={`w-16 px-2 py-1 text-center border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                        hasLocalChange ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleIncrement(product._id, product.stock)}
                      className="p-1 border border-slate-300 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </td>

                {/* Save action */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {hasLocalChange && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Save}
                      onClick={() => handleSaveStock(product._id)}
                      isLoading={updatingId === product._id}
                    >
                      Save
                    </Button>
                  )}
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
    </div>
  )
}

export default InventoryPage
