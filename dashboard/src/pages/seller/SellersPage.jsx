import React, { useState } from 'react'
import { Eye, Search, ShieldAlert, ShieldCheck, Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  useGetAllCustomersQuery, useBlockCustomerMutation 
} from '../../features/customers/customersApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatDate } from '../../utils/formatDate.js'

export const SellersPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 400)

  // We reuse the same query but pass role: 'seller'
  const { data: usersRes, isLoading } = useGetAllCustomersQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    role: 'seller'
  })

  const [blockCustomer, { isLoading: isBlocking }] = useBlockCustomerMutation()

  const sellers = usersRes?.data || []
  const pagination = usersRes?.pagination || { currentPage: 1, totalPages: 1 }

  const handleBlockToggle = async (seller) => {
    try {
      await blockCustomer({ id: seller._id, isBlocked: !seller.isBlocked }).unwrap()
      toast.success(`Seller ${!seller.isBlocked ? 'blocked' : 'unblocked'} successfully`)
    } catch (err) {
      toast.error('Failed to change seller status.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sellers</h1>
        <p className="text-slate-500 text-sm mt-1">Manage registered sellers, stores, and their status</p>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search sellers by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Sellers Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <Table
            columns={['Seller', 'Store Details', 'Status', 'Joined Date', 'Actions']}
            data={sellers}
            renderRow={(seller) => (
              <tr key={seller._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {seller.avatar?.url ? (
                      <img src={seller.avatar.url} alt={seller.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                        {seller.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">{seller.name}</span>
                      <span className="text-xs text-slate-500">{seller.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Store size={14} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">{seller.sellerInfo?.storeName || 'Unknown Store'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {seller.isBlocked ? (
                    <Badge variant="red">Blocked</Badge>
                  ) : (
                    <Badge variant="green">Active</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {formatDate(seller.createdAt, 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/customers/${seller._id}`)}>
                    <Eye size={14} className="text-slate-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleBlockToggle(seller)}
                    className={seller.isBlocked ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}
                  >
                    {seller.isBlocked ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
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
    </div>
  )
}

export default SellersPage
