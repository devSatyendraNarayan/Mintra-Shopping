import React from 'react';

// Loading component displays a spinner and a message while content is loading
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Container for the loading spinner and icon */}
      <div className="relative flex items-center justify-center">
        {/* Spinner SVG with rotation animation */}
        <svg 
          className="animate-spin h-16 w-16 text-rose-500" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true" // Accessibility: hides this element from screen readers
        >
          {/* Outer circle of the spinner with reduced opacity */}
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          {/* Path to create the spinner effect */}
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {/* Icon SVG positioned absolutely on top of the spinner */}
        <div className="absolute">
          <svg 
            className="h-8 w-8 text-rose-700" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true" // Accessibility: hides this element from screen readers
          >
            {/* Path defining the icon design */}
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 11-8 0"
            />
          </svg>
        </div>
      </div>
      {/* Text message indicating that content is being prepared */}
      <p className="mt-6 text-rose-600 font-semibold tracking-wide text-lg animate-pulse">
        Preparing your style...
      </p>
    </div>
  );
};

export default Loading;
