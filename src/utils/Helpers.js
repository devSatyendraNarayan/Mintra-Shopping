// helpers.js

/**
 * Function to format a price value as Indian Rupees (INR).
 * 
 * @param {number} price - The price value to format.
 * @returns {string} - The formatted price string in INR.
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,  // Ensures there are always 2 decimal places
    maximumFractionDigits: 2,  // Ensures there are not more than 2 decimal places
  }).format(price);  // Converts the price to a formatted string
};
