import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Save, ShieldAlert, Sliders } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth.js'
import { useUpdateProfileMutation, useChangePasswordMutation } from '../../features/customers/customersApi.js'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../features/auth/authSlice.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import api from '../../services/api.js'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().or(z.literal('')),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword']
})

const settingsSchema = z.object({
  taxRate: z.preprocess((val) => Number(val), z.number().min(0, 'Tax rate must be positive').max(100, 'Tax rate cannot exceed 100')),
  freeShippingThreshold: z.preprocess((val) => Number(val), z.number().min(0, 'Threshold must be positive')),
  shippingCharge: z.preprocess((val) => Number(val), z.number().min(0, 'Shipping charge must be positive')),
})

export const SettingsPage = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('profile')

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation()

  const [settingsLoading, setSettingsLoading] = useState(false)
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false)

  // Form 1: Profile
  const { register: regProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: errProfile } } = useForm({
    resolver: zodResolver(profileSchema)
  })

  // Form 2: Password
  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: errPassword } } = useForm({
    resolver: zodResolver(passwordSchema)
  })

  // Form 3: Business Settings
  const { register: regSettings, handleSubmit: handleSettingsSubmit, reset: resetSettings, formState: { errors: errSettings } } = useForm({
    resolver: zodResolver(settingsSchema)
  })

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        phone: user.phone || '',
      })
    }
  }, [user, resetProfile])

  useEffect(() => {
    if (activeTab === 'settings') {
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
          toast.error('Failed to load business settings')
        } finally {
          setSettingsLoading(false)
        }
      }
      fetchSettings()
    }
  }, [activeTab, resetSettings])

  const onProfileSubmit = async (data) => {
    try {
      const res = await updateProfile({ id: user._id, ...data }).unwrap()
      dispatch(setCredentials(res.data))
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile.')
    }
  }

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword({ id: user._id, ...data }).unwrap()
      toast.success('Password changed successfully!')
      resetPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password.')
    }
  }

  const onSettingsSubmit = async (data) => {
    setIsUpdatingSettings(true)
    try {
      await api.put('/settings', data)
      toast.success('Business settings updated successfully!')
    } catch (err) {
      toast.error('Failed to update business settings')
    } finally {
      setIsUpdatingSettings(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure profile settings, passwords, and tax properties</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all focus:outline-none ${
            activeTab === 'profile'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <User size={16} />
          <span>Admin Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all focus:outline-none ${
            activeTab === 'password'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Lock size={16} />
          <span>Security & Password</span>
        </button>
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all focus:outline-none ${
              activeTab === 'settings'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sliders size={16} />
            <span>Tax & Shipping Settings</span>
          </button>
        )}
      </div>

      {/* Form sections */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Edit Profile Info</h3>
            
            <Input
              label="Full Name"
              error={errProfile.name}
              {...regProfile('name')}
            />

            <Input
              label="Contact Phone"
              placeholder="e.g. 9876543210"
              error={errProfile.phone}
              {...regProfile('phone')}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Account Email (Immutable)</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="block w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg text-sm cursor-not-allowed focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" icon={Save} isLoading={isUpdating} className="pt-2">
              Save Profile
            </Button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Update Access Password</h3>
            
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              error={errPassword.currentPassword}
              {...regPassword('currentPassword')}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errPassword.newPassword}
              {...regPassword('newPassword')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={errPassword.confirmPassword}
              {...regPassword('confirmPassword')}
            />

            <Button type="submit" variant="primary" icon={Save} isLoading={isChanging} className="pt-2">
              Update Password
            </Button>
          </form>
        )}

        {activeTab === 'settings' && (
          settingsLoading ? (
            <div className="py-10 text-center text-slate-400">Loading settings...</div>
          ) : (
            <form onSubmit={handleSettingsSubmit(onSettingsSubmit)} className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Tax & Shipping Settings</h3>
              
              <Input
                label="GST / Tax Rate (%)"
                type="number"
                placeholder="18"
                error={errSettings.taxRate}
                {...regSettings('taxRate')}
              />

              <Input
                label="Free Shipping Minimum Threshold (₹)"
                type="number"
                placeholder="499"
                error={errSettings.freeShippingThreshold}
                {...regSettings('freeShippingThreshold')}
              />

              <Input
                label="Default Shipping Charge (₹)"
                type="number"
                placeholder="99"
                error={errSettings.shippingCharge}
                {...regSettings('shippingCharge')}
              />

              <Button type="submit" variant="primary" icon={Save} isLoading={isUpdatingSettings} className="pt-2">
                Save Business Settings
              </Button>
            </form>
          )
        )}
      </div>
    </div>
  )
}

export default SettingsPage
