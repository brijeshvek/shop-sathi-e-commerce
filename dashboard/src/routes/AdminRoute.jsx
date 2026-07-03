import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

// Guard: only admin/superadmin can access these routes
// Sellers hitting admin-only routes get redirected to /seller
export const AdminRoute = () => {
  const { isAdmin, isSeller } = useAuth()
  const { pathname } = useLocation()

  if (isAdmin) {
    // If admin lands on a seller-specific route, redirect them to the admin equivalent.
    if (pathname.startsWith('/seller')) {
      return <Navigate to={pathname.replace('/seller', '') || '/'} replace />
    }
    return <Outlet /> // Admin can access all nested routes.
  }

  if (isSeller) {
    // If seller tries to access a non-seller route, redirect to their dashboard.
    // Allow access to their own routes, shared routes, and product management routes.
    const isAllowed = pathname.startsWith('/seller') ||
      ['/settings', '/products/add'].includes(pathname) ||
      pathname.startsWith('/products/edit');
    if (isAllowed) {
      return <Outlet />
    }
    return <Navigate to="/seller" replace />
  }

  return <Navigate to="/login" replace /> // Should not be reached if ProtectedRoute is working
}

export default AdminRoute
