import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlashSale } from "@/components/home/FlashSale";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { DealsOffers } from "@/components/home/DealsOffers";
import { CategoryProductsShowcaseSection } from "@/components/home/CategoryProductsShowcaseSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Main Hero Slideshow */}
      <HeroBanner />
      
      {/* 2. Horizontal Categories Scroller */}
      <FeaturedCategories />
      
      {/* 3. Ticking Flash Sale */}
      <FlashSale />
      
      {/* 4. New Arrivals */}
      <FeaturedProducts />
      
      {/* 5. Trending Products */}
      <TrendingProducts />
      
      {/* 6. Categories Showcase (Part 1 + Banner + Part 2) */}
      <CategoryProductsShowcaseSection />
      
      {/* 7. Best Sellers & Brands */}
      <BestSellers />
      
      {/* 8. Hot Deals & Offers */}
      <DealsOffers />
    </div>
  );
}
