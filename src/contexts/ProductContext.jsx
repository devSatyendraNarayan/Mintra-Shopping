import React, { createContext, useState, useEffect, useMemo } from "react";

// Create a context for product data
export const ProductContext = createContext();

function ProductProvider({ children }) {
  // State for storing the list of products and loading status
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch product data from the API
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        // Update the products state with the fetched data
        setProducts(data);
      } finally {
        // Set loading status to false once the fetch is complete
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ products, isLoading }), [products, isLoading]);

  return (
    // Provide the context value to child components
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;
