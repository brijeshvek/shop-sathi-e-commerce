"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Sort by ratings.count to get most bought/reviewed trending items
        const { data } = await api.get('/products?sort=ratings.count&limit=4');
        setProducts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="bg-gray-200 dark:bg-gray-800 aspect-[4/5] rounded-xl"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-850">
      <div className="flex justify-between items-end mb-5 sm:mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl">🔥</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
            Trending Products
          </h2>
        </div>
        <Link href="/products?sort=ratings.count" className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap">
          View All &rarr;
        </Link>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } }
        }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        {products.map((product) => (
          <motion.div 
            key={product._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="group flex flex-col bg-surface rounded-xl overflow-hidden hover-lift border border-gray-100 dark:border-gray-800"
          >
            <Link href={`/products/${product.slug || product._id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </Link>
            
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{product.brand}</span>
                <span className="flex items-center text-amber-500">
                  <Star className="w-3 h-3 fill-current mr-0.5" />
                  {product.ratings?.average?.toFixed(1) || '0.0'}
                </span>
              </div>
              <Link href={`/products/${product.slug || product._id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-primary-650 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base text-primary-600">₹{product.price?.toFixed(2)}</span>
                <button 
                  onClick={(e) => handleAddToCart(product, e)}
                  className="text-white bg-gray-900 hover:bg-primary-655 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  aria-label="Add to cart"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
