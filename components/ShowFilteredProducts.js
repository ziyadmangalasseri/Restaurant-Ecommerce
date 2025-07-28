"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ui/ProductCard";
import ProductCardSkeleton from "./ui/ProductCardSkeleton";

const ShowFiltredProducts = ({
  productType,
  category,
  title,
  subtitle,
  limit = 10,
  showViewAll = true,
  viewAllLink = "/products",
  layoutType 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [responseNotOkey, setResponseNotOkey] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const containerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  // Build query parameters dynamically
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (productType) params.append(productType, "true");
    if (category) params.append("categories", category);
    params.append("limit", limit.toString());
    return params.toString();
  }, [productType, category, limit]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams();
      const res = await fetch(`/api/products?${queryParams}`);
      console.log(`/api/products?${queryParams}`);
      if (!res.ok) {
        setResponseNotOkey(true);
        return;
      }
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle scrollable logic and auto-slide for slider layout
  useEffect(() => {
    if (layoutType !== "slider") return;

    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
        setMaxScroll(scrollWidth - clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    // Auto-slide for NewArrival
    if (productType === "NewArrival" && layoutType === "slider") {
      const startAutoSlide = () => {
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isHovered && containerRef.current) {
            const container = containerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            let newScrollPosition = container.scrollLeft + scrollAmount;

            // Reset to start when reaching the end
            if (newScrollPosition >= maxScroll) {
              newScrollPosition = 0;
            }

            container.scrollTo({
              left: newScrollPosition,
              behavior: "smooth",
            });
            setScrollPosition(newScrollPosition);
          }
        }, 3000); // Slide every 3 seconds
      };

      startAutoSlide();
    }

    return () => {
      window.removeEventListener("resize", checkScrollable);
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [products, loading, layoutType, productType, isHovered, maxScroll]);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollPosition =
      direction === "left"
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(maxScroll, container.scrollLeft + scrollAmount);

    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    setScrollPosition(newScrollPosition);
  };

  const handleScrollChange = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  // Handle mouse hover to pause/resume auto-slide
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Generate title based on props
  const getTitle = () => {
    if (title) return title;
    if (category) {
      return (
        <h2 className="text-center">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800 capitalize">
            {category}
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {" "}
            Collection
          </span>
        </h2>
      );
    }
    if (productType === "TopProduct") {
      return (
        <h2 className="text-center">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
            Top
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {" "}
            Picks
          </span>
        </h2>
      );
    }
    if (productType === "NewArrival") {
      return (
        <h2 className="text-center">
          <span className="text-xl sm:text-2xl md:text-3xl text-gray-800">
            New
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            {" "}
            Arrivals
          </span>
        </h2>
      );
    }
    return <h2></h2>;
  };

  const getSubtitle = () => {
    if (subtitle) return subtitle;
    if (category) {
      return `Explore our premium ${category} collection crafted for excellence.`;
    }
    return "The Elite List: Top Choices!";
  };

  // Generate section ID based on props
  const getSectionId = () => {
    if (productType === "TopProduct") return "top-products";
    if (productType === "NewArrival") return "new-arrivals";
    if (category) return `${category.toLowerCase()}-collection`;
    return "products-section";
  };

  // Render products based on layout type
  const renderProducts = () => {
    if (loading) {
      return (
        <>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={
                layoutType === "slider"
                  ? "flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)] snap-center"
                  : "w-full"
              }
            >
              <div className="max-w-[320px] mx-auto">
                <ProductCardSkeleton />
              </div>
            </div>
          ))}
        </>
      );
    }
    if (error) {
      return (
        <div className="w-full text-center py-8 text-red-500">
          Error: {error}
        </div>
      );
    }
    if (responseNotOkey) {
      return (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">Products are not available</p>
        </div>
      );
    }
    if (products.length === 0) {
      return (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      );
    }
    return products.map((product, idx) => (
      <div
        key={product.id || idx}
        className={
          layoutType === "slider"
            ? "flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)] snap-center"
            : "w-full"
        }
      >
        <div className="max-w-[320px] mx-auto">
          <ProductCard product={product} />
        </div>
      </div>
    ));
  };

  return (
    <section id={getSectionId()} className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          {getTitle()}
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {getSubtitle()}
          </p>
        </div>

        {/* Products Container */}
        <div
          className="relative max-w-[1400px] mx-auto px-4 sm:px-0"
          onMouseEnter={layoutType === "slider" && productType === "NewArrival" ? handleMouseEnter : undefined}
          onMouseLeave={layoutType === "slider" && productType === "NewArrival" ? handleMouseLeave : undefined}
        >
          {/* Navigation Buttons for Slider Layout */}
          {layoutType === "slider" && isScrollable && scrollPosition > 0 && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-[#1a2649] p-2 sm:p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Products Wrapper */}
          <div
            ref={containerRef}
            onScroll={handleScrollChange}
            className={
              layoutType === "slider"
                ? "flex overflow-x-auto gap-3 md:gap-4 pb-4 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] snap-x snap-mandatory"
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            }
          >
            {renderProducts()}
          </div>

          {/* Right Navigation Button for Slider Layout */}
          {layoutType === "slider" && isScrollable && scrollPosition < maxScroll && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-[#1a2649] p-2 sm:p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-6 md:mt-8">
            <Link href={viewAllLink}>
              <button className="px-6 sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                View All Products
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowFiltredProducts;