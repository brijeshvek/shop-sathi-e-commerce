"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { CategoryProductsShowcase } from "./CategoryProductsShowcase";
import { OfferBanner } from "./OfferBanner";

export function CategoryProductsShowcaseSection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        // Take the top parent categories (only parent categories or top ones)
        const parentCategories = data.data?.filter(c => !c.parent) || [];
        // If there are no categories without parent, take all
        setCategories(parentCategories.length ? parentCategories : data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories showcase", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-12">
        <div className="h-48 bg-gray-250 dark:bg-gray-800 rounded-2xl w-full"></div>
        <div className="h-64 bg-gray-250 dark:bg-gray-800 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  // Split categories: first 2 categories before OfferBanner, rest after
  const firstGroup = categories.slice(0, 2);
  const secondGroup = categories.slice(2);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* First 2 categories products */}
      {firstGroup.map((cat) => (
        <CategoryProductsShowcase key={cat._id} category={cat} />
      ))}

      {/* Offer Banner */}
      <OfferBanner />

      {/* Rest of the categories products */}
      {secondGroup.map((cat) => (
        <CategoryProductsShowcase key={cat._id} category={cat} />
      ))}
    </section>
  );
}
