"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "./ui/ProductCard";
import ProductCardSkeleton from "./ui/ProductCardSkeleton";

const AllProducts = () => {
  // State for API data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllProductsPaginated = async () => {
    setLoading(true);
    setError(null);
    try {
      let allProducts = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const res = await fetch(`/api/products?page=${currentPage}&limit=50`); // Use larger limit per page
        const data = await res.json();

        console.log(`Page ${currentPage} Response:`, data); // Debug log

        if (!res.ok) {
          throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }

        // Handle different response formats
        let pageProducts = [];
        if (Array.isArray(data)) {
          pageProducts = data;
        } else if (data.products && Array.isArray(data.products)) {
          pageProducts = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          pageProducts = data.data;
        }

        // Add products to the main array
        allProducts = [...allProducts, ...pageProducts];

        // Check if there are more pages
        // This depends on your API response structure
        if (data.hasNextPage === false || 
            data.totalPages <= currentPage || 
            pageProducts.length === 0 || 
            pageProducts.length < 50) {
          hasMorePages = false;
        } else {
          currentPage++;
        }

        // Safety check to prevent infinite loops
        if (currentPage > 50) {
          console.warn("Breaking pagination loop - too many pages");
          break;
        }
      }

      console.log("Total products loaded:", allProducts.length); // Debug log
      setProducts(allProducts);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = fetchAllProductsPaginated;  

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add retry function
  const handleRetry = () => {
    fetchProducts();
  };

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mt-28 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2649] mb-4">
            All Products
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our complete collection of Products.
          </p>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            // Shimmer Effect while loading
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
              <style jsx global>{`
                @keyframes shimmer {
                  0% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .animate-shimmer {
                  animation: shimmer 2s infinite linear;
                }
              `}</style>
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            // Error state with retry option
            <div className="text-center py-12">
              <p className="text-lg text-red-600 mb-4">
                Error loading products: {error}
              </p>
              <button 
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No products available.
              </p>
              <button 
                onClick={handleRetry}
                className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <>
              {/* Optimized responsive grid */}
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product._id || product.id || index} product={product} />
                ))}
              </div>
              
              {/* Show total count */}
              <div className="text-center mt-8">
                <p className="text-sm text-gray-600">
                  Showing {products.length} products
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllProducts;