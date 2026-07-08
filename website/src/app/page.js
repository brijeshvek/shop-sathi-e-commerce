import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryProductsShowcaseSection } from "@/components/home/CategoryProductsShowcaseSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      <CategoryProductsShowcaseSection />
    </div>
  );
}
