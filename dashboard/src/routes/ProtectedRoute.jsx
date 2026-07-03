import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Spinner from '../components/common/Spinner.jsx'

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, isDashboardUser } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !isDashboardUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
