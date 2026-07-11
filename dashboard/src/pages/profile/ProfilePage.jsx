import React, { useState, useEffect, useRef } from 'react'
import { UserCog, Mail, Shield, Calendar, Store, Edit2, Lock, Save, Sliders, X, Camera } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useUpdateProfileMutation, useChangePasswordMutation } from '../../features/customers/customersApi.js'
import api from '../../services/api.js'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { formatDate } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'Must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Must confirm password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const sysSettingsSchema = z.object({
  taxRate: z.preprocess((val) => Number(val), z.number().min(0, 'Tax rate must be positive').max(100, 'Tax rate cannot exceed 100')),
  freeShippingThreshold: z.preprocess((val) => Number(val), z.number().min(0, 'Threshold must be positive')),
  shippingCharge: z.preprocess((val) => Number(val), z.number().min(0, 'Shipping charge must be positive')),
})

export const ProfilePage = () => {
  const { user, isAdmin, isSeller } = useAuth()
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'edit', 'security'
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()

  const { register: regProfile, handleSubmit: submitProfile, formState: { errors: profileErrs } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    }
  })

  const { register: regPwd, handleSubmit: submitPwd, reset: resetPwd, formState: { errors: pwdErrs } } = useForm({
    resolver: zodResolver(passwordSchema)
  })

  const { register: regSettings, handleSubmit: submitSettings, reset: resetSettings, formState: { errors: sysErrs } } = useForm({
    resolver: zodResolver(sysSettingsSchema)
  })

  const [settingsLoading, setSettingsLoading] = useState(false)
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)

  useEffect(() => {
    if (activeTab === 'system' && isAdmin) {
      const fetchSettings = async () => {
        setSettingsLoading(true)
        try {
          const res = await api.get('/settings')
          if (res.data?.success) {
            resetSettings({
              taxRate: res.data.data.taxRate,
              freeShippingThreshold: res.data.data.freeShippingThreshold,
              shippingCharge: res.data.data.shippingCharge,
            })
          }
        } catch (err) {
          toast.error('Failed to load system settings')
        } finally {
          setSettingsLoading(false)
        }
      }
      fetchSettings()
    }
  }, [activeTab, isAdmin, resetSettings])

  if (!user) return null

  const handleProfileUpdate = async (data) => {
    try {
      const payload = { id: user._id, name: data.name, phone: data.phone }
      if (user.avatar) payload.avatar = user.avatar
      
      await updateProfile(payload).unwrap()
      toast.success('Profile updated successfully')
      setActiveTab('overview')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile')
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB")
      return
    }

    try {
      setIsUploadingAvatar(true)
      const formData = new FormData()
      formData.append("image", file)

      // Upload to /api/upload/avatar
      const uploadRes = await api.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const { url, publicId } = uploadRes.data.data

      // Update user profile
      await updateProfile({
        id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: { url, publicId }
      }).unwrap()
      
      toast.success("Profile picture updated!")
    } catch (err) {
      toast.error(err?.data?.message || err?.response?.data?.message || "Failed to upload image")
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handlePasswordUpdate = async (data) => {
    try {
      await changePassword({ 
        id: user._id, 
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }).unwrap()
      toast.success('Password changed successfully')
      resetPwd()
      setActiveTab('overview')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password')
    }
  }

  const handleSettingsUpdate = async (data) => {
    setIsUpdatingSettings(true)
    try {
      await api.put('/settings', data)
      toast.success('System settings updated successfully')
    } catch (err) {
      toast.error('Failed to update system settings')
    } finally {
      setIsUpdatingSettings(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account information and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="px-6 pb-6 relative text-center">
              <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center -mt-12 overflow-hidden mb-4 relative z-10 group">
                {user.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors z-30 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Upload profile picture"
                  disabled={isUploadingAvatar}
                >
                  <Camera size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                <p className="text-slate-500 text-sm truncate">{user.email}</p>
              </div>
              
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant={isAdmin ? 'purple' : 'indigo'}>
                  {user.role.toUpperCase()}
                </Badge>
                {user.isBlocked && <Badge variant="red">Blocked</Badge>}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <nav className="flex flex-col p-2 space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <UserCog size={16} className="mr-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'edit' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Edit2 size={16} className="mr-3" />
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Lock size={16} className="mr-3" />
                Security
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('system')}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'system' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Sliders size={16} className="mr-3" />
                  System Settings
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Right Column: Detailed Info / Forms */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('edit')} className="text-indigo-600 hover:bg-indigo-50">
                    <Edit2 size={14} className="mr-1.5" />
                    Edit
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-500 text-sm mb-1">
                      <UserCog size={16} className="mr-2 opacity-70" />
                      Full Name
                    </div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-slate-500 text-sm mb-1">
                      <Mail size={16} className="mr-2 opacity-70" />
                      Email Address
                    </div>
                    <p className="font-medium text-slate-900">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-slate-500 text-sm mb-1">
                      <Shield size={16} className="mr-2 opacity-70" />
                      Account Role
                    </div>
                    <p className="font-medium text-slate-900 capitalize">{user.role}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-slate-500 text-sm mb-1">
                      <Calendar size={16} className="mr-2 opacity-70" />
                      Joined Date
                    </div>
                    <p className="font-medium text-slate-900">{formatDate(user.createdAt, 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>

              {/* Seller Specific Info */}
              {isSeller && user.sellerInfo && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6 animate-fade-in">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">Store Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-500 text-sm mb-1">
                        <Store size={16} className="mr-2 opacity-70" />
                        Store Name
                      </div>
                      <p className="font-medium text-slate-900">{user.sellerInfo.storeName}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-500 text-sm mb-1">
                        <Shield size={16} className="mr-2 opacity-70" />
                        Store Status
                      </div>
                      <Badge variant={user.sellerInfo.isApproved ? 'green' : 'yellow'}>
                        {user.sellerInfo.isApproved ? 'Approved' : 'Pending Approval'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'edit' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">Edit Profile</h3>
              <form onSubmit={submitProfile(handleProfileUpdate)} className="space-y-5 max-w-lg">
                <Input
                  label="Full Name"
                  {...regProfile('name')}
                  error={profileErrs.name}
                />
                
                <Input
                  label="Phone Number"
                  placeholder="e.g. +91 9876543210"
                  {...regProfile('phone')}
                  error={profileErrs.phone}
                />

                {/* Email is typically unchangeable directly here for security */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="block w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Email address cannot be changed from this panel.</p>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('overview')} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isUpdating}>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">Change Password</h3>
              <form onSubmit={submitPwd(handlePasswordUpdate)} className="space-y-5 max-w-lg">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  {...regPwd('currentPassword')}
                  error={pwdErrs.currentPassword}
                />
                
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  {...regPwd('newPassword')}
                  error={pwdErrs.newPassword}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  {...regPwd('confirmPassword')}
                  error={pwdErrs.confirmPassword}
                />

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setActiveTab('overview')} disabled={isChangingPassword}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isChangingPassword}>
                    <Lock size={16} className="mr-2" />
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'system' && isAdmin && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-6">Tax & Shipping Settings</h3>
              {settingsLoading ? (
                <div className="py-10 text-center text-slate-400">Loading settings...</div>
              ) : (
                <form onSubmit={submitSettings(handleSettingsUpdate)} className="space-y-5 max-w-lg">
                  <Input
                    label="GST / Tax Rate (%)"
                    type="number"
                    placeholder="18"
                    error={sysErrs.taxRate}
                    {...regSettings('taxRate')}
                  />
                  
                  <Input
                    label="Free Shipping Minimum Threshold (₹)"
                    type="number"
                    placeholder="499"
                    error={sysErrs.freeShippingThreshold}
                    {...regSettings('freeShippingThreshold')}
                  />

                  <Input
                    label="Default Shipping Charge (₹)"
                    type="number"
                    placeholder="99"
                    error={sysErrs.shippingCharge}
                    {...regSettings('shippingCharge')}
                  />

                  <div className="pt-4 flex gap-3">
                    <Button type="submit" variant="primary" isLoading={isUpdatingSettings}>
                      <Save size={16} className="mr-2" />
                      Save System Settings
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProfilePage
