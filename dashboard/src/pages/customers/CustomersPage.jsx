import React, { useState } from 'react'
import { Eye, Search, ShieldAlert, ShieldCheck } from 'lucide-react'
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

export const CustomersPage = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 400)

  const { data: usersRes, isLoading } = useGetAllCustomersQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  })

  const [blockCustomer, { isLoading: isBlocking }] = useBlockCustomerMutation()

  const users = usersRes?.data || []
  const pagination = usersRes?.pagination || { currentPage: 1, totalPages: 1 }

  const handleBlockToggle = async (user) => {
    try {
      await blockCustomer({ id: user._id, isBlocked: !user.isBlocked }).unwrap()
      toast.success(`User ${!user.isBlocked ? 'blocked' : 'unblocked'} successfully`)
    } catch (err) {
      toast.error('Failed to change user status.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <p className="text-slate-500 text-sm mt-1">View user account profiles and toggle block status</p>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          <Table
            columns={['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined Date', 'Actions']}
            data={users}
            renderRow={(user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {user.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {user.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={user.role === 'customer' ? 'blue' : 'purple'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isBlocked ? (
                    <Badge variant="red">Blocked</Badge>
                  ) : (
                    <Badge variant="green">Active</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {formatDate(user.createdAt, 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/customers/${user._id}`)}>
                    <Eye size={14} className="text-slate-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleBlockToggle(user)}
                    className={user.isBlocked ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}
                  >
                    {user.isBlocked ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
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

export default CustomersPage
