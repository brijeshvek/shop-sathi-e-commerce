"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { motion } from "framer-motion";
import api from '@/lib/axios';

const DEFAULT_OFFER = {
  title: "Monsoon Special Mega Sale! 🌧️",
  subtitle: "Get flat 20% OFF on all items. Use code MONSOON20 at checkout.",
  image: "",
  link: "/products",
  bannerType: "offer",
  discountCode: "MONSOON20"
};

export function OfferBanner() {
  const [offer, setOffer] = useState(DEFAULT_OFFER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferBanner = async () => {
      try {
        const { data } = await api.get('/banners?activeOnly=true');
        const promoBanners = data.data?.filter(b => b.bannerType === 'coupon' || b.bannerType === 'offer') || [];
        if (promoBanners.length > 0) {
          setOffer(promoBanners[0]); // use the latest active promotional banner
        }
      } catch (error) {
        console.error("Failed to fetch promotional banners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferBanner();
  }, []);

  if (loading) {
    return (
      <div className="my-16 h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
        <span className="text-gray-400 font-semibold">Loading promotions...</span>
      </div>
    );
  }

  // Custom styled background if an image is provided
  const bgStyle = offer.image 
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.55)), url(${offer.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  const gradientClass = offer.image 
    ? "" 
    : offer.bannerType === 'coupon'
      ? "bg-gradient-to-r from-emerald-600 to-teal-700"
      : "bg-gradient-to-r from-primary-600 to-indigo-700";

  return (
    <section 
      style={bgStyle}
      className={`my-16 relative overflow-hidden rounded-2xl text-white shadow-xl ${gradientClass}`}
    >
      {!offer.image && (
        <div className="absolute inset-0 bg-white/5 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}></div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative max-w-4xl mx-auto px-6 py-12 md:py-16 text-center space-y-6"
      >
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider animate-pulse ${
            offer.bannerType === 'coupon' ? 'bg-amber-400 text-gray-900' : 'bg-accent-500 text-gray-900'
          }`}
        >
          {offer.bannerType === 'coupon' ? 'Coupon Campaign' : 'Special Offer'}
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-black font-heading tracking-tight"
        >
          {offer.title}
        </motion.h2>
        
        {offer.subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-gray-100 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {offer.subtitle}
          </motion.p>
        )}
        
        {offer.discountCode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="inline-block px-4 py-2 bg-white/20 rounded-xl font-mono text-lg font-bold border border-white/25 backdrop-blur-xs text-amber-300"
          >
            Use Code: {offer.discountCode}
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-4 flex justify-center"
        >
          <Link href={offer.link || '/products'}>
            <Button size="lg" className="px-8 font-bold bg-white text-primary-650 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer">
              Claim Offer
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
