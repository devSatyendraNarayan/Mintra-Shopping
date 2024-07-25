// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for your web app
// Replace these values with your own Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRpbLLTw3H2TTr6MKdKq5On2_0wkGjnK0",
  authDomain: "mintra-be870.firebaseapp.com",
  projectId: "mintra-be870",
  storageBucket: "mintra-be870.appspot.com",
  messagingSenderId: "423987346686",
  appId: "1:423987346686:web:264fb48faa30d5369139af",
  measurementId: "G-1HE4JZWYPE"
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics to track user engagement
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
export const db = getFirestore(app);

// Optionally set persistence for authentication to local (uncomment if needed)
// setPersistence(auth, browserLocalPersistence);

// Export the Firebase Auth instance for use in other parts of your app
export { auth };
