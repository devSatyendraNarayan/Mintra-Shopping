import React, { useContext, useMemo, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { FaSearch, FaSort } from "react-icons/fa";

// Main functional component for the men's clothing page
function MenPage() {
  // Access products from the ProductContext
  const { products } = useContext(ProductContext);
  
  // State to manage the search term input
  const [searchTerm, setSearchTerm] = useState("");
  
  // State to manage the sort option (by name or price)
  const [sortBy, setSortBy] = useState("name");

  // Memoized list of men's clothing products
  const clothingProducts = useMemo(
    () => products.filter((product) => product.category === "men's clothing"),
    [products]
  );

  // Memoized filtered and sorted products based on search term and sort option
  const filteredAndSortedProducts = useMemo(() => {
    return clothingProducts
      .filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.title.localeCompare(b.title);
        } else if (sortBy === "price") {
          return a.price - b.price;
        }
        return 0;
      });
  }, [clothingProducts, searchTerm, sortBy]);

  return (
    <>
      {/* Header component with specific styles and settings */}
      <Header
        className="bg-white shadow-md"
        textColor="text-gray-800"
        showCategories={false}
        showMenu={false}
      />
      
      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
      
      {/* Main container for the men's clothing page */}
      <motion.div
        initial={{ opacity: 0 }} // Initial animation state
        animate={{ opacity: 1 }} // Final animation state
        transition={{ duration: 0.5 }} // Animation duration
        className="container mt-16 mx-auto px-4 py-8"
      >
        {/* Page title */}
        <h1 className="text-5xl font-bold mb-4 text-[#eb2540] text-center">
          Men's Clothing
        </h1>
        
        {/* Description of the collection */}
        <p className="text-center text-gray-600 mb-8">
          Discover our collection of {clothingProducts.length} stylish men's
          clothing items
        </p>

        {/* Search and sort controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Search input field */}
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#eb2540] focus:border-transparent scrollbar-hidden"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Sort by dropdown */}
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#eb2540] focus:border-transparent scrollbar-hidden"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Product cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Initial animation state
          animate={{ opacity: 1, y: 0 }} // Final animation state
          transition={{ duration: 0.5, delay: 0.2 }} // Animation duration and delay
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredAndSortedProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }} // Scale up on hover
              whileTap={{ scale: 0.95 }} // Scale down on click
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Message displayed when no products match the search criteria */}
        {filteredAndSortedProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No products found matching your search.
          </p>
        )}
      </motion.div>
    </>
  );
}

export default MenPage;
