"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

const slides = [
  {
    id: 1,
    title: "Summer Collection 2026",
    subtitle: "Up to 50% off on all new arrivals",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    link: "/category/fashion"
  },
  {
    id: 2,
    title: "Smart Home Tech",
    subtitle: "Upgrade your living space today",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    link: "/category/electronics"
  },
  {
    id: 3,
    title: "Fresh & Organic",
    subtitle: "Farm fresh groceries delivered to you",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    link: "/category/grocery"
  }
];

export function HeroBanner() {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-3xl">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-white font-heading tracking-tight drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="mt-4 text-xl md:text-2xl text-gray-200 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <div className="mt-8">
                    <Link href={slide.link}>
                      <Button size="lg" className="px-8 py-3 text-lg rounded-full">
                        Shop Now
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
