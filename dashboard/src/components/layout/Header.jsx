import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { useTranslation } from 'react-i18next'
import api from '../../services/api.js'
import toast from 'react-hot-toast'
import { User, ChevronDown, UserCheck, Menu, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

export const Header = ({ onMenuClick }) => {
  const { user } = useAuth()
  const { i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    try {
      i18n.changeLanguage(newLang);
      if (user) {
        await api.patch(`/users/${user._id}/language`, { language: newLang });
        toast.success("Language updated");
      }
    } catch (error) {
      toast.error("Failed to update language on server");
    }
  }

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

      {/* Language & Admin Info */}
      <div className="flex items-center space-x-4">
        <select 
          value={i18n.language}
          onChange={handleLanguageChange}
          className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="gu">GU</option>
        </select>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg focus:outline-none"
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

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
      </div>
    </header>
  )
}

export default Header
