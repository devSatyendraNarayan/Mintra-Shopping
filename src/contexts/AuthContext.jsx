import React, { useState, useEffect, createContext } from "react";
import { auth, db } from "../contexts/Firebase"; // Import Firebase authentication and Firestore database
import { doc, getDoc } from "firebase/firestore";

// Create a Context for authentication
export const AuthContext = createContext();

// AuthContext Provider component to wrap around parts of the app that need access to auth data
export const AuthProvider = ({ children }) => {
  // State to hold the current authenticated user
  const [user, setUser] = useState(null);
  
  // State to hold additional user data from Firestore
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Set up an observer on the Auth object to listen for changes in the user's sign-in state
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, set the user state
        setUser(firebaseUser);
        try {
          // Retrieve the user's data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            // If user data exists in Firestore, update the userData state
            setUserData(userDoc.data());
          } else {
            alert("User data not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Failed to fetch user data.");
        }
      } else {
        // User is signed out, reset user and userData state
        setUser(null);
        setUserData(null);
      }
    });

    // Cleanup function to unsubscribe from the Auth observer
    return () => unsubscribe();
  }, []);

  return (
    // Provide the user and userData states, along with setUser function, to the rest of the app
    <AuthContext.Provider value={{ user, userData, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
