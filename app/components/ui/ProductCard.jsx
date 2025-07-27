import Image from "next/image";
import {ShoppingBag, Star,Heart}from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { toggleWishlist } from "../../store/wishlistSlice";
import { useSession } from "next-auth/react";

const ProductCard = ({ product }) => {
     const dispatch = useDispatch();
  const { data: session } = useSession();

  const wishlist = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleWishlistToggle = () => {
    if (!session?.user) {
      alert("Please login to add items to your wishlist");
      return;
    }
    dispatch(toggleWishlist(product));
  };

  const handleAddItem = async (item) => {
    // 1. Update local redux store
    dispatch(addToCart(item));

    // 2. Sync to DB if logged in
    if (session?.user) {
      try {
        await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: item }),
        });
      } catch (err) {
        console.error("Failed to sync cart to DB", err);
      }
    }
  };
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border-1 hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden rounded-lg bg-gray-50 mb-3 sm:mb-4 aspect-square">
        <Image
          src={
            product.image ||
            `https://via.placeholder.com/300x300?text=${product.name}`
          }
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#1a2649] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
        {product.NewArrival && (
          <span className="absolute top-2 right-2 bg-[#1a2649] text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
            NEW
          </span>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a2649] fill-[#1a2649] mr-1" />
          {product.rating || 4.5} ({product.reviewCount || 0} reviews)
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold text-[#1a2649]">
            ${product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs sm:text-sm line-through text-gray-500">
              ${product.originalPrice}
            </span>
          )}
        </div>
 <div className="flex justify-between">
        <button 
        onClick={() => handleAddItem(product)}
        className=
        "px-6 items-center justify-center sm:px-8 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex duration-300">
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add to Cart
        </button>
         <button
          onClick={handleWishlistToggle}
          className={`px-3 items-center justify-center sm:p-2 py-1.5 sm:py-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-700 transition-colors cursor-pointer flex duration-300 hover:bg-blue-900 hover:text-white active:bg-blue-400"${
            isWishlisted
              ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
              : "border-gray-300 text-gray-700 hover:bg-blue-900"
          }`}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-white" : ""}`}
          />
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;