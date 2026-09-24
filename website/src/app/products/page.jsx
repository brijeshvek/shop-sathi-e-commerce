"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Filter, X } from "lucide-react";
import { Spinner } from "@/components/common/Spinner";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const observerTarget = useRef(null);

  // Filters state
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [search, setSearch] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [brands, setBrands] = useState([]);
  const [collectionName, setCollectionName] = useState(searchParams.get("collectionName") || "");

  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  // When filters change, reset pagination
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [category, search, minPrice, maxPrice, sort, selectedBrand, collectionName]);

  // Load next pages
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, false);
    }
  }, [page]);

  // Intersection Observer to trigger next page
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || isLoading || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoading, isFetchingNextPage]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setSelectedBrand(searchParams.get("brand") || "");
    setCollectionName(searchParams.get("collectionName") || "");
  }, [searchParams]);

  useEffect(() => {
    if (category) {
      fetchBrands(category);
    } else {
      setBrands([]);
    }
  }, [category]);

  const fetchBrands = async (catId) => {
    try {
      const { data } = await api.get(`/products/brands/distinct?category=${catId}`);
      setBrands(data.data || []);
    } catch (error) {
      console.error("Failed to fetch brands");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchProducts = async (pageNum = 1, shouldReset = false) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingNextPage(true);
    }

    try {
      let sortField = "createdAt";
      let order = "desc";

      if (sort === "price_asc") {
        sortField = "price";
        order = "asc";
      } else if (sort === "price_desc") {
        sortField = "price";
        order = "desc";
      }

      let url = `/products?sort=${sortField}&order=${order}&limit=12&page=${pageNum}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (selectedBrand) url += `&brand=${encodeURIComponent(selectedBrand)}`;
      if (collectionName) url += `&collectionName=${encodeURIComponent(collectionName)}`;

      const { data } = await api.get(url);
      const newProducts = data.data || [];

      if (shouldReset || pageNum === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const filteredNew = newProducts.filter((p) => !existingIds.has(p._id));
          return [...prev, ...filteredNew];
        });
      }

      if (newProducts.length < 12) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  const clearFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("category");
    params.delete("search");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("brand");
    params.delete("collectionName");
    router.push(`/products?${params.toString()}`);
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-heading">Shop All</h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className={`fixed inset-0 z-50 bg-white md:bg-transparent md:static md:block md:w-64 flex-shrink-0 p-4 md:p-0 transition-transform transform ${isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-8 h-full overflow-y-auto md:overflow-visible pb-20 md:pb-0">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.delete("category");
                      params.delete("brand");
                      router.push(`/products?${params.toString()}`);
                    }}
                    className={`text-sm ${category === "" ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map(c => {
                  const isActiveMain = category === c._id || c.children?.some(child => child._id === category);
                  return (
                  <li key={c._id} className="space-y-1">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search);
                        params.set("category", c._id);
                        params.delete("brand");
                        router.push(`/products?${params.toString()}`);
                      }}
                      className={`text-sm text-left block w-full ${category === c._id ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
                    >
                      {c.name}
                    </button>
                    {isActiveMain && c.children && c.children.length > 0 && (
                      <ul className="pl-4 border-l-2 border-gray-100 space-y-1 mt-1 mb-2">
                        {c.children.map(child => {
                          const isActiveChild = category === child._id || child.children?.some(subChild => subChild._id === category);
                          return (
                            <li key={child._id} className="space-y-1">
                              <button
                                onClick={() => {
                                  const params = new URLSearchParams(window.location.search);
                                  params.set("category", child._id);
                                  params.delete("brand");
                                  router.push(`/products?${params.toString()}`);
                                }}
                                className={`text-sm text-left block w-full ${category === child._id ? "font-bold text-primary-600" : "text-gray-500 hover:text-primary-600"}`}
                              >
                                {child.name}
                              </button>
                              
                              {isActiveChild && child.children && child.children.length > 0 && (
                                <ul className="pl-4 border-l-2 border-gray-100 space-y-1 mt-1 mb-2">
                                  {child.children.map(subChild => (
                                    <li key={subChild._id}>
                                      <button
                                        onClick={() => {
                                          const params = new URLSearchParams(window.location.search);
                                          params.set("category", subChild._id);
                                          params.delete("brand");
                                          router.push(`/products?${params.toString()}`);
                                        }}
                                        className={`text-sm text-left block w-full ${category === subChild._id ? "font-bold text-primary-600" : "text-gray-400 hover:text-primary-600"}`}
                                      >
                                        {subChild.name}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )})}
              </ul>
            </div>

            {brands.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {brands.map(b => (
                    <label key={b.name} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrand === b.name}
                        onChange={() => {
                          const params = new URLSearchParams(window.location.search);
                          if (selectedBrand === b.name) {
                            params.delete("brand");
                          } else {
                            params.set("brand", b.name);
                          }
                          router.push(`/products?${params.toString()}`);
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">{b.name} ({b.count})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="hidden md:flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold font-heading">
              {collectionName ? collectionName : search ? `Search results for "${search}"` : "Shop All"}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border-none bg-gray-50 rounded-lg text-sm font-medium focus:ring-0 py-2 pl-3 pr-8 dark:text-white"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-4">
                  <div className="bg-gray-200 dark:bg-gray-800 aspect-[4/5] rounded-xl"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your filters or search query.</p>
              <Button className="mt-6" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="group flex flex-col bg-surface rounded-xl overflow-hidden hover-lift border border-gray-100">
                    <Link href={`/products/${product.slug || product._id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="text-xs text-gray-500 mb-1">{product.category?.name}</div>
                      <Link href={`/products/${product.slug || product._id}`}>
                        <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-bold text-lg text-primary-600">₹{product.price?.toFixed(2)}</span>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="text-white bg-gray-900 hover:bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4 dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sentinel element for infinite scrolling */}
              <div ref={observerTarget} className="h-10 w-full flex items-center justify-center mt-6">
                {isFetchingNextPage && (
                  <div className="flex items-center space-x-2 py-4">
                    <Spinner size="sm" />
                    <span className="text-sm text-gray-500 font-medium animate-pulse">Loading more products...</span>
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <p className="text-sm text-gray-400 font-medium my-4">You have seen all products</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
