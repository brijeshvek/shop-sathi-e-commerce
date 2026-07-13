import React, { useState } from 'react'
import { Tag, Search, Save, Percent, PlusCircle, Trash2, Edit } from 'lucide-react'
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
import { formatCurrency } from '../../utils/formatCurrency.js'

export const OffersPage = () => {
  const { isSeller } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState('discounted') // 'all', 'discounted'
  const [editingId, setEditingId] = useState(null)
  
  // Edit Form State
  const [origPrice, setOrigPrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [discPct, setDiscPct] = useState(0)

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

  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation()

  const startEdit = (product) => {
    setEditingId(product._id)
    const oPrice = product.originalPrice || product.price || 0
    const sPrice = product.price || 0
    const pct = product.discount || 0
    
    setOrigPrice(oPrice)
    setSalePrice(sPrice)
    setDiscPct(pct)
  }

  const handleSalePriceChange = (val) => {
    const sPrice = Math.max(0, parseFloat(val) || 0)
    setSalePrice(sPrice)
    if (origPrice > 0) {
      const pct = Math.round(((origPrice - sPrice) / origPrice) * 100)
      setDiscPct(Math.max(0, Math.min(100, pct)))
    }
  }

  const handleDiscountChange = (val) => {
    const pct = Math.max(0, Math.min(100, parseInt(val, 10) || 0))
    setDiscPct(pct)
    if (origPrice > 0) {
      const sPrice = origPrice - (origPrice * (pct / 100))
      setSalePrice(Math.round(sPrice * 100) / 100)
    }
  }

  const handleSaveOffer = async (productId) => {
    if (salePrice > origPrice) {
      return toast.error("Sale price cannot be greater than original price")
    }
    try {
      await updateProduct({
        id: productId,
        originalPrice: origPrice,
        price: salePrice,
        discount: discPct,
        discountType: discPct > 0 ? 'Percentage' : 'None',
        discountValue: discPct
      }).unwrap()
      toast.success('Product discount updated successfully!')
      setEditingId(null)
    } catch (err) {
      toast.error('Failed to update offer.')
    }
  }

  const handleRemoveOffer = async (product) => {
    const defaultPrice = product.originalPrice || product.price
    try {
      await updateProduct({
        id: product._id,
        originalPrice: defaultPrice,
        price: defaultPrice,
        discount: 0,
        discountType: 'None',
        discountValue: 0
      }).unwrap()
      toast.success('Discount removed successfully!')
    } catch (err) {
      toast.error('Failed to remove discount.')
    }
  }

  // Filter products by active offers (discount > 0)
  const filteredProducts = products.filter(product => {
    if (filterActive === 'discounted') return product.discount > 0
    return true
  })

  const totalOffersCount = products.filter(p => p.discount > 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Tag className="text-indigo-600" />
          General Offers & Discounts
        </h1>
        <p className="text-slate-500 text-sm mt-1">Apply regular promotional discounts to standard catalog products.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-650 rounded-lg">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Products with Active Offers</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalOffersCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterActive('discounted')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterActive === 'discounted'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Discounted Products ({totalOffersCount})
          </button>
          <button
            onClick={() => setFilterActive('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterActive === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Products
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={['Product Details', 'Original Price', 'Offer Price', 'Discount %', 'Promo Status', 'Actions']}
          data={filteredProducts}
          isLoading={isLoading}
          emptyMessage="No offers found matching search."
          renderRow={(product) => {
            const isEditing = editingId === product._id
            const productImg = product.images?.[0]?.url || 'https://via.placeholder.com/150'
            const hasPromo = product.discount > 0

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
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{product.sku || 'No SKU'}</p>
                    </div>
                  </div>
                </td>

                {/* Original Price */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {isEditing ? (
                    <input
                      type="number"
                      value={origPrice}
                      onChange={(e) => setOrigPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-24 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 text-sm"
                    />
                  ) : (
                    formatCurrency(product.originalPrice || product.price)
                  )}
                </td>

                {/* Offer Price */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                  {isEditing ? (
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => handleSalePriceChange(e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 text-sm"
                    />
                  ) : (
                    <span className={hasPromo ? 'text-indigo-650 font-bold' : ''}>
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </td>

                {/* Discount % */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discPct}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 text-sm text-center font-bold text-indigo-650"
                      />
                      <Percent size={14} className="text-slate-400" />
                    </div>
                  ) : hasPromo ? (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {product.discount}% OFF
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>

                {/* Promo Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={hasPromo ? 'blue' : 'gray'}>
                    {hasPromo ? 'Offer Applied' : 'No Promo'}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Save}
                        onClick={() => handleSaveOffer(product._id)}
                        isLoading={isSaving}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {!hasPromo ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={PlusCircle}
                          onClick={() => startEdit(product)}
                        >
                          Apply Offer
                        </Button>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(product)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Offer"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveOffer(product)}
                            className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove Offer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
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

export default OffersPage
