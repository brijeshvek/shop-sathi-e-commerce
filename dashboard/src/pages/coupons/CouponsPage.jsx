import React, { useState } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { 
  useGetCouponsQuery, useCreateCouponMutation, 
  useUpdateCouponMutation, useToggleCouponStatusMutation, 
  useDeleteCouponMutation 
} from '../../features/coupons/couponsApi.js'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Table from '../../components/common/Table.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatDate } from '../../utils/formatDate.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.preprocess((val) => Number(val), z.number().min(1, 'Discount value must be at least 1')),
  minOrderAmount: z.preprocess((val) => Number(val), z.number().min(0, 'Minimum order amount must be positive')),
  maxDiscount: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().optional()),
  startDate: z.string().min(1, 'Start date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  usageLimit: z.preprocess((val) => Number(val), z.number().min(1, 'Usage limit must be at least 1')),
  applicableCategory: z.string().optional().nullable().transform(v => v === '' ? null : v),
})

export const CouponsPage = () => {
  const { data: couponsRes, isLoading } = useGetCouponsQuery()
  const { data: categoriesRes } = useGetCategoriesQuery()
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation()
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation()
  const [toggleStatus] = useToggleCouponStatusMutation()
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: { discountType: 'percentage', minOrderAmount: 0, usageLimit: 100 }
  })

  const coupons = couponsRes?.data || []
  const categories = categoriesRes?.data || []

  const handleOpenAdd = () => {
    setEditingCoupon(null)
    reset({
      code: '', discountType: 'percentage', discountValue: 0,
      minOrderAmount: 0, maxDiscount: undefined,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      applicableCategory: ''
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon)
    reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit,
      applicableCategory: coupon.applicableCategory || ''
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon._id, ...data }).unwrap()
        toast.success('Coupon updated successfully')
      } else {
        await createCoupon(data).unwrap()
        toast.success('Coupon created successfully')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed.')
    }
  }

  const handleToggle = async (coupon) => {
    try {
      await toggleStatus({ id: coupon._id, isActive: !coupon.isActive }).unwrap()
      toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error('Failed to change coupon status.')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteCoupon(deletingId).unwrap()
      toast.success('Coupon deleted successfully')
      setDeletingId(null)
    } catch (err) {
      toast.error('Failed to delete coupon.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
          <p className="text-slate-500 text-sm mt-1">Manage promotional discount codes and limits</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Create Coupon
        </Button>
      </div>

      {/* Coupons Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table
          columns={['Code', 'Discount', 'Min Order', 'Limit / Usage', 'Duration', 'Status', 'Actions']}
          data={coupons}
          renderRow={(coupon) => (
            <tr key={coupon._id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                {coupon.code}
                {coupon.applicableCategory && (
                  <div className="text-[10px] text-primary-600 font-normal mt-0.5 border border-primary-200 bg-primary-50 px-1.5 py-0.5 rounded-full inline-block">
                    Category Specific
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                {coupon.discountType === 'percentage' 
                  ? `${coupon.discountValue}%` 
                  : formatCurrency(coupon.discountValue)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {formatCurrency(coupon.minOrderAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {coupon.usedCount} / {coupon.usageLimit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                {formatDate(coupon.startDate, 'dd MMM yyyy')} - {formatDate(coupon.expiryDate, 'dd MMM yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleToggle(coupon)} className="focus:outline-none">
                  {coupon.isActive ? (
                    <div className="flex items-center text-green-600 hover:text-green-800 transition-colors">
                      <ToggleRight size={32} />
                      <span className="text-xs font-semibold ml-1">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                      <ToggleLeft size={32} />
                      <span className="text-xs font-semibold ml-1">Inactive</span>
                    </div>
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(coupon)}>
                  <Edit2 size={14} className="text-slate-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeletingId(coupon._id)}>
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </td>
            </tr>
          )}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. FESTIVE50"
            error={errors.code}
            {...register('code')}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
              <select
                {...register('discountType')}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <Input
              label="Discount Value"
              type="number"
              placeholder="e.g. 10"
              error={errors.discountValue}
              {...register('discountValue')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Order Amount (₹)"
              type="number"
              error={errors.minOrderAmount}
              {...register('minOrderAmount')}
            />
            <Input
              label="Max Discount (₹, Optional)"
              type="number"
              placeholder="e.g. 500"
              error={errors.maxDiscount}
              {...register('maxDiscount')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              error={errors.startDate}
              {...register('startDate')}
            />
            <Input
              label="Expiry Date"
              type="date"
              error={errors.expiryDate}
              {...register('expiryDate')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Usage Limit"
              type="number"
              error={errors.usageLimit}
              {...register('usageLimit')}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Applicable Category</label>
              <select
                {...register('applicableCategory')}
                className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">All Categories (Global)</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
              {editingCoupon ? 'Save Changes' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon?"
        message="Are you sure you want to delete this coupon? Users will no longer be able to apply it during checkout."
        isLoading={isDeleting}
      />
    </div>
  )
}

export default CouponsPage
