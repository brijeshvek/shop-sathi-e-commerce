"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export function CategoryProductsShowcase({ category, limit = 4 }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const { data } = await api.get(`/products?category=${category._id}&limit=${limit}`);
        setProducts(data.data || []);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    if (category?._id) {
      fetchCategoryProducts();
    }
  }, [category, limit]);

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
      <div className="py-8" aria-busy="true">
        <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex flex-col space-y-4">
              <div className="bg-gray-200 dark:bg-gray-800 aspect-[4/5] rounded-xl"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl md:text-2xl font-bold font-heading text-gray-900 dark:text-white">
          {category.name}
        </h3>
        <Link href={`/products?category=${category._id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          View All &rarr;
        </Link>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <motion.div 
            key={product._id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col bg-surface rounded-xl overflow-hidden hover-lift border border-gray-100 dark:border-gray-800"
          >
            <Link href={`/products/${product.slug || product._id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
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
            <div className="p-4 flex flex-col flex-grow">
              <Link href={`/products/${product.slug || product._id}`}>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-primary-600 transition-colors">
                  {product.name}
                </h4>
              </Link>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="font-bold text-base text-primary-600">₹{product.price?.toFixed(2)}</span>
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
  );
}
