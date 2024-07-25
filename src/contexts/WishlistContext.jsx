import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../contexts/Firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

// Create a context for managing the wishlist
export const WishlistContext = createContext();

// Provider component to wrap the part of the app that needs access to the wishlist context
export const WishlistProvider = ({ children }) => {
  // State to store the wishlist items and the currently authenticated user
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If the user is authenticated, set the user and fetch their wishlist
        setUser(user);
        fetchWishlist(user.uid);
      } else {
        // If the user is not authenticated, clear user and wishlist state
        setUser(null);
        setWishlist([]);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Fetch the wishlist for the authenticated user from Firestore
  const fetchWishlist = async (uid) => {
    try {
      const wishlistCollection = collection(db, "users", uid, "wishlist");
      const wishlistSnapshot = await getDocs(wishlistCollection);
      const wishlistData = wishlistSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlist(wishlistData);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // Handle error appropriately, possibly with a user notification
    }
  };

  // Add a product to the authenticated user's wishlist
  const addToWishlist = async (product) => {
    if (!user) {
      // Handle case where the user is not authenticated
      return;
    }

    try {
      const productRef = doc(db, "users", user.uid, "wishlist", product.id.toString());
      await setDoc(productRef, product);
      setWishlist((prevWishlist) => [...prevWishlist, product]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // Handle error appropriately, possibly with a user notification
    }
  };

  // Remove a product from the authenticated user's wishlist
  const removeFromWishlist = async (productId) => {
    if (!user) {
      // Handle case where the user is not authenticated
      return;
    }

    try {
      const productRef = doc(db, "users", user.uid, "wishlist", productId.toString());
      await deleteDoc(productRef);
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.id !== productId)
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Handle error appropriately, possibly with a user notification
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
