import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { CartContext } from "../contexts/CartContext";
import { formatPrice } from "../utils/Helpers";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to safely format date
const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  
  let date;
  if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue.toDate === 'function') {
    // Handle Firestore Timestamp
    date = dateValue.toDate();
  } else if (typeof dateValue === 'number') {
    date = new Date(dateValue);
  } else {
    return 'Invalid Date';
  }

  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

// Component for displaying individual orders
const OrderCard = ({ order, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle deleting an order
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setIsDeleting(true);
      try {
        await onDelete(order.id);
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="mb-4 border-b border-gray-200 pb-4 flex justify-between items-center">
        <p className="text-lg font-semibold mb-1 text-rose-600">
          Order Date: {formatDate(order.createdAt)}
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete order"
        >
          <MdDelete />
        </button>
      </div>
      <div className="space-y-4">
        {order.items.map((product) => (
          <div
            key={product.id}
            className="flex items-center border-b border-gray-100 py-3"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 object-contain mr-4 rounded-md"
            />
            <div>
              <p className="text-gray-800 font-medium">{product.title}</p>
              <p className="text-gray-600">Price: {formatPrice(product.price)}</p>
              <p className="text-gray-600">Quantity: {product.quantity}</p>
              <p className="text-gray-700 font-semibold">
                Total: {formatPrice(product.price * product.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-gray-800 font-semibold text-lg">
          Total Amount: {formatPrice(order.total)}
        </p>
        <p className="text-gray-600 mt-2">
          Delivery Address: {order.address || "Not provided"}
        </p>
        <p className="text-gray-600">
          Payment Method: {order.paymentMethod || "COD"}
        </p>
      </div>
    </motion.div>
  );
};

function OrderedProducts() {
  const { orderedProducts, fetchOrders, loadingOrders, deleteOrder } = useContext(CartContext);
  const [error, setError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch orders when component mounts or when fetchOrders changes
  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchOrders();
        setError(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(true);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadOrders();
  }, [fetchOrders]);

  // Handle deleting an order and refetch orders
  const handleDeleteOrder = useCallback(async (orderId) => {
    try {
      await deleteOrder(orderId);
      await fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }, [deleteOrder, fetchOrders]);

  // Sort and categorize orders based on date or price
  const sortedAndCategorizedOrders = useMemo(() => {
    const sortedOrders = [...orderedProducts].sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? b.createdAt - a.createdAt
          : a.createdAt - b.createdAt;
      } else {
        return sortOrder === "desc"
          ? b.total - a.total
          : a.total - b.total;
      }
    });
  
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
  
    // Categorize orders into Today, Yesterday, and Previous
    return sortedOrders.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt);
      let category;
  
      if (orderDate.getFullYear() === today.getFullYear() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getDate() === today.getDate()) {
        category = "Today";
      } else if (orderDate.getFullYear() === yesterday.getFullYear() &&
                 orderDate.getMonth() === yesterday.getMonth() &&
                 orderDate.getDate() === yesterday.getDate()) {
        category = "Yesterday";
      } else {
        category = "Previous";
      }
  
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(order);
      return acc;
    }, {});
  }, [orderedProducts, sortBy, sortOrder]);

  // Toggle sort criteria and order
  const toggleSort = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  // Render loading, error, or content based on state
  const renderContent = () => {
    if (isInitialLoad || loadingOrders) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>Failed to fetch orders. Please try again later.</p>
        </div>
      );
    }

    if (orderedProducts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-600 text-lg font-medium mb-6">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/"
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      );
    }

    return (
      <>
        {/* Sorting controls */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => toggleSort("date")}
            className={`mr-4 px-4 py-2 rounded-lg ${
              sortBy === "date" ? "bg-rose-500 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-rose-600 hover:text-white transition duration-300`}
          >
            Sort by Date {sortBy === "date" && (sortOrder === "desc" ? "↓" : "↑")}
          </button>
          <button
            onClick={() => toggleSort("price")}
            className={`px-4 py-2 rounded-lg ${
              sortBy === "price" ? "bg-rose-500 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-rose-600 hover:text-white transition duration-300`}
          >
            Sort by Price {sortBy === "price" && (sortOrder === "desc" ? "↓" : "↑")}
          </button>
        </div>
        
        {/* Render sorted and categorized orders */}
        <AnimatePresence>
          {Object.entries(sortedAndCategorizedOrders).map(([category, orders]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onDelete={handleDeleteOrder}
                  />
                ))}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </>
    );
  };

  return (
    <>
      <Header
        className="bg-white shadow-md border-b-2"
        textColor="text-gray-800"
        showCategories={false}
        showCart={true}
        showWishlist={true}
        showMenu={true}
        showUser={true}
      />

      <div className="mx-auto container mt-20 px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Your Orders
        </h2>
        {renderContent()}
      </div>
    </>
  );
}

export default OrderedProducts;
