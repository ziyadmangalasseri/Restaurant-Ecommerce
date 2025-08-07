"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Global shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite linear;
    background-size: 400% 100%;
    background-image: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  }
`;

const ProductCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [responseNotOkey, setResponseNotOkey] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(9);
  const [showLoadMore, setShowLoadMore] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?limit=full`);
      if (!res.ok) {
        setResponseNotOkey(true);
      }
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setResponseNotOkey(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate display limit based on screen size
  useEffect(() => {
    const updateDisplayLimit = () => {
      const width = window.innerWidth;
      let newDisplayLimit = 8; // Default mobile

      if (width >= 1024) {
        newDisplayLimit = 15; // Large screens: 15 categories
      } else if (width >= 768) {
        newDisplayLimit = 12; // Tablets: 12 categories
      }

      setDisplayLimit(newDisplayLimit);
    };

    updateDisplayLimit();
    window.addEventListener("resize", updateDisplayLimit);
    return () => window.removeEventListener("resize", updateDisplayLimit);
  }, []);

  // Update showLoadMore based on categories and displayLimit
  useEffect(() => {
    setShowLoadMore(categories.length > displayLimit);
  }, [categories, displayLimit]);

  // Load more handler
  const handleLoadMore = () => {
    const width = window.innerWidth;
    let increment = 9; // Default increment

    if (width >= 1024) {
      increment = 15; // Large screens: load 15 more
    } else if (width >= 768) {
      increment = 12; // Tablets: load 12 more
    }

    setDisplayLimit(prev => prev + increment);
  };

  // Get skeleton count based on screen size
  const getSkeletonCount = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (width < 768) return 9;
    if (width < 1024) return 12;
    return 15;
  };

  // Category skeleton component
  const CategorySkeleton = () => (
    <div className="px-2">
      <div className="relative mb-2">
        <div className="bg-gray-200 rounded-full aspect-square overflow-hidden relative">
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded-md overflow-hidden relative mx-auto w-3/4">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
    </div>
  );

  // Get categories to display
  const categoriesToDisplay = categories.slice(0, displayLimit);

  return (
    <section
      id="categories"
      className="w-full max-w-screen-2xl mt-12 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white relative overflow-hidden"
    >
      {/* Global styles */}
      <style jsx global>
        {`
          ${shimmerStyles}
        `}
      </style>

      {/* Curved edges */}
      <div className="absolute left-0 bottom-0 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-white rounded-tr-full transform translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12 -translate-x-6 sm:-translate-x-8 md:-translate-x-10 lg:-translate-x-12" />
      <div className="absolute right-0 bottom-0 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-white rounded-tl-full transform translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12 translate-x-6 sm:translate-x-8 md:translate-x-10 lg:translate-x-12" />

      <div className="relative z-10">
        <h2 className="text-center mb-6 md:mb-10">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
            Shop By{" "}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Category
          </span>
        </h2>

        {/* Categories Grid */}
        <div className="mt-12">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: getSkeletonCount() }).map((_, idx) => (
                <CategorySkeleton key={`skeleton-grid-${idx}`} />
              ))}
            </div>
          ) : responseNotOkey ? (
            <div className="text-center text-gray-700">
              Unable to load categories.
            </div>
          ) : categories.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoriesToDisplay.map((category, index) => (
                  <Link
                    key={index}
                    href={`/filteredCategoryProducts?category=${encodeURIComponent(category.name)}`}
                    className="px-2 cursor-pointer group"
                  >
                    <div className="relative mb-2">
                      <div className="bg-white rounded-full aspect-square overflow-hidden shadow-sm relative">
                        <Image
                          src={category.image || "/image/product.jpeg"}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          fill
                          sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
                          loader={({ src, width, quality }) => {
                            return `${src}?w=${width}&q=${quality || 75}`;
                          }}
                          unoptimized={true}
                        />
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm text-center text-gray-800 font-medium mb-0.5 sm:mb-1">
                      {category.name}
                    </h3>
                  </Link>
                ))}
              </div>
              
              {/* Load More Button */}
              {showLoadMore && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleLoadMore}
                    className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Load More Categories
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-700">
              No categories available.
            </div>
          )}
        </div>

        {/* Browse All Categories Button - Only show when all categories are loaded */}
        {/* {!loading && !showLoadMore && categories.length > 0 && (
          <div className="text-center lg:mt-24 md:mt-14 sm:mt-8 mt-8">
            <button className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              Browse All Categories
            </button>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default ProductCategories;