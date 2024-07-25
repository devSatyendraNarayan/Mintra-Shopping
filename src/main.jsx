// Importing necessary modules and components
import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Main App component for the application
import "./index.css"; // Global styles for the application
import ProductProvider from "./contexts/ProductContext"; // Context provider for managing product-related state
import { WishlistProvider } from "./contexts/WishlistContext"; // Context provider for managing wishlist state
import { CartProvider } from "./contexts/CartContext"; // Context provider for managing cart state
import ErrorBoundary from "./contexts/ErrorBoundary"; // Component for handling JavaScript errors in the component tree
import { AuthProvider } from "./contexts/AuthContext"; // Context provider for managing authentication state
import { ToastContainer } from "react-toastify"; // Component for displaying toast notifications

// Rendering the React application into the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrapping the application with various context providers */}
    <AuthProvider> {/* Provides authentication state to the component tree */}
      <ErrorBoundary> {/* Catches JavaScript errors in the component tree */}
        <ProductProvider> {/* Provides product-related state to the component tree */}
          <CartProvider> {/* Provides cart-related state to the component tree */}
            <WishlistProvider> {/* Provides wishlist-related state to the component tree */}
              <App /> {/* Main application component */}
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </ErrorBoundary>
    </AuthProvider>
    {/* ToastContainer component to display toast notifications */}
    <ToastContainer
      position="top-center" // Position of the toast notifications
      autoClose={3000} // Duration (in milliseconds) to auto close the toast
      hideProgressBar={false} // Whether to hide the progress bar
      newestOnTop={false} // Whether to place the newest toast on top
      closeOnClick // Whether the toast should close when clicked
      rtl={false} // Whether to use right-to-left text direction
      pauseOnFocusLoss // Whether to pause the toast when the window loses focus
      draggable // Whether the toast can be dragged
      pauseOnHover // Whether to pause the toast when hovered over
      theme="light" // Theme of the toast notifications
    />
  </React.StrictMode>
);
