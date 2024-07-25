import React from "react";
import PropTypes from 'prop-types';
import { formatPrice } from "../utils/Helpers";

/**
 * PriceDetails Component
 * Displays a detailed breakdown of pricing including total MRP, discounts, shipping fees, and final amount.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.cart - Array of cart items
 * @param {number} props.finalTotal - The total amount before discounts
 * @param {number} props.discount - Total discount applied on MRP
 * @param {number} props.shippingFee - Shipping fee
 * @param {number} props.total - Final total amount after applying discounts and fees
 * @param {Object} [props.appliedCoupon] - Details of the applied coupon (optional)
 * @param {string} [props.className] - Optional additional CSS class names
 * @returns {JSX.Element} The rendered component
 */
const PriceDetails = ({ cart, finalTotal, discount, shippingFee, total, appliedCoupon, className }) => {
  // Define the threshold for free shipping
  const freeShippingThreshold = 2000;

  return (
    <div className={`bg-white border w-[80vw] border-gray-300 p-6 rounded-lg shadow-md ${className}`}>
      {/* Header displaying the number of items in the cart */}
      <h2 className="text-xl font-semibold mb-4">
        PRICE DETAILS ({cart.length} {cart.length === 1 ? "item" : "items"})
      </h2>

      <div className="space-y-3">
        {/* Total MRP */}
        <div className="flex justify-between">
          <span>Total MRP</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>

        {/* Discount on MRP */}
        <div className="flex justify-between text-green-600">
          <span>Discount on MRP</span>
          <span>-{formatPrice(discount)}</span>
        </div>

        {/* Coupon Discount */}
        <div className="flex justify-between">
          <span>Coupon Discount</span>
          {appliedCoupon ? (
            <span className="text-green-600">-{formatPrice(appliedCoupon.discount)}</span>
          ) : (
            <span className="text-blue-600 cursor-pointer">Apply Coupon</span>
          )}
        </div>

        {/* Platform Fee (always free) */}
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span className="text-green-600">FREE</span>
        </div>

        {/* Shipping Fee with a note for orders below the free shipping threshold */}
        <div className="flex justify-between">
          <div>
            <span>Shipping Fee</span>
            {total < freeShippingThreshold && (
              <span className="text-xs text-gray-500 block">
                (Free shipping on orders above {formatPrice(freeShippingThreshold)})
              </span>
            )}
          </div>
          <span>{formatPrice(shippingFee)}</span>
        </div>

        {/* Final Total Amount */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for the component
PriceDetails.propTypes = {
  cart: PropTypes.array.isRequired,
  finalTotal: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  shippingFee: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  appliedCoupon: PropTypes.shape({
    code: PropTypes.string,
    discount: PropTypes.number
  }),
  className: PropTypes.string,
};

export default PriceDetails;
