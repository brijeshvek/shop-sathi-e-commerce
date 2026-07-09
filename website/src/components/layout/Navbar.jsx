"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { ShoppingCart, Heart, User, Menu, ShoppingBag, ChevronDown, LayoutDashboard, LogOut, MapPin, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { MobileMenu } from "./MobileMenu";
import api from "@/lib/axios";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "/admin";

export function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const categoriesRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (itemCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  useEffect(() => {
    api.get("/categories")
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  // Keyboard support for dropdowns
  const handleCategoriesKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsCategoriesDropdownOpen(prev => !prev);
    } else if (e.key === 'Escape') {
      setIsCategoriesDropdownOpen(false);
    }
  }, []);

  const handleProfileKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsProfileDropdownOpen(prev => !prev);
    } else if (e.key === 'Escape') {
      setIsProfileDropdownOpen(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-sm transition-all duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Customer Location */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg" aria-hidden="true">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-primary-600 font-heading tracking-tight">
                Shop Shathi
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-1.5 text-xs text-gray-500 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900">
                <MapPin className="w-3.5 h-3.5 text-gray-450" aria-hidden="true" />
                <span className="font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                  {user?.addresses?.length > 0
                    ? (() => {
                        const addr = user.addresses.find(a => a.isDefault) || user.addresses[0];
                        return `${addr.city}, ${addr.pincode}`;
                      })()
                    : "Add Address"}
                </span>
              </div>
            ) : (
              <Link 
                href="/login"
                className="hidden lg:flex items-center space-x-1.5 text-xs text-gray-500 border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all dark:border-gray-800 rounded-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-gray-450" aria-hidden="true" />
                <span className="font-semibold truncate max-w-[120px]">
                  Select Location
                </span>
              </Link>
            )}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary-600 font-semibold transition-colors duration-150">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              ref={categoriesRef}
              onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
              onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
            >
              <button 
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded py-2"
                aria-expanded={isCategoriesDropdownOpen}
                aria-haspopup="true"
                onKeyDown={handleCategoriesKeyDown}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              
              {isCategoriesDropdownOpen && (
                <div className="absolute left-0 mt-0 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50 animate-dropdown-open" role="menu">
                  <Link 
                    href="/products"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    role="menuitem"
                  >
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${cat._id}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      role="menuitem"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && (
              <Link href="/profile/wishlist" className="text-gray-600 hover:text-primary-600 relative" aria-label="Wishlist">
                <Heart className="w-6 h-6" />
              </Link>
            )}

            <Link href="/cart" className="relative text-gray-600 hover:text-primary-600" aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}>
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className={`absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${animateCart ? 'animate-cart-bounce' : ''}`} aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div 
                className="relative"
                ref={profileRef}
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <button 
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded py-2"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                  onKeyDown={handleProfileKeyDown}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center font-bold text-primary-750 text-xs" aria-hidden="true">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-0 w-60 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-2 z-50 animate-dropdown-open" role="menu">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link 
                      href="/profile"
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      role="menuitem"
                    >
                      <User className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      <span>My Profile</span>
                    </Link>

                    <Link 
                      href="/profile/orders"
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      role="menuitem"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      <span>My Orders</span>
                    </Link>

                    <Link 
                      href="/profile/wishlist"
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      role="menuitem"
                    >
                      <Heart className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      <span>Wishlist</span>
                    </Link>

                    {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'seller') && (
                      <a 
                        href={ADMIN_URL}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 font-medium"
                        role="menuitem"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary-600" aria-hidden="true" />
                        <span>{user?.role === 'seller' ? 'Seller Dashboard' : 'Admin Dashboard'}</span>
                      </a>
                    )}

                    {user?.role === 'customer' && (
                      <Link 
                        href="/become-seller"
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 font-medium"
                        role="menuitem"
                      >
                        <Store className="w-4 h-4 text-primary-600" aria-hidden="true" />
                        <span>Become a Seller</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1.5"></div>

                    <button
                      onClick={() => {
                        api.post('/auth/logout').then(() => {
                          localStorage.removeItem('accessToken');
                          window.location.href = '/login';
                        });
                      }}
                      className="flex w-full items-center space-x-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-left font-medium border-none bg-transparent cursor-pointer"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4 text-red-600" aria-hidden="true" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link href="/cart" className="relative text-gray-600" aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}>
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className={`absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${animateCart ? 'animate-cart-bounce' : ''}`} aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
