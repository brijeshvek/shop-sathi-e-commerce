"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // In a real app we'd fetch categories, here we might mock a few top ones
    // if the endpoint doesn't specifically have a 'featured' flag.
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        // Take the first 6 parent categories
        setCategories(data.data?.slice(0, 6) || []);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold font-heading text-center text-gray-900 dark:text-white mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/category/${category.slug}`} className="group flex flex-col items-center text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white shadow-sm mb-4 border border-gray-100 dark:border-gray-800 group-hover:shadow-md group-hover:border-primary-300 transition-all">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
