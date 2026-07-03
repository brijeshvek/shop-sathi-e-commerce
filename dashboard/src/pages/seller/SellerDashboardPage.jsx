import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, ShoppingCart, TrendingUp, Clock,
  ArrowRight, Plus, BarChart2, Star
} from 'lucide-react'
import { useGetSellerAnalyticsQuery, useGetSellerProductsQuery, useGetSellerOrdersQuery } from '../../features/seller/sellerApi.js'
import { useAuth } from '../../hooks/useAuth.js'
import Spinner from '../../components/common/Spinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDate } from '../../utils/formatDate.js'

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
)

export const SellerDashboardPage = () => {
  const { user } = useAuth()
  const { data: analyticsRes, isLoading: analyticsLoading } = useGetSellerAnalyticsQuery()
  const { data: productsRes, isLoading: productsLoading } = useGetSellerProductsQuery({ page: 1, limit: 5 })
  const { data: ordersRes, isLoading: ordersLoading } = useGetSellerOrdersQuery({ page: 1, limit: 5 })

  const stats = analyticsRes?.data
  const products = productsRes?.data || []
  const orders = ordersRes?.data || []

  const storeName = user?.sellerInfo?.storeName || user?.name || 'My Store'

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl font-bold">{storeName} 🏪</h1>
            <p className="text-violet-200 mt-2 text-sm">
              {user?.sellerInfo?.description || 'Manage your store, products, and orders from here.'}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center">
              <BarChart2 size={40} className="text-white" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            to="/products/add"
            className="flex items-center gap-2 bg-white text-violet-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors"
          >
            <Plus size={16} />
            Add Product
          </Link>
          <Link
            to="/seller/orders"
            className="flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            View Orders
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {analyticsLoading ? (
        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={stats ? formatCurrency(stats.totalRevenue) : '₹0'}
            color="bg-green-500"
            sub="From all your orders"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={stats?.totalOrders ?? 0}
            color="bg-blue-500"
            sub="Orders with your products"
          />
          <StatCard
            icon={Package}
            label="Active Products"
            value={stats?.totalProducts ?? 0}
            color="bg-violet-500"
            sub="Listed in catalog"
          />
          <StatCard
            icon={Clock}
            label="Pending Orders"
            value={stats?.pendingOrders ?? 0}
            color="bg-orange-500"
            sub="Awaiting processing"
          />
        </div>
      )}

      {/* Recent Products & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 text-base">My Products</h2>
            <Link to="/seller/products" className="text-violet-600 text-xs font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {productsLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Package size={32} className="mb-2" />
              <p className="text-sm">No products yet</p>
              <Link to="/products/add" className="mt-3 text-xs text-violet-600 font-semibold hover:underline">Add your first product →</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-slate-400" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.category?.name} • Stock: {product.stock}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(product.price)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 text-base">Recent Orders</h2>
            <Link to="/seller/orders" className="text-violet-600 text-xs font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <ShoppingCart size={32} className="mb-2" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {orders.map((order) => (
                <div key={order._id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    order.status === 'delivered' ? 'bg-green-500' :
                    order.status === 'processing' ? 'bg-blue-500' :
                    order.status === 'cancelled' ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-400">{order.user?.name} • {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(order.totalAmount)}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerDashboardPage
