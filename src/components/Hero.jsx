import React, { useContext, useMemo } from "react";
import { ProductContext } from "../contexts/ProductContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./Header";
import ProductCard from "./ProductCard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Message to display about delivery status
const DELIVERY_MESSAGE = "Now delivering in Jamshedpur only! Same-day delivery available.";

const Hero = () => {
  // Accessing products from the ProductContext
  const { products } = useContext(ProductContext);

  // Filtering products to only include clothing items
  const clothingProducts = useMemo(() => 
    products.filter(product => 
      ["men's clothing", "women's clothing"].includes(product.category)
    ),
    [products] // Recalculate only when products change
  );

  // Configuration settings for the image slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1280, // Show 4 slides on large screens
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024, // Show 3 slides on medium screens
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768, // Show 2 slides on smaller screens
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640, // Show 1 slide on smallest screens
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="hero min-h-screen relative bg-cover bg-center flex flex-col items-center justify-center"
           style={{ backgroundImage: "url(https://dminteriors.lk/wp-content/uploads/2021/09/Cloth-Shop-Interior-Design-Ideas.jpg)" }}>
        {/* Overlay to darken the background image */}
        <div className="hero-overlay bg-black bg-opacity-50 absolute inset-0"></div>
        
        <div className="relative z-10 text-center px-4 md:px-8 lg:px-16">
          {/* Delivery message displayed in a highlighted background */}
          <div className="bg-yellow-400 text-black py-2 px-4 rounded-full mb-4 animate-pulse">
            {DELIVERY_MESSAGE}
          </div>
          {/* Main heading and subheading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Welcome to Our Cloth Store</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white mb-8">Discover the latest fashion trends</p>
        </div>

        {/* Slider displaying clothing products */}
        <div className="z-20 w-full px-4 md:px-8 lg:px-16 pb-8 ">
          <Slider {...sliderSettings}>
            {clothingProducts.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
      {/* Header component with sticky positioning */}
      <div className="sticky top-0 z-50 bg-white shadow-none">
        <Header className="bg-white" textColor="text-gray-800" showCategories={true} />
      </div>
      
      {/* Toast container for displaying notifications */}
      <ToastContainer className="z-50" />
    </div>
  );
};

export default Hero;
