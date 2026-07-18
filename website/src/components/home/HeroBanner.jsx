"use client";

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import api from '@/lib/axios';
import { useTranslation } from 'react-i18next';

const DEFAULT_SLIDES = [
  {
    _id: "default-1",
    title: "Summer Collection 2026",
    subtitle: "Up to 50% off on all new arrivals",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    link: "/products"
  },
  {
    _id: "default-2",
    title: "Smart Home Tech",
    subtitle: "Upgrade your living space today",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    link: "/products"
  },
  {
    _id: "default-3",
    title: "Fresh & Organic",
    subtitle: "Farm fresh groceries delivered to you",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    link: "/products"
  }
];

export function HeroBanner() {
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const { data } = await api.get('/banners?activeOnly=true&type=hero');
        if (data.data && data.data.length > 0) {
          setSlides(data.data);
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      } catch {
        setSlides(DEFAULT_SLIDES);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroBanners();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <span className="text-gray-400 font-semibold">Loading slideshow...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] overflow-hidden" role="region" aria-label="Hero banner slideshow">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                quality={80}
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-3xl">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight drop-shadow-md">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-md dark:text-gray-500">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="mt-6 sm:mt-8">
                    <Link href={slide.link || '/products'}>
                      <Button size="lg" className="px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all">
                        {t('home.shop_now')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
