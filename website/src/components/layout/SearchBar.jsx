"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Search, X, Loader2, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import api from "@/lib/axios";

function SearchInput({ onSearchComplete }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();

  // Reset or sync search box whenever route/page changes
  useEffect(() => {
    if (pathname === "/products") {
      const currentSearch = searchParams?.get("search") || "";
      setQuery(currentSearch);
    } else {
      // When navigating to a product page (/products/[slug]) or any other page, clear search text
      setQuery("");
    }
    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  }, [pathname, searchParams]);

  // Debounced fetch for live suggestions as user types each letter
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(trimmed)}&limit=6`, {
          signal: controller.signal,
        });
        setSuggestions(data.data || []);
        setIsOpen(true);
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    setIsOpen(false);
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/products`);
    }
    if (onSearchComplete) {
      onSearchComplete();
    }
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
    if (product.slug) {
      router.push(`/products/${product.slug}`);
    } else {
      router.push(`/products/${product._id}`);
    }
    if (onSearchComplete) {
      onSearchComplete();
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectProduct(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Helper to highlight matching text in title
  const highlightMatch = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-primary-600 dark:text-primary-400 font-bold underline decoration-primary-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const placeholderText = t("nav.search", { defaultValue: "Search for products, brands..." });

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative w-full" role="search" aria-label="Search products">
        <label htmlFor="search-input" className="sr-only">{placeholderText}</label>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          placeholder={placeholderText}
          value={query}
          onFocus={() => {
            if (query.trim() && suggestions.length > 0) setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-400 rounded-full py-2.5 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm sm:text-base border border-transparent focus:border-primary-500 shadow-sm"
          autoComplete="off"
        />

        {/* Clear / Spinner Icon */}
        <div className="absolute right-9 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 p-1 rounded-full transition-colors"
          aria-label="Submit search"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[100] animate-in fade-in-50 zoom-in-95 duration-150">
          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Products Suggestions</span>
                <span className="text-[11px] font-normal lowercase">{suggestions.length} results</span>
              </div>

              <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/60">
                {suggestions.map((product, index) => {
                  const imageUrl = product.images?.[0]?.url || "/placeholder-product.png";
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary-50 dark:bg-primary-950/40 text-primary-900 dark:text-primary-100"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/70 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80";
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {highlightMatch(product.name, query)}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.brand && (
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Tag className="w-3 h-3 text-gray-400" />
                              {product.brand}
                            </span>
                          )}
                          {product.category?.name && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                              {product.category.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          ₹{product.price?.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[11px] text-gray-400 line-through">
                            ₹{product.originalPrice?.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View all results button */}
              <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    View all results for &ldquo;<span className="font-bold">{query}</span>&rdquo;
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="p-6 text-center">
              <ShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-250">
                No products found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching with a different keyword or category
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function SearchBar({ onSearchComplete }) {
  return (
    <Suspense
      fallback={
        <div className="relative w-full max-w-md">
          <input
            type="search"
            placeholder="Search for products, brands..."
            disabled
            className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2.5 pl-4 pr-10 opacity-70"
          />
        </div>
      }
    >
      <SearchInput onSearchComplete={onSearchComplete} />
    </Suspense>
  );
}

