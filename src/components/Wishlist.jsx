import React, { useContext, useMemo } from "react";
import { WishlistContext } from "../contexts/WishlistContext";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import Header from "./Header";

// Utility function to format price from USD to INR
const formatPriceInINR = (priceInUSD) => {
  const exchangeRate = 83.39; // Current exchange rate (USD to INR)
  const priceInINR = priceInUSD * exchangeRate;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInINR);
};

// Component to render individual wishlist items
const WishlistItem = ({ product, onRemove, onAddToCart }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
    <Link to={`/product/${product.id}`} className="block relative">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain transition-opacity duration-300 hover:opacity-90"
      />
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(product.id); // Remove item from wishlist
          }}
          className="p-2 bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors duration-300"
          aria-label="Remove from wishlist"
        >
          <FaTrash className="h-4 w-4" />
        </button>
      </div>
    </Link>
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-800 truncate mb-2">
        {product.title}; 
        {/* Product title */}
      </h3>
      <p className="text-sm font-bold mb-4 text-rose-500">
        {formatPriceInINR(product.price)} 
        {/* Display product price in INR */}
      </p>
      <button
        onClick={() => onAddToCart(product)} // Add product to cart
        className="w-full btn btn-sm btn-primary flex items-center justify-center gap-2 transition-colors duration-300"
      >
        <FaShoppingCart className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  </div>
);

// Component to render when wishlist is empty
const EmptyWishlist = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg p-8">
    <FaHeart className="w-16 h-16 text-gray-300 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
    <p className="text-center text-gray-600 mb-6">
      Add items that you like to your wishlist. Review them anytime and easily move them to the bag.
    </p>
    <Link
      to="/"
      className="btn bg-rose-600 border-none text-white hover:bg-rose-700 hover:text-white transition-colors duration-300"
    >
      Continue Shopping
    </Link>
  </div>
);

// Main Wishlist component
const Wishlist = () => {
  // Retrieve wishlist and cart context data
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  // Use useMemo to ensure unique wishlist items
  const uniqueWishlist = useMemo(() => 
    wishlist.filter((product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
    ),
    [wishlist]
  );

  // Handler to remove product from wishlist
  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  // Handler to add product to cart and remove from wishlist
  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <Header
        className="bg-white shadow-sm"
        textColor="text-gray-800"
        showCategories={true}
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h1>
        {uniqueWishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {uniqueWishlist.map((product) => (
              <WishlistItem
                key={product.id}
                product={product}
                onRemove={handleRemoveFromWishlist}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <EmptyWishlist />
        )}
      </main>
    </div>
  );
};

export default Wishlist;
