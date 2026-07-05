"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data.data.products || []);
    } catch (error) {
      console.error("Failed to fetch wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      setWishlist(wishlist.filter(p => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      ))}
    </div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <HeartIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your wishlist is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Save items you love to your wishlist to buy them later.</p>
        <div className="mt-6">
          <Link href="/products">
            <Button>Discover Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover-lift bg-white dark:bg-gray-800">
            <div className="relative aspect-square">
              {product.images?.[0] ? (
                <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <button 
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-error-500 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h3>
              <p className="mt-1 font-bold text-primary-600">${product.price?.toFixed(2)}</p>
              <Link href={`/products/${product.slug || product._id}`} className="block mt-4">
                <Button variant="outline" className="w-full h-9">View Product</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeartIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
