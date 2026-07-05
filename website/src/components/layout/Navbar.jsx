"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { Search, ShoppingCart, Heart, User, Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-primary-600 font-heading tracking-tight">
                Shop Shathi
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-600 hover:text-primary-600 font-medium">
              Shop
            </Link>
            
            {isAuthenticated ? (
              <Link href="/profile/wishlist" className="text-gray-600 hover:text-primary-600">
                <Heart className="w-6 h-6" />
              </Link>
            ) : null}

            <Link href="/cart" className="relative text-gray-600 hover:text-primary-600">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                <User className="w-6 h-6" />
                <span className="text-sm font-medium">{user?.name?.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link href="/cart" className="relative text-gray-600">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600 hover:text-primary-600 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
