import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { WishlistContext } from "../contexts/WishlistContext";

// Functional component to display a product card
function ProductCard({ product }) {
  // Destructure the context values from WishlistContext
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  // Function to format price from USD to INR
  const formatPriceInINR = (priceInUSD) => {
    const exchangeRate = 83.39; // Exchange rate from USD to INR
    const priceInINR = priceInUSD * exchangeRate;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0, // No decimal places
    }).format(priceInINR);
  };

  // Function to handle adding/removing product from wishlist
  const handleAddToWishlist = (event, product) => {
    event.stopPropagation(); // Prevents event from bubbling up to parent elements
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id); // Remove product if it's already in the wishlist
    } else {
      addToWishlist(product); // Add product to the wishlist
    }
  };

  // Function to check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId); // Check if product ID exists in the wishlist
  };

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-2xl">
      {/* Link to product detail page */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image} // Product image URL
          alt={product.title} // Alt text for image
          className="w-full h-48 object-contain transition-opacity hover:opacity-90"
        />
      </Link>
      {/* Button to add/remove product from wishlist */}
      <button
        onClick={(event) => handleAddToWishlist(event, product)}
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition-transform hover:rotate-12 hover:bg-rose-100"
      >
        {/* Conditional rendering of heart icon based on wishlist status */}
        {isInWishlist(product.id) ? (
          <FaHeart className="h-5 w-5 text-red-500" />
        ) : (
          <FaRegHeart className="h-5 w-5 text-gray-600" />
        )}
      </button>
      <div className="p-4 transition-transform hover:translate-y-1">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {product.title} {/* Product title */}
        </h3>
        <p className="text-sm font-bold mt-2 text-rose-500">
          {formatPriceInINR(product.price)} {/* Formatted product price */}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
