import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";

// Dynamic imports for below-the-fold sections — code splitting for performance
const FlashSale = dynamic(() =>
  import("@/components/home/FlashSale").then((mod) => ({ default: mod.FlashSale }))
);
const FeaturedProducts = dynamic(() =>
  import("@/components/home/FeaturedProducts").then((mod) => ({ default: mod.FeaturedProducts }))
);
const TrendingProducts = dynamic(() =>
  import("@/components/home/TrendingProducts").then((mod) => ({ default: mod.TrendingProducts }))
);
const BestSellers = dynamic(() =>
  import("@/components/home/BestSellers").then((mod) => ({ default: mod.BestSellers }))
);
const DealsOffers = dynamic(() =>
  import("@/components/home/DealsOffers").then((mod) => ({ default: mod.DealsOffers }))
);
const CategoryProductsShowcaseSection = dynamic(() =>
  import("@/components/home/CategoryProductsShowcaseSection").then(
    (mod) => ({ default: mod.CategoryProductsShowcaseSection })
  )
);

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
