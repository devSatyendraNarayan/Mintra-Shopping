import React, { useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import { WishlistContext } from "../contexts/WishlistContext";
import Header from "../components/Header";
import Suggestion from "../components/Suggestion";
import Loading from "../components/Loading";
import { RiStarSmileFill } from "react-icons/ri";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { CgDetailsMore } from "react-icons/cg";
import { GoStar } from "react-icons/go";

// Helper function to format price in INR from USD
const formatPriceInINR = (priceInUSD) => {
  const exchangeRate = 83.39; // Current exchange rate
  const priceInINR = priceInUSD * exchangeRate;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInINR);
};

// Breadcrumbs component for navigation
const Breadcrumbs = React.memo(({ category }) => (
  <div className="breadcrumbs text-sm text-gray-800 mt-20 px-10 mb-5">
    <ul>
      <li className="hover:text-rose-500">
        <Link to="/">Home</Link>
      </li>
      {category && (
        <>
          <li className="hover:text-rose-500">{category}</li>
          <li>Product Details</li>
        </>
      )}
    </ul>
  </div>
));
Breadcrumbs.displayName = 'Breadcrumbs';

// RatingSection component to display product rating
const RatingSection = React.memo(({ rate, count }) => (
  <div className="flex items-center gap-2 border w-fit p-1 border-gray-300">
    <div className="flex items-center gap-2">
      <p className="text-gray-800 font-semibold">{rate}</p>
      <RiStarSmileFill className="text-xl text-green-500" />
    </div>
    <div className="w-[1px] h-4 bg-gray-300"></div>
    <div>
      <p className="text-gray-500">{count}k Ratings</p>
    </div>
  </div>
));
RatingSection.displayName = 'RatingSection';

// DeliveryOptions component to display delivery information
const DeliveryOptions = React.memo(() => (
  <div>
    <div className="flex items-center gap-2 text-gray-800">
      <p className="font-semibold text-lg tracking-wide">DELIVERY OPTIONS</p>
      <CiDeliveryTruck className="text-2xl" />
    </div>
    
    <div className="flex flex-col mb-5 text-gray-800 text-md mt-2">
      <p>✓ 100% Original Products</p>
      <p>✓ Pay on delivery might be available</p>
      <p>✓ Easy 14 days returns and exchanges</p>
    </div>
  </div>
));
DeliveryOptions.displayName = 'DeliveryOptions';

// BestOffers component to display current offers on the product
const BestOffers = React.memo(() => (
  <div className="mb-5">
    <div className="flex items-center gap-2 text-gray-800">
      <p className="font-bold text-lg tracking-wide">BEST OFFERS</p>
      <MdOutlineLocalOffer className="text-lg" />
    </div>
    <ul className="text-gray-800 my-2">
      <li>
        Coupon code: <span className="font-bold tracking-wide">SAVE10</span>
      </li>
      <li>Coupon Discount: Rs. 10% off (check cart for final savings)</li>
    </ul>
  </div>
));
BestOffers.displayName = 'BestOffers';

// ProductDetails component to display detailed product description
const ProductDetails = React.memo(({ description }) => (
  <div>
    <div className="flex items-center text-gray-800 gap-2 text-lg">
      <p className="font-bold">PRODUCT DETAILS</p>
      <CgDetailsMore />
    </div>
    <p className="text-gray-800 text-md mt-2">{description}</p>
  </div>
));
ProductDetails.displayName = 'ProductDetails';

// Ratings component to display detailed rating breakdown
const Ratings = React.memo(({ rate, count }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="flex items-center gap-2 text-lg text-gray-800">
      <p className="font-bold">RATINGS</p>
      <GoStar />
    </div>
    <div className="flex items-center w-fit justify-between mt-2">
      <div>
        <div className="flex items-center gap-2 text-5xl text-gray-800">
          <p>{rate}</p>
          <RiStarSmileFill className="text-green-500" />
        </div>
        <p className="text-gray-500 text-sm">{count}k Verified Buyers</p>
      </div>
      <div className="w-[1px] h-24 bg-gray-300 mx-4"></div>
      <div className="flex flex-col space-y-2">
        {[100, 70, 40, 10, 0].map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-sm w-3">{5 - index}</span>
            <progress
              className="progress progress-success w-40"
              value={value}
              max="100"
            ></progress>
          </div>
        ))}
      </div>
    </div>
  </div>
));
Ratings.displayName = 'Ratings';

