import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";

// Lazy load components to optimize performance
const Home = lazy(() => import("./Pages/Home"));
const Footer = lazy(() => import("./components/Footer"));
const Account = lazy(() => import("./components/Account"));
const MenPage = lazy(() => import("./components/MenPage"));
const WomenPage = lazy(() => import("./components/WomenPage"));
const CartItem = lazy(() => import("./components/CartItem"));
const Wishlist = lazy(() => import("./components/Wishlist"));
const About = lazy(() => import("./Pages/About"));
const ProductDetail = lazy(() => import("./Pages/ProductDetail"));
const ErrorBoundary = lazy(() => import("./contexts/ErrorBoundary"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));
const OrderedProducts = lazy(() => import("./Pages/OrderedProducts"));

// Route configuration array
const routeConfig = [
  { path: "/", element: <Home /> },
  { path: "/account", element: <Account /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/men-category", element: <MenPage /> },
  { path: "/women-category", element: <WomenPage /> },
  { path: "/about-us", element: <About /> },
  { path: "/wishlist", element: <Wishlist /> },
  { path: "/bag", element: <CartItem /> },
  { path: "/error", element: <ErrorPage /> },
  { path: "/orderedProducts", element: <OrderedProducts /> },
];

const App = () => {
  // Memoized routes to avoid unnecessary re-renders
  const routes = useMemo(
    () => [
      ...routeConfig.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      )),
      // Fallback route for unmatched paths
      <Route key="not-found" path="*" element={<Navigate to="/error" replace />} />
    ],
    []
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Error boundary to catch and handle errors in child components */}
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <main className="flex-grow">
              {/* Define routes using the Routes component */}
              <Routes>{routes}</Routes>
            </main>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Router>
  );
};

export default App;
