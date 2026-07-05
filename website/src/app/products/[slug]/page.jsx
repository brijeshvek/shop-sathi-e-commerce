"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.data);
      } catch (error) {
        console.error("Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success(`${quantity} ${product.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };
  
  const handleBuyNow = async () => {
    try {
      await addToCart(product, quantity);
      router.push('/checkout');
    } catch (error) {
      toast.error("Failed to process Buy Now");
    }
  };
  
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      await api.post('/wishlist/add', { productId: product._id });
      toast.success("Added to wishlist!");
    } catch (error) {
      toast.error("Failed to add to wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-2xl"></div>
        <div className="w-full md:w-1/2 space-y-4 pt-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded w-full mt-8"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link href="/products" className="text-primary-600 hover:underline mt-4 inline-block">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Images */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImage].url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
            )}
            
            <button onClick={handleAddToWishlist} className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full shadow-sm hover:text-error-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary-600 tracking-wider uppercase">
              {product.category?.name || "Uncategorized"}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-heading mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-accent-500">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5" />
              <span className="ml-2 text-sm text-gray-600">({product.reviews?.length || 0} reviews)</span>
            </div>
          </div>
          
          <div className="mb-8">
            <span className="text-3xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                Out of Stock
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-base mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto border-t border-gray-200 pt-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center border border-gray-300 rounded-lg h-12 w-full sm:w-32 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:text-primary-600"
              >-</button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 text-gray-600 hover:text-primary-600"
              >+</button>
            </div>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:flex-1 h-12 text-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:flex-1 h-12 text-lg"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Truck className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-900">1 Year Warranty</p>
                <p className="text-xs text-gray-500">100% Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
