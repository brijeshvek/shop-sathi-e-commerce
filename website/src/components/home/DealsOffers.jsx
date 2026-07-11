"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function DealsOffers() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Fetch products sorted by discount descending
        const { data } = await api.get('/products?sort=discount&limit=4');
        setProducts(data.data?.filter(p => p.discount > 0) || []);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
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

  if (isLoading) {
    return (
      <section className="py-12" aria-busy="true" aria-label="Loading deals">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="bg-gray-200 dark:bg-gray-800 aspect-[4/5] rounded-xl"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12" aria-label="Deals and offers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-5 sm:mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl" aria-hidden="true">💥</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
            Deals &amp; Offers
          </h2>
        </div>
        <Link href="/products?sort=discount" className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap">
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
            className="group relative flex flex-col h-full bg-surface rounded-xl overflow-hidden hover-lift border border-gray-100 dark:border-gray-800"
          >
            {/* Tag */}
            {product.discount > 0 && (
              <div className="absolute top-3 left-3 z-10 bg-accent-500 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" aria-hidden="true" />
                <span>SAVE {product.discount}%</span>
              </div>
            )}

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
              <span className="text-xs font-semibold text-gray-500 mb-1">{product.brand}</span>
              <Link href={`/products/${product.slug || product._id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-primary-650 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-sm sm:text-lg text-primary-600">₹{product.price?.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice?.toFixed(2)}</span>
                  )}
                </div>
                <button 
                  onClick={(e) => handleAddToCart(product, e)}
                  className="text-white bg-gray-900 hover:bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
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
