import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, ShoppingBag, Layers, FileText,
  Users, Ticket, BarChart2, Settings, LogOut, ShoppingCart, Store, UserCog, Megaphone,
  ChevronDown, ChevronRight, BookOpen, PieChart, DollarSign, Bell, HelpCircle
} from 'lucide-react'
import { useLogoutMutation } from '../../features/auth/authApi.js'
import { useDispatch } from 'react-redux'
import { logOut } from '../../features/auth/authSlice.js'
import { useAuth } from '../../hooks/useAuth.js'

const ADMIN_NAV = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  {
    name: 'Catalog',
    icon: Layers,
    subItems: [
      { name: 'Products', path: '/products' },
      { name: 'Categories', path: '/categories' },
      { name: 'Sub Categories', path: '/sub-categories' },
      { name: 'Brands', path: '/brands' },
      { name: 'Attributes', path: '/attributes' },
      { name: 'Product Reviews', path: '/reviews' },
    ]
  },
  {
    name: 'Orders',
    icon: FileText,
    subItems: [
      { name: 'Orders', path: '/orders' },
      { name: 'Returns', path: '/returns' },
      { name: 'Refunds', path: '/refunds' },
    ]
  },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Sellers', path: '/sellers', icon: Store },
  { name: 'Inventory', path: '/inventory', icon: ShoppingCart },
  {
    name: 'Marketing',
    icon: Megaphone,
    subItems: [
      { name: 'Coupons', path: '/coupons' },
      { name: 'Flash Sale', path: '/flash-sale' },
      { name: 'Banner', path: '/banners' },
      { name: 'Offers', path: '/offers' },
    ]
  },
  {
    name: 'CMS',
    icon: BookOpen,
    subItems: [
      { name: 'Blogs', path: '/blogs' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Pages', path: '/pages' },
    ]
  },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Reports', path: '/reports', icon: PieChart },
  { name: 'Finance', path: '/finance', icon: DollarSign },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Support', path: '/support', icon: HelpCircle },
  { name: 'Profile', path: '/profile', icon: UserCog },
  { name: 'Settings', path: '/settings', icon: Settings },
]

const SELLER_NAV = [
  { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
  { name: 'My Products', path: '/seller/products', icon: ShoppingBag },
  { name: 'My Orders', path: '/seller/orders', icon: FileText },
  { name: 'Inventory', path: '/inventory', icon: ShoppingCart },
  {
    name: 'Marketing',
    icon: Megaphone,
    subItems: [
      { name: 'Flash Sale', path: '/flash-sale' },
      { name: 'Offers', path: '/offers' },
    ]
  },
  { name: 'Product Reviews', path: '/reviews', icon: Layers },
  { name: 'Refunds', path: '/refunds', icon: FileText },
  { name: 'Finance', path: '/finance', icon: DollarSign },
  { name: 'Support', path: '/support', icon: HelpCircle },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [logoutApi] = useLogoutMutation()
  const { isAdmin, isSeller, user, permissions, permissionsLoading } = useAuth()

  const [expandedMenus, setExpandedMenus] = useState(() => {
    const initial = {}
    ADMIN_NAV.forEach(item => {
      if (item.subItems) {
        if (item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`))) {
          initial[item.name] = true
        }
      }
    })
    return initial
  })

  useEffect(() => {
    // Automatically expand the menu if a sub-item becomes active via navigation
    ADMIN_NAV.forEach(item => {
      if (item.subItems) {
        if (item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`))) {
          setExpandedMenus(prev => ({ ...prev, [item.name]: true }))
        }
      }
    })
  }, [location.pathname])

  const toggleMenu = (name) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }))
  }

  let navItems = []
  if (isAdmin) {
    navItems = ADMIN_NAV
  } else if (isSeller) {
    navItems = SELLER_NAV.filter(item => {
      if (permissions) {
        if (item.path && item.path.includes('/products')) return permissions.canViewProducts
        if (item.path && item.path.includes('/orders')) return permissions.canViewOrders
      }
      return true
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
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3 shrink-0">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-0.5 overflow-hidden shadow-sm">
          <img src="/icon.png" alt="ShopShathi Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-white font-bold text-lg tracking-wide truncate">{brandName}</span>
      </div>

      {/* Role Badge */}
      {isSeller && (
        <div className="mx-4 mt-3 px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg shrink-0">
          <p className="text-violet-300 text-xs font-semibold text-center">🏪 Seller Account</p>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
        {isSeller && permissionsLoading
          ? <p className="p-4 text-xs text-slate-400">Loading menu...</p>
          : navItems.map((item) => {
            const Icon = item.icon

            if (item.subItems) {
              const isExpanded = expandedMenus[item.name]
              // Check if any child is active
              const isAnyChildActive = item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`))

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-slate-800/50 hover:text-white ${isExpanded || isAnyChildActive ? 'bg-slate-800/30 text-white' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={18} className={isAnyChildActive ? 'text-indigo-400' : ''} />
                      <span className={isAnyChildActive ? 'text-white font-semibold' : ''}>{t(`nav.${item.name.toLowerCase()}`)}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="pl-11 pr-2 space-y-1 mt-1">
                      {item.subItems.map(subItem => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => setIsOpen && setIsOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-md text-sm transition-all ${isActive
                              ? isSeller
                                ? 'text-violet-400 font-semibold bg-violet-500/10'
                                : 'text-indigo-400 font-semibold bg-indigo-500/10'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`
                          }
                        >
                          {t(`nav.${subItem.name.toLowerCase()}`)}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
 
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
                      : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                <span>{t(`nav.${item.name.toLowerCase()}`)}</span>
              </NavLink>
            )
          })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2 shrink-0 bg-slate-900">
        {user && (
          <div className="px-4 py-2 rounded-lg bg-slate-800/50">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all space-x-3"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
