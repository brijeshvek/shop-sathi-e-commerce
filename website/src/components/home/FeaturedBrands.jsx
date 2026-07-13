"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BRANDS = [
  { id: 1, name: "Apple", bg: "bg-balck dark:bg-balck dark:text-white" },
  { id: 2, name: "Samsung", bg: "bg-blue-50 dark:bg-blue-900/20 dark:text-white" },
  { id: 3, name: "Nike", bg: "bg-orange-50 dark:bg-orange-900/20 dark:text-white" },
  { id: 4, name: "Adidas", bg: "bg-slate-100 dark:bg-slate-800 dark:text-white" },
  { id: 5, name: "Sony", bg: "bg-zinc-100 dark:bg-zinc-800 dark:text-white" },
  { id: 6, name: "LG", bg: "bg-red-50 dark:bg-red-900/20 dark:text-white" },
];

export function FeaturedBrands() {
  return (
    <section className="py-8 sm:py-12" aria-label="Featured Brands">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl" aria-hidden="true">💎</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
              Featured Brands
            </h2>
          </div>
          <Link href="/brands" className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {BRANDS.map((brand) => (
            <motion.div
              key={brand.id}
              whileHover={{ y: -5 }}
              className={`group flex items-center justify-center h-24 sm:h-32 rounded-2xl border border-gray-100 dark:border-gray-700 ${brand.bg} cursor-pointer transition-all hover:shadow-md`}
            >
              <Link href={`/products?brand=${brand.name}`} className="w-full h-full flex items-center justify-center p-4 text-center">
                <span className="font-bold text-gray-800 dark:text-white text-lg tracking-wider uppercase group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
