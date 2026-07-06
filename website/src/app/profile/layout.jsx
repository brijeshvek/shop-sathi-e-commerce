"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common/Spinner";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { name: "Profile Info", href: "/profile", icon: User },
    { name: "My Orders", href: "/profile/orders", icon: Package },
    { name: "Addresses", href: "/profile/addresses", icon: MapPin },
    { name: "Wishlist", href: "/profile/wishlist", icon: Heart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
            {/* User overview */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{user?.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
