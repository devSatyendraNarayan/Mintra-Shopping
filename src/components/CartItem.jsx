import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import PriceDetails from "./PriceDetails";
import { formatPrice } from "../utils/Helpers";
import {
  FaPlus,
  FaMinus,
  FaAngleRight,
  FaTrash,
  FaHeart,
} from "react-icons/fa";
import Suggestion from "./Suggestion";
import { TbBadge } from "react-icons/tb";
import { format, addDays } from "date-fns";
import PlaceOrderModal from "./PlaceOrderModal";
import { Timestamp } from "firebase/firestore";

// Component for quantity selection in cart
const QuantitySelector = React.memo(({ productId, quantity, onChange }) => {
  // Decrease quantity handler
  const handleDecrease = useCallback(() => {
    if (quantity > 1) onChange(quantity - 1);
  }, [quantity, onChange]);

  // Increase quantity handler
  const handleIncrease = useCallback(() => {
    onChange(quantity + 1);
  }, [quantity, onChange]);

  // Handle change in quantity input
  const handleChange = useCallback(
    (e) => {
      const newQuantity = parseInt(e.target.value, 10);
      if (!isNaN(newQuantity) && newQuantity >= 1) onChange(newQuantity);
    },
    [onChange]
  );

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="leading-10 text-gray-600 transition hover:opacity-75"
        onClick={handleDecrease}
        aria-label="Decrease quantity"
      >
        <FaMinus />
      </button>
      <input
        type="number"
        id={`quantity-${productId}`}
        value={quantity}
        onChange={handleChange}
        className="h-10 w-16 rounded border border-gray-800 bg-white text-center sm:text-sm"
        min="1"
        aria-label="Product quantity"
      />
      <button
        type="button"
        className="leading-10 text-gray-600 transition hover:opacity-75"
        onClick={handleIncrease}
        aria-label="Increase quantity"
      >
        <FaPlus />
      </button>
    </div>
  );
});

