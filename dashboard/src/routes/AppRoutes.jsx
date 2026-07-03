import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminRoute from './AdminRoute.jsx'

// Auth
import LoginPage from '../pages/auth/LoginPage.jsx'

// Admin pages
import DashboardPage from '../pages/dashboard/DashboardPage.jsx'
import ProductsPage from '../pages/products/ProductsPage.jsx'
import AddProductPage from '../pages/products/AddProductPage.jsx'
import EditProductPage from '../pages/products/EditProductPage.jsx'
import CategoriesPage from '../pages/categories/CategoriesPage.jsx'
import OrdersPage from '../pages/orders/OrdersPage.jsx'
import OrderDetailPage from '../pages/orders/OrderDetailPage.jsx'
import CustomersPage from '../pages/customers/CustomersPage.jsx'
import CustomerDetailPage from '../pages/customers/CustomerDetailPage.jsx'
import CouponsPage from '../pages/coupons/CouponsPage.jsx'
import AnalyticsPage from '../pages/analytics/AnalyticsPage.jsx'
import RolePermissionsPage from '../pages/roles/RolePermissionsPage.jsx'
import SettingsPage from '../pages/settings/SettingsPage.jsx'

// Seller pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage.jsx'
import SellerProductsPage from '../pages/seller/SellerProductsPage.jsx'
import SellerOrdersPage from '../pages/seller/SellerOrdersPage.jsx'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected — Admin + Seller can access */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Routes are guarded by AdminRoute which handles role-based redirection */}
          <Route element={<AdminRoute />}>
            {/* Shared Routes (accessible by Admin and Seller) */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/edit/:id" element={<EditProductPage />} />

            {/* ── Admin-only Pages ── */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/roles" element={<RolePermissionsPage />} />

            {/* ── Seller-only Pages ── */}
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
          </Route>

        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
