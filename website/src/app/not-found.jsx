import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-9xl font-extrabold text-primary-100 font-heading tracking-tighter">
        404
      </h1>
      <div className="mt-4 max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 font-heading mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto font-medium">
              Return Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Search Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