QuantitySelector.propTypes = {
  productId: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

QuantitySelector.displayName = "QuantitySelector";

// Main component for the cart page
const CartItem = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, placeOrder, clearCart } =
    useContext(CartContext);
  const { wishlist, addToWishlist } = useContext(WishlistContext);
  const [total, setTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [discount] = useState(100);
  const [shippingFee, setShippingFee] = useState(0);
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const conversionRate = 83.36; // Conversion rate for currency
  const freeShippingThreshold = 2000; // Free shipping for orders above this value
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  useEffect(() => {
    // Calculate total price, discount, and shipping fee
    const calculateTotal = () => {
      const totalPrice = cart.reduce(
        (sum, product) =>
          sum + product.price * (product.quantity || 1) * conversionRate,
        0
      );
      setFinalTotal(totalPrice);

      let totalPriceWithDiscount = totalPrice - discount;
      if (appliedCoupon) totalPriceWithDiscount -= appliedCoupon.discount;

      setShippingFee(totalPriceWithDiscount >= freeShippingThreshold ? 0 : 79);
      setTotal(Math.max(0, totalPriceWithDiscount + shippingFee));
    };

    calculateTotal();
  }, [cart, discount, shippingFee, appliedCoupon, conversionRate]);

  // Handle quantity change in cart
  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      updateQuantity(productId, newQuantity);
    },
    [updateQuantity]
  );

  // Remove item from cart
  const handleRemove = useCallback(
    (productId) => {
      removeFromCart(productId);
      alert("Item removed from cart");
    },
    [removeFromCart]
  );

  // Move item to wishlist
  const handleMoveToWishlist = useCallback(
    (product) => {
      addToWishlist(product);
      removeFromCart(product.id);
      alert("Item moved to wishlist");
    },
    [addToWishlist, removeFromCart]
  );

  // Handle order placement
  const handlePlaceOrder = useCallback(async () => {
    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderDetails = {
        items: cart.map((product) => ({
          id: product.id,
          image: product.image,
          title: product.title,
          price: product.price * conversionRate,
          quantity: product.quantity,
        })),
        total,
        finalTotal,
        discount,
        shippingFee,
        address: address.trim(),
        paymentMethod: "COD",
        appliedCoupon,
        createdAt: new Date(),
      };

      await placeOrder(orderDetails);
      // Calculate estimated delivery date (2 days from now)
      const deliveryDate = addDays(new Date(), 2);
      setEstimatedDelivery(format(deliveryDate, "MMMM dd, yyyy"));
      clearCart();
      setAddress("");

      setShowOrderModal(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    cart,
    total,
    finalTotal,
    discount,
    shippingFee,
    address,
    placeOrder,
    clearCart,
    conversionRate,
    appliedCoupon,
  ]);

  // Continue shopping handler
  const handleContinueShopping = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Apply coupon handler
  const handleApplyCoupon = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (couponCode.toLowerCase() === "save10") {
        setAppliedCoupon({ code: couponCode, discount: 10 * conversionRate });
        alert("Coupon applied successfully!");
      } else {
        alert("Invalid coupon code");
      }
      setIsLoading(false);
    }, 1000);
  }, [couponCode, conversionRate]);

  // Render cart items
  const cartItems = useMemo(
    () =>
      cart.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div className="flex items-center space-x-5">
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 object-contain"
            />
            <div className="flex flex-col justify-start">
              <p className="text-gray-800 font-semibold">{product.title}</p>
              <QuantitySelector
                productId={product.id}
                quantity={product.quantity || 1}
                onChange={(newQuantity) =>
                  handleQuantityChange(product.id, newQuantity)
                }
              />
              <p className="text-gray-700 mt-1">
                Total:{" "}
                {formatPrice(
                  product.price * conversionRate * (product.quantity || 1)
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleRemove(product.id)}
              aria-label="Remove item"
            >
              <FaTrash />
            </button>
            {!wishlist.some((item) => item.id === product.id) && (
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => handleMoveToWishlist(product)}
                aria-label="Move to wishlist"
              >
                <FaHeart />
              </button>
            )}
          </div>
        </div>
      )),
    [
      cart,
      wishlist,
      handleQuantityChange,
      handleRemove,
      handleMoveToWishlist,
      conversionRate,
    ]
  );

  return (
    <>
      <Header
        className="bg-white shadow-none border-b-2"
        textColor="text-gray-800"
        showCategories={false}
        showCart={false}
        showWishlist={true}
        showMenu={true}
        showUser={true}
      />
      <div className="container mx-auto px-4 py-8 mt-20 max-w-screen-xl items-center justify-center flex flex-col">
        <div className="w-[80vw] bg-white border border-gray-300 p-6 mx-5 my-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cart.length > 0 ? (
            cartItems
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-800 uppercase font-semibold tracking-wide mb-4">
                Your cart is empty.
              </p>
              <button
                className="btn btn-primary"
                onClick={handleContinueShopping}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <>
            <div className="w-[80vw] bg-white border border-gray-300 p-6 mx-5 my-5 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Apply Coupon</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="input input-bordered rounded-sm bg-white text-gray-800 flex-grow"
                />
                <button
                  className="btn btn-primary"
                  onClick={handleApplyCoupon}
                  disabled={isLoading || !couponCode}
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-green-600 mt-2">
                  Coupon {appliedCoupon.code} applied: -
                  {formatPrice(appliedCoupon.discount)}
                </p>
              )}
            </div>

            <PriceDetails
              cart={cart}
              finalTotal={finalTotal}
              discount={discount}
              shippingFee={shippingFee}
              total={total}
              appliedCoupon={appliedCoupon}
            />

            <div className="w-[80vw] bg-white border border-gray-300 p-6 mx-5 my-5 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
              <div className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="label-text mb-2 font-semibold text-gray-800 block"
                  >
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address"
                    className="textarea textarea-bordered rounded-sm bg-white text-gray-800 w-full"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="label-text mb-2 font-semibold text-gray-800 block">
                    Payment Method
                  </label>
                  <p className="flex items-center gap-2 text-gray-800">
                    Currently available:{" "}
                    <span className="text-rose-500">
                      Cash On Delivery (COD)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[80vw] flex justify-end mt-4">
              <button
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "PLACE ORDER"}
              </button>
            </div>
          </>
        )}

        <Link
          to="/wishlist"
          className="btn w-[80vw] btn-ghost cursor-pointer h-fit tracking-wide text-gray-800 font-semibold flex flex-row items-center justify-between bg-white border border-gray-300 p-3 mx-5 my-5 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <TbBadge className="text-xl" />
            <p>Add More From Wishlist</p>
          </div>
          <FaAngleRight className="text-xl" />
        </Link>

        <Suggestion />
      </div>
      <PlaceOrderModal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          navigate("/bag");
        }}
      >
        <div className="text-center ">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold mb-4 text-green-600">
            Order Placed Successfully!
          </h2>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-lg mb-2">
              Estimated delivery:{" "}
              <span className="font-bold text-blue-600">
                {estimatedDelivery}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Expect delivery between 9 AM and 10 PM on the estimated date.
            </p>
          </div>

          <p className="mb-6 text-lg font-medium text-gray-700">
            Thank you for shopping with us!
          </p>

          <button
            onClick={() => {
              setShowOrderModal(false);
              navigate("/orderedProducts");
            }}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            View Order Details
          </button>
        </div>
      </PlaceOrderModal>
    </>
  );
};

export default CartItem;
