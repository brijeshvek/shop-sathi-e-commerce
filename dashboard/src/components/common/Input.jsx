import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type

  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={currentType}
          ref={ref}
          className={`block w-full px-3 py-2 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 ${
            isPassword ? 'pr-10' : ''
          } ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-slate-900'
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">
          {error.message || error}
        </p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
