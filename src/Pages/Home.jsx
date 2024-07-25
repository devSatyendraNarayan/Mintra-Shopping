import React, { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import Hero from "../components/Hero";

function Home() {
  // Access the products data from the ProductContext
  const { products } = useContext(ProductContext);

  // Filter products to get only those in the men's clothing category
  const menProducts = products.filter(
    (product) => product.category === "men's clothing"
  );

  // Filter products to get only those in the women's clothing category
  const womenProducts = products.filter(
    (product) => product.category === "women's clothing"
  );

  return (
    <>
      {/* Render the Hero component */}
      <Hero />
    </>
  );
}

export default Home;
