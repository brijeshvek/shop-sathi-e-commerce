import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, MapPin, Mail, Phone, Calendar } from 'lucide-react'
import { useGetCustomerByIdQuery } from '../../features/customers/customersApi.js'
import Button from '../../components/common/Button.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatDate } from '../../utils/formatDate.js'

export const CustomerDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: userRes, isLoading } = useGetCustomerByIdQuery(id)

  const user = userRes?.data

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Customer not found.</p>
        <Button variant="secondary" onClick={() => navigate('/customers')} className="mt-4">
          Back to Customers
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/customers')}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">Joined on {formatDate(user.createdAt, 'dd MMM yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col items-center justify-center text-center">
            {user.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="w-24 h-24 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-3xl">
                {user.name.charAt(0)}
              </div>
            )}
            <h3 className="text-base font-bold text-slate-900 mt-4">{user.name}</h3>
            <span className="text-xs text-slate-400 capitalize mt-0.5">{user.role}</span>
            <div className="mt-3">
              {user.isBlocked ? (
                <Badge variant="red">Blocked Account</Badge>
              ) : (
                <Badge variant="green">Active Account</Badge>
              )}
            </div>
          </div>

          <div className="space-y-3.5 border-t border-slate-100 pt-5 text-sm">
            <div className="flex items-center space-x-3 text-slate-500">
              <Mail size={16} />
              <span className="text-slate-700 truncate">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-500">
              <Phone size={16} />
              <span className="text-slate-700">{user.phone || 'No phone number'}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-500">
              <Calendar size={16} />
              <span className="text-slate-700">Joined {formatDate(user.createdAt, 'dd MMM yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Address Cards */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <MapPin size={18} className="text-slate-500" />
            <span>Saved Addresses ({user.addresses?.length || 0})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.addresses?.length === 0 ? (
              <p className="col-span-2 text-sm text-slate-400 text-center py-8">No addresses recorded for this account.</p>
            ) : (
              user.addresses?.map((address) => (
                <div key={address._id} className="border border-slate-200 p-4 rounded-xl relative hover:border-slate-300 transition-colors bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-slate-800 text-sm">{address.fullName}</p>
                    {address.isDefault && (
                      <Badge variant="blue" className="text-[10px] scale-90">Default</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{address.phone}</p>
                  <p className="text-xs text-slate-600 mt-3.5 leading-relaxed">
                    {address.street}, {address.city}, {address.state} - {address.pincode}
                  </p>
                  <span className="absolute bottom-3 right-4 text-[9px] font-bold text-slate-300 uppercase tracking-wider">{address.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailPage
