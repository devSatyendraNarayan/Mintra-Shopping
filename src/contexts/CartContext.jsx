import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { auth, db } from "../contexts/Firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// Create a context for the cart
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // State for managing cart items, user, ordered products, loading state, and errors
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch cart data from Firestore
  const fetchCart = useCallback(async (uid) => {
    try {
      const cartRef = doc(db, "users", uid, "cart", "cart");
      const cartDoc = await getDoc(cartRef);
      setCart(cartDoc.exists() ? cartDoc.data().items : []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to fetch cart data.");
    }
  }, []);

  // Function to fetch orders from Firestore
  const fetchOrders = useCallback(async (uid) => {
    if (!uid) {
      console.error("User UID is undefined");
      setError("User not authenticated. Please log in to view orders.");
      setLoadingOrders(false);
      return;
    }
  
    try {
      const ordersRef = collection(db, "users", uid, "orders");
      const querySnapshot = await getDocs(ordersRef);
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrderedProducts(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders.");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Hook to manage authentication state and fetch data accordingly
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchCart(firebaseUser.uid);
        fetchOrders(firebaseUser.uid);
      } else {
        setUser(null);
        setCart([]);
        setOrderedProducts([]);
        setLoadingOrders(false);
      }
    });

    return () => unsubscribe();
  }, [fetchCart, fetchOrders]);

  // Function to update cart in Firestore
  const updateCartInFirestore = useCallback(async (newCart) => {
    if (!user) return;
    try {
      const cartRef = doc(db, "users", user.uid, "cart", "cart");
      await setDoc(cartRef, { items: newCart });
      setCart(newCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      setError("Failed to update cart.");
    }
  }, [user]);

  // Function to add a product to the cart
  const addToCart = useCallback(async (product) => {
    if (!user) return;
    try {
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        setError("Product is already in the cart.");
        return;
      }
      const newCart = [...cart, { ...product, quantity: 1 }];
      await updateCartInFirestore(newCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add product to cart.");
    }
  }, [user, cart, updateCartInFirestore]);

  // Function to clear the cart
  const clearCart = useCallback(async () => {
    if (!user) return;
    try {
      await updateCartInFirestore([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart.");
    }
  }, [user, updateCartInFirestore]);

  // Function to remove a product from the cart
  const removeFromCart = useCallback(async (productId) => {
    if (!user) return;
    try {
      const updatedCart = cart.filter((item) => item.id !== productId);
      await updateCartInFirestore(updatedCart);
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Failed to remove product from cart.");
    }
  }, [user, cart, updateCartInFirestore]);

  // Function to update the quantity of a product in the cart
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!user) return;
    try {
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      await updateCartInFirestore(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update product quantity.");
    }
  }, [user, cart, updateCartInFirestore]);

  // Function to place an order
  const placeOrder = useCallback(async (orderDetails) => {
    if (!user) return;
    try {
      const ordersRef = collection(db, "users", user.uid, "orders");
      const newOrderRef = await addDoc(ordersRef, orderDetails);
      setOrderedProducts((prev) => [
        ...prev,
        { id: newOrderRef.id, ...orderDetails },
      ]);
      await updateCartInFirestore([]);
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order.");
    }
  }, [user, updateCartInFirestore]);

  // Function to delete an order
  const deleteOrder = useCallback(async (orderId) => {
    if (!user) return;
    try {
      const orderRef = doc(db, "users", user.uid, "orders", orderId);
      await deleteDoc(orderRef);
      setOrderedProducts((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order.");
    }
  }, [user]);

  // Context value to be provided to the components
  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    placeOrder,
    orderedProducts,
    clearCart,
    fetchOrders,
    loadingOrders,
    error,
    setError,
    deleteOrder, // Add the new deleteOrder function to the context
  }), [cart, addToCart, removeFromCart, updateQuantity, placeOrder, orderedProducts, clearCart, fetchOrders, loadingOrders, error, deleteOrder]);

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
