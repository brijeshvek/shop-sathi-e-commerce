"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

export function FlashSale() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 18 });

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        const { data } = await api.get('/products?sort=discount&limit=4');
        setProducts(data.data || []);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlashSaleProducts();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer to 8 hours
          return { hours: 8, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
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

  const formatTime = (num) => String(num).padStart(2, '0');

  if (isLoading) {
    return (
      <section className="py-12 bg-rose-50/30 dark:bg-rose-950/10 border-y border-rose-100/50 dark:border-rose-950/20" aria-busy="true" aria-label="Loading flash sale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-8"></div>
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
    <section className="py-8 sm:py-12 bg-rose-50/20 dark:bg-rose-950/5 border-y border-rose-100/30 dark:border-rose-950/10" aria-label="Flash sale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Countdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xl sm:text-2xl" aria-hidden="true">⚡</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-gray-900 dark:text-white">
              Flash Sale
            </h2>
          </div>
          
          {/* Ticking Clock — no animate-pulse for accessibility */}
          <div className="flex items-center space-x-2 bg-rose-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md font-mono text-xs sm:text-sm font-bold" role="timer" aria-live="polite" aria-label={`Flash sale ends in ${timeLeft.hours} hours ${timeLeft.minutes} minutes ${timeLeft.seconds} seconds`}>
            <Timer className="w-4 h-4" aria-hidden="true" />
            <span>Ends In:</span>
            <span>{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>

        {/* Product Grid */}
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
              className="group relative flex flex-col bg-surface rounded-xl overflow-hidden hover-lift border border-rose-100/40 dark:border-rose-900/10"
            >
              {/* Discount Tag */}
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {product.discount}% OFF
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
                <span className="text-xs font-semibold text-rose-600 mb-1">{product.brand}</span>
                <Link href={`/products/${product.slug || product._id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-rose-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-lg text-rose-650">₹{product.price?.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{product.originalPrice?.toFixed(2)}</span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="text-white bg-rose-600 hover:bg-rose-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
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
