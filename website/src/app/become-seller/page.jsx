"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, ShieldCheck, TrendingUp, Package } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function BecomeSellerPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
  });

  // Redirect if already a seller
  if (user && (user.role === 'seller' || user.role === 'admin' || user.role === 'superadmin')) {
    router.push('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to become a seller.");
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/users/become-seller", formData);
      if (res.data.success) {
        toast.success("Congratulations! You are now a seller.");
        await checkAuth(); // Refresh user data to get new role
        
        // Redirect to admin dashboard
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:5173";
        window.location.href = adminUrl;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register as a seller");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Info */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Store className="w-4 h-4" />
            <span>Join Our Seller Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Start Selling & Grow Your Business
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Reach millions of customers worldwide. Set up your store in minutes and start selling today with our powerful tools.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm text-primary-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Reach More Customers</h3>
                <p className="text-sm text-gray-500">Access our vast user base and increase your sales.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm text-primary-500">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Easy Management</h3>
                <p className="text-sm text-gray-500">Manage products, inventory, and orders effortlessly.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm text-primary-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Secure Payments</h3>
                <p className="text-sm text-gray-500">Guaranteed safe and timely payouts for all your sales.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Register Your Store</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g., Tech Gadgets Pro"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us what you sell..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors duration-200 shadow-md shadow-primary-500/30 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Register & Open Store</span>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By registering, you agree to our Seller Terms and Conditions.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
