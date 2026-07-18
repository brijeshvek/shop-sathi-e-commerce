"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isAuthenticated && product) {
        try {
          const { data } = await api.get('/wishlist');
          const wishlistProducts = data.data.products || [];
          setIsInWishlist(wishlistProducts.some(p => p._id === product._id));
        } catch (error) {
          console.error("Failed to check wishlist status", error);
        }
      }
    };
    checkWishlistStatus();
  }, [product, isAuthenticated]);

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
    setIsWishlistAnimating(true);
    setTimeout(() => setIsWishlistAnimating(false), 300);
    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/remove/${product._id}`);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await api.post('/wishlist/add', { productId: product._id });
        setIsInWishlist(true);
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="w-full md:w-1/2 space-y-4 pt-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded w-full mt-8"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold dark:text-white">Product not found</h2>
        <Link href="/products" className="text-primary-600 hover:underline mt-4 inline-block">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 dark:text-white">
      <Link href="/products" className="inline-flex items-center text-sm text-gray-500 dark:text-white!-500                                                                                                                                                                                          hover:text-primary-600 dark:hover:text-primary-400 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1 dark:text-white" /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Images */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No Image Available</div>
            )}

            <button
              onClick={handleAddToWishlist}
              className="absolute top-4 right-4 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full shadow-sm hover:text-error-500 transition-all hover:scale-110 active:scale-90"
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 transition-all ${isInWishlist ? 'fill-error-500 text-error-500' : 'text-gray-650 dark:text-gray-300'} ${isWishlistAnimating ? 'animate-wishlist-toggle' : ''}`} />
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

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-heading mb-4">
            {product.name}
          </h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-accent-500">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({product.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.price?.toFixed(2)}</span>
          </div>

          <p className="text-gray-600 dark:text-white text-base mb-8 leading-relaxed">
            {product.description}
          </p>

          {product.features && product.features.length > 0 && (
            <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Key Features & Highlights</h3>
              <ul className="grid grid-cols-1 gap-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                    <span className="mr-3 mt-2 w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg h-12 w-full sm:w-32 bg-white dark:bg-gray-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 dark:text-black hover:text-primary-600 dark:hover:text-primary-400"
              >-</button>
              <span className="flex-1 text-center font-medium dark:text-black">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 text-gray-600 dark:text-black hover:text-primary-600 dark:hover:text-primary-400"
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
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-black">Free Shipping</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">On orders over ₹499</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-black">100% Secure</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Encrypted Checkout</p>
              </div>
            </div>

            {product.returnPolicy && (product.returnPolicy.isReturnable || product.returnPolicy.isExchangeable) ? (
              <>
                {product.returnPolicy.isReturnable && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl col-span-1 sm:col-span-2 md:col-span-1">
                    <RefreshCcw className="w-6 h-6 text-primary-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-black">{product.returnPolicy.returnDays} Days Return Policy</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Hassle-free returns</p>
                    </div>
                  </div>
                )}
                {product.returnPolicy.isExchangeable && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl col-span-1 sm:col-span-2 md:col-span-1">
                    <RefreshCcw className="w-6 h-6 text-primary-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-black">{product.returnPolicy.exchangeDays} Days Exchange</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Easy replacement</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl col-span-1 sm:col-span-2">
                <RefreshCcw className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-black">Non-returnable</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Final sale item</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications & Technical Details */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Specifications & Product Details</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Dynamic Attributes Grid */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Attributes</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(product.attributes).map(([key, value]) => {
                      const formattedKey = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());
                      const displayVal = Array.isArray(value) ? value.join(", ") : String(value);
                      return (
                        <tr key={key} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400 w-1/3">{formattedKey}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-black w-2/3">{displayVal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technical Specifications</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {product.specifications.map((spec, idx) => (
                      <tr key={idx} className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400 w-1/3">{spec.key}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-black w-2/3">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Dimensions, Shipping, & Warranty Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dimensions */}
          {product.dimensions && (product.dimensions.weight || product.dimensions.height) && (
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h4 className="text-md font-semibold text-gray-900 dark:text-black mb-3">Dimensions</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {product.dimensions.weight && <li><strong>Weight:</strong> {product.dimensions.weight} g</li>}
                {product.dimensions.height && (
                  <li><strong>Dimensions (H x W x L):</strong> {product.dimensions.height} x {product.dimensions.width} x {product.dimensions.length} cm</li>
                )}
              </ul>
            </div>
          )}

          {/* Warranty & Shipping */}
          {product.warranty && (
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h4 className="text-md font-semibold text-gray-900 dark:text-black mb-3">Warranty & Shipping</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-900">
                {product.warranty.period && <li><strong>Warranty Period:</strong> {product.warranty.period} ({product.warranty.type})</li>}
                {product.shipping?.deliveryTimeDays && <li><strong>Estimated Delivery:</strong> {product.shipping.deliveryTimeDays} Days</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h3>
        
        {(!product.reviews || product.reviews.length === 0) ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Rating summary */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {product.ratings?.average || 0}
                </span>
                <span className="text-lg text-gray-500">out of 5</span>
              </div>
              <div className="flex items-center text-accent-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= Math.round(product.ratings?.average || 0) ? 'fill-current text-amber-500' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {product.ratings?.count || 0} global ratings
                </span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6 divide-y divide-gray-150 dark:divide-gray-800">
              {product.reviews.map((review, idx) => (
                <div key={idx} className={`${idx > 0 ? 'pt-6' : ''} space-y-2`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-750 flex items-center justify-center font-bold text-sm">
                      {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {review.user?.name || 'Verified User'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-accent-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'fill-current text-amber-500' : 'text-gray-350'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-950 dark:text-white">
                      {review.title}
                    </span>
                  </div>
                  {review.isVerifiedPurchase && (
                    <p className="text-xs font-semibold text-amber-600">Verified Purchase</p>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
