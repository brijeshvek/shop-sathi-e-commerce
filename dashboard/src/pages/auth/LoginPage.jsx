import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ShoppingCart, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLoginMutation, useVerifyOtpMutation } from '../../features/auth/authApi.js'
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
  const [verifyOtpApi, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtpApi, { isLoading: isResending }] = useResendOtpMutation()

  const [otpRequired, setOtpRequired] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  const [timer, setTimer] = useState(15)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let interval
    if (otpRequired && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [otpRequired, timer])

  const handleResendOtp = async () => {
    if (!canResend) return
    setCanResend(false)
    setTimer(15)
    try {
      await resendOtpApi({ email }).unwrap()
      toast.success('Verification OTP code resent successfully!')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to resend verification code.')
      setCanResend(true)
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const handleLoginSuccess = (res) => {
    const role = res.data?.role
    if (role === 'admin' || role === 'superadmin' || role === 'seller') {
      if (res.data.token) {
        localStorage.setItem('accessToken', res.data.token)
      }
      dispatch(setCredentials(res.data))
      toast.success(`Welcome back, ${role === 'seller' ? 'Seller' : 'Admin'}!`)
      navigate('/')
    } else {
      toast.error('Access denied. Admin or Seller role required.')
    }
  }

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data).unwrap()
      if (res.data?.otpRequired) {
        setEmail(data.email)
        setOtpRequired(true)
        setTimer(15)
        setCanResend(false)
        toast.success('Verification code sent to your email!')
      } else {
        handleLoginSuccess(res)
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed. Please try again.')
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }
    try {
      const res = await verifyOtpApi({ email, otp }).unwrap()
      handleLoginSuccess(res)
    } catch (err) {
      toast.error(err?.data?.message || 'OTP verification failed. Please try again.')
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

      {otpRequired ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center text-sm text-slate-650 bg-slate-50 border border-slate-100 rounded-xl p-3 mb-2 leading-relaxed">
            We have sent a 6-digit verification code to <span className="font-semibold text-slate-900">{email}</span>.
          </div>
          <div className="relative">
            <Input
              label="OTP Code"
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isVerifying}
          >
            Verify & Sign In
          </Button>
          <div className="flex flex-col items-center justify-center space-y-3 mt-4 text-sm text-center">
            <div>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 underline focus:outline-none"
                  disabled={isResending}
                >
                  {isResending ? 'Resending...' : 'Resend OTP Code'}
                </button>
              ) : (
                <span className="text-slate-400 font-medium">
                  Resend code in {timer}s
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOtpRequired(false)}
              className="text-slate-500 hover:text-slate-700 font-medium transition-colors focus:outline-none"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      ) : (
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
      )}
    </div>
  )
}

export default LoginPage
