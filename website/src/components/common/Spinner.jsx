import React from 'react'

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`} role="status">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-md animate-pulse"></div>
      
      {/* Outer rotating ring */}
      <svg className="animate-spin w-full h-full text-primary-600" viewBox="0 0 50 50">
        <circle
          className="opacity-10"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M25 5c-11.046 0-20 8.954-20 20s8.954 20 20 20v-4c-8.837 0-16-7.163-16-16s7.163-16 16-16V5z"
        />
      </svg>
      
      {/* Inner counter-rotating shape */}
      <div className="absolute inset-2.5 rounded-full border-2 border-dashed border-primary-400/50 animate-[spin_3s_linear_infinite_reverse]"></div>
      
      {/* Center core */}
      <div className="absolute w-2 h-2 rounded-full bg-primary-600 animate-ping"></div>
      
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner
