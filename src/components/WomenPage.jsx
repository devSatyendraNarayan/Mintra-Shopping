import React, { useContext, useMemo, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { FaSearch, FaSort } from "react-icons/fa";

function WomenPage() {
  // Fetch products from the ProductContext
  const { products } = useContext(ProductContext);

  // State for managing the search term and sorting option
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter products for the women's clothing category
  const clothingProducts = useMemo(
    () => products.filter((product) => product.category === "women's clothing"),
    [products]
  );

  // Filter and sort products based on search term and sorting option
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
      {/* Header component with specific styles */}
      <Header
        className="bg-white shadow-md"
        textColor="text-gray-800"
        showCategories={false}
        showMenu={false}
      />
      <ToastContainer />
      
      {/* Main content area with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mt-16 mx-auto px-4 py-8"
      >
        <h1 className="text-5xl font-bold mb-4 text-[#eb2540] text-center">
          Women's Clothing
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Discover our collection of {clothingProducts.length} stylish women's
          clothing items
        </p>

        {/* Search and sort controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
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

        {/* Product list with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredAndSortedProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Message when no products match the search */}
        {filteredAndSortedProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No products found matching your search.
          </p>
        )}
      </motion.div>
    </>
  );
}

export default WomenPage;
