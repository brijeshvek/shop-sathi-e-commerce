import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
