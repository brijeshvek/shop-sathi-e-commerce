import React from 'react'
import Spinner from './Spinner.jsx'

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed',
    secondary: 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 disabled:bg-red-300 disabled:cursor-not-allowed',
    ghost: 'hover:bg-slate-100 text-slate-600 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2 !border-t-white !border-slate-300" />}
      {!isLoading && Icon && <Icon size={16} className="mr-2" />}
      {children}
    </button>
  )
}

export default Button
