import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";

// Dynamic imports for below-the-fold sections — code splitting for performance
const FlashSale = dynamic(() =>
  import("@/components/home/FlashSale").then((mod) => ({ default: mod.FlashSale }))
);
const TrendingProducts = dynamic(() =>
  import("@/components/home/TrendingProducts").then((mod) => ({ default: mod.TrendingProducts }))
);
const FeaturedProducts = dynamic(() =>
  import("@/components/home/FeaturedProducts").then((mod) => ({ default: mod.FeaturedProducts }))
);
const BestSellers = dynamic(() =>
  import("@/components/home/BestSellers").then((mod) => ({ default: mod.BestSellers }))
);
const FeaturedBrands = dynamic(() =>
  import("@/components/home/FeaturedBrands").then((mod) => ({ default: mod.FeaturedBrands }))
);
const DealsOffers = dynamic(() =>
  import("@/components/home/DealsOffers").then((mod) => ({ default: mod.DealsOffers }))
);
const RecentlyViewed = dynamic(() =>
  import("@/components/home/RecentlyViewed").then((mod) => ({ default: mod.RecentlyViewed }))
);
const RecommendedProducts = dynamic(() =>
  import("@/components/home/RecommendedProducts").then((mod) => ({ default: mod.RecommendedProducts }))
);
const Testimonials = dynamic(() =>
  import("@/components/home/Testimonials").then((mod) => ({ default: mod.Testimonials }))
);
const Newsletter = dynamic(() =>
  import("@/components/home/Newsletter").then((mod) => ({ default: mod.Newsletter }))
);

// Note: CategoryProductsShowcaseSection is currently disabled to match exact requested layout

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <FeaturedCategories />
      <FlashSale />
      <TrendingProducts />
      <FeaturedProducts />
      <BestSellers />
      <FeaturedBrands />
      <DealsOffers />
      <RecentlyViewed />
      <RecommendedProducts />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
