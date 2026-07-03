import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { User, ChevronDown, UserCheck, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Header = ({ onMenuClick }) => {
  const { user } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg focus:outline-none"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Phone Logo */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-0.5 shadow-sm">
            <img src="/icon.png" alt="ShopShathi" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-slate-900 tracking-wide text-lg">ShopShathi</span>
        </div>

        {/* Breadcrumb Info */}
        <div className="hidden sm:flex items-center space-x-2 text-slate-500 text-sm">
          <span className="font-medium text-slate-800">Admin Dashboard</span>
          <span>/</span>
          <span className="capitalize">{window.location.pathname.split('/')[1] || 'Overview'}</span>
        </div>
      </div>

      {/* Admin Info Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-3 hover:bg-slate-50 p-2 rounded-lg transition-colors focus:outline-none"
        >
          {user?.avatar?.url ? (
            <img src={user.avatar.url} alt="Admin Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500">
              <User size={16} />
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role || 'administrator'}</p>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40">
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 space-x-2"
              >
                <UserCheck size={14} />
                <span>Profile Settings</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
