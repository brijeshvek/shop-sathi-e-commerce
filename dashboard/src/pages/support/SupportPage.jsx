import React, { useState } from 'react'
import { LifeBuoy, Search, AlertCircle, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  useGetTicketsQuery, useUpdateTicketStatusMutation, useAddTicketReplyMutation
} from '../../features/support/supportApi.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import Button from '../../components/common/Button.jsx'
import Table from '../../components/common/Table.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatDate } from '../../utils/formatDate.js'

export const SupportPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('') // 'Open', 'In Progress', 'Resolved'
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')

  const debouncedSearch = useDebounce(search, 400)

  const { data: ticketsRes, isLoading, refetch } = useGetTicketsQuery({
    page,
    limit: 15,
    status: statusFilter || undefined,
    search: debouncedSearch || undefined
  })

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateTicketStatusMutation()
  const [addReply, { isLoading: isSubmittingReply }] = useAddTicketReplyMutation()

  const tickets = ticketsRes?.data || []
  const pagination = ticketsRes?.pagination || { currentPage: 1, totalPages: 1 }

  // Quick stats calculations
  const openCount = tickets.filter(t => t.status === 'Open').length
  const progressCount = tickets.filter(t => t.status === 'In Progress').length
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket)
    setReplyMessage('')
  }

  const handleUpdateStatus = async (ticketId, nextStatus) => {
    try {
      const res = await updateStatus({ id: ticketId, status: nextStatus }).unwrap()
      toast.success(`Ticket marked as ${nextStatus}`)
      setSelectedTicket(res.data)
      refetch()
    } catch (err) {
      toast.error('Failed to update ticket status.')
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    try {
      const res = await addReply({ id: selectedTicket._id, message: replyMessage.trim() }).unwrap()
      toast.success('Reply sent successfully!')
      setReplyMessage('')
      setSelectedTicket(res.data)
      refetch()
    } catch (err) {
      toast.error('Failed to send reply.')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-700 border border-rose-100'
      case 'Medium': return 'bg-amber-50 text-amber-700 border border-amber-100'
      default: return 'bg-slate-50 text-slate-700 border border-slate-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <LifeBuoy className="text-indigo-650" />
          Customer Support Tickets
        </h1>
        <p className="text-slate-500 text-sm mt-1">Review customer issues, respond to tickets, and track resolution health.</p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-650 rounded-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Tickets</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{openCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Progress</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{progressCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolved</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === ''
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Tickets
          </button>
          <button
            onClick={() => setStatusFilter('Open')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === 'Open'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Open ({openCount})
          </button>
          <button
            onClick={() => setStatusFilter('In Progress')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === 'In Progress'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            In Progress ({progressCount})
          </button>
          <button
            onClick={() => setStatusFilter('Resolved')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === 'Resolved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by ticket ID or subject..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <Table
          columns={['Ticket ID', 'Customer', 'Subject', 'Category', 'Priority', 'Status', 'Last Updated', 'Actions']}
          data={tickets}
          isLoading={isLoading}
          emptyMessage="No tickets found matching your query."
          renderRow={(t) => (
            <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-indigo-650">
                {t.ticketId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                <div>
                  <p className="font-medium text-slate-900">{t.user?.name || 'Customer'}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{t.user?.email || 'N/A'}</p>
                </div>
              </td>
              <td className="px-6 py-4 max-w-[200px] truncate text-sm text-slate-800 font-semibold" title={t.subject}>
                {t.subject}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                {t.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(t.priority)}`}>
                  {t.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={t.status === 'Open' ? 'red' : t.status === 'In Progress' ? 'yellow' : 'green'}>
                  {t.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                {formatDate(t.updatedAt, 'dd MMM yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Button variant="secondary" size="sm" onClick={() => handleSelectTicket(t)}>
                  Respond
                </Button>
              </td>
            </tr>
          )}
        />

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

      {/* Ticket Details Panel / Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{selectedTicket.ticketId}</span>
                  <Badge variant={selectedTicket.status === 'Open' ? 'red' : selectedTicket.status === 'In Progress' ? 'yellow' : 'green'}>
                    {selectedTicket.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5 max-w-[400px] truncate" title={selectedTicket.subject}>
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-650 text-sm font-semibold border border-slate-200 rounded px-2.5 py-1 hover:bg-slate-100 transition-all"
              >
                Close
              </button>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4">
              {/* Initial message from customer */}
              <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold text-slate-700">{selectedTicket.user?.name || 'Customer'}</span>
                  <span>{formatDate(selectedTicket.createdAt, 'dd MMM yyyy HH:mm')}</span>
                </div>
                <p className="text-slate-800 text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {/* Replies */}
              {selectedTicket.replies?.map((reply, idx) => {
                const isSupport = reply.sender === 'Support Agent'
                return (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-4 rounded-lg border ${
                      isSupport
                        ? 'ml-auto bg-indigo-50 border-indigo-100 text-indigo-950'
                        : 'mr-auto bg-white border-slate-200 text-slate-850'
                    }`}
                  >
                    <div className="flex justify-between items-center text-2xs text-slate-400 mb-1.5 gap-4">
                      <span className={`font-bold ${isSupport ? 'text-indigo-650' : 'text-slate-700'}`}>
                        {reply.sender}
                      </span>
                      <span>{formatDate(reply.createdAt, 'dd MMM yyyy HH:mm')}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                  </div>
                )
              })}
            </div>

            {/* Actions Panel */}
            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Change Status:</span>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket._id, 'In Progress')}
                  className="px-2.5 py-1 text-2xs font-bold rounded bg-amber-50 text-amber-700 border border-amber-250 hover:bg-amber-100 transition-colors"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket._id, 'Resolved')}
                  className="px-2.5 py-1 text-2xs font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100 transition-colors"
                >
                  Resolve Issue
                </button>
              </div>

              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type support response..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-350 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <Button variant="primary" type="submit" icon={Send} isLoading={isSubmittingReply}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupportPage
