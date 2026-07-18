"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { useTranslation } from "react-i18next";

export function FeaturedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products?limit=4");
        setProducts(data.data || []);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12" aria-busy="true" aria-label="Loading new arrivals">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 dark:text-white mb-8">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-4">
                <div className="bg-gray-200 dark:bg-gray-800 aspect-[4/5] rounded-xl"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12" aria-label="New arrivals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 dark:text-white">
            {t('home.new_arrivals')}
          </h2>
          <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium hidden sm:block">
            {t('home.view_all')} &rarr;
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col h-full bg-surface rounded-xl overflow-hidden hover-lift border border-gray-100 dark:border-gray-800"
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
              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-gray-500 mb-1">{product.category?.name || "Product"}</div>
                <Link href={`/products/${product.slug || product._id}`}>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-lg text-primary-600">₹{product.price?.toFixed(2)}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-white bg-gray-900 hover:bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <svg className="w-4 h-4 dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="inline-block text-primary-600 font-medium py-2 px-4 border border-primary-200 rounded-full">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
