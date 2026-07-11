import React, { useState } from 'react'
import { Eye, Search, FileDown, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetAllOrdersQuery } from '../../features/orders/ordersApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatDate } from '../../utils/formatDate.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const ReturnsPage = () => {
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  // Fetch only orders that have returned items
  const { data: returnsRes, isLoading } = useGetAllOrdersQuery({
    page, limit: 10,
    search: debouncedSearch || undefined,
    hasReturns: 'true'
  })

  const orders = returnsRes?.data || []
  const pagination = returnsRes?.pagination || { currentPage: 1, totalPages: 1 }

  // Extract the return items for display from each order
  const getReturnedItems = (order) => {
    return order.items?.filter(i => ['requested', 'approved', 'completed', 'rejected'].includes(i.returnStatus)) || []
  }

  const getStatusVariant = (returnStatus) => {
    switch (returnStatus) {
      case 'completed': return 'green'
      case 'rejected': return 'red'
      case 'requested': return 'yellow'
      case 'approved': return 'blue'
      default: return 'gray'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Returns</h1>
          <p className="text-slate-500 text-sm mt-1">Manage customer return requests</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search return orders..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Returns Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center py-16 text-slate-400">
          <RefreshCcw size={40} className="mb-3 opacity-50" />
          <p className="text-base font-semibold text-slate-700">No returns found</p>
          <p className="text-sm mt-1">There are currently no return requests to process.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Table
            columns={['Order #', 'Customer', 'Returned Item', 'Return Reason', 'Status', 'Request Date', 'Actions']}
            data={orders}
            renderRow={(order) => {
              const returnedItems = getReturnedItems(order)
              // We render one row per returned item in the order for clarity
              return returnedItems.map((item, idx) => (
                <tr key={`${order._id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900">
                    #{order.orderNumber || order._id.substring(18).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-800">{order.user?.name || 'Guest'}</div>
                    <div className="text-xs text-slate-400">{order.user?.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 max-w-[200px]">
                      {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />}
                      <span className="text-sm font-medium text-slate-900 truncate" title={item.name}>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">
                    {item.returnReason || 'No reason provided'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(item.returnStatus)}>
                      {item.returnStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {item.returnRequestDate ? formatDate(item.returnRequestDate, 'dd MMM yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${order._id}`)}>
                      <Eye size={14} className="text-indigo-600" />
                    </Button>
                  </td>
                </tr>
              ))
            }}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}

export default ReturnsPage
