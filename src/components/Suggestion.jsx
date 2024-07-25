import React, { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams hook for accessing URL parameters
import { ProductContext } from "../contexts/ProductContext"; // Import ProductContext to access products
import { WishlistContext } from "../contexts/WishlistContext"; // Import WishlistContext to access wishlist items
import { CartContext } from "../contexts/CartContext"; // Import CartContext to access cart items
import ProductCard from "./ProductCard"; // Import ProductCard component

function Suggestion() {
  // State to manage the active tab, defaulting to "men"
  const [activeTab, setActiveTab] = useState("men");

  // Extract the product ID from the route parameters
  const { id } = useParams();
  
  // Access products from ProductContext
  const { products } = useContext(ProductContext);
  
  // Access wishlist items from WishlistContext
  const { wishlist } = useContext(WishlistContext);
  
  // Access cart items from CartContext
  const { cart } = useContext(CartContext);

  // Memoize the filtered products to optimize performance
  const filteredProducts = useMemo(() => {
    // Filter out the current product, wishlist items, and cart items
    let filtered = products.filter(
      (product) =>
        product.id !== parseInt(id) && // Exclude the current product being viewed
        !wishlist.some((wishlistItem) => wishlistItem.id === product.id) && // Exclude products in the wishlist
        !cart.some((cartItem) => cartItem.id === product.id) // Exclude products in the cart
    );

    // Further filter products based on the active tab (category)
    if (activeTab === "men") {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === "men's clothing"
      );
    } else if (activeTab === "women") {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === "women's clothing"
      );
    }

    return filtered; // Return the filtered list of products
  }, [activeTab, products, wishlist, cart, id]); // Dependencies for useMemo

  return (
    <div className="h-full mb-10 text-gray-800 bg-rose-50 w-full p-3">
      <div className="w-full h-[1px] bg-gray-800"></div> {/* Divider */}
      <p className="font-semibold tracking-wide my-3">You may also like:</p>
      <div role="tablist" className="tabs tabs-bordered">
        {/* Tab for "Men" category */}
        <button
          role="tab"
          className={`tab text-gray-800 ${activeTab === "men" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("men")}
        >
          Men
        </button>
        {/* Tab for "Women" category */}
        <button
          role="tab"
          className={`tab text-gray-800 ${activeTab === "women" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("women")}
        >
          Women
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Render the filtered products using ProductCard component */}
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Suggestion;
