import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      
      {/* Promo Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading">
              Welcome to Shop Shathi
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Discover a world of products tailored just for you. From fashion to electronics, find everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto font-medium">Shop Now</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/20 font-medium">
                  Join Shop Shathi Today
                </Button>
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
