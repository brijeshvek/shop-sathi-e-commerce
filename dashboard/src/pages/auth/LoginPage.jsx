import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ShoppingCart, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLoginMutation } from '../../features/auth/authApi.js'
import { setCredentials } from '../../features/auth/authSlice.js'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginApi, { isLoading }] = useLoginMutation()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data).unwrap()
      const role = res.data?.role
      if (res.success && (role === 'admin' || role === 'superadmin' || role === 'seller')) {
        dispatch(setCredentials(res.data))
        toast.success(`Welcome back, ${role === 'seller' ? 'Seller' : 'Admin'}!`)
        navigate('/')
      } else {
        toast.error('Access denied. Admin or Seller role required.')
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-40 h-40 flex items-center justify-center">
          <img src="/icon.png" alt="ShopShathi Logo" className="w-full h-full object-contain drop-shadow-sm" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ShopShathi</h2>
        <p className="text-sm text-slate-500 mt-1.5">Sign in to manage your e-commerce platform</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@shopease.com"
            error={errors.email}
            {...register('email')}
          />
        </div>

        <div className="relative">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>
    </div>
  )
}

export default LoginPage
