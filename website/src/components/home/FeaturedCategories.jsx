"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.data || []);
      } catch {
        // Silently fail — categories will remain empty
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900/50 overflow-hidden" aria-label="Loading categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
          <div className="flex space-x-6 pb-4 overflow-x-auto scrollbar-none">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-3 animate-pulse flex-shrink-0" style={{ minWidth: '96px' }}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900/50 overflow-hidden" aria-label="Shop by category">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-bold font-heading text-gray-900 dark:text-white mb-6">Shop by Category</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory" role="list">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products?category=${category._id}`}
              className="group flex flex-col items-center text-center flex-shrink-0 snap-start"
              style={{ minWidth: '96px' }}
              role="listitem"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white shadow-sm mb-3 border border-gray-100 dark:border-gray-800 group-hover:shadow-md group-hover:border-primary-300 transition-all">
                {category.image?.url ? (
                  <Image
                    src={category.image.url}
                    alt={`Shop ${category.name} products`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100" aria-hidden="true">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-white group-hover:text-primary-600 transition-colors truncate max-w-[96px]">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
