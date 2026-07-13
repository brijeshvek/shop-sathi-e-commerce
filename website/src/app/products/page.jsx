"use client";

import { Suspense } from "react";

import { useState, useEffect } from "react";
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

  // Filters state
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [search, setSearch] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, search, minPrice, maxPrice, sort]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
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

      let url = `/products?sort=${sortField}&order=${order}&limit=100`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${search}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const { data } = await api.get(url);
      setProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setCategory("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
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
                      router.push(`/products?${params.toString()}`);
                    }}
                    className={`text-sm ${category === "" ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map(c => (
                  <li key={c._id}>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search);
                        params.set("category", c._id);
                        router.push(`/products?${params.toString()}`);
                      }}
                      className={`text-sm text-left ${category === c._id ? "font-bold text-primary-600" : "text-gray-600 hover:text-primary-600"}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

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
              {search ? `Search results for "${search}"` : "Shop All"}
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
