"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { X, User, Heart, LogOut, ShoppingBag, LayoutDashboard } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "/admin";

export function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated, logout, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      api.get("/categories")
        .then(({ data }) => setCategories(data.data || []))
        .catch(() => {});
    }
  }, [isOpen]);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when menu opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Trap focus within menu
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const menu = menuRef.current;
      if (!menu) return;

      const focusable = menu.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white dark:bg-gray-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <Link href="/" onClick={onClose} className="flex items-center space-x-2 text-xl font-bold text-primary-600 font-heading">
            <img src="/logo.png" alt="Shop Shathi Logo" className="h-8 w-8 object-contain" />
            <span>Shop Shathi</span>
          </Link>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded p-1"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <SearchBar onSearchComplete={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col space-y-2 px-4" aria-label="Mobile navigation">
            <Link href="/" onClick={onClose} className="text-lg font-semibold text-gray-800 dark:text-white py-2 border-b border-gray-100 dark:border-gray-800">
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                onClick={onClose}
                className="text-lg font-medium text-gray-650 dark:text-gray-300 py-2 border-b border-gray-100 dark:border-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 px-4">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <nav className="flex flex-col space-y-2 pt-4" aria-label="User account navigation">
                  <Link href="/profile" onClick={onClose} className="flex items-center space-x-3 text-gray-650 dark:text-gray-300 py-2">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-300" aria-hidden="true" /> <span>My Profile</span>
                  </Link>
                  <Link href="/profile/orders" onClick={onClose} className="flex items-center space-x-3 text-gray-650 dark:text-gray-300 py-2">
                    <ShoppingBag className="w-5 h-5 text-gray-400 dark:text-gray-300" aria-hidden="true" /> <span>My Orders</span>
                  </Link>
                  <Link href="/profile/wishlist" onClick={onClose} className="flex items-center space-x-3 text-gray-650 dark:text-gray-300 py-2">
                    <Heart className="w-5 h-5 text-gray-400 dark:text-gray-300" aria-hidden="true" /> <span>Wishlist</span>
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'seller') && (
                    <a 
                      href={ADMIN_URL}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="flex items-center space-x-3 text-primary-600 font-semibold py-2"
                    >
                      <LayoutDashboard className="w-5 h-5 text-primary-650" aria-hidden="true" /> <span>Admin Dashboard</span>
                    </a>
                  )}
                  <button 
                    onClick={() => { 
                      logout(); 
                      localStorage.removeItem('accessToken');
                      onClose(); 
                    }} 
                    className="flex items-center space-x-3 text-red-600 py-2 text-left font-medium border-none bg-transparent cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 text-red-650" aria-hidden="true" /> <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full text-center bg-primary-600 text-white font-semibold py-2 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="w-full text-center bg-gray-100 text-gray-800 font-semibold py-2 rounded-lg"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
