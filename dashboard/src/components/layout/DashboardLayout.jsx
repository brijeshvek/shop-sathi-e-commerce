import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import { useAutoLogout } from '../../hooks/useAutoLogout.js'

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Activate auto logout (10 mins default)
  useAutoLogout()
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main content pane */}
      <div className="flex-1 flex flex-col w-full lg:pl-64 transition-all duration-300">
        {/* Sticky Header */}
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Content outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
