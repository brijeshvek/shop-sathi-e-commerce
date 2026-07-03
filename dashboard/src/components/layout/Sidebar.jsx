import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Layers, FileText,
  Users, Ticket, BarChart2, Settings, LogOut, ShoppingCart, Store, UserCog
} from 'lucide-react'
import { useLogoutMutation } from '../../features/auth/authApi.js'
import { useDispatch } from 'react-redux'
import { logOut } from '../../features/auth/authSlice.js'
import { useAuth } from '../../hooks/useAuth.js'

const ADMIN_NAV = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: ShoppingBag },
  { name: 'Categories', path: '/categories', icon: Layers },
  { name: 'Orders', path: '/orders', icon: FileText },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Coupons', path: '/coupons', icon: Ticket },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Role Permissions', path: '/roles', icon: UserCog },
  { name: 'Settings', path: '/settings', icon: Settings },
]

const SELLER_NAV = [
  { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
  { name: 'My Products', path: '/seller/products', icon: ShoppingBag },
  { name: 'My Orders', path: '/seller/orders', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutApi] = useLogoutMutation()
  const { isAdmin, isSeller, user, permissions, permissionsLoading } = useAuth()

  let navItems = []
  if (isAdmin) {
    navItems = ADMIN_NAV
  } else if (isSeller && permissions) {
    // Filter seller nav items based on permissions
    navItems = SELLER_NAV.filter(item => {
      if (item.path.includes('/products')) return permissions.canViewProducts
      if (item.path.includes('/orders')) return permissions.canViewOrders
      return true // for Dashboard, Settings etc.
    })
  }

  const brandName = isSeller ? (user?.sellerInfo?.storeName || 'Seller Panel') : 'ShopShathi'

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
      dispatch(logOut())
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-0.5 overflow-hidden shadow-sm">
          <img src="/icon.png" alt="ShopShathi Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-white font-bold text-lg tracking-wide truncate">{brandName}</span>
      </div>

      {/* Role Badge */}
      {isSeller && (
        <div className="mx-4 mt-3 px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg">
          <p className="text-violet-300 text-xs font-semibold text-center">🏪 Seller Account</p>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {isSeller && permissionsLoading
          ? <p className="p-4 text-xs text-slate-400">Loading menu...</p>
          : navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                end={item.path === '/' || item.path === '/seller'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all space-x-3 ${isActive
                    ? isSeller
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'bg-slate-800 text-white shadow-sm'
                    : 'hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        {user && (
          <div className="px-4 py-2 rounded-lg bg-slate-800/50">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-all space-x-3"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
