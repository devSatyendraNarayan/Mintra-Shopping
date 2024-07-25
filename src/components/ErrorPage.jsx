import React from "react";

function ErrorPage() {
  // Function to handle the "Go Back" button click
  const handleGoBack = () => {
    window.history.back(); // Navigate to the previous page using browser's history
  };

  // Function to handle the "Go Home" button click
  const handleGoHome = () => {
    window.location.href = '/'; // Redirect the user to the home page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Display an error image */}
      <img
        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
        alt="Error background"
        className="h-64 w-full object-cover"
      />

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-xl px-4 py-8 text-center">
          {/* Error message heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Oops! Something Went Wrong.
          </h1>

          {/* Error description */}
          <p className="text-xl text-gray-600 mb-8">
            We apologize for the inconvenience. Let's get you back on track.
          </p>

          <div className="space-x-4">
            {/* Button to go back to the previous page */}
            <button
              onClick={handleGoBack}
              className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300"
            >
              Go Back
            </button>

            {/* Button to go to the home page */}
            <button
              onClick={handleGoHome}
              className="inline-block rounded bg-gray-200 px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 transition duration-300"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
