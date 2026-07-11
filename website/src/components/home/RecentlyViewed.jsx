"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";

export function RecentlyViewed() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        // Mock implementation: Try to get from local storage or fallback to latest products
        const stored = localStorage.getItem("recentlyViewed");
        let productIds = stored ? JSON.parse(stored) : [];

        if (productIds.length > 0) {
          // In a real app we would fetch these specific IDs
          // const { data } = await api.get(`/products?ids=${productIds.join(',')}`);
          const { data } = await api.get('/products?limit=4'); // fallback for demo
          setProducts(data.data || []);
        } else {
          // Fallback to demo items if empty
          const { data } = await api.get('/products?sort=-createdAt&limit=4');
          setProducts(data.data || []);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentlyViewed();
  }, []);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (isLoading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12" aria-label="Recently Viewed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-5 sm:mb-8">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
              Recently Viewed
            </h2>
          </div>
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
          {products.slice(0, 4).map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="group flex flex-col h-full bg-surface rounded-xl overflow-hidden hover-lift border border-gray-100 dark:border-gray-800"
            >
              <Link href={`/products/${product.slug || product._id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400" aria-hidden="true">No Image</div>
                )}
              </Link>

              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
                  <span>{product.brand}</span>
                  <span className="flex items-center text-amber-500" aria-label={`Rating ${product.ratings?.average?.toFixed(1) || '0.0'} out of 5`}>
                    <Star className="w-3 h-3 fill-current mr-0.5" aria-hidden="true" />
                    {product.ratings?.average?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <Link href={`/products/${product.slug || product._id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-primary-650 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-lg text-primary-600">₹{product.price?.toFixed(2)}</span>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="text-white bg-gray-900 hover:bg-primary-650 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
