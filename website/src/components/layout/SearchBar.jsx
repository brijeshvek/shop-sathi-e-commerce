"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md" role="search" aria-label="Search products">
      <label htmlFor="search-input" className="sr-only">Search for products, brands</label>
      <input
        id="search-input"
        type="search"
        placeholder="Search for products, brands..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-400 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
        autoComplete="off"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500"
        aria-label="Submit search"
      >
        <Search className="w-5 h-5" aria-hidden="true" />
      </button>
    </form>
  );
}
