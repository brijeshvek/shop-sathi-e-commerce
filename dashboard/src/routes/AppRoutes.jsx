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
import BannersPage from '../pages/banners/BannersPage.jsx'

// Seller pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage.jsx'
import SellerProductsPage from '../pages/seller/SellerProductsPage.jsx'
import SellerOrdersPage from '../pages/seller/SellerOrdersPage.jsx'

import SubCategoriesPage from '../pages/categories/SubCategoriesPage.jsx'
import BrandsPage from '../pages/brands/BrandsPage.jsx'
import AttributesPage from '../pages/products/AttributesPage.jsx'
import ProductReviewsPage from '../pages/products/ProductReviewsPage.jsx'
import ReturnsPage from '../pages/orders/ReturnsPage.jsx'
import RefundsPage from '../pages/orders/RefundsPage.jsx'
import SellersPage from '../pages/seller/SellersPage.jsx'
import InventoryPage from '../pages/inventory/InventoryPage.jsx'
import FlashSalePage from '../pages/marketing/FlashSalePage.jsx'
import OffersPage from '../pages/marketing/OffersPage.jsx'
import BlogsPage from '../pages/cms/BlogsPage.jsx'
import FaqPage from '../pages/cms/FaqPage.jsx'
import CmsPagesPage from '../pages/cms/CmsPagesPage.jsx'
import ReportsPage from '../pages/reports/ReportsPage.jsx'
import FinancePage from '../pages/finance/FinancePage.jsx'
import NotificationsPage from '../pages/notifications/NotificationsPage.jsx'
import SupportPage from '../pages/support/SupportPage.jsx'
import ProfilePage from '../pages/profile/ProfilePage.jsx'

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
            <Route path="/settings" element={<ProfilePage />} />
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
            <Route path="/banners" element={<BannersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/roles" element={<RolePermissionsPage />} />
            <Route path="/sub-categories" element={<SubCategoriesPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/attributes" element={<AttributesPage />} />
            <Route path="/reviews" element={<ProductReviewsPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/refunds" element={<RefundsPage />} />
            <Route path="/sellers" element={<SellersPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/flash-sale" element={<FlashSalePage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/pages" element={<CmsPagesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/profile" element={<ProfilePage />} />

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
