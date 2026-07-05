"use client";

import Link from "next/link";
import { X, User, Heart, Settings, LogOut } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useAuth } from "@/context/AuthContext";

export function MobileMenu({ isOpen, onClose }) {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 w-4/5 max-w-sm h-full bg-surface shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <Link href="/" onClick={onClose} className="text-xl font-bold text-primary-600 font-heading">
            Shop Shathi
          </Link>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <SearchBar />
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col space-y-2 px-4">
            <Link href="/products" onClick={onClose} className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100">
              Shop All
            </Link>
            <Link href="/category/electronics" onClick={onClose} className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100">
              Electronics
            </Link>
            <Link href="/category/fashion" onClick={onClose} className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100">
              Fashion
            </Link>
            <Link href="/category/home-kitchen" onClick={onClose} className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100">
              Home & Kitchen
            </Link>
          </nav>

          <div className="mt-8 px-4">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <nav className="flex flex-col space-y-2 pt-4">
                  <Link href="/profile" onClick={onClose} className="flex items-center space-x-3 text-gray-600 py-2">
                    <User className="w-5 h-5" /> <span>My Profile</span>
                  </Link>
                  <Link href="/profile/wishlist" onClick={onClose} className="flex items-center space-x-3 text-gray-600 py-2">
                    <Heart className="w-5 h-5" /> <span>Wishlist</span>
                  </Link>
                  <button onClick={() => { logout(); onClose(); }} className="flex items-center space-x-3 text-error-600 py-2 text-left">
                    <LogOut className="w-5 h-5" /> <span>Logout</span>
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