// CustomerFeedback component to display feedback on product fit and length
const CustomerFeedback = React.memo(({ count }) => (
  <div className="mt-5 bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="flex items-center gap-2 text-lg text-gray-800 tracking-wide font-bold">
      <p>WHAT CUSTOMERS SAID</p>
      <GoStar />
    </div>
    <div className="text-gray-800 mt-2">
      <div>
        <p>Fit</p>
        <div className="flex items-center gap-3">
          <progress
            className="progress progress-success w-56"
            value="71"
            max="100"
          ></progress>
          <p className="font-bold">Just Right (71%)</p>
        </div>
      </div>
      <div>
        <p>Length</p>
        <div className="flex items-center gap-3 mt-2">
          <progress
            className="progress progress-success w-56"
            value="79"
            max="100"
          ></progress>
          <p className="font-bold">Just Right (79%)</p>
        </div>
      </div>
    </div>
  </div>
));
CustomerFeedback.displayName = 'CustomerFeedback';

// Main ProductDetail component
const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL parameters
  const { products } = useContext(ProductContext); // Get products from context
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext); // Get wishlist functions from context
  
  // Find the product matching the ID
  const product = products.find((product) => product.id === parseInt(id));

  // Check if a product is in the wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  // Handle adding/removing product from wishlist
  const handleAddToWishlist = useCallback((event) => {
    event.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      console.log(`Removed ${product.title} from wishlist`);
    } else {
      addToWishlist(product);
      console.log(`Added ${product.title} to wishlist`);
    }
  }, [product, isInWishlist, removeFromWishlist, addToWishlist]);

  // Display loading screen if the product is not found
  if (!product) {
    return <Loading />;
  }

  return (
    <>
      <Header
        className="bg-white shadow-sm"
        textColor="text-gray-800"
        showCategories={true}
      />
      <Breadcrumbs category={product.category} />
      <div className="min-h-screen flex flex-col items-center mx-auto container w-full px-5 lg:px-10 gap-5">
        <div className="flex flex-col lg:flex-row justify-around w-full gap-5">
          <div className="w-full lg:w-1/3">
            <img src={product.image} alt={product.title} className="w-full object-contain h-96" />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-500 font-medium">{product.category}</p>
            <RatingSection
              rate={product.rating.rate}
              count={product.rating.count}
            />
            <div className="w-full h-[1px] bg-gray-300"></div>
            <div className="flex flex-col items-start">
              <p className="text-3xl font-bold text-gray-900">
                {formatPriceInINR(product.price)}
              </p>
              <p className="text-sm font-medium text-green-500">
                inclusive of all taxes
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 w-full">
              <button
                onClick={handleAddToWishlist}
                className="btn w-full bg-transparent border-gray-400 hover:border-gray-800 hover:bg-transparent rounded-sm text-gray-800 font-bold tracking-wide"
              >
                {isInWishlist(product.id) ? (
                  <FaHeart className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <FaRegHeart className="h-5 w-5 text-gray-600 mr-2" />
                )}
                {isInWishlist(product.id) ? "WISHLISTED" : "WISHLIST"}
              </button>
            </div>
            <div className="w-full h-[1px] bg-gray-300 mt-5"></div>
            <DeliveryOptions />
            <BestOffers />
            <div className="w-full h-[1px] bg-gray-300 mt-5"></div>
            <ProductDetails description={product.description} />
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mt-5"></div>
        <div className="flex items-start w-full flex-col lg:flex-row gap-5 justify-around">
          <Ratings rate={product.rating.rate} count={product.rating.count} />
          <CustomerFeedback count={product.rating.count} />
        </div>

        <div className="text-gray-800 mt-5">
          <a className="font-semibold text-rose-500 cursor-pointer hover:underline">
            View all {product.rating.count} reviews
          </a>
          <p>
            Product Code:{" "}
            <span className="font-semibold text-gray-800">{product.id}</span>
          </p>
          <p>
            Seller: <span className="font-semibold text-rose-500">Mintra</span>
          </p>
          <p className="font-semibold text-rose-500 cursor-pointer hover:underline">View Supplier Information</p>
        </div>
        <div className="mt-5 w-full">
          <p className="text-xl font-bold tracking-wide mb-5 text-gray-800">
            SIMILAR PRODUCTS
          </p>
          <Suggestion />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
